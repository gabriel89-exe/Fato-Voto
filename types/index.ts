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

/** Estado de busca e filtros, espelhado na query string da URL. */
export interface EstadoFiltros {
  busca: string;
  cargo: Cargo | null;
  partidos: string[];
  situacoes: string[];
}
