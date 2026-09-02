# Andamento

## Onde estamos

> A lista curta e acionável do que resta está em [`O-QUE-FALTA.md`](O-QUE-FALTA.md).
> Este arquivo guarda o raciocínio; aquele guarda a tarefa.

O site saiu do protótipo. Em **27/08/2026** os dados fictícios de "Serra Verde"
foram removidos e substituídos por dados públicos reais do **Espírito Santo**:
575 candidaturas de 2026 (TSE) e o mandato dos 10 deputados federais do estado
(Câmara dos Deputados).

Em **28/08/2026** o repositório passou a viver em
`github.com/gabriel89-exe/Fato-Voto`, com Vercel publicando a cada push e
SonarCloud verde. O produto está pronto; o que falta para divulgar são três
decisões de fora do código, listadas logo abaixo.

## Pronto

- [x] **Kit de interface** — 28 componentes shadcn/ui vestidos com a identidade
      GAZETA, mais a vitrine em `/interface`.
- [x] **Camada de coleta** — TSE e Câmara, com snapshot bruto, hash SHA-256,
      manifesto e normalização separada da coleta.
- [x] **Busca e sorteio** — busca por nome ou prefixo do número de urna;
      ordem sorteada com semente fixa por dia.
- [x] **Lista de candidaturas** — recorte por cargo, contagem em `aria-live`,
      estado vazio com saída.
- [x] **Ficha de candidatura** — abas Perfil, Proposta, Bens, Histórico e
      Mandato (esta só quando existe), com procedência em cada bloco.
- [x] **Gráficos** — composição (rosca) e evolução (linha), SVG à mão, com
      tabela acessível ao lado.
- [x] **Inventário de fontes** — `/fontes` publica também as lacunas.
- [x] **Responsividade em 360 px** — todas as rotas, sem rolagem horizontal.
      Conferido de novo em 01/09/2026, agora também a 320 px, no build de
      produção e não no de desenvolvimento.
- [x] **Senadores do ES** — coleta feita. Contarato e Marcos do Val são
      senadores em exercício E candidatos: as fichas deles ganharam aba de
      mandato com as matérias de autoria.
- [x] **Filtros facetados** — partido, situação, escolaridade, gênero e
      cor/raça, com contagem por opção. Formulário GET nativo: funciona sem
      JavaScript e o recorte é compartilhável por link.
- [x] **Coleta agendada** — GitHub Actions diário às 6h de Brasília, com
      build de verificação antes do commit e commit só quando o dado muda.
- [x] **Página "Quem somos"** — o projeto assina como três estudantes, sem
      responsável nomeado. Ver a decisão registrada mais abaixo.
- [x] **Identidade própria** — paleta, tipografia e animações que afastam o
      site da cara de portal de governo sem perder o contraste e o alvo de
      toque que vieram do padrão gov.br.
- [x] **Lista paginada** — 24 fichas por página. Sem isso a lista sem recorte
      montava as 575 de uma vez: 158 mil pixels de altura e perto de 20 mil nós
      no DOM a 360 px. A navegação é feita de `<a>`, não de botão com script.
- [x] **Como funciona a política** — página /como-funciona com 19 verbetes
      em linguagem simples, cada um com a base legal e o link para a fonte.
      Convite na home e explicação inline ao lado do jargão nas fichas.
      Não é portão na entrada: ver a decisão registrada mais abaixo.
- [x] **E-mail do projeto** — fatoevoto@gmail.com, endereço do próprio
      projeto e não pessoal, como a regra exigia.
- [x] **Privacidade e LGPD** — página /privacidade com base legal, o que é
      tratado, o que é descartado na coleta e como pedir correção. Falta
      revisão de advogado antes de divulgar.
- [x] **Cabeçalhos de segurança** — CSP restritiva, HSTS, nosniff,
      Referrer-Policy e Permissions-Policy, conferidos na resposta real.
- [x] **Auditoria de toque em 360 px** — gaveta de filtros, abas da ficha e
      botão de fechar acertados para 48 px.
- [x] **Tabela larga no celular** — abaixo de 640 px cada linha das tabelas
      vira ficha, com o nome da coluna ao lado do dado. Antes a página não
      rolava de lado, mas cada tabela rolava dentro do próprio bloco: a das
      dez maiores notas media 581 px em 287 px de largura útil. Junto foi a
      etiqueta que de fato arrastava a página inteira — ver a decisão
      registrada mais abaixo.
