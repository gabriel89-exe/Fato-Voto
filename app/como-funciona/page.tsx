import Link from "next/link";
import { IconeLinkExterno, IconeSeta } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import BuscaDeVerbetes from "@/components/BuscaDeVerbetes";
import Termo from "@/components/Termo";
import { SECOES, type Verbete } from "@/lib/glossario";

export const metadata = {
  title: "Como funciona a política brasileira",
  description:
    "O que faz um deputado, um senador e um governador; como uma lei nasce; e de onde vem o dinheiro do mandato. Em linguagem simples, com as fontes ao lado.",
};

/**
 * Tour: como funciona a política brasileira.
 *
 * NÃO é um portão na entrada do site, e a decisão é deliberada. Um
 * tutorial obrigatório atrapalharia quem chegou para procurar um
 * candidato, precisaria de localStorage para não se repetir — o que
 * desmentiria a página de privacidade — e seria esquecido antes de a
 * pessoa chegar na tabela de votações.
 *
 * Em vez disso, o conteúdo vive em três lugares: esta página, um
 * convite na home e a explicação inline ao lado de cada termo, que é a
 * camada que resolve a dúvida no segundo em que ela aparece.
 *
 * ==================================================================
 * A PÁGINA TEM TRÊS CAMADAS, E A ORDEM IMPORTA.
 *
 * Ela era só a terceira — um índice de 27 verbetes atrás de uma
 * introdução curta. Quem já sabia o que procurar se servia bem; quem
 * chegava sem saber nada recebia uma parede de definições e nenhuma
 * ideia de por onde começar. Um glossário responde à pergunta que a
 * pessoa consegue formular, e o problema aqui é justamente a pergunta
 * que ela ainda não sabe fazer.
 *
 *   1. O MAPA. Quatro parágrafos que dizem a forma do sistema: quem
 *      faz lei, quem executa, quem fiscaliza, e por que o mandato
 *      movimenta dinheiro. Sem isso, "emenda parlamentar" é só um
 *      termo a mais.
 *
 *   2. A PONTE. O que cada bloco da ficha mostra — e, ao lado, o que
 *      aquele bloco NÃO diz. Esta segunda coluna é a parte que mais
 *      importa e a que quase nenhum site de transparência escreve:
 *      número sem limite declarado é onde a leitura honesta vira
 *      conclusão errada. É a regra 3 aplicada ao material didático.
 *
 *   3. O GLOSSÁRIO. Continua embaixo, inteiro, para consulta.
 *
 * Todo o texto é escrito por nós, em paráfrase; os fatos vêm das
 * fontes citadas em cada verbete. A tela diz isso.
 * ==================================================================
 */

/**
 * Um bloco da ficha, explicado pelo que mostra e pelo que não mostra.
 *
 * As duas metades têm o mesmo peso tipográfico de propósito. Rebaixar a
 * ressalva a letra miúda seria dizer que ela é opcional, quando ela é
 * exatamente o que separa ler um dado de tirar dele uma conclusão que
 * ele não sustenta.
 */
function BlocoDaFicha({
  titulo,
  mostra,
  naoDiz,
}: {
  titulo: React.ReactNode;
  mostra: React.ReactNode;
  naoDiz: React.ReactNode;
}) {
  return (
    <div className="border-t border-tinta-200 pt-5">
      <h3 className="text-lg text-tinta-950">{titulo}</h3>
      <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        <div>
          <dt className="rotulo-meta">O que mostra</dt>
          <dd className="mt-1 text-tinta-700">{mostra}</dd>
        </div>
        <div>
          <dt className="rotulo-meta">O que não diz</dt>
          <dd className="mt-1 text-tinta-700">{naoDiz}</dd>
        </div>
      </dl>
    </div>
  );
}

