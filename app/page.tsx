import Link from "next/link";
import { IconeBusca, IconeSeta } from "@/components/icones";
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
 * A pergunta que a pessoa chega fazendo é "quem posso votar?", e a
 * resposta — a busca e a lista por cargo — está acima da dobra.
 *
 * A busca é um GET comum para /candidatos: funciona sem JavaScript.
 *
 * SOBRE O MOVIMENTO. A abertura anima; a lista de candidaturas, não.
 * A regra não é estética, é de produto: animação é destaque, e
 * destacar uma candidatura e não outra é exatamente o que este site
 * não faz. Então o movimento fica onde não há nome de ninguém — o
 * cabeçalho da página e os números agregados.
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

  return (
    <div>
      {/* ================= Abertura + busca ================= */}
      <section className="relative overflow-hidden border-b border-tinta-200 bg-papel-alta">
        <DotPattern
          width={26}
          height={26}
          cr={1.1}
          className="text-acento/25 [mask-image:radial-gradient(520px_circle_at_75%_10%,white,transparent)]"
        />

        <div className="envelope relative py-10 sm:py-16">
          <BlurFade delay={0}>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-acento">
              {ESTADO.nome} · Eleição {ELEICAO.ano}
            </p>
          </BlurFade>

          <BlurFade delay={0.08}>
            <h1 className="mt-3 max-w-[18ch]">
              Quem está na disputa no {ESTADO.nome}
            </h1>
          </BlurFade>

          <BlurFade delay={0.16}>
            <p className="mt-5 max-w-leitura text-lg text-tinta-700">
              As {candidaturas.length} candidaturas de {ELEICAO.ano}, com dados
              oficiais do Tribunal Superior Eleitoral. Sem ranking, sem nota e
              sem recomendação — a ordem das listas é sorteada.
            </p>
          </BlurFade>

          <BlurFade delay={0.24}>
            <form
              action="/candidatos"
              method="get"
              role="search"
              className="painel mt-8 max-w-2xl p-5 sm:p-6"
            >
              <label
                htmlFor="busca-inicial"
                className="block text-lg font-bold text-tinta-950"
              >
                Buscar por nome ou número de urna
              </label>
              <p id="ajuda-busca-inicial" className="mt-1 text-tinta-600">
                Pode escrever sem acento e sem maiúscula. Digitar só o começo
                do número também funciona.
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
              className="cartao h-full p-5"
            >
              <p className="font-display text-4xl font-bold tabular-nums text-acento">
                <NumberTicker value={numero.valor} delay={0.2 + 0.05 * i} />
              </p>
              <p className="mt-1 font-semibold text-tinta-900">
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
                <IconeSeta className="h-5 w-5 shrink-0 text-acento transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
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
          {[
            {
              titulo: "A ordem é sorteada todo dia",
              texto:
                "Ninguém aparece primeiro por ser mais conhecido ou de um partido maior. A ordem é a mesma para todo mundo no mesmo dia.",
            },
            {
              titulo: "Não damos nota a ninguém",
              texto:
                "Sem ranking, sem pontuação, sem recomendação de voto. Mostramos os dados e a escolha é sua.",
            },
            {
              titulo: "Tudo vem de fonte oficial",
              texto:
                "Cada informação traz de onde veio e quando foi coletada, com link para o documento de origem.",
            },
            {
              titulo: "Quando falta dado, dizemos",
              texto:
                "Espaço em branco sem explicação parece culpa de quem se candidatou. Quando a fonte não tem, a tela avisa.",
            },
          ].map((item, i) => (
            <BlurFade
              key={item.titulo}
              como="li"
              inView
              delay={0.05 * i}
              className="h-full rounded-lg border border-tinta-200 bg-papel-alta p-5"
            >
              <h3 className="text-tinta-950">{item.titulo}</h3>
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
