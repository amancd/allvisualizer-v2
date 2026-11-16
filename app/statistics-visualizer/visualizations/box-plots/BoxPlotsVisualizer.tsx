'use client';

import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Columns2, Square } from 'lucide-react';
import { Button, Select, fieldStyles } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { Segmented } from '../_descriptive-statistics/controls';
import { fmt, medianOfSorted, niceRange, niceStep, quartiles, roundTo, stackLevels, ticks, type Quartiles } from '../_descriptive-statistics/stats';

const PRESETS = {
  exam: { label: 'Exam scores', values: [52, 58, 61, 64, 66, 68, 70, 72, 73, 75, 78, 81, 84, 88, 95] },
  commute: { label: 'Commute times (min)', values: [8, 10, 12, 12, 14, 15, 17, 18, 20, 24, 28, 55] },
  twoSided: { label: 'Outliers on both sides', values: [2, 21, 23, 24, 25, 26, 27, 28, 29, 31, 49] },
  fertilizer: { label: 'Plant heights: fertilizer (cm)', values: [18, 20, 21, 22, 23, 24, 24, 25, 26, 27, 29] },
  control: { label: 'Plant heights: control (cm)', values: [12, 14, 15, 16, 17, 17, 18, 19, 21, 23, 31] },
} satisfies Record<string, { label: string; values: number[] }>;

type PresetKey = keyof typeof PRESETS;
const PRESET_KEYS = Object.keys(PRESETS) as PresetKey[];
type GroupKey = 'A' | 'B';
type Point = { id: number; v: number };
interface Group {
  name: string;
  preset: PresetKey | 'custom';
  points: Point[];
  draft: string;
  error: string | null;
}

const MIN_N = 4;
const MAX_N = 60;
const GROUP_COLORS: Record<GroupKey, { fill: string; stroke: string; text: string }> = {
  A: { fill: '#c7d2fe', stroke: '#4338ca', text: '#312e81' },
  B: { fill: '#fed7aa', stroke: '#c2410c', text: '#7c2d12' },
};

const STEPS = ['Sort', 'Median', 'Q1', 'Q3', 'IQR & fences', 'Outliers & whiskers'];

const W = 800;
const LEFT = 40;
const RIGHT = 760;
const BOX_H = 92;
const DOT_R = 7;

let idCounter = 0;
const toPoints = (values: number[]): Point[] => values.map((v) => ({ id: idCounter++, v }));
const draftOf = (points: Point[]) => [...points].map((p) => p.v).sort((a, b) => a - b).join(', ');

function makeGroup(preset: PresetKey): Group {
  const points = toPoints(PRESETS[preset].values);
  return { name: PRESETS[preset].label, preset, points, draft: draftOf(points), error: null };
}

function fitAxis(groups: Group[]) {
  const all = groups.flatMap((g) => g.points.map((p) => p.v));
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const pad = Math.max((hi - lo) * 0.05, 1e-6);
  const range = niceRange(lo - pad, hi + pad, 10);
  const span = range.max - range.min;
  return { ...range, snap: 10 ** Math.floor(Math.log10(span) - 1.3) };
}

function describeMedian(values: number[], offset = 0) {
  const n = values.length;
  if (n === 0) return '–';
  const m = medianOfSorted(values);
  if (n % 2) return `position ${offset + (n + 1) / 2} → ${fmt(m)}`;
  return `positions ${offset + n / 2} and ${offset + n / 2 + 1} → (${fmt(values[n / 2 - 1])} + ${fmt(values[n / 2])}) / 2 = ${fmt(m)}`;
}

