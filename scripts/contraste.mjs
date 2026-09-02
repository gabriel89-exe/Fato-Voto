/**
 * Confere contraste WCAG da paleta.
 *
 * Existe porque a paleta é escolhida à mão e "parece escuro o bastante"
 * não é critério: um cinza que passa no monitor do escritório reprova
 * no celular de quem lê no ônibus. Rode depois de mexer em cor.
 *
 *   node scripts/contraste.mjs
 */

const BRANCO = "#ffffff";
const PAPEL = "#f7f5f1";

const canal = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminancia = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return (
    0.2126 * canal((n >> 16) & 255) +
    0.7152 * canal((n >> 8) & 255) +
    0.0722 * canal(n & 255)
  );
};

const razao = (a, b) => {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/* Par a conferir: [descrição, frente, fundo, mínimo exigido].
   4.5 = texto normal AA. 3.0 = texto grande e borda de componente. */
const PARES = [
  ["tinta-950 sobre branco", "#191713", BRANCO, 4.5],
  ["tinta-900 sobre branco", "#26231e", BRANCO, 4.5],
  ["tinta-800 sobre branco", "#383430", BRANCO, 4.5],
  ["tinta-700 sobre branco", "#4b463f", BRANCO, 4.5],
  ["tinta-600 sobre branco", "#5f5951", BRANCO, 4.5],
  ["tinta-500 sobre branco", "#6d675e", BRANCO, 4.5],
  ["tinta-400 sobre branco", "#726c61", BRANCO, 4.5],
  ["tinta-600 sobre papel", "#5f5951", PAPEL, 4.5],
  ["tinta-500 sobre papel", "#6d675e", PAPEL, 4.5],
  ["tinta-400 sobre papel", "#726c61", PAPEL, 4.5],
  /* tinta-300 é a borda de campo de formulário (--input). Contorno de
     controle é elemento não-textual: o mínimo da WCAG 1.4.11 é 3:1. */
  ["tinta-300 borda de campo", "#918b7d", BRANCO, 3.0],
  ["tinta-300 borda de campo sobre papel", "#918b7d", PAPEL, 3.0],
  /* tinta-200 é filete decorativo entre blocos, não delimita controle.
     Sem mínimo — o número está aqui só para não cair sem ninguém ver. */
  ["tinta-200 filete decorativo", "#cfc9bd", BRANCO, 1.0],
  /* Acento em tinta pura desde 02/09/2026 — ver tailwind.config.ts. */
  ["acento sobre branco", "#26231e", BRANCO, 4.5],
  ["acento sobre papel", "#26231e", PAPEL, 4.5],
  ["acento sobre acento-leve", "#26231e", "#edeae3", 4.5],
  ["acento-forte sobre branco", "#191713", BRANCO, 4.5],
  ["branco sobre acento", BRANCO, "#26231e", 4.5],
  ["branco sobre acento-escuro (tarja)", BRANCO, "#191713", 4.5],
  ["oficial-texto sobre oficial-fundo", "#26231e", "#f1efeb", 4.5],
  ["resumo-texto sobre resumo-fundo", "#5e3c1a", "#faf3ea", 4.5],
  ["grafico-4 sobre branco (só área)", "#898275", BRANCO, 3.0],
];

let reprovou = false;

for (const [nome, frente, fundo, minimo] of PARES) {
  const r = razao(frente, fundo);
  const passou = r >= minimo;
  if (!passou) reprovou = true;
  console.log(
    `${passou ? "ok  " : "FALHA"} ${r.toFixed(2).padStart(6)}:1  (min ${minimo})  ${nome}`,
  );
}

process.exit(reprovou ? 1 : 0);
