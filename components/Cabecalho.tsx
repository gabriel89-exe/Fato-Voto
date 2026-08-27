"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconeMarca } from "@/components/icones";

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
      className={`casca sticky top-[var(--altura-tarja)] z-40 border-b transition-colors duration-200 ${
        rolado
          ? "border-casca-borda bg-casca/95 shadow-casca backdrop-blur"
          : "border-transparent"
      }`}
    >
      <div className="envelope flex h-[var(--altura-cabecalho)] items-center justify-between gap-x-2 sm:gap-x-4">
        <Link
          href="/"
          className="alvo-toque -ml-1 gap-2 px-1 font-bold tracking-tight text-casca-texto no-underline"
        >
          <IconeMarca className="h-5 w-5 text-casca-texto xs:h-6 xs:w-6" />
          <span className="whitespace-nowrap font-display text-[15px] xs:text-lg">
            Fato <span className="text-casca-suave">&amp;</span> Voto
          </span>
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-0.5">
            {LINKS.map((link) => {
              const estaAtivo = ativo(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={estaAtivo ? "page" : undefined}
                    className={`alvo-toque rounded-md px-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] no-underline transition-colors duration-200 xs:px-3 xs:text-xs ${
                      estaAtivo
                        ? "bg-papel-alta font-semibold text-tinta-900"
                        : "text-casca-suave hover:bg-casca-alta hover:text-casca-texto"
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
