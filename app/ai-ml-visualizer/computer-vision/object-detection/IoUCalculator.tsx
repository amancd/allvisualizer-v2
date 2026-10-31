'use client';

import { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { area, intersection, iou, type Box } from './detectionData';

const W = 400;
const H = 260;
const HANDLE = 14;
const MIN_SIZE = 20;

const START: Record<'A' | 'B', Box> = {
  A: { x: 60, y: 50, w: 160, h: 120 },
  B: { x: 150, y: 100, w: 170, h: 120 },
};

const COLORS = { A: '#2563eb', B: '#e11d48' } as const;

type Drag = { id: 'A' | 'B'; mode: 'move' | 'resize'; dx: number; dy: number } | null;

/** Drag two boxes around; their intersection, union and IoU update live. */
export default function IoUCalculator() {
  const [boxes, setBoxes] = useState(START);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<Drag>(null);

  const startDrag = (id: 'A' | 'B', mode: 'move' | 'resize') => (e: React.PointerEvent<SVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    e.stopPropagation();
    svg.setPointerCapture(e.pointerId);
    const p = toDrawingPoint(e, svg);
    const b = boxes[id];
    drag.current = mode === 'move' ? { id, mode, dx: p.x - b.x, dy: p.y - b.y } : { id, mode, dx: p.x - (b.x + b.w), dy: p.y - (b.y + b.h) };
  };

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) return;
    const p = toDrawingPoint(e, e.currentTarget);
    setBoxes((prev) => {
      const b = prev[d.id];
      let next: Box;
      if (d.mode === 'move') {
        next = {
          ...b,
          x: Math.round(Math.max(0, Math.min(W - b.w, p.x - d.dx))),
          y: Math.round(Math.max(0, Math.min(H - b.h, p.y - d.dy))),
        };
      } else {
        next = {
          ...b,
          w: Math.round(Math.max(MIN_SIZE, Math.min(W - b.x, p.x - d.dx - b.x))),
          h: Math.round(Math.max(MIN_SIZE, Math.min(H - b.y, p.y - d.dy - b.y))),
        };
      }
      return { ...prev, [d.id]: next };
    });
  };

  const endDrag = () => {
    drag.current = null;
  };

  const { A, B } = boxes;
  const inter = intersection(A, B);
  const interArea = inter ? area(inter) : 0;
  const union = area(A) + area(B) - interArea;
  const value = iou(A, B);

  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="min-w-0">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className={`${responsiveSurface} touch-none select-none rounded-lg border border-line-strong bg-subtle`}
            onPointerMove={onMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            role="img"
            aria-label="Two draggable boxes for computing IoU"
          >
            {(['A', 'B'] as const).map((id) => {
              const b = boxes[id];
              return (
                <g key={id}>
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    fill={COLORS[id]}
                    fillOpacity={0.12}
                    stroke={COLORS[id]}
                    strokeWidth={3}
                    className="cursor-move"
                    onPointerDown={startDrag(id, 'move')}
                  />
                  <text x={b.x + 8} y={b.y + 22} fontSize={18} fontWeight={700} fill={COLORS[id]} pointerEvents="none">
                    {id}
                  </text>
                  <rect
                    x={b.x + b.w - HANDLE}
                    y={b.y + b.h - HANDLE}
                    width={HANDLE * 2}
                    height={HANDLE * 2}
                    rx={4}
                    fill="#ffffff"
                    stroke={COLORS[id]}
                    strokeWidth={3}
                    className="cursor-nwse-resize"
                    onPointerDown={startDrag(id, 'resize')}
                  />
                </g>
              );
            })}
            {inter && (
              <rect x={inter.x} y={inter.y} width={inter.w} height={inter.h} fill="#7c3aed" fillOpacity={0.35} pointerEvents="none" />
            )}
          </svg>
          <p className="mt-2 text-sm text-ink-muted">Drag a box to move it. Drag its white corner handle to resize.</p>
        </div>

        <div className="min-w-0 space-y-3">
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {[
              ['Area A', `${A.w} × ${A.h} = ${area(A)}`],
              ['Area B', `${B.w} × ${B.h} = ${area(B)}`],
              ['Intersection', inter ? `${inter.w} × ${inter.h} = ${interArea}` : '0'],
              ['Union', `${area(A)} + ${area(B)} − ${interArea} = ${union}`],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0 rounded-lg border border-line bg-subtle p-2">
                <dt className="text-ink-muted">{k}</dt>
                <dd className="break-words font-mono text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="rounded-lg border border-violet-200 bg-violet-50/60 p-3">
            <p className="text-sm text-ink-muted">IoU = intersection / union</p>
            <p className="font-mono text-2xl text-ink">
              {interArea} / {union} = {value.toFixed(3)}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white ring-1 ring-inset ring-violet-200">
              <div className="h-full bg-violet-500" style={{ width: `${value * 100}%` }} />
            </div>
            <p className="mt-2 text-sm text-gray-700">
              {value >= 0.5
                ? 'At least 0.5: most benchmarks would count B as a correct detection of A.'
                : 'Below 0.5: usually counted as a miss, and NMS at threshold 0.5 would keep both boxes.'}
            </p>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => setBoxes(START)}>
            Reset boxes
          </Button>
        </div>
      </div>
    </div>
  );
}
