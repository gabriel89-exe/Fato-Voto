# Andamento

## Onde estamos

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
- [x] **Auditoria de toque em 360 px** — gaveta de filtros, abas da ficha e
      botão de fechar acertados para 48 px.


## Falta

### Bloqueia a divulgação — depende de decisão, não de código

- [ ] **Domínio de produção** (`NEXT_PUBLIC_SITE_URL`). Enquanto vazio, o
      sitemap, o `robots.txt` e as tags de compartilhamento geram URL errada.
- [ ] **E-mail do projeto.** `EMAIL_CONTATO` em `lib/site.ts` fica `""` de
      propósito até existir um endereço do próprio projeto — nunca preencher
      com endereço pessoal nem com placeholder. Sem ele, a promessa de canal
      de correção em "Quem somos" não se cumpre.
- [ ] **Licença.** Não há arquivo `LICENSE`, e o projeto se declara open
      source. Sem licença, ninguém tem direito legal de reusar o código.

### Dados

- [ ] **Emendas parlamentares** — depende do token do Portal da Transparência.
      É pedir cadastro e guardar como secret do repositório.
- [ ] **Votações e projetos** — Câmara e Senado, fontes abertas já mapeadas em
      `docs/fontes-de-dados.md`. Trabalho de coleta, sem bloqueio externo.
- [ ] **Atuação de deputado estadual** — a ALES não tem API. Maior incerteza,
      e a que mais pesa: deixa o cargo com mais candidaturas sem aba de
      mandato.
- [ ] **Lacunas já visíveis nos dados atuais** — `bens` vem vazio em 195 das
      575 candidaturas e `eleicoesAnteriores` em 178. A omissão é da fonte; o
      que cabe conferir é se a ficha diz *por que* está vazio (regra 7 de
      `docs/principios.md`).

### Interface

- [ ] **Comparador** — `/comparar` continua sendo um aviso, por decisão. As
      quatro regras que a comparação precisa respeitar já estão escritas no
      topo do arquivo, e os controles necessários já existem vestidos. Não
      construir sem pedido explícito.

### Documentação desatualizada

Nada disto muda comportamento, mas confunde quem chegar ao projeto:

- [ ] `docs/principios.md` ainda descreve a tarja como anunciando dados
      fictícios (seção "A transição de fictício para real"), e promete um
      seletor de estado com URL `/es/...` que não existe — as rotas são planas
      e o ES está fixo.
- [ ] `README.md` lista só TSE e Câmara como fontes; o Senado já é fonte e já
      tem `npm run coleta:senado`. E o aviso sobre o `&` no nome da pasta não
      vale mais.
- [ ] `TarjaPrototipo` já não é tarja de protótipo — o nome mente sobre o que
      o componente faz.
- [ ] `.github/workflows/coleta.yml` cita "232 registros em julgamento" como
      número fixo; ele muda a cada coleta.

## Decisões registradas

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

## Como rodar a coleta

```bash
npm run coleta:tse              # 575 candidaturas do ES (TSE)
npm run coleta:camara           # bancada federal do ES (Câmara)
npm run coleta:senado           # senadores do ES (Senado)
npm run coleta:tse:normalizar   # reconstrói o normalizado sem tocar na rede
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
