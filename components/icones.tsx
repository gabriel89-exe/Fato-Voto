/**
 * Icones desenhados a mao em SVG. Nenhuma biblioteca de icones.
 * Todos herdam a cor do texto (currentColor) e sao decorativos:
 * quem usa leitor de tela recebe o rotulo pelo texto ao lado.
 */

type Props = { className?: string };

const base = "h-5 w-5 shrink-0";

/**
 * Marca do site, desde 02/09/2026: o circulo dividido da logomarca.
 *
 * Uma faixa clara em diagonal separa duas metades — em cima, o
 * DOCUMENTO conferido (o fato, com a marca de checagem); embaixo, a
 * URNA (o voto). E o par que da nome ao site, em preto e cinza de
 * proposito: nenhum matiz que possa ser lido como cor de partido.
 *
 * Cores fixas, nao currentColor: a marca e a unica coisa do site que
 * nao muda de cor com o contexto. `faixa` e a cor da fresta diagonal —
 * por padrao branca, e igual ao fundo quando a marca senta em papel.
 */
export function IconeMarca({
  className = "",
  faixa = "#ffffff",
}: Props & { faixa?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      aria-hidden="true"
      /* Sem tamanho padrão de propósito: cada uso declara o seu, e um
         h-9 daqui brigaria com o h-10 de lá na ordem do CSS gerado. */
      className={`shrink-0 ${className}`}
    >
      <defs>
        <clipPath id="marca-circulo">
          <circle cx="48" cy="48" r="44" />
        </clipPath>
      </defs>
      <g clipPath="url(#marca-circulo)">
        {/* Metade de cima: o fato, em tinta cheia. */}
        <rect width="96" height="96" fill="#191713" />
        {/* Metade de baixo: o voto, em cinza. */}
        <path d="M16 100 L92 -4 L100 -4 L100 100 Z" fill="#6d675e" />
        {/* A fresta diagonal que separa as duas coisas. */}
        <path
          d="M16 100 L92 -4"
          stroke={faixa}
          strokeWidth="7"
          fill="none"
        />

        {/* O documento conferido. */}
        <path
          d="M27.5 16 h12.5 l8 8 v22.5 a3.5 3.5 0 0 1 -3.5 3.5 h-17 a3.5 3.5 0 0 1 -3.5 -3.5 v-27 a3.5 3.5 0 0 1 3.5 -3.5 Z"
          fill="#ffffff"
        />
        <path d="M40 16 v8 h8 Z" fill="#d6d1c8" />
        <path
          d="M28.5 27 h13 M28.5 32 h13 M28.5 37 h9"
          stroke="#191713"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="31.5" cy="44" r="5" fill="#6d675e" />
        <path
          d="M29 44 l1.9 1.9 l3.4 -3.7"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* A urna. */}
        <rect x="48" y="54" width="32" height="22" rx="3.5" fill="#ffffff" />
        <rect x="52.5" y="58.5" width="10" height="9" rx="1.5" fill="#191713" />
        <rect x="66" y="60.5" width="2.6" height="5" rx="1" fill="#26231e" />
        <rect x="70" y="60.5" width="2.6" height="5" rx="1" fill="#26231e" />
        <rect x="74.5" y="58.5" width="8" height="9" rx="1.8" fill="#191713" />
        <path
          d="M76.4 63 l1.5 1.5 l2.8 -3"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

/**
 * Sinal de igual dentro de um circulo: a promessa de que nenhuma
 * candidatura pesa mais que outra. Usado no cartao "não damos nota".
 */
export function IconeIgualdade({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 10h7M8.5 14h7" />
    </svg>
  );
}

/** Seta para a direita: usada nos cartoes de navegacao e nos links de secao. */
export function IconeSeta({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 ${className}`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Informacao: usada nos avisos neutros (pagina provisoria, dado ausente). */
export function IconeInfo({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.6h.01" />
    </svg>
  );
}

/** Documento carimbado: marca de dado oficial. */
export function IconeDocumentoOficial({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      <path d="M5 2.5h9l5 5v14H5z" />
      <path d="M14 2.5v5h5" />
      <circle cx="12" cy="14.5" r="3.2" />
      <path d="M9.6 18.6 8.6 21l3.4-1.2 3.4 1.2-1-2.4" />
    </svg>
  );
}

/** Caneta sobre folha: marca de texto escrito pela plataforma. */
export function IconeResumo({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      <path d="M4 20.5h16" />
      <path d="M6 16.2 16.1 6.1a2 2 0 0 1 2.8 0l.5.5a2 2 0 0 1 0 2.8L9.3 19.5 4.8 20.7z" />
      <path d="M14.4 7.8l2.9 2.9" />
    </svg>
  );
}

export function IconeLinkExterno({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 ${className}`}
    >
      <path d="M13 4h7v7" />
      <path d="M20 4 10.5 13.5" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7.5A1.5 1.5 0 0 1 5 6h4.5" />
    </svg>
  );
}

export function IconeBusca({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.4 15.4 21 21" />
    </svg>
  );
}

export function IconeFechar({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 ${className}`}
    >
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function IconeFiltro({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      <path d="M3.5 5.5h17M6.5 12h11M10 18.5h4" />
    </svg>
  );
}

export function IconeSorteio({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${base} ${className}`}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}
