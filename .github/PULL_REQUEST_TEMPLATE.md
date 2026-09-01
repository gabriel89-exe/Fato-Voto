## O que muda e por quê

<!-- Descreva a mudança e o motivo. Se corrige um dado, diga qual e de onde
     veio a correção. -->

## Checagem de revisão

- [ ] Li o diff inteiro, linha a linha.
- [ ] Se toca em `data/es/*.json`, o coletor correspondente também mudou —
      só a coleta deveria escrever ali.
- [ ] Não adiciona dependência sem necessidade. Se adiciona, expliquei qual
      pacote e por quê.
- [ ] Nenhuma variável `NEXT_PUBLIC_*` com nome de token, chave ou senha.
      Nenhuma credencial em arquivo versionado.
- [ ] `npm run build`, `npm run verificar` e `npm run contraste` passam.
- [ ] Documentação afetada atualizada no mesmo PR (`ANDAMENTO.md`, `docs/`,
      `README.md`).
- [ ] Se muda interface: respeita as regras de `docs/principios.md` — nenhuma
      cor com valor de juízo, toda ficha com o mesmo peso, todo número com
      denominador.
