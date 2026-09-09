import Link from "next/link";
import { IconeSeta } from "@/components/icones";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import {
  COLETADO_EM,
  ELEICAO,
  ESTADO,
  PANORAMA,
} from "@/lib/eleicao";
import { dataPorExtenso, numero, percentual, reais } from "@/lib/formato";

export const metadata = {
  title: "O projeto",
  description:
    "O que a plataforma reúne, as regras que a governam e três casos em que a regra mudou o que foi publicado.",
};

/**
 * O projeto, explicado inteiro numa página.
 *
 * ==================================================================
 * ESTA PÁGINA NASCEU COMO ARQUIVO SOLTO, E ISSO ERA UM ERRO.
 *
 * O conteúdo existia como uma apresentação de slides em
 * `apresentacao/fato-e-voto.html`: 1920×1080, aberta por duplo clique,
 * fora do `app/` e portanto fora do build. O endereço dela na produção
 * devolvia 404. Quem quisesse ler precisava do arquivo em mãos.
 *
 * Um site de transparência que guarda a própria explicação num anexo
 * está se contradizendo. O material foi trazido para dentro: mesma
 * substância, agora rota de verdade, indexada, com link, com o
 * cabeçalho e o rodapé do site em volta, e legível no celular sem
 * navegar slide a slide.
 * ==================================================================
 *
 * OS NÚMEROS NÃO ESTÃO ESCRITOS AQUI. Vêm de `PANORAMA`, medido do
 * mesmo JSON que alimenta as fichas. Um parágrafo com número digitado
 * à mão envelhece em silêncio — a coleta roda todo dia, e a frase
 * continuaria afirmando o total de ontem com a mesma segurança.
 *
 * O VOCABULÁRIO ESCURO é o mesmo da faixa da home: tinta sobre osso,
 * sem matiz. Aqui ele carrega as três seções de caso, porque são elas
 * que sustentam o argumento — e porque uma página só de papel morno
 * não tem onde o olho descansar.
 */

