import Link from "next/link";
import AvatarCandidato from "@/components/AvatarCandidato";
import NumeroUrna from "@/components/NumeroUrna";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { idadeEm } from "@/lib/formato";
import type { Candidatura } from "@/types";

/**
 * Verbete da lista.
 *
 * Regra do produto: TODOS os verbetes tem a mesma moldura, a mesma
 * sombra, o mesmo tamanho e o mesmo peso visual. Nenhuma candidatura
 * recebe selo, borda especial, cor de fundo propria ou ordem
 * privilegiada. Ver docs/principios.md, regra 3.
 */
export default function CartaoCandidato({
  candidatura,
}: {
  candidatura: Candidatura;
}) {
  const idade = candidatura.dataNascimento
    ? idadeEm(candidatura.dataNascimento)
    : null;

  return (
    // `min-w-0`: item de grid tem `min-width: auto` e se recusa a
    // encolher abaixo do próprio conteúdo. Nomes de urna longos
    // ("ELIANA BECO DO SIRI") esticavam o cartão e faziam a PÁGINA rolar
    // de lado em 360px.
    <li className="cartao-verbete h-full min-w-0">
      <article className="flex h-full flex-col">
        <p className="flex items-center justify-between gap-2 border-b border-tinta-300 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-tinta-500">
          <span className="truncate">{candidatura.cargo}</span>
          <span>{candidatura.uf}</span>
        </p>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start gap-3">
            <AvatarCandidato nome={candidatura.nomeUrna} tamanho="sm" />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-bold leading-tight tracking-[-0.02em]">
                <Link
                  href={`/candidato/${candidatura.id}`}
                  className="text-tinta-900 no-underline hover:underline"
                >
                  {candidatura.nomeUrna}
                </Link>
              </h3>
              <p className="mt-0.5 truncate font-texto text-sm italic text-tinta-600">
                {candidatura.nomeCompleto}
              </p>
              {candidatura.partido ? (
                <p className="mt-1.5 text-sm text-tinta-700">
                  <span className="font-semibold text-tinta-800">
                    {candidatura.partido.sigla}
                  </span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 border-t border-tinta-300 pt-3">
            <div>
              <p className="rotulo-meta">Número</p>
              <div className="mt-1">
                <NumeroUrna numero={candidatura.numero} tamanho="sm" />
              </div>
            </div>
            <div className="min-w-0 text-right">
              <p className="rotulo-meta">Registro</p>
              <p className="mt-1 text-sm font-semibold text-tinta-800">
                {candidatura.situacaoRegistro ?? "Não informado"}
              </p>
            </div>
          </div>

          <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-2 border-t border-tinta-300 pt-3 text-sm">
            <div>
              <dt className="rotulo-meta">Idade</dt>
              <dd className="mt-0.5 text-tinta-800">
                {idade !== null ? `${idade} anos` : "Não informado"}
              </dd>
            </div>
            <div>
              <dt className="rotulo-meta">Já concorreu antes</dt>
              <dd className="mt-0.5 text-tinta-800">
                {candidatura.primeiraCandidatura ? "Não" : "Sim"}
              </dd>
            </div>
          </dl>

          {/* Etiqueta de contexto, nunca de mérito: diz o que a fonte
              informa sobre o andamento do registro, sem adjetivo. */}
          {!candidatura.apto ? (
            <p>
              <Badge variant="discreto">Registro em julgamento</Badge>
            </p>
          ) : null}

          <Button asChild variant="secundario" className="mt-1 w-full">
            <Link href={`/candidato/${candidatura.id}`}>Ver ficha</Link>
          </Button>
        </div>
      </article>
    </li>
  );
}
