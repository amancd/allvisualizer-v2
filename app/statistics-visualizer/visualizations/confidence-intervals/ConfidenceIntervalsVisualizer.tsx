'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { Panel, RangeField, Segmented, Stat } from '../_inference/controls';
import { drawSample, normalInv, tInv } from '../_inference/stats';

const MU = 100;
const SIGMA = 15;
const MAX_SAMPLES = 5000;
const SHOWN = 100;

type Method = 'z' | 't' | 'naive';

const METHOD_OPTIONS: { value: Method; label: string }[] = [
  { value: 'z', label: 'z, σ known' },
  { value: 't', label: 't, σ unknown' },
  { value: 'naive', label: 'z with s' },
];

type Sample = { mean: number; sd: number };

const W = 800;
const H = 440;
const PAD = { left: 20, right: 20, top: 34, bottom: 52 };
const PLOT_H = H - PAD.top - PAD.bottom;

const CW = 800;
const CH = 200;
const CPAD = { left: 56, right: 20, top: 16, bottom: 36 };

function criticalValue(method: Method, conf: number, n: number) {
  const p = 1 - (1 - conf) / 2;
  return method === 't' ? tInv(p, n - 1) : normalInv(p);
}

function IntervalChart({ samples, n, crit, method }: { samples: Sample[]; n: number; crit: number; method: Method }) {
  const se = SIGMA / Math.sqrt(n);
  const lo = MU - 6 * se;
  const hi = MU + 6 * se;
  const sx = (x: number) => PAD.left + ((x - lo) / (hi - lo)) * (W - PAD.left - PAD.right);
  const shown = samples.slice(-SHOWN).reverse();
  const rowH = PLOT_H / Math.max(20, shown.length);
  const stroke = Math.max(1.5, Math.min(6, rowH * 0.6));
  const ticks = [-6, -4, -2, 0, 2, 4, 6];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Confidence intervals from repeated samples">
      <text x={sx(MU)} y={20} fontSize={18} textAnchor="middle" fill="#4c1d95" fontWeight={700}>
        true mean μ = {MU}
      </text>
      {shown.map((s, i) => {
        const half = crit * (method === 'z' ? se : s.sd / Math.sqrt(n));
        const L = s.mean - half;
        const U = s.mean + half;
        const hit = L <= MU && MU <= U;
        const color = hit ? '#0284c7' : '#dc2626';
        const y = PAD.top + (i + 0.5) * rowH;
        const x1 = sx(Math.max(lo, L));
        const x2 = sx(Math.min(hi, U));
        return (
          <g key={samples.length - i} opacity={i === 0 ? 1 : 0.85}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
            {L < lo && <polygon points={`${x1 - 6},${y} ${x1 + 2},${y - 5} ${x1 + 2},${y + 5}`} fill={color} />}
            {U > hi && <polygon points={`${x2 + 6},${y} ${x2 - 2},${y - 5} ${x2 - 2},${y + 5}`} fill={color} />}
            {s.mean >= lo && s.mean <= hi && <circle cx={sx(s.mean)} cy={y} r={Math.min(4, stroke * 0.9)} fill="#0f172a" />}
          </g>
        );
      })}
      <line x1={sx(MU)} y1={PAD.top - 6} x2={sx(MU)} y2={H - PAD.bottom} stroke="#6d28d9" strokeWidth={2.5} />
      <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#334155" strokeWidth={2} />
      {ticks.map((k) => (
        <g key={k}>
          <line x1={sx(MU + k * se)} y1={H - PAD.bottom} x2={sx(MU + k * se)} y2={H - PAD.bottom + 7} stroke="#334155" strokeWidth={2} />
          <text x={sx(MU + k * se)} y={H - PAD.bottom + 28} fontSize={17} textAnchor="middle" fill="#475569">
            {(MU + k * se).toFixed(1)}
          </text>
        </g>
      ))}
      {shown.length === 0 && (
        <text x={W / 2} y={PAD.top + PLOT_H / 2} fontSize={22} textAnchor="middle" fill="#94a3b8">
          Draw a sample to build its interval
        </text>
      )}
    </svg>
  );
}

