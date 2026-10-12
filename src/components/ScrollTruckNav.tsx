import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import { useLanguage } from '../i18n/LanguageContext';

const NAV_WIDTH = 260;

const stops = [
  { id: 'inicio', label: 'RECORRIDO\nLUTSA' },
  { id: 'quienes-somos', label: '10 KM\nQUIENES\nSOMOS' },
  { id: 'servicios', label: '20 KM\nSERVICIOS' },
  { id: 'industrias', label: '30 KM\nINDUSTRIAS' },
  { id: 'ecosistema', label: '40 KM\nECOSISTEMA\nDE EMPRESAS' },
  { id: 'esr', label: '50 KM\nESR' },
  { id: 'certificaciones', label: '60 KM\nCERTIFICACIONES' },
  { id: 'contacto', label: '70 KM\nCOTIZACIÓN\nY CONTACTO' },
  { id: '__fin__', label: '' },
];

const TRUCK_HEIGHT = 200;
const TRUCK_WIDTH = 95;
const BULLET_HEIGHT = 17;
// Barra móvil: la cabina del camioncito está al ~84% de su largo (desde la caja)
const MINI_TRUCK_CAB = 0.84;
const STOP_LABEL_MS = 2200; // tiempo que se ve el letrero grande de la parada

export function ScrollTruckNav() {
  const activeSection = useActiveSection(stops.filter((s) => s.id !== '__fin__').map((stop) => stop.id));
  const railRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [truckTop, setTruckTop] = useState('calc(24px + 0%)');
  const [lineBounds, setLineBounds] = useState<{ top: number; bottom: number } | null>(null);

  const { t } = useLanguage();
  const activeIndex = stops.findIndex((s) => s.id === activeSection);
  const activeKm = stops[activeIndex]?.label.match(/^(\d+) KM/)?.[1];

  // Letrero grande: se muestra al cambiar de parada (no en la carga inicial) y se oculta solo
  const [showStopLabel, setShowStopLabel] = useState(false);
  const firstActive = useRef(true);
  useEffect(() => {
    if (firstActive.current) { firstActive.current = false; return; }
    setShowStopLabel(true);
    const timer = window.setTimeout(() => setShowStopLabel(false), STOP_LABEL_MS);
    return () => window.clearTimeout(timer);
  }, [activeSection]);

  // Camioncito de la barra móvil: se desliza al km activo y se voltea si regresa
  const mobileStopRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [miniTruck, setMiniTruck] = useState({ x: 0, facingLeft: false });

  const updateMiniTruck = useCallback(() => {
    // La barra móvil muestra stops.slice(0, -1): sus índices coinciden con activeIndex
    const link = mobileStopRefs.current[Math.max(activeIndex, 0)];
    if (!link) return;
    const x = link.offsetLeft + link.offsetWidth / 2;
    setMiniTruck((prev) => (prev.x === x ? prev : { x, facingLeft: x < prev.x }));
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateMiniTruck();
    window.addEventListener('resize', updateMiniTruck);
    return () => window.removeEventListener('resize', updateMiniTruck);
  }, [updateMiniTruck]);

  const updateLineBounds = useCallback(() => {
    const rail = railRef.current;
    const firstEl = stopRefs.current[0];
    const lastEl = stopRefs.current[stops.length - 1];
    if (rail && firstEl && lastEl) {
      const railRect = rail.getBoundingClientRect();
      const firstRect = firstEl.getBoundingClientRect();
      const lastRect = lastEl.getBoundingClientRect();
      const bulletRadius = BULLET_HEIGHT / 2 + 2;
      setLineBounds({
        top: firstRect.top - railRect.top + bulletRadius,
        bottom: railRect.bottom - (lastRect.top - railRect.top),
      });
    }
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const railRect = rail.getBoundingClientRect();

    // El camión arranca desde muy arriba (incluso un poco fuera del riel) y avanza
    // solo un poquito por cada bullet. No salta al centro exacto de cada bullet.
    const totalStops = stops.length - 1; // sin contar __fin__
    const railHeight = railRect.height;
    const usableHeight = railHeight - TRUCK_HEIGHT + 40; // permitir que empiece más arriba
    const stepSize = usableHeight / (totalStops - 1); // distancia entre cada parada
    const truckPos = activeIndex * stepSize - 80; // offset negativo para que salga de más arriba
    setTruckTop(`${truckPos}px`);

    updateLineBounds();
  }, [activeIndex, updateLineBounds]);

  useEffect(() => {
    window.addEventListener('resize', updateLineBounds);
    return () => window.removeEventListener('resize', updateLineBounds);
  }, [updateLineBounds]);

  const goNext = useCallback(() => {
    const currentIndex = stops.findIndex((s) => s.id === activeSection);
    const nextIndex = currentIndex < stops.length - 2 ? currentIndex + 1 : currentIndex;
    const nextStop = stops[nextIndex];
    if (nextStop.id !== '__fin__') {
      document.getElementById(nextStop.id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  const currentIndex = stops.findIndex((s) => s.id === activeSection);
  const isLast = currentIndex >= stops.length - 2;

  return (
    <>
      <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-between rounded-full border border-white/20 bg-[#0b145f]/95 px-2 py-1.5 shadow-2xl backdrop-blur-md lg:hidden" aria-label={t.nav.quickNav}>
        {/* Letrero grande con el nombre de la parada; aparece al llegar y se desvanece */}
        <span
          className={`pointer-events-none absolute bottom-full left-1/2 mb-7 flex -translate-x-1/2 items-baseline gap-2 whitespace-nowrap rounded-full border border-white/20 bg-[#0b145f]/95 px-4 py-1.5 font-condensed font-bold uppercase text-white shadow-xl backdrop-blur-md transition-all duration-300 motion-reduce:transition-none ${showStopLabel ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
          aria-hidden="true"
        >
          {activeKm && <span className="text-sm text-[#ff8a39]">{activeKm} KM</span>}
          <span className="text-lg leading-none">{t.nav.stops[activeSection] ?? ''}</span>
        </span>

        {/* Camioncito encima de la barra; su cabina queda sobre la parada activa */}
        <span
          className="pointer-events-none absolute bottom-full left-0 mb-1 transition-transform duration-700 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translateX(${miniTruck.x}px)` }}
          aria-hidden="true"
        >
          <img
            src="/camion_mini.png"
            alt=""
            className="block h-[14px] w-auto max-w-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]"
            style={{ transform: miniTruck.facingLeft ? `translateX(-${(1 - MINI_TRUCK_CAB) * 100}%) scaleX(-1)` : `translateX(-${MINI_TRUCK_CAB * 100}%)` }}
          />
        </span>

        {stops.slice(0, -1).map((stop, i) => {
          const isActive = activeSection === stop.id;
          const km = stop.label.match(/^(\d+) KM/)?.[1];
          return (
            <a
              key={stop.id}
              ref={(el) => { mobileStopRefs.current[i] = el; }}
              href={`#${stop.id}`}
              aria-label={km ? `${km} KM, ${t.nav.stops[stop.id]}` : t.nav.stops[stop.id]}
              aria-current={isActive ? 'location' : undefined}
              className={`flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-full font-condensed font-bold leading-none transition-all ${isActive ? 'orange-gradient text-white' : 'text-white/75 hover:text-white'}`}
            >
              {km ? (
                <>
                  <span className="text-xs">{km}</span>
                  <span className="mt-0.5 text-[0.5rem] tracking-wide">KM</span>
                </>
              ) : (
                <img src="/favicon.svg" alt="" className={`h-5 w-5 rounded-full ${isActive ? 'bg-white p-0.5' : 'bg-white/90 p-0.5'}`} />
              )}
            </a>
          );
        })}
      </nav>

      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen overflow-hidden border-r border-white/10 lg:block"
        style={{ width: `${NAV_WIDTH}px` }}
        aria-label="Navegación por kilómetros"
      >
        <div
          className="absolute inset-0 bg-center-top bg-no-repeat"
          style={{
            backgroundImage: "url('/carretera_vertical.png')",
            backgroundSize: '100% 100%',
          }}
          aria-hidden="true"
        />
        {/* Contenido del riel */}
        <div ref={railRef} className="relative flex h-full flex-col px-5 py-4" style={{ width: `${NAV_WIDTH}px` }}>
          {/* Línea vertical blanca sobre la carretera */}
          <div
            className="absolute left-[28px] w-0.5 bg-white/90"
            style={lineBounds ? { top: `${lineBounds.top}px`, bottom: `${lineBounds.bottom}px` } : { top: '55px', bottom: '138px' }}
          />

          {/* Puntos KM */}
          <div className="flex flex-1 flex-col justify-between">
            {stops.map((stop, index) => {
              const isActive = activeSection === stop.id;
              const isEmpty = stop.id === '__fin__';
              return (
                <a
                  key={stop.id}
                  href={isEmpty ? undefined : `#${stop.id}`}
                  ref={(el) => { stopRefs.current[index] = el; }}
                  className={`group relative flex items-center gap-3 text-left font-condensed text-[10px] font-medium uppercase leading-[1.05] tracking-tight text-white transition-colors ${isEmpty ? 'pointer-events-none mb-6' : 'hover:text-[#ff8a39]'}`}
                >
                  <span className={`relative z-10 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-2 ${isActive ? 'border-[#f0782d] bg-[#e66600] ring-2 ring-white/20' : isEmpty ? 'border-[#FFAB49] bg-[#FFAB49]/30 ring-2 ring-[#FFAB49]/20' : 'border-white bg-[#07120d] group-hover:border-[#f0782d]'}`}>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  {!isEmpty && (
                    <span className={isActive ? 'text-[#ff812f]' : 'text-white'}>
                      {stop.label.split('\n').map((line: string) => <span key={line} className="block">{line}</span>)}
                    </span>
                  )}
                </a>
              );
            })}
          </div>

          {/* Indicador "Sigue avanzando" como botón */}
          <button
            type="button"
            onClick={goNext}
            disabled={isLast}
            className="mt-5 flex flex-col items-start gap-2 pl-[32px] text-left font-condensed text-[10px] font-medium leading-tight text-white transition-opacity hover:text-[#ff8a39] disabled:opacity-40"
            aria-label="Avanzar a la siguiente sección"
          >
            <span>Sigue<br />avanzando</span>
            <img
              src="/seccion01/svg/flecha_avanzando.svg"
              alt=""
              className="h-8 w-8 object-contain"
            />
          </button>

          {/* Camión que se desliza a la sección activa */}
          <img
            src="/camion.png"
            alt="Camión recorriendo el riel"
            className="pointer-events-none absolute z-20 h-[200px] w-[95px] object-contain"
            style={{ top: truckTop, left: '114px', transition: 'top 5000ms cubic-bezier(0.25, 0.1, 0.25, 1)' }}
          />
        </div>
      </aside>
    </>
  );
}

export { NAV_WIDTH };
