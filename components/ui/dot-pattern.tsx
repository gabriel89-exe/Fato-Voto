"use client";

import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Malha de pontos decorativa. Preenche o contêiner e reage ao resize.
 *
 * A versão do registro do Magic UI trazia um modo `glow`: cada ponto
 * pulsava com atraso e duração sorteados por `Math.random()`. Saiu
 * inteiro, por dois motivos.
 *
 * O primeiro é que ninguém usava — o único uso, na home, é estático.
 * O segundo é que sortear no corpo do render dá valor diferente no
 * servidor e no cliente, o que neste projeto é problema de verdade: a
 * ordem das candidaturas é sorteada com semente fixa por dia
 * justamente para ser reproduzível e conferível por qualquer pessoa.
 * Aleatoriedade não determinística não tem lugar aqui.
 *
 * `aria-hidden` porque é ornamento: não há informação nos pontos.
 */
interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  /** Espaçamento horizontal entre pontos. */
  width?: number;
  /** Espaçamento vertical entre pontos. */
  height?: number;
  /** Deslocamento do padrão inteiro. */
  x?: number;
  y?: number;
  /** Deslocamento de cada ponto dentro da célula. */
  cx?: number;
  cy?: number;
  /** Raio do ponto. */
  cr?: number;
  className?: string;
}

export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}: DotPatternProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const medir = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  const colunas = Math.ceil(dimensions.width / width);
  const linhas = Math.ceil(dimensions.height / height);

  const pontos = Array.from({ length: colunas * linhas }, (_, i) => ({
    x: (i % colunas) * width + cx + x,
    y: Math.floor(i / colunas) * height + cy + y,
  }));

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      {...props}
    >
      {pontos.map((ponto) => (
        <circle
          key={`${ponto.x}-${ponto.y}`}
          cx={ponto.x}
          cy={ponto.y}
          r={cr}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
