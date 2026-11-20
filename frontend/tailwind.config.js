/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Hijau hutan Arfak — warna utama
        hutan: {
          50: '#eef5f0', 100: '#dcebe0', 200: '#b6d6c1', 300: '#8abb9d',
          400: '#5c9a77', 500: '#3d7d5c', 600: '#2f6b4c', 700: '#27593f',
          800: '#1e4534', 900: '#17352a', 950: '#0c1f17',
        },
        // Emas bulu Cenderawasih — aksen
        emas: {
          50: '#fbf5ea', 100: '#f5e6c8', light: '#e4b865', DEFAULT: '#c9862c', dark: '#9c6519',
        },
        kabut: '#f7f5ef', // latar utama (kertas hangat)
        krem: '#efe9dc',
        tinta: '#1d2a24', // teks utama
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        kartu: '0 1px 2px rgba(12,31,23,.04), 0 8px 24px -12px rgba(12,31,23,.14)',
        angkat: '0 2px 6px rgba(12,31,23,.06), 0 24px 48px -20px rgba(12,31,23,.28)',
      },
      letterSpacing: { lebar: '0.24em' },
      keyframes: {
        muncul: { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: {
        muncul: 'muncul .7s cubic-bezier(.2,.7,.2,1) both',
      },
    },
  },
  plugins: [],
};
