/** Small control and layout pieces shared by the reinforcement-learning visualizers. */

export function Panel({ title, actions, children, className = '' }: { title?: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 rounded-card border border-line bg-white p-4 shadow-card sm:p-5 ${className}`}>
      {(title || actions) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title && <h3 className="font-semibold text-ink">{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

interface SliderProps {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  disabled?: boolean;
}

export function Slider({ label, value, min, max, step, onChange, format = (v) => String(v), disabled }: SliderProps) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-mono tabular-nums text-ink-muted">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600 disabled:opacity-50"
      />
    </label>
  );
}

interface SegmentedProps<T extends string> {
  label?: string;
  value: T;
  options: { value: T; label: React.ReactNode }[];
  onChange: (value: T) => void;
}

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className="min-w-0">
      {label && <span className="mb-1 block text-sm font-medium text-ink">{label}</span>}
      <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-lg bg-subtle p-1 ring-1 ring-inset ring-line">
        {options.map((o) => (
          <button
            key={o.value}
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

export function Stat({ label, value, tone }: { label: React.ReactNode; value: React.ReactNode; tone?: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-line bg-subtle px-3 py-2">
      <div className="text-xs text-ink-muted">{label}</div>
      <div className={`truncate font-mono text-base font-semibold tabular-nums ${tone ?? 'text-ink'}`}>{value}</div>
    </div>
  );
}
