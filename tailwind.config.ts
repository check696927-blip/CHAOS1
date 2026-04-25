import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // 🔥 CHAOS BRAND PALETTE
        "chaos-red": "#FF0055",
        "chaos-purple": "#9D00FF",
        "chaos-pink": "#FF00FF",
        "chaos-cyan": "#00FFFF",
        "chaos-dark": "#0A0A0F",
        "chaos-darker": "#050508",
      },

      fontFamily: {
        chaos: ["Bungee", "cursive"],
        neon: ["Orbitron", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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

        "slide-left-right": {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100vw)" },
          "100%": { transform: "translateX(-100%)" },
        },

        "neon-pulse": {
          "0%, 100%": {
            textShadow:
              "0 0 10px #FF0055, 0 0 20px #FF0055, 0 0 30px #9D00FF",
            filter: "brightness(1)",
          },
          "50%": {
            textShadow:
              "0 0 20px #FF0055, 0 0 40px #9D00FF, 0 0 60px #FF00FF",
            filter: "brightness(1.3)",
          },
        },

        drip: {
          "0%": { transform: "translateY(0) scaleY(1)", opacity: "1" },
          "100%": { transform: "translateY(20px) scaleY(1.5)", opacity: "0" },
        },

        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },

        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-announcement": "slide-left-right 20s linear infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        drip: "drip 1.5s ease-in infinite",
        float: "float 3s ease-in-out infinite",
        glitch: "glitch 0.3s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;