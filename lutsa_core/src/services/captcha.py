"""Verificación "No soy un robot" (patrón Strategy).

`RecaptchaVerifier` consulta a Google reCAPTCHA v2 (`siteverify`). En sandbox se usan las
claves de PRUEBA públicas de Google, que siempre aprueban; en producción la configuración
exige claves reales.
"""

import asyncio
import json
import logging
import urllib.parse
import urllib.request
from typing import Protocol

from src.config import Settings

logger = logging.getLogger(__name__)


class CaptchaVerifier(Protocol):
    async def verify(self, token: str, remote_ip: str | None) -> bool:
        """`True` si el token es válido. Nunca lanza: un fallo de red cuenta como NO válido."""


class RecaptchaVerifier:
    def __init__(self, settings: Settings) -> None:
        self._secret = settings.recaptcha_secret_key
        self._url = settings.recaptcha_verify_url

    async def verify(self, token: str, remote_ip: str | None) -> bool:
        try:
            return await asyncio.to_thread(self._verify_blocking, token, remote_ip)
        except Exception as error:  # noqa: BLE001 - sin respuesta de Google no se acepta
            logger.warning("No se pudo verificar el reCAPTCHA: %s", error)
            return False

    def _verify_blocking(self, token: str, remote_ip: str | None) -> bool:
        fields = {"secret": self._secret, "response": token}
        if remote_ip:
            fields["remoteip"] = remote_ip
        request = urllib.request.Request(  # noqa: S310 - URL fija de configuración (https)
            self._url, data=urllib.parse.urlencode(fields).encode(), method="POST"
        )
        with urllib.request.urlopen(request, timeout=8) as response:  # noqa: S310
            result = json.loads(response.read())
        if not result.get("success"):
            logger.warning("reCAPTCHA rechazado por Google: %s", result.get("error-codes"))
        return bool(result.get("success"))


class DisabledCaptchaVerifier:
    """Sin verificación (`CAPTCHA_ENABLED=false`). Solo para desarrollo o pruebas."""

    async def verify(self, token: str, remote_ip: str | None) -> bool:
        return True


def build_captcha_verifier(settings: Settings) -> CaptchaVerifier:
    return RecaptchaVerifier(settings) if settings.captcha_enabled else DisabledCaptchaVerifier()
