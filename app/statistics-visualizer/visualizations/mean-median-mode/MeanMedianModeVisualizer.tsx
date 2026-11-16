'use client';

import { useMemo, useRef, useState } from 'react';
import { Eraser, MousePointer2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { Segmented, Stat, StatBox } from '../_descriptive-statistics/controls';
import { fmt, mean, medianOfSorted, modes, niceStep, populationSd, sampleSd, sortAsc, sum, ticks } from '../_descriptive-statistics/stats';

interface Preset {
  label: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  values: number[];
  note: string;
}

const PRESETS = {
  symmetric: {
    label: 'Symmetric',
    min: 0,
    max: 20,
    step: 1,
    values: [5, 7, 8, 9, 10, 10, 10, 11, 12, 13, 15],
    note: 'A symmetric pile: mean, median and mode all sit at 10.',
  },
  skewed: {
    label: 'Right-skewed',
    min: 0,
    max: 20,
    step: 1,
    values: [2, 3, 3, 3, 4, 4, 5, 5, 6, 7, 9, 12, 16],
    note: 'A long right tail drags the mean past the median: mode < median < mean.',
  },
  outlier: {
    label: 'With outlier',
    min: 0,
    max: 50,
    step: 1,
    values: [8, 9, 10, 10, 11, 12, 13, 47],
    note: 'One value of 47 lifts the mean to 15, above seven of the eight values. The median barely notices.',
  },
  bimodal: {
    label: 'Bimodal',
    min: 0,
    max: 20,
    step: 1,
    values: [3, 4, 4, 5, 5, 5, 6, 14, 15, 15, 15, 16, 16, 17],
    note: 'Two clusters and two modes. The mean and median both land at 10, where there is no data at all.',
  },
  salaries: {
    label: 'Salaries',
    min: 0,
    max: 200,
    step: 5,
    prefix: '$',
    suffix: 'k',
    values: [30, 35, 35, 40, 40, 40, 45, 50, 55, 60, 190],
    note: 'Ten staff and one executive, in thousands of dollars. Ten of the eleven people earn less than the mean salary.',
  },
} satisfies Record<string, Preset>;

type PresetKey = keyof typeof PRESETS;
const PRESET_KEYS = Object.keys(PRESETS) as PresetKey[];
const MAX_POINTS = 40;

const W = 800;
const H = 300;
const LEFT = 30;
const RIGHT = 770;
const AXIS_Y = 250;
const TOP_LIMIT = 78;

const COLORS = { mean: '#dc2626', median: '#2563eb', mode: '#16a34a' };

type Point = { id: number; v: number };
type Tool = 'add' | 'remove';
type Pivot = 'mean' | 'median';

const toPoints = (values: number[]): Point[] => values.map((v, i) => ({ id: i, v }));

export default function MeanMedianModeVisualizer() {
  const [presetKey, setPresetKey] = useState<PresetKey>('outlier');
  const [points, setPoints] = useState<Point[]>(() => toPoints(PRESETS.outlier.values));
  const [tool, setTool] = useState<Tool>('add');
  const [pivot, setPivot] = useState<Pivot>('mean');
  const svgRef = useRef<SVGSVGElement>(null);
  const nextId = useRef(1000);
  const dragId = useRef<number | null>(null);
  const lastTap = useRef<{ id: number; t: number } | null>(null);

  const preset: Preset = PRESETS[presetKey];
  const { min, max, step } = preset;
  const label = (v: number, digits = 2) => `${preset.prefix ?? ''}${fmt(v, digits)}${preset.suffix ?? ''}`;

  const sx = (v: number) => LEFT + ((v - min) / (max - min)) * (RIGHT - LEFT);
  const toValue = (x: number) => {
    const raw = min + ((x - LEFT) / (RIGHT - LEFT)) * (max - min);
    return Math.min(max, Math.max(min, Math.round(raw / step) * step));
  };

  const pxPerStep = ((RIGHT - LEFT) / (max - min)) * step;
  const r = Math.min(10, pxPerStep * 0.45);

  const values = points.map((p) => p.v);
  const sorted = useMemo(() => sortAsc(points.map((p) => p.v)), [points]);
  const n = sorted.length;
  const xbar = mean(sorted);
  const med = medianOfSorted(sorted);
  const mode = modes(sorted);
  const sigma = populationSd(sorted);
  const s = sampleSd(sorted);

  const layout = useMemo(() => {
    const seen = new Map<number, number>();
    const levels = points.map((p) => {
      const level = seen.get(p.v) ?? 0;
      seen.set(p.v, level + 1);
      return level;
    });
    const maxLevel = Math.max(0, ...levels);
    const spacing = Math.min(2 * r + 2, maxLevel > 0 ? (AXIS_Y - 12 - TOP_LIMIT) / maxLevel : 2 * r + 2);
    return points.map((p, i) => ({ ...p, cx: LEFT + ((p.v - min) / (max - min)) * (RIGHT - LEFT), cy: AXIS_Y - r - 3 - levels[i] * spacing }));
  }, [points, r, min, max]);

  const loadPreset = (key: PresetKey) => {
    setPresetKey(key);
    setPoints(toPoints(PRESETS[key].values));
  };

  const removePoint = (id: number) => setPoints((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const p = toDrawingPoint(e, svg);
    let hit: (typeof layout)[number] | null = null;
    let best = Infinity;
    for (const d of layout) {
      const dist = Math.hypot(d.cx - p.x, d.cy - p.y);
      if (dist < Math.max(r + 8, 14) && dist < best) {
        best = dist;
        hit = d;
      }
    }
    if (tool === 'remove') {
      if (hit) removePoint(hit.id);
      return;
    }
    const now = e.timeStamp;
    if (hit) {
      if (lastTap.current && lastTap.current.id === hit.id && now - lastTap.current.t < 350) {
        lastTap.current = null;
        removePoint(hit.id);
        return;
      }
      lastTap.current = { id: hit.id, t: now };
      dragId.current = hit.id;
      svg.setPointerCapture(e.pointerId);
      return;
    }
    if (p.y < TOP_LIMIT - 10 || p.y > H - 10 || points.length >= MAX_POINTS) return;
    const id = nextId.current++;
    setPoints((prev) => [...prev, { id, v: toValue(p.x) }]);
    dragId.current = id;
    lastTap.current = null;
    svg.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    const id = dragId.current;
    if (!svg || id === null) return;
    const v = toValue(toDrawingPoint(e, svg).x);
    setPoints((prev) => (prev.some((p) => p.id === id && p.v !== v) ? prev.map((p) => (p.id === id ? { ...p, v } : p)) : prev));
  };

  const endDrag = () => {
    dragId.current = null;
  };

  const tickStep = niceStep(max - min, 10);
  const axisTicks = ticks(min, max, tickStep);
  const labelX = (v: number) => Math.min(RIGHT - 40, Math.max(LEFT + 40, sx(v)));

  const markers = [
    { key: 'mean', v: xbar, text: `mean ${label(xbar)}`, color: COLORS.mean, y: 18 },
    { key: 'median', v: med, text: `median ${label(med)}`, color: COLORS.median, y: 40 },
    ...mode.values.map((m, i) => ({ key: `mode-${m}`, v: m, text: i === 0 ? `mode${mode.values.length > 1 ? 's' : ''} ${mode.values.map((x) => label(x)).join(', ')}` : '', color: COLORS.mode, y: 62 })),
  ];

  const medianIdx = n % 2 ? [Math.floor(n / 2)] : [n / 2 - 1, n / 2];
  const skew = xbar - med;
  const shape =
    Math.abs(skew) < 0.05 * (sorted[n - 1] - sorted[0] || 1)
      ? 'Mean ≈ median: roughly symmetric.'
      : skew > 0
        ? 'Mean > median: the data lean right (a long right tail or a high outlier).'
        : 'Mean < median: the data lean left (a long left tail or a low outlier).';

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Dataset</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_KEYS.map((key) => (
              <Button key={key} size="sm" variant={presetKey === key ? 'primary' : 'outline'} aria-pressed={presetKey === key} onClick={() => loadPreset(key)}>
                {PRESETS[key].label}
              </Button>
            ))}
          </div>
          <p className="mt-2 text-sm text-ink-muted">{preset.note}</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <Segmented
            label="Tap tool"
            value={tool}
            onChange={setTool}
            options={[
              {
                value: 'add',
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    <MousePointer2 className="h-4 w-4" aria-hidden />
                    Add &amp; drag
                  </span>
                ),
              },
              {
                value: 'remove',
                label: (
                  <span className="inline-flex items-center gap-1.5">
                    <Eraser className="h-4 w-4" aria-hidden />
                    Remove
                  </span>
                ),
              },
            ]}
          />
          <Button size="sm" variant="ghost" onClick={() => loadPreset(presetKey)} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset dataset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 lg:col-span-2">
          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Dot plot
              <span className="ml-2 font-normal text-ink-muted">
                ({tool === 'add' ? 'tap empty space to add a point, drag a point to move it, double-tap to remove it' : 'tap a point to remove it'})
              </span>
            </p>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className={`${responsiveSurface} touch-none select-none rounded-xl border border-line bg-white ${tool === 'remove' ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
              role="img"
              aria-label={`Dot plot of ${n} values with mean ${fmt(xbar)} and median ${fmt(med)}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {markers.map((m) => (
                <g key={m.key}>
                  <line x1={sx(m.v)} y1={m.y + 6} x2={sx(m.v)} y2={AXIS_Y} stroke={m.color} strokeWidth={2.5} strokeDasharray={m.key === 'mean' ? undefined : '7 5'} />
                  {m.text && (
                    <text x={labelX(m.v)} y={m.y} fontSize={18} fontWeight={700} textAnchor="middle" fill={m.color}>
                      {m.text}
                    </text>
                  )}
                </g>
              ))}
              {layout.map((d) => (
                <circle key={d.id} cx={d.cx} cy={d.cy} r={r} fill="#f59e0b" stroke="#92400e" strokeWidth={1.5} className={tool === 'add' ? 'cursor-grab' : 'cursor-pointer'} />
              ))}
              <line x1={LEFT} y1={AXIS_Y} x2={RIGHT} y2={AXIS_Y} stroke="#334155" strokeWidth={2} />
              {axisTicks.map((t) => (
                <g key={t}>
                  <line x1={sx(t)} y1={AXIS_Y} x2={sx(t)} y2={AXIS_Y + 7} stroke="#334155" strokeWidth={2} />
                  <text x={sx(t)} y={AXIS_Y + 34} fontSize={18} textAnchor="middle" fill="#475569">
                    {t}
                  </text>
                </g>
              ))}
              <polygon points={`${sx(xbar)},${AXIS_Y + 2} ${sx(xbar) - 9},${AXIS_Y + 15} ${sx(xbar) + 9},${AXIS_Y + 15}`} fill={COLORS.mean} opacity={0.85} />
            </svg>
          </div>

          <BalanceBeam points={layout} min={min} max={max} xbar={xbar} med={med} pivot={pivot} setPivot={setPivot} label={label} />

          <Histogram values={values} min={min} max={max} tickStep={tickStep} xbar={xbar} med={med} />
        </div>

        <div className="min-w-0 space-y-4">
          <StatBox title="Center">
            <Stat label="Mean x̄" value={label(xbar)} color={COLORS.mean} />
            <Stat label="Median" value={label(med)} color={COLORS.median} />
            <Stat label={mode.values.length > 1 ? 'Modes' : 'Mode'} value={mode.values.length ? mode.values.map((m) => label(m)).join(', ') : 'none'} hint={mode.values.length ? `(×${mode.count})` : undefined} color={COLORS.mode} />
          </StatBox>
          <StatBox title="Spread">
            <Stat label="Range" value={label(sorted[n - 1] - sorted[0])} hint={`(${fmt(sorted[n - 1])} − ${fmt(sorted[0])})`} />
            <Stat label="Population SD σ" value={fmt(sigma)} hint="(÷ n)" />
            <Stat label="Sample SD s" value={n > 1 ? fmt(s) : '–'} hint="(÷ n − 1)" />
          </StatBox>
          <StatBox title="Working">
            <Stat label="n" value={n} hint={`(max ${MAX_POINTS})`} />
            <Stat label="Σx" value={fmt(sum(sorted))} />
            <Stat label="x̄ = Σx / n" value={`${fmt(sum(sorted))} / ${n} = ${fmt(xbar, 3)}`} />
          </StatBox>
          <p className="text-sm text-ink-muted">{shape}</p>
          {mode.values.length === 0 && <p className="text-sm text-ink-muted">No mode: {mode.count <= 1 ? 'every value appears once.' : 'every value appears equally often.'}</p>}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink">
          Sorted data
          <span className="ml-2 font-normal text-ink-muted">
            {n % 2
              ? `(n = ${n} is odd, so the median is value number ${(n + 1) / 2})`
              : `(n = ${n} is even, so the median is the average of values ${n / 2} and ${n / 2 + 1}: (${fmt(sorted[n / 2 - 1])} + ${fmt(sorted[n / 2])}) / 2 = ${fmt(med)})`}
          </span>
        </p>
        <ol className="flex flex-wrap gap-1.5">
          {sorted.map((v, i) => {
            const isMedian = medianIdx.includes(i);
            const isMode = mode.values.includes(v);
            return (
              <li
                key={i}
                className={`min-w-10 rounded-md border px-2 py-1 text-center font-mono text-sm tabular-nums ${
                  isMedian ? 'border-blue-500 bg-blue-50 font-semibold text-blue-800' : isMode ? 'border-green-300 bg-green-50 text-green-800' : 'border-line bg-subtle text-ink'
                }`}
              >
                <span className="block text-[10px] leading-none text-ink-faint">{i + 1}</span>
                {fmt(v)}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function BalanceBeam({
  points,
  min,
  max,
  xbar,
  med,
  pivot,
  setPivot,
  label,
}: {
  points: { id: number; v: number; cx: number }[];
  min: number;
  max: number;
  xbar: number;
  med: number;
  pivot: Pivot;
  setPivot: (p: Pivot) => void;
  label: (v: number) => string;
}) {
  const BH = 190;
  const beamY = 120;
  const p = pivot === 'mean' ? xbar : med;
  const px = LEFT + ((p - min) / (max - min)) * (RIGHT - LEFT);
  const torque = points.reduce((s, pt) => s + (pt.v - p), 0);
  const span = max - min;
  const level = Math.abs(torque) < 1e-9 * span;
  const angle = level ? 0 : Math.max(-14, Math.min(14, (torque / (points.length * span)) * 140));

  const seen = new Map<number, number>();
  const weights = points.map((pt) => {
    const k = seen.get(pt.v) ?? 0;
    seen.set(pt.v, k + 1);
    return { id: pt.id, x: pt.cx, y: beamY - 10 - Math.min(k, 8) * 11 };
  });

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink">
          Balance point
          <span className="ml-2 font-normal text-ink-muted">(each value is an equal weight on a weightless beam)</span>
        </p>
        <Segmented
          value={pivot}
          onChange={setPivot}
          options={[
            { value: 'mean', label: 'Fulcrum at mean' },
            { value: 'median', label: 'Fulcrum at median' },
          ]}
        />
      </div>
      <svg viewBox={`0 0 ${W} ${BH}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label={`Balance beam with the fulcrum at the ${pivot}`}>
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${px}px ${beamY}px`, transition: 'transform 0.35s ease' }}>
          <line x1={LEFT - 10} y1={beamY} x2={RIGHT + 10} y2={beamY} stroke="#475569" strokeWidth={6} strokeLinecap="round" />
          {weights.map((w) => (
            <rect key={w.id} x={w.x - 5} y={w.y - 4} width={10} height={9} rx={2} fill="#f59e0b" stroke="#92400e" strokeWidth={1} />
          ))}
        </g>
        <polygon points={`${px},${beamY + 3} ${px - 18},${beamY + 38} ${px + 18},${beamY + 38}`} fill={pivot === 'mean' ? COLORS.mean : COLORS.median} />
        <line x1={LEFT} y1={beamY + 39} x2={RIGHT} y2={beamY + 39} stroke="#cbd5e1" strokeWidth={2} />
        <text x={W / 2} y={BH - 10} fontSize={17} textAnchor="middle" fill="#334155">
          {`Σ(x − ${label(p)}) = ${fmt(torque)}  ${level ? '→ balanced' : torque > 0 ? '→ tips right' : '→ tips left'}`}
        </text>
      </svg>
    </div>
  );
}

function Histogram({ values, min, max, tickStep, xbar, med }: { values: number[]; min: number; max: number; tickStep: number; xbar: number; med: number }) {
  const HH = 190;
  const base = 150;
  const bins = Math.round((max - min) / tickStep);
  const counts = new Array<number>(bins).fill(0);
  for (const v of values) counts[Math.min(bins - 1, Math.floor((v - min) / tickStep))]++;
  const top = Math.max(1, ...counts);
  const sx = (v: number) => LEFT + ((v - min) / (max - min)) * (RIGHT - LEFT);
  const bw = sx(min + tickStep) - sx(min);
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-ink">
        Histogram
        <span className="ml-2 font-normal text-ink-muted">(bins of width {fmt(tickStep)}, each includes its left edge)</span>
      </p>
      <svg viewBox={`0 0 ${W} ${HH}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Histogram of the data">
        {counts.map((c, i) => {
          const h = (c / top) * (base - 30);
          return (
            <g key={i}>
              {c > 0 && <rect x={sx(min) + i * bw + 1} y={base - h} width={bw - 2} height={h} fill="#93c5fd" stroke="#2563eb" strokeWidth={1} />}
              {c > 0 && (
                <text x={sx(min) + (i + 0.5) * bw} y={base - h - 6} fontSize={15} textAnchor="middle" fill="#1e3a8a">
                  {c}
                </text>
              )}
            </g>
          );
        })}
        <line x1={sx(xbar)} y1={12} x2={sx(xbar)} y2={base} stroke={COLORS.mean} strokeWidth={2.5} />
        <line x1={sx(med)} y1={12} x2={sx(med)} y2={base} stroke={COLORS.median} strokeWidth={2.5} strokeDasharray="7 5" />
        <line x1={LEFT} y1={base} x2={RIGHT} y2={base} stroke="#334155" strokeWidth={2} />
        {ticks(min, max, tickStep).map((t) => (
          <text key={t} x={sx(t)} y={base + 24} fontSize={16} textAnchor="middle" fill="#475569">
            {t}
          </text>
        ))}
      </svg>
    </div>
  );
}
