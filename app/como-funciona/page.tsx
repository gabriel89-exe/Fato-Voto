import Link from "next/link";
import { IconeLinkExterno, IconeSeta } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
 * Todo o texto é escrito por nós, em paráfrase; os fatos vêm das
 * fontes citadas em cada verbete. A tela diz isso.
 */

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
            rel="nofollow noopener"
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
          Então aqui está, em linguagem simples. Não precisa ler tudo: cada
          bloco se entende sozinho, e você pode voltar quando esbarrar num termo
          desconhecido.
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

        {/* ---------- Sumário ---------- */}
        <nav aria-label="Seções desta página" className="mt-10">
          <h2 className="text-lg">O que tem aqui</h2>
          <ol className="mt-3 space-y-2">
            {SECOES.map((secao, i) => (
              <li key={secao.id} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="font-mono text-tinta-500 tabular-nums"
                >
                  {i + 1}.
                </span>
                <Link href={`#${secao.id}`}>{secao.titulo}</Link>
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
