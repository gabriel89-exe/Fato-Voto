import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { RAIZ_BRUTA, gravarNormalizado } from "./comum.mjs";

/**
 * Normalizacao das fichas do TSE.
 *
 * Vive separada da coleta de proposito: reconstruir o arquivo que o
 * site le a partir dos snapshots brutos NAO deve custar 575
 * requisicoes ao servico publico. Corrigiu uma regra aqui? Rode
 * `npm run coleta:tse:normalizar` e pronto.
 */

export const ANO = 2026;
export const ID_ELEICAO = "20322002026";
export const UF = "ES";

export const CARGOS = [
  { codigo: 1, nome: "Presidente", ue: "BR" },
  { codigo: 3, nome: "Governador", ue: UF },
  { codigo: 5, nome: "Senador", ue: UF },
  { codigo: 6, nome: "Deputado Federal", ue: UF },
  { codigo: 7, nome: "Deputado Estadual", ue: UF },
];

/**
 * Tipos de documento anexado ao registro.
 *
 * O TSE nao publica esta tabela. Ela foi levantada em 27/08/2026
 * cruzando o `codTipo` com os nomes de arquivo auto-descritivos das
 * 4.026 pecas coletadas no ES — por exemplo, todo `codTipo` 12 com
 * nome legivel diz "TRF ... 2 grau ... certidao".
 *
 * Se aparecer um codigo desconhecido, ele fica "Documento não
 * identificado" e NAO recebe rotulo chutado: rotular errado uma peca
 * oficial e pior do que admitir que nao se sabe.
 */
const TIPOS_DOCUMENTO = {
  5: "Proposta de governo",
  11: "Certidão criminal — Justiça Federal, 1º grau",
  12: "Certidão criminal — Justiça Federal, 2º grau",
  13: "Certidão criminal — Justiça Estadual, 1º grau",
  14: "Certidão criminal — Justiça Estadual, 2º grau",
  15: "Certidão da Justiça Eleitoral",
};

/**
 * Quais cargos entregam proposta de governo.
 *
 * A lei eleitoral so exige a proposta de candidatura MAJORITARIA do
 * Executivo — Presidente, Governador e Prefeito. Senador e deputado
 * nao entregam, e a coleta confirma: 18 de 18 candidaturas obrigadas
 * anexaram, e nenhuma das 557 nao-obrigadas o fez.
 *
 * DISTINCAO QUE A TELA PRECISA FAZER: para um deputado, escrever
 * "proposta de governo: não fornecida" inventa uma falta que nao
 * existe. O cargo nao exige. Ver docs/principios.md, regra 7.
 */
function exigeProposta(nomeCargo) {
  return nomeCargo === "Presidente" || nomeCargo === "Governador";
}

function classificar(codTipo) {
  return TIPOS_DOCUMENTO[Number(codTipo)] ?? "Documento não identificado";
}

