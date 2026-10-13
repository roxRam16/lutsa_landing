/// <reference types="vite/client" />
declare module '*.css';

interface ImportMetaEnv {
  /** URL del API LUTSA-CORE (por defecto http://localhost:8090). */
  readonly VITE_API_URL?: string;
  /** Clave del SITIO de Google reCAPTCHA v2 (por defecto la de prueba de Google). */
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
