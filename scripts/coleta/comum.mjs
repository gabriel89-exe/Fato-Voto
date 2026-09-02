import { createHash } from "node:crypto";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * Base da camada de coleta.
 *
 * Regra que governa este arquivo inteiro: NADA e exibido no site sem
 * que exista, em disco, o documento cru de onde o numero saiu, com a
 * data em que foi baixado e o hash do conteudo. Se um candidato
 * contestar um dado, a resposta tem de ser "este e o arquivo, desta
 * hora, com esta impressao digital" — nao "o portal dizia isso".
 *
 * Por isso a coleta grava sempre em duas camadas:
 *
 *   dados-brutos/  resposta original, intacta, + manifesto de hashes.
 *                  Fora do git (e grande e reproduzivel).
 *   data/es/       o normalizado que o site le. Pequeno e versionado.
 */

export const RAIZ_BRUTA = "dados-brutos";
export const RAIZ_NORMALIZADA = join("data", "es");

/** O portal do TSE recusa cliente sem cara de navegador. */
const AGENTE =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/127.0 Safari/537.36";

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Teto para o `Retry-After`: servidor pode pedir mais do que cabe aqui. */
const ESPERA_MAXIMA_MS = 60_000;

/**
 * Le o `Retry-After` de uma resposta 429.
 *
 * O cabecalho vem em segundos ("30") ou como data HTTP. Devolve `null`
 * quando nao existe ou nao da para ler — e ai quem chama usa a espera
 * dobrando de sempre.
 */
function esperaPedidaPeloServidor(cabecalho) {
  if (!cabecalho) return null;

  const segundos = Number(cabecalho);
  if (Number.isFinite(segundos) && segundos >= 0) {
    return Math.min(segundos * 1000, ESPERA_MAXIMA_MS);
  }

  const quando = Date.parse(cabecalho);
  if (Number.isNaN(quando)) return null;
  return Math.min(Math.max(quando - Date.now(), 0), ESPERA_MAXIMA_MS);
}

/**
 * GET com repeticao. Os portais publicos oscilam: 502 e 504 em horario
 * de pico sao normais e passam sozinhos. Falhar na primeira tentativa
 * abortaria uma coleta de meia hora por causa de um soluco de rede.
 *
 * Repetir so vale para falha passageira. Resposta 4xx e deterministica
 * — o servidor entendeu o pedido e recusou —, entao insistir quatro
 * vezes num 400 so multiplica por quatro a carga sobre um servico
 * publico para receber quatro vezes a mesma recusa.
 *
 * COM UMA EXCECAO: 429. Este comentario dizia "4xx e deterministica" e
 * estava errado sobre esse caso — 429 nao e recusa, e "voce esta indo
 * rapido demais, espere". Desistir na hora e a resposta errada para a
 * unica que pede exatamente o contrario.
 *
 * Custou uma coleta em 02/09/2026: rodamos o TSE quatro vezes em uma
 * hora, depurando outra coisa, e a quarta levou 429 na candidatura
 * 210 de 410. O passo morreu em 4 segundos com metade do dado na mao.
 * Se houver `Retry-After`, a espera e a que o servidor pediu; se nao,
 * a mesma espera dobrando das outras falhas.
 *
 * `aceitar404` devolve `null` em vez de lancar, para o caso em que a
 * ausencia do recurso e informacao e nao falha: na Camara ha votacao
 * cujo `/votos` responde 404, e abortar a coleta inteira por causa
 * dela seria perder todas as outras por causa de uma.
 *
 * `cabecalhos` existe para o Portal da Transparencia, que exige a
 * credencial em `chave-api-dados` a cada requisicao. O VALOR nunca
 * aparece em log nem em mensagem de erro daqui — a mensagem carrega a
 * URL, e a URL nao carrega o token. Ver docs/segredos-e-credenciais.md.
 *
 * ==================================================================
 * QUANTA PACIENCIA, E POR QUE ESTA.
 *
 * Em 02/09/2026 a coleta agendada perdeu a Camara inteira — bancada e
 * votacoes — com `fetch failed`, que e erro de CONEXAO: nao houve
 * resposta nenhuma, nem 4xx nem 5xx. O passo durou 47s, e a conta
 * fechava: 4 tentativas penduradas ~10s cada mais 4,8s de pausa. O
 * Senado e o TSE passaram no mesmo job, e a mesma coleta rodou aqui
 * sem erro minutos depois. Foi blip de um ou dois minutos do lado da
 * Camara, e custou os dados do dia.
 *
 * Cinco segundos de espera somada era pouco para uma fonte que este
 * mesmo comentario ja descrevia como oscilante. Agora sao seis
 * tentativas com espera dobrando — 0,8s, 1,6s, 3,2s, 6,4s, 12,8s, um
 * total de ~25s de paciencia — o que atravessa um soluco curto sem
 * transformar a coleta em martelo sobre servico publico.
 *
 * `tempoLimiteMs` existe pelo mesmo episodio: sem teto, cada tentativa
 * ficava ~10s pendurada esperando um pacote que nunca vinha, e o custo
 * de descobrir a falha era quase todo espera morta. Com teto, a
 * tentativa desiste em tempo conhecido.
 *
 * O que NAO mudou: 4xx continua desistindo na primeira. O servidor
 * entendeu o pedido e recusou, e insistir so multiplica a carga para
 * receber a mesma recusa.
 * ==================================================================
 */
