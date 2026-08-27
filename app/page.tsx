import Link from "next/link";
import { IconeBusca, IconeSeta } from "@/components/icones";
import { candidatos, ESTADO } from "@/lib/dados";

/**
 * Home.
 *
 * Estrutura em faixas numeradas, no estilo de um sumario. A primeira
 * faixa e a casca escura (hero). O restante e papel claro. O elemento
 * principal e o campo de busca — um GET comum, funciona sem JavaScript.
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

  const principios = [
    "A ordem das listas é sorteada. Ninguém aparece primeiro por ser mais conhecido, mais rico ou de um partido maior.",
    "O site não dá nota, não faz ranking e não recomenda ninguém.",
    "Todo texto escrito por nós aparece separado do documento oficial, com moldura diferente.",
  ];

  return (
    <>
      {/* ---------- Faixa 1: hero na casca escura ---------- */}
      <section className="casca casca-planta">
        <div className="envelope entrada py-16 sm:py-24">
          <span className="chip">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-casca-suave"
            />
            {ESTADO.nome} ({ESTADO.sigla}) · {ESTADO.anoEleicao}
          </span>

          <h1 className="mt-6 max-w-4xl text-casca-texto">
            Consulte os dados de quem está na disputa
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-casca-suave">
            Um registro público, em linguagem simples, das candidaturas ao
            governo e ao senado de {ESTADO.nome} ({ESTADO.sigla}) em{" "}
            {ESTADO.anoEleicao}. Sem ranking, sem nota, sem recomendação.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#buscar" className="botao-primario">
              <IconeBusca className="h-4 w-4" />
              Buscar candidato
            </a>
            <Link href="/candidatos" className="botao-secundario">
              Ver a lista completa
              <IconeSeta />
            </Link>
          </div>
        </div>
      </section>

      <div className="envelope space-y-16 py-14 sm:space-y-20 sm:py-20">
        {/* ---------- Faixa 2: busca ---------- */}
        <section id="buscar" className="scroll-mt-32">
          <p className="rotulo-secao">
            <span>01</span> Buscar
          </p>

          <form
            action="/candidatos"
            method="get"
            role="search"
            className="painel mt-5 p-5 sm:p-7"
          >
            <label
              htmlFor="busca-inicial"
              className="block font-display text-xl text-tinta-900"
            >
              Por nome ou número de urna
            </label>
            <p id="ajuda-busca-inicial" className="rotulo-meta mt-2 normal-case">
              Pode escrever sem acento e sem maiúscula. Digitar só o começo do
              número também funciona.
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
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
                  className="campo pl-11 font-mono text-lg"
                />
              </div>
              <button type="submit" className="botao-primario justify-center">
                <IconeBusca className="h-4 w-4" />
                Buscar
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rotulo-meta">Exemplos</span>
              {["Amanda", "goncalves", "24"].map((exemplo) => (
                <Link
                  key={exemplo}
                  href={`/candidatos?busca=${exemplo}`}
                  className="chip no-underline transition-colors hover:border-tinta-500 hover:text-tinta-900"
                >
                  {exemplo}
                </Link>
              ))}
            </div>
          </form>
        </section>

        {/* ---------- Faixa 3: listas por cargo ---------- */}
        <section>
          <p className="rotulo-secao">
            <span>02</span> Listas por cargo
          </p>

          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {cargos.map((item) => (
              <li key={item.cargo}>
                <Link
                  href={item.href}
                  className="cartao cartao-interativo group flex h-full items-center justify-between gap-4 p-6 no-underline"
                >
                  <span className="flex flex-col gap-1.5">
                    <span className="font-display text-xl text-tinta-900">
                      {item.cargo}
                    </span>
                    <span className="rotulo-meta normal-case">
                      {item.total} candidaturas registradas
                    </span>
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-tinta-300 text-tinta-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:border-tinta-600 group-hover:text-tinta-900">
                    <IconeSeta />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- Faixa 4: panorama ---------- */}
        <section>
          <p className="rotulo-secao">
            <span>03</span> Panorama
          </p>

          <dl className="mt-5 grid grid-cols-3 divide-x divide-tinta-200 overflow-hidden rounded-xl border border-tinta-200 bg-papel-alta">
            {panorama.map((item) => (
              <div key={item.rotulo} className="px-3 py-6 text-center">
                <dd className="font-mono text-3xl font-semibold tabular-nums text-tinta-900 sm:text-4xl">
                  {String(item.valor).padStart(2, "0")}
                </dd>
                <dt className="rotulo-meta mt-2 normal-case">{item.rotulo}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- Faixa 5: como funciona ---------- */}
        <section>
          <p className="rotulo-secao">
            <span>04</span> Como este site trata os dados
          </p>

          <ol className="mt-5 divide-y divide-tinta-200 overflow-hidden rounded-xl border border-tinta-200 bg-papel-alta">
            {principios.map((texto, i) => (
              <li key={texto} className="flex gap-4 p-5">
                <span className="font-mono text-sm text-tinta-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-tinta-700">{texto}</span>
              </li>
            ))}
          </ol>

          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/metodologia"
              className="inline-flex items-center gap-1.5 font-medium text-tinta-800"
            >
              Metodologia completa
              <IconeSeta className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/fontes"
              className="inline-flex items-center gap-1.5 font-medium text-tinta-800"
            >
              De onde vêm os dados
              <IconeSeta className="h-3.5 w-3.5" />
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
