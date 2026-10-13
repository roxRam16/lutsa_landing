"""Recurso `quote-requests`: solicitudes de cotización de la landing.

· `POST /quote-requests`                  🔓 pública (protegida con reCAPTCHA y límite por IP)
· `GET  /quote-requests/{id}`              🔑 interna (`X-API-Key`)
· `POST /quote-requests/{id}/notifications` 🔑 interna: (re)envía el correo al equipo comercial
"""

from fastapi import APIRouter, Depends, Request, Response, status

from src.dtos import (
    NotificationDTO,
    ProblemDetailsDTO,
    QuoteRequestCreate,
    QuoteRequestCreatedDTO,
    QuoteRequestDTO,
)
from src.routes.dependencies import ClientIpDep, QuoteServiceDep, require_api_key

router = APIRouter(prefix="/quote-requests", tags=["Quote requests"])

_PROBLEM = {"model": ProblemDetailsDTO}
_UNAUTHORIZED = {**_PROBLEM, "description": "Falta o es inválida la API key."}


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=QuoteRequestCreatedDTO,
    summary="Enviar una solicitud de cotización",
    description=(
        "Recibe el formulario de la landing. Verifica el reCAPTCHA (*No soy un robot*) y un "
        "límite de solicitudes por IP, guarda la solicitud y envía un correo al equipo "
        "comercial (`QUOTE_NOTIFICATION_EMAILS`). Si el correo falla, la solicitud igual queda "
        "guardada (`notification_status=failed`) y se puede reenviar.\n\n"
        "Los textos se limpian (sin HTML, scripts ni caracteres de control) y se acotan: nombre, "
        "empresa y página web a 150 caracteres; comentarios a 500."
    ),
    responses={
        status.HTTP_400_BAD_REQUEST: {**_PROBLEM, "description": "reCAPTCHA no válido."},
        status.HTTP_429_TOO_MANY_REQUESTS: {
            **_PROBLEM,
            "description": "Demasiadas solicitudes desde la misma IP (`Retry-After`).",
        },
    },
)
async def create_quote_request(
    payload: QuoteRequestCreate,
    request: Request,
    response: Response,
    service: QuoteServiceDep,
    ip: ClientIpDep,
) -> QuoteRequestCreatedDTO:
    created = await service.create(payload, ip=ip, user_agent=request.headers.get("user-agent"))
    response.headers["Location"] = f"{request.url.path}/{created.id}"
    return QuoteRequestCreatedDTO(
        id=created.id or "", status=created.status, created_at=created.created_at
    )


@router.get(
    "/{quote_request_id}",
    response_model=QuoteRequestDTO,
    summary="Consultar una solicitud",
    description="Devuelve una solicitud completa. Requiere la cabecera `X-API-Key`.",
    dependencies=[Depends(require_api_key)],
    responses={
        status.HTTP_401_UNAUTHORIZED: _UNAUTHORIZED,
        status.HTTP_404_NOT_FOUND: {**_PROBLEM, "description": "La solicitud no existe."},
    },
)
async def get_quote_request(quote_request_id: str, service: QuoteServiceDep) -> QuoteRequestDTO:
    found = await service.get(quote_request_id)
    return QuoteRequestDTO.model_validate(found.model_dump())


@router.post(
    "/{quote_request_id}/notifications",
    status_code=status.HTTP_201_CREATED,
    response_model=NotificationDTO,
    summary="Enviar el correo de una solicitud",
    description=(
        "Envía (o reenvía) por correo los datos de la solicitud a `QUOTE_NOTIFICATION_EMAILS`. "
        "Útil si el primer envío falló. Requiere la cabecera `X-API-Key`. "
        "Responde 201 aunque el envío falle; el resultado viene en `status`."
    ),
    dependencies=[Depends(require_api_key)],
    responses={
        status.HTTP_401_UNAUTHORIZED: _UNAUTHORIZED,
        status.HTTP_404_NOT_FOUND: {**_PROBLEM, "description": "La solicitud no existe."},
    },
)
async def send_quote_notification(
    quote_request_id: str, service: QuoteServiceDep
) -> NotificationDTO:
    return await service.send_notification(quote_request_id)
