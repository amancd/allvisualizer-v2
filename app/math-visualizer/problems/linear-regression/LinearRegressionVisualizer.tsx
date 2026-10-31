'use client';

import { useRef, useState } from 'react';
import { Eraser, MousePointer2, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

/* ------------------------------------------------------------------ */
/* Drawing space: an 800×520 SVG showing data in [0, 10] × [0, 10].     */
/* ------------------------------------------------------------------ */

const WIDTH = 800;
const HEIGHT = 520;
const PAD = { left: 56, right: 24, top: 20, bottom: 56 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;
const DOMAIN = 10;
const MAX_POINTS = 40;

/** The guess line is defined by two draggable handles at these x values. */
const GUESS_X: [number, number] = [1, 9];

const toPx = (x: number) => PAD.left + (x / DOMAIN) * PLOT_W;
const toPy = (y: number) => PAD.top + PLOT_H - (y / DOMAIN) * PLOT_H;
const fromPx = (px: number) => ((px - PAD.left) / PLOT_W) * DOMAIN;
const fromPy = (py: number) => ((PAD.top + PLOT_H - py) / PLOT_H) * DOMAIN;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface Point {
  id: number;
  x: number;
  y: number;
}

type Pair = [number, number];

const presets: { name: string; data: Pair[] }[] = [
  {
    name: 'Positive trend',
    data: [[1, 2.1], [2, 2.9], [3, 3.6], [4, 4.8], [5, 5.1], [6, 6.3], [7, 6.8], [8, 8.2], [9, 8.7]],
  },
  {
    name: 'Negative trend',
    data: [[1, 8.6], [2, 7.9], [3, 7.4], [4, 6.1], [5, 5.8], [6, 4.6], [7, 4.2], [8, 2.9], [9, 2.4]],
  },
  {
    name: 'With an outlier',
    data: [[1, 2.1], [2, 2.9], [3, 3.6], [4, 4.8], [5, 5.1], [6, 6.3], [7, 6.8], [8, 8.2], [9, 0.8]],
  },
  {
    name: 'No correlation',
    data: [[1, 5], [2, 2], [3, 8], [4, 4], [5, 6.5], [6, 3], [7, 7.5], [8, 4.5], [9, 5.5]],
  },
];

const toPoints = (data: Pair[]): Point[] => data.map(([x, y], i) => ({ id: i, x, y }));

interface Fit {
  slope: number;
  intercept: number;
  r: number | null;
  rSquared: number | null;
  sse: number;
}

/** Ordinary least squares fit of y on x. Returns null when the line is undefined (fewer than 2 distinct x values). */
function leastSquares(points: Point[]): Fit | null {
  const n = points.length;
  if (n < 2) return null;
  const meanX = points.reduce((s, p) => s + p.x, 0) / n;
  const meanY = points.reduce((s, p) => s + p.y, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (const p of points) {
    sxx += (p.x - meanX) ** 2;
    sxy += (p.x - meanX) * (p.y - meanY);
    syy += (p.y - meanY) ** 2;
  }
  if (sxx < 1e-12) return null;
  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;
  const sse = sumSquaredErrors(points, slope, intercept);
  const r = syy < 1e-12 ? null : sxy / Math.sqrt(sxx * syy);
  return { slope, intercept, r, rSquared: r === null ? null : r * r, sse };
}

function sumSquaredErrors(points: Point[], slope: number, intercept: number) {
  return points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
}

const fmt = (v: number | null, digits = 3) => (v === null || !Number.isFinite(v) ? '—' : v.toFixed(digits));

type Tool = 'move' | 'erase';
type Drag = { kind: 'point'; id: number } | { kind: 'handle'; index: 0 | 1 } | null;

export default function LinearRegressionVisualizer() {
  const nextId = useRef(presets[0].data.length);
  const drag = useRef<Drag>(null);

  const [points, setPoints] = useState<Point[]>(() => toPoints(presets[0].data));
  const [tool, setTool] = useState<Tool>('move');
  const [showResiduals, setShowResiduals] = useState(true);
  const [showGuess, setShowGuess] = useState(false);
  const [guess, setGuess] = useState<Pair>([3, 6]);
  const [residualsFor, setResidualsFor] = useState<'fit' | 'guess'>('fit');

  const fit = leastSquares(points);
  const guessSlope = (guess[1] - guess[0]) / (GUESS_X[1] - GUESS_X[0]);
  const guessIntercept = guess[0] - guessSlope * GUESS_X[0];
  const guessSse = sumSquaredErrors(points, guessSlope, guessIntercept);

  // Residuals are drawn to the best-fit line unless the reader chose their own guess.
  const residualLine =
    showGuess && residualsFor === 'guess'
      ? { slope: guessSlope, intercept: guessIntercept }
      : fit && { slope: fit.slope, intercept: fit.intercept };

  const loadPreset = (data: Pair[]) => {
    setPoints(toPoints(data));
    nextId.current = data.length;
  };

  const dataPoint = (e: React.PointerEvent<SVGSVGElement>) => {
    const { x, y } = toDrawingPoint(e, e.currentTarget);
    return { x: clamp(fromPx(x), 0, DOMAIN), y: clamp(fromPy(y), 0, DOMAIN), insidePlot: x >= PAD.left && x <= WIDTH - PAD.right && y >= PAD.top && y <= PAD.top + PLOT_H };
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const target = e.target as Element;
    const pointEl = target.closest('[data-point]');
    const handleEl = target.closest('[data-handle]');
    const { x, y, insidePlot } = dataPoint(e);

    if (handleEl) {
      drag.current = { kind: 'handle', index: Number(handleEl.getAttribute('data-handle')) as 0 | 1 };
    } else if (pointEl) {
      const id = Number(pointEl.getAttribute('data-point'));
      if (tool === 'erase') {
        setPoints((ps) => ps.filter((p) => p.id !== id));
        return;
      }
      drag.current = { kind: 'point', id };
    } else if (tool === 'move' && insidePlot && points.length < MAX_POINTS) {
      const id = nextId.current++;
      setPoints((ps) => [...ps, { id, x, y }]);
      drag.current = { kind: 'point', id };
    } else {
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const current = drag.current;
    if (!current) return;
    const { x, y } = dataPoint(e);
    if (current.kind === 'point') {
      setPoints((ps) => ps.map((p) => (p.id === current.id ? { ...p, x, y } : p)));
    } else {
      setGuess((g) => (current.index === 0 ? [y, g[1]] : [g[0], y]));
    }
  };

  const endDrag = () => {
    drag.current = null;
  };

  /** Endpoints of y = mx + c across the plot, in drawing coordinates (clipped by the SVG clip path). */
  const lineEnds = (slope: number, intercept: number) => ({
    x1: toPx(0),
    y1: toPy(intercept),
    x2: toPx(DOMAIN),
    y2: toPy(slope * DOMAIN + intercept),
  });

  const ticks = Array.from({ length: DOMAIN + 1 }, (_, i) => i);

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-ink-muted">Presets:</span>
        {presets.map((p) => (
          <Button key={p.name} size="sm" variant="outline" onClick={() => loadPreset(p.data)}>
            {p.name}
          </Button>
        ))}
        <Button size="sm" variant="ghost" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => loadPreset([])}>
          Clear
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-ink-muted">Tool:</span>
        <Button
          size="sm"
          variant={tool === 'move' ? 'primary' : 'outline'}
          aria-pressed={tool === 'move'}
          leftIcon={<MousePointer2 className="h-4 w-4" />}
          onClick={() => setTool('move')}
        >
          Add / move
        </Button>
        <Button
          size="sm"
          variant={tool === 'erase' ? 'primary' : 'outline'}
          aria-pressed={tool === 'erase'}
          leftIcon={<Eraser className="h-4 w-4" />}
          onClick={() => setTool('erase')}
        >
          Remove
        </Button>
        <label className="ml-1 inline-flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={showResiduals} onChange={(e) => setShowResiduals(e.target.checked)} />
          Residuals
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={showGuess} onChange={(e) => setShowGuess(e.target.checked)} />
          My guess line
        </label>
        {showGuess && (
          <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => setGuess([3, 6])}>
            Reset guess
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div>
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className={`${responsiveSurface} touch-none select-none rounded-lg border border-line bg-white ${tool === 'erase' ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
            role="img"
            aria-label="Scatter plot with least-squares regression line"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <defs>
              <clipPath id="lr-plot-clip">
                <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H} />
              </clipPath>
            </defs>

            {/* Grid and axes */}
            {ticks.map((t) => (
              <g key={t}>
                <line x1={toPx(t)} y1={PAD.top} x2={toPx(t)} y2={PAD.top + PLOT_H} stroke="#eef0f3" strokeWidth={1.5} />
                <line x1={PAD.left} y1={toPy(t)} x2={WIDTH - PAD.right} y2={toPy(t)} stroke="#eef0f3" strokeWidth={1.5} />
                {t % 2 === 0 && (
                  <>
                    <text x={toPx(t)} y={PAD.top + PLOT_H + 28} textAnchor="middle" fontSize={20} fill="#6b7280">
                      {t}
                    </text>
                    <text x={PAD.left - 12} y={toPy(t) + 7} textAnchor="end" fontSize={20} fill="#6b7280">
                      {t}
                    </text>
                  </>
                )}
              </g>
            ))}
            <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H} fill="none" stroke="#9ca3af" strokeWidth={2} />
            <text x={WIDTH - PAD.right} y={HEIGHT - 6} textAnchor="end" fontSize={20} fill="#374151" fontStyle="italic">
              x
            </text>
            <text x={16} y={PAD.top + 16} fontSize={20} fill="#374151" fontStyle="italic">
              y
            </text>

            <g clipPath="url(#lr-plot-clip)">
              {/* Residual segments: red above the line, blue below */}
              {showResiduals &&
                residualLine &&
                points.map((p) => {
                  const predicted = residualLine.slope * p.x + residualLine.intercept;
                  return (
                    <line
                      key={`res-${p.id}`}
                      x1={toPx(p.x)}
                      y1={toPy(p.y)}
                      x2={toPx(p.x)}
                      y2={toPy(predicted)}
                      stroke={p.y >= predicted ? '#ef4444' : '#3b82f6'}
                      strokeWidth={3}
                      strokeDasharray="6 4"
                      opacity={0.8}
                    />
                  );
                })}

              {fit && <line {...lineEnds(fit.slope, fit.intercept)} stroke="#4f46e5" strokeWidth={4} />}
              {showGuess && (
                <line {...lineEnds(guessSlope, guessIntercept)} stroke="#f59e0b" strokeWidth={4} strokeDasharray="14 8" />
              )}
            </g>

            {/* Data points (with a larger invisible hit target for touch) */}
            {points.map((p) => (
              <g key={p.id} data-point={p.id} className={tool === 'erase' ? 'cursor-pointer' : 'cursor-grab'}>
                <circle cx={toPx(p.x)} cy={toPy(p.y)} r={22} fill="transparent" />
                <circle cx={toPx(p.x)} cy={toPy(p.y)} r={10} fill={tool === 'erase' ? '#f87171' : '#0f172a'} stroke="white" strokeWidth={2.5} />
              </g>
            ))}

            {/* Guess-line handles */}
            {showGuess &&
              GUESS_X.map((gx, i) => (
                <g key={gx} data-handle={i} className="cursor-ns-resize">
                  <circle cx={toPx(gx)} cy={toPy(guess[i])} r={24} fill="transparent" />
                  <rect x={toPx(gx) - 12} y={toPy(guess[i]) - 12} width={24} height={24} rx={4} fill="#f59e0b" stroke="white" strokeWidth={3} />
                </g>
              ))}
          </svg>
          <p className="mt-2 text-sm text-ink-muted">
            {tool === 'move'
              ? 'Tap empty space to add a point. Drag a point to move it.'
              : 'Tap a point to remove it.'}
            {showGuess && ' Drag the orange squares to move your guess line.'}
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-line bg-subtle p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Least-squares line</div>
            <div className="mt-1 break-words font-mono text-lg font-semibold text-brand-700">
              {fit ? `ŷ = ${fmt(fit.slope)}x ${fit.intercept >= 0 ? '+' : '−'} ${fmt(Math.abs(fit.intercept))}` : 'Need 2+ points with different x'}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-2 text-sm">
            <Stat label="Points (n)" value={String(points.length)} />
            <Stat label="Slope (b)" value={fmt(fit?.slope ?? null)} />
            <Stat label="Intercept (a)" value={fmt(fit?.intercept ?? null)} />
            <Stat label="Pearson r" value={fmt(fit?.r ?? null)} />
            <Stat label="R²" value={fmt(fit?.rSquared ?? null)} />
            <Stat label="SSE (best)" value={fmt(fit?.sse ?? null, 2)} />
          </dl>

          {showGuess && (
            <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-sm">
              <div className="font-semibold text-amber-900">Your guess</div>
              <div className="font-mono text-amber-900">
                y = {fmt(guessSlope)}x {guessIntercept >= 0 ? '+' : '−'} {fmt(Math.abs(guessIntercept))}
              </div>
              <div className="text-ink">
                SSE = <span className="font-mono font-semibold">{fmt(guessSse, 2)}</span>
                {fit && fit.sse > 1e-9 && (
                  <> ({fmt(guessSse / fit.sse, 2)}× the minimum)</>
                )}
              </div>
              <label className="flex items-center gap-2 text-ink">
                <input
                  type="checkbox"
                  checked={residualsFor === 'guess'}
                  onChange={(e) => setResidualsFor(e.target.checked ? 'guess' : 'fit')}
                />
                Draw residuals to my guess
              </label>
            </div>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-0.5 w-5 bg-brand-600" /> best fit
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-0.5 w-5 bg-red-500" /> above line
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-0.5 w-5 bg-blue-500" /> below line
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white px-3 py-2">
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="font-mono text-base font-semibold text-ink">{value}</dd>
    </div>
  );
}
