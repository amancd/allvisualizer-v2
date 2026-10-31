'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

/* ------------------------------------------------------------------ */
/* Loss surfaces                                                       */
/* ------------------------------------------------------------------ */

type Vec = [number, number];
type SurfaceId = 'bowl' | 'valley' | 'rosenbrock' | 'wells';

interface Surface {
  id: SurfaceId;
  name: string;
  formula: string;
  note: string;
  f: (x: number, y: number) => number;
  grad: (x: number, y: number) => Vec;
  /** Visible region: [xMin, xMax, yMin, yMax]. Kept at a 3:2 aspect ratio to match the canvas. */
  domain: [number, number, number, number];
  start: Vec;
  lr: number;
  adamLr: number;
  minima: Vec[];
}

/** Gaussian wells for the multiple-minima surface: depth a, centre (cx, cy), width s. */
const WELLS = [
  { a: 2.0, cx: 1.6, cy: 0.8, s: 1.0 },
  { a: 1.4, cx: -1.6, cy: -1.0, s: 0.7 },
  { a: 1.0, cx: -1.4, cy: 1.5, s: 0.5 },
];

const wellsF = (x: number, y: number) =>
  0.05 * (x * x + y * y) - WELLS.reduce((s, w) => s + w.a * Math.exp(-((x - w.cx) ** 2 + (y - w.cy) ** 2) / w.s), 0);

function wellsGrad(x: number, y: number): Vec {
  let gx = 0.1 * x;
  let gy = 0.1 * y;
  for (const w of WELLS) {
    // d/dx of −a·exp(−r²/s) is +a·exp(−r²/s)·2(x − cx)/s
    const e = w.a * Math.exp(-((x - w.cx) ** 2 + (y - w.cy) ** 2) / w.s);
    gx += (e * 2 * (x - w.cx)) / w.s;
    gy += (e * 2 * (y - w.cy)) / w.s;
  }
  return [gx, gy];
}

/** Find a well's exact minimum by running many small gradient steps from its centre. */
function polishMinimum(start: Vec): Vec {
  let [x, y] = start;
  for (let i = 0; i < 5000; i++) {
    const [gx, gy] = wellsGrad(x, y);
    x -= 0.05 * gx;
    y -= 0.05 * gy;
  }
  return [x, y];
}
const WELL_MINIMA = WELLS.map((w) => polishMinimum([w.cx, w.cy]));

const SURFACES: Surface[] = [
  {
    id: 'bowl',
    name: 'Bowl',
    formula: 'f(x, y) = x² + y²',
    note: 'Curvature 2 in every direction. Plain GD is stable for η < 2/2 = 1 and converges in one step at η = 0.5.',
    f: (x, y) => x * x + y * y,
    grad: (x, y) => [2 * x, 2 * y],
    domain: [-3, 3, -2, 2],
    start: [-2.6, 1.6],
    lr: 0.1,
    adamLr: 0.1,
    minima: [[0, 0]],
  },
  {
    id: 'valley',
    name: 'Elongated valley',
    formula: 'f(x, y) = 0.1x² + 2y²',
    note: 'Curvatures 0.2 (along x) and 4 (along y). GD is stable only for η < 2/4 = 0.5, a step that barely moves along x: watch it zig-zag across the valley.',
    f: (x, y) => 0.1 * x * x + 2 * y * y,
    grad: (x, y) => [0.2 * x, 4 * y],
    domain: [-3, 3, -2, 2],
    start: [-2.7, 1.5],
    lr: 0.4,
    adamLr: 0.1,
    minima: [[0, 0]],
  },
  {
    id: 'rosenbrock',
    name: 'Rosenbrock',
    formula: 'f(x, y) = (1 − x)² + 100(y − x²)²',
    note: 'A curved, narrow valley with its minimum at (1, 1). Finding the valley is easy; following it to the minimum is slow.',
    f: (x, y) => (1 - x) ** 2 + 100 * (y - x * x) ** 2,
    grad: (x, y) => [-2 * (1 - x) - 400 * x * (y - x * x), 200 * (y - x * x)],
    domain: [-2, 2, -0.8, 1.8667],
    start: [-1.2, 1],
    lr: 0.001,
    adamLr: 0.05,
    minima: [[1, 1]],
  },
  {
    id: 'wells',
    name: 'Multiple minima',
    formula: 'f = 0.05(x² + y²) − Σ aᵢ·exp(−|p − cᵢ|² / sᵢ)',
    note: 'Three wells of different depths. From the default start, plain GD and Adam settle in the lower-left well while momentum overshoots into the deepest one. Try other starting points.',
    f: wellsF,
    grad: wellsGrad,
    domain: [-3.6, 3.6, -2.4, 2.4],
    start: [0.5, -2],
    lr: 0.1,
    adamLr: 0.05,
    minima: WELL_MINIMA,
  },
];

