"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

/**
 * Rotulo de campo. Herda o desenho de `.rotulo-meta`: mono, versal,
 * tracado largo — a mesma voz dos rotulos de metadado das fichas.
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "inline-flex select-none items-center gap-2 text-sm font-semibold leading-snug text-tinta-500",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-60 group-data-[disabled=true]:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
