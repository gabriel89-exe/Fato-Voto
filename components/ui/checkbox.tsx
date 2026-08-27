"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Caixa de marcacao. Quadrada, moldura de 2px, marcada = bloco de tinta.
 *
 * Uso previsto: filtros facetados da lista (passo 4) e selecao de ate
 * tres candidaturas no comparador (passo 6).
 *
 * A caixa tem 20px, menor que o alvo de toque de 44px — envolva sempre
 * num <label> com padding, como no exemplo do kit em /interface.
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 border-2 border-tinta-900 bg-papel-alta transition-colors",
        "data-[state=checked]:bg-tinta-900 data-[state=checked]:text-papel-alta",
        "data-[state=indeterminate]:bg-tinta-900 data-[state=indeterminate]:text-papel-alta",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        {props.checked === "indeterminate" ? (
          <Minus className="size-3.5" strokeWidth={3} />
        ) : (
          <Check className="size-3.5" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
