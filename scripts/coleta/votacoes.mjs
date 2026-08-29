import {
  atualizarManifesto,
  buscarJson,
  gravarNormalizado,
  guardarBruto,
  paginar,
} from "./comum.mjs";

/**
 * Coleta: votacoes nominais do plenario da Camara, com o voto de cada
 * deputado do Espirito Santo.
 *
 * POR QUE ESTE SCRIPT E SEPARADO DO camara.mjs
 *
 * Porque a Camara nao tem endpoint de voto por parlamentar:
 * `/deputados/{id}/votos` devolve 405 Method Not Allowed. O unico
 * caminho e o inverso — listar votacoes e, para cada uma, baixar a
 * lista completa de votos (500+ deputados) e filtrar o ES. Isso custa
 * centenas de requisicoes, contra as poucas dezenas das outras
 * coletas, e nao deve atrasar a atualizacao diaria de bancada e
 * despesa. Rodam separadas, falham separadas.
 *
 * O Senado nao tem esse problema: la existe
 * `/senador/{codigo}/votacoes` e a coleta vive dentro de senado.mjs.
 *
 * DUAS ARMADILHAS VERIFICADAS EM 28/08/2026
 *
 * 1. `/votacoes` recusa `idLegislatura` (400) e recusa qualquer
 *    intervalo maior que 3 meses. Dai a varredura por janelas.
 * 2. `/votacoes/{id}/votos` recusa `itens` e `pagina` (400). Nao da
 *    para paginar: a chamada devolve tudo de uma vez, ou nada.
 *
 * A MAIORIA DAS VOTACOES NAO TEM VOTO NOMINAL. Votacao simbolica
 * (aprovacao por unanimidade, requerimento de urgencia) devolve lista
 * de votos VAZIA, sem erro. So se descobre quais sao nominais
 * perguntando uma por uma — que e o que o laco abaixo faz.
 *
 * Roda com: npm run coleta:votacoes
 */

const API = "https://dadosabertos.camara.leg.br/api/v2";

const UF = "ES";
const LEGISLATURA = 57;

/** Inicio da legislatura 57. Limite de ate onde a varredura recua. */
const INICIO_LEGISLATURA = "2023-02-01";

/**
 * Quantas votacoes nominais guardar.
 *
 * Nao e "as mais importantes" — nao ha como ordenar importancia sem
 * emitir juizo. Sao as mais RECENTES, criterio que a tela declara.
 */
const QUANTAS = 20;

/**
 * Teto de sondagens. Cada votacao de plenario custa uma requisicao so
 * para descobrir se e nominal. Sem teto, um periodo de recesso faria a
 * varredura andar ate o comeco da legislatura baixando tudo.
 */
const TETO_SONDAGENS = 500;

const FONTE = {
  nome: "Câmara dos Deputados — Dados Abertos",
  url: "https://dadosabertos.camara.leg.br/",
  licenca: "Dados abertos, uso livre com citação da fonte",
};

/** Janelas de 3 meses, da mais recente para a mais antiga. */
function janelas(ateISO, desdeISO) {
  const saida = [];
  let fim = new Date(ateISO);
  const piso = new Date(desdeISO);

  while (fim > piso) {
    const inicio = new Date(fim);
    inicio.setMonth(inicio.getMonth() - 3);
    inicio.setDate(inicio.getDate() + 1);
    saida.push({
      inicio: (inicio < piso ? piso : inicio).toISOString().slice(0, 10),
      fim: fim.toISOString().slice(0, 10),
    });
    fim = new Date(inicio);
    fim.setDate(fim.getDate() - 1);
  }
  return saida;
}

/**
 * Conta o placar a partir dos votos individuais.
 *
 * Nao se usa o placar que vem escrito na `descricao` da votacao: ele e
 * texto livre ("Sim: 333; Não: 91; Total: 424") e nem sempre bate com
 * a lista, porque voto alterado depois da proclamacao entra na lista e
 * nao no texto. Contar da lista mantem placar e votos coerentes entre
 * si — se divergissem, a ficha de um deputado contradiria o total logo
 * acima dela.
 */
function contarPlacar(votos) {
  const contagem = new Map();
  for (const v of votos) {
    const tipo = v.tipoVoto?.trim() || "Não informado";
    contagem.set(tipo, (contagem.get(tipo) ?? 0) + 1);
  }
  return [...contagem.entries()]
    .map(([voto, total]) => ({ voto, total }))
    .sort((a, b) => b.total - a.total);
}

