'use client';

import { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

const DEG = Math.PI / 180;
const TERM_COLORS = ['#059669', '#ea580c'];

type Construction = 'pythagorean' | 'compound' | 'half';

interface Term {
  label: string;
  fn: (a: number, b: number) => number;
}

interface Identity {
  id: string;
  name: string;
  lhsLabel: string;
  rhsLabel: string;
  construction: Construction;
  /** Whether the identity has a second angle β with its own slider. */
  usesBeta: boolean;
  /** For the compound construction: which coordinate of B is being read off. */
  component?: 'sin' | 'cos';
  /** The angle that is added to α in the compound construction (β, −β or α). */
  secondAngle?: (a: number, b: number) => number;
  lhs: (a: number, b: number) => number;
  /** The right-hand side is the sum of these terms. Each is drawn in its own color. */
  terms: Term[];
  explanation: string;
}

const identities: Identity[] = [
  {
    id: 'pythagorean',
    name: 'Pythagorean',
    lhsLabel: 'sin²θ + cos²θ',
    rhsLabel: '1',
    construction: 'pythagorean',
    usesBeta: false,
    lhs: (a) => Math.sin(a) ** 2 + Math.cos(a) ** 2,
    terms: [
      { label: 'sin²θ', fn: (a) => Math.sin(a) ** 2 },
      { label: 'cos²θ', fn: (a) => Math.cos(a) ** 2 },
    ],
    explanation:
      'The point P = (cos θ, sin θ) sits on the unit circle, so the right triangle under it has legs |cos θ| and |sin θ| and hypotenuse 1. Pythagoras gives sin²θ + cos²θ = 1 for every angle.',
  },
  {
    id: 'sin-sum',
    name: 'sin(α + β)',
    lhsLabel: 'sin(α + β)',
    rhsLabel: 'sin α cos β + cos α sin β',
    construction: 'compound',
    component: 'sin',
    usesBeta: true,
    secondAngle: (_a, b) => b,
    lhs: (a, b) => Math.sin(a + b),
    terms: [
      { label: 'sin α cos β', fn: (a, b) => Math.sin(a) * Math.cos(b) },
      { label: 'cos α sin β', fn: (a, b) => Math.cos(a) * Math.sin(b) },
    ],
    explanation:
      'Walk from O along the α ray for a distance cos β to reach A, then turn 90° and walk sin β to reach B. B is on the unit circle at angle α + β. The height of A is sin α cos β (green) and the second leg adds cos α sin β (orange), so the height of B, sin(α + β), is their sum.',
  },
  {
    id: 'cos-sum',
    name: 'cos(α + β)',
    lhsLabel: 'cos(α + β)',
    rhsLabel: 'cos α cos β − sin α sin β',
    construction: 'compound',
    component: 'cos',
    usesBeta: true,
    secondAngle: (_a, b) => b,
    lhs: (a, b) => Math.cos(a + b),
    terms: [
      { label: 'cos α cos β', fn: (a, b) => Math.cos(a) * Math.cos(b) },
      { label: '− sin α sin β', fn: (a, b) => -Math.sin(a) * Math.sin(b) },
    ],
    explanation:
      'Same construction, read horizontally. A is cos α cos β to the right of the y-axis (green). The perpendicular leg AB points back to the left by sin α sin β (orange), so the x-coordinate of B is cos α cos β − sin α sin β.',
  },
  {
    id: 'sin-diff',
    name: 'sin(α − β)',
    lhsLabel: 'sin(α − β)',
    rhsLabel: 'sin α cos β − cos α sin β',
    construction: 'compound',
    component: 'sin',
    usesBeta: true,
    secondAngle: (_a, b) => -b,
    lhs: (a, b) => Math.sin(a - b),
    terms: [
      { label: 'sin α cos β', fn: (a, b) => Math.sin(a) * Math.cos(b) },
      { label: '− cos α sin β', fn: (a, b) => -Math.cos(a) * Math.sin(b) },
    ],
    explanation:
      'Subtracting β is adding −β. Since cos(−β) = cos β and sin(−β) = −sin β, the leg AB now turns clockwise and the orange term changes sign.',
  },
  {
    id: 'cos-diff',
    name: 'cos(α − β)',
    lhsLabel: 'cos(α − β)',
    rhsLabel: 'cos α cos β + sin α sin β',
    construction: 'compound',
    component: 'cos',
    usesBeta: true,
    secondAngle: (_a, b) => -b,
    lhs: (a, b) => Math.cos(a - b),
    terms: [
      { label: 'cos α cos β', fn: (a, b) => Math.cos(a) * Math.cos(b) },
      { label: '+ sin α sin β', fn: (a, b) => Math.sin(a) * Math.sin(b) },
    ],
    explanation:
      'With β replaced by −β the perpendicular leg turns clockwise, so its horizontal shift sin α sin β is now added instead of subtracted.',
  },
  {
    id: 'sin-double',
    name: 'sin 2α',
    lhsLabel: 'sin 2α',
    rhsLabel: '2 sin α cos α',
    construction: 'compound',
    component: 'sin',
    usesBeta: false,
    secondAngle: (a) => a,
    lhs: (a) => Math.sin(2 * a),
    terms: [
      { label: 'sin α cos α', fn: (a) => Math.sin(a) * Math.cos(a) },
      { label: 'sin α cos α', fn: (a) => Math.cos(a) * Math.sin(a) },
    ],
    explanation:
      'Put β = α in the sum formula. The two vertical pieces become equal, sin α cos α each, so sin 2α = 2 sin α cos α.',
  },
  {
    id: 'cos-double',
    name: 'cos 2α',
    lhsLabel: 'cos 2α',
    rhsLabel: 'cos²α − sin²α',
    construction: 'compound',
    component: 'cos',
    usesBeta: false,
    secondAngle: (a) => a,
    lhs: (a) => Math.cos(2 * a),
    terms: [
      { label: 'cos²α', fn: (a) => Math.cos(a) ** 2 },
      { label: '− sin²α', fn: (a) => -(Math.sin(a) ** 2) },
    ],
    explanation:
      'Put β = α in the cosine sum formula: cos 2α = cos²α − sin²α. Using sin²α + cos²α = 1 this can also be written 2cos²α − 1 or 1 − 2sin²α.',
  },
  {
    id: 'half',
    name: 'Half angle',
    lhsLabel: 'cos²(θ/2)',
    rhsLabel: '(1 + cos θ) / 2',
    construction: 'half',
    usesBeta: false,
    lhs: (a) => Math.cos(a / 2) ** 2,
    terms: [
      { label: '1/2', fn: () => 0.5 },
      { label: 'cos θ / 2', fn: (a) => Math.cos(a) / 2 },
    ],
    explanation:
      'Join Q = (−1, 0) to P on the circle. The inscribed angle at Q is half the central angle θ. The chord QP has length 2cos(θ/2), and its horizontal run QF = 1 + cos θ equals QP · cos(θ/2) = 2cos²(θ/2). Halving gives the identity. (Past 180° the angle at Q is 180° − θ/2, whose cosine only differs in sign, so the squared form still holds.)',
  },
];

// ---------- Geometry drawing (SVG, 500 × 500) ----------

const GEO = { size: 500, cx: 250, cy: 250, r: 180 };
const sx = (x: number) => GEO.cx + GEO.r * x;
const sy = (y: number) => GEO.cy - GEO.r * y;

/** Polyline points for an arc of radius `r` (drawing units) from angle `from` to `to` (radians). */
function arcPoints(cx: number, cy: number, r: number, from: number, to: number) {
  const steps = Math.max(2, Math.ceil(Math.abs(to - from) / (4 * DEG)));
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = from + ((to - from) * i) / steps;
    pts.push(`${cx + r * Math.cos(t)},${cy - r * Math.sin(t)}`);
  }
  return pts.join(' ');
}

