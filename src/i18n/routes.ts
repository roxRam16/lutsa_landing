// URLs limpias por idioma (requisito SEO): cada sección tiene su ruta en español e inglés.
//   /es/servicios ⇄ /en/services · /es/ ⇄ /en/
// Es un sitio de una sola página: la ruta indica la sección a la que se hace scroll.
import type { Lang } from './translations';

export const SITE_URL = 'https://lutsa.mx';

/** Carpeta donde se publica el sitio: '' en la raíz (lutsa.mx) o '/pruebas' en la versión de pruebas. Viene de `base` de Vite. */
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

export const SECTION_IDS = [
  'inicio', 'quienes-somos', 'servicios', 'industrias', 'ecosistema', 'contacto', 'certificaciones', 'galeria',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

const SLUGS: Record<Lang, Record<SectionId, string>> = {
  es: {
    inicio: '', 'quienes-somos': 'nosotros', servicios: 'servicios', industrias: 'industrias',
    ecosistema: 'submarcas', galeria: 'galeria', certificaciones: 'certificaciones', contacto: 'cotizacion',
  },
  en: {
    inicio: '', 'quienes-somos': 'about-us', servicios: 'services', industrias: 'industries',
    ecosistema: 'brands', galeria: 'gallery', certificaciones: 'certifications', contacto: 'quote',
  },
};

/** Ruta de una sección en un idioma: `/en/services`, `/es/` … */
export function pathFor(lang: Lang, section: SectionId): string {
  const slug = SLUGS[lang][section];
  return `${BASE_PATH}/${lang}/${slug}`;
}

/** Idioma y sección a partir de la ruta actual. Desconocido → español / inicio. */
export function parsePath(pathname: string): { lang: Lang | null; section: SectionId } {
  const local = pathname.toLowerCase().startsWith(BASE_PATH.toLowerCase()) ? pathname.slice(BASE_PATH.length) : pathname;
  const [, maybeLang = '', slug = ''] = local.toLowerCase().split('/');
  const lang = maybeLang === 'es' || maybeLang === 'en' ? maybeLang : null;
  const table = SLUGS[lang ?? 'es'];
  const section = (Object.keys(table) as SectionId[]).find((id) => table[id] === slug.replace(/\/$/, '')) ?? 'inicio';
  return { lang, section };
}

/** Todas las rutas (para el sitemap y el prerender). */
export function allPaths(): { lang: Lang; section: SectionId; path: string }[] {
  return (['es', 'en'] as Lang[]).flatMap((lang) => SECTION_IDS.map((section) => ({ lang, section, path: pathFor(lang, section) })));
}

// Metadatos por idioma y sección: título y descripción para Google y redes sociales.
export const SEO: Record<Lang, { keywords: string; ogImage: string; ogLocale: string; pages: Record<SectionId, { title: string; description: string }> }> = {
  es: {
    keywords: 'transporte de carga, logística en Veracruz, transporte de contenedores, autotransporte federal, comercio exterior, almacén y patio de contenedores, maniobras, transporte refrigerado, Puerto de Veracruz, LUTSA Transportes',
    ogImage: '/og-image-es.jpg',
    ogLocale: 'es_MX',
    pages: {
      inicio: { title: 'LUTSA Transportes | Transporte de carga y logística en Veracruz', description: 'Transporte de carga, contenedores y soluciones logísticas integrales desde el Puerto de Veracruz. Más de 10 años conectando puertos, empresas y mercados en México.' },
      'quienes-somos': { title: 'Nosotros | LUTSA Transportes', description: 'Empresa 100% mexicana con más de 10 años de experiencia en transporte y logística. Conoce a nuestro equipo y nuestras áreas especializadas.' },
      servicios: { title: 'Servicios logísticos y de transporte | LUTSA Transportes', description: 'Transporte nacional y regional, contenedores, refrigerados, maniobras, patio y almacén propio a 4 km del Puerto de Veracruz.' },
      industrias: { title: 'Industrias que atendemos | LUTSA Transportes', description: 'Logística para las industrias automotriz, alimenticia, minera, acerera, agroquímica, manufacturera y más, con cobertura nacional.' },
      ecosistema: { title: 'Ecosistema de empresas y submarcas | LUTSA Transportes', description: 'LUTSA Transportes, MAGNO Transportes, Parque Logístico MIL519, LUTSA Almacén y LUTSA Regionales: un ecosistema logístico integrado.' },
      galeria: { title: 'Galería | LUTSA Transportes', description: 'Nuestra flota, patio, maniobras y equipo en imágenes.' },
      certificaciones: { title: 'Certificaciones | LUTSA Transportes', description: 'Procesos confiables, trazables y certificados para la seguridad de tu carga.' },
      contacto: { title: 'Solicita tu cotización | LUTSA Transportes', description: 'Cotiza tu servicio de transporte de carga y logística. Respuesta rápida de nuestro equipo comercial.' },
    },
  },
  en: {
    keywords: 'freight transportation Mexico, logistics Veracruz, container trucking, Port of Veracruz, foreign trade logistics, container yard and warehouse, reefer transport, cargo handling, LUTSA Transportes',
    ogImage: '/og-image-en.jpg',
    ogLocale: 'en_US',
    pages: {
      inicio: { title: 'LUTSA Transportes | Freight transportation & logistics in Veracruz, Mexico', description: 'Freight, container transportation and end-to-end logistics from the Port of Veracruz. Over 10 years connecting ports, businesses and markets across Mexico.' },
      'quienes-somos': { title: 'About us | LUTSA Transportes', description: 'A 100% Mexican company with over 10 years of experience in transportation and logistics. Meet our team and specialized departments.' },
      servicios: { title: 'Logistics and transportation services | LUTSA Transportes', description: 'National and regional trucking, containers, reefer transport, cargo handling, and our own yard and warehouse 4 km from the Port of Veracruz.' },
      industrias: { title: 'Industries we serve | LUTSA Transportes', description: 'Logistics for the automotive, food, mining, steel, agrochemical and manufacturing industries, with nationwide coverage.' },
      ecosistema: { title: 'Business ecosystem and brands | LUTSA Transportes', description: 'LUTSA Transportes, MAGNO Transportes, MIL519 Logistics Park, LUTSA Warehouse and LUTSA Regional: an integrated logistics ecosystem.' },
      galeria: { title: 'Gallery | LUTSA Transportes', description: 'Our fleet, yard, cargo handling and team in pictures.' },
      certificaciones: { title: 'Certifications | LUTSA Transportes', description: 'Reliable, traceable and certified processes to keep your cargo safe.' },
      contacto: { title: 'Request a quote | LUTSA Transportes', description: 'Get a quote for freight transportation and logistics services. Fast response from our sales team.' },
    },
  },
};

/** URL completa de la imagen para compartir (Open Graph) de un idioma. */
export const ogImageUrl = (lang: Lang) => SITE_URL + BASE_PATH + SEO[lang].ogImage;
