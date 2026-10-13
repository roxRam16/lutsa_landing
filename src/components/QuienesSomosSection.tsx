import { useState } from 'react';
import { useAutoFlip } from '../hooks/useAutoFlip';
import { useLanguage } from '../i18n/LanguageContext';

// Datos de contacto de cada área (mismo orden que t.about.cards)
const teamContacts = [
  { icon: 'calidad.svg', phone: '229 989 0010', whatsapp: '229 265 4242', email: 'calidad@lutsa.mx' },
  { icon: 'capital.svg', phone: '229 989 0011', whatsapp: '229 265 4243', email: 'capitalhumano@lutsa.mx' },
  { icon: 'monitoreo.svg', phone: '229 989 0012', whatsapp: '229 265 4244', email: 'monitoreo@lutsa.mx' },
  { icon: 'market.svg', phone: '229 989 0013', whatsapp: '229 265 4245', email: 'marketing@lutsa.mx' },
];

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="somos__card-back-icon h-6 w-6" fill="none" stroke="#f47621" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

type TeamCardProps = {
  contact: (typeof teamContacts)[number];
  title: readonly string[];
  text: readonly string[];
  autoFlipped: boolean;
};

function TeamFlipCard({ contact, title, text, autoFlipped }: TeamCardProps) {
  const { t } = useLanguage();
  const [flipped, setFlipped] = useState(false);
  // Escritorio: al pasar el mouse se voltea (muestra el contacto)
  const [hovered, setHovered] = useState(false);
  const name = title.join(' ');
  const showBack = flipped || hovered || autoFlipped;

  return (
    <button
      type="button"
      aria-label={`${flipped ? t.about.showInfo : t.about.showDetails} ${name}`}
      aria-pressed={flipped}
      onClick={() => setFlipped((current) => !current)}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      className={`somos__card flip-card h-full min-h-[11rem] w-full text-center ${showBack ? 'flipped' : ''}`}
    >
      <span className="flip-card-inner block">
        <span className="somos__card-face flip-card-face flex-col justify-center bg-[#121874] px-3 py-4 shadow-[0_0_14px_rgba(30,110,255,0.75)]">
          <img loading="lazy" decoding="async" src={`/seccion02/svg/${contact.icon}`} alt="" className="somos__card-icon mb-2.5 h-11 w-11 object-contain" />
          <span className="somos__card-title font-exo text-[0.8125rem] sm:text-[0.875rem] font-bold uppercase leading-[1.1] text-[#f47621]">
            {title.map((line) => <span key={line} className="block">{line}</span>)}
          </span>
          <span className="somos__card-text mt-1.5 font-exo text-[0.75rem] font-medium leading-[1.5] sm:text-[0.8125rem] text-white">
            {text.map((line) => <span key={line} className="block">{line}</span>)}
          </span>
        </span>
        <span className="somos__card-face somos__card-back flip-card-face flip-card-back flex-col bg-[#101c91] px-2 py-4 font-exo text-[0.75rem] shadow-[0_0_14px_rgba(30,110,255,0.75)] leading-none text-white">
          <span className="flex flex-col items-center gap-1.5">
            <img loading="lazy" decoding="async" src="/seccion02/svg/phone.svg" alt="" className="somos__card-back-icon h-6 w-6 object-contain" />
            <span>{contact.phone}</span>
          </span>
          <span className="somos__card-back-row mt-4 flex flex-col items-center gap-1.5">
            <img loading="lazy" decoding="async" src="/seccion02/svg/whats.svg" alt="" className="somos__card-back-icon h-6 w-6 object-contain" />
            <span>{contact.whatsapp}</span>
          </span>
          <span className="somos__card-back-row mt-4 flex flex-col items-center gap-1.5">
            <EnvelopeIcon />
            <span>{contact.email}</span>
          </span>
        </span>
      </span>
    </button>
  );
}

/*
 * Escritorio (xl): réplica del diseño docs/referencias/somos.png. Las medidas viven en index.css
 * (bloque "Quiénes somos") y escalan con el ancho de la sección: --u = ancho / 1548px del diseño.
 * Móvil/tablet: clases de Tailwind de este archivo.
 */