function Verbete({ verbete }: { verbete: Verbete }) {
  return (
    <article
      id={verbete.id}
      className="scroll-mt-32 border-t border-tinta-200 pt-6"
    >
      <h3 className="text-tinta-950">
        {verbete.termo}
        {verbete.nome ? (
          <span className="ml-2 font-normal text-tinta-600">
            — {verbete.nome}
          </span>
        ) : null}
      </h3>

      <p className="mt-2 text-lg font-medium text-tinta-800">
        {verbete.resumo}
      </p>

      <div className="mt-3 space-y-3 text-tinta-700">
        {verbete.explicacao.map((paragrafo) => (
          <p key={paragrafo.slice(0, 40)}>{paragrafo}</p>
        ))}
      </div>

      {/* A procedência fica junto do verbete, não numa lista solta no
          fim da página: quem lê precisa poder conferir aquilo ali. */}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
        {/* `baseLegal` não é impresso aqui de propósito: o rótulo do link
            da Constituição já nomeia o artigo e ainda leva até ele. Impresso
            ao lado, sairia a mesma frase duas vezes seguidas, e a versão
            morta viria primeiro. O popover do <Termo> continua mostrando o
            texto, porque lá não há link de fonte. */}
        {verbete.fontes.map((fonte) => (
          <a
            key={fonte.url}
            href={fonte.url}
            target="_blank" rel="nofollow noopener"
            className="inline-flex items-center gap-1"
          >
            {fonte.rotulo}
            <IconeLinkExterno />
          </a>
        ))}
      </div>
    </article>
  );
}

