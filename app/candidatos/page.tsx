import CartaoCandidato from "@/components/CartaoCandidato";
import { IconeInfo } from "@/components/icones";
import { candidatos } from "@/lib/dados";
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
    <>
      <section className="casca casca-planta">
        <div className="envelope entrada py-12 sm:py-16">
          <span className="chip">Lista de candidaturas</span>
          <h1 className="mt-5 text-casca-texto">
            Candidatos{cargo ? ` a ${cargo}` : ""}
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-[0.14em] text-casca-suave">
            {String(lista.length).padStart(2, "0")} fichas
          </p>
        </div>
      </section>

      <div className="envelope py-10 sm:py-14">
        <div role="status" className="aviso-callout flex gap-3">
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

        <ul className="entrada-lista mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((candidato) => (
            <CartaoCandidato key={candidato.id} candidato={candidato} />
          ))}
        </ul>
      </div>
    </>
  );
}
