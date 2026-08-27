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

## Provisório no momento

- `/candidatos` lista todo mundo na ordem do arquivo, **sem sorteio**, com aviso
  na tela. Vira a lista real no passo 4.
- `/candidato/[id]` mostra cabeçalho, faixa de situação, proposta e dados
  declarados, **sem abas e sem gráficos**. Vira o perfil completo no passo 5.
- `/comparar` é só um aviso de "ainda não construído".
