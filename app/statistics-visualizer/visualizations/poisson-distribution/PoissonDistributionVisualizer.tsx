'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { Panel, RangeField, Segmented, Stat } from '../_distributions/controls';
import { binomialPmf, formatProb, niceStep, poissonCdf, poissonPmf, sampleExponential } from '../_distributions/math';

const CHART_W = 800;
const CHART_H = 280;
const PLOT = { left: 56, right: 785, top: 20, bottom: 235 };

function kMaxFor(lambda: number) {
  return Math.max(10, Math.ceil(lambda + 4.5 * Math.sqrt(lambda) + 2));
}

type Series = { values: number[]; fill: string; stroke: string; highlight?: (k: number) => string | null };

function BarChart({
  series,
  markers,
  kMax,
  label,
  onPick,
}: {
  series: Series[];
  markers?: number[];
  kMax: number;
  label: string;
  onPick?: (k: number) => void;
}) {
  const band = (PLOT.right - PLOT.left) / (kMax + 1);
  const xOf = (k: number) => PLOT.left + (k + 0.5) * band;
  const peak = Math.max(...series.flatMap((s) => s.values.slice(0, kMax + 1)), ...(markers ?? []).slice(0, kMax + 1), 1e-9);
  const yMax = peak * 1.1;
  const yOf = (v: number) => PLOT.bottom - (v / yMax) * (PLOT.bottom - PLOT.top);
  const yStep = niceStep(yMax, 5);
  const yTicks = Array.from({ length: Math.floor(yMax / yStep) + 1 }, (_, i) => i * yStep);
  const xStep = Math.max(1, Math.round(niceStep(kMax, 12)));
  const xTicks = Array.from({ length: Math.floor(kMax / xStep) + 1 }, (_, i) => i * xStep);
  const groupW = band * 0.84;
  const barW = groupW / series.length;

  const handlePointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const { x } = toDrawingPoint(e, e.currentTarget);
    const k = Math.round((x - PLOT.left) / band - 0.5);
    if (k >= 0 && k <= kMax) onPick(k);
  };

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className={`${responsiveSurface} rounded-xl border border-line bg-white ${onPick ? 'cursor-pointer' : ''}`}
      role="img"
      aria-label={label}
      onPointerDown={handlePointer}
    >
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={PLOT.left} x2={PLOT.right} y1={yOf(t)} y2={yOf(t)} stroke="#e2e8f0" />
          <text x={PLOT.left - 8} y={yOf(t) + 5} fontSize={14} textAnchor="end" fill="#64748b">
            {t.toFixed(yStep < 0.01 ? 3 : 2)}
          </text>
        </g>
      ))}
      {series.map((s, si) =>
        s.values.slice(0, kMax + 1).map((v, k) => {
          const custom = s.highlight?.(k);
          return (
            <rect
              key={`${si}-${k}`}
              x={xOf(k) - groupW / 2 + si * barW}
              y={yOf(v)}
              width={barW}
              height={PLOT.bottom - yOf(v)}
              fill={custom ?? s.fill}
              stroke={s.stroke}
              strokeWidth={barW > 8 ? 1 : 0}
            />
          );
        }),
      )}
      {markers?.slice(0, kMax + 1).map((v, k) => (
        <line key={k} x1={xOf(k) - band * 0.45} x2={xOf(k) + band * 0.45} y1={yOf(v)} y2={yOf(v)} stroke="#dc2626" strokeWidth={3} />
      ))}
      <line x1={PLOT.left} x2={PLOT.right} y1={PLOT.bottom} y2={PLOT.bottom} stroke="#334155" strokeWidth={1.5} />
      {xTicks.map((k) => (
        <g key={k}>
          <line x1={xOf(k)} x2={xOf(k)} y1={PLOT.bottom} y2={PLOT.bottom + 6} stroke="#334155" />
          <text x={xOf(k)} y={PLOT.bottom + 22} fontSize={14} textAnchor="middle" fill="#475569">
            {k}
          </text>
        </g>
      ))}
      <text x={(PLOT.left + PLOT.right) / 2} y={CHART_H - 4} fontSize={14} textAnchor="middle" fill="#475569">
        k (number of events)
      </text>
    </svg>
  );
}

