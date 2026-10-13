"""Envío de correos (patrón Strategy).

`EmailSender` es el contrato. Implementaciones:
  · `SmtpEmailSender`: envía de verdad por SMTP (Gmail, Office 365, Amazon SES…).
  · `LogEmailSender`: solo escribe el correo en el log (desarrollo sin credenciales).
`build_email_sender` elige según la configuración (`SMTP_HOST`).
"""

import asyncio
import html
import logging
import smtplib
import ssl
from dataclasses import dataclass
from email.message import EmailMessage
from email.utils import make_msgid
from typing import Protocol

from src.config import Settings
from src.models import LABELS_ES, QuoteRequestDocument

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class Email:
    """Un correo listo para enviar."""

    to: list[str]
    subject: str
    text: str
    html: str | None = None
    reply_to: str | None = None


class EmailSender(Protocol):
    async def send(self, email: Email) -> None:
        """Envía el correo. Lanza una excepción si no se pudo entregar al servidor."""


class LogEmailSender:
    """Registra el correo en el log en lugar de enviarlo."""

    # El servicio marca la solicitud como `simulated` (no `sent`): el correo NO salió.
    simulated = True

    async def send(self, email: Email) -> None:
        logger.info(
            "[EMAIL simulado] Para: %s | Asunto: %s\n%s",
            ", ".join(email.to),
            email.subject,
            email.text,
        )


class SmtpEmailSender:
    """Envío por SMTP. `smtplib` es bloqueante: corre en un hilo para no frenar la API."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    async def send(self, email: Email) -> None:
        await asyncio.to_thread(self._send_blocking, self._build(email))

    def _build(self, email: Email) -> EmailMessage:
        message = EmailMessage()
        message["From"] = self._settings.smtp_from
        message["To"] = ", ".join(email.to)
        message["Subject"] = email.subject
        message["Message-ID"] = make_msgid(domain="lutsa.mx")
        if email.reply_to:
            message["Reply-To"] = email.reply_to
        message.set_content(email.text)
        if email.html:
            message.add_alternative(email.html, subtype="html")
        return message

    def _send_blocking(self, message: EmailMessage) -> None:
        s = self._settings
        context = ssl.create_default_context()
        if s.smtp_port == 465:
            server: smtplib.SMTP = smtplib.SMTP_SSL(
                s.smtp_host or "", s.smtp_port, timeout=s.smtp_timeout_seconds, context=context
            )
        else:
            server = smtplib.SMTP(s.smtp_host or "", s.smtp_port, timeout=s.smtp_timeout_seconds)
        with server:
            if s.smtp_port != 465 and s.smtp_use_tls:
                server.starttls(context=context)
            if s.smtp_username and s.smtp_password:
                server.login(s.smtp_username, s.smtp_password)
            server.send_message(message)


def build_email_sender(settings: Settings) -> EmailSender:
    """SMTP si hay servidor configurado; si no, el correo solo se escribe en el log."""
    if settings.smtp_host:
        return SmtpEmailSender(settings)
    logger.warning("SMTP_HOST no está configurado: los correos solo se escribirán en el log")
    return LogEmailSender()


def _label(value: object) -> str:
    if value is None or value == "":
        return "—"
    key = getattr(value, "value", value)
    return LABELS_ES.get(str(key), str(key))


def build_quote_notification_email(request: QuoteRequestDocument, recipients: list[str]) -> Email:
    """Correo al equipo comercial con los datos de una solicitud de cotización.

    Todos los valores se escapan para el HTML (aunque ya llegan sin marcado desde los DTOs).
    """
    rows = [
        ("Nombre", request.full_name),
        ("Correo", request.email),
        ("Empresa", request.company),
        ("Página web", request.website),
        ("Industria", _label(request.industry)),
        ("Servicio solicitado", _label(request.service)),
        ("Tipo de operación", _label(request.operation_type)),
        ("Aduana", _label(request.customs_office)),
        ("Tipo de mercancía", request.goods_type),
        ("Volumen mensual", request.monthly_volume),
        ("Padrón de importadores", _label(request.importer_registry)),
        ("Comentarios", request.comments),
        ("Idioma del formulario", "Inglés" if request.language == "en" else "Español"),
        ("Folio", request.id),
    ]
    subject = f"Nueva solicitud de cotización — {request.full_name}"
    if request.company:
        subject += f" ({request.company})"
    text = "Se recibió una solicitud de cotización desde la landing de LUTSA.\n\n" + "\n".join(
        f"{label}: {value or '—'}" for label, value in rows
    )
    cells = "".join(
        f'<tr><td style="padding:6px 12px;color:#555;white-space:nowrap;vertical-align:top">'
        f"{html.escape(label)}</td>"
        f'<td style="padding:6px 12px;color:#10227f;white-space:pre-wrap">'
        f"{html.escape(str(value or '—'))}</td></tr>"
        for label, value in rows
    )
    body = (
        '<div style="font-family:Arial,sans-serif;font-size:14px">'
        '<h2 style="color:#e66600;margin:0 0 12px">Nueva solicitud de cotización</h2>'
        f'<table style="border-collapse:collapse">{cells}</table>'
        '<p style="color:#888;font-size:12px">'
        "Responde a este correo para contestarle al cliente.</p>"
        "</div>"
    )
    return Email(to=recipients, subject=subject, text=text, html=body, reply_to=request.email)
