import { useLanguage } from '../i18n/LanguageContext';
import { EcosistemaSection } from './EcosistemaSection';
import { IndustriasSection } from './IndustriasSection';

// Secciones aún sin diseño final: Galería (50 km) y Certificaciones (60 km)
const placeholderIds = ['galeria', 'certificaciones'];

export function PlaceholderSections() {
  const { t } = useLanguage();
  const sections = placeholderIds.map((id) => ({ id, ...t.placeholders[id] }));
  return <>
    <IndustriasSection />
    <EcosistemaSection />
    {sections.map((section, index) => (
      <section key={section.id} id={section.id} className={`relative flex min-h-[360px] items-center overflow-hidden px-5 py-20 ${index % 2 ? 'bg-[#0c145f]' : 'bg-[#111a76]'}`}>
        <div className="absolute -right-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border-[38px] border-[#e66600]/20" />
        <div className="relative max-w-2xl">
          <p className="font-condensed text-sm font-bold uppercase tracking-[.2em] text-[#f0782d]">{(index + 5) * 10} KM</p>
          <h2 className="mt-3 text-center font-exo text-[24px] font-bold uppercase text-white sm:text-left sm:text-[38px] lg:text-[60px]">{section.title}</h2>
          <p className="mt-5 max-w-lg font-exo text-lg leading-relaxed text-white/80 sm:text-2xl">{section.text}</p>
        </div>
      </section>
    ))}
  </>;
}
