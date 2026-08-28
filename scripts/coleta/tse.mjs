import {
  atualizarManifesto,
  buscarJson,
  guardarBruto,
} from "./comum.mjs";
import {
  ANO,
  CARGOS,
  ID_ELEICAO,
  UF,
  gravarCandidaturas,
  normalizar,
} from "./tse-normalizar.mjs";

/**
 * Coleta: candidaturas de 2026 no Espirito Santo (+ Presidente).
 *
 * Fonte: DivulgaCandContas do TSE. Ver docs/fontes-de-dados.md.
 *
 * NAO precisa de navegador headless. O bloqueio da Akamai que derruba
 * o `curl` nao atinge o `fetch` do Node — a diferenca esta na
 * impressao TLS do cliente, nao no User-Agent. Testado em 27/08/2026.
 *
 * As regras de normalizacao vivem em tse-normalizar.mjs, para que
 * corrigir uma regra nao custe 575 requisicoes ao servico publico.
 *
 * Roda com: npm run coleta:tse
 */

const API = "https://divulgacandcontas.tse.jus.br/divulga/rest/v1";

/** Quantas fichas buscar ao mesmo tempo. Baixo de proposito: e um
 *  servico publico, nao um alvo de carga. */
const SIMULTANEAS = 5;

async function emLotes(itens, tamanho, tarefa) {
  const saida = [];
  for (let i = 0; i < itens.length; i += tamanho) {
    const lote = itens.slice(i, i + tamanho);
    saida.push(...(await Promise.all(lote.map(tarefa))));
    process.stdout.write(
      `\r    ${Math.min(i + tamanho, itens.length)}/${itens.length}   `,
    );
  }
  process.stdout.write("\r");
  return saida;
}

/**
 * Descarta o que nao pode ser republicado.
 *
 * CPF e titulo de eleitor vem no retorno do TSE e sao identificadores
 * pessoais. Sao removidos AQUI, antes de qualquer gravacao — nem o
 * snapshot bruto os conserva. Dado que nao e gravado nao vaza.
 */
function limpar(ficha) {
  const {
    cpf,
    tituloEleitor,
    fileInputStream,
    fileByteArray,
    numeroProcessoEncrypt,
    numeroProcessoDrapEncrypt,
    numeroProcessoPrestContasEncrypt,
    ...resto
  } = ficha;
  if (Array.isArray(resto.arquivos)) {
    resto.arquivos = resto.arquivos.map(
      ({ fileInputStream: _a, fileByteArray: _b, ...arq }) => arq,
    );
  }
  return resto;
}

async function coletarCargo(cargo, proveniencias) {
  const urlLista = `${API}/candidatura/listar/${ANO}/${cargo.ue}/${ID_ELEICAO}/${cargo.codigo}/candidatos`;
  const { texto, dados } = await buscarJson(urlLista);
  proveniencias.push(
    await guardarBruto(
      `tse/lista-${cargo.ue}-${cargo.codigo}.json`,
      texto,
      urlLista,
    ),
  );

  const candidatos = dados.candidatos ?? [];
  console.log(`  ${cargo.nome}: ${candidatos.length} candidaturas`);

  const fichas = await emLotes(candidatos, SIMULTANEAS, async (c) => {
    const url = `${API}/candidatura/buscar/${ANO}/${cargo.ue}/${ID_ELEICAO}/candidato/${c.id}`;
    const { dados: ficha } = await buscarJson(url);
    return limpar(ficha);
  });

  proveniencias.push(
    await guardarBruto(
      `tse/fichas-${cargo.ue}-${cargo.codigo}.json`,
      JSON.stringify(fichas),
      `${API}/candidatura/buscar/${ANO}/${cargo.ue}/${ID_ELEICAO}/candidato/{id}`,
    ),
  );

  return fichas.map((f) => normalizar(f, cargo));
}

async function principal() {
  const proveniencias = [];
  console.log(`Coletando candidaturas de ${ANO} — ${UF} (+ Presidente).`);

  const candidaturas = [];
  for (const cargo of CARGOS) {
    candidaturas.push(...(await coletarCargo(cargo, proveniencias)));
  }

  await atualizarManifesto("tse", proveniencias);
  await gravarCandidaturas(candidaturas);

  const estreantes = candidaturas.filter((c) => c.primeiraCandidatura).length;
  const comProposta = candidaturas.filter((c) => c.proposta.documento).length;

  console.log(`\nTotal: ${candidaturas.length} candidaturas.`);
  console.log(`  primeira candidatura: ${estreantes}`);
  console.log(`  com proposta de governo: ${comProposta}`);
}

principal().catch((erro) => {
  console.error("\nColeta do TSE falhou:", erro.message);
  process.exitCode = 1;
});
