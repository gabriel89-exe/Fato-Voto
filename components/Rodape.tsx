import Link from "next/link";
import { ESTADO } from "@/lib/dados";

const LINKS = [
  { href: "/metodologia", rotulo: "Metodologia" },
  { href: "/fontes", rotulo: "Fontes dos dados" },
  { href: "/candidatos", rotulo: "Lista de candidatos" },
  { href: "/comparar", rotulo: "Comparar candidatos" },
  // Pagina de trabalho, nao de produto. Fica so aqui, fora da navegacao
  // principal, e sai do rodape quando o prototipo virar site.
  { href: "/interface", rotulo: "Kit de interface" },
];

/** Rodape / expediente — presente em todas as paginas. */
export default function Rodape() {
  return (
    <footer className="mt-20 border-t-2 border-tinta-900 bg-papel-alta">
      <div className="envelope grid gap-8 py-12 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-16">
        <div className="max-w-leitura">
          <p className="font-display text-2xl font-extrabold tracking-[-0.04em] text-tinta-900">
            Fato <span className="text-acento">&amp;</span> Voto
          </p>
          <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-tinta-400">
            {ESTADO.nome} ({ESTADO.sigla}) · Edição {ESTADO.anoEleicao} ·
            Protótipo
          </p>

          <div className="mt-5 space-y-3 border-l-2 border-tinta-900 pl-4 text-sm text-tinta-700">
            <p>
              <strong className="font-bold text-tinta-900">
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
          <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-tinta-400">
            Seções
          </p>
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="alvo-toque justify-start px-0 font-mono text-xs uppercase tracking-[0.08em] no-underline text-tinta-800 hover:text-acento sm:justify-end"
                >
                  {link.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-tinta-300">
        <p className="envelope py-4 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-tinta-400">
          Protótipo · dados fictícios · nenhuma pessoa, partido ou órgão real é
          descrito
        </p>
      </div>
    </footer>
  );
}
