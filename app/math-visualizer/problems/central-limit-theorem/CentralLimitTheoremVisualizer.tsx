'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';

// ---------- populations ----------

type Discrete = { values: number[]; probs: number[] };

interface Population {
  label: string;
  mean: number;
  sd: number;
  sample: () => number;
  /** Probability density for continuous populations (used to draw the population chart). */
  density?: (x: number) => number;
  /** Values and probabilities for discrete populations. */
  discrete?: Discrete;
}

function discretePopulation(label: string, values: number[], probs: number[]): Population {
  const mean = values.reduce((s, v, i) => s + v * probs[i], 0);
  const variance = values.reduce((s, v, i) => s + (v - mean) ** 2 * probs[i], 0);
  return {
    label,
    mean,
    sd: Math.sqrt(variance),
    discrete: { values, probs },
    sample: () => {
      // Inverse-CDF sampling.
      let u = Math.random();
      for (let i = 0; i < values.length; i++) {
        u -= probs[i];
        if (u < 0) return values[i];
      }
      return values[values.length - 1];
    },
  };
}

const POPULATIONS = {
  uniform: {
    label: 'Uniform',
    mean: 5,
    sd: 10 / Math.sqrt(12),
    sample: () => Math.random() * 10,
    density: (x: number) => (x >= 0 && x <= 10 ? 0.1 : 0),
  },
  exponential: {
    // Rate λ = 0.5, so mean = sd = 1/λ = 2. Strongly right-skewed.
    label: 'Exponential',
    mean: 2,
    sd: 2,
    sample: () => -2 * Math.log(1 - Math.random()),
    density: (x: number) => (x >= 0 ? 0.5 * Math.exp(-0.5 * x) : 0),
  },
  bimodal: {
    // Half the time uniform on [0, 3], half the time uniform on [7, 10].
    // Var = within-group 9/12 + between-group 3.5² = 13.
    label: 'Bimodal',
    mean: 5,
    sd: Math.sqrt(13),
    sample: () => (Math.random() < 0.5 ? Math.random() * 3 : 7 + Math.random() * 3),
    density: (x: number) => ((x >= 0 && x <= 3) || (x >= 7 && x <= 10) ? 1 / 6 : 0),
  },
  die: discretePopulation('Fair die', [1, 2, 3, 4, 5, 6], [1, 1, 1, 1, 1, 1].map((p) => p / 6)),
  loaded: discretePopulation('Loaded die', [1, 2, 3, 4, 5, 6], [0.4, 0.25, 0.15, 0.1, 0.06, 0.04]),
} satisfies Record<string, Population>;

type PopulationKey = keyof typeof POPULATIONS;
const POPULATION_KEYS = Object.keys(POPULATIONS) as PopulationKey[];
const SAMPLE_SIZES = [1, 2, 5, 10, 30, 50, 100];
const MAX_MEANS = 20000;
const AUTO_PER_FRAME = 10;

/** Draw `count` samples of size n and return their means, plus the last sample's values. */
function drawMeans(pop: Population, n: number, count: number) {
  const means: number[] = [];
  let last: number[] = [];
  for (let c = 0; c < count; c++) {
    const values = Array.from({ length: n }, pop.sample);
    means.push(values.reduce((s, v) => s + v, 0) / n);
    last = values;
  }
  return { means, last };
}

/**
 * Histogram bins for the sample means. A die's sample mean can only be a multiple of 1/n,
 * so for discrete populations each bin holds the same number of those values (centered on them).
 */
function binning(pop: Population, n: number) {
  if (pop.discrete) {
    const perBin = Math.ceil(0.1 * n);
    return { width: perBin / n, offset: -0.5 / n };
  }
  return { width: 0.1, offset: 0 };
}

// ---------- drawing ----------

