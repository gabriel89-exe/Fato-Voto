import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  JetBrains_Mono,
  Newsreader,
} from "next/font/google";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import TarjaPrototipo from "@/components/TarjaPrototipo";
import "./globals.css";

/**
 * Tipografia da GAZETA.
 *
 * Bricolage Grotesque: manchetes. Grotesca contemporanea, apertada,
 * com carater — a "voz" impressa do site.
 * Newsreader: corpo de texto. Serifa de jornal feita para tela.
 * JetBrains Mono: dados, rotulos, folios, datalinha. Reforca a ideia
 * de registro tabelado.
 */
const fonteDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--fonte-display",
  display: "swap",
});

const fonteTexto = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
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
      className={`${fonteDisplay.variable} ${fonteTexto.variable} ${fonteMono.variable}`}
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