const TL_W = 800;
const TL_H = 170;
const TL_LEFT = 30;
const TL_RIGHT = 770;
const TL_Y = 100;
const BLOCK = 10;

type Sim = { t: number; next: number; arrivals: number[]; blockCounts: number[]; current: number };

function freshSim(): Sim {
  return { t: 0, next: Infinity, arrivals: [], blockCounts: [], current: 0 };
}

function countInUnit(lambda: number) {
  let t = sampleExponential(lambda);
  let c = 0;
  while (t < 1) {
    c++;
    t += sampleExponential(lambda);
  }
  return c;
}

function addCounts(prev: number[], counts: number[]) {
  const next = prev.slice();
  for (const c of counts) {
    while (next.length <= c) next.push(0);
    next[c]++;
  }
  return next;
}

function drawTimeline(ctx: CanvasRenderingContext2D, sim: Sim) {
  const unit = (TL_RIGHT - TL_LEFT) / BLOCK;
  const blockStart = Math.floor(sim.t / BLOCK) * BLOCK;
  const xOf = (t: number) => TL_LEFT + (t - blockStart) * unit;
  ctx.clearRect(0, 0, TL_W, TL_H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, TL_W, TL_H);

  for (let i = 0; i < BLOCK; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#f1f5f9' : '#f8fafc';
    ctx.fillRect(TL_LEFT + i * unit, TL_Y - 50, unit, 70);
  }
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(TL_LEFT, TL_Y);
  ctx.lineTo(TL_RIGHT, TL_Y);
  ctx.stroke();
  ctx.font = '14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  for (let i = 0; i <= BLOCK; i++) {
    const x = TL_LEFT + i * unit;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, TL_Y - 50);
    ctx.lineTo(x, TL_Y + 26);
    ctx.stroke();
    ctx.fillStyle = '#475569';
    ctx.fillText(String(blockStart + i), x, TL_Y + 42);
  }

  ctx.fillStyle = '#7c3aed';
  ctx.font = 'bold 18px system-ui, sans-serif';
  sim.blockCounts.forEach((c, i) => {
    ctx.fillText(String(c), TL_LEFT + (i + 0.5) * unit, TL_Y - 60 + 2);
  });

  ctx.fillStyle = '#f59e0b';
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1;
  for (const a of sim.arrivals) {
    ctx.beginPath();
    ctx.arc(xOf(a), TL_Y - 14, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  const cx = xOf(sim.t);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, TL_Y - 50);
  ctx.lineTo(cx, TL_Y + 20);
  ctx.stroke();
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText(`${sim.current}`, Math.min(TL_RIGHT - 10, cx + 14), TL_Y + 20);

  ctx.fillStyle = '#475569';
  ctx.font = '14px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`time t = ${sim.t.toFixed(2)}`, TL_LEFT, 22);
  ctx.textAlign = 'right';
  ctx.fillText('purple: events per completed interval', TL_RIGHT, 22);
}

const SPEEDS = [
  { value: 0.5, label: '0.5×' },
  { value: 1, label: '1×' },
  { value: 3, label: '3×' },
  { value: 10, label: '10×' },
];

const COMPARE_NS = [1, 2, 5, 10, 20, 50, 100, 1000];

function tvDistance(n: number, lambda: number) {
  const p = lambda / n;
  let s = 0;
  for (let k = 0; k <= n; k++) s += Math.abs(binomialPmf(n, p, k) - poissonPmf(lambda, k));
  s += 1 - poissonCdf(lambda, n);
  return s / 2;
}

