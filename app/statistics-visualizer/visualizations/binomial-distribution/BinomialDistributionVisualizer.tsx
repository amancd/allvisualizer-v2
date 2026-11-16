'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Plus, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { Panel, RangeField, Stat, Toggle } from '../_distributions/controls';
import { binomialPmfs, formatProb, niceStep, normalCdf, normalPdf } from '../_distributions/math';

const CHART_W = 800;
const CHART_H = 300;
const PLOT = { left: 56, right: 785, top: 34, bottom: 255 };

function PmfChart({
  n,
  p,
  pmf,
  a,
  b,
  showNormal,
  onPick,
}: {
  n: number;
  p: number;
  pmf: number[];
  a: number;
  b: number;
  showNormal: boolean;
  onPick: (k: number) => void;
}) {
  const mu = n * p;
  const sigma = Math.sqrt(n * p * (1 - p));
  const band = (PLOT.right - PLOT.left) / (n + 1);
  const xOf = (k: number) => PLOT.left + (k + 0.5) * band;
  const normalPeak = showNormal && sigma > 0 ? normalPdf(mu, mu, sigma) : 0;
  const yMax = Math.max(...pmf, Math.min(normalPeak, 1)) * 1.12;
  const yOf = (v: number) => PLOT.bottom - (v / yMax) * (PLOT.bottom - PLOT.top);
  const yStep = niceStep(yMax, 5);
  const yTicks = Array.from({ length: Math.floor(yMax / yStep) + 1 }, (_, i) => i * yStep);
  const xStep = Math.max(1, Math.round(niceStep(n, 12)));
  const xTicks = Array.from({ length: Math.floor(n / xStep) + 1 }, (_, i) => i * xStep);

  const curve =
    showNormal && sigma > 0
      ? Array.from({ length: 401 }, (_, i) => {
          const x = -0.5 + ((n + 1) * i) / 400;
          const y = Math.max(PLOT.top - 20, yOf(normalPdf(x, mu, sigma)));
          return `${i === 0 ? 'M' : 'L'} ${xOf(x).toFixed(1)} ${y.toFixed(1)}`;
        }).join(' ')
      : null;

  const handlePointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const { x } = toDrawingPoint(e, e.currentTarget);
    const k = Math.round((x - PLOT.left) / band - 0.5);
    if (k >= 0 && k <= n) onPick(k);
  };

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className={`${responsiveSurface} cursor-pointer rounded-xl border border-line bg-white`}
      role="img"
      aria-label={`Binomial PMF with n = ${n} and p = ${p}`}
      onPointerDown={handlePointer}
    >
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={PLOT.left} x2={PLOT.right} y1={yOf(t)} y2={yOf(t)} stroke="#e2e8f0" strokeWidth={1} />
          <text x={PLOT.left - 8} y={yOf(t) + 5} fontSize={14} textAnchor="end" fill="#64748b">
            {t.toFixed(yStep < 0.01 ? 3 : 2)}
          </text>
        </g>
      ))}
      {pmf.map((v, k) => {
        const inRange = k >= a && k <= b;
        const h = PLOT.bottom - yOf(v);
        return (
          <rect
            key={k}
            x={xOf(k) - band * 0.42}
            y={yOf(v)}
            width={band * 0.84}
            height={h}
            fill={inRange ? '#f59e0b' : '#a5b4fc'}
            stroke={inRange ? '#b45309' : '#6366f1'}
            strokeWidth={band > 10 ? 1 : 0}
          />
        );
      })}
      {curve && <path d={curve} fill="none" stroke="#dc2626" strokeWidth={2.5} />}
      {sigma > 0 && (
        <g>
          <line x1={xOf(mu - sigma)} x2={xOf(mu + sigma)} y1={PLOT.top - 14} y2={PLOT.top - 14} stroke="#0f766e" strokeWidth={2} />
          <line x1={xOf(mu - sigma)} x2={xOf(mu - sigma)} y1={PLOT.top - 20} y2={PLOT.top - 8} stroke="#0f766e" strokeWidth={2} />
          <line x1={xOf(mu + sigma)} x2={xOf(mu + sigma)} y1={PLOT.top - 20} y2={PLOT.top - 8} stroke="#0f766e" strokeWidth={2} />
          <text x={xOf(mu + sigma) + 6} y={PLOT.top - 9} fontSize={14} fill="#0f766e">
            μ ± σ
          </text>
        </g>
      )}
      <line x1={xOf(mu)} x2={xOf(mu)} y1={PLOT.top - 22} y2={PLOT.bottom} stroke="#312e81" strokeWidth={2} strokeDasharray="6 5" />
      <text x={xOf(mu) - 6} y={PLOT.top - 22} fontSize={15} textAnchor="end" fill="#312e81" fontWeight={700}>
        μ = {mu.toFixed(2)}
      </text>
      <line x1={PLOT.left} x2={PLOT.right} y1={PLOT.bottom} y2={PLOT.bottom} stroke="#334155" strokeWidth={1.5} />
      {xTicks.map((k) => (
        <g key={k}>
          <line x1={xOf(k)} x2={xOf(k)} y1={PLOT.bottom} y2={PLOT.bottom + 6} stroke="#334155" />
          <text x={xOf(k)} y={PLOT.bottom + 22} fontSize={14} textAnchor="middle" fill="#475569">
            {k}
          </text>
        </g>
      ))}
      <text x={(PLOT.left + PLOT.right) / 2} y={CHART_H - 6} fontSize={14} textAnchor="middle" fill="#475569">
        k (number of successes)
      </text>
    </svg>
  );
}