function Seg({ x1, y1, x2, y2, color, width = 4, dash }: { x1: number; y1: number; x2: number; y2: number; color: string; width?: number; dash?: string }) {
  return <line x1={sx(x1)} y1={sy(y1)} x2={sx(x2)} y2={sy(y2)} stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" />;
}

function Dot({ x, y, color = '#0f172a', label, dx = 10, dy = -10 }: { x: number; y: number; color?: string; label?: string; dx?: number; dy?: number }) {
  return (
    <g>
      <circle cx={sx(x)} cy={sy(y)} r={7} fill={color} />
      {label && (
        <text x={sx(x) + dx} y={sy(y) + dy} fontSize={22} fontWeight={700} fill={color}>
          {label}
        </text>
      )}
    </g>
  );
}

/** A small square marking a right angle at `corner`, with legs along unit vectors u and v. */
function RightAngle({ corner, u, v }: { corner: [number, number]; u: [number, number]; v: [number, number] }) {
  const s = 0.07;
  const p1 = [corner[0] + u[0] * s, corner[1] + u[1] * s];
  const p2 = [p1[0] + v[0] * s, p1[1] + v[1] * s];
  const p3 = [corner[0] + v[0] * s, corner[1] + v[1] * s];
  return <polyline points={`${sx(p1[0])},${sy(p1[1])} ${sx(p2[0])},${sy(p2[1])} ${sx(p3[0])},${sy(p3[1])}`} fill="none" stroke="#64748b" strokeWidth={2} />;
}

