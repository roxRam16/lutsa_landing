"""Entradas maliciosas o fuera de rango: siempre 422 y nada se guarda."""

import pytest

from tests.conftest import valid_payload

URL = "/api/v1/quote-requests"
ZERO_WIDTH_SPACE = chr(0x200B)


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("full_name", "<script>alert(1)</script>"),
        ("full_name", "A" * 151),
        ("full_name", "Robert); DROP TABLE--"),
        ("full_name", "1234"),
        ("full_name", {"$ne": ""}),
        ("email", "no-es-correo"),
        ("email", "ana@empresa"),
        ("email", '"a b"@empresa.com'),
        ("email", {"$gt": ""}),
        ("company", "E" * 151),
        ("company", "<b>Empresa</b>"),
        ("company", "Empresa onerror=alert(1)"),
        ("website", "javascript:alert(1)"),
        ("website", "ftp://empresa.com"),
        ("website", "https://usuario:clave@empresa.com"),
        ("website", "w" * 147 + ".com"),
        ("website", "no es una url"),
        ("comments", "x" * 501),
        ("comments", "Hola <img src=x onerror=alert(1)>"),
        ("comments", "${7*7}"),
        ("goods_type", "g" * 151),
        ("industry", "aviacion"),
        ("operation_type", "transit"),
        ("importer_registry", "maybe"),
        ("language", "fr"),
    ],
)
def test_rejects_invalid_values(client, repositories, field, value):
    response = client.post(URL, json=valid_payload(**{field: value}))
    assert response.status_code == 422, (field, value, response.text)
    assert response.headers["content-type"].startswith("application/problem+json")
    assert repositories.quote_requests.items == {}


def test_rejects_unknown_fields(client):
    response = client.post(URL, json=valid_payload(status="closed"))
    assert response.status_code == 422


def test_cleans_whitespace_and_invisible_characters(client, repositories):
    response = client.post(
        URL,
        json=valid_payload(
            full_name=f"  Ana {ZERO_WIDTH_SPACE}  Pérez  ",
            email="  ANA@Empresa.COM ",
            comments="Línea 1\r\n   Línea   2 ",
        ),
    )
    assert response.status_code == 201, response.text
    saved = repositories.quote_requests.items[response.json()["id"]]
    assert saved["full_name"] == "Ana Pérez"
    assert saved["email"] == "ana@empresa.com"
    assert saved["comments"] == "Línea 1\nLínea 2"


def test_limits_are_inclusive(client):
    payload = valid_payload(
        full_name="A" * 150, company="E" * 150, comments="c" * 500, goods_type="g" * 150
    )
    assert client.post(URL, json=payload).status_code == 201


def test_body_too_large_returns_413(client):
    response = client.post(URL, content=b"x" * 70_000, headers={"Content-Type": "application/json"})
    assert response.status_code == 413
