'use client';

import { useState } from 'react';
import { Dices, Repeat } from 'lucide-react';
import { Button } from '@/components/ui';
import { StepList } from '@/components/content';
import { responsiveSurface } from '@/lib/visualization';
import { Panel, RangeField, Segmented, Stat } from '../_inference/controls';
import { type Alternative, drawSample, formatP, normalCdf, normalInv, normalPdf, pValue, tCdf, tInv, tPdf } from '../_inference/stats';

const MU0 = 500;
const XBAR_MIN = 494;
const XBAR_MAX = 506;

type TestType = 'z' | 't';

const ALPHAS = [0.01, 0.05, 0.1];

const ALT_OPTIONS: { value: Alternative; label: string }[] = [
  { value: 'two-sided', label: 'μ ≠ 500' },
  { value: 'left', label: 'μ < 500' },
  { value: 'right', label: 'μ > 500' },
];

const W = 800;
const H = 340;
const PAD = { left: 30, right: 30, top: 30, bottom: 50 };
const X_LIM = 4.5;
const sx = (x: number) => PAD.left + ((x + X_LIM) / (2 * X_LIM)) * (W - PAD.left - PAD.right);
const BASE = H - PAD.bottom;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round2 = (v: number) => Math.round(v * 100) / 100;

function criticalValues(alt: Alternative, alpha: number, inv: (p: number) => number) {
  if (alt === 'two-sided') {
    const c = inv(1 - alpha / 2);
    return [-c, c];
  }
  if (alt === 'left') return [inv(alpha)];
  return [inv(1 - alpha)];
}

function rejectionIntervals(alt: Alternative, crit: number[]): [number, number][] {
  if (alt === 'two-sided') return [[-Infinity, crit[0]], [crit[1], Infinity]];
  if (alt === 'left') return [[-Infinity, crit[0]]];
  return [[crit[0], Infinity]];
}

function pIntervals(alt: Alternative, stat: number): [number, number][] {
  if (alt === 'two-sided') return [[-Infinity, -Math.abs(stat)], [Math.abs(stat), Infinity]];
  if (alt === 'left') return [[-Infinity, stat]];
  return [[stat, Infinity]];
}

function zPower(alt: Alternative, alpha: number, shift: number) {
  if (alt === 'two-sided') {
    const c = normalInv(1 - alpha / 2);
    return 1 - normalCdf(c - shift) + normalCdf(-c - shift);
  }
  const c = normalInv(1 - alpha);
  return alt === 'right' ? 1 - normalCdf(c - shift) : normalCdf(-c - shift);
}

