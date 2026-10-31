'use client';

import { useRef, useState } from 'react';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

// ---------- Affine maths ----------

type Point = [number, number];

/** Affine map x' = a·x + b·y + e, y' = c·x + d·y + f. Stored as the top two rows of the 3×3 matrix. */
interface Affine {
  a: number;
  b: number;
  e: number;
  c: number;
  d: number;
  f: number;
}

const IDENTITY: Affine = { a: 1, b: 0, e: 0, c: 0, d: 1, f: 0 };

/** Returns "second after first": apply `first`, then `second` (matrix product second × first). */
function compose(second: Affine, first: Affine): Affine {
  return {
    a: second.a * first.a + second.b * first.c,
    b: second.a * first.b + second.b * first.d,
    e: second.a * first.e + second.b * first.f + second.e,
    c: second.c * first.a + second.d * first.c,
    d: second.c * first.b + second.d * first.d,
    f: second.c * first.e + second.d * first.f + second.f,
  };
}

const apply = (m: Affine, [x, y]: Point): Point => [m.a * x + m.b * y + m.e, m.c * x + m.d * y + m.f];

/** Removes floating-point noise such as cos 90° = 6e-17. */
const clean = (v: number) => {
  const r = Math.round(v * 1e6) / 1e6;
  return Object.is(r, -0) ? 0 : r;
};

const num = (v: number) => {
  const r = clean(v);
  const s = Number.isInteger(r) ? String(r) : String(Number(r.toFixed(3)));
  return s.replace('-', '−');
};

/** Formats a·x + b·y + e as readable text, e.g. "−y + 2". */
function linearText(cx: number, cy: number, k: number) {
  const parts: { sign: 1 | -1; body: string }[] = [];
  const add = (coef: number, v: string) => {
    const c = clean(coef);
    if (c === 0) return;
    const mag = Math.abs(c);
    parts.push({ sign: c < 0 ? -1 : 1, body: v === '' ? num(mag) : `${mag === 1 ? '' : num(mag)}${v}` });
  };
  add(cx, 'x');
  add(cy, 'y');
  add(k, '');
  if (parts.length === 0) return '0';
  return parts.map((p, i) => (i === 0 ? (p.sign < 0 ? '−' : '') + p.body : `${p.sign < 0 ? ' − ' : ' + '}${p.body}`)).join('');
}

const ruleText = (m: Affine) => `(x, y) → (${linearText(m.a, m.b, m.e)}, ${linearText(m.c, m.d, m.f)})`;

// ---------- Transformation steps ----------

type Kind = 'translate' | 'rotate' | 'reflect' | 'dilate';
type Mirror = 'x-axis' | 'y-axis' | 'y=x' | 'y=-x';

interface Step {
  id: number;
  kind: Kind;
  dx: number;
  dy: number;
  angle: number;
  k: number;
  cx: number;
  cy: number;
  mirror: Mirror;
}

const mirrorLabels: Record<Mirror, string> = { 'x-axis': 'the x-axis', 'y-axis': 'the y-axis', 'y=x': 'y = x', 'y=-x': 'y = −x' };

const mirrorMatrices: Record<Mirror, Affine> = {
  'x-axis': { a: 1, b: 0, e: 0, c: 0, d: -1, f: 0 },
  'y-axis': { a: -1, b: 0, e: 0, c: 0, d: 1, f: 0 },
  'y=x': { a: 0, b: 1, e: 0, c: 1, d: 0, f: 0 },
  'y=-x': { a: 0, b: -1, e: 0, c: -1, d: 0, f: 0 },
};

function stepMatrix(s: Step): Affine {
  switch (s.kind) {
    case 'translate':
      return { a: 1, b: 0, e: s.dx, c: 0, d: 1, f: s.dy };
    case 'rotate': {
      const t = (s.angle * Math.PI) / 180;
      const cos = clean(Math.cos(t));
      const sin = clean(Math.sin(t));
      // Shift the centre to the origin, rotate, shift back.
      return { a: cos, b: -sin, e: s.cx - cos * s.cx + sin * s.cy, c: sin, d: cos, f: s.cy - sin * s.cx - cos * s.cy };
    }
    case 'reflect':
      return mirrorMatrices[s.mirror];
    case 'dilate':
      return { a: s.k, b: 0, e: s.cx - s.k * s.cx, c: 0, d: s.k, f: s.cy - s.k * s.cy };
  }
}

