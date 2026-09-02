# Fontes de dados

Mapa das fontes públicas que alimentam a plataforma, o que cada uma entrega de
fato e onde cada uma trava. Verificado em **27/08/2026**.

Portais públicos mudam sem aviso. Se algo aqui parar de bater com a realidade,
**corrija este arquivo no mesmo commit em que corrigir o código** — um mapa
desatualizado custa mais caro que mapa nenhum, porque manda a pessoa para o
lugar errado com confiança.

---

## Resumo

| Fonte | Entrega | Acesso por script? |
|---|---|---|
| TSE — DivulgaCandContas | Candidaturas, bens, propostas, certidões | Sim, via `fetch` do Node |
| TSE — Dados Abertos | Os mesmos dados, em lote (ZIP/CSV) | Não testado |
| Câmara dos Deputados | Mandato federal: votações, despesas, proposições | Sim, livre |
| Senado Federal | Mandato: autorias e mandatos | Sim, livre |
| Portal da Transparência | Emendas parlamentares federais | Sim, **exige token** — obtido em 01/09/2026 |
| SEFAZ-ES (dados.es.gov.br) | Emendas parlamentares **estaduais** | Sim, livre — CSVs via CKAN |
| ALES (Assembleia do ES) | Atuação em plenário (votações, presença, projetos) | Não há API |

---

## TSE — DivulgaCandContas

**O melhor caminho para candidaturas.** É a API que serve o site público de
divulgação de candidaturas. Dispensa os arquivos em lote e está sempre
atualizada.

Base: `https://divulgacandcontas.tse.jus.br/divulga/rest/v1`

O `idEleicao` das eleições gerais de **2026 é `20322002026`**.

### Endpoints

```
/eleicao/anos-eleitorais
/eleicao/eleicao-atual?idEleicao={idEleicao}
/candidatura/listar/2026/{UF}/{idEleicao}/{codCargo}/candidatos
/candidatura/buscar/2026/{UF}/{idEleicao}/candidato/{idCandidato}
```

A ordem dos segmentos importa: `.../2026/ES/{idEleicao}/...` funciona,
`.../2026/{idEleicao}/ES/...` devolve 400.

### O TSE limita requisição, e responde 429

A coleta pede uma ficha por candidatura — 575 no ES — em sequência, sem pausa.
No ritmo diário isso passa sem problema. Rodando várias vezes na mesma hora,
não: em 02/09/2026 a coleta foi disparada quatro vezes enquanto depurávamos
outra coisa, e a quarta levou `HTTP 429` na candidatura 210 de 410.

Não há limite documentado. `buscarJson` trata 429 como espera, não como
recusa — respeitando `Retry-After` quando o servidor manda um. Se voltar a
acontecer no ritmo normal, o caminho é espaçar as requisições, e não insistir
mais forte.

### Códigos de cargo

| Código | Cargo |
|---|---|
| 1 | Presidente |
| 2 | Vice-presidente |
| 3 | Governador |
| 4 | Vice-governador |
| 5 | Senador |
| 6 | Deputado Federal |
| 7 | Deputado Estadual |
| 9 / 10 | 1º e 2º Suplente de senador |

### Tipos de documento (codTipo)

O TSE não publica esta tabela. Levantada cruzando o `codTipo` com nomes de
arquivo auto-descritivos nas 4.026 peças coletadas no ES:

| codTipo | Documento |
|---|---|
| 5 | Proposta de governo |
| 11 | Certidão criminal — Justiça Federal, 1º grau |
| 12 | Certidão criminal — Justiça Federal, 2º grau |
| 13 | Certidão criminal — Justiça Estadual, 1º grau |
| 14 | Certidão criminal — Justiça Estadual, 2º grau |
| 15 | Certidão da Justiça Eleitoral |

**Proposta de governo só existe para Presidente e Governador.** A lei só a
exige de candidatura majoritária do Executivo. Na coleta do ES: 18 de 18
obrigadas anexaram, e nenhuma das 557 não-obrigadas. Escrever "proposta não
fornecida" na ficha de um deputado inventaria uma falta inexistente.

### O que o detalhe do candidato traz

Numa única chamada: identificação e número de urna, partido e coligação, bens
declarados com total, **arquivos em PDF** (proposta de governo e certidões
criminais), situação do registro, **eleições anteriores**, gasto de campanha,
processos de cassação, escolaridade, ocupação, cor/raça e naturalidade.

### Dois cuidados obrigatórios

**Não republicar CPF nem título de eleitor.** Os dois vêm no retorno. Devem ser
descartados **na coleta**, antes de qualquer gravação: dado sensível que não é
gravado não vaza.

