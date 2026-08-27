/**
 * Gerador dos dados ficticios do prototipo.
 *
 * Rode com: npm run dados
 *
 * TUDO aqui e inventado: partidos, siglas, numeros, pessoas, municipios,
 * proposicoes e valores. Nada corresponde a pessoa, partido ou orgao real.
 * O gerador usa uma semente fixa, entao rodar de novo produz exatamente o
 * mesmo conjunto de dados (o prototipo fica estavel entre execucoes).
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SEMENTE = 20260315;
const ANO_ELEICAO = 2026;
const DATA_COLETA = "2026-08-14";

/* ---------------------------------------------------------------- PRNG --- */

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(SEMENTE);
const inteiro = (min, max) => min + Math.floor(rnd() * (max - min + 1));
const escolher = (lista) => lista[Math.floor(rnd() * lista.length)];

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/** Escolhe um item conforme pesos. Os mesmos pesos valem para todo mundo. */
function escolherComPeso(pares) {
  const total = pares.reduce((s, [, p]) => s + p, 0);
  let sorteio = rnd() * total;
  for (const [valor, peso] of pares) {
    sorteio -= peso;
    if (sorteio <= 0) return valor;
  }
  return pares[pares.length - 1][0];
}

const dataISO = (ano, mes, dia) =>
  `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

const contarPalavras = (texto) => texto.trim().split(/\s+/).length;

/** Hash curto e falso, so para o cartao de documento parecer completo. */
function hashFalso() {
  const alfabeto = "0123456789abcdef";
  let s = "";
  for (let i = 0; i < 40; i++) s += alfabeto[inteiro(0, 15)];
  return `sha256:${s}`;
}

function semAcento(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ------------------------------------------------------------ PARTIDOS --- */

/**
 * Numeros escolhidos de proposito fora da faixa usada por legendas reais.
 * Efeito colateral aceito: nenhum candidato tem numero comecando em 1.
 */
const PARTIDOS = [
  { id: "mrc", nome: "Movimento Renovação Cidadã", sigla: "MRC", numero: 24, cor: "#4b6b8a" },
  { id: "pup", nome: "Partido União Progressista", sigla: "PUP", numero: 32, cor: "#6b5b8a" },
  { id: "adp", nome: "Aliança Democrática Popular", sigla: "ADP", numero: 38, cor: "#3f7f80" },
  { id: "pgp", nome: "Partido da Gestão Pública", sigla: "PGP", numero: 46, cor: "#8a6b3f" },
  { id: "fci", nome: "Frente Cívica Independente", sigla: "FCI", numero: 52, cor: "#7a4f63" },
  { id: "mps", nome: "Movimento Popular Solidário", sigla: "MPS", numero: 61, cor: "#4f7a5c" },
  { id: "phc", nome: "Partido Horizonte Comum", sigla: "PHC", numero: 74, cor: "#5c6f8a" },
  { id: "urn", nome: "União Reformista Nacional", sigla: "URN", numero: 88, cor: "#8a5a4f" },
];

const COLIGACOES = [
  "Coligação Serra Verde em Movimento",
  "Coligação Compromisso com o Interior",
  "Coligação Gestão e Serviço Público",
  "Coligação Frente das Cidades",
  "Candidatura sem coligação",
];

const MUNICIPIOS = [
  "Alto Cristalino",
  "Ribeirão das Palmas",
  "Campo Sereno",
  "Vila Aurora",
  "Barra do Cedro",
  "Serra Alta",
  "Lagoa das Garças",
  "Porto Guaraci",
  "Monte Claro do Norte",
  "Cachoeira Azul",
  "Vale do Cedro",
  "Itaimbé",
];

const ESCOLARIDADES = [
  "Ensino Fundamental Completo",
  "Ensino Médio Incompleto",
  "Ensino Médio Completo",
  "Superior Incompleto",
  "Superior Completo",
];

/* ------------------------------------------------------------- PESSOAS --- */

/**
 * Nomes inventados. Escritos a mao (em vez de sorteados) para garantir
 * diversidade equilibrada de genero, idade, cor/raca e regiao, e para evitar
 * coincidencia com nomes de pessoas publicas reais.
 */
const PESSOAS = [
  // --- Governador (8) ---
  { nomeCivil: "Amanda Ferraz de Lucena", nomeUrna: "Amanda Ferraz", cargo: "Governador", genero: "Feminino", corRaca: "Parda", idade: 47, base: "Alto Cristalino", ocupacao: "Administradora", escolaridade: "Superior Completo" },
  { nomeCivil: "Otávio Bittencourt Rangel", nomeUrna: "Otávio Rangel", cargo: "Governador", genero: "Masculino", corRaca: "Branca", idade: 58, base: "Serra Alta", ocupacao: "Engenheiro civil", escolaridade: "Superior Completo" },
  { nomeCivil: "Iracema Nunes do Vale", nomeUrna: "Iracema do Vale", cargo: "Governador", genero: "Feminino", corRaca: "Indígena", idade: 41, base: "Itaimbé", ocupacao: "Professora do ensino básico", escolaridade: "Superior Completo" },
  { nomeCivil: "Sérgio Kimura Tavares", nomeUrna: "Sérgio Kimura", cargo: "Governador", genero: "Masculino", corRaca: "Amarela", idade: 53, base: "Porto Guaraci", ocupacao: "Empresário", escolaridade: "Superior Incompleto" },
  { nomeCivil: "Marlene Aparecida Godoi", nomeUrna: "Professora Marlene", cargo: "Governador", genero: "Feminino", corRaca: "Preta", idade: 62, base: "Ribeirão das Palmas", ocupacao: "Professora do ensino básico", escolaridade: "Superior Completo" },
  { nomeCivil: "Hélio Braga Sampaio", nomeUrna: "Hélio Sampaio", cargo: "Governador", genero: "Masculino", corRaca: "Parda", idade: 36, base: "Campo Sereno", ocupacao: "Analista de sistemas", escolaridade: "Superior Completo" },
  { nomeCivil: "Cleide Marques Bastos", nomeUrna: "Cleide Bastos", cargo: "Governador", genero: "Feminino", corRaca: "Branca", idade: 44, base: "Vila Aurora", ocupacao: "Advogada", escolaridade: "Superior Completo" },
  { nomeCivil: "Joaquim Teodoro Vasques", nomeUrna: "Joaquim Vasques", cargo: "Governador", genero: "Masculino", corRaca: "Preta", idade: 50, base: "Barra do Cedro", ocupacao: "Servidor público estadual", escolaridade: "Ensino Médio Completo" },

  // --- Senador (18) ---
  { nomeCivil: "Bruna Sacchi Delmiro", nomeUrna: "Bruna Sacchi", cargo: "Senador", genero: "Feminino", corRaca: "Branca", idade: 39, base: "Alto Cristalino", ocupacao: "Médica", escolaridade: "Superior Completo" },
  { nomeCivil: "Edvaldo Pinho Tabosa", nomeUrna: "Edvaldo Tabosa", cargo: "Senador", genero: "Masculino", corRaca: "Parda", idade: 61, base: "Lagoa das Garças", ocupacao: "Agricultor", escolaridade: "Ensino Fundamental Completo" },
  { nomeCivil: "Nayara Quintanilha Rocha", nomeUrna: "Nayara Quintanilha", cargo: "Senador", genero: "Feminino", corRaca: "Preta", idade: 34, base: "Cachoeira Azul", ocupacao: "Assistente social", escolaridade: "Superior Completo" },
  { nomeCivil: "Rogério Amancio Leite", nomeUrna: "Rogério Amancio", cargo: "Senador", genero: "Masculino", corRaca: "Branca", idade: 49, base: "Serra Alta", ocupacao: "Comerciante", escolaridade: "Ensino Médio Completo" },
  { nomeCivil: "Terezinha do Amparo Sousa", nomeUrna: "Dona Terezinha", cargo: "Senador", genero: "Feminino", corRaca: "Parda", idade: 66, base: "Monte Claro do Norte", ocupacao: "Aposentada", escolaridade: "Ensino Médio Incompleto" },
  { nomeCivil: "Wilson Kuroda Estevão", nomeUrna: "Wilson Kuroda", cargo: "Senador", genero: "Masculino", corRaca: "Amarela", idade: 45, base: "Porto Guaraci", ocupacao: "Contador", escolaridade: "Superior Completo" },
  { nomeCivil: "Fabiana Correia Muniz", nomeUrna: "Fabiana Muniz", cargo: "Senador", genero: "Feminino", corRaca: "Branca", idade: 42, base: "Vila Aurora", ocupacao: "Jornalista", escolaridade: "Superior Completo" },
  { nomeCivil: "Anselmo Ribeiro Guedes", nomeUrna: "Anselmo Guedes", cargo: "Senador", genero: "Masculino", corRaca: "Preta", idade: 57, base: "Vale do Cedro", ocupacao: "Servidor público estadual", escolaridade: "Superior Completo" },
  { nomeCivil: "Luciana Peçanha Vidal", nomeUrna: "Luciana Peçanha", cargo: "Senador", genero: "Feminino", corRaca: "Parda", idade: 38, base: "Campo Sereno", ocupacao: "Enfermeira", escolaridade: "Superior Completo" },
  { nomeCivil: "Célio Bandeira Fontes", nomeUrna: "Célio Fontes", cargo: "Senador", genero: "Masculino", corRaca: "Branca", idade: 52, base: "Barra do Cedro", ocupacao: "Advogado", escolaridade: "Superior Completo" },
  { nomeCivil: "Jussara Tainá Werneck", nomeUrna: "Jussara Werneck", cargo: "Senador", genero: "Feminino", corRaca: "Indígena", idade: 31, base: "Itaimbé", ocupacao: "Pedagoga", escolaridade: "Superior Incompleto" },
  { nomeCivil: "Marcondes Vilela Prado", nomeUrna: "Marcondes Prado", cargo: "Senador", genero: "Masculino", corRaca: "Parda", idade: 55, base: "Ribeirão das Palmas", ocupacao: "Motorista", escolaridade: "Ensino Médio Completo" },
  { nomeCivil: "Elisângela Brito Assunção", nomeUrna: "Elisângela Brito", cargo: "Senador", genero: "Feminino", corRaca: "Preta", idade: 43, base: "Alto Cristalino", ocupacao: "Técnica em enfermagem", escolaridade: "Ensino Médio Completo" },
  { nomeCivil: "Norberto Kaminski Reis", nomeUrna: "Norberto Kaminski", cargo: "Senador", genero: "Masculino", corRaca: "Branca", idade: 63, base: "Serra Alta", ocupacao: "Aposentado", escolaridade: "Superior Completo" },
  { nomeCivil: "Vanda Oliveira Praxedes", nomeUrna: "Vanda Praxedes", cargo: "Senador", genero: "Feminino", corRaca: "Parda", idade: 48, base: "Lagoa das Garças", ocupacao: "Bancária", escolaridade: "Superior Completo" },
  { nomeCivil: "Ubiratan Melo Sarmento", nomeUrna: "Bira Sarmento", cargo: "Senador", genero: "Masculino", corRaca: "Preta", idade: 40, base: "Cachoeira Azul", ocupacao: "Professor do ensino básico", escolaridade: "Superior Completo" },
  { nomeCivil: "Heloísa Fujimoto Andrade", nomeUrna: "Heloísa Fujimoto", cargo: "Senador", genero: "Feminino", corRaca: "Amarela", idade: 36, base: "Vale do Cedro", ocupacao: "Empresária", escolaridade: "Superior Completo" },
  { nomeCivil: "Gustavo Alencastro Pimentel", nomeUrna: "Gustavo Alencastro", cargo: "Senador", genero: "Masculino", corRaca: "Branca", idade: 29, base: "Monte Claro do Norte", ocupacao: "Agricultor", escolaridade: "Ensino Médio Completo" },
];

/* ----------------------------------------------------------- PROPOSTAS --- */

/**
 * Blocos tematicos deliberadamente administrativos e apoliticos.
 * Nenhum deles remete a pauta ideologica identificavel de nenhum lado.
 */
const BLOCOS_PROPOSTA = [
  "Na mobilidade, o plano prevê recuperar as estradas que ligam a zona rural às sedes dos municípios e publicar a cada três meses o mapa das obras em andamento, com prazo previsto e prazo cumprido.",
  "Na saúde, o foco é diminuir o tempo de espera por consultas com especialistas. O texto sugere uma central única de marcação para todo o estado, com fila pública e acompanhamento por número de protocolo.",
  "Em transparência, o documento propõe publicar os contratos do estado em formato aberto, com valor, prazo e empresa contratada, além de um relatório anual sobre obras atrasadas e os motivos de cada atraso.",
  "Na educação, o plano trata da manutenção dos prédios escolares: telhado, rede elétrica, banheiros e acessibilidade. A ideia é um cronograma público de reformas, escola por escola, com data prevista e data concluída.",
  "Na gestão de pessoal, o texto propõe concurso público com calendário divulgado com antecedência e formação continuada para servidores do atendimento. Sugere medir e publicar todo mês o tempo médio de resposta dos serviços.",
  "Em saneamento, a proposta prioriza mapear as redes de água e esgoto que ainda não estão cadastradas e trocar tubulações antigas nos bairros onde falta água com mais frequência, com um canal simples para registrar vazamentos.",
  "Para a economia local, o documento fala em apoio técnico a pequenos produtores e a microempresas, com orientação sobre crédito e regularização, e em reunir as etapas de abertura de empresa em um só balcão.",
  "Na prevenção de desastres, o plano propõe mapear as áreas com risco de alagamento e manter equipes de limpeza de bueiros antes do período de chuvas, com aviso por mensagem de celular para os moradores.",
  "Nas contas públicas, o texto defende revisar os gastos com aluguel de imóveis e com frota, fixar prazo máximo para pagar fornecedores e apresentar o orçamento em audiências públicas regionais antes do envio à Assembleia.",
  "Em cultura e esporte, a proposta prevê manutenção de quadras e praças públicas e um edital anual com regras fixas para projetos locais, com a lista de aprovados e o valor de cada projeto na mesma página.",
  "No atendimento ao público, o plano sugere reunir os serviços estaduais em um aplicativo leve, que funcione em celular simples e com pouca internet, e manter postos físicos nas cidades do interior.",
];

const ABERTURAS = [
  "O documento registrado organiza as propostas em eixos administrativos e cita como referência a experiência de gestão em {municipio}.",
  "O plano apresentado reúne medidas de administração pública e usa {municipio} como exemplo de aplicação das primeiras ações.",
  "O texto entregue descreve prioridades de gestão para o estado e menciona {municipio} entre as cidades citadas ao longo do documento.",
  "O documento lista objetivos administrativos para o mandato e detalha, em anexo, um cronograma de implantação que começa por {municipio}.",
];

const FECHAMENTO =
  "Este resumo cobre os pontos que ocupam mais espaço no documento. O texto completo, sem cortes, está no cartão do documento oficial ao lado.";

/** Monta um resumo entre 180 e 220 palavras a partir dos blocos. */
function montarProposta(municipio) {
  const abertura = escolher(ABERTURAS).replace("{municipio}", municipio);
  const disponiveis = embaralhar(BLOCOS_PROPOSTA);
  const partes = [abertura];
  let i = 0;
  const total = () => contarPalavras([...partes, FECHAMENTO].join(" "));

  while (total() < 180 && i < disponiveis.length) partes.push(disponiveis[i++]);

  // Se passou do teto, troca o bloco mais longo por um ainda nao usado.
  while (total() > 220 && i < disponiveis.length) {
    let maiorIdx = 1;
    for (let k = 2; k < partes.length; k++) {
      if (contarPalavras(partes[k]) > contarPalavras(partes[maiorIdx])) maiorIdx = k;
    }
    partes[maiorIdx] = disponiveis[i++];
  }

  return [...partes, FECHAMENTO].join(" ");
}

/* ------------------------------------------------------------- EMENTAS --- */

/**
 * Ementas administrativas. Nenhuma trata de tema moralmente ou
 * ideologicamente controverso, de proposito.
 */
const EMENTAS = [
  "Cria o cadastro estadual de estradas vicinais e define prazo para atualização anual.",
  "Autoriza a doação de equipamentos hospitalares fora de uso a consórcios municipais de saúde.",
  "Institui prazo máximo para resposta a pedidos de informação feitos por telefone.",
  "Determina a publicação mensal da fila de espera por consultas especializadas.",
  "Fixa regras de manutenção preventiva nas escolas da rede estadual.",
  "Autoriza convênio entre o estado e os municípios para limpeza de bueiros.",
  "Cria a semana estadual de prevenção de acidentes no trânsito rural.",
  "Determina que os contratos de frota sejam publicados em formato aberto.",
  "Estabelece calendário fixo para audiências públicas sobre o orçamento.",
  "Institui o programa de manutenção de quadras esportivas públicas.",
  "Autoriza o funcionamento de postos de atendimento itinerantes no interior.",
  "Cria o cadastro estadual de áreas com risco de alagamento.",
  "Determina prazo para pagamento de pequenos fornecedores do estado.",
  "Institui relatório anual sobre obras públicas paralisadas.",
  "Autoriza a cessão de imóveis públicos ociosos para uso administrativo.",
  "Regulamenta a sinalização de acessibilidade nos prédios públicos estaduais.",
  "Cria o cadastro único de pedidos de manutenção em vias urbanas.",
  "Estabelece regras para a divulgação de editais culturais.",
  "Institui o programa estadual de troca de tubulações antigas de água.",
  "Determina a publicação do tempo médio de atendimento nos serviços estaduais.",
  "Cria comissão temporária para acompanhar a reforma dos hospitais regionais.",
  "Autoriza a integração dos sistemas de agendamento de consultas.",
  "Fixa normas para a manutenção da iluminação nas rodovias estaduais.",
  "Institui o cadastro de pequenos produtores para assistência técnica.",
  "Determina a publicação da lista de veículos oficiais e seus responsáveis.",
  "Cria o programa de formação continuada para servidores do atendimento.",
  "Estabelece prazo para conclusão de laudos de vistoria em escolas.",
  "Autoriza a criação de balcão único para abertura de microempresas.",
  "Institui o relatório trimestral de execução das obras de saneamento.",
  "Determina a divulgação dos horários das linhas de ônibus intermunicipais.",
  "Cria o registro público de reclamações sobre falta de água.",
  "Requer informações sobre o cronograma de reforma das unidades de pronto atendimento.",
  "Altera a data de entrega do relatório de execução orçamentária.",
  "Autoriza a instalação de bicicletários nos terminais rodoviários do estado.",
  "Define regras para a devolução de equipamentos escolares danificados.",
];

const TIPOS_PROPOSICAO = ["PL", "PEC", "PDL", "PRC", "REQ"];

/* ---------------------------------------------------------------- BENS --- */

const TIPOS_BEM = [
  { tipo: "Imóvel residencial", descricoes: ["Casa em área urbana", "Apartamento de dois quartos", "Casa geminada em bairro residencial"], faixa: [120000, 900000] },
  { tipo: "Terreno", descricoes: ["Lote urbano sem construção", "Área rural de pequeno porte", "Terreno em loteamento"], faixa: [30000, 400000] },
  { tipo: "Veículo automotor", descricoes: ["Automóvel de passeio", "Caminhonete usada", "Motocicleta"], faixa: [12000, 190000] },
  { tipo: "Aplicação financeira", descricoes: ["Fundo de renda fixa", "Título de renda fixa", "Previdência privada"], faixa: [5000, 500000] },
  { tipo: "Depósito bancário", descricoes: ["Saldo em conta corrente", "Caderneta de poupança"], faixa: [2000, 120000] },
  { tipo: "Cota de empresa", descricoes: ["Cotas de sociedade limitada", "Participação em microempresa"], faixa: [10000, 600000] },
  { tipo: "Máquina ou equipamento", descricoes: ["Trator de pequeno porte", "Equipamento de consultório", "Máquinas de oficina"], faixa: [8000, 260000] },
];

/* ------------------------------------------------------- MONTAGEM GERAL --- */

const CASAS = [
  "Assembleia Legislativa de Serra Verde",
  "Câmara Municipal de Alto Cristalino",
  "Câmara Municipal de Vila Aurora",
  "Prefeitura de Campo Sereno",
  "Prefeitura de Barra do Cedro",
  "Senado Federal",
];

/**
 * Distribui os partidos: um por governador, e os senadores em rodizio.
 * O rodizio garante que nenhum partido concentre candidaturas.
 */
function distribuirPartidos() {
  const gov = embaralhar(PARTIDOS);
  const sen = [];
  const ordem = embaralhar(PARTIDOS);
  for (let i = 0; i < 18; i++) sen.push(ordem[i % ordem.length]);
  return { gov, sen };
}

/**
 * 6 registros nao deferidos, cada um em um partido diferente,
 * para que nenhuma legenda pareca sistematicamente pior.
 */
function distribuirSituacoes(candidatos) {
  const naoDeferidos = [
    "Indeferido",
    "Sub judice",
    "Sub judice",
    "Deferido com recurso",
    "Deferido com recurso",
    "Deferido com recurso",
  ];
  const partidosUsados = new Set();
  const embaralhados = embaralhar(candidatos);
  let i = 0;
  for (const cand of embaralhados) {
    if (i >= naoDeferidos.length) break;
    if (partidosUsados.has(cand.partidoId)) continue;
    cand.situacaoRegistro = naoDeferidos[i++];
    partidosUsados.add(cand.partidoId);
  }
}

function gerarBens(perfilRiqueza) {
  const quantidade = inteiro(2, 6);
  const tipos = embaralhar(TIPOS_BEM).slice(0, quantidade);
  return tipos.map((t, idx) => {
    const [min, max] = t.faixa;
    const bruto = min + rnd() * (max - min) * perfilRiqueza;
    return {
      ordem: idx + 1,
      tipo: t.tipo,
      descricao: escolher(t.descricoes),
      valorNominal: Math.round(bruto / 500) * 500,
    };
  });
}

function gerarHistoricoBens(bens, temPassado) {
  const totalAtual = bens.reduce((s, b) => s + b.valorNominal, 0);
  const historico = [];
  if (temPassado) {
    historico.push({ ano: 2018, valorTotal: Math.round((totalAtual * (0.45 + rnd() * 0.35)) / 500) * 500 });
    historico.push({ ano: 2022, valorTotal: Math.round((totalAtual * (0.7 + rnd() * 0.25)) / 500) * 500 });
  }
  historico.push({ ano: ANO_ELEICAO, valorTotal: totalAtual });
  return historico;
}

function gerarVotacoes(quantidade) {
  const ementas = embaralhar(EMENTAS).slice(0, quantidade);
  return ementas.map((ementa, idx) => {
    const ano = inteiro(2023, 2026);
    // Nada pode ser posterior a data de coleta (agosto de 2026).
    const mes = ano === 2026 ? inteiro(2, 7) : inteiro(2, 11);
    const dia = inteiro(1, 28);
    const numero = inteiro(12, 980);
    const tipo = escolher(TIPOS_PROPOSICAO);
    // Os mesmos pesos valem para todas as candidaturas: nenhum perfil de
    // voto e sorteado de forma diferente por partido.
    const voto = escolherComPeso([
      ["Sim", 44],
      ["Não", 30],
      ["Obstrução", 9],
      ["Abstenção", 8],
      ["Ausente", 9],
    ]);
    return {
      id: `sv-${ano}-${String(idx + 1).padStart(4, "0")}`,
      data: dataISO(ano, mes, dia),
      tipo,
      numero,
      ano,
      ementa,
      voto,
      urlOficial: `https://dados.exemplo.ficticio/assembleia-sv/votacoes/${ano}/${tipo.toLowerCase()}-${numero}`,
    };
  }).sort((a, b) => (a.data < b.data ? 1 : -1));
}

