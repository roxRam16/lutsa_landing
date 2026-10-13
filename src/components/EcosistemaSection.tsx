import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Empresas del ecosistema en el orden de lectura (móvil/tablet); la posición en escritorio va en index.css
const nodeOrder = ['transportes', 'magno', 'mil519', 'almacen', 'regionales'] as const;
const goalIcons = ['icono-caja.svg', 'icono-reloj.svg', 'icono-person.svg'];

// Diagrama circular (móvil/tablet): coordenadas del diseño original (ecosistema.png recortado, 2921×2629)
const DIAGRAM_W = 2921;
const DIAGRAM_H = 2629;
const NODE_R = 360;
const CENTER = { x: 1477, y: 1418, r: 480 };
const nodePos: Record<(typeof nodeOrder)[number], { x: number; y: number }> = {
  transportes: { x: 1480, y: 372 },
  magno: { x: 2548, y: 1196 },
  mil519: { x: 2124, y: 2256 },
  almacen: { x: 800, y: 2256 },
  regionales: { x: 372, y: 1192 },
};
const STEP_MS = 7000; // tiempo que cada empresa queda iluminada
const FADE = 'duration-[1600ms] ease-in-out'; // transición lenta
const TAP_HOLD_MS = 9000; // al tocar un círculo (móvil) se queda fijo este tiempo

// Punto a distancia d del centro (x, y) en dirección a (tx, ty)
function toward(x: number, y: number, tx: number, ty: number, d: number) {
  const len = Math.hypot(tx - x, ty - y);
  return { x: x + ((tx - x) / len) * d, y: y + ((ty - y) / len) * d };
}

// Flecha curva entre dos empresas vecinas (se curva hacia afuera del diagrama)
function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const gap = NODE_R + 70;
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const out = toward(CENTER.x, CENTER.y, mid.x, mid.y, Math.hypot(mid.x - CENTER.x, mid.y - CENTER.y) + 170);
  const p1 = toward(a.x, a.y, out.x, out.y, gap);
  const p2 = toward(b.x, b.y, out.x, out.y, gap);
  return `M${p1.x} ${p1.y} Q${out.x} ${out.y} ${p2.x} ${p2.y}`;
}

// Flecha recta del centro hacia una empresa
function spokePath(n: { x: number; y: number }, centerR: number) {
  const p1 = toward(CENTER.x, CENTER.y, n.x, n.y, centerR + 70);
  const p2 = toward(n.x, n.y, CENTER.x, CENTER.y, NODE_R + 50);
  return `M${p1.x} ${p1.y} L${p2.x} ${p2.y}`;
}

// Empresa activa: avanza por turnos; al pasar el mouse o tocar una empresa se fija en ella
// (con "reducir movimiento" no avanza sola y todas quedan a color: -1)
function useActiveNode(count: number) {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const holdTimer = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setActive(-1); return; }
    if (held) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % count), STEP_MS);
    return () => window.clearInterval(timer);
  }, [count, held]);
  useEffect(() => () => window.clearTimeout(holdTimer.current), []);

  const select = (i: number, holdMs?: number) => {
    window.clearTimeout(holdTimer.current);
    setActive(i);
    setHeld(true);
    if (holdMs) holdTimer.current = window.setTimeout(() => setHeld(false), holdMs);
  };
  const release = () => { window.clearTimeout(holdTimer.current); setHeld(false); };
  return { active, select, release };
}

// Props para que un elemento ilumine la empresa i al pasar el mouse, enfocarlo o tocarlo
function selectProps(i: number, select: (i: number, holdMs?: number) => void, release: () => void) {
  return {
    onMouseEnter: () => select(i),
    onMouseLeave: release,
    onFocus: () => select(i),
    onBlur: release,
    onClick: () => select(i, TAP_HOLD_MS),
  };
}

type RadialProps = {
  active: number;
  caption: readonly string[];
  alt: string;
  names: readonly string[];
  centerR: number;
  id: string;
  className: string;
  select: (i: number, holdMs?: number) => void;
  release: () => void;
};

