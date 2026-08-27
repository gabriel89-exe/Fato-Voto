"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

/**
 * Barra de proporcao.
 *
 * Uso previsto: composicao da presenca em plenario dentro de UMA ficha
 * (presente / justificada / licenca / missao / sem justificativa).
 *
 * REGRA DE PRODUTO: nao use esta barra para comparar candidaturas entre
 * si, e jamais a pinte de "cheio = bom". Ela e a fatia de um total
 * declarado, nao uma nota. O valor em texto tem de estar ao lado.
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-3 w-full overflow-hidden border-2 border-tinta-900 bg-papel-baixa",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-tinta-900 transition-transform duration-300 ease-suave"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
