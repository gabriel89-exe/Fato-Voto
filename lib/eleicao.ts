import candidaturasJson from "@/data/es/candidaturas-2026.json";
import parlamentaresJson from "@/data/es/deputados-federais.json";
import senadoresJson from "@/data/es/senadores.json";
import { CARGOS } from "@/types";
import type {
  ArquivoCandidaturas,
  ArquivoParlamentares,
  ArquivoSenadores,
  Candidatura,
  Cargo,
  Parlamentar,
  Senador,
} from "@/types";

/**
 * Acesso aos dados reais coletados.
 *
 * Tudo vem de JSON estatico gerado por scripts/coleta — sem banco e
 * sem chamada de rede em tempo de requisicao. O estado inteiro cabe em
 * poucas centenas de kB, entao a pagina e servida de CDN e a busca
 * roda sobre um indice ja carregado.
 */

const arquivoCandidaturas = candidaturasJson as unknown as ArquivoCandidaturas;
const arquivoParlamentares =
  parlamentaresJson as unknown as ArquivoParlamentares;
const arquivoSenadores = senadoresJson as unknown as ArquivoSenadores;

export const candidaturas = arquivoCandidaturas.candidaturas;
export const parlamentares = arquivoParlamentares.parlamentares;
export const referenciaBancada = arquivoParlamentares.referencia;
export const senadores = arquivoSenadores.senadores;

export const ELEICAO = arquivoCandidaturas.eleicao;
export const FONTE_TSE = arquivoCandidaturas.fonte;
export const FONTE_CAMARA = arquivoParlamentares.fonte;
export const FONTE_SENADO = arquivoSenadores.fonte;
export const COLETADO_EM = arquivoCandidaturas.coletadoEm;
export const COLETADO_EM_CAMARA = arquivoParlamentares.coletadoEm;
export const COLETADO_EM_SENADO = arquivoSenadores.coletadoEm;
export const LEGISLATURA = arquivoParlamentares.legislatura;

export const ESTADO = { nome: "Espírito Santo", sigla: "ES" };

const porId = new Map(candidaturas.map((c) => [c.id, c]));

export function obterCandidatura(id: string): Candidatura | undefined {
  return porId.get(id);
}

/**
 * Liga a candidatura ao mandato de deputado federal em exercicio.
 *
 * As duas fontes nao compartilham identificador — o TSE usa o id da
 * candidatura, a Camara usa o id do parlamentar —, entao o casamento e
 * por nome.
 *
 * CASA PELO NOME CIVIL, nao pelo de urna. O nome de urna e escolhido a
 * cada eleicao e muda: em 2026, tres dos dez deputados do ES trocaram
 * ("Evair Vieira de Melo" virou "EVAIR DE MELO", que ainda por cima
 * concorre ao Senado). Exigir o nome de urna escondia o mandato de
 * justamente quem o eleitor tem mais motivo para consultar.
 *
 * Ambiguidade derruba o vinculo DOS DOIS LADOS: so liga se houver
 * exatamente um parlamentar com aquele nome civil E se esta for a
 * unica candidatura com o mesmo nome — entre as 575 do ES ha um nome
 * civil repetido. Ligar a pessoa errada a um gasto publico seria muito
 * pior que deixar de ligar.
 *
 * Nao filtra por cargo de proposito: deputado federal em exercicio que
 * disputa outro cargo continua tendo mandato. A aba diz com todas as
 * letras que o mandato e de deputado federal, para ninguem confundir
 * com o cargo em disputa.
 */
export function obterMandato(candidatura: Candidatura): Parlamentar | null {
  const civil = normalizar(candidatura.nomeCompleto);

  const homonimas = candidaturas.filter(
    (c) => normalizar(c.nomeCompleto) === civil,
  );
  if (homonimas.length !== 1) return null;

  const achados = parlamentares.filter(
    (p) => normalizar(p.nomeCivil) === civil,
  );
  return achados.length === 1 ? achados[0] : null;
}

