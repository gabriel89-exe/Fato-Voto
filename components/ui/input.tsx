import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Campo de texto. Espelha a classe `.campo` do globals.css: moldura de
 * tinta, sombra interna de prensa e altura minima de 46px (alvo de
 * toque). O caret e mono porque tudo que e dado, neste site, e mono.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "min-h-[46px] w-full border-2 border-tinta-900 bg-papel-alta px-3.5 py-3 font-mono text-base text-tinta-900 shadow-[inset_2px_2px_0_0_rgba(27,26,22,0.08)] transition-shadow placeholder:text-tinta-400 disabled:cursor-not-allowed disabled:opacity-60",
        "file:border-0 file:bg-transparent file:font-mono file:text-sm file:font-medium file:uppercase file:text-tinta-900",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
