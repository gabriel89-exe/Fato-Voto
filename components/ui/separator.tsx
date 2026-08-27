"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

/**
 * Filete.
 *
 * `peso="grossa"` e a regua preta que separa secoes; `peso="fina"` e o
 * fio cinza que separa itens dentro de um mesmo bloco. Sao os dois
 * unicos pesos de linha do sistema — nao invente um terceiro.
 */
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  peso = "fina",
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root> & {
  peso?: "fina" | "grossa";
}) {
  const grossa = peso === "grossa";
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        grossa ? "bg-tinta-900" : "bg-tinta-300",
        orientation === "horizontal"
          ? grossa
            ? "h-0.5 w-full"
            : "h-px w-full"
          : grossa
            ? "h-full w-0.5"
            : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