function stepName(s: Step) {
  const centre = `(${num(s.cx)}, ${num(s.cy)})`;
  switch (s.kind) {
    case 'translate':
      return `Translate by ⟨${num(s.dx)}, ${num(s.dy)}⟩`;
    case 'rotate':
      return `Rotate ${Math.abs(s.angle)}° ${s.angle >= 0 ? 'counterclockwise' : 'clockwise'} about ${centre}`;
    case 'reflect':
      return `Reflect over ${mirrorLabels[s.mirror]}`;
    case 'dilate':
      return `Dilate by k = ${num(s.k)} about ${centre}`;
  }
}

let nextId = 1;
const newStep = (kind: Kind = 'translate'): Step => ({ id: nextId++, kind, dx: 3, dy: -2, angle: 90, k: 2, cx: 0, cy: 0, mirror: 'y-axis' });

const shapes: { name: string; points: Point[] }[] = [
  { name: 'Triangle', points: [[1, 1], [4, 1], [1, 3]] },
  { name: 'Quadrilateral', points: [[1, 1], [3, 1], [4, 3], [1, 4]] },
  { name: 'L-shape', points: [[1, 1], [2, 1], [2, 3], [4, 3], [4, 4], [1, 4]] },
];

const LETTERS = 'ABCDEF';
const MAX_STEPS = 4;
const STEP_COLORS = ['#94a3b8', '#a78bfa', '#f472b6', '#fbbf24'];

// ---------- Drawing (SVG 600 × 600, grid from −8 to 8) ----------

const SIZE = 600;
const RANGE = 8;
const UNIT = 34;
const ORIGIN = SIZE / 2;
const toX = (x: number) => ORIGIN + x * UNIT;
const toY = (y: number) => ORIGIN - y * UNIT;
const ticks = Array.from({ length: 2 * RANGE + 1 }, (_, i) => i - RANGE);

function Grid() {
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={toX(t)} x2={toX(t)} y1={toY(RANGE)} y2={toY(-RANGE)} stroke={t === 0 ? '#475569' : '#e2e8f0'} strokeWidth={t === 0 ? 2 : 1} />
          <line x1={toX(-RANGE)} x2={toX(RANGE)} y1={toY(t)} y2={toY(t)} stroke={t === 0 ? '#475569' : '#e2e8f0'} strokeWidth={t === 0 ? 2 : 1} />
        </g>
      ))}
      {ticks
        .filter((t) => t !== 0 && t % 2 === 0)
        .map((t) => (
          <g key={`l${t}`} fontSize={20} fill="#64748b">
            <text x={toX(t)} y={toY(0) + 22} textAnchor="middle">
              {num(t)}
            </text>
            <text x={toX(0) - 8} y={toY(t) + 6} textAnchor="end">
              {num(t)}
            </text>
          </g>
        ))}
    </g>
  );
}

function MirrorLine({ mirror }: { mirror: Mirror }) {
  const ends: Record<Mirror, [Point, Point]> = {
    'x-axis': [[-RANGE, 0], [RANGE, 0]],
    'y-axis': [[0, -RANGE], [0, RANGE]],
    'y=x': [[-RANGE, -RANGE], [RANGE, RANGE]],
    'y=-x': [[-RANGE, RANGE], [RANGE, -RANGE]],
  };
  const [p, q] = ends[mirror];
  return <line x1={toX(p[0])} y1={toY(p[1])} x2={toX(q[0])} y2={toY(q[1])} stroke="#0ea5e9" strokeWidth={3} strokeDasharray="10 6" />;
}

