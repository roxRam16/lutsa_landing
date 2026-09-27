import { useCallback } from 'react';
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

            <div className="hero-highlights grid grid-cols-3 gap-2 self-end lg:col-span-3 lg:col-start-8 lg:row-start-3 lg:grid-cols-3 lg:gap-2 lg:self-end lg:pb-2">
              {highlights.map((h) => (
                <div key={h.lines.join('-')} className="hero-highlight relative flex min-h-[110px] flex-col items-center justify-center gap-1.5 px-3 py-2 lg:min-h-[120px] lg:flex-col lg:items-center lg:justify-center lg:gap-2 lg:px-5 lg:py-4">
                  <img src={h.icon} alt="" className={`relative h-10 w-10 shrink-0 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] lg:h-14 lg:w-14 ${h.lines[0] === 'Conectamos' ? 'lg:mt-1.5' : ''}`} />
                  <p className="relative max-w-[140px] text-center font-exo text-[0.72rem] font-semibold leading-[1.1] text-white sm:text-[0.8rem] lg:max-w-[140px] lg:text-center lg:text-[0.95rem]">
                    {h.lines.map((line) => <span key={line} className="block">{line}</span>)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <section id="quienes-somos" className="relative overflow-hidden bg-cover bg-center bg-no-repeat px-5 py-16 sm:px-8 lg:min-h-[900px] lg:px-10 lg:py-20" style={{ backgroundImage: "url('/seccion02/somos.png')" }}>
          <div className="absolute inset-0 bg-[#101b91]/10" />
          <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-5 lg:gap-y-8">
            <div className="lg:col-span-1 lg:pt-1">
              <p className="font-exo text-3xl font-bold uppercase leading-[.95] text-white sm:text-4xl lg:text-[2.4rem]">Quiénes<br /><span className="text-[#f47621]">somos</span></p>
            </div>
            <div className="lg:col-span-8 lg:col-start-2 lg:pt-3">
              <p className="max-w-[520px] font-exo text-sm font-semibold leading-[1.45] text-white sm:text-base lg:text-[1.05rem]">Somos una empresa <span className="text-[#f47621]">100% mexicana</span> con más de 10 años de experiencia, dedicada a ofrecer soluciones logísticas integrales que impulsan el crecimiento de nuestros clientes.</p>
            </div>
            <div className="lg:col-span-3 lg:col-start-10 lg:pt-3">
              <p className="font-exo text-xl font-bold uppercase leading-[1.05] text-white sm:text-2xl lg:text-[1.45rem]">Conectamos destinos,<br /><span className="text-[#f47621]">impulsamos negocios.</span></p>
            </div>

            <div className="border-t border-[#f47621] pt-5 lg:col-span-1 lg:row-start-2 lg:pt-5">
              <p className="font-exo text-base font-bold uppercase leading-[1.05] text-[#f47621]">Nuestra gente,<br /><span className="text-white">nuestro motor.</span></p>
              <p className="mt-4 font-exo text-xs font-medium leading-[1.45] text-white sm:text-sm">Contamos con un equipo comprometido y áreas especializadas que garantizan un servicio de excelencia.</p>
            </div>
            <div className="border-t border-[#f47621] pt-5 lg:col-span-11 lg:col-start-2 lg:row-start-2 lg:pt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['colaboradores.svg', 'Calidad', 'Quejas y sugerencias.'],
                  ['unidades.svg', 'Capital humano', 'Talento que impulsa nuestro camino.'],
                  ['estacion_diesel.svg', 'Monitoreo', 'Seguridad y control en tiempo real.'],
                  ['btn_naranja.svg', 'Marketing', 'Estrategia, comunicación y crecimiento.'],
                ].map(([icon, title, text]) => (
                  <article key={title} className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-[#1b8eff] bg-[#18258f]/90 px-4 py-5 text-center shadow-[0_0_18px_rgba(0,126,255,.85)] transition-transform hover:-translate-y-1">
                    <img src={`/seccion01/svg/${icon}`} alt="" className="mb-2 h-9 w-9 object-contain" />
                    <h3 className="font-exo text-sm font-bold uppercase text-[#f47621]">{title}</h3>
                    <p className="mt-1 max-w-[150px] font-exo text-xs leading-[1.25] text-white">{text}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="lg:col-span-12 lg:row-start-3">
              <div className="grid grid-cols-1 gap-3 rounded-3xl border border-[#f47621] bg-[#1a2aa0]/75 p-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:p-2">
                {[
                  ['contacto.svg', '¿Necesitas atención?', 'Nuestro equipo está listo para ayudarte.'],
                  ['flecha_avanzando.svg', '229 989 0000', 'Atención a Clientes'],
                  ['usa.svg', 'Escríbenos', 'por WhatsApp'],
                  ['btn_naranja.svg', 'Contáctanos', 'Estamos para ayudarte.'],
                ].map(([icon, title, text]) => (
                  <div key={title} className="flex items-center gap-3 border-white/40 px-4 py-2 lg:border-r last:lg:border-r-0">
                    <img src={`/seccion01/svg/${icon}`} alt="" className="h-9 w-9 shrink-0 object-contain" />
                    <div><p className="font-exo text-sm font-bold uppercase leading-[1.05] text-[#f47621]">{title}</p><p className="mt-1 font-exo text-xs text-white">{text}</p></div>
                  </div>
                ))}
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
