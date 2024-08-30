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
        background: 'rgba(var(--background))',
        foreground: 'rgba(var(--foreground))',
        alternate: 'rgba(var(--alternate))',
      },
      animation: {
        'infinite-scroll-h': 'infinite-scroll-h 30s linear infinite',
        'infinite-scroll-v': 'infinite-scroll-v 5s linear infinite',
        "text-reveal": "text-reveal 1s cubic-bezier(0.77, 0, 0.175, 1) 0.5s",
      },
      keyframes: {
        'infinite-scroll-h': {
          to: { transform: 'translateX(calc(-100% - 32px))' },
        },
        'infinite-scroll-v': {
          to: { transform: 'translateY(calc(-100% - 32px))' },
        },
        "text-reveal": {
          "0%": { transform: "translate(0, 100%)" },
          "100%": { transform: "translate(0, 0)" },
        },
      }  
    },
  },
  plugins: [],
};
export default config;
