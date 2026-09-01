/**
 * Verificações de segurança.
 *
 * Roda no CI (workflow "Verificação") e na mão com `npm run verificar`.
 * Três checagens independentes; qualquer falha derruba o processo.
 *
 *  1. NOME DE VARIÁVEL PÚBLICA PERIGOSO
 *     Variável cujo nome começa com NEXT_PUBLIC_ é embutida no JavaScript
 *     que vai para o navegador. Se o nome também tem TOKEN/SECRET/KEY/
 *     SENHA, quase certamente é um segredo prestes a vazar sem nada
 *     quebrar. Ver docs/segredos-e-credenciais.md.
 *
 *  2. SEGREDO DENTRO DE .next/
 *     Se TRANSPARENCIA_TOKEN (ou outra variável da lista) estiver no
 *     ambiente, procura o VALOR dela dentro do pacote gerado. Achou = o
 *     segredo foi para o que se serve ao público.
 *
 *  3. CABEÇALHOS DE SEGURANÇA NA RESPOSTA REAL
 *     Sobe `next start`, pede algumas rotas e confere que a resposta traz
 *     Content-Security-Policy, HSTS, X-Content-Type-Options e companhia.
 *     A conferência era manual (ANDAMENTO.md); aqui virou teste.
 *
 * As checagens 2 e 3 precisam de `npm run build` antes. Sem a pasta
 * .next/, elas avisam e são puladas — a checagem 1 roda sempre.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

let erros = 0;
const falha = (msg) => {
  erros += 1;
  console.error("  ✗ " + msg);
};
const ok = (msg) => console.log("  ✓ " + msg);

/* ------------------------------------------------------------------ */
/*  1. Nome de variável pública perigoso                              */
/* ------------------------------------------------------------------ */

const IGNORAR_DIR = new Set([
  "node_modules",
  ".next",
  ".git",
  "dados-brutos",
  "out",
]);
// Só arquivo que vira código ou configuração de build. `.md` fica de fora
// de propósito: docs/segredos-e-credenciais.md cita o nome errado COMO
// exemplo do que não fazer, e não é isso que se quer barrar.
const EXT_TEXTO = /\.(ts|tsx|js|jsx|mjs|cjs|yml|yaml|json)$/;
const NOME_PERIGOSO =
  /NEXT_PUBLIC_[A-Z0-9_]*(TOKEN|SECRET|KEY|SENHA|PASSWORD|PASS|PWD)/;

async function listarTexto(dir) {
  const saida = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (IGNORAR_DIR.has(ent.name)) continue;
      saida.push(...(await listarTexto(join(dir, ent.name))));
    } else if (EXT_TEXTO.test(ent.name)) {
      saida.push(join(dir, ent.name));
    }
  }
  return saida;
}

async function checarNomesPublicos() {
  console.log("\n[1] Nome NEXT_PUBLIC_ com cara de segredo");
  const antes = erros;
  for (const arquivo of await listarTexto(".")) {
    const linhas = (await readFile(arquivo, "utf8")).split("\n");
    linhas.forEach((linha, i) => {
      if (NOME_PERIGOSO.test(linha)) {
        falha(`${arquivo}:${i + 1}  ${linha.trim()}`);
      }
    });
  }
  if (erros === antes) ok("nenhum");
}

/* ------------------------------------------------------------------ */
/*  2. Segredo dentro de .next/                                       */
/* ------------------------------------------------------------------ */

/** Variáveis cujo valor NUNCA pode aparecer no pacote servido. */
const SEGREDOS = ["TRANSPARENCIA_TOKEN"];

async function listarTudo(dir) {
  const saida = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const caminho = join(dir, ent.name);
    if (ent.isDirectory()) saida.push(...(await listarTudo(caminho)));
    else saida.push(caminho);
  }
  return saida;
}

async function checarBundle() {
  console.log("\n[2] Segredo dentro de .next/");
  if (!existsSync(".next")) {
    console.log("  – .next/ ausente (rode `npm run build`). Pulando.");
    return;
  }
  const valores = SEGREDOS.map((n) => process.env[n]).filter(
    (v) => typeof v === "string" && v.length >= 8,
  );
  if (valores.length === 0) {
    ok("nenhum segredo no ambiente para procurar");
    return;
  }
  const antes = erros;
  for (const arquivo of await listarTudo(".next")) {
    const conteudo = await readFile(arquivo);
    for (const valor of valores) {
      if (conteudo.includes(valor)) falha(`valor de segredo em ${arquivo}`);
    }
  }
  if (erros === antes) ok("nenhum valor de segredo no pacote");
}

/* ------------------------------------------------------------------ */
/*  3. Cabeçalhos de segurança na resposta real                      */
/* ------------------------------------------------------------------ */

const ESPERADOS = {
  "content-security-policy": /default-src 'self'/,
  "x-content-type-options": /nosniff/,
  "referrer-policy": /strict-origin-when-cross-origin/,
  "permissions-policy": /camera=\(\)/,
  "strict-transport-security": /max-age=\d+/,
  "x-frame-options": /DENY/,
};
const ROTAS = ["/", "/candidatos", "/metodologia"];
const PORTA = 4123;

async function checarCabecalhos() {
  console.log("\n[3] Cabeçalhos de segurança na resposta real");
  if (!existsSync(".next")) {
    console.log("  – .next/ ausente (rode `npm run build`). Pulando.");
    return;
  }

  const servidor = spawn(
    process.execPath,
    ["./node_modules/next/dist/bin/next", "start", "-p", String(PORTA)],
    { stdio: "ignore", env: { ...process.env, NODE_ENV: "production" } },
  );

  try {
    const base = `http://localhost:${PORTA}`;
    let subiu = false;
    for (let i = 0; i < 40 && !subiu; i += 1) {
      try {
        const r = await fetch(base, { method: "HEAD" });
        if (r.status) subiu = true;
      } catch {
        /* ainda subindo */
      }
      if (!subiu) await new Promise((r) => setTimeout(r, 500));
    }
    if (!subiu) {
      falha("next start não respondeu em 20s");
      return;
    }

    const antes = erros;
    for (const rota of ROTAS) {
      const r = await fetch(base + rota);
      for (const [nome, padrao] of Object.entries(ESPERADOS)) {
        const valor = r.headers.get(nome);
        if (!valor) falha(`${rota}: falta ${nome}`);
        else if (!padrao.test(valor)) falha(`${rota}: ${nome} inesperado (${valor})`);
      }
    }
    if (erros === antes) ok(`as ${ROTAS.length} rotas trazem os 6 cabeçalhos`);
  } finally {
    servidor.kill("SIGKILL");
  }
}

/* ------------------------------------------------------------------ */

console.log("Verificações de segurança");
await checarNomesPublicos();
await checarBundle();
await checarCabecalhos();

console.log("");
if (erros > 0) {
  console.error(`REPROVOU — ${erros} problema(s).`);
  process.exit(1);
}
console.log("Tudo certo.");
