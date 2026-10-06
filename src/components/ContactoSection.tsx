const quoteFields = [
  { label: 'Nombre completo', hint: 'Indicar su nombre completo con apellidos', type: 'input', span: 'lg:col-span-6' },
  { label: 'Correo electrónico', hint: 'Indique el correo electrónico', type: 'input', span: 'lg:col-span-3' },
  { label: 'Validar correo electrónico', hint: 'Indique nuevamente el correo electrónico', type: 'input', span: 'lg:col-span-3' },
  { label: 'Empresa', hint: 'Indicar el nombre de su empresa', type: 'input', span: 'lg:col-span-6' },
  { label: 'Página web', hint: 'Indicar la dirección de su página web', type: 'input', span: 'lg:col-span-6' },
  { label: 'Industria:', hint: 'Seleccione una opción', type: 'select', span: 'lg:col-span-6' },
  { label: 'Servicio solicitado:', hint: 'Seleccione una opción', type: 'select', span: 'lg:col-span-6' },
  { label: 'Tipo de operación:', hint: 'Seleccione una opción', type: 'select', span: 'lg:col-span-6' },
  { label: 'Aduana:', hint: 'Seleccione una opción', type: 'select', span: 'lg:col-span-6' },
  { label: 'Tipo de mercancía', hint: 'Indicar el tipo de mercancía', type: 'input', span: 'lg:col-span-6 lg:col-start-1 lg:row-start-5' },
  { label: 'Volumen mensual', hint: 'Indicar el volumen mensual', type: 'input', span: 'lg:col-span-6 lg:col-start-1 lg:row-start-6' },
  { label: '¿Cuéntas con padrón de importadores?', hint: 'Seleccione una opción', type: 'select', span: 'lg:col-span-6 lg:col-start-1 lg:row-start-7' },
  { label: 'Comentarios', hint: 'Escriba sus comentarios', type: 'textarea', span: 'lg:col-span-6 lg:col-start-7 lg:row-start-5 lg:row-span-3' },
];

function QuoteField({ field }: { field: typeof quoteFields[number] }) {
  return (
    <label className={`block ${field.span}`}>
      {field.type === 'select' && <span className="mb-2 block font-exo text-[13px] font-bold text-[#10227f]">{field.label}</span>}
      {field.type === 'textarea' ? (
        <textarea aria-label={field.label} placeholder={field.label} className="min-h-[122px] w-full resize-none rounded-xl border-0 bg-[#f0f0f0] px-4 py-3 font-exo text-[13px] text-[#10227f] outline-none ring-[#f47621] placeholder:text-[#a8a8a8] focus:ring-2" />
      ) : field.type === 'select' ? (
        <span className="relative block">
          <select aria-label={field.label} defaultValue="" className="h-10 w-full appearance-none rounded-xl border-0 bg-[#f0f0f0] px-4 pr-10 font-exo text-[13px] text-[#a8a8a8] outline-none ring-[#f47621] focus:ring-2">
            <option value="">{field.hint}</option>
          </select>
          <svg aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-[#f47621]" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : (
        <>
          <input aria-label={field.label} placeholder={field.label} className="h-10 w-full rounded-xl border-0 bg-[#f0f0f0] px-4 font-exo text-[13px] text-[#10227f] outline-none ring-[#f47621] placeholder:text-[#a8a8a8] focus:ring-2" />
          <span className="mt-1 block px-3 font-exo text-[10px] font-semibold text-[#777]">{field.hint}</span>
        </>
      )}
    </label>
  );
}

export function ContactoSection() {
  return (
    <section id="contacto" className="overflow-hidden bg-white">
      <div className="relative h-[280px] overflow-hidden bg-[#15218e] px-4 py-5 sm:h-[300px] sm:px-6 sm:py-6 lg:h-[320px] lg:px-8 lg:pb-0 lg:pt-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#111a76] via-[#1d2aa8] to-[#293eff]" />
        <div className="relative z-10 mx-auto grid h-full max-w-[1440px] grid-cols-1 items-center lg:grid-cols-12 lg:items-end">
          <div className="flex flex-col items-center text-center lg:col-span-8 lg:col-start-1 lg:pb-10">
            <p className="font-condensed text-[12px] font-bold uppercase tracking-[.2em] text-[#f0782d] sm:text-sm">70 KM / Tu siguiente movimiento</p>
            <h2 className="mt-4 max-w-none whitespace-nowrap font-exo text-[clamp(1.45rem,2.8vw,2.85rem)] font-bold uppercase leading-[.98] text-white">Hablemos de tu operación.</h2>
            <button type="button" className="orange-gradient mt-7 rounded-full px-8 py-3 font-exo text-[12px] font-bold uppercase text-white shadow-[0_0_18px_rgba(244,118,33,.72),0_8px_18px_rgba(20,31,120,.42)] transition-all hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(244,118,33,.9),0_10px_22px_rgba(20,31,120,.5)] active:translate-y-0 sm:text-[14px]">Solicita tu cotización</button>
          </div>
          <div className="relative mt-3 min-h-[130px] w-full lg:col-span-4 lg:col-start-9 lg:mt-0 lg:min-h-[190px]">
            <img src="/seccion07/circle-fondo.svg" alt="" className="pointer-events-none absolute bottom-0 left-1/2 z-[1] w-[92%] max-w-none -translate-x-1/2 object-contain sm:w-[88%] lg:w-[100%]" />
            <img src="/seccion07/camion-cotizacion.png" alt="Camión LUTSA" className="absolute bottom-0 left-1/2 z-10 w-[108%] max-w-none -translate-x-1/2 object-contain sm:w-[100%] lg:w-[118%]" />
          </div>
        </div>
      </div>
      <form className="mx-auto grid max-w-[1100px] grid-cols-1 gap-x-5 gap-y-4 px-5 pb-12 pt-6 sm:px-8 sm:pt-8 lg:grid-cols-12 lg:px-10 lg:pb-16 lg:pt-10" onSubmit={(event) => event.preventDefault()}>
        {quoteFields.map((field) => <QuoteField key={`${field.label}-${field.type}`} field={field} />)}
      </form>
    </section>
  );
}
