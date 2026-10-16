import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';

export type Option = { readonly value: string; readonly label: string };

type Props = {
  id: string;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  noResults: string;
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
};

// Compara sin mayúsculas ni acentos: "mineria" encuentra "Minería".
const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/**
 * Lista desplegable con buscador dentro (combobox accesible).
 * Teclado: ↓/↑ para moverse, Enter para elegir, Escape para cerrar.
 */
export function SearchSelect({ id, label, placeholder, searchPlaceholder, noResults, options, value, onChange, invalid, describedBy, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return q ? options.filter((o) => normalize(o.label).includes(q)) : options;
  }, [options, query]);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    window.setTimeout(() => searchRef.current?.focus(), 0);
    const onPointer = (e: PointerEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open, options, value]);

  useEffect(() => { setActive(0); }, [query]);

  const choose = (option: Option) => {
    onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[active]) choose(filtered[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); buttonRef.current?.focus(); }
    else if (e.key === 'Tab') setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={selected ? `${label} ${selected.label}` : label}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); } }}
        className={`quote__control flex w-full items-center justify-between rounded-full border-0 bg-[#eeeeee] pl-4 pr-4 text-left font-condensed text-[1rem] font-bold tracking-[0.06em] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-brand-orange h-12 ${invalid ? 'ring-2 ring-[#e0464a]' : ''} ${selected ? 'text-brand-navy' : 'text-[#ababab]'}`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <svg aria-hidden="true" className={`quote__chevron h-2 w-3 shrink-0 text-brand-orange transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 12 8" fill="none">
          <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-30 overflow-hidden rounded-2xl border border-[#e3e5ef] bg-white shadow-[0_14px_34px_rgba(16,34,127,0.18)]">
          <div className="relative border-b border-[#eceef5] p-2">
            <svg aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0b5]" viewBox="0 0 20 20" fill="none">
              <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="2" />
              <path d="m13 13 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, 60))}
              onKeyDown={onSearchKey}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              aria-controls={listId}
              aria-activedescendant={filtered[active] ? `${listId}-${filtered[active].value}` : undefined}
              className="h-11 w-full rounded-full bg-[#f4f5f9] pl-9 pr-3 font-condensed text-[1rem] font-medium text-brand-navy outline-none placeholder:text-[#a3a8ba] focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <ul id={listId} role="listbox" aria-label={label} className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 && <li className="px-4 py-2 font-condensed text-[0.9375rem] text-[#9aa0b5]">{noResults}</li>}
            {filtered.map((option, i) => (
              <li
                key={option.value}
                id={`${listId}-${option.value}`}
                role="option"
                aria-selected={option.value === value}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(option)}
                className={`flex min-h-11 cursor-pointer items-center justify-between px-4 py-2 font-condensed text-[1rem] font-bold tracking-[0.04em] ${i === active ? 'bg-[#eef1ff] text-brand-navy' : 'text-[#3c4677]'}`}
              >
                {option.label}
                {option.value === value && (
                  <svg aria-hidden="true" className="h-3.5 w-3.5 text-brand-orange" viewBox="0 0 16 16" fill="none">
                    <path d="m3 8.5 3.2 3L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
