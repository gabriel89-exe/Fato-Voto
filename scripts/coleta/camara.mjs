import {
  atualizarManifesto,
  buscarJson,
  gravarNormalizado,
  guardarBruto,
  paginar,
  reais,
} from "./comum.mjs";

/**
 * Coleta: deputados federais do Espirito Santo.
 *
 * Fonte: Dados Abertos da Camara dos Deputados (api/v2), aberta, sem
 * chave e sem cadastro. E a fonte mais generosa das cinco que o projeto
 * usa — devolve ate a URL do PDF de cada nota fiscal.
 *
 * O que este cargo faz, e que aparece na ficha:
 *   - vota em proposicoes no plenario
 *   - apresenta e relata projetos
 *   - destina emendas parlamentares (esta parte NAO vem daqui; vem do
 *     Portal da Transparencia, que exige chave — ver README)
 *   - gasta a cota parlamentar, com nota fiscal publica
 *
 * Roda com: npm run coleta:camara
 */

const API = "https://dadosabertos.camara.leg.br/api/v2";

/** Legislatura 57 = 2023-2027. A atual no momento da coleta. */
const LEGISLATURA = 57;
const UF = "ES";

const FONTE = {
  nome: "Câmara dos Deputados — Dados Abertos",
  url: "https://dadosabertos.camara.leg.br/",
  licenca: "Dados abertos, uso livre com citação da fonte",
};

/**
 * Bancada do estado na legislatura.
 *
 * A API devolve UM REGISTRO POR FILIACAO, nao por pessoa: quem trocou
 * de partido no meio do mandato aparece duas vezes. Na coleta de
 * 27/08/2026, 10 cadeiras do ES vieram como 15 registros.
 *
 * Isso nao e defeito da fonte — e informacao. Troca de partido durante
 * o mandato e fato publico e relevante para quem vai votar, entao a
 * funcao junta por `id` e devolve tambem a sequencia de siglas. O
 * partido atual vem do perfil, que e a fonte autoritativa.
 */
async function coletarBancada(proveniencias) {
  const url = `${API}/deputados?siglaUf=${UF}&idLegislatura=${LEGISLATURA}&ordem=ASC&ordenarPor=nome`;
  const { texto, dados } = await buscarJson(`${url}&itens=100`);
  proveniencias.push(
    await guardarBruto(`camara/bancada-${UF}.json`, texto, url),
  );

  const porId = new Map();
  for (const registro of dados.dados) {
    const atual = porId.get(registro.id);
    if (atual) {
      if (!atual.siglasNaLegislatura.includes(registro.siglaPartido)) {
        atual.siglasNaLegislatura.push(registro.siglaPartido);
      }
    } else {
      porId.set(registro.id, {
        ...registro,
        siglasNaLegislatura: [registro.siglaPartido],
      });
    }
  }

  const bancada = [...porId.values()];
  const trocaram = bancada.filter((d) => d.siglasNaLegislatura.length > 1);
  console.log(
    `  ${dados.dados.length} registros de filiação → ${bancada.length} ` +
      `parlamentares (${trocaram.length} trocaram de partido no mandato).`,
  );
  return bancada;
}

async function coletarPerfil(id, proveniencias) {
  const url = `${API}/deputados/${id}`;
  const { texto, dados } = await buscarJson(url);
  proveniencias.push(
    await guardarBruto(`camara/deputado-${id}.json`, texto, url),
  );
  return dados.dados;
}

/**
 * Despesas da cota parlamentar.
 *
 * ATENCAO: filtrar por `ano` devolve lista vazia nesta API; o filtro
 * que funciona e `idLegislatura`. Ver o comentario em comum.mjs.
 */
async function coletarDespesas(id, proveniencias) {
  const url = `${API}/deputados/${id}/despesas?idLegislatura=${LEGISLATURA}&ordem=DESC&ordenarPor=dataDocumento`;
  const linhas = await paginar(url);
  proveniencias.push(
    await guardarBruto(
      `camara/despesas-${id}.json`,
      JSON.stringify(linhas),
      url,
    ),
  );
  return linhas;
}

/**
 * Agrega as despesas em duas visoes, que sao exatamente os dois
 * graficos pedidos: composicao (pizza) e evolucao (linha).
 *
 * O total tambem sai daqui, e ele NUNCA deve aparecer sozinho na tela:
 * valor absoluto sem denominador vira ranking involuntario. A ficha
 * mostra o total ao lado da mediana da bancada, calculada abaixo.
 */
