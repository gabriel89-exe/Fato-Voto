"use client";

import { useId, useState } from "react";

import { IconeSeta } from "@/components/icones";

/**
 * Bloco que começa fechado e abre quando alguém pede.
 *
 * Existe porque a aba Mandato virou uma parede: proposições por tipo,
 * proposições recentes com ementa, votações nominais, gastos por
 * categoria, emendas. Tudo relevante, tudo aberto ao mesmo tempo, e o
 * resultado é que nada se lê.
 *
 * O conteúdo só é MONTADO no clique — não fica escondido com CSS. Numa
 * ficha de deputado com 2.843 proposições, a diferença entre esconder e
 * não renderizar é o tamanho do HTML de 575 páginas estáticas.
 *
 * O preço disso é honesto e vale dizer: o que não está no DOM não é
 * achado pelo Ctrl+F nem lido de uma vez por leitor de tela. Por isso o
 * botão diz sempre QUANTOS itens há dentro — quem procura sabe se vale
 * abrir antes de abrir.
 */
export default function Recolhivel({
  titulo,
  resumo,
  children,
  abertoPorPadrao = false,
}: {
  titulo: React.ReactNode;
  /** O que há lá dentro, em número ou frase curta. Aparece fechado. */
  resumo?: string;
  children: React.ReactNode;
  abertoPorPadrao?: boolean;
}) {
  const [aberto, setAberto] = useState(abertoPorPadrao);
  const id = useId();

  return (
    <div className="border border-tinta-200 bg-papel-alta">
      <h5>
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={id}
          onClick={() => setAberto(!aberto)}
          className="flex min-h-toque w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-papel"
        >
          <span className="min-w-0">
            <span className="block font-medium text-tinta-900">{titulo}</span>
            {resumo ? (
              <span className="block text-xs text-tinta-600">{resumo}</span>
            ) : null}
          </span>
          <span
            aria-hidden="true"
            className={`shrink-0 text-acento transition-transform ${
              aberto ? "-rotate-90" : "rotate-90"
            }`}
          >
            <IconeSeta />
          </span>
        </button>
      </h5>

      {aberto ? (
        <div id={id} className="border-t border-tinta-200 px-4 py-4">
          {children}
        </div>
      ) : null}
    </div>
  );
}
