'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { FastForward, Pause, Play, RotateCcw, Shuffle, StepForward, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import {
  CLUSTER_COLORS,
  CLUSTER_RGB,
  PLANE_H,
  PLANE_W,
  canvasToData,
  drawPlaneBorder,
  drawPlaneFrame,
  makeBlobs,
  makeMoons,
  makeUniform,
  mulberry32,
  rgba,
  toCanvasX,
  toCanvasY,
} from '../_classical-ml/ml-shared';
import LineChart from '../_classical-ml/LineChart';
import { Panel, RangeField, Segmented, Stat } from '../_classical-ml/controls';

/* ------------------------------------------------------------------ */
/* Datasets                                                            */
/* ------------------------------------------------------------------ */

interface Pt {
  x: number;
  y: number;
}

type DatasetId = 'blobs' | 'uneven' | 'moons' | 'uniform';

const datasets: { id: DatasetId; name: string; k: number; make: () => Pt[] }[] = [
  {
    id: 'blobs',
    name: 'Blobs',
    k: 4,
    make: () =>
      makeBlobs(11, [
        { x: 0.25, y: 0.72, sd: 0.06, n: 40 },
        { x: 0.72, y: 0.75, sd: 0.06, n: 40 },
        { x: 0.3, y: 0.25, sd: 0.06, n: 40 },
        { x: 0.75, y: 0.3, sd: 0.06, n: 40 },
      ]),
  },
  {
    id: 'uneven',
    name: 'Uneven blobs',
    k: 3,
    make: () =>
      makeBlobs(23, [
        { x: 0.32, y: 0.5, sd: 0.13, n: 110 },
        { x: 0.8, y: 0.78, sd: 0.035, n: 18 },
        { x: 0.8, y: 0.25, sd: 0.035, n: 18 },
      ]),
  },
  { id: 'moons', name: 'Moons', k: 2, make: () => makeMoons(7, 160, 0.025) },
  { id: 'uniform', name: 'Uniform', k: 3, make: () => makeUniform(5, 150) },
];

/* ------------------------------------------------------------------ */
/* K-means (Lloyd's algorithm)                                         */
/* ------------------------------------------------------------------ */

type InitMethod = 'random' | 'plusplus';

const dist2 = (a: Pt, b: Pt) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

