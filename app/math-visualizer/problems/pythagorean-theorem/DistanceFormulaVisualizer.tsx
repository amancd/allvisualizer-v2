'use client';

import { useState } from 'react';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

interface Pt {
  x: number;
  y: number;
}

// Drawing space: a 10 × 8 grid, 50 units per square, with a 50-unit margin for axis labels.
const UNIT = 50;
const COLS = 10;
const ROWS = 8;
const MARGIN = 50;
const WIDTH = COLS * UNIT + 2 * MARGIN;
const HEIGHT = ROWS * UNIT + 2 * MARGIN;

const toScreen = (p: Pt): Pt => ({ x: MARGIN + p.x * UNIT, y: HEIGHT - MARGIN - p.y * UNIT });
const toGrid = (p: Pt): Pt => ({
  x: Math.max(0, Math.min(COLS, Math.round((p.x - MARGIN) / UNIT))),
  y: Math.max(0, Math.min(ROWS, Math.round((HEIGHT - MARGIN - p.y) / UNIT))),
});

const fmt = (v: number) => {
  const r = Math.round(v * 100) / 100;
  return r < 0 ? `−${Math.abs(r)}` : String(r);
};

function Label({ at, color, children }: { at: Pt; color: string; children: React.ReactNode }) {
  return (
    <text
      x={at.x}
      y={at.y}
      fill={color}
      fontSize={22}
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

/** Drag two points; the horizontal and vertical gaps are the legs of a right triangle whose hypotenuse is the distance. */
export default function DistanceFormulaVisualizer() {
  const [points, setPoints] = useState<[Pt, Pt]>([
    { x: 1, y: 1 },
    { x: 7, y: 6 },
  ]);
  const [dragging, setDragging] = useState<0 | 1 | null>(null);

  const [p1, p2] = points;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const d = Math.hypot(dx, dy);
  const exact = Number.isInteger(d);

  const s1 = toScreen(p1);
  const s2 = toScreen(p2);
  const corner = toScreen({ x: p2.x, y: p1.y });

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const p = toDrawingPoint(e, e.currentTarget);
    const dist = (s: Pt) => Math.hypot(s.x - p.x, s.y - p.y);
    const nearest = dist(s1) <= dist(s2) ? 0 : 1;
    if (dist(nearest === 0 ? s1 : s2) > 40) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(nearest);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragging === null) return;
    const g = toGrid(toDrawingPoint(e, e.currentTarget));
    setPoints((prev) => (dragging === 0 ? [g, prev[1]] : [prev[0], g]));
  };

  const stop = () => setDragging(null);

  return (
    <div className="grid gap-6 rounded-card border border-line bg-white p-4 shadow-card sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={`${responsiveSurface} touch-none rounded-xl border border-line bg-white ${dragging !== null ? 'cursor-grabbing' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        role="img"
        aria-label={`Points P1 (${p1.x}, ${p1.y}) and P2 (${p2.x}, ${p2.y}) with the right triangle between them`}
      >
        {Array.from({ length: COLS + 1 }, (_, i) => (
          <g key={`v${i}`}>
            <line x1={MARGIN + i * UNIT} y1={MARGIN} x2={MARGIN + i * UNIT} y2={HEIGHT - MARGIN} stroke={i === 0 ? '#475569' : '#e2e8f0'} strokeWidth={i === 0 ? 2 : 1} />
            {i % 2 === 0 && (
              <text x={MARGIN + i * UNIT} y={HEIGHT - MARGIN + 26} fontSize={18} fill="#64748b" textAnchor="middle">
                {i}
              </text>
            )}
          </g>
        ))}
        {Array.from({ length: ROWS + 1 }, (_, i) => (
          <g key={`h${i}`}>
            <line x1={MARGIN} y1={HEIGHT - MARGIN - i * UNIT} x2={WIDTH - MARGIN} y2={HEIGHT - MARGIN - i * UNIT} stroke={i === 0 ? '#475569' : '#e2e8f0'} strokeWidth={i === 0 ? 2 : 1} />
            {i % 2 === 0 && i > 0 && (
              <text x={MARGIN - 12} y={HEIGHT - MARGIN - i * UNIT + 6} fontSize={18} fill="#64748b" textAnchor="end">
                {i}
              </text>
            )}
          </g>
        ))}

        {/* Legs and hypotenuse */}
        {dx !== 0 && <line x1={s1.x} y1={s1.y} x2={corner.x} y2={corner.y} stroke="#2563eb" strokeWidth={4} />}
        {dy !== 0 && <line x1={corner.x} y1={corner.y} x2={s2.x} y2={s2.y} stroke="#16a34a" strokeWidth={4} />}
        <line x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke="#7c3aed" strokeWidth={5} />

        {dx !== 0 && <Label at={{ x: (s1.x + corner.x) / 2, y: corner.y + (dy >= 0 ? 24 : -24) }} color="#1d4ed8">{`|Δx| = ${Math.abs(dx)}`}</Label>}
        {dy !== 0 && (
          <Label at={{ x: Math.max(70, Math.min(WIDTH - 70, corner.x + (dx >= 0 ? 62 : -62))), y: (corner.y + s2.y) / 2 }} color="#15803d">
            {`|Δy| = ${Math.abs(dy)}`}
          </Label>
        )}
        {d > 0 && (
          <Label at={{ x: (s1.x + s2.x) / 2 - (dx * dy >= 0 ? 30 : -30), y: (s1.y + s2.y) / 2 - 18 }} color="#6d28d9">
            d
          </Label>
        )}

        {/* Draggable points */}
        {[s1, s2].map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r={12} fill="white" stroke="#0f172a" strokeWidth={4} className={dragging === null ? 'cursor-grab' : ''} />
            <Label at={{ x: s.x, y: s.y - 28 }} color="#0f172a">
              {i === 0 ? 'P₁' : 'P₂'}
            </Label>
          </g>
        ))}
      </svg>

      <div className="space-y-3 text-sm">
        <div className="rounded-xl border border-line bg-subtle p-4 font-mono text-ink">
          <p>
            P₁ = ({p1.x}, {p1.y})
          </p>
          <p>
            P₂ = ({p2.x}, {p2.y})
          </p>
          <p className="mt-2 text-blue-700">Δx = {p2.x} − {p1.x} = {fmt(dx)}</p>
          <p className="text-green-700">Δy = {p2.y} − {p1.y} = {fmt(dy)}</p>
          <p className="mt-2 text-violet-700">
            d = √({fmt(dx)}² + {fmt(dy)}²) = √{dx * dx + dy * dy} {exact ? '=' : '≈'} {fmt(d)}
          </p>
        </div>
        <p className="text-ink-muted">
          Drag P₁ and P₂. The horizontal and vertical gaps are the legs of a right triangle, so the distance between the
          points is its hypotenuse: d² = Δx² + Δy².
        </p>
      </div>
    </div>
  );
}
