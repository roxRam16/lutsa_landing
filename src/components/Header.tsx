type HeaderProps = { onContact: () => void };

export function Header({ onContact }: HeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 px-4 py-5 sm:px-8 lg:px-14 lg:py-8">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3">
        <a href="#inicio" className="flex h-auto w-auto items-center justify-center rounded-full bg-white px-3 py-1.5 shadow-lg transition-transform hover:scale-105" aria-label="LUTSA Transportes, ir a inicio">
          <img src="/seccion01/svg/btn_lutsa_superior.svg" alt="LUTSA Transportes" className="h-8 w-auto object-contain sm:h-10" />
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden h-12 items-center gap-3 rounded-full border-2 border-[#243292] bg-white px-5 font-exo text-sm font-bold text-[#14216e] shadow-lg transition-colors hover:bg-[#f0f3ff] sm:flex" aria-label="Seleccionar idioma">
            <span className="flex h-4 w-6 overflow-hidden rounded-sm border border-slate-300" aria-hidden="true"><span className="w-2/5 bg-[#173a8f]" /><span className="flex-1 bg-white" /></span><span>IDIOMA</span><span aria-hidden="true">▾</span>
          </button>
          <button onClick={onContact} className="orange-gradient flex h-12 items-center gap-2 rounded-full px-5 font-exo text-sm font-bold uppercase text-white shadow-glow transition-transform hover:scale-105 active:scale-95 sm:h-14 sm:px-7 sm:text-base">
            <span className="text-xl" aria-hidden="true">◉</span> Contacto
          </button>
        </div>
      </div>
    </header>
  );
}
