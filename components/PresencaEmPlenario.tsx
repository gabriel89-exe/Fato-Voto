import { IconeLinkExterno } from "@/components/icones";
import { numero as fmtNumero, percentual } from "@/lib/formato";
import type { PresencaDoParlamentar } from "@/types";

/**
 * Presença em plenário.
 *
 * ==================================================================
 * POR QUE ESTA TELA NÃO É UM PLACAR.
 *
 * "Compareceu a 140 de 200" é o tipo de número que vira nota sem
 * ninguém pedir. O que impede isso aqui é a fonte: a Câmara separa
 * ausência JUSTIFICADA de NÃO JUSTIFICADA, e as duas aparecem lado a
 * lado, com o mesmo peso visual e sem cor de alerta.
 *
 * A diferença não é detalhe. Licença médica, licença-maternidade e
 * missão oficial são ausências justificadas — e um deputado do ES tem 79
 * delas na legislatura. Somá-las às faltas produziria uma acusação
 * falsa; e é exatamente o que qualquer "índice de presença" faria.
 *
 * Duas ressalvas da própria fonte vêm junto, porque sem elas o número
 * engana:
 *
 *   - a contagem segue o Ato da Mesa n. 191 de 2017;
 *   - só conta o PERÍODO DE EXERCÍCIO. Quem assumiu no meio do mandato
 *     não é contado como ausente antes de ser deputado — por isso os
 *     denominadores diferem entre pessoas, e a tela diz isso.
 *
 * NÃO HÁ COMPARAÇÃO COM A BANCADA aqui, de propósito. A regra 4 pede
 * denominador para valor de GASTO, e este número já tem o seu: o total
 * de dias com sessão. Acrescentar "a mediana da bancada faltou X" seria
 * transformar presença em competição, que é a regra 1.
 * ==================================================================
 */
export default function PresencaEmPlenario({
  presenca,
  recorte,
}: {
  presenca: PresencaDoParlamentar;
  recorte: string;
}) {
  const { totais, porAno } = presenca;
  if (totais.dias === 0) return null;

  const faixas = [
    {
      chave: "presenca",
      rotulo: "Dias com presença",
      valor: totais.diasComPresenca,
      classe: "bg-acento",
    },
    {
      chave: "justificadas",
      rotulo: "Ausências justificadas",
      valor: totais.diasJustificados,
      classe: "bg-tinta-400",
    },
    {
      chave: "naoJustificadas",
      rotulo: "Ausências não justificadas",
      valor: totais.diasNaoJustificados,
      classe: "bg-tinta-200",
    },
  ];

  return (
    <section>
      <h4 className="text-base font-bold text-tinta-950">
        Presença em plenário
      </h4>
      <p className="mt-1 text-sm text-tinta-600">
        Dias com sessão deliberativa no período em que {presenca.nomeUrna}{" "}
        esteve em exercício. A contagem é da própria Câmara.
      </p>

      {/* Uma barra só, com as três faixas na proporção real. Cor
          diferente por faixa porque aqui a categoria EXISTE — não é
          gradação de bom para ruim, é presença, justificada e não
          justificada, que são coisas distintas. */}
      <div
        className="mt-5 flex h-6 w-full overflow-hidden rounded-sm border border-tinta-300"
        role="img"
        aria-label={`De ${totais.dias} dias com sessão, ${totais.diasComPresenca} com presença, ${totais.diasJustificados} de ausência justificada e ${totais.diasNaoJustificados} de ausência não justificada.`}
      >
        {faixas.map((f) =>
          f.valor > 0 ? (
            <span
              key={f.chave}
              className={f.classe}
              style={{ width: `${(f.valor / totais.dias) * 100}%` }}
            />
          ) : null,
        )}
      </div>

      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        {faixas.map((f) => (
          <div key={f.chave}>
            <dt className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`inline-block h-3 w-3 shrink-0 border border-tinta-900 ${f.classe}`}
              />
              <span className="rotulo-meta">{f.rotulo}</span>
            </dt>
            <dd className="mt-1 font-mono text-xl tabular-nums text-tinta-900">
              {fmtNumero(f.valor)}
              <span className="ml-2 text-sm font-normal text-tinta-600">
                {percentual(f.valor, totais.dias)}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-sm text-tinta-700">
        <strong>Ausência justificada não é falta.</strong> Licença médica,
        licença-maternidade e missão oficial entram aí, e a Câmara as registra
        separado justamente por isso. Somar as duas colunas produziria um
        número que a fonte não afirma.
      </p>

      {porAno.length > 1 ? (
        <div className="mt-5">
          <p className="rotulo-meta mb-2">Ano a ano</p>
          <ul className="space-y-2">
            {porAno.map((a) => (
              <li key={a.ano} className="text-sm">
                <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="font-mono tabular-nums text-tinta-900">
                    {a.ano}
                  </span>
                  <span className="text-tinta-700">
                    {fmtNumero(a.diasComPresenca)} de {fmtNumero(a.dias)} dias
                    {a.diasJustificados > 0
                      ? ` · ${fmtNumero(a.diasJustificados)} justificadas`
                      : ""}
                    {a.diasNaoJustificados > 0
                      ? ` · ${fmtNumero(a.diasNaoJustificados)} não justificadas`
                      : ""}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 flex h-1.5 w-full overflow-hidden bg-tinta-100"
                >
                  <span
                    className="bg-acento"
                    style={{ width: `${(a.diasComPresenca / a.dias) * 100}%` }}
                  />
                  <span
                    className="bg-tinta-400"
                    style={{ width: `${(a.diasJustificados / a.dias) * 100}%` }}
                  />
                  <span
                    className="bg-tinta-200"
                    style={{
                      width: `${(a.diasNaoJustificados / a.dias) * 100}%`,
                    }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-4 text-xs text-tinta-600">
        {recorte} Não há comparação com o resto da bancada nesta tela: cada
        pessoa tem o seu período de exercício, e presença não é competição.{" "}
        <a
          href={presenca.paginaOficial}
          target="_blank"
          rel="nofollow noopener"
          className="inline-flex items-center gap-1"
        >
          Ver o relatório de presença na Câmara
          <IconeLinkExterno />
        </a>
      </p>
    </section>
  );
}
