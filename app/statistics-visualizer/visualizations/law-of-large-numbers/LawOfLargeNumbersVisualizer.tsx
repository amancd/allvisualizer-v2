'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { Panel, Slider, Stat } from '../_probability/controls';
import {
  EXPERIMENTS,
  MAX_TRIALS,
  advance,
  autoBatch,
  categories,
  createSim,
  eventLabel,
  eventProbabilityText,
  successCategory,
  trueProbs,
  type Config,
  type ExperimentKey,
  type Sim,
} from './lln';

const RUN_COLORS = ['#2563eb', '#db2777', '#059669', '#d97706', '#7c3aed'];

const W = 800;
const H = 390;
const L = 70;
const R = 780;
const T = 20;
const B = 320;
const sy = (f: number) => B - f * (B - T);

function niceStep(max: number) {
  const raw = max / 5;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const unit = [1, 2, 5, 10].find((u) => u * mag >= raw) ?? 10;
  return unit * mag;
}

function FrequencyChart({ sim, p, logX }: { sim: Sim; p: number; logX: boolean }) {
  const N = Math.max(sim.n, 10);
  const sx = useMemo(
    () => (t: number) => (logX ? L + (Math.log10(Math.max(t, 1)) / Math.log10(N)) * (R - L) : L + (t / N) * (R - L)),
    [logX, N],
  );

  const sampleTimes = useMemo(() => {
    const out: number[] = [];
    if (logX) {
      let last = 0;
      for (let k = 0; k <= 400; k++) {
        const t = Math.round(10 ** ((k / 400) * Math.log10(N)));
        if (t > last) {
          out.push(t);
          last = t;
        }
      }
    } else {
      const step = Math.max(1, Math.floor(N / 400));
      for (let t = 1; t <= N; t += step) out.push(t);
      if (out[out.length - 1] !== N) out.push(N);
    }
    return out;
  }, [logX, N]);

  const paths = sim.hits.map((run) => {
    const times = sampleTimes.filter((t) => t <= sim.n);
    if (sim.n > 0 && times[times.length - 1] !== sim.n) times.push(sim.n);
    return times.map((t, i) => `${i === 0 ? 'M' : 'L'} ${sx(t).toFixed(1)} ${sy(run[t - 1] / t).toFixed(1)}`).join(' ');
  });

  const sd = Math.sqrt(p * (1 - p));
  const upper = sampleTimes.map((t) => `${sx(t).toFixed(1)},${sy(Math.min(1, p + (2 * sd) / Math.sqrt(t))).toFixed(1)}`);
  const lower = sampleTimes.map((t) => `${sx(t).toFixed(1)},${sy(Math.max(0, p - (2 * sd) / Math.sqrt(t))).toFixed(1)}`).reverse();

  const xTicks = logX
    ? [1, 10, 100, 1000, 10000, 100000].filter((t) => t <= N)
    : Array.from({ length: Math.floor(N / niceStep(N)) + 1 }, (_, i) => i * niceStep(N));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Running relative frequency against number of trials">
      <polygon points={[...upper, ...lower].join(' ')} fill="#bfdbfe" opacity={0.55} />
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <line x1={L} y1={sy(f)} x2={R} y2={sy(f)} stroke="#e2e8f0" strokeWidth={1} />
          <text x={L - 10} y={sy(f) + 7} fontSize={20} textAnchor="end" fill="#475569">
            {f}
          </text>
        </g>
      ))}
      <line x1={L} y1={sy(p)} x2={R} y2={sy(p)} stroke="#0f172a" strokeWidth={2} strokeDasharray="8 6" />
      <text x={R - 4} y={sy(p) - 8} fontSize={20} textAnchor="end" fill="#0f172a" fontWeight={700}>
        p = {p.toFixed(3)}
      </text>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={RUN_COLORS[i]} strokeWidth={sim.hits.length > 1 ? 2 : 3} strokeLinejoin="round" />
      ))}
      <line x1={L} y1={B} x2={R} y2={B} stroke="#334155" strokeWidth={2} />
      <line x1={L} y1={T} x2={L} y2={B} stroke="#334155" strokeWidth={2} />
      {xTicks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={B} x2={sx(t)} y2={B + 7} stroke="#334155" strokeWidth={2} />
          <text x={sx(t)} y={B + 30} fontSize={20} textAnchor="middle" fill="#475569">
            {t.toLocaleString('en-US')}
          </text>
        </g>
      ))}
      <text x={(L + R) / 2} y={H - 8} fontSize={20} textAnchor="middle" fill="#334155">
        number of trials n{logX ? ' (log scale)' : ''}
      </text>
      {sim.n === 0 && (
        <text x={(L + R) / 2} y={(T + B) / 2 - 30} fontSize={24} textAnchor="middle" fill="#94a3b8">
          Run some trials to draw the running frequency
        </text>
      )}
    </svg>
  );
}

