import Link from "next/link";
import { IconeMarca } from "@/components/icones";
import { ESTADO } from "@/lib/dados";

const LINKS = [
  { href: "/metodologia", rotulo: "Metodologia" },
  { href: "/fontes", rotulo: "Fontes dos dados" },
  { href: "/candidatos", rotulo: "Lista de candidatos" },
  { href: "/comparar", rotulo: "Comparar candidatos" },
];

/** Rodape presente em todas as paginas, com os links obrigatorios. */
export default function Rodape() {
  return (
    <footer className="relative mt-16 border-t border-tinta-200 bg-superficie-alta/70 backdrop-blur-sm">
      {/* Fio superior com leve gradiente — detalhe de chrome, sem cor de valor. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tinta-300 to-transparent"
      />

      <div className="envelope grid gap-8 py-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-12">
        <div className="max-w-xl space-y-3">
          <p className="flex items-center gap-2 text-lg font-bold text-tinta-900">
            <IconeMarca className="text-oficial-borda" />
            <span className="font-display">
              Fato <span className="text-tinta-400">&amp;</span> Voto
            </span>
          </p>
          <div className="space-y-2 text-sm text-tinta-700">
            <p>
              <strong>Este site é um protótipo.</strong> Pessoas, partidos,
              siglas, números, propostas, votações e valores são inventados para
              testar a interface. Nada aqui descreve pessoas ou partidos reais.
            </p>
            <p>
              Esta plataforma não recomenda, não classifica, não pontua e não
              ordena candidatos por mérito. Ela mostra os dados e deixa a escolha
              com você.
            </p>
          </div>
        </div>

        <nav aria-label="Links do rodapé" className="sm:text-right">
          <p className="rotulo-meta mb-3 uppercase tracking-[0.14em]">
            Navegar
          </p>
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="alvo-toque justify-start px-0 text-tinta-800 transition-colors hover:text-tinta-900 sm:justify-end"
                >
                  {link.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-tinta-100">
        <p className="envelope py-4 text-xs text-tinta-500">
          Protótipo · {ESTADO.nome} ({ESTADO.sigla}) · eleição {ESTADO.anoEleicao}{" "}
          · dados fictícios
        </p>
      </div>
    </footer>
  );
}
