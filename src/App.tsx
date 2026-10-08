import { useCallback, useState } from 'react';
import { ContactoSection } from './components/ContactoSection';
import { Header } from './components/Header';
import { PlaceholderSections } from './components/PlaceholderSections';
import { ScrollTruckNav } from './components/ScrollTruckNav';
import { ServiciosSection } from './components/ServiciosSection';

const highlights = [
  { icon: '/seccion00/svg/icono_conectamos.svg', lines: ['Conectamos', 'puertos,', 'empresas y', 'mercados.'] },
  { icon: '/seccion00/svg/icono_segur.svg', lines: ['Seguridad,', 'experiencia y', 'compromiso.'] },
  { icon: '/seccion00/svg/icono_veracruz.svg', lines: ['Veracruz, el', 'punto que nos', 'mueve.'] },
];

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
  const scrollToContact = useCallback((): void => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#121874]" style={{ scrollPaddingTop: '60px' }}>
      <ScrollTruckNav />
      <Header onContact={scrollToContact} />
      {/* main se desplaza a la derecha del riel fijo en desktop */}
      <main className="lg:ml-[260px]">
        <div id="inicio" className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/seccion00/fondo_00.png')" }}>
          <div className="relative z-10 grid grid-cols-1 gap-6 px-5 pt-20 pb-4 sm:px-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] lg:gap-4 lg:px-10 lg:pt-24 lg:pb-6 lg:min-h-screen">
            {/* --- Fila 1: Texto (cols 1-4) + Logo (cols 5-8) + Letreros (cols 9-12) --- */}
            <div className="max-w-[480px] lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start">
              <p className="font-exo text-[1.5rem] font-bold uppercase leading-[1.1] tracking-[-.04em] text-[#10227f] sm:text-[1.8rem] lg:text-[2rem]">
                <span className="block">Siempre en</span>
                <span className="block">movimiento,</span>
                <span className="block text-[#e66600]">conectando</span>
                <span className="block text-[#e66600]">posibilidades.</span>
              </p>
              <p className="mt-5 font-exo text-sm font-semibold leading-[1.35] text-[#515151] sm:text-base">
                Soluciones logísticas integrales<br />que impulsan tu negocio más lejos.
              </p>
              <a href="#quienes-somos" className="orange-gradient mt-6 inline-flex h-11 items-center gap-4 rounded-full px-8 font-exo text-sm font-bold uppercase text-white shadow-[0_6px_20px_rgba(230,102,0,0.8),0_0_12px_rgba(230,102,0,0.6)] transition-transform hover:scale-105 active:scale-95">
                <span>Conoce más</span>
                <span aria-hidden="true" className="text-lg leading-none">▶</span>
              </a>
            </div>

            <div className="flex items-start justify-center lg:col-span-4 lg:col-start-5 lg:row-start-1 lg:self-start lg:pt-1">
              <img src="/seccion00/svg/logotipo_lutsa.svg" alt="LUTSA Transportes" className="mt-2 w-[200px] object-contain sm:w-[240px] lg:mt-0 lg:w-[280px]" />
            </div>

            <div className="hero-highlights grid grid-cols-3 gap-2 self-end lg:col-span-6 lg:col-start-7 lg:row-start-3 lg:grid-cols-6 lg:gap-0 lg:self-end lg:pb-2">
              {highlights.map((h) => (
                <div key={h.lines.join('-')} className="hero-highlight relative flex min-h-[110px] flex-col items-center justify-center gap-1.5 px-3 py-2 lg:col-span-2 lg:min-h-[120px] lg:flex-col lg:items-center lg:justify-center lg:gap-2 lg:px-4 lg:py-4">
                  <img src={h.icon} alt="" className={`relative h-10 w-10 shrink-0 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] lg:h-14 lg:w-14 ${h.lines[0] === 'Conectamos' ? 'lg:mt-1.5' : ''}`} />
                  <p className="relative max-w-[140px] text-center font-exo text-[0.72rem] font-semibold leading-[1.1] text-white sm:text-[0.8rem] lg:max-w-[140px] lg:text-center lg:text-[0.95rem]">
                    {h.lines.map((line) => <span key={line} className="block">{line}</span>)}
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
              <p className="font-exo text-[1.75rem] font-bold uppercase leading-[.98] tracking-[-.04em] text-white sm:text-[2rem] lg:text-[2rem]">Quiénes<br /><span className="text-[#f47621]">somos</span></p>
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
