import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableCellNumero,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  candidaturas,
  COLETADO_EM,
  COLETADO_EM_CAMARA,
  contarPorCargo,
  ELEICAO,
  ESTADO,
  FONTE_CAMARA,
  FONTE_TSE,
  LEGISLATURA,
  parlamentares,
} from "@/lib/eleicao";
import { dataPorExtenso, numero as fmtNumero } from "@/lib/formato";
import { CARGOS } from "@/types";

export const metadata = { title: "Fontes dos dados" };

/**
 * Inventario publico do que a plataforma tem.
 *
 * Nao e so uma lista de fontes: e o mapa das LACUNAS. Publicar onde o
 * dado falta constroi mais confianca do que qualquer texto sobre
 * imparcialidade — e evita que o espaco vazio numa ficha seja lido
 * como culpa da candidatura. Ver docs/principios.md, regra 7.
 */
export default function PaginaFontes() {
  const porCargo = contarPorCargo();
  const totalDe = (cargo: string) =>
    porCargo.find((c) => c.cargo === cargo)?.total ?? 0;

  const documentos = candidaturas.reduce((s, c) => s + c.documentos.length, 0);
  const notasFiscais = parlamentares.reduce(
    (s, p) => s + p.despesas.documentos,
    0,
  );

  /** O que existe hoje, por cargo. A coluna de mandato é a lacuna. */
  const cobertura = CARGOS.map((cargo) => ({
    cargo,
    candidaturas: totalDe(cargo),
    proposta: cargo === "Presidente" || cargo === "Governador",
    mandato: cargo === "Deputado Federal",
  }));

  return (
    <div className="envelope py-8 sm:py-12">
      <article className="entrada">
        <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-tinta-200 pb-3 text-sm text-tinta-600">
          <span>
            {ESTADO.nome} ({ESTADO.sigla}) — Eleição {ELEICAO.ano}
          </span>
          <span className="text-tinta-400">
            Coleta de {dataPorExtenso(COLETADO_EM)}
          </span>
        </p>

        <h1 className="mt-6">De onde vêm os dados</h1>

        <p className="mt-5 max-w-leitura text-lg text-tinta-800">
          Tudo aqui vem de fonte pública oficial. Nada é estimado, calculado
          por nós ou preenchido quando falta.
        </p>

        <Alert className="mt-6">
          <AlertTitle>O registro ainda está em julgamento</AlertTitle>
          <AlertDescription>
            A Justiça Eleitoral ainda está julgando os pedidos de registro. A
            situação de cada candidatura muda de um dia para o outro, e o que
            você vê aqui é o retrato da coleta de{" "}
            {dataPorExtenso(COLETADO_EM)}.
          </AlertDescription>
        </Alert>

        {/* --- O que temos--- */}
        <section className="mt-14">
          <div className="secao-cabeca">
            <h2>O que temos hoje</h2>
          </div>

          <p className="mt-4 max-w-leitura text-tinta-700">
            A tabela abaixo é o inventário honesto da plataforma, incluindo o
            que ainda <strong>não</strong> temos. Nenhuma coluna vazia é falha
            da candidatura.
          </p>

          <div className="mt-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="text-right">Candidaturas</TableHead>
                  <TableHead>Bens e documentos</TableHead>
                  <TableHead>Proposta de governo</TableHead>
                  <TableHead>Histórico de mandato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cobertura.map((linha) => (
                  <TableRow key={linha.cargo}>
                    <TableCell className="font-medium text-tinta-900">
                      {linha.cargo}
                    </TableCell>
                    <TableCellNumero>{linha.candidaturas}</TableCellNumero>
                    <TableCell>Sim — TSE</TableCell>
                    <TableCell>
                      {linha.proposta ? (
                        "Sim — TSE"
                      ) : (
                        <span className="text-tinta-500">
                          O cargo não exige
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {linha.mandato ? (
                        "Sim — Câmara"
                      ) : (
                        <span className="text-tinta-500">Ainda não temos</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { rotulo: "Candidaturas", valor: fmtNumero(candidaturas.length) },
              { rotulo: "Documentos oficiais", valor: fmtNumero(documentos) },
              {
                rotulo: "Notas fiscais de cota",
                valor: fmtNumero(notasFiscais),
              },
              {
                rotulo: "Deputados com mandato",
                valor: fmtNumero(parlamentares.length),
              },
            ].map((item) => (
              <div
                key={item.rotulo}
                className="border border-tinta-200 bg-papel-alta px-4 py-4"
              >
                <dd className="font-display text-2xl font-bold tabular-nums text-tinta-900">
                  {item.valor}
                </dd>
                <dt className="rotulo-meta mt-1">{item.rotulo}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* --- As fontes--- */}
        <section className="mt-14">
          <div className="secao-cabeca">
            <h2>As fontes</h2>
          </div>

          <div className="mt-6 space-y-5">
            <div className="painel p-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="oficial">Dado oficial</Badge>
                <h3 className="text-lg font-bold">
                  {FONTE_TSE.nome}
                </h3>
              </div>
              <p className="mt-3 text-sm text-tinta-700">
                Origem de tudo que diz respeito à candidatura: nome de urna,
                número, partido, coligação, situação do registro, bens
                declarados, documentos entregues e candidaturas anteriores.
              </p>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="rotulo-meta">Coletado em</dt>
                  <dd className="mt-0.5">{dataPorExtenso(COLETADO_EM)}</dd>
                </div>
                <div>
                  <dt className="rotulo-meta">Licença</dt>
                  <dd className="mt-0.5">{FONTE_TSE.licenca}</dd>
                </div>
              </dl>
              <p className="mt-3 text-sm">
                <a href={FONTE_TSE.url} rel="nofollow noopener">
                  Ir à fonte
                </a>
              </p>
            </div>

            <div className="painel p-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="oficial">Dado oficial</Badge>
                <h3 className="text-lg font-bold">
                  {FONTE_CAMARA.nome}
                </h3>
              </div>
              <p className="mt-3 text-sm text-tinta-700">
                Origem do mandato em exercício de deputado federal: despesas da
                cota parlamentar, com nota fiscal pública, na legislatura{" "}
                {LEGISLATURA}.
              </p>
              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="rotulo-meta">Coletado em</dt>
                  <dd className="mt-0.5">
                    {dataPorExtenso(COLETADO_EM_CAMARA)}
                  </dd>
                </div>
                <div>
                  <dt className="rotulo-meta">Licença</dt>
                  <dd className="mt-0.5">{FONTE_CAMARA.licenca}</dd>
                </div>
              </dl>
              <p className="mt-3 text-sm">
                <a href={FONTE_CAMARA.url} rel="nofollow noopener">
                  Ir à fonte
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* --- O que falta--- */}
        <section className="mt-14">
          <div className="secao-cabeca">
            <h2>O que ainda falta</h2>
          </div>

          <ul className="mt-6 border border-tinta-200 bg-papel-alta">
            {[
              {
                titulo: "Emendas parlamentares",
                texto:
                  "Quanto cada deputado federal e senador destinou, e para quê. A fonte é o Portal da Transparência, que exige credencial de acesso ainda em obtenção.",
              },
              {
                titulo: "Atuação de deputado estadual",
                texto:
                  "Votações, presença e projetos na Assembleia Legislativa do Espírito Santo. A Assembleia não publica esses dados em formato aberto, e a coleta ainda está sendo estudada.",
              },
              {
                titulo: "Votações e projetos no Congresso",
                texto:
                  "Como cada deputado federal e senador votou em cada matéria. As fontes são abertas e já mapeadas; é trabalho de coleta ainda não feito.",
              },
              {
                titulo: "Execução orçamentária estadual",
                texto:
                  "O que o governo do estado gastou em saúde e educação. Diz respeito ao governo, não à pessoa candidata, e precisa ser apresentado sem confundir os dois.",
              },
            ].map((item, i) => (
              <li
                key={item.titulo}
                className={`p-5 ${i > 0 ? "border-t border-tinta-300" : ""}`}
              >
                <p className="text-base font-bold text-tinta-900">
                  {item.titulo}
                </p>
                <p className="mt-1 text-sm text-tinta-700">{item.texto}</p>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-tinta-700">
            Encontrou divergência entre o que está aqui e o registro oficial? O
            link para a fonte está em cada bloco de dado — e a correção da fonte
            tem precedência sobre o que mostramos.{" "}
            <Link href="/metodologia">Veja como tratamos os dados</Link>.
          </p>
        </section>
      </article>
    </div>
  );
}
