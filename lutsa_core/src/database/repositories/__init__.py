"""Repositorios de datos y su contenedor.

`Repositories` agrupa los repositorios que usan los servicios. En producción se construye
sobre MongoDB (`build_mongo_repositories`); en pruebas se inyecta uno en memoria.
"""

from dataclasses import dataclass

from pymongo.asynchronous.database import AsyncDatabase

from src.database.repositories.interfaces import LogRepository, QuoteRequestRepository
from src.database.repositories.mongo import MongoLogRepository, MongoQuoteRequestRepository


@dataclass
class Repositories:
    quote_requests: QuoteRequestRepository

    async def ensure_indexes(self) -> None:
        """Crea los índices de los repositorios que los necesitan (idempotente)."""
        ensure = getattr(self.quote_requests, "ensure_indexes", None)
        if ensure is not None:
            await ensure()


def build_mongo_repositories(db: AsyncDatabase) -> Repositories:
    """Repositorios reales sobre la base de datos `db`."""
    return Repositories(quote_requests=MongoQuoteRequestRepository(db))


__all__ = [
    "LogRepository",
    "MongoLogRepository",
    "MongoQuoteRequestRepository",
    "QuoteRequestRepository",
    "Repositories",
    "build_mongo_repositories",
]
