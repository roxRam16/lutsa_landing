import { useCallback, useState } from 'react';
import { ContactoSection } from './components/ContactoSection';
import { Header } from './components/Header';
import { PlaceholderSections } from './components/PlaceholderSections';
import { ScrollTruckNav } from './components/ScrollTruckNav';
import { ServiciosSection } from './components/ServiciosSection';
import { useLanguage } from './i18n/LanguageContext';

// Íconos en el mismo orden que t.hero.highlights
const highlightIcons = ['/seccion00/svg/icono_conectamos.svg', '/seccion00/svg/icono_segur.svg', '/seccion00/svg/icono_veracruz.svg'];

// Une líneas con salto solo en escritorio (xl); en móvil/tablet el texto fluye
function DesktopLines({ lines }: { lines: readonly string[] }) {
  return <>{lines.map((line, i) => <span key={line}>{line}{i < lines.length - 1 && <>{' '}<br className="hidden xl:inline" /></>}</span>)}</>;
}

const teamCards = [
  { icon: 'calidad.svg', title: 'Calidad', text: 'Quejas y|sugerencias.', phone: '229 989 0010', whatsapp: '229 265 4242', email: 'calidad@lutsa.mx' },
  { icon: 'capital.svg', title: 'Capital|humano', text: 'Talento que impulsa|nuestro camino.', phone: '229 989 0011', whatsapp: '229 265 4243', email: 'capitalhumano@lutsa.mx' },
  { icon: 'monitoreo.svg', title: 'Monitoreo', text: 'Seguridad y control en tiempo|real.', phone: '229 989 0012', whatsapp: '229 265 4244', email: 'monitoreo@lutsa.mx' },
  { icon: 'market.svg', title: 'Marketing', text: 'Estrategia, comunicación y|crecimiento.', phone: '229 989 0013', whatsapp: '229 265 4245', email: 'marketing@lutsa.mx' },
];

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#f47621" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function TeamFlipCard({ card }: { card: typeof teamCards[number] }) {
  const [flipped, setFlipped] = useState(false);
  const titleLines = card.title.split('|');
  const textLines = card.text.split('|');

  return (
    <button
      type="button"
      aria-label={`${flipped ? 'Ver información de' : 'Ver detalles de'} ${titleLines.join(' ')}`}
      aria-pressed={flipped}
      onClick={() => setFlipped((current) => !current)}
      className={`flip-card h-full min-h-[174px] w-full text-center ${flipped ? 'flipped' : ''}`}
    >
      <span className="flip-card-inner block">
        <span className="flip-card-face flex-col border border-[#1b8eff] bg-[#18258f]/90 px-3 py-5 shadow-[0_0_18px_rgba(0,126,255,.85)] transition-transform">
          <img src={`/seccion02/svg/${card.icon}`} alt="" className="mb-3 h-11 w-11 object-contain" />
          <span className="font-exo text-[13px] font-bold uppercase leading-[1.05] text-[#f47621]">
            {titleLines.map((line) => <span key={line} className="block">{line}</span>)}
          </span>
          <span className="mt-2 font-exo text-[11px] leading-[1.25] text-white">
            {textLines.map((line) => <span key={line} className="block">{line}</span>)}
          </span>
        </span>
        <span className="flip-card-face flip-card-back flex-col border border-[#1b8eff] bg-[#101c91] px-2 py-4 shadow-[0_0_18px_rgba(0,126,255,.85)] font-exo text-[11px] leading-none text-white">
          <span className="flex flex-col items-center gap-1.5">
            <img src="/seccion02/svg/phone.svg" alt="" className="h-6 w-6 object-contain" />
            <span>{card.phone}</span>
          </span>
          <span className="mt-4 flex flex-col items-center gap-1.5">
            <img src="/seccion02/svg/whats.svg" alt="" className="h-6 w-6 object-contain" />
            <span>{card.whatsapp}</span>
          </span>
          <span className="mt-4 flex flex-col items-center gap-1.5">
            <EnvelopeIcon />
            <span>{card.email}</span>
          </span>
        </span>
      </span>
    </button>
  );
}

