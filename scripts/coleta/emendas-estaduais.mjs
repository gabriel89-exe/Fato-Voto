import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  RAIZ_NORMALIZADA,
  atualizarManifesto,
  gravarNormalizado,
  guardarBruto,
  hash,
  reais,
} from "./comum.mjs";

/**
 * Coleta: emendas parlamentares ESTADUAIS — deputados estaduais do ES.
 *
 * Fonte: catalogo de dados abertos do governo do estado
 * (dados.es.gov.br, um CKAN), dataset da SEFAZ "Emendas Parlamentares
 * do Estado". Sem credencial, sem limite de requisicao publicado: sao
 * seis arquivos CSV, um por ano da LOA, atualizados pelo estado com a
 * execucao em andamento.
 *
 * Roda com: npm run coleta:emendas-estaduais
 *
 * Descoberta em 02/09/2026, quando a documentacao deste projeto ainda
 * dizia que nao havia fonte para deputado estadual. Havia — so que na
 * SEFAZ, nao na ALES: emenda estadual e executada pelo governo do
 * estado, e quem publica a execucao e a Fazenda.
 *
 * ==================================================================
 * O QUE ESTA FONTE TEM QUE A FEDERAL NAO TEM: CODIGO DE AUTOR.
 *
 * Cada linha traz `CodAutor` numerico ao lado de `NomeAutor`. O
 * problema de homonimo que obrigou a coleta federal a extrair o codigo
 * de dentro do codigo da emenda nao existe aqui — mas a trava fica do
 * mesmo jeito: se um nome aparecer com dois codigos, ou um codigo com
 * dois nomes, nada e atribuido a esse nome. Conferido em 02/09/2026:
 * mapeamento 1:1 perfeito nos quatro anos da janela.
 *
 * O QUE ELA NAO TEM: pagina propria por emenda. O link de procedencia
 * aponta o dataset oficial — menos granular que o portal federal, e a
 * ficha diz isso em vez de fingir que o link leva ao registro.
 *
 * UMA LINHA NAO E UMA EMENDA. O arquivo tem uma linha por instrumento
 * de execucao (contrato, convenio, favorecido): 1.731 linhas eram
 * 1.684 emendas na leitura de 02/09/2026. `ValorPrevisto` REPETE em
 * todas as linhas da mesma emenda; empenho, liquidacao e pagamento sao
 * por linha e se somam. Contar linhas como emendas, ou somar o
 * previsto repetido, criaria exatamente o numero errado com cara de
 * certo que este projeto existe para nao publicar. A conferencia abaixo
 * prova a premissa a cada coleta.
 *
 * A FUNCAO ORCAMENTARIA E POR LINHA, nao por emenda: 86 emendas da
 * janela executam em mais de uma area. O agrupamento por area soma
 * dinheiro por linha (exato) e conta emendas distintas que tocam a
 * area — uma emenda pode contar em duas areas, e a tela declara isso.
 * ==================================================================
 */

const PACOTE =
  "https://dados.es.gov.br/api/3/action/package_show" +
  "?id=d1954c26-3303-40de-b14d-467dce97f37f";

const FONTE = {
  nome: "SEFAZ-ES — Emendas parlamentares estaduais",
  url: "https://dados.es.gov.br/dataset/portal-da-transparencia-emendas-parlamentares-do-estado",
  licenca:
    "Creative Commons Não Comercial, como declarada no catálogo estadual",
};

/**
 * A janela e a mesma da coleta federal, pelo mesmo motivo: a ficha
 * descreve o mandato atual (ALES 2023–2027), nao a carreira. Quem
 * assumiu em 2023 nao tem emenda de 2023 — a LOA de um ano e emendada
 * no ano anterior — e a ficha explica, em vez de deixar o vazio
 * parecer inercia. Ver a regra 5.
 */
const ANOS = [2023, 2024, 2025, 2026];

/** So a contagem do que existe antes da janela (LOAs 2021 e 2022). */
const ANOS_ANTERIORES = [2021, 2022];

/**
 * So e "deputado da legislatura atual" quem assina emenda em LOA
 * emendada DURANTE o mandato atual — 2024, 2025 ou 2026. A LOA 2023
 * foi emendada em 2022 inteira pela legislatura anterior: 16 dos 30
 * autores dela nem estao mais na ALES. Sem este filtro, um ex-deputado
 * candidato em 2026 ganharia aba de mandato por emendas de um mandato
 * que acabou.
 */
