'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Pause, Play, RotateCcw, Shuffle, StepForward } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import LineChart from '../_rl/LineChart';
import { Panel, Segmented, Slider, Stat } from '../_rl/controls';
import { mulberry32 } from '../_rl/gridWorld';

type StratId = 'eps' | 'ucb' | 'ts';
type Speed = 'slow' | 'normal' | 'fast' | 'max';

const STRATS: { id: StratId; name: string; color: string }[] = [
  { id: 'eps', name: 'ε-greedy', color: '#d97706' },
  { id: 'ucb', name: 'UCB1', color: '#2563eb' },
  { id: 'ts', name: 'Thompson sampling', color: '#7c3aed' },
];
const ARM_COLORS = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#14b8a6', '#ec4899', '#64748b'];
const SPEEDS: Record<Speed, { label: string; everyMs?: number; perFrame?: number }> = {
  slow: { label: 'Slow', everyMs: 300 },
  normal: { label: 'Normal', perFrame: 1 },
  fast: { label: 'Fast', perFrame: 10 },
  max: { label: 'Max', perFrame: 100 },
};
const HORIZON = 5000;
const CHART_POINTS = 300;

// ---------- Random helpers (seeded, so every run is reproducible) ----------

function gaussian(rng: () => number): number {
  let u = 0;
  while (u === 0) u = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

/** Gamma(k, 1) for k ≥ 1 (Marsaglia and Tsang). */
function sampleGamma(k: number, rng: () => number): number {
  const d = k - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x: number;
    let v: number;
    do {
      x = gaussian(rng);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * x ** 4) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

/** Beta(a, b) = X / (X + Y) with X ~ Gamma(a), Y ~ Gamma(b). */
function sampleBeta(a: number, b: number, rng: () => number): number {
  const x = sampleGamma(a, rng);
  const y = sampleGamma(b, rng);
  return x / (x + y);
}

/** log Γ(z) via the Lanczos approximation. */
function logGamma(z: number): number {
  const g = 7;
  const coef = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  z -= 1;
  let x = coef[0];
  for (let i = 1; i < g + 2; i++) x += coef[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function betaPdf(x: number, a: number, b: number): number {
  const logB = logGamma(a) + logGamma(b) - logGamma(a + b);
  return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logB);
}

// ---------- Simulation ----------

interface Learner {
  rng: () => number;
  counts: number[];
  successes: number[];
  reward: number;
  regret: number;
  regretHist: number[];
  last: number;
}

interface Sim {
  probs: number[];
  best: number;
  t: number;
  learners: Record<StratId, Learner>;
}

interface LearnerView {
  counts: number[];
  successes: number[];
  reward: number;
  regret: number;
  last: number;
  chart: [number, number][];
}

interface View {
  probs: number[];
  best: number;
  t: number;
  learners: Record<StratId, LearnerView>;
}

function makeProbs(arms: number, seed: number): number[] {
  const rng = mulberry32(seed * 7919 + arms);
  return Array.from({ length: arms }, () => Math.round((0.05 + 0.9 * rng()) * 100) / 100);
}

function createSim(arms: number, seed: number): Sim {
  const probs = makeProbs(arms, seed);
  const learner = (offset: number): Learner => ({
    rng: mulberry32(seed * 31 + offset),
    counts: new Array(arms).fill(0),
    successes: new Array(arms).fill(0),
    reward: 0,
    regret: 0,
    regretHist: [],
    last: -1,
  });
  return { probs, best: Math.max(...probs), t: 0, learners: { eps: learner(101), ucb: learner(202), ts: learner(303) } };
}

function snapshot(sim: Sim): View {
  const learners = {} as Record<StratId, LearnerView>;
  for (const { id } of STRATS) {
    const l = sim.learners[id];
    const stride = Math.max(1, Math.ceil(l.regretHist.length / CHART_POINTS));
    const chart: [number, number][] = [[0, 0]];
    for (let i = stride - 1; i < l.regretHist.length; i += stride) chart.push([i + 1, l.regretHist[i]]);
    learners[id] = { counts: l.counts.slice(), successes: l.successes.slice(), reward: l.reward, regret: l.regret, last: l.last, chart };
  }
  return { probs: sim.probs, best: sim.best, t: sim.t, learners };
}

/** Index of the largest value, ties broken at random. */
function argmaxRandom(values: number[], rng: () => number): number {
  let best = -Infinity;
  let ties: number[] = [];
  values.forEach((v, i) => {
    if (v > best + 1e-12) {
      best = v;
      ties = [i];
    } else if (Math.abs(v - best) <= 1e-12) ties.push(i);
  });
  return ties[Math.floor(rng() * ties.length)];
}

const estimate = (l: { counts: number[]; successes: number[] }, k: number) => (l.counts[k] ? l.successes[k] / l.counts[k] : 0);

function ucbScore(l: { counts: number[]; successes: number[] }, k: number, t: number, c: number): number {
  if (l.counts[k] === 0) return Infinity;
  return estimate(l, k) + c * Math.sqrt(Math.log(t) / l.counts[k]);
}

function chooseArm(id: StratId, l: Learner, epsilon: number, c: number): number {
  const arms = l.counts.length;
  if (id === 'eps') {
    if (l.rng() < epsilon) return Math.floor(l.rng() * arms);
    return argmaxRandom(l.counts.map((_, k) => estimate(l, k)), l.rng);
  }
  if (id === 'ucb') {
    const untried = l.counts.indexOf(0);
    if (untried !== -1) return untried; // play every arm once first
    const t = l.counts.reduce((a, b) => a + b, 0);
    return argmaxRandom(l.counts.map((_, k) => ucbScore(l, k, t, c)), l.rng);
  }
  // Thompson sampling: one draw from each arm's Beta(1 + wins, 1 + losses) posterior, play the highest.
  return argmaxRandom(l.counts.map((n, k) => sampleBeta(1 + l.successes[k], 1 + n - l.successes[k], l.rng)), l.rng);
}

function pullAll(sim: Sim, epsilon: number, c: number) {
  if (sim.t >= HORIZON) return;
  for (const { id } of STRATS) {
    const l = sim.learners[id];
    const k = chooseArm(id, l, epsilon, c);
    const r = l.rng() < sim.probs[k] ? 1 : 0;
    l.counts[k] += 1;
    l.successes[k] += r;
    l.reward += r;
    l.regret += sim.best - sim.probs[k]; // expected (pseudo) regret of this pull
    l.regretHist.push(l.regret);
    l.last = k;
  }
  sim.t += 1;
}

// ---------- Component ----------

export default function MultiArmedBanditVisualizer() {
  const [arms, setArms] = useState(5);
  const [seed, setSeed] = useState(42);
  const [epsilon, setEpsilon] = useState(0.1);
  const [c, setC] = useState(1);
  const [reveal, setReveal] = useState(false);
  const [speed, setSpeed] = useState<Speed>('normal');
  const [running, setRunning] = useState(false);
  const [view, setView] = useState<View>(() => snapshot(createSim(5, 42)));

  const simRef = useRef<Sim | null>(null);
  const paramsRef = useRef({ epsilon, c });
  useEffect(() => {
    paramsRef.current = { epsilon, c };
  }, [epsilon, c]);

  const getSim = () => {
    if (!simRef.current) simRef.current = createSim(arms, seed);
    return simRef.current;
  };

  useEffect(() => {
    if (!running) return;
    const { everyMs, perFrame } = SPEEDS[speed];
    let raf = 0;
    let lastPull = performance.now();
    const frame = (now: number) => {
      const sim = simRef.current ?? (simRef.current = createSim(arms, seed));
      const { epsilon: e, c: cc } = paramsRef.current;
      if (everyMs) {
        if (now - lastPull >= everyMs) {
          lastPull = now;
          pullAll(sim, e, cc);
          setView(snapshot(sim));
        }
      } else {
        for (let i = 0; i < (perFrame ?? 1); i++) pullAll(sim, e, cc);
        setView(snapshot(sim));
      }
      if (sim.t >= HORIZON) {
        setRunning(false);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running, speed, arms, seed]);

  const restart = (nextArms = arms, nextSeed = seed) => {
    simRef.current = createSim(nextArms, nextSeed);
    setView(snapshot(simRef.current));
  };

  const stepOnce = () => {
    const sim = getSim();
    pullAll(sim, epsilon, c);
    setView(snapshot(sim));
  };

  const done = view.t >= HORIZON;
  const bestArm = view.probs.indexOf(view.best);

  return (
    <div className="space-y-6">
      <Panel
        title="The slot machines"
        actions={
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setReveal(!reveal)}
            aria-pressed={reveal}
            leftIcon={reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          >
            {reveal ? 'Hide payout rates' : 'Reveal payout rates'}
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {view.probs.map((p, k) => (
            <div key={k} className="overflow-hidden rounded-lg border border-line bg-subtle">
              <div className="h-1.5" style={{ backgroundColor: ARM_COLORS[k] }} />
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-ink">Arm {k + 1}</div>
                <div className="font-mono text-sm tabular-nums text-ink-muted">
                  p = {reveal ? p.toFixed(2) : '?'}
                  {reveal && k === bestArm && <span className="ml-1 font-sans text-xs font-semibold text-emerald-700">best</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          Each pull pays 1 with the arm&apos;s hidden probability p, otherwise 0. All three strategies play their own copy of the same machines, one pull
          each per step.
        </p>
      </Panel>

      <Panel title="Controls">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          <Slider
            label="Arms"
            value={arms}
            min={3}
            max={8}
            step={1}
            onChange={(v) => {
              setArms(v);
              setRunning(false);
              restart(v, seed);
            }}
          />
          <Slider label="ε (ε-greedy)" value={epsilon} min={0} max={0.5} step={0.01} onChange={setEpsilon} format={(v) => v.toFixed(2)} />
          <Slider label="c (UCB1)" value={c} min={0} max={3} step={0.1} onChange={setC} format={(v) => v.toFixed(1)} />
          <label className="block min-w-0">
            <span className="mb-1 block text-sm font-medium text-ink">Seed</span>
            <input
              type="number"
              min={1}
              value={seed}
              onChange={(e) => {
                const v = Math.max(1, Math.floor(Number(e.target.value) || 1));
                setSeed(v);
                setRunning(false);
                restart(arms, v);
              }}
              className="h-9 w-full rounded-lg border border-line-strong bg-white px-3 font-mono text-sm text-ink focus:border-brand-500 focus:outline-none"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <Segmented<Speed> label="Speed" value={speed} onChange={setSpeed} options={(Object.keys(SPEEDS) as Speed[]).map((k) => ({ value: k, label: SPEEDS[k].label }))} />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setRunning(!running)} disabled={done} leftIcon={running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
              {running ? 'Pause' : 'Run'}
            </Button>
            <Button size="sm" variant="outline" onClick={stepOnce} disabled={running || done} leftIcon={<StepForward className="h-4 w-4" />}>
              Pull once
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setRunning(false);
                restart();
              }}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Restart
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSeed(seed + 1);
                setRunning(false);
                restart(arms, seed + 1);
              }}
              leftIcon={<Shuffle className="h-4 w-4" />}
            >
              New machines
            </Button>
          </div>
        </div>
        <p className="mt-3 text-sm text-ink-muted">
          Step {view.t.toLocaleString('en-US')} of {HORIZON.toLocaleString('en-US')}. ε and c can be changed mid-run; changing arms or seed starts over.
        </p>
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {STRATS.map((s) => (
          <StrategyPanel key={s.id} strat={s} view={view} reveal={reveal} c={c} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Cumulative regret">
          <LineChart
            series={STRATS.map((s) => ({ label: s.name, color: s.color, points: view.t > 0 ? view.learners[s.id].chart : [] }))}
            xLabel="pull"
            yLabel="regret"
            emptyText="Run to compare the strategies"
          />
          <p className="mt-2 text-sm text-ink-muted">
            Regret adds up p<sub>best</sub> − p<sub>chosen</sub> on every pull. A curve that flattens means the strategy has settled on the best arm.
          </p>
        </Panel>
        <Panel title="Thompson sampling posteriors">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {view.probs.map((p, k) => {
              const l = view.learners.ts;
              return <PosteriorPlot key={k} arm={k} a={1 + l.successes[k]} b={1 + l.counts[k] - l.successes[k]} trueP={reveal ? p : null} />;
            })}
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            Each curve is Beta(1 + wins, 1 + losses): what Thompson sampling believes about that arm&apos;s payout rate. Wide curves still get explored;
            narrow ones low down are abandoned.{reveal ? ' The dashed line is the true rate.' : ''}
          </p>
        </Panel>
      </div>
    </div>
  );
}

function StrategyPanel({ strat, view, reveal, c }: { strat: (typeof STRATS)[number]; view: View; reveal: boolean; c: number }) {
  const l = view.learners[strat.id];
  const maxCount = Math.max(1, ...l.counts);
  const extraHeader = strat.id === 'ucb' ? 'Upper bound' : strat.id === 'ts' ? 'Post. mean' : null;

  return (
    <Panel
      title={
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: strat.color }} aria-hidden />
          {strat.name}
        </span>
      }
    >
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Total reward" value={l.reward} />
        <Stat label="Regret" value={l.regret.toFixed(1)} />
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-ink-muted">
            <tr>
              <th className="py-1 pr-2 font-medium">Arm</th>
              <th className="py-1 pr-2 font-medium">Pulls</th>
              <th className="py-1 pr-2 text-right font-medium">Est.</th>
              {extraHeader && <th className="py-1 text-right font-medium">{extraHeader}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {l.counts.map((n, k) => {
              const est = n ? l.successes[k] / n : null;
              let extra: string | null = null;
              if (strat.id === 'ucb') {
                const score = ucbScore(l, k, Math.max(1, view.t), c);
                extra = Number.isFinite(score) ? score.toFixed(3) : '∞';
              } else if (strat.id === 'ts') {
                extra = ((1 + l.successes[k]) / (2 + n)).toFixed(3);
              }
              const isLast = k === l.last;
              return (
                <tr key={k} className={isLast ? 'bg-brand-50' : ''}>
                  <td className="py-1.5 pr-2 font-medium text-ink">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: ARM_COLORS[k] }} aria-hidden />
                      {k + 1}
                    </span>
                  </td>
                  <td className="py-1.5 pr-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 min-w-[2rem] flex-1 rounded-full bg-subtle ring-1 ring-inset ring-line">
                        <div className="h-2 rounded-full" style={{ width: `${(n / maxCount) * 100}%`, backgroundColor: strat.color }} />
                      </div>
                      <span className="w-12 text-right font-mono text-xs tabular-nums text-ink-muted">{n}</span>
                    </div>
                  </td>
                  <td className="py-1.5 pr-2 text-right font-mono tabular-nums text-ink">
                    {est === null ? '–' : est.toFixed(3)}
                    {reveal && <span className="block text-[11px] text-ink-faint">true {view.probs[k].toFixed(2)}</span>}
                  </td>
                  {extra !== null && <td className="py-1.5 text-right font-mono tabular-nums text-ink-muted">{extra}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

const PW = 160;
const PH = 90;

function PosteriorPlot({ arm, a, b, trueP }: { arm: number; a: number; b: number; trueP: number | null }) {
  const xs = Array.from({ length: 81 }, (_, i) => (i + 0.5) / 81);
  const ys = xs.map((x) => betaPdf(x, a, b));
  const yMax = Math.max(...ys, 1e-9);
  const px = (x: number) => 4 + x * (PW - 8);
  const py = (y: number) => PH - 14 - (y / yMax) * (PH - 22);
  const line = xs.map((x, i) => `${px(x).toFixed(1)},${py(ys[i]).toFixed(1)}`).join(' ');
  const area = `${px(xs[0])},${PH - 14} ${line} ${px(xs[xs.length - 1])},${PH - 14}`;
  const color = ARM_COLORS[arm];

  return (
    <div className="min-w-0 rounded-lg border border-line bg-subtle p-2">
      <div className="mb-1 truncate text-xs text-ink-muted">
        <span className="font-semibold text-ink">Arm {arm + 1}</span> Beta({a}, {b})
      </div>
      <svg viewBox={`0 0 ${PW} ${PH}`} className={responsiveSurface} role="img" aria-label={`Beta(${a}, ${b}) posterior for arm ${arm + 1}`}>
        <line x1={4} x2={PW - 4} y1={PH - 14} y2={PH - 14} stroke="#cbd5e1" />
        <polygon points={area} fill={color} opacity={0.2} />
        <polyline points={line} fill="none" stroke={color} strokeWidth={2} />
        {trueP !== null && <line x1={px(trueP)} x2={px(trueP)} y1={6} y2={PH - 14} stroke="#0f172a" strokeDasharray="3 3" strokeWidth={1.5} />}
        <text x={4} y={PH - 2} fontSize="10" fill="#6b7280">
          0
        </text>
        <text x={PW - 4} y={PH - 2} fontSize="10" fill="#6b7280" textAnchor="end">
          1
        </text>
      </svg>
    </div>
  );
}
