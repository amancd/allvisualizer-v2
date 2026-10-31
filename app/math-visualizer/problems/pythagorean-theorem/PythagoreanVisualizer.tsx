'use client';

import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';

interface Pt {
  x: number;
  y: number;
}

/** Rounds to 2 decimals and drops trailing zeros. */
const fmt = (v: number) => String(Math.round(v * 100) / 100);

const colors = {
  a: { fill: '#dbeafe', stroke: '#2563eb', text: '#1d4ed8' }, // blue
  b: { fill: '#dcfce7', stroke: '#16a34a', text: '#15803d' }, // green
  c: { fill: '#ede9fe', stroke: '#7c3aed', text: '#6d28d9' }, // violet
  triangle: { fill: '#fde68a', stroke: '#b45309' },
};

const presets = [
  { label: '3, 4, 5', a: 3, b: 4 },
  { label: '5, 12, 13', a: 5, b: 12 },
  { label: '6, 8, 10', a: 6, b: 8 },
  { label: '1, 1, √2', a: 1, b: 1 },
];

/** Halo text so labels stay readable on top of fills and lines. */
function Label({ x, y, color, size = 24, opacity = 1, children }: { x: number; y: number; color: string; size?: number; opacity?: number; children: React.ReactNode }) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontWeight={700}
      textAnchor="middle"
      dominantBaseline="middle"
      stroke="white"
      strokeWidth={6}
      paintOrder="stroke"
      opacity={opacity}
      className="pointer-events-none select-none"
    >
      {children}
    </text>
  );
}

const centroid = (pts: Pt[]): Pt => ({
  x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
  y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
});

/* ------------------------------------------------------------------ */
/* Panel 1: right triangle with a square on each side                  */
/* ------------------------------------------------------------------ */

const TRI_W = 600;
const TRI_H = 520;

