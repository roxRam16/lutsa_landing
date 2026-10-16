# Hoja técnica — LUTSA Transportes (sitio web + API)

🇪🇸 Español · [🇺🇸 English](TECHNICAL_SHEET.en.md)

Documento para quien reciba, despliegue o mantenga el proyecto.

## 1. Resumen

| | |
|---|---|
| Tipo | Sitio de una sola página (SPA) bilingüe + API propia |
| Frontend | React 18.3 · TypeScript 5 · Vite 6 · Tailwind CSS 3 |
| Backend | Python 3.12 · FastAPI · Pydantic v2 · MongoDB (pymongo asíncrono) |
| Contenedores | Docker / Docker Compose (solo el API) |
| Sin | WordPress, CMS ni librerías de UI de terceros |

## 2. Arquitectura

```
Navegador ──► Landing estática (dist/) ──► POST /api/v1/quote-requests ──► API LUTSA-CORE ──► MongoDB
                                                                      │
                                                                      ├─► Google reCAPTCHA (verificación)
                                                                      └─► Servidor SMTP (correo al equipo comercial)
```

- **Landing:** archivos estáticos (HTML/CSS/JS/imágenes). Se publica en cualquier hosting estático
  (Netlify, Vercel, S3 + CloudFront, Nginx…). `public/_redirects` trae la regla para Netlify.
- **API:** servicio aparte en contenedor. Es el único que habla con MongoDB, Google y el correo.
- La landing **nunca** se conecta directo a la base de datos.

## 3. Requisitos

| Herramienta | Versión |
|---|---|
| Node.js | 20 o superior |
| Python | 3.12 |
| Docker | 24 o superior (para MongoDB / API en contenedor) |

## 4. Variables de entorno

**Landing** (`.env`, se incrustan al compilar; plantilla `.env.example`):

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL pública del API (ej. `https://api.lutsa.mx`). Solo en producción |
| `VITE_RECAPTCHA_SITE_KEY` | Clave **del sitio** de Google reCAPTCHA v2 |

**API** (`lutsa_core/private/.env.<ambiente>`, nunca se versiona; plantilla `private/.env.example`):

| Variable | Descripción |
|---|---|
| `APP_ENV` | `sandbox` o `production` |
| `API_PORT` | Puerto del API (8090) |
| `MONGODB_URI` · `MONGODB_DB` · `MONGODB_LOGS_DB` | Conexión y bases (negocio y bitácora separadas) |
| `CORS_ORIGINS` | Orígenes permitidos (dominio de la landing). Sin `*` en producción |
| `QUOTE_NOTIFICATION_EMAILS` | Quién recibe las cotizaciones (coma) |
| `QUOTE_RATE_LIMIT` · `QUOTE_RATE_WINDOW_SECONDS` | Límite por IP (5 por 10 min) |
| `ADMIN_API_KEY` | Llave de los endpoints internos (≥ 32 caracteres) |
| `CAPTCHA_ENABLED` · `RECAPTCHA_SECRET_KEY` | reCAPTCHA (clave **secreta**) |
| `SMTP_HOST` · `SMTP_PORT` · `SMTP_USERNAME` · `SMTP_PASSWORD` · `SMTP_FROM` | Correo saliente |

En producción el API **se niega a arrancar** con la clave de prueba de reCAPTCHA o con CORS `*`.

## 5. Despliegue

**Landing**
1. `npm ci && npm run build` con `VITE_API_URL` y `VITE_RECAPTCHA_SITE_KEY` definidas.
2. Publicar la carpeta `dist/` (ya incluye una página por ruta e idioma, `sitemap.xml` y `robots.txt`).
3. El hosting debe responder `index.html` a rutas desconocidas (`/*  /index.html  200`).

**API**
1. `cd lutsa_core && docker build -t lutsa-core .`
2. Ejecutar con las variables de entorno (o `--env-file`); exponer el puerto 8090 detrás de HTTPS.
3. Si hay un balanceador/proxy, el contenedor ya arranca con `--proxy-headers` (necesario para el límite por IP).
4. Sondas: `GET /health` (vivo) y `GET /health/ready` (verifica MongoDB).

El flujo automatizado está en `.github/workflows/lutsa-core-deploy.yml` (manual, hacia ECR + ECS; requiere
configurar AWS).

## 6. Después de publicar

- [ ] Verificar `https://lutsa.mx/sitemap.xml` y `robots.txt`.
- [ ] Dar de alta el dominio en **Google Search Console** y enviar el sitemap.
- [ ] Probar el formulario de punta a punta (correo recibido, registro en MongoDB).
- [ ] Revisar la vista previa al compartir (WhatsApp, LinkedIn) y medir con Lighthouse.

## 7. Mantenimiento

| Tarea | Dónde |
|---|---|
| Cambiar un texto | `src/i18n/translations.ts` (en `es` **y** `en`) |
| Cambiar URLs o títulos de SEO | `src/i18n/routes.ts` |
| Opciones de las listas del formulario | `translations.ts` (`quote.options`) **y** catálogos del API (`lutsa_core/src/models/quote.py`) — deben coincidir |
| Destinatarios del correo | `QUOTE_NOTIFICATION_EMAILS` |
| Consultar una solicitud / reenviar su correo | `GET /api/v1/quote-requests/{id}` y `POST …/{id}/notifications` con `X-API-Key` |
| Ver qué pasó en el API | Colección `logs` de la base de bitácora (módulos `quotes`, `security`, `http`) |

## 8. Seguridad (resumen)

- Entradas validadas con tipos estrictos y limpiadas (sin HTML/scripts, sin operadores de MongoDB).
- reCAPTCHA + límite por IP en el formulario; endpoints internos protegidos por `X-API-Key`.
- Errores RFC 9457, cabeceras de seguridad, límite de tamaño de cuerpo, HSTS en producción.
- Secretos solo en `private/` (ignorado por git y Docker).

## 9. Pruebas

```bash
cd lutsa_core
pytest --cov          # 61 pruebas, cobertura mínima 80 % (hoy ~91 %)
ruff check . && ruff format --check .
```

## 10. Pendientes y limitaciones conocidas

- Botón flotante de WhatsApp (requiere número oficial).
- Sección de **Galería**: aún es un marcador.
- El contenido se pinta con JavaScript; los metadatos sí están prerenderizados por ruta. Si Search Console
  pide el contenido en el HTML, se migraría a prerender completo o SSR.
- SMTP y claves reales de reCAPTCHA pendientes de configurar.
- El correo al equipo comercial se redacta siempre en español.
