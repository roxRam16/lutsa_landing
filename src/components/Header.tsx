import type { ReactNode } from 'react';

type HeaderProps = { onContact: () => void };

type Metric = {
  icon: string;
  text: string;
  iconClass?: string;
};

const metrics: Metric[] = [
  { icon: '/seccion01/svg/unidades.svg', text: 'unidades propias\nen operación.' },
  { icon: '/seccion01/svg/colaboradores.svg', text: 'colaboradores\ncapacitados.' },
  { icon: '/seccion01/svg/patio_almacen.svg', text: 'de patio y\nalmacén propio.' },
  { icon: '/seccion01/svg/4km.svg', text: 'del Puerto de\nVeracruz.' },
  { icon: '/seccion01/svg/estacion_diesel.svg', text: 'Estación propia\nde diésel.', iconClass: 'h-5 w-5 sm:h-6 sm:w-6' },
];

const infrastructure = [
  <>Patio y almacén propio <em>(3 hectáreas)</em></>,
  <>Resguardo de contenedores <em>(vacíos y cargados)</em>.</>,
  <>Ubicación a minutos del <em>Puerto de Veracruz.</em></>,
  <>Maquinaria especializada <em>para carga y descarga.</em></>,
  <>Estación propia de <em>diésel.</em></>,
  <>Parque logístico MIL519 <em>(en desarrollo,<br />a 4 km del puerto).</em></>,
];

const imports = ['Puerto', 'Patio LUTSA', 'Maniobras', 'Transporte', 'Planta / CEDIS', 'Retorno optimizado.'];
const exports = ['Planta / CEDIS', 'Recolección', 'Patio LUTSA', 'Maniobras', 'Puerto', 'Embarque.'];
const capabilities = ['Transporte nacional y regional', 'Carga contenerizada y suelta', 'Refrigerados con genset', 'Desconsolidación / consolidación', 'Segregación, etiquetado y emplayado', 'Trincado certificado', 'Preloading y preparación de carga'];
const trailers = ['Sencillo con porta contenedor', 'Sencillo plataforma', 'Full de portacontenedores', 'Plana con carga suelta', 'Caja seca de 53'];

function Sign({ children }: { children: ReactNode }) {
  return <div className="orange-gradient inline-flex items-center gap-2 rounded-lg border-2 border-white/70 p-1.5 pr-4 shadow-lg"><span className="flex h-8 w-8 flex-col items-center justify-center rounded border-2 border-[#d65a27] bg-white font-exo text-[8px] font-bold leading-none text-[#153283]">KM<span className="text-sm">20</span></span><h2 className="font-exo text-[10px] font-bold uppercase leading-none text-white">{children}</h2></div>;
}

function FlowColumn({ title, steps }: { title: string; steps: string[] }) {
  return <div className="rounded-xl bg-[#080f65]/75 p-3 shadow-inner sm:p-4"><h3 className="mb-3 font-exo text-[10px] font-bold uppercase leading-[.9] text-white">{title.slice(0, 4)}<br /><span className="text-[#f0782d]">{title.slice(4)}</span></h3><ol className="flex flex-col items-center gap-1 text-center font-exo text-[10px] font-semibold text-white">{steps.map((step, index) => <li key={step} className="flex w-full flex-col items-center">{index > 0 && <span className="mb-1 text-lg leading-none text-[#f0782d]">⌄</span>}<span><b className="text-[#f0782d]">{index + 1}</b> {step}</span></li>)}</ol></div>;
}

