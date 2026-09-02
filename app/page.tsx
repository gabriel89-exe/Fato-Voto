import Link from "next/link";
import {
  IconeBusca,
  IconeDocumentoOficial,
  IconeIgualdade,
  IconeInfo,
  IconeMarca,
  IconeSeta,
  IconeSorteio,
} from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Input } from "@/components/ui/input";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  candidaturas,
  COLETADO_EM,
  contarPorCargo,
  ELEICAO,
  ESTADO,
} from "@/lib/eleicao";
import { dataPorExtenso } from "@/lib/formato";
import { CARGOS } from "@/types";

/**
 * Página inicial.
 *
 * A ABERTURA É A PERGUNTA, desde 02/09/2026: "Você conhece a política
 * do Brasil?" subiu de convite no meio da página para primeiro item,
 * por decisão de produto — quem chega sem saber o que faz um deputado
 * encontra a porta antes de qualquer tabela. A busca vem logo abaixo,
 * dentro da mesma dobra: quem chegou procurando um nome não rola nada
 * para achá-la.
 *
 * A busca é um GET comum para /candidatos: funciona sem JavaScript.
 *
 * SOBRE O MOVIMENTO. A abertura anima; a lista de candidaturas, não.
 * A regra não é estética, é de produto: animação é destaque, e
 * destacar uma candidatura e não outra é exatamente o que este site
 * não faz. Então o movimento fica onde não há nome de ninguém — o
 * cabeçalho da página, a marca e os números agregados.
 *
 * Toda animação daqui cai sozinha sob `prefers-reduced-motion`, e o
 * `<noscript>` do layout garante que sem JavaScript o conteúdo apareça
 * parado em vez de invisível.
 */
