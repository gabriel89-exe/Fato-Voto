"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { numero as fmtNumero, reais } from "@/lib/formato";

/**
 * Explorador de emendas: o mesmo conjunto de dados, visto pelo recorte
 * que a pessoa escolher — ano, município, área ou tipo — e pela medida
 * que ela escolher — empenhado, pago ou quantidade.
 *
 * REGRAS QUE ESTE COMPONENTE CARREGA:
 *
 * 1. Ele descreve o que UMA pessoa destinou. Não compara candidaturas
 *    entre si — ordenar municípios de uma pessoa não é ranquear
 *    pessoas (regra 1; mesmo raciocínio registrado na coleta).
 * 2. Barras da MESMA cor: variar cor por item sugeriria categoria com
 *    peso diferente onde só existe ordem de grandeza.
 * 3. O filtro muda o RECORTE, nunca o dado. A nota de cada dimensão —
 *    o que "Vários municípios" significa, por que a soma das áreas
 *    pode passar do total — viaja junto e aparece com o recorte.
 * 4. O desenho é decorativo: todo número está escrito em texto ao lado
 *    da barra, e a tabela completa vive no "Conferir em tabela".
 * 5. Sem armazenamento: o estado do filtro vive no componente e morre
 *    com a página, como a /privacidade promete.
 *
 * A dimensão "ano" tem `ordemFixa`: anos são uma sequência, e
 * reordenar 2023–2026 por valor quebraria a leitura do tempo.
 */

export interface ItemDimensao {
  rotulo: string;
  quantidade: number;
  empenhado: number | null;
  pago: number | null;
}

export interface DimensaoEmendas {
  id: string;
  rotulo: string;
  /** O que este recorte significa, na voz da fonte. Vai para a tela. */
  nota?: string;
  /** Sequência (anos): mantém a ordem recebida em vez de ordenar por valor. */
  ordemFixa?: boolean;
  itens: ItemDimensao[];
}

type Medida = "empenhado" | "pago" | "quantidade";

const ROTULO_MEDIDA: Record<Medida, string> = {
  empenhado: "valor empenhado",
  pago: "valor pago",
  quantidade: "quantidade de emendas",
};

/** Quantas barras aparecem antes do "mostrar todas". */
const VISIVEIS = 10;

