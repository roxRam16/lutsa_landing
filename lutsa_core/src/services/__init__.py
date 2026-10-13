"""Capa de servicios (lógica de negocio) y su contenedor."""

from dataclasses import dataclass

from src.config import Settings
from src.database import Repositories
from src.services.captcha import (
    CaptchaVerifier,
    DisabledCaptchaVerifier,
    RecaptchaVerifier,
    build_captcha_verifier,
)
from src.services.email_sender import (
    Email,
    EmailSender,
    LogEmailSender,
    SmtpEmailSender,
    build_email_sender,
    build_quote_notification_email,
)
from src.services.event_logger import BridgeLogHandler, EventLogger, mask_email
from src.services.health_service import HealthService
from src.services.quote_service import QuoteService
from src.services.rate_limiter import SlidingWindowRateLimiter


@dataclass
class Services:
    """Servicios listos para inyectar en las rutas."""

    quotes: QuoteService
    events: EventLogger


def build_services(
    settings: Settings,
    repositories: Repositories,
    email_sender: EmailSender,
    captcha: CaptchaVerifier,
    events: EventLogger,
) -> Services:
    """Cablea los servicios (composition root de la capa de negocio)."""
    limiter = SlidingWindowRateLimiter(
        settings.quote_rate_limit, settings.quote_rate_window_seconds
    )
    return Services(
        quotes=QuoteService(settings, repositories, captcha, email_sender, limiter, events),
        events=events,
    )


__all__ = [
    "BridgeLogHandler",
    "CaptchaVerifier",
    "DisabledCaptchaVerifier",
    "Email",
    "EmailSender",
    "EventLogger",
    "HealthService",
    "LogEmailSender",
    "QuoteService",
    "RecaptchaVerifier",
    "Services",
    "SlidingWindowRateLimiter",
    "SmtpEmailSender",
    "build_captcha_verifier",
    "build_email_sender",
    "build_quote_notification_email",
    "build_services",
    "mask_email",
]
