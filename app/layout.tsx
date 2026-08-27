import type { Metadata, Viewport } from "next";
import { Fraunces, Libre_Franklin } from "next/font/google";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import TarjaPrototipo from "@/components/TarjaPrototipo";
import "./globals.css";

/**
 * Tipografia.
 *
 * Fraunces (serif com carater editorial) so nos titulos: da voz de
 * "registro publico" sem puxar para nenhum lado. Libre Franklin no corpo
 * e na interface: origem civica, leitura confortavel em telas pequenas.
 * As duas sao variaveis; a familia entra por CSS custom property.
 */
const fonteDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--fonte-display",
  display: "swap",
  axes: ["opsz"],
});

const fonteTexto = Libre_Franklin({
  subsets: ["latin"],
  variable: "--fonte-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fato & Voto — protótipo com dados fictícios",
    template: "%s — Fato & Voto (protótipo)",
  },
  description:
    "Protótipo de plataforma de transparência eleitoral. Todos os dados são fictícios.",
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
      className={`${fonteDisplay.variable} ${fonteTexto.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#conteudo"
          className="apenas-leitor apenas-leitor-foco absolute left-2 top-2 z-[60] rounded-md bg-tinta-900 px-4 py-2 text-white"
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
