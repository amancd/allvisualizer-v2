'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { AVOGADRO, ELEMENTS, molarMass, parseAmount, parseFormula, sci, superscript, type Composition } from '../_stoichiometry/chem';
import { ChemFormula, ElementSwatch, MoleculeIcon } from '../_stoichiometry/Molecule';

const PRESETS = ['H2O', 'CO2', 'NaCl', 'NH3', 'C6H12O6', 'H2SO4', 'CaCO3', 'C2H5OH', 'C8H10N4O2', 'CuSO4·5H2O', 'Fe', 'Au'];
const NAMES: Record<string, string> = {
  H2O: 'water',
  CO2: 'carbon dioxide',
  NaCl: 'sodium chloride',
  NH3: 'ammonia',
  C6H12O6: 'glucose',
  H2SO4: 'sulfuric acid',
  CaCO3: 'calcium carbonate',
  C2H5OH: 'ethanol',
  C8H10N4O2: 'caffeine',
  'CuSO4·5H2O': 'copper(II) sulfate pentahydrate',
  Fe: 'iron',
  Au: 'gold',
};

const METALS = new Set(['Li', 'Be', 'Na', 'Mg', 'Al', 'K', 'Ca', 'Ti', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ag', 'Sn', 'Ba', 'Pt', 'Au', 'Hg', 'Pb', 'U']);

const SECONDS_PER_YEAR = 365.25 * 24 * 3600;
const UNIVERSE_AGE_YEARS = 13.8e9;

type NodeId = 'g' | 'mol' | 'particles' | `atoms:${string}`;

function particleNoun(comp: Composition) {
  const els = Object.keys(comp);
  if (els.length === 1 && comp[els[0]] === 1) return 'atoms';
  if (els.some((el) => METALS.has(el))) return 'formula units';
  return 'molecules';
}

function plain(x: number) {
  if (!Number.isFinite(x)) return '';
  if (x === 0) return '0';
  const abs = Math.abs(x);
  if (abs >= 1e-3 && abs < 1e6) return String(Number(x.toPrecision(6)));
  return x.toExponential(5).replace(/\.?0+e/, 'e').replace('e+', 'e');
}

const PALETTE = ['#0ea5e9', '#f43f5e', '#8b5cf6', '#f59e0b', '#10b981', '#64748b', '#ec4899', '#14b8a6'];

function Donut({ parts }: { parts: { el: string; fraction: number; color: string }[] }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offsets = parts.map((_, i) => parts.slice(0, i).reduce((sum, q) => sum + q.fraction * c, 0));
  return (
    <svg viewBox="0 0 200 200" className={`${responsiveSurface} mx-auto max-w-[220px]`} role="img" aria-label="Mass percent composition">
      <circle cx={100} cy={100} r={r} fill="none" stroke="#e2e8f0" strokeWidth={36} />
      {parts.map((p, i) => {
        const len = p.fraction * c;
        return (
          <circle
            key={p.el}
            cx={100}
            cy={100}
            r={r}
            fill="none"
            stroke={p.color}
            strokeWidth={36}
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offsets[i]}
            transform="rotate(-90 100 100)"
          />
        );
      })}
      <text x={100} y={96} textAnchor="middle" fontSize={14} fill="#64748b">
        mass %
      </text>
      <text x={100} y={116} textAnchor="middle" fontSize={14} fill="#64748b">
        by element
      </text>
    </svg>
  );
}

const LOG_MIN = 0;
const LOG_MAX = 26;
const RX = (log: number) => 30 + ((log - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 740;

const LANDMARKS = [
  { value: 8.1e9, label: 'people on Earth', up: true },
  { value: 3.7e13, label: 'cells in a human body', up: false },
  { value: 4.35e17, label: 'seconds since the Big Bang', up: true },
  { value: 1.67e21, label: 'water molecules in one drop', up: false },
  { value: AVOGADRO, label: 'one mole', up: true },
];

function ScaleRuler({ count, noun }: { count: number; noun: string }) {
  const log = count > 0 ? Math.log10(count) : -Infinity;
  const inRange = log >= LOG_MIN && log <= LOG_MAX;
  return (
    <svg viewBox="0 0 800 190" className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Logarithmic scale from 1 to 10 to the 26">
      <line x1={RX(LOG_MIN)} y1={95} x2={RX(LOG_MAX)} y2={95} stroke="#334155" strokeWidth={2} />
      {Array.from({ length: (LOG_MAX - LOG_MIN) / 2 + 1 }, (_, i) => LOG_MIN + i * 2).map((p) => (
        <g key={p}>
          <line x1={RX(p)} y1={89} x2={RX(p)} y2={101} stroke="#334155" strokeWidth={1.5} />
          <text x={RX(p)} y={117} fontSize={13} textAnchor="middle" fill="#64748b">
            10{superscript(p)}
          </text>
        </g>
      ))}
      {LANDMARKS.map((m) => {
        const x = RX(Math.log10(m.value));
        const y = m.up ? 40 : 158;
        return (
          <g key={m.label}>
            <line x1={x} y1={m.up ? 50 : 122} x2={x} y2={m.up ? 89 : 140} stroke={m.label === 'one mole' ? '#e11d48' : '#94a3b8'} strokeWidth={1.5} />
            <circle cx={x} cy={95} r={4} fill={m.label === 'one mole' ? '#e11d48' : '#94a3b8'} />
            <text x={Math.min(Math.max(x, 80), 720)} y={y} fontSize={13} textAnchor="middle" fill={m.label === 'one mole' ? '#be123c' : '#475569'} fontWeight={m.label === 'one mole' ? 700 : 400}>
              {m.label}
            </text>
            <text x={Math.min(Math.max(x, 80), 720)} y={y + 15} fontSize={12} textAnchor="middle" fill="#94a3b8">
              {sci(m.value, 3)}
            </text>
          </g>
        );
      })}
      {inRange && (
        <g>
          <polygon points={`${RX(log)},${92} ${RX(log) - 9},${76} ${RX(log) + 9},${76}`} fill="#0284c7" />
          <text x={Math.min(Math.max(RX(log), 60), 740)} y={70} fontSize={13} textAnchor="middle" fill="#0369a1" fontWeight={700}>
            your {noun}
          </text>
        </g>
      )}
    </svg>
  );
}

function ChainNode({
  label,
  unit,
  value,
  active,
  text,
  onFocus,
  onChange,
}: {
  label: React.ReactNode;
  unit: string;
  value: number;
  active: boolean;
  text: string;
  onFocus: () => void;
  onChange: (t: string) => void;
}) {
  return (
    <div className={`min-w-0 flex-1 rounded-xl border p-3 ${active ? 'border-brand-300 bg-brand-50/60' : 'border-line bg-subtle'}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <input
        className="mt-1 w-full rounded-md border border-line-strong bg-white px-2 py-1.5 font-mono text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        value={active ? text : sci(value, 4)}
        onFocus={onFocus}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        spellCheck={false}
        aria-label={`${typeof label === 'string' ? label : 'Amount'} in ${unit}`}
      />
      <p className="mt-1 text-xs text-ink-faint">{unit}</p>
    </div>
  );
}

function ChainArrow({ op }: { op: string }) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-1 text-xs font-medium text-violet-700 lg:flex-col lg:px-1">
      <ArrowDown className="h-4 w-4 lg:hidden" />
      <ArrowRight className="hidden h-4 w-4 lg:block" />
      <span className="whitespace-nowrap font-mono">{op}</span>
    </div>
  );
}

export default function MoleConceptVisualizer() {
  const [formula, setFormula] = useState('H2O');
  const [draft, setDraft] = useState('H2O');
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<NodeId>('g');
  const [text, setText] = useState('10');

  const comp = useMemo(() => parseFormula(formula), [formula]);
  const M = molarMass(comp);
  const elements = Object.keys(comp);
  const noun = particleNoun(comp);

  const amount = parseAmount(text);
  const valid = Number.isFinite(amount);
  let moles = 0;
  if (valid) {
    if (source === 'g') moles = amount / M;
    else if (source === 'mol') moles = amount;
    else if (source === 'particles') moles = amount / AVOGADRO;
    else {
      const el = source.slice(6);
      moles = amount / (AVOGADRO * (comp[el] ?? 1));
    }
  }
  const grams = moles * M;
  const particles = moles * AVOGADRO;

  const valueOf = (id: NodeId) => {
    if (id === 'g') return grams;
    if (id === 'mol') return moles;
    if (id === 'particles') return particles;
    return particles * (comp[id.slice(6)] ?? 0);
  };

  const focusNode = (id: NodeId) => {
    if (id === source) return;
    setText(plain(valueOf(id)));
    setSource(id);
  };

  const apply = (f: string) => {
    try {
      parseFormula(f);
      if (source.startsWith('atoms:')) {
        setText(plain(grams));
        setSource('g');
      }
      setFormula(f);
      setDraft(f);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read that formula');
    }
  };

  const parts = elements.map((el, i) => ({
    el,
    count: comp[el],
    mass: ELEMENTS[el].mass,
    subtotal: ELEMENTS[el].mass * comp[el],
    fraction: (ELEMENTS[el].mass * comp[el]) / M,
    color: PALETTE[i % PALETTE.length],
  }));

  const years = particles / SECONDS_PER_YEAR;

  return (
    <div className="space-y-6 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink">Compound</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <Button key={p} size="sm" variant={formula === p ? 'primary' : 'outline'} aria-pressed={formula === p} onClick={() => apply(p)}>
              <ChemFormula formula={p} />
            </Button>
          ))}
        </div>
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            apply(draft.trim());
          }}
        >
          <div className="min-w-0 flex-1 basis-48 sm:max-w-sm">
            <Input
              label="Or type a formula"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="e.g. Ca3(PO4)2"
              fullWidth
              spellCheck={false}
              autoCapitalize="off"
            />
          </div>
          <Button type="submit" variant="outline">
            Calculate
          </Button>
        </form>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <MoleculeIcon comp={comp} title={formula} className="h-12 w-auto max-w-full" />
            <div>
              <p className="text-lg font-semibold text-ink">
                <ChemFormula formula={formula} />
                {NAMES[formula] && <span className="ml-2 text-sm font-normal text-ink-muted">{NAMES[formula]}</span>}
              </p>
              <p className="text-sm text-ink-muted">
                Molar mass M = <span className="font-mono font-semibold text-ink">{M.toFixed(3)} g/mol</span>
              </p>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-subtle text-left text-ink">
                <tr>
                  <th className="px-3 py-2 font-semibold">Element</th>
                  <th className="px-3 py-2 text-right font-semibold">Atoms</th>
                  <th className="px-3 py-2 text-right font-semibold">× Atomic mass</th>
                  <th className="px-3 py-2 text-right font-semibold">= g/mol</th>
                  <th className="px-3 py-2 text-right font-semibold">Mass %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-mono tabular-nums text-gray-700">
                {parts.map((p) => (
                  <tr key={p.el}>
                    <td className="px-3 py-2 font-sans">
                      <span className="inline-flex items-center gap-1.5">
                        <ElementSwatch el={p.el} />
                        <span className="font-semibold text-ink">{p.el}</span>
                        <span className="hidden text-xs text-ink-muted sm:inline">{ELEMENTS[p.el].name}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">{p.count}</td>
                    <td className="px-3 py-2 text-right">{p.mass}</td>
                    <td className="px-3 py-2 text-right">{p.subtotal.toFixed(3)}</td>
                    <td className="px-3 py-2 text-right">{(p.fraction * 100).toFixed(2)}%</td>
                  </tr>
                ))}
                <tr className="bg-subtle font-semibold text-ink">
                  <td className="px-3 py-2 font-sans">Total</td>
                  <td className="px-3 py-2 text-right">{parts.reduce((s, p) => s + p.count, 0)}</td>
                  <td className="px-3 py-2" />
                  <td className="px-3 py-2 text-right">{M.toFixed(3)}</td>
                  <td className="px-3 py-2 text-right">100.00%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-xl border border-line p-4">
          <Donut parts={parts} />
          <ul className="mt-3 space-y-1.5 text-sm">
            {parts.map((p) => (
              <li key={p.el} className="flex items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: p.color }} />
                <span className="w-7 font-semibold text-ink">{p.el}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-subtle">
                  <div className="h-full rounded-full" style={{ width: `${p.fraction * 100}%`, backgroundColor: p.color }} />
                </div>
                <span className="w-16 text-right font-mono text-xs tabular-nums text-ink">{(p.fraction * 100).toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-ink">Conversion chain</p>
          <p className="text-sm text-ink-muted">Type in any box. The others follow through the conversion factors between them. Scientific notation like 3.2e22 works.</p>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
          <ChainNode label="Mass" unit="grams" value={grams} active={source === 'g'} text={text} onFocus={() => focusNode('g')} onChange={setText} />
          <ChainArrow op={`÷ ${M.toFixed(3)} g/mol`} />
          <ChainNode label="Amount" unit="moles" value={moles} active={source === 'mol'} text={text} onFocus={() => focusNode('mol')} onChange={setText} />
          <ChainArrow op="× 6.022×10²³ /mol" />
          <ChainNode
            label={noun.charAt(0).toUpperCase() + noun.slice(1)}
            unit={noun}
            value={particles}
            active={source === 'particles'}
            text={text}
            onFocus={() => focusNode('particles')}
            onChange={setText}
          />
        </div>
        {!valid && <p className="text-sm text-red-600">Enter a positive number, for example 25, 0.5 or 1.2e24.</p>}
        <div className="rounded-xl border border-line p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Atoms of each element</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {elements.map((el) => {
              const id: NodeId = `atoms:${el}`;
              return (
                <div key={el} className="flex items-center gap-2">
                  <span className="shrink-0 font-mono text-xs text-violet-700">× {comp[el]}</span>
                  <ChainNode
                    label={`${el} atoms`}
                    unit={`atoms of ${ELEMENTS[el].name.toLowerCase()}`}
                    value={valueOf(id)}
                    active={source === id}
                    text={text}
                    onFocus={() => focusNode(id)}
                    onChange={setText}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-sm text-ink-muted">
          One {noun === 'atoms' ? 'atom' : noun === 'formula units' ? 'formula unit' : 'molecule'} of <ChemFormula formula={formula} /> has a mass of{' '}
          <span className="font-mono text-ink">{sci(M / AVOGADRO, 4)} g</span> ({M.toFixed(3)} u).
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-ink">How big is Avogadro&apos;s number?</p>
        <ScaleRuler count={particles} noun={noun} />
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-subtle p-3">
            <p className="text-ink-muted">Counting your {sci(particles, 4)} {noun} at one per second would take</p>
            <p className="mt-1 font-mono text-base font-semibold text-ink">
              {valid ? `${sci(years, 3)} years` : '–'}
            </p>
            {valid && years > UNIVERSE_AGE_YEARS / 1000 && (
              <p className="mt-1 text-ink-muted">That is {sci(years / UNIVERSE_AGE_YEARS, 3)} times the age of the universe (13.8 billion years).</p>
            )}
          </div>
          <div className="rounded-xl border border-line bg-subtle p-3">
            <p className="text-ink-muted">Each step on the ruler above is a factor of 100. A mole is about</p>
            <p className="mt-1 font-mono text-base font-semibold text-ink">{sci(AVOGADRO / 8.1e9, 3)} times</p>
            <p className="mt-1 text-ink-muted">the number of people on Earth, yet one mole of water is only 18 g, a little more than a tablespoon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
