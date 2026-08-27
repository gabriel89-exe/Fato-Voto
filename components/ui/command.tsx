"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Lista filtravel com teclado (cmdk).
 *
 * Uso previsto: o seletor de candidaturas do comparador (passo 6) e uma
 * busca rapida por nome ou numero no cabecalho.
 *
 * DOIS CUIDADOS DESTE PROJETO:
 *
 * 1. Ordem. O cmdk ordena por pontuacao de similaridade, e ordem por
 *    relevancia e uma forma de destaque. Nas listas de candidatura,
 *    passe `shouldFilter={false}` e alimente a lista ja filtrada e
 *    sorteada por `lib/busca`; deixe o cmdk so cuidar do teclado.
 *
 * 2. Este e um atalho, nunca a unica porta. A busca principal continua
 *    sendo o formulario GET da home, que funciona sem JavaScript.
 */
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden border-2 border-tinta-900 bg-papel-alta text-tinta-900",
        className,
      )}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Buscar",
  description = "Digite um nome ou um número de urna.",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="apenas-leitor">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0" mostrarFechar={false}>
        <Command className="border-0">{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-2.5 border-b-2 border-tinta-900 px-3.5">
      <Search className="size-4 shrink-0 text-tinta-400" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex min-h-[46px] w-full bg-transparent py-3 font-mono text-base text-tinta-900 outline-none placeholder:text-tinta-400 disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-72 overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("px-4 py-8 text-center text-sm text-tinta-600", className)}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-tinta-900",
        "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5",
        "[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.62rem] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-tinta-400",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-tinta-300", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex min-h-[42px] cursor-default select-none items-center gap-2.5 px-2.5 py-2 text-sm outline-none",
        "data-[selected=true]:bg-tinta-900 data-[selected=true]:text-papel-alta",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto font-mono text-[0.62rem] uppercase tracking-[0.16em] text-tinta-400",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
