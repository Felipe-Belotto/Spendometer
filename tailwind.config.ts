import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1a1b1e",
        foreground: "#C1C2C5",
        card: {
          DEFAULT: "#25262b",
          foreground: "#C1C2C5",
        },
        popover: {
          DEFAULT: "#25262b",
          foreground: "#C1C2C5",
        },
        primary: {
          DEFAULT: "#228be6",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#2C2E33",
          foreground: "#C1C2C5",
        },
        muted: {
          DEFAULT: "#373A40",
          foreground: "#848588",
        },
        accent: {
          DEFAULT: "#2C2E33",
          foreground: "#C1C2C5",
        },
        destructive: {
          DEFAULT: "#ff6b6b",
          foreground: "#ffffff",
        },
        border: "#2C2E33",
        input: "#2C2E33",
        ring: "#228be6",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
