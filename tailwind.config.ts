import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        foreground: "rgba(var(--foreground))",
        secondary: "rgba(var(--secondary))",
        tertiary: "rgba(var(--tertiary))",
      },
      animation: {
        perspective: 'perspective 1.8s infinite',
      },
      keyframes: {
        perspective: {
          '0%': { transform: 'perspective(120px)' },
          ' 50%': { transform: 'perspective(120px)' },
          '100%': { transform: 'perspective(120px) rotateY(180deg)' },
        },
      }
    },
  },
  plugins: [],
};
export default config;
