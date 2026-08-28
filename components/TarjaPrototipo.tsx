import { candidaturas, COLETADO_EM } from "@/lib/eleicao";
import { dataCurta } from "@/lib/formato";

/**
 * Tarja fixa de contexto.
 *
 * ATE 27/08/2026 esta tarja avisava que todos os dados eram ficticios.
 * Agora os dados sao reais, vindos do TSE e da Camara, e a tarja passa
 * a dizer a verdade que mais importa neste momento da eleicao: **o
 * registro das candidaturas ainda esta sendo julgado**.
 *
 * Nao e detalhe burocratico. Uma parte das candidaturas listadas pode
 * nao chegar a urna, e quem le precisa saber disso antes de tirar
 * qualquer conclusao. A contagem e calculada do proprio dado, entao
 * ela nunca fica desatualizada em relacao ao que a tela mostra.
 *
 * Altura fixa (--altura-tarja) porque o cabecalho gruda logo abaixo.
 */
export default function TarjaPrototipo() {
  const emJulgamento = candidaturas.filter((c) => !c.apto).length;

  return (
    <div
      role="status"
      className="tarja-bandeira sticky top-0 z-50 flex h-[var(--altura-tarja)] items-center overflow-hidden border-b-2 border-tarja-texto"
    >
      <span aria-hidden="true" className="tarja-hachura absolute inset-0 z-[1]" />

      <p className="envelope relative z-[2] flex justify-center">
        <span className="inline-flex items-center gap-2 border border-white/15 bg-tarja-texto px-3 py-1 text-center font-mono text-[0.55rem] font-bold uppercase leading-none tracking-[0.14em] text-papel-alta shadow-[2px_2px_0_0_rgba(0,0,0,0.35)] xs:text-[0.63rem] xs:tracking-[0.16em]">
          <span aria-hidden="true">■</span>
          <span>
            Dados oficiais · coleta de {dataCurta(COLETADO_EM)} ·{" "}
            {emJulgamento} registros ainda em julgamento
          </span>
          <span aria-hidden="true">■</span>
        </span>
      </p>
    </div>
  );
}
