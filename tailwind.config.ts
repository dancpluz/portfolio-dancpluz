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
        'infinite-scroll-h': 'infinite-scroll-h 40s linear infinite',
        'infinite-scroll-v': 'infinite-scroll-v 5s linear infinite',
        "text-reveal": "text-reveal 1s cubic-bezier(0.77, 0, 0.175, 1) 0.5s",
      },
      keyframes: {
        'infinite-scroll-h': {
          '0%': { transform: 'translateX(calc(-100% - 32px))' },
          '100%': { transform: 'translateX(0)' },
        },
        'infinite-scroll-v': {
          '0%': { transform: 'translateY(calc(-100% - 32px))' },
          '100%': { transform: 'translateY(0)' },
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
