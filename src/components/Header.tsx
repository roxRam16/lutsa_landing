type HeaderProps = { onContact: () => void };

export function Header({ onContact }: HeaderProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 lg:left-[260px]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:px-10">
        <a href="#inicio" className="flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-8 py-0.5 shadow-[0_5px_8px_rgba(20,33,110,0.45)] transition-colors hover:bg-[#f0f3ff]" aria-label="LUTSA Transportes, ir a inicio">
          <img src="/seccion01/svg/logo-lutsa.svg" alt="LUTSA Transportes" className="h-5 w-auto object-contain" />
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden h-9 items-center gap-2 rounded-full border-2 border-[#243292] bg-white px-5 py-0.5 font-exo text-xs font-bold text-[#14216e] shadow-[0_5px_8px_rgba(20,33,110,0.45)] transition-colors hover:bg-[#f0f3ff] sm:flex" aria-label="Seleccionar idioma">
            <img src="/seccion01/svg/usa.svg" alt="" className="h-3.5 w-auto object-contain" aria-hidden="true" />
            <span>IDIOMA</span>
            <span aria-hidden="true">▾</span>
          </button>
          <button onClick={onContact} className="orange-gradient flex h-9 items-center gap-1.5 rounded-full px-5 py-0.5 font-exo text-xs font-bold uppercase text-white shadow-[0_6px_20px_rgba(230,102,0,0.8),0_0_12px_rgba(230,102,0,0.6)] transition-transform hover:scale-105 active:scale-95 sm:h-9">
            <img src="/seccion01/svg/contacto.svg" alt="" className="h-5 w-auto object-contain" aria-hidden="true" />
            <span className="ml-1.5">Contacto</span>
          </button>
        </div>
      </div>
    </div>
  );
}
