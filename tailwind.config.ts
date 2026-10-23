import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0D0F12",
          light: "#12151B",
          card: "#16191E",
          surface: "#1C2128",
          border: "rgba(255, 255, 255, 0.08)",
        },
        gold: {
          50: "#FAF7EE",
          100: "#F4ECDC",
          200: "#E8D8B6",
          300: "#DEC390",
          400: "#D9B862",
          500: "#D4AF37", // primary champagne gold
          600: "#B89224",
          700: "#8F6E18",
          800: "#654C0E",
          900: "#3B2B06",
          glow: "rgba(212, 175, 55, 0.35)",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 25px rgba(212, 175, 55, 0.25)",
        "gold-glow-lg": "0 0 45px rgba(212, 175, 55, 0.35)",
        "card-dark": "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
