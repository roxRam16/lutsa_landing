import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

// Clave del sitio de Google reCAPTCHA v2 (casilla). Por defecto la clave de PRUEBA pública de
// Google (siempre aprueba); en producción se define VITE_RECAPTCHA_SITE_KEY con la clave real.
export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

type Grecaptcha = {
  render: (el: HTMLElement, options: Record<string, unknown>) => number;
  reset: (id?: number) => void;
};
declare global {
  interface Window { grecaptcha?: Grecaptcha; __lutsaRecaptchaReady?: () => void }
}

let scriptPromise: Promise<Grecaptcha> | null = null;

// Carga el script de Google una sola vez (en el idioma de la página al momento de cargarlo).
function loadRecaptcha(lang: string): Promise<Grecaptcha> {
  if (window.grecaptcha?.render) return Promise.resolve(window.grecaptcha);
  scriptPromise ??= new Promise((resolve, reject) => {
    window.__lutsaRecaptchaReady = () => (window.grecaptcha ? resolve(window.grecaptcha) : reject(new Error('reCAPTCHA')));
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?onload=__lutsaRecaptchaReady&render=explicit&hl=${lang}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => { scriptPromise = null; reject(new Error('reCAPTCHA')); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export type RecaptchaHandle = { reset: () => void };

type Props = { lang: string; onToken: (token: string) => void };

/** Casilla "No soy un robot". Entrega el token por `onToken` ('' cuando vence o se reinicia). */
export const Recaptcha = forwardRef<RecaptchaHandle, Props>(function Recaptcha({ lang, onToken }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<number | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetId.current !== null) window.grecaptcha?.reset(widgetId.current);
      onTokenRef.current('');
    },
  }));

  useEffect(() => {
    let cancelled = false;
    loadRecaptcha(lang)
      .then((g) => {
        if (cancelled || !containerRef.current || widgetId.current !== null) return;
        widgetId.current = g.render(containerRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onTokenRef.current(''),
        });
      })
      .catch(() => onTokenRef.current(''));
    return () => { cancelled = true; };
  }, [lang]);

  return <div ref={containerRef} className="quote__recaptcha min-h-[78px]" />;
});