function Axes() {
  return (
    <g>
      <line x1={10} y1={GEO.cy} x2={GEO.size - 10} y2={GEO.cy} stroke="#cbd5e1" strokeWidth={2} />
      <line x1={GEO.cx} y1={10} x2={GEO.cx} y2={GEO.size - 10} stroke="#cbd5e1" strokeWidth={2} />
      <circle cx={GEO.cx} cy={GEO.cy} r={GEO.r} fill="none" stroke="#3b82f6" strokeWidth={3} />
      <text x={GEO.size - 28} y={GEO.cy - 10} fontSize={22} fill="#64748b">x</text>
      <text x={GEO.cx + 10} y={30} fontSize={22} fill="#64748b">y</text>
    </g>
  );
}

function PythagoreanFigure({ a }: { a: number }) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (
    <g>
      <Seg x1={0} y1={0} x2={c} y2={0} color={TERM_COLORS[1]} width={6} />
      <Seg x1={c} y1={0} x2={c} y2={s} color={TERM_COLORS[0]} width={6} />
      <Seg x1={0} y1={0} x2={c} y2={s} color="#0f172a" width={4} />
      {Math.abs(s) > 0.08 && Math.abs(c) > 0.08 && <RightAngle corner={[c, 0]} u={[-Math.sign(c), 0]} v={[0, Math.sign(s)]} />}
      <polyline points={arcPoints(GEO.cx, GEO.cy, 40, 0, a)} fill="none" stroke="#3b82f6" strokeWidth={3} />
      <text x={sx(c / 2) - 30} y={sy(0) + (s >= 0 ? 32 : -14)} fontSize={22} fontWeight={600} fill={TERM_COLORS[1]}>cos θ</text>
      <text x={sx(c) + (c >= 0 ? 10 : -70)} y={sy(s / 2) + 8} fontSize={22} fontWeight={600} fill={TERM_COLORS[0]}>sin θ</text>
      <text x={sx(c / 2) + (c >= 0 ? -24 : 10)} y={sy(s / 2) + (s >= 0 ? -12 : 26)} fontSize={22} fontWeight={700} fill="#0f172a">1</text>
      <Dot x={0} y={0} label="O" dx={-30} dy={30} />
      <Dot x={c} y={s} color="#2563eb" label="P" dx={c >= 0 ? 12 : -30} dy={s >= 0 ? -12 : 30} />
    </g>
  );
}

