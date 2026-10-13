"""Integración con MongoDB real (`pytest -m integration`).

Usa `MONGODB_URI` del ambiente (por defecto el Mongo de docker compose en el puerto 27037)
y bases temporales que se borran al terminar.
"""

import os

import pytest

from src.database import DatabaseManager, MongoLogRepository
from src.database.repositories.mongo import MongoQuoteRequestRepository
from src.models import LogEntry, QuoteRequestDocument

pytestmark = [pytest.mark.integration, pytest.mark.anyio]

URI = os.getenv("MONGODB_URI", "mongodb://localhost:27037")
DB = "lutsa_test_integration"


@pytest.fixture
async def database():
    manager = DatabaseManager(URI, DB, 3000, f"{DB}_logs")
    if not await manager.ping():
        pytest.skip(f"MongoDB no disponible en {URI}")
    yield manager
    await manager._client.drop_database(DB)
    await manager._client.drop_database(f"{DB}_logs")
    await manager.close()


async def test_quote_repository_roundtrip(database):
    repo = MongoQuoteRequestRepository(database.db)
    await repo.ensure_indexes()
    created = await repo.create(
        QuoteRequestDocument(
            full_name="Ana",
            email="ana@x.com",
            industry="food",
            service="handling",
            operation_type="import",
        )
    )
    found = await repo.get(created.id or "")
    assert found is not None
    assert found.industry == "food"
    updated = await repo.update(created.id or "", {"notification_status": "sent"})
    assert updated is not None
    assert updated.notification_status == "sent"
    assert await repo.get("no-existe") is None


async def test_log_repository_insert(database):
    repo = MongoLogRepository(database.logs_db, 1)
    await repo.ensure_indexes()
    entry = LogEntry(
        level="INFO", service="core", module="t", event="t.e", message="m", environment="sandbox"
    )
    await repo.insert_many([entry])
    assert await database.logs_db["logs"].count_documents({}) == 1