const BOARD_W = 800;
const BOARD_H = 560;
const TOP_Y = 36;
const BOARD_SPAN = 300;
const BIN_TOP = TOP_Y + BOARD_SPAN;
const BIN_BOTTOM = 540;
const MAX_IN_FLIGHT = 400;

type Ball = { prefix: Int16Array; pos: number };

function boardGeometry(n: number) {
  const dx = Math.min(48, 740 / (n + 1));
  const dy = BOARD_SPAN / n;
  const px = (r: number, j: number) => BOARD_W / 2 + (j - r / 2) * dx;
  const py = (r: number) => TOP_Y + r * dy;
  return { dx, dy, px, py };
}

function makeBall(n: number, p: number): Ball {
  const prefix = new Int16Array(n + 1);
  for (let r = 0; r < n; r++) prefix[r + 1] = prefix[r] + (Math.random() < p ? 1 : 0);
  return { prefix, pos: 0 };
}

function sampleBinomial(n: number, p: number) {
  let s = 0;
  for (let i = 0; i < n; i++) if (Math.random() < p) s++;
  return s;
}

function drawBoard(ctx: CanvasRenderingContext2D, n: number, pmf: number[], counts: number[], balls: Ball[]) {
  const { dx, dy, px, py } = boardGeometry(n);
  const total = counts.reduce((s, c) => s + c, 0);
  ctx.clearRect(0, 0, BOARD_W, BOARD_H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, BOARD_W, BOARD_H);

  const pegR = Math.max(1.5, Math.min(4, dx * 0.16));
  ctx.fillStyle = '#64748b';
  for (let r = 0; r < n; r++) {
    for (let j = 0; j <= r; j++) {
      ctx.beginPath();
      ctx.arc(px(r, j), py(r), pegR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const freqs = counts.map((c) => (total ? c / total : 0));
  const yMax = Math.max(...pmf, ...freqs) * 1.1 || 1;
  const binH = BIN_BOTTOM - BIN_TOP - 8;
  const left = px(n, 0) - dx / 2;
  const right = px(n, n) + dx / 2;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(left, BIN_TOP, right - left, BIN_BOTTOM - BIN_TOP);
  for (let k = 0; k <= n; k++) {
    const x = px(n, k);
    const h = (freqs[k] / yMax) * binH;
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(x - dx * 0.42, BIN_BOTTOM - h, dx * 0.84, h);
  }
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  for (let k = 0; k <= n + 1; k++) {
    const x = left + k * dx;
    ctx.beginPath();
    ctx.moveTo(x, BIN_TOP);
    ctx.lineTo(x, BIN_BOTTOM);
    ctx.stroke();
  }
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, BIN_BOTTOM);
  ctx.lineTo(right, BIN_BOTTOM);
  ctx.stroke();

  ctx.strokeStyle = '#dc2626';
  ctx.fillStyle = '#dc2626';
  ctx.lineWidth = 2.5;
  for (let k = 0; k <= n; k++) {
    const x = px(n, k);
    const y = BIN_BOTTOM - (pmf[k] / yMax) * binH;
    ctx.beginPath();
    ctx.moveTo(x - dx * 0.45, y);
    ctx.lineTo(x + dx * 0.45, y);
    ctx.stroke();
  }

  const ballR = Math.max(2.5, Math.min(7, dx * 0.28));
  const lift = pegR + ballR;
  ctx.fillStyle = '#f59e0b';
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1;
  for (const ball of balls) {
    const r = Math.floor(ball.pos);
    const f = ball.pos - r;
    let x: number;
    let y: number;
    if (r < n) {
      x = px(r, ball.prefix[r]) + (px(r + 1, ball.prefix[r + 1]) - px(r, ball.prefix[r])) * f;
      y = py(r) + dy * f - Math.sin(Math.PI * f) * dy * 0.45 - lift;
    } else {
      x = px(n, ball.prefix[n]);
      y = py(n) + f * 40 - lift;
    }
    ctx.beginPath();
    ctx.arc(x, y, ballR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = '#475569';
  ctx.font = '15px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${n} row${n === 1 ? '' : 's'} of pegs, ${n + 1} bins`, 16, 24);
  ctx.textAlign = 'right';
  ctx.fillText(`${total.toLocaleString('en-US')} balls landed`, BOARD_W - 16, 24);
}

export default function BinomialDistributionVisualizer() {
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.5);
  const [a, setA] = useState(3);
  const [b, setB] = useState(7);
  const [showNormal, setShowNormal] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [counts, setCounts] = useState<number[]>(() => new Array(11).fill(0));

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const countsRef = useRef<number[]>(new Array(11).fill(0));
  const pendingRef = useRef(0);
  const dirtyRef = useRef(true);

  const pmf = useMemo(() => binomialPmfs(n, p), [n, p]);
  const mu = n * p;
  const variance = n * p * (1 - p);
  const sigma = Math.sqrt(variance);
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const exact = pmf.slice(lo, hi + 1).reduce((s, v) => s + v, 0);
  const approx = sigma > 0 ? normalCdf((hi + 0.5 - mu) / sigma) - normalCdf((lo - 0.5 - mu) / sigma) : NaN;
  const modeRaw = (n + 1) * p;
  const modeInt = Math.round(modeRaw);
  const mode =
    p > 0 && p < 1 && Math.abs(modeRaw - modeInt) < 1e-9 && modeInt >= 1 && modeInt <= n
      ? `${modeInt - 1} and ${modeInt}`
      : String(Math.min(n, Math.floor(modeRaw + 1e-9)));

  const resetBoard = (size: number) => {
    ballsRef.current = [];
    pendingRef.current = 0;
    countsRef.current = new Array(size + 1).fill(0);
    dirtyRef.current = true;
    setCounts(countsRef.current.slice());
  };

  const changeN = (v: number) => {
    setN(v);
    setA((x) => Math.min(x, v));
    setB((x) => Math.min(x, v));
    resetBoard(v);
  };

  const changeP = (v: number) => {
    setP(v);
    resetBoard(n);
  };

  const pickEndpoint = (k: number) => {
    if (Math.abs(k - lo) <= Math.abs(k - hi)) {
      setA(k);
      setB(hi);
    } else {
      setA(lo);
      setB(k);
    }
  };

  const dropBalls = (count: number) => {
    pendingRef.current += count;
  };

  const dropInstant = (count: number) => {
    const next = countsRef.current.slice();
    for (let i = 0; i < count; i++) next[sampleBinomial(n, p)]++;
    countsRef.current = next;
    dirtyRef.current = true;
    setCounts(next.slice());
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let frame = 0;
    let last = performance.now();
    let spawnAcc = 0;
    dirtyRef.current = true;
    const levelsPerSecond = ((n + 1) / 1.6) * speed;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const balls = ballsRef.current;

      if (playing) spawnAcc += dt * 8 * speed;
      while (spawnAcc >= 1 && balls.length < MAX_IN_FLIGHT) {
        balls.push(makeBall(n, p));
        spawnAcc -= 1;
      }
      if (spawnAcc >= 1) spawnAcc = 0;
      if (pendingRef.current > 0 && balls.length < MAX_IN_FLIGHT) {
        const room = Math.min(pendingRef.current, MAX_IN_FLIGHT - balls.length, Math.max(1, Math.ceil(dt * 40 * speed)));
        for (let i = 0; i < room; i++) {
          const ball = makeBall(n, p);
          ball.pos = -i * 0.35;
          balls.push(ball);
        }
        pendingRef.current -= room;
      }

      let landed = false;
      if (balls.length) {
        dirtyRef.current = true;
        const keep: Ball[] = [];
        for (const ball of balls) {
          ball.pos += dt * levelsPerSecond;
          if (ball.pos >= n + 1) {
            countsRef.current[ball.prefix[n]]++;
            landed = true;
          } else {
            keep.push(ball);
          }
        }
        ballsRef.current = keep;
      }
      if (landed) setCounts(countsRef.current.slice());
      if (dirtyRef.current) {
        drawBoard(
          ctx,
          n,
          pmf,
          countsRef.current,
          ballsRef.current.filter((ball) => ball.pos >= 0),
        );
        dirtyRef.current = ballsRef.current.length > 0;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [n, p, pmf, playing, speed]);

  const total = counts.reduce((s, c) => s + c, 0);
  const sampleMean = total ? counts.reduce((s, c, k) => s + c * k, 0) / total : null;
  const sampleVar = total > 1 && sampleMean !== null ? counts.reduce((s, c, k) => s + c * (k - sampleMean) ** 2, 0) / (total - 1) : null;
  const rangeFreq = total ? counts.slice(lo, hi + 1).reduce((s, c) => s + c, 0) / total : null;

  return (
    <div className="space-y-6 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <RangeField label="Trials n" value={n} min={1} max={50} onChange={changeN} />
        <RangeField label="Success probability p" value={p} min={0} max={1} step={0.01} onChange={changeP} display={p.toFixed(2)} />
        <RangeField label="Range start a" value={a} min={0} max={n} onChange={(v) => { setA(v); if (v > b) setB(v); }} />
        <RangeField label="Range end b" value={b} min={0} max={n} onChange={(v) => { setB(v); if (v < a) setA(v); }} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-ink">
              Probability mass function
              <span className="ml-2 font-normal text-ink-muted">(tap a bar to move the nearest end of the range)</span>
            </p>
            <Toggle checked={showNormal} onChange={setShowNormal}>
              Normal approximation
            </Toggle>
          </div>
          <PmfChart n={n} p={p} pmf={pmf} a={lo} b={hi} showNormal={showNormal} onPick={pickEndpoint} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-amber-500" />k in [a, b]</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-indigo-300" />other k</span>
            {showNormal && <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 bg-red-600" />N(np, np(1 − p))</span>}
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <Panel title="Distribution">
            <dl className="grid grid-cols-2 gap-2">
              <Stat label="Mean μ = np" value={mu.toFixed(3)} />
              <Stat label="Variance np(1 − p)" value={variance.toFixed(3)} />
              <Stat label="Std. dev. σ" value={sigma.toFixed(3)} />
              <Stat label="Mode" value={mode} />
            </dl>
          </Panel>
          <Panel title={`P(${lo} ≤ X ≤ ${hi})`}>
            <dl className="grid grid-cols-1 gap-2">
              <Stat label="Exact (sum of the shaded bars)" value={formatProb(exact, 6)} tone="text-amber-700" />
              <Stat
                label="Normal approx. with continuity correction"
                value={Number.isNaN(approx) ? 'n/a (σ = 0)' : formatProb(approx, 6)}
                hint={Number.isNaN(approx) ? undefined : `error ${(approx - exact >= 0 ? '+' : '') + (approx - exact).toFixed(4)}`}
              />
            </dl>
            <p className="mt-2 text-xs text-ink-muted">
              np = {mu.toFixed(1)}, n(1 − p) = {(n - mu).toFixed(1)}.{' '}
              {mu >= 10 && n - mu >= 10 ? 'Both are at least 10, so the normal approximation should be good.' : 'The normal approximation is rough unless np and n(1 − p) are both at least about 10.'}
            </p>
          </Panel>
        </div>
      </div>

      <div className="space-y-3 border-t border-line pt-5">
        <div>
          <p className="text-sm font-semibold text-ink">Galton board</p>
          <p className="text-sm text-ink-muted">
            Each ball meets {n} peg{n === 1 ? '' : 's'} and bounces right with probability p = {p.toFixed(2)}. Its bin is the number of rights, so the bins follow
            Binomial(n, p). Red lines mark the PMF; blue bars are the observed share of balls in each bin.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => dropBalls(1)} leftIcon={<Plus className="h-4 w-4" />}>
            Drop 1
          </Button>
          <Button size="sm" variant="secondary" onClick={() => dropBalls(50)} leftIcon={<Plus className="h-4 w-4" />}>
            Drop 50
          </Button>
          <Button size="sm" variant="secondary" onClick={() => dropInstant(1000)} leftIcon={<Zap className="h-4 w-4" />}>
            Add 1000 instantly
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPlaying((v) => !v)}
            leftIcon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          >
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => resetBoard(n)} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset
          </Button>
          <div className="w-full sm:w-48">
            <RangeField label="Speed" value={speed} min={0.5} max={4} step={0.5} onChange={setSpeed} display={`${speed}×`} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <canvas ref={canvasRef} width={BOARD_W} height={BOARD_H} className={`${responsiveSurface} rounded-xl border border-line lg:col-span-2`} />
          <Panel title="Observed vs theory">
            <dl className="grid grid-cols-1 gap-2">
              <Stat label="Balls landed" value={total.toLocaleString('en-US')} />
              <Stat label="Sample mean" value={sampleMean === null ? '–' : sampleMean.toFixed(3)} hint={`np = ${mu.toFixed(3)}`} />
              <Stat label="Sample variance" value={sampleVar === null ? '–' : sampleVar.toFixed(3)} hint={`np(1 − p) = ${variance.toFixed(3)}`} />
              <Stat label={`Share in [${lo}, ${hi}]`} value={rangeFreq === null ? '–' : rangeFreq.toFixed(4)} hint={`exact ${exact.toFixed(4)}`} />
            </dl>
            <p className="mt-3 text-xs text-ink-muted">With more balls the blue bars settle onto the red PMF lines: the law of large numbers at work on every bin.</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