function agregarDespesas(linhas) {
  const porTipo = new Map();
  const porMes = new Map();
  let total = 0;

  for (const linha of linhas) {
    const valor = Number(linha.valorLiquido ?? linha.valorDocumento ?? 0);
    if (!Number.isFinite(valor) || valor <= 0) continue;
    total += valor;

    const tipo = linha.tipoDespesa ?? "Não informado";
    porTipo.set(tipo, (porTipo.get(tipo) ?? 0) + valor);

    const competencia = `${linha.ano}-${String(linha.mes).padStart(2, "0")}`;
    porMes.set(competencia, (porMes.get(competencia) ?? 0) + valor);
  }

  return {
    total,
    documentos: linhas.length,
    porTipo: [...porTipo.entries()]
      .map(([tipo, valor]) => ({ tipo, valor }))
      .sort((a, b) => b.valor - a.valor),
    porMes: [...porMes.entries()]
      .map(([competencia, valor]) => ({ competencia, valor }))
      .sort((a, b) => a.competencia.localeCompare(b.competencia)),
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

async function principal() {
  const proveniencias = [];
  console.log(`Coletando bancada federal do ${UF}, legislatura ${LEGISLATURA}.`);

  const bancada = await coletarBancada(proveniencias);

  const parlamentares = [];
  for (const [i, resumo] of bancada.entries()) {
    const perfil = await coletarPerfil(resumo.id, proveniencias);
    const linhas = await coletarDespesas(resumo.id, proveniencias);
    const despesas = agregarDespesas(linhas);

    console.log(
      `  [${i + 1}/${bancada.length}] ${resumo.nome} — ` +
        `${despesas.documentos} documentos, ${reais(despesas.total)}`,
    );

    parlamentares.push({
      id: `camara-${perfil.id}`,
      idExterno: perfil.id,
      cargo: "Deputado Federal",
      uf: UF,
      nomeUrna: perfil.ultimoStatus?.nomeEleitoral ?? resumo.nome,
      nomeCivil: perfil.nomeCivil,
      partido: perfil.ultimoStatus?.siglaPartido ?? null,
      /**
       * Siglas pelas quais a pessoa passou nesta legislatura, na ordem
       * em que a fonte as devolve. Vai para a tela como fato datado,
       * sem adjetivo: trocar de partido nao e virtude nem defeito.
       */
      siglasNaLegislatura: resumo.siglasNaLegislatura,
      trocouDePartido: resumo.siglasNaLegislatura.length > 1,
      situacao: perfil.ultimoStatus?.situacao ?? null,
      condicaoEleitoral: perfil.ultimoStatus?.condicaoEleitoral ?? null,
      dataNascimento: perfil.dataNascimento ?? null,
      ufNascimento: perfil.ufNascimento ?? null,
      escolaridade: perfil.escolaridade ?? null,
      urlFotoOficial: perfil.ultimoStatus?.urlFoto ?? null,
      paginaOficial: `https://www.camara.leg.br/deputados/${perfil.id}`,
      despesas,
    });
  }

  // Denominador da bancada: sem isto, nenhum total pode ir para a tela.
  const totais = parlamentares.map((p) => p.despesas.total);
  const referencia = {
    bancada: parlamentares.length,
    medianaDespesas: mediana(totais),
    menor: Math.min(...totais),
    maior: Math.max(...totais),
  };

  const manifesto = await atualizarManifesto("camara", proveniencias);

  await gravarNormalizado("deputados-federais.json", {
    fonte: FONTE,
    uf: UF,
    legislatura: LEGISLATURA,
    coletadoEm: new Date().toISOString(),
    referencia,
    parlamentares,
  });

  console.log("\nResumo da bancada:");
  console.log(`  mediana de despesas: ${reais(referencia.medianaDespesas)}`);
  console.log(`  menor: ${reais(referencia.menor)}`);
  console.log(`  maior: ${reais(referencia.maior)}`);
  console.log(
    `\n${proveniencias.length} arquivos brutos guardados. ` +
      `Manifesto com ${Object.keys(manifesto).length} fonte(s).`,
  );
}

principal().catch((erro) => {
  console.error("Coleta falhou:", erro.message);
  process.exitCode = 1;
});
