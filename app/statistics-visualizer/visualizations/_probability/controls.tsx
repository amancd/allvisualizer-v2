'use client';

interface SliderProps {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
  hint?: React.ReactNode;
}

export function Slider({ label, value, min, max, step, display, onChange, hint }: SliderProps) {
  return (
    <label className="block text-sm">
      <span className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-mono font-semibold text-ink">{display}</span>
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
      {hint && <span className="block text-xs text-ink-faint">{hint}</span>}
    </label>
  );
}

export function Stat({ label, value, hint, strong = false }: { label: React.ReactNode; value: string; hint?: string; strong?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className={`font-mono font-semibold ${strong ? 'text-brand-700' : 'text-ink'}`}>
        {value}
        {hint && <span className="ml-1 text-xs font-normal text-ink-faint">{hint}</span>}
      </dd>
    </div>
  );
}

export function Panel({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-subtle p-4 text-sm">
      <p className="mb-2 font-semibold text-ink">{title}</p>
      {children}
    </div>
  );
}

export const pct = (p: number, digits = 1) => `${(p * 100).toFixed(digits)}%`;
