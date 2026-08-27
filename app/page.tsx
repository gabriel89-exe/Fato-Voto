import Link from "next/link";
import { IconeBusca } from "@/components/icones";
import { candidatos, ESTADO } from "@/lib/dados";

/**
 * Home.
 *
 * O elemento principal e o campo de busca. O formulario e um GET comum
 * para /candidatos, entao a busca funciona mesmo sem JavaScript.
 */
export default function PaginaInicial() {
  const totalGovernador = candidatos.filter((c) => c.cargo === "Governador").length;
  const totalSenador = candidatos.filter((c) => c.cargo === "Senador").length;

  return (
    <div className="envelope py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <h1>Consulte os dados de quem está na disputa</h1>
        <p className="mt-3 text-lg text-tinta-700">
          Este site reúne, em linguagem simples, os dados públicos das
          candidaturas ao governo e ao senado de {ESTADO.nome} ({ESTADO.sigla}) em{" "}
          {ESTADO.anoEleicao}.
        </p>

        <form
          action="/candidatos"
          method="get"
          role="search"
          className="mt-8 rounded-lg border-2 border-tinta-300 bg-superficie-alta p-4 sm:p-5"
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
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-500">
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
              Buscar
            </button>
          </div>
        </form>

        <nav aria-label="Ver listas por cargo" className="mt-8">
          <ul className="grid gap-3 sm:grid-cols-2">
            <li>
              <Link
                href="/candidatos?cargo=Governador"
                className="cartao flex h-full flex-col justify-between gap-2 p-5 no-underline hover:border-tinta-400"
              >
                <span className="text-lg font-semibold text-tinta-900">
                  Ver candidatos a Governador
                </span>
                <span className="text-sm text-tinta-600">
                  {totalGovernador} candidaturas registradas
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/candidatos?cargo=Senador"
                className="cartao flex h-full flex-col justify-between gap-2 p-5 no-underline hover:border-tinta-400"
              >
                <span className="text-lg font-semibold text-tinta-900">
                  Ver candidatos a Senador
                </span>
                <span className="text-sm text-tinta-600">
                  {totalSenador} candidaturas registradas
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        <section className="mt-10 rounded-lg border border-tinta-200 bg-superficie-alta p-5">
          <h2 className="text-lg">Como este site trata os dados</h2>
          <ul className="mt-3 space-y-2 text-tinta-700">
            <li>
              A ordem das listas é sorteada. Ninguém aparece primeiro por ser
              mais conhecido, mais rico ou de um partido maior.
            </li>
            <li>
              O site não dá nota, não faz ranking e não recomenda ninguém.
            </li>
            <li>
              Todo texto escrito por nós aparece separado do documento oficial,
              com moldura diferente.
            </li>
          </ul>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/metodologia" className="text-tinta-800">
              Como tratamos os dados
            </Link>
            <Link href="/fontes" className="text-tinta-800">
              De onde vêm os dados
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
