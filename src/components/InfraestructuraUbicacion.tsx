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
      <img
        src="/seccion01/svg/btn_lutsa_superior.svg"
        alt="Infraestructura y ubicación, 20 kilómetros"
        className="h-auto w-full max-w-[280px] object-contain object-left"
      />
      <ul className="mt-7 space-y-4 font-exo text-sm font-semibold uppercase leading-[1.05] text-white sm:text-base">
        {points.map((point, index) => <li key={index} className="max-w-[290px]">{point}</li>)}
      </ul>
    </div>
  );
}
