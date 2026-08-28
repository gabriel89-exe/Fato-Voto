# Fato & Voto

> Dados públicos das candidaturas do **Espírito Santo** na eleição de 2026.
> Sem ranking, sem nota, sem recomendação.

Plataforma autônoma de transparência eleitoral. Mostra o que as fontes oficiais
publicam sobre cada candidatura, em linguagem simples, com a procedência de
cada dado à vista. Não recebe dinheiro de partido ou de candidatura.

O piloto cobre o Espírito Santo e cinco cargos: Presidente, Governador,
Senador, Deputado Federal e Deputado Estadual. Os demais estados entram depois
de o piloto validar o pipeline.

**Fontes:** Tribunal Superior Eleitoral (DivulgaCandContas) e Câmara dos
Deputados (Dados Abertos).

## Como rodar

```bash
npm install
npm run dev
```

Depois abra <http://localhost:3000>.

Para atualizar os dados:

```bash
npm run coleta:tse
npm run coleta:camara
```

> **Atenção ao nome da pasta.** O `&` em `fato&voto` quebra o `npx` no Windows,
> porque o `cmd.exe` corta a linha de comando no `&`. Por isso os scripts do
> `package.json` chamam o Next direto pelo `node`
> (`node ./node_modules/next/dist/bin/next dev`) em vez de `next dev`.
> `npm run dev`, `npm run build` e as coletas funcionam. Comandos com
> `npx next ...` não funcionam nesta pasta — renomear a pasta para algo sem `&`
> resolveria de vez.

## Antes de mexer no projeto

Dois documentos valem mais que este README, e devem ser lidos primeiro:

- **[`docs/principios.md`](docs/principios.md)** — o que o projeto se recusa a
  fazer e as regras que decorrem disso (ordem sorteada, nenhuma cor com valor de
  juízo, todo número com denominador). Em conflito entre uma ideia boa e uma
  regra de lá, a regra ganha.
- **[`docs/fontes-de-dados.md`](docs/fontes-de-dados.md)** — o que cada fonte
  pública entrega e onde cada uma trava, incluindo armadilhas que falham em
  silêncio. Leitura obrigatória antes de escrever coleta.

## Estrutura

```
/app             rotas (App Router)
/docs            princípios do projeto e mapa das fontes de dados
/scripts/coleta  coleta de dados públicos reais (piloto: ES)
/components      UI do domínio (DadoOficial, gráficos, cartões, ícones)
/components/ui   kit shadcn/ui vestido com a identidade do site
/lib             acesso aos dados, busca, sorteio, formatação, cn
/data/es         JSON normalizado que o site lê (versionado)
/types           tipos TypeScript de todas as entidades
/dados-brutos    snapshots crus com hash, para auditoria (fora do git)
```

## Interface

Os controles do site vêm do **shadcn/ui**: código copiado para dentro do
repositório e reescrito para falar a língua da GAZETA — cantos vivos, filete de
tinta de 2px, sombra dura deslocada, rótulo em fonte monoespaçada. Por baixo
ficam os primitivos do Radix, que resolvem teclado, foco e leitor de tela.

Veja tudo funcionando em **`/interface`** (link no rodapé). É lá que se confere,
num relance, se um controle novo destoa do resto.

A ponte entre os dois mundos é um bloco de variáveis CSS em `app/globals.css`
(`--background`, `--primary`, `--radius: 0px`…) amarrado aos nomes do shadcn em
`tailwind.config.ts`. Consequência prática: um componente novo baixado do
registro já nasce com a identidade certa.

Cuidado com o nome parecido: `--accent` é o cinza de realce de menu do shadcn;
o azul de carimbo do site é `--acento` (com O), exposto como `text-acento`.

### Adicionar um componente novo

```bash
npm run ui -- add tooltip
```

O script chama o CLI do shadcn pelo `node`, porque `npx` não funciona nesta
pasta (ver o aviso sobre o `&` acima). O CLI lê o `components.json` e escreve
direto em `components/ui`.

Depois de baixar, **passe o olho no arquivo**: o padrão do shadcn traz
`rounded-md`, `shadow-sm` e `focus-visible:outline-none`. Os dois primeiros são
inofensivos (o raio é 0 no tema), mas o terceiro apaga o contorno de foco de 3px
que vale para o site inteiro — remova.

### Regras de interface que não se negociam

O site não recomenda ninguém, e isso restringe a interface:

- Nenhuma cor pode ser lida como juízo de valor. Não há vermelho no sistema:
  até a ação destrutiva se distingue por moldura e texto.
- Toda ficha de candidatura tem a mesma moldura, a mesma sombra e o mesmo peso.
  `Card` não tem variante de destaque, e não deve passar a ter.
- `Badge` nunca ganha cor por candidatura, partido ou situação de registro.
- `Progress` descreve a composição dentro de uma ficha; nunca compara fichas.
- Informação essencial nunca vive só num `Tooltip`: ele não aparece no toque.

## Como os dados chegam aqui

A coleta grava em duas camadas, e a separação é o que sustenta a auditoria:

- **`dados-brutos/`** — a resposta original das fontes, intacta, com hash
  SHA-256 e data, mais um manifesto. Fora do git: é grande e reproduzível
  rodando a coleta de novo. É o que permite responder *"este é o arquivo, desta
  hora, com esta impressão digital"* se um dado for contestado.
- **`data/es/`** — o normalizado que o site lê. Poucas centenas de kB,
  versionado, servido de CDN. Sem banco em produção.

`npm run coleta:tse:normalizar` reconstrói a segunda camada a partir da
primeira, sem tocar na rede — corrigir uma regra de normalização não deve
custar 575 requisições a um serviço público.

## Decisões que valem registro

- **Sem foto.** O avatar é gerado por código, com as **mesmas cores para todas
  as candidaturas**. O TSE publica foto oficial, mas exibi-la criaria destaque
  visual desigual — quem fotografa melhor apareceria melhor.
- **CPF e título de eleitor são descartados na coleta**, antes de qualquer
  gravação. Nem o snapshot bruto os conserva.
- **As flags `st_DIVULGA` do TSE são respeitadas.** Quando o tribunal não
  autoriza divulgar um dado, a tela diz que a omissão é da fonte.
- **Nenhum total de despesa aparece sozinho** — sempre ao lado da mediana e da
  faixa da bancada. Ver `docs/principios.md`, regra 4.
