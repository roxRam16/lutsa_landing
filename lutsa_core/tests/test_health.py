"""Sondas de salud, cabeceras, CORS y documentación."""

from fastapi.testclient import TestClient

from tests.fakes import FakeDatabase


def test_liveness(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.headers["X-Request-ID"]


def test_readiness_up(client):
    response = client.get("/health/ready")
    assert response.status_code == 200
    assert response.json()["dependencies"] == {"mongodb": "up"}


def test_readiness_down_returns_503(make_app):
    with TestClient(make_app(database=FakeDatabase(up=False))) as client:
        response = client.get("/health/ready")
    assert response.status_code == 503
    assert response.json()["status"] == "degraded"


def test_security_headers_and_request_id_echo(client):
    response = client.get("/health", headers={"X-Request-ID": "abc-123"})
    assert response.headers["X-Request-ID"] == "abc-123"
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"


def test_not_found_is_problem_json(client):
    response = client.get("/api/v1/nada")
    assert response.status_code == 404
    assert response.headers["content-type"].startswith("application/problem+json")


def test_cors_allows_landing_origin(client):
    response = client.options(
        "/api/v1/quote-requests",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_openapi_documents_every_endpoint(client):
    spec = client.get("/openapi.json").json()
    for path, methods in spec["paths"].items():
        for method, operation in methods.items():
            assert operation.get("summary"), f"{method} {path} sin summary"
            assert operation.get("description"), f"{method} {path} sin description"
    post = spec["paths"]["/api/v1/quote-requests"]["post"]["responses"]
    assert {"201", "400", "422", "429"} <= set(post)
