"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ELEICAO, ESTADO } from "@/lib/eleicao";

/**
 * Cabeçalho.
 *
 * Três destinos, nada mais. A navegação anterior tinha rótulos em
 * versal apertado de 10px encaixados numa régua sem respiro; agora são
 * links de tamanho normal, com alvo de toque de 48px e o item atual
 * marcado por peso, sublinhado e `aria-current` — três sinais, não só
 * a cor.
 */

const LINKS = [
  { href: "/", rotulo: "Início" },
  { href: "/candidatos", rotulo: "Candidatos" },
  { href: "/comparar", rotulo: "Comparar" },
];

export default function Cabecalho() {
  const caminho = usePathname();

  const ativo = (href: string) =>
    href === "/" ? caminho === "/" : caminho.startsWith(href);

  return (
    <header className="sticky top-[var(--altura-tarja)] z-40 border-b border-tinta-200 bg-papel-alta">
      <div className="envelope flex min-h-[var(--altura-cabecalho)] flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
        <Link
          href="/"
          className="flex flex-col no-underline"
          aria-label="Fato e Voto, página inicial"
        >
          <span className="text-xl font-bold tracking-tight text-tinta-950">
            Fato <span className="text-acento">&amp;</span> Voto
          </span>
          <span className="text-xs text-tinta-600">
            {ESTADO.nome} · Eleição {ELEICAO.ano}
          </span>
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => {
              const estaAtivo = ativo(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={estaAtivo ? "page" : undefined}
                    className={`alvo-toque rounded px-3 text-base no-underline transition-colors ${
                      estaAtivo
                        ? "font-bold text-acento-forte underline decoration-2 underline-offset-8"
                        : "font-medium text-tinta-700 hover:bg-papel-baixa hover:text-acento"
                    }`}
                  >
                    {link.rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
