"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

/**
 * Abas — desenhadas como as abas de um fichario de papel.
 *
 * A lista fica sobre a regua preta; a aba ativa e um bloco de tinta
 * cheia. O estado ativo NAO depende so de cor: muda o peso da fonte e o
 * contraste inteiro do bloco.
 *
 * Uso previsto: as abas Perfil / Proposta / Mandato / Bens da ficha de
 * candidatura (passo 5 do plano). Prefira `Tabs` a rotas separadas para
 * que a comparacao entre secoes nao perca o contexto da pessoa.
 */
function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-5", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex w-full items-stretch overflow-x-auto border-b-2 border-tinta-900",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex min-h-toque shrink-0 items-center justify-center gap-2 border-2 border-b-0 border-transparent px-4 py-2.5",
        "font-mono text-[0.7rem] font-medium uppercase tracking-[0.13em] text-tinta-600 transition-colors",
        "hover:bg-papel-alta hover:text-tinta-900",
        "data-[state=active]:border-tinta-900 data-[state=active]:bg-tinta-900 data-[state=active]:font-semibold data-[state=active]:text-papel-alta",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
