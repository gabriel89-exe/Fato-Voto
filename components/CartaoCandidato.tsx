import Link from "next/link";
import NumeroUrna from "@/components/NumeroUrna";
import { Badge } from "@/components/ui/badge";
import { idadeEm } from "@/lib/formato";
import type { Candidatura } from "@/types";

/**
 * Ficha resumida na lista.
 *
 * REGRA DO PRODUTO: todas as fichas têm a mesma moldura, a mesma
 * sombra, o mesmo peso visual e a mesma reação ao ponteiro. Nenhuma
 * candidatura recebe selo, borda especial ou cor própria.
 * Ver docs/principios.md, regra 3.
 *
 * DENSIDADE: os metadados saíram de três linhas empilhadas para uma
 * grade de duas colunas. Cabe um campo a mais — o cargo — na mesma
 * altura de antes. O cargo tinha sido removido por "se repetir em toda
 * ficha", o que só era verdade dentro de um filtro: em /candidatos sem
 * recorte a lista mistura os seis cargos, e sem esse campo a pessoa
 * precisa abrir a ficha para descobrir para o que alguém concorre.
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

  const campos: Array<{ rotulo: string; valor: string }> = [
    { rotulo: "Cargo", valor: candidatura.cargo },
    { rotulo: "Partido", valor: candidatura.partido?.sigla ?? "Não informado" },
    {
      rotulo: "Registro",
      valor: candidatura.situacaoRegistro ?? "Não informado",
    },
    { rotulo: "Idade", valor: idade !== null ? `${idade} anos` : "Não informada" },
  ];

  return (
    <li className="cartao-verbete h-full min-w-0">
      <article className="flex h-full flex-col gap-3.5 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="leading-snug">
              <Link
                href={`/candidato/${candidatura.id}`}
                className="text-tinta-950 no-underline after:absolute after:inset-0 hover:text-acento"
              >
                {candidatura.nomeUrna}
              </Link>
            </h3>
            <p className="mt-1 truncate text-sm text-tinta-500">
              {candidatura.nomeCompleto}
            </p>
          </div>
          <NumeroUrna numero={candidatura.numero} tamanho="sm" />
        </div>

        <dl className="grade-ficha mt-auto border-t border-tinta-100 pt-3.5">
          {campos.map((campo) => (
            <div key={campo.rotulo} className="min-w-0">
              <dt className="rotulo-ficha">{campo.rotulo}</dt>
              <dd className="mt-0.5 truncate text-[0.95rem] font-medium text-tinta-800">
                {campo.valor}
              </dd>
            </div>
          ))}
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