function CountsChart({ sim, cfg }: { sim: Sim; cfg: Config }) {
  const labels = categories(cfg.key);
  const probs = trueProbs(cfg);
  const success = successCategory(cfg);
  const total = sim.n;
  const observed = sim.counts.map((c) => (total ? c / total : 0));
  const yMax = Math.min(1, Math.max(...probs, ...observed) * 1.2);
  const height = 250;
  const base = 200;
  const top = 30;
  const slot = (R - L) / labels.length;
  const by = (f: number) => base - (f / yMax) * (base - top);

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Observed proportion of each outcome compared with its true probability">
      {labels.map((label, i) => {
        const x = L + i * slot;
        const bw = slot * 0.6;
        const hit = i === success;
        return (
          <g key={label}>
            <rect x={x + (slot - bw) / 2} y={by(observed[i])} width={bw} height={base - by(observed[i])} fill={hit ? '#f59e0b' : '#93c5fd'} />
            <line x1={x + slot * 0.1} y1={by(probs[i])} x2={x + slot * 0.9} y2={by(probs[i])} stroke="#0f172a" strokeWidth={3} />
            <text x={x + slot / 2} y={base + 28} fontSize={22} textAnchor="middle" fill={hit ? '#b45309' : '#475569'} fontWeight={hit ? 700 : 400}>
              {label}
            </text>
            {total > 0 && labels.length <= 6 && (
              <text x={x + slot / 2} y={Math.min(by(observed[i]), by(probs[i])) - 8} fontSize={18} textAnchor="middle" fill="#334155">
                {sim.counts[i].toLocaleString('en-US')}
              </text>
            )}
          </g>
        );
      })}
      <line x1={L} y1={base} x2={R} y2={base} stroke="#334155" strokeWidth={2} />
    </svg>
  );
}

