const sections = [
  { id: 'ecosistema', title: 'Ecosistema de empresas', text: 'Conectamos talento, infraestructura y aliados estratégicos.' },
  { id: 'esr', title: 'ESR', text: 'Crecemos con responsabilidad y compromiso con nuestra comunidad.' },
  { id: 'certificaciones', title: 'Certificaciones', text: 'Procesos confiables, trazables y listos para los retos de tu operación.' },
];

const industries = [
  ['1industrial.svg', 'Industrial'],
  ['2alimenticio.svg', 'Alimenticio'],
  ['3refrigerado.svg', 'Refrigerado'],
  ['4automotriz.svg', 'Automotriz'],
  ['5mineria.svg', 'Minería'],
  ['6agroquimico.svg', 'Agroquímico'],
  ['7acero.svg', 'Acero'],
  ['8manufactura.svg', 'Manufactura'],
];

const metrics = [
  ['icono_indus_1.svg', '+8.5%', 'del PIB nacional son generados\npor las industrias que atendemos.'],
  ['icono_indus_2.svg', '+70%', 'del comercio exterior involucra\nproductos de estas industrias.'],
  ['icono_indus_3.svg', '+80%', 'de los productos que consumimos\ndependen de su logística.'],
];

function IndustriesSection() {
  return (
    <section id="industrias" className="relative min-h-[760px] overflow-hidden px-5 pb-7 pt-20 sm:px-8 lg:min-h-[900px] lg:px-10 lg:pt-24">
      <img src="/seccion03/industrias.png" alt="" className="absolute inset-y-0 left-0 h-full w-full object-cover object-left" />
      <img src="/seccion03/map.png" alt="Mapa de cobertura nacional" className="pointer-events-none absolute left-1/2 top-[43%] z-20 w-[104%] -translate-x-1/2 -translate-y-1/2 object-contain sm:w-[88%] lg:left-[28%] lg:top-[24%] lg:w-[60%] lg:translate-x-0 lg:translate-y-0" />
      <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-x-5">
        <div className="lg:col-span-12">
          <h1 className="font-exo text-[2rem] font-bold uppercase leading-[.98] tracking-[-.04em] text-[#10227f] sm:text-[2.4rem]">
            <span className="block">Conectamos a México</span>
            <span className="block text-[#e66600]">con lo que mueve su futuro</span>
          </h1>
          <p className="mt-4 max-w-[280px] font-exo text-[14px] font-semibold leading-[1.35] text-[#515151]">Atendemos las industrias clave<br />que impulsan el desarrollo del país.</p>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-3 lg:mt-2">
          {metrics.map(([icon, value, text]) => (
            <div key={value} className="flex items-center gap-3 border-b border-[#6475bd]/70 pb-3 pt-1">
              <img src={`/seccion03/svg/${icon}`} alt="" className="h-10 w-10 shrink-0 object-contain" />
              <div>
                <p className="font-exo text-[22px] font-bold leading-none text-[#e66600]">{value}</p>
                <p className="mt-1 whitespace-pre-line font-exo text-[12px] font-semibold leading-[1.15] text-[#18256e]">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:col-span-6 lg:block" aria-hidden="true" />

        <div className="lg:col-span-3 lg:pt-12">
          <h2 className="font-exo text-[14px] font-bold uppercase leading-[1.05] text-[#10227f]">Presencia que conecta,</h2>
          <h3 className="font-exo text-[14px] font-bold uppercase leading-[1.05] text-[#e66600]">cobertura que impulsa.</h3>
          <ul className="mt-6 space-y-4 font-exo text-[12px] font-semibold text-[#10227f]">
            <li className="flex items-center gap-3"><img src="/seccion03/svg/seguridad.svg" alt="" className="h-5 w-5 object-contain" />Seguridad en cada entrega.</li>
            <li className="flex items-center gap-3"><img src="/seccion03/svg/eficiencia.svg" alt="" className="h-5 w-5 object-contain" />Eficiencia en cada ruta.</li>
            <li className="flex items-center gap-3"><img src="/seccion03/svg/cobertura.svg" alt="" className="h-5 w-5 object-contain" />Cobertura nacional.</li>
          </ul>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-0 rounded-3xl border border-[#273dff] bg-gradient-to-b from-[#15228e] via-[#172795] to-[#243fff] px-2 py-4 shadow-[0_10px_24px_rgba(31,78,255,.95),inset_0_-12px_20px_rgba(39,61,255,.65)] sm:grid-cols-4 lg:col-span-12 lg:mt-[340px] lg:grid-cols-8 lg:px-3">
          {industries.map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center justify-center border-white/30 px-2 py-2 lg:border-r last:lg:border-r-0">
              <img src={`/seccion03/svg/${icon}`} alt="" className="h-12 w-12 object-contain sm:h-14 sm:w-14" />
              <p className="mt-2 whitespace-nowrap text-center font-exo text-[14px] font-bold uppercase leading-none text-[#e66600]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlaceholderSections() {
  return <><IndustriesSection />{sections.map((section, index) => <section key={section.id} id={section.id} className={`relative flex min-h-[360px] items-center overflow-hidden px-5 py-20 ${index % 2 ? 'bg-[#0c145f]' : 'bg-[#111a76]'}`}><div className="absolute -right-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border-[38px] border-[#e66600]/20" /><div className="relative max-w-2xl"><p className="font-condensed text-sm font-bold uppercase tracking-[.2em] text-[#f0782d]">LUTSA / 0{index + 2}</p><h2 className="mt-3 font-exo text-4xl font-bold uppercase text-white sm:text-6xl">{section.title}</h2><p className="mt-5 max-w-lg font-exo text-lg leading-relaxed text-white/80 sm:text-2xl">{section.text}</p></div></section>)}</>;
}
