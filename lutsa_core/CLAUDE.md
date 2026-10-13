# LUTSA-CORE (backend)

Backend FastAPI + MongoDB de la landing de LUTSA Transportes. La landing (frontend) vive en la raíz del
mismo repo (`lutsa_landing/`). **Nunca mezclar código de frontend en `lutsa_core/`.**

## Comandos (Windows, usar el `venv` de `lutsa_core/`)

```bash
venv/Scripts/python.exe -m pytest --cov        # pruebas (cobertura mínima 80 %)
venv/Scripts/python.exe -m ruff check . && venv/Scripts/python.exe -m ruff format --check .
docker compose up -d mongo                     # MongoDB local en el puerto 27037
python app.py                                  # API en :8090 (Swagger en /docs). Usa `uvicorn app:create_app --factory`
```

## Estructura obligatoria

`app.py` (NO `main.py`) · `private/` con los `.env.<sandbox|production>` · `src/` modularizado en `config`,
`database`, `dtos`, `middlewares`, `models`, `routes`, `services` · `tests/` · workflow en
`../.github/workflows/lutsa-core-deploy.yml` · `.gitignore` y `.dockerignore` · `Dockerfile` · `README.md`.

## Reglas

- **API RESTful estricta:** `/api/v1`, recursos en sustantivos, códigos HTTP correctos, errores
  `application/problem+json` (RFC 9457) con `code` estable (`DomainError` en `src/services/errors.py`).
- **Swagger obligatorio:** todo endpoint con `summary`, `description`, `response_model` y errores documentados.
- Rutas sin lógica: `route` → `service` → `repository` (interfaz en `src/database/repositories/interfaces.py`).
- **Entradas:** todo texto entra por los tipos de `dtos/common.py`; nunca `str` sin restricciones en un DTO.
- **Bitácora:** `self._events.info("modulo", "modulo.accion", "Mensaje", **detalles)`; nunca cuerpos,
  secretos ni correos completos (usar `mask_email`).
- Endpoints internos con `Depends(require_api_key)` (cabecera `X-API-Key`).
- `.env` solo en `private/` (ignorado por git y Docker). Puertos: API 8090 · MongoDB 27037.
- Tests antes de desplegar (dobles en `tests/fakes.py`; integración con marca `integration`).
- **Actualizar el README en cada despliegue** (incluida la sección "Historial de cambios").