const ANOS_DO_MANDATO_ATUAL = [2024, 2025, 2026];

/** Quantas emendas individuais a ficha lista, das de maior valor. */
const MAIORES = 10;
/** Quantas quando nao ha valor para ordenar (espelha a federal). */
const NA_LISTA_SEM_VALOR = 20;

/* ------------------------------------------------------------------ */
/*  Leitura da fonte                                                   */
/* ------------------------------------------------------------------ */

const AGENTE =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/127.0 Safari/537.36";

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * GET de texto com a mesma paciencia de `buscarJson` (que nao serve
 * aqui porque parseia JSON e a fonte e CSV): seis tentativas com
 * espera dobrando e teto por conexao. 4xx desiste na primeira — o
 * servidor entendeu e recusou.
 */
async function baixarTexto(url, { tentativas = 6, pausaMs = 800 } = {}) {
  let ultimoErro;
  for (let i = 1; i <= tentativas; i++) {
    try {
      const resposta = await fetch(url, {
        headers: { "User-Agent": AGENTE },
        signal: AbortSignal.timeout(30000),
      });
      if (!resposta.ok) {
        const erro = new Error(`HTTP ${resposta.status} em ${url}`);
        erro.status = resposta.status;
        throw erro;
      }
      return await resposta.text();
    } catch (erro) {
      ultimoErro = erro;
      if (erro.status >= 400 && erro.status < 500 && erro.status !== 429) {
        throw erro;
      }
      if (i < tentativas) {
        const pausa = pausaMs * 2 ** (i - 1);
        console.warn(
          `  tentativa ${i} de ${tentativas} falhou (${erro.message}). ` +
            `Repetindo em ${(pausa / 1000).toFixed(1)}s.`,
        );
        await espera(pausa);
      }
    }
  }
  throw new Error(
    `${ultimoErro?.message ?? "falha"} — depois de ${tentativas} tentativas`,
  );
}

/**
 * CSV com ponto e virgula e aspas (RFC 4180). O arquivo da SEFAZ USA
 * aspas — um `split(";")` quebraria no primeiro objeto de emenda que
 * contivesse ponto e virgula no texto.
 */
function analisarCsv(texto) {
  const semBom = texto.charCodeAt(0) === 0xfeff ? texto.slice(1) : texto;
  const linhas = [];
  let campo = "";
  let linha = [];
  let dentroDeAspas = false;

  for (let i = 0; i < semBom.length; i++) {
    const c = semBom[i];
    if (dentroDeAspas) {
      if (c === '"') {
        if (semBom[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          dentroDeAspas = false;
        }
      } else {
        campo += c;
      }
    } else if (c === '"') {
      dentroDeAspas = true;
    } else if (c === ";") {
      linha.push(campo);
      campo = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && semBom[i + 1] === "\n") i++;
      linha.push(campo);
      campo = "";
      if (linha.length > 1 || linha[0] !== "") linhas.push(linha);
      linha = [];
    } else {
      campo += c;
    }
  }
  if (campo !== "" || linha.length > 0) {
    linha.push(campo);
    if (linha.length > 1 || linha[0] !== "") linhas.push(linha);
  }

  const [cabecalho, ...resto] = linhas;
  return resto.map((valores) =>
    Object.fromEntries(cabecalho.map((nome, i) => [nome, valores[i] ?? ""])),
  );
}

