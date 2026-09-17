const points = [
  <><strong>Patio y almacén propio</strong><br /><em>(3 hectáreas)</em></>,
  <><strong>Resguardo de contenedores</strong><br /><em>(vacíos y cargados).</em></>,
  <><strong>Ubicación a minutos del</strong><br /><em>Puerto de Veracruz.</em></>,
  <><strong>Maquinaria especializada</strong><br /><em>para carga y descarga.</em></>,
  <><strong>Estación propia de</strong> <em>diésel.</em></>,
  <><strong>Parque logístico MIL519</strong><br /><em>(en desarrollo),<br />a 4 km del puerto.</em></>,
];

export function InfraestructuraUbicacion() {
  return (
    <div className="min-w-0">
      <div className="orange-gradient inline-flex items-center gap-3 rounded-lg border-2 border-white/70 p-1.5 pr-5 shadow-lg">
        <span className="flex h-10 w-10 flex-col items-center justify-center rounded border-2 border-[#d65a27] bg-white font-exo text-[10px] font-bold leading-none text-[#153283]">KM<span className="text-lg">20</span></span>
        <h2 className="font-exo text-lg font-bold uppercase leading-none text-white sm:text-2xl">Infraestructura<br /><span className="text-[#10227f]">y ubicación</span></h2>
      </div>
      <ul className="mt-7 space-y-4 font-exo text-sm font-semibold uppercase leading-[1.05] text-white sm:text-base">
        {points.map((point, index) => <li key={index} className="max-w-[290px]">{point}</li>)}
      </ul>
    </div>
  );
}
