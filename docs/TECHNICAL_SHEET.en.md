# Technical sheet — LUTSA Transportes (website + API)

[🇪🇸 Español](HOJA_TECNICA.md) · 🇺🇸 English

For whoever receives, deploys or maintains the project.

## 1. Summary

| | |
|---|---|
| Type | Bilingual single-page site (SPA) + its own API |
| Frontend | React 18.3 · TypeScript 5 · Vite 6 · Tailwind CSS 3 |
| Backend | Python 3.12 · FastAPI · Pydantic v2 · MongoDB (async pymongo) |
| Containers | Docker / Docker Compose (API only) |
| Without | WordPress, a CMS or third-party UI libraries |

## 2. Architecture

```
Browser ──► Static landing (dist/) ──► POST /api/v1/quote-requests ──► LUTSA-CORE API ──► MongoDB
                                                                   │
                                                                   ├─► Google reCAPTCHA (verification)
                                                                   └─► SMTP server (email to the sales team)
```

- **Landing:** static files (HTML/CSS/JS/images), hostable on any static host (Netlify, Vercel,
  S3 + CloudFront, Nginx…). `public/_redirects` carries the Netlify rule.
- **API:** a separate containerized service. It is the only one that talks to MongoDB, Google and email.
- The landing **never** connects to the database directly.

## 3. Requirements

| Tool | Version |
|---|---|
| Node.js | 20 or later |
| Python | 3.12 |
| Docker | 24 or later (for MongoDB / containerized API) |

## 4. Environment variables

**Landing** (`.env`, embedded at build time; template `.env.example`):

| Variable | Description |
|---|---|
| `VITE_API_URL` | Public API URL (e.g. `https://api.lutsa.mx`). Production only |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v2 **site** key |

**API** (`lutsa_core/private/.env.<environment>`, never versioned; template `private/.env.example`):

| Variable | Description |
|---|---|
| `APP_ENV` | `sandbox` or `production` |
| `API_PORT` | API port (8090) |
| `MONGODB_URI` · `MONGODB_DB` · `MONGODB_LOGS_DB` | Connection and databases (business and log data kept apart) |
| `CORS_ORIGINS` | Allowed origins (the landing's domain). No `*` in production |
| `QUOTE_NOTIFICATION_EMAILS` | Who receives quote requests (comma-separated) |
| `QUOTE_RATE_LIMIT` · `QUOTE_RATE_WINDOW_SECONDS` | Per-IP limit (5 per 10 min) |
| `ADMIN_API_KEY` | Key for internal endpoints (≥ 32 characters) |
| `CAPTCHA_ENABLED` · `RECAPTCHA_SECRET_KEY` | reCAPTCHA (**secret** key) |
| `SMTP_HOST` · `SMTP_PORT` · `SMTP_USERNAME` · `SMTP_PASSWORD` · `SMTP_FROM` | Outgoing email |

In production the API **refuses to start** with the reCAPTCHA test key or with CORS `*`.

## 5. Deployment

**Landing**
1. `npm ci && npm run build` with `VITE_API_URL` and `VITE_RECAPTCHA_SITE_KEY` set.
2. Publish the `dist/` folder (it already contains one page per route and language, `sitemap.xml` and `robots.txt`).
3. The host must answer `index.html` for unknown routes (`/*  /index.html  200`).

**API**
1. `cd lutsa_core && docker build -t lutsa-core .`
2. Run it with the environment variables (or `--env-file`); expose port 8090 behind HTTPS.
3. Behind a load balancer/proxy the container already starts with `--proxy-headers` (required for the per-IP limit).
4. Probes: `GET /health` (alive) and `GET /health/ready` (checks MongoDB).

The automated flow is in `.github/workflows/lutsa-core-deploy.yml` (manual, to ECR + ECS; AWS must be configured).

## 6. After publishing

- [ ] Check `https://lutsa.mx/sitemap.xml` and `robots.txt`.
- [ ] Register the domain in **Google Search Console** and submit the sitemap.
- [ ] Test the form end to end (email received, record in MongoDB).
- [ ] Check the share preview (WhatsApp, LinkedIn) and measure with Lighthouse.

## 7. Maintenance

| Task | Where |
|---|---|
| Change a text | `src/i18n/translations.ts` (in both `es` **and** `en`) |
| Change URLs or SEO titles | `src/i18n/routes.ts` |
| Change a brand color | `tailwind.config.js` → `colors.brand` (single source) |
| Adjust a section's desktop design | `src/styles/<section>.css`; mobile and tablet live in the component's classes |
| Verify before delivering | `npm run check` (types + same es/en content) · full guide: [STYLE_GUIDE.en.md](STYLE_GUIDE.en.md) |
| Form dropdown options | `translations.ts` (`quote.options`) **and** the API catalogs (`lutsa_core/src/models/quote.py`) — they must match |
| Email recipients | `QUOTE_NOTIFICATION_EMAILS` |
| Look up a request / resend its email | `GET /api/v1/quote-requests/{id}` and `POST …/{id}/notifications` with `X-API-Key` |
| See what happened in the API | `logs` collection of the log database (modules `quotes`, `security`, `http`) |

## 8. Security (summary)

- Inputs validated with strict types and sanitized (no HTML/scripts, no MongoDB operators).
- reCAPTCHA + per-IP rate limit on the form; internal endpoints protected by `X-API-Key`.
- RFC 9457 errors, security headers, body-size limit, HSTS in production.
- Secrets only in `private/` (ignored by git and Docker).

## 9. Tests

```bash
cd lutsa_core
pytest --cov          # 61 tests, minimum coverage 80 % (currently ~91 %)
ruff check . && ruff format --check .
```

## 10. Known pending items and limitations

- Floating WhatsApp button (needs the official number).
- **Gallery** section: still a placeholder.
- Content is painted with JavaScript; metadata is prerendered per route. If Search Console requires the
  content in the HTML, the site would move to full prerendering or SSR.
- Real SMTP and reCAPTCHA keys still to be configured.
- The email to the sales team is always written in Spanish.
