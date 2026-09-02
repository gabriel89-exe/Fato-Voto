# O que falta para finalizar

Levantamento de **02/09/2026**, feito ao fim da integração com o Portal da
Transparência. É a lista curta e acionável; o raciocínio de cada decisão está
no [`ANDAMENTO.md`](ANDAMENTO.md), e o mapa das fontes em
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

### 1.2 Arquivo `LICENSE`

**O que fazer:** adicionar pelo seletor de licença do GitHub, escolhendo
**AGPL-3.0-only**.

**Por que trava:** o `package.json`, o `README.md` e o rodapé do site já
declaram AGPL-3.0-only, mas **sem o arquivo ninguém tem direito legal de
reusar o código**. Um projeto que se diz aberto e não entrega licença está
fazendo uma promessa que não cumpre.

**Custo:** dois minutos. É o item de menor esforço e maior desproporção.

### 1.3 Revisão jurídica da página de privacidade

**O que fazer:** um advogado ler `/privacidade` antes da divulgação.

**Por que trava:** o site publica dado pessoal — e **sensível**, no caso de cor
ou raça — de 575 pessoas identificadas. O enquadramento legal escrito na página
é o raciocínio do projeto, não parecer. Uma leitura profissional é barata perto
do risco.

**Custo:** depende de encontrar quem faça.

---

## 2. Emendas parlamentares — pronto, esperando a fonte

A integração está **completa, conferida e no ar**. O que falta não é nosso.

### O estado hoje

As fichas de deputado federal e senador mostram, na aba Mandato: **quantas
emendas**, **para quais municípios**, **em que áreas**, **ano a ano**, e a lista
com link para a página de cada emenda no portal.

**O valor em reais não aparece** — e a ficha diz por quê, com um exemplo cru da
fonte.

### Por que o valor está suspenso

A API do Portal da Transparência devolve valor monetário **dividido por
10.000**, de forma intermitente. Medido em 02/09/2026, dez consultas seguidas ao
mesmo código, contra a página pública do próprio portal:

| Emenda | Página pública | O que a API devolveu |
|---|---|---|
| `202533120003` | R$ 200.000,00 | `"20,00"` 9× · `"200.000,00"` 1× |
| `202543840005` | R$ 1.400.000,00 | `"140,00"` 9× · `"1.400.000,00"` 1× |
| `202643830011` | R$ 7,00 | `"7,00"` 10× (correto) |

Cerca de **uma leitura correta a cada dez** nos registros afetados. Os campos de
texto — código, ano, tipo, função, localidade — são estáveis: 30 emendas lidas
três vezes cada, zero divergência. Por isso a ficha mostra tudo, menos o
dinheiro.

### O que fazer

**Relatar ao Portal da Transparência.** Canal: Fala.BR
(<https://falabr.cgu.gov.br>), como pedido de informação ou reclamação sobre a
API de dados abertos.

O relato precisa de: o endpoint (`/api-de-dados/emendas`), o `codigoEmenda`, o
valor devolvido, o valor da página pública e a taxa observada. Está tudo na
tabela acima e em `docs/fontes-de-dados.md`.

### O que NÃO fazer

Publicar o valor mesmo assim. A corrupção só encolhe, nunca infla, então ler
várias vezes e ficar com o maior acertaria na maioria — e **erraria em silêncio
para menos** nos registros que nunca viessem limpos. Numa plataforma de
transparência, subnotificar gasto público é o pior erro possível. A decisão está
registrada no `ANDAMENTO.md`.

### Quando a fonte consertar

**Nada precisa ser feito.** A coleta roda todo dia, a conferência aprova sozinha
e os valores aparecem na coleta seguinte, com mediana e faixa da bancada. O
código dos dois modos já está escrito e testado.

---

## 3. Dados que faltam

### 3.1 Atuação de deputado estadual — a maior lacuna

A Assembleia Legislativa do ES **não tem API**. Há portal de dados abertos e de
transparência, com frequência em plenário e verba de gabinete, mas sem interface
documentada — provavelmente exige raspagem de HTML/CSV.

**Peso:** é o cargo com mais candidaturas no piloto, e o único sem nenhuma aba
de mandato. Quem procurar um deputado estadual encontra a ficha de candidatura e
nada sobre o que a pessoa fez.

### 3.2 Emendas de bancada e de comissão

Emenda coletiva move dinheiro e **não tem autor individual na fonte**. Não entra
na soma de pessoa nenhuma, nem deveria. Mostrá-la exige uma tela que descreva a
bancada do estado, não a pessoa candidata — é produto novo, não ajuste.

### 3.3 Lacunas já visíveis nos dados atuais

`bens` vem vazio em **195 das 575** candidaturas, e `eleicoesAnteriores` em
**178**. A omissão é da fonte. O que falta conferir é se a ficha diz *por que*
está vazio em cada caso, como manda a regra 5 de `docs/principios.md`.

---

## 4. Interface

### 4.1 Comparador

`/comparar` segue sendo um aviso, **por decisão**. As quatro regras que a
comparação teria de respeitar já estão escritas no topo do arquivo, e os
controles necessários já existem vestidos no kit.

**Não construir sem pedido explícito.** Comparação é onde este site mais
facilmente vira ranking involuntário.

---

## 5. Operação — o que vigiar

### 5.1 A coleta diária das 6h17

Em 02/09/2026 ela falhou três vezes seguidas, por três motivos diferentes. Todos
já corrigidos, mas vale conferir o resultado da próxima execução agendada:

| O que aconteceu | Correção |
|---|---|
| TSE devolveu `HTTP 429` na candidatura 210 de 410 | 429 passa a ser tratado como "espere", com `Retry-After` |
| Câmara caiu com `fetch failed` por ~1 minuto | seis tentativas, espera dobrando, teto de 15s por conexão |
| O commit da coleta morreu em conflito de rebase | alinha com o `main` **antes** de commitar, não depois |

As cinco coletas anteriores (29/08 a 01/09) passaram. As falhas foram do dia,
não estruturais — o 429 do TSE foi provocado por termos disparado a coleta
quatro vezes em uma hora, depurando.

**O que olhar:** se a Câmara falhar de novo com `fetch failed`, não é mais
soluço. Aí seria a Câmara recusando conexão do runner do GitHub, e o conserto
não está no código — teria que ser outro caminho de rede.

**Ponto de atenção:** o endpoint `deputados?siglaUf=ES` levou **9,1 segundos**
numa medição local. É lento por natureza, e o teto por conexão é de 15s. Se
ficar mais lento, vira falha.

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
  fixo; ele muda a cada coleta.

---

## Resumo em uma linha

O produto está pronto. **Faltam três passos de pessoa** — domínio, licença e
revisão jurídica — e **um passo de terceiro**: o Portal da Transparência
consertar a API de emendas. O resto é ampliação, não conclusão.
