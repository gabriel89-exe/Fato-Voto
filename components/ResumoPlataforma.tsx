import { IconeResumo } from "@/components/icones";
import { dataCurta } from "@/lib/formato";

/**
 * Bloco de TEXTO ESCRITO PELA PLATAFORMA.
 *
 * Par de <DadoOficial>. Ver o comentario daquele arquivo: a distincao
 * entre os dois usa cor, moldura, cantos e icone ao mesmo tempo, de
 * proposito, para funcionar tambem para quem nao distingue as cores.
 */
export default function ResumoPlataforma({
  titulo,
  revisadoEm,
  children,
  className = "",
}: {
  titulo?: string;
  revisadoEm: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border-2 border-dashed border-resumo-borda bg-resumo-fundo ${className}`}
    >
      <div className="flex items-center gap-2 border-b-2 border-dashed border-resumo-leve px-4 py-2 text-resumo-texto">
        <IconeResumo />
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em]">
          Resumo desta plataforma
        </p>
        {titulo ? (
          <>
            <span aria-hidden="true" className="text-resumo-borda/50">
              |
            </span>
            <h3 className="text-sm font-semibold text-resumo-texto">{titulo}</h3>
          </>
        ) : null}
      </div>

      <div className="px-4 py-3 text-tinta-900">{children}</div>

      <footer className="border-t-2 border-dashed border-resumo-leve px-4 py-2">
        <p className="rotulo-meta text-resumo-texto">
          Resumo produzido por esta plataforma, não pela candidatura. Revisado em{" "}
          {dataCurta(revisadoEm)}. Não substitui a leitura do documento oficial.
        </p>
      </footer>
    </section>
  );
}
