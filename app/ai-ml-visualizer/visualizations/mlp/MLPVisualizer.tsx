'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Shuffle, StepForward } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';

/* ------------------------------------------------------------------ */
/* Seeded random numbers (deterministic first render)                  */
/* ------------------------------------------------------------------ */

/** mulberry32: a tiny seeded PRNG returning numbers in [0, 1). */
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal sample via Box-Muller. */
function gaussian(rng: () => number) {
  const u = 1 - rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/* ------------------------------------------------------------------ */
/* Datasets: points in roughly [-1, 1]², labels 0 or 1                  */
/* ------------------------------------------------------------------ */

type DatasetId = 'xor' | 'circles' | 'spirals' | 'blobs';
interface Point {
  x: number;
  y: number;
  label: 0 | 1;
}

const DATASETS: { id: DatasetId; name: string }[] = [
  { id: 'xor', name: 'XOR' },
  { id: 'circles', name: 'Circles' },
  { id: 'spirals', name: 'Spirals' },
  { id: 'blobs', name: 'Two blobs' },
];

const N_POINTS = 200;

function makeDataset(id: DatasetId): Point[] {
  const rng = makeRng(42);
  const pts: Point[] = [];
  for (let i = 0; i < N_POINTS; i++) {
    const cls: 0 | 1 = i % 2 === 0 ? 0 : 1;
    if (id === 'xor') {
      // Keep a small gap around the axes so the quadrants are unambiguous.
      const px = (0.1 + 0.85 * rng()) * (rng() < 0.5 ? -1 : 1);
      const py = (0.1 + 0.85 * rng()) * (rng() < 0.5 ? -1 : 1);
      pts.push({ x: px, y: py, label: px * py > 0 ? 1 : 0 });
    } else if (id === 'circles') {
      const r = cls === 1 ? 0.45 * Math.sqrt(rng()) : 0.7 + 0.25 * rng();
      const t = 2 * Math.PI * rng();
      pts.push({ x: r * Math.cos(t), y: r * Math.sin(t), label: cls });
    } else if (id === 'spirals') {
      const k = Math.floor(i / 2) / (N_POINTS / 2); // 0..1 along the arm
      const r = 0.08 + 0.85 * k;
      const t = 3.5 * Math.PI * k + cls * Math.PI;
      pts.push({ x: r * Math.cos(t) + 0.03 * gaussian(rng), y: r * Math.sin(t) + 0.03 * gaussian(rng), label: cls });
    } else {
      const c = cls === 1 ? 0.45 : -0.45;
      pts.push({ x: c + 0.22 * gaussian(rng), y: c + 0.22 * gaussian(rng), label: cls });
    }
  }
  return pts;
}

/* ------------------------------------------------------------------ */
/* The network                                                         */
/* ------------------------------------------------------------------ */

type ActivationId = 'tanh' | 'relu' | 'sigmoid';

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

const ACT: Record<ActivationId, { f: (z: number) => number; df: (z: number, a: number) => number; name: string }> = {
  tanh: { name: 'Tanh', f: Math.tanh, df: (_z, a) => 1 - a * a },
  relu: { name: 'ReLU', f: (z) => (z > 0 ? z : 0), df: (z) => (z > 0 ? 1 : 0) },
  sigmoid: { name: 'Sigmoid', f: sigmoid, df: (_z, a) => a * (1 - a) },
};

/**
 * sizes = [2, ...hidden, 1]. W[l][j][i] is the weight from neuron i of layer l to neuron j of layer l+1.
 * Hidden layers use the chosen activation; the output uses sigmoid with binary cross-entropy loss.
 */
interface Model {
  sizes: number[];
  activation: ActivationId;
  W: number[][][];
  b: number[][];
}

function createModel(hidden: number[], activation: ActivationId, seed: number): Model {
  const rng = makeRng(seed);
  const sizes = [2, ...hidden, 1];
  const W: number[][][] = [];
  const b: number[][] = [];
  for (let l = 0; l < sizes.length - 1; l++) {
    const fanIn = sizes[l];
    const fanOut = sizes[l + 1];
    // He initialisation for ReLU, Xavier/Glorot for tanh and sigmoid.
    const std = activation === 'relu' ? Math.sqrt(2 / fanIn) : Math.sqrt(2 / (fanIn + fanOut));
    W.push(Array.from({ length: fanOut }, () => Array.from({ length: fanIn }, () => std * gaussian(rng))));
    b.push(Array.from({ length: fanOut }, () => (activation === 'relu' ? 0.1 : 0)));
  }
  return { sizes, activation, W, b };
}

/** Forward pass. Returns pre-activations z and activations a for every layer (a[0] is the input). */
function forward(m: Model, x: number, y: number) {
  const a: number[][] = [[x, y]];
  const z: number[][] = [[x, y]];
  const last = m.W.length - 1;
  for (let l = 0; l <= last; l++) {
    const zl = m.W[l].map((row, j) => row.reduce((s, w, i) => s + w * a[l][i], m.b[l][j]));
    z.push(zl);
    a.push(zl.map((v) => (l === last ? sigmoid(v) : ACT[m.activation].f(v))));
  }
  return { z, a };
}

const predict = (m: Model, x: number, y: number) => {
  const { a } = forward(m, x, y);
  return a[a.length - 1][0];
};

/** One minibatch step of plain SGD with backpropagation. Mutates the model. */
function trainBatch(m: Model, batch: Point[], lr: number) {
  const gW = m.W.map((layer) => layer.map((row) => row.map(() => 0)));
  const gb = m.b.map((layer) => layer.map(() => 0));
  const last = m.W.length - 1;

  for (const p of batch) {
    const { z, a } = forward(m, p.x, p.y);
    // Sigmoid + binary cross-entropy: dL/dz_out = p - y.
    let delta = [a[a.length - 1][0] - p.label];
    for (let l = last; l >= 0; l--) {
      for (let j = 0; j < delta.length; j++) {
        gb[l][j] += delta[j];
        for (let i = 0; i < a[l].length; i++) gW[l][j][i] += delta[j] * a[l][i];
      }
      if (l > 0) {
        // Propagate to the previous layer: delta_prev = (Wᵀ delta) ⊙ f'(z_prev).
        const prev: number[] = [];
        for (let i = 0; i < a[l].length; i++) {
          let s = 0;
          for (let j = 0; j < delta.length; j++) s += m.W[l][j][i] * delta[j];
          prev.push(s * ACT[m.activation].df(z[l][i], a[l][i]));
        }
        delta = prev;
      }
    }
  }

  const scale = lr / batch.length;
  for (let l = 0; l <= last; l++) {
    for (let j = 0; j < m.W[l].length; j++) {
      m.b[l][j] -= scale * gb[l][j];
      for (let i = 0; i < m.W[l][j].length; i++) m.W[l][j][i] -= scale * gW[l][j][i];
    }
  }
}

function evaluate(m: Model, data: Point[]) {
  let loss = 0;
  let correct = 0;
  for (const p of data) {
    const q = Math.min(1 - 1e-7, Math.max(1e-7, predict(m, p.x, p.y)));
    loss += -(p.label * Math.log(q) + (1 - p.label) * Math.log(1 - q));
    if ((q >= 0.5 ? 1 : 0) === p.label) correct++;
  }
  return { loss: loss / data.length, accuracy: correct / data.length };
}

/** One epoch: shuffle, then step through the data in minibatches. */
function trainEpoch(m: Model, data: Point[], lr: number, batchSize: number) {
  const order = [...data];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (let s = 0; s < order.length; s += batchSize) trainBatch(m, order.slice(s, s + batchSize), lr);
}

const cloneModel = (m: Model): Model => ({
  sizes: [...m.sizes],
  activation: m.activation,
  W: m.W.map((layer) => layer.map((row) => [...row])),
  b: m.b.map((layer) => [...layer]),
});

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

const PLOT = 400;
const DOMAIN = 1.2;
const toPx = (v: number) => ((v + DOMAIN) / (2 * DOMAIN)) * PLOT;
const GRID = 50;

// Class 0 = orange, class 1 = blue, uncertain = white.
const C0 = [249, 115, 22];
const C1 = [37, 99, 235];
function mix(p: number) {
  const t = Math.abs(p - 0.5) * 2; // 0 at the boundary, 1 when confident
  const c = p > 0.5 ? C1 : C0;
  const k = 0.55 * t;
  return `rgb(${Math.round(255 + (c[0] - 255) * k)},${Math.round(255 + (c[1] - 255) * k)},${Math.round(255 + (c[2] - 255) * k)})`;
}

function drawBoundary(ctx: CanvasRenderingContext2D, m: Model, data: Point[]) {
  const cell = PLOT / GRID;
  for (let gy = 0; gy < GRID; gy++) {
    for (let gx = 0; gx < GRID; gx++) {
      const x = -DOMAIN + ((gx + 0.5) / GRID) * 2 * DOMAIN;
      const y = DOMAIN - ((gy + 0.5) / GRID) * 2 * DOMAIN;
      ctx.fillStyle = mix(predict(m, x, y));
      ctx.fillRect(gx * cell, gy * cell, cell + 0.5, cell + 0.5);
    }
  }
  for (const p of data) {
    ctx.beginPath();
    ctx.arc(toPx(p.x), PLOT - toPx(p.y), 4.5, 0, 2 * Math.PI);
    ctx.fillStyle = p.label === 1 ? '#1d4ed8' : '#ea580c';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

interface View {
  model: Model;
  epoch: number;
  losses: number[];
  accuracy: number;
}

const LR_OPTIONS = [0.003, 0.01, 0.03, 0.1, 0.3, 1, 3];
const BATCH_OPTIONS = [1, 10, 32, N_POINTS];
const MAX_HISTORY = 400;

function initialView(model: Model, data: Point[]): View {
  const { loss, accuracy } = evaluate(model, data);
  return { model: cloneModel(model), epoch: 0, losses: [loss], accuracy };
}

export default function MLPVisualizer() {
  const [datasetId, setDatasetId] = useState<DatasetId>('xor');
  const [hidden, setHidden] = useState<number[]>([4, 4]);
  const [activation, setActivation] = useState<ActivationId>('tanh');
  const [lr, setLr] = useState(0.3);
  const [batchSize, setBatchSize] = useState(10);
  const [seed, setSeed] = useState(1);
  const [running, setRunning] = useState(false);

  const [data, setData] = useState<Point[]>(() => makeDataset('xor'));
  const modelRef = useRef<Model | null>(null);
  const [view, setView] = useState<View>(() => {
    const m = createModel([4, 4], 'tanh', 1);
    return initialView(m, makeDataset('xor'));
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /** The live model the training loop mutates. Created lazily from the current view. */
  const liveModel = () => {
    if (!modelRef.current) modelRef.current = cloneModel(view.model);
    return modelRef.current;
  };

  /** Rebuild the network (new architecture, activation, dataset or seed). Runs from event handlers. */
  const rebuild = (next: { hidden?: number[]; activation?: ActivationId; dataset?: DatasetId; seed?: number }) => {
    const h = next.hidden ?? hidden;
    const act = next.activation ?? activation;
    const ds = next.dataset ?? datasetId;
    const sd = next.seed ?? seed;
    const pts = ds === datasetId ? data : makeDataset(ds);
    const m = createModel(h, act, sd);
    modelRef.current = m;
    setHidden(h);
    setActivation(act);
    setDatasetId(ds);
    setSeed(sd);
    setData(pts);
    setRunning(false);
    setView(initialView(m, pts));
  };

  const runEpochs = (count: number) => {
    const m = liveModel();
    for (let i = 0; i < count; i++) trainEpoch(m, data, lr, batchSize);
    const { loss, accuracy } = evaluate(m, data);
    setView((v) => {
      let losses = [...v.losses, loss];
      // Keep the history bounded by dropping every other point when it gets long.
      if (losses.length > MAX_HISTORY) losses = losses.filter((_, i) => i % 2 === 0 || i === losses.length - 1);
      return { model: cloneModel(m), epoch: v.epoch + count, losses, accuracy };
    });
  };

  // Training loop: one epoch per animation frame while running.
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const tick = () => {
      runEpochs(1);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // runEpochs reads the latest lr, batch size and data via this effect's dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, lr, batchSize, data]);

  // Redraw the decision boundary whenever the model snapshot changes.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) drawBoundary(ctx, view.model, data);
  }, [view.model, data]);

  const finalLoss = view.losses[view.losses.length - 1];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium text-ink">Dataset</p>
              <div className="flex flex-wrap gap-2">
                {DATASETS.map((d) => (
                  <Button
                    key={d.id}
                    size="sm"
                    variant={d.id === datasetId ? 'primary' : 'outline'}
                    onClick={() => rebuild({ dataset: d.id })}
                  >
                    {d.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-ink">Hidden layers: {hidden.length}</p>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map((n) => (
                  <Button
                    key={n}
                    size="sm"
                    variant={n === hidden.length ? 'primary' : 'outline'}
                    onClick={() => rebuild({ hidden: Array.from({ length: n }, (_, i) => hidden[i] ?? 4) })}
                  >
                    {n}
                  </Button>
                ))}
              </div>
              {hidden.length === 0 && (
                <p className="mt-2 text-xs text-ink-muted">No hidden layer: this is logistic regression, a straight-line boundary.</p>
              )}
            </div>

            {hidden.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {hidden.map((n, i) => (
                  <label key={i} className="block text-sm font-medium text-ink">
                    Layer {i + 1}: {n} neurons
                    <input
                      type="range"
                      min={1}
                      max={8}
                      value={n}
                      onChange={(e) => rebuild({ hidden: hidden.map((v, j) => (j === i ? Number(e.target.value) : v)) })}
                      className="mt-1 w-full"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-ink">
              Hidden activation
              <select
                value={activation}
                onChange={(e) => rebuild({ activation: e.target.value as ActivationId })}
                className="mt-1.5 h-10 w-full rounded-control border border-line-strong bg-white px-3 text-sm text-ink"
              >
                {(Object.keys(ACT) as ActivationId[]).map((id) => (
                  <option key={id} value={id}>
                    {ACT[id].name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-ink">
              Learning rate
              <select
                value={lr}
                onChange={(e) => setLr(Number(e.target.value))}
                className="mt-1.5 h-10 w-full rounded-control border border-line-strong bg-white px-3 text-sm text-ink"
              >
                {LR_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-ink">
              Batch size
              <select
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="mt-1.5 h-10 w-full rounded-control border border-line-strong bg-white px-3 text-sm text-ink"
              >
                {BATCH_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v === 1 ? '1 (pure SGD)' : v === N_POINTS ? `${v} (full batch)` : v}
                  </option>
                ))}
              </select>
            </label>
            <div className="text-sm">
              <p className="font-medium text-ink">Weight seed: {seed}</p>
              <p className="mt-1 text-xs text-ink-muted">Same seed, same starting weights.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            leftIcon={running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            onClick={() => setRunning((r) => !r)}
          >
            {running ? 'Pause' : 'Train'}
          </Button>
          <Button variant="outline" leftIcon={<StepForward className="h-4 w-4" />} disabled={running} onClick={() => runEpochs(1)}>
            Step 1 epoch
          </Button>
          <Button variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => rebuild({})}>
            Reset weights
          </Button>
          <Button variant="ghost" leftIcon={<Shuffle className="h-4 w-4" />} onClick={() => rebuild({ seed: seed + 1 })}>
            New seed
          </Button>
        </div>
      </div>

      {/* Boundary + stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-white p-3 shadow-card sm:p-6">
          <h3 className="mb-3 text-lg font-semibold text-ink">Decision boundary</h3>
          <canvas
            ref={canvasRef}
            width={PLOT}
            height={PLOT}
            className={`${responsiveSurface} mx-auto rounded border border-line`}
            aria-label="Predicted class probability over the input plane, with the training points"
          />
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-500" /> Class 0
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-600" /> Class 1
            </span>
            <span>Background: predicted probability (white = 50%)</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Epoch" value={String(view.epoch)} />
            <Stat label="Loss (BCE)" value={finalLoss.toFixed(4)} />
            <Stat label="Accuracy" value={`${(view.accuracy * 100).toFixed(1)}%`} />
          </div>

          <div className="rounded-card border border-line bg-white p-3 shadow-card sm:p-6">
            <h3 className="mb-3 text-lg font-semibold text-ink">Training loss</h3>
            <LossChart losses={view.losses} />
          </div>
        </div>
      </div>

      <div className="rounded-card border border-line bg-white p-3 shadow-card sm:p-6">
        <h3 className="mb-1 text-lg font-semibold text-ink">Network</h3>
        <p className="mb-3 text-sm text-ink-muted">
          Blue lines are positive weights, orange are negative; thicker means larger |w|. Neuron fill shows the activation
          for the input (0.5, 0.5).
        </p>
        <NetworkDiagram model={view.model} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-white p-3 text-center shadow-card">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-1 font-mono text-base font-semibold tabular-nums text-ink sm:text-lg">{value}</p>
    </div>
  );
}

function LossChart({ losses }: { losses: number[] }) {
  const w = 600;
  const h = 260;
  const pad = { l: 60, r: 16, t: 16, b: 36 };
  const max = Math.max(...losses, 0.1);
  const pts = losses
    .map((v, i) => {
      const x = pad.l + (losses.length === 1 ? 0 : (i / (losses.length - 1)) * (w - pad.l - pad.r));
      const y = pad.t + (1 - v / max) * (h - pad.t - pad.b);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={responsiveSurface} role="img" aria-label="Loss over training">
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={h - pad.b} stroke="#9ca3af" />
      <line x1={pad.l} x2={w - pad.r} y1={h - pad.b} y2={h - pad.b} stroke="#9ca3af" />
      <text x={pad.l - 8} y={pad.t + 8} fontSize={20} textAnchor="end" fill="#6b7280">
        {max.toFixed(2)}
      </text>
      <text x={pad.l - 8} y={h - pad.b} fontSize={20} textAnchor="end" fill="#6b7280">
        0
      </text>
      <text x={(w + pad.l) / 2} y={h - 6} fontSize={20} textAnchor="middle" fill="#6b7280">
        epochs
      </text>
      <polyline points={pts} fill="none" stroke="#2563eb" strokeWidth={3} />
    </svg>
  );
}

function NetworkDiagram({ model }: { model: Model }) {
  const w = 800;
  const h = 360;
  const { sizes } = model;
  const colX = (l: number) => 80 + (l / (sizes.length - 1)) * (w - 160);
  const rowY = (n: number, i: number) => h / 2 + (i - (n - 1) / 2) * Math.min(42, (h - 40) / n);
  const { a } = forward(model, 0.5, 0.5);
  const maxW = Math.max(0.5, ...model.W.flat(2).map(Math.abs));

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className={responsiveSurface} role="img" aria-label="Network diagram">
        {model.W.map((layer, l) =>
          layer.map((row, j) =>
            row.map((wt, i) => (
              <line
                key={`${l}-${j}-${i}`}
                x1={colX(l)}
                y1={rowY(sizes[l], i)}
                x2={colX(l + 1)}
                y2={rowY(sizes[l + 1], j)}
                stroke={wt >= 0 ? '#2563eb' : '#ea580c'}
                strokeWidth={0.5 + 5 * (Math.abs(wt) / maxW)}
                opacity={0.25 + 0.6 * (Math.abs(wt) / maxW)}
              />
            )),
          ),
        )}
        {sizes.map((n, l) =>
          Array.from({ length: n }, (_, i) => {
            const act = a[l][i];
            // Map the activation to a grey level. Inputs and tanh units live in [-1, 1], the rest in [0, 1] (ReLU is clamped).
            const signed = l === 0 || (model.activation === 'tanh' && l < sizes.length - 1);
            const shade = Math.max(0, Math.min(1, signed ? (act + 1) / 2 : act));
            const g = Math.round(255 - 180 * shade);
            return (
              <circle
                key={`${l}-${i}`}
                cx={colX(l)}
                cy={rowY(n, i)}
                r={14}
                fill={`rgb(${g},${g},${g})`}
                stroke="#111827"
                strokeWidth={2}
              />
            );
          }),
        )}
        {sizes.map((n, l) => (
          <text key={`lbl-${l}`} x={colX(l)} y={h - 8} fontSize={20} textAnchor="middle" fill="#6b7280">
            {l === 0 ? 'input' : l === sizes.length - 1 ? 'output' : `h${l} (${n})`}
          </text>
        ))}
      </svg>
    </div>
  );
}
