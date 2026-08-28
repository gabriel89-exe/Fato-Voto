import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Identidade: SERVIÇO PÚBLICO.
 *
 * O site trocou a estética de "diário oficial impresso" — papel creme,
 * tinta preta, filetes grossos, rótulos versais apertados — por algo
 * mais perto do Padrão Digital de Governo (gov.br): fundo claro, texto
 * grande, azul de link forte e bem visível, e o mínimo de ornamento.
 *
 * O motivo é o público. Rótulo em versal de 10px com espacejamento
 * largo é bonito e é ruim de ler — especialmente para quem tem baixa
 * visão, pouca familiaridade com tela, ou está no celular no ônibus.
 * Este site existe para essas pessoas.
 *
 * ATENÇÃO: adotamos as CONVENÇÕES de acessibilidade do gov.br (escala
 * tipográfica, contraste, azul de link), não a marca dele. O projeto é
 * autônomo e NÃO é um site do governo — e a interface precisa dizer
 * isso, justamente porque agora se parece com um.
 *
 * Regra do produto (inalterada): nenhuma cor sugere aprovação ou
 * reprovação. O azul aparece SÓ em elemento de interface — link, foco,
 * navegação ativa, ação primária. Nunca em bloco de candidatura. As
 * fichas são todas iguais em peso e forma.
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
           Ponte shadcn/ui -> identidade do site.
           Os componentes de components/ui falam a língua do shadcn
           (background, foreground, primary, muted...). Aqui esses nomes
           são amarrados às variáveis CSS de app/globals.css.

           CUIDADO COM O NOME: --accent aqui é o cinza de realce de menu
           do shadcn. O azul do site é --acento (com O), exposto no
           Tailwind como `text-acento`. São coisas diferentes.
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
        /* Não existe vermelho neste sistema: cor nenhuma pode ser lida
           como juízo de valor. A ação destrutiva se distingue por forma
           e texto, nunca por matiz. */
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

        /* Superfícies. `papel` virou branco e cinza claro. */
        papel: {
          DEFAULT: "#f6f7f8",
          alta: "#ffffff",
          baixa: "#eef0f2",
          sombra: "#dfe3e7",
        },
        /* Escala de texto e traço. Todos os tons de 400 para cima
           passam em contraste AA sobre branco. */
        tinta: {
          950: "#101418",
          900: "#1c2226",
          800: "#2b3339",
          700: "#3d474e",
          600: "#4f5b63",
          500: "#5e6a72",
          400: "#71787d",
          300: "#a6adb2",
          200: "#ccd2d6",
          100: "#e4e8eb",
        },
        /* Azul gov.br. Único acento, só em interface.
           #1351b4 sobre branco = 7,0:1 — folgado para AA e AAA. */
        acento: {
          DEFAULT: "#1351b4",
          forte: "#0c326f",
          escuro: "#071d41",
          leve: "#e8eef9",
        },
        superficie: {
          DEFAULT: "#f6f7f8",
          alta: "#ffffff",
          baixa: "#eef0f2",
        },
        /* Bloco de dado oficial (par de neutralidade — inalterado). */
        oficial: {
          borda: "#1351b4",
          fundo: "#f0f4fa",
          texto: "#0c326f",
          leve: "#c5d4eb",
        },
        /* Bloco escrito pela plataforma (par de neutralidade). */
        resumo: {
          borda: "#a06b1f",
          fundo: "#fdf6e9",
          texto: "#6b4715",
          leve: "#f0e2c6",
        },
        /* Barra de contexto no topo. Informativa, não alarmante. */
        tarja: {
          fundo: "#071d41",
          alta: "#0c326f",
          baixa: "#04122a",
          texto: "#ffffff",
        },
        /* Escala monocromática de gráfico. Nenhuma fatia é "boa". */
        grafico: {
          1: "#0c326f",
          2: "#1351b4",
          3: "#5b84c9",
          4: "#9db4de",
          5: "#cdd9ef",
        },
      },
      fontFamily: {
        /* Raleway é a fonte de corpo do gov.br e está no Google Fonts.
           Serve para título e texto: uma família só reduz o ruído e o
           peso de carregamento. */
        sans: ["var(--fonte-texto)", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        display: ["var(--fonte-texto)", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        texto: ["var(--fonte-texto)", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        /* Mono só onde número precisa alinhar em coluna: valor em
           tabela e dígito de urna. Nunca em rótulo corrido. */
        mono: ["var(--fonte-mono)", "ui-monospace", "Consolas", "monospace"],
      },
      maxWidth: {
        conteudo: "75rem",
        leitura: "38rem",
      },
      minHeight: { toque: "48px" },
      minWidth: { toque: "48px" },
      screens: { xs: "400px" },
      boxShadow: {
        /* Sombras suaves. As sombras duras deslocadas saíram: davam
           peso visual a tudo e cansavam a leitura. */
        cartao: "0 1px 2px 0 rgb(16 20 24 / 0.06)",
        elevado: "0 4px 12px -2px rgb(16 20 24 / 0.12)",
        painel: "0 2px 8px -2px rgb(16 20 24 / 0.10)",
      },
      letterSpacing: {
        folio: "0.06em",
      },
      keyframes: {
        surgir: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-abre": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-fecha": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        surgir: "surgir 0.4s cubic-bezier(0.22,1,0.36,1) both",
        "accordion-abre": "accordion-abre 0.22s cubic-bezier(0.22,1,0.36,1)",
        "accordion-fecha": "accordion-fecha 0.18s cubic-bezier(0.22,1,0.36,1)",
      },
      transitionTimingFunction: {
        suave: "cubic-bezier(0.22,1,0.36,1)",
      },
      borderRadius: {
        /* Cantos levemente arredondados, como no gov.br. */
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animate],
};

export default config;
