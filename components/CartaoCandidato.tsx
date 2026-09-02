import Link from "next/link";
import AvatarCandidato from "@/components/AvatarCandidato";
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
 * O NÚMERO DE URNA TEM LINHA PRÓPRIA, e o motivo é um defeito que já
 * aconteceu: dividindo a primeira linha com o nome, os cinco dígitos
 * de deputado estadual (~160px) esmagavam o nome em coluna de duas
 * letras na grade de três cartões. Nome e número nunca disputam a
 * mesma largura.
 *
 * METADADO QUEBRA LINHA, NÃO CORTA. "Deputado E…" e "Aguardand…"
 * obrigavam a pessoa a abrir a ficha para ler o que já estava ali. O
 * único truncamento que fica é o do nome civil — informação
 * secundária, completa na ficha.
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
      <article className="flex h-full flex-col p-4 sm:p-5">
        {/* ---------- Quem é ---------- */}
        <div className="flex items-center gap-3.5">
          <AvatarCandidato nome={candidatura.nomeUrna} tamanho="sm" />
          <div className="min-w-0 flex-1">
            <h3 className="leading-snug">
              <Link
                href={`/candidato/${candidatura.id}`}
                className="text-tinta-950 no-underline after:absolute after:inset-0 hover:text-acento"
              >
                {candidatura.nomeUrna}
              </Link>
            </h3>
            <p className="mt-0.5 truncate text-sm text-tinta-500">
              {candidatura.nomeCompleto}
            </p>
          </div>
        </div>

        {/* ---------- O que se digita na urna ---------- */}
        {/* mb-4 aqui + mt-auto na grade: o vão mínimo é garantido pela
            faixa, e a folga extra de um cartão mais alto abre ABAIXO
            dela, alinhando os metadados pelo rodapé da grade. */}
        <div className="mb-4 mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-md border border-tinta-100 bg-papel px-3 py-2.5">
          <span className="rotulo-ficha">Número na urna</span>
          <NumeroUrna numero={candidatura.numero} tamanho="sm" />
        </div>

        {/* ---------- Os fatos ---------- */}
        <dl className="grade-ficha mt-auto border-t border-tinta-100 pt-3.5">
          {campos.map((campo) => (
            <div key={campo.rotulo} className="min-w-0">
              <dt className="rotulo-ficha">{campo.rotulo}</dt>
              <dd className="mt-0.5 break-words text-[0.95rem] font-medium leading-snug text-tinta-800">
                {campo.valor}
              </dd>
            </div>
          ))}
        </dl>

        {/* Etiqueta de contexto, nunca de mérito: informa o andamento
            do registro, sem adjetivo. */}
        {!candidatura.apto ? (
          <p className="mt-3">
            <Badge variant="discreto">Registro em julgamento</Badge>
          </p>
        ) : null}
      </article>
    </li>
  );
}
