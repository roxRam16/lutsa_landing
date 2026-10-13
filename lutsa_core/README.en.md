# LUTSA-CORE

[🇪🇸 Español](README.md) · 🇺🇸 English

Backend for the **LUTSA Transportes website**: receives the quote form, stores each request in
**MongoDB** and emails the sales team. A RESTful API built with **FastAPI (Python 3.12)**, containerized
with Docker. No frontend code lives here (the site is in the repository root).

## Quick start

Non-standard ports (8000/27017 are taken on the dev machine): **API 8090 · MongoDB 27037**.

```bash
python -m venv venv && venv\Scripts\activate
pip install -r requirements-dev.txt
copy private\.env.example private\.env.sandbox    # then edit the values
docker compose up -d mongo
python app.py                                     # http://localhost:8090/docs
```

## Endpoints (`/api/v1`)

| Method | Path | Description | Responses |
|---|---|---|---|
| POST | `/quote-requests` (public) | Submit the quote form | 201 + `Location` · 400 · 422 · 429 |
| GET | `/quote-requests/{id}` (`X-API-Key`) | Get a request | 200 · 401 · 404 |
| POST | `/quote-requests/{id}/notifications` (`X-API-Key`) | (Re)send its email | 201 · 401 · 404 |
| GET | `/health` · `/health/ready` | Probes | 200 · 503 |

`POST /quote-requests`: per-IP rate limit → reCAPTCHA check → save → email. If the email fails the request
is still stored (`notification_status=failed`) and can be resent.

## Input security

Strict types (NoSQL operator objects are rejected), unknown fields rejected, text sanitized (no HTML,
scripts, template markers or control/invisible characters), limits of 150 characters (name, company,
website, goods, volume) and 500 (comments), strict email and website validation.

## Configuration, tests and Docker

See the [Spanish README](README.md) for the full variable table. Tests: `pytest --cov` (61 tests,
~91 % coverage) and `ruff check . && ruff format --check .`. Docker: `docker compose up -d --build`.

Email: without `SMTP_HOST` the email is only written to the log and the request is marked `simulated`.
