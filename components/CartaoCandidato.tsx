import Link from "next/link";
import NumeroUrna from "@/components/NumeroUrna";
import { Badge } from "@/components/ui/badge";
import { idadeEm } from "@/lib/formato";
import type { Candidatura } from "@/types";

/**
 * Ficha resumida na lista.
 *
 * Enxugada: saíram o avatar de iniciais (não era foto de ninguém, só
 * ocupava espaço), a linha de cargo/UF repetida em toda ficha e a
 * grade de metadados miúdos. Ficou o que a pessoa procura ao varrer a
 * lista — nome, número, partido e situação do registro.
 *
 * REGRA DO PRODUTO: todas as fichas têm a mesma moldura, a mesma
 * sombra e o mesmo peso visual. Nenhuma candidatura recebe selo, borda
 * especial ou cor própria. Ver docs/principios.md, regra 3.
 *
 * O link cobre a ficha inteira (`after:absolute inset-0`): alvo grande
 * é mais fácil de acertar no celular do que um botão de 48px.
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
    <li className="cartao-verbete h-full min-w-0">
      <article className="flex h-full flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="leading-snug">
              <Link
                href={`/candidato/${candidatura.id}`}
                className="text-tinta-950 no-underline after:absolute after:inset-0 hover:text-acento hover:underline"
              >
                {candidatura.nomeUrna}
              </Link>
            </h3>
            <p className="mt-0.5 truncate text-sm text-tinta-600">
              {candidatura.nomeCompleto}
            </p>
          </div>
          <NumeroUrna numero={candidatura.numero} tamanho="sm" />
        </div>

        <dl className="mt-auto space-y-1.5 border-t border-tinta-100 pt-3 text-sm">
          {candidatura.partido ? (
            <div className="flex gap-2">
              <dt className="text-tinta-600">Partido:</dt>
              <dd className="min-w-0 truncate font-semibold text-tinta-800">
                {candidatura.partido.sigla}
              </dd>
            </div>
          ) : null}
          <div className="flex gap-2">
            <dt className="text-tinta-600">Registro:</dt>
            <dd className="min-w-0 font-semibold text-tinta-800">
              {candidatura.situacaoRegistro ?? "Não informado"}
            </dd>
          </div>
          {idade !== null ? (
            <div className="flex gap-2">
              <dt className="text-tinta-600">Idade:</dt>
              <dd className="text-tinta-800">{idade} anos</dd>
            </div>
          ) : null}
        </dl>

        {/* Etiqueta de contexto, nunca de mérito: informa o andamento
            do registro, sem adjetivo. */}
        {!candidatura.apto ? (
          <p>
            <Badge variant="discreto">Registro em julgamento</Badge>
          </p>
        ) : null}
      </article>
    </li>
  );
}