- [x] **Governança do repositório** — `CODEOWNERS` nos caminhos onde um PR
      faz estrago (dado, coleta, workflow, `next.config.mjs`, `package*.json`),
      `SECURITY.md` com canal privado, `dependabot.yml` (npm + actions),
      template de PR com checklist de revisão, e
      `docs/integridade-e-acesso.md` com o modelo de ameaça e o checklist das
      proteções que só se ligam pela interface do GitHub.
- [x] **Verificações automáticas** — workflow `Verificação` roda em todo PR:
      `npm run build`, `npm run verificar` (cabeçalhos de segurança na
      resposta real, segredo dentro de `.next/`, nome `NEXT_PUBLIC_*` com cara
      de token), `npm run contraste` e `npm audit`. Mais CodeQL. O
      `permissions` do `coleta.yml` foi escopado para o job. `overrides` no
      `package.json` força `postcss` corrigido também na cópia aninhada do
      `next` — `npm audit` passou a zero.


## Falta

### Bloqueia a divulgação — depende de decisão, não de código

- [ ] **Domínio de produção** (`NEXT_PUBLIC_SITE_URL`). Enquanto vazio, o
      sitemap, o `robots.txt` e as tags de compartilhamento geram URL errada.
- [ ] **Arquivo `LICENSE`.** A licença já foi escolhida — **AGPL-3.0-only**,
      registrada no `package.json`, no `README.md` e no rodapé do site. Falta
      só o arquivo `LICENSE` com o texto: adicionar pelo GitHub
      (*Add file → Create new file → `LICENSE` → Choose a license template →
      GNU AGPLv3*), que insere o texto canônico. É passo de pessoa.
- [ ] **Revisão jurídica da página de privacidade.** O enquadramento em
      `/privacidade` é o raciocínio do projeto, não parecer. Uma leitura de
      advogado antes de divulgar é barata perto do risco: o site publica dado
      pessoal — e sensível, no caso de cor ou raça — de 575 pessoas
      identificadas.

### Dados

- [x] **Emendas parlamentares — integração pronta, publicação suspensa pela
      fonte.** Feita em 01/09/2026 com o token obtido: coletor, conferência,
      tipos, tela na aba Mandato (empenhado e pago lado a lado, mediana e faixa
      da bancada do mesmo cargo, link para a página de cada emenda) e passo no
      CI. As 458 emendas individuais dos 13 parlamentares do ES na legislatura
      57 foram coletadas e conferidas — e a conferência REPROVOU a fonte. Ver a
      decisão registrada mais abaixo. Enquanto reprovar, a ficha diz que a
      fonte está inconsistente em vez de mostrar número, e a coleta diária
      tenta de novo. Nada além de destravar a fonte é necessário do nosso lado.
- [x] **Votações e projetos** — feito em `7ba46d4`. Proposições agrupadas por
      tipo e votações nominais de plenário nas duas casas. O recorte das
      votações é declarado na tela: as mais recentes com participação
      registrada, e não uma seleção do que consideramos importante.
- [x] **Emendas estaduais** — feito em 02/09/2026. A fonte que a documentação
      dizia não existir existia: emenda estadual é executada pelo governo do
      estado, e a SEFAZ publica tudo em CSV no CKAN estadual
      (`dados.es.gov.br`), com código de autor, sem token e com valores
      íntegros — a conferência aprovou. 29 fichas ganharam aba de Mandato
      (22 candidatos à reeleição e 7 deputados estaduais disputando outro
      cargo). Ver as decisões registradas abaixo e
      `docs/fontes-de-dados.md`.
- [ ] **Atuação de deputado estadual em plenário** — o que sobrou da lacuna
      estadual: votações, presença e projetos. A ALES não tem API (e em
      02/09/2026 o site nem respondia daqui). As fichas declaram a lacuna na
      própria aba de mandato.
- [ ] **Lacunas já visíveis nos dados atuais** — `bens` vem vazio em 195 das
      575 candidaturas e `eleicoesAnteriores` em 178. A omissão é da fonte; o
      que cabe conferir é se a ficha diz *por que* está vazio (regra 7 de
      `docs/principios.md`).

