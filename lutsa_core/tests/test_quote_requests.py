"""Flujo del recurso `quote-requests`."""

from fastapi.testclient import TestClient

from src.services import LogEmailSender
from tests.conftest import API_KEY, NOTIFY_TO, valid_payload
from tests.fakes import OutboxEmailSender

URL = "/api/v1/quote-requests"
REQUIRED = {"full_name", "email", "industry", "service", "operation_type", "captcha_token"}


def test_create_returns_201_with_location_and_saves(client, repositories):
    response = client.post(URL, json=valid_payload())
    assert response.status_code == 201, response.text
    body = response.json()
    assert body["status"] == "new"
    assert response.headers["Location"] == f"{URL}/{body['id']}"
    saved = repositories.quote_requests.items[body["id"]]
    assert saved["email"] == "ana.perez@empresa.com"
    assert saved["website"] == "https://www.empresa.com"
    assert saved["industry"] == "automotive"
    assert "captcha_token" not in saved
    # el acuse NO devuelve datos personales
    assert "email" not in body and "full_name" not in body


def test_create_sends_notification_email(client, outbox, repositories):
    body = client.post(URL, json=valid_payload()).json()
    assert len(outbox.sent) == 1
    email = outbox.sent[0]
    assert email.to == [NOTIFY_TO]
    assert email.reply_to == "ana.perez@empresa.com"
    assert "Ana Pérez López" in email.subject
    assert "Automotriz" in email.text
    assert "Importación" in email.text
    assert "Sí" in email.text
    assert repositories.quote_requests.items[body["id"]]["notification_status"] == "sent"


def test_minimal_payload_only_required_fields(client):
    payload = {k: v for k, v in valid_payload().items() if k in REQUIRED}
    assert client.post(URL, json=payload).status_code == 201


def test_email_failure_still_saves_request(make_app, repositories):
    with TestClient(make_app(email_sender=OutboxEmailSender(fail=True))) as client:
        response = client.post(URL, json=valid_payload())
    assert response.status_code == 201
    saved = repositories.quote_requests.items[response.json()["id"]]
    assert saved["notification_status"] == "failed"
    assert saved["notification_error"] == "ConnectionError"


def test_no_recipients_marks_notification_failed(make_app, settings, repositories, outbox):
    settings.quote_notification_emails = []
    with TestClient(make_app(settings=settings)) as client:
        response = client.post(URL, json=valid_payload())
    assert response.status_code == 201
    assert outbox.sent == []
    saved = repositories.quote_requests.items[response.json()["id"]]
    assert saved["notification_status"] == "failed"


def test_invalid_captcha_returns_400(client, repositories):
    response = client.post(URL, json=valid_payload(captcha_token="invalid"))
    assert response.status_code == 400
    assert response.headers["content-type"].startswith("application/problem+json")
    assert response.json()["code"] == "captcha_failed"
    assert repositories.quote_requests.items == {}


def test_missing_captcha_returns_422(client):
    payload = valid_payload()
    del payload["captcha_token"]
    assert client.post(URL, json=payload).status_code == 422


def test_rate_limit_per_ip_returns_429_with_retry_after(client):
    for _ in range(3):
        assert client.post(URL, json=valid_payload()).status_code == 201
    response = client.post(URL, json=valid_payload())
    assert response.status_code == 429
    assert response.json()["code"] == "rate_limited"
    assert int(response.headers["Retry-After"]) > 0


def test_get_requires_api_key(client):
    created = client.post(URL, json=valid_payload()).json()
    assert client.get(f"{URL}/{created['id']}").status_code == 401
    wrong = client.get(f"{URL}/{created['id']}", headers={"X-API-Key": "x" * 40})
    assert wrong.status_code == 401
    assert wrong.json()["code"] == "invalid_api_key"


def test_get_with_api_key(client):
    created = client.post(URL, json=valid_payload()).json()
    response = client.get(f"{URL}/{created['id']}", headers={"X-API-Key": API_KEY})
    assert response.status_code == 200
    body = response.json()
    assert body["full_name"] == "Ana Pérez López"
    assert body["notification_status"] == "sent"
    assert "ip" not in body
    assert "user_agent" not in body


def test_get_unknown_returns_404(client):
    response = client.get(f"{URL}/no-existe", headers={"X-API-Key": API_KEY})
    assert response.status_code == 404
    assert response.json()["code"] == "quote_request_not_found"


def test_resend_notification(client, outbox):
    created = client.post(URL, json=valid_payload()).json()
    response = client.post(f"{URL}/{created['id']}/notifications", headers={"X-API-Key": API_KEY})
    assert response.status_code == 201
    assert response.json() == {
        "quote_request_id": created["id"],
        "status": "sent",
        "recipients": 1,
    }
    assert len(outbox.sent) == 2


def test_admin_endpoints_closed_without_configured_key(make_app, settings):
    settings.admin_api_key = None
    with TestClient(make_app(settings=settings)) as client:
        response = client.get(f"{URL}/abc", headers={"X-API-Key": API_KEY})
    assert response.status_code == 401


def test_events_are_logged_without_personal_data(client, log_repository, flush_logs):
    client.post(URL, json=valid_payload())
    flush_logs()
    events = log_repository.events()
    assert "quotes.created" in events
    assert "quotes.notification_sent" in events
    created = next(e for e in log_repository.entries if e.event == "quotes.created")
    assert created.details["email"] == "a***@empresa.com"


def test_without_smtp_notification_is_marked_simulated(make_app, repositories):
    with TestClient(make_app(email_sender=LogEmailSender())) as client:
        response = client.post(URL, json=valid_payload())
    saved = repositories.quote_requests.items[response.json()["id"]]
    assert saved["notification_status"] == "simulated"
