# LUTSA Transportes — Website

[🇪🇸 Español](README.md) · 🇺🇸 English

Website for **LUTSA Transportes** (freight transportation and logistics, Veracruz, Mexico): a
single-page, bilingual (Spanish / English) site with a visual kilometer-based navigation and a quote
form connected to its own API.

| | |
|---|---|
| **Frontend** | React 18 · TypeScript · Vite · Tailwind CSS (no WordPress) |
| **Backend** | FastAPI + MongoDB, in [`lutsa_core/`](lutsa_core/README.en.md) |
| **Languages** | Spanish (`/es/…`) and English (`/en/…`) |
| **Technical documentation** | [Technical sheet](docs/TECHNICAL_SHEET.en.md) · [Hoja técnica](docs/HOJA_TECNICA.md) |
| **Project progress** | [`docs/LUTSA_Product_Backlog.xlsx`](docs/LUTSA_Product_Backlog.xlsx) |

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173 (proxies /api to the local API on port 8090)
npm run build        # compiles + generates one page per route/language + sitemap.xml and robots.txt
npm run preview      # serves the dist/ folder
```

To try the quote form you also need the API (see [`lutsa_core/README.en.md`](lutsa_core/README.en.md)):

```bash
cd lutsa_core
venv\Scripts\activate
docker compose up -d mongo     # MongoDB on port 27037
python app.py                  # API at http://localhost:8090 (Swagger at /docs)
```

To test from a phone with ngrok: `ngrok http 5173` (a single tunnel; Vite proxies `/api` to the API).

## Structure

```text
src/
├── components/        Sections (About, Services, Industries, Ecosystem, Quote),
│                      header, kilometer bar and form components (quote/)
├── hooks/             useActiveSection · useAutoFlip (self-flipping cards)
├── i18n/              translations.ts (ES/EN) · routes.ts (URLs and SEO) · seo.ts · LanguageContext.tsx
├── services/          quoteApi.ts (API client)
├── App.tsx · main.tsx · index.css
public/                Optimized images (WebP), icons, social preview images (og-image-*.jpg)
scripts/prerender.mjs  Post-build: HTML per route + sitemap + robots
lutsa_core/            Backend (FastAPI + MongoDB)
docs/                  Technical sheet, backlog (Excel) and design references (not versioned)
```

## Languages and URLs

All content lives in `src/i18n/translations.ts`, grouped by section (`es` and `en`). Each section has
its own URL per language, defined in `src/i18n/routes.ts` (e.g. `/es/servicios` ⇄ `/en/services`).

The URL updates on scroll and when switching language; opening a direct route scrolls to its section.
**To add a text:** add it to both `es` and `en`. **To change a URL or an SEO title:** edit
`src/i18n/routes.ts`.

## SEO

- Title, meta description, keywords, `canonical`, `hreflang` (`es-MX`, `en`, `x-default`) and Open Graph
  **per section and language**.
- `npm run build` writes one `index.html` per route with those tags already in place, plus
  `sitemap.xml` and `robots.txt`.
- Structured data (`Organization`, JSON-LD) in `index.html`.
- Social preview: `public/og-image-es.jpg` and `og-image-en.jpg` (1200×630).
- After publishing: register the site in **Google Search Console** and submit `sitemap.xml`.

## Quote form

Posts to the API's `POST /api/v1/quote-requests`. Validation in the browser and again in the API,
reCAPTCHA v2 ("I'm not a robot"), per-IP rate limit and an email to the sales team. Details and
variables in [`lutsa_core/README.en.md`](lutsa_core/README.en.md).

| Variable (Vite, embedded at build time) | Purpose |
|---|---|
| `VITE_API_URL` | Public API URL in production (not needed in development) |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA **site** key (defaults to Google's test key) |

Template: [`.env.example`](.env.example).

## Performance

- Images in **WebP**, with `loading="lazy"` for everything below the first screen.
- Unused design images are kept in `archivo/` (outside `public/`) so they are not published.
- Prerendering means metadata does not depend on the browser running JavaScript.

## Known pending items

See the backlog (`docs/LUTSA_Product_Backlog.xlsx`). Main ones: floating WhatsApp button, Gallery and
Certifications sections, real SMTP and reCAPTCHA, publishing on `lutsa.mx`.
