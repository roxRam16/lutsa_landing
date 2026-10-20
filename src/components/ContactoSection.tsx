import { useRef, useState, type FormEvent } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { submitQuote, type QuotePayload } from '../services/quoteApi';
import { ChipGroup } from './quote/ChipGroup';
import { Recaptcha, type RecaptchaHandle } from './quote/Recaptcha';
import { SearchSelect } from './quote/SearchSelect';
import { publicUrl } from '../utils/publicUrl';

type FormState = {
  name: string;
  email: string;
  company: string;
  website: string;
  industry: string;
  service: string;
  operation: string;
  customs: string;
  goods: string;
  volume: string;
  importerRegistry: string;
  comments: string;
};
type FieldKey = keyof FormState;

const EMPTY: FormState = {
  name: '', email: '', company: '', website: '', industry: '', service: '', operation: '',
  customs: '', goods: '', volume: '', importerRegistry: '', comments: '',
};

// Límites iguales a los del API (lutsa_core/src/dtos/common.py)
const MAX = { name: 150, email: 254, company: 150, website: 150, goods: 150, volume: 150, comments: 500 } as const;
const REQUIRED: FieldKey[] = ['name', 'email', 'industry', 'service', 'operation'];

const NAME_RE = /^\p{L}[\p{L}\p{M} '.-]*$/u;
const EMAIL_RE = /^[a-z0-9._%+-]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)+$/i;
const WEBSITE_RE = /^(https?:\/\/)?([a-z0-9](-?[a-z0-9])*\.)+[a-z]{2,24}(\/[^\s<>]*)?$/i;

// Limpia lo que se escribe o pega: sin caracteres de control/invisibles ni < >.
// Los saltos de línea solo se conservan en campos de varias líneas.
function clean(value: string, multiline = false): string {
  return Array.from(value)
    .filter((ch) => {
      const c = ch.codePointAt(0) ?? 0;
      if (ch === '<' || ch === '>') return false;
      if (c === 10) return multiline;
      if (c < 32 || c === 127 || c === 0xfeff) return false;
      return !((c >= 0x200b && c <= 0x200f) || (c >= 0x202a && c <= 0x202e) || (c >= 0x2066 && c <= 0x2069));
    })
    .join('');
}

const control = 'quote__control w-full border-0 bg-[#eeeeee] px-4 font-condensed text-[1rem] font-bold tracking-[0.06em] text-brand-navy outline-none transition-shadow placeholder:text-[#ababab] focus:ring-2 focus:ring-brand-orange';
const labelCls = 'quote__label mb-2 block font-condensed text-[0.9375rem] font-bold tracking-[0.08em] text-[#000061]';
const hintCls = 'quote__hint mt-1.5 block px-4 font-condensed text-[0.875rem] font-medium text-[#6f6f6f] xl:text-[#878787]';
const invalidRing = 'ring-2 ring-[#e0464a]';

/*
 * Escritorio (xl): réplica de docs/referencias/cotizacion.png. Medidas en index.css (bloque "Cotización")
 * en píxeles del diseño × --u (= ancho / 1550). Móvil/tablet: banner centrado y formulario en 1–2 columnas.
 * El formulario se envía al API LUTSA-CORE (lutsa_core/), protegido con reCAPTCHA.
 */
