'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

/* ------------------------------------------------------------------ */
/* Vector maths                                                        */
/* ------------------------------------------------------------------ */

interface Vec {
  x: number;
  y: number;
}

const add = (p: Vec, q: Vec): Vec => ({ x: p.x + q.x, y: p.y + q.y });
const subtract = (p: Vec, q: Vec): Vec => ({ x: p.x - q.x, y: p.y - q.y });
const scale = (p: Vec, k: number): Vec => ({ x: p.x * k, y: p.y * k });
const dot = (p: Vec, q: Vec) => p.x * q.x + p.y * q.y;
/** z-component of the 3D cross product (p.x, p.y, 0) × (q.x, q.y, 0). */
const cross = (p: Vec, q: Vec) => p.x * q.y - p.y * q.x;
const length = (p: Vec) => Math.hypot(p.x, p.y);

/** Rounds to 2 decimals and uses a real minus sign. */
function fmt(v: number): string {
  const r = Math.round(v * 100) / 100;
  const s = String(Math.abs(r));
  return r < 0 ? `−${s}` : s;
}

const fmtVec = (v: Vec) => `(${fmt(v.x)}, ${fmt(v.y)})`;

/* ------------------------------------------------------------------ */
/* Drawing space: 600 × 600 units, 50 units per grid square, ±6 range  */
/* ------------------------------------------------------------------ */

const SIZE = 600;
const UNIT = 50;
const ORIGIN = SIZE / 2;
const LIMIT = 5.5; // keep vector tips inside the grid

const toScreen = (v: Vec): Vec => ({ x: ORIGIN + v.x * UNIT, y: ORIGIN - v.y * UNIT });
const toMath = (p: Vec): Vec => ({ x: (p.x - ORIGIN) / UNIT, y: (ORIGIN - p.y) / UNIT });

const colors = {
  a: '#2563eb', // blue
  b: '#dc2626', // red
  result: '#7c3aed', // violet
  projection: '#059669', // green
  helper: '#94a3b8', // slate
};

type Mode = 'sum' | 'difference' | 'dot' | 'cross';

const modes: { id: Mode; label: string }[] = [
  { id: 'sum', label: 'Sum a + b' },
  { id: 'difference', label: 'Difference a − b' },
  { id: 'dot', label: 'Dot product' },
  { id: 'cross', label: 'Cross product' },
];

const initialA: Vec = { x: 4, y: 1 };
const initialB: Vec = { x: 1, y: 3 };

/* ------------------------------------------------------------------ */
/* SVG pieces                                                          */
/* ------------------------------------------------------------------ */

/** An arrow between two points given in maths coordinates. */
function Arrow({ from, to, color, width = 4, dashed = false }: { from: Vec; to: Vec; color: string; width?: number; dashed?: boolean }) {
  const s = toScreen(from);
  const e = toScreen(to);
  const len = Math.hypot(e.x - s.x, e.y - s.y);
  if (len < 1) return null;
  const ux = (e.x - s.x) / len;
  const uy = (e.y - s.y) / len;
  const head = Math.min(18, len * 0.6);
  const baseX = e.x - ux * head;
  const baseY = e.y - uy * head;
  const half = head * 0.45;
  return (
    <g>
      <line
        x1={s.x}
        y1={s.y}
        x2={baseX}
        y2={baseY}
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? '10 8' : undefined}
        strokeLinecap="round"
      />
      <polygon
        points={`${e.x},${e.y} ${baseX - uy * half},${baseY + ux * half} ${baseX + uy * half},${baseY - ux * half}`}
        fill={color}
        opacity={dashed ? 0.6 : 1}
      />
    </g>
  );
}

/** Text with a white halo so it stays readable over grid lines and fills. */
function Label({ at, color, children, size = 24 }: { at: Vec; color: string; children: React.ReactNode; size?: number }) {
  const p = toScreen(at);
  return (
    <text
      x={p.x}
      y={p.y}
      fill={color}
      fontSize={size}
      fontWeight={700}
      textAnchor="middle"
      dominantBaseline="middle"
      stroke="white"
      strokeWidth={6}
      paintOrder="stroke"
      className="pointer-events-none select-none"
    >
      {children}
    </text>
  );
}

/** Point just beyond the tip of v, used to place its name. */
function beyondTip(v: Vec, start: Vec = { x: 0, y: 0 }): Vec {
  const len = length(v) || 1;
  return add(add(start, v), scale(v, 0.55 / len));
}