const WIDTH = 800;
const X_MIN = 0;
const X_MAX = 10;
const PAD = { left: 30, right: 770 };
const sx = (x: number) => PAD.left + ((x - X_MIN) / (X_MAX - X_MIN)) * (PAD.right - PAD.left);
const normalPdf = (x: number, mu: number, sd: number) => Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));

function Axis({ y }: { y: number }) {
  return (
    <g>
      <line x1={PAD.left} y1={y} x2={PAD.right} y2={y} stroke="#334155" strokeWidth={2} />
      {Array.from({ length: 11 }, (_, i) => (
        <g key={i}>
          <line x1={sx(i)} y1={y} x2={sx(i)} y2={y + 7} stroke="#334155" strokeWidth={2} />
          <text x={sx(i)} y={y + 30} fontSize={20} textAnchor="middle" fill="#475569">
            {i}
          </text>
        </g>
      ))}
    </g>
  );
}

const POP_HEIGHT = 230;
const POP_BASE = 185;
const POP_TOP = 20;

function PopulationChart({ pop, lastSample }: { pop: Population; lastSample: number[] }) {
  const span = POP_BASE - POP_TOP;
  let shape: React.ReactNode;
  if (pop.discrete) {
    const { values, probs } = pop.discrete;
    const maxP = Math.max(...probs);
    shape = values.map((v, i) => {
      const h = (probs[i] / maxP) * span;
      return <rect key={v} x={sx(v - 0.3)} y={POP_BASE - h} width={sx(0.6) - sx(0)} height={h} fill="#c7d2fe" stroke="#6366f1" strokeWidth={2} />;
    });
  } else {
    const density = pop.density ?? (() => 0);
    const steps = 400;
    const xs = Array.from({ length: steps + 1 }, (_, i) => X_MIN + ((X_MAX - X_MIN) * i) / steps);
    const maxD = Math.max(...xs.map(density));
    const pts = xs.map((x) => `${sx(x).toFixed(1)},${(POP_BASE - (density(x) / maxD) * span).toFixed(1)}`);
    shape = <polygon points={`${sx(X_MIN)},${POP_BASE} ${pts.join(' ')} ${sx(X_MAX)},${POP_BASE}`} fill="#c7d2fe" stroke="#6366f1" strokeWidth={2} strokeLinejoin="round" />;
  }

  // Stack the dots of the last sample so repeated die values stay visible.
  const seen = new Map<number, number>();
  const dots = lastSample
    .filter((v) => v >= X_MIN && v <= X_MAX)
    .map((v) => {
      const key = Math.round(v * 20);
      const level = seen.get(key) ?? 0;
      seen.set(key, level + 1);
      return { x: v, level };
    });
  const lastMean = lastSample.length ? lastSample.reduce((s, v) => s + v, 0) / lastSample.length : null;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${POP_HEIGHT}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label={`Population: ${pop.label}`}>
      {shape}
      <line x1={sx(pop.mean)} y1={POP_TOP - 5} x2={sx(pop.mean)} y2={POP_BASE} stroke="#312e81" strokeWidth={2} strokeDasharray="6 5" />
      <text x={sx(pop.mean) + 8} y={POP_TOP + 14} fontSize={20} fill="#312e81" fontWeight={700}>
        μ
      </text>
      {dots.map((d, i) => (
        <circle key={i} cx={sx(d.x)} cy={POP_BASE - 8 - Math.min(d.level, 15) * 10} r={5} fill="#f59e0b" stroke="#92400e" strokeWidth={1} opacity={0.85} />
      ))}
      {lastMean !== null && lastMean <= X_MAX && (
        <polygon points={`${sx(lastMean)},${POP_BASE - 2} ${sx(lastMean) - 10},${POP_BASE - 20} ${sx(lastMean) + 10},${POP_BASE - 20}`} fill="#dc2626" />
      )}
      <Axis y={POP_BASE} />
    </svg>
  );
}

const HIST_HEIGHT = 380;
const HIST_BASE = 335;
const HIST_TOP = 20;

