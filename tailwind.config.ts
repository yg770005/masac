import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "space": {
          "950": "#020617",
          "900": "#0a0f1e",
          "800": "#111827",
          "700": "#1a2236",
        },
        "neon": {
          "cyan": "#22d3ee",
          "blue": "#3b82f6",
          "purple": "#8b5cf6",
          "pink": "#ec4899",
          "amber": "#f59e0b",
        },
      },
      animation: {
        "breathe": "breathe 3s ease-in-out infinite",
        "flow-pulse": "flowPulse 2.5s ease-in-out infinite",
        "expand-in": "expandIn 0.8s ease-out",
        "float": "float 6s ease-in-out infinite",
        "drone-hover": "droneHover 3s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "number-tick": "numberTick 0.3s ease-out",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        flowPulse: {
          "0%": { boxShadow: "0 0 5px currentColor" },
          "50%": { boxShadow: "0 0 25px currentColor, 0 0 50px currentColor" },
          "100%": { boxShadow: "0 0 5px currentColor" },
        },
        expandIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        droneHover: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-8px) rotate(0.5deg)" },
          "75%": { transform: "translateY(4px) rotate(-0.5deg)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(34, 211, 238, 0.6)" },
        },
        numberTick: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
