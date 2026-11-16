'use client';

import { useMemo, useRef, useState } from 'react';
import { Dices, RotateCcw, Target } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { Segmented, Slider, Stat, StatBox } from '../_descriptive-statistics/controls';
import { correlationParts, fmt, mulberry32, normalSampler, ticks } from '../_descriptive-statistics/stats';
import { ANSCOMBE, generateCorrelated, type XY } from './correlationData';

type Tab = 'generate' | 'anscombe' | 'nonlinear';
type Range = { min: number; max: number; step: number };

interface Scales {
  w: number;
  h: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  xr: Range;
  yr: Range;
  sx: (x: number) => number;
  sy: (y: number) => number;
}

function makeScales(w: number, h: number, pad: { l: number; r: number; t: number; b: number }, xr: Range, yr: Range): Scales {
  const left = pad.l;
  const right = w - pad.r;
  const top = pad.t;
  const bottom = h - pad.b;
  return {
    w,
    h,
    left,
    right,
    top,
    bottom,
    xr,
    yr,
    sx: (x) => left + ((x - xr.min) / (xr.max - xr.min)) * (right - left),
    sy: (y) => bottom - ((y - yr.min) / (yr.max - yr.min)) * (bottom - top),
  };
}

function Axes({ s, fontSize = 16, xLabel, yLabel }: { s: Scales; fontSize?: number; xLabel?: string; yLabel?: string }) {
  return (
    <g>
      {ticks(s.xr.min, s.xr.max, s.xr.step).map((t) => (
        <g key={`x${t}`}>
          <line x1={s.sx(t)} y1={s.top} x2={s.sx(t)} y2={s.bottom} stroke="#f1f5f9" strokeWidth={1.5} />
          <text x={s.sx(t)} y={s.bottom + fontSize + 6} fontSize={fontSize} textAnchor="middle" fill="#475569">
            {fmt(t)}
          </text>
        </g>
      ))}
      {ticks(s.yr.min, s.yr.max, s.yr.step).map((t) => (
        <g key={`y${t}`}>
          <line x1={s.left} y1={s.sy(t)} x2={s.right} y2={s.sy(t)} stroke="#f1f5f9" strokeWidth={1.5} />
          <text x={s.left - 8} y={s.sy(t) + fontSize / 3} fontSize={fontSize} textAnchor="end" fill="#475569">
            {fmt(t)}
          </text>
        </g>
      ))}
      <line x1={s.left} y1={s.bottom} x2={s.right} y2={s.bottom} stroke="#334155" strokeWidth={2} />
      <line x1={s.left} y1={s.top} x2={s.left} y2={s.bottom} stroke="#334155" strokeWidth={2} />
      {xLabel && (
        <text x={s.right} y={s.bottom - 8} fontSize={fontSize} textAnchor="end" fill="#334155" fontStyle="italic">
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text x={s.left + 8} y={s.top + fontSize} fontSize={fontSize} fill="#334155" fontStyle="italic">
          {yLabel}
        </text>
      )}
    </g>
  );
}

export default function CorrelationVisualizer() {
  const [tab, setTab] = useState<Tab>('generate');
  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <Segmented
        label="View"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'generate', label: 'Generate & drag' },
          { value: 'anscombe', label: "Anscombe's quartet" },
          { value: 'nonlinear', label: 'Nonlinear: y = x²' },
        ]}
      />
      {tab === 'generate' && <GenerateTab />}
      {tab === 'anscombe' && <AnscombeTab />}
      {tab === 'nonlinear' && <NonlinearTab />}
    </div>
  );
}

const GEN_RANGE: Range = { min: 0, max: 100, step: 10 };
const GEN = makeScales(800, 540, { l: 56, r: 20, t: 20, b: 44 }, GEN_RANGE, GEN_RANGE);
const POS = '#16a34a';
const NEG = '#dc2626';

