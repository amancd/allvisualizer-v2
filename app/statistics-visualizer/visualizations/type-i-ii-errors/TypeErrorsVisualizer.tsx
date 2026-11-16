'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { Panel, RangeField, Segmented, Stat } from '../_inference/controls';
import { normalCdf, normalInv, normalPdf } from '../_inference/stats';
import { MU0, type Sides, criticalZ, power, requiredN } from './power';

const N_MAX = 200;
const DELTA_MAX = 20;
const ALPHA_MIN = 0.005;
const ALPHA_MAX = 0.3;

const W = 800;
const H = 360;
const PAD = { left: 24, right: 24, top: 40, bottom: 50 };
const X_MIN = 75;
const X_MAX = 135;
const BASE = H - PAD.bottom;
const sx = (x: number) => PAD.left + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - PAD.left - PAD.right);
const fromSx = (px: number) => X_MIN + ((px - PAD.left) / (W - PAD.left - PAD.right)) * (X_MAX - X_MIN);

const PW = 800;
const PH = 280;
const PPAD = { left: 56, right: 20, top: 20, bottom: 48 };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type CurveMode = 'n' | 'effect';

function areaUnder(f: (x: number) => number, sy: (d: number) => number, a: number, b: number) {
  const lo = Math.max(X_MIN, a);
  const hi = Math.min(X_MAX, b);
  if (hi <= lo) return '';
  const steps = 160;
  const pts = [`${sx(lo).toFixed(1)},${BASE}`];
  for (let i = 0; i <= steps; i++) {
    const x = lo + ((hi - lo) * i) / steps;
    pts.push(`${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`);
  }
  pts.push(`${sx(hi).toFixed(1)},${BASE}`);
  return pts.join(' ');
}

