"""Límite de peticiones por clave (IP) con ventana deslizante, en memoria.

Suficiente para una sola instancia del API. Con varias réplicas se cambia por una
implementación compartida (Redis, MongoDB) detrás del mismo método `hit`.
"""

import time
from collections import deque
from collections.abc import Callable


class SlidingWindowRateLimiter:
    def __init__(
        self, limit: int, window_seconds: int, clock: Callable[[], float] = time.monotonic
    ) -> None:
        self._limit = limit
        self._window = window_seconds
        self._clock = clock
        self._hits: dict[str, deque[float]] = {}

    def hit(self, key: str) -> int | None:
        """Registra un intento. `None` si se permite; si no, segundos a esperar."""
        now = self._clock()
        hits = self._hits.setdefault(key, deque())
        while hits and now - hits[0] >= self._window:
            hits.popleft()
        if len(hits) >= self._limit:
            return max(1, int(self._window - (now - hits[0])) + 1)
        hits.append(now)
        if len(self._hits) > 10_000:  # evita crecer sin límite con muchas IPs
            self._hits = {k: v for k, v in self._hits.items() if v and now - v[-1] < self._window}
        return None
