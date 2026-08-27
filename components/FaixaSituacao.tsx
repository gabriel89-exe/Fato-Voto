import type { SituacaoRegistro } from "@/types";
import { dataCurta } from "@/lib/formato";

/**
 * Faixa de situacao do registro.
 *
 * Todas as situacoes usam exatamente o mesmo fundo e a mesma moldura.
 * Nao existe cor de "bom" ou de "ruim" aqui: registro indeferido nao e
 * defeito de carater, e um estado processual. Quem informa e o texto.
 */

const EXPLICACOES: Record<SituacaoRegistro, string> = {
  Deferido:
    "A Justiça Eleitoral aceitou o pedido de registro desta candidatura.",
  "Deferido com recurso":
    "A Justiça Eleitoral aceitou o registro, mas alguém entrou com recurso e o caso ainda pode mudar.",
  "Sub judice":
    "O registro ainda está em análise na Justiça. Enquanto não há decisão final, o nome pode continuar na urna.",
  Indeferido:
    "A Justiça Eleitoral não aceitou o pedido de registro. A decisão ainda pode ser revista em recurso.",
};

export default function FaixaSituacao({
  situacao,
  atualizadoEm,
  fonte,
  urlOriginal,
}: {
  situacao: SituacaoRegistro;
  atualizadoEm: string;
  fonte: string;
  urlOriginal?: string;
}) {
  return (
    <div className="rounded-md border border-tinta-300 bg-superficie-baixa px-4 py-3">
      <p className="text-sm">
        <span className="font-semibold text-tinta-900">
          Situação do registro: {situacao}.
        </span>{" "}
        <span className="text-tinta-700">{EXPLICACOES[situacao]}</span>
      </p>
      <p className="rotulo-meta mt-1">
        Atualizado em {dataCurta(atualizadoEm)}. Fonte: {fonte}.
        {urlOriginal ? (
          <>
            {" "}
            <a href={urlOriginal} rel="nofollow noopener" className="text-tinta-800">
              Ver registro de origem
            </a>
            .
          </>
        ) : null}
      </p>
    </div>
  );
}
