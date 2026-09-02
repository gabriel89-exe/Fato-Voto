import { GraficoBarras } from "@/components/graficos";
import Termo from "@/components/Termo";
import { IconeLinkExterno } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableCellNumero,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { numero as fmtNumero, reais } from "@/lib/formato";
import type {
  ConferenciaDaFonte,
  EmendasEstaduaisDoCandidato,
  Fonte,
  ReferenciaEmendas,
} from "@/types";

/**
 * Emendas parlamentares ESTADUAIS — o espelho de DetalheEmendas para o
 * Orçamento do Espírito Santo, com as diferenças que a fonte impõe:
 *
 * 1. NÃO HÁ PÁGINA POR EMENDA. O portal estadual não publica um
 *    endereço para cada registro, então o link de procedência leva ao
 *    dataset oficial da SEFAZ — e a tela diz isso, em vez de fingir que
 *    o link leva ao fato individual. É a exceção declarada à regra 6.
 *
 * 2. O VALOR PREVISTO EXISTE. A LOA registra quanto a emenda destinou,
 *    além do que foi empenhado e pago. Os três aparecem juntos: só o
 *    previsto sugeriria dinheiro entregue; só o pago esconderia o que
 *    foi destinado.
 *
 * 3. A ÁREA É DA EXECUÇÃO, NÃO DA EMENDA. Uma emenda pode executar em
 *    mais de uma área; no agrupamento por área, uma emenda pode contar
 *    em duas — o texto abaixo do gráfico declara.
 *
 * O resto segue as mesmas regras da tela federal: nada adjetivado,
 * nenhum valor com cor de alerta, total nunca sozinho (regra 4),
 * lacuna com motivo (regra 5).
 */

function contagem(n: number): string {
  return `${fmtNumero(n)} ${n === 1 ? "emenda" : "emendas"}`;
}

