# LUTSA-CORE

Backend de la **landing de LUTSA Transportes**: recibe las solicitudes de cotización del formulario,
las guarda en **MongoDB** y avisa por **correo** al equipo comercial.
API RESTful con **FastAPI (Python 3.12)**, contenerizada con Docker.

> La landing (frontend) vive en la raíz de este mismo repositorio (`lutsa_landing/`). **Este directorio
> (`lutsa_core/`) no contiene código de frontend.**

## Stack

| Capa | Tecnología |
| --- | --- |
| API | FastAPI · Uvicorn · Pydantic v2 |
| Base de datos | MongoDB (driver oficial `pymongo` asíncrono) |
| Anti-robots | Google reCAPTCHA v2 (casilla "No soy un robot") |
| Correo | SMTP (Gmail, Office 365, Amazon SES…) |
| Pruebas / calidad | pytest · pytest-cov · Ruff |
| Contenedores | Docker · Docker Compose |
| CI/CD | GitHub Actions → Amazon ECR + ECS |

## Estructura

```
lutsa_core/
├── app.py                 # Punto de entrada (Application Factory: `create_app`)
├── src/
│   ├── config/            # Settings tipadas (pydantic-settings) leídas de private/.env.<ambiente>
│   ├── database/          # DatabaseManager + repositorios (interfaces y MongoDB)
│   ├── dtos/              # Contratos de entrada/salida (validación y limpieza de textos)
│   ├── middlewares/       # Request-ID/contexto, log de acceso, seguridad HTTP y errores (RFC 9457)
│   ├── models/            # Documentos de MongoDB y catálogos (industrias, servicios…)
│   ├── routes/            # Routers HTTP + dependencias (DI)
│   └── services/          # Lógica: cotizaciones, captcha, correo, límite por IP, bitácora
├── tests/                 # Batería de pruebas
├── private/               # Variables de entorno (.env.<ambiente>) — NO versionadas
├── Dockerfile · docker-compose.yml · .dockerignore
└── requirements.txt       # Runtime          requirements-dev.txt → desarrollo/pruebas
```

El workflow de despliegue está en la raíz del repo: `.github/workflows/lutsa-core-deploy.yml`.

**Flujo de una petición:** `route` (valida con DTO) → `service` (lógica) → `repository` (persistencia).

## Puesta en marcha (local)

Puertos **no tradicionales** porque 8000/27017 ya están ocupados en el equipo: **API 8090 · MongoDB 27037**.

```bash
# 1. Entorno virtual e instalación
python -m venv venv
venv\Scripts\activate                 # Windows   (Linux/Mac: source venv/bin/activate)
pip install -r requirements-dev.txt

# 2. Variables de entorno
copy private\.env.example private\.env.sandbox     # y ajusta los valores

# 3. MongoDB en Docker (puerto 27037)
docker compose up -d mongo

# 4. API con recarga automática
python app.py                         # o: uvicorn app:create_app --factory --reload --port 8090
```

| URL | Descripción |
| --- | --- |
| http://localhost:8090/docs | **Swagger UI** |
| http://localhost:8090/redoc | ReDoc |
| http://localhost:8090/health | Liveness |
| http://localhost:8090/health/ready | Readiness (verifica MongoDB) |

La landing lee la URL del API de `VITE_API_URL` (por defecto `http://localhost:8090`).

## Endpoints

Todos bajo `/api/v1` salvo salud. 🔓 = pública · 🔑 = requiere cabecera `X-API-Key`.

| Método | Ruta | Descripción | Respuestas |
| --- | --- | --- | --- |
| POST | `/quote-requests` 🔓 | Enviar el formulario de cotización | 201 + `Location` · 400 · 422 · 429 |
| GET | `/quote-requests/{id}` 🔑 | Consultar una solicitud | 200 · 401 · 404 |
| POST | `/quote-requests/{id}/notifications` 🔑 | (Re)enviar el correo de una solicitud | 201 · 401 · 404 |
| GET | `/health` · `/health/ready` | Sondas de salud | 200 · 503 |

### `POST /api/v1/quote-requests`

