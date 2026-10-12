import { useState, type CSSProperties } from 'react';
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
      <div className="orange-gradient mx-auto w-full max-w-[20.5rem] rounded-lg border-2 border-[#f7c29e] p-1 shadow-lg sm:max-w-[26rem] xl:hidden">
        <div className="flex items-center gap-2.5 rounded-md border-2 border-white/90 py-1.5 pl-1.5 pr-[2.6rem] sm:py-1 sm:pr-[2.3rem]">
          <img src="/seccion01/svg/km20.svg" alt="" className="h-9 w-auto shrink-0 sm:h-7" />
          <h3 className="flex-1 text-center font-exo text-[1rem] font-bold uppercase leading-[1.15] text-white sm:whitespace-nowrap sm:text-[0.9375rem] sm:leading-none">
            {lines[0]}<br className="sm:hidden" /><span className="hidden sm:inline"> </span><span className="text-[#10227f]">{lines[1]}</span>
          </h3>
        </div>
      </div>
    </>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 12" className="svc__chevron" fill="none" stroke="#e66600" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 2l10 8 10-8" />
    </svg>
  );
}

function FlowPanel({ title, steps, icon }: { title: readonly string[]; steps: readonly string[]; icon: string }) {
  return (
    <div className="svc__flow rounded-2xl px-2 pb-5 pt-4">
      <div className="svc__flow-head flex items-center justify-center gap-2">
        <h4 className="svc__flow-title font-exo font-bold uppercase leading-[1.1] text-white">
          <span className="text-[#f47621]">{title[0]}</span><br className="hidden xl:inline" />{title[1]}
        </h4>
        <img src={icon} alt="" className="svc__flow-icon h-10 w-10 shrink-0 object-contain" />
      </div>
      <ol className="svc__steps mt-3 flex flex-col items-center text-center font-condensed font-bold text-white">
        {steps.map((step, index) => (
          <li key={step} className="flex flex-col items-center">
            {index > 0 && <Chevron />}
            <span><span className="text-[#f47621]">{index + 1}</span> {step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TrailerCard({ label, image }: { label: string; image: string }) {
  const { t } = useLanguage();
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${flipped ? t.services.hideTrailer : t.services.showTrailer} ${label}`}
      className={`svc__trailer flip-card relative block h-16 w-full ${flipped ? 'flipped' : ''}`}
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

  return (
    <section id="servicios" className="svc relative overflow-hidden px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-16">

      <div className="svc__intro relative mx-auto min-h-[15.5rem] max-w-[40rem] text-center sm:min-h-[calc(5.5rem+34cqw)]">
        <h2 className="svc__title font-exo text-[clamp(1.3rem,5.4cqw,2.4rem)] font-bold uppercase leading-[1.15] text-[#10227f]">
          {s.title}{' '}<br className="hidden xl:inline" /><span className="text-[#e66600]">{s.titleAccent}</span>
        </h2>
        <p className="svc__lead mt-3 font-exo text-[clamp(0.8125rem,2.2cqw,1rem)] font-semibold leading-[1.55] text-[#4a4a4a]">
          <DesktopLines lines={s.leadLines} />
        </p>
      </div>

      <ul className="svc__metrics relative -mx-2 mt-0 flex max-w-[44rem] items-start justify-center sm:mx-auto">
        {s.metrics.map((metric, i) => (
          <li key={metricIcons[i].src} className="svc__metric flex w-1/5 flex-col items-center justify-center gap-1 px-0.5 text-center sm:gap-1.5 sm:px-0 xl:w-auto xl:flex-row xl:text-left" style={{ '--x': metricIcons[i].x } as CSSProperties}>
            <img src={metricIcons[i].src} alt={metric.value} className="svc__metric-icon h-[1.05rem] w-auto max-w-full shrink-0 sm:h-6" />
            <p className="svc__metric-text font-exo text-[0.5625rem] font-semibold leading-[1.2] text-white sm:text-[0.6875rem] md:text-[0.75rem]">
              {metric.lines[0]}<br className="hidden sm:inline" /> {metric.lines[1]}
            </p>
          </li>
        ))}
      </ul>

      <div className="svc__grid relative mt-12 grid grid-cols-1 gap-12">
        <div className="svc__infra text-center">
          <Sign src="/seccion01/svg/letrero_infraestructura.svg" lines={s.infraTitle} variant="infra" />
          <ul className="svc__infra-list mx-auto mt-6 flex max-w-[22rem] flex-col gap-3.5 sm:max-w-[30rem] font-exo text-[0.75rem] font-medium uppercase leading-[1.25] text-white">
            {s.infra.map((item, i) => (
              <li key={i}>
                {item.map((line, j) => (
                  <span key={j}>
                    {line.map(([text, accent], k) => <span key={k} className={accent ? 'text-[#f47621]' : undefined}>{text}</span>)}
                    {j < item.length - 1 && <>{' '}<br className="hidden xl:inline" /></>}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>

        <div className="svc__ops text-center">
          <Sign src="/seccion01/svg/letrero%20.svg" lines={s.opsTitle} variant="ops" />
          <div className="svc__flows mx-auto mt-6 grid max-w-[20rem] grid-cols-1 gap-4 sm:max-w-[40rem] sm:grid-cols-2 sm:gap-5">
            <FlowPanel title={s.imports.title} steps={s.imports.steps} icon="/seccion01/svg/btn_impo.svg" />
            <FlowPanel title={s.exports.title} steps={s.exports.steps} icon="/seccion01/svg/btn_expo.svg" />
          </div>
        </div>

        <div className="svc__caps text-center">
          <h3 className="svc__caps-title font-exo text-[1.25rem] sm:text-[1.375rem] font-bold uppercase leading-none text-[#f47621]">{s.capabilitiesTitle}</h3>
          <ul className="svc__caps-list mx-auto mt-4 flex max-w-[22rem] flex-col font-condensed text-[0.8125rem] font-bold text-white sm:grid sm:max-w-[40rem] sm:grid-flow-col sm:grid-rows-4 sm:gap-x-8 sm:text-[0.875rem] xl:flex">
            {s.capabilities.map((item) => <li key={item} className="svc__cap border-b border-[#e66600]/80 py-2">{item}</li>)}
          </ul>
        </div>

        <div className="svc__trailers text-center">
          <h3 className="svc__trailers-title font-exo text-[1.125rem] sm:text-[1.25rem] font-bold uppercase leading-none text-white">{s.trailersTitle}</h3>
          <ul className="svc__trailer-list mx-auto mt-4 grid max-w-[22rem] grid-cols-1 gap-3 sm:max-w-[40rem] sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3 sm:gap-x-5 xl:grid-flow-row xl:grid-cols-1 xl:grid-rows-none">
            {s.trailers.map((item, index) => (
              <li key={item}>
                <TrailerCard label={item} image={`/seccion01/remolques/camion${index + 1}.png`} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
