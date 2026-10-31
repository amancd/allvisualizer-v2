'use client';

import { useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

/* ------------------------------------------------------------------ */
/* Activation functions and their derivatives                          */
/* ------------------------------------------------------------------ */

const LEAKY_ALPHA = 0.1;

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

/** Error function, Abramowitz and Stegun 7.1.26 (max error about 1.5e-7). */
function erf(x: number) {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  return sign * (1 - poly * Math.exp(-ax * ax));
}

/** Standard normal CDF and PDF, used by GELU. */
const normalCdf = (x: number) => 0.5 * (1 + erf(x / Math.SQRT2));
const normalPdf = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

interface Activation {
  id: string;
  name: string;
  color: string;
  formula: string;
  f: (x: number) => number;
  df: (x: number) => number;
}

const ACTIVATIONS: Activation[] = [
  {
    id: 'sigmoid',
    name: 'Sigmoid',
    color: '#2563eb',
    formula: 'σ(x) = 1 / (1 + e^(−x)),  σ′(x) = σ(x)(1 − σ(x))',
    f: sigmoid,
    df: (x) => sigmoid(x) * (1 - sigmoid(x)),
  },
  {
    id: 'tanh',
    name: 'Tanh',
    color: '#7c3aed',
    formula: 'tanh(x),  tanh′(x) = 1 − tanh²(x)',
    f: Math.tanh,
    df: (x) => 1 - Math.tanh(x) ** 2,
  },
  {
    id: 'relu',
    name: 'ReLU',
    color: '#dc2626',
    formula: 'ReLU(x) = max(0, x),  ReLU′(x) = 1 if x > 0 else 0',
    f: (x) => Math.max(0, x),
    df: (x) => (x > 0 ? 1 : 0),
  },
  {
    id: 'leaky',
    name: 'Leaky ReLU',
    color: '#ea580c',
    formula: `LeakyReLU(x) = x if x > 0 else ${LEAKY_ALPHA}x,  derivative 1 or ${LEAKY_ALPHA}`,
    f: (x) => (x > 0 ? x : LEAKY_ALPHA * x),
    df: (x) => (x > 0 ? 1 : LEAKY_ALPHA),
  },
  {
    id: 'gelu',
    name: 'GELU',
    color: '#059669',
    formula: 'GELU(x) = x·Φ(x),  GELU′(x) = Φ(x) + x·φ(x)',
    f: (x) => x * normalCdf(x),
    df: (x) => normalCdf(x) + x * normalPdf(x),
  },
  {
    id: 'softplus',
    name: 'Softplus',
    color: '#db2777',
    formula: 'softplus(x) = ln(1 + e^x),  softplus′(x) = σ(x)',
    // log1p(exp(x)) overflows for large x; softplus(x) ≈ x there.
    f: (x) => (x > 30 ? x : Math.log1p(Math.exp(x))),
    df: sigmoid,
  },
];

/* ------------------------------------------------------------------ */
/* Plot geometry                                                       */
/* ------------------------------------------------------------------ */

const W = 800;
const H = 460;
const PAD = { left: 50, right: 20, top: 20, bottom: 40 };
const X_MIN = -5;
const X_MAX = 5;
const Y_MIN = -1.5;
const Y_MAX = 3;
const SATURATION_THRESHOLD = 0.1;

const sx = (x: number) => PAD.left + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - PAD.left - PAD.right);
const sy = (y: number) => PAD.top + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * (H - PAD.top - PAD.bottom);
const toX = (px: number) => X_MIN + ((px - PAD.left) / (W - PAD.left - PAD.right)) * (X_MAX - X_MIN);

const SAMPLES = 400;
const xs = Array.from({ length: SAMPLES + 1 }, (_, i) => X_MIN + (i / SAMPLES) * (X_MAX - X_MIN));

function pathFor(fn: (x: number) => number) {
  return xs
    .map((x, i) => {
      const y = Math.min(Y_MAX + 1, Math.max(Y_MIN - 1, fn(x)));
      return `${i === 0 ? 'M' : 'L'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`;
    })
    .join(' ');
}

