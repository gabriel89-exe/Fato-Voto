import Link from "next/link";
import { IconeBusca, IconeSeta } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = { title: "Página não encontrada" };

/**
 * 404.
 *
 * Existe porque `notFound()` é chamado em /candidato/[id] e cairia na
 * tela padrão do Next, em inglês e fora da identidade.
 *
 * O texto explica a causa mais provável neste site em particular: uma
 * ficha some quando a Justiça Eleitoral indefere o registro e a coleta
 * seguinte deixa de trazer a candidatura. Sem essa frase, quem salvou o
 * link de alguém lê o erro como falha da plataforma — ou pior, como
 * sinal de que a pessoa foi escondida daqui.
 */
export default function NaoEncontrado() {
  return (
    <div className="envelope py-8 sm:py-12">
      <article className="entrada mx-auto max-w-leitura">
        <p className="border-b border-tinta-200 pb-3 text-sm text-tinta-600">
          <span>Endereço não encontrado</span>
        </p>

        <h1 className="mt-6">Esta página não existe</h1>

        <p className="mt-5 text-lg text-tinta-800">
          O endereço que você abriu não corresponde a nenhuma página deste
          site.
        </p>

        <Alert className="mt-6">
          <AlertTitle>Se você veio de um link para uma candidatura</AlertTitle>
          <AlertDescription>
            As fichas saem do ar quando a Justiça Eleitoral indefere o registro
            e a coleta seguinte deixa de trazer a candidatura. O desaparecimento
            é a lista acompanhando a decisão oficial, não uma escolha desta
            plataforma.
          </AlertDescription>
        </Alert>

        <form
          action="/candidatos"
          method="get"
          role="search"
          className="painel mt-7 p-5"
        >
          <label
            htmlFor="busca-404"
            className="block text-lg font-bold text-tinta-950"
          >
            Buscar por nome ou número de urna
          </label>
          <p id="ajuda-busca-404" className="mt-1 text-tinta-600">
            Pode escrever sem acento e sem maiúscula. Digitar só o começo do
            número também funciona.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta-500">
                <IconeBusca />
              </span>
              <Input
                id="busca-404"
                name="busca"
                type="search"
                autoComplete="off"
                enterKeyHint="search"
                aria-describedby="ajuda-busca-404"
                placeholder="Exemplo: Maria, ou 45"
                className="pl-11 text-lg"
              />
            </div>
            <Button type="submit">
              <IconeBusca />
              Buscar
            </Button>
          </div>
        </form>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild variant="secundario">
            <Link href="/candidatos">
              Ver todas as candidaturas
              <IconeSeta />
            </Link>
          </Button>
          <Button asChild variant="fantasma">
            <Link href="/">Voltar ao início</Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
