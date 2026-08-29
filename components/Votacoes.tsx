import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dataCurta } from "@/lib/formato";

/**
 * Lista de "como votou", usada pelas duas casas.
 *
 * REGRAS QUE ESTA TELA PRECISA RESPEITAR — todas vêm de
 * docs/principios.md, e nenhuma é preferência de layout:
 *
 *  1. NENHUMA CONTAGEM AGREGADA. Não existe "votou Sim em 14 de 20",
 *     nem percentual de presença, nem fidelidade partidária. Um índice
 *     desses é avaliação vestida de estatística: ele ordena pessoas
 *     numa escala, que é exatamente o que o site recusa fazer (regra
 *     4). A lista descreve votação por votação, e para por aí.
 *
 *  2. NENHUMA COR POR VOTO. "Sim" não é verde nem "Não" é vermelho —
 *     não há vermelho no sistema (regra 2). Voto é posição, não acerto,
 *     e colorir posição é dar nota. Todos os votos usam a mesma marca.
 *
 *  3. O CRITÉRIO DO RECORTE FICA À VISTA. Quem lê precisa saber que
 *     são as mais recentes, e não uma seleção do que achamos
 *     importante — a segunda coisa seria linha editorial disfarçada.
 *
 *  4. A EMENTA VEM JUNTO. Sem ela a linha diz "votou Sim" sobre um
 *     código, e voto sem objeto não informa nada.
 */

export interface LinhaVotacao {
  id: string;
  data: string | null;
  /** "PLP 230/2025" */
  materia: string | null;
  ementa: string | null;
  /**
   * O QUE ESTAVA EM VOTAÇÃO naquela sessão, nas palavras da fonte:
   * "Rejeitada a Emenda de Plenário nº 1", "Aprovado o Substitutivo".
   *
   * Sem este campo a tabela mente por omissão. Uma mesma proposição
   * vai a plenário várias vezes — substitutivo, emendas, destaques —
   * e mostrando só a ementa as linhas ficam idênticas, com votos e
   * resultados diferentes. Quem lê conclui que a pessoa votou três
   * vezes na mesma coisa e se contradisse, quando ela votou em três
   * coisas distintas.
   */
  objeto: string | null;
  /** O que a casa decidiu, não o que a pessoa votou. */
  resultado: string | null;
  /** Como a pessoa votou, já em português. */
  voto: string;
  /**
   * A sigla crua da fonte, quando a tradução é nossa. Mostrada ao
   * lado do rótulo para a regra 5 ser cumprida: quem lê consegue
   * conferir a palavra original contra o portal.
   */
  siglaOriginal?: string | null;
  /** Votação secreta: existe voto registrado, sem direção pública. */
  secreta?: boolean;
  paginaOficial?: string | null;
}

export default function Votacoes({
  linhas,
  criterio,
  aviso,
}: {
  linhas: LinhaVotacao[];
  criterio: string;
  aviso?: string;
}) {
  if (linhas.length === 0) {
    return (
      <p className="text-sm text-tinta-700">
        Nenhuma votação nominal com registro de voto desta pessoa no período
        coletado. A ausência é do recorte, não necessariamente da pessoa:{" "}
        {criterio.toLowerCase()}
      </p>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Matéria</TableHead>
            <TableHead>O que foi votado</TableHead>
            <TableHead>Como votou</TableHead>
            <TableHead>Resultado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {linhas.map((l) => (
            <TableRow key={l.id}>
              <TableCell className="whitespace-nowrap tabular-nums">
                {l.data ? dataCurta(l.data) : "—"}
              </TableCell>

              <TableCell className="whitespace-nowrap font-mono text-xs">
                {l.paginaOficial && l.materia ? (
                  <a href={l.paginaOficial} rel="nofollow noopener">
                    {l.materia}
                  </a>
                ) : (
                  (l.materia ?? "—")
                )}
              </TableCell>

              {/* O objeto em cima, a ementa embaixo: a mesma proposição
                  volta ao plenário várias vezes, e é o objeto que
                  distingue uma sessão da outra. */}
              <TableCell className="max-w-md">
                {l.objeto ? (
                  <span className="block font-medium text-tinta-900">
                    {l.objeto}
                  </span>
                ) : null}
                <span
                  className={
                    l.objeto ? "mt-1 block text-tinta-600" : "block text-tinta-900"
                  }
                >
                  {l.ementa ?? "A fonte não publicou ementa para esta matéria."}
                </span>
              </TableCell>

              {/* Mesma marca para todo voto: a posição não recebe cor.  */}
              <TableCell className="whitespace-nowrap">
                <Badge variant="discreto">{l.voto}</Badge>
                {/* Só quando a sigla acrescenta algo. "Votou" traduzido
                    para "Votou (votação secreta)" já contém a palavra
                    original, e repeti-la embaixo vira ruído. */}
                {l.siglaOriginal && !l.voto.startsWith(l.siglaOriginal) ? (
                  <span className="mt-1 block font-mono text-[0.7rem] text-tinta-600">
                    {l.siglaOriginal}
                  </span>
                ) : null}
              </TableCell>

              <TableCell className="whitespace-nowrap text-tinta-700">
                {l.resultado ?? "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="mt-3 text-xs text-tinta-600">{criterio}</p>
      {aviso ? <p className="mt-2 text-xs text-tinta-600">{aviso}</p> : null}
    </div>
  );
}
