/**
 * Cabeçalhos de segurança.
 *
 * O site é estático, público e não tem login, formulário de envio nem
 * cookie — a superfície de ataque é pequena. Os cabeçalhos abaixo
 * fecham o que sobra.
 *
 * ================================================================
 * POR QUE script-src ACEITA 'unsafe-inline'
 *
 * A primeira versão deste arquivo usava `script-src 'self'` e DERRUBOU
 * O SITE em produção (31/08/2026): o Next injeta o payload de
 * renderização como script inline em toda página, a CSP bloqueou, e
 * nada hidratou. O comentário anterior afirmava que o Next não usa
 * inline em script — estava errado.
 *
 * As duas saídas corretas seriam nonce ou hash. Nenhuma serve aqui:
 *
 *   - Nonce precisa ser gerado por requisição, o que obriga o Next a
 *     renderizar sob demanda. Este site tem 590 páginas estáticas
 *     servidas de CDN, e trocar isso por renderização dinâmica seria
 *     pagar com a arquitetura inteira por uma diretiva.
 *   - Hash não funciona: o script inline muda a cada página, porque
 *     carrega o conteúdo daquela página.
 *
 * O que se perde é a proteção contra XSS refletido. O que resta de
 * risco real, neste projeto, é baixo: não há conteúdo de usuário, não
 * há formulário que grave nada, nenhum parâmetro de URL é injetado no
 * HTML sem escape (o React escapa por padrão) e não há script de
 * terceiro. As demais diretivas continuam valendo e barram bastante
 * coisa — object-src, base-uri, form-action e frame-ancestors.
 *
 * Se um dia o site passar a aceitar entrada de usuário, esta decisão
 * precisa ser revista junto.
 * ================================================================
 */
/**
 * O SERVIDOR DE DESENVOLVIMENTO PRECISA DE 'unsafe-eval'.
 *
 * O `next dev` monta a atualização a quente avaliando string como
 * JavaScript. Sem esta exceção, a CSP bloqueia, nada hidrata, e o dev
 * vê a mesma tela que a produção mostra — só que morta: clique em aba
 * não responde, e o erro só aparece no console. Já custou uma sessão
 * inteira de investigação.
 *
 * Vale SÓ em desenvolvimento. A produção continua sem 'unsafe-eval'.
 */
const emDesenvolvimento = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${emDesenvolvimento ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  // O site não busca nada de fora em tempo de execução. Os links para
  // TSE, Câmara e Senado são navegação, não requisição — e navegação é
  // governada por form-action/frame-ancestors, não por connect-src.
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Ninguém embute este site num iframe: é o que impede clickjacking,
  // e substitui o antigo X-Frame-Options.
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const cabecalhos = [
  { key: "Content-Security-Policy", value: csp },
  // Impede o navegador de "adivinhar" o tipo de um arquivo servido.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Só o domínio, nunca o caminho: o site em si não é sensível, mas o
  // endereço de uma ficha carrega o nome de uma pessoa, e isso não
  // precisa vazar no Referer para o portal do TSE.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nada aqui usa câmera, microfone ou localização. Negar de saída
  // evita que um recurso futuro os ligue por descuido.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Só vale sobre HTTPS; a Vercel serve exclusivamente em HTTPS.
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "X-Frame-Options", value: "DENY" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Não anunciar a versão do framework: não é proteção real, mas tira
  // do atacante o trabalho de descobrir o alvo.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: cabecalhos }];
  },
};

export default nextConfig;
