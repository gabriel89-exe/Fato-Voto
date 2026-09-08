"use client";

import { useId, useState } from "react";

import { IconeLinkExterno } from "@/components/icones";
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
import type { DespesaPorTipo } from "@/types";

/**
 * Gastos da cota parlamentar, abertos por categoria.
 *
 * ==================================================================
 * POR QUE ESTA TELA NÃO SE CHAMA "GASTOS QUE MERECEM ATENÇÃO".
 *
 * A ideia que originou este componente era uma aba de "gastos
 * curiosos": hospedagem cara, locação de veículo de quem já declarou
 * carro, assessor com salário fora da curva. O impulso é justo e o
 * material existe — mas a execução seria a plataforma escolhendo QUAIS
 * gastos são suspeitos, e isso é veredito, não fato.
 *
 * Quebraria duas regras de uma vez (docs/principios.md):
 *
 *   regra 1 — nada de ranking, nota ou ordenação por mérito
 *   regra 3 — descritivo, nunca normativo; sem adjetivo, sem cor de
 *             alerta para valor alto
 *
 * E quebraria na pior hora possível: às vésperas de uma eleição, sobre
 * 575 pessoas identificadas, num site cuja única defesa é não opinar.
 * Bastaria uma categoria rotulada como "curiosa" para o projeto inteiro
 * ser lido como campanha.
 *
 * O QUE ESTA TELA FAZ NO LUGAR: entrega a mesma capacidade sem o
 * veredito. As categorias são as da própria Câmara. Todas aparecem,
 * nenhuma é destacada, e nenhuma é escondida. Quem escolhe o que
 * investigar é quem lê — que era, no fim, o pedido de verdade: "para
 * que fique mais fácil a população realizar essa filtragem".
 *
 * O componente não adjetiva, não colore por valor e não ordena
 * candidaturas. Ordena categorias DENTRO de uma pessoa por valor, que é
 * descrição, não comparação entre pessoas.
 * ==================================================================
 */

/** Formata CNPJ/CPF sem alterar o dado, só para caber na leitura. */
function documentoFiscal(valor: string | null): string | null {
  if (!valor) return null;
  const so = valor.replace(/\D/g, "");
  if (so.length === 14) {
    return so.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }
  if (so.length === 11) {
    return so.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }
  return valor;
}

/**
 * Nome de categoria como a Câmara escreve, só com a caixa arrumada.
 *
 * A fonte grava em versal com ponto final ("COMBUSTÍVEIS E
 * LUBRIFICANTES."). Versal em botão é ruim de ler e o ponto final não
 * serve a nada aqui. O texto não muda — só a caixa.
 */
function categoriaLegivel(tipo: string): string {
  const limpo = tipo.trim().replace(/\.$/, "");
  if (limpo !== limpo.toUpperCase()) return limpo;
  return limpo.charAt(0) + limpo.slice(1).toLowerCase();
}