function CompoundFigure({ a, second, secondLabel, component }: { a: number; second: number; secondLabel: string; component: 'sin' | 'cos' }) {
  const cb = Math.cos(second);
  const sb = Math.sin(second);
  const A: [number, number] = [cb * Math.cos(a), cb * Math.sin(a)];
  const B: [number, number] = [Math.cos(a + second), Math.sin(a + second)];
  // Corner of the small right triangle on the leg AB: horizontal from A, then vertical to B.
  const K: [number, number] = [B[0], A[1]];
  const ray: [number, number] = [Math.cos(a), Math.sin(a)];

  return (
    <g>
      {/* α ray to the circle */}
      <Seg x1={0} y1={0} x2={ray[0]} y2={ray[1]} color="#93c5fd" width={2} dash="6 6" />
      {/* Angle arcs */}
      <polyline points={arcPoints(GEO.cx, GEO.cy, 36, 0, a)} fill="none" stroke="#3b82f6" strokeWidth={3} />
      <polyline points={arcPoints(GEO.cx, GEO.cy, 58, a, a + second)} fill="none" stroke="#9333ea" strokeWidth={3} />
      <text x={GEO.cx + 44 * Math.cos(a / 2) + 4} y={GEO.cy - 44 * Math.sin(a / 2) + 8} fontSize={20} fontWeight={700} fill="#2563eb">α</text>
      <text x={GEO.cx + 76 * Math.cos(a + second / 2) - 6} y={GEO.cy - 76 * Math.sin(a + second / 2) + 8} fontSize={20} fontWeight={700} fill="#9333ea">
        {secondLabel}
      </text>

      {/* Main triangle O-A-B */}
      <Seg x1={0} y1={0} x2={A[0]} y2={A[1]} color="#2563eb" width={4} />
      <Seg x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} color="#9333ea" width={4} />
      <Seg x1={0} y1={0} x2={B[0]} y2={B[1]} color="#0f172a" width={3} />
      {Math.abs(cb) > 0.1 && Math.abs(sb) > 0.1 && (
        <RightAngle corner={A} u={[-Math.sign(cb) * ray[0], -Math.sign(cb) * ray[1]]} v={[Math.sign(sb) * -ray[1], Math.sign(sb) * ray[0]]} />
      )}

      {component === 'sin' ? (
        <g>
          {/* Height of A (green) and extra height from A to B (orange), drawn in the figure and stacked on the y-axis */}
          <Seg x1={A[0]} y1={0} x2={A[0]} y2={A[1]} color={TERM_COLORS[0]} width={5} />
          <Seg x1={A[0]} y1={A[1]} x2={K[0]} y2={K[1]} color="#94a3b8" width={2} dash="5 5" />
          <Seg x1={K[0]} y1={K[1]} x2={B[0]} y2={B[1]} color={TERM_COLORS[1]} width={5} />
          <Seg x1={0} y1={0} x2={0} y2={A[1]} color={TERM_COLORS[0]} width={9} />
          <Seg x1={0} y1={A[1]} x2={0} y2={B[1]} color={TERM_COLORS[1]} width={9} />
          <Seg x1={0} y1={B[1]} x2={B[0]} y2={B[1]} color="#94a3b8" width={2} dash="5 5" />
          <Seg x1={0} y1={A[1]} x2={A[0]} y2={A[1]} color="#cbd5e1" width={2} dash="3 6" />
        </g>
      ) : (
        <g>
          {/* Horizontal position of A (green) and horizontal shift from A to B (orange), stacked on the x-axis */}
          <Seg x1={A[0]} y1={A[1]} x2={K[0]} y2={K[1]} color={TERM_COLORS[1]} width={5} />
          <Seg x1={K[0]} y1={K[1]} x2={B[0]} y2={B[1]} color="#94a3b8" width={2} dash="5 5" />
          <Seg x1={0} y1={0} x2={A[0]} y2={0} color={TERM_COLORS[0]} width={9} />
          <Seg x1={A[0]} y1={0} x2={B[0]} y2={0} color={TERM_COLORS[1]} width={9} />
          <Seg x1={A[0]} y1={0} x2={A[0]} y2={A[1]} color="#cbd5e1" width={2} dash="3 6" />
          <Seg x1={B[0]} y1={0} x2={B[0]} y2={B[1]} color="#94a3b8" width={2} dash="5 5" />
        </g>
      )}

      <Dot x={0} y={0} label="O" dx={-30} dy={30} />
      <Dot x={A[0]} y={A[1]} color="#2563eb" label="A" dx={A[0] >= 0 ? 10 : -30} dy={A[1] >= 0 ? 26 : -12} />
      <Dot x={B[0]} y={B[1]} color="#9333ea" label="B" dx={B[0] >= 0 ? 12 : -30} dy={B[1] >= 0 ? -12 : 30} />
    </g>
  );
}