1. **Límite por IP** (`QUOTE_RATE_LIMIT` en `QUOTE_RATE_WINDOW_SECONDS`): si se excede → 429 con `Retry-After`.
2. **reCAPTCHA**: el token del widget se verifica con Google; si no es válido → 400 `captcha_failed`.
3. **Guarda** la solicitud en `quote_requests`.
4. **Correo** a `QUOTE_NOTIFICATION_EMAILS` con todos los datos (y `Reply-To` = correo del cliente,
   para contestarle directo). Si el correo falla, la solicitud **igual queda guardada**
   (`notification_status=failed`) y se puede reenviar con el endpoint de notificaciones.

Campos obligatorios: `full_name`, `email`, `industry`, `service`, `operation_type`, `captcha_token`.
Los catálogos se envían como **claves** (no como texto en español/inglés):

| Campo | Claves |
| --- | --- |
| `industry` | `industrial` `food` `refrigerated` `automotive` `mining` `agrochemical` `steel` `manufacturing` `other` |
| `service` | `national_transport` `regional_transport` `containerized_cargo` `loose_cargo` `refrigerated` `storage_cross_dock` `handling` `other` |
| `operation_type` | `import` `export` `domestic` |
| `customs_office` | `veracruz` `manzanillo` `lazaro_cardenas` `altamira` `other` |
| `importer_registry` | `yes` `no` `in_process` |

## Seguridad de entradas

- **Tipos estrictos:** un JSON como `{"email": {"$ne": ""}}` se rechaza (422) → sin inyección NoSQL.
  Campos desconocidos también se rechazan (`extra="forbid"`).
- **Limpieza:** se normaliza Unicode, se quitan caracteres de control e invisibles y se colapsan espacios.
- **Sin marcado ni código:** se rechazan `< >`, `javascript:`, `data:text`, `onerror=`… y plantillas (`${…}`, `{{…}}`).
- **Longitudes:** nombre, empresa, página web, mercancía y volumen ≤ 150; comentarios ≤ 500.
- **Nombre:** solo letras (cualquier idioma), espacios, apóstrofes, puntos y guiones.
- **Correo:** RFC + patrón estricto, en minúsculas. **Página web:** solo `http/https`, dominio real,
  sin usuario/contraseña (`empresa.com` → `https://empresa.com`).
- **Cuerpo** > 64 KB → 413. Cabeceras de seguridad y CSP en toda respuesta; HSTS en producción.
- El correo al equipo **escapa** todos los valores en su versión HTML.

## Correo (SMTP)

Sin `SMTP_HOST` el correo **no sale**: solo se escribe en el log y la solicitud queda con
`notification_status=simulated`. Para que llegue de verdad con Gmail:

