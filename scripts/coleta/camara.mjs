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

/**
 * Anos da legislatura, usados para varrer proposicoes.
 *
 * ARMADILHA: /proposicoes NAO aceita `idLegislatura` — devolve 400 com
 * `"instance":"idLegislatura"`. E o filtro por intervalo de datas
 * recusa qualquer janela maior que 3 meses. O que resta e `ano=`, um
 * ano por requisicao. Verificado em 28/08/2026.
 */
const ANOS = [2023, 2024, 2025, 2026];

/**
 * Quantas proposicoes recentes guardar por parlamentar, com ementa.
 *
 * A contagem por tipo cobre todas; esta lista existe so para a ficha
 * poder mostrar DO QUE se trata, e nao apenas quantas foram. Guardar
 * todas seria caro sem servir a ninguem: um deputado do ES tem 2.843
 * nesta legislatura, e o arquivo e commitado todo dia.
 */
const RECENTES = 10;

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
 * Tabela de tipos de proposicao (codTipo -> nome por extenso).
 *
 * Existe porque a sigla mente por omissao: `REQ` cobre desde
 * requerimento de audiencia publica ate requerimento de sessao solene,
 * com codTipo diferente para cada um. Agrupar pela sigla juntaria
 * coisas de peso muito diferente — que e exatamente o erro que a ficha
 * de senador ja evita ao nao somar materias.
 *
 * Uma requisicao, no comeco da coleta, para as 544 linhas.
 */
async function coletarTiposProposicao(proveniencias) {
  const url = `${API}/referencias/tiposProposicao`;
  const { texto, dados } = await buscarJson(url);
  proveniencias.push(
    await guardarBruto("camara/tipos-proposicao.json", texto, url),
  );

  const porCodigo = new Map();
  for (const t of dados.dados ?? []) {
    // A fonte devolve nome com espaco sobrando ("Indicação ").
    porCodigo.set(Number(t.cod), String(t.nome ?? "").trim() || t.sigla);
  }
  return porCodigo;
}

/**
 * Proposicoes de autoria do parlamentar na legislatura.
 *
 * Um ano por requisicao, pelo motivo explicado em ANOS. A juncao por
 * `id` protege contra a mesma proposicao vir em dois anos — o filtro e
 * pelo ano da proposicao, nao pelo da apresentacao, e os dois divergem
 * em proposicao reapresentada.
 */
async function coletarProposicoes(id, proveniencias) {
  const porId = new Map();
  for (const ano of ANOS) {
    const url = `${API}/proposicoes?idDeputadoAutor=${id}&ano=${ano}&ordem=DESC&ordenarPor=id`;
    const lote = await paginar(url);
    for (const p of lote) porId.set(p.id, p);
  }

  const lista = [...porId.values()];
  proveniencias.push(
    await guardarBruto(
      `camara/proposicoes-${id}.json`,
      JSON.stringify(lista),
      `${API}/proposicoes?idDeputadoAutor=${id}&ano={${ANOS.join(",")}}`,
    ),
  );
  return lista;
}

/**
 * Agrupa proposicoes por tipo e separa as mais recentes.
 *
 * NAO devolve um total unico, pela mesma razao que a ficha de senador
 * nao soma materias: entre os deputados do ES um tem 284 proposicoes e
 * outro tem 2.843, e a diferenca e quase toda de requerimento. Um
 * numero so leria como "produtivo" contra "improdutivo" e produziria o
 * ranking que o site inteiro recusa (docs/principios.md, regra 4).
 */
function agruparProposicoes(lista, tipos) {
  const porTipo = new Map();
  for (const p of lista) {
    const nome = tipos.get(Number(p.codTipo)) ?? p.siglaTipo ?? "Não informado";
    const atual = porTipo.get(nome) ?? { tipo: nome, sigla: p.siglaTipo, total: 0 };
    atual.total++;
    porTipo.set(nome, atual);
  }

  /* Desempate pelo id: sem ele, proposicoes da mesma data trocam de
     lugar entre coletas e poluem o diff diario com ruido. */
  const recentes = [...lista]
    .sort(
      (a, b) =>
        String(b.dataApresentacao ?? "").localeCompare(
          String(a.dataApresentacao ?? ""),
        ) || b.id - a.id,
    )
    .slice(0, RECENTES)
    .map((p) => ({
      id: p.id,
      sigla: p.siglaTipo,
      tipo: tipos.get(Number(p.codTipo)) ?? p.siglaTipo,
      numero: p.numero,
      ano: p.ano,
      ementa: p.ementa || null,
      apresentadaEm: p.dataApresentacao ?? null,
      paginaOficial: `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${p.id}`,
    }));

  return {
    porTipo: [...porTipo.values()].sort((a, b) => b.total - a.total),
    recentes,
  };
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
    fornecedores: agruparFornecedores(linhas),
    glosas: agruparGlosas(linhas),
    maiores: maioresNotas(linhas),
    comprovantes: contarComprovantes(linhas),
  };
}

/**
 * Uma nota, no formato que a ficha exibe.
 *
 * `documento` é a URL do PDF no portal da Câmara. Vem `null` em parte
 * das despesas — passagem aérea SIGEPA nunca tem —, e a tela precisa
 * dizer isso em vez de mostrar um botão que não leva a lugar nenhum.
 */