function TestChart({
  pdf,
  alt,
  crit,
  stat,
  pVal,
  symbol,
}: {
  pdf: (x: number) => number;
  alt: Alternative;
  crit: number[];
  stat: number;
  pVal: number;
  symbol: string;
}) {
  const yMax = 0.42;
  const sy = (d: number) => BASE - (d / yMax) * (BASE - PAD.top);
  const area = (a: number, b: number) => {
    const lo = Math.max(-X_LIM, a);
    const hi = Math.min(X_LIM, b);
    if (hi <= lo) return '';
    const steps = 120;
    const pts: string[] = [`${sx(lo).toFixed(1)},${BASE}`];
    for (let i = 0; i <= steps; i++) {
      const x = lo + ((hi - lo) * i) / steps;
      pts.push(`${sx(x).toFixed(1)},${sy(pdf(x)).toFixed(1)}`);
    }
    pts.push(`${sx(hi).toFixed(1)},${BASE}`);
    return pts.join(' ');
  };
  const curve = Array.from({ length: 301 }, (_, i) => {
    const x = -X_LIM + (2 * X_LIM * i) / 300;
    return `${i === 0 ? 'M' : 'L'} ${sx(x).toFixed(1)} ${sy(pdf(x)).toFixed(1)}`;
  }).join(' ');
  const statX = clamp(stat, -X_LIM, X_LIM);
  const offChart = Math.abs(stat) > X_LIM;
  const labelAnchor = statX > 2.5 ? 'end' : statX < -2.5 ? 'start' : 'middle';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label={`Null distribution with rejection region and observed ${symbol} = ${stat.toFixed(2)}`}>
      {rejectionIntervals(alt, crit).map(([a, b], i) => (
        <polygon key={`r${i}`} points={area(a, b)} fill="#fecaca" />
      ))}
      {pIntervals(alt, stat).map(([a, b], i) => (
        <polygon key={`p${i}`} points={area(a, b)} fill="#f59e0b" opacity={0.55} />
      ))}
      <path d={curve} fill="none" stroke="#1e3a8a" strokeWidth={3} />
      {crit.map((c) => (
        <g key={c}>
          <line x1={sx(c)} y1={PAD.top} x2={sx(c)} y2={BASE} stroke="#dc2626" strokeWidth={2} strokeDasharray="7 5" />
          <text x={sx(c)} y={PAD.top - 8} fontSize={16} textAnchor="middle" fill="#b91c1c">
            {c.toFixed(3)}
          </text>
        </g>
      ))}
      <line x1={sx(statX)} y1={PAD.top + 30} x2={sx(statX)} y2={BASE} stroke="#0f172a" strokeWidth={3} />
      <circle cx={sx(statX)} cy={BASE} r={6} fill="#0f172a" />
      <text x={sx(statX)} y={PAD.top + 22} fontSize={17} textAnchor={labelAnchor} fill="#0f172a" fontWeight={700}>
        {offChart ? (stat > 0 ? `${symbol} = ${stat.toFixed(2)} →` : `← ${symbol} = ${stat.toFixed(2)}`) : `${symbol} = ${stat.toFixed(2)}`}
      </text>
      <text x={sx(statX)} y={PAD.top + 42} fontSize={15} textAnchor={labelAnchor} fill="#b45309">
        p = {formatP(pVal)}
      </text>
      <line x1={PAD.left} y1={BASE} x2={W - PAD.right} y2={BASE} stroke="#334155" strokeWidth={2} />
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => (
        <g key={k}>
          <line x1={sx(k)} y1={BASE} x2={sx(k)} y2={BASE + 7} stroke="#334155" strokeWidth={2} />
          <text x={sx(k)} y={BASE + 28} fontSize={17} textAnchor="middle" fill="#475569">
            {k}
          </text>
        </g>
      ))}
    </svg>
  );
}

type BatchResult = { label: string; tests: number; rejects: number; expected: number; approx: boolean; h0True: boolean };

