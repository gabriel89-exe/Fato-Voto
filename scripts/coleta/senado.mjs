import {
  atualizarManifesto,
  buscarJson,
  gravarNormalizado,
  guardarBruto,
} from "./comum.mjs";

/**
 * Coleta: senadores do Espirito Santo em exercicio.
 *
 * Fonte: Dados Abertos do Senado (legis.senado.leg.br), aberta, sem
 * chave. Devolve JSON com estrutura herdada de XML — muito aninhada e,
 * pior, com campo que ora e objeto, ora e array de objetos, conforme a
 * quantidade de resultados. Dai a funcao `lista()` abaixo.
 *
 * O que este cargo faz, e que aparece na ficha:
 *   - vota em proposicoes e aprova indicacoes de autoridades
 *   - apresenta materias (projetos, requerimentos, emendas)
 *   - representa o estado na federacao
 *
 * NAO ha despesa aqui. O equivalente senatorial da cota parlamentar
 * (CEAPS) nao esta nesta API e nao foi localizado em formato aberto;
 * enquanto nao estiver, a ficha de senador nao mostra gasto — e diz
 * que nao mostra.
 *
 * Roda com: npm run coleta:senado
 */

const API = "https://legis.senado.leg.br/dadosabertos";
const UF = "ES";

/** Anos da legislatura 57, para casar com a coleta da Camara. */
const ANOS = [2023, 2024, 2025, 2026];

const FONTE = {
  nome: "Senado Federal — Dados Abertos",
  url: "https://www12.senado.leg.br/dados-abertos",
  licenca: "Dados abertos, uso livre com citação da fonte",
};

/**
 * A API devolve objeto quando ha um resultado e array quando ha
 * varios. Tratar os dois casos na mao em cada ponto de uso e receita
 * para bug silencioso — entao normaliza aqui, sempre.
 */
function lista(valor) {
  if (valor == null) return [];
  return Array.isArray(valor) ? valor : [valor];
}

async function coletarBancada(proveniencias) {
  const url = `${API}/senador/lista/atual?uf=${UF}`;
  const { texto, dados } = await buscarJson(url);
  proveniencias.push(
    await guardarBruto(`senado/bancada-${UF}.json`, texto, url),
  );
  return lista(dados.ListaParlamentarEmExercicio?.Parlamentares?.Parlamentar);
}

async function coletarMandato(codigo, proveniencias) {
  const url = `${API}/senador/${codigo}/mandatos`;
  const { texto, dados } = await buscarJson(url);
  proveniencias.push(
    await guardarBruto(`senado/mandatos-${codigo}.json`, texto, url),
  );

  const mandatos = lista(
    dados.MandatoParlamentar?.Parlamentar?.Mandatos?.Mandato,
  );

  /*
   * O mais recente pela DATA, nunca pela posicao no array.
   *
   * A fonte devolve em ordem decrescente, entao pegar o ultimo
   * elemento traz o mandato mais ANTIGO — Magno Malta apareceu com
   * mandato 2003-2011 em vez do atual, que vai ate 2031. Exibir
   * mandato vencido como se fosse o atual seria erro grave.
   */
  const fimDe = (m) =>
    m.SegundaLegislaturaDoMandato?.DataFim ??
    m.PrimeiraLegislaturaDoMandato?.DataFim ??
    "";

  const atual = mandatos
    .filter((m) => m.UfParlamentar === UF)
    .sort((a, b) => fimDe(a).localeCompare(fimDe(b)))
    .at(-1);
  if (!atual) return null;

  return {
    uf: atual.UfParlamentar,
    participacao: atual.DescricaoParticipacao ?? null,
    inicio: atual.PrimeiraLegislaturaDoMandato?.DataInicio ?? null,
    fim: fimDe(atual) || null,
  };
}

