import { IconeInfo } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
      "O dado oficial aparece em bloco com moldura azul e barra na lateral, sempre com a fonte e a data da coleta. Texto escrito pela plataforma, quando existir, aparecerá em moldura diferente e avisada — os dois nunca se misturam.",
      "Nesta versão, todo o conteúdo das fichas vem direto da fonte oficial. Não há resumo nosso de proposta de governo: o documento é linkado como foi entregue.",
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
      "Qualquer ordem fixa favorece alguém. A ordem alfabética favorece nomes com A. A ordem por número favorece partidos antigos. Por isso a lista sai sorteada.",
      "O sorteio usa uma semente fixa por dia: a ordem é a mesma para todas as pessoas que acessam no mesmo dia, não muda enquanto você navega, e muda no dia seguinte. Como a semente é a data, qualquer pessoa pode reproduzir a ordem de um dia e conferir que não houve favorecimento.",
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
    <div className="envelope py-8 sm:py-12">
      <article className="entrada mx-auto max-w-leitura">
        <p className="folio border-y-2 border-tinta-900 py-2">
          <span>Expediente</span>
        </p>

        <h1 className="mt-6">Como tratamos os dados</h1>

        <Alert className="mt-6">
          <IconeInfo />
          <AlertTitle>O registro das candidaturas ainda está em julgamento</AlertTitle>
          <AlertDescription>
            Os dados vêm do Tribunal Superior Eleitoral e da Câmara dos
            Deputados. Como a Justiça Eleitoral ainda julga os pedidos de
            registro, parte das candidaturas listadas pode não chegar à urna.
            A data da coleta aparece em cada bloco de dado.
          </AlertDescription>
        </Alert>

        <div className="mt-10 space-y-10">
          {SECOES.map((secao, i) => (
            <section key={secao.titulo}>
              <div className="secao-cabeca">
                <span className="folio">
                  <b>§ {String(i + 1).padStart(2, "0")}</b>
                </span>
                <h2 className="text-[1.5rem] sm:text-[1.8rem]">{secao.titulo}</h2>
              </div>
              <div className="mt-4 space-y-3 text-tinta-700">
                {secao.lista ? (
                  <ul className="list-disc space-y-1 pl-5 marker:text-tinta-400">
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
        </div>
      </article>
    </div>
  );
}
