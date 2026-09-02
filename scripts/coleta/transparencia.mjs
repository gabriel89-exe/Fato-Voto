import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  RAIZ_NORMALIZADA,
  atualizarManifesto,
  buscarJson,
  gravarNormalizado,
  guardarBruto,
  reais,
} from "./comum.mjs";

/**
 * Coleta: emendas parlamentares dos parlamentares do ES.
 *
 * Fonte: API do Portal da Transparencia. E a UNICA fonte de emendas, e
 * a unica do projeto que exige credencial. O token vai no cabecalho
 * `chave-api-dados`, sai de `TRANSPARENCIA_TOKEN` e NAO tem prefixo
 * `NEXT_PUBLIC_` — esse prefixo embutiria o valor no pacote servido ao
 * navegador sem nada quebrar. Ver docs/segredos-e-credenciais.md.
 *
 * Roda com: npm run coleta:transparencia
 *
 * ==================================================================
 * O PROBLEMA DESTA FONTE: ELA IDENTIFICA O AUTOR POR NOME.
 *
 * Nao ha identificador de parlamentar na resposta. Pior: o filtro
 * `nomeAutor` casa por CONTEUDO, nao por igualdade — `nomeAutor=NETO`
 * devolve emendas de oito pessoas diferentes, entre elas DOMINGOS NETO
 * e AMARO NETO. Aceitar o que a API devolve seria atribuir gasto
 * publico a quem nao o destinou, que e o erro mais grave que este site
 * pode cometer.
 *
 * Duas travas, nesta ordem:
 *
 *   1. IGUALDADE DE NOME, conferida aqui e nao na API. So entra a
 *      emenda cujo `autor` normalizado e exatamente o nome do
 *      parlamentar.
 *
 *   2. CODIGO DE AUTOR, que a fonte nao publica em campo proprio mas
 *      carrega dentro do codigo da emenda: os 12 digitos sao
 *      ano(4) + autor(4) + numero(4). "202539120004" e a emenda 0004
 *      de 2025 do autor 3912. Se um mesmo nome aparecer com dois
 *      codigos de autor, ha homonimo — e a coleta NAO atribui nada a
 *      essa pessoa, registra a ambiguidade e a ficha diz que a fonte
 *      nao permite separar. Preferir o silencio ao numero errado.
 *
 * Em 01/09/2026 os treze nomes do ES eram unicos entre os deputados
 * das legislaturas 55, 56 e 57 e entre os senadores em exercicio.
 * Isso vale para hoje, nao para sempre: a trava 2 existe justamente
 * para o dia em que deixar de valer.
 * ==================================================================
 */

const API = "https://api.portaldatransparencia.gov.br/api-de-dados";
const UF = "ES";

/**
 * Legislatura 57. A mesma janela da coleta da Camara, para a ficha nao
 * misturar mandato atual com mandato anterior. Helder Salomao tem
 * emenda desde 2016 e Magno Malta desde 2015; nada disso e do mandato
 * que a ficha descreve.
 */
const ANOS = [2023, 2024, 2025, 2026];

const FONTE = {
  nome: "Portal da Transparência — Emendas parlamentares",
  url: "https://portaldatransparencia.gov.br/emendas",
  licenca: "Dados abertos, uso livre com citação da fonte",
};

/** Quantas emendas individuais a ficha lista, das de maior valor. */
const MAIORES = 10;

const TOKEN = process.env.TRANSPARENCIA_TOKEN;

/* ------------------------------------------------------------------ */
/*  Leitura da fonte                                                   */
/* ------------------------------------------------------------------ */

/** A API casa nome sem acento: "HELDER SALOMÃO" devolve zero. */
function normalizar(nome) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

/**
 * Valor monetario da fonte, que vem como texto no formato brasileiro e
 * pode ser NEGATIVO com espaco depois do sinal: "- 26.002,00" e um
 * empenho anulado. Descartar o sinal transformaria anulacao em gasto.
 */
function valor(texto) {
  if (texto == null) return 0;
  const limpo = String(texto)
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const numero = Number(limpo);
  return Number.isFinite(numero) ? numero : 0;
}

/** ano(4) + autor(4) + numero(4). Ver o cabecalho do arquivo. */
function codigoDoAutor(codigoEmenda) {
  const so = String(codigoEmenda ?? "").replace(/\D/g, "");
  return so.length === 12 ? so.slice(4, 8) : null;
}

