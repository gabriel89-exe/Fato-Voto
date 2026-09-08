import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  RAIZ_NORMALIZADA,
  atualizarManifesto,
  baixarTexto,
  gravarNormalizado,
  guardarBruto,
} from "./comum.mjs";

/**
 * Coleta: presenca em plenario dos deputados federais do ES.
 *
 * ==================================================================
 * ESTA FONTE E HTML, E ISSO FOI UMA CORRECAO DE ROTA.
 *
 * Em 07/09/2026 eu disse que presenca nao dava para publicar porque a
 * API da Camara nao entrega a JUSTIFICATIVA da ausencia — e sem separar
 * licenca medica de falta, "compareceu a 140 de 200" vira acusacao, nao
 * fato. A conclusao sobre a API estava certa. A conclusao sobre o
 * projeto estava errada: a Camara publica exatamente esses numeros na
 * pagina de cada deputado, em HTML servido pelo servidor.
 *
 *   https://www.camara.leg.br/deputados/{id}/presenca-plenario/{ano}
 *
 * Sao seis totais por ano, e sao os da propria Casa — inclusive a
 * separacao entre ausencia justificada e nao justificada, que e o que
 * torna o dado publicavel sem virar placar.
 *
 * O rodape da pagina traz duas ressalvas que a ficha repete, porque sem
 * elas o numero engana:
 *
 *   - a contagem segue o Ato da Mesa n. 191 de 2017;
 *   - so conta o PERIODO DE EXERCICIO do mandato. Quem assumiu no meio
 *     do ano nao aparece como faltoso pelos meses em que nao era
 *     deputado.
 *
 * PRECO DE SER HTML: raspagem quebra quando a pagina muda de forma. O
 * extrator abaixo falha ALTO — se um rotulo sumir, a coleta reprova e
 * nao publica, em vez de gravar zero e deixar a ficha dizer que a
 * pessoa faltou a tudo. Zero silencioso aqui seria calunia.
 * ==================================================================
 *
 * Roda com: npm run coleta:presenca
 */

const PAGINA = "https://www.camara.leg.br/deputados";
const ANOS = [2023, 2024, 2025, 2026];

const FONTE = {
  nome: "Câmara dos Deputados — Presença em plenário",
  url: "https://www.camara.leg.br/deputados",
  licenca: "Dados abertos, uso livre com citação da fonte",
};

/**
 * Os seis totais, pelo rotulo com que a Camara os escreve.
 *
 * Casados por PREFIXO porque o rotulo carrega asterisco de nota de
 * rodape em alguns e nao em outros, e o asterisco muda de lugar.
 */
const ROTULOS = {
  sessoes: "Total de sessões deliberativas com Ordem do Dia iniciada",
  ausenciasNaoJustificadas:
    "Total de ausências não justificadas em sessões deliberativas com Ordem do Dia iniciada",
  dias: "Total de dias com sessões deliberativas realizadas no período",
  diasComPresenca: "Total de dias com presença nas sessões deliberativas",
  diasJustificados:
    "Total de dias com ausências justificadas em sessões deliberativas",
  diasNaoJustificados:
    "Total de dias com ausências não justificadas em sessões deliberativas",
};

/* ------------------------------------------------------------------ */

