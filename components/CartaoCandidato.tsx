import Link from "next/link";
import AvatarCandidato from "@/components/AvatarCandidato";
import NumeroUrna from "@/components/NumeroUrna";
import PastilhaPartido from "@/components/PastilhaPartido";
import { obterPartido } from "@/lib/dados";
import { idadeEm } from "@/lib/formato";
import type { Candidato } from "@/types";

/**
 * Cartao da lista — ficha de arquivo.
 *
 * Regra do produto: TODOS os cartoes tem a mesma estrutura, o mesmo
 * tamanho e o mesmo peso visual. Nenhuma candidatura recebe selo,
 * borda especial, cor de fundo propria ou ordem privilegiada. A aba
 * monoespacada no topo e igual para todos.
 *
 * `realce` recebe o nome ja com o trecho buscado marcado (ver lib/busca).
 */
export default function CartaoCandidato({
  candidato,
  realceNome,
  realceNumero,
}: {
  candidato: Candidato;
  realceNome?: React.ReactNode;
  realceNumero?: React.ReactNode;
}) {
  const partido = obterPartido(candidato.partidoId);

  return (
    <li className="cartao-arquivo cartao-interativo h-full">
      <article className="flex h-full flex-col gap-3 p-5">
        <p className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.12em] text-tinta-400">
          <span>Ficha · {candidato.cargo}</span>
          <span>{candidato.uf}</span>
        </p>

        <div className="flex items-start gap-3">
          <AvatarCandidato nome={candidato.nomeUrna} tamanho="sm" />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg leading-tight">
              <Link
                href={`/candidato/${candidato.id}`}
                className="text-tinta-900 no-underline hover:underline"
              >
                {realceNome ?? candidato.nomeUrna}
              </Link>
            </h3>
            <p className="mt-0.5 truncate text-sm text-tinta-600">
              {candidato.nomeCivil}
            </p>
            <p className="mt-1.5">
              <PastilhaPartido partido={partido} />
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-tinta-100 pt-3">
          <div>
            <p className="rotulo-meta">Número</p>
            {realceNumero ? (
              <p className="mt-1 font-mono text-lg font-bold tabular-nums">
                {realceNumero}
              </p>
            ) : (
              <div className="mt-1">
                <NumeroUrna numero={candidato.numero} tamanho="sm" />
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="rotulo-meta">Registro</p>
            <p className="mt-1 text-sm font-medium text-tinta-800">
              {candidato.situacaoRegistro}
            </p>
          </div>
        </div>

        <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-2 border-t border-tinta-100 pt-3 text-sm">
          <div>
            <dt className="rotulo-meta">Idade</dt>
            <dd className="mt-0.5 text-tinta-800">
              {idadeEm(candidato.dataNascimento)} anos
            </dd>
          </div>
          <div>
            <dt className="rotulo-meta">Mandato anterior</dt>
            <dd className="mt-0.5 text-tinta-800">
              {candidato.atuacao ? "Sim" : "Não"}
            </dd>
          </div>
        </dl>

        <Link
          href={`/candidato/${candidato.id}`}
          className="botao-secundario w-full justify-center"
        >
          Ver ficha completa
        </Link>
      </article>
    </li>
  );
}