**Respeitar as flags de divulgação.** O retorno traz `st_DIVULGA`,
`st_DIVULGA_BENS` e `st_DIVULGA_ARQUIVOS` — o próprio tribunal marca, caso a
caso, o que está autorizado a aparecer. Quando um campo for omitido por
determinação da fonte, **dizer isso na tela**, em vez de deixar o campo mudo:
espaço vazio sem explicação é lido como culpa do candidato.

### Volume do piloto (ES, 2026)

| Cargo | Candidaturas |
|---|---|
| Presidente (nacional) | 13 |
| Governador | 5 |
| Senador | 11 |
| Deputado Federal | 136 |
| Deputado Estadual | 410 |
| **Total** | **575** |

575 chamadas de detalhe (coleta de 27/08/2026 — o número muda a cada dia,
conforme renúncias e substituições). Coleta de minutos, não de gigabytes.

---

## TSE — Portal de Dados Abertos

`https://dadosabertos.tse.jus.br` — os mesmos dados em lote: candidaturas, bens,
coligações, **proposta de governo por UF** e **certidões criminais por UF**.

Serve como plano B e para séries históricas. Para o dia a dia, o
DivulgaCandContas é melhor: mais fresco e sem ZIP de dezenas de MB.

---

## O bloqueio da Akamai (vale para todo `tse.jus.br`)

Todo o domínio responde **403 Access Denied** ao `curl`, **mesmo com
User-Agent de navegador**. O bloqueio é de borda: acontece antes de a
aplicação ver a requisição.

**Mas o `fetch` do Node passa normalmente**, sem cabeçalho nenhum. O bloqueio
é por impressão TLS do cliente, não por User-Agent — o `curl` é reconhecido, o
Node não. Consequência prática: **a coleta roda em Node puro, sem navegador
headless**. Verificado em 27/08/2026.

Sintoma que engana: um caminho errado também volta 403 em vez de 404, porque a
borda responde antes. Ao depurar endpoint do TSE, teste primeiro no navegador —
lá o 404 aparece como 404.

---

## Câmara dos Deputados

`https://dadosabertos.camara.leg.br/api/v2` — aberta, sem chave, sem cadastro.
A mais generosa das fontes: entrega até a **URL do PDF de cada nota fiscal** da
cota parlamentar.

### Duas armadilhas que falham em silêncio

**1. O filtro `ano=` não funciona em despesas.** Em
`/deputados/{id}/despesas`, filtrar por `ano` devolve lista vazia — sem erro,
sem aviso. O que funciona é `idLegislatura`. A legislatura 57 é 2023–2027.

```
✗ /deputados/204356/despesas?ano=2024        → []
✓ /deputados/204356/despesas?idLegislatura=57 → 875 documentos
```

**2. A lista de deputados devolve um registro por filiação, não por pessoa.**
Quem trocou de partido no mandato aparece mais de uma vez. Na coleta de
27/08/2026, as 10 cadeiras do ES vieram como **15 registros**, porque 4
parlamentares mudaram de sigla.

Isso não é defeito: é informação. A coleta junta por `id` e guarda a sequência
de siglas — troca de partido é fato público relevante, registrado sem adjetivo.

---

## Senado Federal

`https://legis.senado.leg.br/dadosabertos` — aberta, funciona por script.

```
/senador/lista/atual?uf={UF}
/senador/{codigo}
/senador/{codigo}/mandatos
/senador/{codigo}/autorias?ano={ano}
```

### Duas armadilhas

**1. Campo ora objeto, ora array.** Com um resultado a API devolve objeto; com
vários, array — herança do XML de origem. Tratar caso a caso é receita para bug
silencioso; normalize sempre (ver `lista()` em `scripts/coleta/senado.mjs`).

**2. Mandatos vêm em ordem decrescente.** Pegar o último elemento do array traz
o mandato mais **antigo**. Magno Malta apareceu com mandato 2003–2011 em vez do
atual, que vai até 2031. Escolha pela data de fim, nunca pela posição.

### Não há CEAPS aqui

O equivalente senatorial da cota parlamentar não está nesta API e não foi
localizado em formato aberto. Enquanto não estiver, a ficha de senador não
mostra gasto — e **diz que não mostra**, para a diferença em relação à ficha de
deputado federal não ser lida como diferença entre as pessoas.

---

## Portal da Transparência — emendas parlamentares

Única fonte de emendas. Tem os dois endpoints de que precisamos: a consulta de
emendas parlamentares e a de documentos por código de emenda.

### O token NÃO é um cadastro de e-mail

A página principal da API ainda diz "cadastre um e-mail", e isso está
desatualizado. A página de cadastro, que é a que vale, exige:

**Autenticação pelo Gov.br com conta Nível Verificado (Prata) ou Comprovado
(Ouro)** — obtida por banco credenciado, certificado digital ou certificado
digital em nuvem. Sem esse selo, dá para usar CPF e senha, mas **só com
verificação em duas etapas habilitada** na conta.