async function coletarAutorias(codigo, proveniencias) {
  const materias = [];
  for (const ano of ANOS) {
    const url = `${API}/senador/${codigo}/autorias?ano=${ano}`;
    const { texto, dados } = await buscarJson(url);
    proveniencias.push(
      await guardarBruto(`senado/autorias-${codigo}-${ano}.json`, texto, url),
    );

    for (const a of lista(
      dados.MateriasAutoriaParlamentar?.Parlamentar?.Autorias?.Autoria,
    )) {
      const m = a.Materia;
      if (!m) continue;
      materias.push({
        id: m.Codigo,
        identificacao: m.DescricaoIdentificacao ?? null,
        sigla: m.Sigla ?? null,
        numero: m.Numero ?? null,
        ano: Number(m.Ano) || ano,
        ementa: m.Ementa ?? null,
        data: m.Data ?? null,
        autorPrincipal: a.IndicadorAutorPrincipal === "Sim",
      });
    }
  }
  /* Desempate pelo id: sem ele, materias da mesma data trocam de lugar
     entre coletas e poluem o diff diario com ruido. */
  return materias.sort(
    (a, b) =>
      (b.data ?? "").localeCompare(a.data ?? "") || a.id.localeCompare(b.id),
  );
}

/**
 * Votacoes de plenario em que o senador registrou voto.
 *
 * Esta e a diferenca boa em relacao a Camara: aqui existe endpoint de
 * votacao POR PARLAMENTAR, entao sao 4 requisicoes por senador. Na
 * Camara nao existe (`/deputados/{id}/votos` devolve 405) e a coleta
 * precisa varrer votacao por votacao — ver scripts/coleta/votacoes.mjs.
 *
 * Voto secreto: a fonte marca `IndicadorVotacaoSecreta` e, nesses
 * casos, nao ha voto individual a publicar. A tela DIZ que o voto foi
 * secreto, em vez de deixar a celula muda — vazio sem explicacao e
 * lido como falta do parlamentar (regra 7).
 */
async function coletarVotacoes(codigo, proveniencias) {
  const votacoes = [];

  for (const ano of ANOS) {
    const url = `${API}/senador/${codigo}/votacoes?ano=${ano}`;
    const { texto, dados } = await buscarJson(url);
    proveniencias.push(
      await guardarBruto(`senado/votacoes-${codigo}-${ano}.json`, texto, url),
    );

    for (const v of lista(
      dados.VotacaoParlamentar?.Parlamentar?.Votacoes?.Votacao,
    )) {
      const m = v.Materia ?? {};
      const secreta = v.IndicadorVotacaoSecreta === "Sim";
      const registro = v.SiglaDescricaoVoto?.trim() || null;

      votacoes.push({
        id: `${v.CodigoSessaoVotacao}-${v.Sequencial ?? "0"}`,
        data: v.SessaoPlenaria?.DataSessao ?? null,
        materia: m.DescricaoIdentificacao ?? null,
        ementa: m.Ementa ?? null,
        descricao: v.DescricaoVotacao ?? null,
        resultado: v.DescricaoResultado ?? null,
        secreta,
        /*
         * `registro` e o que a fonte escreveu, sempre. Em votacao
         * secreta ela devolve "Votou": informa QUE o senador votou,
         * nao COMO. Descartar isso e tratar como campo vazio apagaria
         * a diferenca entre votar em segredo e faltar — e vazio sem
         * explicacao e lido como falta (regra 7).
         *
         * `voto` e so a direcao, e por isso fica nulo no segredo: a
         * direcao realmente nao existe no dado publico.
         */
        registro,
        voto: secreta ? null : registro,
      });
    }
  }

  return votacoes.sort(
    (a, b) =>
      (b.data ?? "").localeCompare(a.data ?? "") || a.id.localeCompare(b.id),
  );
}

/**
 * Junta as votacoes dos tres senadores numa lista so.
 *
 * Os tres votam nas MESMAS sessoes de plenario, entao guardar a
 * votacao dentro de cada senador gravaria a mesma ementa tres vezes —
 * o arquivo passou de 499 kB para 1,2 MB quando a coleta de votacao
 * entrou desse jeito, e ele e commitado todo dia.
 *
 * Icada para o nivel do arquivo, a votacao aparece uma vez e carrega
 * os votos de quem participou. De quebra, fica com a mesma forma do
 * votacoes-camara.json, e a ficha desenha as duas casas com o mesmo
 * codigo.
 */
