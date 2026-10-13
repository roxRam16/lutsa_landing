import type { KeyboardEvent } from 'react';
import type { Option } from './SearchSelect';

type Props = {
  labelId: string;
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

/** Opciones como chips (grupo de radio accesible): la elegida queda activa en azul. */
export function ChipGroup({ labelId, options, value, onChange, invalid, describedBy }: Props) {
  const index = options.findIndex((o) => o.value === value);

  // Flechas izquierda/derecha cambian la opción, como un grupo de radio nativo
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + options.length) % options.length;
    onChange(options[next].value);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <div role="radiogroup" aria-labelledby={labelId} aria-describedby={describedBy} aria-invalid={invalid || undefined} className="quote__chips grid grid-cols-3 gap-2">
      {options.map((option, i) => {
        const on = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on || (index === -1 && i === 0) ? 0 : -1}
            onClick={() => onChange(on ? '' : option.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={`quote__chip h-10 truncate rounded-full px-2 font-condensed text-[0.9375rem] font-bold tracking-[0.06em] outline-none transition-[background-color,color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-[#f47621] ${
              on ? 'bg-[#10227f] text-white shadow-[0_6px_14px_rgba(16,34,127,0.3)]' : `bg-[#eeeeee] text-[#9a9a9a] hover:bg-[#e2e5f2] hover:text-[#10227f] ${invalid ? 'ring-2 ring-[#e0464a]' : ''}`
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
