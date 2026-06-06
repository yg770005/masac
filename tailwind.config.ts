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
        },
      },
      animation: {
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "drone-hover": "droneHover 3s ease-in-out infinite",
        "scan-line": "scanLine 2s linear infinite",
        "border-rotate": "borderRotate 4s linear infinite",
        "number-tick": "numberTick 0.3s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(34, 211, 238, 0.6)" },
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
        scanLine: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        borderRotate: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
        numberTick: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(ellipse at center, rgba(34,211,238,0.15) 0%, transparent 70%)",
        "card-border": "linear-gradient(135deg, rgba(34,211,238,0.4), rgba(59,130,246,0.4))",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
