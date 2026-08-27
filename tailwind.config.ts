import type { Config } from "tailwindcss";

/**
 * Paleta deliberadamente fria e neutra.
 * Regra do produto: nenhuma cor pode sugerir aprovacao ou reprovacao.
 * Por isso nao existe verde de "certo" nem vermelho de "errado" no tema.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        superficie: {
          DEFAULT: "#f6f7f8",
          alta: "#ffffff",
          baixa: "#eceef1",
        },
        tinta: {
          900: "#12171c",
          800: "#1e262e",
          700: "#33404d",
          600: "#47576a",
          500: "#5c6f83",
          400: "#7d8fa1",
          300: "#a8b5c0",
          200: "#ccd4db",
          100: "#e3e8ec",
        },
        // Bloco de dado oficial: moldura fria, solida, "carimbada".
        oficial: {
          borda: "#1d4160",
          fundo: "#eef3f8",
          texto: "#123049",
          leve: "#dbe6ef",
        },
        // Bloco escrito pela plataforma: moldura quente, tracejada.
        resumo: {
          borda: "#8a5f27",
          fundo: "#fbf5ea",
          texto: "#5d3f16",
          leve: "#f2e6d1",
        },
        // Tarja de prototipo: alto contraste, impossivel de ignorar.
        tarja: {
          fundo: "#f4c542",
          texto: "#1a1206",
        },
        // Escala fria usada em graficos de votacao e presenca.
        // Diferenciada tambem por rotulo e por textura, nunca so por cor.
        grafico: {
          1: "#1d3f5c",
          2: "#3f6b8f",
          3: "#7899b3",
          4: "#a9bccc",
          5: "#d3dde5",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      maxWidth: {
        conteudo: "72rem",
      },
      minHeight: {
        toque: "44px",
      },
      minWidth: {
        toque: "44px",
      },
    },
  },
  plugins: [],
};

export default config;
