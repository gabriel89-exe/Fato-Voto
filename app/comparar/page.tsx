import Link from "next/link";
import { IconeInfo, IconeSeta } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Comparar candidatos" };

/**
 * Comparador — ainda não construído.
 *
 * As regras abaixo não são detalhe de implementação: são o que impede a
 * comparação de virar o ranking que o resto do site recusa. Quem for
 * construir precisa delas antes de escolher a estrutura de dados.
 *
 *  1. SÓ ENTRE O MESMO CARGO. Comparar um deputado estadual com um
 *     governador não é comparação, é confusão de atribuição — o mesmo
 *     motivo pelo qual as fichas de cargos diferentes já divergem hoje.
 *     Ver docs/principios.md, regra 6.
 *
 *  2. MESMOS CAMPOS, MESMA ORDEM, PARA TODAS AS COLUNAS. Se uma coluna
 *     tem um dado que a outra não tem, a célula vazia diz por que está
 *     vazia (regra 7). Omitir a linha inteira esconderia a lacuna.
 *
 *  3. NENHUMA ORDENAÇÃO POR VALOR, e nenhuma célula destacada por ser
 *     maior ou menor. Ordenar por bens declarados produz um ranking
 *     mesmo sem nunca escrever a palavra "melhor" (regra 4).
 *
 *  4. A SELEÇÃO VIVE NA URL, como já acontece com os filtros de
 *     /candidatos. Um recorte compartilhável por link é o que permite
 *     alguém conferir a comparação em vez de confiar nela.
 *
 * Os controles necessários — diálogo de seleção, caixas de marcação e
 * tabela — já existem em components/ui e estão vestidos na identidade.
 * O trabalho que falta é de dados e de regra, não de interface.
 */
export default function PaginaComparar() {
  return (
    <div className="envelope py-8 sm:py-12">
      <article className="entrada mx-auto max-w-leitura">
        <p className="border-b border-tinta-200 pb-3 text-sm text-tinta-600">
          <span>Caderno em preparação</span>
        </p>

        <h1 className="mt-6">Comparar candidatos</h1>

        <p className="mt-5 text-lg text-tinta-800">
          Aqui será possível colocar de 2 a 3 candidaturas do mesmo cargo lado a
          lado, com as mesmas informações na mesma ordem.
        </p>

        <Alert className="mt-6">
          <IconeInfo />
          <AlertTitle>Ainda não construído</AlertTitle>
          <AlertDescription>
            Esta parte do site ainda está sendo feita. Quando existir, a
            comparação vai mostrar as mesmas informações, na mesma ordem, para
            todas as candidaturas escolhidas — e não vai ordenar ninguém por
            valor, nem apontar uma coluna como a melhor. Enquanto isso, a ficha
            de cada candidatura já traz tudo que entraria na comparação.
          </AlertDescription>
        </Alert>

        <div className="mt-7">
          <Button asChild>
            <Link href="/candidatos">
              Ver a lista de candidatos
              <IconeSeta />
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
}
