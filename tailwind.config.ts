import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        liora: {
          50: "#f6ecff",
          100: "#e9d3ff",
          200: "#d4a7ff",
          300: "#b96bff",
          400: "#9a3df0",
          500: "#7c1fd6",
          600: "#662787",
          700: "#561e87",
          800: "#4e067f",
          900: "#34079c",
          950: "#240552",
        },
        gold: {
          400: "#f0c95e",
          500: "#d6a03e",
          600: "#b8822a",
        },
      },
      fontFamily: {
        tajawal: ["var(--font-tajawal)", "sans-serif"],
      },
      keyframes: {
        "flicker": {
          "0%, 31.98%, 32%, 32.8%, 32.82%, 34.98%, 35%, 35.7%, 35.72%, 36.98%, 37%, 37.6%, 37.62%, 100%":
            { opacity: "1" },
          "32%, 35%, 37%": { opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        flicker: "flicker 5s linear infinite",
        float: "float 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