function RadialDiagram({ active, caption, alt, names, centerR, id, className, select, release }: RadialProps) {
  const center = { ...CENTER, r: centerR };
  const on = (i: number) => active === -1 || active === i;
  const pct = (v: number, total: number) => `${(v / total) * 100}%`;
  return (
    <div className={`eco__radial ${className}`} style={{ aspectRatio: `${DIAGRAM_W} / ${DIAGRAM_H}` }} role="group" aria-label={alt}>
      <svg viewBox={`0 0 ${DIAGRAM_W} ${DIAGRAM_H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <marker id={`${id}-on`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="#f47621" />
          </marker>
          <marker id={`${id}-off`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="#b4bacb" />
          </marker>
        </defs>
        {nodeOrder.map((key, i) => {
          const prev = nodeOrder[(i + nodeOrder.length - 1) % nodeOrder.length];
          const lit = on(i);
          const head = `url(#${id}-${lit ? 'on' : 'off'})`;
          const stroke = lit ? '#f47621' : '#b4bacb';
          return (
            <g key={key} className={`transition-[stroke] ${FADE}`} stroke={stroke} fill="none">
              {/* Flecha que llega a la empresa desde su vecina y flecha desde el centro */}
              <path d={arcPath(nodePos[prev], nodePos[key])} strokeWidth="16" markerStart={head} markerEnd={head} />
              <path d={spokePath(nodePos[key], center.r)} strokeWidth="10" markerStart={head} markerEnd={head} />
            </g>
          );
        })}
      </svg>

      {/* Logo central */}
      <div className="absolute" style={{ left: pct(center.x - center.r, DIAGRAM_W), top: pct(center.y - center.r, DIAGRAM_H), width: pct(2 * center.r, DIAGRAM_W) }}>
        <img loading="lazy" decoding="async" src="/seccion04/eco_centro.webp" alt="" className="eco__center-img block h-auto w-full rounded-full" />
        <p className="eco__radial-caption absolute inset-x-0 top-[70%] text-center font-exo text-[clamp(0.5rem,2.3cqw,0.8125rem)] font-bold uppercase leading-[1.15] text-[#10227f]">
          {caption[0]}<br />{caption[1]}
        </p>
      </div>

      {/* Fotos de las empresas: la activa a color, las demás en escala de grises (mouse o toque la ilumina) */}
      {nodeOrder.map((key, i) => (
        <button
          key={key}
          type="button"
          aria-label={names[i]}
          aria-pressed={active === i}
          {...selectProps(i, select, release)}
          className={`absolute cursor-pointer rounded-full transition-[filter,transform,opacity] ${FADE} ${on(i) ? 'scale-110 opacity-100' : 'scale-95 opacity-70'}`}
          style={{
            left: pct(nodePos[key].x - NODE_R, DIAGRAM_W),
            top: pct(nodePos[key].y - NODE_R, DIAGRAM_H),
            width: pct(2 * NODE_R, DIAGRAM_W),
            filter: on(i) ? 'grayscale(0) drop-shadow(0 0 10px rgba(244, 118, 33, 0.65))' : 'grayscale(1) drop-shadow(0 0 0 rgba(244, 118, 33, 0))',
          }}
        >
          <img loading="lazy" decoding="async" src={`/seccion04/eco_${key}.webp`} alt="" className="block h-auto w-full rounded-full" />
        </button>
      ))}
    </div>
  );
}

