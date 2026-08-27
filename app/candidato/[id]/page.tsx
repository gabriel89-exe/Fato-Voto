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
  ESTADO,
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
 * passo 5. O par documento oficial + resumo da plataforma e mantido
 * exatamente como esta: e o dispositivo central de neutralidade.
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
    <div className="envelope py-8 sm:py-10">
      <Link
        href="/candidatos"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] no-underline"
      >
        <IconeSeta className="h-3.5 w-3.5 rotate-180" />
        Voltar para a lista
      </Link>

      <article className="mt-5">
        {/* ---------- Cabeçote da ficha ---------- */}
        <header className="entrada border-y-2 border-tinta-900 py-6">
          <p className="folio flex-wrap justify-between gap-y-1">
            <span>Ficha de candidatura</span>
            <span className="text-tinta-400">
              {ESTADO.nome} ({ESTADO.sigla}) · {candidato.cargo}
            </span>
          </p>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
            <AvatarCandidato nome={candidato.nomeUrna} tamanho="lg" />
            <div className="min-w-0 flex-1">
              <h1 className="text-[clamp(2rem,1.4rem+3vw,3.4rem)]">
                {candidato.nomeUrna}
              </h1>
              <p className="mt-1 font-texto text-lg italic text-tinta-600">
                {candidato.nomeCivil}
              </p>
              <div className="mt-4">
                <NumeroUrna numero={candidato.numero} tamanho="lg" />
              </div>
            </div>
          </div>
        </header>

        <dl className="mt-6 grid gap-x-8 gap-y-4 border-l-2 border-tinta-900 pl-5 text-sm sm:grid-cols-2">
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

        <div className="mt-6">
          <FaixaSituacao
            situacao={candidato.situacaoRegistro}
            atualizadoEm={candidato.proveniencia.coletadoEm}
            fonte={candidato.proveniencia.fonte}
            urlOriginal={candidato.proveniencia.urlOriginal}
          />
        </div>

        <div role="status" className="aviso-callout mt-6 flex gap-3">
          <IconeInfo className="mt-0.5 shrink-0 text-tinta-500" />
          <span>
            <strong className="font-bold text-tinta-900">
              Página provisória.
            </strong>{" "}
            As abas Perfil, Proposta, Mandato e Bens, com os gráficos e a lista
            de votações, entram no passo 5.
          </span>
        </div>

        <div className="secao-cabeca mt-12">
          <span className="folio">
            <b>§ A</b>
          </span>
          <h2>Proposta de governo</h2>
        </div>
        <p className="mt-3 text-sm text-tinta-600">
          O resumo em linguagem simples e o documento oficial aparecem juntos,
          com o mesmo destaque. Um não substitui o outro.
        </p>

        <div className="mt-5 grid items-start gap-4 lg:grid-cols-2">
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

        <div className="secao-cabeca mt-14">
          <span className="folio">
            <b>§ B</b>
          </span>
          <h2>Dados declarados</h2>
        </div>
        <p className="mt-3 text-sm text-tinta-600">
          Informações declaradas pela própria candidatura no momento do registro.
        </p>

        <div className="mt-5">
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
  );
}
