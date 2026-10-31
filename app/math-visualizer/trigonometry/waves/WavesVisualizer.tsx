'use client';

import { useId, useState } from 'react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';

const TAU = 2 * Math.PI;

// ---------- Shared plot ----------

interface Curve {
  fn: (t: number) => number;
  color: string;
  width?: number;
  dash?: string;
  opacity?: number;
}

interface WavePlotProps {
  curves: Curve[];
  /** Horizontal range, in the plot's own units (periods or seconds). */
  tMax: number;
  yMax: number;
  xTicks: number[];
  xUnit: string;
  height?: number;
  samples?: number;
  label: string;
}

const PLOT_W = 800;
const PAD = { left: 60, right: 20, top: 16, bottom: 44 };

function WavePlot({ curves, tMax, yMax, xTicks, xUnit, height = 320, samples = 800, label }: WavePlotProps) {
  const innerW = PLOT_W - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const px = (t: number) => PAD.left + (t / tMax) * innerW;
  const py = (v: number) => PAD.top + ((yMax - v) / (2 * yMax)) * innerH;
  const yTicks = [-yMax, -yMax / 2, 0, yMax / 2, yMax];
  const clipId = `wave-clip-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const pathFor = (fn: (t: number) => number) => {
    let d = '';
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * tMax;
      const v = Math.max(-yMax * 1.05, Math.min(yMax * 1.05, fn(t)));
      d += `${i === 0 ? 'M' : 'L'}${px(t).toFixed(1)},${py(v).toFixed(1)}`;
    }
    return d;
  };

  return (
    <svg viewBox={`0 0 ${PLOT_W} ${height}`} className={responsiveSurface} role="img" aria-label={label}>
      <rect width={PLOT_W} height={height} fill="#ffffff" />
      <defs>
        <clipPath id={clipId}>
          <rect x={PAD.left} y={PAD.top - 4} width={innerW} height={innerH + 8} />
        </clipPath>
      </defs>
      {yTicks.map((v) => (
        <g key={v}>
          <line x1={PAD.left} x2={PLOT_W - PAD.right} y1={py(v)} y2={py(v)} stroke={v === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={v === 0 ? 2 : 1} />
          <text x={PAD.left - 10} y={py(v) + 7} fontSize={20} textAnchor="end" fill="#64748b">
            {Number(v.toFixed(2))}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={t}>
          <line x1={px(t)} x2={px(t)} y1={PAD.top} y2={PAD.top + innerH} stroke="#e2e8f0" />
          <text x={px(t)} y={height - 14} fontSize={20} textAnchor="middle" fill="#64748b">
            {t}
            {t === xTicks[xTicks.length - 1] ? ` ${xUnit}` : ''}
          </text>
        </g>
      ))}
      <g clipPath={`url(#${clipId})`}>
        {curves.map((c, i) => (
          <path
            key={i}
            d={pathFor(c.fn)}
            fill="none"
            stroke={c.color}
            strokeWidth={c.width ?? 2}
            strokeDasharray={c.dash}
            strokeOpacity={c.opacity ?? 1}
            strokeLinejoin="round"
          />
        ))}
      </g>
    </svg>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="flex items-baseline justify-between gap-2 text-sm text-ink">
        <span>{label}</span>
        <span className="font-mono text-ink-muted">
          {value}
          {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full accent-brand-600" />
    </label>
  );
}

function Legend({ items }: { items: { color: string; label: string; dashed?: boolean }[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-1.5">
          <span className="inline-block h-0 w-5 border-t-2" style={{ borderColor: item.color, borderStyle: item.dashed ? 'dashed' : 'solid' }} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

const panel = 'rounded-card border border-line bg-white p-4 shadow-card';

// ---------- Mode 1: compose sine waves ----------

interface Component {
  on: boolean;
  amplitude: number;
  frequency: number;
  /** Phase in degrees. */
  phase: number;
}

const COMPONENT_COLORS = ['#2563eb', '#e11d48', '#059669'];

const presets: { name: string; components: Component[] }[] = [
  {
    name: 'Harmonics',
    components: [
      { on: true, amplitude: 1, frequency: 1, phase: 0 },
      { on: true, amplitude: 0.5, frequency: 2, phase: 0 },
      { on: true, amplitude: 0.33, frequency: 3, phase: 0 },
    ],
  },
  {
    name: 'Constructive',
    components: [
      { on: true, amplitude: 1, frequency: 2, phase: 0 },
      { on: true, amplitude: 1, frequency: 2, phase: 0 },
      { on: false, amplitude: 1, frequency: 3, phase: 0 },
    ],
  },
  {
    name: 'Destructive',
    components: [
      { on: true, amplitude: 1, frequency: 2, phase: 0 },
      { on: true, amplitude: 1, frequency: 2, phase: 180 },
      { on: false, amplitude: 1, frequency: 3, phase: 0 },
    ],
  },
  {
    name: 'Phase shift',
    components: [
      { on: true, amplitude: 1, frequency: 1, phase: 0 },
      { on: true, amplitude: 1, frequency: 1, phase: 90 },
      { on: false, amplitude: 1, frequency: 3, phase: 0 },
    ],
  },
];

const componentValue = (c: Component, t: number) => (c.on ? c.amplitude * Math.sin(TAU * c.frequency * t + (c.phase * Math.PI) / 180) : 0);

function ComposeMode() {
  const [components, setComponents] = useState<Component[]>(presets[0].components);

  const update = (index: number, patch: Partial<Component>) =>
    setComponents((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));

  const sum = (t: number) => components.reduce((s, c) => s + componentValue(c, t), 0);
  const yMax = Math.max(1.5, Math.ceil(components.reduce((s, c) => s + (c.on ? c.amplitude : 0), 0) * 2) / 2);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-muted">Presets:</span>
        {presets.map((p) => (
          <Button key={p.name} size="sm" variant="outline" onClick={() => setComponents(p.components)}>
            {p.name}
          </Button>
        ))}
      </div>

      <div className={panel}>
        <WavePlot
          label="Component waves and their sum"
          tMax={2}
          yMax={yMax}
          xTicks={[0, 0.5, 1, 1.5, 2]}
          xUnit="s"
          curves={[
            ...components.flatMap((c, i) => (c.on ? [{ fn: (t: number) => componentValue(c, t), color: COMPONENT_COLORS[i], width: 2, opacity: 0.55, dash: '8 6' }] : [])),
            { fn: sum, color: '#0f172a', width: 4 },
          ]}
        />
        <Legend
          items={[
            ...components.flatMap((c, i) => (c.on ? [{ color: COMPONENT_COLORS[i], label: `Wave ${i + 1}`, dashed: true }] : [])),
            { color: '#0f172a', label: 'Sum' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {components.map((c, i) => (
          <div key={i} className={`${panel} ${c.on ? '' : 'opacity-60'}`}>
            <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: COMPONENT_COLORS[i] }}>
              <input type="checkbox" checked={c.on} onChange={(e) => update(i, { on: e.target.checked })} className="h-4 w-4 accent-brand-600" />
              Wave {i + 1}
            </label>
            <p className="mt-1 font-mono text-xs text-ink-muted">
              {c.amplitude} sin(2π·{c.frequency}t + {c.phase}°)
            </p>
            <div className="mt-3 space-y-3">
              <Slider label="Amplitude A" value={c.amplitude} min={0} max={2} step={0.01} onChange={(v) => update(i, { amplitude: v })} />
              <Slider label="Frequency f" value={c.frequency} min={0.5} max={6} step={0.5} unit=" Hz" onChange={(v) => update(i, { frequency: v })} />
              <Slider label="Phase φ" value={c.phase} min={0} max={360} step={5} unit="°" onChange={(v) => update(i, { phase: v })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Mode 2: Fourier series ----------

type WaveShape = 'square' | 'sawtooth' | 'triangle';

const shapes: Record<WaveShape, { name: string; series: string; target: (t: number) => number; coefficient: (k: number) => number; harmonics: (n: number) => number[]; jump: number }> = {
  square: {
    name: 'Square',
    series: '(4/π) [sin(2πt) + sin(6πt)/3 + sin(10πt)/5 + ...]',
    target: (t) => (t - Math.floor(t) < 0.5 ? 1 : -1),
    coefficient: (k) => 4 / (Math.PI * k),
    harmonics: (n) => Array.from({ length: n }, (_, i) => 2 * i + 1),
    jump: 2,
  },
  sawtooth: {
    name: 'Sawtooth',
    series: '(2/π) [sin(2πt) − sin(4πt)/2 + sin(6πt)/3 − ...]',
    target: (t) => 2 * (t - Math.floor(t + 0.5)),
    coefficient: (k) => ((k % 2 === 1 ? 1 : -1) * 2) / (Math.PI * k),
    harmonics: (n) => Array.from({ length: n }, (_, i) => i + 1),
    jump: 2,
  },
  triangle: {
    name: 'Triangle',
    series: '(8/π²) [sin(2πt) − sin(6πt)/9 + sin(10πt)/25 − ...]',
    target: (t) => {
      const s = t - Math.floor(t);
      if (s < 0.25) return 4 * s;
      if (s < 0.75) return 2 - 4 * s;
      return 4 * s - 4;
    },
    coefficient: (k) => (((k - 1) / 2) % 2 === 0 ? 1 : -1) * (8 / (Math.PI * Math.PI * k * k)),
    harmonics: (n) => Array.from({ length: n }, (_, i) => 2 * i + 1),
    jump: 0,
  },
};

function FourierMode() {
  const [shape, setShape] = useState<WaveShape>('square');
  const [terms, setTerms] = useState(5);
  const [showHarmonics, setShowHarmonics] = useState(false);

  const s = shapes[shape];
  const ks = s.harmonics(terms);
  const partial = (t: number) => ks.reduce((sum, k) => sum + s.coefficient(k) * Math.sin(TAU * k * t), 0);

  // Highest point of the partial sum over one period, found by fine sampling.
  let peak = -Infinity;
  for (let i = 0; i <= 4000; i++) peak = Math.max(peak, partial(i / 4000));
  const overshoot = peak - 1;

  const harmonicCurves: Curve[] = showHarmonics
    ? ks.slice(0, 6).map((k, i) => ({ fn: (t: number) => s.coefficient(k) * Math.sin(TAU * k * t), color: COMPONENT_COLORS[i % 3], width: 1.5, opacity: 0.6 }))
    : [];

  const maxK = ks[ks.length - 1];
  const spectrumK = Array.from({ length: Math.min(maxK, 40) }, (_, i) => i + 1);
  const barW = 720 / spectrumK.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(shapes) as WaveShape[]).map((key) => (
          <Button key={key} size="sm" variant={shape === key ? 'primary' : 'outline'} onClick={() => setShape(key)}>
            {shapes[key].name}
          </Button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={showHarmonics} onChange={(e) => setShowHarmonics(e.target.checked)} className="h-4 w-4 accent-brand-600" />
          Show first harmonics
        </label>
      </div>

      <div className={panel}>
        <WavePlot
          label="Fourier partial sum"
          tMax={2}
          yMax={1.5}
          xTicks={[0, 0.5, 1, 1.5, 2]}
          xUnit="periods"
          samples={1600}
          curves={[...harmonicCurves, { fn: s.target, color: '#94a3b8', width: 2, dash: '8 6' }, { fn: partial, color: '#4f46e5', width: 3 }]}
        />
        <Legend
          items={[
            { color: '#94a3b8', label: `Target ${s.name.toLowerCase()} wave`, dashed: true },
            { color: '#4f46e5', label: `Sum of ${terms} term${terms === 1 ? '' : 's'}` },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className={panel}>
          <Slider label="Number of terms N" value={terms} min={1} max={50} step={1} onChange={setTerms} />
          <p className="mt-3 font-mono text-xs leading-relaxed text-ink-muted">{s.series}</p>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <dt className="text-ink-muted">Highest harmonic</dt>
            <dd className="text-right font-mono text-ink">{maxK}</dd>
            <dt className="text-ink-muted">Peak of the sum</dt>
            <dd className="text-right font-mono text-ink">{peak.toFixed(4)}</dd>
            {s.jump > 0 && (
              <>
                <dt className="text-ink-muted">Overshoot / jump</dt>
                <dd className="text-right font-mono text-ink">{((overshoot / s.jump) * 100).toFixed(1)}%</dd>
              </>
            )}
          </dl>
          <p className="mt-3 text-sm text-gray-700">
            {s.jump > 0
              ? 'Gibbs phenomenon: near the jump the sum overshoots. Adding terms squeezes the overshoot closer to the jump, but its height settles at about 9% of the jump instead of shrinking to zero.'
              : 'The triangle wave has no jumps, so its coefficients fall off like 1/k² and the sum converges smoothly with no Gibbs overshoot.'}
          </p>
        </div>

        <div className={panel}>
          <h3 className="text-sm font-semibold text-ink">Spectrum: amplitude of each harmonic</h3>
          <svg viewBox="0 0 800 220" className={`${responsiveSurface} mt-2`} role="img" aria-label="Harmonic amplitudes">
            <rect width={800} height={220} fill="#ffffff" />
            <line x1={60} x2={790} y1={180} y2={180} stroke="#94a3b8" strokeWidth={2} />
            {spectrumK.map((k, i) => {
              const used = ks.includes(k);
              const amp = used ? Math.abs(s.coefficient(k)) : 0;
              const h = (amp / 1.3) * 160;
              return <rect key={k} x={64 + i * barW + barW * 0.15} y={180 - h} width={barW * 0.7} height={h} fill="#4f46e5" />;
            })}
            {[0, 0.5, 1].map((v) => (
              <text key={v} x={50} y={186 - (v / 1.3) * 160} fontSize={20} textAnchor="end" fill="#64748b">
                {v}
              </text>
            ))}
            {[1, Math.ceil(spectrumK.length / 2), spectrumK.length].map((k) => (
              <text key={k} x={64 + (k - 0.5) * barW} y={210} fontSize={20} textAnchor="middle" fill="#64748b">
                {k}
              </text>
            ))}
          </svg>
          <p className="mt-1 text-xs text-ink-muted">Harmonic number k (first {spectrumK.length} shown).</p>
        </div>
      </div>
    </div>
  );
}

// ---------- Mode 3: beats ----------

function BeatsMode() {
  const [f1, setF1] = useState(10);
  const [f2, setF2] = useState(11);

  const beat = Math.abs(f1 - f2);
  const w1 = (t: number) => Math.sin(TAU * f1 * t);
  const w2 = (t: number) => Math.sin(TAU * f2 * t);
  const envelope = (t: number) => 2 * Math.abs(Math.cos(Math.PI * (f1 - f2) * t));
  const ticks = [0, 0.5, 1, 1.5, 2];

  return (
    <div className="space-y-4">
      <div className={panel}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Slider label="Frequency f₁" value={f1} min={5} max={15} step={0.1} unit=" Hz" onChange={setF1} />
          <Slider label="Frequency f₂" value={f2} min={5} max={15} step={0.1} unit=" Hz" onChange={setF2} />
        </div>
        <p className="mt-3 text-sm text-gray-700">
          Beat frequency |f₁ − f₂| = <span className="font-mono font-semibold text-ink">{beat.toFixed(1)} Hz</span>
          {beat > 0 && (
            <>
              {' '}(one loud-quiet cycle every <span className="font-mono">{(1 / beat).toFixed(2)} s</span>)
            </>
          )}
          . The sum oscillates at the average frequency <span className="font-mono">{((f1 + f2) / 2).toFixed(2)} Hz</span>.
        </p>
      </div>

      <div className={panel}>
        <h3 className="text-sm font-semibold text-ink">The two waves</h3>
        <WavePlot label="Two waves" tMax={2} yMax={1} height={200} samples={1600} xTicks={ticks} xUnit="s" curves={[{ fn: w1, color: '#2563eb' }, { fn: w2, color: '#e11d48', opacity: 0.7 }]} />
        <Legend items={[{ color: '#2563eb', label: `sin(2π·${f1}t)` }, { color: '#e11d48', label: `sin(2π·${f2}t)` }]} />
      </div>

      <div className={panel}>
        <h3 className="text-sm font-semibold text-ink">Their sum</h3>
        <WavePlot
          label="Sum with beat envelope"
          tMax={2}
          yMax={2}
          height={260}
          samples={1600}
          xTicks={ticks}
          xUnit="s"
          curves={[
            { fn: (t) => w1(t) + w2(t), color: '#0f172a', width: 1.5 },
            { fn: envelope, color: '#f59e0b', width: 3, dash: '10 6' },
            { fn: (t) => -envelope(t), color: '#f59e0b', width: 3, dash: '10 6' },
          ]}
        />
        <Legend items={[{ color: '#0f172a', label: 'Sum' }, { color: '#f59e0b', label: `Envelope ±2|cos(π(f₁ − f₂)t)|`, dashed: true }]} />
      </div>
    </div>
  );
}

// ---------- Main ----------

const modes = [
  { id: 'compose', label: 'Compose waves' },
  { id: 'fourier', label: 'Fourier series' },
  { id: 'beats', label: 'Beats' },
] as const;

type Mode = (typeof modes)[number]['id'];

export default function WavesVisualizer() {
  const [mode, setMode] = useState<Mode>('compose');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Mode">
        {modes.map((m) => (
          <Button key={m.id} variant={mode === m.id ? 'primary' : 'outline'} size="sm" role="tab" aria-selected={mode === m.id} onClick={() => setMode(m.id)}>
            {m.label}
          </Button>
        ))}
      </div>
      {mode === 'compose' && <ComposeMode />}
      {mode === 'fourier' && <FourierMode />}
      {mode === 'beats' && <BeatsMode />}
    </div>
  );
}