### Interface

- [ ] **Comparador** — `/comparar` continua sendo um aviso, por decisão. As
      quatro regras que a comparação precisa respeitar já estão escritas no
      topo do arquivo, e os controles necessários já existem vestidos. Não
      construir sem pedido explícito.

### Segurança — depende de configuração no GitHub, não de código

O checklist completo, com o porquê de cada item, está em
`docs/integridade-e-acesso.md`. Em resumo:

- [ ] **Proteções em *Settings → Code security*:** secret scanning + push
      protection, Dependabot alerts + security updates, private vulnerability
      reporting.
- [ ] **Proteção do branch `main`:** exigir PR com 1 aprovação, exigir review
      de Code Owners, exigir o check `Verificação`, proibir *force push*, não
      permitir bypass nem para admin.
- [ ] **Bypass da coleta.** Com a proteção acima, o `git push` diário do
      `coleta.yml` é recusado. Adicionar bypass para `github-actions[bot]` em
      *Rulesets*, ou dar a escrita a um App/PAT dedicado. **Sem isto a coleta
      diária para em silêncio.**
- [ ] **2FA obrigatório** para todo colaborador com escrita.
- [x] **Emendas — o coletor com as travas de segredo:** feito. O passo do
      build no workflow não declara o token no `env`, e `npm run verificar`
      procura o valor dele dentro de `.next/`.
- [ ] **Emendas: a fonte precisa consertar a API.** A integração está pronta,
      conferida e travada. O Portal da Transparência devolve valor dividido por
      10.000 em cerca de 9 de cada 10 leituras dos registros afetados —
      medido em 02/09/2026, com a página pública como referência. Não há
      consulta confiável, e não há nada a fazer do lado do código: publicar
      exigiria escolher entre duas respostas da fonte, que é inferência. O
      caminho é relatar pelo Fala.BR — ver `docs/fontes-de-dados.md`. Enquanto
      isso a ficha diz que a fonte está inconsistente, com um exemplo cru.
- [x] **Secret `TRANSPARENCIA_TOKEN` no repositório** — cadastrado em
      01/09/2026 pelo mantenedor. A prova de que o CI o enxerga vem da
      primeira coleta agendada: o passo de emendas continua vermelho
      enquanto a fonte reprovar, mas o log diz "CONFERÊNCIA REPROVADA" e o
      `coletadoEm` de `emendas.json` avança no commit diário. Se o log
      disser "TRANSPARENCIA_TOKEN não está no ambiente", o secret não
      chegou ao passo.

### Documentação desatualizada

Nada disto muda comportamento, mas confunde quem chegar ao projeto:

- [ ] `docs/principios.md` ainda descreve a tarja como anunciando dados
      fictícios (seção "A transição de fictício para real"), e promete um
      seletor de estado com URL `/es/...` que não existe — as rotas são planas
      e o ES está fixo.
- [ ] `README.md` lista só TSE e Câmara como fontes; o Senado já é fonte e já
      tem `npm run coleta:senado`. Já o aviso sobre o `&` no nome da pasta
      continua valendo: em 01/09/2026 um `npx tsc --noEmit` quebrou aqui
      exatamente por isso. Este arquivo dizia que não valia mais, e estava
      errado.
- [ ] `TarjaPrototipo` já não é tarja de protótipo — o nome mente sobre o que
      o componente faz.
- [ ] `.github/workflows/coleta.yml` cita "232 registros em julgamento" como
      número fixo; ele muda a cada coleta.

## Decisões registradas

**A identidade é tinta sobre papel, e a logomarca é o círculo dividido.**
Em 02/09/2026, a pedido do mantenedor, o azul-violeta saiu e o único acento
passou a ser a própria tinta: neutralidade máxima, nenhum matiz que possa
ser lido como cor de partido ou de instituição. O que distingue link de
texto é o sublinhado — que sempre foi o sinal acessível —, e o que
distingue ação é a forma. A logomarca (documento conferido + urna,
separados pela fresta diagonal) foi recriada em SVG em
`components/icones.tsx` e vive no cabeçalho, no rodapé, no favicon e como
marca-d'água do hero. A abertura da página inicial passou a ser a pergunta
"Você conhece a política do Brasil?", com a busca logo abaixo, na mesma
dobra. Todo par de cor novo passa no `npm run contraste`, que foi
atualizado junto — paleta e verificador mudam no mesmo commit, sempre.