export default function GastosPorCategoria({
  categorias,
  nome,
}: {
  categorias: DespesaPorTipo[];
  nome: string;
}) {
  /*
   * Nenhuma vem aberta. A tela abre com o mapa das categorias, e o
   * detalhe só é montado quando alguém pede — que é o comportamento
   * pedido para a ficha inteira: leve por padrão, completo sob demanda.
   */
  const [aberta, setAberta] = useState<string | null>(null);
  const idBase = useId();

  if (categorias.length === 0) return null;

  const maior = Math.max(...categorias.map((c) => c.valor));

  return (
    <section>
      <h4 className="text-base font-bold text-tinta-950">
        Gastos por categoria
      </h4>
      <p className="mt-1 text-sm text-tinta-600">
        As categorias são as que a própria Câmara usa para classificar cada
        nota. Abra uma para ver quais empresas receberam, com CNPJ, e as notas
        de maior valor com o comprovante. Todas estão aqui, na ordem do valor —
        esta plataforma não escolhe quais merecem atenção.
      </p>

      <ul className="mt-5 space-y-2">
        {categorias.map((c) => {
          const estaAberta = aberta === c.tipo;
          const idPainel = `${idBase}-${c.tipo.replace(/\W+/g, "-")}`;

          return (
            <li key={c.tipo} className="border border-tinta-200 bg-papel-alta">
              <h5>
                <button
                  type="button"
                  aria-expanded={estaAberta}
                  aria-controls={idPainel}
                  onClick={() => setAberta(estaAberta ? null : c.tipo)}
                  className="flex min-h-toque w-full flex-col gap-1 px-4 py-3 text-left hover:bg-papel"
                >
                  <span className="flex w-full flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-medium text-tinta-900">
                      {categoriaLegivel(c.tipo)}
                    </span>
                    <span className="font-mono text-sm tabular-nums text-tinta-900">
                      {reais(c.valor)}
                    </span>
                  </span>

                  {/* Barra da mesma cor para todas. Variar cor sugeriria
                      categoria boa e categoria ruim, que é o juízo que
                      esta tela existe para não emitir. */}
                  <span
                    aria-hidden="true"
                    className="block h-1 w-full bg-tinta-100"
                  >
                    <span
                      className="block h-1 bg-acento"
                      style={{ width: `${Math.max((c.valor / maior) * 100, 1)}%` }}
                    />
                  </span>

                  <span className="text-xs text-tinta-600">
                    {fmtNumero(c.notas)} {c.notas === 1 ? "nota" : "notas"} ·{" "}
                    {estaAberta ? "fechar" : "ver quem recebeu"}
                  </span>
                </button>
              </h5>

              {estaAberta ? (
                <div
                  id={idPainel}
                  className="border-t border-tinta-200 px-4 py-4"
                >
                  <p className="rotulo-meta mb-3">
                    Quem recebeu nesta categoria
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa ou pessoa</TableHead>
                        <TableHead className="text-right">Notas</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {c.fornecedores.map((f) => (
                        <TableRow key={f.cnpjCpf ?? f.nome}>
                          {/* Sem rótulo: no celular o nome abre a ficha. */}
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
                                Mesmo CNPJ, também como:{" "}
                                {f.outrosNomes.join(", ")}
                              </span>
                            ) : null}
                          </TableCell>
                          <TableCellNumero rotulo="Notas">
                            {fmtNumero(f.notas)}
                          </TableCellNumero>
                          <TableCellNumero rotulo="Total">
                            {reais(f.total)}
                          </TableCellNumero>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {c.fornecedores.length > 0 &&
                  c.fornecedores.length < c.notas ? (
                    <p className="mt-2 text-xs text-tinta-600">
                      Os {c.fornecedores.length} de maior valor nesta categoria.
                      A lista completa está no portal da Câmara.
                    </p>
                  ) : null}

                  {c.maiores.length > 0 ? (
                    <>
                      <p className="rotulo-meta mb-3 mt-6">
                        As notas de maior valor
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Fornecedor</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                            <TableHead>Comprovante</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {c.maiores.map((n) => (
                            <TableRow key={n.id ?? `${n.data}-${n.valor}`}>
                              {/* Sem rótulo: o fornecedor abre a ficha. */}
                              <TableCell>
                                {n.fornecedor ?? "Não informado"}
                              </TableCell>
                              <TableCell
                                rotulo="Data"
                                className="whitespace-nowrap"
                              >
                                {n.data ? dataCurta(n.data) : "—"}
                              </TableCell>
                              <TableCellNumero rotulo="Valor">
                                {reais(n.valor)}
                              </TableCellNumero>
                              <TableCell rotulo="Comprovante">
                                {n.documento ? (
                                  <a
                                    href={n.documento}
                                    target="_blank"
                                    rel="nofollow noopener"
                                    className="inline-flex items-center gap-1 whitespace-nowrap text-sm"
                                  >
                                    Ver nota
                                    <IconeLinkExterno />
                                  </a>
                                ) : (
                                  <span className="text-sm text-tinta-500">
                                    Sem PDF publicado
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-tinta-600">
        A soma das categorias é o total da cota de {nome} no período. O que cada
        nota comprou não está na fonte: a Câmara registra o valor, o fornecedor
        e a data. Para saber o que foi comprado, o caminho é abrir o
        comprovante.
      </p>
    </section>
  );
}
