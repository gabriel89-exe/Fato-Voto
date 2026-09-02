import Link from "next/link";
import { notFound } from "next/navigation";
import AvatarCandidato from "@/components/AvatarCandidato";
import DadoOficial from "@/components/DadoOficial";
import DetalheDespesas from "@/components/DetalheDespesas";
import DetalheEmendas from "@/components/DetalheEmendas";
import DetalheEmendasEstaduais from "@/components/DetalheEmendasEstaduais";
import Termo from "@/components/Termo";
import { GraficoComposicao, GraficoEvolucao } from "@/components/graficos";
import { IconeLinkExterno, IconeSeta } from "@/components/icones";
import NumeroUrna from "@/components/NumeroUrna";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableCellNumero,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Votacoes from "@/components/Votacoes";
import {
  ANOS_EMENDAS,
  ANOS_EMENDAS_ESTADUAIS,
  candidaturas,
  COLETADO_EM,
  COLETADO_EM_CAMARA,
  COLETADO_EM_EMENDAS,
  COLETADO_EM_EMENDAS_ESTADUAIS,
  CONFERENCIA_EMENDAS,
  CONFERENCIA_EMENDAS_ESTADUAIS,
  COLETADO_EM_SENADO,
  COLETADO_EM_VOTACOES,
  CRITERIO_VOTACOES,
  ELEICAO,
  emendasDoMandato,
  emendasEstaduaisDaCandidatura,
  ESTADO,
  FONTE_CAMARA,
  FONTE_EMENDAS_ESTADUAIS,
  FONTE_SENADO,
  FONTE_TRANSPARENCIA,
  FONTE_TSE,
  LEGISLATURA,
  obterCandidatura,
  obterMandato,
  obterMandatoSenado,
  QUANTAS_VOTACOES,
  RECORTE_EMENDAS,
  RECORTE_EMENDAS_ESTADUAIS,
  REFERENCIA_EMENDAS_ESTADUAIS,
  referenciaBancada,
  referenciaEmendas,
  traduzirVotoSenado,
  votacoesDoDeputado,
  votacoesDoSenador,
} from "@/lib/eleicao";
import { dataCurta, idadeEm, numero as fmtNumero, reais } from "@/lib/formato";

export function generateStaticParams() {
  return candidaturas.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = obterCandidatura(id);
  return { title: c ? c.nomeUrna : "Candidatura não encontrada" };
}

/** Rótulo + valor, com "Não informado" explícito quando falta. */
function Campo({ rotulo, valor }: { rotulo: string; valor: string | null }) {
  return (
    <div>
      <dt className="rotulo-meta">{rotulo}</dt>
      <dd className={`mt-0.5 ${valor ? "text-tinta-800" : "text-tinta-500"}`}>
        {valor ?? "Não informado"}
      </dd>
    </div>
  );
}

