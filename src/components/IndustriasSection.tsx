import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Íconos de las métricas y de la lista de presencia (mismo orden que las traducciones)
const metricIcons = ['icono_indus_1.svg', 'icono_indus_2.svg', 'icono_indus_3.svg'];
const presenceIcons = ['seguridad.svg', 'eficiencia.svg', 'cobertura.svg'];

// Íconos de industrias con su alto en el diseño (px a 1550 de ancho), según la proporción de cada SVG
const industryIcons = [
  { src: '1industrial.svg', h: 84 },
  { src: '2alimenticio.svg', h: 84 },
  { src: '3refrigerado.svg', h: 84 },
  { src: '4automotriz.svg', h: 67 },
  { src: '5mineria.svg', h: 84 },
  { src: '6agroquimico.svg', h: 85 },
  { src: '7acero.svg', h: 70 },
  { src: '8manufactura.svg', h: 84 },
];

// Animación de los porcentajes: cuentan desde 0 en secuencia (uno termina y empieza el siguiente)
const COUNT_MS = 1600;
const COUNT_GAP_MS = 250;
const GRAY = [154, 160, 181]; // #9aa0b5
const ORANGE = [230, 102, 0]; // #e66600

// "+8.5%" → { prefix: '+', target: 8.5, decimals: 1, suffix: '%' }
function parseValue(value: string) {
  const m = value.match(/^([^\d]*)([\d.]+)(.*)$/);
  if (!m) return { prefix: '', target: 0, decimals: 0, suffix: value };
  return { prefix: m[1], target: parseFloat(m[2]), decimals: m[2].split('.')[1]?.length ?? 0, suffix: m[3] };
}

function CountUpValue({ value, progress }: { value: string; progress: number }) {
  const { prefix, target, decimals, suffix } = parseValue(value);
  const eased = 1 - Math.pow(1 - progress, 3);
  const color = `rgb(${GRAY.map((g, i) => Math.round(g + (ORANGE[i] - g) * eased)).join(',')})`;
  return (
    // El valor final invisible reserva el ancho para que el texto no brinque mientras cuenta
    <span className="inline-grid">
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">{value}</span>
      <span
        className="col-start-1 row-start-1 origin-center xl:origin-left"
        style={{
          color,
          // Al llegar al naranja crece un poco (hasta 18 %) y gana un brillo naranja
          transform: `scale(${1 + 0.18 * eased})`,
          textShadow: `0 0 ${Math.round(14 * eased)}px rgba(255, 120, 20, ${(0.55 * eased).toFixed(2)})`,
        }}
        aria-hidden="true"
      >{prefix}{(target * eased).toFixed(decimals)}{suffix}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

// Progreso (0–1) de cada valor; arranca cada vez que las métricas entran en pantalla
function useSequentialCount<T extends HTMLElement>(count: number) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState<number[]>(() => Array(count).fill(0));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setProgress(Array(count).fill(1)); return; }
    let timer = 0;
    // Se reinicia cada vez que las métricas vuelven a entrar en pantalla (al subir o bajar)
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (!entry.isIntersecting) { setProgress(Array(count).fill(0)); return; }
      const start = Date.now();
      // Temporizador (~60 fps): avanza aunque el navegador no esté dibujando cuadros
      timer = window.setInterval(() => {
        const t = Date.now() - start;
        const next = Array.from({ length: count }, (_, i) => Math.min(1, Math.max(0, (t - i * (COUNT_MS + COUNT_GAP_MS)) / COUNT_MS)));
        setProgress(next);
        if (next[count - 1] >= 1) window.clearInterval(timer);
      }, 16);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => { observer.disconnect(); window.clearInterval(timer); };
  }, [count]);

  return { ref, progress };
}

// Une líneas con salto solo en escritorio (xl); en móvil/tablet el texto fluye
function DesktopLines({ lines }: { lines: readonly string[] }) {
  return <>{lines.map((line, i) => <span key={line}>{line}{i < lines.length - 1 && <>{' '}<br className="hidden xl:inline" /></>}</span>)}</>;
}

/*
 * Escritorio (xl): réplica de docs/referencias/industrias.jpg. Posiciones y tamaños en index.css
 * (bloque "Industrias") en píxeles del diseño × --u (= ancho / 1550).
 * Móvil/tablet: columna centrada; el mapa va después del párrafo introductorio.
 */
