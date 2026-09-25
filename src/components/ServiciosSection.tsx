import type { ReactNode } from 'react';

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
  { icon: '/seccion01/svg/estacion_diesel.svg', text: 'Estación propia\nde diésel.', iconClass: 'h-8 w-8 sm:h-10 sm:w-10' },
];

const infrastructure = [
  <>Patio y almacén propio<br /><em>(3 hectáreas)</em></>,
  <>Resguardo de contenedores<br /><em>(vacíos y cargados).</em></>,
  <>Ubicación a minutos del<br /><em>Puerto de Veracruz.</em></>,
  <>Maquinaria especializada<br /><em>para carga y descarga.</em></>,
  <>Estación propia de <em>diésel.</em></>,
  <><em>Parque logístico MIL519</em><br /><em>(en desarrollo,<br />4 km del puerto).</em></>,
];

const imports = ['Puerto', 'Patio LUTSA', 'Maniobras', 'Transporte', 'Planta / CEDIS', 'Retorno optimizado.'];
const exports = ['Planta / CEDIS', 'Recolección', 'Patio LUTSA', 'Maniobras', 'Puerto', 'Embarque.'];
const capabilities = ['Transporte nacional y regional', 'Carga contenerizada y suelta', 'Refrigerados con genset', 'Desconsolidación / consolidación', 'Segregación, etiquetado y emplayado', 'Trincado certificado', 'Preloading y preparación de carga'];
const trailers = ['Sencillo con porta contenedor', 'Sencillo plataforma', 'Full de portacontenedores', 'Plana con carga suelta', 'Caja seca de 53'];

function Sign({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`orange-gradient inline-flex items-center rounded-lg border-2 border-[#f7c29e] p-1 shadow-lg ${wide ? 'w-full' : ''}`}>
      <div className={`inline-flex items-center gap-2 rounded-md border-2 border-white/90 px-1.5 py-1 pr-3 ${wide ? 'w-full' : ''}`}>
        <img src="/seccion01/svg/km20.svg" alt="KM20" className="h-8 w-8 shrink-0 object-contain" />
        <h2 className={`font-exo font-bold uppercase leading-none text-white ${wide ? 'text-[12px] whitespace-nowrap' : 'text-[13px]'}`}>{children}</h2>
      </div>
    </div>
  );
}

function FlowColumn({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="rounded-xl bg-[#080f65]/75 p-3 shadow-inner sm:p-4">
      <h3 className="mb-3 font-exo text-[10px] font-bold uppercase leading-[.9] text-white">{title.slice(0, 4)}<br /><span className="text-[#f0782d]">{title.slice(4)}</span></h3>
      <ol className="flex flex-col items-center gap-1 text-center font-exo text-[10px] font-semibold text-white">
        {steps.map((step, index) => (
          <li key={step} className="flex w-full flex-col items-center">
            {index > 0 && <span className="mb-1 text-lg leading-none text-[#f0782d]">⌄</span>}
            <span><b className="text-[#f0782d]">{index + 1}</b> {step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ServiciosSection() {
  return (
    <section id="servicios" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/seccion01/fondo-difuminado.png')" }} />
      <div className="relative z-10 px-4 pt-20 pb-10 sm:px-8 lg:px-10 lg:pt-24 lg:pb-12">
        <div className="mx-auto max-w-[1280px]">
          <div className="mt-4 max-w-[640px]">
            <h1 className="font-exo text-[2rem] font-bold uppercase leading-[.98] tracking-[-.04em] text-[#10227f]">
              <span className="block pb-[1px]">Soluciones logísticas</span>
              <span className="block pb-[1px] text-[#e66600]">que impulsan tu negocio.</span>
            </h1>
            <div className="relative mt-3 max-w-[540px]">
              <div className="absolute -inset-x-4 -inset-y-3 rounded-full bg-white/70 blur-xl" />
              <p className="relative max-w-[510px] font-exo text-[14px] font-semibold leading-[1.45] text-[#515151]">
                Contamos con la infraestructura, experiencia y capacidad<br />para ofrecerte servicios integrales de logística, transporte<br />y comercio exterior.
              </p>
            </div>
          </div>

          <div className="mt-24 -mx-4 bg-gradient-to-r from-[#141c80]/40 via-[#132085]/35 to-[#11166d]/40 px-4 pt-6 pb-2 sm:-mx-8 sm:px-8 sm:pt-8 sm:pb-2 lg:-mx-10 lg:px-10">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-5 sm:gap-x-10 lg:gap-x-14">
              {metrics.map((metric) => (
                <div key={metric.text} className="flex items-center gap-2 sm:gap-3">
                  <div className={`flex shrink-0 items-center justify-center ${metric.iconClass ? metric.iconClass : 'h-16 w-16 sm:h-20 sm:w-20'}`}>
                    <img src={metric.icon} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                  <p className="whitespace-nowrap font-exo text-[10px] font-bold leading-[1.15] text-white">
                    {metric.text.split('\n').map((line: string) => <span key={line} className="block">{line}</span>)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-0 grid gap-6 lg:grid-cols-[1fr_1.25fr_1fr_1.25fr] lg:gap-7">
            <div className="min-w-0">
              <Sign>Infraestructura<br /><span className="text-[#10227f]">y ubicación</span></Sign>
              <ul className="mt-4 space-y-3 font-exo text-[10px] font-normal uppercase leading-[1.05] text-white">
                {infrastructure.map((point, index) => <li key={index} className="font-normal [&_em]:font-normal [&_em]:not-italic [&_em]:text-[#f0782d]">{point}</li>)}
              </ul>
            </div>
            <div className="min-w-0">
              <Sign wide>Operación integral<br /><span className="text-[#10227f]">flujos operativos</span></Sign>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <FlowColumn title="Importación" steps={imports} />
                <FlowColumn title="Exportación" steps={exports} />
              </div>
            </div>
            <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:contents">
              <div className="min-w-0 lg:pt-[108px]">
                <h2 className="font-exo text-[18px] font-bold uppercase leading-none text-[#f0782d]">Capacidades</h2>
                <ul className="mt-3 space-y-2 font-exo text-[10px] font-semibold text-white">
                  {capabilities.map((item) => <li key={item} className="whitespace-nowrap border-b border-[#f0782d] pb-0.5">{item}</li>)}
                </ul>
              </div>
              <div className="min-w-0">
                <h2 className="text-center font-exo text-[18px] font-bold uppercase leading-none text-white">Tipo de remolques</h2>
                <ul className="mt-3 space-y-2 font-exo text-[10px] font-bold text-white">
                  {trailers.map((item) => <li key={item} className="orange-gradient whitespace-nowrap rounded-xl px-4 py-5 text-center text-[9px] font-bold leading-none text-white transition-transform hover:-translate-y-1 hover:shadow-glow">{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