O token chega no e-mail cadastrado na conta Gov.br. Verificado em 29/08/2026.

Consequência prática: **não é um passo de cinco minutos** se ninguém da equipe
tiver conta Prata ou Ouro. Subir de nível pelo aplicativo do banco credenciado
costuma ser o caminho mais rápido; certificado digital é o mais demorado.

Isto é passo de pessoa, não de código. É autenticação com CPF e senha em conta
de governo, e ninguém deve delegá-la — nem a um assistente.

### Depois de ter o token

1. Enviar em cada requisição no header `chave-api-dados`
2. Guardar em `.env.local` para rodar na máquina — **nunca** em arquivo
   versionado
3. Guardar como *secret* do repositório para a coleta agendada usar

Feito em **01/09/2026**. O coletor é `scripts/coleta/transparencia.mjs`, roda
com `npm run coleta:transparencia` e escreve `data/es/emendas.json`.

### O que a API devolve, e as três armadilhas dela

Base: `https://api.portaldatransparencia.gov.br/api-de-dados`

```
/emendas?nomeAutor={NOME}&pagina={n}      lista de emendas
/emendas/documentos/{codigoEmenda}         documentos de execução
```

**Armadilha 1 — `nomeAutor` casa por conteúdo, não por igualdade.**
`nomeAutor=NETO` devolve emendas de oito pessoas diferentes, entre elas
DOMINGOS NETO e AMARO NETO. Quem confiar no filtro da API atribui gasto
público a quem não o destinou. O coletor refaz o casamento por igualdade,
do lado dele.

**Armadilha 2 — o nome do autor vem sem acento.** `HELDER SALOMÃO` devolve
zero; `HELDER SALOMAO` devolve 150. Normalizar antes de consultar.

**Armadilha 3 — valor é texto em formato brasileiro, e pode ser negativo com
espaço depois do sinal:** `"- 26.002,00"` é empenho anulado. Descartar o sinal
transforma anulação em gasto.

**Armadilha 4, a pior — o valor às vezes vem dividido por 10.000.** Aberta em
01/09/2026 e ainda aberta em 02/09/2026. Intermitente e por campo. Na mesma
resposta, para a emenda `202539120004`:

```
valorEmpenhado: "25,00"        a página pública diz R$ 250.000,00
valorPago:      "245.000,00"   correto
```

Duas coletas com dez minutos de diferença deram totais diferentes para o mesmo
conjunto de emendas. Não é erro nosso de parsing: as duas respostas cruas estão
em `dados-brutos/transparencia/`, e a página pública do portal confirma qual
das duas está certa.

Por isso `scripts/coleta/transparencia.mjs` **confere antes de publicar**: duas
consultas seguidas têm de devolver o mesmo valor, pago não pode passar de
empenhado, e empenhado não fica abaixo de R$ 1.000. Reprovou, não publica —
grava o veredito em `conferencia` e a ficha diz o que aconteceu.

Se um dia a fonte estabilizar e a conferência começar a aprovar, nada precisa
mudar no código: o dado volta sozinho na coleta seguinte.

#### O que foi medido em 02/09/2026

A consulta **por código** (`?codigoEmenda=`) erra menos que a consulta por nome,
e por isso a coleta passou a usá-la — mas não resolve. Dez consultas seguidas ao
mesmo código:

| Emenda | Página pública | O que a API devolveu |
|---|---|---|
| `202533120003` | R$ 200.000,00 | `"20,00"` 9× · `"200.000,00"` 1× |
| `202543840005` | R$ 1.400.000,00 | `"140,00"` 9× · `"1.400.000,00"` 1× |
| `202643830011` | R$ 7,00 | `"7,00"` 10× (correto) |

Cerca de **1 leitura correta a cada 10** nos registros afetados. Não existe
consulta confiável: o mesmo endpoint, para o mesmo código, alterna entre o valor
certo e o valor encolhido.

O parâmetro `ano` piora: com ele, o `valorEmpenhado` vinha encolhido em todas as
tentativas. A coleta não usa `ano` — filtra por ano em memória.

**Emenda de R$ 7,00 existe.** A `202643830011` é legítima, e a página pública
confirma. Um piso de grandeza como detector do defeito foi tentado e descartado
por isso: reprovaria a coleta para sempre por causa de um dado correto.

#### Como relatar

