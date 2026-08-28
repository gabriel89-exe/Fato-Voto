import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Tabela de registro.
 *
 * Uso previsto: lista de votacoes nominais, bens declarados e presenca
 * (passo 5). Numero SEMPRE em `tabular-nums` e alinhado a direita, para
 * as colunas baterem de linha em linha.
 *
 * A tabela nasce dentro de um container com rolagem horizontal propria:
 * em 360px de largura a pagina inteira nao pode rolar de lado.
 */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="w-full overflow-x-auto border border-tinta-200"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("border-b border-tinta-200 bg-papel-baixa", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("bg-papel-alta", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-tinta-200 bg-papel-baixa font-medium",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-tinta-300 transition-colors last:border-b-0 hover:bg-papel data-[state=selected]:bg-papel-baixa",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "whitespace-nowrap px-3 py-2.5 text-left align-middle",
        "font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-tinta-600",
        "[&:has([role=checkbox])]:w-px",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("px-3 py-2.5 align-top text-tinta-800", className)}
      {...props}
    />
  );
}

/** Celula de numero: mono, tabular, a direita. */
function TableCellNumero({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <TableCell
      className={cn("text-right font-mono tabular-nums", className)}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 text-left text-sm text-tinta-600", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCellNumero,
  TableCaption,
};
