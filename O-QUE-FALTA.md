# O que falta para finalizar

Levantamento de **07/09/2026**, refeito depois de uma revisão completa do
projeto. É a lista curta e acionável; o raciocínio de cada decisão está no
[`ANDAMENTO.md`](ANDAMENTO.md), e o mapa das fontes em
[`docs/fontes-de-dados.md`](docs/fontes-de-dados.md).

Ordem proposital: o que trava a divulgação vem primeiro, e nada disso é código.

---

## 1. Bloqueia a divulgação — depende de pessoa, não de código

### 1.1 Domínio de produção

**O que fazer:** definir `NEXT_PUBLIC_SITE_URL` na Vercel com o domínio final.

**Por que trava:** enquanto vazio, o `sitemap.xml`, o `robots.txt` e as tags de
compartilhamento geram URL errada. Um link do site colado no WhatsApp mostra
pré-visualização quebrada, e o Google indexa endereço que não existe.

**Custo:** minutos, depois de decidir o domínio.

### 1.2 Revisão jurídica da página de privacidade

**O que fazer:** um advogado ler `/privacidade` antes da divulgação.

**Por que trava:** o site publica dado pessoal — e **sensível**, no caso de cor
ou raça — de 575 pessoas identificadas. O enquadramento legal escrito na página
é o raciocínio do projeto, não parecer. Uma leitura profissional é barata perto
do risco.

**Custo:** depende de encontrar quem faça.

---

## 2. Emendas federais — pronto, esperando a fonte

A integração está **completa, conferida e no ar**. O que falta não é nosso.

### O estado hoje

As fichas de deputado federal e senador mostram, na aba Mandato: **quantas
emendas**, **para quais municípios**, **em que áreas**, **ano a ano**, e a lista
com link para a página de cada emenda no portal.

**O valor em reais não aparece** — e a ficha diz por quê, com um exemplo cru da
fonte.

### Por que o valor está suspenso

A API do Portal da Transparência devolve valor monetário **dividido por
10.000**, de forma intermitente e aleatória.

Medido em 07/09/2026, 24 emendas com 6 leituras cada: **17% ainda oscilam**.
Melhorou — era cerca de 30% em 02/09 —, mas não consertou. Duas hipóteses de
causa foram testadas e descartadas: **não é ritmo de requisição** (a taxa é a
mesma com pausa de 600ms, 180ms ou nenhuma) e **não é reuso de conexão** (mesma
taxa com `keepAlive` ligado e desligado).

Cuidado ao reavaliar: uma amostra de 3 leituras por registro **parece limpa** e
não é. Foi exatamente esse erro que me fez concluir, em 07/09, que a fonte tinha
consertado. Use 6 leituras ou mais.

### O que fazer