/** Bloco escuro. O corte visual da página, e o lugar dos casos. */
function Faixa({
  olho,
  titulo,
  children,
}: {
  olho: string;
  titulo: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 border-y border-tinta-950 bg-tinta-950 sm:mt-20">
      <div className="envelope py-12 sm:py-16">
        <p className="rotulo-meta text-papel/70">{olho}</p>
        <h2 className="mt-2 max-w-[24ch] text-papel-alta">{titulo}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

/** Número grande com rótulo, para dentro da faixa escura. */
function Cifra({
  valor,
  rotulo,
  nota,
}: {
  valor: string;
  rotulo: string;
  nota?: string;
}) {
  return (
    <div>
      <p className="font-display text-5xl font-bold tabular-nums text-papel-alta sm:text-6xl">
        {valor}
      </p>
      <p className="mt-2 font-semibold text-papel">{rotulo}</p>
      {nota ? <p className="mt-1 text-sm text-papel/65">{nota}</p> : null}
    </div>
  );
}

export default function PaginaOProjeto() {
  const p = PANORAMA;

  /* A regra 4 vale para esta página como vale para a ficha: o total
     de gasto só aparece ao lado da mediana e da faixa da bancada. */
  const exemploGasto = {
    mediana: p.despesas.medianaDespesas,
    menor: p.despesas.menor,
    maior: p.despesas.maior,
    bancada: p.despesas.bancada,
  };

  const regras = [
    "Nada de ranking, nota ou recomendação. A ordem das listas é sorteada, com semente do dia, e a página diz que é sorteada.",
    "Todo dado tem procedência à vista, com a data da coleta.",
    "Descritivo, nunca normativo. Mostrar o fato que convida ao escrutínio, sem afirmar irregularidade e sem cor de alerta para valor alto.",
    "Nenhum total de gasto vai à tela sozinho — sempre ao lado da mediana e da faixa da bancada.",
    "Lacuna se declara. Se a fonte não publica, a tela diz que a fonte não publica.",
    "Link de fonte leva ao fato, não à página onde o fato mora.",
    "Sem cookie, sem analytics, sem armazenamento no navegador de quem lê.",
  ];

  return (
    <div>
      {/* ================= Abertura ================= */}
      <section className="envelope py-10 sm:py-16">
        <BlurFade>
          <p className="rotulo-meta">
            {ESTADO.nome} · Eleição {ELEICAO.ano}
          </p>
        </BlurFade>
        <BlurFade delay={0.08}>
          <h1 className="mt-3 max-w-[18ch]">O que é público, inteiro.</h1>
        </BlurFade>
        <BlurFade delay={0.16}>
          <p className="mt-5 max-w-leitura text-lg text-tinta-700">
            O Fato &amp; Voto reúne candidatura, patrimônio, gastos, votações,
            presença e emendas de quem disputa a eleição de {ELEICAO.ano} no{" "}
            {ESTADO.nome} — com a fonte oficial ao lado de cada número e a data
            em que foi coletado. Esta página explica o que a plataforma faz, o
            que ela se recusa a fazer, e mostra três casos em que a recusa mudou
            o que foi publicado.
          </p>
        </BlurFade>
      </section>

      {/* ================= O problema ================= */}
      <section className="envelope">
        <div className="secao-cabeca">
          <h2>O dado já é público. Só não está reunido.</h2>
        </div>
        <p className="mt-4 max-w-leitura text-tinta-700">
          Conferir uma candidatura hoje exige visitar cinco portais que não
          conversam entre si, cada um com formato, vocabulário e critério
          próprios. O trabalho não é conseguir o dado — é juntar o dado e
          mantê-lo.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              fonte: "TSE",
              texto:
                "Candidatura, partido, coligação, bens declarados e situação do registro. Atualizado enquanto a Justiça julga.",
            },
            {
              fonte: "Câmara e Senado",
              texto:
                "Gastos da cota com nota fiscal, proposições, votações nominais e presença em plenário.",
            },
            {
              fonte: "Transparência e SEFAZ-ES",
              texto:
                "Emendas individuais federais e estaduais, por área e por município.",
            },
          ].map((f, i) => (
            <BlurFade
              key={f.fonte}
              como="li"
              inView
              escala
              delay={0.06 * i}
              className="h-full rounded-lg border border-tinta-200 bg-papel-alta p-5 shadow-cartao"
            >
              <h3 className="rotulo-meta">{f.fonte}</h3>
              <p className="mt-2 text-tinta-700">{f.texto}</p>
            </BlurFade>
          ))}
        </ul>
      </section>

      {/* ================= O que está publicado ================= */}
      <Faixa
        olho="O que está publicado hoje"
        titulo={
          <>
            Uma ficha por candidatura,{" "}
            <span className="text-papel/60">
              com a fonte ao lado de cada número.
            </span>
          </>
        }
      >
        <ul className="grid gap-px overflow-hidden bg-tinta-800 sm:grid-cols-3">
          {[
            {
              valor: numero(p.candidaturas),
              rotulo: "candidaturas",
              nota: `em ${p.cargos} cargos, do estadual à Presidência`,
            },
            {
              valor: numero(p.emendasFederais + p.emendasEstaduais),
              rotulo: "emendas individuais",
              nota: `${numero(p.emendasEstaduais)} estaduais e ${numero(p.emendasFederais)} federais, por ano e por área`,
            },
            {
              valor: numero(p.presenca.dias),
              rotulo: "dias com sessão",
              nota: "presença da bancada federal do ES, na contagem da Câmara",
            },
          ].map((c, i) => (
            <BlurFade
              key={c.rotulo}
              como="li"
              inView
              escala
              delay={0.06 * i}
              className="bg-tinta-950 px-1 py-2 sm:px-6 sm:py-1"
            >
              <Cifra {...c} />
            </BlurFade>
          ))}
        </ul>
        <p className="mt-8 border-t border-tinta-800 pt-5 text-sm text-papel/65">
          {p.emJulgamento} das {p.candidaturas} candidaturas ainda não tiveram o
          registro julgado pela Justiça Eleitoral. Coletado em{" "}
          {dataPorExtenso(COLETADO_EM)}. Nenhum número desta página é estimado.
        </p>
      </Faixa>

      {/* ================= As sete regras ================= */}
      <section className="envelope mt-14 sm:mt-20">
        <div className="secao-cabeca">
          <h2>As sete regras</h2>
          <p className="rotulo-meta">O que o projeto se recusa a fazer</p>
        </div>
        <p className="mt-4 max-w-leitura text-tinta-700">
          Não são preferência de estilo. Quebrar qualquer uma descaracteriza o
          projeto, e é por isso que elas são versionadas junto com o código.
        </p>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {regras.map((regra, i) => (
            <BlurFade
              key={regra.slice(0, 24)}
              como="li"
              inView
              escala
              delay={0.04 * i}
              className="relative flex h-full gap-4 overflow-hidden rounded-lg border border-tinta-200 bg-papel-alta p-5 shadow-cartao"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-tinta-950"
              />
              <span
                aria-hidden="true"
                className="mt-1 font-display text-2xl font-bold tabular-nums text-tinta-300"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-tinta-700">{regra}</span>
            </BlurFade>
          ))}
        </ol>
        <p className="mt-6">
          <Link href="/metodologia" className="alvo-toque">
            Como tratamos os dados
          </Link>
        </p>
      </section>

      {/* ================= Caso 1: o denominador ================= */}
      <Faixa
        olho="Regra 4 · na prática"
        titulo={
          <>
            Um número sozinho{" "}
            <span className="text-papel/60">vira acusação sem querer.</span>
          </>
        }
      >
        <p className="max-w-leitura text-lg text-papel/80">
          {reais(exemploGasto.maior)} em cota parlamentar parece muito. Ao lado
          da bancada, deixa de parecer qualquer coisa e passa a ser apenas um
          fato. Por isso nenhum total de gasto vai à tela sem a mediana e a
          faixa ao lado.
        </p>
        <dl className="mt-8 grid gap-px overflow-hidden bg-tinta-800 sm:grid-cols-3">
          {[
            { rotulo: "Menor da bancada", valor: reais(exemploGasto.menor) },
            { rotulo: "Mediana", valor: reais(exemploGasto.mediana) },
            { rotulo: "Maior da bancada", valor: reais(exemploGasto.maior) },
          ].map((c) => (
            <div key={c.rotulo} className="bg-tinta-950 px-1 py-3 sm:px-6">
              <dt className="rotulo-meta text-papel/70">{c.rotulo}</dt>
              <dd className="mt-2 font-display text-3xl font-bold tabular-nums text-papel-alta">
                {c.valor}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-papel/65">
          Os {exemploGasto.bancada} deputados federais do {ESTADO.sigla} na
          legislatura. A plataforma não diz se o valor é alto: mostra onde ele
          cai, e deixa a conclusão para quem lê.
        </p>
      </Faixa>

      {/* ================= Caso 2: a lacuna ================= */}
      <Faixa
        olho="Regra 5 · na prática"
        titulo={
          <>
            Quando a fonte oficial{" "}
            <span className="text-papel/60">publica número instável.</span>
          </>
        }
      >
        <p className="max-w-leitura text-lg text-papel/80">
          Ler a mesma emenda duas vezes seguidas no Portal da Transparência
          devolve, às vezes, valores diferentes. Não é erro de leitura: é a
          fonte. A conferência automática registrou{" "}
          {numero(p.problemasNaFonteDeEmendas)} ocorrências e reprovou a
          publicação dos valores federais.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-tinta-800 p-5">
            <h3 className="rotulo-meta text-papel/70">
              Emendas estaduais · SEFAZ-ES
            </h3>
            <p className="mt-2 font-display text-4xl font-bold tabular-nums text-papel-alta">
              {numero(p.emendasEstaduais)}
            </p>
            <p className="mt-2 text-papel/80">
              Conferência aprovada.{" "}
              <strong className="font-semibold text-papel-alta">
                Valores publicados
              </strong>{" "}
              — previsto, empenhado, liquidado e pago.
            </p>
          </div>
          <div className="rounded-lg border border-tinta-800 p-5">
            <h3 className="rotulo-meta text-papel/70">
              Emendas federais · Portal da Transparência
            </h3>
            <p className="mt-2 font-display text-4xl font-bold tabular-nums text-papel-alta">
              {numero(p.emendasFederais)}
            </p>
            <p className="mt-2 text-papel/80">
              Conferência reprovada.{" "}
              <strong className="font-semibold text-papel-alta">
                Quantidade, ano, área e município publicados; nenhum valor.
              </strong>{" "}
              A ficha diz por quê.
            </p>
          </div>
        </div>

        <p className="mt-6 max-w-leitura text-sm text-papel/65">
          A alternativa seria publicar o número e torcer. Um valor errado numa
          página de transparência não é um defeito de software: é uma calúnia
          com aparência de fato.
        </p>
      </Faixa>

      {/* ================= Caso 3: a ressalva ================= */}
      <Faixa
        olho="Regra 3 · na prática"
        titulo={
          <>
            Ausência justificada{" "}
            <span className="text-papel/60">não é falta.</span>
          </>
        }
      >
        <p className="max-w-leitura text-lg text-papel/80">
          Licença médica, licença-maternidade e missão oficial são ausências
          justificadas, e a Câmara as registra separado justamente por isso.
          Somar as duas colunas produziria um índice de presença — e uma
          acusação que a fonte não faz.
        </p>

        <div
          className="mt-8 flex h-14 w-full overflow-hidden rounded-sm border border-tinta-800"
          role="img"
          aria-label={`De ${p.presenca.dias} dias com sessão, ${p.presenca.comPresenca} tiveram presença, ${p.presenca.justificadas} foram de ausência justificada e ${p.presenca.naoJustificadas} de ausência não justificada.`}
        >
          <span
            className="bg-papel-alta"
            style={{
              width: `${(p.presenca.comPresenca / p.presenca.dias) * 100}%`,
            }}
          />
          <span
            className="bg-tinta-400"
            style={{
              width: `${(p.presenca.justificadas / p.presenca.dias) * 100}%`,
            }}
          />
          <span
            className="bg-tinta-700"
            style={{
              width: `${(p.presenca.naoJustificadas / p.presenca.dias) * 100}%`,
            }}
          />
        </div>

        <dl className="mt-6 grid gap-6 sm:grid-cols-3">
          {[
            { rotulo: "Dias com presença", v: p.presenca.comPresenca },
            { rotulo: "Ausências justificadas", v: p.presenca.justificadas },
            {
              rotulo: "Ausências não justificadas",
              v: p.presenca.naoJustificadas,
            },
          ].map((f) => (
            <div key={f.rotulo}>
              <dt className="rotulo-meta text-papel/70">{f.rotulo}</dt>
              <dd className="mt-1 font-display text-3xl font-bold tabular-nums text-papel-alta">
                {numero(f.v)}
                <span className="ml-2 text-base font-normal text-papel/65">
                  {percentual(f.v, p.presenca.dias)}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 max-w-leitura text-sm text-papel/65">
          Bancada federal do {ESTADO.sigla}, na contagem da própria Câmara. Não
          há comparação entre pessoas nesta tela: cada uma tem o seu período de
          exercício, e presença não é competição.
        </p>
      </Faixa>

      {/* ================= Como se sustenta ================= */}
      <section className="envelope mt-14 sm:mt-20">
        <div className="secao-cabeca">
          <h2>Como se sustenta</h2>
          <p className="rotulo-meta">Roda sozinha, todo dia</p>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            {
              titulo: "Coleta diária às 06h17",
              texto:
                "Os coletores refazem a leitura das cinco fontes todo dia. A resposta crua é guardada com hash SHA-256 antes de virar dado normalizado — dá para provar o que a fonte dizia naquele dia.",
            },
            {
              titulo: "Conferência antes de publicar",
              texto:
                "Cada coletor testa o que leu contra o que é possível. Dado implausível reprova e não vai ao ar, como aconteceu com os valores das emendas federais.",
            },
            {
              titulo: "Site estático, sem banco",
              texto:
                "As páginas são geradas na compilação e servidas como arquivo. Nada é buscado enquanto você lê, e não há servidor de aplicação que possa cair ou ser alterado.",
            },
            {
              titulo: "Nenhum rastro de quem lê",
              texto:
                "Sem cookie, sem analytics, sem armazenamento no navegador. A plataforma não sabe quem consultou quem — e numa ferramenta eleitoral isso não é detalhe.",
            },
          ].map((item, i) => (
            <BlurFade
              key={item.titulo}
              como="li"
              inView
              escala
              delay={0.06 * i}
              className="h-full rounded-lg border border-tinta-200 bg-papel-alta p-5 shadow-cartao"
            >
              <h3 className="text-tinta-950">{item.titulo}</h3>
              <p className="mt-2 text-tinta-700">{item.texto}</p>
            </BlurFade>
          ))}
        </ul>
      </section>

      {/* ================= O que falta ================= */}
      <section className="envelope mt-14 sm:mt-20">
        <div className="secao-cabeca">
          <h2>O que ainda falta</h2>
          <p className="rotulo-meta">Dito antes de perguntarem</p>
        </div>
        <div className="mt-4 max-w-leitura space-y-3 text-tinta-700">
          <p>
            O piloto cobre o {ESTADO.nome}. Os valores das emendas federais
            seguem sem publicar enquanto a fonte devolver números que mudam
            entre leituras.
          </p>
          <p>
            Não há salário de cargo publicado porque nenhuma fonte oficial
            citável foi encontrada. Câmara e Senado derrubam a conexão de vez em
            quando, e a coleta do dia registra isso em vez de fingir que leu.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/candidatos">
              Ver as candidaturas
              <IconeSeta />
            </Link>
          </Button>
          <Button asChild variant="fantasma">
            <Link href="/fontes">De onde vêm os dados</Link>
          </Button>
          <Button asChild variant="fantasma">
            <Link href="/quem-somos">Quem somos</Link>
          </Button>
        </div>
      </section>

      <div className="mt-14 sm:mt-20" />
    </div>
  );
}
