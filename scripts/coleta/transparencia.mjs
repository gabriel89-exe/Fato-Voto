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
 * ==================================================================
 * A COLETA TEM DUAS FASES, E O MOTIVO E UM DEFEITO DA FONTE.
 *
 * A consulta por `nomeAutor` devolve valor monetario CORROMPIDO de
 * forma intermitente: o numero certo dividido por 10.000. Medido em
 * 02/09/2026 em 66 emendas de um deputado, pedidas cinco vezes: 20
 * delas trocaram de valor entre uma leitura e outra, sempre no mesmo
 * padrao — "400.000,00" numa, "40,00" na seguinte.
 *
 * A consulta pelo CODIGO da emenda (`?codigoEmenda=`) nao tem esse
 * problema. Em 40 emendas lidas duas vezes cada, 39 vieram identicas,
 * e o valor bate com o que a pagina publica do portal mostra —
 * conferido no navegador na emenda 202539120004: R$ 250.000,00
 * empenhado, que a consulta por codigo devolve e a consulta por nome
 * devolvia como "25,00".
 *
 * Dai as duas fases:
 *
 *   1. LISTAR. `?nomeAutor=` so para descobrir QUAIS emendas sao da
 *      pessoa. Dessa resposta a coleta usa exclusivamente codigo,
 *      autor e ano — campos de texto, que nunca vieram corrompidos.
 *      Nenhum valor monetario e lido aqui.
 *   2. LER. Uma consulta por codigo, que e onde o valor vem.
 *
 * Custa ~500 requisicoes por coleta, contra ~70 antes. O limite
 * publicado do portal e 400 por minuto das 6h as 24h, entao a pausa
 * de PAUSA_ENTRE_PEDIDOS_MS existe para ficar abaixo dele com folga:
 * um servico publico nao deve pagar pelo defeito dele em carga.
 * ==================================================================
 */

/** ~330 pedidos por minuto, abaixo dos 400 que o portal publica. */
const PAUSA_ENTRE_PEDIDOS_MS = 180;

const respirar = () =>
  new Promise((r) => setTimeout(r, PAUSA_ENTRE_PEDIDOS_MS));

async function pedir(params, cabecalho) {
  const url = `${API}/emendas?${new URLSearchParams(params)}`;
  const resposta = await buscarJson(url, {
    cabecalhos: { "chave-api-dados": TOKEN },
  });
  await respirar();
  return { url, ...resposta };
}

/**
 * Fase 1 — quais emendas sao desta pessoa.
 *
 * A API devolve 15 itens por pagina e nao informa total: a ultima
 * pagina e a que vem incompleta. O teto de paginas evita laco infinito
 * se a fonte mudar esse contrato.
 *
 * Devolve so identificacao. Ler valor daqui e o erro que esta funcao
 * existe para impedir.
 */
async function listarDoAutor(nomeAutor, proveniencias) {
  const identificacoes = [];
  for (let pagina = 1; pagina <= 40; pagina += 1) {
    const { url, texto, dados } = await pedir({ nomeAutor, pagina });

    proveniencias.push(
      await guardarBruto(
        `transparencia/lista-${nomeAutor.replace(/\W+/g, "-").toLowerCase()}-p${pagina}.json`,
        texto,
        url,
      ),
    );

    const lote = Array.isArray(dados) ? dados : [];
    for (const e of lote) {
      identificacoes.push({
        codigoEmenda: String(e.codigoEmenda),
        autor: e.autor ?? "",
        ano: Number(e.ano),
      });
    }
    if (lote.length < 15) break;
  }
  return identificacoes;
}

/**
 * Fase 2 — o registro de uma emenda, lido DUAS vezes.
 *
 * Duas leituras porque a fonte se contradiz: para um registro afetado,
 * ela devolve o valor certo em ~1 de cada 10 consultas e o valor
 * dividido por 10.000 nas outras 9. Medido em 02/09/2026 na emenda
 * 202533120003, dez consultas: "20,00" nove vezes, "200.000,00" uma —
 * e a pagina publica do portal diz R$ 200.000,00.
 *
 * Duas leituras que discordam sao prova de que a fonte esta errada em
 * pelo menos uma delas. A coleta NAO escolhe entre as duas, nao pega a
 * maior, nao calcula nada: marca o registro como instavel, e a
 * conferencia reprova a coleta inteira. Escolher a maior seria
 * inferencia — provavelmente certa, e ainda assim um numero que a
 * fonte nao afirmou.
 */
