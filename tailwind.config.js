/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Teléfonos de poca altura (p. ej. 360×740): variantes compactas
      // desk-short: laptops con escalado (p. ej. 1920×1080 al 125% → viewport ~1536×730)
      screens: {
        short: { raw: '(max-width: 639px) and (max-height: 800px)' },
        'desk-short': { raw: '(min-width: 1280px) and (max-height: 900px)' },
      },
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
      // Escala tipográfica medida sobre el diseño (artboard 1920px).
      // El valor central en vw reproduce el tamaño exacto a 1920px; clamp() fija mínimos y máximos en rem.
      fontSize: {
        'hero-title': ['clamp(2rem, 2.3vw, 3.5rem)', { lineHeight: '1.25' }], // 44px / 55px @1920
        'hero-lead': ['clamp(1rem, 0.94vw, 1.375rem)', { lineHeight: '1.5' }], // 18px @1920
        'hero-btn': ['clamp(0.875rem, 0.94vw, 1.375rem)', { lineHeight: '1' }], // 18px @1920
        'nav-btn': ['clamp(0.75rem, 0.89vw, 1.25rem)', { lineHeight: '1' }], // 17px @1920
        'hero-highlight': ['clamp(0.75rem, min(0.82vw, 1.45vh), 1.125rem)', { lineHeight: '1.2' }], // 17px @1920×1080; se reduce en pantallas bajas
      },
      boxShadow: { glow: '0 0 24px rgba(230,102,0,.28)' },
    },
  },
  plugins: [],
};
