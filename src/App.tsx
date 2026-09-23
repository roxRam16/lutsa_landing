import { useCallback } from 'react';
import { ContactoSection } from './components/ContactoSection';
import { Header } from './components/Header';
import { PlaceholderSections } from './components/PlaceholderSections';
import { ScrollTruckNav } from './components/ScrollTruckNav';
import { ServiciosSection } from './components/ServiciosSection';

const highlights = [
  { icon: '/seccion00/svg/icono_conectamos.svg', text: 'Conectamos puertos, empresas y mercados.' },
  { icon: '/seccion00/svg/icono_segur.svg', text: 'Seguridad, experiencia y compromiso.' },
  { icon: '/seccion00/svg/icono_veracruz.svg', text: 'Veracruz, el punto que nos mueve.' },
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
        <div id="inicio" className="relative min-h-[500px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/seccion00/fondo_00.png')" }}>
          <div className="relative z-10 flex flex-col gap-8 px-5 pt-20 sm:flex-row sm:items-start sm:gap-10 sm:px-8 lg:px-10 lg:pt-24">
            <div className="max-w-[360px]">
              <p className="font-exo text-[2rem] font-bold uppercase leading-[.98] tracking-[-.04em] text-[#10227f] sm:text-[2.4rem]">
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
            <img src="/seccion00/svg/logotipo_lutsa.svg" alt="LUTSA Transportes" className="mt-2 w-[220px] object-contain sm:w-[260px] lg:w-[300px]" />
          </div>
          <div className="relative z-10 mx-auto mt-auto grid w-full max-w-4xl grid-cols-1 divide-y divide-[#e66600]/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {highlights.map((h) => (
              <div key={h.text} className="relative flex min-h-[160px] flex-col items-center justify-center gap-4 px-6 py-6">
                <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 bg-[#f0782d] opacity-60 blur-[4px] sm:left-0 sm:top-0 sm:h-full sm:w-px sm:translate-x-0 sm:translate-y-0" />
                <img src={h.icon} alt="" className="relative h-14 w-14 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]" />
                <p className="relative max-w-[200px] text-center font-exo text-sm font-semibold leading-[1.25] text-white sm:text-base">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
        <section id="quienes-somos" className="relative flex min-h-[360px] items-center overflow-hidden bg-[#0c145f] px-5 py-20">
          <div className="absolute -right-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border-[38px] border-[#e66600]/20" />
          <div className="relative max-w-2xl">
            <p className="font-condensed text-sm font-bold uppercase tracking-[.2em] text-[#f0782d]">LUTSA / 01</p>
            <h2 className="mt-3 font-exo text-4xl font-bold uppercase text-white sm:text-6xl">Quiénes somos</h2>
            <p className="mt-5 max-w-lg font-exo text-lg leading-relaxed text-white/80 sm:text-2xl">Experiencia, cercanía y capacidad para mover lo que tu negocio necesita.</p>
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
