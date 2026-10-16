# LUTSA Transportes — Sitio web

🇪🇸 Español · [🇺🇸 English](README.en.md)

Sitio web de **LUTSA Transportes** (transporte de carga y logística, Veracruz, México): landing de una
sola página, bilingüe (español / inglés), con navegación visual por kilómetros y un formulario de
cotización conectado a su propio API.

| | |
|---|---|
| **Frontend** | React 18 · TypeScript · Vite · Tailwind CSS (sin WordPress) |
| **Backend** | FastAPI + MongoDB, en [`lutsa_core/`](lutsa_core/README.md) |
| **Idiomas** | Español (`/es/…`) e inglés (`/en/…`) |
| **Documentación técnica** | [Hoja técnica](docs/HOJA_TECNICA.md) · [Technical sheet](docs/TECHNICAL_SHEET.en.md) |
| **Guía de estilo y mantenimiento** | [Guía de estilo](docs/GUIA_DE_ESTILO.md) · [Style guide](docs/STYLE_GUIDE.en.md) |
| **Avance del proyecto** | [`docs/LUTSA_Product_Backlog.xlsx`](docs/LUTSA_Product_Backlog.xlsx) |

## Puesta en marcha

```bash
npm install
npm run dev          # http://localhost:5173 (reenvía /api al API local, puerto 8090)
npm run build        # compila + genera una página por ruta/idioma + sitemap.xml y robots.txt
npm run preview      # sirve la carpeta dist/
npm run check        # tipos + que español e inglés tengan los mismos textos
```

Para probar el formulario hay que levantar también el API (ver [`lutsa_core/README.md`](lutsa_core/README.md)):

```bash
cd lutsa_core
venv\Scripts\activate
docker compose up -d mongo     # MongoDB en el puerto 27037
python app.py                  # API en http://localhost:8090 (Swagger en /docs)
```

Probar desde el celular con ngrok: `ngrok http 5173` (un solo túnel; Vite reenvía `/api` al API).

## Estructura

```text
src/
├── components/        Secciones (Quiénes somos, Servicios, Industrias, Ecosistema, Certificaciones, Cotización),
│                      header, barra de kilómetros y componentes del formulario (quote/)
├── hooks/             useActiveSection · useAutoFlip (tarjetas que giran solas)
├── styles/            Un CSS por sección (réplica de escritorio); lo común está en index.css
├── i18n/              translations.ts (ES/EN) · routes.ts (URLs y SEO) · seo.ts · LanguageContext.tsx
├── services/          quoteApi.ts (cliente del API)
├── App.tsx · main.tsx · index.css
public/                Imágenes optimizadas (WebP), íconos, imágenes para redes (og-image-*.jpg)
scripts/prerender.mjs  Post-build: HTML por ruta + sitemap + robots
lutsa_core/            Backend (FastAPI + MongoDB)
docs/                  Hoja técnica, backlog (Excel) y diseños de referencia (no se versionan)
```

## Idiomas y URLs

Todo el contenido vive en `src/i18n/translations.ts`, ordenado por sección (`es` y `en`). Cada sección
tiene su URL en cada idioma, definida en `src/i18n/routes.ts`:

| Sección | Español | Inglés |
|---|---|---|
| Inicio | `/es/` | `/en/` |
| Nosotros | `/es/nosotros` | `/en/about-us` |
| Servicios | `/es/servicios` | `/en/services` |
| Industrias | `/es/industrias` | `/en/industries` |
| Submarcas | `/es/submarcas` | `/en/brands` |
| Galería | `/es/galeria` | `/en/gallery` |
| Certificaciones | `/es/certificaciones` | `/en/certifications` |
| Cotización | `/es/cotizacion` | `/en/quote` |

La URL cambia sola al hacer scroll y al cambiar de idioma; al abrir una ruta directa, la página baja a
su sección. **Para agregar un texto:** añádelo en `es` y en `en`. **Para cambiar una URL o un título
de SEO:** edita `src/i18n/routes.ts`.

## SEO

- Título, metadescripción, palabras clave, `canonical`, `hreflang` (`es-MX`, `en`, `x-default`) y Open
  Graph **por sección e idioma** (`src/i18n/routes.ts`).
- `npm run build` genera un `index.html` por ruta con esos metadatos ya escritos, `sitemap.xml` y `robots.txt`.
- Datos estructurados (`Organization`, JSON-LD) en `index.html`.
- Vista previa al compartir: `public/og-image-es.jpg` y `og-image-en.jpg` (1200×630).
- Después de publicar: dar de alta el sitio en **Google Search Console** y enviar `sitemap.xml`.

## Formulario de cotización

Envía a `POST /api/v1/quote-requests` del API. Validación en el navegador y de nuevo en el API,
reCAPTCHA v2 ("No soy un robot"), límite por IP y correo al equipo comercial. Detalle y variables en
[`lutsa_core/README.md`](lutsa_core/README.md).

| Variable (Vite, se incrustan al compilar) | Para qué |
|---|---|
| `VITE_API_URL` | URL pública del API en producción (en desarrollo no hace falta) |
| `VITE_RECAPTCHA_SITE_KEY` | Clave **del sitio** de Google reCAPTCHA (por defecto, la de prueba) |

Plantilla: [`.env.example`](.env.example).

## Rendimiento

- Imágenes en **WebP**, con `loading="lazy"` en las que quedan fuera de la primera pantalla.
- Las imágenes de diseño sin uso se guardan en `archivo/` (fuera de `public/`) para no publicarlas.
- El prerender evita depender de que el navegador ejecute JavaScript para ver los metadatos.

## Pendientes conocidos

Ver el backlog (`docs/LUTSA_Product_Backlog.xlsx`). Principales: botón flotante de WhatsApp, secciones
de Galería, SMTP y reCAPTCHA reales, publicación en `lutsa.mx`.

## Historial de cambios

- **2026-10** — Rediseño completo: secciones por bocetos, responsivo, bilingüe con URLs por idioma, SEO,
  formulario conectado al API LUTSA-CORE, imágenes optimizadas.