function App() {
  const { t } = useLanguage();
  const scrollToContact = useCallback((): void => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#121874]" style={{ scrollPaddingTop: '60px' }}>
      <ScrollTruckNav />
      <Header onContact={scrollToContact} />
      {/* main se desplaza a la derecha del riel fijo en desktop */}
      <main className="lg:ml-[260px]">
        <div id="inicio" className="relative min-h-screen bg-cover bg-[center_25%] bg-no-repeat" style={{ backgroundImage: "url('/seccion00/fondo_002.png')" }}>
          {/* Móvil/tablet (<xl): columna centrada (logo → texto → highlights junto al camión).
              Escritorio (xl): rejilla de 12 columnas medida sobre el diseño de 1920px. */}
          {/* Velo claro para que el texto no se pierda sobre el arco naranja en móvil/tablet */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-white/75 via-white/45 to-transparent xl:hidden" aria-hidden="true" />
          <div className="relative z-10 flex min-h-screen flex-col px-5 pb-[3.25rem] pt-20 short:pb-[3.75rem] sm:px-8 sm:pb-20 sm:pt-24 lg:px-10 lg:pb-3 lg:pt-20 xl:grid xl:grid-cols-12 xl:grid-rows-[auto_1fr_auto] xl:gap-4 xl:pl-[clamp(2.5rem,4.9vw,6rem)] xl:pt-[clamp(6rem,5.6vw,8.5rem)] xl:pb-6">
            <div className="flex justify-center xl:col-span-4 xl:col-start-5 xl:row-start-1 xl:self-start">
              <img src="/seccion00/svg/logotipo_lutsa.svg" alt="LUTSA Transportes" className="w-[clamp(8.5rem,28vw,13rem)] object-contain xl:w-[clamp(18rem,23vw,34rem)]" />
            </div>

            <div className="mx-auto mt-5 max-w-[36rem] text-center sm:mt-7 xl:col-span-4 xl:col-start-1 xl:row-start-1 xl:mx-0 xl:mt-0 xl:max-w-[480px] xl:self-start xl:text-left">
              <h1 className="font-exo text-[clamp(1.625rem,5vw,2.5rem)] font-bold uppercase leading-[1.15] text-[#10227f] xl:text-hero-title">
                <DesktopLines lines={t.hero.titleLines} />{' '}<br className="hidden xl:inline" />
                <span className="text-[#e66600]"><DesktopLines lines={t.hero.titleAccentLines} /></span>
              </h1>
              <p className="mt-3 font-exo text-[clamp(0.9375rem,2.2vw,1.125rem)] font-semibold leading-[1.45] text-[#515151] sm:mt-4 xl:mt-[clamp(1rem,1.05vw,1.75rem)] xl:text-hero-lead">
                <DesktopLines lines={t.hero.leadLines} />
              </p>
              <a href="#quienes-somos" className="orange-gradient mt-5 inline-flex h-11 items-center gap-4 rounded-full px-8 font-exo text-sm font-bold uppercase text-white shadow-[0_6px_20px_rgba(230,102,0,0.8),0_0_12px_rgba(230,102,0,0.6)] transition-transform hover:scale-105 active:scale-95 sm:mt-6 sm:h-12 sm:text-base xl:mt-[clamp(1.5rem,1.75vw,2.5rem)] xl:h-[clamp(2.75rem,2.25vw,3.5rem)] xl:w-[clamp(12rem,11.7vw,17rem)] xl:justify-center xl:gap-[1.6vw] xl:px-0 xl:text-hero-btn">
                <span>{t.hero.cta}</span>
                <span aria-hidden="true" className="text-lg leading-none">▶</span>
              </a>
            </div>

            {/* Highlights: columna vertical a la derecha del camión (<xl); fila de 3 en escritorio,
                anclada al inicio de la franja azul del fondo (ver .hero-highlights en index.css) */}
            <div className="hero-highlights mt-auto flex w-[clamp(9.5rem,40vw,16rem)] flex-col self-end pt-8 xl:mt-0 xl:grid xl:w-[clamp(23rem,28.9vw,42rem)] xl:grid-cols-6 xl:pt-0">
              {t.hero.highlights.map((lines, i) => (
                <div key={highlightIcons[i]} className="hero-highlight relative flex flex-col items-center gap-1 px-2 py-2 short:gap-0.5 short:py-1.5 sm:gap-1.5 sm:py-2.5 lg:gap-1 lg:py-1.5 xl:col-span-2 xl:justify-start xl:gap-[min(0.8vw,1.2vh)] xl:py-[0.3vw] desk-short:min-h-0 desk-short:gap-1 desk-short:py-0">
                  <img src={highlightIcons[i]} alt="" className={`relative h-7 w-7 shrink-0 object-contain short:h-6 short:w-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:h-10 sm:w-10 lg:h-9 lg:w-9 xl:h-[clamp(1.75rem,min(3vw,4.5vh),4.5rem)] xl:w-[clamp(1.75rem,min(3vw,4.5vh),4.5rem)] desk-short:h-7 desk-short:w-7 ${i === 0 ? 'xl:mt-1.5' : ''}`} />
                  <p className="relative text-center font-exo text-[0.8125rem] font-semibold leading-[1.2] text-white short:text-[0.75rem] short:leading-[1.15] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] sm:text-[0.9375rem] lg:text-[0.875rem] xl:max-w-[160px] xl:text-hero-highlight">
                    {lines.map((line) => <span key={line} className="xl:block">{line} </span>)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <section id="quienes-somos" className="relative overflow-hidden bg-[#1b2078] bg-[length:100%_auto] bg-top bg-no-repeat px-5 pb-16 pt-[34%] sm:px-8 lg:px-10 lg:pb-20" style={{ backgroundImage: "url('/seccion02/somos.png')" }}>
          <div className="absolute left-0 right-0 top-[12%] z-20 flex justify-center">
            <img src="/seccion00/svg/logotipo_lutsa.svg" alt="LUTSA Transportes" className="w-[180px] object-contain sm:w-[220px] lg:w-[260px]" />
          </div>
          <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-5 lg:gap-y-8">
            <div className="lg:col-span-3 lg:pt-1">
              <p className="text-center font-exo text-[24px] font-bold uppercase leading-[.98] tracking-[-.04em] text-white sm:text-left sm:text-[38px] lg:text-[60px]">Quiénes<span className="sm:hidden"> </span><br className="hidden sm:block" /><span className="text-[#f47621]">somos</span></p>
            </div>
            <div className="lg:col-span-6 lg:col-start-4 lg:pt-3">
              <p className="max-w-[520px] font-exo text-[13px] font-semibold leading-[1.45] text-white sm:text-[14px] lg:text-[14px]">Somos una empresa <span className="text-[#f47621]">100% mexicana</span> con más de 10 años de experiencia, dedicada a ofrecer soluciones logísticas integrales que impulsan el crecimiento de nuestros clientes.</p>
            </div>
            <div className="lg:col-span-3 lg:col-start-10 lg:pt-3">
              <p className="font-exo text-[16px] font-bold uppercase leading-[1.05] text-white">Conectamos destinos,<br /><span className="text-[#f47621]">impulsamos negocios.</span></p>
            </div>

            <div className="border-t border-[#f47621] pt-5 lg:col-span-3 lg:row-start-2 lg:pt-5">
              <p className="font-exo text-[12px] font-bold uppercase leading-[1.05] text-[#f47621]">Nuestra gente,<br /><span className="text-white">nuestro motor.</span></p>
              <p className="mt-4 font-exo text-[11px] font-medium leading-[1.45] text-white sm:text-[12px]">Contamos con un equipo comprometido y áreas especializadas que garantizan un servicio de excelencia.</p>
            </div>
            <div className="border-t border-[#f47621] pt-5 lg:col-span-9 lg:col-start-4 lg:row-start-2 lg:pt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[28px_repeat(4,minmax(0,1fr))_28px] lg:items-center lg:gap-3">
                <span className="hidden lg:flex lg:items-center lg:justify-center" aria-hidden="true">
                  <img src="/seccion02/svg/circle-left.svg" alt="" className="h-7 w-7 object-contain" />
                </span>
                {teamCards.map((card) => <TeamFlipCard key={card.icon} card={card} />)}
                <span className="hidden lg:flex lg:items-center lg:justify-center" aria-hidden="true">
                  <img src="/seccion02/svg/circle-right.svg" alt="" className="h-7 w-7 object-contain" />
                </span>
              </div>
            </div>

            <div className="lg:col-span-12 lg:row-start-3">
              <div className="grid w-full grid-cols-1 gap-3 rounded-3xl border border-[#f47621] bg-[#1a2aa0]/75 p-3 sm:grid-cols-2 lg:grid-cols-[1.15fr_1.55fr_1.25fr_1.1fr] lg:gap-0 lg:p-2">
                <div className="flex items-center gap-3 border-white/40 px-4 py-2 lg:justify-center lg:border-r">
                  <img src="/seccion02/svg/diadema.svg" alt="" className="h-12 w-12 shrink-0 object-contain" />
                  <p className="font-exo text-[17px] font-bold uppercase leading-[1.05] text-white">Necesitas<br /><span className="text-[#f47621]">atención</span></p>
                </div>
                <div className="flex items-center border-white/40 px-4 py-2 lg:justify-center lg:border-r">
                  <p className="font-exo text-[13px] font-bold leading-[1.2] text-white">Nuestro equipo está listo para ayudarte.<br /><span className="text-[11px] font-normal">Llámanos o escríbenos por WhatsApp.</span></p>
                </div>
                <div className="flex items-center gap-3 border-white/40 px-4 py-2 lg:justify-center lg:border-r">
                  <img src="/seccion02/svg/phone.svg" alt="" className="h-11 w-11 shrink-0 object-contain" />
                  <div>
                    <p className="font-exo text-[17px] font-bold leading-none text-white">229 989 0000</p>
                    <p className="mt-1 font-exo text-[11px] text-white">Atención a clientes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 lg:justify-center">
                  <img src="/seccion02/svg/whats.svg" alt="" className="h-11 w-11 shrink-0 object-contain" />
                  <div>
                    <button type="button" className="orange-gradient rounded-full px-5 py-2 font-exo text-[11px] font-bold uppercase leading-none text-white transition-transform hover:-translate-y-0.5">Escríbenos</button>
                    <p className="mt-1 font-exo text-[11px] text-white">por WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ServiciosSection />
        <PlaceholderSections />
        <ContactoSection />
      </main>
    </div>
  );
}

export default App;