function nota(linha) {
  return {
    id: linha.codDocumento ?? null,
    data: (linha.dataDocumento ?? "").slice(0, 10) || null,
    tipo: linha.tipoDespesa ?? "Não informado",
    valor: Number(linha.valorLiquido ?? linha.valorDocumento ?? 0),
    fornecedor: (linha.nomeFornecedor ?? "").trim() || null,
    cnpjCpf: (linha.cnpjCpfFornecedor ?? "").trim() || null,
    documento: linha.urlDocumento ?? null,
  };
}

/**
 * Quem recebeu o dinheiro, por valor.
 *
 * Descreve para onde a cota foi, sem adjetivo. Concentração alta em um
 * fornecedor é fato observável — e é o leitor quem decide se aquilo
 * merece pergunta. Guardamos 12: o bastante para o padrão aparecer,
 * pouco o bastante para o arquivo não inchar num commit diário.
 */
function agruparFornecedores(linhas) {
  const m = new Map();
  for (const l of linhas) {
    const nome = (l.nomeFornecedor ?? "").trim();
    if (!nome) continue;
    const valor = Number(l.valorLiquido ?? l.valorDocumento ?? 0);
    if (!Number.isFinite(valor) || valor <= 0) continue;

    /*
     * AGRUPA POR CNPJ, não por nome.
     *
     * A mesma empresa aparece com nomes de fantasia diferentes: na
     * coleta de 31/08/2026, "TERCEIRA PONTE MIDIA" e "T3 CONTEUDO
     * DESIGN" dividiam o CNPJ 49164631000135 e somavam R$ 495 mil.
     * Agrupar pelo nome partiria uma entidade em duas e mostraria
     * concentração menor do que a real — erraria justamente para o
     * lado que interessa a quem está sendo fiscalizado.
     *
     * Sem CNPJ (acontece em passagem aérea), o nome é a única chave
     * possível e vira o fallback.
     */
    const cnpj = (l.cnpjCpfFornecedor ?? "").trim();
    const chave = cnpj || `nome:${nome}`;

    const e = m.get(chave) ?? {
      nome,
      cnpjCpf: cnpj || null,
      total: 0,
      notas: 0,
      /* Nomes de fantasia vistos sob o mesmo CNPJ. A tela mostra os
         demais quando há mais de um, para o leitor saber que a linha
         soma razões sociais diferentes. */
      outrosNomes: [],
    };
    if (e.nome !== nome && !e.outrosNomes.includes(nome)) {
      e.outrosNomes.push(nome);
    }
    e.total += valor;
    e.notas++;
    m.set(chave, e);
  }
  return [...m.values()].sort((a, b) => b.total - a.total).slice(0, 12);
}

/**
 * Glosa: a parte da despesa que a própria Câmara recusou reembolsar.
 *
 * É o sinal mais forte que esta fonte oferece, e o mais defensável:
 * não é juízo nosso, é a Casa registrando que aquilo não podia ser
 * pago. Vai para a tela como fato, com a data e o documento ao lado.
 */
function agruparGlosas(linhas) {
  const comGlosa = linhas
    .filter((l) => Number(l.valorGlosa) > 0)
    .sort((a, b) => Number(b.valorGlosa) - Number(a.valorGlosa));

  return {
    quantidade: comGlosa.length,
    valor: comGlosa.reduce((s, l) => s + Number(l.valorGlosa), 0),
    exemplos: comGlosa.slice(0, 8).map((l) => ({
      ...nota(l),
      valorGlosa: Number(l.valorGlosa),
    })),
  };
}

/** As maiores notas individuais, com link para o comprovante. */
function maioresNotas(linhas) {
  return [...linhas]
    .sort(
      (a, b) =>
        Number(b.valorLiquido ?? b.valorDocumento ?? 0) -
        Number(a.valorLiquido ?? a.valorDocumento ?? 0),
    )
    .slice(0, 10)
    .map(nota);
}

/**
 * Quantas notas têm comprovante em PDF.
 *
 * A tela mostra a proporção porque a ausência também informa: quem
 * quiser conferir precisa saber de antemão que uma parte das despesas
 * não tem documento publicado, e que isso é característica da fonte.
 */
function contarComprovantes(linhas) {
  const com = linhas.filter((l) => l.urlDocumento).length;
  return { com, total: linhas.length };
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
  const tipos = await coletarTiposProposicao(proveniencias);

  const parlamentares = [];
  for (const [i, resumo] of bancada.entries()) {
    const perfil = await coletarPerfil(resumo.id, proveniencias);
    const linhas = await coletarDespesas(resumo.id, proveniencias);
    const despesas = agregarDespesas(linhas);
    const proposicoes = agruparProposicoes(
      await coletarProposicoes(resumo.id, proveniencias),
      tipos,
    );

    console.log(
      `  [${i + 1}/${bancada.length}] ${resumo.nome} — ` +
        `${despesas.documentos} documentos, ${reais(despesas.total)}, ` +
        `${proposicoes.porTipo.length} tipos de proposição`,
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
      proposicoes,
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
