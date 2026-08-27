import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Bloco de papel — o `.painel` da GAZETA como componente.
 *
 * REGRA DE PRODUTO: todo Card que representa uma candidatura tem de sair
 * daqui com exatamente a mesma moldura, a mesma sombra e o mesmo peso.
 * Nao existe `variant="destaque"` neste sistema e nao deve passar a
 * existir: destaque visual em uma ficha e nao em outra e recomendacao
 * disfarcada. Para variar, varie o CONTEUDO, nunca a moldura.
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col border-2 border-tinta-900 bg-papel-alta shadow-bloco-sm",
        className,
      )}
      {...props}
    />
  );
}

/** Cabecote do bloco. Fica separado do corpo por um fio fino. */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5 border-b border-tinta-300 px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-display text-lg font-bold leading-tight tracking-[-0.02em] text-tinta-900",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-tinta-600", className)}
      {...props}
    />
  );
}

/** Canto superior direito do cabecote — para acao ou folio. */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("ml-auto self-start", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 py-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "mt-auto flex items-center gap-3 border-t border-tinta-300 px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
};
