/**
 * Tipos das entidades do prototipo.
 * Todos os dados sao ficticios; os tipos, porem, ja preveem o formato
 * que virá de uma coleta real (proveniencia, data de coleta, url de origem).
 */

export type Cargo = "Governador" | "Senador";

export type SituacaoRegistro =
  | "Deferido"
  | "Deferido com recurso"
  | "Sub judice"
  | "Indeferido";

export type Genero = "Masculino" | "Feminino";

export type CorRaca = "Branca" | "Preta" | "Parda" | "Amarela" | "Indígena";

export type Escolaridade =
  | "Ensino Fundamental Completo"
  | "Ensino Médio Incompleto"
  | "Ensino Médio Completo"
  | "Superior Incompleto"
  | "Superior Completo";

/** Voto registrado em uma votacao nominal. */
export type Voto = "Sim" | "Não" | "Abstenção" | "Obstrução" | "Ausente";

export interface Partido {
  id: string;
  nome: string;
  sigla: string;
  numero: number;
  /** Cor usada apenas na pastilha identificadora, nunca como fundo de cartao. */
  cor: string;
}

export interface Bem {
  ordem: number;
  tipo: string;
  descricao: string;
  /** Valor nominal declarado, em reais, sem correcao pela inflacao. */
  valorNominal: number;
}

export interface BemHistorico {
  ano: number;
  valorTotal: number;
}

export interface Mandato {
  cargo: string;
  inicio: string;
  fim: string | null;
  casa: string;
}

export interface Votacao {
  id: string;
  data: string;
  /** Tipo da proposicao: PL, PEC, PDL, REQ... */
  tipo: string;
  numero: number;
  ano: number;
  ementa: string;
  voto: Voto;
  urlOficial: string;
}

export interface Presenca {
  presente: number;
  ausenciaJustificada: number;
  licenca: number;
  missaoOficial: number;
  ausenciaSemJustificativa: number;
}

export interface Atuacao {
  legislatura: string;
  proposicoesAutorPrincipal: number;
  proposicoesCoautor: number;
  votacoes: Votacao[];
  presenca: Presenca;
}

export interface PropostaDocumento {
  paginas: number;
  urlOriginal: string;
  urlEspelho: string;
  coletadoEm: string;
  hash: string;
}

export interface Proveniencia {
  fonte: string;
  coletadoEm: string;
  urlOriginal: string;
}

export interface Candidato {
  id: string;
  nomeUrna: string;
  nomeCivil: string;
  /** Numero de urna. Governador tem 2 digitos, Senador tem 3. */
  numero: number;
  cargo: Cargo;
  partidoId: string;
  coligacao: string;
  uf: string;
  dataNascimento: string;
  genero: Genero;
  corRaca: CorRaca;
  escolaridade: Escolaridade;
  ocupacaoDeclarada: string;
  situacaoRegistro: SituacaoRegistro;
  disputaReeleicao: boolean;
  /** Placeholder gerado por codigo. Nenhuma foto real e usada no prototipo. */
  fotoUrl: string | null;
  propostaResumo: string;
  propostaDocumento: PropostaDocumento;
  bens: Bem[];
  bensHistorico: BemHistorico[];
  mandatos: Mandato[];
  /** null quando a pessoa nunca exerceu mandato. */
  atuacao: Atuacao | null;
  proveniencia: Proveniencia;
}

/** Estado de busca e filtros, espelhado na query string da URL. */
export interface EstadoFiltros {
  busca: string;
  cargo: Cargo | null;
  partidos: string[];
  situacoes: SituacaoRegistro[];
  reeleicao: "sim" | "nao" | null;
  generos: Genero[];
  coresRaca: CorRaca[];
  faixasEtarias: string[];
  escolaridades: Escolaridade[];
  ordem: "sorteada" | "nome" | "numero";
}