/** Point at distance `dist` along the bisector of the angle between p and q (both non-zero). */
function bisector(p: Vec, q: Vec, dist: number): Vec {
  let mid = add(scale(p, 1 / length(p)), scale(q, 1 / length(q)));
  // Opposite vectors: the bisector is perpendicular to both.
  if (length(mid) < 1e-6) mid = { x: -p.y, y: p.x };
  return scale(mid, dist / length(mid));
}

/** SVG path for an arc of radius r (screen units) around the origin, from direction p to direction q. */
function angleArc(p: Vec, q: Vec, r: number): string {
  const a1 = Math.atan2(p.y, p.x);
  let delta = Math.atan2(q.y, q.x) - a1;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta <= -Math.PI) delta += 2 * Math.PI;
  const a2 = a1 + delta;
  const x1 = ORIGIN + r * Math.cos(a1);
  const y1 = ORIGIN - r * Math.sin(a1);
  const x2 = ORIGIN + r * Math.cos(a2);
  const y2 = ORIGIN - r * Math.sin(a2);
  // y is flipped on screen, so a counter-clockwise turn in maths is sweep-flag 0.
  return `M ${x1} ${y1} A ${r} ${r} 0 0 ${delta > 0 ? 0 : 1} ${x2} ${y2}`;
}

/* ------------------------------------------------------------------ */
/* Visualizer                                                          */
/* ------------------------------------------------------------------ */