/** Global minimum value f*, used to plot the loss as f − f*. */
const fStar = (s: Surface) => Math.min(...s.minima.map(([x, y]) => s.f(x, y)));

/* ------------------------------------------------------------------ */
/* Optimizers                                                          */
/* ------------------------------------------------------------------ */

type OptId = 'gd' | 'momentum' | 'adam';
type Status = 'running' | 'converged' | 'diverged' | 'stopped';

const OPTIMIZERS: { id: OptId; name: string; color: string }[] = [
  { id: 'gd', name: 'Gradient descent', color: '#dc2626' },
  { id: 'momentum', name: 'Momentum (β = 0.9)', color: '#2563eb' },
  { id: 'adam', name: 'Adam', color: '#059669' },
];

const BETA = 0.9; // momentum
const BETA1 = 0.9; // Adam first moment
const BETA2 = 0.999; // Adam second moment
const EPS = 1e-8;
const MAX_STEPS = 2000;

interface Run {
  p: Vec;
  v: Vec; // momentum velocity, or Adam first moment
  s: Vec; // Adam second moment
  t: number;
  path: Vec[];
  losses: number[];
  status: Status;
}

function newRun(surface: Surface, start: Vec): Run {
  return { p: start, v: [0, 0], s: [0, 0], t: 0, path: [start], losses: [surface.f(...start)], status: 'running' };
}

function step(run: Run, opt: OptId, surface: Surface, lr: number, adamLr: number) {
  if (run.status !== 'running') return;
  const g = surface.grad(...run.p);
  const [x, y] = run.p;
  let next: Vec;
  run.t += 1;

  if (opt === 'gd') {
    next = [x - lr * g[0], y - lr * g[1]];
  } else if (opt === 'momentum') {
    // Heavy-ball momentum: v ← βv − ηg, p ← p + v
    run.v = [BETA * run.v[0] - lr * g[0], BETA * run.v[1] - lr * g[1]];
    next = [x + run.v[0], y + run.v[1]];
  } else {
    run.v = [BETA1 * run.v[0] + (1 - BETA1) * g[0], BETA1 * run.v[1] + (1 - BETA1) * g[1]];
    run.s = [BETA2 * run.s[0] + (1 - BETA2) * g[0] ** 2, BETA2 * run.s[1] + (1 - BETA2) * g[1] ** 2];
    const c1 = 1 - BETA1 ** run.t;
    const c2 = 1 - BETA2 ** run.t;
    next = [
      x - (adamLr * (run.v[0] / c1)) / (Math.sqrt(run.s[0] / c2) + EPS),
      y - (adamLr * (run.v[1] / c1)) / (Math.sqrt(run.s[1] / c2) + EPS),
    ];
  }

  const loss = surface.f(...next);
  run.p = next;
  run.path.push(next);
  run.losses.push(loss);

  if (!Number.isFinite(loss) || Math.abs(next[0]) > 1e3 || Math.abs(next[1]) > 1e3) run.status = 'diverged';
  else if (Math.hypot(...surface.grad(...next)) < 1e-6 && Math.hypot(next[0] - x, next[1] - y) < 1e-7) run.status = 'converged';
  else if (run.t >= MAX_STEPS) run.status = 'stopped';
}

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

const CW = 720;
const CH = 480;
const BANDS = 18;

const toCanvas = (s: Surface, [x, y]: Vec): Vec => {
  const [x0, x1, y0, y1] = s.domain;
  return [((x - x0) / (x1 - x0)) * CW, ((y1 - y) / (y1 - y0)) * CH];
};
const fromCanvas = (s: Surface, px: number, py: number): Vec => {
  const [x0, x1, y0, y1] = s.domain;
  return [x0 + (px / CW) * (x1 - x0), y1 - (py / CH) * (y1 - y0)];
};

