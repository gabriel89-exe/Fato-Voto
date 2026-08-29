/**
 * Tipos das entidades reais.
 *
 * Espelham o que as fontes publicas devolvem depois da normalizacao em
 * scripts/coleta. Nao invente campo que a fonte nao tem: se um dado
 * nao existe, ele e `null` e a tela DIZ que nao existe.
 *
 * Ver docs/fontes-de-dados.md.
 */

export type Cargo =
  | "Presidente"
  | "Governador"
  | "Senador"
  | "Deputado Federal"
  | "Deputado Estadual";

/** Ordem em que os cargos aparecem em qualquer lista ou seletor. */
export const CARGOS: Cargo[] = [
  "Presidente",
  "Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
];

export interface Partido {
  sigla: string;
  nome: string;
}

export interface Bem {
  ordem: number;
  tipo: string;
  descricao: string;
  valor: number;
  atualizadoEm: string | null;
}

/** Peca anexada ao registro: proposta de governo, certidoes. */
export interface Documento {
  id: number;
  nomeArquivo: string;
  tipo: string;
  codTipo: number;
}

export interface EleicaoAnterior {
  ano: number;
  cargo: string;
  partido: string;
  uf: string;
  resultado: string | null;
}

/**
 * `exigida` separa "o cargo nao pede proposta" de "o cargo pede e a
 * candidatura nao entregou". Sem essa distincao a ficha de um deputado
 * acusaria uma omissao que nao existe — a lei so exige proposta de
 * candidatura majoritaria do Executivo.
 */
export interface Proposta {
  exigida: boolean;
  documento: Documento | null;
}

/**
 * O que o TSE autoriza divulgar, caso a caso. Quando vier `false`, a
 * tela precisa DIZER que o dado foi omitido por determinacao da fonte.
 */
export interface DivulgacaoAutorizada {
  ficha: boolean;
  bens: boolean;
  documentos: boolean;
}

export interface Candidatura {
  id: string;
  cargo: Cargo;
  uf: string;
  nomeUrna: string;
  nomeCompleto: string;
  numero: number;
  partido: Partido | null;
  coligacao: string | null;

  situacaoRegistro: string | null;
  situacaoCandidatura: string | null;
  apto: boolean;
  disputaReeleicao: boolean;

  dataNascimento: string | null;
  genero: string | null;
  corRaca: string | null;
  escolaridade: string | null;
  ocupacao: string | null;
  naturalidade: string | null;

  bens: Bem[];
  totalBens: number | null;

  proposta: Proposta;
  documentos: Documento[];

  eleicoesAnteriores: EleicaoAnterior[];
  primeiraCandidatura: boolean;

  divulgacaoAutorizada: DivulgacaoAutorizada;
  paginaOficial: string;
}

export interface Fonte {
  nome: string;
  url: string;
  licenca: string;
}

export interface ArquivoCandidaturas {
  fonte: Fonte;
  eleicao: { ano: number; idEleicao: string; uf: string };
  coletadoEm: string;
  total: number;
  candidaturas: Candidatura[];
}

/* ------------------------------------------------------------------ */
/*  Mandato em exercicio — Camara dos Deputados                        */
/* ------------------------------------------------------------------ */

export interface DespesaPorTipo {
  tipo: string;
  valor: number;
}

export interface DespesaPorMes {
  /** "2024-03" */
  competencia: string;
  valor: number;
}

export interface Despesas {
  total: number;
  documentos: number;
  porTipo: DespesaPorTipo[];
  porMes: DespesaPorMes[];
}

export interface ProposicaoPorTipo {
  /** Nome por extenso: "Requerimento de Audiência Pública". */
  tipo: string;
  /** Sigla da fonte. Varias siglas iguais tem tipos diferentes. */
  sigla: string;
  total: number;
}

export interface ProposicaoRecente {
  id: number;
  sigla: string;
  tipo: string;
  numero: number;
  ano: number;
  ementa: string | null;
  apresentadaEm: string | null;
  paginaOficial: string;
}

/**
 * Autoria na Camara.
 *
 * `porTipo` e a visao principal, e NAO existe um total. Entre os dez
 * deputados do ES um apresentou 284 proposicoes e outro 2.843, com a
 * diferenca quase toda em requerimento. Um numero unico leria como
 * "produtivo" contra "improdutivo" — o ranking involuntario que a
 * regra 4 proibe. `recentes` existe para a ficha poder dizer DO QUE se
 * trata, nao so quantas foram.
 */
export interface Proposicoes {
  porTipo: ProposicaoPorTipo[];
  recentes: ProposicaoRecente[];
}

export interface Parlamentar {
  id: string;
  idExterno: number;
  cargo: "Deputado Federal";
  uf: string;
  nomeUrna: string;
  nomeCivil: string;
  partido: string | null;
  /** Siglas pelas quais passou na legislatura, na ordem da fonte. */
  siglasNaLegislatura: string[];
  trocouDePartido: boolean;
  situacao: string | null;
  condicaoEleitoral: string | null;
  dataNascimento: string | null;
  ufNascimento: string | null;
  escolaridade: string | null;
  urlFotoOficial: string | null;
  paginaOficial: string;
  despesas: Despesas;
  proposicoes: Proposicoes;
}