export function QuienesSomosSection() {
  const { t } = useLanguage();
  const a = t.about;

  // Volteo automático: una tarjeta a la vez, en orden aleatorio
  const { autoIndex, containerProps } = useAutoFlip<HTMLDivElement>(a.cards.length);

  return (
    <section id="quienes-somos" className="somos relative overflow-hidden px-5 pb-24 pt-[calc(37%+4.5rem)] sm:px-8 lg:px-10 lg:pb-16">
      <img loading="lazy" decoding="async" src="/seccion00/svg/logotipo_lutsa.svg" alt="LUTSA Transportes" className="somos__logo absolute left-1/2 top-[4rem] z-20 w-[28cqw] max-w-[13rem] -translate-x-1/2 object-contain" />
      <div className="somos__inner relative">

        <div className="somos__intro relative z-10 grid grid-cols-1 gap-4 text-center sm:gap-5">
          <h2 className="somos__title font-exo text-[clamp(1.75rem,6.5cqw,2.75rem)] font-bold uppercase leading-[1.05] text-white">
            {a.title}{' '}<br className="hidden xl:inline" /><span className="text-[#f47621]">{a.titleAccent}</span>
          </h2>
          <p className="somos__lead mx-auto max-w-[40rem] font-exo text-[clamp(0.875rem,2.4cqw,1.0625rem)] font-medium leading-[1.65] text-white">{a.lead}</p>
          <p className="somos__slogan font-exo text-[clamp(1rem,3.4cqw,1.375rem)] font-bold uppercase leading-[1.3] text-white">
            {a.slogan}{' '}<br className="hidden xl:inline" /><span className="text-[#f47621]">{a.sloganAccent}</span>
          </p>
        </div>

        <div className="somos__divider my-8 h-px bg-[#f47621]/70" aria-hidden="true" />

        <div className="somos__team relative z-10 grid grid-cols-1 gap-8">
          <div className="somos__people text-center">
            <p className="somos__people-title font-exo text-[clamp(1rem,3.4cqw,1.375rem)] font-bold uppercase leading-[1.3] text-[#f47621]">
              {a.peopleTitle}{' '}<br className="hidden xl:inline" /><span className="text-white">{a.peopleTitleAccent}</span>
            </p>
            <p className="somos__people-text mx-auto mt-3 max-w-[36rem] font-exo text-[clamp(0.8125rem,2.3cqw,1rem)] font-medium leading-[1.65] text-white">{a.peopleText}</p>
          </div>

          <div {...containerProps} className="somos__carousel relative">
            <span className="somos__arrow somos__arrow--prev hidden" aria-hidden="true">
              <img loading="lazy" decoding="async" src="/seccion02/svg/circle-left.svg" alt="" className="h-full w-full object-contain" />
            </span>
            <div className="somos__cards grid grid-cols-2 gap-4 md:grid-cols-4">
              {a.cards.map((card, i) => <TeamFlipCard key={teamContacts[i].icon} contact={teamContacts[i]} title={card.title} text={card.text} autoFlipped={autoIndex === i} />)}
            </div>
            <span className="somos__arrow somos__arrow--next hidden" aria-hidden="true">
              <img loading="lazy" decoding="async" src="/seccion02/svg/circle-right.svg" alt="" className="h-full w-full object-contain" />
            </span>
          </div>
        </div>

        <div className="somos__help relative z-10 mt-10 grid grid-cols-2 gap-x-2 gap-y-5 rounded-3xl border border-[#f47621] bg-[#2330cf]/40 px-4 py-6 text-center sm:grid-cols-2 sm:gap-x-4 sm:gap-y-6">
          <div className="somos__help-cell col-span-2 flex items-center justify-center gap-3 sm:col-span-1">
            <img loading="lazy" decoding="async" src="/seccion02/svg/diadema.svg" alt="" className="somos__help-headset h-10 w-10 shrink-0 object-contain" />
            <p className="somos__help-title font-exo text-[clamp(1rem,3.4cqw,1.375rem)] sm:text-[1.0625rem] font-bold uppercase leading-[1.1] text-white">
              {a.help.title}{' '}<br className="hidden xl:inline" /><span className="text-[#f47621]">{a.help.titleAccent}</span>
            </p>
          </div>
          <div className="somos__help-cell col-span-2 flex items-center justify-center sm:col-span-1">
            <p className="somos__help-text font-exo text-[0.875rem] font-bold leading-[1.4] text-white">
              {a.help.text}{' '}<br className="hidden xl:inline" /><span className="somos__help-text-sub font-medium">{a.help.textSub}</span>
            </p>
          </div>
          <div className="somos__help-cell flex items-center justify-center gap-2 sm:gap-3">
            <img loading="lazy" decoding="async" src="/seccion02/svg/phone.svg" alt="" className="somos__help-phone h-7 w-7 sm:h-11 sm:w-11 shrink-0 object-contain" />
            <div>
              <p className="somos__help-tel whitespace-nowrap font-exo text-[0.9375rem] font-bold sm:text-[1.25rem] leading-none text-white">229 989 0000</p>
              <p className="somos__help-label mt-1 whitespace-nowrap font-exo text-[0.6875rem] font-medium text-white sm:text-[0.8125rem]">{a.help.phoneLabel}</p>
            </div>
          </div>
          <div className="somos__help-cell flex items-center justify-center gap-2 sm:gap-3">
            <img loading="lazy" decoding="async" src="/seccion02/svg/whats.svg" alt="" className="somos__help-wa h-7 w-7 sm:h-11 sm:w-11 shrink-0 object-contain" />
            <div className="somos__help-cta-wrap flex flex-col items-center">
              <button type="button" className="somos__help-cta orange-gradient whitespace-nowrap rounded-full px-3 py-1.5 font-exo text-[0.6875rem] sm:px-5 sm:py-2 sm:text-[12px] font-bold uppercase leading-none text-white transition-transform hover:-translate-y-0.5">{a.help.cta}</button>
              <p className="somos__help-label mt-1 whitespace-nowrap font-exo text-[0.6875rem] font-medium text-white sm:text-[0.8125rem]">{a.help.ctaSub}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