function Polygon({ points, color, fill, labels, dashed }: { points: Point[]; color: string; fill: string; labels?: string[]; dashed?: boolean }) {
  const centroid: Point = [points.reduce((s, p) => s + p[0], 0) / points.length, points.reduce((s, p) => s + p[1], 0) / points.length];
  return (
    <g>
      <polygon
        points={points.map((p) => `${toX(p[0])},${toY(p[1])}`).join(' ')}
        fill={fill}
        stroke={color}
        strokeWidth={3}
        strokeDasharray={dashed ? '8 6' : undefined}
        strokeLinejoin="round"
      />
      {labels &&
        points.map((p, i) => {
          const dx = p[0] - centroid[0];
          const dy = p[1] - centroid[1];
          const len = Math.hypot(dx, dy) || 1;
          return (
            <text
              key={i}
              x={toX(p[0]) + (dx / len) * 24}
              y={toY(p[1]) - (dy / len) * 24 + 7}
              fontSize={21}
              fontWeight={700}
              fill={color}
              textAnchor="middle"
              stroke="#ffffff"
              strokeWidth={4}
              paintOrder="stroke"
            >
              {labels[i]}
            </text>
          );
        })}
    </g>
  );
}

// ---------- UI pieces ----------

function MatrixView({ rows }: { rows: number[][] }) {
  return (
    <div className="inline-flex items-stretch font-mono text-sm text-ink">
      <span className="w-1.5 rounded-l border-y-2 border-l-2 border-ink" aria-hidden />
      <div className="grid gap-x-4 gap-y-1 px-2 py-1" style={{ gridTemplateColumns: `repeat(${rows[0].length}, auto)` }}>
        {rows.flat().map((v, i) => (
          <span key={i} className="text-right tabular-nums">
            {num(v)}
          </span>
        ))}
      </div>
      <span className="w-1.5 rounded-r border-y-2 border-r-2 border-ink" aria-hidden />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <Input
      label={label}
      type="number"
      step={1}
      min={-RANGE}
      max={RANGE}
      value={value}
      onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
    />
  );
}