export default function DetalheEmendasEstaduais({
  registro,
  referencia,
  anos,
  recorte,
  conferencia,
  fonte,
}: {
  registro: EmendasEstaduaisDoCandidato;
  referencia: ReferenciaEmendas | null;
  anos: number[];
  recorte: string;
  conferencia: ConferenciaDaFonte;
  fonte: Fonte;
}) {
  const { emendas } = registro;
  const totais = emendas.totais;
  const comValores = emendas.valoresPublicados && totais !== null;
  const primeiroAno = emendas.porAno[0]?.ano;
  const faltamAnosNoComeco = primeiroAno != null && primeiroAno > anos[0];

  return (
    <div className="space-y-10">
      {/* ---------- Quantas, e o que dá para dizer sobre elas ---------- */}
      <section>
        <p className="text-sm text-tinta-700">
          <Termo id="emenda-parlamentar">Emenda parlamentar</Termo> estadual é a
          fatia do Orçamento do Espírito Santo que cada deputado estadual
          aponta para onde deve ser gasta. {registro.nomeUrna} tem{" "}
          <strong>{contagem(emendas.quantidade)}</strong> de autoria própria
          entre {anos[0]} e {anos.at(-1)}.
        </p>

        {comValores && totais ? (
          <>
            {/* Total nunca sozinho: regra 4. */}
            <dl className="mt-4 grid gap-4 border-y border-tinta-300 py-4 sm:grid-cols-3">
              <div>
                <dt className="rotulo-meta">Empenhado no período</dt>
                <dd className="mt-1 font-mono text-lg font-bold tabular-nums text-tinta-900">
                  {reais(totais.empenhado)}
                </dd>
              </div>
              <div>
                <dt className="rotulo-meta">Efetivamente pago</dt>
                <dd className="mt-1 font-mono text-lg tabular-nums text-tinta-900">
                  {reais(totais.pago)}
                </dd>
              </div>
              {referencia ? (
                <div>
                  <dt className="rotulo-meta">
                    Mediana empenhada da bancada ({referencia.bancada} pessoas
                    exerceram o mandato no período)
                  </dt>
                  <dd className="mt-1 font-mono text-lg tabular-nums text-tinta-700">
                    {reais(referencia.medianaEmpenhado)}
                  </dd>
                </div>
              ) : null}
            </dl>

            {referencia ? (
              <p className="mt-2 text-xs text-tinta-600">
                A faixa da bancada vai de {reais(referencia.menor)} a{" "}
                {reais(referencia.maior)} empenhados no mesmo período. A mediana
                e a faixa estão aqui de propósito: um valor sozinho não diz se
                é alto ou baixo, e esta plataforma não classifica ninguém. A
                bancada inclui quem entrou ou saiu durante a legislatura, então
                nem todos destinaram emendas pelo mesmo número de anos.
              </p>
            ) : null}

            <p className="mt-4 text-sm text-tinta-700">
              <strong>
                Destinar não é empenhar, e empenhar não é pagar.
              </strong>{" "}
              As emendas destinaram {reais(totais.previsto)} no Orçamento; até
              a coleta, {reais(totais.empenhado)} tinham sido empenhados
              (reservados) e {reais(totais.pago)} efetivamente pagos. A
              diferença pode ainda virar pagamento — a execução do ano corrente
              está em andamento e a fonte registra{" "}
              {reais(totais.restosAPagar)} em <em>restos a pagar</em> — ou pode
              nunca sair.
            </p>
          </>
        ) : (
          /* Modo sem valor: o aviso vem antes dos gráficos. */
          <Alert className="mt-4">
            <AlertTitle>
              O valor em reais não aparece aqui — e o motivo é a fonte
            </AlertTitle>
            <AlertDescription>
              <p>
                A conferência automática desta coleta encontrou{" "}
                <strong>{fmtNumero(conferencia.totalDeProblemas)}</strong>{" "}
                inconsistências nos arquivos da SEFAZ, e valores que não
                conferem não são publicados.
              </p>
              {conferencia.problemas[0] ? (
                <p className="mt-2">
                  Um exemplo, como saiu da fonte:{" "}
                  <span className="font-mono text-xs">
                    {conferencia.problemas[0]}
                  </span>
                </p>
              ) : null}
              <p className="mt-2">
                <strong>
                  O resto do que a fonte diz sobre estas emendas continua de
                  pé.
                </strong>{" "}
                Quantas são, para quais municípios foram e em que áreas — isso
                vem de campos de texto e de contagem, e está abaixo. Os valores
                estão nos arquivos oficiais, no link do rodapé deste bloco.
              </p>
              <p className="mt-2">
                Esta plataforma volta a publicar os valores sozinha no dia em
                que a fonte voltar a conferir.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </section>

      {/* ---------- Para onde foi ---------- */}
      <section>
        <h4 className="text-base font-bold text-tinta-950">Para onde foi</h4>
        <p className="mt-1 text-sm text-tinta-600">
          O município do gasto, como a fonte o publica. Emenda sem município
          aparece pela região beneficiada declarada na LOA.
        </p>
        <div className="mt-5">
          <GraficoBarras
            legenda={`Emendas estaduais de ${registro.nomeUrna} por localidade do gasto`}
            formatar={comValores ? reais : contagem}
            itens={emendas.porLocalidade.slice(0, 12).map((l) => ({
              rotulo: l.nome,
              valor: comValores ? (l.empenhado ?? 0) : l.quantidade,
              detalhe: comValores
                ? `${contagem(l.quantidade)} · ${reais(l.pago ?? 0)} pagos`
                : undefined,
            }))}
          />
        </div>
      </section>

      {/* ---------- Em que área ---------- */}
      <section>
        <h4 className="text-base font-bold text-tinta-950">Em que área</h4>
        <p className="mt-1 text-sm text-tinta-600">
          A função orçamentária de cada execução. Uma emenda pode executar em
          mais de uma área — nesse caso ela conta nas duas, com o dinheiro de
          cada parte na área em que foi gasto. Por isso a soma das áreas pode
          passar do total de emendas.
        </p>
        <div className="mt-5">
          <GraficoBarras
            legenda={`Emendas estaduais de ${registro.nomeUrna} por área`}
            formatar={comValores ? reais : contagem}
            itens={emendas.porFuncao.slice(0, 12).map((f) => ({
              rotulo: f.nome,
              valor: comValores ? (f.empenhado ?? 0) : f.quantidade,
              detalhe: comValores
                ? `${contagem(f.quantidade)} · ${reais(f.pago ?? 0)} pagos`
                : undefined,
            }))}
          />
        </div>
      </section>

      {/* ---------- Ano a ano ---------- */}
      <section>
        <h4 className="text-base font-bold text-tinta-950">Ano a ano</h4>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ano</TableHead>
                <TableHead className="text-right">Emendas</TableHead>
                {comValores ? (
                  <>
                    <TableHead className="text-right">Empenhado</TableHead>
                    <TableHead className="text-right">Pago</TableHead>
                  </>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {emendas.porAno.map((a) => (
                <TableRow key={a.ano}>
                  {/* Sem rótulo: no celular o ano abre a ficha. */}
                  <TableCellNumero className="text-left">
                    {a.ano}
                  </TableCellNumero>
                  <TableCellNumero rotulo="Emendas">
                    {fmtNumero(a.quantidade)}
                  </TableCellNumero>
                  {comValores ? (
                    <>
                      <TableCellNumero rotulo="Empenhado">
                        {reais(a.empenhado ?? 0)}
                      </TableCellNumero>
                      <TableCellNumero rotulo="Pago">
                        {reais(a.pago ?? 0)}
                      </TableCellNumero>
                    </>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Regra 5: a lacuna se declara, e com o motivo. */}
        {faltamAnosNoComeco ? (
          <p className="mt-3 text-xs text-tinta-600">
            Não há emenda{" "}
            {primeiroAno - 1 === anos[0]
              ? `de ${anos[0]}`
              : `de ${anos[0]} a ${primeiroAno - 1}`}{" "}
            nesta lista. O Orçamento de um ano é emendado no ano anterior: quem
            assumiu o mandato em 2023 não participou da elaboração da LOA de{" "}
            {anos[0]}. A ausência é do calendário orçamentário, não da pessoa.
          </p>
        ) : null}
      </section>

      {/* ---------- A lista ---------- */}
      <section>
        <h4 className="text-base font-bold text-tinta-950">
          {comValores
            ? `As ${emendas.lista.length} maiores emendas`
            : "Emendas, uma a uma"}
        </h4>
        <p className="mt-1 text-sm text-tinta-600">
          Recorte: {emendas.criterioDaLista}
          {emendas.quantidade > emendas.lista.length
            ? `, de ${contagem(emendas.quantidade)} no período`
            : ""}
          . A finalidade é o texto da própria LOA. O portal estadual não tem
          página por emenda — o registro completo está nos arquivos oficiais da
          SEFAZ, no link abaixo da tabela.
        </p>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Finalidade</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Localidade</TableHead>
                {comValores ? (
                  <>
                    <TableHead className="text-right">Empenhado</TableHead>
                    <TableHead className="text-right">Pago</TableHead>
                  </>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {emendas.lista.map((e) => (
                <TableRow key={`${e.ano}-${e.numero}`}>
                  {/* Sem rótulo: no celular a finalidade abre a ficha. */}
                  <TableCell larga className="max-w-md">
                    <span className="block text-sm text-tinta-900">
                      {e.objeto ?? "Sem finalidade registrada"}
                    </span>
                    <span className="block text-xs text-tinta-600">
                      {e.funcao ?? "Área não informada"} · Emenda {e.numero}
                    </span>
                  </TableCell>
                  <TableCellNumero rotulo="Ano" className="text-left">
                    {e.ano}
                  </TableCellNumero>
                  <TableCell rotulo="Localidade">{e.localidade}</TableCell>
                  {comValores ? (
                    <>
                      <TableCellNumero rotulo="Empenhado">
                        {reais(e.empenhado ?? 0)}
                      </TableCellNumero>
                      <TableCellNumero rotulo="Pago">
                        {reais(e.pago ?? 0)}
                      </TableCellNumero>
                    </>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="mt-3 text-sm">
          <a href={fonte.url} rel="nofollow noopener">
            Abrir os arquivos oficiais no catálogo de dados do estado
            <IconeLinkExterno className="ml-1 inline" />
          </a>
        </p>
      </section>

      {/* ---------- O que a fonte não mostra ---------- */}
      <Alert>
        <AlertTitle>O que esta fonte não mostra</AlertTitle>
        <AlertDescription>
          <p>{recorte}</p>
          <p className="mt-2">
            A fonte também não diz o que foi comprado com o dinheiro. Ela
            registra a destinação, a área e a fase da execução. O que cada
            órgão ou município fez com o repasse é prestação de contas de
            outro lugar.
          </p>
          {registro.foraDoPeriodo > 0 ? (
            <p className="mt-2">
              {registro.nomeUrna} tem outras{" "}
              {fmtNumero(registro.foraDoPeriodo)} emendas nas LOAs de 2021 e
              2022, anteriores à legislatura atual. Elas ficam de fora porque
              esta aba descreve o mandato atual.
            </p>
          ) : null}
        </AlertDescription>
      </Alert>
    </div>
  );
}