/**
 * Pagina a consulta de emendas de um autor.
 *
 * A API devolve 15 itens por pagina e nao informa total: a ultima
 * pagina e a que vem incompleta. O teto de paginas evita laco infinito
 * se a fonte mudar esse contrato.
 */
async function coletarDoAutor(nomeAutor, proveniencias) {
  const emendas = [];
  for (let pagina = 1; pagina <= 40; pagina += 1) {
    const url = `${API}/emendas?${new URLSearchParams({ nomeAutor, pagina })}`;
    const { texto, dados } = await buscarJson(url, {
      cabecalhos: { "chave-api-dados": TOKEN },
    });

    if (proveniencias) {
      proveniencias.push(
        await guardarBruto(
          `transparencia/emendas-${nomeAutor.replace(/\W+/g, "-").toLowerCase()}-p${pagina}.json`,
          texto,
          url,
        ),
      );
    }

    const lote = Array.isArray(dados) ? dados : [];
    emendas.push(...lote);
    if (lote.length < 15) break;
  }
  return emendas;
}

/* ------------------------------------------------------------------ */
/*  Conferencia da fonte                                               */
/* ------------------------------------------------------------------ */

/**
 * ==================================================================
 * POR QUE ESTA COLETA CONFERE A FONTE ANTES DE PUBLICAR
 *
 * Em 01/09/2026 a API do Portal da Transparencia devolveu valor
 * monetario DIVIDIDO POR 10.000, de forma intermitente e por campo.
 * Na mesma resposta, para a emenda 202539120004:
 *
 *   valorEmpenhado: "25,00"        <- a pagina publica diz R$ 250.000,00
 *   valorPago:      "245.000,00"   <- correto
 *
 * Duas coletas com dez minutos de diferenca deram totais diferentes
 * para o mesmo conjunto de emendas: Da Vitoria saiu R$ 138.842.404 na
 * primeira e R$ 109.445.344 na segunda, porque parte dos campos veio
 * encolhida na segunda.
 *
 * Numero errado com cara de numero certo e o pior resultado possivel
 * para este projeto: ele nao quebra nada, nao aparece em log, e vai
 * para a tela ao lado de um selo de "dado oficial". Entao a coleta
 * confere, e se a conferencia reprova, ela NAO publica — grava o
 * veredito, e a ficha diz que a fonte esta inconsistente.
 *
 * Tres provas, todas baratas:
 *
 *   1. DUAS PASSADAS. A mesma consulta, duas vezes. Se o mesmo codigo
 *      de emenda vier com valor diferente, a fonte esta instavel.
 *   2. PAGO NAO PASSA DE EMPENHADO. E impossivel pagar o que nao foi
 *      empenhado. Foi o que pegou o caso acima.
 *   3. PISO DE GRANDEZA. Emenda individual federal na casa das dezenas
 *      de reais nao existe; o piso pratico e a casa dos milhares. Um
 *      punhado delas abaixo de R$ 1.000 e o rastro do valor encolhido.
 * ==================================================================
 */

const PISO_PLAUSIVEL = 1000;
const CAMPOS = [
  "valorEmpenhado",
  "valorLiquidado",
  "valorPago",
  "valorRestoInscrito",
  "valorRestoCancelado",
  "valorRestoPago",
];

function conferir(porAutor, porAutorSegundaPassada) {
  const problemas = [];

  for (const [nome, emendas] of porAutor) {
    const segunda = new Map(
      (porAutorSegundaPassada.get(nome) ?? []).map((e) => [e.codigoEmenda, e]),
    );

    for (const e of emendas) {
      const outra = segunda.get(e.codigoEmenda);

      /* 1. Duas passadas. */
      if (outra) {
        for (const campo of CAMPOS) {
          if (String(e[campo]) !== String(outra[campo])) {
            problemas.push(
              `${e.codigoEmenda}: ${campo} veio "${e[campo]}" numa consulta e ` +
                `"${outra[campo]}" na seguinte`,
            );
          }
        }
      } else {
        problemas.push(
          `${e.codigoEmenda}: apareceu numa consulta e sumiu na seguinte`,
        );
      }

      /* 2. Pago nao passa de empenhado. */
      const empenhado = valor(e.valorEmpenhado);
      const pago = valor(e.valorPago);
      if (empenhado > 0 && pago > empenhado * 1.0001) {
        problemas.push(
          `${e.codigoEmenda}: pago (${e.valorPago}) maior que empenhado ` +
            `(${e.valorEmpenhado}) — impossível`,
        );
      }

      /* 3. Piso de grandeza. */
      if (empenhado > 0 && empenhado < PISO_PLAUSIVEL) {
        problemas.push(
          `${e.codigoEmenda}: empenhado de ${e.valorEmpenhado} está abaixo do ` +
            `piso plausível de R$ ${PISO_PLAUSIVEL} para emenda individual federal`,
        );
      }
    }
  }

  return problemas;
}

