"""Errores de dominio.

Los servicios lanzan estas excepciones (no conocen HTTP a fondo); el handler de
`middlewares/error_handlers.py` las traduce a respuestas Problem Details con su
`status_code` y un `code` estable que el frontend puede usar para mostrar el mensaje correcto.
"""

from http import HTTPStatus


class DomainError(Exception):
    """Base de los errores de negocio."""

    status_code: HTTPStatus = HTTPStatus.INTERNAL_SERVER_ERROR
    default_code = "error"

    def __init__(
        self, detail: str, *, code: str | None = None, headers: dict[str, str] | None = None
    ) -> None:
        super().__init__(detail)
        self.detail = detail
        self.code = code or self.default_code
        self.headers = headers


class BadRequestError(DomainError):
    status_code = HTTPStatus.BAD_REQUEST
    default_code = "bad_request"


class AuthenticationError(DomainError):
    status_code = HTTPStatus.UNAUTHORIZED
    default_code = "unauthenticated"


class NotFoundError(DomainError):
    status_code = HTTPStatus.NOT_FOUND
    default_code = "not_found"


class TooManyAttemptsError(DomainError):
    status_code = HTTPStatus.TOO_MANY_REQUESTS
    default_code = "too_many_attempts"
