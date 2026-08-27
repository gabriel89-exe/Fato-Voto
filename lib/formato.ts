/**
 * Formatacao de datas, valores e numeros.
 *
 * As datas vem dos JSON no formato ISO curto (2026-08-14) e sao lidas
 * manualmente, sem `new Date(string)`, para nao mudar de dia conforme o
 * fuso horario de quem abre a pagina.
 */

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function partes(iso: string): [number, number, number] {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return [ano, mes, dia];
}

/** 2026-08-14 -> "14/08/2026" */
export function dataCurta(iso: string): string {
  const [ano, mes, dia] = partes(iso);
  return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`;
}

/** 2026-08-14 -> "14 de agosto de 2026" */
export function dataPorExtenso(iso: string): string {
  const [ano, mes, dia] = partes(iso);
  return `${dia} de ${MESES[mes - 1]} de ${ano}`;
}

/** 2026-08-14 -> "agosto de 2026" */
export function mesAno(iso: string): string {
  const [ano, mes] = partes(iso);
  return `${MESES[mes - 1]} de ${ano}`;
}

/** Idade completa em uma data de referencia (padrao: dia da eleicao). */
export function idadeEm(nascimento: string, referencia = "2026-10-04"): number {
  const [anoN, mesN, diaN] = partes(nascimento);
  const [anoR, mesR, diaR] = partes(referencia);
  let idade = anoR - anoN;
  if (mesR < mesN || (mesR === mesN && diaR < diaN)) idade -= 1;
  return idade;
}

const REAIS = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

/** 1243500 -> "R$ 1.243.500" */
export function reais(valor: number): string {
  return REAIS.format(valor);
}

const NUMEROS = new Intl.NumberFormat("pt-BR");

export function numero(valor: number): string {
  return NUMEROS.format(valor);
}

/**
 * Percentual com uma casa decimal. Usado apenas para descrever a composicao
 * de um grafico, nunca para comparar candidaturas entre si.
 */
export function percentual(parte: number, total: number): string {
  if (total === 0) return "0%";
  const p = (parte / total) * 100;
  return `${p.toFixed(1).replace(".", ",").replace(",0", "")}%`;
}

/** "Amanda Ferraz" -> "AF" (usado no avatar gerado por codigo). */
export function iniciais(nome: string): string {
  const palavras = nome
    .split(/\s+/)
    .filter((p) => p.length > 2 && !["dos", "das", "dona"].includes(p.toLowerCase()));
  const primeira = palavras[0]?.[0] ?? "";
  const ultima = palavras.length > 1 ? palavras[palavras.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}
