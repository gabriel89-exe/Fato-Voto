"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { SECOES } from "@/lib/glossario";

/**
 * Busca dentro do glossário.
 *
 * A página tem 27 verbetes em seis seções. Sem busca, quem chega com uma
 * dúvida concreta — "o que é LOA?", "por que diz aguardando julgamento?"
 * — precisa varrer a página inteira ou saber de antemão em que seção o
 * termo mora. Saber a seção é justamente o que quem não conhece o
 * assunto não sabe.
 *
 * Procura no termo, no nome por extenso e no resumo. NÃO procura no
 * texto longo de propósito: buscar "dinheiro" traria quinze verbetes que
 * mencionam a palavra de passagem, e uma lista longa demais responde
 * tanto quanto lista nenhuma.
 *
 * Sem busca no servidor e sem índice: são 27 itens, e filtrar 27 strings
 * no navegador é instantâneo. Nada é gravado — a página não usa
 * armazenamento, como diz /privacidade.
 */

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function BuscaDeVerbetes() {
  const [termo, setTermo] = useState("");

  const todos = useMemo(
    () =>
      SECOES.flatMap((secao) =>
        secao.verbetes.map((v) => ({
          id: v.id,
          termo: v.termo,
          nome: v.nome,
          resumo: v.resumo,
          secao: secao.titulo,
          busca: normalizar(
            [v.termo, v.nome ?? "", v.resumo].join(" "),
          ),
        })),
      ),
    [],
  );

  const procurado = normalizar(termo.trim());
  const achados = procurado
    ? todos.filter((v) => v.busca.includes(procurado))
    : [];

  return (
    <div className="mt-8">
      <label htmlFor="busca-verbete" className="rotulo-meta">
        Procurar um termo
      </label>
      <Input
        id="busca-verbete"
        type="search"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="LOA, emenda, glosa, aguardando julgamento…"
        className="mt-1"
        autoComplete="off"
      />

      {/* `aria-live`: quem usa leitor de tela precisa saber que a lista
          mudou sem ter de sair procurando. */}
      <div aria-live="polite">
        {procurado ? (
          achados.length > 0 ? (
            <>
              <p className="mt-3 text-sm text-tinta-600">
                {achados.length}{" "}
                {achados.length === 1 ? "verbete" : "verbetes"} para “{termo}”.
              </p>
              <ul className="mt-2 divide-y divide-tinta-100 border border-tinta-200 bg-papel-alta">
                {achados.map((v) => (
                  <li key={v.id}>
                    <a
                      href={`#${v.id}`}
                      className="flex min-h-toque flex-col justify-center px-4 py-2 no-underline hover:bg-papel"
                    >
                      <span className="font-medium text-tinta-900">
                        {v.termo}
                        {v.nome ? (
                          <span className="font-normal text-tinta-600">
                            {" "}
                            — {v.nome}
                          </span>
                        ) : null}
                      </span>
                      <span className="text-sm text-tinta-600">{v.resumo}</span>
                      <span className="rotulo-meta">{v.secao}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-3 text-sm text-tinta-700">
              Nenhum verbete com “{termo}”. A lista completa está logo abaixo —
              e se faltar algo que você esperava encontrar, é lacuna nossa.
            </p>
          )
        ) : null}
      </div>
    </div>
  );
}