/** Serializa de volta, para o snapshot bruto ja sem CPF/NIS. */
function serializarCsv(registros, cabecalho) {
  const celula = (v) =>
    /[";\r\n]/.test(v ?? "") ? `"${String(v).replace(/"/g, '""')}"` : (v ?? "");
  return [
    cabecalho.join(";"),
    ...registros.map((r) => cabecalho.map((c) => celula(r[c])).join(";")),
  ].join("\n");
}

/**
 * Valor monetario da fonte: "291000,00" no arquivo da LOA, "0,0000"
 * com quatro casas nos campos de execucao. Sem separador de milhar.
 * Sinal negativo preservado — anulacao nao pode virar gasto.
 */
function valor(texto) {
  if (texto == null || texto === "") return 0;
  const numero = Number(String(texto).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(numero) ? numero : 0;
}

/**
 * Nome como chave de casamento: sem o prefixo "Dep.", sem acento, em
 * caixa alta e com espacos colapsados. "Dep. Janete de Sá" e
 * "JANETE DE SA" viram a mesma chave; "Marcos Madureira" — que a fonte
 * publica sem o prefixo — tambem entra.
 */
function normalizar(nome) {
  return String(nome ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/^DEP\.?\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * CPF e NIS sao 11 digitos e identificam pessoa fisica. Sao removidos
 * AQUI, antes de qualquer gravacao — nem o snapshot bruto os conserva,
 * como ja acontece com o CPF do TSE. CNPJ (14 digitos) fica: identifica
 * empresa ou associacao que recebeu dinheiro publico.
 */
function descartarIdentificadorPessoal(registros) {
  for (const r of registros) {
    if (/^\d{11}$/.test((r.CpfCnpjNis ?? "").trim())) {
      r.CpfCnpjNis = "";
    }
  }
  return registros;
}

/* ------------------------------------------------------------------ */
/*  Agregacao: de linhas de execucao para emendas                      */
/* ------------------------------------------------------------------ */

/**
 * Junta as linhas de uma mesma emenda. A chave e autor + ano + numero:
 * `NumeroEmenda` nao repete entre autores no mesmo ano (conferido em
 * 02/09/2026 nos quatro anos), mas a chave composta nao depende disso
 * continuar verdade.
 */
function agregarEmendas(linhas) {
  const mapa = new Map();
  for (const l of linhas) {
    const chave = `${l.CodAutor}|${l.AnoEmenda}|${l.NumeroEmenda}`;
    let e = mapa.get(chave);
    if (!e) {
      e = {
        codAutor: l.CodAutor.trim(),
        nomeAutor: l.NomeAutor.trim(),
        ano: Number(l.AnoEmenda),
        numero: l.NumeroEmenda.trim(),
        tipo: l.TipoEmenda?.trim() || null,
        municipio: l.Municipio?.trim() || null,
        regiao: l.DescricaoRegiaoBeneficiada?.trim() || null,
        objeto: l.ObjetoFinalidade?.trim() || null,
        previsto: valor(l.ValorPrevisto),
        previstoCru: l.ValorPrevisto,
        funcoes: new Set(),
        empenhado: 0,
        liquidado: 0,
        pago: 0,
        restosAPagar: 0,
        linhas: 0,
      };
      mapa.set(chave, e);
    }
    if (l.Funcao?.trim()) e.funcoes.add(l.Funcao.trim());
    e.empenhado += valor(l.ValorEmpenho);
    e.liquidado += valor(l.ValorLiquidado);
    e.pago += valor(l.ValorPago);
    e.restosAPagar += valor(l.ValorRap);
    e.linhas += 1;
    /* Prova de premissa: o previsto tem de repetir igual. */
    if (l.ValorPrevisto !== e.previstoCru) e.previstoDivergente = true;
  }
  return [...mapa.values()];
}

/** A localidade de uma emenda: municipio, ou a regiao, ou o vazio dito. */
function localidadeDe(e) {
  return e.municipio || (e.regiao ? `Região ${e.regiao}` : "Não informada");
}

/** As areas de uma emenda, como texto. Mais de uma area e dito, nao escolhido. */
function funcaoDe(e) {
  const lista = [...e.funcoes].sort((a, b) => a.localeCompare(b, "pt-BR"));
  return lista.length === 0 ? null : lista.join(" · ");
}

/* ------------------------------------------------------------------ */
/*  Conferencia da fonte                                               */
/* ------------------------------------------------------------------ */

/**
 * Mesmo contrato da coleta federal: se a fonte reprovar, nenhum VALOR
 * e publicado — quantas e para onde sim, porque vem de campos de texto
 * e de contagem. As provas daqui sao outras, porque a fonte e outra:
 *
 *   1. DOIS DOWNLOADS IDENTICOS. Cada CSV e baixado duas vezes e os
 *      bytes tem de bater. E o equivalente barato do "duas leituras
 *      concordam" da coleta federal — que pegou la um defeito real.
 *   2. O PREVISTO REPETE. `ValorPrevisto` e da emenda e aparece em
 *      cada linha dela; linhas da mesma emenda com previstos
 *      diferentes derrubam a premissa da agregacao inteira.
 *   3. PAGO NAO PASSA DE EMPENHADO, por emenda agregada. Sem piso de
 *      grandeza, pela mesma razao registrada na coleta federal: piso
 *      reprova para sempre por causa de emenda pequena verdadeira.
 */
function conferir(emendas, downloadsDivergentes) {
  const problemas = [];
  for (const arquivo of downloadsDivergentes) {
    problemas.push(
      `${arquivo}: dois downloads seguidos devolveram conteúdo diferente`,
    );
  }
  for (const e of emendas) {
    if (e.previstoDivergente) {
      problemas.push(
        `${e.numero}: linhas da mesma emenda com ValorPrevisto diferente`,
      );
    }
    if (e.empenhado > 0 && e.pago > e.empenhado * 1.0001) {
      problemas.push(
        `${e.numero}: pago (${e.pago.toFixed(2)}) maior que empenhado ` +
          `(${e.empenhado.toFixed(2)}) — impossível`,
      );
    }
  }
  return problemas;
}

/* ------------------------------------------------------------------ */
/*  Normalizacao para a ficha                                          */
/* ------------------------------------------------------------------ */

function agrupar(emendas, rotuloDe, comValores) {
  const mapa = new Map();
  for (const e of emendas) {
    const nome = rotuloDe(e);
    const atual = mapa.get(nome) ?? { quantidade: 0, empenhado: 0, pago: 0 };
    atual.quantidade += 1;
    atual.empenhado += e.empenhado;
    atual.pago += e.pago;
    mapa.set(nome, atual);
  }
  return [...mapa.entries()]
    .map(([nome, v]) => ({
      nome,
      quantidade: v.quantidade,
      empenhado: comValores ? v.empenhado : null,
      pago: comValores ? v.pago : null,
    }))
    .sort((a, b) =>
      comValores
        ? b.empenhado - a.empenhado || a.nome.localeCompare(b.nome, "pt-BR")
        : b.quantidade - a.quantidade || a.nome.localeCompare(b.nome, "pt-BR"),
    );
}

/**
 * Por area o dinheiro e somado POR LINHA de execucao, nao por emenda:
 * 86 emendas da janela executam em mais de uma area, e ratear seria
 * inventar numero. A quantidade conta emendas distintas que tocam a
 * area — pode somar mais que o total de emendas, e a tela diz isso.
 */
function porFuncao(linhasDoAutor, chavesDoPeriodo, comValores) {
  const mapa = new Map();
  for (const l of linhasDoAutor) {
    const chave = `${l.CodAutor}|${l.AnoEmenda}|${l.NumeroEmenda}`;
    if (!chavesDoPeriodo.has(chave)) continue;
    const nome = l.Funcao?.trim() || "Não informada";
    const atual =
      mapa.get(nome) ?? { emendas: new Set(), empenhado: 0, pago: 0 };
    atual.emendas.add(chave);
    atual.empenhado += valor(l.ValorEmpenho);
    atual.pago += valor(l.ValorPago);
    mapa.set(nome, atual);
  }
  return [...mapa.entries()]
    .map(([nome, v]) => ({
      nome,
      quantidade: v.emendas.size,
      empenhado: comValores ? v.empenhado : null,
      pago: comValores ? v.pago : null,
    }))
    .sort((a, b) =>
      comValores
        ? b.empenhado - a.empenhado || a.nome.localeCompare(b.nome, "pt-BR")
        : b.quantidade - a.quantidade || a.nome.localeCompare(b.nome, "pt-BR"),
    );
}

function porAno(emendas, comValores) {
  const mapa = new Map();
  for (const e of emendas) {
    const atual =
      mapa.get(e.ano) ?? { quantidade: 0, empenhado: 0, pago: 0 };
    atual.quantidade += 1;
    atual.empenhado += e.empenhado;
    atual.pago += e.pago;
    mapa.set(e.ano, atual);
  }
  return [...mapa.entries()]
    .map(([ano, v]) => ({
      ano,
      quantidade: v.quantidade,
      empenhado: comValores ? v.empenhado : null,
      pago: comValores ? v.pago : null,
    }))
    .sort((a, b) => a.ano - b.ano);
}

function normalizarEmendas(emendas, linhasDoAutor, comValores) {
  const chavesDoPeriodo = new Set(
    emendas.map((e) => `${e.codAutor}|${e.ano}|${e.numero}`),
  );

  const ordenadas = comValores
    ? [...emendas].sort(
        (a, b) =>
          b.empenhado - a.empenhado ||
          b.previsto - a.previsto ||
          a.numero.localeCompare(b.numero),
      )
    : [...emendas].sort(
        (a, b) => b.ano - a.ano || b.numero.localeCompare(a.numero),
      );

  return {
    quantidade: emendas.length,
    valoresPublicados: Boolean(comValores),
    totais: comValores
      ? {
          previsto: emendas.reduce((s, e) => s + e.previsto, 0),
          empenhado: emendas.reduce((s, e) => s + e.empenhado, 0),
          liquidado: emendas.reduce((s, e) => s + e.liquidado, 0),
          pago: emendas.reduce((s, e) => s + e.pago, 0),
          restosAPagar: emendas.reduce((s, e) => s + e.restosAPagar, 0),
        }
      : null,
    porAno: porAno(emendas, comValores),
    porFuncao: porFuncao(linhasDoAutor, chavesDoPeriodo, comValores),
    porLocalidade: agrupar(emendas, localidadeDe, comValores),
    porTipo: agrupar(emendas, (e) => e.tipo ?? "Não informado", comValores),
    criterioDaLista: comValores
      ? `as ${MAIORES} de maior valor empenhado`
      : `as ${NA_LISTA_SEM_VALOR} mais recentes`,
    lista: ordenadas
      .slice(0, comValores ? MAIORES : NA_LISTA_SEM_VALOR)
      .map((e) => ({
        numero: e.numero,
        ano: e.ano,
        tipo: e.tipo,
        localidade: localidadeDe(e),
        funcao: funcaoDe(e),
        objeto: e.objeto,
        previsto: comValores ? e.previsto : null,
        empenhado: comValores ? e.empenhado : null,
        pago: comValores ? e.pago : null,
      })),
  };
}

function mediana(numeros) {
  if (numeros.length === 0) return 0;
  const ordenados = [...numeros].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);
  return ordenados.length % 2
    ? ordenados[meio]
    : (ordenados[meio - 1] + ordenados[meio]) / 2;
}

/* ------------------------------------------------------------------ */

async function principal() {
  /*
   * O catalogo primeiro: os arquivos sao resolvidos PELO NOME no
   * dataset, nao por URL fixa. Se a SEFAZ republicar um recurso com id
   * novo, a coleta continua achando — e se um ano sumir do catalogo, o
   * erro diz qual.
   */
  const pacoteTexto = await baixarTexto(PACOTE);
  const recursos = JSON.parse(pacoteTexto).result.resources;
  const urlDoAno = new Map();
  for (const r of recursos) {
    const m = /^Emendas-Estaduais-(\d{4})\.csv$/.exec(r.name ?? "");
    if (m) urlDoAno.set(Number(m[1]), r.url);
  }

  const todosOsAnos = [...ANOS_ANTERIORES, ...ANOS];
  for (const ano of todosOsAnos) {
    if (!urlDoAno.has(ano)) {
      throw new Error(`O catálogo não tem o arquivo da LOA ${ano}.`);
    }
  }

  const proveniencias = [];
  proveniencias.push(
    await guardarBruto("emendas-estaduais/pacote.json", pacoteTexto, PACOTE),
  );

  /*
   * Download em dobro, de proposito: e a prova 1 da conferencia. Os
   * bytes ORIGINAIS se comparam em memoria; o que vai para o disco ja
   * passou pelo descarte de CPF/NIS.
   */
  const linhasPorAno = new Map();
  const downloadsDivergentes = [];
  for (const ano of todosOsAnos) {
    const url = urlDoAno.get(ano);
    console.log(`LOA ${ano}: baixando duas vezes para conferir.`);
    const primeira = await baixarTexto(url);
    const segunda = await baixarTexto(url);
    if (hash(primeira) !== hash(segunda)) {
      downloadsDivergentes.push(`LOA ${ano}`);
    }

    const registros = descartarIdentificadorPessoal(analisarCsv(primeira));
    linhasPorAno.set(ano, registros);

    const cabecalho = Object.keys(registros[0] ?? {});
    proveniencias.push(
      await guardarBruto(
        `emendas-estaduais/loa-${ano}.csv`,
        serializarCsv(registros, cabecalho),
        url,
      ),
    );
  }

  /* ---------------- Travas de identidade ---------------- */

  const linhasDaJanela = ANOS.flatMap((ano) => linhasPorAno.get(ano));

  /* Um nome, um codigo — e vice-versa. Igual a trava federal. */
  const nomesDoCodigo = new Map();
  const codigosDoNome = new Map();
  for (const l of linhasDaJanela) {
    const cod = l.CodAutor.trim();
    const nome = normalizar(l.NomeAutor);
    if (!nomesDoCodigo.has(cod)) nomesDoCodigo.set(cod, new Set());
    nomesDoCodigo.get(cod).add(nome);
    if (!codigosDoNome.has(nome)) codigosDoNome.set(nome, new Set());
    codigosDoNome.get(nome).add(cod);
  }
  const ambiguos = new Set();
  for (const [cod, nomes] of nomesDoCodigo) {
    if (nomes.size > 1) for (const n of nomes) ambiguos.add(n);
  }
  for (const [nome, codigos] of codigosDoNome) {
    if (codigos.size > 1) ambiguos.add(nome);
  }

  /*
   * A legislatura atual: quem assina emenda em LOA emendada durante o
   * mandato (2024–2026). Ver o comentario de ANOS_DO_MANDATO_ATUAL.
   */
  const autoresDoMandato = new Set(
    ANOS_DO_MANDATO_ATUAL.flatMap((ano) =>
      linhasPorAno.get(ano).map((l) => l.CodAutor.trim()),
    ),
  );

  /* ---------------- Agregacao e conferencia ---------------- */

  const emendasDaJanela = agregarEmendas(linhasDaJanela).filter((e) =>
    autoresDoMandato.has(e.codAutor),
  );
  const emendasAnteriores = agregarEmendas(
    ANOS_ANTERIORES.flatMap((ano) => linhasPorAno.get(ano)),
  );

  const problemas = conferir(emendasDaJanela, downloadsDivergentes);
  const conferencia = {
    aprovada: problemas.length === 0,
    conferidoEm: new Date().toISOString(),
    provas: [
      "cada arquivo é baixado duas vezes, e os dois downloads têm de ser idênticos",
      "o valor previsto da emenda repete igual em todas as linhas dela",
      "valor pago não passa do valor empenhado",
    ],
    problemas: problemas.slice(0, 20),
    totalDeProblemas: problemas.length,
  };

  /* ---------------- Casamento com as candidaturas ---------------- */

  const candidaturas = JSON.parse(
    await readFile(join(RAIZ_NORMALIZADA, "candidaturas-2026.json"), "utf8"),
  ).candidaturas;

  const porUrna = new Map();
  const porNomeCompleto = new Map();
  for (const c of candidaturas) {
    const urna = normalizar(c.nomeUrna);
    porUrna.set(urna, [...(porUrna.get(urna) ?? []), c]);
    const civil = normalizar(c.nomeCompleto);
    porNomeCompleto.set(civil, [...(porNomeCompleto.get(civil) ?? []), c]);
  }

  /*
   * Nome parlamentar contra nome de urna, com desistencia na menor
   * duvida — mesma postura de `obterMandato` na tela. So liga quando
   * ha exatamente UMA candidatura com aquele nome; nome que nao casa
   * fica registrado em `semCasamento`, para a lacuna ser auditavel em
   * vez de silenciosa.
   */
  const autores = new Map();
  for (const e of emendasDaJanela) {
    const chave = normalizar(e.nomeAutor);
    if (!autores.has(chave)) {
      autores.set(chave, {
        nomeAutorNaFonte: e.nomeAutor,
        codigoAutor: e.codAutor,
        emendas: [],
      });
    }
    autores.get(chave).emendas.push(e);
  }

  const linhasDoAutorNaJanela = new Map();
  for (const l of linhasDaJanela) {
    const cod = l.CodAutor.trim();
    if (!linhasDoAutorNaJanela.has(cod)) linhasDoAutorNaJanela.set(cod, []);
    linhasDoAutorNaJanela.get(cod).push(l);
  }

  const parlamentares = [];
  const semCasamento = [];

  for (const [chave, autor] of autores) {
    if (ambiguos.has(chave)) {
      semCasamento.push({
        nomeAutorNaFonte: autor.nomeAutorNaFonte,
        codigoAutor: null,
        motivo: "a fonte tem este nome com mais de um código de autor",
      });
      continue;
    }

    const candidatas =
      porUrna.get(chave) ?? porNomeCompleto.get(chave) ?? [];
    if (candidatas.length !== 1) {
      semCasamento.push({
        nomeAutorNaFonte: autor.nomeAutorNaFonte,
        codigoAutor: autor.codigoAutor,
        motivo:
          candidatas.length === 0
            ? "nenhuma candidatura de 2026 tem este nome"
            : "mais de uma candidatura de 2026 tem este nome",
      });
      continue;
    }

    const c = candidatas[0];
    const foraDoPeriodo = emendasAnteriores.filter(
      (e) => e.codAutor === autor.codigoAutor,
    ).length;

    parlamentares.push({
      idCandidatura: c.id,
      cargoEmDisputa: c.cargo,
      nomeUrna: c.nomeUrna,
      nomeAutorNaFonte: autor.nomeAutorNaFonte,
      codigoAutor: autor.codigoAutor,
      foraDoPeriodo,
      emendas: normalizarEmendas(
        autor.emendas,
        linhasDoAutorNaJanela.get(autor.codigoAutor) ?? [],
        conferencia.aprovada,
      ),
    });
  }

  parlamentares.sort((a, b) => a.nomeUrna.localeCompare(b.nomeUrna, "pt-BR"));
  semCasamento.sort((a, b) =>
    a.nomeAutorNaFonte.localeCompare(b.nomeAutorNaFonte, "pt-BR"),
  );

  /*
   * Regra 4: o denominador e a bancada INTEIRA da janela — todos os
   * autores do mandato atual, casados com candidatura ou nao. Mediana
   * so dos que viraram ficha subestimaria a base da comparacao.
   */
  const totaisDaBancada = [...autores.values()]
    .filter((a) => !ambiguos.has(normalizar(a.nomeAutorNaFonte)))
    .map((a) => a.emendas.reduce((s, e) => s + e.empenhado, 0));
  const referencia = conferencia.aprovada
    ? {
        bancada: totaisDaBancada.length,
        medianaEmpenhado: mediana(totaisDaBancada),
        menor: totaisDaBancada.length ? Math.min(...totaisDaBancada) : 0,
        maior: totaisDaBancada.length ? Math.max(...totaisDaBancada) : 0,
      }
    : null;

  await atualizarManifesto("emendas-estaduais", proveniencias);
  await gravarNormalizado("emendas-estaduais.json", {
    fonte: FONTE,
    uf: "ES",
    anos: ANOS,
    coletadoEm: new Date().toISOString(),
    recorte:
      "Emendas ao Orçamento do Espírito Santo cujo autor individual é " +
      "deputado estadual da legislatura atual da ALES (2023–2027) e " +
      "candidato em 2026. A LOA de um ano é emendada no ano anterior: a de " +
      "2023 foi emendada pela legislatura anterior, e só aparece para quem " +
      "já era deputado. Emenda de bancada e de comissão não tem autor " +
      "individual e não entra. O casamento com a candidatura é por nome, " +
      "com desistência em qualquer ambiguidade — os nomes que não casaram " +
      "estão listados no dado.",
    conferencia,
    referencia,
    parlamentares,
    semCasamento,
  });

  const nota = conferencia.aprovada
    ? (p) =>
        `${p.emendas.quantidade} emendas, ${reais(p.emendas.totais.empenhado)} empenhados`
    : (p) => `${p.emendas.quantidade} emendas, sem valor (fonte reprovada)`;
  for (const p of parlamentares) {
    console.log(`  ${p.nomeUrna.padEnd(24)} ${nota(p)}`);
  }
  for (const s of semCasamento) {
    console.log(`  ${s.nomeAutorNaFonte.padEnd(24)} SEM FICHA — ${s.motivo}`);
  }

  if (!conferencia.aprovada) {
    console.error(
      `\nCONFERÊNCIA REPROVADA — ${problemas.length} inconsistências na fonte.`,
    );
    for (const problema of problemas.slice(0, 10)) {
      console.error("  ✗ " + problema);
    }
    console.error(
      "\nNenhum VALOR foi publicado — quantas e para onde, sim.",
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `\n${proveniencias.length} arquivos brutos guardados. ` +
      `${parlamentares.length} fichas com emendas estaduais e ` +
      `${semCasamento.length} autores sem casamento, ` +
      "em data/es/emendas-estaduais.json.",
  );
}

principal().catch((erro) => {
  console.error("\nColeta de emendas estaduais falhou:", erro.message);
  process.exitCode = 1;
});
