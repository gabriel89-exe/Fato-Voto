"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconeMarca } from "@/components/icones";
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

/**
 * "Comparar" saiu daqui por decisão de produto, não por descuido.
 *
 * A página continua existindo — link antigo não quebra —, mas anunciar
 * no menu principal um destino que só mostra "ainda não construído" é
 * mandar a pessoa a um beco sem saída. Enquanto a comparação não for
 * feita, ela não se anuncia.
 */
/**
 * TRÊS itens, e o número é restrição de layout, não preferência.
 *
 * No celular a navegação ocupa a largura toda com os itens dividindo o
 * espaço em partes iguais. Com quatro, "Quem somos" passava 12px da
 * tela em 360px e a página rolava de lado.
 *
 * Ficam os três destinos da jornada principal: chegar, procurar,
 * entender. "Quem somos" e "Comparar" seguem no rodapé — a primeira
 * porque é página de confiança, procurada de propósito e não de
 * passagem; a segunda porque ainda não existe.
 *
 * Se um quarto item for mesmo necessário um dia, o `flex-wrap` abaixo
 * faz a régua quebrar em duas linhas em vez de estourar em silêncio.
 */
const LINKS = [
  { href: "/", rotulo: "Início" },
  { href: "/candidatos", rotulo: "Candidatos" },
  { href: "/como-funciona", rotulo: "Como funciona" },
];

export default function Cabecalho() {
  const caminho = usePathname();

  const ativo = (href: string) =>
    href === "/" ? caminho === "/" : caminho.startsWith(href);

  return (
    <header className="sticky top-[var(--altura-tarja)] z-40 border-b border-tinta-200 bg-papel-alta/90 backdrop-blur-md">
      <div className="envelope flex min-h-[var(--altura-cabecalho)] flex-col justify-center gap-2 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {/*
          A logomarca: o círculo dividido + o nome em uma palavra só,
          com o "&" em cinza — como na marca registrada do projeto. A
          fresta diagonal do círculo usa a cor do fundo do cabeçalho.
        */}
        <Link
          href="/"
          className="group flex items-center gap-3 no-underline"
          aria-label="Fato e Voto, página inicial"
        >
          <IconeMarca
            faixa="#ffffff"
            className="h-10 w-10 transition-transform duration-300 ease-suave group-hover:rotate-[-6deg] motion-reduce:group-hover:rotate-0"
          />
          <span className="flex flex-col">
            <span className="text-[1.45rem] font-extrabold leading-none tracking-tight text-tinta-950">
              Fato<span className="text-tinta-500">&amp;</span>Voto
            </span>
            <span className="mt-1 text-xs text-tinta-500">
              {ESTADO.nome} · Eleição {ELEICAO.ano}
            </span>
          </span>
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex flex-wrap items-center gap-1">
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
