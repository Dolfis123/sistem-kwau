/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        hutan: {
          50: '#eef5f0', 100: '#dcebe0', 200: '#b6d6c1', 300: '#8abb9d',
          400: '#5c9a77', 500: '#3d7d5c', 600: '#2f6b4c', 700: '#27593f',
          800: '#1e4534', 900: '#17352a', 950: '#0f241b',
        },
        emas: {
          light: '#e8b45a', DEFAULT: '#c9862c', dark: '#a76d1f',
        },
        kabut: '#f7f5ef',
        krem: '#efeadd',
        tinta: '#22302a',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        kartu: '0 2px 10px rgba(15,36,27,.07), 0 12px 32px -12px rgba(15,36,27,.18)',
      },
    },
  },
  plugins: [],
};
