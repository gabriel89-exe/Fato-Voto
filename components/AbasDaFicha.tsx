"use client";

import { createContext, useContext, useState } from "react";

import { Tabs } from "@/components/ui/tabs";

/**
 * Controle compartilhado das abas da ficha.
 *
 * As abas eram `<Tabs defaultValue="perfil">` — não controladas, e
 * portanto inalcançáveis de fora. Isso bastava enquanto o único jeito de
 * trocar de aba era clicar nela. Deixou de bastar quando o resumo de
 * patrimônio, que fica ACIMA das abas, passou a precisar de um "saiba
 * mais" que leva à aba Bens.
 *
 * A alternativa seria duplicar o detalhe dos bens no resumo. Seria pior
 * por dois motivos: o mesmo dado em dois lugares diverge no primeiro dia
 * em que alguém edita um deles, e o detalhe iria para o HTML de todas as
 * 575 fichas mesmo sem ninguém pedir — exatamente o peso que o resumo
 * existe para evitar.
 *
 * O Radix desmonta o conteúdo da aba inativa. Então o conteúdo de Bens
 * só entra no DOM quando alguém clica: leve por padrão, completo sob
 * demanda, sem duplicar nada.
 *
 * ==================================================================
 * POR QUE O BOTÃO É UM LINK DE ÂNCORA, E NÃO UM `onClick` COM SCROLL.
 *
 * Trocar de aba a partir de um controle que está ACIMA dela deixaria a
 * pessoa olhando para o lugar errado: o conteúdo muda fora do campo de
 * visão. A primeira versão resolvia com `scrollIntoView`, depois com
 * `window.scrollTo`.
 *
 * Nenhum dos dois pôde ser verificado: na auditoria de 07/09/2026 o
 * navegador do painel não rolava a página por nenhum caminho — nem
 * `scrollIntoView`, nem `scrollTo`, nem `scrollTop`, nem gesto real de
 * rolagem. Publicar código de rolagem que eu não consegui ver
 * funcionando seria publicar promessa.
 *
 * Âncora nativa não tem esse problema: o salto é do navegador, funciona
 * sem JavaScript, e o desencontro com o cabeçalho grudento se resolve em
 * CSS com `scroll-mt`. O `onClick` continua trocando a aba, mas o
 * deslocamento não depende mais dele.
 * ==================================================================
 */

/** Um id só, usado pela âncora e pelo alvo. */
export const ID_DAS_ABAS = "abas-da-ficha";

type Contexto = { aba: string; definir: (aba: string) => void };

const CtxAbas = createContext<Contexto | null>(null);

function usarAbas(): Contexto {
  const ctx = useContext(CtxAbas);
  if (!ctx) {
    throw new Error(
      "Componente de aba usado fora de <ProvedorDeAbas>. O provedor precisa " +
        "envolver tanto as abas quanto quem manda nelas.",
    );
  }
  return ctx;
}

export function ProvedorDeAbas({
  inicial = "perfil",
  children,
}: {
  inicial?: string;
  children: React.ReactNode;
}) {
  const [aba, definir] = useState(inicial);
  return (
    <CtxAbas.Provider value={{ aba, definir }}>{children}</CtxAbas.Provider>
  );
}

/** As abas em si. Recebe o conteúdo já renderizado no servidor. */
export function AbasControladas({ children }: { children: React.ReactNode }) {
  const { aba, definir } = usarAbas();
  return (
    /* `scroll-mt-28` desconta a tarja mais o cabeçalho grudentos, para a
       âncora não parar com a lista de abas escondida atrás deles. */
    <div id={ID_DAS_ABAS} className="scroll-mt-28">
      <Tabs value={aba} onValueChange={definir}>
        {children}
      </Tabs>
    </div>
  );
}

/**
 * Link que abre uma aba e leva o olho até ela.
 *
 * É `<a href="#...">` de propósito: o salto é do navegador. O `onClick`
 * só troca a aba, e não chama `preventDefault` — se o JavaScript falhar,
 * o link ainda leva a pessoa às abas.
 */
export function LinkParaAba({
  aba,
  className,
  children,
}: {
  aba: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { definir } = usarAbas();
  return (
    <a
      href={`#${ID_DAS_ABAS}`}
      onClick={() => definir(aba)}
      className={className}
    >
      {children}
    </a>
  );
}
