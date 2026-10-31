'use client';

/** Small form controls and stat tiles shared by the classical-ML visualizers. */

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display?: string;
}) {
  return (
    <label className="block min-w-0 text-sm">
      <span className="flex items-center justify-between gap-2 font-medium text-ink">
        {label}
        <span className="font-mono text-ink-muted">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-brand-600"
      />
    </label>
  );
}

/** A row of mutually exclusive options rendered as a segmented control. */
export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-medium text-ink-muted">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1 rounded-lg bg-subtle p-1 ring-1 ring-inset ring-line">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              o.value === value ? 'bg-white text-ink shadow-card ring-1 ring-line' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2">
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className={`font-mono text-base font-semibold ${tone ?? 'text-ink'}`}>{value}</dd>
    </div>
  );
}

export function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-line bg-subtle p-4 ${className}`}>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">{title}</div>
      {children}
    </div>
  );
}