async function principal() {
  const proveniencias = [];
  const hoje = new Date().toISOString().slice(0, 10);

  console.log(
    `Procurando as ${QUANTAS} votações nominais mais recentes do plenário.`,
  );

  const encontradas = [];
  let sondagens = 0;

  for (const janela of janelas(hoje, INICIO_LEGISLATURA)) {
    if (encontradas.length >= QUANTAS || sondagens >= TETO_SONDAGENS) break;

    const url =
      `${API}/votacoes?dataInicio=${janela.inicio}&dataFim=${janela.fim}` +
      `&ordem=DESC&ordenarPor=dataHoraRegistro`;
    const todas = await paginar(url);
    const plenario = todas.filter((v) => v.siglaOrgao === "PLEN");

    console.log(
      `  ${janela.inicio} a ${janela.fim}: ${todas.length} votações, ` +
        `${plenario.length} no plenário.`,
    );

    for (const v of plenario) {
      if (encontradas.length >= QUANTAS || sondagens >= TETO_SONDAGENS) break;

      sondagens++;
      /*
       * Sem `itens`/`pagina`: esta rota os recusa (ver cabecalho).
       *
       * `aceitar404` porque ha votacao listada cujo `/votos` responde
       * 404 — a listagem conhece a votacao, a rota de votos nao. Sem a
       * tolerancia, uma dessas aborta a coleta inteira.
       */
      const resposta = await buscarJson(`${API}/votacoes/${v.id}/votos`, {
        aceitar404: true,
      });
      if (!resposta) continue;

      const { texto, dados } = resposta;
      const votos = dados.dados ?? [];

      /* Lista vazia = votacao simbolica. Nao ha voto individual a
         mostrar, e guardar a votacao sem votos encheria a ficha de
         linhas mudas. */
      if (votos.length === 0) continue;

      proveniencias.push(
        await guardarBruto(
          `camara/votos-${v.id}.json`,
          texto,
          `${API}/votacoes/${v.id}/votos`,
        ),
      );

      /* O detalhe traz `proposicoesAfetadas`, que a listagem so tem
         quando `proposicaoObjeto` esta preenchido — e nas nominais ele
         costuma vir nulo. Uma requisicao por votacao aceita: sao no
         maximo QUANTAS. */
      const detalhe = await buscarJson(`${API}/votacoes/${v.id}`);
      proveniencias.push(
        await guardarBruto(
          `camara/votacao-${v.id}.json`,
          detalhe.texto,
          `${API}/votacoes/${v.id}`,
        ),
      );
      const afetadas = detalhe.dados.dados?.proposicoesAfetadas ?? [];
      const alvo = afetadas[0] ?? null;

      const doEstado = votos
        .filter((x) => x.deputado_?.siglaUf === UF)
        .map((x) => ({
          idExterno: x.deputado_.id,
          nome: x.deputado_.nome,
          partido: x.deputado_.siglaPartido ?? null,
          voto: x.tipoVoto?.trim() || null,
        }))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

      encontradas.push({
        id: v.id,
        data: v.data ?? null,
        registradaEm: v.dataHoraRegistro ?? null,
        descricao: v.descricao ?? null,
        /* `aprovacao` e 1/0 na fonte. Vira booleano aqui para a tela
           nao ter de conhecer a convencao da Camara. */
        aprovada: v.aprovacao === 1,
        proposicao: alvo
          ? {
              id: alvo.id,
              sigla: alvo.siglaTipo ?? null,
              numero: alvo.numero ?? null,
              ano: alvo.ano ?? null,
              ementa: alvo.ementa || null,
              paginaOficial: `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${alvo.id}`,
            }
          : null,
        placar: contarPlacar(votos),
        votantes: votos.length,
        votosDoEstado: doEstado,
      });

      console.log(
        `    NOMINAL ${v.id} (${v.data}) — ${votos.length} votos, ` +
          `${doEstado.length} do ${UF}`,
      );
    }
  }

  if (encontradas.length === 0) {
    throw new Error(
      `Nenhuma votação nominal encontrada em ${sondagens} sondagens. ` +
        "A rota /votacoes/{id}/votos pode ter mudado de formato.",
    );
  }

  await atualizarManifesto("camara-votacoes", proveniencias);

  await gravarNormalizado("votacoes-camara.json", {
    fonte: FONTE,
    uf: UF,
    legislatura: LEGISLATURA,
    coletadoEm: new Date().toISOString(),
    /* O criterio vai para a tela junto com a lista: sem ele, "20
       votações" parece uma selecao editorial, e nao um recorte
       mecanico pelas mais recentes. */
    criterio: {
      orgao: "Plenário",
      tipo: "Votações nominais",
      quantidade: QUANTAS,
      ordem: "As mais recentes primeiro",
      sondagens,
    },
    votacoes: encontradas,
  });

  console.log(
    `\n${encontradas.length} votações nominais em ${sondagens} sondagens.`,
  );
  console.log(
    `${proveniencias.length} arquivos brutos guardados em dados-brutos/.`,
  );
}

principal().catch((erro) => {
  console.error("\nColeta de votações falhou:", erro.message);
  process.exitCode = 1;
});
