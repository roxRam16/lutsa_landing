"""Contratos de los repositorios (patrón Repository).

Los servicios dependen de estos `Protocol`, no de MongoDB: así se pueden probar con
implementaciones en memoria (tests/fakes.py) y el almacenamiento es intercambiable.
"""

from typing import Any, Protocol

from src.models import LogEntry, QuoteRequestDocument


class QuoteRequestRepository(Protocol):
    async def create(self, request: QuoteRequestDocument) -> QuoteRequestDocument:
        """Inserta la solicitud y devuelve el documento con su `_id`."""

    async def get(self, request_id: str) -> QuoteRequestDocument | None: ...

    async def update(self, request_id: str, changes: dict[str, Any]) -> QuoteRequestDocument | None:
        """Aplica `changes` (y `updated_at`). `None` si no existe."""


class LogRepository(Protocol):
    """Bitácora (base de datos de logs, separada de la de negocio)."""

    async def insert_many(self, entries: list[LogEntry]) -> None: ...
