import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono, Libre_Franklin } from "next/font/google";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import TarjaPrototipo from "@/components/TarjaPrototipo";
import "./globals.css";

/**
 * Tipografia.
 *
 * Fraunces (serif editorial) nos titulos: voz de "registro publico".
 * Libre Franklin no corpo: origem civica, leitura confortavel no celular.
 * IBM Plex Mono nos dados, rotulos e numeros: reforca a ideia de ficha
 * e de documento. As familias entram por CSS custom property.
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

const fonteMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fonte-mono",
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
      className={`${fonteDisplay.variable} ${fonteTexto.variable} ${fonteMono.variable}`}
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
