import Link from "next/link";
import AvatarCandidato from "@/components/AvatarCandidato";
import NumeroUrna from "@/components/NumeroUrna";
import PastilhaPartido from "@/components/PastilhaPartido";
import { obterPartido } from "@/lib/dados";
import { idadeEm } from "@/lib/formato";
import type { Candidato } from "@/types";

/**
 * Cartao da lista.
 *
 * Regra do produto: TODOS os cartoes tem a mesma estrutura, o mesmo
 * tamanho e o mesmo peso visual. Nenhuma candidatura recebe selo,
 * borda especial, cor de fundo propria ou ordem privilegiada.
 *
 * `realce` recebe o nome ja com o trecho buscado marcado (ver lib/busca).
 * Quando nao ha busca ativa, cai no texto simples.
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
    <li className="cartao cartao-interativo h-full">
      <article className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <AvatarCandidato nome={candidato.nomeUrna} tamanho="sm" />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold leading-tight">
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
            <p className="mt-1">
              <PastilhaPartido partido={partido} />
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="rotulo-meta">Número</p>
            {realceNumero ? (
              <p className="font-mono text-lg font-bold tabular-nums">
                {realceNumero}
              </p>
            ) : (
              <NumeroUrna numero={candidato.numero} tamanho="sm" />
            )}
          </div>
          <div className="text-right">
            <p className="rotulo-meta">Cargo</p>
            <p className="text-sm font-medium text-tinta-800">
              {candidato.cargo}
            </p>
          </div>
        </div>

        <dl className="mt-auto grid grid-cols-2 gap-x-3 gap-y-1 border-t border-tinta-100 pt-3 text-sm">
          <div>
            <dt className="rotulo-meta">Idade</dt>
            <dd className="text-tinta-800">
              {idadeEm(candidato.dataNascimento)} anos
            </dd>
          </div>
          <div>
            <dt className="rotulo-meta">Registro</dt>
            <dd className="text-tinta-800">{candidato.situacaoRegistro}</dd>
          </div>
          <div className="col-span-2">
            <dt className="rotulo-meta">Mandato anterior</dt>
            <dd className="text-tinta-800">
              {candidato.atuacao ? "Sim" : "Não exerceu mandato anterior"}
            </dd>
          </div>
        </dl>

        <Link
          href={`/candidato/${candidato.id}`}
          className="botao-secundario w-full justify-center"
        >
          Ver dados de {candidato.nomeUrna}
        </Link>
      </article>
    </li>
  );
}
