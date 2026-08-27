import Link from "next/link";
import { IconeBusca, IconeSeta } from "@/components/icones";
import { candidatos, DATA_COLETA, ESTADO } from "@/lib/dados";
import { dataPorExtenso } from "@/lib/formato";

/**
 * Home — primeira pagina da gazeta.
 *
 * O elemento principal e o campo de busca (§ 01). O formulario e um GET
 * comum para /candidatos, entao a busca funciona sem JavaScript.
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
    <div className="envelope">
      {/* ================= Cabeçote da edição ================= */}
      <header className="entrada pt-8 sm:pt-12">
        <p className="folio flex-wrap justify-between gap-y-1 border-y-2 border-tinta-900 py-2">
          <span>
            {ESTADO.nome} ({ESTADO.sigla}) — Edição {ESTADO.anoEleicao}
          </span>
          <span className="text-tinta-400">
            Coleta simulada · {dataPorExtenso(DATA_COLETA)}
          </span>
        </p>

        <h1 className="mt-6 max-w-[14ch] sm:mt-8">
          Quem está na disputa
        </h1>

        <div className="mt-6 grid gap-6 border-t border-tinta-300 pt-6 sm:grid-cols-12 sm:gap-8">
          <p className="font-display text-xl font-medium leading-[1.15] tracking-[-0.02em] text-tinta-800 sm:col-span-5 sm:text-2xl">
            Um registro público das candidaturas ao governo e ao senado de{" "}
            {ESTADO.nome}. Sem ranking, sem nota, sem recomendação.
          </p>
          <div className="capitular text-[1.05rem] leading-relaxed text-tinta-700 sm:col-span-7">
            Cada candidatura tem uma ficha com os mesmos campos, na mesma ordem,
            com o mesmo peso: número de urna, partido, situação do registro,
            proposta de governo e dados declarados no momento do registro. O
            texto que a plataforma escreve fica sempre separado do documento
            oficial, em moldura diferente, para você nunca confundir um com o
            outro.
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#buscar" className="botao-primario">
            <IconeBusca className="h-4 w-4" />
            Buscar candidato
          </a>
          <Link href="/candidatos" className="botao-secundario">
            Lista completa
            <IconeSeta />
          </Link>
        </div>
      </header>

      {/* ================= § 01 — Buscar ================= */}
      <section id="buscar" className="mt-16 scroll-mt-32 sm:mt-24">
        <div className="secao-cabeca">
          <span className="folio">
            <b>§ 01</b>
          </span>
          <h2>Buscar</h2>
        </div>

        <form
          action="/candidatos"
          method="get"
          role="search"
          className="painel mt-6 p-5 sm:p-7"
        >
          <label
            htmlFor="busca-inicial"
            className="block font-display text-xl font-semibold tracking-[-0.02em] text-tinta-900"
          >
            Por nome ou número de urna
          </label>
          <p id="ajuda-busca-inicial" className="mt-2 text-sm text-tinta-600">
            Pode escrever sem acento e sem maiúscula. Digitar só o começo do
            número também funciona.
          </p>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
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
                placeholder="Amanda, goncalves, 24…"
                className="campo pl-11 text-lg"
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
                className="chip no-underline transition-colors hover:bg-tinta-900 hover:text-papel-alta"
              >
                {exemplo}
              </Link>
            ))}
          </div>
        </form>
      </section>

      {/* ================= § 02 — Edições por cargo ================= */}
      <section className="mt-16 sm:mt-24">
        <div className="secao-cabeca">
          <span className="folio">
            <b>§ 02</b>
          </span>
          <h2>Cadernos por cargo</h2>
        </div>

        <ul className="mt-6 grid border-2 border-tinta-900 sm:grid-cols-2">
          {cargos.map((item, i) => (
            <li
              key={item.cargo}
              className={i > 0 ? "border-t-2 border-tinta-900 sm:border-l-2 sm:border-t-0" : ""}
            >
              <Link
                href={item.href}
                className="group flex h-full items-center justify-between gap-4 bg-papel-alta p-6 no-underline transition-colors hover:bg-papel sm:p-8"
              >
                <span className="flex flex-col gap-2">
                  <span className="font-display text-2xl font-bold tracking-[-0.03em] text-tinta-900 sm:text-3xl">
                    {item.cargo}
                  </span>
                  <span className="rotulo-meta">
                    {String(item.total).padStart(2, "0")} candidaturas
                  </span>
                </span>
                <span className="font-mono text-2xl text-tinta-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-acento">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ================= § 03 — Panorama ================= */}
      <section className="mt-16 sm:mt-24">
        <div className="secao-cabeca">
          <span className="folio">
            <b>§ 03</b>
          </span>
          <h2>Panorama</h2>
        </div>

        <dl className="mt-6 grid grid-cols-3 border-2 border-tinta-900 bg-papel-alta">
          {panorama.map((item, i) => (
            <div
              key={item.rotulo}
              className={`px-3 py-7 text-center ${
                i > 0 ? "border-l-2 border-tinta-900" : ""
              }`}
            >
              <dd className="font-display text-4xl font-bold tabular-nums text-tinta-900 sm:text-6xl">
                {String(item.valor).padStart(2, "0")}
              </dd>
              <dt className="rotulo-meta mt-2">{item.rotulo}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ================= § 04 — Princípios ================= */}
      <section className="mt-16 sm:mt-24">
        <div className="secao-cabeca">
          <span className="folio">
            <b>§ 04</b>
          </span>
          <h2>Princípios de edição</h2>
        </div>

        <ol className="mt-6 border-2 border-tinta-900 bg-papel-alta">
          {principios.map((texto, i) => (
            <li
              key={texto}
              className={`flex gap-5 p-5 sm:p-6 ${
                i > 0 ? "border-t border-tinta-300" : ""
              }`}
            >
              <span className="font-display text-2xl font-bold leading-none text-tinta-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-tinta-700">{texto}</span>
            </li>
          ))}
        </ol>

        <p className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm uppercase tracking-[0.08em]">
          <Link href="/metodologia" className="inline-flex items-center gap-2">
            Metodologia
            <IconeSeta className="h-3.5 w-3.5" />
          </Link>
          <Link href="/fontes" className="inline-flex items-center gap-2">
            Fontes dos dados
            <IconeSeta className="h-3.5 w-3.5" />
          </Link>
        </p>
      </section>

      <div className="filete-dupla mt-16 sm:mt-24" />
    </div>
  );
}
