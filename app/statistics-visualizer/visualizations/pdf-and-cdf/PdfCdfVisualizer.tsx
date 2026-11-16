'use client';

import { useId, useMemo, useRef, useState } from 'react';
import { Crosshair } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { Panel, RangeField, Segmented, Stat } from '../_distributions/controls';
import { formatProb, niceStep } from '../_distributions/math';
import { DISTRIBUTIONS, DISTRIBUTION_KEYS, initialParams, type DistributionKey, type Params } from './distributions';

const W = 600;
const H = 360;
const PLOT = { left: 58, right: 585, top: 22, bottom: 310 };
const SAMPLES = 480;

type Mode = 'below' | 'between' | 'above';
type MarkerKey = 'x1' | 'x2';

const MODES: { value: Mode; label: string }[] = [
  { value: 'below', label: 'P(X ≤ a)' },
  { value: 'between', label: 'P(a ≤ X ≤ b)' },
  { value: 'above', label: 'P(X ≥ a)' },
];

function fmt(v: number, digits = 3) {
  if (!Number.isFinite(v)) return v > 0 ? '∞' : '−∞';
  const r = Number(v.toFixed(digits));
  return Object.is(r, -0) ? (0).toFixed(digits) : r.toFixed(digits);
}

function ticks(lo: number, hi: number, target: number) {
  const step = niceStep(hi - lo, target);
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) out.push(Math.round(v / step) * step);
  return { step, values: out };
}

function labelOf(v: number, step: number) {
  let digits = 0;
  while (digits < 4 && Math.abs(Math.round(step * 10 ** digits) - step * 10 ** digits) > 1e-9) digits++;
  return fmt(v, digits);
}

interface ChartProps {
  lo: number;
  hi: number;
  markers: { key: MarkerKey; x: number }[];
  onDrag: (key: MarkerKey, x: number) => void;
  label: string;
  children: (helpers: { xOf: (x: number) => number }) => React.ReactNode;
  xTicks: { step: number; values: number[] };
  yTicks: { values: number[]; yOf: (v: number) => number; format: (v: number) => string };
}

function Chart({ lo, hi, markers, onDrag, label, children, xTicks, yTicks }: ChartProps) {
  const dragging = useRef<MarkerKey | null>(null);
  const clipId = useId();
  const xOf = (x: number) => PLOT.left + ((x - lo) / (hi - lo)) * (PLOT.right - PLOT.left);
  const xFrom = (px: number) => Math.min(hi, Math.max(lo, lo + ((px - PLOT.left) / (PLOT.right - PLOT.left)) * (hi - lo)));

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const { x } = toDrawingPoint(e, e.currentTarget);
    let best = markers[0];
    for (const m of markers) if (Math.abs(xOf(m.x) - x) < Math.abs(xOf(best.x) - x)) best = m;
    dragging.current = best.key;
    e.currentTarget.setPointerCapture(e.pointerId);
    onDrag(best.key, xFrom(x));
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const { x } = toDrawingPoint(e, e.currentTarget);
    onDrag(dragging.current, xFrom(x));
  };
  const stop = () => {
    dragging.current = null;
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`${responsiveSurface} touch-none cursor-ew-resize select-none rounded-xl border border-line bg-white`}
      role="img"
      aria-label={label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={PLOT.left} y={PLOT.top} width={PLOT.right - PLOT.left} height={PLOT.bottom - PLOT.top} />
        </clipPath>
      </defs>
      {yTicks.values.map((v) => (
        <g key={v}>
          <line x1={PLOT.left} x2={PLOT.right} y1={yTicks.yOf(v)} y2={yTicks.yOf(v)} stroke="#e2e8f0" />
          <text x={PLOT.left - 8} y={yTicks.yOf(v) + 5} fontSize={14} textAnchor="end" fill="#64748b">
            {yTicks.format(v)}
          </text>
        </g>
      ))}
      <g clipPath={`url(#${clipId})`}>{children({ xOf })}</g>
      <line x1={PLOT.left} x2={PLOT.right} y1={PLOT.bottom} y2={PLOT.bottom} stroke="#334155" strokeWidth={1.5} />
      <line x1={PLOT.left} x2={PLOT.left} y1={PLOT.top} y2={PLOT.bottom} stroke="#334155" strokeWidth={1.5} />
      {xTicks.values.map((v) => (
        <g key={v}>
          <line x1={xOf(v)} x2={xOf(v)} y1={PLOT.bottom} y2={PLOT.bottom + 6} stroke="#334155" />
          <text x={xOf(v)} y={PLOT.bottom + 24} fontSize={14} textAnchor="middle" fill="#475569">
            {labelOf(v, xTicks.step)}
          </text>
        </g>
      ))}
      {markers.map((m) => (
        <g key={m.key}>
          <line x1={xOf(m.x)} x2={xOf(m.x)} y1={PLOT.top} y2={PLOT.bottom} stroke="#be123c" strokeWidth={2} />
          <rect x={xOf(m.x) - 13} y={PLOT.bottom - 26} width={26} height={22} rx={6} fill="#be123c" />
          <text x={xOf(m.x)} y={PLOT.bottom - 10} fontSize={14} fontWeight={700} textAnchor="middle" fill="#ffffff">
            {m.key === 'x1' ? 'a' : 'b'}
          </text>
        </g>
      ))}
    </svg>
  );
}