function HalfAngleFigure({ a }: { a: number }) {
  const P: [number, number] = [Math.cos(a), Math.sin(a)];
  const F: [number, number] = [P[0], 0];
  const qAngle = Math.atan2(P[1], P[0] + 1); // inscribed angle at Q, equals θ/2 (mod π)
  return (
    <g>
      <Seg x1={-1} y1={0} x2={0} y2={0} color={TERM_COLORS[0]} width={8} />
      <Seg x1={0} y1={0} x2={F[0]} y2={0} color={TERM_COLORS[1]} width={8} />
      <Seg x1={F[0]} y1={0} x2={P[0]} y2={P[1]} color="#94a3b8" width={2} dash="5 5" />
      <Seg x1={-1} y1={0} x2={P[0]} y2={P[1]} color="#9333ea" width={4} />
      <Seg x1={0} y1={0} x2={P[0]} y2={P[1]} color="#2563eb" width={3} />
      <polyline points={arcPoints(GEO.cx, GEO.cy, 34, 0, a)} fill="none" stroke="#2563eb" strokeWidth={3} />
      <polyline points={arcPoints(sx(-1), sy(0), 60, 0, qAngle)} fill="none" stroke="#9333ea" strokeWidth={3} />
      <text x={GEO.cx + 46 * Math.cos(a / 2)} y={GEO.cy - 46 * Math.sin(a / 2) + 8} fontSize={20} fontWeight={700} fill="#2563eb">θ</text>
      <text x={sx(-1) + 70} y={sy(0) + (qAngle >= 0 ? -10 : 28)} fontSize={20} fontWeight={700} fill="#9333ea">
        {a <= Math.PI ? 'θ/2' : '180° − θ/2'}
      </text>
      <Dot x={-1} y={0} color="#9333ea" label="Q" dx={-8} dy={34} />
      <Dot x={0} y={0} label="O" dx={-10} dy={34} />
      <Dot x={F[0]} y={0} color="#64748b" label="F" dx={-6} dy={P[1] >= 0 ? 34 : -14} />
      <Dot x={P[0]} y={P[1]} color="#2563eb" label="P" dx={P[0] >= 0 ? 12 : -30} dy={P[1] >= 0 ? -12 : 30} />
    </g>
  );
}

// ---------- Graph (SVG, 600 × 300) ----------

const GRAPH = { w: 600, h: 300, left: 56, right: 584, top: 20, bottom: 260, yMax: 1.5 };
const gx = (angle: number) => GRAPH.left + (angle / (2 * Math.PI)) * (GRAPH.right - GRAPH.left);
const gy = (v: number) => GRAPH.top + ((GRAPH.yMax - v) / (2 * GRAPH.yMax)) * (GRAPH.bottom - GRAPH.top);

function curvePath(fn: (angle: number) => number) {
  const n = 240;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * 2 * Math.PI;
    const v = Math.max(-GRAPH.yMax, Math.min(GRAPH.yMax, fn(t)));
    d += `${i === 0 ? 'M' : 'L'}${gx(t).toFixed(1)},${gy(v).toFixed(1)}`;
  }
  return d;
}