function GenerateTab() {
  const [target, setTarget] = useState(0.7);
  const [n, setN] = useState(40);
  const [seed, setSeed] = useState(1);
  const [points, setPoints] = useState<XY[]>(() => generateCorrelated(0.7, 40, 1));
  const [showRects, setShowRects] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragId = useRef<number | null>(null);

  const [edited, setEdited] = useState(false);
  const regenerate = (r: number, size: number, sd: number) => {
    setPoints(generateCorrelated(r, size, sd));
    setEdited(false);
  };

  const c = useMemo(() => correlationParts(points.map((p) => p.x), points.map((p) => p.y)), [points]);
  const contributions = useMemo(() => {
    let pos = 0;
    let neg = 0;
    let posCount = 0;
    let negCount = 0;
    for (const p of points) {
      const prod = (p.x - c.mx) * (p.y - c.my);
      if (prod >= 0) {
        pos += prod;
        posCount++;
      } else {
        neg += prod;
        negCount++;
      }
    }
    return { pos, neg, posCount, negCount };
  }, [points, c]);

  const clamp = (v: number) => Math.min(GEN_RANGE.max, Math.max(GEN_RANGE.min, v));
  const toData = (p: { x: number; y: number }) => ({
    x: clamp(GEN_RANGE.min + ((p.x - GEN.left) / (GEN.right - GEN.left)) * (GEN_RANGE.max - GEN_RANGE.min)),
    y: clamp(GEN_RANGE.min + ((GEN.bottom - p.y) / (GEN.bottom - GEN.top)) * (GEN_RANGE.max - GEN_RANGE.min)),
  });

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const p = toDrawingPoint(e, svg);
    let best: XY | null = null;
    let bestD = 20;
    for (const pt of points) {
      const d = Math.hypot(GEN.sx(pt.x) - p.x, GEN.sy(pt.y) - p.y);
      if (d < bestD) {
        bestD = d;
        best = pt;
      }
    }
    if (!best) return;
    dragId.current = best.id;
    setEdited(true);
    svg.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    const id = dragId.current;
    if (!svg || id === null) return;
    const { x, y } = toData(toDrawingPoint(e, svg));
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
  };

  const endDrag = () => {
    dragId.current = null;
  };

  const addOutlier = () => {
    setEdited(true);
    setPoints((prev) => {
      const id = Math.max(...prev.map((p) => p.id)) + 1;
      return [...prev, { id, x: 95, y: target >= 0 ? 5 : 95 }];
    });
  };

  const rColor = c.r >= 0 ? POS : NEG;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider
          label="Target correlation r"
          value={target}
          min={-1}
          max={1}
          step={0.05}
          format={(v) => fmt(v, 2)}
          onChange={(v) => {
            setTarget(v);
            regenerate(v, n, seed);
          }}
        />
        <Slider
          label="Number of points n"
          value={n}
          min={5}
          max={200}
          step={5}
          onChange={(v) => {
            setN(v);
            regenerate(target, v, seed);
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<Dices className="h-4 w-4" />}
          onClick={() => {
            setSeed(seed + 1);
            regenerate(target, n, seed + 1);
          }}
        >
          New sample
        </Button>
        <Button size="sm" variant="outline" leftIcon={<Target className="h-4 w-4" />} onClick={addOutlier} disabled={points.length >= n + 5}>
          Add an outlier
        </Button>
        <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => regenerate(target, n, seed)} disabled={!edited}>
          Undo edits
        </Button>
        <label className="ml-1 inline-flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={showRects} onChange={(e) => setShowRects(e.target.checked)} className="h-4 w-4 accent-brand-600" />
          Show deviation rectangles
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <p className="mb-1 text-sm font-medium text-ink">
            Scatter plot
            <span className="ml-2 font-normal text-ink-muted">(drag any point; green products (x − x̄)(y − ȳ) push r up, red ones pull it down)</span>
          </p>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${GEN.w} ${GEN.h}`}
            className={`${responsiveSurface} touch-none select-none rounded-xl border border-line bg-white`}
            role="img"
            aria-label={`Scatter plot of ${points.length} points with sample correlation ${fmt(c.r, 3)}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <Axes s={GEN} xLabel="x" yLabel="y" />
            {showRects &&
              points.map((p) => {
                const x0 = Math.min(GEN.sx(p.x), GEN.sx(c.mx));
                const y0 = Math.min(GEN.sy(p.y), GEN.sy(c.my));
                const prod = (p.x - c.mx) * (p.y - c.my);
                return (
                  <rect
                    key={`r${p.id}`}
                    x={x0}
                    y={y0}
                    width={Math.abs(GEN.sx(p.x) - GEN.sx(c.mx))}
                    height={Math.abs(GEN.sy(p.y) - GEN.sy(c.my))}
                    fill={prod >= 0 ? POS : NEG}
                    opacity={0.06}
                  />
                );
              })}
            <line x1={GEN.sx(c.mx)} y1={GEN.top} x2={GEN.sx(c.mx)} y2={GEN.bottom} stroke="#64748b" strokeWidth={1.5} strokeDasharray="6 5" />
            <line x1={GEN.left} y1={GEN.sy(c.my)} x2={GEN.right} y2={GEN.sy(c.my)} stroke="#64748b" strokeWidth={1.5} strokeDasharray="6 5" />
            <text x={GEN.sx(c.mx) + 6} y={GEN.top + 18} fontSize={16} fill="#475569">
              x̄
            </text>
            <text x={GEN.right - 6} y={GEN.sy(c.my) - 6} fontSize={16} textAnchor="end" fill="#475569">
              ȳ
            </text>
            {points.map((p) => {
              const prod = (p.x - c.mx) * (p.y - c.my);
              return (
                <circle key={p.id} cx={GEN.sx(p.x)} cy={GEN.sy(p.y)} r={p.id >= n ? 9 : 7} fill={prod >= 0 ? '#4ade80' : '#f87171'} stroke={prod >= 0 ? '#166534' : '#991b1b'} strokeWidth={p.id >= n ? 3 : 1.5} className="cursor-grab" />
              );
            })}
            <text x={GEN.right - 10} y={GEN.top + 26} fontSize={24} fontWeight={700} textAnchor="end" fill={rColor}>
              r = {fmt(c.r, 3)}
            </text>
          </svg>
        </div>

        <div className="min-w-0 space-y-4">
          <StatBox title="Correlation">
            <Stat label="Target r" value={fmt(target, 2)} />
            <Stat label="Sample r now" value={<span style={{ color: rColor }}>{fmt(c.r, 3)}</span>} />
            <Stat label="r²" value={fmt(c.r * c.r, 3)} />
            <Stat label="n" value={points.length} />
          </StatBox>
          <StatBox title="Step by step">
            <Stat label="x̄, ȳ" value={`${fmt(c.mx)}, ${fmt(c.my)}`} />
            <Stat label="sₓ" value={fmt(c.sx, 3)} hint="√(Σ(x − x̄)² / (n − 1))" />
            <Stat label="sᵧ" value={fmt(c.sy, 3)} />
            <Stat label="Σ(x − x̄)(y − ȳ)" value={fmt(c.sxy, 1)} />
            <Stat label={<span className="text-green-700">positive terms</span>} value={`${contributions.posCount} → ${fmt(contributions.pos, 1)}`} />
            <Stat label={<span className="text-red-700">negative terms</span>} value={`${contributions.negCount} → ${fmt(contributions.neg, 1)}`} />
            <Stat label="cov = Σ / (n − 1)" value={fmt(c.cov, 2)} />
          </StatBox>
          <div className="rounded-xl border border-line bg-subtle p-4 font-mono text-[13px] text-ink">
            r = cov / (sₓ · sᵧ)
            <br />= {fmt(c.cov, 2)} / ({fmt(c.sx, 3)} × {fmt(c.sy, 3)})
            <br />= <strong style={{ color: rColor }}>{fmt(c.r, 3)}</strong>
          </div>
        </div>
      </div>
      <p className="text-sm text-ink-muted">
        The generator makes the sample correlation exactly equal to the target, so the first number you see is the target itself. Drag a single point
        far from the cloud, or press Add an outlier, to see how much one value can move r, especially when n is small. A strong r says the points hug a
        line; it never says that x causes y.
      </p>
    </div>
  );
}

