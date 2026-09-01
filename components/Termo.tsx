"use client";

import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { obterVerbete } from "@/lib/glossario";

/**
 * Explicação de um termo, no lugar onde ele aparece.
 *
 * É a camada que faz o tour funcionar de verdade. Um tutorial lido na
 * entrada do site já foi esquecido quando a pessoa chega na tabela de
 * votações e lê "PEC 45"; a explicação aqui chega no segundo em que a
 * dúvida existe.
 *
 * POR QUE POPOVER E NÃO TOOLTIP. Tooltip não abre no toque e some para
 * boa parte dos leitores de tela. Como aqui a informação é o ponto —
 * não reforço —, o gatilho é um <button> de verdade, que abre no
 * clique, no toque e pelo teclado.
 *
 * Se o id não existir no glossário, o componente devolve o texto puro
 * em vez de quebrar: um termo sem verbete continua legível.
 */
export default function Termo({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) {
  const verbete = obterVerbete(id);
  const rotulo = children ?? verbete?.termo ?? id;

  if (!verbete) return <>{rotulo}</>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`O que significa ${verbete.termo}`}
          className="inline items-baseline gap-1 rounded text-left font-medium text-acento underline decoration-dotted decoration-from-font underline-offset-4 hover:text-acento-forte"
        >
          {rotulo}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 max-w-[calc(100vw-2rem)]">
        <p className="font-bold text-tinta-950">
          {verbete.termo}
          {verbete.nome ? (
            <span className="block text-sm font-normal text-tinta-600">
              {verbete.nome}
            </span>
          ) : null}
        </p>

        <p className="mt-2 text-tinta-700">{verbete.resumo}</p>

        {verbete.baseLegal ? (
          <p className="mt-2 text-sm text-tinta-600">{verbete.baseLegal}</p>
        ) : null}

        <p className="mt-3 text-sm">
          <Link href={`/como-funciona#${verbete.id}`}>
            Explicação completa e fontes
          </Link>
        </p>
      </PopoverContent>
    </Popover>
  );
}
