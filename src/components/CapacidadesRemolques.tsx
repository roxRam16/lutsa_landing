const capabilities = ['Transporte nacional y regional', 'Carga contenerizada y suelta', 'Refrigerados con genset', 'Desconsolidación / consolidación', 'Segregación, etiquetado y emplayado', 'Trincado certificado', 'Preloading y preparación de carga'];
const trailers = ['Sencillo con porta contenedor', 'Sencillo plataforma', 'Full de porta contenedores', 'Plana con carga suelta', 'Caja seca de 53'];

export function CapacidadesRemolques() {
  return <div className="grid gap-10 md:grid-cols-2 lg:col-span-2 lg:grid-cols-[1fr_1fr] lg:gap-14">
    <div><h2 className="font-exo text-2xl font-bold uppercase text-[#f0782d] sm:text-3xl">Capacidades</h2><ul className="mt-4 space-y-2 font-exo text-sm font-semibold text-white sm:text-base">{capabilities.map((item) => <li key={item} className="orange-underline pb-2">{item}</li>)}</ul></div>
    <div><h2 className="font-exo text-2xl font-bold uppercase text-white sm:text-3xl">Tipo de remolques</h2><ul className="mt-4 space-y-3 font-exo text-xs font-bold text-white sm:text-sm">{trailers.map((item) => <li key={item} className="orange-gradient rounded-xl px-5 py-4 text-center transition-transform hover:-translate-y-1 hover:shadow-glow">{item}</li>)}</ul></div>
  </div>;
}
