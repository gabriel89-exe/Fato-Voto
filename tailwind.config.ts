import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Identidade: EDITORIAL CÍVICO.
 *
 * A versão anterior copiava a paleta do Padrão Digital de Governo — o
 * mesmo azul #1351b4, o mesmo cinza-azulado frio. Funcionava, e era
 * exatamente esse o problema: um site que se parece com um site do
 * governo empresta uma autoridade que ele não tem, e nenhuma tarja no
 * topo desfaz por completo essa impressão.
 *
 * O que ficou do gov.br é o que importa — as CONVENÇÕES de leitura:
 * corpo de 17px, contraste AA em todo par de cor (conferido por
 * `npm run contraste`, não por olho), foco sempre visível, alvo de
 * toque de 48px, link sublinhado. Isso não é marca de ninguém: é o que
 * torna a página legível para quem tem baixa visão, pouca familiaridade
 * com tela, ou está no celular dentro do ônibus.
 *
 * O que mudou é a pele: papel morno no lugar do cinza frio, tinta
 * quente no lugar do grafite azulado, e um azul-violeta de tinta de
 * caneta no lugar do azul institucional.
 *
 * Regra do produto (inalterada): nenhuma cor sugere aprovação ou
 * reprovação. Não existe verde nem vermelho neste sistema — a ausência
 * do verde é deliberada, porque a tela mostra "Deferido" e
 * "Indeferido" e verde seria lido como nota. O acento aparece SÓ em
 * elemento de interface: link, foco, navegação ativa, ação primária.
 * Nunca dentro de um bloco de candidatura. As fichas são todas iguais
 * em peso e forma.
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

        /* Superfícies. Papel morno: o branco puro fica reservado para
           o que é cartão, então o fundo e o conteúdo se separam sem
           precisar de sombra pesada. */
        papel: {
          DEFAULT: "#f7f5f1",
          alta: "#ffffff",
          baixa: "#efece6",
          sombra: "#ddd8cf",
        },
        /* Escala de texto e traço, em cinza quente para combinar com o
           papel. Do 400 para cima tudo passa AA sobre branco E sobre
           papel — o teste sobre papel é o que costuma ser esquecido, e
           é onde a maior parte do texto de fato vive. */
        tinta: {
          950: "#191713",
          900: "#26231e",
          800: "#383430",
          700: "#4b463f",
          600: "#5f5951",
          500: "#6d675e",
          400: "#726c61",
          /* 300 é borda de campo de formulário: 3:1, o mínimo da WCAG
             1.4.11 para contorno de controle. Não use em texto. */
          300: "#918b7d",
          /* 200 e 100 são filete decorativo. Nunca delimitam controle. */
          200: "#cfc9bd",
          100: "#e7e3da",
        },
        /* Azul-violeta de tinta de caneta. Único acento, só em
           interface. Sobre branco dá 9,0:1 — passa AAA com folga, e é
           inconfundível com o azul institucional que estava aqui. */
        acento: {
          DEFAULT: "#3f37a8",
          forte: "#2c2578",
          escuro: "#1a1550",
          leve: "#efeefb",
          borda: "#cfcbf0",
        },
        /* Bloco de dado oficial. Primeira metade do par de
           neutralidade: distingue o que veio da fonte do que foi
           escrito aqui — por matiz, nunca por hierarquia. */
        oficial: {
          borda: "#3f37a8",
          fundo: "#f2f1fc",
          texto: "#2c2578",
          leve: "#cfcbf0",
        },
        /* Bloco escrito pela plataforma. Segunda metade do par: cobre
           quente, sem parentesco com alerta nem com aprovação. */
        resumo: {
          borda: "#8a5a2b",
          fundo: "#faf3ea",
          texto: "#5e3c1a",
          leve: "#ecdcc6",
        },
        /* Barra de contexto no topo. Informativa, não alarmante. */
        tarja: {
          fundo: "#1a1550",
          alta: "#2c2578",
          baixa: "#120e38",
          texto: "#ffffff",
        },
        /* Escala monocromática de gráfico. Nenhuma fatia é "boa". */
        grafico: {
          1: "#1a1550",
          2: "#2c2578",
          3: "#3f37a8",
          4: "#8a84d0",
          5: "#cfcbf0",
        },
      },
      fontFamily: {
        /* Duas famílias, com papéis separados.

           Antes era Raleway em tudo — a fonte de corpo do gov.br, o que
           somava ao problema de parecer um site oficial.

           `texto` (Inter) carrega todo o corpo: altura de x grande,
           números legíveis, desenho pensado para tela pequena. É a
           escolha de legibilidade.

           `display` (Fraunces) é um serifado de contraste alto e só
           aparece em h1, h2 e na marca. É a escolha de personalidade —
           e fica restrita a linhas curtas justamente por isso. */
        sans: ["var(--fonte-texto)", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        texto: ["var(--fonte-texto)", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        display: ["var(--fonte-titulo)", "Georgia", "Times New Roman", "serif"],
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
        /* Sombras quentes: a cor da sombra é a da tinta, não preto
           puro. Sobre papel morno, sombra cinza-azulada suja. */
        cartao: "0 1px 2px 0 rgb(25 23 19 / 0.05)",
        elevado:
          "0 2px 4px -1px rgb(25 23 19 / 0.06), 0 12px 24px -8px rgb(25 23 19 / 0.14)",
        painel: "0 1px 2px 0 rgb(25 23 19 / 0.04), 0 8px 20px -8px rgb(25 23 19 / 0.10)",
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
        /* 10px. O raio de 4px do gov.br era o de um formulário
           institucional; este é o de um cartão impresso. */
        lg: "var(--radius)",
        md: "calc(var(--radius) - 3px)",
        sm: "calc(var(--radius) - 6px)",
      },
    },
  },
  plugins: [animate],
};

export default config;
