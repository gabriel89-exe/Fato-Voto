import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Botao da GAZETA.
 *
 * Estrutura do shadcn/ui (cva + asChild), aparencia do site: cantos
 * vivos, filete de 2px e sombra dura deslocada. O hover levanta o bloco
 * 2px na diagonal e a sombra vira azul de carimbo; o active afunda.
 *
 * `no-underline` e obrigatorio no base: o globals.css sublinha todo <a>,
 * e com `asChild` este componente vira <a> o tempo todo.
 *
 * Nao ha `focus-visible:outline-none` aqui de proposito. O foco do site
 * inteiro e o contorno de 3px definido em globals.css; matar o outline
 * aqui (como o shadcn faz por padrao) quebraria essa unidade.
 */
const variantesBotao = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap border-2 font-mono font-semibold uppercase no-underline transition-[transform,box-shadow,background-color] duration-150 ease-suave disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Acao principal da tela. Bloco de tinta cheia. */
        primario:
          "border-tinta-900 bg-tinta-900 text-papel-alta shadow-bloco-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-acento-forte hover:shadow-bloco-acento active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_0_#1b1a16]",
        /** Acao secundaria. Mesma moldura, fundo de papel. */
        secundario:
          "border-tinta-900 bg-papel-alta text-tinta-900 shadow-bloco-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-papel hover:shadow-bloco active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_0_#1b1a16]",
        /** Terciaria: sem moldura ate o hover. Para barras de ferramentas. */
        fantasma:
          "border-transparent bg-transparent text-tinta-700 hover:border-tinta-900 hover:bg-papel-alta hover:text-tinta-900",
        /** Acao dentro de texto corrido. */
        elo: "border-transparent bg-transparent p-0 text-acento underline decoration-acento/40 underline-offset-[3px] hover:decoration-acento",
        /**
         * Acao destrutiva. Sem vermelho — a distincao e a moldura dupla
         * e o texto, nunca a cor (ver a regra em globals.css).
         */
        destrutivo:
          "border-double border-4 border-tinta-950 bg-papel-alta text-tinta-950 shadow-bloco-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-tinta-950 hover:text-papel-alta active:translate-x-0 active:translate-y-0",
      },
      size: {
        sm: "min-h-[38px] px-3 py-2 text-xs tracking-[0.08em] [&_svg]:size-3.5",
        md: "min-h-toque px-4 py-2.5 text-sm tracking-[0.08em] [&_svg]:size-4",
        lg: "min-h-[52px] px-6 py-3.5 text-base tracking-[0.1em] [&_svg]:size-5",
        icone: "min-h-toque min-w-toque p-0 [&_svg]:size-4",
      },
    },
    compoundVariants: [
      { variant: "elo", size: "md", className: "min-h-0 px-0 py-0" },
      { variant: "elo", size: "sm", className: "min-h-0 px-0 py-0" },
    ],
    defaultVariants: { variant: "primario", size: "md" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof variantesBotao> & {
    /** Renderiza o filho no lugar do <button> — use com <Link>. */
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(variantesBotao({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, variantesBotao };