function IdentityGraph({ identity, a, b, variable }: { identity: Identity; a: number; b: number; variable: string }) {
  const rhs = (t: number) => identity.terms.reduce((sum, term) => sum + term.fn(t, b), 0);
  return (
    <svg viewBox={`0 0 ${GRAPH.w} ${GRAPH.h}`} className={responsiveSurface} role="img" aria-label={`Graph of ${identity.lhsLabel} and ${identity.rhsLabel}`}>
      <rect width={GRAPH.w} height={GRAPH.h} fill="#ffffff" />
      {[-1, 0, 1].map((v) => (
        <g key={v}>
          <line x1={GRAPH.left} x2={GRAPH.right} y1={gy(v)} y2={gy(v)} stroke={v === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={v === 0 ? 2 : 1} />
          <text x={GRAPH.left - 10} y={gy(v) + 7} fontSize={20} textAnchor="end" fill="#64748b">{v}</text>
        </g>
      ))}
      {[0, 90, 180, 270, 360].map((d) => (
        <g key={d}>
          <line x1={gx(d * DEG)} x2={gx(d * DEG)} y1={GRAPH.top} y2={GRAPH.bottom} stroke="#e2e8f0" />
          <text x={gx(d * DEG)} y={GRAPH.bottom + 28} fontSize={20} textAnchor="middle" fill="#64748b">{d}°</text>
        </g>
      ))}
      {identity.terms.map((term, i) => (
        <path key={i} d={curvePath((t) => term.fn(t, b))} fill="none" stroke={TERM_COLORS[i]} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" />
      ))}
      <path d={curvePath((t) => identity.lhs(t, b))} fill="none" stroke="#2563eb" strokeOpacity={0.35} strokeWidth={10} strokeLinejoin="round" />
      <path d={curvePath(rhs)} fill="none" stroke="#0f172a" strokeWidth={2.5} strokeDasharray="10 6" />
      <line x1={gx(a)} x2={gx(a)} y1={GRAPH.top} y2={GRAPH.bottom} stroke="#9333ea" strokeWidth={2} />
      <circle cx={gx(a)} cy={gy(identity.lhs(a, b))} r={8} fill="#2563eb" />
      <circle cx={gx(a)} cy={gy(rhs(a))} r={4} fill="#ffffff" stroke="#0f172a" strokeWidth={2} />
      <text x={GRAPH.right} y={GRAPH.top + 4} fontSize={20} textAnchor="end" fill="#64748b">{variable}</text>
    </svg>
  );
}

// ---------- Controls ----------

function AngleSlider({ label, value, onChange }: { label: string; value: number; onChange: (deg: number) => void }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm font-medium text-ink">
        <span>{label}</span>
        <span className="font-mono text-ink-muted">{value}°</span>
      </span>
      <input type="range" min={0} max={360} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-brand-600" />
    </label>
  );
}

const fmt = (v: number) => (Math.abs(v) < 5e-5 ? '0.0000' : v.toFixed(4));

