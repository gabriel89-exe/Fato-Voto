"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ComponentPropsWithoutRef,
} from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Número que conta até o valor final quando entra na tela.
 *
 * Adaptado do Magic UI. Três mudanças em relação ao original, todas
 * obrigatórias aqui:
 *
 * 1. O HTML renderiza o VALOR FINAL, não o inicial. O original começa
 *    escrevendo "0" e só corrige depois que o JavaScript roda — num
 *    site que informa quantas candidaturas existem, isso significa
 *    servir a página dizendo "0 candidaturas" para quem tem JS
 *    desligado, para um leitor de tela rápido e para o buscador.
 *
 * 2. Formatação em pt-BR. O original usa en-US e escreveria "1,234".
 *
 * 3. Respeita `prefers-reduced-motion`. Quem pediu menos movimento vê
 *    o número parado no valor certo, sem contagem.
 *
 * A cor vem por herança: o original fixava preto, o que atropelaria a
 * paleta.
 */
interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number;
  startValue?: number;
  delay?: number;
  decimalPlaces?: number;
}

const formatar = (valor: number, casas: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(Number(valor.toFixed(casas)));

export function NumberTicker({
  value,
  startValue = 0,
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(startValue);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const emVista = useInView(ref, { once: true, margin: "0px" });

  /* Antes da pintura: se o movimento é permitido, recua o texto para o
     valor inicial. Fora daqui o número já está correto no HTML, então
     nada pisca para quem tem movimento reduzido ou JS desligado. */
  useLayoutEffect(() => {
    const parado = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (parado || !ref.current) return;
    ref.current.textContent = formatar(startValue, decimalPlaces);
  }, [startValue, decimalPlaces]);

  useEffect(() => {
    if (!emVista) return;
    const parado = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (parado) return;

    const timer = setTimeout(() => motionValue.set(value), delay * 1000);
    return () => clearTimeout(timer);
  }, [motionValue, emVista, delay, value]);

  useEffect(
    () =>
      springValue.on("change", (atual) => {
        if (ref.current) {
          ref.current.textContent = formatar(atual, decimalPlaces);
        }
      }),
    [springValue, decimalPlaces],
  );

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums", className)}
      {...props}
    >
      {formatar(value, decimalPlaces)}
    </span>
  );
}
