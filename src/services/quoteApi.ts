// Cliente del API LUTSA-CORE para las solicitudes de cotización.
// · Desarrollo: rutas relativas (/api/…) que Vite reenvía al API local (vite.config.ts → proxy).
//   Así también funciona a través de ngrok con un solo túnel.
// · Producción: VITE_API_URL con la URL pública del API.
export const API_URL = (import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'http://localhost:8090')).replace(/\/+$/, '');

export type QuotePayload = {
  full_name: string;
  email: string;
  company?: string;
  website?: string;
  industry: string;
  service: string;
  operation_type: string;
  customs_office?: string;
  goods_type?: string;
  monthly_volume?: string;
  importer_registry?: string;
  comments?: string;
  language: 'es' | 'en';
  captcha_token: string;
};

export type QuoteResult =
  | { ok: true }
  | { ok: false; reason: 'captcha' | 'rateLimited' | 'invalid' | 'network' | 'server' };

// Quita los campos vacíos: el API los trata como "no proporcionado".
function compact(payload: QuotePayload): Partial<QuotePayload> {
  return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== '' && v != null));
}

export async function submitQuote(payload: QuotePayload, signal?: AbortSignal): Promise<QuoteResult> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1/quote-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(compact(payload)),
      signal,
    });
  } catch {
    return { ok: false, reason: 'network' };
  }
  if (response.status === 200 || response.status === 201 || response.status === 204) return { ok: true };
  if (response.status === 400) {
    const problem = (await response.json().catch(() => ({}))) as { code?: string };
    return { ok: false, reason: problem.code === 'captcha_failed' ? 'captcha' : 'invalid' };
  }
  if (response.status === 429) return { ok: false, reason: 'rateLimited' };
  if (response.status === 413 || response.status === 422) return { ok: false, reason: 'invalid' };
  return { ok: false, reason: 'server' };
}
