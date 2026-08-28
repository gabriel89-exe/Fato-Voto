"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ELEICAO, ESTADO } from "@/lib/eleicao";

/**
 * Cabeçalho.
 *
 * Três destinos, nada mais — por isso não há menu sanduíche: um botão
 * que esconde três links custa um toque a mais e um estado a mais para
 * ganhar nada.
 *
 * No celular a navegação desce para uma segunda linha e ocupa a
 * largura toda, com os três itens dividindo o espaço em partes iguais.
 * Antes ela se espremia à direita do logotipo, o que empurrava os
 * alvos para menos de 48px e para o canto mais difícil de alcançar com
 * o polegar.
 *
 * O item atual é marcado por quatro sinais — fundo, cor, peso e
 * `aria-current`. Cor sozinha não serve para quem não a distingue.
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
    <header className="sticky top-[var(--altura-tarja)] z-40 border-b border-tinta-200 bg-papel-alta/90 backdrop-blur-md">
      <div className="envelope flex min-h-[var(--altura-cabecalho)] flex-col justify-center gap-2 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <Link
          href="/"
          className="group flex flex-col no-underline"
          aria-label="Fato e Voto, página inicial"
        >
          <span className="font-display text-2xl font-bold leading-none tracking-tight text-tinta-950">
            Fato{" "}
            <span className="text-acento transition-colors group-hover:text-acento-forte">
              &amp;
            </span>{" "}
            Voto
          </span>
          <span className="mt-1 text-xs text-tinta-500">
            {ESTADO.nome} · Eleição {ELEICAO.ano}
          </span>
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => {
              const estaAtivo = ativo(link.href);
              return (
                <li key={link.href} className="flex-1 sm:flex-none">
                  <Link
                    href={link.href}
                    aria-current={estaAtivo ? "page" : undefined}
                    className={`alvo-toque w-full rounded-lg px-3 text-base no-underline transition-colors ${
                      estaAtivo
                        ? "bg-acento-leve font-bold text-acento-forte"
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
