import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Identidade: GAZETA.
 * O site e diagramado como um diario oficial de eleicao — papel de
 * jornal, tinta preta, filetes grossos, grelha de colunas, folios
 * numerados. A dramaticidade e toda tipografica e estrutural.
 *
 * Regra do produto (inalterada): nenhuma cor sugere aprovacao ou
 * reprovacao. O azul de carimbo (--acento) aparece SO em elemento de
 * interface — link, foco, navegacao ativa, filete de titulo. Nunca em
 * bloco de candidatura. As fichas sao todas iguais em peso e forma.
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
        /* ----------------------------------------------------------------
           Ponte shadcn/ui -> GAZETA.
           Os componentes de components/ui falam a lingua do shadcn
           (background, foreground, primary, muted...). Aqui esses nomes
           sao amarrados as variaveis CSS de app/globals.css, que por sua
           vez apontam para a paleta de papel e tinta. Consequencia
           pratica: um componente novo baixado do shadcn ja nasce com a
           identidade do site, sem retrabalho.
           ---------------------------------------------------------------- */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        /* Nao existe vermelho neste sistema. Ver a nota em globals.css:
           cor nenhuma pode ser lida como juizo de valor, entao a acao
           destrutiva se distingue por forma e texto, nao por matiz. */
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Papel de jornal, quente.
        papel: {
          DEFAULT: "#f2eee2",
          alta: "#faf7ee",
          baixa: "#e7e1d0",
          sombra: "#d8d1bd",
        },
        // Tinta preta, levemente quente, e sua escala.
        tinta: {
          950: "#141310",
          900: "#1b1a16",
          800: "#2c2a24",
          700: "#3f3c33",
          600: "#575347",
          500: "#6b6659",
          400: "#8c8676",
          300: "#a8a292",
          200: "#c9c3b1",
          100: "#e2dcca",
        },
        // Azul de carimbo — unico acento, so em interface.
        acento: {
          DEFAULT: "#1f3a5f",
          forte: "#152a47",
          leve: "#e6ebf1",
        },
        superficie: {
          DEFAULT: "#f2eee2",
          alta: "#faf7ee",
          baixa: "#e7e1d0",
        },
        // Bloco de dado oficial (par de neutralidade — inalterado).
        oficial: {
          borda: "#1d4160",
          fundo: "#eef3f8",
          texto: "#123049",
          leve: "#dbe6ef",
        },
        // Bloco escrito pela plataforma (par de neutralidade — inalterado).
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
          "Arial",
          "sans-serif",
        ],
        display: [
          "var(--fonte-display)",
          "Archivo",
          "Helvetica Neue",
          "Arial Narrow",
          "sans-serif",
        ],
        texto: [
          "var(--fonte-texto)",
          "Iowan Old Style",
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
      borderRadius: {
        /* A GAZETA e de cantos vivos: --radius e 0px. O token existe
           mesmo assim porque todo componente shadcn o consome. */
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      maxWidth: {
        conteudo: "75rem",
        leitura: "40rem",
      },
      minHeight: { toque: "44px" },
      minWidth: { toque: "44px" },
      screens: { xs: "400px" },
      boxShadow: {
        // Sombras duras, deslocadas — bloco de impressao, nao "flutuar".
        bloco: "4px 4px 0 0 #1b1a16",
        "bloco-sm": "3px 3px 0 0 #1b1a16",
        "bloco-acento": "4px 4px 0 0 #1f3a5f",
        prensa: "2px 2px 0 0 rgba(27,26,22,0.16)",
      },
      letterSpacing: {
        folio: "0.28em",
      },
      keyframes: {
        surgir: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "surgir-suave": {
          "0%": { opacity: "0", transform: "translateY(9px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "risca-h": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "arrastar-hachura": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "48px 0" },
        },
        "accordion-abre": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-fecha": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "desliza-bandeira": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        surgir: "surgir 0.62s cubic-bezier(0.22,1,0.36,1) both",
        "surgir-suave": "surgir-suave 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "risca-h": "risca-h 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "arrastar-hachura": "arrastar-hachura 14s linear infinite",
        "desliza-bandeira": "desliza-bandeira 13s linear infinite",
        "accordion-abre": "accordion-abre 0.22s cubic-bezier(0.22,1,0.36,1)",
        "accordion-fecha": "accordion-fecha 0.18s cubic-bezier(0.22,1,0.36,1)",
      },
      transitionTimingFunction: {
        suave: "cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
