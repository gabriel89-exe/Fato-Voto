import CartaoCandidato from "@/components/CartaoCandidato";
import { IconeInfo } from "@/components/icones";
import { candidatos, ESTADO } from "@/lib/dados";
import type { Cargo } from "@/types";

export const metadata = { title: "Candidatos" };

/**
 * Lista de candidatos — VERSAO PROVISORIA.
 *
 * Busca instantanea, filtros facetados e ordenacao sorteada entram nos
 * passos 3 e 4. A ordem exibida ainda NAO e sorteada, e isso esta
 * avisado na tela para nao passar a impressao errada.
 */
export default async function PaginaCandidatos({
  searchParams,
}: {
  searchParams: Promise<{ cargo?: string; busca?: string }>;
}) {
  const params = await searchParams;
  const cargo = params.cargo as Cargo | undefined;

  const lista = cargo ? candidatos.filter((c) => c.cargo === cargo) : candidatos;

  return (
    <div className="envelope py-8 sm:py-12">
      <header className="entrada">
        <p className="folio flex-wrap justify-between gap-y-1 border-y-2 border-tinta-900 py-2">
          <span>
            {ESTADO.nome} ({ESTADO.sigla}) — Edição {ESTADO.anoEleicao}
          </span>
          <span className="text-tinta-400">
            {String(lista.length).padStart(2, "0")} verbetes
          </span>
        </p>

        <h1 className="mt-6">
          Candidatos{cargo ? <span className="text-tinta-400"> · {cargo}</span> : null}
        </h1>

        <div
          role="status"
          className="aviso-callout mt-6 flex gap-3"
        >
          <IconeInfo className="mt-0.5 shrink-0 text-tinta-500" />
          <span>
            <strong className="font-bold text-tinta-900">
              Página provisória.
            </strong>{" "}
            A busca instantânea, os filtros e a ordenação sorteada ainda serão
            construídos (passos 3 e 4). A ordem abaixo é a ordem do arquivo de
            dados e ainda não é sorteada.
          </span>
        </div>
      </header>

      <ul className="entrada-lista mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((candidato) => (
          <CartaoCandidato key={candidato.id} candidato={candidato} />
        ))}
      </ul>
    </div>
  );
}
