// Mantiene <title>, metadescripción, canonical, hreflang y Open Graph sincronizados con el idioma y la
// sección. El prerender (scripts/prerender.mjs) los deja ya escritos en el HTML de cada ruta para Google;
// esto los actualiza al navegar dentro del sitio.
import type { Lang } from './translations';
import { SEO, SITE_URL, ogImageUrl, pathFor, type SectionId } from './routes';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function applySeo(lang: Lang, section: SectionId) {
  const seo = SEO[lang];
  const page = seo.pages[section];
  const url = SITE_URL + pathFor(lang, section);
  document.documentElement.lang = lang;
  document.title = page.title;
  setMeta('name', 'description', page.description);
  setMeta('name', 'keywords', seo.keywords);
  setLink('canonical', url);
  setLink('alternate', SITE_URL + pathFor('es', section), 'es-MX');
  setLink('alternate', SITE_URL + pathFor('en', section), 'en');
  setLink('alternate', SITE_URL + pathFor('es', section), 'x-default');
  setMeta('property', 'og:title', page.title);
  setMeta('property', 'og:description', page.description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:locale', seo.ogLocale);
  setMeta('property', 'og:image', ogImageUrl(lang));
  setMeta('name', 'twitter:title', page.title);
  setMeta('name', 'twitter:description', page.description);
  setMeta('name', 'twitter:image', ogImageUrl(lang));
}
