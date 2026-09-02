# Fato & Voto

> Dados públicos das candidaturas do **Espírito Santo** na eleição de 2026.
> Sem ranking, sem nota, sem recomendação.

Plataforma autônoma de transparência eleitoral. Mostra o que as fontes oficiais
publicam sobre cada candidatura, em linguagem simples, com a procedência de
cada dado à vista. Não recebe dinheiro de partido ou de candidatura.

O piloto cobre o Espírito Santo e cinco cargos: Presidente, Governador,
Senador, Deputado Federal e Deputado Estadual. Os demais estados entram depois
de o piloto validar o pipeline.

**Fontes:** Tribunal Superior Eleitoral (DivulgaCandContas), Câmara dos
Deputados (Dados Abertos), Senado Federal (Dados Abertos) e Portal da
Transparência (emendas parlamentares — a única que exige credencial).

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
npm run coleta:senado
npm run coleta:votacoes
npm run coleta:transparencia
```

> **A coleta de emendas precisa de credencial.** `coleta:transparencia` lê
> `TRANSPARENCIA_TOKEN`, que vive em `.env.local` na máquina (fora do git) e
> como *secret* do repositório no CI. O token é pessoal, emitido pelo Gov.br
> contra o CPF de alguém — trate como senha. As outras quatro coletas são
> abertas e não pedem nada. Ver
> [`docs/segredos-e-credenciais.md`](docs/segredos-e-credenciais.md).

> **Atenção ao nome da pasta.** O `&` em `fato&voto` quebra o `npx` no Windows,
> porque o `cmd.exe` corta a linha de comando no `&`. Por isso os scripts do
> `package.json` chamam o Next direto pelo `node`
> (`node ./node_modules/next/dist/bin/next dev`) em vez de `next dev`.
> `npm run dev`, `npm run build` e as coletas funcionam. Comandos com
> `npx next ...` não funcionam nesta pasta — renomear a pasta para algo sem `&`
> resolveria de vez.

> **Não rode `npm run build` com o `npm run dev` ligado.** Os dois escrevem em
> `.next`, e o build sobrescreve os chunks que o dev server está servindo. O
> sintoma é `Cannot find module ./vendor-chunks/next.js` e páginas em branco.
> Se acontecer: pare o dev, `rm -rf .next`, suba de novo.

Antes de abrir um PR:

```bash
npm run build
npm run verificar   # cabeçalhos de segurança, segredo no bundle, nome NEXT_PUBLIC_
npm run contraste   # todo par de cor passa AA
```

Os três também rodam sozinhos no CI (workflow **Verificação**) em todo Pull
Request.

## Antes de mexer no projeto

Dois documentos valem mais que este README, e devem ser lidos primeiro:

- **[`docs/principios.md`](docs/principios.md)** — o que o projeto se recusa a
  fazer e as regras que decorrem disso (ordem sorteada, nenhuma cor com valor de
  juízo, todo número com denominador). Em conflito entre uma ideia boa e uma
  regra de lá, a regra ganha.
- **[`docs/fontes-de-dados.md`](docs/fontes-de-dados.md)** — o que cada fonte
  pública entrega e onde cada uma trava, incluindo armadilhas que falham em
  silêncio. Leitura obrigatória antes de escrever coleta.
- **[`docs/segredos-e-credenciais.md`](docs/segredos-e-credenciais.md)** — por
  onde uma credencial circula e o que nunca pode acontecer com ela. O
  repositório é público; leia antes de mexer em variável de ambiente.

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

Os controles vêm do **shadcn/ui**: código copiado para dentro do repositório e
reescrito seguindo as convenções de acessibilidade do **Padrão Digital de
Governo (gov.br)** — corpo de 17px, contraste alto, azul de link forte e
sublinhado, foco sempre visível, alvo de toque de 48px. Por baixo ficam os
primitivos do Radix, que resolvem teclado, foco e leitor de tela.

> **Adotamos as convenções do gov.br, não a marca dele.** O projeto é autônomo
> e não é um site do governo. Como a interface agora se parece com um, a barra
> do topo diz isso em toda página — não remova.

Veja tudo funcionando em **`/interface`** (link no rodapé). É lá que se confere,
num relance, se um controle novo destoa do resto.

A ponte entre os dois mundos é um bloco de variáveis CSS em `app/globals.css`
(`--background`, `--primary`, `--radius`…) amarrado aos nomes do shadcn em
`tailwind.config.ts`. Um componente novo baixado do registro já nasce com a
identidade certa.

Cuidado com o nome parecido: `--accent` é o cinza de realce de menu do shadcn;
o azul do site é `--acento` (com O), exposto como `text-acento`.

### Adicionar um componente novo

```bash
npm run ui -- add tooltip
```

O script chama o CLI do shadcn pelo `node`, porque `npx` não funciona nesta
pasta (ver o aviso sobre o `&` acima). O CLI lê o `components.json` e escreve
direto em `components/ui`.

Depois de baixar, **passe o olho no arquivo**: o padrão do shadcn traz
`rounded-md`, `shadow-sm` e `focus-visible:outline-none`. Os dois primeiros são
inofensivos, mas o terceiro apaga o contorno de foco de 3px
que vale para o site inteiro — remova.

### Regras de interface que não se negociam

O site não recomenda ninguém, e isso restringe a interface:

- Nenhuma cor pode ser lida como juízo de valor. Não há vermelho no sistema:
  até a ação destrutiva se distingue por moldura e texto. O azul aparece só em
  elemento de interface — link, foco, ação primária —, nunca em ficha.
- Texto no mínimo 17px, contraste mínimo AA, link sempre sublinhado. Cor
  sozinha não é sinal acessível.
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
- **Emenda não é atribuída por nome só.** O Portal da Transparência identifica
  o autor por nome, e o filtro dele casa por conteúdo: `nomeAutor=NETO` devolve
  oito pessoas. A coleta exige igualdade de nome E código de autor único (os
  dígitos 5 a 8 do código da emenda). Nome com dois códigos não recebe
  atribuição nenhuma — a ficha diz que a fonte não permite separar.

## Licença

**AGPL-3.0-only.** É copyleft de rede: quem hospedar uma versão modificada é
obrigado a publicar o código modificado. Um *fork* adulterado não pode ficar
fechado — o que é coerente com um projeto cuja proposta é ser auditável. O
texto fica em [`LICENSE`](LICENSE).

## Segurança

- Como relatar uma falha: [`SECURITY.md`](SECURITY.md).
- Como se garante que o site mostra o dado da fonte, e a configuração de
  proteção do repositório: [`docs/integridade-e-acesso.md`](docs/integridade-e-acesso.md).
- Caminho de uma credencial e a armadilha do `NEXT_PUBLIC_`:
  [`docs/segredos-e-credenciais.md`](docs/segredos-e-credenciais.md).
