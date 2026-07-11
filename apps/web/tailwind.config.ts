import type { Config } from "tailwindcss";

/**
 * Tailwind v3. Los design tokens (identidad NTT DATA) viven en
 * `src/styles/tokens.css` como custom properties; aquí se exponen a las utilidades
 * de Tailwind vía `theme.extend`, de modo que la fuente de verdad del valor sea el
 * token CSS de la guía de estilos.
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          action: "var(--color-primary-action)",
          hover: "var(--color-primary-hover)",
        },
        brand: {
          red: "var(--color-brand-red)",
        },
        surface: "var(--color-surface)",
        appbg: "var(--color-bg)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
          disabled: "var(--color-text-disabled)",
        },
      },
      fontFamily: {
        base: "var(--font-family-base)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
    },
  },
  plugins: [],
};

export default config;
