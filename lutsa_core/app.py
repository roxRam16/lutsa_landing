"""Punto de entrada de LUTSA-CORE (FastAPI).

    uvicorn app:create_app --factory --reload --port 8090     (o simplemente: python app.py)

Swagger UI: http://localhost:8090/docs · ReDoc: /redoc · OpenAPI: /openapi.json
"""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import Settings, get_settings
from src.database import (
    DatabaseManager,
    LogRepository,
    MongoLogRepository,
    Repositories,
    build_mongo_repositories,
)
from src.middlewares import (
    REQUEST_ID_HEADER,
    AccessLogMiddleware,
    BodySizeLimitMiddleware,
    RequestIdMiddleware,
    SecurityHeadersMiddleware,
    register_exception_handlers,
)
from src.routes import api_v1_router, health_router
from src.services import (
    BridgeLogHandler,
    CaptchaVerifier,
    EmailSender,
    EventLogger,
    build_captcha_verifier,
    build_email_sender,
    build_services,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)

API_DESCRIPTION = """
API de **LUTSA-CORE**: backend de la landing de LUTSA Transportes.

* Contrato RESTful versionado bajo `/api/v1`.
* **Solicitudes de cotización** del formulario de la landing: validación estricta, reCAPTCHA
  (*No soy un robot*), límite por IP, guardado en MongoDB y aviso por correo.
* Endpoints internos protegidos con la cabecera `X-API-Key` (botón **Authorize**).
* **Bitácora** de lo que ocurre en una base de datos aparte.
* Errores en formato *Problem Details* (RFC 9457) con un `code` estable.
* Sondas de salud en `/health` (liveness) y `/health/ready` (readiness).
"""

TAGS_METADATA = [
    {"name": "Quote requests", "description": "Solicitudes de cotización de la landing."},
    {"name": "Health", "description": "Sondas de salud para balanceador, ECS y Docker."},
]


async def _prepare_data(
    settings: Settings,
    repositories: Repositories,
    log_repository: LogRepository,
    events: EventLogger,
    database: DatabaseManager,
) -> None:
    """Conexión e índices; todo queda en la bitácora.
    Un fallo no impide arrancar (`/health/ready` reportará la base de datos caída)."""
    try:
        if await database.ping():
            events.info(
                "database",
                "database.connected",
                "MongoDB conectada",
                database=settings.mongodb_db,
                logs_database=settings.mongodb_logs_db,
            )
        else:
            events.error(
                "database",
                "database.unreachable",
                "MongoDB no responde al arrancar",
                database=settings.mongodb_db,
            )
        await repositories.ensure_indexes()
        ensure_log_indexes = getattr(log_repository, "ensure_indexes", None)
        if ensure_log_indexes is not None:
            await ensure_log_indexes()
        events.info("database", "database.indexes_ready", "Índices verificados")
    except Exception as error:
        logger.exception("No se pudieron preparar los datos iniciales (¿MongoDB disponible?)")
        events.error(
            "system",
            "system.startup_data_failed",
            "No se prepararon los datos iniciales",
            error=str(error),
        )


def create_app(
    settings: Settings | None = None,
    database: DatabaseManager | None = None,
    repositories: Repositories | None = None,
    email_sender: EmailSender | None = None,
    captcha: CaptchaVerifier | None = None,
    log_repository: LogRepository | None = None,
) -> FastAPI:
    """Application Factory: construye la app con dependencias inyectables.

    Args:
        settings: configuración; por defecto la del ambiente (`private/.env.<APP_ENV>`).
        database: manager de MongoDB; por defecto se crea uno con `settings`.
        repositories: repositorios de datos; por defecto los de MongoDB sobre `database`.
        email_sender: envío de correos; por defecto SMTP (o solo log si no hay `SMTP_HOST`).
        captcha: verificación reCAPTCHA; por defecto Google (o desactivada por configuración).
        log_repository: bitácora; por defecto la base de datos de logs de MongoDB.
    Las pruebas inyectan dobles en memoria para no depender de servicios reales.
    """
    settings = settings or get_settings()
    database = database or DatabaseManager(
        settings.mongodb_uri,
        settings.mongodb_db,
        settings.mongodb_timeout_ms,
        settings.mongodb_logs_db,
    )
    repositories = repositories or build_mongo_repositories(database.db)
    log_repository = log_repository or MongoLogRepository(
        database.logs_db, settings.log_retention_days
    )
    events = EventLogger(
        log_repository,
        service=settings.service_name,
        environment=settings.app_env,
        min_level=settings.log_min_level,
        flush_interval=settings.log_flush_interval_seconds,
    )
    services = build_services(
        settings,
        repositories,
        email_sender or build_email_sender(settings),
        captcha or build_captcha_verifier(settings),
        events,
    )

    @asynccontextmanager
    async def lifespan(_: FastAPI) -> AsyncIterator[None]:
        await events.start()
        bridge = BridgeLogHandler(events)  # avisos/errores de Python también a la bitácora
        logging.getLogger().addHandler(bridge)
        events.info(
            "system",
            "system.startup",
            f"{settings.app_name} iniciando",
            version=settings.app_version,
            environment=settings.app_env,
        )
        await _prepare_data(settings, repositories, log_repository, events, database)
        yield
        events.info("system", "system.shutdown", f"{settings.app_name} apagándose")
        logging.getLogger().removeHandler(bridge)
        await events.stop()
        await database.close()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=API_DESCRIPTION,
        openapi_tags=TAGS_METADATA,
        docs_url="/docs" if settings.docs_enabled else None,
        redoc_url="/redoc" if settings.docs_enabled else None,
        openapi_url="/openapi.json" if settings.docs_enabled else None,
        lifespan=lifespan,
    )
    app.state.settings = settings
    app.state.database = database
    app.state.services = services
    app.state.events = events

    # add_middleware: el PRIMERO queda más adentro y el ÚLTIMO más afuera.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.explicit_cors_origins,
        allow_credentials=False,  # la landing no usa cookies
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "X-Request-ID", "X-API-Key"],
        expose_headers=[REQUEST_ID_HEADER, "Location", "Retry-After"],
    )
    app.add_middleware(BodySizeLimitMiddleware, max_bytes=settings.max_request_body_bytes)
    app.add_middleware(AccessLogMiddleware, events=events)
    app.add_middleware(SecurityHeadersMiddleware, hsts=settings.hsts)
    app.add_middleware(RequestIdMiddleware)  # la más externa: todo lleva id y contexto
    register_exception_handlers(app)

    app.include_router(health_router)
    app.include_router(api_v1_router)
    return app


if __name__ == "__main__":
    port = get_settings().api_port
    uvicorn.run("app:create_app", factory=True, host="0.0.0.0", port=port, reload=True)  # noqa: S104