export function normalizar(ficha, cargo) {
  const podeBens = ficha.st_DIVULGA_BENS === true;
  const podeArquivos = ficha.st_DIVULGA_ARQUIVOS === true;

  /*
   * ORDENACAO EXPLICITA, e nao por capricho.
   *
   * O TSE devolve `bens` e `arquivos` em ordem nao deterministica: duas
   * coletas seguidas do MESMO dado saem em ordens diferentes. Sem
   * ordenar, a coleta diaria produzia um diff de 3.043 linhas sem uma
   * unica mudanca real (medido em 28/08/2026: 173 das 575 fichas
   * diferiam so pela ordem dos arrays).
   *
   * Isso arruinava o proposito do historico versionado: se todo dia o
   * diff e enorme, ninguem consegue ver o dia em que uma candidatura
   * foi de fato indeferida.
   */
  const bens = podeBens
    ? (ficha.bens ?? [])
        .map((b) => ({
          ordem: b.ordem,
          tipo: b.descricaoDeTipoDeBem,
          descricao: b.descricao,
          valor: b.valor,
          atualizadoEm: b.dataUltimaAtualizacao ?? null,
        }))
        .sort((a, b) => a.ordem - b.ordem)
    : [];

  const documentos = podeArquivos
    ? (ficha.arquivos ?? [])
        .map((a) => ({
          id: a.idArquivo,
          nomeArquivo: a.nome,
          tipo: classificar(a.codTipo),
          codTipo: Number(a.codTipo),
        }))
        .sort((a, b) => a.id - b.id)
    : [];

  const proposta = documentos.find((d) => d.tipo === "Proposta de governo");

  /** A fonte inclui a eleicao corrente na lista; historico e o resto. */
  const anteriores = (ficha.eleicoesAnteriores ?? [])
    .filter((e) => Number(e.nrAno) < ANO)
    .map((e) => ({
      ano: Number(e.nrAno),
      cargo: e.cargo,
      partido: e.partido,
      uf: e.sgUe,
      resultado: e.situacaoTotalizacao ?? null,
    }))
    .sort((a, b) => b.ano - a.ano);

  return {
    id: String(ficha.id),
    cargo: cargo.nome,
    uf: cargo.ue,
    nomeUrna: ficha.nomeUrna,
    nomeCompleto: ficha.nomeCompleto,
    numero: ficha.numero,
    partido: ficha.partido
      ? { sigla: ficha.partido.sigla, nome: ficha.partido.nome }
      : null,
    coligacao: ficha.nomeColigacao ?? null,

    situacaoRegistro: ficha.descricaoSituacao ?? null,
    situacaoCandidatura: ficha.descricaoSituacaoCandidato ?? null,
    apto: ficha.candidatoApto === true,
    disputaReeleicao: ficha.st_REELEICAO === true,

    dataNascimento: ficha.dataDeNascimento ?? null,
    genero: ficha.descricaoSexo ?? null,
    corRaca: ficha.descricaoCorRaca ?? null,
    escolaridade: ficha.grauInstrucao ?? null,
    ocupacao: ficha.ocupacao ?? null,
    naturalidade: ficha.descricaoNaturalidade ?? null,

    bens,
    totalBens: podeBens ? (ficha.totalDeBens ?? 0) : null,

    /**
     * `exigida` separa "o cargo nao pede" de "o cargo pede e nao
     * entregou". Sem essa distincao a ficha acusa alguem de uma
     * omissao inexistente.
     */
    proposta: {
      exigida: exigeProposta(cargo.nome),
      documento: proposta ?? null,
    },
    documentos,

    eleicoesAnteriores: anteriores,
    primeiraCandidatura: anteriores.length === 0,

    divulgacaoAutorizada: {
      ficha: ficha.st_DIVULGA === true,
      bens: podeBens,
      documentos: podeArquivos,
    },

    /*
     * NÃO É LINK DIRETO PARA A FICHA, e não por escolha nossa.
     *
     * O TSE publica o formato
     *   /divulga/#/candidato/{ano}/{idEleicao}/{UF}/{idCandidato}
     * — inclusive dentro do próprio dado, no campo `txLink` de
     * `eleicoesAnteriores`. Só que ele NÃO FUNCIONA em link direto.
     *
     * Verificado em 31/08/2026: a rota `candidato` tem um resolver que
     * lê `ata` do estado da aplicação para chamar `getEleicaoAtual`.
     * Em carga fria esse estado vem vazio, o resolver falha e a página
     * responde "ERRO AO CARREGAR A PÁGINA". Acontece igual com a URL
     * que o próprio TSE gera, então não é erro de montagem nossa e não
     * há formato alternativo que contorne.
     *
     * Apontar para uma página que dá erro seria pior que não apontar:
     * quebra a promessa de "confira você mesmo", que é o que sustenta
     * este site. Então o link vai para a home da eleição, que abre, e
     * a tela diz o nome e o número para a pessoa buscar lá dentro.
     *
     * Se o TSE consertar a rota, é só voltar ao formato acima.
     */
    paginaOficial: `https://divulgacandcontas.tse.jus.br/divulga/#/home/${ANO}`,
  };
}

export const FONTE = {
  nome: "Tribunal Superior Eleitoral — DivulgaCandContas",
  url: "https://divulgacandcontas.tse.jus.br/divulga/",
  licenca: "Dado público de divulgação obrigatória",
};

export async function gravarCandidaturas(candidaturas) {
  await gravarNormalizado("candidaturas-2026.json", {
    fonte: FONTE,
    eleicao: { ano: ANO, idEleicao: ID_ELEICAO, uf: UF },
    coletadoEm: new Date().toISOString(),
    total: candidaturas.length,
    candidaturas,
  });
}

/** Reconstroi o normalizado a partir dos snapshots, sem tocar na rede. */
async function reconstruir() {
  const dir = join(RAIZ_BRUTA, "tse");
  const arquivos = (await readdir(dir)).filter((f) => f.startsWith("fichas-"));
  if (arquivos.length === 0) {
    throw new Error("Nenhum snapshot em dados-brutos/tse. Rode npm run coleta:tse.");
  }

  const candidaturas = [];
  for (const nome of arquivos) {
    const codigo = Number(nome.match(/-(\d+)\.json$/)[1]);
    const cargo = CARGOS.find((c) => c.codigo === codigo);
    const fichas = JSON.parse(await readFile(join(dir, nome), "utf8"));
    candidaturas.push(...fichas.map((f) => normalizar(f, cargo)));
  }

  await gravarCandidaturas(candidaturas);

  const porCargo = new Map();
  for (const c of candidaturas) {
    const e = porCargo.get(c.cargo) ?? { total: 0, comProposta: 0, exige: false };
    e.total++;
    e.exige = c.proposta.exigida;
    if (c.proposta.documento) e.comProposta++;
    porCargo.set(c.cargo, e);
  }

  console.log(`Reconstruído de ${arquivos.length} snapshots, sem rede.\n`);
  for (const [cargo, e] of porCargo) {
    const nota = e.exige
      ? `${e.comProposta}/${e.total} com proposta`
      : "cargo não exige proposta";
    console.log(`  ${cargo.padEnd(18)} ${String(e.total).padStart(3)}  —  ${nota}`);
  }
  console.log(`\nTotal: ${candidaturas.length} candidaturas.`);
}

// `pathToFileURL` em vez de montar a string na mao: no Windows o
// caminho vira file:///C:/... com tres barras, e a comparacao ingenua
// falha em silencio — o modulo simplesmente nao roda nada.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  reconstruir().catch((erro) => {
    console.error("Falhou:", erro.message);
    process.exitCode = 1;
  });
}
