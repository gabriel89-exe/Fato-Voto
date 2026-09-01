import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Tabela de registro.
 *
 * Uso previsto: cota parlamentar, votacoes nominais, bens declarados e
 * proposicoes. Numero SEMPRE em `tabular-nums` e alinhado a direita,
 * para as colunas baterem de linha em linha.
 *
 * ================================================================
 * NO CELULAR A TABELA VIRA LISTA DE FICHAS.
 *
 * A tabela nascia dentro de um container com rolagem horizontal
 * propria. Resolvia o sintoma — a pagina inteira nao rolava de lado —
 * e deixava o problema: a 360px sobra pouco mais de 280px de largura
 * util, e a tabela das dez maiores notas mede 581px. Quem abria os
 * gastos de um deputado no telefone tinha que arrastar cada tabela
 * para o lado para ler uma linha, sem nada na tela avisando que dava
 * para arrastar.
 *
 * Abaixo de 640px cada linha vira uma ficha: o rotulo da coluna sai do
 * cabecalho e passa a acompanhar a celula, vindo do atributo
 * `data-rotulo`. Por isso toda celula recebe `rotulo`. Celula sem
 * rotulo ocupa a ficha inteira — e o lugar disso e a primeira coluna,
 * a que da nome a linha.
 *
 * Os papeis ARIA (`table`, `row`, `cell`...) estao escritos a mao de
 * proposito: `display: block` no `<table>` apaga a semantica de tabela
 * que o navegador deriva do elemento, e sem ela o leitor de tela perde
 * a relacao entre celula e cabecalho. Declarados, os papeis sobrevivem
 * a mudanca de layout. O `<thead>` continua no DOM, so escondido —
 * e dele que vem a associacao com a coluna.
 *
 * O que ainda rolar de lado (tela larga, janela estreita) rola com
 * barra visivel e estilizada, e sem sequestrar o gesto de voltar do
 * navegador. Ver `.tabela-rolagem` em app/globals.css.
 * ================================================================
 */
function Table({
  className,
  empilhada = true,
  ...props
}: React.ComponentProps<"table"> & {
  /** Vira lista de fichas abaixo de 640px. Desligue so com motivo. */
  empilhada?: boolean;
}) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "tabela-rolagem w-full border border-tinta-200",
        empilhada && "border-0 sm:border",
      )}
    >
      <table
        role="table"
        data-slot="table"
        className={cn(
          "w-full caption-bottom text-sm",
          empilhada && "tabela-empilhada",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      role="rowgroup"
      data-slot="table-header"
      className={cn("border-b border-tinta-200 bg-papel-baixa", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      role="rowgroup"
      data-slot="table-body"
      className={cn("bg-papel-alta", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      role="rowgroup"
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
      role="row"
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
      role="columnheader"
      scope="col"
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

function TableCell({
  className,
  rotulo,
  larga,
  ...props
}: React.ComponentProps<"td"> & {
  /**
   * O nome da coluna. No celular ele acompanha a celula, porque o
   * cabecalho sai da tela. Sem rotulo a celula ocupa a ficha inteira:
   * e o que se quer na coluna que da nome a linha, e so nela.
   */
  rotulo?: string;
  /**
   * Celula de texto corrido — ementa, objeto de votacao, descricao de
   * bem. Na ficha o rotulo vai POR CIMA e o texto usa a largura toda:
   * espremido em meia coluna, texto longo vira coluna de duas palavras.
   */
  larga?: boolean;
}) {
  return (
    <td
      role="cell"
      data-slot="table-cell"
      data-rotulo={rotulo}
      className={cn(
        "px-3 py-2.5 align-top text-tinta-800",
        larga && "celula-larga",
        className,
      )}
      {...props}
    />
  );
}

/** Celula de numero: mono, tabular, a direita. */
function TableCellNumero({
  className,
  ...props
}: React.ComponentProps<typeof TableCell>) {
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
