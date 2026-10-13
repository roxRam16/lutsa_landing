import { useEffect, useState, type CSSProperties } from 'react';
import { useAutoFlip } from '../hooks/useAutoFlip';
import { useLanguage } from '../i18n/LanguageContext';

// Íconos de métricas (ya incluyen el número) y su posición x en el diseño de escritorio
const metricIcons = [
  { src: '/seccion01/svg/unidades.svg', x: 96 },
  { src: '/seccion01/svg/colaboradores.svg', x: 411 },
  { src: '/seccion01/svg/patio_almacen.svg', x: 732 },
  { src: '/seccion01/svg/4km.svg', x: 1015 },
  { src: '/seccion01/svg/estacion_diesel.svg', x: 1279 },
];

// Une líneas con salto solo en escritorio (xl); en móvil/tablet el texto fluye
function DesktopLines({ lines }: { lines: readonly string[] }) {
  return <>{lines.map((line, i) => <span key={line}>{line}{i < lines.length - 1 && <>{' '}<br className="hidden xl:inline" /></>}</span>)}</>;
}

// Letrero naranja con "KM 20" (SVG) y el título encima
function Sign({ src, lines, variant }: { src: string; lines: readonly string[]; variant: 'infra' | 'ops' }) {
  return (
    <>
      <div className={`svc__sign svc__sign--${variant} relative mx-auto hidden xl:block`}>
        <img src={src} alt="" className="block h-auto w-full" />
        <h3 className="svc__sign-text absolute font-exo font-bold uppercase text-white">
          {lines[0]}<br /><span className="text-[#10227f]">{lines[1]}</span>
        </h3>
      </div>
      {/* Celular y tablet: letrero en código, ambos del mismo ancho (2 líneas en celular, 1 en tablet) */}
      <div className="orange-gradient mx-auto w-full rounded-lg border-2 border-[#f7c29e] p-1 shadow-lg sm:max-w-[40rem] xl:hidden">
        <div className="flex items-center gap-2.5 rounded-md border-2 border-white/90 py-1.5 pl-1.5 pr-3 sm:justify-center sm:gap-3 sm:py-1 sm:pr-1.5">
          <img src="/seccion01/svg/km20.svg" alt="" className="h-8 w-auto shrink-0 sm:h-7" />
          <h3 className="svc__sign-line flex-1 whitespace-nowrap sm:flex-none text-center font-exo font-bold uppercase leading-none text-white" style={{ '--len': (lines[0].length + lines[1].length + 1) * 0.58 } as CSSProperties}>
            {lines[0]} <span className="text-[#10227f]">{lines[1]}</span>
          </h3>
        </div>
      </div>
    </>
  );
}

function Chevron({ className = '', step }: { className?: string; step: number }) {
  return (
    <svg viewBox="0 0 24 12" className={`svc__chevron ${className}`} style={{ '--step': step } as CSSProperties} fill="none" stroke="#e66600" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 2l10 8 10-8" />
    </svg>
  );
}