/** Light-to-dark colour stops for the filled contours (low loss is dark). */
const STOPS = [
  [30, 41, 99],
  [49, 104, 142],
  [53, 183, 121],
  [180, 222, 44],
  [253, 231, 160],
  [255, 250, 235],
];
function colorAt(t: number) {
  const u = Math.max(0, Math.min(1, t)) * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(u));
  const k = u - i;
  return STOPS[i].map((c, j) => c + (STOPS[i + 1][j] - c) * k);
}

/** Banded contour image of the surface. Bands are equal steps in log(1 + f − f*) so detail near minima stays visible. */
function renderBackground(s: Surface): HTMLCanvasElement {
  const off = document.createElement('canvas');
  off.width = CW;
  off.height = CH;
  const ctx = off.getContext('2d')!;
  const img = ctx.createImageData(CW, CH);
  const fmin = fStar(s);
  const vals = new Float64Array(CW * CH);
  let vmax = 0;
  for (let py = 0; py < CH; py++) {
    for (let px = 0; px < CW; px++) {
      const [x, y] = fromCanvas(s, px + 0.5, py + 0.5);
      const v = Math.log1p(Math.max(0, s.f(x, y) - fmin));
      vals[py * CW + px] = v;
      if (v > vmax) vmax = v;
    }
  }
  const band = (i: number) => Math.floor((vals[i] / vmax) * BANDS);
  for (let py = 0; py < CH; py++) {
    for (let px = 0; px < CW; px++) {
      const i = py * CW + px;
      const b = band(i);
      const edge = (px > 0 && band(i - 1) !== b) || (py > 0 && band(i - CW) !== b);
      const [r, g, bl] = colorAt((b + 0.5) / BANDS);
      const dim = edge ? 0.78 : 1;
      img.data[i * 4] = r * dim;
      img.data[i * 4 + 1] = g * dim;
      img.data[i * 4 + 2] = bl * dim;
      img.data[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return off;
}

const clampPx = (v: number) => Math.max(-5000, Math.min(5000, v));

function drawScene(ctx: CanvasRenderingContext2D, bg: HTMLCanvasElement, s: Surface, runs: Record<OptId, Run>, visible: Record<OptId, boolean>) {
  ctx.drawImage(bg, 0, 0);

  for (const [mx, my] of s.minima.map((m) => toCanvas(s, m))) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(mx - 9, my - 9);
    ctx.lineTo(mx + 9, my + 9);
    ctx.moveTo(mx + 9, my - 9);
    ctx.lineTo(mx - 9, my + 9);
    ctx.stroke();
  }

  for (const opt of OPTIMIZERS) {
    if (!visible[opt.id]) continue;
    const run = runs[opt.id];
    ctx.strokeStyle = opt.color;
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    run.path.forEach((p, i) => {
      const [px, py] = toCanvas(s, p);
      if (i === 0) ctx.moveTo(clampPx(px), clampPx(py));
      else ctx.lineTo(clampPx(px), clampPx(py));
    });
    ctx.stroke();

    const [hx, hy] = toCanvas(s, run.p);
    ctx.beginPath();
    ctx.arc(clampPx(hx), clampPx(hy), 8, 0, 2 * Math.PI);
    ctx.fillStyle = opt.color;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }

  const [sx, sy] = toCanvas(s, runs.gd.path[0]);
  ctx.beginPath();
  ctx.arc(sx, sy, 7, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#111827';
  ctx.stroke();
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

type Runs = Record<OptId, Run>;
const newRuns = (s: Surface, start: Vec): Runs => ({ gd: newRun(s, start), momentum: newRun(s, start), adam: newRun(s, start) });

interface Summary {
  p: Vec;
  t: number;
  loss: number;
  status: Status;
  losses: number[];
}
const summarize = (runs: Runs): Record<OptId, Summary> =>
  Object.fromEntries(
    OPTIMIZERS.map(({ id }) => {
      const r = runs[id];
      return [id, { p: r.p, t: r.t, loss: r.losses[r.losses.length - 1], status: r.status, losses: [...r.losses] }];
    }),
  ) as Record<OptId, Summary>;

const lrFromSlider = (v: number) => 10 ** v;
const fmtLr = (v: number) => (v >= 0.01 ? v.toPrecision(2) : v.toExponential(1));

export default function GradientDescentVisualizer() {
  const [surfaceId, setSurfaceId] = useState<SurfaceId>('valley');
  const surface = SURFACES.find((s) => s.id === surfaceId)!;
  const [logLr, setLogLr] = useState(Math.log10(surface.lr));
  const [logAdamLr, setLogAdamLr] = useState(Math.log10(surface.adamLr));
  const [stepsPerFrame, setStepsPerFrame] = useState(1);
  const [visible, setVisible] = useState<Record<OptId, boolean>>({ gd: true, momentum: true, adam: true });
  const [running, setRunning] = useState(false);

  const runsRef = useRef<Runs | null>(null);
  const [summary, setSummary] = useState(() => summarize(newRuns(SURFACES[1], SURFACES[1].start)));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<{ id: SurfaceId; canvas: HTMLCanvasElement } | null>(null);

  const lr = lrFromSlider(logLr);
  const adamLr = lrFromSlider(logAdamLr);

  const getRuns = () => {
    if (!runsRef.current) runsRef.current = newRuns(surface, surface.start);
    return runsRef.current;
  };

  const restart = (s: Surface, start: Vec, autoRun: boolean) => {
    runsRef.current = newRuns(s, start);
    setSummary(summarize(runsRef.current));
    setRunning(autoRun);
  };

  const advance = (n: number) => {
    const runs = getRuns();
    for (let i = 0; i < n; i++) for (const { id } of OPTIMIZERS) step(runs[id], id, surface, lr, adamLr);
    setSummary(summarize(runs));
    return OPTIMIZERS.some(({ id }) => runs[id].status === 'running');
  };

  // Animation loop.
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const tick = () => {
      if (advance(stepsPerFrame)) frame = requestAnimationFrame(tick);
      else setRunning(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // advance reads the current surface and learning rates captured by this effect's dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, stepsPerFrame, lr, adamLr, surfaceId]);

  // Redraw after every change.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    if (!bgRef.current || bgRef.current.id !== surface.id) bgRef.current = { id: surface.id, canvas: renderBackground(surface) };
    drawScene(ctx, bgRef.current.canvas, surface, getRuns(), visible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary, visible, surface]);

  const chooseSurface = (s: Surface) => {
    setSurfaceId(s.id);
    setLogLr(Math.log10(s.lr));
    setLogAdamLr(Math.log10(s.adamLr));
    restart(s, s.start, false);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = toDrawingPoint(e, e.currentTarget);
    restart(surface, fromCanvas(surface, x, y), true);
  };

  const fStarValue = fStar(surface);

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
        <p className="mb-2 text-sm font-medium text-ink">Loss surface</p>
        <div className="flex flex-wrap gap-2">
          {SURFACES.map((s) => (
            <Button key={s.id} size="sm" variant={s.id === surfaceId ? 'primary' : 'outline'} onClick={() => chooseSurface(s)}>
              {s.name}
            </Button>
          ))}
        </div>
        <p className="mt-3 font-mono text-sm text-ink">{surface.formula}</p>
        <p className="mt-1 text-sm text-ink-muted">{surface.note}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="rounded-card border border-line bg-white p-3 shadow-card sm:p-6">
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            onPointerDown={onPointerDown}
            className={`${responsiveSurface} touch-none cursor-crosshair rounded border border-line`}
            aria-label="Contour plot of the loss surface with optimizer trails. Click to choose a starting point."
          />
          <p className="mt-2 text-sm text-ink-muted">
            Click or tap anywhere on the plot to start all three optimizers from that point. Darker colours mean lower loss;
            white crosses mark the minima.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {OPTIMIZERS.map((o) => (
              <label key={o.id} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={visible[o.id]}
                  onChange={(e) => setVisible({ ...visible, [o.id]: e.target.checked })}
                />
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: o.color }} />
                {o.name}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-ink">
                Learning rate η (GD and momentum): {fmtLr(lr)}
                <input
                  type="range"
                  min={-4}
                  max={0.5}
                  step={0.01}
                  value={logLr}
                  onChange={(e) => setLogLr(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Adam step size α: {fmtLr(adamLr)}
                <input
                  type="range"
                  min={-3}
                  max={0}
                  step={0.01}
                  value={logAdamLr}
                  onChange={(e) => setLogAdamLr(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Speed: {stepsPerFrame} step{stepsPerFrame > 1 ? 's' : ''} per frame
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={stepsPerFrame}
                  onChange={(e) => setStepsPerFrame(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </label>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                leftIcon={running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                onClick={() => setRunning((r) => !r)}
                disabled={!running && OPTIMIZERS.every(({ id }) => summary[id].status !== 'running')}
              >
                {running ? 'Pause' : 'Run'}
              </Button>
              <Button variant="outline" leftIcon={<StepForward className="h-4 w-4" />} disabled={running} onClick={() => advance(1)}>
                Step
              </Button>
              <Button
                variant="ghost"
                leftIcon={<RotateCcw className="h-4 w-4" />}
                onClick={() => restart(surface, getRuns().gd.path[0], false)}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
            <div className="space-y-3">
              {OPTIMIZERS.map((o) => {
                const s = summary[o.id];
                return (
                  <div key={o.id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
                    <span className="flex items-center gap-2 font-medium text-ink">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: o.color }} />
                      {o.name}
                    </span>
                    <span className="font-mono tabular-nums text-ink-muted">
                      step {s.t}, f = {Number.isFinite(s.loss) && Math.abs(s.loss) < 1e6 ? s.loss.toFixed(4) : s.loss.toExponential(1)}
                      {s.status !== 'running' && (
                        <span className={s.status === 'diverged' ? ' font-semibold text-red-600' : ' text-ink'}> ({s.status})</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-line bg-white p-3 shadow-card sm:p-6">
        <h3 className="mb-1 text-lg font-semibold text-ink">Loss versus step</h3>
        <p className="mb-3 text-sm text-ink-muted">
          Plotted as log₁₀(f − f*), where f* = {fStarValue.toFixed(3)} is the lowest minimum. Each gridline is a factor of 10.
          A curve that flattens above 0 is stuck in a worse local minimum; one that shoots off the top has diverged.
        </p>
        <LossChart summary={summary} visible={visible} fStar={fStarValue} />
      </div>
    </div>
  );
}

function LossChart({
  summary,
  visible,
  fStar,
}: {
  summary: Record<OptId, Summary>;
  visible: Record<OptId, boolean>;
  fStar: number;
}) {
  const w = 800;
  const h = 300;
  const pad = { l: 60, r: 16, t: 14, b: 40 };
  const Y_LO = -8;
  const Y_HI = 4;
  const steps = Math.max(50, ...OPTIMIZERS.map(({ id }) => summary[id].losses.length - 1));

  const toY = (v: number) => {
    const clamped = Math.max(Y_LO, Math.min(Y_HI, v));
    return pad.t + ((Y_HI - clamped) / (Y_HI - Y_LO)) * (h - pad.t - pad.b);
  };
  const toX = (i: number) => pad.l + (i / steps) * (w - pad.l - pad.r);
  const ticks = [-8, -6, -4, -2, 0, 2, 4];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={responsiveSurface} role="img" aria-label="Loss versus step for each optimizer">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={w - pad.r} y1={toY(t)} y2={toY(t)} stroke="#e5e7eb" />
          <text x={pad.l - 8} y={toY(t) + 7} fontSize={20} textAnchor="end" fill="#6b7280">
            {t}
          </text>
        </g>
      ))}
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={h - pad.b} stroke="#9ca3af" />
      <text x={w - pad.r} y={h - 10} fontSize={20} textAnchor="end" fill="#6b7280">
        {steps} steps
      </text>
      <text x={pad.l} y={h - 10} fontSize={20} fill="#6b7280">
        0
      </text>
      {OPTIMIZERS.filter((o) => visible[o.id]).map((o) => {
        const losses = summary[o.id].losses;
        // log10 of the gap to the best minimum; NaN or Infinity (divergence) is pinned to the top edge.
        const pts = losses
          .map((f, i) => {
            const gap = Math.log10(Math.max(1e-12, f - fStar));
            return `${toX(i).toFixed(1)},${toY(Number.isFinite(gap) ? gap : Y_HI).toFixed(1)}`;
          })
          .join(' ');
        return <polyline key={o.id} points={pts} fill="none" stroke={o.color} strokeWidth={3} />;
      })}
    </svg>
  );
}
