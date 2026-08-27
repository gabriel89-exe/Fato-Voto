import { IconeDocumentoOficial, IconeLinkExterno } from "@/components/icones";
import { dataCurta } from "@/lib/formato";

/**
 * Bloco de DADO OFICIAL.
 *
 * Metade do par que estrutura o site inteiro. A outra metade e
 * <ResumoPlataforma>. Os dois precisam ser distinguiveis em um relance,
 * sem ler o rodape, entao a diferenca esta em quatro dimensoes ao mesmo
 * tempo (nao so na cor):
 *
 *   - temperatura: azul frio  x  areia quente
 *   - moldura:     barra solida a esquerda  x  contorno tracejado
 *   - cantos:      quase retos  x  bem arredondados
 *   - icone:       documento carimbado  x  caneta
 */
export default function DadoOficial({
  titulo,
  fonte,
  coletadoEm,
  urlOriginal,
  children,
  className = "",
}: {
  titulo?: string;
  fonte: string;
  coletadoEm: string;
  urlOriginal?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-sm border border-l-[6px] border-oficial-borda bg-oficial-fundo ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-oficial-leve px-4 py-2 text-oficial-texto">
        <IconeDocumentoOficial />
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em]">
          Dado oficial
        </p>
        {titulo ? (
          <>
            <span aria-hidden="true" className="text-oficial-borda/50">
              |
            </span>
            <h3 className="text-sm font-semibold text-oficial-texto">{titulo}</h3>
          </>
        ) : null}
      </div>

      <div className="px-4 py-3 text-tinta-900">{children}</div>

      <footer className="border-t border-oficial-leve px-4 py-2">
        <p className="rotulo-meta text-oficial-texto">
          Fonte: {fonte}. Coletado em {dataCurta(coletadoEm)}.
          {urlOriginal ? (
            <>
              {" "}
              <a
                href={urlOriginal}
                className="inline-flex items-center gap-1 font-medium text-oficial-texto"
                rel="nofollow noopener"
              >
                Ver documento de origem
                <IconeLinkExterno />
              </a>
            </>
          ) : null}
        </p>
      </footer>
    </section>
  );
}