/**
 * Liga a candidatura ao mandato de senador em exercicio.
 *
 * Mesma regra do mandato de deputado (`obterMandato`): casa pelo nome
 * civil e desiste na menor ambiguidade, dos dois lados.
 *
 * Na coleta de 28/08/2026, dois dos tres senadores do ES sao
 * candidatos e ganham a aba; Magno Malta esta em exercicio com mandato
 * ate 2031 e nao disputa, entao nao aparece no site — o que esta
 * certo, porque o site lista quem esta na disputa.
 */
export function obterMandatoSenado(candidatura: Candidatura): Senador | null {
  const civil = normalizar(candidatura.nomeCompleto);

  const homonimas = candidaturas.filter(
    (c) => normalizar(c.nomeCompleto) === civil,
  );
  if (homonimas.length !== 1) return null;

  const achados = senadores.filter((s) => normalizar(s.nomeCivil) === civil);
  return achados.length === 1 ? achados[0] : null;
}

export function contarPorCargo(): { cargo: Cargo; total: number }[] {
  const contagem = new Map<Cargo, number>();
  for (const c of candidaturas) {
    contagem.set(c.cargo, (contagem.get(c.cargo) ?? 0) + 1);
  }
  return [...contagem.entries()].map(([cargo, total]) => ({ cargo, total }));
}

