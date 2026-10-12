import { useLanguage } from '../i18n/LanguageContext';

type HeaderProps = { onContact: () => void };

// Bandera de México simplificada (no hay SVG en /public); se muestra cuando la página está en inglés
function MexicoFlag({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 21 12" className={className} aria-hidden="true">
      <rect width="7" height="12" fill="#006847" />
      <rect x="7" width="7" height="12" fill="#fff" />
      <rect x="14" width="7" height="12" fill="#ce1126" />
      <circle cx="10.5" cy="6" r="1.6" fill="#8c6a2a" />
    </svg>
  );
}

export function Header({ onContact }: HeaderProps) {
  const { lang, t, toggleLang } = useLanguage();
  const flagClass = 'h-3.5 w-auto object-contain lg:h-[clamp(0.875rem,0.9vw,1.375rem)]';

  return (
    <div className="fixed inset-x-0 top-0 z-50 lg:left-[260px]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:px-10 lg:pl-[clamp(2.5rem,4.9vw,6rem)] lg:pt-[clamp(0.75rem,1.72vw,2.5rem)]">
        <a href="#inicio" className="flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-5 py-0 sm:px-12 shadow-[0_8px_16px_rgba(20,33,110,0.65)] transition-colors hover:bg-[#f0f3ff] lg:bg-gradient-to-b lg:from-[#e2e2e2] lg:to-white lg:shadow-[0_8px_18px_rgba(40,50,90,0.35)] lg:h-[clamp(2.25rem,2.4vw,3.5rem)] lg:w-[clamp(10rem,11.1vw,16rem)] lg:px-0" aria-label={t.header.homeLabel}>
          {/* Diseño @1920: píldora 213×46px, logo ~109px de ancho */}
          <img src="/seccion01/svg/logo-lutsa.svg" alt="LUTSA Transportes" className="h-5 w-auto object-contain lg:h-auto lg:w-[clamp(4.75rem,5.7vw,8.5rem)]" />
        </a>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-[clamp(0.75rem,0.8vw,1.25rem)]">
          <button type="button" onClick={toggleLang} className="flex h-9 shrink-0 items-center gap-2 rounded-full border-2 border-[#243292] bg-white px-3 py-0.5 font-exo text-xs font-bold uppercase text-[#14216e] shadow-[0_5px_8px_rgba(20,33,110,0.45)] transition-colors hover:bg-[#f0f3ff] sm:px-5 lg:h-[clamp(2.25rem,2.45vw,3.5rem)] lg:w-[clamp(10rem,11.1vw,16rem)] lg:justify-center lg:gap-[0.9vw] lg:px-0 lg:text-nav-btn" aria-label={t.header.switchLabel}>
            {lang === 'es'
              ? <img src="/seccion01/svg/usa.svg" alt="" className={flagClass} aria-hidden="true" />
              : <MexicoFlag className={flagClass} />}
            <span className="sm:hidden">{t.header.languageShort}</span>
            <span className="hidden sm:inline">{t.header.language}</span>
            <svg viewBox="0 0 10 8" className="hidden h-2 w-2.5 fill-current sm:block lg:h-[clamp(0.5rem,0.7vw,1rem)] lg:w-[clamp(0.625rem,0.9vw,1.25rem)]" aria-hidden="true"><path d="M0 0h10L5 8z" /></svg>
          </button>
          <button type="button" onClick={onContact} className="orange-gradient flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 sm:px-5 py-0.5 font-exo text-xs font-bold uppercase text-white shadow-[0_6px_20px_rgba(230,102,0,0.8),0_0_12px_rgba(230,102,0,0.6)] transition-transform hover:scale-105 active:scale-95 sm:h-9 lg:h-[clamp(2.25rem,2.45vw,3.5rem)] lg:w-[clamp(10rem,11.1vw,16rem)] lg:justify-center lg:gap-[0.6vw] lg:px-0 lg:text-nav-btn">
            <img src="/seccion01/svg/contacto.svg" alt="" className="h-5 w-auto object-contain lg:h-[clamp(1.25rem,1.35vw,2rem)]" aria-hidden="true" />
            <span className="ml-1.5">{t.header.contact}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
