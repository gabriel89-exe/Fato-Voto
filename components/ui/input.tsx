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
        "min-h-toque w-full rounded border border-tinta-300 bg-papel-alta px-3.5 py-2.5 text-base text-tinta-900 transition-colors placeholder:text-tinta-500 hover:border-tinta-400 disabled:cursor-not-allowed disabled:opacity-60",
        "file:border-0 file:bg-transparent file:font-mono file:text-sm file:font-medium file:uppercase file:text-tinta-900",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