/** x-intervals where |f'(x)| is below the threshold: the saturated regions. */
function saturatedIntervals(act: Activation): [number, number][] {
  const out: [number, number][] = [];
  let start: number | null = null;
  for (const x of xs) {
    const flat = Math.abs(act.df(x)) < SATURATION_THRESHOLD;
    if (flat && start === null) start = x;
    if (!flat && start !== null) {
      out.push([start, x]);
      start = null;
    }
  }
  if (start !== null) out.push([start, X_MAX]);
  return out;
}

const fmt = (v: number, digits = 3) => (Math.abs(v) < 1e-4 && v !== 0 ? v.toExponential(1) : v.toFixed(digits));

/* ------------------------------------------------------------------ */
/* Softmax                                                             */
/* ------------------------------------------------------------------ */

/** Numerically stable softmax with temperature: subtract the max logit before exponentiating. */
function softmax(logits: number[], temperature: number) {
  const scaled = logits.map((z) => z / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((z) => Math.exp(z - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const DEFAULT_LOGITS = [2, 1, 0.1];
const CLASS_COLORS = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-orange-500', 'bg-pink-500'];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ActivationFunctionsVisualizer() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    sigmoid: true,
    tanh: true,
    relu: true,
    leaky: false,
    gelu: false,
    softplus: false,
  });
  const [focusId, setFocusId] = useState('sigmoid');
  const [showDerivatives, setShowDerivatives] = useState(true);
  const [markerX, setMarkerX] = useState(2.5);
  const [dragging, setDragging] = useState(false);
  const [depth, setDepth] = useState(10);

  const [logits, setLogits] = useState<number[]>(DEFAULT_LOGITS);
  const [temperature, setTemperature] = useState(1);

  const visible = ACTIVATIONS.filter((a) => enabled[a.id]);
  const focus = ACTIVATIONS.find((a) => a.id === focusId) ?? ACTIVATIONS[0];
  const saturated = saturatedIntervals(focus);
  const probs = softmax(logits, temperature);

  const moveMarker = (e: React.PointerEvent<SVGSVGElement>) => {
    const { x } = toDrawingPoint(e, e.currentTarget);
    setMarkerX(Math.min(X_MAX, Math.max(X_MIN, toX(x))));
  };

  const toggle = (id: string) => {
    const next = { ...enabled, [id]: !enabled[id] };
    setEnabled(next);
    // Keep the highlighted function among the visible ones.
    if (id === focusId && !next[id]) {
      const other = ACTIVATIONS.find((a) => next[a.id]);
      if (other) setFocusId(other.id);
    }
    if (next[id] && !enabled[id]) setFocusId(id);
  };

  const xTicks = [-4, -2, 0, 2, 4];
  const yTicks = [-1, 0, 1, 2, 3];

  return (
    <div className="space-y-6">
      {/* Function plot */}
      <div className="rounded-card border border-line bg-white p-3 shadow-card sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {ACTIVATIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => toggle(a.id)}
              aria-pressed={enabled[a.id]}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                enabled[a.id] ? 'border-line-strong bg-white text-ink shadow-card' : 'border-line bg-subtle text-ink-faint'
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: enabled[a.id] ? a.color : '#d1d5db' }} />
              {a.name}
            </button>
          ))}
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={`${responsiveSurface} touch-none cursor-crosshair select-none rounded border border-line`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
            moveMarker(e);
          }}
          onPointerMove={(e) => {
            if (dragging || e.pointerType === 'mouse') moveMarker(e);
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          role="img"
          aria-label="Plot of the selected activation functions and their derivatives"
        >
          <rect x={0} y={0} width={W} height={H} fill="#ffffff" />

          {/* Saturation regions of the highlighted function */}
          {enabled[focus.id] &&
            saturated.map(([a, b]) => (
              <rect
                key={`${a}-${b}`}
                x={sx(a)}
                y={PAD.top}
                width={sx(b) - sx(a)}
                height={H - PAD.top - PAD.bottom}
                fill="#fef3c7"
                opacity={0.8}
              />
            ))}

          {/* Grid and axes */}
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line x1={sx(t)} x2={sx(t)} y1={PAD.top} y2={H - PAD.bottom} stroke="#e5e7eb" />
              <text x={sx(t)} y={H - PAD.bottom + 28} fontSize={20} textAnchor="middle" fill="#6b7280">
                {t}
              </text>
            </g>
          ))}
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={PAD.left} x2={W - PAD.right} y1={sy(t)} y2={sy(t)} stroke="#e5e7eb" />
              <text x={PAD.left - 10} y={sy(t) + 7} fontSize={20} textAnchor="end" fill="#6b7280">
                {t}
              </text>
            </g>
          ))}
          <line x1={sx(0)} x2={sx(0)} y1={PAD.top} y2={H - PAD.bottom} stroke="#9ca3af" strokeWidth={1.5} />
          <line x1={PAD.left} x2={W - PAD.right} y1={sy(0)} y2={sy(0)} stroke="#9ca3af" strokeWidth={1.5} />

          <defs>
            <clipPath id="act-plot-area">
              <rect x={PAD.left} y={PAD.top} width={W - PAD.left - PAD.right} height={H - PAD.top - PAD.bottom} />
            </clipPath>
          </defs>

          <g clipPath="url(#act-plot-area)">
            {visible.map((a) => (
              <g key={a.id} opacity={a.id === focus.id ? 1 : 0.55}>
                <path d={pathFor(a.f)} fill="none" stroke={a.color} strokeWidth={a.id === focus.id ? 4 : 2.5} />
                {showDerivatives && (
                  <path d={pathFor(a.df)} fill="none" stroke={a.color} strokeWidth={2.5} strokeDasharray="8 6" />
                )}
              </g>
            ))}
          </g>

          {/* Draggable x marker */}
          <line x1={sx(markerX)} x2={sx(markerX)} y1={PAD.top} y2={H - PAD.bottom} stroke="#111827" strokeWidth={2} />
          {visible.map((a) => {
            const y = a.f(markerX);
            const dy = a.df(markerX);
            return (
              <g key={a.id}>
                {y >= Y_MIN && y <= Y_MAX && (
                  <circle cx={sx(markerX)} cy={sy(y)} r={7} fill={a.color} stroke="#fff" strokeWidth={2} />
                )}
                {showDerivatives && dy >= Y_MIN && dy <= Y_MAX && (
                  <circle cx={sx(markerX)} cy={sy(dy)} r={6} fill="#fff" stroke={a.color} strokeWidth={3} />
                )}
              </g>
            );
          })}
          <circle cx={sx(markerX)} cy={H - PAD.bottom} r={9} fill="#111827" />
        </svg>

        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
          <span>
            <span className="font-semibold text-ink">Solid</span> = f(x), <span className="font-semibold text-ink">dashed</span> = f′(x)
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-5 rounded-sm bg-amber-100 ring-1 ring-amber-200" />
            Saturated: |f′(x)| &lt; {SATURATION_THRESHOLD} for {focus.name}
          </span>
          <span>Drag or hover over the plot to move the x marker.</span>
        </div>
      </div>

      {/* Controls and readout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-ink">Controls</h3>
          <div className="space-y-5">
            <label className="block text-sm font-medium text-ink">
              Marker position x = {markerX.toFixed(2)}
              <input
                type="range"
                min={X_MIN}
                max={X_MAX}
                step={0.01}
                value={markerX}
                onChange={(e) => setMarkerX(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Highlight function (shades its saturation regions)
              <select
                value={focus.id}
                onChange={(e) => setFocusId(e.target.value)}
                className="mt-2 h-10 w-full rounded-control border border-line-strong bg-white px-3 text-sm text-ink"
              >
                {visible.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-ink">
              Network depth for the gradient estimate: {depth} layers
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" checked={showDerivatives} onChange={(e) => setShowDerivatives(e.target.checked)} />
              Show derivatives
            </label>
            <p className="rounded-lg bg-subtle p-3 font-mono text-xs leading-relaxed text-ink-muted ring-1 ring-inset ring-line">
              {focus.formula}
            </p>
          </div>
        </div>

        <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
          <h3 className="mb-1 text-lg font-semibold text-ink">Values at x = {markerX.toFixed(2)}</h3>
          <p className="mb-4 text-sm text-ink-muted">
            The last column multiplies f′(x) by itself {depth} times: roughly how much of the gradient survives {depth}{' '}
            layers that all sit at this pre-activation (ignoring the weights).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line text-left text-ink">
                <tr>
                  <th className="py-2 pr-3 font-semibold">Function</th>
                  <th className="py-2 pr-3 text-right font-semibold">f(x)</th>
                  <th className="py-2 pr-3 text-right font-semibold">f′(x)</th>
                  <th className="py-2 text-right font-semibold">
                    f′(x)<sup>{depth}</sup>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((a) => {
                  const d = a.df(markerX);
                  const chain = d ** depth;
                  const vanishing = Math.abs(chain) < 1e-3;
                  return (
                    <tr key={a.id}>
                      <td className="py-2 pr-3">
                        <span className="flex items-center gap-2 text-ink">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: a.color }} />
                          {a.name}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-right font-mono tabular-nums">{fmt(a.f(markerX))}</td>
                      <td className="py-2 pr-3 text-right font-mono tabular-nums">{fmt(d)}</td>
                      <td
                        className={`py-2 text-right font-mono tabular-nums ${vanishing ? 'font-semibold text-red-600' : 'text-ink'}`}
                      >
                        {chain === 0 ? '0' : chain.toExponential(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {visible.length === 0 && <p className="mt-3 text-sm text-ink-muted">Turn on at least one function above.</p>}
          <p className="mt-4 text-xs text-ink-muted">
            Red values have shrunk below 0.001: the gradient has effectively vanished. Sigmoid&apos;s derivative never
            exceeds 0.25, so even at x = 0 it shrinks by 4× per layer.
          </p>
        </div>
      </div>

      {/* Softmax */}
      <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-ink">Softmax: logits to probabilities</h3>
            <p className="mt-1 text-sm text-ink-muted">
              p<sub>i</sub> = e<sup>z<sub>i</sub>/T</sup> / Σ<sub>j</sub> e<sup>z<sub>j</sub>/T</sup>. Edit the logits and the
              temperature T.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Minus className="h-4 w-4" />}
              disabled={logits.length <= 3}
              onClick={() => setLogits(logits.slice(0, -1))}
            >
              Class
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Plus className="h-4 w-4" />}
              disabled={logits.length >= 5}
              onClick={() => setLogits([...logits, 0])}
            >
              Class
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<RotateCcw className="h-4 w-4" />}
              onClick={() => {
                setLogits(DEFAULT_LOGITS);
                setTemperature(1);
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {logits.map((z, i) => (
            <div key={i} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:gap-6">
              <label className="block text-sm font-medium text-ink">
                Logit z<sub>{i + 1}</sub> = {z.toFixed(1)}
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={z}
                  onChange={(e) => setLogits(logits.map((v, j) => (j === i ? Number(e.target.value) : v)))}
                  className="mt-1 w-full"
                />
              </label>
              <div className="flex items-center gap-3">
                <div className="h-6 flex-1 overflow-hidden rounded bg-subtle ring-1 ring-inset ring-line">
                  <div className={`h-full ${CLASS_COLORS[i]} transition-[width] duration-150`} style={{ width: `${probs[i] * 100}%` }} />
                </div>
                <span className="w-16 text-right font-mono text-sm tabular-nums text-ink">{(probs[i] * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>

        <label className="mt-6 block text-sm font-medium text-ink">
          Temperature T = {temperature.toFixed(2)}
          <input
            type="range"
            min={0.1}
            max={5}
            step={0.05}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="mt-2 w-full"
          />
        </label>
        <p className="mt-2 text-sm text-ink-muted">
          Low T sharpens the distribution towards the largest logit (approaching argmax); high T flattens it towards uniform
          (1/{logits.length} = {(100 / logits.length).toFixed(1)}% each). Adding the same constant to every logit changes
          nothing.
        </p>
      </div>
    </div>
  );
}
