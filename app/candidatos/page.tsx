import CartaoCandidato from "@/components/CartaoCandidato";
import { IconeInfo } from "@/components/icones";
import { candidatos } from "@/lib/dados";
import type { Cargo } from "@/types";

export const metadata = { title: "Candidatos" };

/**
 * Lista de candidatos — VERSAO PROVISORIA.
 *
 * Busca instantanea, filtros facetados e ordenacao sorteada entram nos
 * passos 3 e 4. Por enquanto esta pagina existe para validar o cartao e
 * a navegacao. A ordem exibida ainda NAO e sorteada, e isso esta avisado
 * na tela para nao passar a impressao errada.
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
    <div className="envelope py-8 sm:py-10">
      <div className="entrada">
        <span className="chip">Lista de candidaturas</span>

        <h1 className="mt-3">Candidatos{cargo ? ` a ${cargo}` : ""}</h1>

        <div role="status" className="aviso-callout mt-4 flex gap-3">
          <IconeInfo className="mt-0.5 shrink-0 text-tinta-500" />
          <span>
            <strong className="font-semibold text-tinta-900">
              Página provisória.
            </strong>{" "}
            A busca instantânea, os filtros e a ordenação sorteada ainda serão
            construídos (passos 3 e 4). A ordem abaixo é a ordem do arquivo de
            dados e ainda não é sorteada.
          </span>
        </div>

        <p className="mt-4 flex items-center gap-2 text-tinta-700">
          <span className="chip tabular-nums font-semibold">{lista.length}</span>
          candidaturas encontradas
        </p>
      </div>

      <ul className="entrada-lista mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((candidato) => (
          <CartaoCandidato key={candidato.id} candidato={candidato} />
        ))}
      </ul>
    </div>
  );
}