async function lerEmenda(codigo) {
  const ler = async () => {
    const { dados } = await pedir({ codigoEmenda: codigo });
    return Array.isArray(dados)
      ? (dados.find((e) => String(e.codigoEmenda) === codigo) ?? null)
      : null;
  };

  const primeira = await ler();
  if (!primeira) return null;

  const segunda = await ler();
  const divergiu =
    !segunda || CAMPOS_DE_VALOR.some((c) => primeira[c] !== segunda[c]);

  return { ...primeira, __instavel: divergiu };
}

/* ------------------------------------------------------------------ */
/*  Conferencia da fonte                                               */
/* ------------------------------------------------------------------ */

/**
 * ==================================================================
 * POR QUE ESTA COLETA CONFERE A FONTE ANTES DE PUBLICAR
 *
 * A API do Portal da Transparencia devolve valor monetario DIVIDIDO
 * POR 10.000 de forma intermitente. Na consulta por nome, para a
 * emenda 202539120004:
 *
 *   valorEmpenhado: "25,00"        <- a pagina publica diz R$ 250.000,00
 *   valorPago:      "245.000,00"   <- correto
 *
 * A consulta por codigo, que esta coleta usa desde 02/09/2026, resolve
 * a maior parte disso. Nao resolve tudo: em 40 emendas lidas duas
 * vezes, uma divergiu. Entao a conferencia continua, agora por
 * registro em vez de por passada inteira.
 *
 * Numero errado com cara de numero certo e o pior resultado possivel
 * para este projeto: ele nao quebra nada, nao aparece em log, e vai
 * para a tela ao lado de um selo de "dado oficial". Se a conferencia
 * reprova, a coleta NAO publica — grava o veredito, e a ficha diz que
 * a fonte esta inconsistente.
 *
 * Duas provas, as duas baratas, e nenhuma delas com numero magico:
 *
 *   1. A FONTE CONCORDA CONSIGO MESMA. Cada emenda e lida duas vezes,
 *      pelo codigo. Se as duas leituras discordam, a fonte esta errada
 *      em pelo menos uma — e nao ha como saber em qual.
 *   2. PAGO NAO PASSA DE EMPENHADO. E impossivel pagar o que nao foi
 *      empenhado. Independe da primeira e pega o caso em que as duas
 *      leituras vem igualmente erradas.
 *
 * O QUE FOI TENTADO E DESCARTADO: um piso de grandeza, reprovando
 * emenda abaixo de R$ 1.000. Parecia detector barato do defeito, ja
 * que dividir por 10.000 joga qualquer emenda real para baixo desse
 * valor. Mas a emenda 202643830011 e de R$ 7,00 DE VERDADE — a pagina
 * publica confirma —, e um piso reprovaria a coleta inteira por causa
 * dela, para sempre. Heuristica de grandeza aqui produz falso positivo
 * silencioso, e falso positivo permanente e pior que o defeito.
 *
 * O QUE ESTA CONFERENCIA NAO PEGA, dito com todas as letras: registro
 * cujo valor venha igualmente corrompido nas duas leituras e sem
 * contradicao interna. Com a taxa medida — cerca de 9 em 10 leituras
 * corrompidas nos registros afetados — isso acontece, e por isso a
 * conferencia e de COLETA INTEIRA e nao de registro: basta um registro
 * reprovar para nada ser publicado. Enquanto a fonte estiver assim, o
 * resultado certo e nao publicar.
 * ==================================================================
 */

const CAMPOS_DE_VALOR = [
  "valorEmpenhado",
  "valorLiquidado",
  "valorPago",
  "valorRestoInscrito",
  "valorRestoCancelado",
  "valorRestoPago",
];

