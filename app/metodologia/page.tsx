import { IconeInfo } from "@/components/icones";

export const metadata = { title: "Metodologia" };

export default function PaginaMetodologia() {
  return (
    <div className="envelope py-8 sm:py-10">
      <article className="entrada mx-auto max-w-2xl space-y-5">
        <span className="chip">Metodologia</span>

        <h1>Como tratamos os dados</h1>

        <div className="aviso-callout flex gap-3">
          <IconeInfo className="mt-0.5 shrink-0 text-tinta-500" />
          <span>
            <strong className="font-semibold text-tinta-900">Aviso:</strong>{" "}
            este site é um protótipo. Os dados exibidos foram inventados para
            testar a interface. O texto abaixo descreve como a plataforma
            funcionaria com dados reais.
          </span>
        </div>

        <section className="space-y-2">
          <h2>De onde vêm os números</h2>
          <p className="text-tinta-700">
            Todo dado exibido vem de um registro público. Nós não criamos
            números novos, não estimamos e não completamos informação que falta.
            Quando um campo não existe na fonte, a tela mostra{" "}
            <strong>Não informado</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h2>Dado oficial e texto nosso</h2>
          <p className="text-tinta-700">
            O site tem dois tipos de conteúdo e eles nunca se misturam. O
            <strong> dado oficial</strong> aparece em bloco com moldura azul e
            barra na lateral, sempre com a fonte e a data da coleta. O
            <strong> resumo escrito por nós</strong> aparece em bloco de moldura
            tracejada, com aviso de que foi produzido pela plataforma.
          </p>
          <p className="text-tinta-700">
            Nossos resumos só reorganizam o que está no documento, em frases mais
            curtas. Eles não avaliam, não comparam e não dizem se uma proposta é
            boa.
          </p>
        </section>

        <section className="space-y-2">
          <h2>O que este site não faz</h2>
          <ul className="list-disc space-y-1 pl-5 text-tinta-700">
            <li>Não dá nota nem pontuação a candidatura nenhuma.</li>
            <li>Não faz ranking de melhores, piores ou mais faltosos.</li>
            <li>Não calcula alinhamento com governo ou com oposição.</li>
            <li>Não recomenda voto e não tem teste de afinidade.</li>
            <li>Não hospeda comentários nem avaliação de usuários.</li>
          </ul>
          <p className="text-tinta-700">
            Cada um desses recursos embutiria um julgamento político dentro de
            algo que parece um dado. Por isso eles ficam de fora, mesmo quando
            seriam populares.
          </p>
        </section>

        <section className="space-y-2">
          <h2>Por que a ordem é sorteada</h2>
          <p className="text-tinta-700">
            Qualquer ordem fixa favorece alguém. A ordem alfabética favorece
            nomes com A. A ordem por número favorece partidos antigos. Por isso a
            lista sai sorteada, e o sorteio vale para a sua sessão inteira, para
            a lista não mudar embaixo do seu dedo. Você pode trocar para ordem
            por nome ou por número quando quiser.
          </p>
        </section>

        <section className="space-y-2">
          <h2>Autodeclaração</h2>
          <p className="text-tinta-700">
            Gênero, cor ou raça, escolaridade e ocupação são informados pela
            própria pessoa candidata no momento do registro. A plataforma não
            confere esses campos e sempre avisa que são autodeclarados.
          </p>
        </section>

        <section className="space-y-2">
          <h2>Valores de bens</h2>
          <p className="text-tinta-700">
            Os valores de bens aparecem como foram declarados, em reais da época
            de cada declaração. Eles não são corrigidos pela inflação, então
            comparar anos diferentes exige cuidado. Esse aviso aparece junto do
            gráfico.
          </p>
        </section>

        <section className="space-y-2">
          <h2>Erros</h2>
          <p className="text-tinta-700">
            Se um dado estiver diferente da fonte oficial, a fonte oficial vale.
            Cada bloco de dado tem link para o documento de origem para você
            conferir por conta própria.
          </p>
        </section>
      </article>
    </div>
  );
}
