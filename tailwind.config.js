/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand colors (dari frontend/tailwind.config.js)
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#1e1b4b',
        },
        // Semantic dark palette (dari frontend/src/index.css)
        midnight: {
          DEFAULT: '#090d16',   // Latar belakang utama
          card:    '#0f172a',   // Glass card base (slate-900)
          border:  '#1e293b',   // Border default
          muted:   '#334155',   // Border hover / muted
        },
        // Gradient stops (frontend .gradient-text)
        glow: {
          indigo:  '#818cf8',   // 0%
          purple:  '#c084fc',   // 50%
          pink:    '#f472b6',   // 100%
        },
      },
    },
  },
  plugins: [],
};