function nearest(p: Pt, centroids: Pt[]): number {
  let best = 0;
  let bestD = Infinity;
  centroids.forEach((c, i) => {
    const d = dist2(p, c);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}

/** Random: k distinct data points (Forgy). k-means++: spread starts out with probability ∝ D². */
function initCentroids(points: Pt[], k: number, method: InitMethod, seed: number): Pt[] {
  const n = points.length;
  const kk = Math.min(k, n);
  if (kk === 0) return [];
  const rng = mulberry32(seed);
  if (method === 'random') {
    const idx = Array.from({ length: n }, (_, i) => i);
    for (let i = 0; i < kk; i++) {
      const j = i + Math.floor(rng() * (n - i));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    return idx.slice(0, kk).map((i) => ({ ...points[i] }));
  }
  const centroids: Pt[] = [{ ...points[Math.floor(rng() * n)] }];
  while (centroids.length < kk) {
    const d = points.map((p) => Math.min(...centroids.map((c) => dist2(p, c))));
    const total = d.reduce((s, v) => s + v, 0);
    if (total === 0) {
      centroids.push({ ...points[Math.floor(rng() * n)] });
      continue;
    }
    let r = rng() * total;
    let chosen = n - 1;
    for (let i = 0; i < n; i++) {
      r -= d[i];
      if (r <= 0) {
        chosen = i;
        break;
      }
    }
    centroids.push({ ...points[chosen] });
  }
  return centroids;
}

function assignAll(points: Pt[], centroids: Pt[]) {
  return points.map((p) => nearest(p, centroids));
}

/** Mean of each cluster. An empty cluster keeps its old centroid. */
function updateCentroids(points: Pt[], assign: number[], centroids: Pt[]): Pt[] {
  const sums = centroids.map(() => ({ x: 0, y: 0, n: 0 }));
  points.forEach((p, i) => {
    const s = sums[assign[i]];
    s.x += p.x;
    s.y += p.y;
    s.n += 1;
  });
  return sums.map((s, i) => (s.n === 0 ? centroids[i] : { x: s.x / s.n, y: s.y / s.n }));
}

function inertia(points: Pt[], assign: number[], centroids: Pt[]) {
  return points.reduce((s, p, i) => s + dist2(p, centroids[assign[i]]), 0);
}

/** Full run used by the elbow chart: best of several k-means++ starts. */
function bestInertia(points: Pt[], k: number, restarts = 5): number {
  let best = Infinity;
  for (let r = 0; r < restarts; r++) {
    let c = initCentroids(points, k, 'plusplus', 1000 + 97 * k + r);
    let a = assignAll(points, c);
    for (let it = 0; it < 100; it++) {
      c = updateCentroids(points, a, c);
      const next = assignAll(points, c);
      const same = next.every((v, i) => v === a[i]);
      a = next;
      if (same) break;
    }
    best = Math.min(best, inertia(points, a, c));
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* Step-by-step state                                                  */
/* ------------------------------------------------------------------ */

type Phase = 'ready' | 'assigned' | 'updated' | 'converged';

interface KState {
  points: Pt[];
  k: number;
  init: InitMethod;
  seed: number;
  centroids: Pt[];
  assign: number[] | null;
  phase: Phase;
  trails: Pt[][];
  /** WCSS after each assignment step. */
  history: number[];
  iteration: number;
}

type Action =
  | { type: 'load'; points: Pt[]; k: number }
  | { type: 'setK'; k: number }
  | { type: 'setInit'; init: InitMethod }
  | { type: 'reinit' }
  | { type: 'step' }
  | { type: 'run' }
  | { type: 'add'; point: Pt };

function fresh(points: Pt[], k: number, init: InitMethod, seed: number): KState {
  const centroids = initCentroids(points, k, init, seed);
  return {
    points,
    k,
    init,
    seed,
    centroids,
    assign: null,
    phase: 'ready',
    trails: centroids.map((c) => [c]),
    history: [],
    iteration: 0,
  };
}

function step(s: KState): KState {
  if (s.centroids.length === 0 || s.phase === 'converged') return s;
  if (s.phase === 'assigned') {
    const centroids = updateCentroids(s.points, s.assign!, s.centroids);
    return {
      ...s,
      centroids,
      phase: 'updated',
      trails: s.trails.map((t, i) => [...t, centroids[i]]),
    };
  }
  // 'ready' or 'updated': assignment step
  const assign = assignAll(s.points, s.centroids);
  const unchanged = s.assign !== null && s.phase === 'updated' && assign.every((v, i) => v === s.assign![i]);
  return {
    ...s,
    assign,
    phase: unchanged ? 'converged' : 'assigned',
    history: unchanged ? s.history : [...s.history, inertia(s.points, assign, s.centroids)],
    iteration: unchanged ? s.iteration : s.iteration + 1,
  };
}

function reducer(s: KState, a: Action): KState {
  switch (a.type) {
    case 'load':
      return fresh(a.points, a.k, s.init, s.seed);
    case 'setK':
      return fresh(s.points, a.k, s.init, s.seed);
    case 'setInit':
      return fresh(s.points, s.k, a.init, s.seed);
    case 'reinit':
      return fresh(s.points, s.k, s.init, s.seed + 1);
    case 'step':
      return step(s);
    case 'run': {
      let next = s;
      for (let i = 0; i < 400 && next.phase !== 'converged' && next.centroids.length > 0; i++) next = step(next);
      return next;
    }
    case 'add': {
      const points = [...s.points, a.point];
      // Fewer points than k so far: start again so the new point can become a centroid.
      if (s.centroids.length < s.k) return fresh(points, s.k, s.init, s.seed);
      // Keep the centroids where they are; the next step reassigns every point.
      return { ...s, points, assign: null, phase: 'ready', history: [], iteration: 0, trails: s.centroids.map((c) => [c]) };
    }
  }
}

const MAX_POINTS = 400;
const CELL = 4;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function KMeansVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataset, setDataset] = useState<DatasetId>('blobs');
  const [state, dispatch] = useReducer(reducer, undefined, () => fresh(datasets[0].make(), datasets[0].k, 'random', 1));
  const [showRegions, setShowRegions] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [playing, setPlaying] = useState(false);

  const running = playing && state.phase !== 'converged' && state.centroids.length > 0;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => dispatch({ type: 'step' }), 650);
    return () => window.clearInterval(id);
  }, [running]);

  const elbow = useMemo(
    () => (state.points.length === 0 ? [] : Array.from({ length: 8 }, (_, i) => bestInertia(state.points, i + 1))),
    [state.points],
  );

  // Draw the plane.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { points, centroids, assign, trails } = state;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, PLANE_W, PLANE_H);

    // Voronoi regions of the current centroids, on a coarse grid.
    if (showRegions && centroids.length > 0) {
      for (let py = 0; py < PLANE_H; py += CELL) {
        for (let px = 0; px < PLANE_W; px += CELL) {
          const d = canvasToData(px + CELL / 2, py + CELL / 2);
          if (!d) continue;
          ctx.fillStyle = rgba(CLUSTER_RGB[nearest(d, centroids)], 0.12);
          ctx.fillRect(px, py, CELL, CELL);
        }
      }
    }
    drawPlaneFrame(ctx);

    // Lines from each point to its centroid.
    if (showLines && assign) {
      ctx.lineWidth = 1;
      points.forEach((p, i) => {
        const c = centroids[assign[i]];
        ctx.strokeStyle = rgba(CLUSTER_RGB[assign[i]], 0.35);
        ctx.beginPath();
        ctx.moveTo(toCanvasX(p.x), toCanvasY(p.y));
        ctx.lineTo(toCanvasX(c.x), toCanvasY(c.y));
        ctx.stroke();
      });
    }

    // Points.
    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(toCanvasX(p.x), toCanvasY(p.y), 4.5, 0, Math.PI * 2);
      ctx.fillStyle = assign ? CLUSTER_COLORS[assign[i]] : '#6b7280';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    });

    // Centroid trails.
    trails.forEach((trail, i) => {
      if (trail.length < 2) return;
      ctx.strokeStyle = CLUSTER_COLORS[i];
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      trail.forEach((c, j) => (j === 0 ? ctx.moveTo(toCanvasX(c.x), toCanvasY(c.y)) : ctx.lineTo(toCanvasX(c.x), toCanvasY(c.y))));
      ctx.stroke();
      ctx.setLineDash([]);
      trail.slice(0, -1).forEach((c) => {
        ctx.beginPath();
        ctx.arc(toCanvasX(c.x), toCanvasY(c.y), 3, 0, Math.PI * 2);
        ctx.fillStyle = CLUSTER_COLORS[i];
        ctx.fill();
      });
    });

    // Centroids: a coloured disc with a cross.
    centroids.forEach((c, i) => {
      const x = toCanvasX(c.x);
      const y = toCanvasY(c.y);
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fillStyle = CLUSTER_COLORS[i];
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x - 5, y - 5);
      ctx.lineTo(x + 5, y + 5);
      ctx.moveTo(x + 5, y - 5);
      ctx.lineTo(x - 5, y + 5);
      ctx.stroke();
    });

    drawPlaneBorder(ctx);
  }, [state, showRegions, showLines]);

  const loadDataset = (id: DatasetId) => {
    const d = datasets.find((ds) => ds.id === id)!;
    setDataset(id);
    setPlaying(false);
    dispatch({ type: 'load', points: d.make(), k: d.k });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (state.points.length >= MAX_POINTS) return;
    const { x, y } = toDrawingPoint(e, e.currentTarget);
    const d = canvasToData(x, y);
    if (d) dispatch({ type: 'add', point: d });
  };

  const nextAction =
    state.centroids.length === 0
      ? 'Add some points to start.'
      : state.phase === 'converged'
        ? `Converged: no point changed cluster on iteration ${state.iteration + 1}.`
        : state.phase === 'assigned'
          ? 'Next: update step. Move each centroid to the mean of its points.'
          : 'Next: assignment step. Give every point to its nearest centroid.';

  const currentInertia = state.history.length > 0 ? state.history[state.history.length - 1] : null;
  const historyMax = Math.max(1e-9, ...state.history);
  const elbowMax = Math.max(1e-9, ...elbow);
  const histTicks = state.history.length <= 10 ? state.history.map((_, i) => i + 1) : niceIntTicks(state.history.length);

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-ink-muted">Dataset:</span>
        {datasets.map((d) => (
          <Button
            key={d.id}
            size="sm"
            variant={dataset === d.id ? 'primary' : 'outline'}
            aria-pressed={dataset === d.id}
            onClick={() => loadDataset(d.id)}
          >
            {d.name}
          </Button>
        ))}
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Trash2 className="h-4 w-4" />}
          onClick={() => {
            setPlaying(false);
            dispatch({ type: 'load', points: [], k: state.k });
          }}
        >
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RangeField
          label="Number of clusters (k)"
          value={state.k}
          min={1}
          max={8}
          onChange={(k) => {
            setPlaying(false);
            dispatch({ type: 'setK', k });
          }}
        />
        <Segmented
          label="Initialisation"
          value={state.init}
          options={[
            { value: 'random', label: 'Random points' },
            { value: 'plusplus', label: 'k-means++' },
          ]}
          onChange={(init) => {
            setPlaying(false);
            dispatch({ type: 'setInit', init });
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          leftIcon={<StepForward className="h-4 w-4" />}
          onClick={() => dispatch({ type: 'step' })}
          disabled={state.phase === 'converged' || state.centroids.length === 0}
        >
          {state.phase === 'assigned' ? 'Update centroids' : 'Assign points'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          leftIcon={running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          onClick={() => setPlaying(!running)}
          disabled={state.phase === 'converged' || state.centroids.length === 0}
        >
          {running ? 'Pause' : 'Auto-play'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<FastForward className="h-4 w-4" />}
          onClick={() => {
            setPlaying(false);
            dispatch({ type: 'run' });
          }}
          disabled={state.phase === 'converged' || state.centroids.length === 0}
        >
          Run to convergence
        </Button>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Shuffle className="h-4 w-4" />}
          onClick={() => {
            setPlaying(false);
            dispatch({ type: 'reinit' });
          }}
        >
          New random start
        </Button>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<RotateCcw className="h-4 w-4" />}
          onClick={() => {
            setPlaying(false);
            dispatch({ type: 'setK', k: state.k });
          }}
        >
          Restart
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-ink">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={showRegions} onChange={(e) => setShowRegions(e.target.checked)} />
          Region shading
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={showLines} onChange={(e) => setShowLines(e.target.checked)} />
          Lines to centroids
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <canvas
            ref={canvasRef}
            width={PLANE_W}
            height={PLANE_H}
            className={`${responsiveSurface} touch-none cursor-crosshair rounded-lg border border-line`}
            onPointerDown={handlePointerDown}
            role="img"
            aria-label="Scatter plot of points coloured by cluster, with centroids and their movement trails"
          />
          <p className="mt-2 text-sm text-ink-muted">
            Tap the plot to add a point. Large discs with a cross are centroids; dashed lines are their trails.
          </p>
          <p className="mt-2 rounded-lg border border-line bg-subtle px-3 py-2 text-sm font-medium text-ink">{nextAction}</p>
          {dataset === 'moons' && (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-sm text-amber-900">
              Failure case: k-means assumes round, similar-sized clusters and always splits the plane with straight
              lines. Even with k = 2 and a perfect start it cuts each moon in half instead of following their shapes.
            </p>
          )}
          {dataset === 'uneven' && (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-sm text-amber-900">
              The big spread-out cluster has the most squared error to give away, so k-means is tempted to split it and
              merge the two small ones. Try several random starts and compare the final WCSS.
            </p>
          )}
          {dataset === 'uniform' && (
            <p className="mt-3 rounded-lg border border-line bg-subtle px-3 py-2 text-sm text-ink-muted">
              There are no real clusters here, yet k-means always returns k of them. The elbow chart has no clear bend.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <Stat label="Points" value={String(state.points.length)} />
            <Stat label="Iteration" value={String(state.iteration)} />
            <Stat label="WCSS (inertia)" value={currentInertia === null ? '-' : currentInertia.toFixed(3)} />
            <Stat label="Phase" value={state.phase === 'converged' ? 'done' : state.phase === 'assigned' ? 'update' : 'assign'} />
          </dl>

          <Panel title="WCSS per iteration">
            {state.history.length === 0 ? (
              <p className="text-sm text-ink-muted">Take an assignment step to start the curve.</p>
            ) : (
              <LineChart
                series={[{ name: 'WCSS', color: '#4f46e5', points: state.history.map((v, i) => ({ x: i + 1, y: v })) }]}
                xDomain={[1, Math.max(2, state.history.length)]}
                yDomain={[0, historyMax * 1.1]}
                xTicks={histTicks}
                yTicks={[0, historyMax / 2, historyMax]}
                formatY={(v) => v.toFixed(2)}
                xLabel="iteration"
                yLabel="WCSS"
                ariaLabel="Within-cluster sum of squares after each assignment step"
              />
            )}
          </Panel>

          <Panel title="Elbow method (best of 5 runs)">
            {elbow.length === 0 ? (
              <p className="text-sm text-ink-muted">Add points to compute the elbow curve.</p>
            ) : (
              <>
                <LineChart
                  series={[{ name: 'WCSS', color: '#0891b2', points: elbow.map((v, i) => ({ x: i + 1, y: v })) }]}
                  xDomain={[1, 8]}
                  yDomain={[0, elbowMax * 1.05]}
                  xTicks={[1, 2, 3, 4, 5, 6, 7, 8]}
                  yTicks={[0, elbowMax / 2, elbowMax]}
                  formatY={(v) => v.toFixed(2)}
                  xLabel="k"
                  yLabel="WCSS"
                  highlightX={state.k}
                  selectableXs={[1, 2, 3, 4, 5, 6, 7, 8]}
                  onSelectX={(k) => {
                    setPlaying(false);
                    dispatch({ type: 'setK', k });
                  }}
                  ariaLabel="Elbow chart: lowest WCSS found for k from 1 to 8"
                />
                <p className="mt-1 text-xs text-ink-muted">Tap a column to set k. Look for the bend where extra clusters stop helping much.</p>
              </>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function niceIntTicks(n: number): number[] {
  const step = Math.ceil(n / 8);
  const ticks: number[] = [];
  for (let t = 1; t <= n; t += step) ticks.push(t);
  return ticks;
}
