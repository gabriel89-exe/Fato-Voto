/**
 * Tarja fixa de prototipo.
 *
 * Aparece no topo de TODAS as paginas e nunca sai da tela ao rolar.
 * Objetivo: tornar impossivel confundir este prototipo com um site real
 * de informacao eleitoral. Por isso o alto contraste e a hachura.
 *
 * Altura fixa (--altura-tarja) porque o cabecalho gruda logo abaixo.
 */
export default function TarjaPrototipo() {
  return (
    <div
      role="alert"
      className="hachura-aviso sticky top-0 z-50 flex h-[var(--altura-tarja)] items-center border-b-2 border-tarja-texto bg-tarja-fundo"
    >
      <p className="envelope flex items-center justify-center gap-2 text-center font-mono text-[0.62rem] font-bold uppercase leading-none tracking-[0.18em] text-tarja-texto xs:text-[0.68rem] xs:tracking-[0.24em]">
        <span aria-hidden="true">■</span>
        Protótipo — todos os dados são fictícios
        <span aria-hidden="true">■</span>
      </p>
    </div>
  );
}
