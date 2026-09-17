import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          DEFAULT: "#05050A",
          900: "#05050A",
          800: "#0A0A14",
          700: "#0F0F1C",
          600: "#16162A",
        },
        cyan: {
          DEFAULT: "#00F5FF",
          glow: "#5CFBFF",
        },
        electric: {
          DEFAULT: "#2E6BFF",
        },
        violet: {
          DEFAULT: "#9B5CFF",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 50% 0%, rgba(0,245,255,0.08), transparent 60%)",
        "aurora":
          "conic-gradient(from 180deg at 50% 50%, #00F5FF, #2E6BFF, #9B5CFF, #00F5FF)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(0,245,255,0.25)",
        "glow-violet": "0 0 40px rgba(155,92,255,0.25)",
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-14px,0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        drift: "drift 6s ease-in-out infinite",
        "spin-slow": "spin-slow 22s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
