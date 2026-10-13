"""Implementaciones de los repositorios sobre MongoDB (driver `pymongo` asíncrono).

Convenciones:
  · `_id` es un `str` (UUID hex), generado aquí al insertar. Sin ObjectId → sin conversiones.
  · Los datos de entrada ya llegan validados y limpios desde los DTOs; aquí jamás se arma una
    consulta con texto del usuario (solo se busca por `_id`).
"""

from typing import Any

from pymongo import DESCENDING, ReturnDocument
from pymongo.asynchronous.collection import AsyncCollection
from pymongo.asynchronous.database import AsyncDatabase

from src.models import LogEntry, QuoteRequestDocument, new_id, utc_now


def _dump(model: Any) -> dict[str, Any]:
    """Modelo → documento Mongo (con `_id`, enums como texto)."""
    return model.model_dump(by_alias=True, mode="python")


class MongoQuoteRequestRepository:
    def __init__(self, db: AsyncDatabase) -> None:
        self._collection: AsyncCollection = db["quote_requests"]

    async def ensure_indexes(self) -> None:
        await self._collection.create_index([("created_at", DESCENDING)])
        await self._collection.create_index("email")
        await self._collection.create_index("status")

    async def create(self, request: QuoteRequestDocument) -> QuoteRequestDocument:
        request.id = request.id or new_id()
        await self._collection.insert_one(_dump(request))
        return request

    async def get(self, request_id: str) -> QuoteRequestDocument | None:
        document = await self._collection.find_one({"_id": request_id})
        return QuoteRequestDocument.model_validate(document) if document else None

    async def update(self, request_id: str, changes: dict[str, Any]) -> QuoteRequestDocument | None:
        document = await self._collection.find_one_and_update(
            {"_id": request_id},
            {"$set": {**changes, "updated_at": utc_now()}},
            return_document=ReturnDocument.AFTER,
        )
        return QuoteRequestDocument.model_validate(document) if document else None


class MongoLogRepository:
    """Bitácora en la base de datos de logs. Un índice TTL borra los eventos viejos solo."""

    def __init__(self, db: AsyncDatabase, retention_days: int = 30) -> None:
        self._collection: AsyncCollection = db["logs"]
        self._retention_seconds = retention_days * 24 * 3600

    async def ensure_indexes(self) -> None:
        for keys in (
            [("module", 1), ("timestamp", -1)],
            [("level", 1), ("timestamp", -1)],
            [("request_id", 1)],
            [("event", 1)],
        ):
            await self._collection.create_index(keys)
        await self._collection.create_index("timestamp", expireAfterSeconds=self._retention_seconds)

    async def insert_many(self, entries: list[LogEntry]) -> None:
        if entries:
            await self._collection.insert_many(
                [entry.model_dump(by_alias=True) for entry in entries], ordered=False
            )