/* ------------------------------------------------------------------ */
/*  Normalizacao                                                       */
/* ------------------------------------------------------------------ */

function somar(emendas, campo) {
  return emendas.reduce((soma, e) => soma + valor(e[campo]), 0);
}

/**
 * Agrupa por um campo de texto e ordena por valor empenhado.
 *
 * A ordem e decrescente porque a lista descreve para onde foi mais
 * dinheiro, dentro dos dados de UMA pessoa. Ordenar o que uma pessoa
 * fez nao e ranquear pessoas — a regra 1 fala de comparacao entre
 * candidaturas, e nada aqui compara.
 */
function agrupar(emendas, chave) {
  const mapa = new Map();
  for (const e of emendas) {
    const nome = (e[chave] ?? "").trim() || "Não informado";
    const atual = mapa.get(nome) ?? { quantidade: 0, empenhado: 0, pago: 0 };
    atual.quantidade += 1;
    atual.empenhado += valor(e.valorEmpenhado);
    atual.pago += valor(e.valorPago);
    mapa.set(nome, atual);
  }
  return [...mapa.entries()]
    .map(([nome, v]) => ({ nome, ...v }))
    .sort((a, b) => b.empenhado - a.empenhado || a.nome.localeCompare(b.nome, "pt-BR"));
}

function porAno(emendas) {
  const mapa = new Map();
  for (const e of emendas) {
    const ano = Number(e.ano);
    const atual = mapa.get(ano) ?? { quantidade: 0, empenhado: 0, pago: 0 };
    atual.quantidade += 1;
    atual.empenhado += valor(e.valorEmpenhado);
    atual.pago += valor(e.valorPago);
    mapa.set(ano, atual);
  }
  return [...mapa.entries()]
    .map(([ano, v]) => ({ ano, ...v }))
    .sort((a, b) => a.ano - b.ano);
}

/**
 * O link leva a emenda, nao a lista de emendas.
 *
 * `/emendas/detalhe?codigoEmenda=` abre a pagina daquela emenda, com
 * autor, valores e classificacao orcamentaria. Conferido no navegador
 * em 01/09/2026: a pagina responde e traz o codigo pedido. Ver a regra
 * 6 de docs/principios.md.
 */
function paginaDaEmenda(codigoEmenda) {
  return `https://portaldatransparencia.gov.br/emendas/detalhe?codigoEmenda=${codigoEmenda}`;
}

function normalizarEmendas(emendas) {
  return {
    quantidade: emendas.length,
    totais: {
      empenhado: somar(emendas, "valorEmpenhado"),
      liquidado: somar(emendas, "valorLiquidado"),
      pago: somar(emendas, "valorPago"),
      restosInscritos: somar(emendas, "valorRestoInscrito"),
      restosCancelados: somar(emendas, "valorRestoCancelado"),
      restosPagos: somar(emendas, "valorRestoPago"),
    },
    porAno: porAno(emendas),
    porFuncao: agrupar(emendas, "funcao"),
    porLocalidade: agrupar(emendas, "localidadeDoGasto"),
    porTipo: agrupar(emendas, "tipoEmenda"),
    maiores: [...emendas]
      .sort(
        (a, b) =>
          valor(b.valorEmpenhado) - valor(a.valorEmpenhado) ||
          String(a.codigoEmenda).localeCompare(String(b.codigoEmenda)),
      )
      .slice(0, MAIORES)
      .map((e) => ({
        codigo: String(e.codigoEmenda),
        ano: Number(e.ano),
        numero: e.numeroEmenda ?? null,
        tipo: e.tipoEmenda ?? null,
        localidade: e.localidadeDoGasto ?? null,
        funcao: e.funcao ?? null,
        subfuncao: e.subfuncao ?? null,
        empenhado: valor(e.valorEmpenhado),
        liquidado: valor(e.valorLiquidado),
        pago: valor(e.valorPago),
        paginaOficial: paginaDaEmenda(e.codigoEmenda),
      })),
  };
}

