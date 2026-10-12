export type Lang = 'es' | 'en';

// Textos por sección. Las listas de líneas respetan los saltos del diseño de escritorio;
// en móvil/tablet se unen como texto corrido.
export const translations = {
  es: {
    header: {
      homeLabel: 'LUTSA Transportes, ir a inicio',
      language: 'Idioma',
      languageShort: 'EN',
      switchLabel: 'Cambiar idioma a inglés',
      contact: 'Contacto',
    },
    hero: {
      titleLines: ['Siempre en', 'movimiento,'],
      titleAccentLines: ['conectando', 'posibilidades.'],
      leadLines: ['Soluciones logísticas integrales', 'que impulsan tu negocio más lejos.'],
      cta: 'Conoce más',
      highlights: [
        ['Conectamos', 'puertos,', 'empresas y', 'mercados.'],
        ['Seguridad,', 'experiencia y', 'compromiso.'],
        ['Veracruz, el', 'punto que nos', 'mueve.'],
      ],
    },
  },
  en: {
    header: {
      homeLabel: 'LUTSA Transportes, go to home',
      language: 'Language',
      languageShort: 'ES',
      switchLabel: 'Switch language to Spanish',
      contact: 'Contact',
    },
    hero: {
      titleLines: ['Always on', 'the move,'],
      titleAccentLines: ['connecting', 'possibilities.'],
      leadLines: ['Comprehensive logistics solutions', 'that take your business further.'],
      cta: 'Learn more',
      highlights: [
        ['Connecting', 'ports,', 'businesses and', 'markets.'],
        ['Safety,', 'experience and', 'commitment.'],
        ['Veracruz, the', 'hub that', 'drives us.'],
      ],
    },
  },
} as const;

export type Translations = (typeof translations)[Lang];
