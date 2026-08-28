import Link from "next/link";
import KitInterface from "@/components/KitInterface";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { candidaturas, ELEICAO, ESTADO, partidosDistintos } from "@/lib/eleicao";

export const metadata = {
  title: "Kit de interface",
  description:
    "Componentes de interface do site: shadcn/ui vestido com a identidade GAZETA.",
};

/**
 * Kit de interface.
 *
 * Pagina de trabalho, nao de produto: existe para conferir num relance
 * que todo controle do site tem a mesma voz e obedece as regras de
 * neutralidade. A demonstracao em si vive em <KitInterface>, que e
 * cliente; esta casca fica no servidor so por causa do `metadata`.
 */
export default function PaginaInterface() {
  return (
    <div className="envelope py-8 sm:py-12">
      <header className="entrada">
        <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-tinta-200 pb-3 text-sm text-tinta-600">
          <span>
            {ESTADO.nome} ({ESTADO.sigla}) — Eleição {ELEICAO.ano}
          </span>
          <span className="text-tinta-400">Documento de trabalho</span>
        </p>

        <h1 className="mt-6 max-w-[16ch]">Kit de interface</h1>

        <div className="mt-6 grid gap-6 border-t border-tinta-300 pt-6 sm:grid-cols-12 sm:gap-8">
          <p className="font-display text-xl font-medium leading-[1.15] tracking-[-0.02em] text-tinta-800 sm:col-span-5 sm:text-2xl">
            Os componentes do site, em um lugar só. Estrutura do shadcn/ui,
            aparência da GAZETA.
          </p>
          <div className="text-[1.05rem] leading-relaxed text-tinta-700 sm:col-span-7">
            <p>
              Tudo em <code className="font-mono text-[0.95em]">components/ui</code>{" "}
              é código nosso, copiado do shadcn/ui e reescrito para falar a
              língua deste site: cantos vivos, filete de tinta, sombra dura
              deslocada, rótulo em fonte monoespaçada. Por baixo continuam os
              primitivos do Radix, que resolvem teclado, foco e leitor de tela.
            </p>
            <p className="mt-3">
              A ponte entre os dois mundos são as variáveis CSS em{" "}
              <code className="font-mono text-[0.95em]">app/globals.css</code>:
              um componente novo baixado do shadcn já nasce com esta
              identidade, sem retrabalho.
            </p>
          </div>
        </div>

        <Alert variant="neutro" className="mt-7">
          <AlertTitle>Página interna de trabalho</AlertTitle>
          <AlertDescription>
            Não é conteúdo eleitoral. Os nomes, partidos e valores que aparecem
            nos exemplos são dados reais do{" "}
            <Link href="/fontes">TSE</Link>, para mostrar os componentes com
            conteúdo de tamanho realista.
          </AlertDescription>
        </Alert>
      </header>

      <KitInterface
        amostra={candidaturas.slice(0, 4)}
        partidos={partidosDistintos().slice(0, 3)}
      />

      <div className="filete-dupla mt-16" />
    </div>
  );
}
