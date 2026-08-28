"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import { cn } from "@/lib/utils";

/**
 * Botao de dois estados, isolado. Para um conjunto exclusivo use
 * ToggleGroup, que ja resolve a moldura compartilhada.
 */
function Toggle({
  className,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(
        "inline-flex min-h-toque items-center justify-center gap-2 whitespace-nowrap border border-tinta-200 bg-papel-alta px-3.5 py-2.5",
        "text-base font-medium text-tinta-700 transition-colors",
        "hover:bg-papel",
        "data-[state=on]:border-acento data-[state=on]:bg-acento data-[state=on]:font-semibold data-[state=on]:text-white",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export { Toggle };
