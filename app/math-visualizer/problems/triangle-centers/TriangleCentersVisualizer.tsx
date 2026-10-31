'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

type Point = { x: number; y: number };

// Drawing space: 800 × 520 px, with 1 unit = 40 px and the origin in the middle.
const WIDTH = 800;
const HEIGHT = 520;
const UNIT = 40;
const ORIGIN = { x: WIDTH / 2, y: HEIGHT / 2 };
const X_LIMIT = 9.5;
const Y_LIMIT = 6;
const GRAB_RADIUS = 1.2; // units

const DEFAULT_VERTICES: Point[] = [
  { x: -4, y: -4 },
  { x: 5, y: -4 },
  { x: -1, y: 3 },
];
const VERTEX_NAMES = ['A', 'B', 'C'];

const COLORS = {
  centroid: '#2563eb', // blue
  circumcenter: '#dc2626', // red
  incenter: '#059669', // green
  orthocenter: '#9333ea', // purple
  euler: '#f59e0b', // amber
};

// ---------- geometry helpers (all in math units, y up) ----------

const add = (p: Point, q: Point): Point => ({ x: p.x + q.x, y: p.y + q.y });
const sub = (p: Point, q: Point): Point => ({ x: p.x - q.x, y: p.y - q.y });
const scale = (p: Point, k: number): Point => ({ x: p.x * k, y: p.y * k });
const dot = (p: Point, q: Point) => p.x * q.x + p.y * q.y;
const cross = (p: Point, q: Point) => p.x * q.y - p.y * q.x;
const dist = (p: Point, q: Point) => Math.hypot(p.x - q.x, p.y - q.y);
const midpoint = (p: Point, q: Point): Point => scale(add(p, q), 0.5);

/** Foot of the perpendicular from p onto the line through a and b. */
function foot(p: Point, a: Point, b: Point): Point {
  const ab = sub(b, a);
  const t = dot(sub(p, a), ab) / dot(ab, ab);
  return add(a, scale(ab, t));
}

/** Where the bisector of angle `at` meets the opposite side (angle bisector theorem). */
function bisectorFoot(at: Point, p: Point, q: Point): Point {
  const toP = dist(at, p);
  const toQ = dist(at, q);
  // Divides pq in the ratio |at p| : |at q|.
  return scale(add(scale(p, toQ), scale(q, toP)), 1 / (toP + toQ));
}

function analyse([A, B, C]: Point[]) {
  const a = dist(B, C);
  const b = dist(C, A);
  const c = dist(A, B);
  const twiceArea = cross(sub(B, A), sub(C, A));
  const area = Math.abs(twiceArea) / 2;
  const longest = Math.max(a, b, c);
  // Collinear (or coincident) vertices: no circumcircle, incircle or orthocenter.
  const degenerate = longest < 1e-9 || area < 1e-9 * longest * longest + 1e-12;

  const centroid = scale(add(add(A, B), C), 1 / 3);
  if (degenerate) {
    return { degenerate: true as const, centroid, a, b, c, area };
  }

  // Circumcenter: intersection of perpendicular bisectors.
  const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
  const sqA = dot(A, A);
  const sqB = dot(B, B);
  const sqC = dot(C, C);
  const circumcenter = {
    x: (sqA * (B.y - C.y) + sqB * (C.y - A.y) + sqC * (A.y - B.y)) / d,
    y: (sqA * (C.x - B.x) + sqB * (A.x - C.x) + sqC * (B.x - A.x)) / d,
  };
  const R = dist(circumcenter, A);

  // Incenter: average of the vertices weighted by the opposite side lengths.
  const perimeter = a + b + c;
  const incenter = scale(add(add(scale(A, a), scale(B, b)), scale(C, c)), 1 / perimeter);
  const r = area / (perimeter / 2);

  // Orthocenter from the Euler line relation: H = A + B + C - 2O (equivalently OH = 3 OG).
  const orthocenter = sub(add(add(A, B), C), scale(circumcenter, 2));

  const angle = (at: Point, p: Point, q: Point) => {
    const u = sub(p, at);
    const v = sub(q, at);
    return (Math.acos(Math.max(-1, Math.min(1, dot(u, v) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y))))) * 180) / Math.PI;
  };
  const angles = [angle(A, B, C), angle(B, C, A), angle(C, A, B)];

  return { degenerate: false as const, centroid, circumcenter, incenter, orthocenter, R, r, a, b, c, area, angles };
}

// ---------- drawing helpers ----------

