"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type MotionProps,
  type UseInViewOptions,
  type Variants,
} from "motion/react";

/**
 * Entrada suave: o bloco surge com um leve deslocamento e desfoque.
 *
 * Adaptado do Magic UI. Três mudanças:
 *
 * 1. `como` escolhe a tag renderizada. O original é sempre `div`, o
 *    que produzia `<ul><div><li>` ao animar item de lista — HTML
 *    inválido, e um leitor de tela deixa de anunciar "lista de 6
 *    itens" quando a estrutura quebra.
 *
 * 2. `data-entrada` sai daqui, sempre. O `<noscript>` do layout usa
 *    esse seletor para forçar o conteúdo visível quando não há
 *    JavaScript — sem ele, o motion serve `opacity: 0` no HTML e a
 *    página chega em branco.
 *
 * 3. Saiu o `AnimatePresence`. Nada aqui desmonta com saída animada;
 *    ele só somava um contexto a cada bloco da página.
 *
 * E respeita `prefers-reduced-motion`. Isso PRECISA ser tratado aqui:
 * o bloco de movimento reduzido do globals.css só alcança animação e
 * transição de CSS, e o motion escreve direto no estilo do elemento,
 * quadro a quadro. A regra de CSS não o alcança.
 */
type MargemVista = UseInViewOptions["margin"];

interface BlurFadeProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  /** Tag renderizada. Use `li` dentro de lista. */
  como?: "div" | "li" | "section" | "article";
  duration?: number;
  delay?: number;
  offset?: number;
  /** Anima ao entrar na tela, em vez de na montagem. */
  inView?: boolean;
  inViewMargin?: MargemVista;
  blur?: string;
}

export function BlurFade({
  children,
  className,
  como = "div",
  duration = 0.4,
  delay = 0,
  offset = 8,
  inView = false,
  inViewMargin = "-50px",
  blur = "5px",
  ...props
}: BlurFadeProps) {
  const ref = useRef(null);
  const entrou = useInView(ref, { once: true, margin: inViewMargin });
  const semMovimento = useReducedMotion();
  const visivel = semMovimento || !inView || entrou;

  const Componente = motion[como];

  const variantes: Variants = semMovimento
    ? { escondido: { opacity: 1 }, visivel: { opacity: 1 } }
    : {
        escondido: { y: offset, opacity: 0, filter: `blur(${blur})` },
        visivel: { y: 0, opacity: 1, filter: "blur(0px)" },
      };

  return (
    <Componente
      ref={ref}
      data-entrada=""
      initial="escondido"
      animate={visivel ? "visivel" : "escondido"}
      variants={variantes}
      transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </Componente>
  );
}
