"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Grupo de alternancia — a "regua de cargo" da lista de candidatos:
 * Todos / Governador / Senador.
 *
 * Os itens se encaixam num unico bloco com filete entre eles, como as
 * casas de um formulario impresso. O item ligado e tinta cheia.
 */
const variantesItem = cva(
  cn(
    "inline-flex min-h-toque flex-1 items-center justify-center gap-2 whitespace-nowrap px-3.5 py-2.5",
    "font-mono text-[0.7rem] font-medium uppercase tracking-[0.13em] text-tinta-700 transition-colors",
    "border-l-2 border-tinta-900 first:border-l-0",
    "hover:bg-papel",
    "data-[state=on]:bg-tinta-900 data-[state=on]:font-semibold data-[state=on]:text-papel-alta",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ),
  { variants: {}, defaultVariants: {} },
);

function ToggleGroup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        "inline-flex w-fit items-stretch border-2 border-tinta-900 bg-papel-alta shadow-bloco-sm",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof variantesItem>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(variantesItem(), className)}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
