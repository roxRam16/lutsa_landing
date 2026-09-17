import { useCallback } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrollProgress } from '../hooks/useScrollProgress';

const NAV_WIDTH = 206;

const stops = [
  { id: 'inicio', label: 'RECORRIDO\nLUTSA' },
  { id: 'quienes-somos', label: '10 KM\nQUIENES\nSOMOS' },
  { id: 'servicios', label: '20 KM\nSERVICIOS' },
  { id: 'industrias', label: '30 KM\nINDUSTRIAS' },
  { id: 'ecosistema', label: '40 KM\nECOSISTEMA\nDE EMPRESAS' },
  { id: 'esr', label: '50 KM\nESR' },
  { id: 'certificaciones', label: '60 KM\nCERTIFICACIONES' },
  { id: 'contacto', label: '70 KM\nCOTIZACIÓN\nY CONTACTO' },
];

export function ScrollTruckNav() {
  const progress = useScrollProgress();
  const activeSection = useActiveSection(stops.map((stop) => stop.id));
  const truckTop = `calc(24px + ${progress * 80}%)`;

  const goNext = useCallback(() => {
    const currentIndex = stops.findIndex((s) => s.id === activeSection);
    const nextIndex = currentIndex < stops.length - 1 ? currentIndex + 1 : currentIndex;
    document.getElementById(stops[nextIndex].id)?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSection]);

  const currentIndex = stops.findIndex((s) => s.id === activeSection);
  const isLast = currentIndex >= stops.length - 1;

  return (
    <>
      <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-between rounded-full border border-white/20 bg-[#0b145f]/95 px-3 py-2 shadow-2xl backdrop-blur-md lg:hidden" aria-label="Navegación rápida">
        {stops.slice(1).map((stop) => {
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
          className="absolute inset-0 bg-left-top bg-no-repeat"
          style={{
            backgroundImage: "url('/carretera.png')",
            backgroundSize: '852px 100%',
          }}
          aria-hidden="true"
        />
        {/* Contenido del riel */}
        <div className="relative flex h-full flex-col px-5 py-9" style={{ width: `${NAV_WIDTH}px` }}>
          {/* Línea vertical blanca sobre la carretera */}
          <div className="absolute left-[25px] top-[47px] bottom-[128px] w-px bg-white/90" />

          {/* Puntos KM */}
          <div className="flex flex-1 flex-col justify-between">
            {stops.map((stop) => {
              const isActive = activeSection === stop.id;
              return (
                <a
                  key={stop.id}
                  href={`#${stop.id}`}
                  className="group relative flex items-center gap-3 text-left font-condensed text-[10px] font-medium uppercase leading-[1.05] tracking-tight text-white transition-colors hover:text-[#ff8a39]"
                >
                  <span className={`relative z-10 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#07120d] transition-all ${isActive ? 'border-[#f0782d] bg-[#e66600] ring-2 ring-white/20' : 'group-hover:border-[#f0782d]'}`}>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  <span className={isActive ? 'text-[#ff812f]' : 'text-white'}>
                    {stop.label.split('\n').map((line: string) => <span key={line} className="block">{line}</span>)}
                  </span>
                </a>
              );
            })}
          </div>

          {/* Indicador "Sigue avanzando" como botón */}
          <button
            type="button"
            onClick={goNext}
            disabled={isLast}
            className="mt-4 flex flex-col items-start gap-2 text-left font-condensed text-[10px] font-medium leading-tight text-white transition-opacity hover:text-[#ff8a39] disabled:opacity-40"
            aria-label="Avanzar a la siguiente sección"
          >
            <span>Sigue<br />avanzando</span>
            <img
              src="/seccion01/svg/flecha_avanzando.svg"
              alt=""
              className="h-8 w-8 object-contain"
            />
          </button>

          {/* Camión que se desliza proporcional al scroll */}
          <img
            src="/camion.png"
            alt="Camión recorriendo el riel"
            className="pointer-events-none absolute z-20 h-[150px] w-[70px] object-contain transition-[top] duration-300 ease-out"
            style={{ top: truckTop, left: 'calc(66.1% - 35px)' }}
          />
        </div>
      </aside>
    </>
  );
}

export { NAV_WIDTH };