function FlowPanel({ title, steps, icon, delay }: { title: readonly string[]; steps: readonly string[]; icon: string; delay: number }) {
  return (
    <div className="svc__flow rounded-2xl px-2 pb-5 pt-4" style={{ '--flow': `${delay}s` } as CSSProperties}>
      <div className="svc__flow-head flex items-center justify-center gap-2">
        <h4 className="svc__flow-title font-exo font-bold uppercase leading-[1.1] text-white">
          <span className="text-[#f47621]">{title[0]}</span><br className="hidden xl:inline" />{title[1]}
        </h4>
        <img src={icon} alt="" className="svc__flow-icon h-7 w-7 shrink-0 object-contain sm:h-10 sm:w-10" />
      </div>
      <ol className="svc__steps mt-3 grid grid-flow-col grid-cols-3 grid-rows-[repeat(2,auto)] items-start gap-x-1 text-center font-condensed font-bold text-white sm:flex sm:flex-col sm:items-center">
        {steps.map((step, index) => (
          <li key={step} className="flex flex-col items-center">
            {index > 0 && <Chevron step={index - 1} className={index % 2 === 0 ? 'hidden sm:block' : ''} />}
            <span className="svc__step" style={{ '--step': index } as CSSProperties}><span className="text-[#f47621]">{index + 1}</span> {step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Móvil/tablet: carrusel infinito de métricas. La del centro se agranda; las demás quedan tenues.
const CAROUSEL_STEP_MS = 4800;
const CAROUSEL_ANIM_MS = 2000;
const CAROUSEL_ANIM = 'duration-[2000ms] ease-in-out';
const COPIES = 3; // la lista se repite 3 veces para que el salto de reinicio no se note

function MetricsCarousel({ metrics }: { metrics: readonly { value: string; lines: readonly string[] }[] }) {
  const n = metrics.length;
  const [pos, setPos] = useState(n); // empieza en la copia del medio
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => { setAnimate(true); setPos((p) => p + 1); }, CAROUSEL_STEP_MS);
    return () => window.clearInterval(timer);
  }, []);

  // Al terminar el deslizamiento hacia la tercera copia, regresa a la tarjeta equivalente de la copia
  // del medio sin animación (mismo aspecto, así que no se nota). Temporizador fijo: no depende de transitionend.
  useEffect(() => {
    if (pos < 2 * n) return;
    const timer = window.setTimeout(() => { setAnimate(false); setPos((p) => p - n); }, CAROUSEL_ANIM_MS + 50);
    return () => window.clearTimeout(timer);
  }, [pos, n]);

  const items = Array.from({ length: n * COPIES }, (_, k) => k);
  return (
    <div className="svc__carousel relative mx-auto max-w-[44rem] overflow-hidden pb-4 pt-10 sm:pt-12 xl:hidden" style={{ '--total': n * COPIES, '--pos': pos } as CSSProperties}>
      <ul className={`svc__carousel-track flex ${animate ? `transition-transform ${CAROUSEL_ANIM}` : ''}`}>
        {items.map((k) => {
          const i = k % n;
          const active = k === pos;
          return (
            <li
              key={k}
              aria-hidden={k < n || k >= 2 * n ? true : undefined}
              className={`svc__carousel-item flex shrink-0 flex-col items-center gap-2 px-1 text-center sm:px-3 ${animate ? `transition-opacity ${CAROUSEL_ANIM}` : ''} ${active ? 'opacity-100' : 'opacity-40 sm:opacity-30'}`}
            >
              <img src={metricIcons[i].src} alt={metrics[i].value} className={`h-8 w-auto max-w-full origin-bottom sm:h-11 ${animate ? `transition-[transform,filter] ${CAROUSEL_ANIM}` : ''} ${active ? 'scale-[1.7] drop-shadow-[0_0_8px_rgba(255,140,40,0.6)]' : 'scale-90 sm:scale-[0.7]'}`} />
              <p className="font-exo text-[0.6875rem] font-semibold leading-[1.25] text-white sm:text-[0.875rem]">
                {metrics[i].lines[0]}<br />{metrics[i].lines[1]}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TrailerCard({ label, image, autoFlipped }: { label: string; image: string; autoFlipped: boolean }) {
  const { t } = useLanguage();
  const [flipped, setFlipped] = useState(false);
  // Escritorio: al pasar el mouse se voltea (muestra el camión)
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      aria-pressed={flipped}
      aria-label={`${flipped ? t.services.hideTrailer : t.services.showTrailer} ${label}`}
      className={`svc__trailer flip-card relative block h-16 w-full ${flipped || hovered || autoFlipped ? 'flipped' : ''}`}
    >
      <span className="flip-card-inner block">
        <span className="svc__trailer-face flip-card-face orange-gradient px-4 shadow-glow">
          <span className="svc__trailer-label font-condensed font-bold leading-tight text-white">{label}</span>
        </span>
        <span className="svc__trailer-face flip-card-face flip-card-back bg-white shadow-glow">
          <img src={image} alt="" className="h-full w-full object-contain" />
        </span>
      </span>
    </button>
  );
}

/*
 * Escritorio (xl): réplica de public/modelos/soluciones.jpg. Las posiciones y tamaños viven en
 * index.css (bloque "Soluciones logísticas") en píxeles del diseño × --u (= ancho / 1550).
 * Móvil/tablet: columna centrada con las clases de Tailwind de este archivo.
 */
export function ServiciosSection() {
  const { t } = useLanguage();
  const s = t.services;
  // Remolques: se voltean solos (uno a la vez, al azar) para mostrar el camión
  const { autoIndex, containerProps } = useAutoFlip<HTMLUListElement>(s.trailers.length);

  return (
    <section id="servicios" className="svc relative overflow-hidden px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-16">

      <div className="svc__intro relative mx-auto min-h-[17rem] max-w-[40rem] text-center sm:min-h-[calc(8rem+34cqw)]">
        <h2 className="svc__title font-exo text-[clamp(1.3rem,5.4cqw,2.4rem)] font-bold uppercase leading-[1.15] text-[#10227f]">
          {s.title}{' '}<br className="hidden xl:inline" /><span className="text-[#e66600]">{s.titleAccent}</span>
        </h2>
        <p className="svc__lead mt-3 font-exo text-[clamp(0.9375rem,2.7cqw,1.1875rem)] font-semibold leading-[1.55] text-[#4a4a4a]">
          <DesktopLines lines={s.leadLines} />
        </p>
      </div>

      <MetricsCarousel metrics={s.metrics} />

      <ul className="svc__metrics hidden">
        {s.metrics.map((metric, i) => (
          <li key={metricIcons[i].src} className="svc__metric flex w-1/3 flex-col items-center justify-center gap-1.5 px-1 text-center sm:gap-2 sm:px-0 xl:w-auto xl:flex-row xl:text-left" style={{ '--x': metricIcons[i].x, '--i': i } as CSSProperties}>
            <img src={metricIcons[i].src} alt={metric.value} className="svc__metric-icon h-7 w-auto max-w-full shrink-0 sm:h-10" />
            <p className="svc__metric-text font-exo text-[0.6875rem] font-semibold leading-[1.25] text-white sm:text-[0.875rem]">
              {metric.lines[0]}<br className="hidden sm:inline" /> {metric.lines[1]}
            </p>
          </li>
        ))}
      </ul>

      <div className="svc__grid relative mt-12 grid grid-cols-1 gap-12">
        <div className="svc__infra text-center">
          <Sign src="/seccion01/svg/letrero_infraestructura.svg" lines={s.infraTitle} variant="infra" />
          <ul className="svc__infra-list mx-auto mt-6 grid max-w-[44rem] grid-flow-col grid-cols-2 grid-rows-3 gap-x-3 gap-y-4 font-exo text-[clamp(0.625rem,2.85cqw,0.75rem)] font-medium uppercase leading-[1.3] text-white sm:gap-x-8 sm:gap-y-5 sm:text-[0.8125rem] xl:flex xl:flex-col">
            {s.infra.map((item, i) => (
              <li key={i}>
                {item.map((line, j) => (
                  <span key={j}>
                    {line.map(([text, accent], k) => <span key={k} className={accent ? 'text-[#f47621]' : undefined}>{text}</span>)}
                    {j < item.length - 1 && (j === 0 ? <br /> : <>{' '}<br className="hidden xl:inline" /></>)}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>

        <div className="svc__ops text-center">
          <Sign src="/seccion01/svg/letrero%20.svg" lines={s.opsTitle} variant="ops" />
          <div className="svc__flows mx-auto mt-6 grid grid-cols-1 gap-4 sm:max-w-[40rem] sm:grid-cols-2 sm:gap-5">
            <FlowPanel title={s.imports.title} steps={s.imports.steps} icon="/seccion01/svg/btn_impo.svg" delay={0} />
            <FlowPanel title={s.exports.title} steps={s.exports.steps} icon="/seccion01/svg/btn_expo.svg" delay={4} />
          </div>
        </div>

        <div className="svc__caps text-center">
          <h3 className="svc__caps-title font-exo text-[1.25rem] sm:text-[1.375rem] font-bold uppercase leading-none text-[#f47621]">{s.capabilitiesTitle}</h3>
          <ul className="svc__caps-list mx-auto mt-4 grid max-w-[40rem] grid-flow-col grid-rows-4 gap-x-4 font-condensed text-[0.75rem] font-bold text-white sm:gap-x-8 xl:flex xl:flex-col sm:text-[0.875rem] xl:flex">
            {s.capabilities.map((item) => <li key={item} className="svc__cap border-b border-[#e66600]/80 py-2">{item}</li>)}
          </ul>
        </div>

        <div className="svc__trailers text-center">
          <h3 className="svc__trailers-title font-exo text-[1.125rem] sm:text-[1.25rem] font-bold uppercase leading-none text-white">{s.trailersTitle}</h3>
          <ul {...containerProps} className="svc__trailer-list mx-auto mt-4 grid max-w-[40rem] grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-1">
            {s.trailers.map((item, index) => (
              <li key={item}>
                <TrailerCard label={item} image={`/seccion01/remolques/camion${index + 1}.png`} autoFlipped={autoIndex === index} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
