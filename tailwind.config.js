/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        game: {
          green: '#2ecc71',
          emerald: '#10b981',
          gold: '#f59e0b',
          amber: '#fbbf24',
          orange: '#f97316',
          sky: '#38bdf8',
          blue: '#2563eb',
          dark: '#1e293b',
        }
      },
      boxShadow: {
        'game-button': '0 4px 0 rgba(0, 0, 0, 0.25), 0 6px 12px rgba(0, 0, 0, 0.15)',
        'game-card': '0 8px 24px -4px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.4) inset',
      }
    },
  },
  plugins: [],
}