/** Vazio com a mesma forma do cheio: a tela nao precisa de dois casos. */
function semEmendas() {
  return normalizarEmendas([]);
}

function mediana(numeros) {
  if (numeros.length === 0) return 0;
  const ordenados = [...numeros].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);
  return ordenados.length % 2
    ? ordenados[meio]
    : (ordenados[meio - 1] + ordenados[meio]) / 2;
}

/**
 * Denominador por cargo. Regra 4: total nenhum vai sozinho a tela.
 *
 * Separado por cargo de proposito — deputado e senador tem cota de
 * emenda de tamanho diferente, e uma mediana unica das duas coisas
 * descreveria mal as duas.
 */
function referenciaDe(entradas) {
  const valores = entradas.map((p) => p.emendas.totais.empenhado);
  return {
    bancada: entradas.length,
    medianaEmpenhado: mediana(valores),
    menor: valores.length ? Math.min(...valores) : 0,
    maior: valores.length ? Math.max(...valores) : 0,
  };
}

/* ------------------------------------------------------------------ */

async function lerParlamentares() {
  const ler = async (arquivo) =>
    JSON.parse(await readFile(join(RAIZ_NORMALIZADA, arquivo), "utf8"));

  const camara = await ler("deputados-federais.json");
  const senado = await ler("senadores.json");

  return [
    ...camara.parlamentares.map((p) => ({
      id: p.id,
      cargo: "Deputado Federal",
      nomeUrna: p.nomeUrna,
      partido: p.partido ?? null,
    })),
    ...senado.senadores.map((p) => ({
      id: p.id,
      cargo: "Senador",
      nomeUrna: p.nomeUrna,
      partido: p.partido ?? null,
    })),
  ];
}

