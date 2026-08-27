import Link from "next/link";
import { notFound } from "next/navigation";
import AvatarCandidato from "@/components/AvatarCandidato";
import DadoOficial from "@/components/DadoOficial";
import FaixaSituacao from "@/components/FaixaSituacao";
import { IconeInfo, IconeSeta } from "@/components/icones";
import NumeroUrna from "@/components/NumeroUrna";
import PastilhaPartido from "@/components/PastilhaPartido";
import ResumoPlataforma from "@/components/ResumoPlataforma";
import {
  candidatos,
  DATA_REVISAO,
  obterCandidato,
  obterPartido,
} from "@/lib/dados";
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
 * e o par documento oficial + resumo da plataforma.
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
    <>
      {/* ---------- Cabecalho da ficha, na casca escura ---------- */}
      <section className="casca casca-planta">
        <div className="envelope py-10 sm:py-12">
          <Link
            href="/candidatos"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-casca-suave no-underline transition-colors hover:text-casca-texto"
          >
            <IconeSeta className="h-3.5 w-3.5 rotate-180" />
            Voltar para a lista
          </Link>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start">
            <AvatarCandidato nome={candidato.nomeUrna} tamanho="lg" />

            <div className="min-w-0 flex-1">
              <h1 className="text-casca-texto">{candidato.nomeUrna}</h1>
              <p className="mt-1 text-casca-suave">
                Nome civil: {candidato.nomeCivil}
              </p>

              <div className="mt-4">
                <NumeroUrna numero={candidato.numero} tamanho="lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="envelope py-8 sm:py-10">
        <article>
          <dl className="painel grid gap-x-6 gap-y-4 p-5 text-sm sm:grid-cols-2 sm:p-6">
            <div>
              <dt className="rotulo-meta">Cargo em disputa</dt>
              <dd className="mt-1 text-tinta-800">
                {candidato.cargo} — {candidato.uf}
              </dd>
            </div>
            <div>
              <dt className="rotulo-meta">Partido</dt>
              <dd className="mt-1">
                <PastilhaPartido partido={partido} detalhado />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="rotulo-meta">Coligação</dt>
              <dd className="mt-1 text-tinta-800">{candidato.coligacao}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <FaixaSituacao
              situacao={candidato.situacaoRegistro}
              atualizadoEm={candidato.proveniencia.coletadoEm}
              fonte={candidato.proveniencia.fonte}
              urlOriginal={candidato.proveniencia.urlOriginal}
            />
          </div>

          <div role="status" className="aviso-callout mt-5 flex gap-3">
            <IconeInfo className="mt-0.5 shrink-0 text-tinta-500" />
            <span>
              <strong className="font-semibold text-tinta-900">
                Página provisória.
              </strong>{" "}
              As abas Perfil, Proposta, Mandato e Bens, com os gráficos e a lista
              de votações, entram no passo 5.
            </span>
          </div>

          <p className="rotulo-secao mt-10">
            <span>A</span> Proposta de governo
          </p>
          <p className="mt-3 text-sm text-tinta-600">
            O resumo em linguagem simples e o documento oficial aparecem juntos,
            com o mesmo destaque. Um não substitui o outro.
          </p>

          <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
            <ResumoPlataforma
              titulo="Resumo da proposta"
              revisadoEm={DATA_REVISAO}
            >
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

          <p className="rotulo-secao mt-12">
            <span>B</span> Dados declarados
          </p>
          <p className="mt-3 text-sm text-tinta-600">
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
                  <dd className="mt-0.5">
                    {idadeEm(candidato.dataNascimento)} anos
                  </dd>
                </div>
                <div>
                  <dt className="rotulo-meta">Gênero (autodeclarado)</dt>
                  <dd className="mt-0.5">{candidato.genero}</dd>
                </div>
                <div>
                  <dt className="rotulo-meta">Cor ou raça (autodeclarada)</dt>
                  <dd className="mt-0.5">{candidato.corRaca}</dd>
                </div>
                <div>
                  <dt className="rotulo-meta">Escolaridade (autodeclarada)</dt>
                  <dd className="mt-0.5">{candidato.escolaridade}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="rotulo-meta">Ocupação (autodeclarada)</dt>
                  <dd className="mt-0.5">{candidato.ocupacaoDeclarada}</dd>
                </div>
              </dl>
            </DadoOficial>
          </div>
        </article>
      </div>
    </>
  );
}