export default function IdentitiesVisualizer() {
  const [identityId, setIdentityId] = useState('sin-sum');
  const [alphaDeg, setAlphaDeg] = useState(35);
  const [betaDeg, setBetaDeg] = useState(25);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  const identity = identities.find((i) => i.id === identityId) ?? identities[0];
  const a = alphaDeg * DEG;
  const b = identity.usesBeta ? betaDeg * DEG : a;
  const firstVar = identity.construction === 'compound' ? 'α' : 'θ';

  const lhs = identity.lhs(a, b);
  const termValues = identity.terms.map((t) => t.fn(a, b));
  const rhs = termValues.reduce((s, v) => s + v, 0);

  const setAngleFromPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const { x, y } = toDrawingPoint(e, svgRef.current);
    const angle = Math.atan2(GEO.cy - y, x - GEO.cx);
    setAlphaDeg(Math.round(((angle / DEG) + 360) % 360));
  };

  const reset = () => {
    setAlphaDeg(35);
    setBetaDeg(25);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Identity">
        {identities.map((i) => (
          <Button key={i.id} size="sm" variant={i.id === identity.id ? 'primary' : 'outline'} onClick={() => setIdentityId(i.id)} role="tab" aria-selected={i.id === identity.id}>
            {i.name}
          </Button>
        ))}
      </div>

      <div className="rounded-card border border-line bg-subtle p-4 text-center">
        <p className="font-mono text-lg text-ink sm:text-xl">
          <span className="text-blue-600">{identity.lhsLabel}</span> = {identity.rhsLabel}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-white p-4 shadow-card">
          <h3 className="text-sm font-semibold text-ink">Geometric construction</h3>
          <p className="mt-1 text-xs text-ink-muted">Drag on the circle to change {firstVar}.</p>
          <div className="mx-auto mt-3 max-w-md">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${GEO.size} ${GEO.size}`}
              className={`${responsiveSurface} touch-none cursor-pointer`}
              role="img"
              aria-label="Unit circle construction of the identity"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging(true);
                setAngleFromPointer(e);
              }}
              onPointerMove={(e) => dragging && setAngleFromPointer(e)}
              onPointerUp={() => setDragging(false)}
              onPointerCancel={() => setDragging(false)}
            >
              <rect width={GEO.size} height={GEO.size} fill="#ffffff" />
              <Axes />
              {identity.construction === 'pythagorean' && <PythagoreanFigure a={a} />}
              {identity.construction === 'compound' && identity.secondAngle && identity.component && (
                <CompoundFigure a={a} second={identity.secondAngle(a, b)} secondLabel={identity.usesBeta ? 'β' : 'α'} component={identity.component} />
              )}
              {identity.construction === 'half' && <HalfAngleFigure a={a} />}
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-card border border-line bg-white p-4 shadow-card">
            <div className="space-y-4">
              <AngleSlider label={firstVar} value={alphaDeg} onChange={setAlphaDeg} />
              {identity.usesBeta && <AngleSlider label="β" value={betaDeg} onChange={setBetaDeg} />}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={reset}>
                Reset angles
              </Button>
            </div>
          </div>

          <div className="rounded-card border border-line bg-white p-4 shadow-card">
            <h3 className="text-sm font-semibold text-ink">Both sides, evaluated</h3>
            <dl className="mt-3 space-y-2 font-mono text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-blue-700">{identity.lhsLabel}</dt>
                <dd className="text-ink">{fmt(lhs)}</dd>
              </div>
              {identity.terms.map((term, i) => (
                <div key={i} className="flex flex-wrap justify-between gap-2 pl-3">
                  <dt style={{ color: TERM_COLORS[i] }}>{term.label}</dt>
                  <dd className="text-ink-muted">{fmt(termValues[i])}</dd>
                </div>
              ))}
              <div className="flex flex-wrap justify-between gap-2 border-t border-line pt-2">
                <dt className="text-ink">{identity.rhsLabel}</dt>
                <dd className="text-ink">{fmt(rhs)}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-2 text-ink-muted">
                <dt>difference</dt>
                <dd>{Math.abs(lhs - rhs).toExponential(1)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-line bg-white p-4 shadow-card">
        <h3 className="text-sm font-semibold text-ink">Both sides over a full turn</h3>
        <p className="mt-1 text-xs text-ink-muted">
          Wide blue band: left side. Dashed black line: right side. Dotted lines: the individual terms.
          {identity.usesBeta && ` β is held at ${betaDeg}°.`}
        </p>
        <div className="mt-3">
          <IdentityGraph identity={identity} a={a} b={b} variable={firstVar} />
        </div>
      </div>

      <p className="rounded-card border border-line bg-subtle p-4 text-sm leading-relaxed text-gray-700">{identity.explanation}</p>
    </div>
  );
}