const ANS = { min: 2, max: 20, step: 2 };
const ANS_Y = { min: 2, max: 14, step: 2 };

function AnscombeTab() {
  const panels = useMemo(
    () =>
      ANSCOMBE.map((set) => {
        const c = correlationParts(set.x, set.y);
        const slope = c.sxy / c.sxx;
        const intercept = c.my - slope * c.mx;
        return { ...set, c, slope, intercept, vx: c.sx ** 2, vy: c.sy ** 2 };
      }),
    [],
  );
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        Francis Anscombe built these four datasets in 1973. Each has 11 points with the same mean of x (9), variance of x (11), mean of y (7.50), variance of y
        (about 4.12), correlation (r ≈ 0.82) and least-squares line (y ≈ 3.00 + 0.500x). Only the pictures tell them apart.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {panels.map((p) => {
          const s = makeScales(420, 320, { l: 44, r: 14, t: 14, b: 38 }, ANS, ANS_Y);
          return (
            <figure key={p.name} className="min-w-0 rounded-xl border border-line p-3">
              <figcaption className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-ink">Dataset {p.name}</span>
                <span className="font-mono text-sm text-ink-muted">r = {fmt(p.c.r, 3)}</span>
              </figcaption>
              <svg viewBox={`0 0 ${s.w} ${s.h}`} className={responsiveSurface} role="img" aria-label={`Anscombe dataset ${p.name}, r = ${fmt(p.c.r, 3)}`}>
                <Axes s={s} fontSize={14} />
                <line x1={s.sx(ANS.min)} y1={s.sy(p.intercept + p.slope * ANS.min)} x2={s.sx(ANS.max)} y2={s.sy(p.intercept + p.slope * ANS.max)} stroke="#6366f1" strokeWidth={2} strokeDasharray="7 5" />
                {p.x.map((x, i) => (
                  <circle key={i} cx={s.sx(x)} cy={s.sy(p.y[i])} r={6} fill="#fbbf24" stroke="#92400e" strokeWidth={1.5} />
                ))}
              </svg>
              <p className="mt-1 text-sm text-ink-muted">{p.story}</p>
            </figure>
          );
        })}
      </div>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-subtle text-left text-ink">
            <tr>
              {['Dataset', 'x̄', 'sₓ²', 'ȳ', 'sᵧ²', 'r', 'Line'].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line font-mono tabular-nums text-gray-700">
            {panels.map((p) => (
              <tr key={p.name}>
                <td className="px-3 py-2 font-sans font-medium text-ink">{p.name}</td>
                <td className="px-3 py-2">{fmt(p.c.mx, 2)}</td>
                <td className="px-3 py-2">{fmt(p.vx, 2)}</td>
                <td className="px-3 py-2">{fmt(p.c.my, 2)}</td>
                <td className="px-3 py-2">{fmt(p.vy, 3)}</td>
                <td className="px-3 py-2">{fmt(p.c.r, 3)}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  y = {fmt(p.intercept, 2)} + {fmt(p.slope, 3)}x
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const NOISE = (() => {
  const normal = normalSampler(mulberry32(2024));
  return Array.from({ length: 21 }, normal);
})();
const NL = makeScales(800, 480, { l: 60, r: 20, t: 20, b: 44 }, { min: -10, max: 20, step: 5 }, { min: -50, max: 450, step: 50 });

function NonlinearTab() {
  const [center, setCenter] = useState(0);
  const [noise, setNoise] = useState(0);

  const pts = useMemo(() => NOISE.map((e, i) => {
    const x = center - 10 + i;
    return { x, y: x * x + noise * e };
  }), [center, noise]);
  const c = correlationParts(pts.map((p) => p.x), pts.map((p) => p.y));
  const cSq = correlationParts(pts.map((p) => p.x * p.x), pts.map((p) => p.y));
  const curve = Array.from({ length: 121 }, (_, i) => {
    const x = -10 + (30 * i) / 120;
    return `${i ? 'L' : 'M'} ${NL.sx(x).toFixed(1)} ${NL.sy(Math.min(450, x * x)).toFixed(1)}`;
  }).join(' ');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="Center of the x range" value={center} min={0} max={10} step={0.5} format={(v) => `x from ${fmt(v - 10)} to ${fmt(v + 10)}`} onChange={setCenter} />
        <Slider label="Noise (SD added to y)" value={noise} min={0} max={20} step={1} onChange={setNoise} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <svg viewBox={`0 0 ${NL.w} ${NL.h}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label={`Points on y = x squared, r = ${fmt(c.r, 3)}`}>
            <defs>
              <clipPath id="nl-clip">
                <rect x={NL.left} y={NL.top} width={NL.right - NL.left} height={NL.bottom - NL.top} />
              </clipPath>
            </defs>
            <Axes s={NL} xLabel="x" yLabel="y" />
            <path d={curve} fill="none" stroke="#c7d2fe" strokeWidth={3} clipPath="url(#nl-clip)" />
            {pts.map((p, i) => (
              <circle key={i} cx={NL.sx(p.x)} cy={NL.sy(p.y)} r={7} fill="#fbbf24" stroke="#92400e" strokeWidth={1.5} />
            ))}
            <text x={NL.right - 10} y={NL.top + 26} fontSize={24} fontWeight={700} textAnchor="end" fill="#334155">
              r = {fmt(c.r, 3)}
            </text>
          </svg>
        </div>
        <div className="min-w-0 space-y-4">
          <StatBox title="Two correlations, same data">
            <Stat label="r(x, y)" value={fmt(c.r, 3)} />
            <Stat label="r(x², y)" value={fmt(cSq.r, 3)} />
          </StatBox>
          <p className="text-sm text-ink-muted">
            {center === 0
              ? 'With x symmetric around 0, the left half slopes down and the right half slopes up. The two cancel exactly, so r = 0 even though y is completely determined by x.'
              : 'Shift the range away from 0 and the curve becomes mostly increasing, so r climbs toward 1. The relationship never changed; only the window did.'}
          </p>
          <p className="text-sm text-ink-muted">
            Correlating y with x² instead of x straightens the curve, so r(x², y) stays near 1. Pearson r only measures how well a straight line fits.
          </p>
        </div>
      </div>
    </div>
  );
}
