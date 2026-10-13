"""Lógica de negocio de las solicitudes de cotización."""

from src.config import Settings
from src.database import Repositories
from src.dtos import NotificationDTO, QuoteRequestCreate
from src.models import QuoteRequestDocument
from src.services.captcha import CaptchaVerifier
from src.services.email_sender import EmailSender, build_quote_notification_email
from src.services.errors import BadRequestError, NotFoundError, TooManyAttemptsError
from src.services.event_logger import EventLogger, mask_email
from src.services.rate_limiter import SlidingWindowRateLimiter


class QuoteService:
    """Recibe solicitudes de la landing, las guarda y avisa por correo al equipo comercial."""

    def __init__(
        self,
        settings: Settings,
        repositories: Repositories,
        captcha: CaptchaVerifier,
        email_sender: EmailSender,
        rate_limiter: SlidingWindowRateLimiter,
        events: EventLogger,
    ) -> None:
        self._settings = settings
        self._repo = repositories.quote_requests
        self._captcha = captcha
        self._email = email_sender
        self._limiter = rate_limiter
        self._events = events

    async def create(
        self, payload: QuoteRequestCreate, *, ip: str | None, user_agent: str | None
    ) -> QuoteRequestDocument:
        """Valida el captcha y el límite por IP, guarda la solicitud y envía el aviso.

        Si el correo falla, la solicitud YA está guardada: se responde con éxito igualmente
        (no se pierde el prospecto) y queda `notification_status=failed` para reenviarlo.
        """
        retry_after = self._limiter.hit(ip or "unknown")
        if retry_after is not None:
            self._events.warning(
                "quotes", "quotes.rate_limited", "Demasiadas solicitudes desde la misma IP"
            )
            raise TooManyAttemptsError(
                "Recibimos varias solicitudes seguidas. Intenta de nuevo en unos minutos.",
                code="rate_limited",
                headers={"Retry-After": str(retry_after)},
            )

        if not await self._captcha.verify(payload.captcha_token, ip):
            self._events.warning("security", "quotes.captcha_failed", "reCAPTCHA no válido")
            raise BadRequestError(
                "No pudimos verificar que no eres un robot. Marca la casilla de nuevo.",
                code="captcha_failed",
            )

        data = payload.model_dump(exclude={"captcha_token"})
        request = await self._repo.create(
            QuoteRequestDocument(**data, ip=ip, user_agent=(user_agent or "")[:255] or None)
        )
        self._events.info(
            "quotes",
            "quotes.created",
            "Solicitud de cotización recibida",
            quote_request_id=request.id,
            email=mask_email(request.email),
            industry=request.industry,
            service=request.service,
        )
        await self._notify(request)
        return request

    async def get(self, request_id: str) -> QuoteRequestDocument:
        request = await self._repo.get(request_id)
        if request is None:
            raise NotFoundError("La solicitud no existe.", code="quote_request_not_found")
        return request

    async def send_notification(self, request_id: str) -> NotificationDTO:
        """(Re)envía el correo de una solicitud ya guardada."""
        request = await self.get(request_id)
        status = await self._notify(request)
        return NotificationDTO(
            quote_request_id=request_id,
            status=status,
            recipients=len(self._settings.quote_notification_emails),
        )

    async def _notify(self, request: QuoteRequestDocument) -> str:
        """Envía el aviso al equipo comercial y guarda el resultado. Nunca lanza."""
        recipients = self._settings.quote_notification_emails
        if not recipients:
            self._events.warning(
                "quotes",
                "quotes.notification_skipped",
                "QUOTE_NOTIFICATION_EMAILS vacío: no se envió el correo",
                quote_request_id=request.id,
            )
            await self._repo.update(
                request.id or "",
                {"notification_status": "failed", "notification_error": "sin destinatarios"},
            )
            return "failed"
        try:
            await self._email.send(build_quote_notification_email(request, recipients))
        except Exception as error:  # noqa: BLE001 - el correo nunca debe tumbar la solicitud
            self._events.error(
                "quotes",
                "quotes.notification_failed",
                "No se pudo enviar el correo de la solicitud",
                quote_request_id=request.id,
                error=f"{type(error).__name__}: {error}"[:300],
            )
            await self._repo.update(
                request.id or "",
                {"notification_status": "failed", "notification_error": type(error).__name__},
            )
            return "failed"
        status = "simulated" if getattr(self._email, "simulated", False) else "sent"
        self._events.info(
            "quotes",
            f"quotes.notification_{status}",
            "Correo de la solicitud enviado"
            if status == "sent"
            else "Correo SIMULADO (sin SMTP): solo se escribió en el log",
            quote_request_id=request.id,
            recipients=len(recipients),
        )
        await self._repo.update(
            request.id or "", {"notification_status": status, "notification_error": None}
        )
        return status
