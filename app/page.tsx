import Link from "next/link";
import { IconeBusca, IconeSeta } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
 * Foi enxugada de quatro seções numeradas ("§ 01 Buscar", "§ 02
 * Cadernos por cargo"...) para três blocos com títulos que dizem o que
 * são. A pergunta que a pessoa chega fazendo é "quem posso votar?", e
 * a resposta — a busca e a lista por cargo — agora está acima da
 * dobra, sem manchete gigante empurrando tudo para baixo.
 *
 * A busca é um GET comum para /candidatos: funciona sem JavaScript.
 */
export default function PaginaInicial() {
  const porCargo = contarPorCargo();
  const totalDe = (cargo: string) =>
    porCargo.find((c) => c.cargo === cargo)?.total ?? 0;

  const emJulgamento = candidaturas.filter((c) => !c.apto).length;

  return (
    <div className="envelope">
      {/* ================= Abertura + busca ================= */}
      <section className="entrada pt-8 sm:pt-12">
        <h1 className="max-w-[20ch]">Quem está na disputa no {ESTADO.nome}</h1>

        <p className="mt-4 max-w-leitura text-lg text-tinta-700">
          As {candidaturas.length} candidaturas de {ELEICAO.ano}, com dados
          oficiais do Tribunal Superior Eleitoral. Sem ranking, sem nota e sem
          recomendação — a ordem das listas é sorteada.
        </p>

        <form
          action="/candidatos"
          method="get"
          role="search"
          className="painel mt-7 p-5 sm:p-6"
        >
          <label
            htmlFor="busca-inicial"
            className="block text-lg font-bold text-tinta-950"
          >
            Buscar por nome ou número de urna
          </label>
          <p id="ajuda-busca-inicial" className="mt-1 text-tinta-600">
            Pode escrever sem acento e sem maiúscula. Digitar só o começo do
            número também funciona.
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
      </section>

      {/* ================= Cargos ================= */}
      <section className="mt-12 sm:mt-16">
        <h2>Ver por cargo</h2>
        <p className="mt-2 max-w-leitura text-tinta-700">
          Cada cargo tem funções diferentes. A ficha de cada candidatura mostra
          o que aquele cargo de fato faz.
        </p>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CARGOS.map((cargo) => (
            <li key={cargo}>
              <Link
                href={`/candidatos?cargo=${encodeURIComponent(cargo)}`}
                className="group flex h-full items-center justify-between gap-4 rounded border border-tinta-200 bg-papel-alta p-5 no-underline shadow-cartao transition-colors hover:border-acento hover:bg-acento-leve"
              >
                <span className="flex min-w-0 flex-col">
                  <span className="text-lg font-bold text-tinta-950">
                    {cargo}
                  </span>
                  <span className="text-tinta-600">
                    {totalDe(cargo)} candidaturas
                  </span>
                </span>
                <IconeSeta className="h-5 w-5 shrink-0 text-acento transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ================= Aviso de julgamento ================= */}
      <section className="mt-12 sm:mt-16">
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
      <section className="mt-12 sm:mt-16">
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
          ].map((item) => (
            <li
              key={item.titulo}
              className="rounded border border-tinta-200 bg-papel-alta p-5"
            >
              <h3 className="text-tinta-950">{item.titulo}</h3>
              <p className="mt-1.5 text-tinta-700">{item.texto}</p>
            </li>
          ))}
        </ul>

        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/metodologia">Como tratamos os dados</Link>
          <Link href="/fontes">De onde vêm os dados</Link>
        </p>
      </section>

      <div className="mt-14 sm:mt-20" />
    </div>
  );
}
