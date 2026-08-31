import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { candidaturas, COLETADO_EM, ESTADO } from "@/lib/eleicao";
import { dataPorExtenso, numero as fmtNumero } from "@/lib/formato";
import { EMAIL_CONTATO } from "@/lib/site";

export const metadata = {
  title: "Privacidade e proteção de dados",
  description:
    "Quais dados esta plataforma trata, de onde vêm, com que base legal, e como pedir correção.",
};

/**
 * Privacidade e LGPD.
 *
 * A página existe porque o site publica dados pessoais de pessoas
 * identificadas — inclusive dado sensível, no sentido do art. 5º, II da
 * LGPD (cor ou raça autodeclarada). Quem é citado tem direito de saber
 * o que é tratado, por quê, e como pedir correção.
 *
 * Toda afirmação técnica aqui foi conferida no código em 31/08/2026:
 * não há analytics, cookie, localStorage nem script de terceiro, e as
 * fontes são baixadas no build (next/font), então nem o Google recebe
 * requisição de quem visita.
 *
 * ISTO NÃO É PARECER JURÍDICO. O enquadramento legal abaixo é o
 * raciocínio que sustenta o projeto e deve ser revisado por advogado
 * antes de qualquer divulgação ampla.
 */
export default function PaginaPrivacidade() {
  const comCorRaca = candidaturas.filter((c) => c.corRaca).length;

  return (
    <div className="envelope py-8 sm:py-12">
      <article className="entrada mx-auto max-w-leitura">
        <p className="border-b border-tinta-200 pb-3 text-sm text-tinta-600">
          Atualizado em {dataPorExtenso(COLETADO_EM)}
        </p>

        <h1 className="mt-6">Privacidade e proteção de dados</h1>

        <p className="mt-5 text-lg text-tinta-700">
          Esta plataforma publica dados de pessoas que se candidataram a cargo
          eletivo no {ESTADO.nome}. Esta página explica quais dados são esses,
          de onde vêm, com que fundamento são publicados e como pedir correção.
        </p>

        {/* ---------- Quem visita ---------- */}
        <section className="mt-12">
          <h2>Se você só está navegando</h2>
          <p className="mt-3 text-tinta-700">
            <strong>Não coletamos absolutamente nada sobre você.</strong>
          </p>
          <ul className="mt-3 space-y-2 text-tinta-700">
            <li>Não há cookies.</li>
            <li>Não há login, cadastro nem formulário que envie dados.</li>
            <li>
              Não há Google Analytics nem qualquer outra ferramenta de medição
              de audiência.
            </li>
            <li>
              Não há script de terceiro. As fontes tipográficas são baixadas
              quando o site é construído e servidas do nosso próprio endereço —
              nem o Google sabe que você esteve aqui.
            </li>
          </ul>
          <p className="mt-3 text-tinta-700">
            O serviço que hospeda o site mantém registros técnicos próprios,
            como qualquer servidor da internet. Não temos acesso a eles nem os
            usamos.
          </p>
        </section>

        {/* ---------- Quem é citado ---------- */}
        <section className="mt-12">
          <h2>Se você é uma das pessoas citadas</h2>

          <p className="mt-3 text-tinta-700">
            Os dados vêm inteiramente de bases públicas oficiais. Nada é
            estimado, inferido ou completado por nós.
          </p>

          <div className="mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dado</TableHead>
                  <TableHead>Origem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["Nome de urna, nome completo, número, partido, coligação", "TSE"],
                  ["Situação do registro da candidatura", "TSE"],
                  ["Bens declarados no registro", "TSE"],
                  ["Escolaridade, ocupação, gênero, cor ou raça, naturalidade", "TSE (autodeclarados)"],
                  ["Candidaturas anteriores", "TSE"],
                  ["Despesas da cota parlamentar e proposições", "Câmara dos Deputados"],
                  ["Mandato, matérias e votações no Senado", "Senado Federal"],
                ].map(([dado, origem]) => (
                  <TableRow key={dado}>
                    <TableCell>{dado}</TableCell>
                    <TableCell className="whitespace-nowrap">{origem}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <h3 className="mt-8">O que descartamos antes de gravar</h3>
          <p className="mt-2 text-tinta-700">
            O retorno do TSE inclui <strong>CPF e título de eleitor</strong>.
            Os dois são removidos no momento da coleta, antes de qualquer
            gravação — nem a cópia bruta que guardamos para auditoria os
            conserva. Dado que não é gravado não vaza.
          </p>
          <p className="mt-3 text-tinta-700">
            Respeitamos também as marcações do próprio TSE sobre o que pode ser
            divulgado. Quando o tribunal não autoriza mostrar os bens de uma
            candidatura, a ficha diz que a omissão é da fonte — e não da pessoa.
          </p>
        </section>

        {/* ---------- Base legal ---------- */}
        <section className="mt-12">
          <h2>Com que fundamento publicamos</h2>

          <p className="mt-3 text-tinta-700">
            Candidatar-se é ato público. Ao pedir registro, a pessoa torna
            públicos, por exigência legal, os dados que aparecem aqui — e o
            próprio TSE os divulga em portal aberto. A LGPD trata desse caso no{" "}
            <strong>art. 7º, § 4º</strong>: dados tornados manifestamente
            públicos pelo titular dispensam novo consentimento, resguardados os
            direitos dele e os princípios da lei.
          </p>

          <p className="mt-3 text-tinta-700">
            A finalidade é específica e declarada: permitir que eleitores
            consultem, em linguagem simples, o que já é público sobre quem
            disputa a eleição. Não há uso comercial, não há venda de dados, não
            há perfilamento e não há decisão automatizada sobre ninguém.
          </p>

          <h3 className="mt-8">Cor ou raça é dado sensível</h3>
          <p className="mt-2 text-tinta-700">
            A LGPD classifica cor ou raça como <strong>dado sensível</strong>{" "}
            (art. 5º, II), com proteção reforçada. A informação aparece aqui
            porque é autodeclarada no registro e divulgada pelo TSE — está
            preenchida em {fmtNumero(comCorRaca)} das{" "}
            {fmtNumero(candidaturas.length)} candidaturas —, e serve para que
            se possa observar a representatividade do conjunto.
          </p>
          <p className="mt-3 text-tinta-700">
            Ela nunca é usada para ordenar, classificar ou destacar
            candidaturas, e o rótulo diz sempre que é autodeclarada. Se você é
            uma das pessoas citadas e não quer que apareça, escreva para nós.
          </p>
        </section>

        {/* ---------- Direitos ---------- */}
        <section className="mt-12">
          <h2>Seus direitos</h2>
          <p className="mt-3 text-tinta-700">
            A LGPD garante confirmação, acesso, correção de dado incompleto ou
            desatualizado, e informação sobre com quem é compartilhado
            (art. 18). Aqui isso é direto: escreva e responderemos.
          </p>

          <div className="mt-4 rounded-lg border border-tinta-200 bg-papel-alta p-5">
            <p className="text-tinta-700">Canal de contato e correção:</p>
            <p className="mt-1 text-lg font-bold">
              <a href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a>
            </p>
          </div>

          <Alert className="mt-5">
            <AlertTitle>A fonte oficial tem precedência</AlertTitle>
            <AlertDescription>
              Se um dado aqui divergir do registro oficial, o registro oficial
              vale. Corrigimos assim que soubermos. Se o erro estiver na fonte,
              a correção precisa ser feita nela — e passa a valer aqui na
              coleta seguinte, que roda todo dia.
            </AlertDescription>
          </Alert>

          <p className="mt-5 text-tinta-700">
            Sobre exclusão: os dados são públicos e obrigatórios do processo
            eleitoral, e removê-los de uma plataforma de transparência tem
            limites — o art. 18 não é absoluto quando o tratamento se apoia em
            hipótese diversa do consentimento. Mesmo assim, avaliamos todo
            pedido caso a caso e respondemos.
          </p>
        </section>

        {/* ---------- Limite honesto ---------- */}
        <section className="mt-12">
          <Alert variant="plataforma">
            <AlertTitle>O que esta página não é</AlertTitle>
            <AlertDescription>
              Isto não é parecer jurídico. É a explicação, em linguagem clara,
              de como o projeto entende sua própria responsabilidade. O
              enquadramento legal está sendo submetido a revisão profissional.
            </AlertDescription>
          </Alert>
        </section>

        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/quem-somos">Quem somos</Link>
          <Link href="/fontes">De onde vêm os dados</Link>
          <Link href="/metodologia">Como tratamos os dados</Link>
        </p>
      </article>
    </div>
  );
}