const toPx = (p: Point): Point => ({ x: ORIGIN.x + p.x * UNIT, y: ORIGIN.y - p.y * UNIT });
const toUnits = (p: Point): Point => ({ x: (p.x - ORIGIN.x) / UNIT, y: (ORIGIN.y - p.y) / UNIT });

function Segment({ from, to, color, dashed = false, width = 2 }: { from: Point; to: Point; color: string; dashed?: boolean; width?: number }) {
  const p = toPx(from);
  const q = toPx(to);
  return <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={color} strokeWidth={width} strokeDasharray={dashed ? '8 6' : undefined} />;
}

function CenterMark({ point, color, label }: { point: Point; color: string; label: string }) {
  const p = toPx(point);
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={7} fill={color} stroke="white" strokeWidth={2} />
      <text x={p.x + 12} y={p.y - 10} fontSize={22} fontWeight={700} fill={color} stroke="white" strokeWidth={4} paintOrder="stroke">
        {label}
      </text>
    </g>
  );
}

const fmt = (n: number) => {
  const s = n.toFixed(2);
  return s === '-0.00' ? '0.00' : s;
};
const fmtPoint = (p: Point) => `(${fmt(p.x)}, ${fmt(p.y)})`;

type Toggles = { centroid: boolean; circumcenter: boolean; incenter: boolean; orthocenter: boolean; euler: boolean };