export default function VectorOperationsVisualizer() {
  const [a, setA] = useState<Vec>(initialA);
  const [b, setB] = useState<Vec>(initialB);
  const [mode, setMode] = useState<Mode>('dot');
  const [snap, setSnap] = useState(true);
  const [dragging, setDragging] = useState<'a' | 'b' | null>(null);

  // Derived values
  const lenA = length(a);
  const lenB = length(b);
  const sum = add(a, b);
  const diff = subtract(a, b);
  const d = dot(a, b);
  const z = cross(a, b);
  const hasAngle = lenA > 1e-9 && lenB > 1e-9;
  const cosTheta = hasAngle ? Math.max(-1, Math.min(1, d / (lenA * lenB))) : 0;
  const theta = (Math.acos(cosTheta) * 180) / Math.PI;
  const proj = lenB > 1e-9 ? scale(b, d / (lenB * lenB)) : { x: 0, y: 0 };

  const pointerToVec = (e: React.PointerEvent<SVGSVGElement>): Vec => {
    const m = toMath(toDrawingPoint(e, e.currentTarget));
    const step = snap ? 1 : 0.1;
    const round = (v: number) => Math.round(Math.max(-LIMIT, Math.min(LIMIT, v)) / step) * step;
    return { x: round(m.x), y: round(m.y) };
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const p = toDrawingPoint(e, e.currentTarget);
    const distTo = (v: Vec) => {
      const s = toScreen(v);
      return Math.hypot(s.x - p.x, s.y - p.y);
    };
    const da = distTo(a);
    const db = distTo(b);
    const grabRadius = 45;
    const target = da <= db ? (da < grabRadius ? 'a' : null) : db < grabRadius ? 'b' : null;
    if (!target) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(target);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const v = pointerToVec(e);
    if (dragging === 'a') setA(v);
    else setB(v);
  };

  const stopDragging = () => setDragging(null);

  const reset = () => {
    setA(initialA);
    setB(initialB);
  };

  const gridLines = Array.from({ length: 13 }, (_, i) => i - 6);
  const origin: Vec = { x: 0, y: 0 };

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        {modes.map((m) => (
          <Button key={m.id} size="sm" variant={mode === m.id ? 'primary' : 'outline'} onClick={() => setMode(m.id)}>
            {m.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className={`${responsiveSurface} touch-none rounded-xl border border-line bg-white ${dragging ? 'cursor-grabbing' : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerCancel={stopDragging}
            role="img"
            aria-label={`Vector a = ${fmtVec(a)} and vector b = ${fmtVec(b)} on a coordinate grid`}
          >
            {/* Grid */}
            {gridLines.map((g) => {
              const pos = ORIGIN + g * UNIT;
              const axis = g === 0;
              return (
                <g key={g}>
                  <line x1={pos} y1={0} x2={pos} y2={SIZE} stroke={axis ? '#475569' : '#e2e8f0'} strokeWidth={axis ? 2 : 1} />
                  <line x1={0} y1={pos} x2={SIZE} y2={pos} stroke={axis ? '#475569' : '#e2e8f0'} strokeWidth={axis ? 2 : 1} />
                  {g !== 0 && g % 2 === 0 && (
                    <>
                      <text x={pos} y={ORIGIN + 22} fontSize={18} fill="#64748b" textAnchor="middle">
                        {g}
                      </text>
                      <text x={ORIGIN - 10} y={ORIGIN - g * UNIT + 6} fontSize={18} fill="#64748b" textAnchor="end">
                        {g}
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {/* Mode-specific constructions, drawn under the main vectors */}
            {mode === 'sum' && (
              <>
                <Arrow from={a} to={sum} color={colors.b} width={3} dashed />
                <Arrow from={b} to={sum} color={colors.a} width={3} dashed />
                <Arrow from={origin} to={sum} color={colors.result} width={5} />
                <Label at={beyondTip(sum)} color={colors.result}>
                  a + b
                </Label>
              </>
            )}

            {mode === 'difference' && (
              <>
                <Arrow from={origin} to={diff} color={colors.result} width={3} dashed />
                <Arrow from={b} to={a} color={colors.result} width={5} />
                <Label at={add(scale(add(a, b), 0.5), { x: 0, y: 0.45 })} color={colors.result}>
                  a − b
                </Label>
              </>
            )}

            {mode === 'dot' && (
              <>
                {lenB > 1e-9 && (
                  <line
                    x1={toScreen(scale(b, -10)).x}
                    y1={toScreen(scale(b, -10)).y}
                    x2={toScreen(scale(b, 10)).x}
                    y2={toScreen(scale(b, 10)).y}
                    stroke={colors.helper}
                    strokeWidth={1.5}
                    strokeDasharray="4 6"
                  />
                )}
                <line
                  x1={toScreen(a).x}
                  y1={toScreen(a).y}
                  x2={toScreen(proj).x}
                  y2={toScreen(proj).y}
                  stroke={colors.helper}
                  strokeWidth={2.5}
                  strokeDasharray="8 6"
                />
                <Arrow from={origin} to={proj} color={colors.projection} width={7} />
                {hasAngle && (
                  <>
                    <path d={angleArc(a, b, 48)} fill="none" stroke="#f59e0b" strokeWidth={3} />
                    <Label at={bisector(a, b, 1.5)} color="#b45309" size={22}>
                      θ
                    </Label>
                  </>
                )}
              </>
            )}

            {mode === 'cross' && (
              <>
                <polygon
                  points={[origin, a, sum, b].map((v) => `${toScreen(v).x},${toScreen(v).y}`).join(' ')}
                  fill={z >= 0 ? '#3b82f6' : '#ef4444'}
                  fillOpacity={0.18}
                  stroke={z >= 0 ? '#3b82f6' : '#ef4444'}
                  strokeWidth={2}
                  strokeDasharray="6 5"
                />
                {hasAngle && <path d={angleArc(a, b, 40)} fill="none" stroke="#f59e0b" strokeWidth={3} />}
                <Label at={scale(sum, 0.5)} color={z >= 0 ? '#1d4ed8' : '#b91c1c'} size={22}>
                  {`z = ${fmt(z)}`}
                </Label>
              </>
            )}

            {/* The two vectors and their drag handles */}
            <Arrow from={origin} to={a} color={colors.a} />
            <Arrow from={origin} to={b} color={colors.b} />
            <Label at={beyondTip(a)} color={colors.a}>
              a
            </Label>
            <Label at={beyondTip(b)} color={colors.b}>
              b
            </Label>
            {(['a', 'b'] as const).map((name) => {
              const p = toScreen(name === 'a' ? a : b);
              return (
                <circle
                  key={name}
                  cx={p.x}
                  cy={p.y}
                  r={13}
                  fill="white"
                  stroke={name === 'a' ? colors.a : colors.b}
                  strokeWidth={4}
                  className={dragging ? '' : 'cursor-grab'}
                />
              );
            })}
          </svg>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={snap} onChange={(e) => setSnap(e.target.checked)} className="h-4 w-4 accent-brand-600" />
              Snap to whole numbers
            </label>
            <Button size="sm" variant="ghost" onClick={reset} leftIcon={<RotateCcw className="h-4 w-4" />}>
              Reset vectors
            </Button>
          </div>
        </div>

        {/* Readouts */}
        <div className="space-y-3 text-sm">
          <div className="rounded-xl border border-line bg-subtle p-4 font-mono">
            <p style={{ color: colors.a }} className="font-semibold">
              a = {fmtVec(a)}
            </p>
            <p className="text-ink-muted">|a| = √({fmt(a.x)}² + {fmt(a.y)}²) = {fmt(lenA)}</p>
            <p style={{ color: colors.b }} className="mt-2 font-semibold">
              b = {fmtVec(b)}
            </p>
            <p className="text-ink-muted">|b| = √({fmt(b.x)}² + {fmt(b.y)}²) = {fmt(lenB)}</p>
          </div>

          {mode === 'sum' && (
            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
              <p className="font-semibold text-violet-900">Vector addition</p>
              <p className="mt-1 font-mono text-ink">
                a + b = ({fmt(a.x)} + {fmt(b.x)}, {fmt(a.y)} + {fmt(b.y)}) = {fmtVec(sum)}
              </p>
              <p className="font-mono text-ink">|a + b| = {fmt(length(sum))}</p>
              <p className="mt-2 text-ink-muted">
                Place b tip-to-tail at the end of a. The sum is the diagonal of the parallelogram. Note |a + b| ≤ |a| + |b|
                (triangle inequality).
              </p>
            </div>
          )}

          {mode === 'difference' && (
            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
              <p className="font-semibold text-violet-900">Vector subtraction</p>
              <p className="mt-1 font-mono text-ink">
                a − b = ({fmt(a.x)} − {fmt(b.x)}, {fmt(a.y)} − {fmt(b.y)}) = {fmtVec(diff)}
              </p>
              <p className="font-mono text-ink">|a − b| = {fmt(length(diff))}</p>
              <p className="mt-2 text-ink-muted">
                a − b points from the tip of b to the tip of a, so its length is the distance between the two tips. The dashed
                copy starts at the origin.
              </p>
            </div>
          )}

          {mode === 'dot' && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
              <p className="font-semibold text-emerald-900">Dot product</p>
              <p className="mt-1 font-mono text-ink">
                a · b = {fmt(a.x)}×{fmt(b.x)} + {fmt(a.y)}×{fmt(b.y)} = {fmt(d)}
              </p>
              {hasAngle ? (
                <>
                  <p className="font-mono text-ink">
                    cos θ = {fmt(d)} / ({fmt(lenA)}×{fmt(lenB)}) = {fmt(cosTheta)}
                  </p>
                  <p className="font-mono text-ink">θ = {fmt(theta)}°</p>
                  <p className="font-mono text-ink">
                    projection of a on b = {fmtVec(proj)}, length {fmt(d / lenB)}
                  </p>
                  <p className="mt-2 text-ink-muted">
                    {Math.abs(d) < 1e-9
                      ? 'a · b = 0: the vectors are perpendicular, so the projection is the zero vector.'
                      : d > 0
                        ? 'a · b > 0: the angle is acute and the projection (green) points the same way as b.'
                        : 'a · b < 0: the angle is obtuse and the projection (green) points opposite to b.'}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-ink-muted">The angle is undefined when one of the vectors is the zero vector.</p>
              )}
            </div>
          )}

          {mode === 'cross' && (
            <div className={`rounded-xl border p-4 ${z >= 0 ? 'border-blue-200 bg-blue-50/70' : 'border-red-200 bg-red-50/70'}`}>
              <p className={`font-semibold ${z >= 0 ? 'text-blue-900' : 'text-red-900'}`}>Cross product (z-component)</p>
              <p className="mt-1 font-mono text-ink">
                a × b = (0, 0, {fmt(a.x)}×{fmt(b.y)} − {fmt(a.y)}×{fmt(b.x)})
              </p>
              <p className="font-mono text-ink">z = {fmt(z)}</p>
              <p className="font-mono text-ink">parallelogram area = |z| = {fmt(Math.abs(z))}</p>
              <p className="mt-2 text-ink-muted">
                {Math.abs(z) < 1e-9
                  ? 'z = 0: a and b are parallel (or one is zero), so the parallelogram is flat.'
                  : z > 0
                    ? 'z > 0: turning from a to b is counter-clockwise, so a × b points out of the screen.'
                    : 'z < 0: turning from a to b is clockwise, so a × b points into the screen.'}{' '}
                Also |a × b| = |a||b| sin θ.
              </p>
            </div>
          )}

          <p className="text-ink-muted">Drag the white handles at the tips of a and b.</p>
        </div>
      </div>
    </div>
  );
}