export default function LawOfLargeNumbersVisualizer() {
  const [cfg, setCfg] = useState<Config>({ key: 'coin', p: 0.7, face: 6 });
  const [runs, setRuns] = useState(1);
  const [sim, setSim] = useState<Sim>(() => createSim({ key: 'coin', p: 0.7, face: 6 }, 1));
  const [running, setRunning] = useState(false);
  const [logX, setLogX] = useState(true);

  const full = sim.n >= MAX_TRIALS;
  const autoRunning = running && !full;
  const p = trueProbs(cfg)[successCategory(cfg)];

  const restart = (next: Config, nextRuns = runs) => {
    setCfg(next);
    setRuns(nextRuns);
    setSim(createSim(next, nextRuns));
    setRunning(false);
  };

  useEffect(() => {
    if (!autoRunning) return;
    const frame = requestAnimationFrame(() => setSim(advance(sim, cfg, autoBatch(sim.n))));
    return () => cancelAnimationFrame(frame);
  }, [autoRunning, sim, cfg]);

  const freqs = sim.hits.map((run) => (sim.n ? run[sim.n - 1] / sim.n : 0));
  const band = sim.n ? (2 * Math.sqrt(p * (1 - p))) / Math.sqrt(sim.n) : null;
  const labels = categories(cfg.key);
  const success = successCategory(cfg);

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Experiment</p>
          <div className="flex flex-wrap gap-2">
            {EXPERIMENTS.map((e) => (
              <Button key={e.key} size="sm" variant={cfg.key === e.key ? 'primary' : 'outline'} aria-pressed={cfg.key === e.key} onClick={() => restart({ ...cfg, key: e.key as ExperimentKey })}>
                {e.label}
              </Button>
            ))}
          </div>
        </div>

        {cfg.key === 'biased' && (
          <div className="max-w-md">
            <Slider label="P(heads)" value={cfg.p} min={0.05} max={0.95} step={0.05} display={cfg.p.toFixed(2)} onChange={(v) => restart({ ...cfg, p: v })} />
          </div>
        )}

        {cfg.key === 'die' && (
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Track the face</p>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((f) => (
                <Button key={f} size="sm" variant={cfg.face === f ? 'primary' : 'outline'} aria-pressed={cfg.face === f} onClick={() => restart({ ...cfg, face: f })}>
                  {f}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {[1, 10, 100, 1000].map((k) => (
            <Button key={k} size="sm" variant="secondary" disabled={full} onClick={() => setSim(advance(sim, cfg, k))}>
              +{k.toLocaleString('en-US')}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            disabled={full}
            onClick={() => setRunning((r) => !r)}
            leftIcon={autoRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          >
            {autoRunning ? 'Pause' : 'Auto-run'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => restart(cfg)} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset
          </Button>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={logX} onChange={(e) => setLogX(e.target.checked)} className="h-4 w-4 accent-brand-600" />
            Log scale for n
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={runs > 1} onChange={(e) => restart(cfg, e.target.checked ? 5 : 1)} className="h-4 w-4 accent-brand-600" />
            Overlay 5 independent runs
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 lg:col-span-2">
          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Running frequency of {eventLabel(cfg)}
              <span className="ml-2 font-normal text-ink-muted">(blue band: p ± 2√(p(1 − p)/n), where about 95% of runs should be)</span>
            </p>
            <FrequencyChart sim={sim} p={p} logX={logX} />
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Last {sim.recent.length} outcomes{runs > 1 ? ' of run 1' : ''}
            </p>
            <div className="flex min-h-10 flex-wrap gap-1">
              {sim.recent.map((cat, i) => (
                <span
                  key={`${sim.n}-${i}`}
                  className={`grid h-8 w-8 place-items-center rounded-md text-sm font-semibold ${cat === success ? 'bg-amber-500 text-white' : 'border border-slate-300 bg-slate-50 text-slate-600'}`}
                >
                  {labels[cat]}
                </span>
              ))}
              {sim.recent.length === 0 && <span className="text-sm text-ink-faint">No trials yet</span>}
            </div>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Outcome counts{runs > 1 ? ' (run 1)' : ''}
              <span className="ml-2 font-normal text-ink-muted">(bars: observed share, black line: true probability)</span>
            </p>
            <CountsChart sim={sim} cfg={cfg} />
          </div>
        </div>

        <div className="space-y-4">
          <Panel title="Results">
            <dl className="space-y-1">
              <Stat label="Trials n" value={sim.n.toLocaleString('en-US')} hint={full ? '(limit)' : undefined} />
              <Stat label={`Count of ${eventLabel(cfg)}`} value={sim.n ? sim.hits[0][sim.n - 1].toLocaleString('en-US') : '0'} />
              <Stat label="Relative frequency" value={sim.n ? freqs[0].toFixed(4) : '–'} strong />
              <Stat label="True probability p" value={p.toFixed(4)} hint={`(${eventProbabilityText(cfg)})`} />
              <Stat label="Error |f − p|" value={sim.n ? Math.abs(freqs[0] - p).toFixed(4) : '–'} />
              <Stat label="95% band ±" value={band === null ? '–' : band.toFixed(4)} />
            </dl>
          </Panel>

          {runs > 1 && (
            <Panel title="All runs">
              <dl className="space-y-1">
                {freqs.map((f, i) => (
                  <Stat
                    key={i}
                    label={
                      <span className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full" style={{ background: RUN_COLORS[i] }} />
                        Run {i + 1}
                      </span>
                    }
                    value={sim.n ? f.toFixed(4) : '–'}
                  />
                ))}
              </dl>
            </Panel>
          )}

          <p className="text-sm text-ink-muted">
            Early on the line swings wildly: one extra success out of 10 trials moves the frequency by 0.1. After 1,000 trials one extra success moves it by only
            0.001, so the line flattens out near p. The count of successes still wanders away from p × n; it is the <em>proportion</em> that settles.
          </p>
        </div>
      </div>
    </div>
  );
}
