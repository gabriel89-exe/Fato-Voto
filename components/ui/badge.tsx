import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Etiqueta de recorte — o `.chip` da GAZETA como componente.
 *
 * Aviso de produto: `Badge` NUNCA deve ganhar cor por candidatura,
 * partido ou situacao de registro. Um selo colorido em uma ficha e nao
 * em outra e exatamente o destaque que este site nao pode dar.
 *
 * A etiqueta QUEBRA LINHA e nunca passa da largura do pai. Etiqueta
 * curta como "PT" nao quebra de qualquer jeito; a longa quebrava a
 * pagina: "Requerimento de Registro de Frente Parlamentar — 284" pede
 * 588px, e a 375px empurrava a ficha inteira para a rolagem lateral.
 * Era o efeito mais visivel do problema, porque arrastava a PAGINA,
 * nao um bloco.
 */
const variantesBadge = cva(
  "inline-flex w-fit max-w-full shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium no-underline [&_svg]:size-3 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        contorno: "border-tinta-900 bg-papel-alta text-tinta-800",
        solido: "border-tinta-900 bg-tinta-900 text-papel-alta",
        discreto: "border-tinta-200 bg-papel-baixa text-tinta-700",
        /** Marca de bloco oficial. Usar so junto de <DadoOficial>. */
        oficial: "border-oficial-borda bg-oficial-fundo text-oficial-texto",
        /** Marca de texto escrito pela plataforma. */
        plataforma: "border-resumo-borda bg-resumo-fundo text-resumo-texto",
      },
    },
    defaultVariants: { variant: "contorno" },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof variantesBadge> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(variantesBadge({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, variantesBadge };