export function Header({ onContact }: HeaderProps) {
  return (
    <header className="absolute inset-0 z-20 px-4 py-5 sm:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto flex h-full max-w-[1280px] flex-col">
        <div className="flex items-center justify-between gap-3">
          <a href="#inicio" className="flex h-9 items-center justify-center rounded-full bg-white px-5 py-0.5 shadow-lg transition-transform hover:scale-105" aria-label="LUTSA Transportes, ir a inicio"><img src="/seccion01/svg/logo-lutsa.svg" alt="LUTSA Transportes" className="h-4 w-auto object-contain sm:h-5" /></a>
          <div className="flex items-center gap-2 sm:gap-4"><button className="hidden h-9 items-center gap-2 rounded-full border-2 border-[#243292] bg-white px-5 py-0.5 font-exo text-xs font-bold text-[#14216e] shadow-lg transition-colors hover:bg-[#f0f3ff] sm:flex" aria-label="Seleccionar idioma"><img src="/seccion01/svg/usa.svg" alt="" className="h-3.5 w-auto object-contain" aria-hidden="true" /><span>IDIOMA</span><span aria-hidden="true">▾</span></button><button onClick={onContact} className="orange-gradient flex h-9 items-center gap-1.5 rounded-full px-5 py-0.5 font-exo text-xs font-bold uppercase text-white shadow-glow transition-transform hover:scale-105 active:scale-95 sm:h-9"><img src="/seccion01/svg/contacto.svg" alt="" className="h-5 w-auto object-contain" aria-hidden="true" /><span className="ml-1.5">Contacto</span></button></div>
        </div>

        <div className="mt-4 max-w-[640px]"><h1 className="font-exo text-[2rem] font-bold uppercase leading-[.98] tracking-[-.04em] text-[#10227f]"><span className="block pb-[1px]">Soluciones logísticas</span><span className="block pb-[1px] text-[#e66600]">que impulsan tu negocio.</span></h1><p className="mt-3 max-w-[510px] font-exo text-[14px] font-semibold leading-[1.45] text-[#515151]">Contamos con la infraestructura, experiencia y capacidad<br />para ofrecerte servicios integrales de logística, transporte<br />y comercio exterior.</p></div>

        <div className="mt-4 -mx-4 bg-gradient-to-r from-[#141c80]/40 via-[#132085]/35 to-[#11166d]/40 px-4 py-4 sm:-mx-8 sm:px-8 sm:py-5 lg:-mx-10 lg:px-10"><div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-5 sm:gap-x-10 lg:gap-x-14">{metrics.map((metric) => <div key={metric.text} className="flex items-center gap-2 sm:gap-3"><div className={`flex shrink-0 items-center justify-center ${metric.iconClass ? metric.iconClass : 'h-12 w-12 sm:h-14 sm:w-14'}`}><img src={metric.icon} alt="" className="max-h-full max-w-full object-contain" /></div><p className="whitespace-nowrap font-exo text-[10px] font-bold leading-[1.15] text-white">{metric.text.split('\n').map((line: string) => <span key={line} className="block">{line}</span>)}</p></div>)}</div></div>

        <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_1.35fr_1fr_1fr] lg:gap-7">
          <div className="min-w-0"><Sign>Infraestructura<br /><span className="text-[#10227f]">y ubicación</span></Sign><ul className="mt-4 space-y-3 font-exo text-[10px] font-bold uppercase leading-[1.05] text-white">{infrastructure.map((point, index) => <li key={index}>{point}</li>)}</ul></div>
          <div className="min-w-0"><Sign>Operación integral<br /><span className="text-[#10227f]">flujos operativos</span></Sign><div className="mt-6 grid grid-cols-2 gap-3"><FlowColumn title="Importación" steps={imports} /><FlowColumn title="Exportación" steps={exports} /></div></div>
          <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:contents"><div className="min-w-0 lg:pt-[108px]"><h2 className="font-exo text-[10px] font-bold uppercase text-[#f0782d]">Capacidades</h2><ul className="mt-3 space-y-2 font-exo text-[10px] font-semibold text-white">{capabilities.map((item) => <li key={item} className="border-b border-[#f0782d] pb-1.5">{item}</li>)}</ul></div><div className="min-w-0"><h2 className="font-exo text-[10px] font-bold uppercase text-white">Tipo de remolques</h2><ul className="mt-3 space-y-2 font-exo text-[10px] font-bold text-white">{trailers.map((item) => <li key={item} className="orange-gradient rounded-xl px-3 py-3 text-center transition-transform hover:-translate-y-1 hover:shadow-glow">{item}</li>)}</ul></div></div>
        </div>
      </div>
    </header>
  );
}
