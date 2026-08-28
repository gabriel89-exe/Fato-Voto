import Link from "next/link";
import { ELEICAO, ESTADO } from "@/lib/eleicao";

const LINKS = [
  { href: "/metodologia", rotulo: "Metodologia" },
  { href: "/fontes", rotulo: "Fontes dos dados" },
  { href: "/candidatos", rotulo: "Lista de candidatos" },
  { href: "/comparar", rotulo: "Comparar candidatos" },
  // Pagina de trabalho, nao de produto: a vitrine dos componentes.
  // Fica so aqui, fora da navegacao principal.
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
            {ESTADO.nome} ({ESTADO.sigla}) · Eleição {ELEICAO.ano} · Dados
            públicos
          </p>

          <div className="mt-5 space-y-3 border-l-2 border-tinta-900 pl-4 text-sm text-tinta-700">
            <p>
              <strong className="font-bold text-tinta-900">
                Projeto autônomo.
              </strong>{" "}
              Sem vínculo, financiamento ou preferência partidária. Não faz
              campanha para ninguém e não aceita patrocínio de partido ou de
              candidatura.
            </p>
            <p>
              Esta plataforma não recomenda, não classifica, não pontua e não
              ordena candidaturas por mérito. A ordem das listas é sorteada.
              Ela mostra os dados públicos e deixa a escolha com você.
            </p>
            <p>
              Todo dado vem de fonte oficial, com a data da coleta indicada.
              Encontrou divergência entre o que está aqui e o registro oficial?{" "}
              <Link href="/fontes">Veja as fontes</Link> e nos avise.
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
          Dados do Tribunal Superior Eleitoral e da Câmara dos Deputados ·
          Registro de candidaturas ainda em julgamento
        </p>
      </div>
    </footer>
  );
}
