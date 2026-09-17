const metrics = [
  { icon: '/seccion01/svg/unidades.svg', value: '+70', text: 'unidades propias\nen operación.' },
  { icon: '/seccion01/svg/colaboradores.svg', value: '+100', text: 'colaboradores\ncapacitados.' },
  { icon: '/seccion01/svg/patio_almacen.svg', value: '3', suffix: ' ha', text: 'de patio y\nalmacén propio.' },
  { icon: '/seccion01/svg/4km.svg', value: '4', suffix: ' km', text: 'del Puerto de\nVeracruz.' },
  { icon: '/seccion01/svg/estacion_diesel.svg', value: '', text: 'Estación propia\nde diésel.' },
];

export function HeroServicios() {
  return (
    <section id="servicios" className="relative min-h-[760px] overflow-hidden bg-[#101979] pt-28 sm:min-h-[840px] sm:pt-36 lg:min-h-[960px] lg:pt-40">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/seccion01/fondo_sin_carretera.webp')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#121874]/50" />
      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-10 lg:px-16 xl:px-20">
        <div className="max-w-[640px]">
          <h1 className="font-exo text-[clamp(2.15rem,5.2vw,4.2rem)] font-bold uppercase leading-[.98] tracking-[-.04em] text-[#10227f]">
            Soluciones logísticas<br /><span className="text-[#e66600]">que impulsan tu negocio.</span>
          </h1>
          <p className="mt-5 max-w-[510px] font-exo text-base font-semibold leading-[1.35] text-[#515151] sm:text-xl">
            Contamos con la infraestructura, experiencia y capacidad para ofrecerte servicios integrales de logística, transporte y comercio exterior.
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-r from-[#141c80]/95 via-[#132085]/90 to-[#11166d]/95 py-5 sm:py-6">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-5 px-5 sm:grid-cols-5 sm:gap-4 sm:px-10 lg:px-16 xl:px-20">
          {metrics.map((metric) => (
            <div key={metric.text} className="flex items-center gap-2 sm:gap-3">
              <img src={metric.icon} alt="" className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12" />
              <p className="font-exo text-sm font-bold leading-[1.05] text-white sm:text-base"><span className="text-2xl text-[#f0742d] sm:text-3xl">{metric.value}</span>{metric.suffix}<br />{metric.text.split('\n').map((line: string) => <span key={line}>{line}<br /></span>)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