function CoverageChart({ hits, conf }: { hits: boolean[]; conf: number }) {
  const N = hits.length;
  const yMin = 0.5;
  const sx = (i: number) => CPAD.left + (N <= 1 ? 0 : (i / (N - 1)) * (CW - CPAD.left - CPAD.right));
  const sy = (v: number) => CPAD.top + ((1 - v) / (1 - yMin)) * (CH - CPAD.top - CPAD.bottom);
  const path = (() => {
    if (N === 0) return '';
    const step = Math.max(1, Math.floor(N / 800));
    let count = 0;
    const parts: string[] = [];
    for (let i = 0; i < N; i++) {
      if (hits[i]) count++;
      if (i % step === 0 || i === N - 1) {
        const v = Math.max(yMin, count / (i + 1));
        parts.push(`${parts.length === 0 ? 'M' : 'L'} ${sx(i).toFixed(1)} ${sy(v).toFixed(1)}`);
      }
    }
    return parts.join(' ');
  })();

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Running coverage compared with the confidence level">
      {[0.5, 0.6, 0.7, 0.8, 0.9, 1].map((v) => (
        <g key={v}>
          <line x1={CPAD.left} y1={sy(v)} x2={CW - CPAD.right} y2={sy(v)} stroke="#e2e8f0" strokeWidth={1} />
          <text x={CPAD.left - 8} y={sy(v) + 5} fontSize={15} textAnchor="end" fill="#64748b">
            {Math.round(v * 100)}%
          </text>
        </g>
      ))}
      <line x1={CPAD.left} y1={sy(conf)} x2={CW - CPAD.right} y2={sy(conf)} stroke="#6d28d9" strokeWidth={2} strokeDasharray="8 6" />
      <text x={CW - CPAD.right} y={sy(conf) - 6} fontSize={15} textAnchor="end" fill="#6d28d9">
        nominal {Math.round(conf * 100)}%
      </text>
      {path && <path d={path} fill="none" stroke="#0284c7" strokeWidth={2.5} strokeLinejoin="round" />}
      <text x={(CW + CPAD.left) / 2} y={CH - 8} fontSize={15} textAnchor="middle" fill="#64748b">
        {N === 0 ? 'samples drawn' : `samples drawn (1 to ${N})`}
      </text>
    </svg>
  );
}

