import Link from "next/link";
import { IconeMarca } from "@/components/icones";
import { ELEICAO, ESTADO } from "@/lib/eleicao";

const LINKS = [
  // "O projeto" abre a lista porque é a porta de quem chegou sem saber
  // o que este site é. No cabeçalho ela NÃO entra: são três itens ali
  // por restrição de layout — um quarto passa da tela em 360px.
  { href: "/o-projeto", rotulo: "O projeto" },
  { href: "/como-funciona", rotulo: "Como funciona a política" },
  { href: "/quem-somos", rotulo: "Quem somos" },
  { href: "/metodologia", rotulo: "Metodologia" },
  { href: "/fontes", rotulo: "Fontes dos dados" },
  { href: "/privacidade", rotulo: "Privacidade e dados" },
  { href: "/candidatos", rotulo: "Lista de candidatos" },
  // "Comparar candidatos" saiu daqui junto com o menu do cabeçalho: a
  // página existe para não quebrar link antigo, mas não se anuncia
  // enquanto for só um aviso de "ainda não construído".
  //
  // Pagina de trabalho, nao de produto: a vitrine dos componentes.
  // Fica so aqui, fora da navegacao principal.
  { href: "/interface", rotulo: "Kit de interface" },
];

/** Rodape / expediente — presente em todas as paginas. */
export default function Rodape() {
  return (
    <footer className="mt-20 border-t border-tinta-950 bg-tinta-950">
      <div className="envelope grid gap-8 py-12 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-16">
        <div className="max-w-leitura">
          <div className="flex items-center gap-3">
            <IconeMarca faixa="#191713" className="h-9 w-9 text-papel-alta" />
            <div>
              <p className="text-2xl font-extrabold leading-none tracking-tight text-papel-alta">
                Fato<span className="text-papel/55">&amp;</span>Voto
              </p>
              <p className="mt-1 text-sm text-papel/65">
                {ESTADO.nome} ({ESTADO.sigla}) · Eleição {ELEICAO.ano} · Dados
                públicos
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-lg border-l-4 border-papel/40 bg-papel/5 px-4 py-4 text-sm text-papel/80">
            <p>
              <strong className="font-bold text-papel-alta">
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
              <Link href="/fontes" className="text-papel-alta decoration-papel/50 hover:decoration-papel">
                Confira na fonte
              </Link>{" "}
              e{" "}
              <Link href="/quem-somos" className="text-papel-alta decoration-papel/50 hover:decoration-papel">
                fale com a gente
              </Link>
              .
            </p>
          </div>
        </div>

        <nav aria-label="Links do rodapé" className="sm:text-right">
          <p className="mb-3 text-sm font-semibold text-papel/65">
            Seções
          </p>
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="alvo-toque justify-start px-0 text-base text-papel/80 no-underline hover:text-papel-alta hover:underline sm:justify-end"
                >
                  {link.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-tinta-800">
        <div className="envelope space-y-1 py-4 text-sm text-papel/65">
          <p>
            Dados do Tribunal Superior Eleitoral e da Câmara dos Deputados ·
            Registro de candidaturas ainda em julgamento
          </p>
          {/* Aviso legal exigido pela AGPL-3.0 para serviço em rede: o
              código que serve esta página está disponível e sob a mesma
              licença. */}
          <p>
            Código aberto sob licença AGPL-3.0 ·{" "}
            <a
              href="https://github.com/gabriel89-exe/Fato-Voto"
              target="_blank"
              rel="noopener"
              className="text-papel-alta decoration-papel/50 hover:decoration-papel"
            >
              github.com/gabriel89-exe/Fato-Voto
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