export async function buscarJson(
  url,
  {
    tentativas = 6,
    pausaMs = 800,
    aceitar404 = false,
    cabecalhos = {},
    tempoLimiteMs = 15000,
  } = {},
) {
  let ultimoErro;
  for (let i = 1; i <= tentativas; i++) {
    try {
      const resposta = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": AGENTE,
          ...cabecalhos,
        },
        signal: AbortSignal.timeout(tempoLimiteMs),
      });

      if (aceitar404 && resposta.status === 404) return null;

      if (!resposta.ok) {
        const erro = new Error(`HTTP ${resposta.status} em ${url}`);
        erro.status = resposta.status;
        if (resposta.status === 429) {
          erro.esperarMs = esperaPedidaPeloServidor(
            resposta.headers.get("retry-after"),
          );
        }
        throw erro;
      }

      const texto = await resposta.text();
      return { texto, dados: JSON.parse(texto) };
    } catch (erro) {
      ultimoErro = erro;

      /* Recusa definitiva: 4xx, menos o 429, que pede espera. */
      if (erro.status >= 400 && erro.status < 500 && erro.status !== 429) {
        throw erro;
      }

      if (i < tentativas) {
        /*
         * O log de 02/09/2026 nao dizia que houve repeticao: mostrava
         * "Coleta falhou: fetch failed" e mais nada, e quem lesse nao
         * sabia se tinha sido uma tentativa ou dez. Uma linha por
         * tentativa e barata e transforma "falhou" em diagnostico.
         */
        /* A espera do servidor manda; na falta dela, a nossa, dobrando. */
        const pausa = erro.esperarMs ?? pausaMs * 2 ** (i - 1);
        console.warn(
          `  tentativa ${i} de ${tentativas} falhou (${erro.message}). ` +
            `Repetindo em ${(pausa / 1000).toFixed(1)}s` +
            `${erro.esperarMs ? " (espera pedida pelo servidor)" : ""}.`,
        );
        await espera(pausa);
      }
    }
  }

  /*
   * Mensagem final que diz o que foi tentado, nao so o que deu errado.
   *
   * A URL entra so quando ainda nao esta na mensagem. Erro de HTTP ja
   * a carrega; erro de rede, nao — e foi exatamente disso que o log de
   * 02/09/2026 sofreu: "fetch failed", sem dizer nem contra quem.
   */
  const motivo = ultimoErro?.message ?? "falha desconhecida";
  const erro = new Error(
    `${motivo.includes(url) ? motivo : `${motivo} em ${url}`} — depois de ` +
      `${tentativas} tentativas`,
  );
  erro.status = ultimoErro?.status;
  erro.cause = ultimoErro;
  throw erro;
}

/**
 * Percorre uma colecao paginada da API da Camara.
 *
 * ARMADILHA DOCUMENTADA: em /deputados/{id}/despesas o filtro `ano=`
 * devolve lista vazia; o que funciona e `idLegislatura=`. Descoberto na
 * marra em 27/08/2026 — se alguem "consertar" isso trocando de volta
 * para `ano`, a coleta silenciosamente para de trazer despesa.
 */
export async function paginar(urlBase, { limitePaginas = 200 } = {}) {
  const tudo = [];
  let pagina = 1;
  while (pagina <= limitePaginas) {
    const separador = urlBase.includes("?") ? "&" : "?";
    const { dados } = await buscarJson(
      `${urlBase}${separador}pagina=${pagina}&itens=100`,
    );
    const lote = dados.dados ?? [];
    tudo.push(...lote);
    if (lote.length < 100) break;
    pagina++;
  }
  return tudo;
}

export function hash(conteudo) {
  return createHash("sha256").update(conteudo).digest("hex");
}

async function gravar(caminho, conteudo) {
  await mkdir(dirname(caminho), { recursive: true });
  await writeFile(caminho, conteudo, "utf8");
}

/**
 * Guarda a resposta crua e devolve a proveniencia — o objeto que
 * acompanha o dado ate a tela.
 */
export async function guardarBruto(nomeRelativo, conteudo, urlOriginal) {
  const caminho = join(RAIZ_BRUTA, nomeRelativo);
  await gravar(caminho, conteudo);
  return {
    arquivo: nomeRelativo,
    urlOriginal,
    coletadoEm: new Date().toISOString(),
    hash: hash(conteudo),
    bytes: Buffer.byteLength(conteudo, "utf8"),
  };
}

export async function gravarNormalizado(nomeArquivo, dados) {
  await gravar(
    join(RAIZ_NORMALIZADA, nomeArquivo),
    JSON.stringify(dados, null, 2) + "\n",
  );
}

/**
 * Manifesto: a lista do que foi coletado, de onde e quando. E o que
 * alimenta a pagina publica de inventario de fontes.
 */
export async function atualizarManifesto(fonte, entradas) {
  const caminho = join(RAIZ_BRUTA, "manifesto.json");
  let manifesto = {};
  try {
    manifesto = JSON.parse(await readFile(caminho, "utf8"));
  } catch {
    // primeira coleta: manifesto ainda nao existe
  }
  manifesto[fonte] = {
    atualizadoEm: new Date().toISOString(),
    arquivos: entradas,
  };
  await gravar(caminho, JSON.stringify(manifesto, null, 2) + "\n");
  return manifesto;
}

export function reais(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor);
}
