/**
 * Glossário do sistema político.
 *
 * Alimenta duas coisas ao mesmo tempo: a página /como-funciona e a
 * explicação que aparece ao lado do jargão dentro das fichas. Um lugar
 * só, para as duas nunca divergirem.
 *
 * REGRA DE ESCRITA. Todo texto aqui é NOSSO — paráfrase em linguagem
 * simples. Os fatos vêm da fonte citada em cada verbete; as palavras,
 * não. A tela diz isso com todas as letras, porque a diferença entre
 * "o TSE informa" e "nós explicamos" é o eixo do site inteiro.
 *
 * REGRA DE CONTEÚDO: descritivo, nunca normativo. Explicar o que é uma
 * PEC, jamais se PECs são boas. Explicar que deputado destina emenda,
 * jamais se emenda é bom instrumento. É a linha mais fácil de cruzar
 * num texto escrito por quem tem opinião — e cruzá-la aqui contamina o
 * resto do site, que se sustenta em não opinar.
 *
 * Todas as URLs foram testadas em 01/09/2026 e respondiam 200.
 */

export interface FonteGlossario {
  rotulo: string;
  url: string;
}

export interface Verbete {
  /** Âncora em /como-funciona e chave usada pelo componente <Termo>. */
  id: string;
  /** Como aparece na ficha: "PEC", "glosa". */
  termo: string;
  /** Nome por extenso, quando a sigla esconde um. */
  nome?: string;
  /** Uma frase. É o que aparece na explicação inline. */
  resumo: string;
  /** Parágrafos da página. Linguagem simples, frases curtas. */
  explicacao: string[];
  /** Artigo de lei que sustenta o fato, quando existe um específico. */
  baseLegal?: string;
  fontes: FonteGlossario[];
}

const CF: FonteGlossario = {
  rotulo: "Constituição Federal",
  url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
};

const PROCESSO: FonteGlossario = {
  rotulo: "Câmara dos Deputados — Entenda o processo legislativo",
  url: "https://www.camara.leg.br/entenda-o-processo-legislativo/",
};

const COTA: FonteGlossario = {
  rotulo: "Câmara dos Deputados — Cota parlamentar",
  url: "https://www.camara.leg.br/cota-parlamentar/",
};

/* ------------------------------------------------------------------ */
/*  Os cargos                                                          */
/* ------------------------------------------------------------------ */

export const CARGOS_EXPLICADOS: Verbete[] = [
  {
    id: "deputado-federal",
    termo: "Deputado Federal",
    resumo:
      "Faz leis que valem para o Brasil inteiro e fiscaliza o governo federal.",
    explicacao: [
      "O deputado federal representa o povo do seu estado na Câmara dos Deputados, em Brasília. São 513 no total, e o Espírito Santo elege 10. O mandato dura quatro anos.",
      "O trabalho dele tem três partes. Ele propõe e vota leis que valem para o país inteiro. Ele fiscaliza o governo federal — pode convocar ministro, pedir informação, abrir investigação. E ele destina emendas: uma fatia do Orçamento da União que cada parlamentar aponta para onde quer que seja gasta.",
      "O número de deputados por estado é proporcional à população, com um piso de 8 e um teto de 70. Por isso São Paulo elege 70 e Roraima elege 8.",
    ],
    baseLegal: "Constituição Federal, art. 45",
    fontes: [CF],
  },
  {
    id: "senador",
    termo: "Senador",
    resumo:
      "Representa o estado inteiro, não a população proporcional. Mandato de oito anos.",
    explicacao: [
      "O senador representa o estado como unidade da federação. Por isso o número é igual para todos: três por estado e três pelo Distrito Federal, 81 no total. O Acre tem o mesmo peso que São Paulo no Senado.",
      "O mandato é de oito anos — o dobro do de deputado. A renovação é alternada: em uma eleição o estado escolhe um senador, na seguinte escolhe dois. Por isso nem sempre há três vagas em disputa.",
      "Além de votar leis, o Senado aprova a indicação de ministros do Supremo Tribunal Federal, de embaixadores e de diretores de agências, e julga o presidente da República em processo de impeachment.",
    ],
    baseLegal: "Constituição Federal, art. 46",
    fontes: [
      CF,
      {
        rotulo: "Senado Federal — Institucional",
        url: "https://www12.senado.leg.br/institucional",
      },
    ],
  },
  {
    id: "deputado-estadual",
    termo: "Deputado Estadual",
    resumo: "Faz leis que valem só no estado e fiscaliza o governo estadual.",
    explicacao: [
      "O deputado estadual trabalha na Assembleia Legislativa do próprio estado — no nosso caso, a Ales, em Vitória. O mandato é de quatro anos.",
      "As leis que ele aprova valem apenas dentro do estado. Ele também fiscaliza o governador e vota o orçamento estadual, que é o dinheiro de saúde, educação e segurança do estado.",
      "É o cargo com mais candidaturas na eleição, e também o que tem menos informação pública disponível em formato aberto. Explicamos essa lacuna na página de fontes.",
    ],
    baseLegal: "Constituição Federal, art. 27",
    fontes: [
      CF,
      {
        rotulo: "Assembleia Legislativa do Espírito Santo",
        url: "https://www.al.es.gov.br/",
      },
    ],
  },
  {
    id: "governador",
    termo: "Governador",
    resumo:
      "Chefia o governo do estado: executa o orçamento, comanda as secretarias.",
    explicacao: [
      "O governador chefia o Poder Executivo do estado. Enquanto o deputado faz a lei, o governador executa: ele comanda as secretarias de saúde, educação e segurança, e decide como o dinheiro do estado é gasto dentro do que o orçamento permite.",
      "O mandato é de quatro anos, com direito a uma reeleição seguida. É eleito pela maioria dos votos, em dois turnos quando ninguém passa de 50% na primeira votação.",
      "É por isso que a ficha de um governador mostra proposta de governo e a de um deputado não: quem vai executar precisa dizer antes o que pretende fazer.",
    ],
    baseLegal: "Constituição Federal, art. 28",
    fontes: [CF],
  },
  {
    id: "presidente",
    termo: "Presidente da República",
    resumo: "Chefia o governo federal e representa o Brasil no exterior.",
    explicacao: [
      "O presidente chefia o Poder Executivo federal. Nomeia ministros, comanda as Forças Armadas, representa o país no exterior e propõe o orçamento da União.",
      "Também participa do processo das leis: pode propor projetos e pode vetar, no todo ou em parte, o que o Congresso aprovou. O Congresso, por sua vez, pode derrubar o veto.",
      "O mandato é de quatro anos, com direito a uma reeleição seguida.",
    ],
    baseLegal: "Constituição Federal, arts. 76 a 84",
    fontes: [CF],
  },
];

