"""Configuración de la aplicación.

Patrón: *Settings* tipadas y validadas (pydantic-settings) + *Singleton* vía
``lru_cache``. Las variables se leen del entorno y, si existe, de
``private/.env.<APP_ENV>`` (sandbox | production). Las variables reales del
sistema siempre tienen prioridad sobre el archivo (útil en contenedores/AWS).
"""

import os
from functools import lru_cache
from pathlib import Path
from typing import Annotated, Literal, Self

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parents[2]
PRIVATE_DIR = PROJECT_ROOT / "private"

AppEnvironment = Literal["sandbox", "production"]

# Claves de PRUEBA públicas de Google reCAPTCHA v2: siempre aprueban. Solo para sandbox.
RECAPTCHA_TEST_SECRET = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojQ4WifJWe"  # noqa: S105


class Settings(BaseSettings):
    """Variables de entorno de LUTSA-CORE."""

    model_config = SettingsConfigDict(extra="ignore", case_sensitive=False)

    app_name: str = "LUTSA-CORE"
    app_env: AppEnvironment = "sandbox"
    app_version: str = "0.1.0"
    # Nombre con el que este servicio firma sus eventos en la bitácora.
    service_name: str = "core"
    # Puerto del API. Los tradicionales (8000/8080) están ocupados en el equipo de desarrollo.
    api_port: int = 8090

    # Swagger / ReDoc. Desactivable por ambiente si se requiere.
    docs_enabled: bool = True

    mongodb_uri: str = "mongodb://localhost:27037"
    mongodb_db: str = "lutsa_sandbox"
    mongodb_timeout_ms: int = 2000
    # Bitácora: base de datos SEPARADA (mismo servidor). Una por ambiente.
    mongodb_logs_db: str = "lutsa_logs_sandbox"
    log_retention_days: int = Field(default=30, ge=1)
    log_flush_interval_seconds: float = Field(default=1.0, ge=0)
    log_min_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    # Tamaño máximo del cuerpo de una petición (protección contra abusos).
    max_request_body_bytes: int = Field(default=65_536, ge=1024)

    # Orígenes permitidos por CORS (la landing). Separados por coma en el .env.
    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:5173"]

    # ── Solicitudes de cotización ────────────────────────────────────────────
    # Límite por IP para crear solicitudes (anti abuso): N solicitudes por ventana.
    quote_rate_limit: int = Field(default=5, ge=1)
    quote_rate_window_seconds: int = Field(default=600, ge=1)
    # Correo(s) que reciben cada solicitud nueva, separados por coma.
    quote_notification_emails: Annotated[list[str], NoDecode] = []

    # Llave para los endpoints internos (consultar/reenviar solicitudes). Cabecera `X-API-Key`.
    # Sin valor, esos endpoints quedan cerrados (401).
    admin_api_key: str | None = Field(default=None, min_length=32)

    # ── "No soy un robot" (Google reCAPTCHA v2) ─────────────────────────────
    captcha_enabled: bool = True
    recaptcha_secret_key: str = RECAPTCHA_TEST_SECRET
    recaptcha_verify_url: str = "https://www.google.com/recaptcha/api/siteverify"

    # ── Correo saliente (SMTP). Sin host, los correos solo se escriben en el log ──
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_use_tls: bool = True  # STARTTLS (587). Con el puerto 465 se usa SSL directo.
    smtp_from: str = "LUTSA Landing <no-reply@lutsa.mx>"
    smtp_timeout_seconds: float = Field(default=15, gt=0)

    @field_validator("cors_origins", "quote_notification_emails", mode="before")
    @classmethod
    def _split_list(cls, value: object) -> object:
        """Permite `X=a,b` además de una lista JSON."""
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    @model_validator(mode="after")
    def _validate_production(self) -> Self:
        """En producción: sin CORS abierto ni la clave de prueba de reCAPTCHA."""
        if self.app_env == "production":
            if "*" in self.cors_origins:
                raise ValueError("CORS_ORIGINS no puede contener '*' en producción")
            if self.captcha_enabled and self.recaptcha_secret_key == RECAPTCHA_TEST_SECRET:
                raise ValueError("RECAPTCHA_SECRET_KEY de prueba no se admite en producción")
        return self

    @property
    def explicit_cors_origins(self) -> list[str]:
        """Orígenes concretos (el comodín `*` se descarta)."""
        return [origin for origin in self.cors_origins if origin != "*"]

    @property
    def hsts(self) -> bool:
        """HSTS solo en producción (HTTPS)."""
        return self.app_env == "production"


def resolve_env_file(app_env: str | None = None) -> Path:
    """Ruta de `private/.env.<ambiente>` (puede no existir; entonces se usan defaults)."""
    return PRIVATE_DIR / f".env.{app_env or os.getenv('APP_ENV', 'sandbox')}"


@lru_cache
def get_settings() -> Settings:
    """Devuelve la configuración única de la aplicación (cacheada)."""
    return Settings(_env_file=resolve_env_file())  # type: ignore[call-arg]
