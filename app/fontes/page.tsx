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
    <div className="envelope py-8">
      <article className="mx-auto max-w-3xl space-y-5">
        <h1>De onde vêm os dados</h1>

        <p className="rounded-md border border-tinta-300 bg-superficie-baixa px-4 py-3 text-sm">
          <strong>Aviso:</strong> nenhuma das fontes abaixo é real. Elas
          descrevem o formato que a plataforma usaria, com nomes inventados
          para o estado fictício de {ESTADO.nome}.
        </p>

        <p className="text-tinta-700">
          Última coleta simulada: {dataPorExtenso(DATA_COLETA)}. Cada bloco de
          dado no site repete a fonte e a data da própria coleta, para você não
          precisar voltar aqui.
        </p>

        <div className="space-y-4">
          {FONTES.map((fonte) => (
            <section key={fonte.nome} className="cartao p-4">
              <h2 className="text-lg">{fonte.nome}</h2>
              <dl className="mt-2 space-y-2 text-sm">
                <div>
                  <dt className="rotulo-meta">Órgão de origem</dt>
                  <dd className="text-tinta-800">{fonte.orgao}</dd>
                </div>
                <div>
                  <dt className="rotulo-meta">O que vem daí</dt>
                  <dd className="text-tinta-800">{fonte.conteudo}</dd>
                </div>
                <div>
                  <dt className="rotulo-meta">Atualização</dt>
                  <dd className="text-tinta-800">{fonte.atualizacao}</dd>
                </div>
              </dl>
            </section>
          ))}
        </div>

        <section className="space-y-2">
          <h2>Links quebrados</h2>
          <p className="text-tinta-700">
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
