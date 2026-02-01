/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          dark: '#E55A2B',
          light: '#FF8555',
        },
        dark: {
          DEFAULT: '#0F0F1A',
          lighter: '#1A1A2E',
          card: '#1E1E32',
        },
        accent: {
          green: '#10B981',
          yellow: '#FCD34D',
          purple: '#9B59B6',
          pink: '#FF69B4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
