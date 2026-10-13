"""DTOs del recurso `quote-requests` (solicitudes de cotización)."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from src.dtos.common import (
    CaptchaToken,
    Comments,
    CompanyName,
    EmailAddress,
    PersonName,
    ShortText,
    Website,
)
from src.models import CustomsOffice, ImporterRegistry, Industry, OperationType, Service


class QuoteRequestCreate(BaseModel):
    """Lo que envía el formulario de la landing."""

    # `extra="forbid"`: un campo inesperado (p. ej. `status` o `$where`) se rechaza con 422.
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "example": {
                "full_name": "Ana Pérez López",
                "email": "ana.perez@empresa.com",
                "company": "Empresa S.A. de C.V.",
                "website": "www.empresa.com",
                "industry": "automotive",
                "service": "national_transport",
                "operation_type": "import",
                "customs_office": "veracruz",
                "goods_type": "Autopartes",
                "monthly_volume": "20 contenedores",
                "importer_registry": "yes",
                "comments": "Necesitamos cotizar traslados semanales.",
                "language": "es",
                "captcha_token": "03AFcWeA…",
            }
        },
    )

    full_name: PersonName = Field(description="Nombre completo (2-150, solo letras).")
    email: EmailAddress = Field(description="Correo de contacto.")
    company: CompanyName | None = Field(default=None, description="Empresa (máx. 150).")
    website: Website | None = Field(default=None, description="Página web (máx. 150).")
    industry: Industry
    service: Service
    operation_type: OperationType
    customs_office: CustomsOffice | None = None
    goods_type: ShortText | None = Field(default=None, description="Tipo de mercancía.")
    monthly_volume: ShortText | None = Field(default=None, description="Volumen mensual.")
    importer_registry: ImporterRegistry | None = None
    comments: Comments | None = Field(default=None, description="Comentarios (máx. 500).")
    language: Literal["es", "en"] = "es"
    captcha_token: CaptchaToken = Field(description="Token del reCAPTCHA (no soy un robot).")


class QuoteRequestCreatedDTO(BaseModel):
    """Acuse de recibo (no repite los datos personales enviados)."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "9f1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
                "status": "new",
                "created_at": "2026-10-13T12:00:00Z",
            }
        }
    )

    id: str
    status: Literal["new", "contacted", "closed"]
    created_at: datetime


class QuoteRequestDTO(BaseModel):
    """Solicitud completa (solo para el equipo de LUTSA, con API key)."""

    id: str
    full_name: str
    email: str
    company: str | None
    website: str | None
    industry: Industry
    service: Service
    operation_type: OperationType
    customs_office: CustomsOffice | None
    goods_type: str | None
    monthly_volume: str | None
    importer_registry: ImporterRegistry | None
    comments: str | None
    language: Literal["es", "en"]
    status: Literal["new", "contacted", "closed"]
    notification_status: Literal["pending", "sent", "simulated", "failed"]
    created_at: datetime
    updated_at: datetime


class NotificationDTO(BaseModel):
    """Resultado de enviar (o reenviar) el correo de una solicitud."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "quote_request_id": "9f1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
                "status": "sent",
                "recipients": 1,
            }
        }
    )

    quote_request_id: str
    status: Literal["sent", "simulated", "failed"] = Field(
        description="`simulated`: sin SMTP configurado, el correo solo se escribió en el log."
    )
    recipients: int = Field(description="Cuántos destinatarios se intentaron.")