export function ContactoSection() {
  const { t, lang } = useLanguage();
  const q = t.quote;
  const [form, setForm] = useState<FormState>(EMPTY);
  const [invalid, setInvalid] = useState<Set<FieldKey | 'captcha'>>(new Set());
  const [captchaToken, setCaptchaToken] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const captchaRef = useRef<RecaptchaHandle>(null);

  const set = (key: FieldKey, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setInvalid((s) => { if (!s.has(key)) return s; const n = new Set(s); n.delete(key); return n; });
    if (status?.type === 'success') setStatus(null);
  };
  const isBad = (key: FieldKey | 'captcha') => invalid.has(key);

  // Validación previa (la definitiva la hace el API)
  const validate = (): { bad: Set<FieldKey | 'captcha'>; message: string } | null => {
    const bad = new Set<FieldKey | 'captcha'>();
    let message = '';
    for (const key of REQUIRED) if (!form[key].trim()) bad.add(key);
    if (bad.size) message = q.messages.requiredFields;
    const name = form.name.trim().replace(/\s+/g, ' ');
    if (name && (name.length < 2 || !NAME_RE.test(name))) { bad.add('name'); message ||= q.messages.invalidName; }
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) { bad.add('email'); message ||= q.messages.invalidEmail; }
    if (form.website.trim() && !WEBSITE_RE.test(form.website.trim())) { bad.add('website'); message ||= q.messages.invalidWebsite; }
    if (!captchaToken) { bad.add('captcha'); message ||= q.messages.captcha; }
    return bad.size ? { bad, message } : null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const problems = validate();
    if (problems) {
      setInvalid(problems.bad);
      setStatus({ type: 'error', text: problems.message });
      return;
    }
    const trim = (v: string) => v.trim().replace(/[ \t]+/g, ' ');
    const payload: QuotePayload = {
      full_name: trim(form.name),
      email: form.email.trim().toLowerCase(),
      company: trim(form.company),
      website: form.website.trim(),
      industry: form.industry,
      service: form.service,
      operation_type: form.operation,
      customs_office: form.customs,
      goods_type: trim(form.goods),
      monthly_volume: trim(form.volume),
      importer_registry: form.importerRegistry,
      comments: form.comments.trim(),
      language: lang,
      captcha_token: captchaToken,
    };
    setSending(true);
    setStatus(null);
    const result = await submitQuote(payload);
    setSending(false);
    if (result.ok) {
      setForm(EMPTY);
      setInvalid(new Set());
      captchaRef.current?.reset();
      setStatus({ type: 'success', text: q.messages.success });
      return;
    }
    // El token del captcha es de un solo uso: tras cualquier intento hay que volver a marcarlo
    captchaRef.current?.reset();
    const text = {
      captcha: q.messages.captchaFailed,
      rateLimited: q.messages.rateLimited,
      invalid: q.messages.invalidData,
      network: q.messages.network,
      server: q.messages.server,
    }[result.reason];
    setStatus({ type: 'error', text });
  };

  // Campo de texto con su ayuda debajo
  const textField = (key: 'name' | 'email' | 'company' | 'website' | 'goods' | 'volume', area: string, opts: { type?: string; autoComplete?: string; half?: boolean } = {}) => {
    const id = `quote-${key}`;
    const field = q.fields[key];
    return (
      <div className={`quote__field ${area} ${opts.half ? '' : 'sm:col-span-2'}`}>
        <input
          id={id}
          name={key}
          type={opts.type ?? 'text'}
          inputMode={opts.type === 'email' ? 'email' : opts.type === 'url' ? 'url' : undefined}
          autoComplete={opts.autoComplete}
          value={form[key]}
          maxLength={MAX[key]}
          onChange={(e) => set(key, clean(e.target.value))}
          aria-label={field.label}
          aria-required={REQUIRED.includes(key) || undefined}
          aria-invalid={isBad(key) || undefined}
          aria-describedby={`${id}-hint`}
          placeholder={field.label}
          className={`${control} h-12 rounded-full ${isBad(key) ? invalidRing : ''}`}
        />
        <span id={`${id}-hint`} className={hintCls}>{field.hint}</span>
      </div>
    );
  };

  // Lista con buscador, etiqueta arriba y leyenda debajo
  const selectField = (key: 'industry' | 'service' | 'customs', area: string, half = true) => {
    const id = `quote-${key}`;
    const field = q.fields[key];
    return (
      <div className={`quote__field ${area} ${half ? '' : 'sm:col-span-2'}`}>
        <label htmlFor={id} className={labelCls}>{field.label}</label>
        <SearchSelect
          id={id}
          label={field.label}
          placeholder={field.placeholder}
          searchPlaceholder={q.search}
          noResults={q.noResults}
          options={q.options[key]}
          value={form[key]}
          onChange={(v) => set(key, v)}
          invalid={isBad(key)}
          describedBy={`${id}-hint`}
        />
        <span id={`${id}-hint`} className={hintCls}>{field.hint}</span>
      </div>
    );
  };

  const chipField = (key: 'operation' | 'importerRegistry', area: string) => (
    <div className={`quote__field ${area} sm:col-span-2`}>
      <span id={`quote-${key}-label`} className={labelCls}>{q.fields[key].label}</span>
      <ChipGroup labelId={`quote-${key}-label`} options={q.options[key]} value={form[key]} onChange={(v) => set(key, v)} invalid={isBad(key)} />
    </div>
  );

  return (
    <section id="contacto" className="quote relative overflow-hidden bg-white">
      <div className="quote__banner relative overflow-hidden px-6 pb-[min(40cqw,13rem)] pt-20 text-center sm:flex sm:min-h-[20rem] sm:items-center sm:px-8 sm:py-16 sm:text-left">
        <div className="quote__intro relative z-10 mx-auto max-w-[40rem] sm:mx-0 sm:max-w-[52%] xl:text-center">
          <p className="quote__kicker font-condensed text-[clamp(0.875rem,3.3cqw,1.125rem)] font-bold uppercase tracking-[0.18em] text-brand-orange-strong">{q.kicker}</p>
          <h2 className="quote__title mt-3 font-exo text-[clamp(1.75rem,7.4cqw,3.25rem)] sm:text-[clamp(1.75rem,4.6cqw,2.375rem)] font-bold uppercase leading-[1.1] text-white">{q.title}</h2>
        </div>
        <div className="quote__truck-wrap pointer-events-none absolute bottom-0 right-[-4%] z-0 w-[min(62%,24rem)] sm:w-[48%] sm:max-w-[26rem]">
          <img loading="lazy" decoding="async" src={publicUrl('/seccion07/circle-fondo.svg')} alt="" className="quote__arc absolute bottom-0 left-[-30%] w-[125%] max-w-none" />
          <img loading="lazy" decoding="async" src={publicUrl('/seccion07/camion-cotizacion.webp')} alt={q.truckAlt} className="quote__truck relative block w-full" />
        </div>
      </div>

      <form
        noValidate
        className="quote__form mx-auto grid max-w-[44rem] grid-cols-1 gap-x-5 gap-y-4 px-6 pb-24 pt-8 sm:grid-cols-2 sm:px-8 lg:pb-16"
        onSubmit={onSubmit}
      >
        {textField('name', 'q-name', { autoComplete: 'name' })}
        {textField('email', 'q-email', { type: 'email', autoComplete: 'email' })}
        {textField('company', 'q-company', { autoComplete: 'organization', half: true })}
        {textField('website', 'q-web', { type: 'url', autoComplete: 'url', half: true })}
        {selectField('industry', 'q-industry')}
        {selectField('service', 'q-service')}
        {chipField('operation', 'q-operation')}
        {selectField('customs', 'q-customs', false)}
        {textField('goods', 'q-goods', { half: true })}
        {textField('volume', 'q-volume', { half: true })}
        {chipField('importerRegistry', 'q-registry')}

        <div className="quote__field q-comments relative sm:col-span-2">
          <textarea
            id="quote-comments"
            name="comments"
            value={form.comments}
            maxLength={MAX.comments}
            onChange={(e) => set('comments', clean(e.target.value, true))}
            aria-label={q.fields.comments.label}
            placeholder={q.fields.comments.label}
            className={`${control} quote__textarea block min-h-32 resize-none rounded-2xl pb-7 pt-3`}
          />
          <span className="pointer-events-none absolute bottom-2 right-4 font-condensed text-[0.8125rem] font-medium text-[#767676] xl:text-[0.75rem] xl:text-[#9a9a9a]" aria-hidden="true">
            {form.comments.length}/{MAX.comments}
          </span>
        </div>

        <div className="quote__submit-wrap sm:col-span-2">
          <button
            type="submit"
            disabled={sending}
            className="quote__submit orange-gradient flex h-11 w-full items-center justify-center gap-2 rounded-full px-10 font-exo text-[0.9375rem] font-bold uppercase text-white shadow-[0_0_14px_rgba(244,118,33,.6)] transition-[transform,opacity] hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {sending && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />}
            {sending ? q.sending : q.cta}
          </button>
        </div>

        <div className={`quote__captcha-wrap mt-2 flex justify-center sm:col-span-2 xl:mt-0 ${isBad('captcha') ? '[&_.quote__recaptcha]:rounded-md [&_.quote__recaptcha]:ring-2 [&_.quote__recaptcha]:ring-[#e0464a]' : ''}`}>
          <Recaptcha
            ref={captchaRef}
            lang={lang}
            onToken={(token) => {
              setCaptchaToken(token);
              if (token) setInvalid((s) => { const n = new Set(s); n.delete('captcha'); return n; });
            }}
          />
        </div>

        <div className="quote__status sm:col-span-2" role="status" aria-live="polite">
          {status && (
            <p className={`flex items-start gap-3 rounded-2xl px-5 py-4 font-exo text-[0.9375rem] font-semibold ${status.type === 'success' ? 'bg-[#e8f6ee] text-[#17663a]' : 'bg-[#fdeceb] text-[#a3262a]'}`}>
              <span aria-hidden="true" className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-bold text-white ${status.type === 'success' ? 'bg-[#22a35a]' : 'bg-[#e0464a]'}`}>
                {status.type === 'success' ? '✓' : '!'}
              </span>
              {status.text}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