export default function BoxPlotsVisualizer() {
  const [groups, setGroups] = useState<Record<GroupKey, Group>>(() => ({ A: makeGroup('commute'), B: makeGroup('control') }));
  const [compare, setCompare] = useState(false);
  const [axis, setAxis] = useState(() => fitAxis([makeGroup('commute')]));
  const [view, setView] = useState<'dots' | 'histogram'>('dots');
  const [step, setStep] = useState(STEPS.length - 1);
  const [focus, setFocus] = useState<GroupKey>('A');
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ g: GroupKey; id: number } | null>(null);

  const visible: GroupKey[] = compare ? ['A', 'B'] : ['A'];
  const focusKey: GroupKey = compare ? focus : 'A';
  const dotH = compare ? 104 : 136;
  const blockH = BOX_H + dotH + 14;
  const H = 16 + visible.length * blockH + 46;
  const axisY = 16 + visible.length * blockH;

  const sx = (v: number) => LEFT + ((v - axis.min) / (axis.max - axis.min)) * (RIGHT - LEFT);
  const toValue = (x: number) => {
    const raw = axis.min + ((x - LEFT) / (RIGHT - LEFT)) * (axis.max - axis.min);
    const clamped = Math.min(axis.max, Math.max(axis.min, raw));
    return roundTo(Math.round(clamped / axis.snap) * axis.snap, 6);
  };

  const stats = useMemo(
    () => ({ A: quartiles(groups.A.points.map((p) => p.v)), B: quartiles(groups.B.points.map((p) => p.v)) }),
    [groups],
  );

  const dotLayout = useMemo(() => {
    const out: { g: GroupKey; id: number; v: number; cx: number; cy: number; rank: number }[] = [];
    const keys: GroupKey[] = compare ? ['A', 'B'] : ['A'];
    keys.forEach((g, gi) => {
      const pts = groups[g].points;
      const px = (v: number) => LEFT + ((v - axis.min) / (axis.max - axis.min)) * (RIGHT - LEFT);
      const levels = stackLevels(pts.map((p) => px(p.v)), 2 * DOT_R + 1);
      const maxLevel = Math.max(0, ...levels);
      const bottom = 16 + gi * (BOX_H + dotH + 14) + BOX_H + dotH;
      const spacing = Math.min(2 * DOT_R + 1, maxLevel > 0 ? (dotH - 2 * DOT_R - 10) / maxLevel : 2 * DOT_R + 1);
      const order = pts.map((p, i) => ({ p, i })).sort((a, b) => a.p.v - b.p.v || a.p.id - b.p.id);
      const rank = new Array<number>(pts.length);
      order.forEach((o, k) => (rank[o.i] = k));
      pts.forEach((p, i) => out.push({ g, id: p.id, v: p.v, cx: px(p.v), cy: bottom - DOT_R - 2 - levels[i] * spacing, rank: rank[i] }));
    });
    return out;
  }, [groups, compare, axis, dotH]);

  const loadPreset = (g: GroupKey, key: PresetKey) => {
    const next = { ...groups, [g]: makeGroup(key) };
    setGroups(next);
    setAxis(fitAxis(visible.map((k) => next[k])));
  };

  const toggleCompare = (on: boolean) => {
    setCompare(on);
    setFocus('A');
    let next = groups;
    if (on && groups.A.preset === groups.B.preset) {
      next = { ...groups, B: makeGroup(groups.A.preset === 'control' ? 'fertilizer' : 'control') };
      setGroups(next);
    }
    setAxis(fitAxis(on ? [next.A, next.B] : [next.A]));
  };

  const applyDraft = (g: GroupKey) => {
    const tokens = groups[g].draft.split(/[\s,;]+/).filter(Boolean);
    const bad = tokens.find((t) => !Number.isFinite(Number(t)));
    let error: string | null = null;
    if (bad) error = `"${bad}" is not a number.`;
    else if (tokens.length < MIN_N) error = `Enter at least ${MIN_N} numbers.`;
    else if (tokens.length > MAX_N) error = `Enter at most ${MAX_N} numbers.`;
    if (error) {
      setGroups({ ...groups, [g]: { ...groups[g], error } });
      return;
    }
    const points = toPoints(tokens.map(Number));
    const next = { ...groups, [g]: { name: 'Custom data', preset: 'custom' as const, points, draft: draftOf(points), error: null } };
    setGroups(next);
    setAxis(fitAxis(visible.map((k) => next[k])));
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg || view !== 'dots') return;
    const p = toDrawingPoint(e, svg);
    let best: (typeof dotLayout)[number] | null = null;
    let bestD = 18;
    for (const d of dotLayout) {
      const dist = Math.hypot(d.cx - p.x, d.cy - p.y);
      if (dist < bestD) {
        bestD = dist;
        best = d;
      }
    }
    if (!best) return;
    drag.current = { g: best.g, id: best.id };
    svg.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    const d = drag.current;
    if (!svg || !d) return;
    const v = toValue(toDrawingPoint(e, svg).x);
    setGroups((prev) => {
      const g = prev[d.g];
      if (!g.points.some((p) => p.id === d.id && p.v !== v)) return prev;
      const points = g.points.map((p) => (p.id === d.id ? { ...p, v } : p));
      return { ...prev, [d.g]: { ...g, points, preset: 'custom', name: g.preset === 'custom' ? g.name : `${g.name} (edited)`, draft: draftOf(points), error: null } };
    });
  };

  const endDrag = () => {
    drag.current = null;
  };

  const tickStep = niceStep(axis.max - axis.min, 10);
  const axisTicks = ticks(axis.min, axis.max, tickStep);
  const fq = stats[focusKey];

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <Segmented
          label="Groups"
          value={compare ? 'two' : 'one'}
          onChange={(v) => toggleCompare(v === 'two')}
          options={[
            {
              value: 'one',
              label: (
                <span className="inline-flex items-center gap-1.5">
                  <Square className="h-4 w-4" aria-hidden />
                  One group
                </span>
              ),
            },
            {
              value: 'two',
              label: (
                <span className="inline-flex items-center gap-1.5">
                  <Columns2 className="h-4 w-4" aria-hidden />
                  Compare two
                </span>
              ),
            },
          ]}
        />
        <Segmented
          label="Below each box"
          value={view}
          onChange={setView}
          options={[
            { value: 'dots', label: 'Dot plot' },
            { value: 'histogram', label: 'Histogram' },
          ]}
        />
      </div>

      <div className={`grid grid-cols-1 gap-4 ${compare ? 'lg:grid-cols-2' : ''}`}>
        {visible.map((g) => (
          <div key={g} className="min-w-0 rounded-xl border border-line bg-subtle p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-0 flex-1 basis-56">
                <Select label={compare ? `Group ${g} dataset` : 'Dataset'} value={groups[g].preset} onChange={(e) => {
                    if (e.target.value !== 'custom') loadPreset(g, e.target.value as PresetKey);
                  }}>
                  {PRESET_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {PRESETS[k].label}
                    </option>
                  ))}
                  <option value="custom" disabled>
                    Custom / edited
                  </option>
                </Select>
              </div>
            </div>
            <form
              className="mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                applyDraft(g);
              }}
            >
              <label htmlFor={`data-${g}`} className="mb-1.5 block text-sm font-medium text-ink">
                Data ({MIN_N} to {MAX_N} numbers, separated by commas or spaces)
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  id={`data-${g}`}
                  value={groups[g].draft}
                  onChange={(e) => setGroups({ ...groups, [g]: { ...groups[g], draft: e.target.value, error: null } })}
                  className={`${fieldStyles} h-11 min-w-0 flex-1 basis-56 font-mono`}
                  inputMode="decimal"
                  spellCheck={false}
                />
                <Button type="submit" size="md" variant="secondary">
                  Apply
                </Button>
              </div>
              {groups[g].error && <p className="mt-1.5 text-sm text-red-600">{groups[g].error}</p>}
            </form>
          </div>
        ))}
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-ink">
          Box plot{compare ? 's' : ''} on a shared axis
          <span className="ml-2 font-normal text-ink-muted">
            {view === 'dots' ? '(drag any dot to change that value)' : '(switch to the dot plot to drag values)'}
          </span>
        </p>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className={`${responsiveSurface} select-none rounded-xl border border-line bg-white ${view === 'dots' ? 'touch-none' : ''}`}
          role="img"
          aria-label={visible.map((g) => `Group ${g}: min ${fmt(stats[g].min)}, Q1 ${fmt(stats[g].q1)}, median ${fmt(stats[g].q2)}, Q3 ${fmt(stats[g].q3)}, max ${fmt(stats[g].max)}`).join('; ')}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {axisTicks.map((t) => (
            <line key={t} x1={sx(t)} y1={10} x2={sx(t)} y2={axisY} stroke="#f1f5f9" strokeWidth={1.5} />
          ))}
          {visible.map((g, gi) => {
            const top = 16 + gi * blockH;
            const shownStep = g === focusKey ? step : STEPS.length - 1;
            return (
              <g key={g}>
                <text x={LEFT} y={top + 14} fontSize={16} fontWeight={700} fill={GROUP_COLORS[g].text}>
                  {compare ? `${g}: ${groups[g].name}` : groups[g].name}
                </text>
                <BoxPlot q={stats[g]} step={shownStep} axisMin={axis.min} axisMax={axis.max} top={top + 22} height={BOX_H - 30} sx={sx} color={GROUP_COLORS[g]} />
                {view === 'dots' ? (
                  dotLayout
                    .filter((d) => d.g === g)
                    .map((d) => (
                      <circle
                        key={d.id}
                        cx={d.cx}
                        cy={d.cy}
                        r={DOT_R}
                        fill={dotFill(d.rank, d.v, stats[g], shownStep)}
                        stroke="#334155"
                        strokeWidth={1}
                        className="cursor-grab"
                      />
                    ))
                ) : (
                  <Histogram values={groups[g].points.map((p) => p.v)} min={axis.min} max={axis.max} binWidth={tickStep} top={top + BOX_H} height={dotH} sx={sx} color={GROUP_COLORS[g]} />
                )}
                <line x1={LEFT} y1={top + BOX_H + dotH} x2={RIGHT} y2={top + BOX_H + dotH} stroke="#cbd5e1" strokeWidth={1.5} />
              </g>
            );
          })}
          <line x1={LEFT} y1={axisY} x2={RIGHT} y2={axisY} stroke="#334155" strokeWidth={2} />
          {axisTicks.map((t) => (
            <g key={t}>
              <line x1={sx(t)} y1={axisY} x2={sx(t)} y2={axisY + 7} stroke="#334155" strokeWidth={2} />
              <text x={sx(t)} y={axisY + 30} fontSize={17} textAnchor="middle" fill="#475569">
                {fmt(t)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="rounded-xl border border-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-ink">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
            {compare && <span className="ml-2 font-normal text-ink-muted">(group {focusKey})</span>}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {compare && (
              <Segmented
                value={focus}
                onChange={setFocus}
                options={[
                  { value: 'A', label: 'Group A' },
                  { value: 'B', label: 'Group B' },
                ]}
              />
            )}
            <Button size="sm" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} leftIcon={<ChevronLeft className="h-4 w-4" />}>
              Back
            </Button>
            <Button size="sm" variant="outline" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1} rightIcon={<ChevronRight className="h-4 w-4" />}>
              Next
            </Button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              aria-pressed={i === step}
              className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors ${
                i === step ? 'bg-brand-600 text-white ring-brand-600' : i < step ? 'bg-brand-50 text-brand-700 ring-brand-100' : 'bg-white text-ink-muted ring-line hover:text-ink'
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        <SortedChips q={fq} step={step} />

        <div className="mt-3 space-y-1 font-mono text-[13px] leading-relaxed text-gray-700">
          <StepText q={fq} step={step} />
        </div>
      </div>

      <FiveNumberTable stats={visible.map((g) => ({ key: g, name: groups[g].name, q: stats[g] }))} compare={compare} />
    </div>
  );
}

function dotFill(rank: number, v: number, q: Quartiles, step: number) {
  if (step === STEPS.length - 1) return v < q.lowerFence || v > q.upperFence ? '#ef4444' : '#fbbf24';
  if (step >= 1 && step <= 3) {
    const half = Math.floor(q.n / 2);
    if (q.n % 2 && rank === half) return '#a855f7';
    if (rank < half) return step === 3 ? '#e2e8f0' : '#60a5fa';
    return step === 2 ? '#e2e8f0' : '#4ade80';
  }
  return '#fbbf24';
}

function BoxPlot({
  q,
  step,
  axisMin,
  axisMax,
  top,
  height,
  sx,
  color,
}: {
  q: Quartiles;
  step: number;
  axisMin: number;
  axisMax: number;
  top: number;
  height: number;
  sx: (v: number) => number;
  color: { fill: string; stroke: string; text: string };
}) {
  const mid = top + height / 2;
  const bottom = top + height;
  const last = STEPS.length - 1;
  return (
    <g>
      {step >= 4 && (
        <g>
          {[
            { v: q.lowerFence, t: 'LF' },
            { v: q.upperFence, t: 'UF' },
          ]
            .filter((f) => f.v >= axisMin && f.v <= axisMax)
            .map((f) => (
            <g key={f.t}>
              <line x1={sx(f.v)} y1={top - 4} x2={sx(f.v)} y2={bottom + 4} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="5 4" />
              <text x={sx(f.v)} y={bottom + 18} fontSize={13} textAnchor="middle" fill="#dc2626">
                {f.t}
              </text>
            </g>
          ))}
        </g>
      )}
      {step >= last && (
        <g stroke={color.stroke} strokeWidth={2.5}>
          <line x1={sx(q.whiskerLow)} y1={mid} x2={sx(q.q1)} y2={mid} />
          <line x1={sx(q.q3)} y1={mid} x2={sx(q.whiskerHigh)} y2={mid} />
          <line x1={sx(q.whiskerLow)} y1={top + 10} x2={sx(q.whiskerLow)} y2={bottom - 10} />
          <line x1={sx(q.whiskerHigh)} y1={top + 10} x2={sx(q.whiskerHigh)} y2={bottom - 10} />
        </g>
      )}
      {step >= 3 && <rect x={sx(q.q1)} y={top} width={Math.max(1, sx(q.q3) - sx(q.q1))} height={height} fill={color.fill} stroke={color.stroke} strokeWidth={2.5} />}
      {step >= 2 && <line x1={sx(q.q1)} y1={top} x2={sx(q.q1)} y2={bottom} stroke={color.stroke} strokeWidth={2.5} />}
      {step >= 3 && <line x1={sx(q.q3)} y1={top} x2={sx(q.q3)} y2={bottom} stroke={color.stroke} strokeWidth={2.5} />}
      {step >= 1 && <line x1={sx(q.q2)} y1={top} x2={sx(q.q2)} y2={bottom} stroke="#7e22ce" strokeWidth={4} />}
      {step >= last &&
        q.outliers.map((v, i) => (
          <g key={i} stroke="#dc2626" strokeWidth={2.5}>
            <line x1={sx(v) - 6} y1={mid - 6} x2={sx(v) + 6} y2={mid + 6} />
            <line x1={sx(v) - 6} y1={mid + 6} x2={sx(v) + 6} y2={mid - 6} />
          </g>
        ))}
      {step === 0 && (
        <text x={(sx(q.min) + sx(q.max)) / 2} y={mid + 5} fontSize={15} textAnchor="middle" fill="#94a3b8">
          The box appears as you step through the quartiles
        </text>
      )}
    </g>
  );
}

function Histogram({
  values,
  min,
  max,
  binWidth,
  top,
  height,
  sx,
  color,
}: {
  values: number[];
  min: number;
  max: number;
  binWidth: number;
  top: number;
  height: number;
  sx: (v: number) => number;
  color: { fill: string; stroke: string };
}) {
  const bins = Math.max(1, Math.round((max - min) / binWidth));
  const counts = new Array<number>(bins).fill(0);
  for (const v of values) counts[Math.min(bins - 1, Math.max(0, Math.floor((v - min) / binWidth)))]++;
  const peak = Math.max(1, ...counts);
  const bottom = top + height;
  return (
    <g>
      {counts.map((c, i) => {
        if (!c) return null;
        const h = (c / peak) * (height - 26);
        const x0 = sx(min + i * binWidth);
        const x1 = sx(min + (i + 1) * binWidth);
        return (
          <g key={i}>
            <rect x={x0 + 1} y={bottom - h} width={x1 - x0 - 2} height={h} fill={color.fill} stroke={color.stroke} strokeWidth={1.5} />
            <text x={(x0 + x1) / 2} y={bottom - h - 5} fontSize={14} textAnchor="middle" fill="#334155">
              {c}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function SortedChips({ q, step }: { q: Quartiles; step: number }) {
  const half = Math.floor(q.n / 2);
  const lowerMid = q.lower.length % 2 ? [Math.floor(q.lower.length / 2)] : [q.lower.length / 2 - 1, q.lower.length / 2];
  const upperStart = q.n - half;
  const medianIdx = q.n % 2 ? [half] : [half - 1, half];
  return (
    <ol className="mt-3 flex flex-wrap gap-1.5">
      {q.sorted.map((v, i) => {
        let cls = 'border-line bg-subtle text-ink';
        if (step >= 1 && step <= 3) {
          if (medianIdx.includes(i) && step === 1) cls = 'border-purple-500 bg-purple-50 font-semibold text-purple-800';
          else if (q.n % 2 && i === half) cls = 'border-purple-300 bg-purple-50 text-purple-700';
          else if (i < half) cls = step === 3 ? 'border-line bg-white text-ink-faint' : step === 2 && lowerMid.includes(i) ? 'border-blue-500 bg-blue-100 font-semibold text-blue-900' : 'border-blue-200 bg-blue-50 text-blue-800';
          else if (i >= upperStart) cls = step === 2 ? 'border-line bg-white text-ink-faint' : step === 3 && lowerMid.includes(i - upperStart) ? 'border-green-600 bg-green-100 font-semibold text-green-900' : 'border-green-200 bg-green-50 text-green-800';
        }
        if (step >= 5 && (v < q.lowerFence || v > q.upperFence)) cls = 'border-red-500 bg-red-50 font-semibold text-red-700';
        return (
          <li key={i} className={`min-w-10 rounded-md border px-2 py-1 text-center font-mono text-sm tabular-nums ${cls}`}>
            <span className="block text-[10px] leading-none text-ink-faint">{i + 1}</span>
            {fmt(v)}
          </li>
        );
      })}
    </ol>
  );
}

function StepText({ q, step }: { q: Quartiles; step: number }) {
  const half = Math.floor(q.n / 2);
  const odd = q.n % 2 === 1;
  switch (step) {
    case 0:
      return (
        <>
          <p>Sort the {q.n} values from smallest to largest.</p>
          <p>
            min = {fmt(q.min)}, max = {fmt(q.max)}
          </p>
        </>
      );
    case 1:
      return (
        <>
          <p>
            n = {q.n} is {odd ? 'odd, so the median is the middle value' : 'even, so the median is the mean of the two middle values'}.
          </p>
          <p>Median Q2: {describeMedian(q.sorted)}</p>
        </>
      );
    case 2:
      return (
        <>
          <p>
            Lower half: the {half} values below the median{odd ? ' (the median itself is left out of both halves)' : ''}, positions 1 to {half}.
          </p>
          <p>Q1 = median of lower half: {describeMedian(q.lower)}</p>
        </>
      );
    case 3:
      return (
        <>
          <p>
            Upper half: the {half} values above the median, positions {q.n - half + 1} to {q.n}.
          </p>
          <p>Q3 = median of upper half: {describeMedian(q.upper, q.n - half)}</p>
        </>
      );
    case 4:
      return (
        <>
          <p>
            IQR = Q3 − Q1 = {fmt(q.q3)} − {fmt(q.q1)} = {fmt(q.iqr)}
          </p>
          <p>
            1.5 × IQR = {fmt(1.5 * q.iqr)}
          </p>
          <p>
            Lower fence = Q1 − 1.5 × IQR = {fmt(q.q1)} − {fmt(1.5 * q.iqr)} = {fmt(q.lowerFence)}
          </p>
          <p>
            Upper fence = Q3 + 1.5 × IQR = {fmt(q.q3)} + {fmt(1.5 * q.iqr)} = {fmt(q.upperFence)}
          </p>
        </>
      );
    default:
      return (
        <>
          <p>
            Outliers (below {fmt(q.lowerFence)} or above {fmt(q.upperFence)}): {q.outliers.length ? q.outliers.map((v) => fmt(v)).join(', ') : 'none'}
          </p>
          <p>
            Whiskers reach the most extreme values inside the fences: {fmt(q.whiskerLow)} and {fmt(q.whiskerHigh)}
          </p>
        </>
      );
  }
}

function FiveNumberTable({ stats, compare }: { stats: { key: GroupKey; name: string; q: Quartiles }[]; compare: boolean }) {
  const rows: { label: string; get: (q: Quartiles) => string }[] = [
    { label: 'n', get: (q) => String(q.n) },
    { label: 'Minimum', get: (q) => fmt(q.min) },
    { label: 'Q1', get: (q) => fmt(q.q1) },
    { label: 'Median (Q2)', get: (q) => fmt(q.q2) },
    { label: 'Q3', get: (q) => fmt(q.q3) },
    { label: 'Maximum', get: (q) => fmt(q.max) },
    { label: 'IQR', get: (q) => fmt(q.iqr) },
    { label: 'Fences', get: (q) => `${fmt(q.lowerFence)} to ${fmt(q.upperFence)}` },
    { label: 'Outliers', get: (q) => (q.outliers.length ? q.outliers.map((v) => fmt(v)).join(', ') : 'none') },
  ];
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-sm">
        <thead className="border-b border-line bg-subtle text-left text-ink">
          <tr>
            <th scope="col" className="px-4 py-2 font-semibold">
              Summary
            </th>
            {stats.map((s) => (
              <th key={s.key} scope="col" className="px-4 py-2 text-right font-semibold" style={{ color: GROUP_COLORS[s.key].text }}>
                {compare ? `Group ${s.key}` : s.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line text-gray-700">
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="px-4 py-2 text-left font-medium text-ink">
                {row.label}
              </th>
              {stats.map((s) => (
                <td key={s.key} className="px-4 py-2 text-right font-mono tabular-nums">
                  {row.get(s.q)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
