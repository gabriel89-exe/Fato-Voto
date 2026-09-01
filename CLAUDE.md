# Fato & Voto — contexto para a próxima sessão

Plataforma autônoma de transparência eleitoral. Piloto no Espírito Santo,
eleição de 2026, cinco cargos. Publicada em `fato-voto.vercel.app` a cada push
para `main`.

## Onde está o estado real do projeto

Este arquivo é só o mapa. O que vale está versionado:

| Arquivo | O que responde |
| --- | --- |
| `ANDAMENTO.md` | **Começar por aqui.** O que está pronto, o que falta, e as decisões já tomadas com o motivo de cada uma. |
| `docs/principios.md` | O que o projeto se recusa a fazer. |
| `docs/fontes-de-dados.md` | Onde cada fonte pública trava e por quê. |
| `docs/segredos-e-credenciais.md` | Fluxo de credencial e a armadilha do `NEXT_PUBLIC_`. |
| `README.md` | Como rodar. |
| `git log` | As mensagens de commit carregam o raciocínio, não só o diff. |

Antes de propor qualquer coisa, ler o `ANDAMENTO.md`. Ele existe justamente
para uma sessão nova não reabrir decisão já fechada.

## As regras que governam o produto

Estas não são preferência de estilo. Quebrar qualquer uma descaracteriza o
projeto:

1. **Nada de ranking, nota, recomendação ou ordenação por mérito.** A ordem
   das listas é sorteada, com semente do dia, e a página diz que é sorteada.
2. **Todo dado tem procedência à vista**, com a data da coleta.
3. **Descritivo, nunca normativo.** Mostrar o fato que convida ao escrutínio,
   sem afirmar irregularidade. Sem adjetivo, sem cor de alerta para valor alto.
4. **Nenhum total de gasto vai à tela sozinho** — sempre ao lado da mediana e
   da faixa da bancada. Sem denominador, número vira ranking involuntário.
5. **Lacuna se declara.** Se a fonte não publica, a tela diz que a fonte não
   publica — nunca deixa o vazio parecer omissão da pessoa.
6. **Link de fonte leva ao fato**, não à página onde o fato mora. Se a fonte
   publica âncora ou identificador, o link usa. E a âncora se confere no HTML
   servido antes de commitar.
7. **O site não usa cookie, analytics nem `localStorage`.** A página
   `/privacidade` afirma isso com o código conferido. Qualquer feature que
   precise de armazenamento no navegador desmente uma página publicada.

## Armadilhas desta máquina

- **O `&` no nome da pasta quebra o `npx`.** O `cmd.exe` corta a linha no `&`.
  Por isso os scripts do `package.json` chamam o Next direto pelo `node`.
  `npm run build` funciona; `npx tsc`, `npx next` e afins não. Para checar
  tipos, rodar o build. Renomear a pasta resolveria de vez.
- **Não rodar `npm run build` com o servidor de desenvolvimento ligado** — os
  chunks do `.next` corrompem e o erro aparece longe da causa.
- **Backtick em `node -e` ou heredoc não citado é substituição de comando.** O
  shell esvazia o conteúdo em silêncio. Para texto com backtick ou `${}`, usar
  as ferramentas de escrita de arquivo, não o shell.
- **HTTP 200 não prova que a página funciona.** Uma CSP restritiva já derrubou
  a produção inteira com todas as rotas respondendo 200 e nenhuma renderizando.
  Verificar no navegador: renderizou, hidratou, o clique responde, console
  limpo.

## Coleta

```bash
npm run coleta:tse              # candidaturas do ES (TSE)
npm run coleta:camara           # bancada federal do ES (Câmara)
npm run coleta:senado           # senadores do ES (Senado)
npm run coleta:votacoes         # votações nominais
npm run coleta:tse:normalizar   # reconstrói o normalizado sem tocar na rede
```

A normalização é determinística de propósito: arrays ordenados, para o diff
diário do repositório ser sinal e não ruído. Quebrar isso enche o histórico de
mudança falsa. Roda sozinha todo dia às 6h de Brasília pelo GitHub Actions.

## Idioma

Código, comentários, commits e interface em português do Brasil.
