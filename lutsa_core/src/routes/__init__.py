"""Enrutado de la API.

Estándar RESTful:
  · Versionado en la URL: `/api/v1/...` (un cambio incompatible crea `/api/v2`).
  · Recursos en sustantivos (`/quote-requests`), verbos HTTP para las acciones y códigos de
    estado correctos (201 + Location, 400/401/404/422/429).
  · Errores en `application/problem+json` (RFC 9457) con un `code` estable.
"""

from fastapi import APIRouter, status

from src.dtos import ProblemDetailsDTO
from src.routes import health, quote_requests

# Respuestas de error comunes documentadas en Swagger para todos los endpoints de negocio.
_COMMON_ERRORS = {
    status.HTTP_422_UNPROCESSABLE_CONTENT: {
        "model": ProblemDetailsDTO,
        "description": "Validation Error",
    },
    status.HTTP_500_INTERNAL_SERVER_ERROR: {
        "model": ProblemDetailsDTO,
        "description": "Internal Server Error",
    },
}

api_v1_router = APIRouter(prefix="/api/v1", responses=_COMMON_ERRORS)
api_v1_router.include_router(quote_requests.router)

health_router = health.router

__all__ = ["api_v1_router", "health_router"]
