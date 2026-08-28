import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import TarjaPrototipo from "@/components/TarjaPrototipo";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/**
 * Tipografia.
 *
 * Saiu a Raleway: é a fonte de corpo do Padrão Digital de Governo, e
 * usá-la em tudo era metade do motivo de o site parecer oficial.
 *
 * Inter carrega o corpo. Altura de x grande e formas abertas — é o que
 * segura a leitura em 17px numa tela de celular, que é onde a maior
 * parte das pessoas vai abrir isto.
 *
 * Fraunces entra só em h1, h2 e na marca. Serifado de contraste alto:
 * dá caráter em linha curta e cansaria em parágrafo, por isso a
 * restrição está escrita no globals.css e não só na intenção.
 *
 * JetBrains Mono fica SÓ onde número precisa alinhar em coluna —
 * valor em tabela e dígito de urna. Nunca em rótulo corrido.
 *
 * As três vêm do Google Fonts e são servidas pelo próprio domínio: o
 * next/font baixa o arquivo no build. Nenhuma requisição do visitante
 * sai para o Google, o que também evita entregar a lista de quem leu
 * quais candidaturas para um terceiro.
 */
const fonteTexto = Inter({
  subsets: ["latin"],
  variable: "--fonte-texto",
  display: "swap",
});

const fonteTitulo = Fraunces({
  subsets: ["latin"],
  variable: "--fonte-titulo",
  display: "swap",
  /* `opsz` é o eixo de tamanho óptico da Fraunces: em corpo pequeno o
     desenho engrossa a serifa e abre o espacejamento. Como ela só
     aparece em título, fixamos no alto da escala. */
  axes: ["opsz"],
});

const fonteMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fonte-mono",
  display: "swap",
});

export const metadata: Metadata = {
  /* Base para toda URL absoluta gerada pelo Next: sitemap, canônica e
     imagem de compartilhamento. Sem ela, a imagem sai com caminho
     relativo e o WhatsApp não consegue buscá-la. */
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fato & Voto — candidaturas do Espírito Santo",
    template: "%s — Fato & Voto",
  },
  description:
    "Dados públicos das candidaturas do Espírito Santo, sem ranking e sem recomendação.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Fato & Voto",
    title: "Fato & Voto — candidaturas do Espírito Santo",
    description:
      "Dados públicos das candidaturas do Espírito Santo, sem ranking e sem recomendação.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${fonteTexto.variable} ${fonteTitulo.variable} ${fonteMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        {/* Rede de segurança para quem navega sem JavaScript.

            As entradas animadas usam o motion, que grava
            `opacity: 0; filter: blur(5px)` direto no HTML servido e só
            corrige quando o script roda. Conferido: a home sai do
            servidor com 16 elementos assim. Sem esta regra, quem tem
            JS desligado recebe a página em branco — não mal animada,
            em branco. Num site cujo formulário de busca foi feito de
            propósito para funcionar sem JS, isso não passa.

            Fica dentro do <body> porque <noscript> não pode ser filho
            direto de <html>, e o App Router não deixa escrever no
            <head>. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-entrada]{opacity:1!important;filter:none!important;transform:none!important}",
            }}
          />
        </noscript>

        <a
          href="#conteudo"
          className="apenas-leitor apenas-leitor-foco absolute left-2 top-2 z-[60] bg-tinta-900 px-4 py-2 text-papel-alta no-underline"
        >
          Pular para o conteúdo
        </a>
        <TarjaPrototipo />
        <Cabecalho />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Rodape />
      </body>
    </html>
  );
}
