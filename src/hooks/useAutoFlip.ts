import { useEffect, useMemo, useRef, useState } from 'react';

// Volteo automático de tarjetas: una a la vez, en orden aleatorio
const AUTO_FLIP_START_MS = 1500; // espera al entrar el grupo en pantalla
const AUTO_FLIP_HOLD_MS = 2200; // tiempo que se ve el reverso
const AUTO_FLIP_GAP_MS = 1600; // pausa entre una tarjeta y la siguiente

// Orden aleatorio por rondas: cada tarjeta se voltea una vez por ronda y nunca la misma dos veces seguidas
function shuffledRound(count: number, avoidFirst: number | null): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  if (count > 1 && order[0] === avoidFirst) [order[0], order[1]] = [order[1], order[0]];
  return order;
}

/**
 * Devuelve el índice de la tarjeta volteada automáticamente (o null) y las props para el contenedor.
 * Solo corre con el contenedor visible, se pausa con mouse/teclado encima y respeta "reducir movimiento".
 */
export function useAutoFlip<T extends HTMLElement>(count: number) {
  const ref = useRef<T>(null);
  const [autoIndex, setAutoIndex] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!inView || paused || reduceMotion || count === 0) {
      setAutoIndex(null);
      return;
    }
    let round = shuffledRound(count, null);
    let last: number | null = null;
    let timer: number;
    const flipNext = () => {
      if (round.length === 0) round = shuffledRound(count, last);
      const index = round.shift()!;
      last = index;
      setAutoIndex(index);
      timer = window.setTimeout(() => {
        setAutoIndex(null);
        timer = window.setTimeout(flipNext, AUTO_FLIP_GAP_MS);
      }, AUTO_FLIP_HOLD_MS);
    };
    timer = window.setTimeout(flipNext, AUTO_FLIP_START_MS);
    return () => window.clearTimeout(timer);
  }, [inView, paused, count]);

  const containerProps = useMemo(() => ({
    ref,
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  }), []);

  return { autoIndex, containerProps };
}