function gerarPresenca() {
  const total = inteiro(180, 240);
  const ausenciaSemJustificativa = Math.round(total * (0.01 + rnd() * 0.06));
  const ausenciaJustificada = Math.round(total * (0.02 + rnd() * 0.05));
  const licenca = Math.round(total * (rnd() * 0.04));
  const missaoOficial = Math.round(total * (rnd() * 0.03));
  const presente = total - ausenciaSemJustificativa - ausenciaJustificada - licenca - missaoOficial;
  return { presente, ausenciaJustificada, licenca, missaoOficial, ausenciaSemJustificativa };
}

function casaDoCargo(cargoMandato) {
  switch (cargoMandato) {
    case "Vereador":
      return escolher(["Câmara Municipal de Alto Cristalino", "Câmara Municipal de Vila Aurora"]);
    case "Prefeito":
      return escolher(["Prefeitura de Campo Sereno", "Prefeitura de Barra do Cedro"]);
    case "Senador":
      return "Senado Federal";
    case "Governador":
      return "Governo do Estado de Serra Verde";
    default:
      return "Assembleia Legislativa de Serra Verde";
  }
}

/**
 * Mandatos de 4 anos, do mais antigo para o mais recente.
 * Quando `reeleicao` e true, o mandato em curso e do mesmo cargo disputado.
 */