A correção depende do Portal. O canal é o Fala.BR
(<https://falabr.cgu.gov.br>), como pedido de informação ou reclamação sobre a
API de dados abertos. O relato precisa de: o endpoint, o `codigoEmenda`, o valor
devolvido, o valor da página pública e a taxa observada — tudo está acima.

### O código da emenda carrega o código do autor

Os 12 dígitos são `ano(4) + autor(4) + numero(4)`: `202539120004` é a emenda
0004 de 2025 do autor 3912. A fonte não publica esse código em campo próprio,
mas ele é a única trava disponível contra homônimo — dois autores com o mesmo
nome têm códigos diferentes. O coletor usa isso: nome com mais de um código de
autor não recebe atribuição nenhuma, e a ficha diz por quê.

Em 01/09/2026 os treze nomes do ES eram únicos entre os deputados das
legislaturas 55, 56 e 57 e entre os senadores em exercício.

### O link que leva ao fato

```
https://portaldatransparencia.gov.br/emendas/detalhe?codigoEmenda={codigo}
```

Abre a página daquela emenda, com autor, valores, função, programa e ação.
Conferido no navegador em 01/09/2026 — a página responde e traz o código
pedido. O `codigoTipoEmenda` que a consulta acrescenta ao link é dispensável.

Duas coisas **não** funcionam e já foram tentadas: `/emendas/{codigo}` dá 404,
e requisição de script ao site (não à API) recebe 405 com uma tela de
verificação de robô. A conferência de âncora aqui é manual, no navegador.

**Nunca chamar a variável de `NEXT_PUBLIC_*`.** Esse prefixo embute o valor no
pacote que vai para o navegador, e o token fica legível por qualquer visitante
sem nada quebrar. Ver [`segredos-e-credenciais.md`](segredos-e-credenciais.md),
que descreve o caminho inteiro da credencial e por que o site nunca a enxerga.

### Limite de requisições

| Faixa | Limite |
|---|---|
| 06:00 – 23:59 | 400 por minuto |
| 00:00 – 05:59 | 700 por minuto |

Folgado para o volume do piloto: são 10 deputados e 3 senadores, e a coleta
roda uma vez por dia.

---

## SEFAZ-ES — Emendas parlamentares estaduais (dados.es.gov.br)

`https://dados.es.gov.br/dataset/portal-da-transparencia-emendas-parlamentares-do-estado`

**Descoberta em 02/09/2026, quando este arquivo ainda dizia que não havia
fonte para deputado estadual.** Havia — só que na SEFAZ, não na ALES: emenda
estadual é executada pelo governo do estado, e quem publica a execução é a
Fazenda, no catálogo CKAN estadual. O erro foi procurar o dado na casa
legislativa.

O que entrega: um CSV por ano da LOA (2021 a 2026), com **`CodAutor`
numérico** ao lado do nome — o identificador que o Portal da Transparência
federal não tem —, valores previsto/empenhado/liquidado/pago/RAP, função,
município, tipo e o texto da finalidade. Atualizado pelo estado com a execução
em andamento (os arquivos de 2026 mudaram no próprio dia da descoberta).

As armadilhas, todas tratadas em `scripts/coleta/emendas-estaduais.mjs`:

- **Uma linha não é uma emenda.** O arquivo tem uma linha por instrumento de
  execução; `ValorPrevisto` repete em cada linha da mesma emenda, os demais
  valores se somam. Contar linhas, ou somar o previsto repetido, publicaria
  número errado com cara de certo.
- **A função orçamentária é da execução, não da emenda** — 86 emendas da
  janela executam em mais de uma área.
- **`CpfCnpjNis` pode trazer CPF/NIS** (11 dígitos, pessoa física). A coleta
  descarta antes de qualquer gravação, como já faz com o CPF do TSE. CNPJ
  fica.
- **Não há página por emenda** no portal estadual. O link de procedência leva
  ao dataset, e as telas dizem isso — exceção declarada à regra 6.
- **A licença declarada no catálogo é Creative Commons Não Comercial.** Uso
  aqui é não comercial e cabe; um fork comercial precisaria reavaliar.
- **A LOA 2023 é da legislatura anterior** (emendada em 2022): 16 dos 30
  autores dela nem estão mais na ALES. A coleta só atribui a quem assina
  emenda em LOA emendada durante o mandato atual (2024–2026).

Acesso do runner do GitHub Actions confirmado em 02/09/2026 por sonda
dedicada (workflow temporário, branch descartado).

---

## ALES — Assembleia Legislativa do Espírito Santo

`https://www.al.es.gov.br/Transparencia/DadosAbertos`

O que resta da lacuna estadual depois da SEFAZ: **a atuação em plenário** —
votações nominais, presença e produção legislativa. Tem portal de dados
abertos e de transparência, e o ALES Digital tem a base de produção
legislativa. Mas **não há API documentada** — provavelmente exige raspagem de
HTML/CSV. Em 02/09/2026 o site nem respondia a partir desta máquina (respondeu
ao runner dos EUA na mesma hora — instabilidade, não bloqueio geográfico).

Enquanto isso não estiver de pé, deputado estadual tem candidatura, bens e
proposta (TSE) e emendas (SEFAZ), mas não atuação em plenário. **A lacuna
está declarada na ficha**, na própria aba de mandato estadual, senão o vazio
é lido como "não fez nada".
