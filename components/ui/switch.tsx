"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

/**
 * Chave liga/desliga. Retangular, com o cursor quadrado — nada de
 * pilula arredondada, que destoaria do resto.
 *
 * Use so para preferencia de exibicao que vale para a tela inteira
 * (por exemplo "mostrar valores corrigidos pela inflacao"). Para
 * recorte de dado, prefira Checkbox: da para ler o estado sem
 * interpretar a metafora do interruptor.
 */
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 items-center border border-tinta-200 bg-papel-baixa p-0.5 transition-colors",
        "data-[state=checked]:border-acento data-[state=checked]:bg-acento",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 bg-tinta-900 transition-transform duration-150 ease-suave",
          "data-[state=checked]:translate-x-5 data-[state=checked]:bg-papel-alta",
          "data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
