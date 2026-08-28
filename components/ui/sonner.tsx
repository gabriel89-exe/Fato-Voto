"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Avisos passageiros (sonner).
 *
 * Uso previsto e estreito: confirmar uma acao que a pessoa acabou de
 * fazer — "link da ficha copiado", "candidatura adicionada a
 * comparacao". Nada de conteudo eleitoral aqui: dado que importa vive
 * na pagina, nao num aviso que some em quatro segundos.
 *
 * O tema fica em `light` porque o site nao tem modo escuro; as cores
 * saem das variaveis da GAZETA para o aviso nao chegar com a cara
 * padrao do sonner.
 */
function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "!rounded !border-2 !border-tinta-900 !bg-papel-alta !text-tinta-900 !shadow-cartao !font-texto",
          title: "!font-display !font-semibold !tracking-[-0.02em]",
          description: "!text-tinta-600",
          actionButton:
            "!rounded !bg-tinta-900 !text-papel-alta !font-mono !text-xs !uppercase !tracking-[0.08em]",
          cancelButton:
            "!rounded !bg-papel !text-tinta-900 !font-mono !text-xs !uppercase !tracking-[0.08em]",
        },
      }}
      style={
        {
          "--normal-bg": "#faf7ee",
          "--normal-text": "#1b1a16",
          "--normal-border": "#1b1a16",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
