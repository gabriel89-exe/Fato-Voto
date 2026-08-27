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
    <div className="envelope py-8 sm:py-12">
      <article className="entrada mx-auto max-w-3xl">
        <p className="folio flex-wrap justify-between gap-y-1 border-y-2 border-tinta-900 py-2">
          <span>Procedência</span>
          <span className="text-tinta-400">
            Coleta simulada · {dataPorExtenso(DATA_COLETA)}
          </span>
        </p>

        <h1 className="mt-6">De onde vêm os dados</h1>

        <div className="aviso-callout mt-6 flex gap-3">
          <IconeInfo className="mt-0.5 shrink-0 text-tinta-500" />
          <span>
            <strong className="font-bold text-tinta-900">Aviso:</strong> nenhuma
            das fontes abaixo é real. Elas descrevem o formato que a plataforma
            usaria, com nomes inventados para o estado fictício de {ESTADO.nome}.
          </span>
        </div>

        <p className="mt-6 text-tinta-700">
          Cada bloco de dado no site repete a fonte e a data da própria coleta,
          para você não precisar voltar aqui.
        </p>

        <ol className="mt-8 space-y-5">
          {FONTES.map((fonte, i) => (
            <li key={fonte.nome} className="cartao p-5 sm:p-6">
              <div className="secao-cabeca">
                <span className="folio">
                  <b>§ {String(i + 1).padStart(2, "0")}</b>
                </span>
                <h2 className="text-[1.35rem] sm:text-[1.6rem]">{fonte.nome}</h2>
              </div>
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

        <section className="mt-10">
          <div className="secao-cabeca">
            <span className="folio">
              <b>§ 05</b>
            </span>
            <h2 className="text-[1.35rem] sm:text-[1.6rem]">Links quebrados</h2>
          </div>
          <p className="mt-4 text-tinta-700">
            Documentos oficiais somem do ar com frequência. Por isso guardamos
            uma cópia de cada documento coletado, junto com a data e uma
            identificação do arquivo (hash), que permite conferir se a cópia é
            igual ao original.
          </p>
        </section>
      </article>
    </div>
  );
}