function SquaresOnSides({ a, b }: { a: number; b: number }) {
  // Maths coordinates (y up): right angle C at the origin, leg a along x, leg b along y.
  const C = { x: 0, y: 0 };
  const B = { x: a, y: 0 };
  const A = { x: 0, y: b };
  const squareA = [C, B, { x: a, y: -a }, { x: 0, y: -a }];
  const squareB = [C, { x: -b, y: 0 }, { x: -b, y: b }, A];
  // Outward normal of the hypotenuse BA, with length c, is (b, a).
  const squareC = [B, { x: a + b, y: a }, { x: b, y: a + b }, A];

  // Fit the whole figure (x from −b to a + b, y from −a to a + b) into the view box.
  const pad = 30;
  const k = Math.min((TRI_W - 2 * pad) / (a + 2 * b), (TRI_H - 2 * pad) / (2 * a + b));
  const offsetX = (TRI_W - (a + 2 * b) * k) / 2 + b * k;
  const offsetY = (TRI_H - (2 * a + b) * k) / 2 + (a + b) * k;
  const s = (p: Pt): Pt => ({ x: offsetX + p.x * k, y: offsetY - p.y * k });
  const poly = (pts: Pt[]) => pts.map((p) => `${s(p).x},${s(p).y}`).join(' ');

  const c = Math.hypot(a, b);
  const labelSize = 22;
  const cA = s(centroid(squareA));
  const cB = s(centroid(squareB));
  const cC = s(centroid(squareC));
  const corner = Math.min(16, a * k * 0.3, b * k * 0.3);

  return (
    <svg viewBox={`0 0 ${TRI_W} ${TRI_H}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label={`Right triangle with legs ${fmt(a)} and ${fmt(b)} and squares on each side`}>
      <polygon points={poly(squareA)} fill={colors.a.fill} stroke={colors.a.stroke} strokeWidth={3} />
      <polygon points={poly(squareB)} fill={colors.b.fill} stroke={colors.b.stroke} strokeWidth={3} />
      <polygon points={poly(squareC)} fill={colors.c.fill} stroke={colors.c.stroke} strokeWidth={3} />
      <polygon points={poly([C, B, A])} fill={colors.triangle.fill} stroke={colors.triangle.stroke} strokeWidth={3} />
      {/* Right-angle marker */}
      <polyline
        points={`${s(C).x + corner},${s(C).y} ${s(C).x + corner},${s(C).y - corner} ${s(C).x},${s(C).y - corner}`}
        fill="none"
        stroke={colors.triangle.stroke}
        strokeWidth={2}
      />
      <Label x={cA.x} y={cA.y} color={colors.a.text} size={labelSize}>
        {`a² = ${fmt(a * a)}`}
      </Label>
      <Label x={cB.x} y={cB.y} color={colors.b.text} size={labelSize}>
        {`b² = ${fmt(b * b)}`}
      </Label>
      <Label x={cC.x} y={cC.y} color={colors.c.text} size={labelSize}>
        {`c² = ${fmt(c * c)}`}
      </Label>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Panel 2: rearrangement proof in a square of side a + b              */
/* ------------------------------------------------------------------ */

const PROOF_SIZE = 600;

/**
 * Four copies of the triangle inside the square [0, S] × [0, S], S = a + b.
 * `start`: corners of the square, leaving the tilted c² square in the middle.
 * `end`: paired into two a × b rectangles, leaving an a² square and a b² square.
 * Every triangle only slides (no rotation), so interpolating vertices keeps it rigid.
 */
function proofTriangles(a: number, b: number): { start: Pt[]; end: Pt[] }[] {
  const S = a + b;
  const shift = (pts: Pt[], dx: number, dy: number) => pts.map((p) => ({ x: p.x + dx, y: p.y + dy }));
  const t1 = [{ x: 0, y: 0 }, { x: a, y: 0 }, { x: 0, y: b }]; // right angle bottom-left
  const t2 = [{ x: S, y: 0 }, { x: S, y: a }, { x: a, y: 0 }]; // right angle bottom-right
  const t3 = [{ x: S, y: S }, { x: b, y: S }, { x: S, y: a }]; // right angle top-right
  const t4 = [{ x: 0, y: S }, { x: 0, y: b }, { x: b, y: S }]; // right angle top-left
  return [
    { start: t1, end: shift(t1, 0, a) }, // top-left rectangle, lower triangle
    { start: t2, end: t2 }, // bottom-right rectangle, stays put
    { start: t3, end: shift(t3, a - S, 0) }, // top-left rectangle, upper triangle
    { start: t4, end: shift(t4, a, a - S) }, // bottom-right rectangle, upper triangle
  ];
}

const smoothstep = (p: number) => p * p * (3 - 2 * p);

function RearrangementProof({ a, b, t }: { a: number; b: number; t: number }) {
  const S = a + b;
  const pad = 40;
  const k = (PROOF_SIZE - 2 * pad) / S;
  const s = (p: Pt): Pt => ({ x: pad + p.x * k, y: pad + (S - p.y) * k });
  const poly = (pts: Pt[]) => pts.map((p) => `${s(p).x},${s(p).y}`).join(' ');
  const lerp = (p: Pt, q: Pt): Pt => ({ x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t });

  const tilted = [{ x: a, y: 0 }, { x: S, y: a }, { x: b, y: S }, { x: 0, y: b }];
  const squareA = [{ x: 0, y: 0 }, { x: a, y: 0 }, { x: a, y: a }, { x: 0, y: a }];
  const squareB = [{ x: a, y: a }, { x: S, y: a }, { x: S, y: S }, { x: a, y: S }];
  const centerC = s({ x: S / 2, y: S / 2 });
  const centerA = s({ x: a / 2, y: a / 2 });
  const centerB = s({ x: a + b / 2, y: a + b / 2 });
  const bottom = pad + S * k;

  return (
    <svg viewBox={`0 0 ${PROOF_SIZE} ${PROOF_SIZE}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Four copies of the triangle rearranged inside a square of side a plus b">
      {/* Uncovered regions: c² at the start, a² and b² at the end */}
      <polygon points={poly(tilted)} fill={colors.c.fill} stroke={colors.c.stroke} strokeWidth={3} opacity={1 - t} />
      <polygon points={poly(squareA)} fill={colors.a.fill} stroke={colors.a.stroke} strokeWidth={3} opacity={t} />
      <polygon points={poly(squareB)} fill={colors.b.fill} stroke={colors.b.stroke} strokeWidth={3} opacity={t} />

      {proofTriangles(a, b).map((tri, i) => (
        <polygon
          key={i}
          points={poly(tri.start.map((p, j) => lerp(p, tri.end[j])))}
          fill={colors.triangle.fill}
          stroke={colors.triangle.stroke}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      ))}

      {/* Outer square of side a + b */}
      <rect x={pad} y={pad} width={S * k} height={S * k} fill="none" stroke="#0f172a" strokeWidth={3} />

      {/* Side lengths along the bottom edge (the same in both arrangements) */}
      <line x1={pad + a * k} y1={bottom - 10} x2={pad + a * k} y2={bottom + 10} stroke="#0f172a" strokeWidth={3} />
      <Label x={pad + (a * k) / 2} y={bottom + 22} color={colors.a.text} size={22}>
        a
      </Label>
      <Label x={pad + a * k + (b * k) / 2} y={bottom + 22} color={colors.b.text} size={22}>
        b
      </Label>

      <Label x={centerC.x} y={centerC.y} color={colors.c.text} size={28} opacity={1 - t}>
        c²
      </Label>
      <Label x={centerA.x} y={centerA.y} color={colors.a.text} size={28} opacity={t}>
        a²
      </Label>
      <Label x={centerB.x} y={centerB.y} color={colors.b.text} size={28} opacity={t}>
        b²
      </Label>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Visualizer                                                          */
/* ------------------------------------------------------------------ */

export default function PythagoreanVisualizer() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [t, setT] = useState(0);
  const [animation, setAnimation] = useState<{ from: number; to: number } | null>(null);

  // Animate t from `from` to `to`, then stop. The loop is cancelled if the animation changes or the component unmounts.
  useEffect(() => {
    if (!animation) return;
    const { from, to } = animation;
    const duration = 2200 * Math.abs(to - from);
    const startTime = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = duration > 0 ? Math.min(1, (now - startTime) / duration) : 1;
      setT(from + (to - from) * smoothstep(p));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setAnimation(null);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animation]);

  const c = Math.hypot(a, b);
  const isTriple = Number.isInteger(a) && Number.isInteger(b) && Math.abs(c - Math.round(c)) < 1e-9;
  const playing = animation !== null;

  const togglePlay = () => {
    if (playing) setAnimation(null);
    else setAnimation({ from: t, to: t < 0.5 ? 1 : 0 });
  };

  const sliders = [
    { name: 'a', value: a, set: setA, color: 'accent-blue-600' },
    { name: 'b', value: b, set: setB, color: 'accent-green-600' },
  ];

  return (
    <div className="space-y-6 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-2">
        {sliders.map((s) => (
          <label key={s.name} className="block">
            <span className="flex justify-between text-sm font-semibold text-ink">
              <span>Leg {s.name}</span>
              <span className="font-mono">{fmt(s.value)}</span>
            </span>
            <input
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className={`mt-2 w-full ${s.color}`}
            />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold text-ink">Try</span>
        {presets.map((p) => (
          <Button
            key={p.label}
            size="sm"
            variant={a === p.a && b === p.b ? 'secondary' : 'outline'}
            onClick={() => {
              setA(p.a);
              setB(p.b);
            }}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Squares on the sides */}
        <div className="min-w-0 space-y-3">
          <h3 className="font-semibold text-ink">Squares on the three sides</h3>
          <SquaresOnSides a={a} b={b} />
          <div className="rounded-xl border border-line bg-subtle p-4 font-mono text-sm text-ink">
            <p>
              a² + b² = {fmt(a * a)} + {fmt(b * b)} = {fmt(a * a + b * b)}
            </p>
            <p>
              c = √{fmt(a * a + b * b)} {isTriple ? '=' : '≈'} {fmt(c)}
            </p>
            {isTriple && <p className="mt-1 font-sans text-emerald-700">All three sides are whole numbers: a Pythagorean triple.</p>}
          </div>
        </div>

        {/* Rearrangement proof */}
        <div className="min-w-0 space-y-3">
          <h3 className="font-semibold text-ink">Proof by rearrangement</h3>
          <RearrangementProof a={a} b={b} t={t} />
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" onClick={togglePlay} leftIcon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
              {playing ? 'Pause' : t < 0.5 ? 'Rearrange' : 'Rearrange back'}
            </Button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={t}
              aria-label="Rearrangement progress"
              onChange={(e) => {
                setAnimation(null);
                setT(Number(e.target.value));
              }}
              className="min-w-0 flex-1 accent-brand-600"
            />
          </div>
          <p className="text-sm text-ink-muted">
            The big square has side a + b in both pictures and holds the same four triangles. So the area the triangles leave
            uncovered is the same too: at the start it is c², after rearranging it is a² + b².
          </p>
        </div>
      </div>
    </div>
  );
}