/** Achata o HTML em pedacos de texto, na ordem em que aparecem. */
function pedacos(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, "|")
    .replace(/&nbsp;/g, " ")
    .replace(/\|{2,}/g, "|")
    .split("|")
    .map((x) => x.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/**
 * Le os seis totais de uma pagina.
 *
 * Devolve `null` em qualquer rotulo que nao encontrar. Quem chama trata
 * `null` como reprovacao — nunca como zero.
 */
function extrair(html) {
  const partes = pedacos(html);
  const saida = {};

  for (const [chave, rotulo] of Object.entries(ROTULOS)) {
    const i = partes.findIndex((p) => p.startsWith(rotulo));
    if (i < 0) {
      saida[chave] = null;
      continue;
    }
    /* O numero vem logo depois do rotulo; a porcentagem vem em seguida
       e e descartada — ela e derivavel e guardar derivado convida a
       divergencia. */
    const numero = partes.slice(i + 1, i + 3).find((p) => /^\d+$/.test(p));
    saida[chave] = numero === undefined ? null : Number(numero);
  }
  return saida;
}

/** O que ha de impossivel neste ano. Vazio = nada. */
function implausibilidades(nome, ano, d) {
  const problemas = [];

  for (const [chave, valor] of Object.entries(d)) {
    if (valor === null) {
      problemas.push(
        `${nome} ${ano}: o rótulo "${ROTULOS[chave]}" não foi encontrado na ` +
          "página — a Câmara pode ter mudado o formato",
      );
    }
  }
  if (problemas.length > 0) return problemas;

  if (d.diasComPresenca > d.dias) {
    problemas.push(
      `${nome} ${ano}: dias com presença (${d.diasComPresenca}) maior que ` +
        `dias com sessão (${d.dias}) — impossível`,
    );
  }
  if (d.diasJustificados + d.diasNaoJustificados > d.dias) {
    problemas.push(
      `${nome} ${ano}: ausências (${d.diasJustificados} + ` +
        `${d.diasNaoJustificados}) passam do total de dias (${d.dias})`,
    );
  }
  return problemas;
}

/* ------------------------------------------------------------------ */

async function principal() {
  const arquivo = JSON.parse(
    await readFile(join(RAIZ_NORMALIZADA, "deputados-federais.json"), "utf8"),
  );
  const bancada = arquivo.parlamentares;

  console.log(
    `Coletando presença em plenário de ${bancada.length} deputados, ` +
      `anos ${ANOS[0]}–${ANOS.at(-1)}.`,
  );

  const proveniencias = [];
  const problemas = [];
  const saida = [];

  for (const p of bancada) {
    const porAno = [];

    for (const ano of ANOS) {
      const url = `${PAGINA}/${p.idExterno}/presenca-plenario/${ano}`;
      const html = await baixarTexto(url);

      proveniencias.push(
        await guardarBruto(
          `camara/presenca-${p.idExterno}-${ano}.html`,
          html,
          url,
        ),
      );

      const d = extrair(html);
      problemas.push(...implausibilidades(p.nomeUrna, ano, d));

      /*
       * Ano sem sessao nenhuma nao entra: acontece com quem ainda nao
       * era deputado. Zero de 0 dias nao e informacao, e mostrar a
       * linha faria parecer que houve ano de mandato vazio.
       */
      if (d.dias) porAno.push({ ano, ...d });
    }

    const totais = porAno.reduce(
      (acc, a) => ({
        sessoes: acc.sessoes + a.sessoes,
        ausenciasNaoJustificadas:
          acc.ausenciasNaoJustificadas + a.ausenciasNaoJustificadas,
        dias: acc.dias + a.dias,
        diasComPresenca: acc.diasComPresenca + a.diasComPresenca,
        diasJustificados: acc.diasJustificados + a.diasJustificados,
        diasNaoJustificados: acc.diasNaoJustificados + a.diasNaoJustificados,
      }),
      {
        sessoes: 0,
        ausenciasNaoJustificadas: 0,
        dias: 0,
        diasComPresenca: 0,
        diasJustificados: 0,
        diasNaoJustificados: 0,
      },
    );

    saida.push({
      id: p.id,
      idExterno: p.idExterno,
      nomeUrna: p.nomeUrna,
      totais,
      porAno,
      paginaOficial: `${PAGINA}/${p.idExterno}/presenca-plenario/${ANOS.at(-1)}`,
    });

    console.log(
      `  ${p.nomeUrna.padEnd(22)} ${totais.diasComPresenca} de ${totais.dias} ` +
        `dias · ${totais.diasJustificados} justificadas · ` +
        `${totais.diasNaoJustificados} não justificadas`,
    );
  }

  const conferencia = {
    aprovada: problemas.length === 0,
    conferidoEm: new Date().toISOString(),
    provas: [
      "os seis rótulos da Câmara foram encontrados em todas as páginas",
      "dias com presença não passam do total de dias com sessão",
      "a soma das ausências não passa do total de dias",
    ],
    problemas: problemas.slice(0, 20),
    totalDeProblemas: problemas.length,
  };

  await atualizarManifesto("presenca-camara", proveniencias);
  await gravarNormalizado("presenca-camara.json", {
    fonte: FONTE,
    uf: "ES",
    anos: ANOS,
    coletadoEm: new Date().toISOString(),
    recorte:
      "Presença em sessões deliberativas do plenário da Câmara, na legislatura " +
      "57. A contagem é da própria Casa, segue o Ato da Mesa n. 191 de 2017 e " +
      "considera apenas o período de exercício do mandato — quem assumiu no " +
      "meio do período não é contado como ausente antes disso.",
    conferencia,
    parlamentares: saida.sort((a, b) =>
      a.nomeUrna.localeCompare(b.nomeUrna, "pt-BR"),
    ),
  });

  if (!conferencia.aprovada) {
    console.error(
      `\nCONFERÊNCIA REPROVADA — ${problemas.length} problemas.`,
    );
    for (const problema of problemas.slice(0, 10)) {
      console.error("  ✗ " + problema);
    }
    console.error(
      "\nNada foi publicado. Raspagem de HTML quebra quando a página muda de " +
        "forma, e gravar zero em silêncio faria a ficha dizer que a pessoa " +
        "faltou a tudo. Conferir o extrator contra a página.",
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `\n${proveniencias.length} páginas guardadas. ` +
      `${saida.length} deputados em data/es/presenca-camara.json.`,
  );
}

principal().catch((erro) => {
  console.error("\nColeta de presença falhou:", erro.message);
  process.exitCode = 1;
});