export function partidosDistintos(): string[] {
  const siglas = new Set<string>();
  for (const c of candidaturas) if (c.partido) siglas.add(c.partido.sigla);
  return [...siglas].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function situacoesDistintas(): string[] {
  const s = new Set<string>();
  for (const c of candidaturas) if (c.situacaoRegistro) s.add(c.situacaoRegistro);
  return [...s].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

/* ------------------------------------------------------------------ */
/*  Busca                                                              */
/* ------------------------------------------------------------------ */

/** Minusculas e sem acento, para "goncalves" achar "Gonçalves". */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    // Faixa U+0300–U+036F: os diacríticos que o NFD separou da letra.
    // Aparece como um borrão no editor porque são caracteres
    // combinantes — é isso mesmo, não é corrupção de arquivo.
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Busca por nome ou por PREFIXO do numero de urna.
 *
 * Prefixo e nao igualdade porque e assim que a pessoa digita na urna:
 * comecar a digitar "1" ja deve mostrar 10, 13, 15.
 */
export function buscar(lista: Candidatura[], termo: string): Candidatura[] {
  const t = normalizar(termo);
  if (!t) return lista;

  const soDigitos = /^\d+$/.test(t);
  return lista.filter((c) => {
    if (soDigitos && String(c.numero).startsWith(t)) return true;
    return (
      normalizar(c.nomeUrna).includes(t) ||
      normalizar(c.nomeCompleto).includes(t)
    );
  });
}

/* ------------------------------------------------------------------ */
/*  Sorteio                                                            */
/* ------------------------------------------------------------------ */

/** Gerador determinístico simples (mulberry32). */
function gerador(semente: number) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sementeDe(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** "2026-08-27" no fuso de Brasília, sem depender do relógio de quem lê. */
export function diaDeHoje(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Ordem sorteada — o padrao do site.
 *
 * A semente e FIXA POR DIA, nao por requisicao. Duas consequencias
 * pretendidas: a ordem nao embaralha quando a pessoa abre uma ficha e
 * volta, e o sorteio fica auditavel (a ordem de um dia e reproduzivel
 * por qualquer um que rode este codigo com a mesma data).
 *
 * Ver docs/principios.md, regra 1.
 */
export function sortear<T>(lista: T[], dia = diaDeHoje()): T[] {
  const aleatorio = gerador(sementeDe(dia));
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/* ------------------------------------------------------------------ */
/*  Filtros facetados                                                  */
/* ------------------------------------------------------------------ */

export interface Filtros {
  busca: string;
  cargo: Cargo | null;
  partidos: string[];
  situacoes: string[];
  generos: string[];
  coresRaca: string[];
  escolaridades: string[];
}

export const FILTROS_VAZIOS: Filtros = {
  busca: "",
  cargo: null,
  partidos: [],
  situacoes: [],
  generos: [],
  coresRaca: [],
  escolaridades: [],
};

/** As dimensões facetadas, na ordem em que aparecem na tela. */
export const DIMENSOES = [
  { chave: "partidos", rotulo: "Partido", campo: (c: Candidatura) => c.partido?.sigla ?? null },
  { chave: "situacoes", rotulo: "Situação do registro", campo: (c: Candidatura) => c.situacaoRegistro },
  { chave: "escolaridades", rotulo: "Escolaridade", campo: (c: Candidatura) => c.escolaridade },
  { chave: "generos", rotulo: "Gênero (autodeclarado)", campo: (c: Candidatura) => c.genero },
  { chave: "coresRaca", rotulo: "Cor ou raça (autodeclarada)", campo: (c: Candidatura) => c.corRaca },
] as const;

export type ChaveDimensao = (typeof DIMENSOES)[number]["chave"];

/** Lê o estado de filtro da query string. Um só valor ou vários. */
export function filtrosDaQuery(
  params: Record<string, string | string[] | undefined>,
): Filtros {
  const varios = (v: string | string[] | undefined): string[] =>
    v === undefined ? [] : Array.isArray(v) ? v : [v];

  const cargo = typeof params.cargo === "string" ? params.cargo : null;

  return {
    busca: typeof params.busca === "string" ? params.busca.trim() : "",
    cargo: CARGOS.includes(cargo as Cargo) ? (cargo as Cargo) : null,
    partidos: varios(params.partidos),
    situacoes: varios(params.situacoes),
    generos: varios(params.generos),
    coresRaca: varios(params.coresRaca),
    escolaridades: varios(params.escolaridades),
  };
}

/**
 * Aplica os recortes.
 *
 * `pular` deixa uma dimensão de fora — é o que permite contar as
 * facetas corretamente: a contagem ao lado de "PL" tem de considerar
 * todos os outros filtros ativos, mas NÃO o filtro de partido, senão
 * toda opção não marcada apareceria com zero.
 */
export function aplicarFiltros(
  lista: Candidatura[],
  f: Filtros,
  pular?: ChaveDimensao,
): Candidatura[] {
  let saida = lista;

  if (f.cargo) saida = saida.filter((c) => c.cargo === f.cargo);

  for (const d of DIMENSOES) {
    if (d.chave === pular) continue;
    const selecionados = f[d.chave];
    if (selecionados.length === 0) continue;
    saida = saida.filter((c) => {
      const valor = d.campo(c);
      return valor !== null && selecionados.includes(valor);
    });
  }

  if (f.busca) saida = buscar(saida, f.busca);
  return saida;
}

export interface Faceta {
  chave: ChaveDimensao;
  rotulo: string;
  opcoes: { valor: string; total: number; marcada: boolean }[];
}

/**
 * Monta as opções de cada dimensão, já com a contagem que o recorte
 * atual produziria. Opção com zero resultado continua na lista, mas
 * desabilitada: sumir com ela faria a interface parecer instável.
 */
export function montarFacetas(lista: Candidatura[], f: Filtros): Faceta[] {
  return DIMENSOES.map((d) => {
    const base = aplicarFiltros(lista, f, d.chave);
    const contagem = new Map<string, number>();
    for (const c of base) {
      const valor = d.campo(c);
      if (valor) contagem.set(valor, (contagem.get(valor) ?? 0) + 1);
    }

    /* Todos os valores possíveis, não só os do recorte atual: uma opção
       marcada precisa continuar visível mesmo quando zera. */
    const universo = new Set<string>();
    for (const c of lista) {
      const valor = d.campo(c);
      if (valor) universo.add(valor);
    }

    const selecionados = f[d.chave];
    const opcoes = [...universo]
      .map((valor) => ({
        valor,
        total: contagem.get(valor) ?? 0,
        marcada: selecionados.includes(valor),
      }))
      .sort((a, b) => b.total - a.total || a.valor.localeCompare(b.valor, "pt-BR"));

    return { chave: d.chave, rotulo: d.rotulo, opcoes };
  });
}

/** Quantos recortes estão ativos, para o rótulo do botão no celular. */
export function contarRecortes(f: Filtros): number {
  return DIMENSOES.reduce((s, d) => s + f[d.chave].length, 0);
}