**Relatar ao Portal da Transparência.** Canal: Fala.BR
(<https://falabr.cgu.gov.br>), como pedido de informação ou reclamação sobre a
API de dados abertos.

O relato precisa de: o endpoint (`/api-de-dados/emendas`), o `codigoEmenda`, o
valor devolvido, o valor da página pública e a taxa observada. Está tudo em
`docs/fontes-de-dados.md`.

### O que NÃO fazer

Publicar o valor mesmo assim. A corrupção só encolhe, nunca infla, então ler
várias vezes e ficar com o maior acertaria na maioria — e **erraria em silêncio
para menos** nos registros que nunca viessem limpos. Numa plataforma de
transparência, subnotificar gasto público é o pior erro possível.

### Quando a fonte consertar

**Nada precisa ser feito.** A coleta roda todo dia, a conferência aprova sozinha
e os valores aparecem na coleta seguinte, com mediana e faixa da bancada. O
código dos dois modos já está escrito e testado.

---

## 3. Dados que faltam

### 3.1 Atuação de deputado estadual em plenário

O que sobrou da lacuna estadual depois de 02/09: **votações, presença e
projetos**. A ALES não tem API.

**O que já foi resolvido:** as emendas estaduais, pela SEFAZ
(`dados.es.gov.br`), com valores íntegros e conferência aprovada. 29 fichas
ganharam aba de Mandato. O cargo deixou de ser um vazio.

### 3.2 Emendas de bancada e de comissão

Emenda coletiva move dinheiro e **não tem autor individual na fonte**. Não entra
na soma de pessoa nenhuma, nem deveria. Mostrá-la exige uma tela que descreva a
bancada do estado, não a pessoa candidata — é produto novo, não ajuste.

### 3.3 Quatro autores estaduais sem ficha

`Danilo Bahiense`, `Iriny Lopes`, `Lucas Scaramussa` e `Theodorico Ferraço` não
casaram com nenhuma candidatura de 2026 — não são candidatos, ou o nome mudou. Estão
declarados no próprio dado, com o motivo. Vale conferir se algum é candidato sob
outro nome de urna.

### 3.4 Lacunas já visíveis nos dados atuais

`bens` vem vazio em **195 das 575** candidaturas, e `eleicoesAnteriores` em
**178**. A omissão é da fonte. O que falta conferir é se a ficha diz *por que*
está vazio em cada caso, como manda a regra 5 de `docs/principios.md`.

---

## 3.5 Salário dos cargos — falta a fonte, não o código

**O que se quer:** mostrar quanto paga cada cargo em disputa, na
`/como-funciona` e na ficha de quem tem mandato.

**O que impede:** procedência. O valor do subsídio é público e fixado por
lei, mas em 08/09/2026 nenhum caminho testado devolveu o número numa fonte
citável:

| Onde | Resultado |
|---|---|
| `camara.leg.br/transparencia/remuneracao-e-verbas` | 404 |
| `www2.camara.leg.br/transparencia/recursos-humanos/remuneracao` | valores renderizados por JS, ausentes no HTML servido |
| Tabelas de remuneração → "Deputados Federais" | PDF de **servidores**, não do subsídio de deputado |
| `al.es.gov.br/Transparencia/RemuneracaoDeputados` | sem valores no HTML |
| `senado.leg.br/transparencia/rh/remuneracao-dos-senadores` | 404 |

Saber o valor de cabeça não basta: a regra 2 exige fonte à vista. **Não
publicar número sem procedência.**

**Caminhos ainda não testados:** arquivos abertos do Senado, Diário Oficial
da União (o decreto legislativo que fixa o subsídio), e o portal de
transparência da ALES em formato de arquivo.

## 3.6 Presença em sessões — a API não tem o que torna o dado justo

**O que se quer:** quantas sessões houve, quantas a pessoa compareceu,
quantas ausências foram justificadas.

**O que a API da Câmara dá:** `/deputados/{id}/eventos` (eventos de que
participou) e `/eventos/{id}/deputados` (quem esteve num evento).

**O que ela NÃO dá:** frequência em plenário de forma agregada, e —
decisivo — **a justificativa de ausência**. Sem separar licença médica,
licença-maternidade e missão oficial, "compareceu a 140 de 200" vira
acusação, não fato. O projeto já tem decisão registrada contra placar de
presença exatamente por isso.

**Só vale construir com raspagem** do portal de frequência da Câmara, fora
da API. É mais frágil e precisa de decisão de pessoa sobre o risco.

**"Quantos projetos aprovou" não entra**, mesmo que o dado existisse:
aprovação depende de relator, pauta e acordo de líderes, e a contagem
repetiria o ranking de produtividade que a decisão sobre proposições já
recusou.

## 4. Interface

### 4.1 Comparador

`/comparar` segue sendo um aviso, **por decisão**. As quatro regras que a
comparação teria de respeitar já estão escritas no topo do arquivo, e os
controles necessários já existem vestidos no kit.

**Não construir sem pedido explícito.** Comparação é onde este site mais
facilmente vira ranking involuntário.

---

## 5. Operação — o que vigiar

### 5.1 Câmara e Senado caem de forma intermitente

**Assinatura:** o passo dura ~88 segundos e termina com `fetch failed` — as seis
tentativas do `buscarJson` esgotando contra uma conexão que não se estabelece.

**Frequência:** 2 das 6 execuções agendadas entre 02/09 e 07/09, alternando
entre as duas fontes. Em 07/09 foi a Câmara, e os dados dela ficaram um dia
atrás.

**Não há conserto no código.** A paciência já foi ao limite razoável: seis
tentativas, espera dobrando até ~25s, teto de 15s por conexão. É a
infraestrutura dessas APIs recusando conexão do runner do GitHub.

**Se piorar,** a saída seria coletar de um IP brasileiro — runner próprio ou uma
máquina pequena no Brasil. É decisão de infraestrutura, não de código.

### 5.2 Proteção de branch

O `CODEOWNERS` e o template de PR já existem, mas só passam a valer com
"Require review from Code Owners" ligado nas configurações do GitHub. Ver
`docs/integridade-e-acesso.md` — inclusive o aviso de que a proteção quebra o
push diário da coleta sem um bypass para `github-actions[bot]`.

### 5.3 2FA obrigatório

Para todo colaborador com escrita no repositório.

---

## 6. Documentação desatualizada

Nada disto muda comportamento, mas confunde quem chegar ao projeto:

- `docs/principios.md` ainda descreve a tarja como anunciando dados fictícios, e
  promete um seletor de estado com URL `/es/...` que não existe — as rotas são
  planas e o ES está fixo.
- `TarjaPrototipo` já não é tarja de protótipo; o nome mente sobre o que o
  componente faz.
- `.github/workflows/coleta.yml` cita "232 registros em julgamento" como número
  fixo; em 07/09/2026 eram 98.

---

## Resolvido desde o levantamento anterior

Para não reabrir o que já foi fechado:

- **Arquivo `LICENSE`** (07/09) — texto canônico da AGPL-3.0, verbatim.
  O projeto deixou de prometer abertura sem entregar o direito de reuso.
- **Emendas estaduais** (02/09) — a fonte que a documentação dizia não existir.
  Era a maior lacuna do projeto.
- **Secret `TRANSPARENCIA_TOKEN`** (01/09) — cadastrado e confirmado em log.
- **CI vermelho todo dia** (07/09) — reprovação da conferência virou anotação
  amarela em vez de falha. Vermelho volta a significar algo.
- **TSE devolvendo 429** (02/09) — 429 passou a ser tratado como "espere".
- **Commit da coleta morrendo em conflito** (02/09) — alinha com o `main` antes
  de commitar, não depois.

---

## Resumo em uma linha

O produto está pronto. **Faltam dois passos de pessoa** — domínio e revisão
jurídica — e **um passo de terceiro**: o Portal da Transparência
terminar de consertar a API de emendas. O resto é ampliação, não conclusão.
