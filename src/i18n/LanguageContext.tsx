import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations, type Lang, type Translations } from './translations';

const STORAGE_KEY = 'lutsa-lang';

type LanguageContextValue = { lang: Lang; t: Translations; toggleLang: () => void };

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Sin almacenamiento disponible: el idioma solo dura la sesión.
    }
  }, [lang]);

  const toggleLang = useCallback(() => setLang((current) => (current === 'es' ? 'en' : 'es')), []);
  const value = useMemo(() => ({ lang, t: translations[lang] as Translations, toggleLang }), [lang, toggleLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  return context;
}
