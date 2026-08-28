import Link from "next/link";
import { IconeInfo } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EMAIL_CONTATO } from "@/lib/site";

export const metadata = {
  title: "Quem somos",
  description:
    "Três estudantes, sem financiamento e sem vínculo partidário. Por que o projeto existe e como corrigir um dado.",
};

/**
 * Quem somos.
 *
 * Página exigida antes de divulgar: um site sobre eleição sem
 * responsável e sem canal de correção pede uma confiança que não
 * oferece meio de verificar.
 *
 * O projeto optou por NÃO identificar as pessoas. Isso é uma escolha
 * defensável, mas só se estiver dita e justificada — leitor nenhum
 * deveria precisar deduzir por que não há nomes. A seção "Por que não
 * assinamos com nome" existe para isso, e o argumento dela é o mesmo do
 * resto do site: o que sustenta o dado é a fonte conferível, não a
 * autoridade de quem publica.
 */
export default function PaginaQuemSomos() {
  return (
    <div className="envelope py-8 sm:py-12">
      <article className="entrada mx-auto max-w-leitura">
        <p className="border-b border-tinta-200 pb-3 text-sm text-tinta-600">
          <span>Expediente</span>
        </p>

        <h1 className="mt-6">Quem somos</h1>

        <p className="mt-5 text-lg text-tinta-800">
          Somos três estudantes. O Fato &amp; Voto é um projeto de código
          aberto, feito por conta própria, sem financiamento, sem vínculo
          partidário e sem ligação com órgão de governo.
        </p>

        <div className="mt-10 space-y-10">
          <section>
            <div className="secao-cabeca">
              <h2 className="text-[1.5rem] sm:text-[1.8rem]">
                Por que o projeto existe
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-tinta-700">
              <p>
                A informação sobre quem se candidata já é pública. O Tribunal
                Superior Eleitoral publica bens declarados, escolaridade,
                candidaturas anteriores e situação do registro. A Câmara publica
                gasto de cota parlamentar com nota fiscal. Está tudo aberto — e
                praticamente ninguém consulta.
              </p>
              <p>
                O motivo não é falta de interesse. É que consultar dá trabalho:
                são portais separados, feitos para quem já sabe o que procurar,
                com termos que só fazem sentido para quem trabalha com isso. Com
                a correria do dia a dia, a pesquisa não cabe, e quem não
                pesquisa acaba votando por indicação ou por conveniência.
              </p>
              <p>
                Foi aí que vimos o potencial. Não em produzir informação nova,
                mas em tornar a que já existe rápida o bastante para caber na
                vida real de quem trabalha. Educar a população sobre a
                informação pública que já é dela.
              </p>
            </div>
          </section>

          <section>
            <div className="secao-cabeca">
              <h2 className="text-[1.5rem] sm:text-[1.8rem]">
                Por que não assinamos com nome
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-tinta-700">
              <p>
                Não publicamos nossos nomes, e a razão é a mesma que rege o
                resto do site: aqui nada deve ser aceito porque alguém garantiu.
                Deve ser aceito porque dá para conferir.
              </p>
              <p>
                Um nome no rodapé não prova que um número está certo. O que
                prova é o link para o documento oficial ao lado de cada dado, a
                data em que ele foi coletado, e o código aberto que qualquer
                pessoa pode ler para ver exatamente como o dado saiu da fonte e
                chegou à tela. Até a ordem sorteada das listas é reproduzível: a
                semente é a data do dia.
              </p>
              <p>
                Reconhecemos que isso tem um custo — é mais fácil confiar em
                quem se apresenta. Por isso a contrapartida está em todo lugar:
                se algo aqui divergir da fonte oficial,{" "}
                <strong className="font-bold text-tinta-900">
                  a fonte oficial vale
                </strong>
                , e o caminho para verificar está publicado em cada bloco de
                dado.
              </p>
            </div>
          </section>

          <section>
            <div className="secao-cabeca">
              <h2 className="text-[1.5rem] sm:text-[1.8rem]">
                Como o projeto se sustenta
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-tinta-700">
              <p>
                Ele não custa quase nada. Não há banco de dados, não há servidor
                processando nada: a coleta roda de forma automatizada, grava
                arquivos e o site é servido como página pronta.
              </p>
              <p>
                Não aceitamos patrocínio de partido, de candidatura ou de
                comitê, e não veiculamos publicidade. Se um dia isso mudar,
                estará escrito aqui antes de mudar.
              </p>
            </div>
          </section>

          <section>
            <div className="secao-cabeca">
              <h2 className="text-[1.5rem] sm:text-[1.8rem]">
                Encontrou um dado errado
              </h2>
            </div>
            <div className="mt-4 space-y-3 text-tinta-700">
              <p>
                Erro de coleta acontece, e num site sobre candidatura ele tem
                peso: um dado trocado pode prejudicar uma pessoa real. Se algo
                aqui não bate com o registro oficial, queremos saber.
              </p>
              <p>
                Antes de avisar, confira na fonte — o link para o documento de
                origem está dentro de cada bloco de dado, e em{" "}
                <Link href="/fontes">de onde vêm os dados</Link>. Se a
                divergência se confirmar, a correção entra na coleta seguinte.
              </p>
            </div>

            {EMAIL_CONTATO ? (
              <p className="mt-5 text-lg">
                <a href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a>
              </p>
            ) : (
              <Alert className="mt-5">
                <IconeInfo />
                <AlertTitle>O canal de contato ainda está sendo criado</AlertTitle>
                <AlertDescription>
                  O endereço de e-mail para correções será publicado aqui assim
                  que existir. Preferimos dizer isso a publicar um endereço que
                  ninguém acompanha.
                </AlertDescription>
              </Alert>
            )}
          </section>
        </div>

        <p className="mt-10 border-t border-tinta-200 pt-6 text-sm text-tinta-700">
          Sobre as regras que o site segue e o que ele se recusa a fazer, veja{" "}
          <Link href="/metodologia">como tratamos os dados</Link>.
        </p>
      </article>
    </div>
  );
}