export default function TriangleCentersVisualizer() {
  const [vertices, setVertices] = useState<Point[]>(DEFAULT_VERTICES);
  const [dragging, setDragging] = useState<number | null>(null);
  const [snap, setSnap] = useState(true);
  const [show, setShow] = useState<Toggles>({ centroid: true, circumcenter: true, incenter: false, orthocenter: true, euler: true });

  const info = analyse(vertices);
  const [A, B, C] = vertices;
  const sides: [Point, Point, Point][] = [
    [A, B, C], // vertex, then the opposite side's endpoints
    [B, C, A],
    [C, A, B],
  ];

  const pointerToUnits = (e: React.PointerEvent<SVGSVGElement>) => toUnits(toDrawingPoint(e, e.currentTarget));

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const p = pointerToUnits(e);
    let nearest = -1;
    let best = GRAB_RADIUS;
    vertices.forEach((v, i) => {
      const d = dist(v, p);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    if (nearest >= 0) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(nearest);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;
    const p = pointerToUnits(e);
    const round = (n: number) => (snap ? Math.round(n * 2) / 2 : Math.round(n * 100) / 100);
    const next = {
      x: round(Math.max(-X_LIMIT, Math.min(X_LIMIT, p.x))),
      y: round(Math.max(-Y_LIMIT, Math.min(Y_LIMIT, p.y))),
    };
    setVertices((vs) => vs.map((v, i) => (i === dragging ? next : v)));
  };

  const endDrag = () => setDragging(null);

  const toggle = (key: keyof Toggles) => setShow((s) => ({ ...s, [key]: !s[key] }));

  const toggleButtons: { key: keyof Toggles; label: string; color: string }[] = [
    { key: 'centroid', label: 'Centroid (G)', color: COLORS.centroid },
    { key: 'circumcenter', label: 'Circumcenter (O)', color: COLORS.circumcenter },
    { key: 'incenter', label: 'Incenter (I)', color: COLORS.incenter },
    { key: 'orthocenter', label: 'Orthocenter (H)', color: COLORS.orthocenter },
    { key: 'euler', label: 'Euler line', color: COLORS.euler },
  ];

  // Grid lines every unit.
  const gridX = Array.from({ length: 2 * Math.floor(WIDTH / 2 / UNIT) + 1 }, (_, i) => i - Math.floor(WIDTH / 2 / UNIT));
  const gridY = Array.from({ length: 2 * Math.floor(HEIGHT / 2 / UNIT) + 1 }, (_, i) => i - Math.floor(HEIGHT / 2 / UNIT));

  const trianglePx = vertices.map(toPx);
  const isEquilateral = !info.degenerate && dist(info.circumcenter, info.orthocenter) < 1e-6;

  return (
    <div className="space-y-4 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap gap-2">
        {toggleButtons.map(({ key, label, color }) => (
          <Button key={key} size="sm" variant={show[key] ? 'outline' : 'ghost'} onClick={() => toggle(key)} aria-pressed={show[key]}>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: show[key] ? color : '#d1d5db' }} aria-hidden />
            {label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className={`${responsiveSurface} touch-none overflow-hidden rounded-xl border border-line bg-white ${dragging !== null ? 'cursor-grabbing' : 'cursor-grab'}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            role="img"
            aria-label="Triangle with draggable vertices and its centers"
          >
            {/* Grid */}
            {gridX.map((i) => (
              <line key={`gx${i}`} x1={ORIGIN.x + i * UNIT} y1={0} x2={ORIGIN.x + i * UNIT} y2={HEIGHT} stroke={i === 0 ? '#cbd5e1' : '#f1f5f9'} strokeWidth={i === 0 ? 2 : 1} />
            ))}
            {gridY.map((i) => (
              <line key={`gy${i}`} x1={0} y1={ORIGIN.y + i * UNIT} x2={WIDTH} y2={ORIGIN.y + i * UNIT} stroke={i === 0 ? '#cbd5e1' : '#f1f5f9'} strokeWidth={i === 0 ? 2 : 1} />
            ))}

            {/* Circles first so lines sit on top */}
            {!info.degenerate && show.circumcenter && (
              <circle cx={toPx(info.circumcenter).x} cy={toPx(info.circumcenter).y} r={info.R * UNIT} fill={COLORS.circumcenter} fillOpacity={0.04} stroke={COLORS.circumcenter} strokeWidth={2} strokeDasharray="10 6" />
            )}
            {!info.degenerate && show.incenter && (
              <circle cx={toPx(info.incenter).x} cy={toPx(info.incenter).y} r={info.r * UNIT} fill={COLORS.incenter} fillOpacity={0.08} stroke={COLORS.incenter} strokeWidth={2} />
            )}

            {/* Triangle */}
            <polygon points={trianglePx.map((p) => `${p.x},${p.y}`).join(' ')} fill="#0f172a" fillOpacity={0.04} stroke="#0f172a" strokeWidth={3} strokeLinejoin="round" />

            {/* Medians: vertex to midpoint of the opposite side */}
            {show.centroid &&
              sides.map(([v, p, q], i) => (
                <g key={`median${i}`}>
                  <Segment from={v} to={midpoint(p, q)} color={COLORS.centroid} width={1.5} />
                  <circle cx={toPx(midpoint(p, q)).x} cy={toPx(midpoint(p, q)).y} r={4} fill={COLORS.centroid} />
                </g>
              ))}

            {/* Perpendicular bisectors: from each side's midpoint to O, a little past both ends */}
            {!info.degenerate &&
              show.circumcenter &&
              sides.map(([, p, q], i) => {
                const m = midpoint(p, q);
                const toO = sub(info.circumcenter, m);
                const len = Math.hypot(toO.x, toO.y);
                const side = sub(q, p);
                // Direction perpendicular to the side (works even when O lies on the side).
                const n = scale({ x: -side.y, y: side.x }, 1 / Math.hypot(side.x, side.y));
                const dir = len > 1e-9 ? scale(toO, 1 / len) : n;
                return <Segment key={`perp${i}`} from={sub(m, scale(dir, 1))} to={add(info.circumcenter, scale(dir, 1))} color={COLORS.circumcenter} width={1.5} dashed />;
              })}

            {/* Angle bisectors: vertex to the opposite side */}
            {!info.degenerate &&
              show.incenter &&
              sides.map(([v, p, q], i) => <Segment key={`bis${i}`} from={v} to={bisectorFoot(v, p, q)} color={COLORS.incenter} width={1.5} />)}

            {/* Altitudes: vertex to the foot on the opposite side's line, extended to H if it lies outside */}
            {!info.degenerate &&
              show.orthocenter &&
              sides.map(([v, p, q], i) => {
                const f = foot(v, p, q);
                const t = dot(sub(f, p), sub(q, p)) / dot(sub(q, p), sub(q, p));
                const nearestEnd = t < 0 ? p : q;
                return (
                  <g key={`alt${i}`}>
                    {(t < 0 || t > 1) && <Segment from={nearestEnd} to={f} color="#64748b" width={1.5} dashed />}
                    <Segment from={v} to={f} color={COLORS.orthocenter} width={1.5} />
                    <Segment from={f} to={info.orthocenter} color={COLORS.orthocenter} width={1.5} dashed />
                  </g>
                );
              })}

            {/* Euler line through O, G and H */}
            {!info.degenerate && show.euler && !isEquilateral && (() => {
              const d = sub(info.orthocenter, info.circumcenter);
              const k = 200 / Math.hypot(d.x, d.y);
              return <Segment from={sub(info.circumcenter, scale(d, k))} to={add(info.circumcenter, scale(d, k))} color={COLORS.euler} width={3} />;
            })()}

            {/* Center points */}
            {show.centroid && <CenterMark point={info.centroid} color={COLORS.centroid} label="G" />}
            {!info.degenerate && show.circumcenter && <CenterMark point={info.circumcenter} color={COLORS.circumcenter} label="O" />}
            {!info.degenerate && show.incenter && <CenterMark point={info.incenter} color={COLORS.incenter} label="I" />}
            {!info.degenerate && show.orthocenter && <CenterMark point={info.orthocenter} color={COLORS.orthocenter} label="H" />}

            {/* Vertices */}
            {vertices.map((v, i) => {
              const p = toPx(v);
              const away = sub(v, info.centroid);
              const len = Math.hypot(away.x, away.y) || 1;
              const lp = toPx(add(v, scale(away, 0.75 / len)));
              return (
                <g key={`v${i}`}>
                  <circle cx={p.x} cy={p.y} r={dragging === i ? 16 : 13} fill="#0f172a" stroke="white" strokeWidth={3} />
                  <text x={lp.x} y={lp.y} fontSize={26} fontWeight={700} fill="#0f172a" textAnchor="middle" dominantBaseline="middle" stroke="white" strokeWidth={5} paintOrder="stroke">
                    {VERTEX_NAMES[i]}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              <input type="checkbox" checked={snap} onChange={(e) => setSnap(e.target.checked)} className="h-4 w-4" />
              Snap vertices to a 0.5 grid
            </label>
            <Button size="sm" variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => setVertices(DEFAULT_VERTICES)}>
              Reset triangle
            </Button>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {info.degenerate ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-900">
              <p className="font-semibold">Degenerate triangle</p>
              <p className="mt-1">
                The three vertices are collinear, so the area is zero. The circumcircle, incircle and orthocenter are not defined. Only the
                centroid (the average of the vertices) still exists. Drag a vertex off the line.
              </p>
            </div>
          ) : null}

          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="mb-2 font-semibold text-ink">Vertices</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono">
              {vertices.map((v, i) => (
                <div key={i} className="contents">
                  <dt className="font-semibold text-ink">{VERTEX_NAMES[i]}</dt>
                  <dd className="text-ink-muted">{fmtPoint(v)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="mb-2 font-semibold text-ink">Centers</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono">
              <dt className="font-semibold" style={{ color: COLORS.centroid }}>G</dt>
              <dd className="text-ink-muted">{fmtPoint(info.centroid)}</dd>
              <dt className="font-semibold" style={{ color: COLORS.circumcenter }}>O</dt>
              <dd className="text-ink-muted">{info.degenerate ? 'undefined' : `${fmtPoint(info.circumcenter)}, R = ${fmt(info.R)}`}</dd>
              <dt className="font-semibold" style={{ color: COLORS.incenter }}>I</dt>
              <dd className="text-ink-muted">{info.degenerate ? 'undefined' : `${fmtPoint(info.incenter)}, r = ${fmt(info.r)}`}</dd>
              <dt className="font-semibold" style={{ color: COLORS.orthocenter }}>H</dt>
              <dd className="text-ink-muted">{info.degenerate ? 'undefined' : fmtPoint(info.orthocenter)}</dd>
            </dl>
          </div>

          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="mb-2 font-semibold text-ink">Measurements</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-ink-muted">
              <dt className="text-ink">Sides</dt>
              <dd>
                a = {fmt(info.a)}, b = {fmt(info.b)}, c = {fmt(info.c)}
              </dd>
              <dt className="text-ink">Area</dt>
              <dd>{fmt(info.area)}</dd>
              {!info.degenerate && (
                <>
                  <dt className="text-ink">Angles</dt>
                  <dd>
                    {info.angles.map((deg, i) => `${VERTEX_NAMES[i]} ${deg.toFixed(1)}°`).join(', ')}
                  </dd>
                  <dt className="text-ink">OG : GH</dt>
                  <dd>{isEquilateral ? 'O = G = H (equilateral)' : `${fmt(dist(info.circumcenter, info.centroid))} : ${fmt(dist(info.centroid, info.orthocenter))} = 1 : 2`}</dd>
                </>
              )}
            </dl>
          </div>

          {!info.degenerate && (
            <p className="text-ink-muted">
              {Math.max(...info.angles) > 90.0001
                ? 'Obtuse triangle: O and H lie outside the triangle.'
                : Math.abs(Math.max(...info.angles) - 90) <= 0.0001
                  ? 'Right triangle: O is the midpoint of the hypotenuse and H is the right-angle vertex.'
                  : 'Acute triangle: all four centers lie inside the triangle.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
