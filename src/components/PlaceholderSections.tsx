import { useLanguage } from '../i18n/LanguageContext';
import { CertificacionesSection } from './CertificacionesSection';
import { EcosistemaSection } from './EcosistemaSection';
import { IndustriasSection } from './IndustriasSection';

// Secciones aún sin diseño final: Galería (50 km)
const placeholderIds = ['galeria'];

export function PlaceholderSections() {
  const { t } = useLanguage();
  const sections = placeholderIds.map((id) => ({ id, ...t.placeholders[id] }));
  return <>
    <IndustriasSection />
    <EcosistemaSection />
    {sections.map((section, index) => (
      <section key={section.id} id={section.id} className={`relative flex min-h-[360px] items-center overflow-hidden px-6 py-20 ${index % 2 ? 'bg-[#0c145f]' : 'bg-[#111a76]'}`}>
        <div className="absolute -right-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border-[38px] border-brand-orange-strong/20" />
        <div className="relative mx-auto w-full max-w-2xl text-center sm:mx-0 sm:text-left">
          <p className="font-condensed text-base font-bold uppercase tracking-[.2em] sm:text-sm text-[#f0782d]">{(index + 5) * 10} KM</p>
          <h2 className="mt-3 font-exo text-[24px] font-bold uppercase text-white sm:text-left sm:text-[38px] lg:text-[60px]">{section.title}</h2>
          <p className="mx-auto mt-5 max-w-lg font-exo text-lg leading-relaxed text-white/85 sm:mx-0 sm:text-2xl">{section.text}</p>
        </div>
      </section>
    ))}
    <CertificacionesSection />
  </>;
}
