# Andamento

Ordem de execução do plano original.

- [x] **1. Tipos e dados fictícios** — `/types`, `/data`, `/scripts/gerar-dados.mjs`
- [x] **2. Layout base, tarja, sistema visual, `DadoOficial`, `ResumoPlataforma`**
- [ ] **3. Busca, filtros e ordenação sorteada em `/lib`**
- [ ] **4. Página de lista com busca e filtros**
- [ ] **5. Página de perfil com abas e gráficos**
- [ ] **6. Comparador**
- [x] **7. Metodologia e fontes** — feitas fora de ordem por serem curtas e por
      estarem linkadas no rodapé de todas as páginas desde o passo 2
- [ ] **8. Passada final de acessibilidade e responsividade em 360 px**

## Fora da numeração

- [x] **Kit de interface (shadcn/ui)** — `components/ui/*`, vitrine em
      `/interface`. Feito fora da ordem porque os passos 3 a 6 dependem dos
      mesmos controles (abas, sanfona, gaveta, diálogo, tabela); construí-los
      uma vez evita três dialetos de botão no mesmo site.

## Provisório no momento

- `/candidatos` lista todo mundo na ordem do arquivo, **sem sorteio**, com aviso
  na tela. Vira a lista real no passo 4.
- `/candidato/[id]` mostra cabeçalho, faixa de situação, proposta e dados
  declarados, **sem abas e sem gráficos**. Vira o perfil completo no passo 5.
- `/comparar` é só um aviso de "ainda não construído".

## Próximos passos, em ordem

### 3. `lib/busca.ts` — busca, filtros e sorteio

O passo que destrava os outros. Nada de UI aqui: funções puras, testáveis, que
recebem a lista e o `EstadoFiltros` (já tipado em `types/index.ts`) e devolvem a
lista final.

1. `normalizar(texto)` — minúsculas e sem acento, para "goncalves" achar
   "Gonçalves".
2. `buscar(candidatos, termo)` — casa por nome de urna, nome civil e **prefixo**
   do número de urna. Devolve também as faixas casadas, para o realce que
   `CartaoCandidato` já aceita em `realceNome` / `realceNumero`.
3. `filtrar(candidatos, filtros)` — recortes facetados, todos combináveis.
4. `ordenar(candidatos, ordem, semente)` — **sorteada é o padrão**. Use uma
   semente derivada da sessão, não do relógio, para a ordem não trocar a cada
   tecla digitada e a pessoa não perder o item que estava lendo.
5. `filtrosDaUrl` / `urlDosFiltros` — o `EstadoFiltros` inteiro vive na query
   string, para que a lista filtrada seja compartilhável e o botão Voltar
   funcione.

### 4. Lista com busca e filtros

Já é montável só com o que existe em `components/ui`:

- régua de cargo → `ToggleGroup`
- ordem → `Select` ou `RadioGroup`
- grupos de filtro → `Accordion` + `Checkbox`
- filtros no celular → `Sheet` (coluna fixa a partir de `lg`)
- recortes ativos → `Badge` com botão de remover
- carregando → `Skeleton` em `app/candidatos/loading.tsx`

Cuidados: manter o `<form method="get">` funcionando sem JavaScript; anunciar a
contagem de resultados em uma região `aria-live`; e deixar visível que a ordem
é sorteada, com o link para a metodologia.

### 5. Perfil com abas e gráficos

- `Tabs` para Perfil / Proposta / Mandato / Bens.
- `Table` (+ `TableCellNumero`) para votações e bens.
- `Progress` para a composição da presença — dentro de uma ficha, nunca entre
  fichas.
- Gráficos ainda **não têm biblioteca escolhida**: `recharts` é o caminho do
  shadcn (`npm run ui -- add chart`), mas a paleta `grafico.1…5` do
  `tailwind.config.ts` é monocromática de propósito e precisa ser respeitada.
  Decidir isso antes de escrever o primeiro gráfico.

### 6. Comparador

`Dialog` + `Command` para escolher de 2 a 3 candidaturas do mesmo cargo, e
`Table` para colocá-las lado a lado com os mesmos campos na mesma ordem. A
seleção também vai para a query string.

### 8. Passada final

- Percorrer o site em 360 px procurando rolagem horizontal. Item de grid tem
  `min-width: auto` e não encolhe sozinho: onde houver conteúdo largo dentro de
  grade, falta `min-w-0` (foi exatamente o defeito encontrado e corrigido no
  kit).
- Navegar tudo só pelo teclado, conferindo que o contorno de foco de 3px nunca
  some.
- Rodar um leitor de tela nas fichas, confirmando que `DadoOficial` e
  `ResumoPlataforma` se anunciam como coisas diferentes.

## Dívidas conhecidas

- `npm audit` acusa `postcss` (via `next`), com correção só em `next@16`.
  Anterior ao kit de interface; decidir junto com a atualização do Next.
- `globals.css` ainda tem `.botao-primario`, `.botao-secundario` e `.campo`, que
  hoje duplicam `Button` e `Input`. Deixe de usá-los em código novo; apague
  quando não houver mais nenhuma ocorrência.
