import { cn } from "@/lib/utils";

/**
 * Espaco reservado de carregamento.
 *
 * Retangular e do tom do papel gasto, para parecer um bloco de texto
 * ainda nao impresso. Respeita `prefers-reduced-motion` pela regra
 * global de globals.css, que zera a duracao das animacoes.
 *
 * Uso previsto: `loading.tsx` das rotas de lista e de ficha. Reproduza
 * a MESMA grade do conteudo real para a pagina nao saltar quando os
 * dados chegam.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse bg-papel-sombra", className)}
      {...props}
    />
  );
}

export { Skeleton };
