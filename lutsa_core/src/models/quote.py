"""Solicitudes de cotización (colección `quote_requests`).

Los campos de selección guardan una CLAVE estable (no el texto que ve el usuario): así la
landing puede mostrarlos en español o inglés y la base no depende del idioma.
"""

from enum import StrEnum
from typing import Literal

from pydantic import ConfigDict

from src.models.base import BaseDocument


class Industry(StrEnum):
    INDUSTRIAL = "industrial"
    FOOD = "food"
    REFRIGERATED = "refrigerated"
    AUTOMOTIVE = "automotive"
    MINING = "mining"
    AGROCHEMICAL = "agrochemical"
    STEEL = "steel"
    MANUFACTURING = "manufacturing"
    OTHER = "other"


class Service(StrEnum):
    NATIONAL_TRANSPORT = "national_transport"
    REGIONAL_TRANSPORT = "regional_transport"
    CONTAINERIZED_CARGO = "containerized_cargo"
    LOOSE_CARGO = "loose_cargo"
    REFRIGERATED = "refrigerated"
    STORAGE_CROSS_DOCK = "storage_cross_dock"
    HANDLING = "handling"
    OTHER = "other"


class OperationType(StrEnum):
    IMPORT = "import"
    EXPORT = "export"
    DOMESTIC = "domestic"


class CustomsOffice(StrEnum):
    VERACRUZ = "veracruz"
    MANZANILLO = "manzanillo"
    LAZARO_CARDENAS = "lazaro_cardenas"
    ALTAMIRA = "altamira"
    OTHER = "other"


class ImporterRegistry(StrEnum):
    YES = "yes"
    NO = "no"
    IN_PROCESS = "in_process"


# Etiquetas en español para el correo de notificación (lo lee el equipo comercial).
# Una sola tabla para todos los catálogos: las claves no se repiten entre ellos salvo
# `refrigerated` y `other`, que significan lo mismo en ambos.
LABELS_ES: dict[str, str] = {
    "industrial": "Industrial",
    "food": "Alimenticio",
    "refrigerated": "Refrigerado",
    "automotive": "Automotriz",
    "mining": "Minería",
    "agrochemical": "Agroquímico",
    "steel": "Acero",
    "manufacturing": "Manufactura",
    "other": "Otro",
    "national_transport": "Transporte nacional",
    "regional_transport": "Transporte regional",
    "containerized_cargo": "Carga contenerizada",
    "loose_cargo": "Carga suelta",
    "storage_cross_dock": "Almacenaje y cross dock",
    "handling": "Maniobras",
    "import": "Importación",
    "export": "Exportación",
    "domestic": "Nacional",
    "veracruz": "Veracruz",
    "manzanillo": "Manzanillo",
    "lazaro_cardenas": "Lázaro Cárdenas",
    "altamira": "Altamira",
    "yes": "Sí",
    "no": "No",
    "in_process": "En trámite",
}

QuoteStatus = Literal["new", "contacted", "closed"]
NotificationStatus = Literal["pending", "sent", "simulated", "failed"]


class QuoteRequestDocument(BaseDocument):
    """Una solicitud de cotización enviada desde la landing."""

    # Los catálogos se guardan como texto plano en MongoDB.
    model_config = ConfigDict(populate_by_name=True, use_enum_values=True)

    full_name: str
    email: str
    company: str | None = None
    website: str | None = None
    industry: Industry
    service: Service
    operation_type: OperationType
    customs_office: CustomsOffice | None = None
    goods_type: str | None = None
    monthly_volume: str | None = None
    importer_registry: ImporterRegistry | None = None
    comments: str | None = None
    language: Literal["es", "en"] = "es"
    status: QuoteStatus = "new"
    # Estado del correo al equipo comercial y su último error (si falló).
    notification_status: NotificationStatus = "pending"
    notification_error: str | None = None
    # Origen técnico (para detectar abusos); nunca se expone en la API pública.
    ip: str | None = None
    user_agent: str | None = None
