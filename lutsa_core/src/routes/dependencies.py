"""Proveedores de dependencias (Inyección de Dependencias de FastAPI).

Las rutas piden servicios con `Depends(...)`; nunca los construyen. Los recursos
compartidos (settings, base de datos, servicios) viven en `app.state`, creados en
`create_app`, lo que permite reemplazarlos limpiamente en las pruebas.
"""

import hmac
from typing import Annotated

from fastapi import Depends, Request, Security
from fastapi.security import APIKeyHeader

from src.config import Settings
from src.database import DatabaseManager
from src.services import HealthService, QuoteService, Services
from src.services.errors import AuthenticationError

_api_key_header = APIKeyHeader(
    name="X-API-Key",
    auto_error=False,
    description="Llave interna de LUTSA (`ADMIN_API_KEY`) para consultar y reenviar solicitudes.",
)


def get_app_settings(request: Request) -> Settings:
    return request.app.state.settings


def get_database(request: Request) -> DatabaseManager:
    return request.app.state.database


def get_services(request: Request) -> Services:
    return request.app.state.services


SettingsDep = Annotated[Settings, Depends(get_app_settings)]
ServicesDep = Annotated[Services, Depends(get_services)]


def get_health_service(
    settings: SettingsDep, database: Annotated[DatabaseManager, Depends(get_database)]
) -> HealthService:
    return HealthService(settings, database)


def get_quote_service(services: ServicesDep) -> QuoteService:
    return services.quotes


HealthServiceDep = Annotated[HealthService, Depends(get_health_service)]
QuoteServiceDep = Annotated[QuoteService, Depends(get_quote_service)]


def client_ip(request: Request) -> str | None:
    """IP del cliente. Detrás de un proxy, Uvicorn la toma de `X-Forwarded-For`
    (opción `--proxy-headers`)."""
    return request.client.host if request.client else None


ClientIpDep = Annotated[str | None, Depends(client_ip)]


async def require_api_key(
    settings: SettingsDep,
    services: ServicesDep,
    api_key: Annotated[str | None, Security(_api_key_header)],
) -> None:
    """Protege los endpoints internos con `X-API-Key` (comparación en tiempo constante)."""
    expected = settings.admin_api_key
    if not expected or not api_key or not hmac.compare_digest(api_key, expected):
        services.events.warning("security", "security.api_key_rejected", "API key rechazada")
        raise AuthenticationError("Llave de API inválida o ausente.", code="invalid_api_key")
