import { notFound } from "next/navigation";
import AvatarCandidato from "@/components/AvatarCandidato";
import DadoOficial from "@/components/DadoOficial";
import FaixaSituacao from "@/components/FaixaSituacao";
import NumeroUrna from "@/components/NumeroUrna";
import PastilhaPartido from "@/components/PastilhaPartido";
import ResumoPlataforma from "@/components/ResumoPlataforma";
import { candidatos, DATA_REVISAO, obterCandidato, obterPartido } from "@/lib/dados";
import { dataCurta, idadeEm, numero as fmtNumero } from "@/lib/formato";

export function generateStaticParams() {
  return candidatos.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidato = obterCandidato(id);
  return { title: candidato ? candidato.nomeUrna : "Candidato não encontrado" };
}

/**
 * Perfil — VERSAO PROVISORIA.
 *
 * As abas (Perfil / Proposta / Mandato / Bens) e os graficos entram no
 * passo 5. O que ja esta aqui e o cabecalho padrao, a faixa de situacao
 * e o par documento oficial + resumo da plataforma, que e o que precisa
 * ser validado agora.
 */
export default async function PaginaCandidato({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidato = obterCandidato(id);
  if (!candidato) notFound();

  const partido = obterPartido(candidato.partidoId);

  return (
    <div className="envelope py-6 sm:py-8">
      <article>
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <AvatarCandidato nome={candidato.nomeUrna} tamanho="lg" />

          <div className="min-w-0 flex-1">
            <h1>{candidato.nomeUrna}</h1>
            <p className="text-tinta-600">
              Nome civil: {candidato.nomeCivil}
            </p>

            <div className="mt-3">
              <NumeroUrna numero={candidato.numero} tamanho="lg" />
            </div>

            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="rotulo-meta">Cargo em disputa</dt>
                <dd className="text-tinta-800">
                  {candidato.cargo} — {candidato.uf}
                </dd>
              </div>
              <div>
                <dt className="rotulo-meta">Partido</dt>
                <dd>
                  <PastilhaPartido partido={partido} detalhado />
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="rotulo-meta">Coligação</dt>
                <dd className="text-tinta-800">{candidato.coligacao}</dd>
              </div>
            </dl>
          </div>
        </header>

        <div className="mt-5">
          <FaixaSituacao
            situacao={candidato.situacaoRegistro}
            atualizadoEm={candidato.proveniencia.coletadoEm}
            fonte={candidato.proveniencia.fonte}
            urlOriginal={candidato.proveniencia.urlOriginal}
          />
        </div>

        <p
          role="status"
          className="mt-5 rounded-md border border-tinta-300 bg-superficie-baixa px-4 py-3 text-sm text-tinta-700"
        >
          <strong>Página provisória.</strong> As abas Perfil, Proposta, Mandato
          e Bens, com os gráficos e a lista de votações, entram no passo 5.
        </p>

        <h2 className="mt-8">Proposta de governo</h2>
        <p className="mt-1 text-sm text-tinta-600">
          O resumo em linguagem simples e o documento oficial aparecem juntos,
          com o mesmo destaque. Um não substitui o outro.
        </p>

        <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
          <ResumoPlataforma titulo="Resumo da proposta" revisadoEm={DATA_REVISAO}>
            <p className="text-[0.95rem] leading-relaxed">
              {candidato.propostaResumo}
            </p>
          </ResumoPlataforma>

          <DadoOficial
            titulo="Documento entregue no registro"
            fonte={candidato.proveniencia.fonte}
            coletadoEm={candidato.propostaDocumento.coletadoEm}
            urlOriginal={candidato.propostaDocumento.urlOriginal}
          >
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-tinta-600">Páginas</dt>
                <dd className="font-medium">
                  {fmtNumero(candidato.propostaDocumento.paginas)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-tinta-600">Coletado em</dt>
                <dd className="font-medium">
                  {dataCurta(candidato.propostaDocumento.coletadoEm)}
                </dd>
              </div>
              <div>
                <dt className="text-tinta-600">
                  Identificação do arquivo (hash)
                </dt>
                <dd className="break-all font-mono text-xs">
                  {candidato.propostaDocumento.hash}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-sm">
              <a href={candidato.propostaDocumento.urlEspelho} rel="nofollow">
                Abrir a cópia guardada por esta plataforma
              </a>
            </p>
          </DadoOficial>
        </div>

        <h2 className="mt-10">Dados declarados</h2>
        <p className="mt-1 text-sm text-tinta-600">
          Informações declaradas pela própria candidatura no momento do
          registro.
        </p>

        <div className="mt-4">
          <DadoOficial
            fonte={candidato.proveniencia.fonte}
            coletadoEm={candidato.proveniencia.coletadoEm}
            urlOriginal={candidato.proveniencia.urlOriginal}
          >
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="rotulo-meta">Idade</dt>
                <dd>{idadeEm(candidato.dataNascimento)} anos</dd>
              </div>
              <div>
                <dt className="rotulo-meta">Gênero (autodeclarado)</dt>
                <dd>{candidato.genero}</dd>
              </div>
              <div>
                <dt className="rotulo-meta">Cor ou raça (autodeclarada)</dt>
                <dd>{candidato.corRaca}</dd>
              </div>
              <div>
                <dt className="rotulo-meta">Escolaridade (autodeclarada)</dt>
                <dd>{candidato.escolaridade}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="rotulo-meta">Ocupação (autodeclarada)</dt>
                <dd>{candidato.ocupacaoDeclarada}</dd>
              </div>
            </dl>
          </DadoOficial>
        </div>
      </article>
    </div>
  );
}
