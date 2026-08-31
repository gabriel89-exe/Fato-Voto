/**
 * Cabeçalhos de segurança.
 *
 * O site é estático, público e não tem login, formulário de envio nem
 * cookie — a superfície de ataque é pequena. Mesmo assim os cabeçalhos
 * abaixo fecham o que sobra, e o custo é zero.
 *
 * A CSP é restritiva porque o projeto pode se dar a esse luxo: não há
 * script de terceiro, as fontes são baixadas no build (next/font) e as
 * imagens são SVG do próprio código. Se um dia entrar analytics ou
 * incorporação externa, a CSP vai reclamar antes de o recurso carregar
 * — e é para isso que ela serve.
 *
 * `'unsafe-inline'` em style-src é exigência do Next: ele injeta estilo
 * inline no HTML servido. Em script-src ele NÃO aparece.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self'",
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
