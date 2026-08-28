"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconeBusca, IconeFiltro } from "@/components/icones";
import type { Faceta, Filtros } from "@/lib/eleicao";
import { CARGOS } from "@/types";

/**
 * Painel de recortes da lista de candidaturas.
 *
 * FUNCIONA SEM JAVASCRIPT. É um <form method="get"> comum: marcar uma
 * caixa e enviar recarrega a página com a query string nova. A sanfona
 * e a gaveta só melhoram a experiência de quem tem JS — quem não tem vê
 * os grupos abertos e envia igual.
 *
 * Por isso o estado NÃO vive em React: vive na URL. Consequências
 * pretendidas: a lista filtrada é compartilhável por link, o botão
 * Voltar funciona, e a página é renderizada no servidor.
 *
 * O painel é renderizado DUAS vezes — coluna fixa a partir de `lg`,
 * gaveta abaixo disso — então cada instância precisa de um `prefixo`
 * próprio para os `id` dos campos não colidirem.
 */

function GrupoFacetas({
  facetas,
  prefixo,
}: {
  facetas: Faceta[];
  prefixo: string;
}) {
  return (
    <Accordion
      type="multiple"
      defaultValue={facetas.filter((f) => f.opcoes.some((o) => o.marcada)).map((f) => f.chave)}
    >
      {facetas.map((faceta) => {
        const marcadas = faceta.opcoes.filter((o) => o.marcada).length;
        return (
          <AccordionItem key={faceta.chave} value={faceta.chave}>
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                {faceta.rotulo}
                {marcadas > 0 ? (
                  <Badge variant="solido">{marcadas}</Badge>
                ) : null}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-0.5">
                {faceta.opcoes.map((opcao) => {
                  const id = `${prefixo}-${faceta.chave}-${opcao.valor}`;
                  /* Opção zerada continua na lista, desabilitada: sumir
                     com ela faria a interface parecer instável a cada
                     clique. Se estiver marcada, nunca desabilita —
                     senão não daria para desmarcar. */
                  const inerte = opcao.total === 0 && !opcao.marcada;
                  return (
                    <li key={opcao.valor}>
                      <label
                        htmlFor={id}
                        className={`flex min-h-toque cursor-pointer items-center gap-3 px-1 text-sm ${
                          inerte ? "cursor-not-allowed text-tinta-400" : "text-tinta-800"
                        }`}
                      >
                        {/* <input> nativo, não o Checkbox do Radix: o
                            Radix usa um <button> e não entra no envio
                            do formulário sem JavaScript. */}
                        <input
                          type="checkbox"
                          id={id}
                          name={faceta.chave}
                          value={opcao.valor}
                          defaultChecked={opcao.marcada}
                          disabled={inerte}
                          className="size-5 shrink-0 accent-tinta-900"
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {opcao.valor}
                        </span>
                        <span className="shrink-0 font-mono text-xs tabular-nums text-tinta-500">
                          {opcao.total}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function Formulario({
  filtros,
  facetas,
  prefixo,
  children,
}: {
  filtros: Filtros;
  facetas: Faceta[];
  prefixo: string;
  children?: React.ReactNode;
}) {
  return (
    <form action="/candidatos" method="get" role="search" className="contents">
      <div className="space-y-4">
        <div>
          <label htmlFor={`${prefixo}-busca`} className="rotulo-meta">
            Nome ou número
          </label>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta-400">
              <IconeBusca />
            </span>
            <Input
              id={`${prefixo}-busca`}
              name="busca"
              type="search"
              defaultValue={filtros.busca}
              autoComplete="off"
              enterKeyHint="search"
              placeholder="Buscar…"
              className="pl-11"
            />
          </div>
        </div>

        <fieldset>
          <legend className="rotulo-meta mb-1.5">Cargo</legend>
          <div className="space-y-0.5">
            {[null, ...CARGOS].map((cargo) => {
              const id = `${prefixo}-cargo-${cargo ?? "todos"}`;
              return (
                <label
                  key={id}
                  htmlFor={id}
                  className="flex min-h-toque cursor-pointer items-center gap-3 px-1 text-sm text-tinta-800"
                >
                  <input
                    type="radio"
                    id={id}
                    name="cargo"
                    value={cargo ?? ""}
                    defaultChecked={filtros.cargo === cargo}
                    className="size-5 shrink-0 accent-tinta-900"
                  />
                  {cargo ?? "Todos os cargos"}
                </label>
              );
            })}
          </div>
        </fieldset>

        <GrupoFacetas facetas={facetas} prefixo={prefixo} />

        <div className="flex flex-col gap-2 border-t-2 border-tinta-900 pt-4">
          <Button type="submit">Aplicar recortes</Button>
          <Button asChild variant="fantasma">
            <Link href="/candidatos">Limpar tudo</Link>
          </Button>
        </div>
        {children}
      </div>
    </form>
  );
}

export default function FiltrosCandidatos({
  filtros,
  facetas,
  recortesAtivos,
}: {
  filtros: Filtros;
  facetas: Faceta[];
  recortesAtivos: number;
}) {
  return (
    <>
      {/* ---------- Celular: gaveta ---------- */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secundario" className="w-full">
              <IconeFiltro />
              Filtrar
              {recortesAtivos > 0 ? (
                <Badge variant="solido">{recortesAtivos}</Badge>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filtrar candidaturas</SheetTitle>
              <SheetDescription>
                Os recortes valem para a lista inteira e ficam no endereço da
                página.
              </SheetDescription>
            </SheetHeader>
            <SheetBody>
              <Formulario
                filtros={filtros}
                facetas={facetas}
                prefixo="gaveta"
              />
            </SheetBody>
            <SheetFooter />
          </SheetContent>
        </Sheet>
      </div>

      {/* ---------- Desktop: coluna fixa ---------- */}
      <aside className="hidden lg:block">
        <div className="painel sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto p-4">
          <p className="rotulo-meta mb-3 border-b-2 border-tinta-900 pb-2">
            Recortes
          </p>
          <Formulario filtros={filtros} facetas={facetas} prefixo="coluna" />
        </div>
      </aside>
    </>
  );
}
