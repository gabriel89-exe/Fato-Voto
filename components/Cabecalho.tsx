"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ESTADO } from "@/lib/dados";

const LINKS = [
  { href: "/", rotulo: "Início" },
  { href: "/candidatos", rotulo: "Candidatos" },
  { href: "/comparar", rotulo: "Comparar" },
];

export default function Cabecalho() {
  const caminho = usePathname();
  const [rolado, setRolado] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > 4);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const ativo = (href: string) =>
    href === "/" ? caminho === "/" : caminho.startsWith(href);

  return (
    <header
      className={`sticky top-[var(--altura-tarja)] z-40 border-b-2 border-tinta-900 bg-papel-alta transition-shadow duration-200 ${
        rolado ? "shadow-[0_4px_0_0_#1b1a16]" : ""
      }`}
    >
      <div className="envelope flex h-[var(--altura-cabecalho)] items-center justify-between gap-x-3">
        <div className="flex min-w-0 items-baseline gap-3">
          <Link
            href="/"
            className="alvo-toque -ml-1 px-1 font-display text-xl font-extrabold tracking-[-0.04em] text-tinta-900 no-underline xs:text-2xl"
          >
            Fato&nbsp;<span className="text-acento">&amp;</span>&nbsp;Voto
          </Link>
          <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.2em] text-tinta-400 lg:inline">
            {ESTADO.nome} · Ed. {ESTADO.anoEleicao} · Registro público
          </span>
        </div>

        <nav aria-label="Navegação principal" className="shrink-0">
          <ul className="flex items-stretch">
            {LINKS.map((link, i) => {
              const estaAtivo = ativo(link.href);
              return (
                <li key={link.href} className={i > 0 ? "border-l border-tinta-300" : ""}>
                  <Link
                    href={link.href}
                    aria-current={estaAtivo ? "page" : undefined}
                    className={`alvo-toque px-2.5 font-mono text-[0.68rem] uppercase tracking-[0.13em] no-underline transition-colors duration-150 xs:px-3.5 xs:text-xs ${
                      estaAtivo
                        ? "bg-tinta-900 font-semibold text-papel-alta"
                        : "text-tinta-600 hover:bg-papel hover:text-tinta-900"
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
