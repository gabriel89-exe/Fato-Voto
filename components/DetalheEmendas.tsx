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
  EmendasDoParlamentar,
  ReferenciaEmendas,
} from "@/types";

/**
 * Emendas parlamentares.
 *
 * O PRINCÍPIO QUE GOVERNA ESTE ARQUIVO é o mesmo de DetalheDespesas:
 * mostrar o fato que convida ao escrutínio, sem afirmar irregularidade.
 * Nada é adjetivado, nenhum valor recebe cor de alerta, e o link leva à
 * página daquela emenda no portal — não à lista de emendas.
 *
 * Três coisas específicas desta fonte pesam na tela:
 *
 * 1. EMPENHADO NÃO É PAGO. Empenhar é reservar; pagar é o dinheiro
 *    sair. Publicar só o empenhado sugeriria dinheiro entregue que
 *    talvez não tenha saído; publicar só o pago esconderia o que foi
 *    destinado. Os dois aparecem sempre juntos, com a diferença dita
 *    em palavras.
 *
 * 2. O TOTAL NÃO VAI SOZINHO. Vem ao lado da mediana e da faixa da
 *    bancada do mesmo cargo — deputado com deputado, senador com
 *    senador, porque a cota de emenda dos dois tem tamanho diferente.
 *    Ver docs/principios.md, regra 4.
 *
 * 3. AUSÊNCIA NÃO É OMISSÃO DA PESSOA. Deputado de primeiro mandato não
 *    tem emenda de 2023: o Orçamento daquele ano foi emendado em 2022,
 *    pela legislatura anterior. A tela diz isso, em vez de deixar o
 *    vazio parecer inércia. Ver regra 5.
 *
 * 4. FONTE REPROVADA NA CONFERÊNCIA NÃO VIRA NÚMERO. A coleta confere a
 *    API antes de publicar, e quando ela devolve valores que não batem
 *    entre si, a ficha diz isso — com o exemplo — em vez de mostrar um
 *    número que não se sustenta. É a regra 5 aplicada à própria fonte.
 */

/** Nome da localidade como a fonte publica, só com caixa legível. */
function localidadeLegivel(nome: string): string {
  if (nome === "MÚLTIPLO") return "Vários municípios";
  return nome;
}

