# Fato & Voto — protótipo de transparência eleitoral

> **PROTÓTIPO. TODOS OS DADOS SÃO FICTÍCIOS.**
> Partidos, siglas, números, pessoas, municípios, propostas, votações e valores
> foram inventados para testar interface e navegação. Nada aqui descreve pessoa,
> partido ou órgão real.

Protótipo navegável de uma plataforma que mostra dados públicos de candidaturas
em linguagem simples. O estado de referência é o fictício **Serra Verde (SV)**.

## Como rodar

```bash
npm install
npm run dev
```

Depois abra <http://localhost:3000>.

Para regerar os dados fictícios (a semente é fixa, o resultado é sempre igual):

```bash
npm run dados
```

> **Atenção ao nome da pasta.** O `&` em `fato&voto` quebra o `npx` no Windows,
> porque o `cmd.exe` corta a linha de comando no `&`. Por isso os scripts do
> `package.json` chamam o Next direto pelo `node`
> (`node ./node_modules/next/dist/bin/next dev`) em vez de `next dev`.
> `npm run dev`, `npm run build` e `npm run dados` funcionam. Comandos com
> `npx next ...` não funcionam nesta pasta — renomear a pasta para algo sem `&`
> resolveria de vez.

## Estrutura

```
/app             rotas (App Router)
/components      UI do domínio (DadoOficial, ResumoPlataforma, cartões, ícones)
/components/ui   kit shadcn/ui vestido com a identidade do site
/lib             dados, formatação, cn (busca e sorteio entram no passo 3)
/data            JSON fictício gerado por /scripts/gerar-dados.mjs
/types           tipos TypeScript de todas as entidades
/scripts         gerador dos dados fictícios
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

## Estado atual

Este README acompanha o andamento e será completado ao final. Veja
`ANDAMENTO.md` para o que já existe e o que falta.

## Decisões que valem registro

- **Números de partido fora da faixa real.** Quase todo número de dois dígitos
  pertence a alguma legenda real, então os partidos fictícios usam 24, 32, 38,
  46, 52, 61, 74 e 88. Efeito colateral: nenhum candidato tem número começando
  em 1, e o exemplo do enunciado ("digitar 1 traz 10, 13, 15") vira "digitar 2
  traz 24, 241, 243".
- **Órgão de origem fictício.** Em vez de citar o TSE, os dados apontam para o
  "Tribunal Eleitoral Fictício de Serra Verde (TEF-SV)". A regra de não
  confundir o protótipo com um site real vale mais que a nomenclatura. Os
  rótulos de autodeclaração continuam explícitos em todos os campos.
- **Sem foto.** `fotoUrl` é `null` em todo mundo e o avatar é gerado por código,
  com as **mesmas cores para todas as candidaturas** — variar cor por pessoa ou
  por partido criaria destaque visual onde não pode haver.