export default function PaginaInicial() {
  const porCargo = contarPorCargo();
  const totalDe = (cargo: string) =>
    porCargo.find((c) => c.cargo === cargo)?.total ?? 0;

  const emJulgamento = candidaturas.filter((c) => !c.apto).length;

  /* Nenhum número absoluto sem denominador — docs/principios.md,
     regra 5. "238" sozinho não diz nada; "238 de 575" diz. */
  const numeros = [
    {
      valor: candidaturas.length,
      titulo: "candidaturas registradas",
      detalhe: `no ${ESTADO.nome}, para a eleição de ${ELEICAO.ano}`,
    },
    {
      valor: CARGOS.length,
      titulo: "cargos em disputa",
      detalhe: "de deputado estadual a governador",
    },
    {
      valor: emJulgamento,
      titulo: `das ${candidaturas.length} ainda em julgamento`,
      detalhe: "a Justiça Eleitoral ainda não decidiu sobre o registro",
    },
  ];

  const comoFunciona = [
    {
      titulo: "A ordem é sorteada todo dia",
      texto:
        "Ninguém aparece primeiro por ser mais conhecido ou de um partido maior. A ordem é a mesma para todo mundo no mesmo dia.",
      Icone: IconeSorteio,
    },
    {
      titulo: "Não damos nota a ninguém",
      texto:
        "Sem ranking, sem pontuação, sem recomendação de voto. Mostramos os dados e a escolha é sua.",
      Icone: IconeIgualdade,
    },
    {
      titulo: "Tudo vem de fonte oficial",
      texto:
        "Cada informação traz de onde veio e quando foi coletada, com link para o documento de origem.",
      Icone: IconeDocumentoOficial,
    },
    {
      titulo: "Quando falta dado, dizemos",
      texto:
        "Espaço em branco sem explicação parece culpa de quem se candidatou. Quando a fonte não tem, a tela avisa.",
      Icone: IconeInfo,
    },
  ];

  return (
    <div>
      {/* ================= Abertura: a pergunta ================= */}
      <section className="relative overflow-hidden border-b border-tinta-200 bg-papel-alta">
        <DotPattern
          width={26}
          height={26}
          cr={1.1}
          className="text-acento/20 [mask-image:radial-gradient(520px_circle_at_78%_8%,white,transparent)]"
        />

        {/* A marca em escala de parede, quase invisível: é o único
            ornamento do hero, e diz do que o site é feito — o fato
            conferido e a urna. Some no celular para não disputar
            espaço com o texto. */}
        <BlurFade
          delay={0.3}
          className="pointer-events-none absolute -right-20 top-1/2 hidden -translate-y-1/2 lg:block"
        >
          <IconeMarca className="h-[26rem] w-[26rem] opacity-[0.06]" />
        </BlurFade>

        <div className="envelope relative py-10 sm:py-16">
          <BlurFade delay={0}>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-tinta-600">
              {ESTADO.nome} · Eleição {ELEICAO.ano}
            </p>
          </BlurFade>

          <BlurFade delay={0.08}>
            <h1 className="mt-3 max-w-[20ch]">
              Você conhece a política do Brasil?
            </h1>
          </BlurFade>

          <BlurFade delay={0.16}>
            <p className="mt-5 max-w-leitura text-lg text-tinta-700">
              Este site mostra em que cada candidatura votou, quanto gastou e o
              que propôs — com dados oficiais, sem ranking e sem recomendação.
              Se os termos não forem familiares, comece pelo guia: o que faz um
              deputado, o que é uma PEC e de onde vem o dinheiro do mandato, em
              linguagem simples e com as fontes ao lado.
            </p>
          </BlurFade>

          <BlurFade delay={0.24}>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/como-funciona">
                  Entender como funciona
                  <IconeSeta />
                </Link>
              </Button>
              <Link href="/candidatos" className="alvo-toque font-medium">
                Ir direto às candidaturas
              </Link>
            </div>
          </BlurFade>

          {/* A busca continua na primeira dobra: quem chegou com um
              nome na cabeça não deve rolar para procurá-lo. */}
          <BlurFade delay={0.32}>
            <form
              action="/candidatos"
              method="get"
              role="search"
              className="painel mt-10 max-w-2xl p-5 sm:p-6"
            >
              <label
                htmlFor="busca-inicial"
                className="block text-lg font-bold text-tinta-950"
              >
                Quem está na disputa no {ESTADO.nome}?
              </label>
              <p id="ajuda-busca-inicial" className="mt-1 text-tinta-600">
                Busque pelo nome ou pelo número de urna, sem acento e sem
                maiúscula. Digitar só o começo do número também funciona.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta-500">
                    <IconeBusca />
                  </span>
                  <Input
                    id="busca-inicial"
                    name="busca"
                    type="search"
                    autoComplete="off"
                    enterKeyHint="search"
                    aria-describedby="ajuda-busca-inicial"
                    placeholder="Exemplo: Maria, ou 45"
                    className="pl-11 text-lg"
                  />
                </div>
                <Button type="submit" size="lg">
                  <IconeBusca />
                  Buscar
                </Button>
              </div>
            </form>
          </BlurFade>
        </div>
      </section>

      {/* ================= Números da eleição =================
          Agregados, nunca por candidatura: contar o conjunto não
          destaca ninguém. */}
      <section className="envelope pt-10 sm:pt-14">
        <h2 className="apenas-leitor">A eleição em números</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {numeros.map((numero, i) => (
            <BlurFade
              key={numero.titulo}
              como="li"
              inView
              delay={0.05 * i}
              className="cartao relative h-full overflow-hidden p-5 pt-6 shadow-cartao"
            >
              {/* Filete de tinta no topo: o mesmo em todos os cartões —
                  assinatura, não destaque. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-tinta-950 via-tinta-500 to-tinta-200"
              />
              <p className="font-display text-5xl font-bold tabular-nums text-tinta-950">
                <NumberTicker value={numero.valor} delay={0.2 + 0.05 * i} />
              </p>
              <p className="mt-2 font-semibold text-tinta-900">
                {numero.titulo}
              </p>
              <p className="mt-1 text-sm text-tinta-600">{numero.detalhe}</p>
            </BlurFade>
          ))}
        </ul>
      </section>

      {/* ================= Cargos ================= */}
      <section className="envelope mt-12 sm:mt-16">
        <h2>Ver por cargo</h2>
        <p className="mt-2 max-w-leitura text-tinta-700">
          Cada cargo tem funções diferentes. A ficha de cada candidatura mostra
          o que aquele cargo de fato faz.
        </p>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CARGOS.map((cargo, i) => (
            <BlurFade key={cargo} como="li" inView delay={0.04 * i}>
              <Link
                href={`/candidatos?cargo=${encodeURIComponent(cargo)}`}
                className="group flex h-full items-center justify-between gap-4 rounded-lg border border-tinta-200 bg-papel-alta p-5 no-underline shadow-cartao transition-all hover:-translate-y-0.5 hover:border-acento-borda hover:shadow-elevado motion-reduce:hover:translate-y-0"
              >
                <span className="flex min-w-0 flex-col">
                  <span className="text-lg font-bold text-tinta-950">
                    {cargo}
                  </span>
                  <span className="text-tinta-600">
                    {totalDe(cargo)} candidaturas
                  </span>
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-tinta-200 bg-papel transition-colors group-hover:border-tinta-950 group-hover:bg-tinta-950">
                  <IconeSeta className="h-4 w-4 text-tinta-700 transition-all group-hover:translate-x-0.5 group-hover:text-white motion-reduce:group-hover:translate-x-0" />
                </span>
              </Link>
            </BlurFade>
          ))}
        </ul>
      </section>

      {/* ================= Aviso de julgamento ================= */}
      <section className="envelope mt-12 sm:mt-16">
        <Alert>
          <AlertTitle>O registro ainda está sendo julgado</AlertTitle>
          <AlertDescription>
            {emJulgamento} das {candidaturas.length} candidaturas ainda não
            tiveram o registro julgado pela Justiça Eleitoral, e uma parte delas
            pode não chegar à urna. Os dados desta página foram coletados em{" "}
            {dataPorExtenso(COLETADO_EM)}.
          </AlertDescription>
        </Alert>
      </section>

      {/* ================= Como funciona ================= */}
      <section className="envelope mt-12 sm:mt-16">
        <h2>Como este site funciona</h2>

        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {comoFunciona.map((item, i) => (
            <BlurFade
              key={item.titulo}
              como="li"
              inView
              delay={0.05 * i}
              className="h-full rounded-lg border border-tinta-200 bg-papel-alta p-5 shadow-cartao"
            >
              <span
                aria-hidden="true"
                className="grid h-11 w-11 place-items-center rounded-lg bg-tinta-950 text-white"
              >
                <item.Icone className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-tinta-950">{item.titulo}</h3>
              <p className="mt-1.5 text-tinta-700">{item.texto}</p>
            </BlurFade>
          ))}
        </ul>

        {/* Links de navegação, não links dentro de frase: a exceção da
            WCAG 2.5.8 para link em linha corrida não vale aqui, então
            eles carregam o alvo de 48px como qualquer outro botão. */}
        <p className="mt-6 flex flex-wrap gap-x-6">
          <Link href="/metodologia" className="alvo-toque">
            Como tratamos os dados
          </Link>
          <Link href="/fontes" className="alvo-toque">
            De onde vêm os dados
          </Link>
        </p>
      </section>

      <div className="mt-14 sm:mt-20" />
    </div>
  );
}
