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
 *
 * A lista vem paginada. Sem isso a pagina sem recorte montava as 575
 * fichas de uma vez: 158 mil pixels de altura, 213 telas de rolagem e
 * perto de 20 mil nos no DOM — medido a 360px. Num celular mediano
 * isso trava antes de terminar de desenhar, e mesmo desenhado nao ha
 * como chegar ao fim.
 *
 * Paginar uma lista sorteada nao cria ranking: a ordem ja e aleatoria
 * e declarada como tal logo acima. A pagina 1 nao e melhor que a 12.
 *
 * O controle e feito de <a>, nao de botao com script: a pagina inteira
 * ja funciona sem JavaScript e a paginacao acompanha.
 */
const POR_PAGINA = 24;
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

  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const pedida = Number(params.pagina);
  const pagina = Number.isInteger(pedida)
    ? Math.min(Math.max(pedida, 1), totalPaginas)
    : 1;
  const inicio = (pagina - 1) * POR_PAGINA;
  const visiveis = lista.slice(inicio, inicio + POR_PAGINA);

  /* O endereco de outra pagina carrega os recortes atuais. Sem isto,
     avancar limparia o filtro que a pessoa acabou de marcar. */
  const enderecoDaPagina = (n: number) => {
    const q = new URLSearchParams();
    for (const [chave, valor] of Object.entries(params)) {
      if (chave === "pagina" || valor === undefined) continue;
      for (const v of Array.isArray(valor) ? valor : [valor]) q.append(chave, v);
    }
    if (n > 1) q.set("pagina", String(n));
    const s = q.toString();
    return s ? `/candidatos?${s}` : "/candidatos";
  };

  return (
    <div className="envelope py-8 sm:py-12">
      <header className="entrada">
        <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-tinta-200 pb-3 text-sm text-tinta-600">
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
            className="text-sm text-tinta-500"
          >
            {lista.length}{" "}
            {lista.length === 1
              ? "candidatura encontrada"
              : "candidaturas encontradas"}
            {temRecorte ? " com este recorte" : ""}
            {totalPaginas > 1
              ? ` · mostrando ${inicio + 1} a ${inicio + visiveis.length}`
              : ""}
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
            <>
              <ul className="entrada-lista mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visiveis.map((candidatura) => (
                  <CartaoCandidato
                    key={candidatura.id}
                    candidatura={candidatura}
                  />
                ))}
              </ul>

              {totalPaginas > 1 ? (
                <nav
                  aria-label="Paginação da lista"
                  className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-tinta-200 pt-5"
                >
                  {pagina > 1 ? (
                    <Link
                      href={enderecoDaPagina(pagina - 1)}
                      rel="prev"
                      className="alvo-toque rounded-lg border border-tinta-300 px-4 text-base no-underline text-tinta-800 hover:border-acento hover:text-acento"
                    >
                      Anterior
                    </Link>
                  ) : (
                    <span aria-hidden="true" />
                  )}

                  <span className="text-sm text-tinta-600">
                    Página {pagina} de {totalPaginas}
                  </span>

                  {pagina < totalPaginas ? (
                    <Link
                      href={enderecoDaPagina(pagina + 1)}
                      rel="next"
                      className="alvo-toque rounded-lg border border-tinta-300 px-4 text-base no-underline text-tinta-800 hover:border-acento hover:text-acento"
                    >
                      Próxima
                    </Link>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                </nav>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
