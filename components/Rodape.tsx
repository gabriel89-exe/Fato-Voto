import Link from "next/link";

/** Rodape presente em todas as paginas, com os links obrigatorios. */
export default function Rodape() {
  return (
    <footer className="mt-12 border-t border-tinta-200 bg-superficie-alta">
      <div className="envelope flex flex-col gap-4 py-8">
        <nav aria-label="Links do rodapé">
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            <li>
              <Link href="/metodologia" className="alvo-toque px-2 text-tinta-800">
                Metodologia
              </Link>
            </li>
            <li>
              <Link href="/fontes" className="alvo-toque px-2 text-tinta-800">
                Fontes dos dados
              </Link>
            </li>
            <li>
              <Link href="/candidatos" className="alvo-toque px-2 text-tinta-800">
                Lista de candidatos
              </Link>
            </li>
            <li>
              <Link href="/comparar" className="alvo-toque px-2 text-tinta-800">
                Comparar candidatos
              </Link>
            </li>
          </ul>
        </nav>

        <div className="max-w-2xl space-y-2 text-sm text-tinta-700">
          <p>
            <strong>Este site é um protótipo.</strong> Pessoas, partidos, siglas,
            números, propostas, votações e valores são inventados para testar a
            interface. Nada aqui descreve pessoas ou partidos reais.
          </p>
          <p>
            Esta plataforma não recomenda, não classifica, não pontua e não
            ordena candidatos por mérito. Ela mostra os dados e deixa a escolha
            com você.
          </p>
        </div>
      </div>
    </footer>
  );
}
