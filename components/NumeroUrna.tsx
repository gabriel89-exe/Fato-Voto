/**
 * Numero de urna em caixinhas, no formato que aparece na urna eletronica.
 * E o dado que a pessoa realmente digita na hora de votar, entao ganha
 * destaque de forma — nunca de cor, que seria destaque de candidatura.
 */
export default function NumeroUrna({
  numero,
  tamanho = "md",
}: {
  numero: number;
  tamanho?: "sm" | "md" | "lg";
}) {
  const digitos = String(numero).split("");

  const classes = {
    sm: "h-8 w-7 text-base",
    md: "h-10 w-8 text-xl",
    lg: "h-12 w-9 text-2xl sm:h-14 sm:w-11 sm:text-3xl",
  }[tamanho];

  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      <span className="apenas-leitor">Número de urna: {numero}.</span>
      {digitos.map((digito, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`${classes} inline-flex items-center justify-center rounded-md border border-tinta-300 bg-papel-baixa font-mono font-bold tabular-nums text-tinta-900`}
        >
          {digito}
        </span>
      ))}
    </span>
  );
}
