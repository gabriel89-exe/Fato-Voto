import Link from "next/link";
import CartaoCandidato from "@/components/CartaoCandidato";
import { IconeBusca, IconeSorteio } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buscar,
  candidaturas,
  diaDeHoje,
  ELEICAO,
  ESTADO,
  sortear,
} from "@/lib/eleicao";
import { dataCurta } from "@/lib/formato";
import { CARGOS, type Cargo } from "@/types";

export const metadata = { title: "Candidatos" };

/**
 * Lista de candidaturas.
 *
 * A ordem e SORTEADA, com semente fixa por dia — o dispositivo central
 * de neutralidade do site. Ver docs/principios.md, regra 1.
 *
 * O sorteio acontece antes do recorte, e nao depois: assim a posicao
 * relativa de duas candidaturas nao muda quando alguem filtra por
 * cargo ou digita uma busca.
 */
export default async function PaginaCandidatos({
  searchParams,
}: {
  searchParams: Promise<{ cargo?: string; busca?: string }>;
}) {
  const params = await searchParams;
  const termo = params.busca?.trim() ?? "";
  const cargo = CARGOS.includes(params.cargo as Cargo)
    ? (params.cargo as Cargo)
    : null;

  const dia = diaDeHoje();
  let lista = sortear(candidaturas, dia);
  if (cargo) lista = lista.filter((c) => c.cargo === cargo);
  if (termo) lista = buscar(lista, termo);

  const temRecorte = Boolean(cargo || termo);

  return (
    <div className="envelope py-8 sm:py-12">
      <header className="entrada">
        <p className="folio flex-wrap justify-between gap-y-1 border-y-2 border-tinta-900 py-2">
          <span>
            {ESTADO.nome} ({ESTADO.sigla}) — Eleição {ELEICAO.ano}
          </span>
          <span className="text-tinta-400">
            {lista.length} de {candidaturas.length}
          </span>
        </p>

        <h1 className="mt-6">
          Candidatos
          {cargo ? <span className="text-tinta-400"> · {cargo}</span> : null}
        </h1>

        {/* ---------- Busca e recorte por cargo ---------- */}
        <form
          action="/candidatos"
          method="get"
          role="search"
          className="painel mt-6 p-4 sm:p-5"
        >
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta-400">
                <IconeBusca />
              </span>
              <Input
                name="busca"
                type="search"
                defaultValue={termo}
                autoComplete="off"
                enterKeyHint="search"
                aria-label="Buscar por nome ou número de urna"
                placeholder="Nome ou número…"
                className="pl-11"
              />
            </div>
            {/* O cargo viaja junto para a busca não descartar o recorte. */}
            {cargo ? <input type="hidden" name="cargo" value={cargo} /> : null}
            <Button type="submit">Buscar</Button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rotulo-meta">Cargo</span>
            <Badge
              asChild
              variant={cargo === null ? "solido" : "contorno"}
              className="transition-colors"
            >
              <Link href={termo ? `/candidatos?busca=${encodeURIComponent(termo)}` : "/candidatos"}>
                Todos
              </Link>
            </Badge>
            {CARGOS.map((c) => {
              const query = new URLSearchParams({ cargo: c });
              if (termo) query.set("busca", termo);
              return (
                <Badge
                  key={c}
                  asChild
                  variant={cargo === c ? "solido" : "contorno"}
                  className="transition-colors"
                >
                  <Link href={`/candidatos?${query}`}>{c}</Link>
                </Badge>
              );
            })}
          </div>
        </form>

        {/* ---------- A ordem, dita em voz alta ---------- */}
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-tinta-600">
          <IconeSorteio className="h-4 w-4 shrink-0 text-tinta-500" />
          <span>
            Ordem sorteada em {dataCurta(dia)}. Ela é a mesma para todo mundo
            hoje e muda amanhã.{" "}
            <Link href="/metodologia">Por que sorteamos</Link>.
          </span>
        </p>

        <p
          role="status"
          aria-live="polite"
          className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.13em] text-tinta-500"
        >
          {lista.length}{" "}
          {lista.length === 1 ? "candidatura encontrada" : "candidaturas encontradas"}
          {temRecorte ? " com este recorte" : ""}
        </p>
      </header>

      {lista.length === 0 ? (
        <Alert className="mt-8">
          <AlertTitle>Nenhuma candidatura com este recorte</AlertTitle>
          <AlertDescription>
            Tente escrever menos letras do nome, ou só o começo do número de
            urna. A busca ignora acentos e maiúsculas.{" "}
            <Link href="/candidatos">Ver todas as candidaturas</Link>.
          </AlertDescription>
        </Alert>
      ) : (
        <ul className="entrada-lista mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((candidatura) => (
            <CartaoCandidato key={candidatura.id} candidatura={candidatura} />
          ))}
        </ul>
      )}
    </div>
  );
}
