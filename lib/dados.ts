import candidatosJson from "@/data/candidatos.json";
import partidosJson from "@/data/partidos.json";
import type { Candidato, Cargo, Partido } from "@/types";

/**
 * Acesso aos dados ficticios.
 *
 * Tudo vem de JSON estatico, sem banco e sem chamada de rede. Os arquivos
 * sao gerados por `npm run dados` (scripts/gerar-dados.mjs).
 */

export const candidatos = candidatosJson as unknown as Candidato[];
export const partidos = partidosJson as unknown as Partido[];

const porId = new Map(candidatos.map((c) => [c.id, c]));
const partidoPorId = new Map(partidos.map((p) => [p.id, p]));

export function obterCandidato(id: string): Candidato | undefined {
  return porId.get(id);
}

export function obterPartido(id: string): Partido {
  const partido = partidoPorId.get(id);
  if (!partido) throw new Error(`Partido desconhecido: ${id}`);
  return partido;
}

export function candidatosPorCargo(cargo: Cargo): Candidato[] {
  return candidatos.filter((c) => c.cargo === cargo);
}

/** Fonte unica usada nos rotulos de proveniencia das paginas estaticas. */
export const FONTE_PADRAO =
  "Tribunal Eleitoral Fictício de Serra Verde (TEF-SV) — dados de exemplo";

export const DATA_COLETA = "2026-08-14";

/** Data em que os textos escritos pela plataforma foram revisados. */
export const DATA_REVISAO = "2026-08-20";

export const ESTADO = {
  nome: "Serra Verde",
  sigla: "SV",
  anoEleicao: 2026,
};
