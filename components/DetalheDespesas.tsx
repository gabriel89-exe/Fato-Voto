import { GraficoBarras } from "@/components/graficos";
import Termo from "@/components/Termo";
import { IconeLinkExterno } from "@/components/icones";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableCellNumero,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dataCurta, numero as fmtNumero, reais } from "@/lib/formato";
import type { Despesas } from "@/types";

/**
 * Detalhe da cota parlamentar.
 *
 * O PRINCÍPIO QUE GOVERNA ESTE ARQUIVO: mostrar o fato que convida ao
 * escrutínio, sem afirmar irregularidade.
 *
 * Nada aqui é adjetivado. Não há "suspeito", "alto", "excessivo" nem
 * destaque de cor para valor grande. O que a tela faz é colocar lado a
 * lado o que a fonte publica — quem recebeu, quanto, quando, e o link
 * para o comprovante — e deixar a conclusão com quem lê. É a diferença
 * entre dar o documento e dar o veredito, e só a primeira cabe aqui.
 *
 * Ver docs/principios.md, regras 4 e 5.
 */

/** Formata CNPJ/CPF sem alterar o dado, só para caber na leitura. */
function documentoFiscal(valor: string | null): string | null {
  if (!valor) return null;
  const so = valor.replace(/\D/g, "");
  if (so.length === 14) {
    return so.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  }
  if (so.length === 11) {
    return so.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }
  return valor;
}

function LinkDocumento({ url }: { url: string | null }) {
  if (!url) {
    return (
      <span className="text-sm text-tinta-500">Sem PDF publicado</span>
    );
  }
  return (
    <a
      href={url}
      rel="nofollow noopener"
      className="inline-flex items-center gap-1 whitespace-nowrap text-sm"
    >
      Ver nota
      <IconeLinkExterno />
    </a>
  );
}

export default function DetalheDespesas({
  despesas,
  nome,
}: {
  despesas: Despesas;
  nome: string;
}) {
  const { comprovantes, fornecedores, glosas, maiores } = despesas;
  const semPdf = comprovantes.total - comprovantes.com;

  return (
    <div className="space-y-10">
      {/* ---------- Quem recebeu ---------- */}
      <section>
        <h4 className="text-base font-bold text-tinta-950">Quem recebeu</h4>
        <p className="mt-1 text-sm text-tinta-600">
          Os maiores destinatários da cota, por valor. Agrupados por CNPJ: a
          mesma empresa às vezes emite nota com nomes de fantasia diferentes, e
          agrupar pelo nome mostraria concentração menor que a real.
        </p>

        {/* Barra antes da tabela: o olho pega a ordem de grandeza num
            relance, e quem quiser o número exato desce dois centímetros.
            Todas da mesma cor — variar cor sugeriria categoria onde só
            existe ordem de grandeza. */}
        <div className="mt-5">
          <GraficoBarras
            legenda={`Maiores destinatários da cota parlamentar de ${nome}`}
            formatar={reais}
            itens={fornecedores.map((f) => ({
              rotulo: f.nome,
              valor: f.total,
              detalhe: `${fmtNumero(f.notas)} ${f.notas === 1 ? "nota" : "notas"}`,
            }))}
          />
        </div>

        <details className="mt-5">
          <summary className="cursor-pointer text-sm font-semibold text-acento">
            Ver como tabela, com CNPJ
          </summary>
          <div className="mt-3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-right">Notas</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedores.map((f) => (
                <TableRow key={f.cnpjCpf ?? f.nome}>
                  <TableCell>
                    <span className="block font-medium text-tinta-900">
                      {f.nome}
                    </span>
                    {f.cnpjCpf ? (
                      <span className="block font-mono text-xs text-tinta-600">
                        {documentoFiscal(f.cnpjCpf)}
                      </span>
                    ) : null}
                    {f.outrosNomes.length > 0 ? (
                      <span className="mt-0.5 block text-xs text-tinta-600">
                        Mesmo CNPJ, também como: {f.outrosNomes.join(", ")}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCellNumero>{f.notas}</TableCellNumero>
                  <TableCellNumero>{reais(f.total)}</TableCellNumero>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </details>
      </section>

      {/* ---------- O que a Câmara recusou ---------- */}
      <section>
        <h4 className="text-base font-bold text-tinta-950">
          O que a Câmara recusou reembolsar
        </h4>

        {glosas.quantidade === 0 ? (
          <p className="mt-1 text-sm text-tinta-600">
            Nenhuma <Termo id="glosa">glosa</Termo> registrada no período.
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-tinta-600">
              <Termo id="glosa">Glosa</Termo> é a parte de uma despesa que a
              própria Câmara não aceitou reembolsar — registro da Casa, não
              avaliação desta plataforma. Foram <strong>{fmtNumero(glosas.quantidade)}</strong> ocorrências,
              somando <strong>{reais(glosas.valor)}</strong> de{" "}
              {reais(despesas.total)} apresentados.
            </p>

            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Recusado</TableHead>
                    <TableHead>Comprovante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {glosas.exemplos.map((g) => (
                    <TableRow key={`${g.id}-${g.valorGlosa}`}>
                      <TableCell className="whitespace-nowrap">
                        {g.data ? dataCurta(g.data) : "—"}
                      </TableCell>
                      <TableCell>{g.tipo}</TableCell>
                      <TableCellNumero>{reais(g.valorGlosa)}</TableCellNumero>
                      <TableCell>
                        <LinkDocumento url={g.documento} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {glosas.quantidade > glosas.exemplos.length ? (
              <p className="mt-3 text-xs text-tinta-600">
                As {glosas.exemplos.length} de maior valor. As demais estão no
                portal da Câmara.
              </p>
            ) : null}
          </>
        )}
      </section>

      {/* ---------- Maiores notas ---------- */}
      <section>
        <h4 className="text-base font-bold text-tinta-950">
          As dez maiores notas
        </h4>
        <p className="mt-1 text-sm text-tinta-600">
          Ordenadas por valor, com o comprovante quando existe. O documento é a
          fonte: ele mostra o que a linha da tabela não cabe.
        </p>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Comprovante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maiores.map((n) => (
                <TableRow key={n.id ?? `${n.data}-${n.valor}`}>
                  <TableCell className="whitespace-nowrap">
                    {n.data ? dataCurta(n.data) : "—"}
                  </TableCell>
                  <TableCell>{n.tipo}</TableCell>
                  <TableCell>{n.fornecedor ?? "Não informado"}</TableCell>
                  <TableCellNumero>{reais(n.valor)}</TableCellNumero>
                  <TableCell>
                    <LinkDocumento url={n.documento} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* ---------- O que a fonte não publica ---------- */}
      <Alert>
        <AlertTitle>O que esta fonte não mostra</AlertTitle>
        <AlertDescription>
          <p>
            {fmtNumero(comprovantes.com)} das {fmtNumero(comprovantes.total)}{" "}
            notas de {nome} têm PDF publicado. As outras {fmtNumero(semPdf)} não
            têm — passagem aérea pelo sistema da Câmara nunca tem documento
            anexado, e por isso também não há origem nem destino do voo.
          </p>
          <p className="mt-2">
            A cota parlamentar registra o valor e o fornecedor, não a finalidade
            de cada gasto. Quando quiser saber o que foi comprado, o caminho é
            abrir a nota.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
