import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { parsePath, pathFor, type SectionId } from './routes';
import { applySeo } from './seo';
import { translations, type Lang, type Translations } from './translations';

const STORAGE_KEY = 'lutsa-lang';

type LanguageContextValue = {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  /** La sección visible cambió: actualiza la URL (/es/servicios…) y los metadatos sin recargar. */
  setSection: (section: SectionId) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Idioma inicial: el de la URL (/es, /en) manda; si no trae, la última elección guardada.
function getInitialLang(): Lang {
  const fromUrl = typeof window !== 'undefined' ? parsePath(window.location.pathname).lang : null;
  if (fromUrl) return fromUrl;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const initialSection = useRef<SectionId>(parsePath(window.location.pathname).section);
  const sectionRef = useRef<SectionId>(initialSection.current);
  // Mientras se baja a la sección de la URL inicial, se ignoran los avisos de "sección visible"
  // (la barra de km reporta "inicio" al montarse y pisaría la ruta, p. ej. /en/services).
  const settlingRef = useRef(initialSection.current !== 'inicio');

  // URL + metadatos del idioma y sección actuales
  const sync = useCallback((nextLang: Lang, section: SectionId) => {
    const path = pathFor(nextLang, section);
    if (window.location.pathname !== path) window.history.replaceState(null, '', path + window.location.search);
    applySeo(nextLang, section);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Sin almacenamiento disponible: el idioma solo dura la sesión.
    }
    sync(lang, sectionRef.current);
  }, [lang, sync]);

  // Al abrir una ruta de sección (/en/services) se baja a esa sección
  useEffect(() => {
    const section = initialSection.current;
    if (section === 'inicio') return;
    const scroll = window.setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior }), 400);
    const settled = window.setTimeout(() => { settlingRef.current = false; }, 1200);
    return () => { window.clearTimeout(scroll); window.clearTimeout(settled); };
  }, []);

  const setSection = useCallback((section: SectionId) => {
    if (settlingRef.current || sectionRef.current === section) return;
    sectionRef.current = section;
    sync(lang, section);
  }, [lang, sync]);

  const toggleLang = useCallback(() => setLang((current) => (current === 'es' ? 'en' : 'es')), []);
  const value = useMemo(
    () => ({ lang, t: translations[lang] as Translations, toggleLang, setSection }),
    [lang, toggleLang, setSection],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  return context;
}
