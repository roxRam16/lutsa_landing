import { useCallback } from 'react';
import { CertificacionesSection } from './components/CertificacionesSection';
import { ContactoSection } from './components/ContactoSection';
import { DesktopLines } from './components/DesktopLines';
import { EcosistemaSection } from './components/EcosistemaSection';
import { GaleriaSection } from './components/GaleriaSection';
import { Header } from './components/Header';
import { IndustriasSection } from './components/IndustriasSection';
import { QuienesSomosSection } from './components/QuienesSomosSection';
import { ScrollTruckNav } from './components/ScrollTruckNav';
import { ServiciosSection } from './components/ServiciosSection';
import { useLanguage } from './i18n/LanguageContext';
import { pathFor } from './i18n/routes';
import { publicUrl } from './utils/publicUrl';

// Íconos en el mismo orden que t.hero.highlights
const highlightIcons = ['/seccion00/svg/icono_conectamos.svg', '/seccion00/svg/icono_segur.svg', '/seccion00/svg/icono_veracruz.svg'].map(publicUrl);

function App() {
  const { t, lang } = useLanguage();
  const scrollToContact = useCallback((): void => {
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-brand-navy-deep" style={{ scrollPaddingTop: '60px' }}>
      <ScrollTruckNav />
      <Header onContact={scrollToContact} />
      {/* main se desplaza a la derecha del riel fijo en desktop */}
      <main className="lg:ml-[260px]">
        <div id="inicio" className="hero-bg relative min-h-screen max-sm:min-h-[max(100svh,calc(216.5vw+9.5rem))]">
          {/* Móvil/tablet (<xl): columna centrada (logo → texto → highlights junto al camión).
              Escritorio (xl): rejilla de 12 columnas medida sobre el diseño de 1920px. */}
          {/* Velo claro para que el texto no se pierda sobre el arco naranja en móvil/tablet */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-white/75 via-white/45 to-transparent xl:hidden" aria-hidden="true" />
          <div className="relative z-10 flex min-h-screen max-sm:min-h-[max(100svh,calc(216.5vw+9.5rem))] flex-col px-5 pb-[3.5rem] pt-20 short:pb-[3.75rem] sm:px-8 sm:pb-20 sm:pt-24 lg:px-10 lg:pb-3 lg:pt-20 xl:grid xl:grid-cols-12 xl:grid-rows-[auto_1fr_auto] xl:gap-4 xl:pl-[clamp(2.5rem,4.9vw,6rem)] xl:pt-[clamp(6rem,5.6vw,8.5rem)] xl:pb-6">
            <div className="flex justify-center xl:col-span-4 xl:col-start-5 xl:row-start-1 xl:self-start">
              <img src={publicUrl('/seccion00/svg/logotipo_lutsa.svg')} alt="LUTSA Transportes" className="w-[clamp(8.5rem,28vw,13rem)] object-contain xl:w-[clamp(18rem,23vw,34rem)]" />
            </div>

            <div className="mx-auto mt-5 max-w-[36rem] text-center sm:mt-7 xl:col-span-4 xl:col-start-1 xl:row-start-1 xl:mx-0 xl:mt-0 xl:max-w-[480px] xl:self-start xl:text-left">
              <h1 className="font-exo text-[clamp(1.625rem,5vw,2.5rem)] font-bold uppercase leading-[1.15] text-brand-navy xl:text-hero-title">
                <DesktopLines lines={t.hero.titleLines} />{' '}<br className="hidden xl:inline" />
                <span className="text-brand-orange-strong"><DesktopLines lines={t.hero.titleAccentLines} /></span>
              </h1>
              <p className="mt-3 font-exo text-[clamp(1.0625rem,2.7vw,1.3125rem)] font-semibold leading-[1.45] text-[#515151] sm:mt-4 xl:mt-[clamp(1rem,1.05vw,1.75rem)] xl:text-hero-lead">
                <DesktopLines lines={t.hero.leadLines} />
              </p>
              <a href={pathFor(lang, 'quienes-somos')} onClick={(e) => { e.preventDefault(); document.getElementById('quienes-somos')?.scrollIntoView({ behavior: 'smooth' }); }} className="orange-gradient mt-5 inline-flex h-11 items-center gap-4 rounded-full px-8 font-exo text-sm font-bold uppercase text-white shadow-[0_6px_20px_rgba(230,102,0,0.8),0_0_12px_rgba(230,102,0,0.6)] transition-transform hover:scale-105 active:scale-95 sm:mt-6 sm:h-12 sm:text-base xl:mt-[clamp(1.5rem,1.75vw,2.5rem)] xl:h-[clamp(2.75rem,2.25vw,3.5rem)] xl:w-[clamp(12rem,11.7vw,17rem)] xl:justify-center xl:gap-[1.6vw] xl:px-0 xl:text-hero-btn">
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
                  <p className="relative text-center font-exo text-[0.875rem] font-semibold leading-[1.2] text-white short:text-[0.8125rem] short:leading-[1.15] drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] sm:text-[0.9375rem] lg:text-[0.875rem] xl:max-w-[160px] xl:text-hero-highlight">
                    {lines.map((line) => <span key={line} className="xl:block">{line} </span>)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <QuienesSomosSection />
        <ServiciosSection />
        <IndustriasSection />
        <EcosistemaSection />
        <ContactoSection />
        <CertificacionesSection />
        <GaleriaSection />
      </main>
    </div>
  );
}

export default App;
