import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Botão.
 *
 * Estrutura do shadcn/ui (cva + asChild), aparência do Padrão Digital
 * de Governo: azul cheio na ação principal, contorno azul na
 * secundária, cantos levemente arredondados, texto em caixa normal.
 *
 * Era versal monoespaçado com sombra dura deslocada. Saiu: versal com
 * espacejamento largo é mais lento de ler, e a sombra dura dava peso de
 * "botão de jogo" a cada ação da tela.
 *
 * `no-underline` é obrigatório no base: o globals.css sublinha todo
 * <a>, e com `asChild` este componente vira <a> o tempo todo.
 *
 * Não há `focus-visible:outline-none` aqui, de propósito. O foco do
 * site é o contorno de 3px definido em globals.css; matar o outline
 * aqui (como o shadcn faz por padrão) quebraria essa unidade.
 */
const variantesBotao = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded border font-semibold no-underline transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Ação principal da tela. */
        primario:
          "border-acento bg-acento text-white hover:border-acento-forte hover:bg-acento-forte active:bg-acento-escuro",
        /** Ação secundária: mesma forma, contorno em vez de preenchimento. */
        secundario:
          "border-acento bg-transparent text-acento hover:bg-acento-leve active:bg-acento-leve",
        /** Terciária: sem contorno até o hover. */
        fantasma:
          "border-transparent bg-transparent text-acento hover:bg-acento-leve",
        /** Ação dentro de texto corrido. */
        elo: "border-transparent bg-transparent p-0 font-normal text-acento underline underline-offset-[3px] hover:text-acento-forte",
        /**
         * Ação destrutiva. Sem vermelho — a distinção é a moldura mais
         * grossa e o texto, nunca a cor.
         */
        destrutivo:
          "border-2 border-tinta-950 bg-transparent text-tinta-950 hover:bg-tinta-950 hover:text-white",
      },
      size: {
        sm: "min-h-[40px] px-3 py-2 text-sm [&_svg]:size-4",
        md: "min-h-toque px-4 py-2.5 text-base [&_svg]:size-5",
        lg: "min-h-[56px] px-6 py-3 text-lg [&_svg]:size-5",
        icone: "min-h-toque min-w-toque p-0 [&_svg]:size-5",
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