**Emenda estadual vem da SEFAZ, não da ALES.** A documentação dizia que
deputado estadual não tinha fonte porque procurava o dado na casa
legislativa. Emenda é executada pelo Executivo, e quem publica a execução é a
Fazenda: `dados.es.gov.br`, um CSV por LOA (2021–2026), com `CodAutor`
numérico — o identificador que a fonte federal não tem. A licença declarada
no catálogo é CC Não Comercial; o uso aqui cabe, e um fork comercial
precisaria reavaliar.

**No arquivo da SEFAZ, uma linha não é uma emenda.** Uma linha por
instrumento de execução: 1.731 linhas eram 1.684 emendas na primeira coleta.
`ValorPrevisto` repete em todas as linhas da mesma emenda; empenho e
pagamento se somam. Contar linhas, ou somar o previsto repetido, publicaria
número errado com cara de certo — e a conferência prova a premissa a cada
coleta (previsto divergente entre linhas da mesma emenda reprova a fonte).

**Só é mandato atual quem assina emenda em LOA emendada durante o mandato.**
A LOA de um ano é emendada no ano anterior: a de 2023 é obra da legislatura
anterior inteira — 16 dos 30 autores dela nem estão mais na ALES. A coleta
exige autoria em LOA 2024–2026 para abrir ficha; sem o filtro, um
ex-deputado candidato ganharia aba de mandato por um mandato que acabou. Quem
passa no filtro leva junto as emendas de 2023 que tiver — são execução do
período, como na janela federal — e quem assumiu em 2023 não tem emenda de
2023, com a ficha explicando o calendário (regra 5).

**O casamento estadual é nome parlamentar contra nome de urna, com
desistência dupla.** A SEFAZ publica "Dep. Fulano" (às vezes sem o prefixo);
o TSE, nome de urna e nome civil. Liga só quando há exatamente uma
candidatura com aquele nome, e os que não casam ficam listados em
`semCasamento` no próprio JSON — lacuna auditável em vez de silenciosa. Na
primeira coleta: 29 casaram, 4 não (dois nomes divergentes ou não candidatos,
dois deputados que deixaram a ALES).

**A área da emenda estadual é da execução, não da emenda.** 86 emendas da
janela executam em mais de uma função orçamentária. O agrupamento por área
soma o dinheiro por linha (exato) e conta emendas distintas que tocam a área
— uma emenda pode contar em duas, e a tela declara. Ratear seria inventar
número.

**A aba de mandato estadual declara o que não tem.** Sem o aviso de que a
ALES não publica votações, presença e projetos em formato coletável, uma aba
só de emendas seria lida como "só fez emendas". A diferença é das fontes,
não das pessoas — mesma frase de sempre, regra 5.

**A coleta se alinha ao `main` antes de commitar, e não depois.** O passo
commitava e só então dava `git pull --rebase`. Em 02/09/2026 isso perdeu uma
coleta inteira: o `main` tinha andado dois commits durante os sete minutos do
job, o rebase encontrou os mesmos JSONs mudados dos dois lados e parou em
conflito nos três arquivos.

Rebase é a ferramenta errada aqui. O conteúdo de `data/es` é **derivado** — a
coleta o regenera inteiro —, e não há o que fundir entre a resposta de agora e
a de meia hora atrás: a de agora é a resposta atual das fontes. Movendo o HEAD
para o `main` mais novo ANTES do commit, o que a coleta escreveu vira a mudança
sobre a base mais nova, e conflito deixa de ser possível.

Junto veio `git add --ignore-removal`: a coleta só escreve arquivo, nunca
apaga. Sem a trava, um arquivo acrescentado ao `main` durante o job entraria no
commit como remoção — a coleta apagaria em silêncio um dado que ninguém pediu
para apagar. Foi um teste do passo, num repositório de mentira, que achou isso.

