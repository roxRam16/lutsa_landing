import { useLanguage } from '../i18n/LanguageContext';

// Marcador de la Galería (70 km) hasta tener su diseño y las fotos
export function GaleriaSection() {
  const { t } = useLanguage();
  const g = t.gallery;
  return (
    <section id="galeria" className="relative flex min-h-[360px] items-center overflow-hidden bg-[#111a76] px-6 py-20">
      <div className="absolute -right-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border-[38px] border-brand-orange-strong/20" />
      <div className="relative mx-auto w-full max-w-2xl text-center sm:mx-0 sm:text-left">
        <p className="font-condensed text-base font-bold uppercase tracking-[.2em] text-[#f0782d] sm:text-sm">{g.kicker}</p>
        <h2 className="mt-3 font-exo text-[24px] font-bold uppercase text-white sm:text-left sm:text-[38px] lg:text-[60px]">{g.title}</h2>
        <p className="mx-auto mt-5 max-w-lg font-exo text-lg leading-relaxed text-white/85 sm:mx-0 sm:text-2xl">{g.text}</p>
      </div>
    </section>
  );
}
