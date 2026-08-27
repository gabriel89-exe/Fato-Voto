import { IconeInfo } from "@/components/icones";
import { DATA_COLETA, ESTADO, FONTE_PADRAO } from "@/lib/dados";
import { dataPorExtenso } from "@/lib/formato";

export const metadata = { title: "Fontes dos dados" };

const FONTES = [
  {
    nome: "Registro de candidaturas",
    orgao: FONTE_PADRAO,
    conteudo:
      "Nome de urna, nome civil, número, cargo, partido, coligação, situação do registro e dados autodeclarados.",
    atualizacao: "A cada mudança no processo de registro.",
  },
  {
    nome: "Declaração de bens",
    orgao: FONTE_PADRAO,
    conteudo:
      "Lista de bens declarados no pedido de registro, com tipo, descrição e valor nominal.",
    atualizacao: "Uma vez por eleição.",
  },
  {
    nome: "Proposta de governo",
    orgao: FONTE_PADRAO,
    conteudo:
      "Documento entregue junto com o pedido de registro. Guardamos uma cópia para o caso de o link original sair do ar.",
    atualizacao: "Uma vez por eleição.",
  },
  {
    nome: "Atividade no mandato",
    orgao: "Assembleia Legislativa de Serra Verde (dados de exemplo)",
    conteudo:
      "Proposições apresentadas, votos registrados em votações nominais e registro de presença nas sessões.",
    atualizacao: "Semanal, enquanto a casa está em funcionamento.",
  },
];

export default function PaginaFontes() {
  return (
    <>
      <section className="casca casca-planta">
        <div className="envelope entrada py-12 sm:py-16">
          <span className="chip">Fontes dos dados</span>
          <h1 className="mt-5 max-w-3xl text-casca-texto">
            De onde vêm os dados
          </h1>
          <p className="mt-4 font-mono text-sm uppercase tracking-[0.14em] text-casca-suave">
            Última coleta simulada · {dataPorExtenso(DATA_COLETA)}
          </p>
        </div>
      </section>

      <div className="envelope py-10 sm:py-14">
        <article className="mx-auto max-w-3xl space-y-8">
          <div className="aviso-callout flex gap-3">
            <IconeInfo className="mt-0.5 shrink-0 text-tinta-500" />
            <span>
              <strong className="font-semibold text-tinta-900">Aviso:</strong>{" "}
              nenhuma das fontes abaixo é real. Elas descrevem o formato que a
              plataforma usaria, com nomes inventados para o estado fictício de{" "}
              {ESTADO.nome}.
            </span>
          </div>

          <p className="text-tinta-700">
            Cada bloco de dado no site repete a fonte e a data da própria coleta,
            para você não precisar voltar aqui.
          </p>

          <ol className="space-y-4">
            {FONTES.map((fonte, i) => (
              <li
                key={fonte.nome}
                className="cartao cartao-interativo p-5 sm:p-6"
              >
                <p className="rotulo-secao">
                  <span>{String(i + 1).padStart(2, "0")}</span> {fonte.nome}
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="rotulo-meta">Órgão de origem</dt>
                    <dd className="mt-0.5 text-tinta-800">{fonte.orgao}</dd>
                  </div>
                  <div>
                    <dt className="rotulo-meta">O que vem daí</dt>
                    <dd className="mt-0.5 text-tinta-800">{fonte.conteudo}</dd>
                  </div>
                  <div>
                    <dt className="rotulo-meta">Atualização</dt>
                    <dd className="mt-0.5 text-tinta-800">{fonte.atualizacao}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>

          <section>
            <p className="rotulo-secao">
              <span>05</span> Links quebrados
            </p>
            <p className="mt-4 text-tinta-700">
              Documentos oficiais somem do ar com frequência. Por isso guardamos
              uma cópia de cada documento coletado, junto com a data e uma
              identificação do arquivo (hash), que permite conferir se a cópia é
              igual ao original.
            </p>
          </section>
        </article>
      </div>
    </>
  );
}
