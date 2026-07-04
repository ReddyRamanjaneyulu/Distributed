/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0A0B0F',
          subtle: '#111219',
          raised: '#181A23',
        },
        border: {
          DEFAULT: '#22242E',
          subtle: '#1A1B23',
        },
        accent: {
          DEFAULT: '#5B8CFF',
          dim: '#3D5FD4',
          glow: '#7FA3FF',
        },
        ok: '#3FC97F',
        warn: '#F5A623',
        danger: '#F0554F',
        dead: '#8B5CF6',
        ink: {
          DEFAULT: '#E8E9ED',
          muted: '#9296A6',
          faint: '#5C6070',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.5)',
        glow: '0 0 0 1px rgba(91,140,255,0.4), 0 0 24px -4px rgba(91,140,255,0.5)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
        slideUp: 'slideUp 0.35s ease-out',
      },
    },
  },
  plugins: [],
};