export default async function PaginaCandidato({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = obterCandidatura(id);
  if (!c) notFound();

  const mandato = obterMandato(c);
  const mandatoSenado = obterMandatoSenado(c);

  /*
   * Emendas vêm do Portal da Transparência e são buscadas pelo `id` do
   * mandato, não pelo nome: a coleta já casou nome com código de autor,
   * com trava contra homônimo. Refazer o casamento aqui só criaria uma
   * segunda chance de errar. Ver scripts/coleta/transparencia.mjs.
   */
  const emendasDeCamara = mandato ? emendasDoMandato(mandato.id) : null;
  const emendasDeSenado = mandatoSenado
    ? emendasDoMandato(mandatoSenado.id)
    : null;

  /*
   * Mandato estadual: a ALES não tem fonte de bancada coletável, então
   * o que existe é o que a SEFAZ prova — as emendas que a pessoa
   * assinou como deputada estadual na legislatura atual. O casamento
   * por nome, com código de autor e desistência em ambiguidade, foi
   * feito na coleta. Ver scripts/coleta/emendas-estaduais.mjs.
   */
  const emendasEstaduais =
    !mandato && !mandatoSenado ? emendasEstaduaisDaCandidatura(c.id) : null;
  const idade = c.dataNascimento ? idadeEm(c.dataNascimento) : null;

  return (
    <div className="envelope py-8 sm:py-10">
      <Link
        href="/candidatos"
        className="inline-flex min-h-toque items-center gap-2 text-sm font-medium no-underline"
      >
        <IconeSeta className="h-3.5 w-3.5 rotate-180" />
        Voltar para a lista
      </Link>

      <article className="mt-5">
        {/* ---------- Cabeçote da ficha ---------- */}
        <header className="entrada border-y border-tinta-200 py-6">
          <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-tinta-600">
            <span>Ficha de candidatura</span>
            <span className="text-tinta-400">
              {ESTADO.nome} ({ESTADO.sigla}) · Eleição {ELEICAO.ano}
            </span>
          </p>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
            <AvatarCandidato nome={c.nomeUrna} tamanho="lg" />
            <div className="min-w-0 flex-1">
              <h1 className="text-[clamp(2rem,1.4rem+3vw,3.4rem)]">
                {c.nomeUrna}
              </h1>
              <p className="mt-1 font-texto text-lg italic text-tinta-600">
                {c.nomeCompleto}
              </p>
              <div className="mt-4">
                <NumeroUrna numero={c.numero} tamanho="lg" />
              </div>
            </div>
          </div>
        </header>

        <dl className="mt-6 grid gap-x-8 gap-y-4 border-l-4 border-acento pl-5 text-sm sm:grid-cols-2">
          <Campo rotulo="Cargo em disputa" valor={`${c.cargo} — ${c.uf}`} />
          <Campo
            rotulo="Partido"
            valor={
              c.partido ? `${c.partido.sigla} — ${c.partido.nome}` : null
            }
          />
          <div className="sm:col-span-2">
            <Campo rotulo="Coligação" valor={c.coligacao} />
          </div>
        </dl>

        {/* ---------- Situação do registro ---------- */}
        <div className="mt-6 rounded-md border border-tinta-200 bg-papel-baixa px-4 py-3">
          <p className="text-sm">
            <span className="font-semibold text-tinta-900">
              Situação do registro: {c.situacaoRegistro ?? "Não informada"}.
            </span>{" "}
            <span className="text-tinta-700">
              {c.apto
                ? "A Justiça Eleitoral já julgou este registro. A decisão ainda pode mudar em recurso."
                : "O registro ainda não foi julgado pela Justiça Eleitoral. Enquanto não há decisão final, o nome pode continuar na lista."}
            </span>
          </p>
          <p className="rotulo-meta mt-1">
            Coletado em {dataCurta(COLETADO_EM)}. Fonte: {FONTE_TSE.nome}.{" "}
            <a href={c.paginaOficial} rel="nofollow noopener" className="text-tinta-800">
              Abrir a divulgação de candidaturas do TSE
            </a>
            .
          </p>
        </div>

        {/* ================= Abas ================= */}
        <div className="mt-10">
          <Tabs defaultValue="perfil">
            <TabsList>
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="proposta">Proposta</TabsTrigger>
              <TabsTrigger value="bens">Bens</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              {mandato || mandatoSenado || emendasEstaduais ? (
                <TabsTrigger value="mandato">Mandato</TabsTrigger>
              ) : null}
            </TabsList>

            {/* ---------- Perfil ---------- */}
            <TabsContent value="perfil">
              <DadoOficial
                titulo="Dados declarados no registro"
                fonte={FONTE_TSE.nome}
                coletadoEm={COLETADO_EM}
                urlOriginal={c.paginaOficial}
              >
                <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  <Campo
                    rotulo="Idade"
                    valor={idade !== null ? `${idade} anos` : null}
                  />
                  <Campo rotulo="Gênero" valor={c.genero} />
                  <Campo rotulo="Cor ou raça (autodeclarada)" valor={c.corRaca} />
                  <Campo rotulo="Escolaridade" valor={c.escolaridade} />
                  <Campo rotulo="Ocupação declarada" valor={c.ocupacao} />
                  <Campo rotulo="Naturalidade" valor={c.naturalidade} />
                </dl>
              </DadoOficial>
            </TabsContent>

            {/* ---------- Proposta ---------- */}
            <TabsContent value="proposta">
              {!c.proposta.exigida ? (
                /* Distinção que evita acusar alguém de uma omissão que
                   não existe: a lei só exige proposta de candidatura
                   majoritária do Executivo. */
                <Alert>
                  <AlertTitle>
                    Este cargo não entrega proposta de governo
                  </AlertTitle>
                  <AlertDescription>
                    A lei eleitoral exige o registro de proposta de governo
                    apenas para as candidaturas majoritárias do Executivo —
                    Presidente, Governador e Prefeito. A ausência aqui não é
                    omissão de {c.nomeUrna}: o cargo de {c.cargo} não prevê esse
                    documento.
                  </AlertDescription>
                </Alert>
              ) : c.proposta.documento ? (
                <DadoOficial
                  titulo="Proposta de governo entregue no registro"
                  fonte={FONTE_TSE.nome}
                  coletadoEm={COLETADO_EM}
                  urlOriginal={c.paginaOficial}
                >
                  <p className="text-sm text-tinta-700">
                    A candidatura anexou a proposta de governo ao pedido de
                    registro. O documento é público e está disponível na página
                    oficial da candidatura.
                  </p>
                  <p className="mt-3 font-mono text-xs text-tinta-600">
                    Arquivo: {c.proposta.documento.nomeArquivo}
                  </p>
                  <p className="mt-3 text-sm">
                    <a href={c.paginaOficial} rel="nofollow noopener">
                      Abrir a proposta no site do TSE
                      <IconeLinkExterno className="ml-1 inline" />
                    </a>
                  </p>
                </DadoOficial>
              ) : (
                <Alert>
                  <AlertTitle>Proposta de governo não localizada</AlertTitle>
                  <AlertDescription>
                    O cargo de {c.cargo} exige o registro de proposta de
                    governo, mas ela não foi encontrada entre os documentos
                    desta candidatura na coleta de {dataCurta(COLETADO_EM)}. O
                    documento pode ter sido anexado depois.
                  </AlertDescription>
                </Alert>
              )}

              {c.documentos.length > 0 ? (
                <div className="mt-5">
                  <p className="rotulo-meta mb-2">
                    Outros documentos entregues no registro
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {c.documentos
                      .filter((d) => d.tipo !== "Proposta de governo")
                      .map((d) => (
                        <li key={d.id}>
                          <Badge variant="discreto">{d.tipo}</Badge>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}
            </TabsContent>

            {/* ---------- Bens ---------- */}
            <TabsContent value="bens">
              {!c.divulgacaoAutorizada.bens ? (
                <Alert>
                  <AlertTitle>Bens não disponíveis para divulgação</AlertTitle>
                  <AlertDescription>
                    O Tribunal Superior Eleitoral não autoriza a divulgação dos
                    bens desta candidatura. A omissão é da fonte, não desta
                    plataforma.
                  </AlertDescription>
                </Alert>
              ) : c.bens.length === 0 ? (
                <Alert>
                  <AlertTitle>Nenhum bem declarado</AlertTitle>
                  <AlertDescription>
                    A candidatura não declarou bens no pedido de registro. Não
                    declarar bens é permitido e não indica irregularidade.
                  </AlertDescription>
                </Alert>
              ) : (
                <DadoOficial
                  titulo="Bens declarados no registro"
                  fonte={FONTE_TSE.nome}
                  coletadoEm={COLETADO_EM}
                  urlOriginal={c.paginaOficial}
                >
                  <p className="mb-4 text-sm text-tinta-700">
                    Total declarado:{" "}
                    <strong className="font-mono tabular-nums">
                      {reais(c.totalBens ?? 0)}
                    </strong>{" "}
                    em {c.bens.length}{" "}
                    {c.bens.length === 1 ? "bem" : "bens"}. Valores nominais,
                    como declarados, sem correção pela inflação.
                  </p>

                  <GraficoComposicao
                    legenda={`Composição dos bens declarados por ${c.nomeUrna}`}
                    itens={[...c.bens]
                      .sort((a, b) => b.valor - a.valor)
                      .map((b) => ({ rotulo: b.tipo, valor: b.valor }))}
                  />

                  <div className="mt-5">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...c.bens]
                          .sort((a, b) => b.valor - a.valor)
                          .map((b) => (
                            <TableRow key={b.ordem}>
                              {/* Sem rótulo: no celular o tipo abre a ficha. */}
                              <TableCell>{b.tipo}</TableCell>
                              <TableCell rotulo="Descrição" larga>
                                {b.descricao}
                              </TableCell>
                              <TableCellNumero rotulo="Valor">
                                {reais(b.valor)}
                              </TableCellNumero>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </DadoOficial>
              )}
            </TabsContent>

            {/* ---------- Histórico ---------- */}
            <TabsContent value="historico">
              {c.primeiraCandidatura ? (
                <Alert>
                  <AlertTitle>Primeira candidatura registrada</AlertTitle>
                  <AlertDescription>
                    Não há candidatura anterior de {c.nomeUrna} nos registros do
                    TSE. Estrear numa eleição não é falta de qualificação: é só
                    a ausência de histórico eleitoral para consultar.
                  </AlertDescription>
                </Alert>
              ) : (
                <DadoOficial
                  titulo="Candidaturas anteriores"
                  fonte={FONTE_TSE.nome}
                  coletadoEm={COLETADO_EM}
                  urlOriginal={c.paginaOficial}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ano</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Partido</TableHead>
                        <TableHead>UF</TableHead>
                        <TableHead>Resultado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {c.eleicoesAnteriores.map((e, i) => (
                        <TableRow key={`${e.ano}-${e.cargo}-${i}`}>
                          <TableCellNumero rotulo="Ano" className="text-left">
                            {e.ano}
                          </TableCellNumero>
                          {/* Sem rótulo: no celular o cargo abre a ficha. */}
                          <TableCell>{e.cargo}</TableCell>
                          <TableCell rotulo="Partido">{e.partido}</TableCell>
                          <TableCell rotulo="UF">{e.uf}</TableCell>
                          <TableCell rotulo="Resultado">
                            {e.resultado ?? "Não informado"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DadoOficial>
              )}
            </TabsContent>

            {/* ---------- Mandato no Senado (só quando há) ---------- */}
            {mandatoSenado ? (
              <TabsContent value="mandato">
                <DadoOficial
                  titulo="Mandato de senador em exercício"
                  fonte={FONTE_SENADO.nome}
                  coletadoEm={COLETADO_EM_SENADO}
                  urlOriginal={mandatoSenado.paginaOficial}
                >
                  <p className="text-sm text-tinta-700">
                    {c.nomeUrna} exerce mandato de <strong>senador</strong> pelo{" "}
                    {mandatoSenado.uf}
                    {mandatoSenado.mandato?.inicio && mandatoSenado.mandato?.fim
                      ? `, de ${dataCurta(mandatoSenado.mandato.inicio)} a ${dataCurta(mandatoSenado.mandato.fim)}`
                      : ""}
                    {c.cargo !== "Senador"
                      ? ` e disputa agora o cargo de ${c.cargo}`
                      : ""}
                    .
                  </p>

                  {/*
                    Agrupamento por tipo, nunca um total único: somar um
                    requerimento de sessão solene com um projeto de lei
                    descreveria mal. E a lista abaixo é descritiva — não há
                    contagem em destaque, porque contagem convida a comparar.
                  */}
                  <div className="mt-4 border-y border-tinta-300 py-4">
                    <p className="rotulo-meta mb-3">
                      Matérias de autoria, por tipo
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {mandatoSenado.materiasPorTipo.map((t) => (
                        <li key={t.sigla}>
                          <Badge variant="discreto">
                            {t.sigla} · {t.total}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-tinta-600">
                      Tipos diferentes têm peso diferente: RQS e REQ são
                      requerimentos de tramitação; PL, PLP e PEC são propostas
                      de norma. Por isso não há um total único.
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="rotulo-meta mb-3">
                      Propostas de norma mais recentes
                    </p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Matéria</TableHead>
                          <TableHead>Ementa</TableHead>
                          <TableHead>Autoria</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mandatoSenado.materias
                          .filter((m) =>
                            ["PL", "PLP", "PEC", "PDL"].includes(m.sigla ?? ""),
                          )
                          .slice(0, 12)
                          .map((m) => (
                            <TableRow key={m.id}>
                              {/* Sem rótulo: a matéria abre a ficha. */}
                              <TableCell className="whitespace-nowrap font-mono text-xs">
                                {m.identificacao ?? "—"}
                              </TableCell>
                              <TableCell
                                rotulo="Ementa"
                                larga
                                className="max-w-md"
                              >
                                {m.ementa ?? "Sem ementa registrada"}
                              </TableCell>
                              <TableCell
                                rotulo="Autoria"
                                className="whitespace-nowrap"
                              >
                                {m.autorPrincipal ? "Autor principal" : "Coautor"}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <p className="mt-3 text-xs text-tinta-600">
                      As 12 mais recentes entre projetos e propostas de emenda.
                      A lista completa está no portal do Senado.
                    </p>
                  </div>

                  <div className="mt-8 border-t border-tinta-300 pt-5">
                    <p className="rotulo-meta mb-3">
                      Como votou no <Termo id="plenario">plenário</Termo>
                    </p>
                    <Votacoes
                      linhas={votacoesDoSenador(mandatoSenado).map(
                        ({ votacao, registro }) => {
                          const { rotulo, conhecido } =
                            traduzirVotoSenado(registro);
                          return {
                            id: votacao.id,
                            data: votacao.data,
                            materia: votacao.materia,
                            objeto: votacao.descricao,
                            ementa: votacao.ementa,
                            resultado: votacao.resultado,
                            voto: rotulo,
                            /* Sigla crua ao lado quando o rótulo é nosso:
                               regra 5, o que é da fonte fica conferível. */
                            siglaOriginal: conhecido ? registro : null,
                            secreta: votacao.secreta,
                          };
                        },
                      )}
                      criterio={`Recorte: as ${QUANTAS_VOTACOES} votações nominais mais recentes do plenário do Senado em que a fonte registrou a participação — não uma seleção do que consideramos importante. O mandato tem muitas outras, e a lista completa está no portal do Senado.`}
                      aviso="Dois terços dessas votações são secretas — quase todas de indicação de autoridade, em que o regimento manda votar em segredo. Nelas o Senado publica que a pessoa votou, nunca como. “Presente, não registrou voto” e as licenças são a palavra da fonte traduzida por nós; a sigla original aparece abaixo do rótulo."
                    />
                  </div>

                  <Alert className="mt-5">
                    <AlertTitle>Gasto de gabinete não disponível</AlertTitle>
                    <AlertDescription>
                      O equivalente senatorial da cota parlamentar (CEAPS) não
                      está nos dados abertos do Senado em formato que possamos
                      coletar. Por isso a ficha de senador não mostra despesas,
                      enquanto a de deputado federal mostra — a diferença é da
                      fonte, não da pessoa.
                    </AlertDescription>
                  </Alert>
                </DadoOficial>

                {/*
                  Emendas parlamentares — outra FONTE, e por isso outro
                  bloco de dado oficial. Juntar com a cota parlamentar
                  num bloco só faria a procedência do rodapé mentir
                  sobre metade do conteúdo.
                */}
                {emendasDeSenado ? (
                  <DadoOficial
                    className="mt-6"
                    titulo={`Emendas parlamentares — ${ANOS_EMENDAS[0]} a ${ANOS_EMENDAS[ANOS_EMENDAS.length - 1]}`}
                    fonte={FONTE_TRANSPARENCIA.nome}
                    coletadoEm={COLETADO_EM_EMENDAS}
                    urlOriginal={FONTE_TRANSPARENCIA.url}
                  >
                    <DetalheEmendas
                      registro={emendasDeSenado}
                      referencia={referenciaEmendas(emendasDeSenado.cargo)}
                      anos={ANOS_EMENDAS}
                      recorte={RECORTE_EMENDAS}
                      conferencia={CONFERENCIA_EMENDAS}
                    />
                  </DadoOficial>
                ) : null}
              </TabsContent>
            ) : null}

            {/* ---------- Mandato na Câmara (só quando há) ---------- */}
            {mandato && !mandatoSenado ? (
              <TabsContent value="mandato">
                <DadoOficial
                  titulo={`Mandato de deputado federal — legislatura ${LEGISLATURA}`}
                  fonte={FONTE_CAMARA.nome}
                  coletadoEm={COLETADO_EM_CAMARA}
                  urlOriginal={mandato.paginaOficial}
                >
                  <p className="text-sm text-tinta-700">
                    {c.nomeUrna} exerce mandato de <strong>deputado
                    federal</strong> pelo {mandato.uf} na legislatura{" "}
                    {LEGISLATURA}
                    {c.cargo !== "Deputado Federal" ? (
                      <>
                        {" "}
                        e disputa agora o cargo de {c.cargo}. Os dados abaixo
                        são do mandato atual, não da candidatura
                      </>
                    ) : null}
                    . Os valores são da <Termo id="cota-parlamentar">cota parlamentar</Termo>
                    parlamentar, prestada com nota fiscal pública.
                  </p>

                  {/* O total NUNCA aparece sozinho: sem o denominador da
                      bancada, número maior parece pior ou melhor.
                      Ver docs/principios.md, regra 4. */}
                  <dl className="mt-4 grid gap-4 border-y border-tinta-300 py-4 sm:grid-cols-3">
                    <div>
                      <dt className="rotulo-meta">Total no período</dt>
                      <dd className="mt-1 font-mono text-lg font-bold tabular-nums text-tinta-900">
                        {reais(mandato.despesas.total)}
                      </dd>
                    </div>
                    <div>
                      <dt className="rotulo-meta">
                        Mediana da bancada do {mandato.uf}
                      </dt>
                      <dd className="mt-1 font-mono text-lg tabular-nums text-tinta-700">
                        {reais(referenciaBancada.medianaDespesas)}
                      </dd>
                    </div>
                    <div>
                      <dt className="rotulo-meta">Faixa da bancada</dt>
                      <dd className="mt-1 font-mono text-sm tabular-nums text-tinta-700">
                        {reais(referenciaBancada.menor)} a{" "}
                        {reais(referenciaBancada.maior)}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-2 text-xs text-tinta-600">
                    A mediana e a faixa dos {referenciaBancada.bancada} deputados
                    do {mandato.uf} estão aqui de propósito: um valor sozinho não
                    diz se é alto ou baixo, e esta plataforma não classifica
                    ninguém.
                  </p>

                  <div className="mt-6">
                    <p className="rotulo-meta mb-3">Em que foi gasto</p>
                    <GraficoComposicao
                      legenda={`Composição das despesas de ${mandato.nomeUrna} por categoria`}
                      itens={mandato.despesas.porTipo.map((t) => ({
                        rotulo: t.tipo,
                        valor: t.valor,
                      }))}
                    />
                  </div>

                  <div className="mt-8">
                    <p className="rotulo-meta mb-3">Evolução mês a mês</p>
                    <GraficoEvolucao
                      legenda={`Despesas mensais de ${mandato.nomeUrna} ao longo da legislatura`}
                      pontos={mandato.despesas.porMes}
                    />
                  </div>

                  <p className="mt-6 text-xs text-tinta-600">
                    Baseado em {fmtNumero(mandato.despesas.documentos)}{" "}
                    documentos fiscais.
                  </p>

                  {/*
                    Detalhe da cota: quem recebeu, o que a Câmara recusou
                    reembolsar e as maiores notas com link para o PDF.
                    Nada adjetivado — o componente mostra o fato e o
                    documento, e a conclusão fica com quem lê.
                  */}
                  <div className="mt-8 border-t border-tinta-200 pt-8">
                    <DetalheDespesas
                      despesas={mandato.despesas}
                      nome={mandato.nomeUrna}
                    />
                  </div>

                  {/*
                    Proposições por tipo, nunca somadas — mesma regra já
                    aplicada às matérias de senador. Aqui ela pesa ainda
                    mais: entre os dez deputados do ES, um apresentou 284
                    proposições e outro 2.843, e quase toda a diferença é
                    de requerimento. Um total único leria como produtivo
                    contra improdutivo, que é o ranking involuntário da
                    regra 4.
                  */}
                  <div className="mt-6 border-t border-tinta-300 pt-5">
                    <p className="rotulo-meta mb-3">
                      Proposições apresentadas, por tipo
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {mandato.proposicoes.porTipo.slice(0, 12).map((t) => (
                        <li key={t.tipo}>
                          <Badge variant="discreto">
                            {t.tipo} · {t.total}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-tinta-600">
                      Os tipos aparecem separados porque pesam diferente: um
                      requerimento de audiência pública e um projeto de lei
                      contariam igual num total, e não são a mesma coisa. Por
                      isso não há um número único.
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="rotulo-meta mb-3">
                      Proposições mais recentes
                    </p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Proposição</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Do que trata</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mandato.proposicoes.recentes.map((p) => (
                          <TableRow key={p.id}>
                            {/* Sem rótulo: a proposição abre a ficha. */}
                            <TableCell className="whitespace-nowrap font-mono text-xs">
                              <a href={p.paginaOficial} rel="nofollow noopener">
                                {p.sigla} {p.numero}/{p.ano}
                              </a>
                            </TableCell>
                            <TableCell
                              rotulo="Tipo"
                              className="whitespace-nowrap text-tinta-700"
                            >
                              {p.tipo}
                            </TableCell>
                            <TableCell
                              rotulo="Do que trata"
                              larga
                              className="max-w-md"
                            >
                              {p.ementa ??
                                "A fonte não publicou ementa para esta proposição."}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <p className="mt-3 text-xs text-tinta-600">
                      As {mandato.proposicoes.recentes.length} mais recentes por
                      data de apresentação. A lista completa está no portal da
                      Câmara.
                    </p>
                  </div>

                  <div className="mt-8 border-t border-tinta-300 pt-5">
                    <p className="rotulo-meta mb-3">
                      Como votou no <Termo id="plenario">plenário</Termo>
                    </p>
                    <Votacoes
                      linhas={votacoesDoDeputado(mandato).map(
                        ({ votacao, voto }) => ({
                          id: votacao.id,
                          data: votacao.data,
                          materia: votacao.proposicao
                            ? `${votacao.proposicao.sigla} ${votacao.proposicao.numero}/${votacao.proposicao.ano}`
                            : null,
                          objeto: votacao.descricao,
                          ementa: votacao.proposicao?.ementa ?? null,
                          resultado: votacao.aprovada ? "Aprovada" : "Rejeitada",
                          voto,
                          paginaOficial:
                            votacao.proposicao?.paginaOficial ?? null,
                        }),
                      )}
                      criterio={`Recorte: as ${CRITERIO_VOTACOES.quantidade} votações nominais mais recentes do plenário da Câmara — não uma seleção do que consideramos importante. A maioria das votações é simbólica e não registra voto individual, então não entra aqui.`}
                      aviso="Votação em que o deputado não aparece não vira linha vazia: ele pode não estar em exercício na data, e escrever “faltou” sem saber disso seria acusar sem fonte."
                    />
                  </div>

                  {mandato.trocouDePartido ? (
                    <p className="mt-6 border-t border-tinta-300 pt-4 text-sm text-tinta-700">
                      <span className="rotulo-meta block">
                        Partidos nesta legislatura
                      </span>
                      <span className="mt-1 block">
                        {mandato.siglasNaLegislatura.join(" → ")}. Trocar de
                        partido durante o mandato é permitido em janela
                        específica; o registro está aqui como fato, sem juízo.
                      </span>
                    </p>
                  ) : null}
                </DadoOficial>

                {/*
                  Emendas parlamentares — outra FONTE, e por isso outro
                  bloco de dado oficial. Juntar com a cota parlamentar
                  num bloco só faria a procedência do rodapé mentir
                  sobre metade do conteúdo.
                */}
                {emendasDeCamara ? (
                  <DadoOficial
                    className="mt-6"
                    titulo={`Emendas parlamentares — ${ANOS_EMENDAS[0]} a ${ANOS_EMENDAS[ANOS_EMENDAS.length - 1]}`}
                    fonte={FONTE_TRANSPARENCIA.nome}
                    coletadoEm={COLETADO_EM_EMENDAS}
                    urlOriginal={FONTE_TRANSPARENCIA.url}
                  >
                    <DetalheEmendas
                      registro={emendasDeCamara}
                      referencia={referenciaEmendas(emendasDeCamara.cargo)}
                      anos={ANOS_EMENDAS}
                      recorte={RECORTE_EMENDAS}
                      conferencia={CONFERENCIA_EMENDAS}
                    />
                  </DadoOficial>
                ) : null}
              </TabsContent>
            ) : null}

            {/* ---------- Mandato estadual (só quando há) ---------- */}
            {emendasEstaduais ? (
              <TabsContent value="mandato">
                <DadoOficial
                  titulo={`Emendas de deputado estadual — ${ANOS_EMENDAS_ESTADUAIS[0]} a ${ANOS_EMENDAS_ESTADUAIS[ANOS_EMENDAS_ESTADUAIS.length - 1]}`}
                  fonte={FONTE_EMENDAS_ESTADUAIS.nome}
                  coletadoEm={COLETADO_EM_EMENDAS_ESTADUAIS}
                  urlOriginal={FONTE_EMENDAS_ESTADUAIS.url}
                >
                  <p className="text-sm text-tinta-700">
                    {c.nomeUrna} destinou emendas ao Orçamento do estado como{" "}
                    <strong>deputado estadual</strong> na legislatura atual da
                    Assembleia Legislativa (2023–2027)
                    {c.cargo !== "Deputado Estadual"
                      ? ` e disputa agora o cargo de ${c.cargo}. Os dados abaixo são do mandato estadual, não da candidatura`
                      : ""}
                    .
                  </p>

                  <div className="mt-5">
                    <DetalheEmendasEstaduais
                      registro={emendasEstaduais}
                      referencia={REFERENCIA_EMENDAS_ESTADUAIS}
                      anos={ANOS_EMENDAS_ESTADUAIS}
                      recorte={RECORTE_EMENDAS_ESTADUAIS}
                      conferencia={CONFERENCIA_EMENDAS_ESTADUAIS}
                      fonte={FONTE_EMENDAS_ESTADUAIS}
                    />
                  </div>
                </DadoOficial>

                {/*
                  Regra 5: o que NÃO está aqui, dito com o motivo. Sem
                  este aviso, uma aba só de emendas seria lida como "só
                  fez emendas" — e a lacuna é da fonte, não da pessoa.
                */}
                <Alert className="mt-6">
                  <AlertTitle>
                    Votações, presença e projetos não disponíveis
                  </AlertTitle>
                  <AlertDescription>
                    A Assembleia Legislativa do Espírito Santo não publica a
                    atuação em plenário — votações nominais, presença e
                    produção legislativa — em formato aberto que possamos
                    coletar e conferir. Por isso esta aba mostra menos que a de
                    um deputado federal: a diferença é das fontes, não das
                    pessoas.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            ) : null}
          </Tabs>
        </div>

        {/*
          O TSE não abre a ficha por link direto — a rota dele falha em
          carga fria, inclusive com a URL que ele próprio publica (ver o
          comentário em scripts/coleta/tse-normalizar.mjs). Em vez de
          oferecer um botão que leva a uma tela de erro, o site manda
          para a página que abre e diz o que digitar lá dentro.
        */}
        <div className="mt-10 rounded-lg border border-tinta-200 bg-papel-alta p-5">
          <h2 className="text-lg font-bold text-tinta-950">
            Conferir na fonte oficial
          </h2>
          <p className="mt-2 text-tinta-700">
            O sistema do TSE não permite link direto para uma ficha. Abra a
            divulgação de candidaturas e busque por{" "}
            <strong>{c.nomeUrna}</strong> ou pelo número{" "}
            <strong className="font-mono">{c.numero}</strong>, em{" "}
            {ESTADO.nome}, no cargo de {c.cargo}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="secundario">
              <a href={c.paginaOficial} rel="nofollow noopener">
                Abrir a divulgação do TSE
                <IconeLinkExterno />
              </a>
            </Button>
            <Button asChild variant="fantasma">
              <Link href="/candidatos">Voltar para a lista</Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
