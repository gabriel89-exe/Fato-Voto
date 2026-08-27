import { iniciais } from "@/lib/formato";

/**
 * Placeholder de foto, desenhado por codigo.
 *
 * O prototipo nao usa foto de ninguem. E de proposito que o avatar e
 * IGUAL para todo mundo (mesmas cores, mesmo desenho): trocar a cor por
 * pessoa ou por partido criaria destaque visual onde nao pode haver.
 */
export default function AvatarCandidato({
  nome,
  tamanho = "md",
}: {
  nome: string;
  tamanho?: "sm" | "md" | "lg";
}) {
  const classes = {
    sm: "h-12 w-12 text-base",
    md: "h-16 w-16 text-lg",
    lg: "h-24 w-24 text-2xl sm:h-28 sm:w-28 sm:text-3xl",
  }[tamanho];

  return (
    <div
      aria-hidden="true"
      className={`${classes} flex shrink-0 items-center justify-center rounded-md border border-tinta-200 bg-tinta-100 font-semibold text-tinta-600`}
      title="Foto não disponível no protótipo"
    >
      {iniciais(nome)}
    </div>
  );
}