export default function PaginaComoFunciona() {
  return (
    <div className="envelope py-8 sm:py-12">
      <div className="entrada mx-auto max-w-leitura">
        <h1>Você conhece a política do Brasil?</h1>

        <p className="mt-5 text-lg text-tinta-700">
          Este site mostra em que um deputado votou, quanto ele gastou e o que
          ele propôs. Nada disso ajuda muito se ninguém explicou antes o que um
          deputado faz — ou o que é uma PEC.
        </p>

        <p className="mt-3 text-tinta-700">
          Então aqui está, em linguagem simples. Comece pelo mapa abaixo: são
          quatro parágrafos, e depois deles o resto da página faz sentido.
        </p>

        <Alert variant="plataforma" className="mt-6">
          <AlertTitle>Quem escreveu este texto fomos nós</AlertTitle>
          <AlertDescription>
            Em todo o resto do site, o conteúdo vem de fonte oficial e nós só
            organizamos. Aqui é diferente: as palavras são nossas, escritas para
            serem fáceis de entender. Os fatos vêm das fontes indicadas abaixo
            de cada explicação — a Constituição, a Câmara, o Senado — e você
            pode conferir cada uma.
          </AlertDescription>
        </Alert>
      </div>

      {/* ================= 1. O MAPA =================
          Antes de qualquer termo. Quem não sabe a forma do sistema não
          tem onde pendurar a definição de "emenda parlamentar". */}
      <section
        id="mapa"
        className="mx-auto mt-14 max-w-leitura scroll-mt-32"
        aria-labelledby="titulo-mapa"
      >
        <p className="rotulo-meta">Comece por aqui</p>
        <h2 id="titulo-mapa" className="mt-1">
          O sistema em quatro parágrafos
        </h2>

        <div className="mt-6 space-y-4 text-lg text-tinta-700">
          <p>
            <strong className="text-tinta-900">
              Você não elege um governo. Você elege dois grupos que se vigiam.
            </strong>{" "}
            De um lado, quem executa: <Termo id="presidente">o presidente</Termo>{" "}
            e <Termo id="governador">o governador</Termo> comandam a máquina,
            nomeiam ministros e secretários, tocam obras e serviços. Do outro,
            quem faz as leis: <Termo id="deputado-federal">deputados
            federais</Termo>, <Termo id="senador">senadores</Termo> e{" "}
            <Termo id="deputado-estadual">deputados estaduais</Termo>.
          </p>

          <p>
            <strong className="text-tinta-900">
              Quem faz a lei também fiscaliza quem executa.
            </strong>{" "}
            Não é função secundária: é metade do trabalho. O parlamento aprova o
            orçamento, convoca ministro para explicar, abre investigação e pode
            derrubar decisão do Executivo. É por isso que faz diferença saber
            como alguém votou — o voto no plenário é o instrumento, e ele fica
            registrado quando a votação é{" "}
            <Termo id="votacao-nominal">nominal</Termo>.
          </p>

          <p>
            <strong className="text-tinta-900">
              O dinheiro público passa por essas mãos duas vezes.
            </strong>{" "}
            Uma vez quando o parlamento aprova a{" "}
            <Termo id="loa">lei que define o orçamento do ano</Termo>. Outra
            quando cada parlamentar destina uma fatia dele para onde quiser,
            pela <Termo id="emenda-parlamentar">emenda parlamentar</Termo> — a
            asfaltar uma rua, a comprar equipamento para um hospital. Por isso a
            ficha mostra emendas: elas dizem que prioridades a pessoa escolheu.
          </p>

          <p>
            <strong className="text-tinta-900">
              O mandato também custa dinheiro, e o custo é público.
            </strong>{" "}
            Além do salário, cada parlamentar tem a{" "}
            <Termo id="cota-parlamentar">cota parlamentar</Termo> para passagem,
            aluguel de escritório, combustível e divulgação — com nota fiscal
            que qualquer pessoa pode ver. É o gasto que aparece aberto por
            categoria em cada ficha.
          </p>
        </div>
      </section>

      {/* ================= 2. A PONTE =================
          Do guia para a ficha. A coluna "o que não diz" é o ponto: é ela
          que permite ler o número sem tirar dele uma conclusão que ele
          não sustenta. */}
      <section
        id="na-ficha"
        className="mx-auto mt-16 max-w-leitura scroll-mt-32"
        aria-labelledby="titulo-na-ficha"
      >
        <p className="rotulo-meta">Do guia para a prática</p>
        <h2 id="titulo-na-ficha" className="mt-1">
          O que você vai ver na ficha de alguém
        </h2>
        <p className="mt-2 text-tinta-700">
          Cada bloco da ficha responde a uma pergunta e deixa outras de fora.
          Saber o que o número não alcança é o que permite tirar a sua própria
          conclusão — em vez da conclusão que o tamanho dele sugere.
        </p>

        <div className="mt-8 space-y-6">
          <BlocoDaFicha
            titulo="Ficha de candidatura"
            mostra={
              <>
                Nome, número de urna, partido,{" "}
                <Termo id="coligacao-federacao">coligação</Termo> e a{" "}
                <Termo id="situacao-do-registro">situação do registro</Termo>,
                exatamente como a pessoa declarou ao TSE.
              </>
            }
            naoDiz={
              <>
                Se a candidatura vai chegar à urna. Muita gente aparece como{" "}
                <Termo id="aguardando-julgamento">aguardando julgamento</Termo>{" "}
                enquanto já faz campanha na rua.
              </>
            }
          />

          <BlocoDaFicha
            titulo="Patrimônio declarado"
            mostra="A soma dos bens que a pessoa declarou ao pedir o registro, ao lado da mediana de quem disputa o mesmo cargo."
            naoDiz="Renda. O TSE não publica renda de candidatura. E o valor é o declarado, em reais da época — não corrigido pela inflação."
          />

          <BlocoDaFicha
            titulo="Gastos do mandato"
            mostra={
              <>
                O que foi gasto pela{" "}
                <Termo id="cota-parlamentar">cota parlamentar</Termo>, aberto por
                categoria, com o fornecedor e a nota fiscal de cada despesa
                maior.
              </>
            }
            naoDiz="O custo total do mandato, nem o salário. E não aparece para quem ainda não tem mandato — a ausência do bloco não é omissão da pessoa."
          />

          <BlocoDaFicha
            titulo="Como votou no plenário"
            mostra={
              <>
                O voto registrado em cada{" "}
                <Termo id="votacao-nominal">votação nominal</Termo>, com o que
                estava sendo decidido e o resultado.
              </>
            }
            naoDiz="A posição em votação simbólica, em que o presidente da sessão só verifica se há maioria e nenhum nome fica registrado. Nenhum site pode preencher o que a Casa não registrou."
          />

          <BlocoDaFicha
            titulo="Presença em plenário"
            mostra="Os dias com sessão no período de exercício, separando presença, ausência justificada e ausência não justificada, na contagem da própria Câmara."
            naoDiz="Trabalho. Sessão de plenário é uma parte do mandato; comissão, relatoria e trabalho no estado não entram nessa conta. E ausência justificada — licença médica, licença-maternidade, missão oficial — não é falta."
          />

          <BlocoDaFicha
            titulo="Emendas"
            mostra={
              <>
                Quantas <Termo id="emenda-parlamentar">emendas</Termo> a pessoa
                assinou, para que áreas e para quais municípios, ano a ano.
              </>
            }
            naoDiz={
              <>
                Que o dinheiro chegou. Uma emenda pode estar{" "}
                <Termo id="empenho">empenhada</Termo> e não paga, e valor
                empenhado não é valor entregue. Nas emendas federais o valor não
                aparece — a fonte oficial devolve números que mudam entre uma
                leitura e outra, e a tela diz isso.
              </>
            }
          />

          <BlocoDaFicha
            titulo="Proposições"
            mostra={
              <>
                O que a pessoa apresentou — <Termo id="pl">PL</Termo>,{" "}
                <Termo id="pec">PEC</Termo>,{" "}
                <Termo id="requerimento">requerimento</Termo> — por tipo e com
                a ementa das mais recentes.
              </>
            }
            naoDiz="Nada sobre conteúdo, importância ou resultado. Apresentar muitas propostas não é melhor do que apresentar poucas: a contagem não separa uma emenda de redação de uma reforma inteira."
          />
        </div>

        <p className="mt-8 text-sm text-tinta-600">
          Nenhum desses blocos ordena candidaturas nem destaca valor alto. Onde
          há um total, há a mediana e a faixa de quem disputa o mesmo cargo ao
          lado — porque um número sozinho vira ranking sem ninguém pedir.
        </p>
      </section>

      {/* ================= 3. O GLOSSÁRIO ================= */}
      <div className="mx-auto mt-16 max-w-leitura">
        <p className="rotulo-meta">Consulta</p>
        <h2 className="mt-1">Cada termo, explicado</h2>
        <p className="mt-2 text-tinta-700">
          Não precisa ler tudo. Procure o termo que te travou, ou passeie pelo
          sumário.
        </p>

        {/* Busca antes do sumário: quem chega com dúvida concreta
            resolve em um passo, e quem quer passear tem o sumário
            logo abaixo. */}
        <BuscaDeVerbetes />

        {/* ---------- Sumário ---------- */}
        <nav aria-label="Seções desta página" className="mt-10">
          <h3 className="text-lg">O que tem aqui</h3>
          {/* Cada link do sumário carrega o alvo de 48px — a auditoria
              móvel de 02/09/2026 pegou estes com 29px de altura, abaixo
              do padrão que o resto do site cumpre. */}
          <ol className="mt-2">
            {SECOES.map((secao, i) => (
              <li key={secao.id} className="flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="font-mono text-tinta-500 tabular-nums"
                >
                  {i + 1}.
                </span>
                <span className="min-w-0">
                  <Link
                    href={`#${secao.id}`}
                    className="alvo-toque justify-start py-1 text-left"
                  >
                    {secao.titulo}
                  </Link>
                  {/* Os termos da seção no próprio sumário: sem isso,
                      escolher a seção certa exige já saber o assunto. */}
                  <span className="block pb-1 text-sm text-tinta-600">
                    {secao.verbetes.map((v) => v.termo).join(" · ")}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* ---------- Seções ---------- */}
      <div className="mx-auto mt-14 max-w-leitura space-y-16">
        {SECOES.map((secao) => (
          <section key={secao.id} id={secao.id} className="scroll-mt-32">
            <h2>{secao.titulo}</h2>
            <p className="mt-2 text-tinta-700">{secao.intro}</p>

            <div className="mt-8 space-y-8">
              {secao.verbetes.map((verbete) => (
                <Verbete key={verbete.id} verbete={verbete} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ---------- Saída ---------- */}
      <div className="mx-auto mt-16 max-w-leitura rounded-lg border border-tinta-200 bg-papel-alta p-6">
        <h2 className="text-xl">Agora vá ver quem está na disputa</h2>
        <p className="mt-2 text-tinta-700">
          Com isso na cabeça, as fichas fazem muito mais sentido. E se esbarrar
          num termo que não conhece, ele aparece explicado ali mesmo.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/candidatos">
              Ver as candidaturas
              <IconeSeta />
            </Link>
          </Button>
          <Button asChild variant="fantasma">
            <Link href="/fontes">De onde vêm os dados</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
