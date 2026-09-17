const sections = [
  { id: 'quienes-somos', title: 'Quiénes somos', text: 'Experiencia, cercanía y capacidad para mover lo que tu negocio necesita.' },
  { id: 'industrias', title: 'Industrias', text: 'Soluciones para las cadenas de suministro que mantienen a México en movimiento.' },
  { id: 'ecosistema', title: 'Ecosistema de empresas', text: 'Conectamos talento, infraestructura y aliados estratégicos.' },
  { id: 'esr', title: 'ESR', text: 'Crecemos con responsabilidad y compromiso con nuestra comunidad.' },
  { id: 'certificaciones', title: 'Certificaciones', text: 'Procesos confiables, trazables y listos para los retos de tu operación.' },
];

export function PlaceholderSections() {
  return <>{sections.map((section, index) => <section key={section.id} id={section.id} className={`relative flex min-h-[360px] items-center overflow-hidden px-5 py-20 ${index % 2 ? 'bg-[#0c145f]' : 'bg-[#111a76]'}`}><div className="absolute -right-28 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border-[38px] border-[#e66600]/20" /><div className="relative max-w-2xl"><p className="font-condensed text-sm font-bold uppercase tracking-[.2em] text-[#f0782d]">LUTSA / 0{index + 1}</p><h2 className="mt-3 font-exo text-4xl font-bold uppercase text-white sm:text-6xl">{section.title}</h2><p className="mt-5 max-w-lg font-exo text-lg leading-relaxed text-white/80 sm:text-2xl">{section.text}</p></div></section>)}</>;
}