/** O veredito sobre tudo que foi lido. */
function conferir(registros) {
  const problemas = [];

  for (const e of registros) {
    if (e.__instavel) {
      problemas.push(
        `${e.codigoEmenda}: duas leituras seguidas devolveram valores ` +
          "diferentes para a mesma emenda",
      );
    }

    const empenhado = valor(e.valorEmpenhado);
    const pago = valor(e.valorPago);
    if (empenhado > 0 && pago > empenhado * 1.0001) {
      problemas.push(
        `${e.codigoEmenda}: pago (${e.valorPago}) maior que empenhado ` +
          `(${e.valorEmpenhado}) — impossível`,
      );
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

  /* Fase 1: quem é dono de quê. Só identificação, nenhum valor. */
  const identificacoes = new Map();
  for (const p of parlamentares) {
    const alvo = normalizar(p.nomeUrna);
    identificacoes.set(alvo, await listarDoAutor(alvo, proveniencias));
  }

  /*
   * Fase 2: o valor, pedido emenda por emenda. É a fase cara — uma
   * requisição por emenda — e é ela que existe porque a consulta por
   * nome corrompe valor. Ver o cabeçalho de `listarDoAutor`.
   */
  const registros = new Map();
  let lidas = 0;
  const aLer = [...identificacoes.values()].reduce(
    (s, lista) =>
      s +
      lista.filter((e) => ANOS.includes(e.ano)).length,
    0,
  );
  console.log(`Lendo ${aLer} emendas do período, uma consulta por emenda.`);

  for (const p of parlamentares) {
    const alvo = normalizar(p.nomeUrna);
    const doAutor = (identificacoes.get(alvo) ?? []).filter(
      (e) => normalizar(e.autor) === alvo && ANOS.includes(e.ano),
    );

    const lidos = [];
    for (const ident of doAutor) {
      const registro = await lerEmenda(ident.codigoEmenda);
      if (registro) lidos.push(registro);
      lidas += 1;
      if (lidas % 50 === 0) console.log(`  ${lidas}/${aLer}`);
    }

    proveniencias.push(
      await guardarBruto(
        `transparencia/emendas-${alvo.replace(/\W+/g, "-").toLowerCase()}.json`,
        JSON.stringify(lidos, null, 2) + "\n",
        `${API}/emendas?codigoEmenda={código de cada emenda da lista}`,
      ),
    );

    registros.set(alvo, lidos);
  }

  const problemas = conferir([...registros.values()].flat());

  const conferencia = {
    aprovada: problemas.length === 0,
    conferidoEm: new Date().toISOString(),
    /* O que foi testado, dito no dado: quem ler o JSON sem passar pelo
       site precisa saber que houve conferência e qual. */
    provas: [
      "o valor vem da consulta por código da emenda, não da consulta por nome",
      "cada emenda é lida duas vezes, e as duas leituras têm de concordar",
      "valor pago não passa do valor empenhado",
    ],
    problemas: problemas.slice(0, 20),
    totalDeProblemas: problemas.length,
  };

  const saida = [];

  for (const p of parlamentares) {
    const alvo = normalizar(p.nomeUrna);

    /* Trava 1: igualdade de nome. O filtro da API casa por conteúdo. */
    const doAutor = (registros.get(alvo) ?? []).filter(
      (e) => normalizar(e.autor ?? "") === alvo,
    );

    /* Trava 2: um nome, um código de autor. Ver o cabeçalho. */
    const codigos = [
      ...new Set(
        doAutor.map((e) => codigoDoAutor(e.codigoEmenda)).filter(Boolean),
      ),
    ].sort();

    const ambiguo = codigos.length > 1;

    /* A fase 2 só leu o período; o que existe fora dele vem da fase 1,
       que lista todos os anos. Só a contagem, nunca o valor. */
    const foraDoPeriodo = (identificacoes.get(alvo) ?? []).filter(
      (e) => normalizar(e.autor) === alvo && !ANOS.includes(e.ano),
    ).length;
    const noPeriodo = doAutor;

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
      foraDoPeriodo,
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