async function principal() {
  if (!TOKEN) {
    throw new Error(
      "TRANSPARENCIA_TOKEN não está no ambiente. Na máquina ele vive em " +
        ".env.local (fora do git); no CI, como secret do repositório. " +
        "Ver docs/segredos-e-credenciais.md.",
    );
  }

  const proveniencias = [];
  const parlamentares = await lerParlamentares();
  console.log(
    `Coletando emendas de ${parlamentares.length} parlamentares do ${UF}, ` +
      `anos ${ANOS[0]}–${ANOS.at(-1)}.`,
  );

  /* Primeira passada: é a que vira dado e a que guarda o bruto. */
  const primeira = new Map();
  for (const p of parlamentares) {
    const alvo = normalizar(p.nomeUrna);
    primeira.set(alvo, await coletarDoAutor(alvo, proveniencias));
  }

  /* Segunda passada: só confere. Não guarda bruto — seria o mesmo
     arquivo duas vezes, e o que interessa dela é a divergência. */
  console.log("Conferindo a fonte com uma segunda consulta...");
  const segunda = new Map();
  for (const p of parlamentares) {
    const alvo = normalizar(p.nomeUrna);
    segunda.set(alvo, await coletarDoAutor(alvo, null));
  }

  const problemas = conferir(primeira, segunda);

  const conferencia = {
    aprovada: problemas.length === 0,
    conferidoEm: new Date().toISOString(),
    /* O que foi testado, dito no dado: quem ler o JSON sem passar pelo
       site precisa saber que houve conferência e qual. */
    provas: [
      "duas consultas seguidas devolvem o mesmo valor para a mesma emenda",
      "valor pago não passa do valor empenhado",
      `valor empenhado não fica abaixo de R$ ${PISO_PLAUSIVEL}`,
    ],
    problemas: problemas.slice(0, 20),
    totalDeProblemas: problemas.length,
  };

  const saida = [];

  for (const p of parlamentares) {
    const alvo = normalizar(p.nomeUrna);
    const brutas = primeira.get(alvo) ?? [];

    /* Trava 1: igualdade de nome. O filtro da API casa por conteúdo. */
    const doAutor = brutas.filter((e) => normalizar(e.autor ?? "") === alvo);

    /* Trava 2: um nome, um código de autor. Ver o cabeçalho. */
    const codigos = [
      ...new Set(
        doAutor.map((e) => codigoDoAutor(e.codigoEmenda)).filter(Boolean),
      ),
    ].sort();

    const ambiguo = codigos.length > 1;
    const noPeriodo = doAutor.filter((e) => ANOS.includes(Number(e.ano)));

    /*
     * Trava 3: a fonte reprovou na conferência. Nenhum valor dela vai
     * para a tela — nem os das emendas que passariam, porque não há
     * como saber quais passariam. Ver o cabeçalho da conferência.
     */
    const publicavel = conferencia.aprovada && !ambiguo;

    const registro = {
      id: p.id,
      cargo: p.cargo,
      nomeUrna: p.nomeUrna,
      nomeAutorNaFonte: alvo,
      codigoAutor: codigos.length === 1 ? codigos[0] : null,
      /*
       * Homônimo: a fonte não permite separar as duas pessoas, então
       * nada é atribuído. Um número errado aqui seria pior que a
       * ausência dele — e a ficha diz o que aconteceu.
       */
      ambiguidadeDeHomonimo: ambiguo ? codigos : null,
      /* O que existe fora da janela da legislatura, só como contagem. */
      foraDoPeriodo: doAutor.length - noPeriodo.length,
      emendas: publicavel ? normalizarEmendas(noPeriodo) : semEmendas(),
    };

    saida.push(registro);

    const nota = ambiguo
      ? `AMBÍGUO — ${codigos.length} códigos de autor, nada atribuído`
      : conferencia.aprovada
        ? `${registro.emendas.quantidade} emendas, ${reais(registro.emendas.totais.empenhado)} empenhados`
        : `${noPeriodo.length} emendas na fonte, nada publicado (fonte reprovada)`;
    console.log(`  ${p.nomeUrna.padEnd(22)} ${nota}`);
  }

  const referencias = conferencia.aprovada
    ? {
        "Deputado Federal": referenciaDe(
          saida.filter(
            (p) => p.cargo === "Deputado Federal" && !p.ambiguidadeDeHomonimo,
          ),
        ),
        Senador: referenciaDe(
          saida.filter((p) => p.cargo === "Senador" && !p.ambiguidadeDeHomonimo),
        ),
      }
    : {};

  await atualizarManifesto("transparencia", proveniencias);
  await gravarNormalizado("emendas.json", {
    fonte: FONTE,
    uf: UF,
    anos: ANOS,
    coletadoEm: new Date().toISOString(),
    /*
     * O que esta fonte NÃO cobre, dito no dado e não só na tela, para
     * quem ler o JSON sem passar pelo site. Emenda de bancada e de
     * comissão existe e não tem autor individual: some da soma de
     * qualquer pessoa, e some por ser coletiva, não por omissão.
     */
    recorte:
      "Emendas cujo autor é o próprio parlamentar, nos anos da legislatura 57. " +
      "Emendas de bancada estadual e de comissão não têm autor individual e " +
      "não entram aqui.",
    conferencia,
    referencias,
    parlamentares: saida.sort(
      (a, b) =>
        a.cargo.localeCompare(b.cargo, "pt-BR") ||
        a.nomeUrna.localeCompare(b.nomeUrna, "pt-BR"),
    ),
  });

  if (!conferencia.aprovada) {
    console.error(
      `\nCONFERÊNCIA REPROVADA — ${problemas.length} inconsistências na fonte.`,
    );
    for (const problema of problemas.slice(0, 10)) {
      console.error("  ✗ " + problema);
    }
    if (problemas.length > 10) {
      console.error(`  ... e mais ${problemas.length - 10}.`);
    }
    console.error(
      "\nNenhum valor foi publicado. data/es/emendas.json guarda o veredito, " +
        "e a ficha diz que a fonte está inconsistente em vez de mostrar número.",
    );
    process.exitCode = 1;
    return;
  }

  const comEmendas = saida.filter((p) => p.emendas.quantidade > 0).length;
  console.log(
    `\n${proveniencias.length} arquivos brutos guardados. ` +
      `${comEmendas} de ${saida.length} parlamentares com emenda no período, ` +
      "em data/es/emendas.json.",
  );
}

principal().catch((erro) => {
  console.error("\nColeta do Portal da Transparência falhou:", erro.message);
  process.exitCode = 1;
});
