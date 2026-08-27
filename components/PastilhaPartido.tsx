import type { Partido } from "@/types";

/**
 * Identificacao do partido.
 *
 * A cor da legenda aparece SOMENTE neste ponto minusculo, nunca como
 * fundo de cartao nem como destaque de secao. A sigla vem escrita ao
 * lado, entao a informacao nao depende de enxergar a cor.
 */
export default function PastilhaPartido({
  partido,
  detalhado = false,
}: {
  partido: Partido;
  detalhado?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-tinta-700">
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 rounded-full border border-black/20"
        style={{ backgroundColor: partido.cor }}
      />
      <span>
        <span className="font-semibold text-tinta-800">{partido.sigla}</span>
        {detalhado ? (
          <span className="text-tinta-600"> — {partido.nome}</span>
        ) : null}
      </span>
    </span>
  );
}
