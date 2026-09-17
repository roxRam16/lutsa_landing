/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blanco: '#ffffff',
        'gris-claro': '#dedede',
        'gris-texto': '#666666',
        'naranja-start': '#e66600',
        'naranja-end': '#d54f2c',
        'azul-start': '#2c3bfa',
        'azul-end': '#121874',
      },
      fontFamily: {
        exo: ['Exo 2', 'sans-serif'],
        condensed: ['Roboto Condensed', 'Arial Narrow', 'sans-serif'],
      },
      boxShadow: { glow: '0 0 24px rgba(230,102,0,.28)' },
    },
  },
  plugins: [],
};
