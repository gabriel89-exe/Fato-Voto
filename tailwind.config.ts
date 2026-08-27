import type { Config } from "tailwindcss";

/**
 * Paleta deliberadamente fria e neutra.
 * Regra do produto: nenhuma cor pode sugerir aprovacao ou reprovacao.
 * Por isso nao existe verde de "certo" nem vermelho de "errado" no tema.
 *
 * A modernizacao visual (gradientes, sombras, movimento) fica restrita ao
 * "chrome" do site — cabecalho, rodape, heros, fundos, botoes. Nada disso
 * entra nos blocos que identificam uma candidatura.
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
          alta: "#f7d267",
          baixa: "#e7b02f",
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
      screens: {
        xs: "400px",
      },
      boxShadow: {
        sutil: "0 1px 2px rgba(18,23,28,0.04), 0 1px 3px rgba(18,23,28,0.05)",
        media:
          "0 6px 16px -6px rgba(18,23,28,0.14), 0 2px 6px -3px rgba(18,23,28,0.08)",
        alta: "0 22px 48px -18px rgba(18,23,28,0.24), 0 8px 18px -10px rgba(18,23,28,0.14)",
        vidro:
          "0 1px 2px rgba(18,23,28,0.04), 0 14px 34px -20px rgba(18,23,28,0.22)",
      },
      backgroundImage: {
        "malha-fria":
          "radial-gradient(58rem 42rem at 8% -12%, rgba(29,65,96,0.10), transparent 60%), radial-gradient(46rem 40rem at 104% 4%, rgba(63,107,143,0.09), transparent 58%), radial-gradient(40rem 44rem at 50% 128%, rgba(120,153,179,0.10), transparent 62%)",
      },
      keyframes: {
        surgir: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "surgir-suave": {
          "0%": { opacity: "0", transform: "translateY(7px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        aparecer: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        flutuar: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "arrastar-hachura": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "48px 0" },
        },
      },
      animation: {
        surgir: "surgir 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "surgir-suave": "surgir-suave 0.5s cubic-bezier(0.22,1,0.36,1) both",
        aparecer: "aparecer 0.6s ease both",
        flutuar: "flutuar 11s ease-in-out infinite",
        "arrastar-hachura": "arrastar-hachura 14s linear infinite",
      },
      transitionTimingFunction: {
        suave: "cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [],
};

export default config;
