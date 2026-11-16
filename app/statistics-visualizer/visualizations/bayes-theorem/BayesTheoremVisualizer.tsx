'use client';

import { useState } from 'react';
import { ArrowRight, Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { Panel, Slider, Stat } from '../_probability/controls';
import { fmtPct, naturalFrequencies, posterior } from './bayes';

const PRESETS = [
  { label: 'Screening test', prevalence: 1, sensitivity: 90, specificity: 91 },
  { label: 'Rare disease, 99% accurate test', prevalence: 0.1, sensitivity: 99, specificity: 99 },
  { label: 'Common condition', prevalence: 20, sensitivity: 85, specificity: 95 },
];

const COLS = 40;
const CELL = 20;
const TOTAL = 1000;

type Kind = 'tp' | 'fn' | 'fp' | 'tn';

const STYLE: Record<Kind, { sick: boolean; positive: boolean; label: string }> = {
  tp: { sick: true, positive: true, label: 'Has the disease, tests positive' },
  fn: { sick: true, positive: false, label: 'Has the disease, tests negative' },
  fp: { sick: false, positive: true, label: 'Healthy, tests positive' },
  tn: { sick: false, positive: false, label: 'Healthy, tests negative' },
};

const SICK = '#e11d48';
const HEALTHY = '#475569';

function Marker({ kind, x, y, dim }: { kind: Kind; x: number; y: number; dim?: boolean }) {
  const { sick, positive } = STYLE[kind];
  const color = sick ? SICK : HEALTHY;
  const common = { fill: positive ? color : 'white', stroke: color, strokeWidth: 2, opacity: dim ? 0.12 : 1 };
  return sick ? <circle cx={x} cy={y} r={7} {...common} /> : <rect x={x - 6.5} y={y - 6.5} width={13} height={13} rx={1.5} {...common} />;
}

function PeopleGrid({ counts, positivesOnly }: { counts: ReturnType<typeof naturalFrequencies>; positivesOnly: boolean }) {
  const kinds: Kind[] = [];
  (['tp', 'fn', 'fp', 'tn'] as Kind[]).forEach((k) => {
    for (let i = 0; i < counts[k]; i++) kinds.push(k);
  });
  return (
    <svg viewBox={`0 0 ${COLS * CELL} ${(TOTAL / COLS) * CELL}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label={`${TOTAL} people: ${counts.tp} true positives, ${counts.fn} false negatives, ${counts.fp} false positives, ${counts.tn} true negatives`}>
      {kinds.map((kind, i) => (
        <Marker key={i} kind={kind} x={(i % COLS) * CELL + CELL / 2} y={Math.floor(i / COLS) * CELL + CELL / 2} dim={positivesOnly && !STYLE[kind].positive} />
      ))}
    </svg>
  );
}

function Node({ x, y, text, color }: { x: number; y: number; text: string; color: string }) {
  return (
    <g>
      <rect x={x - 95} y={y - 22} width={190} height={44} rx={10} fill="white" stroke={color} strokeWidth={2.5} />
      <text x={x} y={y + 7} fontSize={20} textAnchor="middle" fill={color} fontWeight={700}>
        {text}
      </text>
    </g>
  );
}

function Edge({ x1, y1, x2, y2, label, above }: { x1: number; y1: number; x2: number; y2: number; label: string; above: boolean }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={2.5} />
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + (above ? -10 : 24)} fontSize={18} textAnchor="middle" fill="#334155">
        {label}
      </text>
    </g>
  );
}

function FrequencyTree({ counts, prior, sensitivity, specificity }: { counts: ReturnType<typeof naturalFrequencies>; prior: number; sensitivity: number; specificity: number }) {
  const n = (x: number) => x.toLocaleString('en-US');
  const p = (x: number) => fmtPct(x, x < 0.01 && x > 0 ? 2 : 1);
  return (
    <svg viewBox="0 0 800 290" className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Natural frequency tree">
      <Edge x1={195} y1={145} x2={305} y2={75} label={p(prior)} above />
      <Edge x1={195} y1={145} x2={305} y2={215} label={p(1 - prior)} above={false} />
      <Edge x1={495} y1={75} x2={605} y2={35} label={p(sensitivity)} above />
      <Edge x1={495} y1={75} x2={605} y2={110} label={p(1 - sensitivity)} above={false} />
      <Edge x1={495} y1={215} x2={605} y2={180} label={p(1 - specificity)} above />
      <Edge x1={495} y1={215} x2={605} y2={255} label={p(specificity)} above={false} />
      <Node x={100} y={145} text={`${n(counts.total)} people`} color="#0f172a" />
      <Node x={400} y={75} text={`${n(counts.sick)} have it`} color={SICK} />
      <Node x={400} y={215} text={`${n(counts.healthy)} do not`} color={HEALTHY} />
      <Node x={700} y={35} text={`${n(counts.tp)} test +`} color={SICK} />
      <Node x={700} y={110} text={`${n(counts.fn)} test −`} color={SICK} />
      <Node x={700} y={180} text={`${n(counts.fp)} test +`} color={HEALTHY} />
      <Node x={700} y={255} text={`${n(counts.tn)} test −`} color={HEALTHY} />
    </svg>
  );
}

const num = (x: number) => (x >= 0.01 || x === 0 ? x.toFixed(4) : x.toPrecision(3));

export default function BayesTheoremVisualizer() {
  const [prevalence, setPrevalence] = useState(1);
  const [sensitivity, setSensitivity] = useState(90);
  const [specificity, setSpecificity] = useState(91);
  const [history, setHistory] = useState<{ prior: number; result: '+' | '−' }[]>([]);
  const [positivesOnly, setPositivesOnly] = useState(false);

  const inputs = { prior: prevalence / 100, sensitivity: sensitivity / 100, specificity: specificity / 100 };
  const result = posterior(inputs);
  const counts = naturalFrequencies(inputs, TOTAL);
  const positives = counts.tp + counts.fp;
  const negatives = counts.tn + counts.fn;

  const editInput = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    setHistory([]);
  };

  const testAgain = (outcome: '+' | '−') => {
    const next = outcome === '+' ? result.ppv : result.diseaseGivenNegative;
    if (!Number.isFinite(next)) return;
    setHistory([...history, { prior: inputs.prior, result: outcome }]);
    setPrevalence(next * 100);
  };

  const resetPrior = () => {
    if (history.length) setPrevalence(history[0].prior * 100);
    setHistory([]);
  };

  const s = inputs.sensitivity;
  const fpr = 1 - inputs.specificity;
  const pr = inputs.prior;

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Slider
          label={history.length ? 'Prior P(disease)' : 'Prevalence P(disease)'}
          value={prevalence}
          min={0.1}
          max={99.9}
          step={0.1}
          display={fmtPct(inputs.prior, prevalence < 1 ? 2 : 1)}
          onChange={editInput(setPrevalence)}
          hint="share of people tested who have the disease"
        />
        <Slider
          label="Sensitivity P(+ | disease)"
          value={sensitivity}
          min={50}
          max={100}
          step={0.5}
          display={fmtPct(inputs.sensitivity)}
          onChange={editInput(setSensitivity)}
          hint="sick people the test catches"
        />
        <Slider
          label="Specificity P(− | healthy)"
          value={specificity}
          min={50}
          max={100}
          step={0.5}
          display={fmtPct(inputs.specificity)}
          onChange={editInput(setSpecificity)}
          hint="healthy people the test clears"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-ink">Presets</span>
        {PRESETS.map((p) => (
          <Button
            key={p.label}
            size="sm"
            variant="outline"
            onClick={() => {
              setPrevalence(p.prevalence);
              setSensitivity(p.sensitivity);
              setSpecificity(p.specificity);
              setHistory([]);
            }}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-subtle p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink">Test the same person again</span>
          <Button size="sm" variant="secondary" onClick={() => testAgain('+')} leftIcon={<Plus className="h-4 w-4" />}>
            Positive again
          </Button>
          <Button size="sm" variant="secondary" onClick={() => testAgain('−')} leftIcon={<Minus className="h-4 w-4" />}>
            Negative
          </Button>
          <Button size="sm" variant="ghost" onClick={resetPrior} disabled={!history.length} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Back to prevalence
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {history.length === 0 ? (
            <span className="text-ink-muted">
              Each button treats the current posterior as the new prior, assuming the repeat test errs independently of the first.
            </span>
          ) : (
            <>
              {history.map((h, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="rounded-md border border-line bg-white px-2 py-1 font-mono text-ink">{fmtPct(h.prior, 2)}</span>
                  <span className="flex items-center gap-1 text-ink-muted">
                    test {h.result}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </span>
              ))}
              <span className="rounded-md border border-brand-200 bg-brand-50 px-2 py-1 font-mono font-semibold text-brand-700">{fmtPct(inputs.prior, 2)}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 lg:col-span-2">
          <div>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-ink">1,000 people tested</p>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={positivesOnly} onChange={(e) => setPositivesOnly(e.target.checked)} className="h-4 w-4 accent-brand-600" />
                Show only positive tests
              </label>
            </div>
            <PeopleGrid counts={counts} positivesOnly={positivesOnly} />
            <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-ink-muted sm:grid-cols-2">
              {(['tp', 'fn', 'fp', 'tn'] as Kind[]).map((k) => (
                <li key={k} className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" aria-hidden="true">
                    <Marker kind={k} x={10} y={10} />
                  </svg>
                  <span>
                    {STYLE[k].label}: <span className="font-mono font-semibold text-ink">{counts[k].toLocaleString('en-US')}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Natural frequency tree
              <span className="ml-2 font-normal text-ink-muted">(counts rounded to whole people)</span>
            </p>
            <FrequencyTree counts={counts} prior={inputs.prior} sensitivity={inputs.sensitivity} specificity={inputs.specificity} />
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <Panel title="After a positive test">
            <dl className="space-y-1">
              <Stat label="P(disease | +)" value={fmtPct(result.ppv)} strong />
              <Stat label="From the counts" value={`${counts.tp} / ${positives}`} />
              <Stat label="P(+) overall" value={fmtPct(result.pPositive)} />
              <Stat label="Likelihood ratio LR+" value={Number.isFinite(result.likelihoodRatio) ? result.likelihoodRatio.toFixed(2) : '∞'} />
            </dl>
          </Panel>

          <Panel title="After a negative test">
            <dl className="space-y-1">
              <Stat label="P(no disease | −)" value={fmtPct(result.npv, 2)} strong />
              <Stat label="From the counts" value={`${counts.tn} / ${negatives}`} />
              <Stat label="P(disease | −)" value={fmtPct(result.diseaseGivenNegative, 2)} />
            </dl>
          </Panel>

          <Panel title="Bayes' theorem with these numbers">
            <div className="space-y-2 break-words font-mono text-xs text-ink sm:text-sm">
              <p>P(D | +) = P(+ | D) P(D) / P(+)</p>
              <p>
                = ({num(s)} × {num(pr)}) / ({num(s)} × {num(pr)} + {num(fpr)} × {num(1 - pr)})
              </p>
              <p>
                = {num(s * pr)} / {num(s * pr + fpr * (1 - pr))}
              </p>
              <p className="font-semibold text-brand-700">= {Number.isFinite(result.ppv) ? result.ppv.toFixed(4) : '–'}</p>
            </div>
          </Panel>

          <p className="text-sm text-ink-muted">
            {result.ppv < 0.5
              ? `Most positives here are false alarms: ${counts.fp} healthy people test positive against ${counts.tp} sick ones. Ignoring how rare the disease is makes the test look far more conclusive than it is: the base-rate fallacy.`
              : 'With this prior, a positive result is more likely right than wrong. Lower the prevalence and watch the false positives take over.'}
          </p>
        </div>
      </div>
    </div>
  );
}