**Heurística de grandeza foi tentada como detector, e descartada.** O primeiro
desenho da conferência reprovava emenda abaixo de R$ 1.000, porque dividir por
10.000 joga qualquer emenda real para baixo desse valor. Parecia detector barato
e quase completo. Mas a emenda `202643830011` é de **R$ 7,00 de verdade** — a
página pública confirma —, e o piso reprovaria a coleta inteira por causa de um
dado correto, para sempre. Falso positivo permanente é pior que o defeito que
ele tenta pegar. A conferência passou a usar só provas sem número mágico: duas
leituras da mesma emenda têm de concordar, e pago não pode passar de empenhado.

**429 não é recusa, é "espere".** O `buscarJson` desistia na primeira em
qualquer 4xx, com a justificativa de que 4xx é determinística. Vale para 400,
403 e 404, e não vale para 429 — que é justamente o código que pede o
contrário. Em 02/09/2026 o TSE devolveu 429 na candidatura 210 de 410, depois
de rodarmos a coleta quatro vezes na mesma hora depurando outra coisa; o passo
morreu em 4 segundos com metade do dado na mão. Agora 429 repete, respeitando o
`Retry-After` quando o servidor manda um. Os outros 4xx continuam desistindo na
primeira.

**Falha de rede ganha paciência; recusa do servidor, não.** Em 02/09/2026 a
coleta agendada perdeu a Câmara inteira — bancada e votações — com
`fetch failed`, que é erro de conexão: não houve resposta nenhuma. O passo
durou 47s, e a conta fechava com 4 tentativas penduradas ~10s cada mais 4,8s
de pausa. O Senado e o TSE passaram no mesmo job, e a mesma coleta rodou na
máquina sem erro minutos depois — foi soluço de um ou dois minutos do lado da
Câmara, e custou os dados do dia.

Agora são seis tentativas com espera dobrando (~25s somados) e teto de 15s por
conexão, para a tentativa desistir em tempo conhecido em vez de ficar pendurada
esperando pacote que não vem. Cada repetição escreve uma linha no log: o log do
episódio dizia só "Coleta falhou: fetch failed", sem dizer contra quem nem
quantas vezes tentou.

O que **não** mudou: resposta 4xx continua desistindo na primeira. O servidor
entendeu o pedido e recusou, e insistir só multiplica a carga sobre um serviço
público para receber a mesma recusa.

**A coleta confere a fonte antes de publicar, e se recusa a publicar número
que não confere.** Em 01/09/2026 a API do Portal da Transparência passou a
devolver valor monetário **dividido por 10.000**, de forma intermitente e por
campo. Na mesma resposta, para a emenda `202539120004`: `valorEmpenhado`
veio `"25,00"` — a página pública do portal diz R$ 250.000,00 — enquanto
`valorPago` veio certo, `"245.000,00"`. Duas coletas com dez minutos de
diferença deram totais diferentes para o mesmo conjunto de emendas.

Isso é o pior tipo de erro para este projeto: não quebra nada, não aparece em
log, e vai para a tela ao lado de um selo de "dado oficial". Então a coleta
passou a fazer três provas — duas consultas seguidas têm de concordar; pago
não pode passar de empenhado; empenhado não fica abaixo de R$ 1.000 — e, se
reprovar, **não publica nada**: grava o veredito, e a ficha explica o que
aconteceu, com um exemplo cru da fonte e o link para o portal.

Não é caso especial de emenda. É o que qualquer fonte deste site deveria ter:
a promessa de que todo número é defensável só vale se alguém conferir.

**Emenda não é atribuída por nome, é atribuída por nome E código de autor.**
O Portal da Transparência identifica o autor da emenda por nome, sem
identificador, e o filtro `nomeAutor` da API casa por CONTEÚDO: `nomeAutor=NETO`
devolve emendas de oito pessoas, entre elas DOMINGOS NETO e AMARO NETO. Aceitar
o retorno da API seria atribuir gasto público a quem não o destinou — o erro
mais grave que este site pode cometer. A coleta exige igualdade de nome e,
além disso, código de autor único: os dígitos 5 a 8 do código da emenda
(`ano+autor+numero`) identificam o autor, e nome com dois códigos diferentes
não recebe atribuição nenhuma. A ficha diz que a fonte não permite separar as
pessoas, em vez de mostrar um número. Preferir o silêncio ao número errado.

