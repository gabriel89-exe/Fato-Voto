import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Aviso — o `.aviso-callout` da GAZETA como componente.
 *
 * As tres variantes existem para separar QUEM ESTA FALANDO, que e a
 * espinha dorsal deste site:
 *
 *   neutro     — a interface avisando algo sobre ela mesma
 *                (pagina provisoria, filtro sem resultado).
 *   oficial    — dado que veio do orgao de origem.
 *   plataforma — texto escrito por nos, que nao substitui o documento.
 *
 * Nenhuma delas e "erro" ou "sucesso": este site nao emite juizo. Se
 * precisar de um estado de falha, use `neutro` e diga no texto.
 */
const variantesAviso = cva(
  "relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 border-2 px-4 py-3 text-sm [&>svg]:mt-0.5 [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        neutro:
          "border-tinta-900 bg-papel-alta text-tinta-700 before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:bg-tinta-900 [&>svg]:text-tinta-500",
        oficial:
          "border-l-[6px] border-oficial-borda bg-oficial-fundo text-tinta-900 [&>svg]:text-oficial-texto",
        plataforma:
          "border-dashed border-resumo-borda bg-resumo-fundo text-tinta-900 [&>svg]:text-resumo-texto",
      },
    },
    defaultVariants: { variant: "neutro" },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof variantesAviso>) {
  return (
    <div
      data-slot="alert"
      // `status` e nao `alert`: aviso de contexto nao deve interromper
      // quem usa leitor de tela no meio da leitura.
      role="status"
      className={cn(variantesAviso({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 font-display text-base font-bold leading-tight tracking-[-0.02em] text-tinta-900",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-2 leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, variantesAviso };