// Reparte un texto en 2 líneas lo más parejas posible (corta entre palabras)
function twoLines(text: string): [string, string] {
  const words = text.split(' ');
  let best = 1;
  let bestDiff = Infinity;
  for (let k = 1; k < words.length; k++) {
    const diff = Math.abs(words.slice(0, k).join(' ').length - words.slice(k).join(' ').length);
    if (diff < bestDiff) { bestDiff = diff; best = k; }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}

// Une líneas con salto solo en escritorio (xl); en móvil/tablet el texto fluye
function DesktopLines({ lines }: { lines: readonly string[] }) {
  return <>{lines.map((line, i) => <span key={line}>{line}{i < lines.length - 1 && <>{' '}<br className="hidden xl:inline" /></>}</span>)}</>;
}

/*
 * Escritorio (xl): réplica de docs/referencias/ecosistema.jpg. El diagrama (círculos y flechas) es una
 * imagen sin textos; los textos van encima en HTML para poder traducirlos. Medidas en index.css
 * (bloque "Ecosistema") en píxeles del diseño × --u (= ancho / 1550).
 * Diagrama animado (una empresa a color por turno; mouse/toque la fija). Móvil/tablet: debajo solo el
 * texto de la empresa iluminada. Escritorio: textos alrededor como en el diseño, el activo resaltado.
 */
export function EcosistemaSection() {
  const { t } = useLanguage();
  const s = t.ecosystem;
  const { active, select, release } = useActiveNode(nodeOrder.length);
  const names = nodeOrder.map((key) => `${s.nodes[key].name} ${s.nodes[key].accent}`);
  const radial = { active, caption: s.center, alt: s.diagramAlt, names, select, release };

  return (
    <section id="ecosistema" className="eco relative overflow-hidden px-5 pb-12 pt-16 sm:px-8 sm:pt-24 lg:px-10">
      <div className="eco__intro relative mx-auto max-w-[40rem] text-center">
        <h2 className="eco__title font-exo text-[clamp(1.3rem,5.4cqw,2.4rem)] font-bold uppercase leading-[1.2] text-[#10227f]">
          {s.title}{' '}<br className="hidden xl:inline" /><span className="text-[#e66600]">{s.titleAccent}</span>
        </h2>
        <p className="eco__lead mt-3 font-exo text-[clamp(0.9375rem,2.7cqw,1.1875rem)] font-semibold leading-[1.5] text-[#4a4a4a]">
          <DesktopLines lines={s.leadLines} />
        </p>
      </div>

      {/* Diagrama animado: móvil/tablet y escritorio (en escritorio, en la posición del diseño) */}
      <RadialDiagram {...radial} id="eco-m" centerR={480} className="relative mx-auto mt-6 w-full max-w-[34rem] xl:hidden" />
      <RadialDiagram {...radial} id="eco-d" centerR={560} className="eco__radial--desk hidden xl:block" />

      {/* Móvil/tablet: solo el texto de la empresa iluminada, en grande */}
      <div className="eco__active relative mx-auto mt-5 min-h-[6.75rem] max-w-[30rem] sm:min-h-[8.1rem] text-center xl:hidden" aria-live="polite">
        {nodeOrder.map((key, i) => {
          const node = s.nodes[key];
          if (active !== -1 && active !== i) return null;
          return (
            <div key={key} className="eco__active-item animate-[eco-fade_1.6s_ease-in-out]">
              <p className="font-exo text-[1.5rem] font-bold uppercase leading-[1.2] text-[#10227f] sm:text-[1.75rem]">
                {node.name}<br /><span className="text-[#e66600]">{node.accent}</span>
              </p>
              <p className="mt-2 whitespace-nowrap font-exo text-[clamp(0.8125rem,4cqw,1.125rem)] font-semibold leading-[1.45] text-[#10227f]">
                {twoLines(node.text.join(' ')).map((line, j) => <span key={j} className="block">{line}</span>)}
              </p>
            </div>
          );
        })}
      </div>

      <ul className="eco__nodes hidden">
        {nodeOrder.map((key, i) => {
          const node = s.nodes[key];
          const lit = active === -1 || active === i;
          return (
            <li key={key} {...selectProps(i, select, release)} className={`eco__node eco__node--${key} flex cursor-default flex-col transition-opacity ${FADE} ${lit ? 'opacity-100' : 'opacity-35'}`}>
              <p className="eco__node-name font-exo text-[0.9375rem] font-bold uppercase leading-[1.3] text-[#10227f] xl:mt-0">
                {node.name}<br /><span className="text-[#e66600]">{node.accent}</span>
              </p>
              <p className="eco__node-text mt-1.5 font-exo text-[0.75rem] font-semibold leading-[1.4] text-[#10227f] sm:text-[0.8125rem]">
                <DesktopLines lines={node.text} />
              </p>
            </li>
          );
        })}
      </ul>

      <div className="eco__goal relative mx-auto mt-[2.75rem] flex max-w-[44rem] flex-col items-center gap-5 rounded-3xl px-4 py-6 text-center">
        <p className="eco__goal-title whitespace-nowrap font-exo text-[clamp(0.8125rem,4.1cqw,1.125rem)] font-bold uppercase leading-[1.3] text-white">
          {s.goalTitle}{' '}<br className="hidden xl:inline" /><span className="text-[#f47621]">{s.goalAccent}</span>
        </p>
        <ul className="eco__goal-list grid w-full grid-cols-3 gap-2">
          {s.goals.map((goal, i) => (
            <li key={goalIcons[i]} className="eco__goal-item grid grid-cols-[auto_1fr] items-center gap-x-1.5 gap-y-1.5 sm:gap-x-3" style={{ '--i': i } as CSSProperties}>
              <img loading="lazy" decoding="async" src="/seccion04/svg/flecha-lateral.svg" alt="" className={`eco__goal-arrow row-span-2 h-4 w-auto sm:h-6 ${i === 0 ? 'hidden xl:block' : ''}`} />
              <img loading="lazy" decoding="async" src={`/seccion04/svg/${goalIcons[i]}`} alt="" className="eco__goal-icon col-start-2 h-8 w-auto justify-self-center sm:h-9" />
              <span className="eco__goal-text col-start-2 text-center font-exo text-[0.6875rem] font-medium leading-[1.35] text-white sm:text-[0.875rem]">
                <DesktopLines lines={goal} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
