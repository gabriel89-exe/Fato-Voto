# Política de segurança

## Como relatar uma falha

**Não abra issue pública** para vulnerabilidade.

- Prefira o **Private vulnerability reporting** do GitHub: aba **Security**
  do repositório → *Report a vulnerability*.
- Ou escreva para **fatoevoto@gmail.com** com `[segurança]` no assunto.

Descreva o que encontrou, como reproduzir e o impacto que enxerga. O retorno
sai em até 7 dias.

## Escopo

Vale: este repositório, o site publicado e a esteira de coleta
(`scripts/coleta/`, `.github/workflows/`).

Fora de escopo: os portais de origem — TSE, Câmara, Senado e Portal da
Transparência. Relate a eles diretamente.

## Decisões de segurança já tomadas e aceitas

Não são achados novos; estão documentadas para quem revisar não reabrir sem
contexto.

- **`script-src` e `style-src` usam `'unsafe-inline'`.** O motivo está inteiro
  no cabeçalho de `next.config.mjs`: o site é estático, sem entrada de
  usuário, e a alternativa (nonce) obrigaria renderização sob demanda —
  trocaria a arquitetura de 590 páginas de CDN por uma diretiva. Revisar
  **assim que o site aceitar qualquer entrada de usuário**.
- **O `next` traz uma cópia aninhada de `postcss` mais antiga.** É dependência
  de tempo de build; o CSS processado é todo do próprio repositório. O
  `overrides` no `package.json` força a versão corrigida em toda a árvore. A
  trava real contra CSS envenenado é a revisão de PR sobre arquivos `.css`
  (ver `.github/CODEOWNERS`).

## Como qualquer pessoa audita este projeto

O repositório é público de propósito. Dá para conferir que o site mostra
exatamente o que a fonte publicou:

```bash
git clone https://github.com/gabriel89-exe/Fato-Voto
cd Fato-Voto
npm install
npm run coleta:tse   # e as demais coletas
```

Depois compare o resultado com `data/es/` e com os hashes SHA-256 em
`dados-brutos/manifesto.json`. Detalhes em
[`docs/integridade-e-acesso.md`](docs/integridade-e-acesso.md).
