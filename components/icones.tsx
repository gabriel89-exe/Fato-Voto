/**
 * Icones desenhados a mao em SVG. Nenhuma biblioteca de icones.
 * Todos herdam a cor do texto (currentColor) e sao decorativos:
 * quem usa leitor de tela recebe o rotulo pelo texto ao lado.
 */

type Props = { className?: string };

const base = "h-5 w-5 shrink-0";

/**
 * Marca do site. Um quadrado dividido: metade solida (o dado oficial),
 * metade tracejada (o resumo da plataforma). Ecoa o par que estrutura
 * todas as paginas, sem citar urna, cedula ou voto.
 */
export function IconeMarca({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-6 w-6 shrink-0 ${className}`}
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M12 3.2v17.6" stroke="currentColor" strokeWidth="1.4" />
      <rect
        x="4.2"
        y="4.2"
        width="7.8"
        height="15.6"
        rx="2.6"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M6.4 9h3.2M6.4 12h3.2M6.4 15h3.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14.4 9h3.2M14.4 12h3.2M14.4 15h2.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="0.1 2.7"
      />
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
