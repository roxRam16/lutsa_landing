type HeaderProps = { onContact: () => void };

type Metric = {
  icon: string;
  text: string;
};

const metrics: Metric[] = [
  { icon: '/seccion01/svg/unidades.svg', text: 'unidades propias\nen operación.' },
  { icon: '/seccion01/svg/colaboradores.svg', text: 'colaboradores\ncapacitados.' },
  { icon: '/seccion01/svg/patio_almacen.svg', text: 'de patio y\nalmacén propio.' },
  { icon: '/seccion01/svg/4km.svg', text: 'del Puerto de\nVeracruz.' },
  { icon: '/seccion01/svg/estacion_diesel.svg', text: 'Estación propia\nde diésel.' },
];

export function Header({ onContact }: HeaderProps) {
  return (
    <header className="absolute inset-0 z-20 px-4 py-5 sm:px-8 lg:px-14 lg:py-8">
      <div className="mx-auto flex h-full max-w-[1280px] flex-col">
        <div className="flex items-center justify-between gap-3">
          <a href="#inicio" className="flex h-auto w-auto items-center justify-center rounded-full bg-white px-1 py-0.5 shadow-lg transition-transform hover:scale-105" aria-label="LUTSA Transportes, ir a inicio">
            <img src="/seccion01/svg/btn_lutsa_superior.svg" alt="LUTSA Transportes" className="h-6 w-auto object-contain sm:h-8" />
          </a>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="hidden h-9 items-center gap-2 rounded-full border-2 border-[#243292] bg-white px-5 py-0.5 font-exo text-xs font-bold text-[#14216e] shadow-lg transition-colors hover:bg-[#f0f3ff] sm:flex" aria-label="Seleccionar idioma">
              <img src="/seccion01/svg/usa.svg" alt="" className="h-3.5 w-auto object-contain" aria-hidden="true" /><span>IDIOMA</span><span aria-hidden="true">▾</span>
            </button>
            <button onClick={onContact} className="orange-gradient flex h-9 items-center gap-1.5 rounded-full px-5 py-0.5 font-exo text-xs font-bold uppercase text-white shadow-glow transition-transform hover:scale-105 active:scale-95 sm:h-9">
              <img src="/seccion01/svg/contacto.svg" alt="" className="h-5 w-auto object-contain" aria-hidden="true" /><span className="ml-1.5">Contacto</span>
            </button>
          </div>
        </div>

        <div className="mt-4 max-w-[640px]">
          <h1 className="font-exo text-[2rem] font-bold uppercase leading-[.98] tracking-[-.04em] text-[#10227f]">
            <span className="block pb-[1px]">Soluciones logísticas</span><span className="block pb-[1px] text-[#e66600]">que impulsan tu negocio.</span>
          </h1>
          <p className="mt-3 max-w-[510px] font-exo text-[14px] font-semibold leading-[1.45] text-[#515151]">
            Contamos con la infraestructura, experiencia y capacidad<br />
            para ofrecerte servicios integrales de logística, transporte<br />
            y comercio exterior.
          </p>
        </div>

        <div className="mt-4 -mx-4 bg-gradient-to-r from-[#141c80]/95 via-[#132085]/90 to-[#11166d]/95 px-4 py-4 sm:-mx-8 sm:px-8 sm:py-5 lg:-mx-14 lg:px-14">
          <div className="grid grid-cols-2 gap-y-4 sm:grid-cols-5 sm:gap-4">
            {metrics.map((metric) => (
              <div key={metric.text} className="flex items-center gap-2 sm:gap-3">
                <img src={metric.icon} alt="" className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12" />
                <p className="font-exo text-[12px] font-bold leading-[1.1] text-white">
                  {metric.text.split('\n').map((line: string) => <span key={line}>{line}<br /></span>)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