export default function PoissonDistributionVisualizer() {
  const [lambda, setLambda] = useState(4);
  const [k, setK] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [hist, setHist] = useState<number[]>([]);
  const [compareN, setCompareN] = useState(10);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim>(freshSim());
  const histRef = useRef<number[]>([]);
  const dirtyRef = useRef(true);

  const kMax = kMaxFor(lambda);
  const pmf = useMemo(() => Array.from({ length: kMax + 1 }, (_, i) => poissonPmf(lambda, i)), [lambda, kMax]);
  const kk = Math.min(k, kMax);
  const pEq = poissonPmf(lambda, kk);
  const pLe = poissonCdf(lambda, kk);
  const pGt = 1 - pLe;

  const resetSim = () => {
    simRef.current = freshSim();
    histRef.current = [];
    dirtyRef.current = true;
    setHist([]);
  };

  const changeLambda = (v: number) => {
    setLambda(v);
    setK((x) => Math.min(x, kMaxFor(v)));
    resetSim();
  };

  const addInstant = (intervals: number) => {
    histRef.current = addCounts(histRef.current, Array.from({ length: intervals }, () => countInUnit(lambda)));
    setHist(histRef.current);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0;
    let last = performance.now();
    dirtyRef.current = true;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const sim = simRef.current;
      if (playing) {
        if (sim.next === Infinity) sim.next = sim.t + sampleExponential(lambda);
        const target = sim.t + dt * speed;
        const finished: number[] = [];
        while (sim.t < target) {
          const boundary = Math.floor(sim.t) + 1;
          const stop = Math.min(target, boundary, sim.next);
          sim.t = stop;
          if (stop === sim.next) {
            sim.current++;
            sim.arrivals.push(stop);
            sim.next = stop + sampleExponential(lambda);
          }
          if (stop === boundary) {
            finished.push(sim.current);
            sim.blockCounts.push(sim.current);
            sim.current = 0;
            if (boundary % BLOCK === 0) {
              sim.blockCounts = [];
              sim.arrivals = [];
            }
          }
        }
        if (finished.length) {
          histRef.current = addCounts(histRef.current, finished);
          setHist(histRef.current);
        }
        dirtyRef.current = true;
      }
      if (dirtyRef.current) {
        drawTimeline(ctx, sim);
        dirtyRef.current = false;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [lambda, playing, speed]);

  const total = hist.reduce((s, c) => s + c, 0);
  const freqs = Array.from({ length: kMax + 1 }, (_, i) => (total ? (hist[i] ?? 0) / total : 0));
  const sampleMean = total ? hist.reduce((s, c, i) => s + c * i, 0) / total : null;
  const sampleVar = total > 1 && sampleMean !== null ? hist.reduce((s, c, i) => s + c * (i - sampleMean) ** 2, 0) / (total - 1) : null;

  const validNs = useMemo(() => COMPARE_NS.filter((n) => n >= lambda), [lambda]);
  const effN = compareN >= lambda ? compareN : validNs[0];
  const binom = useMemo(() => Array.from({ length: kMax + 1 }, (_, i) => binomialPmf(effN, lambda / effN, i)), [effN, lambda, kMax]);
  const tvRows = useMemo(() => validNs.map((n) => ({ n, tv: tvDistance(n, lambda) })), [validNs, lambda]);
  const tvCurrent = tvRows.find((r) => r.n === effN)?.tv ?? 0;

  return (
    <div className="space-y-6 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RangeField label="Rate λ (average events per interval)" value={lambda} min={0.1} max={15} step={0.1} onChange={changeLambda} display={lambda.toFixed(1)} />
        <RangeField label="Highlighted count k" value={kk} min={0} max={kMax} onChange={setK} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          <p className="text-sm font-medium text-ink">
            Poisson PMF, λ = {lambda.toFixed(1)}
            <span className="ml-2 font-normal text-ink-muted">(tap a bar to pick k)</span>
          </p>
          <BarChart
            kMax={kMax}
            label={`Poisson PMF with rate ${lambda.toFixed(1)}`}
            onPick={setK}
            series={[
              {
                values: pmf,
                fill: '#a5b4fc',
                stroke: '#6366f1',
                highlight: (i) => (i === kk ? '#d97706' : i < kk ? '#fcd34d' : null),
              },
            ]}
          />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-amber-600" />X = k</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-amber-300" />X &lt; k</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-indigo-300" />X &gt; k</span>
          </div>
        </div>
        <Panel title="Probabilities">
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <Stat label={`P(X = ${kk})`} value={formatProb(pEq, 5)} tone="text-amber-700" />
            <Stat label={`P(X ≤ ${kk})`} value={formatProb(pLe, 5)} />
            <Stat label={`P(X > ${kk})`} value={formatProb(pGt, 5)} />
            <Stat label="Mean = variance = λ" value={lambda.toFixed(1)} hint={`σ = ${Math.sqrt(lambda).toFixed(3)}`} />
          </dl>
          <p className="mt-3 font-mono text-xs text-ink-muted">
            P(X = {kk}) = e<sup>−{lambda.toFixed(1)}</sup> · {lambda.toFixed(1)}
            <sup>{kk}</sup> / {kk}!
          </p>
        </Panel>
      </div>

      <div className="space-y-3 border-t border-line pt-5">
        <div>
          <p className="text-sm font-semibold text-ink">Random arrivals in time</p>
          <p className="text-sm text-ink-muted">
            Events arrive one at a time with exponential gaps of mean 1/λ = {(1 / lambda).toFixed(2)}. The count in each unit interval is a draw from
            Poisson(λ). The histogram below collects those counts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="primary" onClick={() => setPlaying((v) => !v)} leftIcon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => addInstant(1000)} leftIcon={<Zap className="h-4 w-4" />}>
            Add 1000 intervals
          </Button>
          <Button size="sm" variant="ghost" onClick={resetSim} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset
          </Button>
          <Segmented label="Speed" options={SPEEDS} value={speed} onChange={setSpeed} />
        </div>
        <canvas ref={canvasRef} width={TL_W} height={TL_H} className={`${responsiveSurface} rounded-xl border border-line`} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-2">
            <p className="text-sm font-medium text-ink">
              Counts per interval
              <span className="ml-2 font-normal text-ink-muted">(blue: observed share, red: Poisson PMF)</span>
            </p>
            <BarChart kMax={kMax} label="Histogram of simulated counts per interval" series={[{ values: freqs, fill: '#60a5fa', stroke: '#2563eb' }]} markers={pmf} />
          </div>
          <Panel title="Observed vs theory">
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
              <Stat label="Intervals counted" value={total.toLocaleString('en-US')} />
              <Stat label="Mean count" value={sampleMean === null ? '–' : sampleMean.toFixed(3)} hint={`λ = ${lambda.toFixed(1)}`} />
              <Stat label="Variance of counts" value={sampleVar === null ? '–' : sampleVar.toFixed(3)} hint={`λ = ${lambda.toFixed(1)}`} />
            </dl>
          </Panel>
        </div>
      </div>

      <div className="space-y-3 border-t border-line pt-5">
        <div>
          <p className="text-sm font-semibold text-ink">Binomial(n, λ/n) → Poisson(λ)</p>
          <p className="text-sm text-ink-muted">
            Split the interval into n slots, each holding an event with probability λ/n. The count is Binomial(n, λ/n), and as n grows it
            converges to Poisson(λ).
          </p>
        </div>
        <Segmented
          label="Slots n"
          options={COMPARE_NS.map((n) => ({ value: n, label: String(n), disabled: n < lambda }))}
          value={effN}
          onChange={setCompareN}
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-2">
            <BarChart
              kMax={kMax}
              label={`Binomial with n = ${effN} compared with Poisson`}
              series={[
                { values: binom, fill: '#818cf8', stroke: '#4338ca' },
                { values: pmf, fill: '#fbbf24', stroke: '#b45309' },
              ]}
            />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-indigo-400" />Binomial({effN}, {(lambda / effN).toFixed(effN >= 100 ? 4 : 3)})</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-amber-400" />Poisson({lambda.toFixed(1)})</span>
            </div>
          </div>
          <Panel title="How close?">
            <dl className="grid grid-cols-1 gap-2">
              <Stat label="Total variation distance" value={tvCurrent.toFixed(4)} hint={`bound λ²/n = ${((lambda * lambda) / effN).toFixed(3)}`} />
              <Stat label="Binomial variance n·p(1 − p)" value={(lambda * (1 - lambda / effN)).toFixed(3)} hint={`Poisson: ${lambda.toFixed(1)}`} />
            </dl>
            <table className="mt-3 w-full text-xs">
              <thead>
                <tr className="text-left text-ink-muted">
                  <th className="py-1 font-medium">n</th>
                  <th className="py-1 text-right font-medium">distance</th>
                </tr>
              </thead>
              <tbody className="font-mono text-ink">
                {tvRows.map((r) => (
                  <tr key={r.n} className={r.n === effN ? 'font-semibold text-brand-700' : ''}>
                    <td className="py-0.5">{r.n}</td>
                    <td className="py-0.5 text-right">{r.tv.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        </div>
      </div>
    </div>
  );
}