export function IndustriasSection() {
  const { t } = useLanguage();
  const s = t.industries;
  const { ref: metricsRef, progress } = useSequentialCount<HTMLUListElement>(s.metrics.length);

  return (
    <section id="industrias" className="ind relative overflow-hidden px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-16">
      <div className="ind__intro relative mx-auto max-w-[40rem] text-center">
        <h2 className="ind__title font-exo text-[clamp(1.3rem,5.4cqw,2.4rem)] font-bold uppercase leading-[1.2] text-[#10227f]">
          {s.title}{' '}<br className="hidden xl:inline" /><span className="text-[#e66600]">{s.titleAccent}</span>
        </h2>
        <p className="ind__lead mx-auto mt-4 max-w-[24rem] text-center font-exo text-[clamp(1.0625rem,4.6cqw,1.3125rem)] sm:max-w-none xl:mx-0 xl:text-left font-semibold leading-[1.5] text-[#4a4a4a]">
          <DesktopLines lines={s.leadLines} />
        </p>
      </div>

      {/* Mapa flotante */}
      <div className="ind__map relative mx-auto mt-10 w-full max-w-[36rem] sm:mt-12">
        <img loading="lazy" decoding="async" src="/seccion03/map.webp" alt={s.mapAlt} className="ind__map-img block h-auto w-full" />
      </div>

      <ul ref={metricsRef} className="ind__metrics relative mx-auto mt-8 grid max-w-[44rem] grid-cols-3 gap-3 sm:gap-6">
        {s.metrics.map((metric, i) => (
          <li key={metric.value} className="ind__metric flex flex-col items-center gap-2 text-center">
            <img loading="lazy" decoding="async" src={`/seccion03/svg/${metricIcons[i]}`} alt="" className="ind__metric-icon h-11 w-11 shrink-0 sm:h-14 sm:w-14" />
            <div className="ind__metric-body">
              <p className="ind__metric-value font-exo text-[1.375rem] font-semibold leading-none text-[#e66600] sm:text-[1.875rem]"><CountUpValue value={metric.value} progress={progress[i]} /></p>
              <p className="ind__metric-text mt-1.5 font-exo text-[0.6875rem] font-medium leading-[1.35] text-[#10227f] sm:text-[0.8125rem]">
                <DesktopLines lines={metric.lines} />
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="ind__presence relative mx-auto mt-10 max-w-[44rem] text-center">
        <h3 className="ind__presence-title font-exo text-[clamp(1rem,3.6cqw,1.375rem)] font-bold uppercase leading-[1.2] text-[#10227f]">
          {s.presenceTitle}{' '}<br className="hidden xl:inline" /><span className="text-[#e66600]">{s.presenceAccent}</span>
        </h3>
        <ul className="ind__presence-list mt-4 grid grid-cols-3 items-start gap-2 font-exo text-[0.75rem] font-medium leading-[1.25] text-[#10227f] sm:flex sm:justify-center sm:gap-8 sm:text-[0.875rem]">
          {s.presence.map((item, i) => (
            <li key={presenceIcons[i]} className="ind__presence-item flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2.5 sm:text-left">
              <img loading="lazy" decoding="async" src={`/seccion03/svg/${presenceIcons[i]}`} alt="" className="ind__presence-icon h-6 w-6 shrink-0 object-contain" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <ul className="ind__bar relative mx-auto mt-12 grid max-w-[44rem] grid-cols-4 gap-y-6 rounded-3xl px-1 py-6 sm:gap-y-8 sm:px-2 sm:py-7">
        {s.list.map((label, i) => (
          <li key={industryIcons[i].src} className="ind__item relative flex flex-col items-center justify-end gap-2 text-center" style={{ '--h': industryIcons[i].h } as CSSProperties}>
            <img loading="lazy" decoding="async" src={`/seccion03/svg/${industryIcons[i].src}`} alt="" className="ind__item-icon h-10 w-auto sm:h-14" />
            <span className="ind__item-label font-exo text-[clamp(0.5rem,2.55cqw,0.625rem)] font-bold uppercase leading-none text-[#f47621] sm:text-[0.875rem]">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
