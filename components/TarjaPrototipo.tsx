/**
 * Tarja fixa de prototipo.
 *
 * Aparece no topo de TODAS as paginas e nunca sai da tela ao rolar.
 * Objetivo: tornar impossivel confundir este prototipo com um site real
 * de informacao eleitoral.
 *
 * Fundo: gradiente animado com as cores da bandeira do Brasil. A legenda
 * fica numa placa escura solida por cima, para continuar legivel (e com
 * contraste) mesmo quando o azul passa por baixo. A hachura reforca que
 * e um aviso, sem depender de cor.
 *
 * Altura fixa (--altura-tarja) porque o cabecalho gruda logo abaixo.
 */
export default function TarjaPrototipo() {
  return (
    <div
      role="alert"
      className="tarja-bandeira sticky top-0 z-50 flex h-[var(--altura-tarja)] items-center overflow-hidden border-b-2 border-tarja-texto"
    >
      <span
        aria-hidden="true"
        className="tarja-hachura absolute inset-0 z-[1]"
      />

      <p className="envelope relative z-[2] flex justify-center">
        <span className="inline-flex items-center gap-2 border border-white/15 bg-tarja-texto px-3 py-1 font-mono text-[0.55rem] font-bold uppercase leading-none tracking-[0.16em] text-papel-alta shadow-[2px_2px_0_0_rgba(0,0,0,0.35)] xs:text-[0.65rem] xs:tracking-[0.2em]">
          <span aria-hidden="true">■</span>
          Protótipo — todos os dados são fictícios
          <span aria-hidden="true">■</span>
        </span>
      </p>
    </div>
  );
}
