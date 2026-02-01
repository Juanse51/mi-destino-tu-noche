/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#FF6B35', dark: '#E55A2B', light: '#FF8555' },
        dark: { DEFAULT: '#0F0F1A', lighter: '#1A1A2E', card: '#1E1E32' },
      },
    },
  },
  plugins: [],
}
