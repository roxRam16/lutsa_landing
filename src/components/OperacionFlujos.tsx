const imports = ['Puerto', 'Patio LUTSA', 'Maniobras', 'Transporte', 'Planta / CEDIS', 'Retorno optimizado.'];
const exports = ['Planta / CEDIS', 'Recolección', 'Patio LUTSA', 'Maniobras', 'Puerto', 'Embarque.'];

function FlowColumn({ title, steps }: { title: string; steps: string[] }) {
  return <div className="rounded-xl bg-[#080f65]/75 p-4 shadow-inner sm:p-5">
    <div className="mb-4 flex items-center justify-between gap-2"><h3 className="font-exo text-lg font-bold uppercase leading-[.9] text-white">{title.slice(0, 4)}<br /><span className="text-[#f0782d]">{title.slice(4)}</span></h3><span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f0782d] bg-white text-xl text-[#e66600]">↓</span></div>
    <ol className="flex flex-col items-center gap-1 text-center font-exo text-xs font-semibold text-white sm:text-sm">
      {steps.map((step, index) => <li key={step} className="flex w-full flex-col items-center">{index > 0 && <span className="mb-1 text-lg leading-none text-[#f0782d]">⌄</span>}<span><b className="text-[#f0782d]">{index + 1}</b> {step}</span></li>)}
    </ol>
  </div>;
}

export function OperacionFlujos() {
  return <div className="min-w-0">
    <div className="orange-gradient inline-flex items-center gap-3 rounded-lg border-2 border-white/70 p-1.5 pr-5 shadow-lg">
      <span className="flex h-10 w-10 flex-col items-center justify-center rounded border-2 border-[#d65a27] bg-white font-exo text-[10px] font-bold leading-none text-[#153283]">KM<span className="text-lg">20</span></span>
      <h2 className="font-exo text-lg font-bold uppercase leading-none text-white sm:text-2xl">Operación integral<br /><span className="text-[#10227f]">flujos operativos</span></h2>
    </div>
    <div className="mt-7 grid grid-cols-2 gap-3"><FlowColumn title="Importación" steps={imports} /><FlowColumn title="Exportación" steps={exports} /></div>
  </div>;
}