**Empenhado e pago aparecem sempre juntos.** Empenhar é reservar; pagar é o
dinheiro sair. Só o empenhado sugeriria dinheiro entregue que talvez não tenha
saído; só o pago esconderia o que foi destinado. A ficha mostra os dois, a
diferença entre eles em reais, e explica os restos a pagar — é a leitura que
mais muda de sentido quando falta.

**A comparação de emenda é dentro do cargo.** Senador tem cota de emenda maior
que deputado: a mediana do ES é de R$ 115 mi para os dez deputados e R$ 268 mi
para os três senadores. Uma mediana única das duas coisas descreveria mal as
duas, e a regra 4 pede denominador honesto, não denominador qualquer.

**Deputado de primeiro mandato não tem emenda de 2023, e a ficha explica por
quê.** O Orçamento de um ano é emendado no ano anterior: quem assumiu em 2023
não participou da elaboração do Orçamento de 2023. Sem a frase, o vazio parece
inércia da pessoa. Regra 5.

**No celular a tabela vira lista de fichas, e não tabela que se arrasta.**
Rolagem lateral dentro de página que já rola na vertical não se anuncia
sozinha: quem abria os gastos de um deputado no telefone via três colunas de
cinco e não tinha como saber que faltavam duas. Abaixo de 640 px cada linha
passa a ser uma ficha, e o rótulo da coluna acompanha o dado. Os papéis ARIA
estão escritos à mão em `components/ui/table.tsx` porque `display: block`
apaga a semântica de tabela que o navegador deriva do elemento — sem eles o
leitor de tela perderia a relação entre célula e cabeçalho, que é justamente
o que a ficha precisa preservar. O que ainda rolar de lado em tela larga rola
com barra visível e sem sequestrar o gesto de voltar do navegador.

**Etiqueta longa quebra linha.** `Badge` tinha `whitespace-nowrap`, e
"Requerimento de Registro de Frente Parlamentar — 284" pede 588 px: em 375 px
empurrava a ficha inteira para a rolagem lateral. Era o sintoma mais visível
do problema, porque arrastava a PÁGINA e não um bloco. Etiqueta curta não
quebra de qualquer jeito.

**A CSP de desenvolvimento aceita `unsafe-eval`; a de produção, não.** O
`next dev` monta a atualização a quente avaliando string como JavaScript, e
sem a exceção nada hidratava no servidor local: a tela aparecia igual e morta,
com o erro só no console. Custou uma sessão de investigação. A produção segue
sem `unsafe-eval`, e a conferência de interface passa a ser feita no build de
produção — que é onde a CSP vale de verdade. Há uma configuração
`fato-e-voto-producao` em `.claude/launch.json` para isso.

**Link de fonte tem que levar ao fato, não à página onde o fato mora.**
Citar "art. 45" e apontar para os 1,8 MB da Constituição inteira é quase não
citar: a pessoa desiste antes de achar. Vale para tudo — se a fonte publica
âncora, parágrafo ou identificador, o link usa. E a âncora se confere no HTML
servido antes de ir para o repositório, como toda URL de fonte desde o
episódio do link do TSE que abria numa tela de erro.

**O tour não é um portão na entrada.** Um tutorial obrigatório atrapalharia
quem chegou para procurar um nome, precisaria de `localStorage` para não se
repetir — desmentindo a página de privacidade — e seria esquecido antes de a
pessoa chegar na tabela de votações. O conteúdo vive em três camadas: a página,
um convite na home e a explicação ao lado do termo, que é a que resolve a
dúvida no segundo em que ela aparece.

**O cabeçalho comporta três itens, não quatro.** No celular eles dividem a
largura em partes iguais; o quarto estoura a tela em 360px. Ficam os três da
jornada principal — chegar, procurar, entender.

**A ficha de senador não mostra despesa.** O equivalente senatorial da cota
parlamentar (CEAPS) não está nos dados abertos do Senado em formato coletável.
A ficha diz isso com todas as letras, para a diferença em relação à ficha de
deputado federal não ser lida como diferença entre as pessoas.

**Matérias de autoria aparecem agrupadas por tipo, nunca somadas.** Um
requerimento de sessão solene e um projeto de lei pesam muito diferente; um
total único descreveria mal.

