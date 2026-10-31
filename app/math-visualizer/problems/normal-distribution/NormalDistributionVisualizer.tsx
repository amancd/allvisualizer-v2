'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

// ---------- maths ----------

/**
 * Complementary error function, Chebyshev fit from Numerical Recipes (erfcc).
 * Fractional error below 1.2e-7 everywhere, including far in the tails.
 */
function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  const r =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))),
    );
  return x >= 0 ? r : 2 - r;
}

/** Standard normal CDF: Φ(z) = P(Z ≤ z) = ½ erfc(−z/√2). */
const phi = (z: number) => 0.5 * erfc(-z / Math.SQRT2);

const pdf = (x: number, mu: number, sigma: number) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));

// ---------- drawing space ----------

const WIDTH = 800;
const HEIGHT = 400;
const PLOT = { left: 30, right: 770, top: 30, bottom: 335 };
const X_MIN = -10;
const X_MAX = 10;
const Y_MAX = 0.85; // fixed so you can see the curve flatten as σ grows (the area stays 1)
const SAMPLES = 400;

const sx = (x: number) => PLOT.left + ((x - X_MIN) / (X_MAX - X_MIN)) * (PLOT.right - PLOT.left);
const sy = (y: number) => PLOT.bottom - (y / Y_MAX) * (PLOT.bottom - PLOT.top);
const xFromPx = (px: number) => X_MIN + ((px - PLOT.left) / (PLOT.right - PLOT.left)) * (X_MAX - X_MIN);
const clampX = (x: number) => Math.max(X_MIN, Math.min(X_MAX, x));
const round1 = (x: number) => Math.round(x * 10) / 10;

/** SVG path for the area under the curve between lo and hi. */
function areaPath(lo: number, hi: number, mu: number, sigma: number) {
  const from = clampX(lo);
  const to = clampX(hi);
  if (to <= from) return '';
  const steps = Math.max(2, Math.ceil(((to - from) / (X_MAX - X_MIN)) * SAMPLES));
  let d = `M ${sx(from)} ${sy(0)}`;
  for (let i = 0; i <= steps; i++) {
    const x = from + ((to - from) * i) / steps;
    d += ` L ${sx(x)} ${sy(pdf(x, mu, sigma))}`;
  }
  return `${d} L ${sx(to)} ${sy(0)} Z`;
}

type Mode = 'between' | 'below' | 'above';

const BANDS = [
  { k: 3, label: '99.73%', fill: '#dbeafe' },
  { k: 2, label: '95.45%', fill: '#93c5fd' },
  { k: 1, label: '68.27%', fill: '#3b82f6' },
];

const fmtZ = (z: number) => (z >= 0 ? '+' : '−') + Math.abs(z).toFixed(2);
const fmtNum = (x: number) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(1);

