"""Tipos reutilizables de validación para los DTOs.

Toda entrada de texto pasa por aquí ANTES de llegar a la lógica de negocio. Reglas:
  · Los tipos son estrictos (Pydantic rechaza objetos donde se espera texto: un JSON como
    `{"$ne": ""}` en lugar de un correo NO pasa → no hay inyección NoSQL por operadores).
  · Los textos se LIMPIAN: se quitan caracteres de control e invisibles, se colapsan espacios
    y se rechaza cualquier marcado (`<`, `>`), esquemas peligrosos (`javascript:`, `data:`) y
    manejadores de eventos (`onerror=`). Nada de HTML/scripts llega a la base ni al correo.
"""

import re
import unicodedata
from typing import Annotated
from urllib.parse import urlsplit

from pydantic import AfterValidator, BeforeValidator, EmailStr, StringConstraints

_CONTROL_CHARS = re.compile(
    r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]"
)
_STRICT_EMAIL = re.compile(r"^[a-z0-9._%+-]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)+$")
_DANGEROUS = re.compile(
    r"[<>]|javascript\s*:|vbscript\s*:|data\s*:\s*text|on[a-z]+\s*=|\{\{|\$\{|<!--", re.I
)
_HOSTNAME = re.compile(r"^(?=.{4,253}$)([a-z0-9](-?[a-z0-9])*\.)+[a-z]{2,24}$", re.I)


def _clean(value: object) -> object:
    """Normaliza Unicode, quita caracteres de control/invisibles y colapsa espacios.

    Los saltos de línea se conservan (los comentarios pueden tener varios renglones).
    """
    if not isinstance(value, str):
        return value  # el tipo estricto lo rechazará después
    text = unicodedata.normalize("NFKC", value)
    text = _CONTROL_CHARS.sub("", text).replace("\r\n", "\n").replace("\r", "\n")
    lines = [" ".join(line.split()) for line in text.split("\n")]
    return "\n".join(lines).strip()


def _reject_markup(value: str) -> str:
    """Rechaza marcado HTML, scripts y plantillas."""
    if _DANGEROUS.search(value):
        raise ValueError("El texto contiene caracteres o código no permitidos")
    return value


def _check_person_name(value: str) -> str:
    """Solo letras (cualquier idioma), espacios, apóstrofes, puntos y guiones."""
    if not value[:1].isalpha():
        raise ValueError("El nombre debe empezar con una letra")
    for char in value:
        if not (char.isalpha() or unicodedata.category(char).startswith("M") or char in " '.-"):
            raise ValueError("El nombre solo admite letras, espacios, apóstrofes, puntos y guiones")
    return value


def _strict_email(value: str) -> str:
    """Correo en minúsculas con un patrón conservador (sin comillas, `<`, `>` ni espacios)."""
    email = value.strip().lower()
    if len(email) > 254 or not _STRICT_EMAIL.match(email):
        raise ValueError("El correo electrónico no es válido")
    return email


def _normalize_website(value: str) -> str:
    """`lutsa.mx` → `https://lutsa.mx`. Solo http/https, con un dominio real y sin credenciales."""
    url = value if "://" in value else f"https://{value}"
    parts = urlsplit(url)
    host = (parts.hostname or "").lower()
    if parts.scheme not in ("http", "https") or not _HOSTNAME.match(host):
        raise ValueError("La página web debe ser una dirección válida (ej. www.empresa.com)")
    if parts.username or parts.password or " " in url:
        raise ValueError("La página web no puede llevar usuario, contraseña ni espacios")
    return url


_Clean = BeforeValidator(_clean)

PersonName = Annotated[
    str,
    _Clean,
    StringConstraints(min_length=2, max_length=150),
    AfterValidator(_check_person_name),
]

EmailAddress = Annotated[EmailStr, _Clean, AfterValidator(_strict_email)]


def safe_text(max_length: int, min_length: int = 1) -> object:
    """Texto libre limpio, sin marcado, con longitud acotada."""
    return Annotated[
        str,
        _Clean,
        StringConstraints(min_length=min_length, max_length=max_length),
        AfterValidator(_reject_markup),
    ]


CompanyName = safe_text(150, 2)
ShortText = safe_text(150)
Comments = safe_text(500)

Website = Annotated[
    str,
    _Clean,
    StringConstraints(min_length=4, max_length=150),
    AfterValidator(_reject_markup),
    AfterValidator(_normalize_website),
]

# Token del widget "No soy un robot" (opaco; solo se reenvía a Google para verificarlo).
CaptchaToken = Annotated[str, StringConstraints(min_length=1, max_length=4096)]
