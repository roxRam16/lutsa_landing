"""Piezas sueltas: límite por IP, correo, captcha y configuración."""

import pytest

from src.config import Settings
from src.config.settings import RECAPTCHA_TEST_SECRET
from src.models import QuoteRequestDocument
from src.services import (
    DisabledCaptchaVerifier,
    LogEmailSender,
    RecaptchaVerifier,
    SlidingWindowRateLimiter,
    SmtpEmailSender,
    build_captcha_verifier,
    build_email_sender,
    build_quote_notification_email,
)


def _request(**overrides) -> QuoteRequestDocument:
    data = {
        "_id": "abc",
        "full_name": "Ana",
        "email": "ana@x.com",
        "industry": "food",
        "service": "handling",
        "operation_type": "domestic",
    }
    data.update(overrides)
    return QuoteRequestDocument(**data)


def test_rate_limiter_window():
    now = [0.0]
    limiter = SlidingWindowRateLimiter(2, 60, clock=lambda: now[0])
    assert limiter.hit("ip") is None
    assert limiter.hit("ip") is None
    assert limiter.hit("ip") == 61
    assert limiter.hit("otra") is None
    now[0] = 61
    assert limiter.hit("ip") is None


def test_notification_email_escapes_html():
    email = build_quote_notification_email(_request(company="A & B"), ["v@x.com"])
    assert "A &amp; B" in (email.html or "")
    assert "Alimenticio" in email.text
    assert "Maniobras" in email.text
    assert "Nacional" in email.text
    assert "(A & B)" in email.subject


def test_email_sender_selection():
    assert isinstance(build_email_sender(Settings(_env_file=None)), LogEmailSender)
    smtp = build_email_sender(Settings(_env_file=None, smtp_host="smtp.gmail.com"))
    assert isinstance(smtp, SmtpEmailSender)


def test_smtp_message_headers():
    sender = SmtpEmailSender(Settings(_env_file=None, smtp_host="smtp.x", smtp_from="L <n@l.mx>"))
    message = sender._build(build_quote_notification_email(_request(), ["a@x.com", "b@x.com"]))
    assert message["To"] == "a@x.com, b@x.com"
    assert message["Reply-To"] == "ana@x.com"
    assert message.is_multipart()


@pytest.mark.anyio
async def test_log_email_sender_does_not_fail():
    await LogEmailSender().send(build_quote_notification_email(_request(), ["a@x.com"]))


def test_captcha_selection():
    assert isinstance(build_captcha_verifier(Settings(_env_file=None)), RecaptchaVerifier)
    disabled = build_captcha_verifier(Settings(_env_file=None, captcha_enabled=False))
    assert isinstance(disabled, DisabledCaptchaVerifier)


@pytest.mark.anyio
async def test_recaptcha_network_error_is_rejected():
    verifier = RecaptchaVerifier(
        Settings(_env_file=None, recaptcha_verify_url="http://127.0.0.1:9/no-existe")
    )
    assert await verifier.verify("token", None) is False


@pytest.mark.anyio
async def test_disabled_captcha_accepts():
    assert await DisabledCaptchaVerifier().verify("x", None) is True


def test_lists_from_comma_separated_env():
    settings = Settings(
        _env_file=None, cors_origins="http://a, http://b", quote_notification_emails="x@y.com"
    )
    assert settings.cors_origins == ["http://a", "http://b"]
    assert settings.quote_notification_emails == ["x@y.com"]


def test_production_rejects_test_captcha_secret_and_open_cors():
    with pytest.raises(ValueError, match="RECAPTCHA"):
        Settings(_env_file=None, app_env="production", recaptcha_secret_key=RECAPTCHA_TEST_SECRET)
    with pytest.raises(ValueError, match="CORS"):
        Settings(_env_file=None, app_env="production", cors_origins="*", captcha_enabled=False)
