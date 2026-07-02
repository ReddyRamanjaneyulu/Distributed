/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0B0E14",
        surface: "#11141C",
        "surface-2": "#171B26",
        "surface-hover": "#1D2230",
        border: {
          DEFAULT: "#232838",
          light: "#2C3244",
        },
        ink: {
          DEFAULT: "#E6E9F0",
          dim: "#9AA2B8",
          faint: "#5B6178",
        },
        accent: {
          DEFAULT: "#5B8DEF",
          dim: "#2E4E9E",
        },
        pulse: {
          DEFAULT: "#22D3C7",
          dim: "#0F5E58",
        },
        success: "#34D399",
        warning: "#FBBF24",
        danger: "#F87171",
        dlq: "#C084FC",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        pulseLine: {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-200" },
        },
        blink: {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.35 },
        },
      },
      animation: {
        pulseLine: "pulseLine 3s linear infinite",
        blink: "blink 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