**A tarja mudou de sentido.** Antes avisava que os dados eram fictícios. Agora
informa a data da coleta e quantos registros ainda estão em julgamento — que é
o alerta que importa nesta fase da eleição.

**Proposta de governo só existe para Presidente e Governador.** A lei só a exige
de candidatura majoritária do Executivo. A ficha de um deputado diz que o cargo
não entrega o documento, em vez de dizer que ele não foi fornecido — a segunda
frase inventaria uma omissão inexistente.

**Mandato aparece mesmo quando a pessoa disputa outro cargo.** Deputado federal
em exercício que concorre a governador continua tendo mandato, e escondê-lo
seria esconder o que o eleitor tem mais motivo para consultar. A aba diz com
todas as letras que o mandato é de deputado federal.

**Casamento entre TSE e Câmara exige nome de urna E nome civil.** As duas fontes
não compartilham identificador. Entre as 575 candidaturas do ES há nome de urna
repetido; exigir os dois nomes evita ligar a pessoa errada a um gasto público.

**Nenhum total de despesa vai à tela sozinho.** Sempre ao lado da mediana e da
faixa da bancada. Sem denominador, número maior parece melhor ou pior — e isso
seria um ranking involuntário.

**CPF e título de eleitor são descartados na coleta**, antes de qualquer
gravação. Nem o snapshot bruto os conserva.

**O projeto não identifica seus autores.** Assina como três estudantes, sem
nome de responsável. A auditabilidade vem do código e dos dados abertos, não de
quem assina — o que a prática usual de transparência pede como "responsável
identificado" é atendido aqui pelo canal de correção.

**As convenções do gov.br foram adotadas; a marca dele, não.** Contraste,
alvo de toque de 48 px, link sublinhado e foco visível vieram do padrão. A
aparência não: em 28/08/2026 a identidade foi refeita justamente para o site
não ser confundido com um portal oficial. A tarja do topo diz isso em toda
página e não deve ser removida.

**A licença é AGPL-3.0.** O projeto se declara auditável e open source; a
licença permissiva (MIT, Apache) deixaria um fork adulterado ficar fechado, o
que contradiz a proposta. A AGPL é copyleft de rede: quem hospeda versão
modificada tem de publicar o código modificado. O rodapé do site linka o
repositório e cita a licença — é o aviso legal que a AGPL exige de serviço em
rede, não enfeite.

**A cópia aninhada de `postcss` no `next` é forçada por `overrides`.** O
`npm audit` acusava o `postcss <= 8.4.31` que o `next 15` embute, com CVE de
leitura de arquivo via `sourceMappingURL`. É dependência de build e o CSS é
todo do repositório, mas o `overrides` no `package.json` alinha a versão em
toda a árvore sem custo — `npm audit` foi a zero. A trava de verdade contra
CSS envenenado é a revisão de PR sobre `.css` (`CODEOWNERS`). Reavaliar ao
subir para `next 16`, que corrige na raiz.

## Como rodar a coleta

```bash
npm run coleta:tse                # 575 candidaturas do ES (TSE)
npm run coleta:camara             # bancada federal do ES (Câmara)
npm run coleta:senado             # senadores do ES (Senado)
npm run coleta:emendas-estaduais  # emendas estaduais (SEFAZ, sem token)
npm run coleta:tse:normalizar     # reconstrói o normalizado sem tocar na rede
```

O terceiro existe porque corrigir uma regra de normalização não deve custar 575
requisições a um serviço público.

## Retomar em outra máquina

```bash
git clone https://github.com/gabriel89-exe/Fato-Voto.git
cd Fato-Voto
npm install
npm run dev
```

Não falta variável de ambiente para rodar: a única que o código lê é
`NEXT_PUBLIC_SITE_URL`, e ela está indefinida de propósito (ver "Falta").
`node_modules`, `.next` e `dados-brutos/` não vêm no clone — os dois primeiros o
`npm install` refaz, e o terceiro os scripts de coleta reconstroem.

Este arquivo é o ponto de partida: `docs/principios.md` diz o que o projeto se
recusa a fazer, e `docs/fontes-de-dados.md` diz onde cada fonte pública trava.
A data no topo de cada seção importa — a coleta roda todo dia e o repositório
muda sozinho.
