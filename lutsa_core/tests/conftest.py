"""Fixtures compartidas. Las pruebas unitarias NO requieren MongoDB, SMTP ni Google."""

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app import create_app
from src.config import Settings
from tests.fakes import (
    FakeCaptcha,
    FakeDatabase,
    InMemoryLogRepository,
    OutboxEmailSender,
    build_in_memory_repositories,
)

API_KEY = "llave-interna-de-pruebas-de-al-menos-32-caracteres"
NOTIFY_TO = "ventas@example.com"


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture
def settings() -> Settings:
    return Settings(
        _env_file=None,  # type: ignore[call-arg]
        app_name="LUTSA-CORE",
        app_env="sandbox",
        app_version="9.9.9",
        cors_origins=["http://localhost:5173"],
        quote_notification_emails=[NOTIFY_TO],
        admin_api_key=API_KEY,
        quote_rate_limit=3,
        log_flush_interval_seconds=0,  # la bitácora se escribe al instante en las pruebas
    )


@pytest.fixture
def database() -> FakeDatabase:
    return FakeDatabase(up=True)


@pytest.fixture
def repositories():
    return build_in_memory_repositories()


@pytest.fixture
def log_repository() -> InMemoryLogRepository:
    return InMemoryLogRepository()


@pytest.fixture
def outbox() -> OutboxEmailSender:
    return OutboxEmailSender()


@pytest.fixture
def captcha() -> FakeCaptcha:
    return FakeCaptcha()


@pytest.fixture
def make_app(settings, database, repositories, outbox, captcha, log_repository):
    """Fábrica de apps con dobles en memoria; cada argumento puede sobrescribirse."""

    def factory(**overrides) -> FastAPI:
        options = {
            "settings": settings,
            "database": database,
            "repositories": repositories,
            "email_sender": outbox,
            "captcha": captcha,
            "log_repository": log_repository,
        }
        return create_app(**{**options, **overrides})  # type: ignore[arg-type]

    return factory


@pytest.fixture
def client(make_app):
    with TestClient(make_app()) as test_client:
        yield test_client


@pytest.fixture
def flush_logs(client):
    def flush() -> None:
        client.portal.call(client.app.state.events.flush)

    return flush


def valid_payload(**overrides) -> dict:
    payload = {
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
        "captcha_token": "token-valido",
    }
    payload.update(overrides)
    return payload
