import { mesAno, percentual, reais } from "@/lib/formato";

/**
 * Graficos em SVG, desenhados a mao. Sem biblioteca.
 *
 * Duas razoes: a paleta `grafico.1..5` e monocromatica de proposito, e
 * nenhuma biblioteca respeita isso sem briga; e um grafico de composicao
 * mais um de evolucao nao justificam 100 kB no pacote de um site que
 * precisa abrir rapido em celular ruim.
 *
 * REGRA DE PRODUTO: estes graficos descrevem a composicao DENTRO de uma
 * ficha. Nao servem para comparar candidaturas entre si, e nenhuma fatia
 * pode ser pintada de "boa" ou "ruim". Ver docs/principios.md, regra 4.
 *
 * ACESSIBILIDADE: o desenho e `aria-hidden` e existe uma tabela real
 * embaixo, com os mesmos numeros. Quem usa leitor de tela recebe o dado,
 * nao um "elemento gráfico".
 */

/** Escala monocromática de tinta clara para escura. */
const CORES = ["#1d3f5c", "#3f6b8f", "#7899b3", "#a9bccc", "#d3dde5"];

/* ------------------------------------------------------------------ */
/*  Composição — rosca                                                 */
/* ------------------------------------------------------------------ */

function arco(
  cx: number,
  cy: number,
  raio: number,
  inicio: number,
  fim: number,
) {
  const p = (angulo: number) => [
    cx + raio * Math.cos(angulo - Math.PI / 2),
    cy + raio * Math.sin(angulo - Math.PI / 2),
  ];
  const [x1, y1] = p(inicio);
  const [x2, y2] = p(fim);
  const maior = fim - inicio > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${raio} ${raio} 0 ${maior} 1 ${x2} ${y2}`;
}

export function GraficoComposicao({
  itens,
  legenda,
}: {
  itens: { rotulo: string; valor: number }[];
  legenda: string;
}) {
  const total = itens.reduce((s, i) => s + i.valor, 0);
  if (total <= 0) return null;

  /* Mais de cinco fatias vira ilegível: da sexta em diante tudo vai para
     "Outras", e o detalhe continua na tabela abaixo. */
  const principais = itens.slice(0, 5);
  const resto = itens.slice(5);
  const fatias =
    resto.length > 0
      ? [
          ...principais,
          {
            rotulo: `Outras ${resto.length} categorias`,
            valor: resto.reduce((s, i) => s + i.valor, 0),
          },
        ]
      : principais;

  let angulo = 0;
  const desenhadas = fatias.map((f, i) => {
    const inicio = angulo;
    const fim = angulo + (f.valor / total) * Math.PI * 2;
    angulo = fim;
    return { ...f, inicio, fim, cor: CORES[i % CORES.length] };
  });

  return (
    <figure className="m-0">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <svg
          viewBox="0 0 120 120"
          aria-hidden="true"
          className="h-40 w-40 shrink-0"
        >
          {desenhadas.map((f) => (
            <path
              key={f.rotulo}
              d={arco(60, 60, 46, f.inicio, f.fim)}
              fill="none"
              stroke={f.cor}
              strokeWidth="22"
            />
          ))}
          {/* Filete escuro no miolo, para a rosca ter a mesma linguagem
              de moldura do resto do site. */}
          <circle
            cx="60"
            cy="60"
            r="35"
            fill="none"
            stroke="#1b1a16"
            strokeWidth="1.5"
          />
        </svg>

        <ul className="min-w-0 flex-1 space-y-2">
          {desenhadas.map((f) => (
            <li key={f.rotulo} className="flex items-start gap-2.5 text-sm">
              <span
                aria-hidden="true"
                className="mt-1 h-3 w-3 shrink-0 border border-tinta-900"
                style={{ backgroundColor: f.cor }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-tinta-800">{f.rotulo}</span>
                <span className="font-mono text-xs tabular-nums text-tinta-600">
                  {reais(f.valor)} · {percentual(f.valor, total)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="apenas-leitor">{legenda}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Evolução — linha                                                   */
/* ------------------------------------------------------------------ */

export function GraficoEvolucao({
  pontos,
  legenda,
}: {
  pontos: { competencia: string; valor: number }[];
  legenda: string;
}) {
  if (pontos.length < 2) return null;

  const largura = 620;
  const altura = 170;
  const margem = { topo: 12, base: 26, esq: 8, dir: 8 };
  const maior = Math.max(...pontos.map((p) => p.valor));

  const x = (i: number) =>
    margem.esq +
    (i / (pontos.length - 1)) * (largura - margem.esq - margem.dir);
  const y = (v: number) =>
    margem.topo + (1 - v / maior) * (altura - margem.topo - margem.base);

  const linha = pontos.map((p, i) => `${x(i)},${y(p.valor)}`).join(" ");
  const area = `${margem.esq},${altura - margem.base} ${linha} ${largura - margem.dir},${altura - margem.base}`;

  const primeiro = pontos[0];
  const ultimo = pontos[pontos.length - 1];

  return (
    <figure className="m-0">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${largura} ${altura}`}
          aria-hidden="true"
          className="h-44 w-full min-w-[320px]"
        >
          <polygon points={area} fill="#1d3f5c" opacity="0.12" />
          <polyline
            points={linha}
            fill="none"
            stroke="#1d3f5c"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line
            x1={margem.esq}
            y1={altura - margem.base}
            x2={largura - margem.dir}
            y2={altura - margem.base}
            stroke="#1b1a16"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <p className="mt-1 flex justify-between font-mono text-[0.62rem] uppercase tracking-[0.13em] text-tinta-500">
        <span>{mesAno(`${primeiro.competencia}-01`)}</span>
        <span>pico: {reais(maior)}/mês</span>
        <span>{mesAno(`${ultimo.competencia}-01`)}</span>
      </p>
      <figcaption className="apenas-leitor">{legenda}</figcaption>
    </figure>
  );
}
