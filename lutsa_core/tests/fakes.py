"""Dobles de prueba en memoria: misma interfaz que los reales, sin servicios externos."""

from typing import Any

from src.database import Repositories
from src.models import LogEntry, QuoteRequestDocument, new_id, utc_now
from src.services import Email


class InMemoryQuoteRequestRepository:
    def __init__(self) -> None:
        self.items: dict[str, dict[str, Any]] = {}

    async def create(self, request: QuoteRequestDocument) -> QuoteRequestDocument:
        request.id = request.id or new_id()
        self.items[request.id] = request.model_dump(by_alias=True)
        return request

    async def get(self, request_id: str) -> QuoteRequestDocument | None:
        data = self.items.get(request_id)
        return QuoteRequestDocument.model_validate(data) if data else None

    async def update(self, request_id: str, changes: dict[str, Any]) -> QuoteRequestDocument | None:
        if request_id not in self.items:
            return None
        self.items[request_id].update({**changes, "updated_at": utc_now()})
        return QuoteRequestDocument.model_validate(self.items[request_id])


def build_in_memory_repositories() -> Repositories:
    return Repositories(quote_requests=InMemoryQuoteRequestRepository())


class OutboxEmailSender:
    """Guarda los correos "enviados" para inspeccionarlos; puede simular fallas."""

    def __init__(self, fail: bool = False) -> None:
        self.sent: list[Email] = []
        self.fail = fail

    async def send(self, email: Email) -> None:
        if self.fail:
            raise ConnectionError("SMTP caído")
        self.sent.append(email)


class FakeCaptcha:
    """Aprueba cualquier token salvo `invalid`."""

    def __init__(self) -> None:
        self.calls: list[tuple[str, str | None]] = []

    async def verify(self, token: str, remote_ip: str | None) -> bool:
        self.calls.append((token, remote_ip))
        return token != "invalid"


class FakeDatabase:
    """Doble de `DatabaseManager`: permite simular Mongo arriba o caído."""

    def __init__(self, up: bool = True) -> None:
        self.up = up
        self.closed = False

    async def ping(self) -> bool:
        return self.up

    async def close(self) -> None:
        self.closed = True


class InMemoryLogRepository:
    def __init__(self) -> None:
        self.entries: list[LogEntry] = []

    async def insert_many(self, entries: list[LogEntry]) -> None:
        self.entries.extend(entries)

    def events(self) -> list[str]:
        return [entry.event for entry in self.entries]