/* ------------------------------------------------------------------ */
/*  Onde eles trabalham                                                */
/* ------------------------------------------------------------------ */

export const CASAS: Verbete[] = [
  {
    id: "camara",
    termo: "Câmara dos Deputados",
    resumo: "A casa dos 513 deputados federais. Representa o povo.",
    explicacao: [
      "A Câmara reúne os 513 deputados federais. Ela representa o povo: o número de cadeiras de cada estado acompanha o tamanho da população.",
      "Quase todo projeto de lei começa por lá. E é a Câmara que autoriza a abertura de processo contra o presidente da República.",
    ],
    baseLegal: "Constituição Federal, art. 45",
    fontes: [CF],
  },
  {
    id: "senado",
    termo: "Senado Federal",
    resumo: "A casa dos 81 senadores. Representa os estados, em pé de igualdade.",
    explicacao: [
      "O Senado reúne 81 senadores: três por estado e três pelo Distrito Federal. Aqui todos os estados têm o mesmo peso, independentemente do tamanho.",
      "Ele revisa o que a Câmara aprova, aprova indicações de autoridades e julga o presidente em caso de impeachment.",
    ],
    baseLegal: "Constituição Federal, art. 46",
    fontes: [CF],
  },
  {
    id: "congresso",
    termo: "Congresso Nacional",
    resumo: "As duas casas juntas — Câmara e Senado.",
    explicacao: [
      "Congresso Nacional é o nome do conjunto: Câmara dos Deputados mais Senado Federal. Ele é o Poder Legislativo federal.",
      "As duas casas costumam trabalhar separadas, cada uma votando a sua parte. Em alguns casos elas se reúnem juntas — para votar o orçamento da União e para decidir sobre vetos do presidente, por exemplo.",
    ],
    baseLegal: "Constituição Federal, art. 44",
    fontes: [
      CF,
      {
        rotulo: "Congresso Nacional",
        url: "https://www.congressonacional.leg.br/",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Como uma lei nasce                                                 */
/* ------------------------------------------------------------------ */

export const PROPOSICOES: Verbete[] = [
  {
    id: "pl",
    termo: "PL",
    nome: "Projeto de Lei",
    resumo: "A proposta de lei comum. Precisa de maioria simples para passar.",
    explicacao: [
      "É o tipo mais comum. Pode ser proposto por qualquer deputado ou senador, por comissões, pelo presidente da República, por tribunais superiores — e também pelos cidadãos, por iniciativa popular.",
      "Depois de apresentado, o projeto passa por comissões temáticas, que analisam o conteúdo, e pela Comissão de Constituição e Justiça, que verifica se ele cabe na Constituição. A maioria dos projetos nem chega ao plenário: é decidida nas próprias comissões.",
      "Se aprovado nas duas casas, vai para o presidente sancionar ou vetar.",
    ],
    fontes: [PROCESSO, CF],
  },
  {
    id: "plp",
    termo: "PLP",
    nome: "Projeto de Lei Complementar",
    resumo:
      "Trata de assuntos que a Constituição reservou. Exige maioria absoluta.",
    explicacao: [
      "A Constituição separa alguns assuntos e diz que só podem ser tratados por lei complementar — o sistema tributário e o orçamento, por exemplo.",
      "A diferença prática está no placar: enquanto uma lei comum passa com a maioria dos presentes, a complementar exige a maioria de todos os membros da casa, estejam presentes ou não.",
    ],
    baseLegal: "Constituição Federal, art. 69",
    fontes: [CF],
  },
  {
    id: "pec",
    termo: "PEC",
    nome: "Proposta de Emenda à Constituição",
    resumo: "Muda o texto da Constituição. É o tipo mais difícil de aprovar.",
    explicacao: [
      "Uma PEC altera a própria Constituição, e por isso o caminho é o mais exigente de todos.",
      "Só pode ser proposta por um terço dos deputados ou dos senadores, pelo presidente da República, ou por mais da metade das Assembleias Legislativas dos estados.",
      "Para valer, precisa ser aprovada nas duas casas, em dois turnos de votação em cada uma, sempre com pelo menos três quintos dos votos. Não vai para sanção do presidente: emenda à Constituição não pode ser vetada.",
      "Alguns pontos não podem ser mudados nem por PEC — o voto direto, a separação dos Poderes e os direitos e garantias individuais, entre outros.",
    ],
    baseLegal: "Constituição Federal, art. 60",
    fontes: [CF, PROCESSO],
  },
  {
    id: "pdl",
    termo: "PDL",
    nome: "Projeto de Decreto Legislativo",
    resumo:
      "Usado no que é competência exclusiva do Congresso. Não passa pelo presidente.",
    explicacao: [
      "Serve para assuntos que a Constituição entregou só ao Congresso: aprovar tratados internacionais, autorizar o presidente a se ausentar do país, sustar atos do Executivo que passem do limite.",
      "Como é competência exclusiva do Legislativo, não vai para sanção nem pode ser vetado.",
    ],
    fontes: [PROCESSO, CF],
  },
  {
    id: "requerimento",
    termo: "Requerimento",
    nome: "REQ, RQS e siglas semelhantes",
    resumo: "Um pedido sobre o andamento dos trabalhos. Não cria lei nenhuma.",
    explicacao: [
      "Requerimento é um pedido de procedimento: convocar um ministro para depor, pedir informação a um órgão, marcar uma audiência pública, pedir urgência para um projeto, propor uma sessão solene.",
      "É importante saber disso ao olhar quantas proposições alguém apresentou. Um requerimento de sessão solene e um projeto de lei aparecem como uma proposição cada, e têm pesos muito diferentes. Por isso este site nunca soma tudo num número só: mostra separado por tipo.",
    ],
    fontes: [PROCESSO],
  },
];

/* ------------------------------------------------------------------ */
/*  Votação                                                            */
/* ------------------------------------------------------------------ */

export const VOTACAO: Verbete[] = [
  {
    id: "votacao-nominal",
    termo: "Votação nominal",
    resumo:
      "O voto de cada parlamentar fica registrado, um a um — e é público.",
    explicacao: [
      "Numa votação nominal, o sistema registra como cada parlamentar votou: sim, não, abstenção, ou ausência. É isso que permite saber, depois, a posição de uma pessoa específica.",
      "Existe também a votação simbólica, em que o presidente da sessão apenas verifica se há maioria, sem registrar nome. Nessas, não há como saber quem votou o quê — e é por isso que este site só mostra as nominais.",
    ],
    fontes: [PROCESSO],
  },
  {
    id: "plenario",
    termo: "Plenário",
    resumo: "A reunião de todos os parlamentares da casa.",
    explicacao: [
      "Plenário é a sessão que reúne todos os membros — os 513 deputados, ou os 81 senadores. É onde vão as matérias mais importantes.",
      "Muita coisa, porém, é decidida antes disso, dentro das comissões, com um número bem menor de parlamentares. Um projeto pode virar lei sem nunca ter ido a plenário.",
    ],
    fontes: [PROCESSO],
  },
  {
    id: "recesso",
    termo: "Recesso parlamentar",
    resumo:
      "Os dois períodos do ano em que não há sessões: fim de dezembro a fevereiro, e a segunda metade de julho.",
    explicacao: [
      "A Constituição define o calendário: as sessões vão de 2 de fevereiro a 17 de julho, e de 1º de agosto a 22 de dezembro. Fora disso é recesso.",
      "Recesso não significa que o parlamentar esteja proibido de trabalhar ou de ter despesa — mandato e gabinete continuam existindo. Significa apenas que não há sessão ordinária no período.",
    ],
    baseLegal: "Constituição Federal, art. 57",
    fontes: [CF],
  },
];

/* ------------------------------------------------------------------ */
/*  O dinheiro                                                         */
/* ------------------------------------------------------------------ */

export const DINHEIRO: Verbete[] = [
  {
    id: "cota-parlamentar",
    termo: "Cota parlamentar",
    nome: "Cota para o Exercício da Atividade Parlamentar",
    resumo:
      "Verba pública mensal para custear o trabalho do mandato, com nota fiscal pública.",
    explicacao: [
      "É dinheiro público que cada deputado pode usar para custear o exercício do mandato: passagem, combustível, aluguel de escritório no estado, divulgação da atividade parlamentar, entre outras despesas previstas em regra.",
      "O valor mensal não é igual para todos: varia conforme o estado, porque leva em conta o custo de deslocamento até Brasília.",
      "Cada gasto precisa de comprovante, e a Câmara publica esses documentos. É daí que vem tudo o que este site mostra na aba Mandato — inclusive o link para a nota fiscal de cada despesa.",
    ],
    fontes: [
      COTA,
      {
        rotulo: "Câmara — Perguntas frequentes sobre a cota",
        url: "https://www2.camara.leg.br/transparencia/acesso-a-informacao/copy_of_perguntas-frequentes/cota-para-o-exercicio-da-atividade-parlamentar",
      },
    ],
  },
  {
    id: "glosa",
    termo: "Glosa",
    resumo:
      "A parte de uma despesa que a própria Casa recusou reembolsar.",
    explicacao: [
      "Quando o parlamentar apresenta um gasto, a Casa confere se ele se encaixa nas regras da cota. Se parte do valor não se encaixa, ela é glosada — ou seja, não é paga.",
      "É um dado importante justamente porque não é avaliação de ninguém de fora: é o registro da própria Câmara dizendo que aquela despesa, no todo ou em parte, não podia ser reembolsada.",
    ],
    fontes: [COTA],
  },
  {
    id: "emenda-parlamentar",
    termo: "Emenda parlamentar",
    resumo:
      "A fatia do Orçamento que cada parlamentar aponta para onde deve ser gasta.",
    explicacao: [
      "O Orçamento da União é aprovado pelo Congresso. Dentro dele, cada parlamentar pode indicar destino para uma parcela de recursos — para um hospital do seu estado, para obra em um município, para uma área como saúde ou educação.",
      "Um ponto costuma passar despercebido e muda a leitura: valor empenhado não é valor pago. Empenhar é reservar o dinheiro; pagar é o dinheiro sair. Entre um e outro pode haver diferença grande, e às vezes o pagamento não acontece.",
    ],
    fontes: [
      {
        rotulo: "Portal da Transparência — Emendas parlamentares",
        url: "https://portaldatransparencia.gov.br/emendas",
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Índice único                                                       */
/* ------------------------------------------------------------------ */

export const SECOES = [
  {
    id: "cargos",
    titulo: "O que você decide neste voto",
    intro:
      "Cada cargo faz uma coisa diferente. Saber o que cada um faz muda o que faz sentido cobrar de quem ocupa a cadeira.",
    verbetes: CARGOS_EXPLICADOS,
  },
  {
    id: "casas",
    titulo: "Onde eles trabalham",
    intro:
      "Câmara, Senado e Congresso não são a mesma coisa, e a diferença aparece o tempo todo no noticiário.",
    verbetes: CASAS,
  },
  {
    id: "proposicoes",
    titulo: "Como uma lei nasce",
    intro:
      "As siglas que aparecem nas fichas — PL, PEC, PLP — são tipos diferentes de proposta, com exigências diferentes para serem aprovadas.",
    verbetes: PROPOSICOES,
  },
  {
    id: "votacao",
    titulo: "Como se vota, e o que fica registrado",
    intro:
      "Nem toda votação registra o nome de quem votou. Entender isso explica por que algumas posições são conhecidas e outras não.",
    verbetes: VOTACAO,
  },
  {
    id: "dinheiro",
    titulo: "De onde vem o dinheiro que eles usam",
    intro:
      "Além do salário, o mandato movimenta verbas públicas com regras próprias — e com comprovante público.",
    verbetes: DINHEIRO,
  },
] as const;

/** Todos os verbetes, achatados. Usado pelo componente <Termo>. */
export const VERBETES: Verbete[] = SECOES.flatMap((s) => s.verbetes);

export function obterVerbete(id: string): Verbete | undefined {
  return VERBETES.find((v) => v.id === id);
}
