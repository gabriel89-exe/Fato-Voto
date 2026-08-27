import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` — juntador de classes do shadcn/ui.
 *
 * `clsx` resolve condicionais e `tailwind-merge` desempata classes
 * conflitantes do Tailwind (a ultima vence). E o que permite passar
 * `className` para qualquer componente de `components/ui` e sobrescrever
 * o estilo padrao sem lutar com a especificidade.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
