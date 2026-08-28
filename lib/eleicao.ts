import candidaturasJson from "@/data/es/candidaturas-2026.json";
import parlamentaresJson from "@/data/es/deputados-federais.json";
import type {
  ArquivoCandidaturas,
  ArquivoParlamentares,
  Candidatura,
  Cargo,
  Parlamentar,
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

export const candidaturas = arquivoCandidaturas.candidaturas;
export const parlamentares = arquivoParlamentares.parlamentares;
export const referenciaBancada = arquivoParlamentares.referencia;

export const ELEICAO = arquivoCandidaturas.eleicao;
export const FONTE_TSE = arquivoCandidaturas.fonte;
export const FONTE_CAMARA = arquivoParlamentares.fonte;
export const COLETADO_EM = arquivoCandidaturas.coletadoEm;
export const COLETADO_EM_CAMARA = arquivoParlamentares.coletadoEm;
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