function Slider({ label, value, min, max, step, onChange }: { label: React.ReactNode; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between text-sm font-medium text-ink">
        <span>{label}</span>
        <span className="font-mono text-ink-muted">{fmtNum(value)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-brand-600" />
    </label>
  );
}

export default function NormalDistributionVisualizer() {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(2);
  const [a, setA] = useState(-2);
  const [b, setB] = useState(2);
  const [mode, setMode] = useState<Mode>('between');
  const [showBands, setShowBands] = useState(false);
  const [dragging, setDragging] = useState<'a' | 'b' | null>(null);

  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const zLo = (lo - mu) / sigma;
  const zHi = (hi - mu) / sigma;
  const zA = (a - mu) / sigma;
  const zB = (b - mu) / sigma;

  let probability: number;
  let statement: string;
  let working: string;
  if (mode === 'between') {
    probability = phi(zHi) - phi(zLo);
    statement = `P(${fmtNum(lo)} < X < ${fmtNum(hi)})`;
    working = `Φ(${fmtZ(zHi)}) − Φ(${fmtZ(zLo)}) = ${phi(zHi).toFixed(4)} − ${phi(zLo).toFixed(4)}`;
  } else if (mode === 'below') {
    probability = phi(zB);
    statement = `P(X < ${fmtNum(b)})`;
    working = `Φ(${fmtZ(zB)})`;
  } else {
    probability = 1 - phi(zA);
    statement = `P(X > ${fmtNum(a)})`;
    working = `1 − Φ(${fmtZ(zA)}) = 1 − ${phi(zA).toFixed(4)}`;
  }

  const shadeFrom = mode === 'below' ? X_MIN : mode === 'above' ? a : lo;
  const shadeTo = mode === 'below' ? b : mode === 'above' ? X_MAX : hi;
  const activeBounds: ('a' | 'b')[] = mode === 'between' ? ['a', 'b'] : mode === 'below' ? ['b'] : ['a'];

  const curve = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const x = X_MIN + ((X_MAX - X_MIN) * i) / SAMPLES;
    return `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(1)} ${sy(pdf(x, mu, sigma)).toFixed(1)}`;
  }).join(' ');

  const pointerX = (e: React.PointerEvent<SVGSVGElement>) => round1(clampX(xFromPx(toDrawingPoint(e, e.currentTarget).x)));

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const x = pointerX(e);
    const pick = activeBounds.reduce<'a' | 'b'>((best, key) => (Math.abs((key === 'a' ? a : b) - x) < Math.abs((best === 'a' ? a : b) - x) ? key : best), activeBounds[0]);
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(pick);
    (pick === 'a' ? setA : setB)(x);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    (dragging === 'a' ? setA : setB)(pointerX(e));
  };

  const endDrag = () => setDragging(null);

  const reset = () => {
    setMu(0);
    setSigma(2);
    setA(-2);
    setB(2);
    setMode('between');
  };

  const ticks = Array.from({ length: 11 }, (_, i) => X_MIN + i * 2);
  const modes: { key: Mode; label: string }[] = [
    { key: 'between', label: 'Between a and b' },
    { key: 'below', label: 'Below b' },
    { key: 'above', label: 'Above a' },
  ];

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <Button key={m.key} size="sm" variant={mode === m.key ? 'primary' : 'outline'} onClick={() => setMode(m.key)} aria-pressed={mode === m.key}>
            {m.label}
          </Button>
        ))}
        <Button size="sm" variant={showBands ? 'secondary' : 'outline'} onClick={() => setShowBands((s) => !s)} aria-pressed={showBands}>
          68-95-99.7 bands
        </Button>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={`${responsiveSurface} touch-none rounded-xl border border-line bg-white ${dragging ? 'cursor-grabbing' : 'cursor-ew-resize'}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="img"
        aria-label={`Normal curve with mean ${mu} and standard deviation ${sigma}. ${statement} = ${probability.toFixed(4)}`}
      >
        {/* Empirical-rule bands */}
        {showBands &&
          BANDS.map((band) => <path key={band.k} d={areaPath(mu - band.k * sigma, mu + band.k * sigma, mu, sigma)} fill={band.fill} />)}

        {/* Probability region */}
        <path d={areaPath(shadeFrom, shadeTo, mu, sigma)} fill={showBands ? '#f59e0b' : '#6366f1'} fillOpacity={showBands ? 0.45 : 0.35} />

        {/* Axis */}
        <line x1={PLOT.left} y1={PLOT.bottom} x2={PLOT.right} y2={PLOT.bottom} stroke="#334155" strokeWidth={2} />
        {ticks.map((t) => (
          <g key={t}>
            <line x1={sx(t)} y1={PLOT.bottom} x2={sx(t)} y2={PLOT.bottom + 8} stroke="#334155" strokeWidth={2} />
            <text x={sx(t)} y={PLOT.bottom + 32} fontSize={20} textAnchor="middle" fill="#475569">
              {t < 0 ? `−${-t}` : t}
            </text>
          </g>
        ))}

        {/* σ markers for the bands */}
        {showBands &&
          [-3, -2, -1, 1, 2, 3].map((k) => {
            const x = mu + k * sigma;
            if (x < X_MIN || x > X_MAX) return null;
            return (
              <g key={k}>
                <line x1={sx(x)} y1={PLOT.bottom} x2={sx(x)} y2={sy(pdf(x, mu, sigma))} stroke="#1e3a8a" strokeWidth={1.5} strokeDasharray="4 4" />
                <text x={sx(x)} y={PLOT.bottom - 10} fontSize={18} textAnchor="middle" fill="#1e3a8a" fontWeight={600}>
                  {k > 0 ? `+${k}σ` : `−${-k}σ`}
                </text>
              </g>
            );
          })}

        {/* Curve */}
        <path d={curve} fill="none" stroke="#4338ca" strokeWidth={3} />

        {/* Mean */}
        <line x1={sx(mu)} y1={PLOT.bottom} x2={sx(mu)} y2={sy(pdf(mu, mu, sigma))} stroke="#4338ca" strokeWidth={1.5} strokeDasharray="6 5" />
        <text x={sx(mu)} y={Math.max(PLOT.top - 4, sy(pdf(mu, mu, sigma)) - 12)} fontSize={22} textAnchor="middle" fill="#312e81" fontWeight={700}>
          μ
        </text>

        {/* Bound handles */}
        {activeBounds.map((key) => {
          const x = key === 'a' ? a : b;
          return (
            <g key={key}>
              <line x1={sx(x)} y1={PLOT.top + 20} x2={sx(x)} y2={PLOT.bottom} stroke="#b45309" strokeWidth={2.5} />
              <circle cx={sx(x)} cy={PLOT.top + 20} r={dragging === key ? 15 : 13} fill="#f59e0b" stroke="white" strokeWidth={3} />
              <text x={sx(x)} y={PLOT.top + 27} fontSize={18} textAnchor="middle" fill="white" fontWeight={700}>
                {key}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-line bg-subtle p-4">
          <Slider label="Mean μ" value={mu} min={-5} max={5} step={0.1} onChange={setMu} />
          <Slider label="Standard deviation σ" value={sigma} min={0.5} max={4} step={0.1} onChange={setSigma} />
          {activeBounds.includes('a') && <Slider label="Bound a" value={a} min={X_MIN} max={X_MAX} step={0.1} onChange={setA} />}
          {activeBounds.includes('b') && <Slider label="Bound b" value={b} min={X_MIN} max={X_MAX} step={0.1} onChange={setB} />}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={reset}>
              Reset
            </Button>
            <span className="text-xs text-ink-muted">Tip: drag on the chart to move the nearest bound.</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-4">
            <p className="text-sm font-medium text-ink-muted">{statement}</p>
            <p className="mt-1 font-mono text-3xl font-bold text-ink">{probability.toFixed(4)}</p>
            <p className="text-sm text-ink-muted">{(probability * 100).toFixed(2)}% of the area under the curve</p>
            <p className="mt-2 break-words font-mono text-xs text-ink-muted">
              = {working}
            </p>
          </div>

          <div className="rounded-xl border border-line bg-subtle p-4 text-sm">
            <p className="mb-2 font-semibold text-ink">z-scores (z = (x − μ) / σ)</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-ink-muted">
              {activeBounds.includes('a') && (
                <>
                  <dt className="text-ink">a = {fmtNum(a)}</dt>
                  <dd>z = ({fmtNum(a)} − {fmtNum(mu)}) / {sigma.toFixed(1)} = {fmtZ(zA)}</dd>
                </>
              )}
              {activeBounds.includes('b') && (
                <>
                  <dt className="text-ink">b = {fmtNum(b)}</dt>
                  <dd>z = ({fmtNum(b)} − {fmtNum(mu)}) / {sigma.toFixed(1)} = {fmtZ(zB)}</dd>
                </>
              )}
            </dl>
          </div>

          {showBands && (
            <div className="rounded-xl border border-line bg-subtle p-4 text-sm">
              <p className="mb-2 font-semibold text-ink">Empirical rule</p>
              <ul className="space-y-1">
                {[...BANDS].reverse().map((band) => (
                  <li key={band.k} className="flex flex-wrap items-center gap-2 text-ink-muted">
                    <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: band.fill }} aria-hidden />
                    <span className="font-mono">
                      μ ± {band.k}σ = [{fmtNum(mu - band.k * sigma)}, {fmtNum(mu + band.k * sigma)}]
                    </span>
                    <span className="font-semibold text-ink">{band.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
