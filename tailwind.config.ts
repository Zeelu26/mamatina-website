import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Royal purple + gold luxury palette.
        // Token names kept (chocolate/cream/etc.) so every component
        // inherits the new shades automatically.
        cream: "#F8F5FB", // soft lavender-white base
        beige: "#E9E1F0", // soft mauve
        "warm-beige": "#CDBCDD", // muted lilac
        gold: "#C9A961", // gilt accent (pairs with royal purple)
        "gold-dark": "#A8893F",
        chocolate: "#3A2358", // deep royal purple — primary anchor
        "chocolate-soft": "#5C3E86", // medium amethyst
        "soft-white": "#FFFEFB",
        "soft-black": "#1B1029", // near-black aubergine
        sand: "#F0E9F7", // light lavender section background
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      letterSpacing: {
        "widest-2": "0.3em",
        "widest-3": "0.5em",
      },
      animation: {
        "fade-in": "fadeIn 1.2s ease-out forwards",
        "fade-up": "fadeUp 1s ease-out forwards",
        "slide-in": "slideIn 1.5s ease-out forwards",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
