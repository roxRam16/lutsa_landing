import { useId, useState } from 'react';
import { useAutoFlip } from '../hooks/useAutoFlip';
import { useLanguage } from '../i18n/LanguageContext';
import { DesktopLines } from './DesktopLines';

// Recursos de cada tarjeta (mismo orden que t.certifications.cards)
const cardAssets = [
  { key: 'iso', icon: 'ico-iso.svg', logo: 'cert-iso.webp', logoW: 373, logoH: 373 },
  { key: 'esr', icon: 'ico-responsable.svg', logo: 'cert-esr.webp', logoW: 773, logoH: 367 },
  { key: 'hm', icon: 'ico-hecho.svg', logo: 'cert-hm.webp', logoW: 373, logoH: 373 },
] as const;

type CardProps = {
  asset: (typeof cardAssets)[number];
  title: readonly string[];
  backTitle: readonly string[];
  text: readonly string[];
  logoAlt: string;
  autoFlipped: boolean;
};

// Cada línea va en su propio bloque: la tarjeta escala completa (cqw), así que los saltos del diseño se conservan
function Lines({ lines }: { lines: readonly string[] }) {
  return <>{lines.map((line) => <span key={line} className="block">{line}</span>)}</>;
}

function CertCard({ asset, title, backTitle, text, logoAlt, autoFlipped }: CardProps) {
  const { t } = useLanguage();
  const [flipped, setFlipped] = useState(false);
  // Escritorio: al pasar el mouse se voltea (muestra el detalle)
  const [hovered, setHovered] = useState(false);
  const name = title.join(' ');
  const descId = useId();
  const showBack = flipped || hovered || autoFlipped;

  return (
    <button
      type="button"
      aria-label={`${flipped ? t.certifications.showInfo : t.certifications.showDetails} ${name}`}
      aria-pressed={flipped}
      aria-describedby={descId}
      onClick={() => setFlipped((current) => !current)}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      className={`cert__card cert__card--${asset.key} flip-card ${showBack ? 'flipped' : ''}`}
    >
      <span className="flip-card-inner block">
        <span className="cert__face flip-card-face">
          <img src="/seccion06/svg/recuadro%20frente.svg" alt="" className="cert__bg" />
          <img src={`/seccion06/svg/${asset.icon}`} alt="" className="cert__icon" />
          <span className="cert__front-title"><Lines lines={title} /></span>
          <img loading="lazy" decoding="async" src={`/seccion06/${asset.logo}`} width={asset.logoW} height={asset.logoH} alt={logoAlt} className="cert__logo" />
        </span>
        <span className="cert__face flip-card-face flip-card-back">
          <img src="/seccion06/svg/recuadro%20reverso.svg" alt="" className="cert__bg" />
          <span className="cert__back-title"><Lines lines={backTitle} /></span>
          <span id={descId} className="cert__back-text"><Lines lines={text} /></span>
          <span className="cert__bar" aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}

/*
 * Escritorio (xl): réplica de docs/referencias/certificaciones-A.png (y -B para el reverso de las tarjetas).
 * Las medidas viven en index.css (bloque "Certificaciones") en píxeles del diseño × --u (= ancho / 1550).
 * Móvil/tablet: foto de las personas (sin fondo), título y texto centrados y tarjetas del mismo tamaño
 * (se acomodan en columna o de dos en dos); tocar una tarjeta la voltea.
 */
export function CertificacionesSection() {
  const { t } = useLanguage();
  const c = t.certifications;
  const { autoIndex, containerProps } = useAutoFlip<HTMLDivElement>(c.cards.length);

  return (
    <section id="certificaciones" className="cert relative overflow-hidden pb-16 sm:pb-20">
      {/* Escritorio: foto con degradado hacia el blanco. Móvil/tablet: recorte de las personas */}
      <img src="/seccion06/cert-foto.webp" alt={c.photoAlt} width={2400} height={1634} loading="lazy" decoding="async" className="cert__photo hidden xl:block" />
      <img src="/seccion06/cert-gente.webp" alt={c.photoAlt} width={1500} height={839} loading="lazy" decoding="async" className="cert__people mx-auto block w-[min(100%,36rem)] px-5 pt-[4.5rem] xl:hidden" />

      <div className="cert__intro relative mx-auto max-w-[40rem] px-6 text-center sm:px-8">
        <h2 className="cert__title font-exo text-[clamp(1.75rem,7cqw,3rem)] uppercase leading-[1.12] text-brand-navy-deep">
          <span className="block font-extrabold tracking-[-0.018em]">{c.titleBold}</span>
          <span className="block font-medium">{c.title}{' '}<span className="text-brand-orange">{c.titleAccent}</span></span>
        </h2>
        <p className="cert__lead mt-4 font-exo text-[clamp(1rem,3.2cqw,1.25rem)] font-medium leading-[1.55] text-[#585858]">
          <DesktopLines lines={c.leadLines} />
        </p>
      </div>

      <div {...containerProps} className="cert__cards relative mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 px-3 sm:px-8">
        {c.cards.map((card, i) => (
          <div key={cardAssets[i].key} className="cert__slot w-full max-w-[22rem] sm:w-[21rem]">
            <CertCard asset={cardAssets[i]} title={card.title} backTitle={card.backTitle} text={card.text} logoAlt={card.logoAlt} autoFlipped={autoIndex === i} />
          </div>
        ))}
      </div>
    </section>
  );
}
