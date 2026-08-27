import Link from "next/link";
import { IconeBusca, IconeSeta } from "@/components/icones";
import { candidatos, ESTADO } from "@/lib/dados";

/**
 * Home.
 *
 * O elemento principal e o campo de busca. O formulario e um GET comum
 * para /candidatos, entao a busca funciona mesmo sem JavaScript.
 */
export default function PaginaInicial() {
  const totalGovernador = candidatos.filter(
    (c) => c.cargo === "Governador",
  ).length;
  const totalSenador = candidatos.filter((c) => c.cargo === "Senador").length;

  const cargos = [
    {
      cargo: "Governador",
      total: totalGovernador,
      href: "/candidatos?cargo=Governador",
    },
    { cargo: "Senador", total: totalSenador, href: "/candidatos?cargo=Senador" },
  ];

  const panorama = [
    { rotulo: "Candidaturas", valor: candidatos.length },
    { rotulo: "A Governador", valor: totalGovernador },
    { rotulo: "Ao Senado", valor: totalSenador },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Atmosfera do hero — decorativa, atras do conteudo, sem cor de valor. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] grade-fundo"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-8 -z-10 h-72 w-72 rounded-full bg-oficial-leve/50 blur-3xl motion-safe:animate-flutuar"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-44 -z-10 h-64 w-64 rounded-full bg-resumo-leve/40 blur-3xl"
      />

      <div className="envelope py-10 sm:py-16">
        <div className="entrada mx-auto max-w-2xl">
          <span className="chip">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-tinta-500"
            />
            {ESTADO.nome} ({ESTADO.sigla}) · {ESTADO.anoEleicao}
          </span>

          <h1 className="mt-4">Consulte os dados de quem está na disputa</h1>

          <p className="mt-4 text-lg text-tinta-700">
            Este site reúne, em linguagem simples, os dados públicos das
            candidaturas ao governo e ao senado de {ESTADO.nome} ({ESTADO.sigla})
            em {ESTADO.anoEleicao}.
          </p>

          <form
            action="/candidatos"
            method="get"
            role="search"
            className="painel-vidro mt-8 p-4 sm:p-5"
          >
            <label
              htmlFor="busca-inicial"
              className="block text-base font-semibold text-tinta-900"
            >
              Buscar candidato por nome ou número
            </label>
            <p id="ajuda-busca-inicial" className="rotulo-meta mt-1">
              Pode escrever sem acento e sem maiúscula. Digitar só o começo do
              número também funciona.
            </p>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta-400">
                  <IconeBusca />
                </span>
                <input
                  id="busca-inicial"
                  name="busca"
                  type="search"
                  autoComplete="off"
                  enterKeyHint="search"
                  aria-describedby="ajuda-busca-inicial"
                  placeholder="Ex.: Amanda, goncalves, 24"
                  className="campo pl-11 text-lg"
                />
              </div>
              <button type="submit" className="botao-primario justify-center">
                <IconeBusca className="h-4 w-4" />
                Buscar
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rotulo-meta">Exemplos:</span>
              {["Amanda", "goncalves", "24"].map((exemplo) => (
                <Link
                  key={exemplo}
                  href={`/candidatos?busca=${exemplo}`}
                  className="chip no-underline transition-colors hover:border-tinta-400 hover:text-tinta-900"
                >
                  {exemplo}
                </Link>
              ))}
            </div>
          </form>

          <nav aria-label="Ver listas por cargo" className="mt-8">
            <ul className="grid gap-3 sm:grid-cols-2">
              {cargos.map((item) => (
                <li key={item.cargo}>
                  <Link
                    href={item.href}
                    className="cartao cartao-interativo group flex h-full items-center justify-between gap-3 p-5 no-underline"
                  >
                    <span className="flex flex-col gap-1">
                      <span className="text-lg font-semibold text-tinta-900">
                        Ver candidatos a {item.cargo}
                      </span>
                      <span className="text-sm text-tinta-600">
                        {item.total} candidaturas registradas
                      </span>
                    </span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-tinta-200 text-tinta-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:border-tinta-400 group-hover:text-tinta-800">
                      <IconeSeta />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            {panorama.map((item) => (
              <div key={item.rotulo} className="cartao px-2 py-4">
                <dd className="font-display text-2xl font-semibold tabular-nums text-tinta-900">
                  {item.valor}
                </dd>
                <dt className="rotulo-meta mt-1">{item.rotulo}</dt>
              </div>
            ))}
          </dl>

          <section className="cartao mt-10 p-5 sm:p-6">
            <h2 className="text-lg">Como este site trata os dados</h2>
            <ul className="mt-3 space-y-2.5 text-tinta-700">
              {[
                "A ordem das listas é sorteada. Ninguém aparece primeiro por ser mais conhecido, mais rico ou de um partido maior.",
                "O site não dá nota, não faz ranking e não recomenda ninguém.",
                "Todo texto escrito por nós aparece separado do documento oficial, com moldura diferente.",
              ].map((texto) => (
                <li key={texto} className="flex gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tinta-400"
                  />
                  <span>{texto}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
              <Link
                href="/metodologia"
                className="inline-flex items-center gap-1 text-tinta-800"
              >
                Como tratamos os dados
                <IconeSeta className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/fontes"
                className="inline-flex items-center gap-1 text-tinta-800"
              >
                De onde vêm os dados
                <IconeSeta className="h-3.5 w-3.5" />
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