function gerarMandatos(cargoAlvo, reeleicao) {
  const quantidade = inteiro(1, 3);
  const anteriores = ["Deputado estadual", "Vereador", "Prefeito"];
  const mandatos = [];

  for (let i = 0; i < quantidade; i++) {
    const fimAno = ANO_ELEICAO + 1 - i * 4; // 2027, 2023, 2019...
    const cargoMandato =
      i === 0 && reeleicao ? cargoAlvo : escolher(anteriores);
    mandatos.push({
      cargo: cargoMandato,
      inicio: dataISO(fimAno - 4, 2, 1),
      fim: dataISO(fimAno, 1, 31),
      casa: casaDoCargo(cargoMandato),
    });
  }
  return mandatos.reverse();
}

function montarCandidatos() {
  const { gov, sen } = distribuirPartidos();
  const sufixosPorPartido = {};
  let indiceGov = 0;
  let indiceSen = 0;

  const candidatos = PESSOAS.map((pessoa) => {
    const partido =
      pessoa.cargo === "Governador" ? gov[indiceGov++] : sen[indiceSen++];

    let numero;
    if (pessoa.cargo === "Governador") {
      numero = partido.numero;
    } else {
      const usados = (sufixosPorPartido[partido.id] ??= []);
      const sufixo = [1, 3, 5, 7][usados.length] ?? 9;
      usados.push(sufixo);
      numero = partido.numero * 10 + sufixo;
    }

    const anoNascimento = ANO_ELEICAO - pessoa.idade;
    const bens = gerarBens(0.4 + rnd() * 0.8);

    return {
      id: semAcento(pessoa.nomeUrna),
      nomeUrna: pessoa.nomeUrna,
      nomeCivil: pessoa.nomeCivil,
      numero,
      cargo: pessoa.cargo,
      partidoId: partido.id,
      coligacao: escolher(COLIGACOES),
      uf: "SV",
      dataNascimento: dataISO(anoNascimento, inteiro(1, 12), inteiro(1, 28)),
      genero: pessoa.genero,
      corRaca: pessoa.corRaca,
      escolaridade: pessoa.escolaridade,
      ocupacaoDeclarada: pessoa.ocupacao,
      situacaoRegistro: "Deferido",
      disputaReeleicao: false,
      fotoUrl: null,
      propostaResumo: montarProposta(pessoa.base),
      propostaDocumento: {
        paginas: inteiro(14, 128),
        urlOriginal: `https://dados.exemplo.ficticio/tef-sv/${ANO_ELEICAO}/propostas/${semAcento(pessoa.nomeUrna)}.pdf`,
        urlEspelho: `/espelho/propostas/${semAcento(pessoa.nomeUrna)}.pdf`,
        coletadoEm: DATA_COLETA,
        hash: hashFalso(),
      },
      bens,
      bensHistorico: [],
      mandatos: [],
      atuacao: null,
      proveniencia: {
        fonte: "Tribunal Eleitoral Fictício de Serra Verde (TEF-SV) — dados de exemplo",
        coletadoEm: DATA_COLETA,
        urlOriginal: `https://dados.exemplo.ficticio/tef-sv/${ANO_ELEICAO}/candidaturas/${semAcento(pessoa.nomeUrna)}`,
      },
      _base: pessoa.base,
    };
  });

  // 8 candidaturas com atuacao: uma por partido, misturando os dois cargos.
  const porPartido = new Map();
  for (const cand of embaralhar(candidatos)) {
    if (!porPartido.has(cand.partidoId)) porPartido.set(cand.partidoId, cand);
  }
  const comMandato = new Set([...porPartido.values()].map((c) => c.id));

  // Quem ja ocupa a cadeira disputada: 1 governador e 2 senadores.
  // Numeros baixos de proposito, porque na vida real so ha um governador
  // no cargo e poucas cadeiras de senador em jogo.
  const emMandato = [...porPartido.values()];
  const reeleicao = new Set(
    [
      emMandato.find((c) => c.cargo === "Governador")?.id,
      ...emMandato.filter((c) => c.cargo === "Senador").slice(0, 2).map((c) => c.id),
    ].filter(Boolean),
  );

  for (const cand of candidatos) {
    const temMandato = comMandato.has(cand.id);
    const ehReeleicao = reeleicao.has(cand.id);
    cand.mandatos = temMandato ? gerarMandatos(cand.cargo, ehReeleicao) : [];
    cand.disputaReeleicao = ehReeleicao;
    cand.bensHistorico = gerarHistoricoBens(cand.bens, temMandato || rnd() > 0.35);
    if (temMandato) {
      cand.atuacao = {
        legislatura: "2023–2026",
        proposicoesAutorPrincipal: inteiro(3, 41),
        proposicoesCoautor: inteiro(6, 88),
        votacoes: gerarVotacoes(inteiro(20, 30)),
        presenca: gerarPresenca(),
      };
    }
    delete cand._base;
  }

  distribuirSituacoes(candidatos);
  return candidatos;
}