export default function DetalheEmendas({
  registro,
  referencia,
  anos,
  recorte,
  conferencia,
}: {
  registro: EmendasDoParlamentar;
  referencia: ReferenciaEmendas | null;
  anos: number[];
  recorte: string;
  conferencia: ConferenciaDaFonte;
}) {
  /*
   * A fonte não passou na conferência. Nada dela vira número aqui —
   * nem os valores que pareceriam certos, porque não há como saber
   * quais estão certos. Ver o item 4 do cabeçalho.
   */
  if (!conferencia.aprovada) {
    return (
      <Alert>
        <AlertTitle>
          A fonte está devolvendo valores que não batem entre si
        </AlertTitle>
        <AlertDescription>
          <p>
            Antes de publicar, esta plataforma pergunta duas vezes à API do
            Portal da Transparência e compara as respostas. Nesta coleta, as
            duas não bateram em{" "}
            <strong>{fmtNumero(conferencia.totalDeProblemas)}</strong> pontos —
            a mesma emenda voltou com valores diferentes em consultas seguidas,
            e há registro com valor pago maior que o empenhado, o que é
            impossível.
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
            Por isso <strong>nenhum valor de emenda aparece nesta ficha</strong>.
            Publicar um número que a própria fonte não confirma seria pior que
            não publicar: ele iria para a tela ao lado de um selo de dado
            oficial, sem nada avisando. A coleta roda todo dia e volta a
            publicar assim que as duas consultas concordarem.
          </p>
          <p className="mt-2">
            As emendas de {registro.nomeUrna} existem e são públicas — elas
            estão no portal, que é a fonte primária.{" "}
            <a
              href="https://portaldatransparencia.gov.br/emendas/consulta"
              rel="nofollow noopener"
              className="inline-flex items-center gap-1"
            >
              Consultar no Portal da Transparência
              <IconeLinkExterno />
            </a>
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  /*
   * Homônimo na fonte: dois autores com o mesmo nome e códigos de autor
   * diferentes. A coleta se recusa a atribuir, e a tela explica — um
   * número errado aqui seria pior que a ausência dele.
   */
  if (registro.ambiguidadeDeHomonimo) {
    return (
      <Alert>
        <AlertTitle>Esta fonte não permite separar as pessoas</AlertTitle>
        <AlertDescription>
          <p>
            O Portal da Transparência identifica o autor da{" "}
            <Termo id="emenda-parlamentar">emenda</Termo> pelo nome, e há mais
            de uma pessoa registrada como{" "}
            <strong>{registro.nomeAutorNaFonte}</strong>. Sem um identificador
            que as separe, atribuir qualquer valor seria adivinhar — e este site
            prefere dizer que não sabe.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  const { emendas } = registro;
  const { totais } = emendas;
  const naoPago = totais.empenhado - totais.pago;
  const primeiroAno = emendas.porAno[0]?.ano;
  const faltamAnosNoComeco = primeiroAno != null && primeiroAno > anos[0];

  if (emendas.quantidade === 0) {
    return (
      <Alert>
        <AlertTitle>Nenhuma emenda registrada no período</AlertTitle>
        <AlertDescription>
          <p>
            O Portal da Transparência não registra{" "}
            <Termo id="emenda-parlamentar">emenda</Termo> de autoria de{" "}
            {registro.nomeUrna} entre {anos[0]} e {anos.at(-1)}. A ausência é da
            fonte: o portal publica o que foi executado, e o que não foi
            executado não aparece.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-10">
      {/* ---------- Quanto, e comparado com o quê ---------- */}
      <section>
        <p className="text-sm text-tinta-700">
          <Termo id="emenda-parlamentar">Emenda parlamentar</Termo> é a fatia do
          Orçamento que cada parlamentar aponta para onde deve ser gasta. Abaixo
          estão as {fmtNumero(emendas.quantidade)} emendas de autoria de{" "}
          {registro.nomeUrna} entre {anos[0]} e {anos.at(-1)}.
        </p>

        {/* Empenhado e pago lado a lado, e o total nunca sozinho:
            sem o denominador da bancada, número maior parece pior ou
            melhor. Ver docs/principios.md, regra 4. */}
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
                Mediana empenhada da bancada ({referencia.bancada}{" "}
                {registro.cargo === "Senador" ? "senadores" : "deputados"} do ES)
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
            {reais(referencia.maior)} empenhados no mesmo período. A mediana e a
            faixa estão aqui de propósito: um valor sozinho não diz se é alto ou
            baixo, e esta plataforma não classifica ninguém. A comparação é
            entre {registro.cargo === "Senador" ? "senadores" : "deputados"}{" "}
            porque a cota de emenda dos dois cargos tem tamanho diferente.
            {referencia.bancada <= 3 ? (
              <>
                {" "}
                Com {referencia.bancada} no cargo, a mediana é literalmente o
                valor do meio entre eles — denominador estreito, e vale saber
                disso ao ler.
              </>
            ) : null}
          </p>
        ) : null}

        {/* Empenhar não é pagar. É a leitura que mais muda de sentido
            quando falta, e por isso vem em texto, não em rodapé. */}
        <p className="mt-4 text-sm text-tinta-700">
          <strong>Empenhar é reservar o dinheiro; pagar é o dinheiro sair.</strong>{" "}
          Dos {reais(totais.empenhado)} empenhados, {reais(totais.pago)} foram
          pagos — uma diferença de {reais(naoPago)}. Parte dela pode ainda virar{" "}
          pagamento nos próximos anos, como <em>restos a pagar</em>; parte pode
          nunca sair. O portal registra {reais(totais.restosInscritos)} inscritos
          em restos a pagar e {reais(totais.restosPagos)} já pagos por essa via.
        </p>
      </section>

      {/* ---------- Para onde foi ---------- */}
      <section>
        <h4 className="text-base font-bold text-tinta-950">Para onde foi</h4>
        <p className="mt-1 text-sm text-tinta-600">
          A localidade do gasto, como o portal a publica. &ldquo;Vários
          municípios&rdquo; é o rótulo da própria fonte para emenda que a
          execução distribuiu entre mais de um lugar — não é imprecisão nossa.
        </p>
        <div className="mt-5">
          <GraficoBarras
            legenda={`Emendas de ${registro.nomeUrna} por localidade do gasto, em valor empenhado`}
            formatar={reais}
            itens={emendas.porLocalidade.slice(0, 12).map((l) => ({
              rotulo: localidadeLegivel(l.nome),
              valor: l.empenhado,
              detalhe: `${fmtNumero(l.quantidade)} ${l.quantidade === 1 ? "emenda" : "emendas"} · ${reais(l.pago)} pagos`,
            }))}
          />
        </div>
      </section>

      {/* ---------- Em que área ---------- */}
      <section>
        <h4 className="text-base font-bold text-tinta-950">Em que área</h4>
        <p className="mt-1 text-sm text-tinta-600">
          A função orçamentária declarada em cada emenda.{" "}
          <em>Encargos especiais</em> é a classificação usada nas transferências
          especiais, em que o dinheiro vai para o município sem finalidade
          detalhada no Orçamento federal — a fonte não diz em que foi aplicado.
        </p>
        <div className="mt-5">
          <GraficoBarras
            legenda={`Emendas de ${registro.nomeUrna} por área, em valor empenhado`}
            formatar={reais}
            itens={emendas.porFuncao.slice(0, 12).map((f) => ({
              rotulo: f.nome,
              valor: f.empenhado,
              detalhe: `${fmtNumero(f.quantidade)} ${f.quantidade === 1 ? "emenda" : "emendas"} · ${reais(f.pago)} pagos`,
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
                <TableHead className="text-right">Empenhado</TableHead>
                <TableHead className="text-right">Pago</TableHead>
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
                  <TableCellNumero rotulo="Empenhado">
                    {reais(a.empenhado)}
                  </TableCellNumero>
                  <TableCellNumero rotulo="Pago">
                    {reais(a.pago)}
                  </TableCellNumero>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Regra 5: a lacuna se declara, e com o motivo. Sem isto, o
            primeiro mandato parece inércia. */}
        {faltamAnosNoComeco ? (
          <p className="mt-3 text-xs text-tinta-600">
            Não há emenda{" "}
            {primeiroAno - 1 === anos[0]
              ? `de ${anos[0]}`
              : `de ${anos[0]} a ${primeiroAno - 1}`}{" "}
            nesta lista. O Orçamento de um ano é emendado no ano anterior: quem
            assumiu o mandato em {anos[0]} não participou da elaboração do
            Orçamento de {anos[0]}. A ausência é do calendário orçamentário,
            não da pessoa.
          </p>
        ) : null}
      </section>

      {/* ---------- As maiores ---------- */}
      <section>
        <h4 className="text-base font-bold text-tinta-950">
          As {emendas.maiores.length} maiores emendas
        </h4>
        <p className="mt-1 text-sm text-tinta-600">
          Ordenadas por valor empenhado, com o link para a página de cada uma no
          portal. É lá que estão o programa, a ação orçamentária e os documentos
          de execução.
        </p>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Área</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Localidade</TableHead>
                <TableHead className="text-right">Empenhado</TableHead>
                <TableHead className="text-right">Pago</TableHead>
                <TableHead>No portal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emendas.maiores.map((e) => (
                <TableRow key={e.codigo}>
                  {/* Sem rótulo: no celular a área abre a ficha. */}
                  <TableCell>
                    <span className="block font-medium text-tinta-900">
                      {e.funcao ?? "Não informada"}
                    </span>
                    {e.subfuncao ? (
                      <span className="block text-xs text-tinta-600">
                        {e.subfuncao}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCellNumero rotulo="Ano" className="text-left">
                    {e.ano}
                  </TableCellNumero>
                  <TableCell rotulo="Localidade">
                    {e.localidade ? localidadeLegivel(e.localidade) : "—"}
                  </TableCell>
                  <TableCellNumero rotulo="Empenhado">
                    {reais(e.empenhado)}
                  </TableCellNumero>
                  <TableCellNumero rotulo="Pago">
                    {reais(e.pago)}
                  </TableCellNumero>
                  <TableCell rotulo="No portal">
                    <a
                      href={e.paginaOficial}
                      rel="nofollow noopener"
                      className="inline-flex items-center gap-1 whitespace-nowrap text-sm"
                    >
                      Emenda {e.codigo}
                      <IconeLinkExterno />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* ---------- O que a fonte não mostra ---------- */}
      <Alert>
        <AlertTitle>O que esta fonte não mostra</AlertTitle>
        <AlertDescription>
          <p>{recorte}</p>
          <p className="mt-2">
            Emenda de bancada estadual e de comissão não tem autor individual na
            fonte: ela existe, move dinheiro, e não entra em soma de pessoa
            nenhuma — nem na desta ficha. A ausência delas aqui é do desenho do
            instrumento, não de quem assina esta ficha.
          </p>
          <p className="mt-2">
            O portal também não diz o que foi comprado com o dinheiro. Ele
            registra a quem o recurso foi destinado, em que área e em que fase
            da execução está. O que cada município fez com o repasse é
            prestação de contas de outro órgão.
          </p>
          {registro.foraDoPeriodo > 0 ? (
            <p className="mt-2">
              {registro.nomeUrna} tem outras {fmtNumero(registro.foraDoPeriodo)}{" "}
              emendas no portal, de anos anteriores a {anos[0]}. Elas ficam de
              fora porque esta aba descreve o mandato atual.
            </p>
          ) : null}
        </AlertDescription>
      </Alert>
    </div>
  );
}
