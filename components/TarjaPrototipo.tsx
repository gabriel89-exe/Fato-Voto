import { candidaturas, COLETADO_EM } from "@/lib/eleicao";
import { dataCurta } from "@/lib/formato";

/**
 * Barra de contexto fixa no topo.
 *
 * Já foi um gradiente animado com as cores da bandeira. Saiu: movimento
 * permanente no topo da tela compete com o conteúdo, atrapalha quem
 * tem dificuldade de leitura e não informava nada. Agora é uma faixa
 * azul-escura parada, com as duas informações que mudam todo dia.
 *
 * A primeira linha é a mais importante do site inteiro: como a
 * interface agora segue as convenções do gov.br, alguém pode achar que
 * é um site do governo. Não é, e precisa estar dito onde ninguém deixa
 * de ver.
 *
 * Altura fixa (--altura-tarja) porque o cabeçalho gruda logo abaixo.
 */
export default function TarjaPrototipo() {
  const emJulgamento = candidaturas.filter((c) => !c.apto).length;

  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex h-[var(--altura-tarja)] items-center bg-tarja-fundo text-tarja-texto"
    >
      <p className="envelope flex flex-wrap items-center justify-center gap-x-3 gap-y-0 text-center text-[0.8rem] leading-tight sm:text-sm">
        <span className="font-semibold">
          Site independente, sem vínculo com o governo
        </span>
        <span aria-hidden="true" className="hidden text-white/40 sm:inline">
          |
        </span>
        <span className="text-white/85">
          Dados de {dataCurta(COLETADO_EM)} · {emJulgamento} registros em
          julgamento
        </span>
      </p>
    </div>
  );
}