/* -------------------------------------------------------------- SAIDA ---- */

const candidatos = montarCandidatos();

mkdirSync(join(RAIZ, "data"), { recursive: true });
writeFileSync(
  join(RAIZ, "data", "partidos.json"),
  JSON.stringify(PARTIDOS, null, 2) + "\n",
  "utf8",
);
writeFileSync(
  join(RAIZ, "data", "candidatos.json"),
  JSON.stringify(candidatos, null, 2) + "\n",
  "utf8",
);

/* ------------------------------------------------------- CONFERENCIA ----- */

const palavras = candidatos.map((c) => contarPalavras(c.propostaResumo));
const contar = (fn) =>
  candidatos.reduce((acc, c) => {
    const chave = fn(c);
    acc[chave] = (acc[chave] ?? 0) + 1;
    return acc;
  }, {});

const ids = new Set(candidatos.map((c) => c.id));
const numeros = new Set(candidatos.map((c) => c.numero));

console.log("Arquivos gravados em /data\n");
console.log("Candidaturas:", candidatos.length);
console.log("  por cargo:", contar((c) => c.cargo));
console.log("  por partido:", contar((c) => c.partidoId));
console.log("  por situacao:", contar((c) => c.situacaoRegistro));
console.log("  por genero:", contar((c) => c.genero));
console.log("  por cor/raca:", contar((c) => c.corRaca));
console.log("  com atuacao:", candidatos.filter((c) => c.atuacao).length);
console.log("  em reeleicao:", candidatos.filter((c) => c.disputaReeleicao).length);
console.log(
  "  votacoes por candidatura com mandato:",
  candidatos.filter((c) => c.atuacao).map((c) => c.atuacao.votacoes.length).join(", "),
);
console.log(
  "  palavras no resumo: min",
  Math.min(...palavras),
  "/ max",
  Math.max(...palavras),
);
console.log("  ids unicos:", ids.size === candidatos.length);
console.log("  numeros unicos:", numeros.size === candidatos.length);

const forasDoIntervalo = palavras.filter((p) => p < 180 || p > 220).length;
if (forasDoIntervalo > 0) {
  console.error(`ATENCAO: ${forasDoIntervalo} resumos fora de 180-220 palavras.`);
  process.exitCode = 1;
}
