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
    <footer className="casca casca-planta mt-20">
      <div className="envelope grid gap-10 py-14 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-16">
        <div className="max-w-leitura space-y-4">
          <p className="flex items-center gap-2 text-lg font-bold text-casca-texto">
            <IconeMarca className="text-casca-texto" />
            <span className="font-display">
              Fato <span className="text-casca-suave">&amp;</span> Voto
            </span>
          </p>
          <div className="space-y-3 text-sm text-casca-suave">
            <p>
              <strong className="text-casca-texto">
                Este site é um protótipo.
              </strong>{" "}
              Pessoas, partidos, siglas, números, propostas, votações e valores
              são inventados para testar a interface. Nada aqui descreve pessoas
              ou partidos reais.
            </p>
            <p>
              Esta plataforma não recomenda, não classifica, não pontua e não
              ordena candidatos por mérito. Ela mostra os dados e deixa a escolha
              com você.
            </p>
          </div>
        </div>

        <nav aria-label="Links do rodapé" className="sm:text-right">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-casca-suave">
            Navegar
          </p>
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="alvo-toque justify-start px-0 text-casca-texto no-underline transition-colors hover:text-white sm:justify-end"
                >
                  {link.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-casca-borda">
        <p className="envelope py-4 font-mono text-xs uppercase tracking-[0.14em] text-casca-suave">
          Protótipo · {ESTADO.nome} ({ESTADO.sigla}) · eleição {ESTADO.anoEleicao}{" "}
          · dados fictícios
        </p>
      </div>
    </footer>
  );
}