function MeansChart({ pop, n, means, lastMean }: { pop: Population; n: number; means: number[]; lastMean: number | null }) {
  const { width, offset } = binning(pop, n);
  const counts = useMemo(() => {
    const map = new Map<number, number>();
    for (const m of means) {
      const i = Math.floor((m - offset) / width);
      map.set(i, (map.get(i) ?? 0) + 1);
    }
    return map;
  }, [means, width, offset]);

  const se = pop.sd / Math.sqrt(n);
  const total = means.length;
  // Expected count in a bin of this width: N × width × density.
  const expected = (x: number) => total * width * normalPdf(x, pop.mean, se);
  const maxCount = Math.max(1, ...counts.values(), expected(pop.mean));
  const sy = (c: number) => HIST_BASE - (c / (maxCount * 1.08)) * (HIST_BASE - HIST_TOP);

  const curve = Array.from({ length: 501 }, (_, i) => {
    const x = X_MIN + ((X_MAX - X_MIN) * i) / 500;
    return `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(1)} ${sy(expected(x)).toFixed(1)}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HIST_HEIGHT}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label={`Histogram of ${total} sample means`}>
      {[...counts.entries()].map(([i, c]) => {
        const left = Math.max(X_MIN, offset + i * width);
        const right = Math.min(X_MAX, offset + (i + 1) * width);
        if (right <= left) return null;
        return <rect key={i} x={sx(left)} y={sy(c)} width={sx(right) - sx(left)} height={HIST_BASE - sy(c)} fill="#60a5fa" stroke="white" strokeWidth={0.5} />;
      })}
      {total > 0 && <path d={curve} fill="none" stroke="#dc2626" strokeWidth={3} />}
      <line x1={sx(pop.mean)} y1={HIST_TOP} x2={sx(pop.mean)} y2={HIST_BASE} stroke="#312e81" strokeWidth={1.5} strokeDasharray="6 5" />
      {lastMean !== null && lastMean <= X_MAX && (
        <polygon points={`${sx(lastMean)},${HIST_BASE - 2} ${sx(lastMean) - 10},${HIST_BASE - 20} ${sx(lastMean) + 10},${HIST_BASE - 20}`} fill="#dc2626" />
      )}
      {total === 0 && (
        <text x={WIDTH / 2} y={HIST_BASE / 2} fontSize={24} textAnchor="middle" fill="#94a3b8">
          Draw some samples to build the histogram
        </text>
      )}
      <Axis y={HIST_BASE} />
    </svg>
  );
}

// ---------- main component ----------

function Stat({ label, value, hint }: { label: React.ReactNode; value: string; hint?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-mono font-semibold text-ink">
        {value}
        {hint && <span className="ml-1 text-xs font-normal text-ink-faint">{hint}</span>}
      </dd>
    </div>
  );
}

export default function CentralLimitTheoremVisualizer() {
  const [popKey, setPopKey] = useState<PopulationKey>('exponential');
  const [n, setN] = useState(5);
  const [means, setMeans] = useState<number[]>([]);
  const [lastSample, setLastSample] = useState<number[]>([]);
  const [running, setRunning] = useState(false);

  const pop: Population = POPULATIONS[popKey];
  const full = means.length >= MAX_MEANS;
  const autoDrawing = running && !full;

  const reset = () => {
    setMeans([]);
    setLastSample([]);
    setRunning(false);
  };

  const draw = (count: number) => {
    const { means: fresh, last } = drawMeans(pop, n, count);
    setMeans((prev) => [...prev, ...fresh].slice(0, MAX_MEANS));
    setLastSample(last);
  };

  // Auto-draw a few samples every animation frame while running.
  useEffect(() => {
    if (!autoDrawing) return;
    let frame = 0;
    const tick = () => {
      const { means: fresh, last } = drawMeans(pop, n, AUTO_PER_FRAME);
      setMeans((prev) => [...prev, ...fresh].slice(0, MAX_MEANS));
      setLastSample(last);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [autoDrawing, pop, n]);

  const stats = useMemo(() => {
    const N = means.length;
    if (N === 0) return null;
    const mean = means.reduce((s, m) => s + m, 0) / N;
    const sd = N > 1 ? Math.sqrt(means.reduce((s, m) => s + (m - mean) ** 2, 0) / (N - 1)) : null;
    return { mean, sd };
  }, [means]);

  const se = pop.sd / Math.sqrt(n);
  const lastMean = lastSample.length ? lastSample.reduce((s, v) => s + v, 0) / lastSample.length : null;

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Population</p>
          <div className="flex flex-wrap gap-2">
            {POPULATION_KEYS.map((key) => (
              <Button
                key={key}
                size="sm"
                variant={popKey === key ? 'primary' : 'outline'}
                aria-pressed={popKey === key}
                onClick={() => {
                  setPopKey(key);
                  reset();
                }}
              >
                {POPULATIONS[key].label}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Sample size n</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SIZES.map((size) => (
              <Button
                key={size}
                size="sm"
                variant={n === size ? 'primary' : 'outline'}
                aria-pressed={n === size}
                onClick={() => {
                  setN(size);
                  reset();
                }}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => draw(1)} disabled={full}>
            Draw 1 sample
          </Button>
          <Button size="sm" variant="secondary" onClick={() => draw(100)} disabled={full}>
            Draw 100
          </Button>
          <Button size="sm" variant="secondary" onClick={() => draw(1000)} disabled={full}>
            Draw 1000
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRunning((r) => !r)}
            disabled={full}
            leftIcon={autoDrawing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          >
            {autoDrawing ? 'Pause' : 'Auto-draw'}
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Population: {pop.label}
              <span className="ml-2 font-normal text-ink-muted">(orange dots: the last sample, red marker: its mean)</span>
            </p>
            <PopulationChart pop={pop} lastSample={lastSample} />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Sample means
              <span className="ml-2 font-normal text-ink-muted">(red curve: predicted normal N(μ, σ/√n))</span>
            </p>
            <MeansChart pop={pop} n={n} means={means} lastMean={lastMean} />
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="mb-2 font-semibold text-ink">Population</p>
            <dl className="space-y-1">
              <Stat label="Mean μ" value={pop.mean.toFixed(3)} />
              <Stat label="Std. dev. σ" value={pop.sd.toFixed(3)} />
            </dl>
          </div>

          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="mb-2 font-semibold text-ink">Sample means (n = {n})</p>
            <dl className="space-y-1">
              <Stat label="Samples drawn" value={means.length.toLocaleString('en-US')} hint={full ? '(limit)' : undefined} />
              <Stat label="Last sample mean" value={lastMean === null ? '–' : lastMean.toFixed(3)} />
              <Stat label="Mean of means" value={stats ? stats.mean.toFixed(3) : '–'} hint={`(μ = ${pop.mean.toFixed(3)})`} />
              <Stat label="SD of means" value={stats?.sd != null ? stats.sd.toFixed(3) : '–'} hint={`(σ/√n = ${se.toFixed(3)})`} />
            </dl>
          </div>

          <p className="text-ink-muted">
            {n === 1
              ? 'With n = 1 each "mean" is a single value, so the histogram just rebuilds the population. Try a larger n.'
              : 'As n grows the histogram gets narrower (σ/√n) and more bell-shaped, whatever the population looks like.'}
            {pop.discrete && n > 1 && ` A die's sample mean is always a multiple of 1/${n}, so each bar is centered on one or a few of those possible values.`}
          </p>
          {popKey === 'exponential' && (
            <p className="text-ink-muted">The exponential population has no upper limit; the rare values above 10 are not drawn but still count.</p>
          )}
        </div>
      </div>
    </div>
  );
}