function curvePoints(lo: number, hi: number, f: (x: number) => number) {
  return Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const x = lo + ((hi - lo) * i) / SAMPLES;
    return { x, y: f(x) };
  });
}

export default function PdfCdfVisualizer() {
  const [distKey, setDistKey] = useState<DistributionKey>('normal');
  const [params, setParams] = useState<Params>(() => initialParams(DISTRIBUTIONS.normal));
  const [mode, setMode] = useState<Mode>('between');
  const [x1, setX1] = useState(-1);
  const [x2, setX2] = useState(2);
  const [pInput, setPInput] = useState('0.9');

  const dist = DISTRIBUTIONS[distKey];
  const [lo, hi] = dist.range(params);
  const clamp = (v: number) => Math.min(hi, Math.max(lo, v));
  const a = clamp(mode === 'between' ? Math.min(x1, x2) : x1);
  const b = clamp(mode === 'between' ? Math.max(x1, x2) : x1);

  const pdfPts = useMemo(() => curvePoints(lo, hi, (x) => dist.pdf(x, params)), [dist, params, lo, hi]);
  const cdfPts = useMemo(() => curvePoints(lo, hi, (x) => dist.cdf(x, params)), [dist, params, lo, hi]);

  const pdfMax = useMemo(() => {
    const trim = dist.unbounded(params) ? 0.03 * (hi - lo) : 0;
    const vals = pdfPts.filter((p) => p.x >= lo + trim && p.x <= hi - trim && Number.isFinite(p.y)).map((p) => p.y);
    return Math.max(...vals, 1e-6) * 1.12;
  }, [pdfPts, dist, params, lo, hi]);

  const mean = dist.mean(params);
  const variance = dist.variance(params);
  const median = dist.quantile(0.5, params);
  const Fa = dist.cdf(a, params);
  const Fb = dist.cdf(b, params);
  const prob = mode === 'below' ? Fa : mode === 'above' ? 1 - Fa : Fb - Fa;

  const pNum = Number(pInput);
  const pValid = pInput.trim() !== '' && Number.isFinite(pNum) && pNum > 0 && pNum < 1;
  const xp = pValid ? dist.quantile(pNum, params) : NaN;

  const yPdf = (v: number) => PLOT.bottom - (Math.min(v, pdfMax * 2) / pdfMax) * (PLOT.bottom - PLOT.top);
  const yCdf = (v: number) => PLOT.bottom - v * (PLOT.bottom - PLOT.top);
  const xTicks = ticks(lo, hi, 8);
  const pdfTicks = ticks(0, pdfMax, 5);

  const markers: { key: MarkerKey; x: number }[] = mode === 'between' ? [{ key: 'x1', x: clamp(x1) }, { key: 'x2', x: clamp(x2) }] : [{ key: 'x1', x: clamp(x1) }];

  const onDrag = (key: MarkerKey, x: number) => {
    const step = niceStep(hi - lo, 200);
    const snapped = Math.round(x / step) * step;
    if (key === 'x1') setX1(snapped);
    else setX2(snapped);
  };

  const chooseDist = (key: DistributionKey) => {
    const d = DISTRIBUTIONS[key];
    const ps = initialParams(d);
    setDistKey(key);
    setParams(ps);
    setX1(Number(d.quantile(0.2, ps).toFixed(2)));
    setX2(Number(d.quantile(0.7, ps).toFixed(2)));
  };

  const changeParam = (key: string, v: number) => {
    const next = { ...params, [key]: v };
    setParams(dist.normalize ? dist.normalize(next, key) : next);
  };

  const jumpToQuantile = () => {
    if (!pValid) return;
    setMode('below');
    setX1(xp);
  };

  const shadedPath = (xOf: (x: number) => number) => {
    const from = mode === 'above' ? a : mode === 'below' ? lo : a;
    const to = mode === 'below' ? a : mode === 'above' ? hi : b;
    if (to <= from) return '';
    const n = 240;
    const pts: string[] = [`M ${xOf(from).toFixed(1)} ${PLOT.bottom}`];
    for (let i = 0; i <= n; i++) {
      const x = from + ((to - from) * i) / n;
      const y = dist.pdf(x, params);
      pts.push(`L ${xOf(x).toFixed(1)} ${(Number.isFinite(y) ? yPdf(y) : PLOT.top - 10).toFixed(1)}`);
    }
    pts.push(`L ${xOf(to).toFixed(1)} ${PLOT.bottom} Z`);
    return pts.join(' ');
  };

  const linePath = (pts: { x: number; y: number }[], xOf: (x: number) => number, yOf: (v: number) => number) =>
    pts
      .map((p, i) => {
        const y = Number.isFinite(p.y) ? yOf(p.y) : PLOT.top - 10;
        return `${i === 0 ? 'M' : 'L'} ${xOf(p.x).toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

  const segFrom = mode === 'below' ? 0 : Fa;
  const segTo = mode === 'below' ? Fa : mode === 'above' ? 1 : Fb;

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="space-y-4">
        <Segmented
          label="Distribution"
          options={DISTRIBUTION_KEYS.map((k) => ({ value: k, label: DISTRIBUTIONS[k].label }))}
          value={distKey}
          onChange={chooseDist}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {dist.params.map((p) => (
            <RangeField
              key={`${distKey}-${p.key}`}
              label={p.label}
              value={params[p.key]}
              min={p.min}
              max={p.max}
              step={p.step}
              onChange={(v) => changeParam(p.key, v)}
              display={fmt(params[p.key], p.step < 0.1 ? 2 : 1)}
            />
          ))}
        </div>
        <Segmented label="Probability" options={MODES} value={mode} onChange={setMode} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-ink">
            PDF f(x)
            <span className="ml-2 font-normal text-ink-muted">(shaded area = probability)</span>
          </p>
          <Chart
            lo={lo}
            hi={hi}
            markers={markers}
            onDrag={onDrag}
            label={`${dist.label} probability density function`}
            xTicks={xTicks}
            yTicks={{ values: pdfTicks.values, yOf: yPdf, format: (v) => labelOf(v, pdfTicks.step) }}
          >
            {({ xOf }) => (
              <>
                <path d={shadedPath(xOf)} fill="#fb7185" fillOpacity={0.35} stroke="none" />
                <path d={linePath(pdfPts, xOf, yPdf)} fill="none" stroke="#4f46e5" strokeWidth={3} strokeLinejoin="round" />
                <line x1={xOf(mean)} x2={xOf(mean)} y1={PLOT.top} y2={PLOT.bottom} stroke="#0f766e" strokeWidth={1.5} strokeDasharray="6 5" />
                <text x={xOf(mean) + 5} y={PLOT.top + 16} fontSize={14} fill="#0f766e" fontWeight={700}>
                  mean
                </text>
              </>
            )}
          </Chart>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-ink">
            CDF F(x) = P(X ≤ x)
            <span className="ml-2 font-normal text-ink-muted">(highlighted height = same probability)</span>
          </p>
          <Chart
            lo={lo}
            hi={hi}
            markers={markers}
            onDrag={onDrag}
            label={`${dist.label} cumulative distribution function`}
            xTicks={xTicks}
            yTicks={{ values: [0, 0.25, 0.5, 0.75, 1], yOf: yCdf, format: (v) => v.toFixed(2) }}
          >
            {({ xOf }) => (
              <>
                {[a, ...(mode === 'between' ? [b] : [])].map((x, i) => (
                  <line key={i} x1={PLOT.left} x2={xOf(x)} y1={yCdf(dist.cdf(x, params))} y2={yCdf(dist.cdf(x, params))} stroke="#be123c" strokeWidth={1.5} strokeDasharray="5 4" />
                ))}
                <rect x={PLOT.left} y={yCdf(segTo)} width={10} height={Math.max(0, yCdf(segFrom) - yCdf(segTo))} fill="#fb7185" />
                {pValid && Number.isFinite(xp) && (
                  <g>
                    <line x1={PLOT.left} x2={xOf(xp)} y1={yCdf(pNum)} y2={yCdf(pNum)} stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="2 4" />
                    <line x1={xOf(xp)} x2={xOf(xp)} y1={yCdf(pNum)} y2={PLOT.bottom} stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="2 4" />
                    <circle cx={xOf(xp)} cy={yCdf(pNum)} r={6} fill="#7c3aed" />
                  </g>
                )}
                <path d={linePath(cdfPts, xOf, yCdf)} fill="none" stroke="#4f46e5" strokeWidth={3} strokeLinejoin="round" />
                {[a, ...(mode === 'between' ? [b] : [])].map((x, i) => (
                  <circle key={i} cx={xOf(x)} cy={yCdf(dist.cdf(x, params))} r={5} fill="#be123c" />
                ))}
              </>
            )}
          </Chart>
        </div>
      </div>
      <p className="text-xs text-ink-muted">Drag on either chart to move the nearest marker. Both charts share the same x-axis.</p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Probability">
          <dl className="grid grid-cols-1 gap-2">
            <Stat
              label={mode === 'below' ? `P(X ≤ ${fmt(a, 2)})` : mode === 'above' ? `P(X ≥ ${fmt(a, 2)})` : `P(${fmt(a, 2)} ≤ X ≤ ${fmt(b, 2)})`}
              value={formatProb(prob, 4)}
              tone="text-rose-700"
            />
            <Stat label={`F(a), F at a = ${fmt(a, 2)}`} value={Fa.toFixed(4)} />
            {mode === 'between' && <Stat label={`F(b), F at b = ${fmt(b, 2)}`} value={Fb.toFixed(4)} />}
            <Stat label="Density f(a), not a probability" value={fmt(dist.pdf(a, params), 4)} />
          </dl>
          <p className="mt-2 font-mono text-xs text-ink-muted">
            {mode === 'below' && `area left of a = F(a) = ${Fa.toFixed(4)}`}
            {mode === 'above' && `area right of a = 1 − F(a) = ${(1 - Fa).toFixed(4)}`}
            {mode === 'between' && `area = F(b) − F(a) = ${Fb.toFixed(4)} − ${Fa.toFixed(4)}`}
          </p>
        </Panel>
        <Panel title="Summary">
          <dl className="grid grid-cols-2 gap-2">
            <Stat label="Mean" value={fmt(mean)} />
            <Stat label="Median" value={fmt(median)} />
            <Stat label="Variance" value={fmt(variance)} />
            <Stat label="Std. dev." value={fmt(Math.sqrt(variance))} />
          </dl>
          <div className="mt-3 space-y-1 font-mono text-xs text-ink-muted">
            <p>{dist.pdfFormula}</p>
            <p>{dist.cdfFormula}</p>
          </div>
        </Panel>
        <Panel title="Quantile (inverse CDF)">
          <label className="block text-sm">
            <span className="font-medium text-ink">Probability p</span>
            <input
              type="number"
              inputMode="decimal"
              min={0.001}
              max={0.999}
              step={0.01}
              value={pInput}
              onChange={(e) => setPInput(e.target.value)}
              className="mt-1 h-10 w-full rounded-control border border-line-strong bg-white px-3 font-mono text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </label>
          <dl className="mt-2 grid grid-cols-1 gap-2">
            <Stat label={pValid ? `x with F(x) = ${pNum}` : 'Enter p between 0 and 1'} value={pValid ? fmt(xp, 4) : '–'} tone="text-violet-700" />
          </dl>
          <p className="mt-2 text-xs text-ink-muted">
            {pValid ? `${fmt(pNum * 100, 1)}% of the probability lies below this value: it is the ${fmt(pNum * 100, 1)}th percentile.` : 'Percentiles are values of the inverse CDF.'}
          </p>
          <Button size="sm" variant="secondary" className="mt-3" onClick={jumpToQuantile} disabled={!pValid} leftIcon={<Crosshair className="h-4 w-4" />}>
            Move a to this quantile
          </Button>
        </Panel>
      </div>
    </div>
  );
}
