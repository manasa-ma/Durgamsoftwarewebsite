/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B1F3A',
          'dark-navy': '#071525',
          orange: '#C74E23',
          'orange-hover': '#B83E15',
          'light-orange': '#FFF7ED',
          white: '#FFFFFF',
          'light-gray': '#F8FAFC',
          border: '#E2E8F0',
          'primary-text': '#0F172A',
          'secondary-text': '#475569',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
