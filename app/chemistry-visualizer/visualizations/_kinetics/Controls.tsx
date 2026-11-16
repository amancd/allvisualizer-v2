import type { ReactNode } from 'react';

interface SliderProps {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  display: ReactNode;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function Slider({ label, value, min, max, step, display, onChange, disabled }: SliderProps) {
  return (
    <label className="block min-w-0">
      <span className="flex flex-wrap items-baseline justify-between gap-x-2 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-mono font-semibold text-ink">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-brand-600 disabled:opacity-50"
      />
    </label>
  );
}

export function Stat({ label, value, hint }: { label: ReactNode; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-mono font-semibold text-ink">
        {value}
        {hint && <span className="ml-1 text-xs font-normal text-ink-faint">{hint}</span>}
      </dd>
    </div>
  );
}

export function Panel({ title, children, className = '' }: { title?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-line bg-subtle p-4 text-sm ${className}`}>
      {title && <p className="mb-2 font-semibold text-ink">{title}</p>}
      {children}
    </div>
  );
}

export function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: ReactNode }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-brand-600" />
      {children}
    </label>
  );
}

export function Legend({ items }: { items: { color: string; label: ReactNode; dashed?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0 w-5 border-t-[3px]" style={{ borderColor: item.color, borderTopStyle: item.dashed ? 'dashed' : 'solid' }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
