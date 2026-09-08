"use client";

import { useState } from "react";

import DetalheBens from "@/components/DetalheBens";
import { IconeSeta } from "@/components/icones";
import { dataCurta, numero as fmtNumero, reais } from "@/lib/formato";
import type { Candidatura } from "@/types";

/**
 * Resumo do patrimônio declarado, acima das abas.
 *
 * ==================================================================
 * O QUE FOI PEDIDO E O QUE A FONTE TEM.
 *
 * O pedido era mostrar "a renda declarada pelo candidato". O TSE NÃO
 * PUBLICA RENDA — não há campo de renda, salário ou receita no registro
 * de candidatura. O que existe é a declaração de BENS, que é outra
 * coisa: patrimônio acumulado, não o que a pessoa ganha.
 *
 * Trocar um pelo outro em silêncio seria o erro exato que a regra 5
 * proíbe: deixar o leitor achar que está vendo renda quando está vendo
 * patrimônio. Então a tela mostra bens, chama de bens, e diz que renda
 * não é publicada.
 *
 * O TOTAL NÃO VAI SOZINHO. Vem ao lado da mediana das candidaturas ao
 * MESMO cargo que declararam bens. É a regra 4 aplicada onde ela mais
 * pesa: patrimônio é o número que mais facilmente se lê como "rico" ou
 * "pobre", e este resumo aparece no topo da ficha, antes de qualquer
 * contexto. Sem denominador, viraria ranking involuntário na primeira
 * olhada.
 *
 * O DETALHE NÃO VEM NO HTML. A aba "Bens" deixou de existir: ela
 * repetia total e quantidade que já estavam aqui, uma tela abaixo, e
 * dois lugares com o mesmo dado é um lugar a mais para divergir. Agora
 * o detalhe abre AQUI, e só quando alguém pede — o componente é
 * cliente e só monta <DetalheBens> depois do clique, então a marcação
 * não vai para o HTML das 575 fichas de graça.
 * ==================================================================
 */
export default function ResumoPatrimonio({
  candidatura,
  referencia,
  fonte,
  coletadoEm,
}: {
  candidatura: Candidatura;
  referencia: {
    declararam: number;
    naoDeclararam: number;
    mediana: number;
    menor: number;
    maior: number;
  };
  fonte: string;
  coletadoEm: string;
}) {
  const [aberto, setAberto] = useState(false);
  const { bens, totalBens, cargo, divulgacaoAutorizada } = candidatura;

  /* A data que a própria fonte carimba em cada bem. */
  const atualizadoEm = bens
    .map((b) => b.atualizadoEm)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);

  const semAutorizacao = !divulgacaoAutorizada.bens;
  const semBens = bens.length === 0;

  return (
    <section
      aria-label="Patrimônio declarado"
      className="mt-6 rounded-md border border-tinta-200 bg-papel-alta"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-tinta-200 px-4 py-2">
        <h2 className="text-sm font-bold text-tinta-900">
          Patrimônio declarado
        </h2>
        <p className="rotulo-meta">Declarado ao TSE no pedido de registro</p>
      </div>

      <div className="px-4 py-4">
        {semAutorizacao ? (
          <p className="text-sm text-tinta-700">
            O Tribunal Superior Eleitoral <strong>não autoriza</strong> a
            divulgação dos bens desta candidatura. A omissão é da fonte, não
            desta plataforma.
          </p>
        ) : semBens ? (
          <p className="text-sm text-tinta-700">
            Esta candidatura <strong>não declarou bens</strong> no pedido de
            registro. Não declarar é permitido e não indica irregularidade —{" "}
            {fmtNumero(referencia.naoDeclararam)} das{" "}
            {fmtNumero(referencia.declararam + referencia.naoDeclararam)}{" "}
            candidaturas a {cargo.toLowerCase()}{" "}
            {referencia.naoDeclararam === 1
              ? "também não declarou"
              : "também não declararam"}
            .
          </p>
        ) : (
          <>
            {/* Total e denominador lado a lado, nunca o total sozinho. */}
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="rotulo-meta">Total declarado</dt>
                <dd className="mt-1 font-mono text-2xl font-bold tabular-nums text-tinta-950">
                  {reais(totalBens ?? 0)}
                </dd>
                <dd className="mt-1 text-xs text-tinta-600">
                  em {fmtNumero(bens.length)}{" "}
                  {bens.length === 1 ? "bem" : "bens"}
                  {atualizadoEm ? ` · atualizado em ${dataCurta(atualizadoEm)}` : ""}
                </dd>
              </div>
              <div>
                <dt className="rotulo-meta">
                  Mediana de quem disputa {cargo.toLowerCase()}
                </dt>
                <dd className="mt-1 font-mono text-2xl tabular-nums text-tinta-700">
                  {reais(referencia.mediana)}
                </dd>
                <dd className="mt-1 text-xs text-tinta-600">
                  entre as {fmtNumero(referencia.declararam)} candidaturas ao
                  cargo que declararam bens
                </dd>
              </div>
            </dl>

            <p className="mt-3 text-xs text-tinta-600">
              A mediana está aqui de propósito: um valor sozinho não diz se é
              alto ou baixo, e esta plataforma não classifica ninguém. Valores
              nominais, como declarados, sem correção pela inflação.
            </p>
          </>
        )}

        {/*
          Renda não existe na fonte, e o silêncio sobre isso faria o
          leitor confundir patrimônio com renda. Regra 5.
        */}
        <p className="mt-3 border-t border-tinta-100 pt-3 text-xs text-tinta-600">
          <strong className="text-tinta-700">Isto não é renda.</strong> O
          registro de candidatura declara o patrimônio acumulado, não o que a
          pessoa ganha. O TSE não publica renda de candidatura, e por isso ela
          não aparece em lugar nenhum deste site.
        </p>

        {!semAutorizacao && !semBens ? (
          <p className="mt-4">
            <button
              type="button"
              aria-expanded={aberto}
              aria-controls="detalhe-dos-bens"
              onClick={() => setAberto(!aberto)}
              className="inline-flex min-h-toque items-center gap-2 rounded border border-acento-borda bg-acento-leve px-4 py-2 text-sm font-semibold text-acento-forte hover:bg-acento hover:text-papel-alta"
            >
              {aberto ? (
                "Esconder os bens declarados"
              ) : (
                <>
                  Saiba mais: ver os {fmtNumero(bens.length)}{" "}
                  {bens.length === 1 ? "bem declarado" : "bens declarados"}
                </>
              )}
              <IconeSeta />
            </button>
          </p>
        ) : null}
      </div>

      {/* Só existe depois do clique: nada disto vai no HTML inicial. */}
      {aberto && !semAutorizacao && !semBens ? (
        <div id="detalhe-dos-bens" className="border-t border-tinta-200 p-4">
          <DetalheBens
            bens={bens}
            nome={candidatura.nomeUrna}
            fonte={fonte}
            coletadoEm={coletadoEm}
            urlOriginal={candidatura.paginaOficial}
          />
        </div>
      ) : null}
    </section>
  );
}
