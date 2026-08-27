import type { Metadata, Viewport } from "next";
import Cabecalho from "@/components/Cabecalho";
import Rodape from "@/components/Rodape";
import TarjaPrototipo from "@/components/TarjaPrototipo";
import "./globals.css";

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
    <html lang="pt-BR">
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
