import { useCallback, useEffect, useRef, useState } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrollProgress } from '../hooks/useScrollProgress';

const NAV_WIDTH = 240;

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

const TRUCK_HEIGHT = 230;
const TRUCK_WIDTH = 110;
const BULLET_HEIGHT = 17;

export function ScrollTruckNav() {
  const progress = useScrollProgress();
  const activeSection = useActiveSection(stops.filter((s) => s.id !== '__fin__').map((stop) => stop.id));
  const railRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [truckTop, setTruckTop] = useState('calc(24px + 0%)');
  const [lineBounds, setLineBounds] = useState<{ top: number; bottom: number } | null>(null);

  const activeIndex = stops.findIndex((s) => s.id === activeSection);

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

    const stopEl = stopRefs.current[activeIndex];
    if (stopEl) {
      const stopRect = stopEl.getBoundingClientRect();
      const bulletCenter = stopRect.top - railRect.top + BULLET_HEIGHT / 2;
      const offset = activeIndex === 0 ? 80 : 0;
      setTruckTop(`${bulletCenter - offset}px`);
    }

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
      <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-between rounded-full border border-white/20 bg-[#0b145f]/95 px-3 py-2 shadow-2xl backdrop-blur-md lg:hidden" aria-label="Navegación rápida">
        {stops.slice(1, -1).map((stop) => {
          const isActive = activeSection === stop.id;
          return <a key={stop.id} href={`#${stop.id}`} className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-condensed text-xs font-bold transition-all ${isActive ? 'orange-gradient text-white' : 'text-white/75 hover:text-white'}`} aria-label={stop.label.replace(/\n/g, ' ')}>{stop.label.split('\n')[0].replace(' KM', '')}</a>;
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
        <div ref={railRef} className="relative flex h-full flex-col px-5 py-9" style={{ width: `${NAV_WIDTH}px` }}>
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
                  <span className={`relative z-10 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-2 transition-all ${isActive ? 'border-[#f0782d] bg-[#e66600] ring-2 ring-white/20' : isEmpty ? 'border-[#FFAB49] bg-[#FFAB49]/30 ring-2 ring-[#FFAB49]/20' : 'border-white bg-[#07120d] group-hover:border-[#f0782d]'}`}>
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
            className="pointer-events-none absolute z-20 h-[230px] w-[110px] object-contain transition-[top] duration-2000 ease-in-out"
            style={{ top: truckTop, left: '94px' }}
          />
        </div>
      </aside>
    </>
  );
}

export { NAV_WIDTH };
