import type { Config } from "tailwindcss";

/**
 * Paleta deliberadamente fria e neutra.
 * Regra do produto: nenhuma cor pode sugerir aprovacao ou reprovacao.
 * Nao existe verde de "certo" nem vermelho de "errado" no tema.
 *
 * Identidade visual: "registro publico". Casca escura (cabecalho, hero,
 * rodape) que emoldura folhas de papel claro onde vivem os dados. O
 * contraste casca/papel e a unica dramaticidade — nunca a candidatura.
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
        // Folha de papel: fundo quente, levemente fora do branco.
        papel: {
          DEFAULT: "#f7f5f0",
          alta: "#ffffff",
          baixa: "#efece4",
        },
        // Casca institucional: a moldura escura do site.
        casca: {
          DEFAULT: "#111820",
          alta: "#1a232d",
          baixa: "#0b1015",
          borda: "#2b3843",
          texto: "#eef2f6",
          suave: "#93a6b3",
        },
        superficie: {
          DEFAULT: "#f7f5f0",
          alta: "#ffffff",
          baixa: "#efece4",
        },
        tinta: {
          950: "#0a0e12",
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
          alta: "#f7d267",
          baixa: "#e7b02f",
          texto: "#1a1206",
        },
        // Escala fria usada em graficos de votacao e presenca.
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
          "var(--fonte-sans)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "var(--fonte-display)",
          "Iowan Old Style",
          "Palatino Linotype",
          "Georgia",
          "Cambria",
          "serif",
        ],
        mono: [
          "var(--fonte-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Consolas",
          "monospace",
        ],
      },
      maxWidth: {
        conteudo: "72rem",
        leitura: "42rem",
      },
      minHeight: {
        toque: "44px",
      },
      minWidth: {
        toque: "44px",
      },
      screens: {
        xs: "400px",
      },
      boxShadow: {
        sutil: "0 1px 2px rgba(18,23,28,0.04), 0 1px 3px rgba(18,23,28,0.05)",
        media:
          "0 6px 16px -6px rgba(18,23,28,0.14), 0 2px 6px -3px rgba(18,23,28,0.08)",
        alta: "0 22px 48px -18px rgba(18,23,28,0.24), 0 8px 18px -10px rgba(18,23,28,0.14)",
        papel:
          "0 1px 2px rgba(18,23,28,0.05), 0 12px 28px -18px rgba(18,23,28,0.22)",
        casca: "0 18px 40px -22px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "planta-casca":
          "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
      },
      backgroundSize: {
        planta: "48px 48px",
      },
      keyframes: {
        surgir: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "surgir-suave": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        aparecer: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "arrastar-hachura": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "48px 0" },
        },
        "risca-entrar": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        surgir: "surgir 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "surgir-suave": "surgir-suave 0.5s cubic-bezier(0.22,1,0.36,1) both",
        aparecer: "aparecer 0.6s ease both",
        "arrastar-hachura": "arrastar-hachura 14s linear infinite",
        "risca-entrar": "risca-entrar 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
      transitionTimingFunction: {
        suave: "cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [],
};

export default config;
