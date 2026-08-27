/**
 * Tarja fixa de prototipo.
 *
 * Aparece no topo de TODAS as paginas e nunca sai da tela ao rolar.
 * Objetivo: tornar impossivel confundir este prototipo com um site real
 * de informacao eleitoral. Por isso o alto contraste e a hachura.
 *
 * A altura e fixa (--altura-tarja) porque o cabecalho gruda logo abaixo.
 */
export default function TarjaPrototipo() {
  return (
    <div
      role="alert"
      className="hachura-aviso sticky top-0 z-50 flex h-[var(--altura-tarja)] items-center border-b-2 border-tarja-texto/80 bg-tarja-fundo shadow-[inset_0_-8px_14px_-10px_rgba(0,0,0,0.5),0_2px_12px_-4px_rgba(0,0,0,0.4)] motion-safe:animate-arrastar-hachura"
    >
      <p className="envelope text-center text-[0.66rem] font-bold uppercase leading-none tracking-[0.16em] text-tarja-texto xs:text-xs sm:tracking-[0.2em]">
        Protótipo — todos os dados são fictícios
      </p>
    </div>
  );
}
