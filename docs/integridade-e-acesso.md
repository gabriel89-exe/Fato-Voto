# Integridade e acesso

Como se garante que o site mostra o que a fonte publicou — e não o que
alguém quis que mostrasse. Verificado em **01/09/2026**.

O repositório é **público** (`github.com/gabriel89-exe/Fato-Voto`).
Qualquer pessoa lê, clona e *forka*. Ninguém de fora **escreve**: só quem
tem acesso de colaborador, e mudança externa só entra por Pull Request
que alguém do time revisa e mescla.

---

## O modelo de ameaça, em uma tabela

| Caminho | Possível? | O que barra |
|---|---|---|
| Estranho dá `push` no `main` | Não | Só colaborador tem escrita |
| Estranho abre PR com dado adulterado | Abre, sim | O PR não faz nada até alguém mesclar. Proteção de branch + `CODEOWNERS` + revisão |
| Colaborador com conta invadida | Sim | 2FA, senha única, token de escopo mínimo |
| `postinstall` malicioso de dependência na esteira | Não | `npm ci --ignore-scripts` no workflow |
| Tag de action re-apontada para código malicioso | Em tese | Dependabot de `github-actions`; no futuro, SHA fixo |
| API de origem servir dado errado | Fora do controle | `coletadoEm` + hash + link para a fonte; divergência resolve a favor do oficial |

Mesmo no pior caso, o estrago é **registrado, atribuível e reversível** —
e a recoleta do dia seguinte desfaz adulteração feita só em arquivo de
dado. O que **não** se cura sozinho é adulteração no coletor ou no
workflow; por isso esses caminhos exigem revisão nomeada.

---

## Configuração a aplicar no GitHub

São cliques na interface do GitHub — não dá para versionar. Aplicar uma
vez e conferir a cada semestre.

### 1. Proteções automáticas — *Settings → Code security*

- [ ] **Secret scanning** + **Push protection** — bloqueia um commit que
      contenha um token no momento do `push`. Pega o erro do
      `TRANSPARENCIA_TOKEN` antes de ele entrar no histórico.
- [ ] **Dependabot alerts** + **Dependabot security updates**
- [ ] **Private vulnerability reporting** (ligado; referenciado no
      `SECURITY.md`)

### 2. Proteção do branch `main` — *Settings → Branches* (ou *Rulesets*)

- [ ] **Require a pull request before merging** — proíbe `push` direto,
      inclusive o seu
- [ ] **Require approvals: 1**
- [ ] **Require review from Code Owners** — é o que faz o
      `.github/CODEOWNERS` valer
- [ ] **Require status checks to pass** → marcar o check **Verificação**
      (workflow `verificacao.yml`)
- [ ] **Require conversation resolution before merging**
- [ ] **Do not allow bypassing the above settings** — vale até para admin;
      protege contra sessão roubada
- [ ] Bloquear **force push** e **exclusão** do branch

### 3. ⚠️ Sem isto, a coleta diária para

O workflow `coleta.yml` faz `git push` no `main` todo dia. Com a proteção
acima, esse push é **recusado**. É preciso um de:

- Em **Rulesets**, adicionar **bypass** para o ator `github-actions[bot]`; ou
- dar a escrita a um **GitHub App** ou **PAT dedicado** só da coleta, e
  usar o token dele no `actions/checkout`.

A primeira opção é a mais simples. Registrar qual foi escolhida.

### 4. Acesso de pessoas

- [ ] 2FA obrigatório para todo colaborador (pode-se exigir numa
      organização)
- [ ] Manter o time pequeno — cada conta com escrita é uma superfície
- [ ] Tokens pessoais: *fine-grained*, escopo mínimo, com validade

---

## Como um terceiro audita o projeto

O ponto de ser público: qualquer pessoa confere que o dado exibido é o
dado da fonte.

```bash
git clone https://github.com/gabriel89-exe/Fato-Voto
cd Fato-Voto
npm install
npm run coleta:tse
npm run coleta:camara
npm run coleta:senado
npm run coleta:votacoes
```

Isso reconstrói `dados-brutos/` (as respostas cruas, com hash) e
`data/es/` (o normalizado que o site lê). Então:

- `data/es/*.json` do clone deve bater com o do repositório, salvo a
  linha `coletadoEm`;
- os hashes em `dados-brutos/manifesto.json` identificam cada resposta
  crua — se o portal mudou o dado, o hash muda, e isso é visível.

A normalização é **determinística** (arrays ordenados) de propósito: dois
computadores diferentes produzem o mesmo `data/es/` a partir da mesma
coleta.

---

## Verificações que rodam sozinhas

Em todo Pull Request e em todo push no `main` (workflow `verificacao.yml`):

| Passo | O que garante |
|---|---|
| `npm run build` | O site compila com o código/dado do PR |
| `npm run verificar` | Cabeçalhos de segurança na resposta real; nenhum segredo dentro de `.next/`; nenhum nome `NEXT_PUBLIC_*` com cara de token |
| `npm run contraste` | Todo par de cor passa AA |
| `npm audit` | CVE nova de dependência aparece no resumo (não bloqueia) |
| CodeQL (`codeql.yml`) | Padrão inseguro em `app/`, `lib/`, `scripts/` |

Ver também [`segredos-e-credenciais.md`](segredos-e-credenciais.md), que
descreve o caminho de uma credencial e por que o site nunca a enxerga.