export default function GraficoEmendasExplorador({
  nome,
  comValores,
  dimensoes,
}: {
  nome: string;
  comValores: boolean;
  dimensoes: DimensaoEmendas[];
}) {
  const [idDimensao, setIdDimensao] = useState(dimensoes[0]?.id ?? "");
  const [medida, setMedida] = useState<Medida>(
    comValores ? "empenhado" : "quantidade",
  );
  const [todas, setTodas] = useState(false);

  const dimensao = dimensoes.find((d) => d.id === idDimensao) ?? dimensoes[0];
  if (!dimensao || dimensao.itens.length === 0) return null;

  const valorDe = (item: ItemDimensao) =>
    medida === "quantidade" ? item.quantidade : (item[medida] ?? 0);

  const ordenados = dimensao.ordemFixa
    ? dimensao.itens
    : [...dimensao.itens].sort(
        (a, b) =>
          valorDe(b) - valorDe(a) ||
          a.rotulo.localeCompare(b.rotulo, "pt-BR"),
      );
  const recortados = todas ? ordenados : ordenados.slice(0, VISIVEIS);
  const escondidos = ordenados.length - recortados.length;

  const maior = Math.max(...ordenados.map(valorDe), 0);
  const formatar = medida === "quantidade" ? fmtNumero : reais;

  return (
    <figure className="m-0">
      {/* ---------- A régua de filtros: recorte e medida ---------- */}
      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup
          type="single"
          value={dimensao.id}
          onValueChange={(v) => {
            if (v) {
              setIdDimensao(v);
              setTodas(false);
            }
          }}
          aria-label="Recorte do gráfico"
        >
          {dimensoes.map((d) => (
            <ToggleGroupItem key={d.id} value={d.id} className="text-sm">
              {d.rotulo}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        {comValores ? (
          <ToggleGroup
            type="single"
            value={medida}
            onValueChange={(v) => {
              if (v) setMedida(v as Medida);
            }}
            aria-label="Medida do gráfico"
          >
            <ToggleGroupItem value="empenhado" className="text-sm">
              Empenhado
            </ToggleGroupItem>
            <ToggleGroupItem value="pago" className="text-sm">
              Pago
            </ToggleGroupItem>
            <ToggleGroupItem value="quantidade" className="text-sm">
              Quantidade
            </ToggleGroupItem>
          </ToggleGroup>
        ) : null}
      </div>

      {/* O resumo do recorte muda junto com o filtro, e o leitor de
          tela é avisado — é a resposta da tela ao clique. */}
      <p aria-live="polite" className="mt-3 text-sm text-tinta-600">
        {fmtNumero(ordenados.length)}{" "}
        {ordenados.length === 1 ? "categoria" : "categorias"} por{" "}
        {dimensao.rotulo.toLowerCase()},{" "}
        {dimensao.ordemFixa
          ? "em ordem cronológica"
          : `da maior para a menor em ${ROTULO_MEDIDA[medida]}`}
        .
      </p>

      {dimensao.nota ? (
        <p className="mt-1 text-xs text-tinta-600">{dimensao.nota}</p>
      ) : null}

      {/* ---------- As barras ---------- */}
      <ul className="mt-4 space-y-3">
        {recortados.map((item) => {
          const valor = valorDe(item);
          return (
            <li key={item.rotulo}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="min-w-0 truncate text-sm text-tinta-800">
                  {item.rotulo}
                </span>
                <span className="shrink-0 font-mono text-sm tabular-nums text-tinta-900">
                  {formatar(valor)}
                </span>
              </div>
              <div
                aria-hidden="true"
                className="mt-1 h-2 w-full overflow-hidden rounded-full bg-papel-baixa"
              >
                <div
                  className="h-full rounded-full bg-grafico-2 transition-[width] duration-500 ease-suave motion-reduce:transition-none"
                  style={{
                    width: `${maior > 0 ? Math.max(1.5, (valor / maior) * 100) : 0}%`,
                  }}
                />
              </div>
              {medida !== "quantidade" ? (
                <p className="mt-1 text-xs text-tinta-600">
                  {fmtNumero(item.quantidade)}{" "}
                  {item.quantidade === 1 ? "emenda" : "emendas"}
                  {medida === "empenhado" && item.pago != null
                    ? ` · ${reais(item.pago)} pagos`
                    : ""}
                  {medida === "pago" && item.empenhado != null
                    ? ` · ${reais(item.empenhado)} empenhados`
                    : ""}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      {escondidos > 0 ? (
        <button
          type="button"
          onClick={() => setTodas(true)}
          className="alvo-toque mt-3 text-sm font-medium text-acento underline decoration-tinta-300 underline-offset-2 hover:decoration-current"
        >
          Mostrar as {fmtNumero(escondidos)} restantes
        </button>
      ) : null}

      {/* ---------- A tabela, sempre ---------- */}
      <details className="mt-4 rounded-lg border border-tinta-200 bg-papel-alta">
        <summary className="alvo-toque w-full cursor-pointer justify-start px-4 text-sm font-medium text-tinta-800">
          Conferir em tabela
        </summary>
        <div className="tabela-rolagem border-t border-tinta-100 px-4 pb-4">
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-tinta-200 text-left text-tinta-600">
                <th className="py-1.5 pr-4 font-semibold">{dimensao.rotulo}</th>
                <th className="py-1.5 pr-4 text-right font-semibold">
                  Emendas
                </th>
                {comValores ? (
                  <>
                    <th className="py-1.5 pr-4 text-right font-semibold">
                      Empenhado
                    </th>
                    <th className="py-1.5 text-right font-semibold">Pago</th>
                  </>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {ordenados.map((item) => (
                <tr key={item.rotulo} className="border-b border-tinta-100">
                  <td className="py-1.5 pr-4 text-tinta-800">{item.rotulo}</td>
                  <td className="py-1.5 pr-4 text-right font-mono tabular-nums">
                    {fmtNumero(item.quantidade)}
                  </td>
                  {comValores ? (
                    <>
                      <td className="py-1.5 pr-4 text-right font-mono tabular-nums">
                        {reais(item.empenhado ?? 0)}
                      </td>
                      <td className="py-1.5 text-right font-mono tabular-nums">
                        {reais(item.pago ?? 0)}
                      </td>
                    </>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <figcaption className="apenas-leitor">
        Emendas de {nome} agrupadas por {dimensao.rotulo.toLowerCase()}, com a
        opção de trocar o recorte e a medida. Os mesmos números estão na
        tabela acima.
      </figcaption>
    </figure>
  );
}
