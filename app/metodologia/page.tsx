import { IconeInfo } from "@/components/icones";

export const metadata = { title: "Metodologia" };

const SECOES = [
  {
    titulo: "De onde vêm os números",
    paras: [
      "Todo dado exibido vem de um registro público. Nós não criamos números novos, não estimamos e não completamos informação que falta. Quando um campo não existe na fonte, a tela mostra Não informado.",
    ],
  },
  {
    titulo: "Dado oficial e texto nosso",
    paras: [
      "O site tem dois tipos de conteúdo e eles nunca se misturam. O dado oficial aparece em bloco com moldura azul e barra na lateral, sempre com a fonte e a data da coleta. O resumo escrito por nós aparece em bloco de moldura tracejada, com aviso de que foi produzido pela plataforma.",
      "Nossos resumos só reorganizam o que está no documento, em frases mais curtas. Eles não avaliam, não comparam e não dizem se uma proposta é boa.",
    ],
  },
  {
    titulo: "O que este site não faz",
    lista: [
      "Não dá nota nem pontuação a candidatura nenhuma.",
      "Não faz ranking de melhores, piores ou mais faltosos.",
      "Não calcula alinhamento com governo ou com oposição.",
      "Não recomenda voto e não tem teste de afinidade.",
      "Não hospeda comentários nem avaliação de usuários.",
    ],
    paras: [
      "Cada um desses recursos embutiria um julgamento político dentro de algo que parece um dado. Por isso eles ficam de fora, mesmo quando seriam populares.",
    ],
  },
  {
    titulo: "Por que a ordem é sorteada",
    paras: [
      "Qualquer ordem fixa favorece alguém. A ordem alfabética favorece nomes com A. A ordem por número favorece partidos antigos. Por isso a lista sai sorteada, e o sorteio vale para a sua sessão inteira, para a lista não mudar embaixo do seu dedo. Você pode trocar para ordem por nome ou por número quando quiser.",
    ],
  },
  {
    titulo: "Autodeclaração",
    paras: [
      "Gênero, cor ou raça, escolaridade e ocupação são informados pela própria pessoa candidata no momento do registro. A plataforma não confere esses campos e sempre avisa que são autodeclarados.",
    ],
  },
  {
    titulo: "Valores de bens",
    paras: [
      "Os valores de bens aparecem como foram declarados, em reais da época de cada declaração. Eles não são corrigidos pela inflação, então comparar anos diferentes exige cuidado. Esse aviso aparece junto do gráfico.",
    ],
  },
  {
    titulo: "Erros",
    paras: [
      "Se um dado estiver diferente da fonte oficial, a fonte oficial vale. Cada bloco de dado tem link para o documento de origem para você conferir por conta própria.",
    ],
  },
];

export default function PaginaMetodologia() {
  return (
    <>
      <section className="casca casca-planta">
        <div className="envelope entrada py-12 sm:py-16">
          <span className="chip">Metodologia</span>
          <h1 className="mt-5 max-w-3xl text-casca-texto">
            Como tratamos os dados
          </h1>
        </div>
      </section>

      <div className="envelope py-10 sm:py-14">
        <article className="mx-auto max-w-leitura space-y-10">
          <div className="aviso-callout flex gap-3">
            <IconeInfo className="mt-0.5 shrink-0 text-tinta-500" />
            <span>
              <strong className="font-semibold text-tinta-900">Aviso:</strong>{" "}
              este site é um protótipo. Os dados exibidos foram inventados para
              testar a interface. O texto abaixo descreve como a plataforma
              funcionaria com dados reais.
            </span>
          </div>

          {SECOES.map((secao, i) => (
            <section key={secao.titulo}>
              <p className="rotulo-secao">
                <span>{String(i + 1).padStart(2, "0")}</span> {secao.titulo}
              </p>
              <div className="mt-4 space-y-3 text-tinta-700">
                {secao.lista ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {secao.lista.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {secao.paras.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