function fundirVotacoes(porSenador) {
  const porId = new Map();

  for (const { senador, votacoes } of porSenador) {
    for (const v of votacoes) {
      const atual = porId.get(v.id) ?? {
        id: v.id,
        data: v.data,
        materia: v.materia,
        ementa: v.ementa,
        descricao: v.descricao,
        resultado: v.resultado,
        secreta: v.secreta,
        votosDoEstado: [],
      };
      atual.votosDoEstado.push({
        idExterno: senador.idExterno,
        nome: senador.nomeUrna,
        partido: senador.partido,
        registro: v.registro,
        voto: v.voto,
      });
      porId.set(v.id, atual);
    }
  }

  for (const v of porId.values()) {
    v.votosDoEstado.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }

  return [...porId.values()].sort(
    (a, b) =>
      (b.data ?? "").localeCompare(a.data ?? "") || a.id.localeCompare(b.id),
  );
}

/**
 * Agrupa por tipo de materia.
 *
 * A ficha mostra o AGRUPAMENTO, nao um total unico. "Apresentou 214
 * matérias" nao diz nada: um requerimento de sessao solene e um
 * projeto de lei contam igual num total, e sao coisas de peso muito
 * diferente. Separar por tipo e a forma honesta de descrever sem
 * ranquear.
 */
function agruparPorTipo(materias) {
  const m = new Map();
  for (const mat of materias) {
    const sigla = mat.sigla ?? "Outros";
    m.set(sigla, (m.get(sigla) ?? 0) + 1);
  }
  return [...m.entries()]
    .map(([sigla, total]) => ({ sigla, total }))
    .sort((a, b) => b.total - a.total);
}

async function principal() {
  const proveniencias = [];
  console.log(`Coletando senadores do ${UF} em exercício.`);

  const bancada = await coletarBancada(proveniencias);
  console.log(`  ${bancada.length} senadores.`);

  const senadores = [];
  const votacoesPorSenador = [];

  for (const p of bancada) {
    const i = p.IdentificacaoParlamentar;
    const codigo = i.CodigoParlamentar;

    const mandato = await coletarMandato(codigo, proveniencias);
    const materias = await coletarAutorias(codigo, proveniencias);
    const votacoes = await coletarVotacoes(codigo, proveniencias);

    console.log(
      `  ${i.NomeParlamentar.padEnd(22)} ${String(i.SiglaPartidoParlamentar ?? "").padEnd(10)} ` +
        `${materias.length} matérias de autoria, ${votacoes.length} votações`,
    );

    const senador = {
      id: `senado-${codigo}`,
      idExterno: Number(codigo),
      cargo: "Senador",
      uf: UF,
      nomeUrna: i.NomeParlamentar,
      nomeCivil: i.NomeCompletoParlamentar ?? i.NomeParlamentar,
      partido: i.SiglaPartidoParlamentar ?? null,
      mandato,
      materias,
      materiasPorTipo: agruparPorTipo(materias),
      paginaOficial: `https://www25.senado.leg.br/web/senadores/senador/-/perfil/${codigo}`,
    };

    senadores.push(senador);
    votacoesPorSenador.push({ senador, votacoes });
  }

  const votacoes = fundirVotacoes(votacoesPorSenador);

  await atualizarManifesto("senado", proveniencias);
  await gravarNormalizado("senadores.json", {
    fonte: FONTE,
    uf: UF,
    anos: ANOS,
    coletadoEm: new Date().toISOString(),
    senadores,
    /* Fora dos senadores de proposito: os tres votam nas mesmas
       sessoes, e repetir a ementa em cada um triplicava o arquivo. */
    votacoes,
  });

  console.log(
    `\n${proveniencias.length} arquivos brutos guardados. ` +
      `${senadores.length} senadores e ${votacoes.length} votações ` +
      "em data/es/senadores.json.",
  );
}

principal().catch((erro) => {
  console.error("\nColeta do Senado falhou:", erro.message);
  process.exitCode = 1;
});
