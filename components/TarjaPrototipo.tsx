/**
 * Tarja fixa de prototipo.
 *
 * Aparece no topo de TODAS as paginas e nunca sai da tela ao rolar.
 * Objetivo: tornar impossivel confundir este prototipo com um site real
 * de informacao eleitoral. Por isso o alto contraste e a hachura.
 */
export default function TarjaPrototipo() {
  return (
    <div
      role="alert"
      className="hachura-aviso sticky top-0 z-50 border-b-2 border-tarja-texto bg-tarja-fundo"
    >
      <p className="envelope py-2 text-center text-xs font-bold uppercase leading-tight tracking-wide text-tarja-texto sm:text-sm">
        Protótipo — todos os dados são fictícios
      </p>
    </div>
  );
}