function RangeField({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit?: string; onChange: (v: number) => void }) {
  return (
    <label className="col-span-2 block">
      <span className="flex justify-between text-sm font-medium text-ink">
        <span>{label}</span>
        <span className="font-mono text-ink-muted">
          {num(value)}
          {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-brand-600" />
    </label>
  );
}

function StepEditor({ step, index, onChange, onRemove }: { step: Step; index: number; onChange: (patch: Partial<Step>) => void; onRemove: () => void }) {
  const m = stepMatrix(step);
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-0 flex-1">
          <Select label={`Step ${index + 1}`} value={step.kind} onChange={(e) => onChange({ kind: e.target.value as Kind })}>
            <option value="translate">Translation</option>
            <option value="rotate">Rotation</option>
            <option value="reflect">Reflection</option>
            <option value="dilate">Dilation</option>
          </Select>
        </div>
        <Button variant="ghost" size="md" onClick={onRemove} aria-label={`Remove step ${index + 1}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {step.kind === 'translate' && (
          <>
            <NumberField label="Right by (a)" value={step.dx} onChange={(dx) => onChange({ dx })} />
            <NumberField label="Up by (b)" value={step.dy} onChange={(dy) => onChange({ dy })} />
          </>
        )}
        {step.kind === 'rotate' && (
          <>
            <RangeField label="Angle (counterclockwise +)" value={step.angle} min={-180} max={180} step={15} unit="°" onChange={(angle) => onChange({ angle })} />
            <NumberField label="Centre x" value={step.cx} onChange={(cx) => onChange({ cx })} />
            <NumberField label="Centre y" value={step.cy} onChange={(cy) => onChange({ cy })} />
          </>
        )}
        {step.kind === 'reflect' && (
          <div className="col-span-2">
            <Select label="Mirror line" value={step.mirror} onChange={(e) => onChange({ mirror: e.target.value as Mirror })}>
              <option value="x-axis">x-axis</option>
              <option value="y-axis">y-axis</option>
              <option value="y=x">y = x</option>
              <option value="y=-x">y = −x</option>
            </Select>
          </div>
        )}
        {step.kind === 'dilate' && (
          <>
            <RangeField label="Scale factor k" value={step.k} min={0.25} max={3} step={0.25} onChange={(k) => onChange({ k })} />
            <NumberField label="Centre x" value={step.cx} onChange={(cx) => onChange({ cx })} />
            <NumberField label="Centre y" value={step.cy} onChange={(cy) => onChange({ cy })} />
          </>
        )}
      </div>

      <p className="mt-3 text-sm text-ink">{stepName(step)}</p>
      <p className="mt-1 break-words font-mono text-sm text-ink-muted">{ruleText(m)}</p>
    </div>
  );
}

// ---------- Main component ----------

export default function GeometricTransformationsVisualizer() {
  const [points, setPoints] = useState<Point[]>(shapes[0].points);
  const [steps, setSteps] = useState<Step[]>(() => [newStep('rotate')]);
  const [showIntermediate, setShowIntermediate] = useState(true);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Each stage's vertices: stages[0] is the original, stages[i] is after step i.
  const matrices = steps.map(stepMatrix);
  const stages: Point[][] = [points];
  for (const m of matrices) stages.push(stages[stages.length - 1].map((p) => apply(m, p)));
  const composite = matrices.reduce((acc, m) => compose(m, acc), IDENTITY);
  const finalPoints = stages[stages.length - 1];
  const primes = (n: number) => '′'.repeat(n);
  const labelsFor = (stage: number) => points.map((_, i) => `${LETTERS[i]}${primes(stage)}`);

  const updateStep = (id: number, patch: Partial<Step>) => setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const dragTo = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragIndex === null || !svgRef.current) return;
    const { x, y } = toDrawingPoint(e, svgRef.current);
    const gx = Math.max(-RANGE, Math.min(RANGE, Math.round((x - ORIGIN) / UNIT)));
    const gy = Math.max(-RANGE, Math.min(RANGE, Math.round((ORIGIN - y) / UNIT)));
    setPoints((prev) => prev.map((p, i) => (i === dragIndex ? [gx, gy] : p)));
  };

  const centreSteps = steps.filter((s) => s.kind === 'rotate' || s.kind === 'dilate');
  const mirrorSteps = steps.filter((s) => s.kind === 'reflect');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-muted">Shape:</span>
        {shapes.map((s) => (
          <Button key={s.name} size="sm" variant="outline" onClick={() => setPoints(s.points)}>
            {s.name}
          </Button>
        ))}
        <label className="flex items-center gap-2 text-sm text-ink sm:ml-auto">
          <input type="checkbox" checked={showIntermediate} onChange={(e) => setShowIntermediate(e.target.checked)} className="h-4 w-4 accent-brand-600" />
          Show intermediate images
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="rounded-card border border-line bg-white p-4 shadow-card">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className={`${responsiveSurface} touch-none`}
            role="img"
            aria-label="Coordinate grid showing the original shape and its image"
            onPointerMove={dragTo}
            onPointerUp={() => setDragIndex(null)}
            onPointerCancel={() => setDragIndex(null)}
          >
            <defs>
              <clipPath id="transform-grid-clip">
                <rect x={toX(-RANGE)} y={toY(RANGE)} width={2 * RANGE * UNIT} height={2 * RANGE * UNIT} />
              </clipPath>
            </defs>
            <rect width={SIZE} height={SIZE} fill="#ffffff" />
            <Grid />
            <g clipPath="url(#transform-grid-clip)">
              {mirrorSteps.map((s) => (
                <MirrorLine key={s.id} mirror={s.mirror} />
              ))}
              {showIntermediate &&
                stages.slice(1, -1).map((stage, i) => (
                  <Polygon key={i} points={stage} color={STEP_COLORS[i % STEP_COLORS.length]} fill="none" dashed labels={labelsFor(i + 1)} />
                ))}
              {steps.length > 0 && <Polygon points={finalPoints} color="#dc2626" fill="rgba(220, 38, 38, 0.15)" labels={labelsFor(steps.length)} />}
              <Polygon points={points} color="#2563eb" fill="rgba(37, 99, 235, 0.15)" labels={labelsFor(0)} />
              {centreSteps.map((s) => (
                <g key={s.id}>
                  <circle cx={toX(s.cx)} cy={toY(s.cy)} r={7} fill="#0f172a" />
                  <circle cx={toX(s.cx)} cy={toY(s.cy)} r={12} fill="none" stroke="#0f172a" strokeWidth={2} />
                </g>
              ))}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={toX(p[0])}
                  cy={toY(p[1])}
                  r={dragIndex === i ? 11 : 8}
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth={3}
                  className="cursor-grab"
                  onPointerDown={(e) => {
                    svgRef.current?.setPointerCapture(e.pointerId);
                    setDragIndex(i);
                  }}
                />
              ))}
            </g>
          </svg>
          <p className="mt-2 text-xs text-ink-muted">
            Drag the blue vertices to reshape the original. Blue: original. Red: final image. Dashed: images after each earlier step. Black ring: centre of rotation or dilation.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((s, i) => (
            <StepEditor key={s.id} step={s} index={i} onChange={(patch) => updateStep(s.id, patch)} onRemove={() => setSteps((prev) => prev.filter((x) => x.id !== s.id))} />
          ))}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" leftIcon={<Plus className="h-4 w-4" />} disabled={steps.length >= MAX_STEPS} onClick={() => setSteps((prev) => [...prev, newStep()])}>
              Add step
            </Button>
            <Button size="sm" variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => setSteps([newStep('rotate')])}>
              Reset steps
            </Button>
          </div>
          {steps.length >= MAX_STEPS && <p className="text-xs text-ink-muted">Up to {MAX_STEPS} steps can be composed.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-white p-4 shadow-card">
          <h3 className="text-sm font-semibold text-ink">{steps.length > 1 ? 'Combined transformation' : 'Transformation'}</h3>
          <p className="mt-2 break-words font-mono text-sm text-ink">{ruleText(composite)}</p>
          <div className="mt-4 flex flex-wrap gap-6">
            <div>
              <p className="mb-2 text-xs text-ink-muted">2×2 matrix (linear part)</p>
              <MatrixView rows={[[composite.a, composite.b], [composite.c, composite.d]]} />
            </div>
            <div>
              <p className="mb-2 text-xs text-ink-muted">3×3 homogeneous matrix</p>
              <MatrixView rows={[[composite.a, composite.b, composite.e], [composite.c, composite.d, composite.f], [0, 0, 1]]} />
            </div>
          </div>
          <p className="mt-4 text-xs text-ink-muted">
            {steps.length > 1
              ? `Combined matrix = M${steps.length}${steps.length > 2 ? ' ⋯ ' : ' · '}M1: the first step is on the right, because it acts on the point first.`
              : 'The third column of the 3×3 matrix holds the translation, which a 2×2 matrix cannot represent.'}{' '}
            Determinant {num(composite.a * composite.d - composite.b * composite.c)}
            {clean(composite.a * composite.d - composite.b * composite.c) < 0 ? ' (negative: orientation is reversed)' : ''}.
          </p>
        </div>

        <div className="rounded-card border border-line bg-white p-4 shadow-card">
          <h3 className="text-sm font-semibold text-ink">Vertex coordinates</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-ink-muted">
                <tr>
                  <th className="py-1 pr-4 font-medium">Original</th>
                  {steps.map((s, i) => (
                    <th key={s.id} className="py-1 pr-4 font-medium">
                      Step {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-mono">
                {points.map((_, v) => (
                  <tr key={v}>
                    {stages.map((stage, si) => (
                      <td key={si} className={`whitespace-nowrap py-1.5 pr-4 ${si === 0 ? 'text-blue-700' : si === stages.length - 1 ? 'text-red-700' : 'text-ink-muted'}`}>
                        {LETTERS[v]}
                        {primes(si)}({num(stage[v][0])}, {num(stage[v][1])})
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
