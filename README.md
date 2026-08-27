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
/app          rotas (App Router)
/components   UI reutilizável (DadoOficial, ResumoPlataforma, cartões, ícones)
/lib          dados, formatação (busca, filtros e sorteio entram no passo 3)
/data         JSON fictício gerado por /scripts/gerar-dados.mjs
/types        tipos TypeScript de todas as entidades
/scripts      gerador dos dados fictícios
```

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
