import { createHash } from "node:crypto";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * Base da camada de coleta.
 *
 * Regra que governa este arquivo inteiro: NADA e exibido no site sem
 * que exista, em disco, o documento cru de onde o numero saiu, com a
 * data em que foi baixado e o hash do conteudo. Se um candidato
 * contestar um dado, a resposta tem de ser "este e o arquivo, desta
 * hora, com esta impressao digital" — nao "o portal dizia isso".
 *
 * Por isso a coleta grava sempre em duas camadas:
 *
 *   dados-brutos/  resposta original, intacta, + manifesto de hashes.
 *                  Fora do git (e grande e reproduzivel).
 *   data/es/       o normalizado que o site le. Pequeno e versionado.
 */

export const RAIZ_BRUTA = "dados-brutos";
export const RAIZ_NORMALIZADA = join("data", "es");

/** O portal do TSE recusa cliente sem cara de navegador. */
const AGENTE =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/127.0 Safari/537.36";

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * GET com repeticao. Os portais publicos oscilam: 502 e 504 em horario
 * de pico sao normais e passam sozinhos. Falhar na primeira tentativa
 * abortaria uma coleta de meia hora por causa de um soluco de rede.
 *
 * Repetir so vale para falha passageira. Resposta 4xx e deterministica
 * — o servidor entendeu o pedido e recusou —, entao insistir quatro
 * vezes num 400 so multiplica por quatro a carga sobre um servico
 * publico para receber quatro vezes a mesma recusa.
 *
 * `aceitar404` devolve `null` em vez de lancar, para o caso em que a
 * ausencia do recurso e informacao e nao falha: na Camara ha votacao
 * cujo `/votos` responde 404, e abortar a coleta inteira por causa
 * dela seria perder todas as outras por causa de uma.
 */
export async function buscarJson(
  url,
  { tentativas = 4, pausaMs = 800, aceitar404 = false } = {},
) {
  let ultimoErro;
  for (let i = 1; i <= tentativas; i++) {
    try {
      const resposta = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": AGENTE },
      });

      if (aceitar404 && resposta.status === 404) return null;

      if (!resposta.ok) {
        const erro = new Error(`HTTP ${resposta.status} em ${url}`);
        erro.status = resposta.status;
        throw erro;
      }

      const texto = await resposta.text();
      return { texto, dados: JSON.parse(texto) };
    } catch (erro) {
      ultimoErro = erro;
      if (erro.status >= 400 && erro.status < 500) throw erro;
      if (i < tentativas) await espera(pausaMs * i);
    }
  }
  throw ultimoErro;
}

/**
 * Percorre uma colecao paginada da API da Camara.
 *
 * ARMADILHA DOCUMENTADA: em /deputados/{id}/despesas o filtro `ano=`
 * devolve lista vazia; o que funciona e `idLegislatura=`. Descoberto na
 * marra em 27/08/2026 — se alguem "consertar" isso trocando de volta
 * para `ano`, a coleta silenciosamente para de trazer despesa.
 */
export async function paginar(urlBase, { limitePaginas = 200 } = {}) {
  const tudo = [];
  let pagina = 1;
  while (pagina <= limitePaginas) {
    const separador = urlBase.includes("?") ? "&" : "?";
    const { dados } = await buscarJson(
      `${urlBase}${separador}pagina=${pagina}&itens=100`,
    );
    const lote = dados.dados ?? [];
    tudo.push(...lote);
    if (lote.length < 100) break;
    pagina++;
  }
  return tudo;
}

export function hash(conteudo) {
  return createHash("sha256").update(conteudo).digest("hex");
}

async function gravar(caminho, conteudo) {
  await mkdir(dirname(caminho), { recursive: true });
  await writeFile(caminho, conteudo, "utf8");
}

/**
 * Guarda a resposta crua e devolve a proveniencia — o objeto que
 * acompanha o dado ate a tela.
 */
export async function guardarBruto(nomeRelativo, conteudo, urlOriginal) {
  const caminho = join(RAIZ_BRUTA, nomeRelativo);
  await gravar(caminho, conteudo);
  return {
    arquivo: nomeRelativo,
    urlOriginal,
    coletadoEm: new Date().toISOString(),
    hash: hash(conteudo),
    bytes: Buffer.byteLength(conteudo, "utf8"),
  };
}

export async function gravarNormalizado(nomeArquivo, dados) {
  await gravar(
    join(RAIZ_NORMALIZADA, nomeArquivo),
    JSON.stringify(dados, null, 2) + "\n",
  );
}

/**
 * Manifesto: a lista do que foi coletado, de onde e quando. E o que
 * alimenta a pagina publica de inventario de fontes.
 */
export async function atualizarManifesto(fonte, entradas) {
  const caminho = join(RAIZ_BRUTA, "manifesto.json");
  let manifesto = {};
  try {
    manifesto = JSON.parse(await readFile(caminho, "utf8"));
  } catch {
    // primeira coleta: manifesto ainda nao existe
  }
  manifesto[fonte] = {
    atualizadoEm: new Date().toISOString(),
    arquivos: entradas,
  };
  await gravar(caminho, JSON.stringify(manifesto, null, 2) + "\n");
  return manifesto;
}

export function reais(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor);
}