function DistributionsChart({
  delta,
  se,
  alpha,
  sides,
  onAlpha,
}: {
  delta: number;
  se: number;
  alpha: number;
  sides: Sides;
  onAlpha: (a: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const mu1 = MU0 + delta;
  const peak = normalPdf(0, 0, se);
  const sy = (d: number) => BASE - (d / (peak * 1.25)) * (BASE - PAD.top);
  const f0 = (x: number) => normalPdf(x, MU0, se);
  const f1 = (x: number) => normalPdf(x, mu1, se);
  const zc = criticalZ(alpha, sides);
  const upper = MU0 + zc * se;
  const lower = MU0 - zc * se;
  const reject: [number, number][] = sides === 'two' ? [[-Infinity, lower], [upper, Infinity]] : [[upper, Infinity]];
  const accept: [number, number] = sides === 'two' ? [lower, upper] : [-Infinity, upper];
  const curve = (f: (x: number) => number) =>
    Array.from({ length: 401 }, (_, i) => {
      const x = X_MIN + ((X_MAX - X_MIN) * i) / 400;
      return `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(1)} ${sy(f(x)).toFixed(1)}`;
    }).join(' ');
  const crits = sides === 'two' ? [lower, upper] : [upper];

  const setFromPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const x = fromSx(toDrawingPoint(e, svgRef.current).x);
    const z = (sides === 'two' ? Math.abs(x - MU0) : x - MU0) / se;
    const a = sides === 'two' ? 2 * (1 - normalCdf(z)) : 1 - normalCdf(z);
    onAlpha(clamp(a, ALPHA_MIN, ALPHA_MAX));
  };

  const labelY = PAD.top - 12;
  const sameSpot = Math.abs(sx(mu1) - sx(MU0)) < 120;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className={`${responsiveSurface} cursor-ew-resize touch-none select-none rounded-xl border border-line bg-white`}
      role="img"
      aria-label="Sampling distributions of the mean under H0 and H1 with the critical value"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromPointer(e);
      }}
      onPointerMove={(e) => {
        if (dragging.current) setFromPointer(e);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      {reject.map(([a, b], i) => (
        <polygon key={`pw${i}`} points={areaUnder(f1, sy, a, b)} fill="#86efac" opacity={0.75} />
      ))}
      <polygon points={areaUnder(f1, sy, accept[0], accept[1])} fill="#fcd34d" opacity={0.7} />
      {reject.map(([a, b], i) => (
        <polygon key={`a${i}`} points={areaUnder(f0, sy, a, b)} fill="#ef4444" opacity={0.6} />
      ))}
      <path d={curve(f0)} fill="none" stroke="#1d4ed8" strokeWidth={3} />
      <path d={curve(f1)} fill="none" stroke="#7c3aed" strokeWidth={3} strokeDasharray={delta === 0 ? '8 6' : undefined} />
      <line x1={sx(MU0)} y1={sy(peak)} x2={sx(MU0)} y2={BASE} stroke="#1d4ed8" strokeWidth={1.5} strokeDasharray="4 4" />
      {delta > 0 && <line x1={sx(mu1)} y1={sy(peak)} x2={sx(mu1)} y2={BASE} stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="4 4" />}
      <text x={sx(MU0)} y={labelY} fontSize={17} textAnchor={sameSpot ? 'end' : 'middle'} fill="#1d4ed8" fontWeight={700}>
        H₀: μ = {MU0}
      </text>
      <text x={sameSpot ? sx(MU0) + 14 : sx(mu1)} y={labelY} fontSize={17} textAnchor={sameSpot ? 'start' : 'middle'} fill="#7c3aed" fontWeight={700}>
        H₁: μ = {mu1.toFixed(1)}
      </text>
      {crits.map((c) =>
        c >= X_MIN && c <= X_MAX ? (
          <g key={c}>
            <line x1={sx(c)} y1={PAD.top} x2={sx(c)} y2={BASE} stroke="#0f172a" strokeWidth={3} />
            <rect x={sx(c) - 7} y={PAD.top + 2} width={14} height={22} rx={4} fill="#0f172a" />
            <text x={sx(c)} y={BASE + 46} fontSize={14} textAnchor="middle" fill="#0f172a" fontWeight={700}>
              {c.toFixed(1)}
            </text>
          </g>
        ) : null,
      )}
      <line x1={PAD.left} y1={BASE} x2={W - PAD.right} y2={BASE} stroke="#334155" strokeWidth={2} />
      {Array.from({ length: 13 }, (_, i) => X_MIN + i * 5).map((v) => (
        <g key={v}>
          <line x1={sx(v)} y1={BASE} x2={sx(v)} y2={BASE + 6} stroke="#334155" strokeWidth={2} />
          {v % 10 === 0 && (
            <text x={sx(v)} y={BASE + 24} fontSize={16} textAnchor="middle" fill="#475569">
              {v}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

function PowerCurve({
  mode,
  delta,
  sigma,
  n,
  alpha,
  sides,
  target,
  onPick,
}: {
  mode: CurveMode;
  delta: number;
  sigma: number;
  n: number;
  alpha: number;
  sides: Sides;
  target: number;
  onPick: (v: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const xMax = mode === 'n' ? N_MAX : DELTA_MAX;
  const xMin = mode === 'n' ? 1 : 0;
  const px = (v: number) => PPAD.left + ((v - xMin) / (xMax - xMin)) * (PW - PPAD.left - PPAD.right);
  const py = (p: number) => PPAD.top + (1 - p) * (PH - PPAD.top - PPAD.bottom);
  const fn = (v: number) => (mode === 'n' ? power(delta, sigma, v, alpha, sides) : power(v, sigma, n, alpha, sides));
  const xs = mode === 'n' ? Array.from({ length: N_MAX }, (_, i) => i + 1) : Array.from({ length: 201 }, (_, i) => (i * DELTA_MAX) / 200);
  const path = xs.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(v).toFixed(1)} ${py(fn(v)).toFixed(1)}`).join(' ');
  const current = mode === 'n' ? n : delta;
  const currentPower = fn(current);
  const xTicks = mode === 'n' ? [1, 25, 50, 75, 100, 125, 150, 175, 200] : [0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20];

  const pick = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const { x } = toDrawingPoint(e, svgRef.current);
    const v = xMin + ((x - PPAD.left) / (PW - PPAD.left - PPAD.right)) * (xMax - xMin);
    onPick(mode === 'n' ? Math.round(clamp(v, 1, N_MAX)) : Math.round(clamp(v, 0, DELTA_MAX) * 2) / 2);
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${PW} ${PH}`}
      className={`${responsiveSurface} cursor-crosshair touch-none select-none rounded-xl border border-line bg-white`}
      role="img"
      aria-label={mode === 'n' ? 'Power as a function of sample size' : 'Power as a function of effect size'}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        pick(e);
      }}
      onPointerMove={(e) => {
        if (dragging.current) pick(e);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
    >
      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((p) => (
        <g key={p}>
          <line x1={PPAD.left} y1={py(p)} x2={PW - PPAD.right} y2={py(p)} stroke="#e2e8f0" strokeWidth={1} />
          <text x={PPAD.left - 8} y={py(p) + 5} fontSize={15} textAnchor="end" fill="#64748b">
            {p.toFixed(1)}
          </text>
        </g>
      ))}
      <line x1={PPAD.left} y1={py(target)} x2={PW - PPAD.right} y2={py(target)} stroke="#16a34a" strokeWidth={2} strokeDasharray="8 6" />
      <text x={PW - PPAD.right} y={py(target) - 6} fontSize={14} textAnchor="end" fill="#15803d">
        target power {target}
      </text>
      <line x1={PPAD.left} y1={py(alpha)} x2={PW - PPAD.right} y2={py(alpha)} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 5" />
      <text x={PW - PPAD.right} y={py(alpha) - 6} fontSize={14} textAnchor="end" fill="#b91c1c">
        α = {alpha.toFixed(3)}
      </text>
      <path d={path} fill="none" stroke="#7c3aed" strokeWidth={3} strokeLinejoin="round" />
      <line x1={px(current)} y1={py(0)} x2={px(current)} y2={py(currentPower)} stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="4 4" />
      <circle cx={px(current)} cy={py(currentPower)} r={8} fill="#7c3aed" stroke="white" strokeWidth={2} />
      <line x1={PPAD.left} y1={py(0)} x2={PW - PPAD.right} y2={py(0)} stroke="#334155" strokeWidth={2} />
      {xTicks.map((t) => (
        <text key={t} x={px(t)} y={py(0) + 22} fontSize={15} textAnchor="middle" fill="#475569">
          {t}
        </text>
      ))}
      <text x={(PW + PPAD.left) / 2} y={PH - 6} fontSize={15} textAnchor="middle" fill="#64748b">
        {mode === 'n' ? 'sample size n' : 'effect δ = μ₁ − μ₀'}
      </text>
    </svg>
  );
}

function Cell({ title, value, tone, note }: { title: string; value: string; tone: string; note: string }) {
  return (
    <td className={`border border-line p-3 align-top ${tone}`}>
      <p className="font-semibold">{title}</p>
      <p className="font-mono text-base font-semibold">{value}</p>
      <p className="text-xs opacity-80">{note}</p>
    </td>
  );
}

export default function TypeErrorsVisualizer() {
  const [delta, setDelta] = useState(6);
  const [sigma, setSigma] = useState(15);
  const [n, setN] = useState(25);
  const [alpha, setAlpha] = useState(0.05);
  const [sides, setSides] = useState<Sides>('one');
  const [mode, setMode] = useState<CurveMode>('n');
  const [target, setTarget] = useState(0.8);

  const se = sigma / Math.sqrt(n);
  const pw = power(delta, sigma, n, alpha, sides);
  const beta = 1 - pw;
  const d = delta / sigma;
  const zc = criticalZ(alpha, sides);
  const zPow = normalInv(target);
  const needed = requiredN(delta, sigma, alpha, sides, target);
  const sizeLabel = d < 0.2 ? 'very small' : d < 0.5 ? 'small' : d < 0.8 ? 'medium' : 'large';

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <p className="text-sm text-ink-muted">
        Testing H₀: μ = {MU0} against H₁: μ = {MU0} + δ using the mean of n observations with standard deviation σ. The curves are the
        sampling distributions of x̄ under each hypothesis. Drag on the chart to move the critical value.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RangeField label="Effect δ = μ₁ − μ₀" value={delta} min={0} max={DELTA_MAX} step={0.5} onChange={setDelta} display={delta.toFixed(1)} />
        <RangeField label="Std. dev. σ" value={sigma} min={5} max={30} onChange={setSigma} />
        <RangeField label="Sample size n" value={n} min={1} max={N_MAX} onChange={setN} />
        <RangeField label="Significance α" value={alpha} min={0.005} max={0.3} step={0.005} onChange={setAlpha} display={alpha.toFixed(3)} />
      </div>
      <Segmented
        label="Test"
        options={[
          { value: 'one', label: 'One-sided (μ > 100)' },
          { value: 'two', label: 'Two-sided (μ ≠ 100)' },
        ]}
        value={sides}
        onChange={setSides}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 space-y-2 lg:col-span-2">
          <DistributionsChart delta={delta} se={se} alpha={alpha} sides={sides} onAlpha={setAlpha} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-red-500/60" /> α: Type I error
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-amber-300" /> β: Type II error
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-green-300" /> power = 1 − β
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-1 rounded-sm bg-slate-900" /> critical value
            </span>
          </div>
        </div>
        <div className="min-w-0 space-y-4 text-sm">
          <dl className="grid grid-cols-2 gap-2">
            <Stat label="α (Type I)" value={alpha.toFixed(3)} tone="text-red-600" />
            <Stat label="β (Type II)" value={beta.toFixed(3)} tone="text-amber-700" />
            <Stat label="Power 1 − β" value={pw.toFixed(3)} tone="text-green-700" />
            <Stat label="Standard error" value={se.toFixed(2)} />
            <Stat label="Effect size d" value={d.toFixed(2)} hint={`(${sizeLabel})`} />
            <Stat label="Critical z" value={sides === 'two' ? `±${zc.toFixed(3)}` : zc.toFixed(3)} />
          </dl>
          <Panel title="Where the numbers come from">
            <p className="font-mono text-xs text-ink">
              SE = σ/√n = {sigma}/√{n} = {se.toFixed(3)}
            </p>
            <p className="font-mono text-xs text-ink">
              critical x̄ = {MU0} {sides === 'two' ? '±' : '+'} {zc.toFixed(3)} × {se.toFixed(3)} = {sides === 'two' ? `${(MU0 - zc * se).toFixed(2)}, ` : ''}
              {(MU0 + zc * se).toFixed(2)}
            </p>
            <p className="font-mono text-xs text-ink">
              power = P(Z ≥ {zc.toFixed(3)} − {(delta / se).toFixed(3)}){sides === 'two' ? ' + P(Z ≤ −z − δ/SE)' : ''} = {pw.toFixed(3)}
            </p>
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-ink">Power curve</p>
            <Segmented
              label="against"
              options={[
                { value: 'n', label: 'sample size' },
                { value: 'effect', label: 'effect δ' },
              ]}
              value={mode}
              onChange={setMode}
            />
          </div>
          <PowerCurve mode={mode} delta={delta} sigma={sigma} n={n} alpha={alpha} sides={sides} target={target} onPick={mode === 'n' ? setN : setDelta} />
          <p className="text-xs text-ink-muted">Click or drag on the curve to set {mode === 'n' ? 'n' : 'δ'}.</p>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-line bg-subtle p-2 text-left text-ink-muted">Decision</th>
                  <th className="border border-line bg-subtle p-2 text-left text-ink">H₀ true (μ = {MU0})</th>
                  <th className="border border-line bg-subtle p-2 text-left text-ink">H₀ false (μ = {(MU0 + delta).toFixed(1)})</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border border-line bg-subtle p-2 text-left font-medium text-ink">Reject H₀</th>
                  <Cell title="Type I error" value={`α = ${alpha.toFixed(3)}`} tone="bg-red-50 text-red-800" note="false positive" />
                  <Cell title="Correct" value={`power = ${pw.toFixed(3)}`} tone="bg-green-50 text-green-800" note="true positive" />
                </tr>
                <tr>
                  <th className="border border-line bg-subtle p-2 text-left font-medium text-ink">Fail to reject</th>
                  <Cell title="Correct" value={`1 − α = ${(1 - alpha).toFixed(3)}`} tone="bg-sky-50 text-sky-800" note="true negative" />
                  <Cell title="Type II error" value={`β = ${beta.toFixed(3)}`} tone="bg-amber-50 text-amber-800" note="false negative" />
                </tr>
              </tbody>
            </table>
          </div>

          <Panel title="Sample size calculator">
            <Segmented
              label="Target power"
              options={[0.8, 0.9, 0.95].map((v) => ({ value: v, label: String(v) }))}
              value={target}
              onChange={setTarget}
            />
            {needed ? (
              <div className="mt-3 space-y-1 text-sm">
                <p className="font-mono text-xs text-ink">
                  n = ((z{sides === 'two' ? '₁₋α/₂' : '₁₋α'} + z{'₁₋β'}) · σ / δ)²
                </p>
                <p className="font-mono text-xs text-ink">
                  = (({zc.toFixed(3)} + {zPow.toFixed(3)}) × {sigma} / {delta.toFixed(1)})² = {needed.raw.toFixed(2)}
                </p>
                <p className="text-ink">
                  Smallest n with power ≥ {target}: <span className="font-mono font-semibold">{needed.n.toLocaleString('en-US')}</span>
                </p>
                <div className="pt-1">
                  {needed.n <= N_MAX ? (
                    <Button size="sm" variant="secondary" onClick={() => setN(needed.n)} disabled={needed.n === n}>
                      {needed.n === n ? `n is already ${n}` : `Set n = ${needed.n}`}
                    </Button>
                  ) : (
                    <p className="text-xs text-ink-muted">That is beyond this slider ({N_MAX}). Increase δ or α, or reduce σ.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">With δ = 0 the hypotheses are the same, so power stays at α for every n.</p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