/**
 * Denominador da bancada. Nenhum total de despesa vai para a tela sem
 * estes numeros ao lado: valor absoluto sozinho vira ranking
 * involuntario. Ver docs/principios.md, regra 4.
 */
export interface ReferenciaBancada {
  bancada: number;
  medianaDespesas: number;
  menor: number;
  maior: number;
}

export interface ArquivoParlamentares {
  fonte: Fonte;
  uf: string;
  legislatura: number;
  coletadoEm: string;
  referencia: ReferenciaBancada;
  parlamentares: Parlamentar[];
}

/* ------------------------------------------------------------------ */
/*  Votacoes nominais do plenario — Camara                             */
/* ------------------------------------------------------------------ */

/**
 * Como um parlamentar do estado votou numa votacao.
 *
 * `voto` e a direcao ("Sim", "Não", "Abstenção") e pode ser nula.
 * `registro` e a palavra crua da fonte, que no Senado distingue
 * ausencia justificada, licenca e voto secreto. A Camara so devolve
 * direcao, entao la os dois campos coincidem.
 */
export interface VotoDoEstado {
  idExterno: number;
  nome: string;
  partido: string | null;
  voto: string | null;
  registro?: string | null;
}

export interface ProposicaoVotada {
  id: number;
  sigla: string | null;
  numero: number | null;
  ano: number | null;
  ementa: string | null;
  paginaOficial: string;
}

export interface VotacaoCamara {
  id: string;
  data: string | null;
  registradaEm: string | null;
  descricao: string | null;
  aprovada: boolean;
  proposicao: ProposicaoVotada | null;
  /** Contado dos votos individuais, nunca lido do texto da fonte. */
  placar: { voto: string; total: number }[];
  votantes: number;
  votosDoEstado: VotoDoEstado[];
}

/**
 * O criterio vai junto com a lista, e nao no codigo da pagina: sem ele
 * "20 votações" parece selecao editorial em vez de recorte mecanico
 * pelas mais recentes.
 */
export interface CriterioVotacoes {
  orgao: string;
  tipo: string;
  quantidade: number;
  ordem: string;
  sondagens: number;
}

export interface ArquivoVotacoes {
  fonte: Fonte;
  uf: string;
  legislatura: number;
  coletadoEm: string;
  criterio: CriterioVotacoes;
  votacoes: VotacaoCamara[];
}

/** Estado de busca e filtros, espelhado na query string da URL. */
export interface EstadoFiltros {
  busca: string;
  cargo: Cargo | null;
  partidos: string[];
  situacoes: string[];
}

/* ------------------------------------------------------------------ */
/*  Mandato em exercicio — Senado Federal                              */
/* ------------------------------------------------------------------ */

export interface MandatoSenado {
  uf: string;
  participacao: string | null;
  inicio: string | null;
  fim: string | null;
}

export interface MateriaAutoria {
  id: string;
  identificacao: string | null;
  sigla: string | null;
  numero: string | null;
  ano: number;
  ementa: string | null;
  data: string | null;
  /** Autor principal, distinto de coautor. A fonte separa os dois. */
  autorPrincipal: boolean;
}

export interface Senador {
  id: string;
  idExterno: number;
  cargo: "Senador";
  uf: string;
  nomeUrna: string;
  nomeCivil: string;
  partido: string | null;
  mandato: MandatoSenado | null;
  materias: MateriaAutoria[];
  /**
   * Agrupamento por tipo, nunca um total unico: um requerimento de
   * sessao solene e um projeto de lei pesam muito diferente, e somar os
   * dois num numero so descreveria mal.
   */
  materiasPorTipo: { sigla: string; total: number }[];
  paginaOficial: string;
}

/**
 * Votacao de plenario no Senado.
 *
 * `secreta` nao e detalhe burocratico: dois tercos das votacoes
 * nominais do periodo sao secretas, quase todas de indicacao de
 * autoridade. Nelas a fonte publica "Votou" — que a pessoa votou, nao
 * como —, e a tela precisa dizer isso, sob pena de o campo mudo ser
 * lido como ausencia.
 */
export interface VotacaoSenado {
  id: string;
  data: string | null;
  /** "PLP 55/2026" */
  materia: string | null;
  ementa: string | null;
  descricao: string | null;
  resultado: string | null;
  secreta: boolean;
  votosDoEstado: VotoDoEstado[];
}

export interface ArquivoSenadores {
  fonte: Fonte;
  uf: string;
  anos: number[];
  coletadoEm: string;
  senadores: Senador[];
  /**
   * Fora dos senadores de proposito: os tres votam nas mesmas sessoes,
   * e repetir a ementa dentro de cada um triplicava o arquivo, que e
   * commitado todo dia.
   */
  votacoes: VotacaoSenado[];
}
