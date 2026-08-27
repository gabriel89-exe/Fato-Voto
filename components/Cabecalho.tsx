"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <header className="border-b border-tinta-200 bg-superficie-alta">
      <div className="envelope flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
        <Link
          href="/"
          className="alvo-toque -mx-2 px-2 text-lg font-bold text-tinta-900 no-underline"
        >
          Fato <span className="text-tinta-500">&amp;</span> Voto
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={ativo(link.href) ? "page" : undefined}
                  className={`alvo-toque rounded-md px-3 text-sm no-underline sm:text-base ${
                    ativo(link.href)
                      ? "bg-tinta-100 font-semibold text-tinta-900"
                      : "text-tinta-700 hover:bg-tinta-100"
                  }`}
                >
                  {link.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
