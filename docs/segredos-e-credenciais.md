# Segredos e credenciais

Como credencial entra neste projeto, por onde ela circula e o que nunca pode
acontecer com ela. Verificado em **29/08/2026**; o token do Portal da
Transparência entrou em **01/09/2026** e o caminho descrito aqui foi seguido
à risca.

O repositório é **público** (`github.com/gabriel89-exe/Fato-Voto`). Tudo aqui
parte disso: qualquer arquivo versionado é legível por qualquer pessoa, para
sempre, inclusive no histórico do git depois de apagado.

---

## Regra única

**Credencial não entra em arquivo versionado.** Nem "temporariamente", nem
"só para testar", nem comentada. Apagar depois não resolve: o git guarda o que
já foi commitado, e um segredo que passou pelo histórico é um segredo
queimado — o caminho passa a ser revogar e gerar outro.

---

## Por onde o token do Portal da Transparência circula

É a única credencial que o projeto precisa (ver
[`fontes-de-dados.md`](fontes-de-dados.md)). O caminho completo:

1. **CPF vai só para o gov.br.** É lá que a pessoa se autentica para obter o
   token. O CPF não entra no código, na coleta, no repositório nem no site.
2. **O gov.br devolve o token** por e-mail, na conta usada para autenticar.
3. **O token fica em `.env.local`** na máquina, e como *secret* do repositório
   para a coleta agendada. Os dois estão fora do versionamento.
4. **Só os coletores leem o token.** `scripts/coleta/*.mjs` são scripts Node
   que rodam à parte, batem na API e escrevem JSON em `data/es/`.
5. **O site lê o JSON já pronto.** Ele nunca vê o token, porque o token não
   existe mais no momento em que o site é construído.

O que chega ao público é só o dado sobre parlamentares — quanto de emenda foi
destinado, para qual município, para qual área. Nada sobre quem obteve o token.

### Por que essa separação é sólida, e não uma promessa

Não é disciplina, é arquitetura. A coleta e o site são dois programas
diferentes, e o único ponto de contato entre eles é um arquivo JSON. Um segredo
que só existe no primeiro não tem por onde chegar ao segundo.

Em 29/08/2026, a única variável de ambiente lida pelo site era
`NEXT_PUBLIC_SITE_URL` — o domínio, que é público por natureza. Continua sendo
em 01/09/2026, agora com o token em uso: `TRANSPARENCIA_TOKEN` é lido em
`scripts/coleta/transparencia.mjs` e em lugar nenhum de `app/`, `components/`
ou `lib/`.

Três coisas sustentam isso, e nenhuma delas é lembrar de tomar cuidado:

- O passo do build em `.github/workflows/coleta.yml` **não declara** o token no
  `env`. Ele não existe no processo que constrói o site.
- `npm run verificar` procura o VALOR do token dentro de `.next/` e falha se
  achar (`scripts/verificar-seguranca.mjs`, checagem 2).
- A mesma verificação barra qualquer nome `NEXT_PUBLIC_*` que pareça segredo.

---

## A armadilha com nome próprio: `NEXT_PUBLIC_`

No Next.js, variável cujo nome começa com `NEXT_PUBLIC_` é **embutida no
pacote que vai para o navegador**. O prefixo quer dizer literalmente "isto é
público": qualquer pessoa que abra o site consegue ler o valor.

```
✗ NEXT_PUBLIC_TRANSPARENCIA_TOKEN   → legível por qualquer visitante
✓ TRANSPARENCIA_TOKEN               → só existe onde o script roda
```

É o erro mais fácil de cometer e o mais difícil de perceber, porque **nada
quebra**: o site funciona, a coleta funciona, e o token está exposto. Se
acontecer, revogue antes de corrigir o nome.

---

## O token é pessoal

Ele é emitido contra a conta gov.br de uma pessoa física, e essa conta precisa
ser Nível Verificado (Prata) ou Comprovado (Ouro), ou usar CPF e senha com
verificação em duas etapas. Trate o token no mesmo nível de cuidado de uma
senha: se vazar, é o acesso daquela pessoa sendo usado por outra.

### O que isso significa para o anonimato do projeto

O projeto [não identifica seus autores](../ANDAMENTO.md) e assina como três
estudantes. Usar um CPF para obter o token **não quebra isso publicamente** —
nada disso aparece no site nem no repositório.

Mas cria um fato que vale registrar: **perante o governo existe uma pessoa
nomeada** como titular do acesso à API. Não é problema, é como qualquer pessoa
física usa dados abertos. Só não é anônimo do lado de lá.

Não há indício de que o Portal da Transparência publique a lista de quem tem
token, e este documento **não afirma que ele não publica** — isso não foi
verificado. Se for decisivo, leia os termos de uso do portal antes de
cadastrar.

Se o projeto vier a ter CNPJ, o acesso pode migrar para a entidade e o vínculo
pessoal deixa de existir.

---

## Onde cada coisa mora

| Item | Lugar | Versionado? |
|---|---|---|
| Token do Portal da Transparência | `.env.local` e *secret* `TRANSPARENCIA_TOKEN` do repositório | Não |
| `NEXT_PUBLIC_SITE_URL` | Variável na hospedagem | Não, mas é público por natureza |
| Snapshots crus da coleta | `dados-brutos/` | Não — grandes e reproduzíveis |
| Dado normalizado | `data/es/` | Sim |

O `.gitignore` cobre `.env*`, `dados-brutos` e `.claude/settings.local.json`.
Confira antes de commitar quando adicionar qualquer arquivo novo de
configuração.

---

## Se um segredo vazar

1. **Revogue primeiro**, corrija o código depois. Enquanto a credencial for
   válida, ela é utilizável por quem a viu.
2. Gere uma nova no portal.
3. Só então conserte o que a expôs.

Reescrever o histórico do git **não** substitui a revogação: clones e caches
já feitos continuam com o valor antigo.