export default function ConfidenceIntervalsVisualizer() {
  const [n, setN] = useState(10);
  const [confPct, setConfPct] = useState(95);
  const [method, setMethod] = useState<Method>('z');
  const [samples, setSamples] = useState<Sample[]>([]);
  const [running, setRunning] = useState(false);

  const conf = confPct / 100;
  const crit = criticalValue(method, conf, n);
  const zCrit = criticalValue('z', conf, n);
  const tCrit = criticalValue('t', conf, n);
  const full = samples.length >= MAX_SAMPLES;
  const autoDrawing = running && !full;

  const draw = (count: number) => {
    setSamples((prev) => {
      const room = Math.max(0, MAX_SAMPLES - prev.length);
      const fresh = Array.from({ length: Math.min(count, room) }, () => drawSample(n, MU, SIGMA));
      return [...prev, ...fresh];
    });
  };

  const reset = () => {
    setSamples([]);
    setRunning(false);
  };

  useEffect(() => {
    if (!autoDrawing) return;
    const id = window.setInterval(() => {
      setSamples((prev) => (prev.length >= MAX_SAMPLES ? prev : [...prev, drawSample(n, MU, SIGMA)]));
    }, 120);
    return () => window.clearInterval(id);
  }, [autoDrawing, n]);

  const hits = useMemo(
    () =>
      samples.map((s) => {
        const half = crit * (method === 'z' ? SIGMA / Math.sqrt(n) : s.sd / Math.sqrt(n));
        return Math.abs(s.mean - MU) <= half;
      }),
    [samples, crit, method, n],
  );
  const captured = hits.filter(Boolean).length;
  const coverage = samples.length ? captured / samples.length : null;
  const last = samples.length ? samples[samples.length - 1] : null;
  const se = SIGMA / Math.sqrt(n);
  const lastHalf = last ? crit * (method === 'z' ? se : last.sd / Math.sqrt(n)) : null;
  const critName = method === 't' ? `t*(${n - 1})` : 'z*';
  const spreadName = method === 'z' ? 'σ' : 's';
  const spreadValue = method === 'z' ? SIGMA : last?.sd;

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RangeField
          label="Sample size n"
          value={n}
          min={2}
          max={100}
          onChange={(v) => {
            setN(v);
            reset();
          }}
        />
        <RangeField label="Confidence level" value={confPct} min={80} max={99} onChange={setConfPct} display={`${confPct}%`} />
      </div>
      <Segmented label="Interval" options={METHOD_OPTIONS} value={method} onChange={setMethod} />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => draw(1)} disabled={full}>
          Draw 1 sample
        </Button>
        <Button size="sm" variant="secondary" onClick={() => draw(20)} disabled={full}>
          Draw 20
        </Button>
        <Button size="sm" variant="secondary" onClick={() => draw(100)} disabled={full}>
          Draw 100
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 lg:col-span-2">
          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              The last {Math.min(SHOWN, samples.length) || SHOWN} intervals, newest at the top
              <span className="ml-2 font-normal text-ink-muted">
                (<span className="text-sky-700">blue</span> captures μ, <span className="text-red-600">red</span> misses; dot = x̄)
              </span>
            </p>
            <IntervalChart samples={samples} n={n} crit={crit} method={method} />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-ink">Running coverage</p>
            <CoverageChart hits={hits} conf={conf} />
          </div>
        </div>

        <div className="min-w-0 space-y-4 text-sm">
          <Panel title="Population">
            <p className="text-ink-muted">
              Normal with μ = {MU} and σ = {SIGMA}. Each sample is n = {n} values; standard error σ/√n = {se.toFixed(3)}.
            </p>
          </Panel>

          <Panel title="Coverage">
            <dl className="grid grid-cols-2 gap-2">
              <Stat label="Samples" value={samples.length.toLocaleString('en-US')} hint={full ? '(limit)' : undefined} />
              <Stat label="Captured μ" value={captured.toLocaleString('en-US')} />
              <Stat
                label="Coverage"
                value={coverage === null ? '–' : `${(coverage * 100).toFixed(1)}%`}
                tone={coverage !== null && samples.length >= 100 && coverage < conf - 0.03 ? 'text-red-600' : undefined}
              />
              <Stat label="Nominal" value={`${confPct}%`} />
            </dl>
          </Panel>

          <Panel title="Margin of error">
            <p className="font-mono text-ink">
              E = {critName} × {spreadName}/√n
            </p>
            <p className="mt-1 font-mono text-ink">
              = {crit.toFixed(3)} × {spreadValue === undefined ? 's' : spreadValue.toFixed(2)}/√{n}
              {spreadValue !== undefined && ` = ${((crit * spreadValue) / Math.sqrt(n)).toFixed(3)}`}
            </p>
            {method !== 'z' && <p className="mt-1 text-xs text-ink-muted">s changes from sample to sample, so each interval has its own width. Shown for the last sample.</p>}
            <dl className="mt-3 space-y-1">
              <div className="flex justify-between gap-2">
                <dt className="text-ink-muted">z* ({confPct}%)</dt>
                <dd className="font-mono text-ink">{zCrit.toFixed(3)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-muted">t* with {n - 1} df</dt>
                <dd className="font-mono text-ink">{tCrit.toFixed(3)}</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Last interval">
            {last && lastHalf !== null ? (
              <p className="font-mono text-ink">
                {last.mean.toFixed(2)} ± {lastHalf.toFixed(2)} = [{(last.mean - lastHalf).toFixed(2)}, {(last.mean + lastHalf).toFixed(2)}]
              </p>
            ) : (
              <p className="text-ink-muted">No samples yet.</p>
            )}
          </Panel>

          <p className="text-ink-muted">
            Changing the confidence level or interval type rebuilds the intervals from the same samples. Changing n starts over.
            {method === 'naive' && n < 30 && ' Using s with z* gives intervals that are too narrow for small n, so coverage falls short of the nominal level.'}
          </p>
        </div>
      </div>
    </div>
  );
}
