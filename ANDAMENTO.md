# Andamento

## Onde estamos

O site saiu do protótipo. Em **27/08/2026** os dados fictícios de "Serra Verde"
foram removidos e substituídos por dados públicos reais do **Espírito Santo**:
575 candidaturas de 2026 (TSE) e o mandato dos 10 deputados federais do estado
(Câmara dos Deputados).

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


## Falta

- [ ] **Emendas parlamentares** — depende do token do Portal da Transparência.
- [ ] **Votações e projetos** — Câmara e Senado, fontes abertas já mapeadas.
- [ ] **Atuação de deputado estadual** — a ALES não tem API. Maior incerteza.
- [ ] **Comparador** — `/comparar` ainda é um aviso.
- [ ] **Página "Quem somos"** — com responsável identificado e canal de
      correção. Necessária antes de divulgar.

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

## Como rodar a coleta

```bash
npm run coleta:tse              # 575 candidaturas do ES (TSE)
npm run coleta:camara           # bancada federal do ES (Câmara)
npm run coleta:senado           # senadores do ES (Senado)
npm run coleta:tse:normalizar   # reconstrói o normalizado sem tocar na rede
```

O terceiro existe porque corrigir uma regra de normalização não deve custar 575
requisições a um serviço público.
