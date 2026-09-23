import { useCallback } from 'react';
import { ContactoSection } from './components/ContactoSection';
import { Header } from './components/Header';
import { PlaceholderSections } from './components/PlaceholderSections';
import { ScrollTruckNav } from './components/ScrollTruckNav';
import { ServiciosSection } from './components/ServiciosSection';

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
          <div className="relative z-10 px-5 pt-20 sm:px-8 lg:px-10 lg:pt-24">
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
