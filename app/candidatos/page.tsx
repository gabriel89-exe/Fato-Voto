import CartaoCandidato from "@/components/CartaoCandidato";
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
    <div className="envelope py-6 sm:py-8">
      <h1>Candidatos{cargo ? ` a ${cargo}` : ""}</h1>

      <p
        role="status"
        className="mt-4 rounded-md border border-tinta-300 bg-superficie-baixa px-4 py-3 text-sm text-tinta-700"
      >
        <strong>Página provisória.</strong> A busca instantânea, os filtros e a
        ordenação sorteada ainda serão construídos (passos 3 e 4). A ordem
        abaixo é a ordem do arquivo de dados e ainda não é sorteada.
      </p>

      <p className="mt-4 text-tinta-700">
        {lista.length} candidaturas encontradas.
      </p>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((candidato) => (
          <CartaoCandidato key={candidato.id} candidato={candidato} />
        ))}
      </ul>
    </div>
  );
}
