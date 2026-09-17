type HeaderProps = { onContact: () => void };

export function Header({ onContact }: HeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-4 py-5 sm:px-8 lg:px-14 lg:py-8">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3">
        <a href="#inicio" className="flex h-auto w-auto items-center justify-center rounded-full bg-white px-1 py-0.5 shadow-lg transition-transform hover:scale-105" aria-label="LUTSA Transportes, ir a inicio">
          <img src="/seccion01/svg/btn_lutsa_superior.svg" alt="LUTSA Transportes" className="h-6 w-auto object-contain sm:h-8" />
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden h-9 items-center gap-2 rounded-full border-2 border-[#243292] bg-white px-5 py-0.5 font-exo text-xs font-bold text-[#14216e] shadow-lg transition-colors hover:bg-[#f0f3ff] sm:flex" aria-label="Seleccionar idioma">
            <img src="/seccion01/svg/usa.svg" alt="" className="h-3.5 w-auto object-contain" aria-hidden="true" /><span>IDIOMA</span><span aria-hidden="true">▾</span>
          </button>
          <button onClick={onContact} className="orange-gradient flex h-9 items-center gap-1.5 rounded-full px-5 py-0.5 font-exo text-xs font-bold uppercase text-white shadow-glow transition-transform hover:scale-105 active:scale-95 sm:h-9">
            <img src="/seccion01/svg/contacto.svg" alt="" className="h-5 w-auto object-contain" aria-hidden="true" /> Contacto
          </button>
        </div>
      </div>
    </header>
  );
}
