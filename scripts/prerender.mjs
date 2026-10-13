// Post-build: genera un index.html por ruta e idioma (/es/servicios, /en/services…) con su <title>,
// metadescripción, canonical, hreflang y Open Graph YA escritos en el HTML, más sitemap.xml y robots.txt.
// Así Google y las vistas previas de WhatsApp/LinkedIn ven los metadatos correctos sin ejecutar JavaScript.
//
//   npm run build   →   tsc -b && vite build && node scripts/prerender.mjs
import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');

// routes.ts es TypeScript: se empaqueta a un módulo temporal para reutilizar la MISMA tabla de URLs y SEO.
const tmp = join(dist, '__routes.mjs');
await build({ entryPoints: [join(root, 'src/i18n/routes.ts')], outfile: tmp, bundle: true, format: 'esm', platform: 'node', logLevel: 'silent' });
const { SEO, SITE_URL, allPaths, pathFor } = await import(pathToFileURL(tmp).href);

const template = await readFile(join(dist, 'index.html'), 'utf-8');
const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function head(lang, section) {
  const seo = SEO[lang];
  const page = seo.pages[section];
  const url = SITE_URL + pathFor(lang, section);
  const image = SITE_URL + seo.ogImage;
  return {
    url,
    replacements: [
      [/<html lang="[^"]*">/, `<html lang="${lang}">`],
      [/<title>[\s\S]*?<\/title>/, `<title>${escape(page.title)}</title>`],
      [/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escape(page.description)}" />`],
      [/<meta name="keywords" content="[^"]*" \/>/, `<meta name="keywords" content="${escape(seo.keywords)}" />`],
      [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`],
      [/<link rel="alternate" hreflang="es-MX" href="[^"]*" \/>/, `<link rel="alternate" hreflang="es-MX" href="${SITE_URL + pathFor('es', section)}" />`],
      [/<link rel="alternate" hreflang="en" href="[^"]*" \/>/, `<link rel="alternate" hreflang="en" href="${SITE_URL + pathFor('en', section)}" />`],
      [/<link rel="alternate" hreflang="x-default" href="[^"]*" \/>/, `<link rel="alternate" hreflang="x-default" href="${SITE_URL + pathFor('es', section)}" />`],
      [/<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${seo.ogLocale}" />`],
      [/<meta property="og:locale:alternate" content="[^"]*" \/>/, `<meta property="og:locale:alternate" content="${lang === 'es' ? 'en_US' : 'es_MX'}" />`],
      [/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`],
      [/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escape(page.title)}" />`],
      [/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escape(page.description)}" />`],
      [/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`],
      [/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escape(page.title)}" />`],
      [/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escape(page.description)}" />`],
      [/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`],
    ],
  };
}

const paths = allPaths();
for (const { lang, section, path } of paths) {
  const { replacements } = head(lang, section);
  let html = template;
  for (const [pattern, value] of replacements) {
    if (!pattern.test(html)) throw new Error(`prerender: no se encontró ${pattern} en index.html`);
    html = html.replace(pattern, value);
  }
  const file = join(dist, path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

// sitemap con alternativas de idioma (hreflang) por cada URL
const urls = paths.map(({ section, path }) => {
  const alt = (l, hl) => `    <xhtml:link rel="alternate" hreflang="${hl}" href="${SITE_URL + pathFor(l, section)}" />`;
  return `  <url>\n    <loc>${SITE_URL + path}</loc>\n${alt('es', 'es-MX')}\n${alt('en', 'en')}\n${alt('es', 'x-default')}\n  </url>`;
});
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
);
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// La raíz "/" lleva al idioma por defecto
await writeFile(join(dist, '_redirects'), '/            /es/   302\n/*           /index.html   200\n');
await (await import('node:fs/promises')).rm(tmp);
console.log(`prerender: ${paths.length} rutas + sitemap.xml + robots.txt`);
