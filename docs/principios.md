# Princípios do projeto

O que o Fato & Voto é, o que ele se recusa a fazer, e as regras que decorrem
disso. Este documento vem antes de qualquer decisão de produto ou de código: em
caso de conflito entre uma ideia boa e uma regra daqui, a regra ganha.

---

## Para que existe

Ajudar a pessoa a **pesquisar** antes de votar. Nada além disso.

A plataforma parte de uma constatação simples: com a correria do dia a dia, é
difícil ir atrás de informação sobre candidatura. Quem não pesquisa acaba
votando por indicação ou por conveniência. O site existe para tornar a pesquisa
rápida o bastante para caber na vida real de quem trabalha.

O projeto é **autônomo**. Não tem vínculo, financiamento ou preferência
partidária, não faz campanha para ninguém e não aceita patrocínio de partido ou
de candidatura.

## O que ele não faz

Não recomenda. Não classifica. Não pontua. Não ordena por mérito. Não coloca
candidatura nenhuma em evidência.

O objetivo não é mudar o voto de A para B. É fazer a pessoa olhar os dados —
e, se ela achar que deve mudar, que mude por conta própria, olhando fonte
pública.

---

## Regras que decorrem disso

### 1. A ordem é sorteada, e isso é dito na tela

Nenhuma lista sai em ordem de relevância, tamanho de partido ou popularidade.
A ordem sorteada é o padrão e não deve deixar de ser.

A semente do sorteio é **fixa por dia**, não por requisição. Assim a ordem é
estável durante a navegação (a pessoa clica numa ficha, volta e não perde o
lugar) e o sorteio fica **auditável**: dá para publicar que a ordem de um dia é
reproduzível.

### 2. Nenhuma cor pode ser lida como juízo de valor

Não existe verde de "bom" nem vermelho de "ruim" neste sistema — não existe
vermelho, ponto. Registro indeferido não é defeito de caráter, é estado
processual: quem informa é o texto.

A regra vale para a interface inteira, não só para as fichas. Até a ação
destrutiva se distingue por moldura e texto.

### 3. Toda ficha tem o mesmo peso visual

Mesma moldura, mesma sombra, mesmo tamanho, mesmos campos na mesma ordem.
Nenhuma candidatura recebe selo, borda especial ou fundo próprio. Dar destaque
visual a uma e não a outra é recomendação disfarçada.

Para variar, varie o **conteúdo** — nunca a moldura.

### 4. Número absoluto nunca aparece sozinho

"Destinou R$ 12 milhões em emendas" não diz nada isolado. Ao lado da cota
disponível e da mediana da bancada, diz tudo.

Sem denominador, quem tem número maior parece melhor, e o site vira um ranking
sem querer. **Todo valor sai acompanhado do denominador e da mediana, e nenhuma
lista é ordenada por valor.**

### 5. O que é da fonte e o que é nosso ficam separados

Todo texto escrito pela plataforma aparece em moldura diferente do documento
oficial, com rótulo explícito. A distinção usa cor, moldura, cantos e ícone ao
mesmo tempo — de propósito, para funcionar também para quem não distingue as
cores.

### 6. Cada cargo faz coisas diferentes, e a ficha mostra isso

Confundir as atribuições seria erro factual grave:

- **Governador** executa orçamento estadual. "Gasto com saúde" aqui é do
  *estado*, não da pessoa.
- **Deputado federal e senador** votam, apresentam projetos e **destinam
  emendas**. Não existe "gasto com saúde" de deputado; existe emenda destinada
  à saúde — e emenda destinada não é emenda executada.

São telas diferentes. Não vão no mesmo gráfico.

### 7. Lacuna de dado é declarada, não escondida

Quando um dado não existe na fonte — ou quando o TSE marca que não pode ser
divulgado — a tela diz isso com todas as letras. Campo vazio sem explicação é
lido como culpa do candidato.

Isso vale especialmente para **deputado estadual**, cujo histórico de mandato
depende da Assembleia e pode simplesmente não existir.

### 8. Dado sensível não é coletado

CPF e título de eleitor vêm no retorno do TSE e são descartados **na coleta**,
antes de qualquer gravação. Dado que não é gravado não vaza.

### 9. Nada vai para a tela sem procedência

Todo número exibido tem, em disco, o documento cru de onde saiu, com data de
coleta e hash. Se uma candidatura contestar um dado, a resposta é "este é o
arquivo, desta hora, com esta impressão digital" — não "o portal dizia isso".

---

## Escopo atual

**Piloto no Espírito Santo**, com cinco cargos: Presidente, Governador, Senador,
Deputado Federal e Deputado Estadual. Expansão para os demais estados só depois
de o piloto validar o pipeline inteiro.

O eleitor escolhe o estado num seletor, e o estado vive na URL (`/es/...`).
**Não há geolocalização automática**: a pessoa vota no domicílio eleitoral, não
onde o celular está, e IP erra demais.

## A transição de fictício para real

O site nasceu como protótipo de dados inventados e declara isso em tarja fixa.
Enquanto essa tarja existir, **nenhum dado real de pessoa real pode aparecer sob
ela** — misturar os dois seria o pior erro possível para um projeto que depende
de credibilidade.

A troca da tarja é etapa consciente e explícita, nunca efeito colateral de
outra mudança.

---

Ver [`fontes-de-dados.md`](fontes-de-dados.md) para o que cada fonte pública
entrega e onde cada uma trava.