export default function HypothesisTestingVisualizer() {
  const [testType, setTestType] = useState<TestType>('z');
  const [xbar, setXbar] = useState(501.2);
  const [n, setN] = useState(25);
  const [popSigma, setPopSigma] = useState(4);
  const [s, setS] = useState(4);
  const [alpha, setAlpha] = useState(0.05);
  const [alt, setAlt] = useState<Alternative>('two-sided');
  const [trueMu, setTrueMu] = useState(500);
  const [batch, setBatch] = useState<BatchResult | null>(null);

  const isT = testType === 't';
  const df = n - 1;
  const spread = isT ? s : popSigma;
  const se = spread / Math.sqrt(n);
  const stat = (xbar - MU0) / se;
  const cdf = isT ? (x: number) => tCdf(x, df) : normalCdf;
  const pdf = isT ? (x: number) => tPdf(x, df) : (x: number) => normalPdf(x);
  const inv = isT ? (p: number) => tInv(p, df) : normalInv;
  const pVal = pValue(stat, alt, cdf);
  const crit = criticalValues(alt, alpha, inv);
  const reject = pVal <= alpha;
  const sym = isT ? 't' : 'z';
  const dist = isT ? `T₍${df}₎` : 'Z';
  const h1Sign = alt === 'two-sided' ? '≠' : alt === 'left' ? '<' : '>';

  const pExpr =
    alt === 'two-sided'
      ? `2 · P(${dist} ≥ ${Math.abs(stat).toFixed(3)})`
      : alt === 'left'
        ? `P(${dist} ≤ ${stat.toFixed(3)})`
        : `P(${dist} ≥ ${stat.toFixed(3)})`;
  const ruleText =
    alt === 'two-sided'
      ? `|${sym}| ≥ ${crit[1].toFixed(3)}`
      : alt === 'left'
        ? `${sym} ≤ ${crit[0].toFixed(3)}`
        : `${sym} ≥ ${crit[0].toFixed(3)}`;
  const direction = alt === 'two-sided' ? 'differs from' : alt === 'left' ? 'is below' : 'is above';

  const drawOne = () => {
    const sample = drawSample(n, trueMu, popSigma);
    setXbar(round2(clamp(sample.mean, XBAR_MIN, XBAR_MAX)));
    if (isT) setS(round2(clamp(sample.sd, 0.5, 12)));
  };

  const runMany = () => {
    const tests = 1000;
    let rejects = 0;
    for (let i = 0; i < tests; i++) {
      const sample = drawSample(n, trueMu, popSigma);
      const sd = isT ? sample.sd : popSigma;
      const z = (sample.mean - MU0) / (sd / Math.sqrt(n));
      if (pValue(z, alt, cdf) <= alpha) rejects++;
    }
    const h0True = Math.abs(trueMu - MU0) < 1e-9;
    const expected = h0True ? alpha : zPower(alt, alpha, (trueMu - MU0) / (popSigma / Math.sqrt(n)));
    setBatch({
      label: `${isT ? 't' : 'z'}-test, ${ALT_OPTIONS.find((o) => o.value === alt)?.label}, α = ${alpha}, n = ${n}, true μ = ${trueMu.toFixed(1)} ml, σ = ${popSigma} ml`,
      tests,
      rejects,
      expected,
      approx: isT && !h0True,
      h0True,
    });
  };

  const steps = [
    <span key="h">
      <strong>Hypotheses.</strong> H₀: μ = {MU0} ml (the machine is on target). H₁: μ {h1Sign} {MU0} ml. Significance level α = {alpha}.
    </span>,
    <span key="se">
      <strong>Standard error.</strong>{' '}
      <span className="font-mono">
        SE = {isT ? 's' : 'σ'}/√n = {spread.toFixed(2)}/√{n} = {se.toFixed(3)}
      </span>
    </span>,
    <span key="stat">
      <strong>Test statistic.</strong>{' '}
      <span className="font-mono">
        {sym} = (x̄ − μ₀)/SE = ({xbar.toFixed(2)} − {MU0})/{se.toFixed(3)} = {stat.toFixed(3)}
      </span>
      {isT && <span className="text-ink-muted"> with {df} degrees of freedom</span>}
    </span>,
    <span key="p">
      <strong>p-value.</strong>{' '}
      <span className="font-mono">
        p = {pExpr} = {formatP(pVal)}
      </span>
    </span>,
    <span key="d">
      <strong>Decision.</strong> p {reject ? '≤' : '>'} α ({formatP(pVal)} {reject ? '≤' : '>'} {alpha}), equivalently the rejection rule{' '}
      <span className="font-mono">{ruleText}</span> is {reject ? 'met' : 'not met'}, so we{' '}
      <span className={`font-semibold ${reject ? 'text-red-600' : 'text-emerald-700'}`}>{reject ? 'reject H₀' : 'fail to reject H₀'}</span>.{' '}
      {reject
        ? `The data are evidence that the mean fill ${direction} ${MU0} ml.`
        : `There is not enough evidence that the mean fill ${direction} ${MU0} ml. This does not prove that μ = ${MU0}.`}
    </span>,
  ];

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <p className="text-sm text-ink-muted">
        A machine should fill bottles with 500 ml on average. An inspector weighs a sample of n bottles and tests whether the mean fill is
        off target.
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Segmented
          label="Test"
          options={[
            { value: 'z', label: 'z-test, σ known' },
            { value: 't', label: 't-test, σ unknown' },
          ]}
          value={testType}
          onChange={setTestType}
        />
        <Segmented label="H₁" options={ALT_OPTIONS} value={alt} onChange={setAlt} />
        <Segmented label="α" options={ALPHAS.map((a) => ({ value: a, label: String(a) }))} value={alpha} onChange={setAlpha} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <RangeField label="Sample mean x̄ (ml)" value={xbar} min={XBAR_MIN} max={XBAR_MAX} step={0.01} onChange={setXbar} display={xbar.toFixed(2)} />
        <RangeField label="Sample size n" value={n} min={2} max={100} onChange={setN} />
        {isT ? (
          <RangeField label="Sample std. dev. s (ml)" value={s} min={0.5} max={12} step={0.01} onChange={setS} display={s.toFixed(2)} />
        ) : (
          <RangeField label="Population σ (ml)" value={popSigma} min={0.5} max={12} step={0.1} onChange={setPopSigma} display={popSigma.toFixed(1)} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="min-w-0 space-y-3 lg:col-span-3">
          <p className="text-sm font-medium text-ink">
            Distribution of {sym} if H₀ is true{isT ? ` (t with ${df} df)` : ' (standard normal)'}
          </p>
          <TestChart pdf={pdf} alt={alt} crit={crit} stat={stat} pVal={pVal} symbol={sym} />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-red-200" /> rejection region (area α = {alpha})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-amber-500/60" /> p-value area
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-slate-900" /> observed {sym}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label={`${sym} statistic`} value={stat.toFixed(3)} />
            <Stat label="p-value" value={formatP(pVal)} tone={reject ? 'text-red-600' : undefined} />
            <Stat label="Critical value" value={alt === 'two-sided' ? `±${crit[1].toFixed(3)}` : crit[0].toFixed(3)} />
            <Stat label="Decision" value={reject ? 'Reject H₀' : 'Keep H₀'} tone={reject ? 'text-red-600' : 'text-emerald-700'} />
          </dl>
        </div>
        <div className="min-w-0 text-sm lg:col-span-2">
          <Panel title="Step by step">
            <StepList steps={steps} />
          </Panel>
        </div>
      </div>

      <Panel title="Simulate the inspection">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <RangeField
              label="True mean fill in the simulated world"
              value={trueMu}
              min={496}
              max={504}
              step={0.1}
              onChange={setTrueMu}
              display={`${trueMu.toFixed(1)} ml${Math.abs(trueMu - MU0) < 1e-9 ? ' (H₀ true)' : ''}`}
            />
            <p className="text-xs text-ink-muted">
              Bottles are drawn from a normal distribution with this mean and σ = {popSigma} ml.
              {isT && ' The t-test does not know σ, so it uses the sample s instead.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={drawOne} leftIcon={<Dices className="h-4 w-4" />}>
                Draw a sample of {n}
              </Button>
              <Button size="sm" variant="outline" onClick={runMany} leftIcon={<Repeat className="h-4 w-4" />}>
                Run 1,000 tests
              </Button>
            </div>
          </div>
          <div className="text-sm">
            {batch ? (
              <div className="space-y-2">
                <p className="text-xs text-ink-muted">{batch.label}</p>
                <dl className="grid grid-cols-2 gap-2">
                  <Stat label="Rejected H₀" value={`${batch.rejects} / ${batch.tests}`} hint={`(${((batch.rejects / batch.tests) * 100).toFixed(1)}%)`} />
                  <Stat
                    label={batch.h0True ? 'Expected (α)' : batch.approx ? 'Expected power ≈' : 'Expected power'}
                    value={`${(batch.expected * 100).toFixed(1)}%`}
                  />
                </dl>
                <p className="text-xs text-ink-muted">
                  {batch.h0True
                    ? 'H₀ is true here, so every rejection is a Type I error. The rejection rate should be close to α.'
                    : 'H₀ is false here, so every rejection is correct. The rejection rate is the power of the test.'}
                </p>
              </div>
            ) : (
              <p className="text-ink-muted">
                Draw one sample to fill in x̄{isT ? ' and s' : ''} above, or run 1,000 tests to see how often this test rejects H₀ in the chosen world.
              </p>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
