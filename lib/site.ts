/**
 * Constantes de publicação.
 *
 * Os dois valores abaixo são o que separa o site de rodar em
 * `localhost` e de circular de verdade. Ficam juntos e num arquivo só
 * de propósito: quando o domínio e o e-mail existirem, há UM lugar para
 * mexer, e não seis.
 */

/**
 * Endereço público do site, sem barra no fim.
 *
 * Usado pelo sitemap, pelo robots.txt e pela imagem de compartilhamento
 * — os três precisam de URL absoluta, porque quem os lê (buscador,
 * WhatsApp) não tem como resolver caminho relativo.
 *
 * Vem de variável de ambiente, e não de literal no código, porque o
 * mesmo build precisa servir em pré-visualização e em produção com
 * endereços diferentes. Defina `NEXT_PUBLIC_SITE_URL` na hospedagem
 * quando o domínio existir; sem ela, o site funciona normalmente e
 * assume localhost.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

/**
 * Canal de correção.
 *
 * Vazio enquanto o endereço não é criado. NÃO preencha com um e-mail
 * provisório: o rodapé e a página "Quem somos" leem esta constante e,
 * quando ela está vazia, dizem que o canal está sendo criado em vez de
 * publicar um endereço que ninguém lê. Prometer um canal que não
 * responde é pior que admitir que ele ainda não existe.
 */
export const EMAIL_CONTATO = "fatoevoto@gmail.com";