1. Activa la verificación en 2 pasos de la cuenta y crea una **contraseña de aplicación**
   (https://myaccount.google.com/apppasswords).
2. En `private/.env.sandbox`: `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USERNAME=<cuenta>`,
   `SMTP_PASSWORD=<contraseña de aplicación>`, `SMTP_FROM=LUTSA Landing <cuenta>`.
3. Reinicia el API.

## reCAPTCHA

En sandbox se usan las **claves de prueba públicas de Google** (la casilla siempre aprueba). El token debe
venir del widget: un texto inventado se rechaza. En producción crea claves reales (v2 casilla) en
https://www.google.com/recaptcha/admin: la *clave secreta* va en `RECAPTCHA_SECRET_KEY` y la *clave del
sitio* en la landing (`VITE_RECAPTCHA_SITE_KEY`). La configuración **no arranca en producción** con la
clave de prueba.

## Configuración

Variables en `private/.env.<ambiente>` (elige con `APP_ENV`, por defecto `sandbox`). Las variables del
sistema **tienen prioridad**. Plantilla: [private/.env.example](private/.env.example).

| Variable | Descripción | Por defecto |
| --- | --- | --- |
| `APP_ENV` · `API_PORT` | `sandbox` / `production` · puerto del API | `sandbox` · `8090` |
| `MONGODB_URI` · `MONGODB_DB` | Conexión y base del ambiente | `mongodb://localhost:27037` · `lutsa_sandbox` |
| `MONGODB_LOGS_DB` · `LOG_RETENTION_DAYS` | Base de la bitácora (separada) · días que se conserva | `lutsa_logs_sandbox` · `30` |
| `CORS_ORIGINS` | Orígenes de la landing (coma) | `http://localhost:5173` |
| `QUOTE_NOTIFICATION_EMAILS` | Quién recibe cada solicitud (coma) | — |
| `QUOTE_RATE_LIMIT` · `QUOTE_RATE_WINDOW_SECONDS` | Límite por IP | `5` · `600` |
| `ADMIN_API_KEY` | Llave de los endpoints internos (≥ 32 caracteres) | — (cerrados) |
| `CAPTCHA_ENABLED` · `RECAPTCHA_SECRET_KEY` | reCAPTCHA v2 | `true` · clave de prueba |
| `SMTP_HOST` · `SMTP_PORT` · `SMTP_USERNAME` · `SMTP_PASSWORD` · `SMTP_FROM` · `SMTP_USE_TLS` | Correo saliente | sin host = solo log |
| `MAX_REQUEST_BODY_BYTES` · `DOCS_ENABLED` | Tamaño máximo del cuerpo · Swagger | `65536` · `true` |

## Bitácora

Cada evento relevante se guarda en una base aparte (`MONGODB_LOGS_DB`) con módulo, nivel, `request_id` e IP:
arranque, conexión a MongoDB, cada petición (`http.request`), solicitudes recibidas (`quotes.created`),
correos enviados/simulados/fallidos, captcha rechazado, límite excedido y API key rechazada. **Nunca** se
guardan cuerpos ni secretos; los correos se enmascaran (`a***@dominio.com`). Un índice TTL borra lo viejo.

## Patrones de diseño aplicados

| Patrón | Dónde |
| --- | --- |
| Application Factory | `create_app()` en `app.py` |
| Inyección de dependencias | `src/routes/dependencies.py` (`Depends`) |
| Capas (Route → Service → Repository) | `routes/` · `services/` · `database/` |
| Repository | `QuoteRequestRepository` (interfaz) + Mongo + doble en memoria |
| Strategy | `EmailSender` (SMTP / log) · `CaptchaVerifier` (Google / desactivado) |
| Singleton | `get_settings()` (cacheada) |
| Chain of Responsibility | middlewares (Request-ID, seguridad, tamaño, log de acceso, CORS) |

## Pruebas

```bash
pytest                       # unitarias: sin MongoDB, SMTP ni Google (dobles en memoria)
pytest --cov                 # con cobertura (mínimo 80 %; hoy ~91 %)
pytest -m integration        # contra MongoDB real (MONGODB_URI, por defecto :27037)
ruff check . && ruff format --check .
```

## Docker

```bash
docker compose up -d --build     # API (:8090) + MongoDB (:27037)
docker compose down              # detiene (los datos persisten en el volumen)

docker build -t lutsa-core .
docker run --rm -p 8090:8090 --env-file private/.env.sandbox lutsa-core
```

La imagen usa `python:3.12-slim`, corre como usuario sin privilegios e incluye `HEALTHCHECK` sobre `/health`.

## Reglas del proyecto

1. **README actualizado en cada despliegue de cambios.**
2. Clean code, patrones de diseño, código documentado y reutilización.
3. Tests antes de desplegar; cobertura ≥ 80 %.
4. Nada de frontend en `lutsa_core/`.

## Historial de cambios

### 0.1.0 — Solicitudes de cotización
- Estructura modular `config / database / dtos / middlewares / models / routes / services` con el
  estándar de los backends (RFC 9457, `X-Request-ID`, bitácora en base aparte, Swagger completo).
- `POST /api/v1/quote-requests`: validación y limpieza estricta, reCAPTCHA v2, límite por IP, guardado
  en MongoDB y correo al equipo comercial.
- Endpoints internos con `X-API-Key`: consultar una solicitud y (re)enviar su correo.
- Docker (API 8090 + MongoDB 27037), workflow de despliegue y 61 pruebas (~91 % de cobertura).
