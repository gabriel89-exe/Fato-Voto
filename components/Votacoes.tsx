import { Badge } from "@/components/ui/badge";
import { IconeLinkExterno } from "@/components/icones";
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
 *
 * ==================================================================
 * POR QUE DEIXOU DE SER TABELA.
 *
 * Era uma tabela de cinco colunas: data, matéria, o que foi votado,
 * como votou, resultado. Cabia, mas não se lia — a coluna que importa
 * ("o que foi votado") é um parágrafo, e parágrafo espremido em célula
 * ao lado de quatro colunas curtas obriga o olho a costurar a frase da
 * esquerda com o voto da direita, linha após linha.
 *
 * Agora é uma ficha por votação: o QUE se votou vem primeiro e inteiro,
 * o voto logo abaixo em destaque, e data e resultado como metadado. A
 * ordem da leitura passa a ser a ordem da pergunta — "o que era isso?"
 * antes de "como ele votou?".
 *
 * O que NÃO mudou: continua sem contagem agregada, sem cor por voto e
 * com o critério do recorte à vista.
 * ==================================================================
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
      <ol className="space-y-3">
        {linhas.map((l) => (
          <li
            key={l.id}
            className="border border-tinta-200 bg-papel-alta p-4"
          >
            {/* O QUE se votou vem primeiro e inteiro. */}
            <p className="font-medium text-tinta-900">
              {l.objeto ??
                l.ementa ??
                "A fonte não publicou descrição desta votação."}
            </p>
            {l.objeto && l.ementa ? (
              <p className="mt-1 text-sm text-tinta-600">{l.ementa}</p>
            ) : null}

            {/* Como votou, logo abaixo e em destaque. Mesma marca para
                toda posição: voto não é acerto. */}
            <p className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rotulo-meta">Votou</span>
              <Badge variant="contorno">{l.voto}</Badge>
              {l.siglaOriginal && !l.voto.startsWith(l.siglaOriginal) ? (
                <span className="font-mono text-[0.7rem] text-tinta-600">
                  {l.siglaOriginal}
                </span>
              ) : null}
            </p>

            {/* Metadado por último: é o que menos responde à pergunta. */}
            <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-tinta-100 pt-2 text-xs text-tinta-600">
              {l.data ? (
                <span className="tabular-nums">{dataCurta(l.data)}</span>
              ) : null}
              {l.materia ? (
                <span className="font-mono">
                  {l.paginaOficial ? (
                    <a
                      href={l.paginaOficial}
                      target="_blank"
                      rel="nofollow noopener"
                      className="inline-flex items-center gap-1"
                    >
                      {l.materia}
                      <IconeLinkExterno />
                    </a>
                  ) : (
                    l.materia
                  )}
                </span>
              ) : null}
              {l.resultado ? (
                <span>
                  <span className="rotulo-meta">A Casa decidiu: </span>
                  {l.resultado}
                </span>
              ) : null}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-xs text-tinta-600">{criterio}</p>
      {aviso ? <p className="mt-2 text-xs text-tinta-600">{aviso}</p> : null}
    </div>
  );
}
