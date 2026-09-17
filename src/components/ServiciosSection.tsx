import { CapacidadesRemolques } from './CapacidadesRemolques';
import { InfraestructuraUbicacion } from './InfraestructuraUbicacion';
import { OperacionFlujos } from './OperacionFlujos';

export function ServiciosSection() {
  return <section id="servicios" className="relative overflow-hidden bg-[#16218d] pb-20 pt-12 sm:pb-28 sm:pt-16">
    <div className="absolute inset-0 bg-gradient-to-br from-[#19249d] via-[#172188] to-[#11166e]" />
    <div className="relative z-10 mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-10 lg:grid-cols-[.92fr_1.25fr_1.08fr] lg:gap-10 lg:px-16 xl:px-20">
      <InfraestructuraUbicacion />
      <OperacionFlujos />
      <CapacidadesRemolques />
    </div>
  </section>;
}
