import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Raleway } from "next/font/google";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import TarjaPrototipo from "@/components/TarjaPrototipo";
import "./globals.css";

/**
 * Tipografia.
 *
 * Raleway é a fonte de corpo do Padrão Digital de Governo (gov.br) e
 * está no Google Fonts. Uma família só para título e texto: reduz o
 * ruído visual e o peso de carregamento.
 *
 * JetBrains Mono fica SÓ onde número precisa alinhar em coluna —
 * valor em tabela e dígito de urna. Nunca em rótulo corrido.
 */
const fonteTexto = Raleway({
  subsets: ["latin"],
  variable: "--fonte-texto",
  display: "swap",
});

const fonteMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fonte-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fato & Voto — candidaturas do Espírito Santo",
    template: "%s — Fato & Voto",
  },
  description:
    "Dados públicos das candidaturas do Espírito Santo, sem ranking e sem recomendação.",
  robots: { index: false, follow: false },
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
      className={`${fonteTexto.variable} ${fonteMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
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
