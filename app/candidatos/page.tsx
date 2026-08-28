import Link from "next/link";
import CartaoCandidato from "@/components/CartaoCandidato";
import FiltrosCandidatos from "@/components/FiltrosCandidatos";
import { IconeSorteio } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  aplicarFiltros,
  candidaturas,
  contarRecortes,
  diaDeHoje,
  ELEICAO,
  ESTADO,
  filtrosDaQuery,
  montarFacetas,
  sortear,
} from "@/lib/eleicao";
import { dataCurta } from "@/lib/formato";

export const metadata = { title: "Candidatos" };

/**
 * Lista de candidaturas.
 *
 * A ordem e SORTEADA, com semente fixa por dia — o dispositivo central
 * de neutralidade do site. Ver docs/principios.md, regra 1.
 *
 * O sorteio acontece ANTES do recorte, nao depois: assim a posicao
 * relativa de duas candidaturas nao muda quando alguem filtra ou
 * digita uma busca.
 */
export default async function PaginaCandidatos({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filtros = filtrosDaQuery(params);

  const dia = diaDeHoje();
  const sorteadas = sortear(candidaturas, dia);
  const lista = aplicarFiltros(sorteadas, filtros);
  const facetas = montarFacetas(sorteadas, filtros);
  const recortes = contarRecortes(filtros);
  const temRecorte = recortes > 0 || Boolean(filtros.cargo || filtros.busca);

  return (
    <div className="envelope py-8 sm:py-12">
      <header className="entrada">
        <p className="folio flex-wrap justify-between gap-y-1 border-y-2 border-tinta-900 py-2">
          <span>
            {ESTADO.nome} ({ESTADO.sigla}) — Eleição {ELEICAO.ano}
          </span>
          <span className="text-tinta-400">
            {lista.length} de {candidaturas.length}
          </span>
        </p>

        <h1 className="mt-6">
          Candidatos
          {filtros.cargo ? (
            <span className="text-tinta-400"> · {filtros.cargo}</span>
          ) : null}
        </h1>

        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-tinta-600">
          <IconeSorteio className="h-4 w-4 shrink-0 text-tinta-500" />
          <span>
            Ordem sorteada em {dataCurta(dia)}. Ela é a mesma para todo mundo
            hoje e muda amanhã.{" "}
            <Link href="/metodologia">Por que sorteamos</Link>.
          </span>
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8">
        <FiltrosCandidatos
          filtros={filtros}
          facetas={facetas}
          recortesAtivos={recortes}
        />

        <div className="min-w-0">
          <p
            role="status"
            aria-live="polite"
            className="font-mono text-[0.68rem] uppercase tracking-[0.13em] text-tinta-500"
          >
            {lista.length}{" "}
            {lista.length === 1
              ? "candidatura encontrada"
              : "candidaturas encontradas"}
            {temRecorte ? " com este recorte" : ""}
          </p>

          {lista.length === 0 ? (
            <Alert className="mt-5">
              <AlertTitle>Nenhuma candidatura com este recorte</AlertTitle>
              <AlertDescription>
                Tente marcar menos opções, escrever menos letras do nome, ou só
                o começo do número de urna. A busca ignora acentos e
                maiúsculas.{" "}
                <Link href="/candidatos">Ver todas as candidaturas</Link>.
              </AlertDescription>
            </Alert>
          ) : (
            <ul className="entrada-lista mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {lista.map((candidatura) => (
                <CartaoCandidato
                  key={candidatura.id}
                  candidatura={candidatura}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
