'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { ChemFormula, MoleculeGlyph, moleculeLayout } from '../_stoichiometry/Molecule';
import { analyse, REACTIONS, type Reaction, type ReactionSpecies } from './reactions';

type Mode = 'particles' | 'mass';
type Unit = 'g' | 'mol';

const MAX_PARTICLES = 16;
const STEP_MS = 650;
const VIEW_W = 800;
const VIEW_H = 340;
const COLS = 8;
const CELL_W = 46;
const ROW_H = 46;
const PANEL_TOP = 48;

function EquationLine({ reaction }: { reaction: Reaction }) {
  const parts = [...reaction.reactants, ...reaction.products];
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-lg font-semibold text-ink">
      {parts.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && i !== reaction.reactants.length && <span className="text-ink-muted">+</span>}
          {i === reaction.reactants.length && <ArrowRight className="h-5 w-5 text-ink-muted" aria-label="yields" />}
          <span>
            {s.coef > 1 && <span className="mr-0.5 text-brand-700">{s.coef}</span>}
            <ChemFormula formula={s.formula} />
          </span>
        </Fragment>
      ))}
    </span>
  );
}

function glyphScale(s: ReactionSpecies) {
  const l = moleculeLayout(s.comp);
  return Math.min(1.1, 38 / Math.max(l.width, l.height));
}

interface Slot {
  key: string;
  species: ReactionSpecies;
  x: number;
  y: number;
  visible: boolean;
  ring?: string;
}

function layoutPanel(left: number, groups: { species: ReactionSpecies; count: number; state: (k: number) => { visible: boolean; ring?: string } }[], prefix: string) {
  const slots: Slot[] = [];
  let row = 0;
  groups.forEach((g, gi) => {
    for (let k = 0; k < g.count; k++) {
      const r = row + Math.floor(k / COLS);
      const c = k % COLS;
      const jx = ((k * 37 + gi * 11) % 7) - 3;
      const jy = ((k * 53 + gi * 5) % 5) - 2;
      slots.push({
        key: `${prefix}-${gi}-${k}`,
        species: g.species,
        x: left + 30 + c * CELL_W + jx,
        y: PANEL_TOP + 26 + r * ROW_H + jy,
        ...g.state(k),
      });
    }
    row += Math.max(1, Math.ceil(g.count / COLS));
  });
  return slots;
}

function ParticleView({ reaction }: { reaction: Reaction }) {
  const [counts, setCounts] = useState<number[]>(reaction.defaultParticles);
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);

  const result = analyse(reaction, counts, true);
  const events = result.extent;
  const totalTicks = events * 2;
  const done = tick >= totalTicks;
  const completed = Math.floor(tick / 2);
  const highlighted = tick % 2 === 1 ? completed : -1;
  const isPlaying = running && !done;

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setTimeout(() => setTick((t) => t + 1), STEP_MS);
    return () => window.clearTimeout(id);
  }, [isPlaying, tick]);

  const setCount = (i: number, v: number) => {
    setCounts((prev) => prev.map((c, j) => (j === i ? v : c)));
    setTick(0);
    setRunning(false);
  };

  const reactantSlots = layoutPanel(
    0,
    reaction.reactants.map((s) => ({
      species: s,
      count: counts[reaction.reactants.indexOf(s)],
      state: (k: number) => {
        const event = Math.floor(k / s.coef);
        const consumed = event < completed && event < events;
        const lit = event === highlighted;
        const leftover = done && event >= events;
        return { visible: !consumed, ring: lit ? '#f59e0b' : leftover && tick > 0 ? '#0284c7' : undefined };
      },
    })),
    'r',
  );
  const productSlots = layoutPanel(
    VIEW_W / 2,
    reaction.products.map((s, j) => ({
      species: s,
      count: result.formed[j],
      state: (k: number) => ({ visible: Math.floor(k / s.coef) < completed }),
    })),
    'p',
  );

  const usedNow = reaction.reactants.map((s) => s.coef * Math.min(completed, events));
  const leftNow = counts.map((c, i) => c - usedNow[i]);
  const formedNow = reaction.products.map((s) => s.coef * Math.min(completed, events));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reaction.reactants.map((s, i) => (
          <label key={s.formula} className="block">
            <span className="flex justify-between text-sm font-medium text-ink">
              <span>
                <ChemFormula formula={s.formula} /> {Object.values(s.comp).reduce((a, b) => a + b, 0) === 1 ? 'atoms' : 'molecules'}
              </span>
              <span className="font-mono">{counts[i]}</span>
            </span>
            <input
              type="range"
              min={0}
              max={MAX_PARTICLES}
              step={1}
              value={counts[i]}
              onChange={(e) => setCount(i, Number(e.target.value))}
              className="mt-1 w-full accent-brand-600"
            />
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => {
            if (done) setTick(0);
            setRunning((r) => (done ? true : !r));
          }}
          disabled={events === 0}
          leftIcon={isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        >
          {isPlaying ? 'Pause' : done && tick > 0 ? 'Replay' : 'React'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setRunning(false);
            setTick((t) => Math.min(totalTicks, t % 2 === 1 ? t + 1 : t + 2));
          }}
          disabled={done}
          leftIcon={<StepForward className="h-4 w-4" />}
        >
          One reaction
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setRunning(false);
            setTick(0);
          }}
          leftIcon={<RotateCcw className="h-4 w-4" />}
        >
          Reset
        </Button>
      </div>

      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Reactant and product molecules">
        <rect x={6} y={6} width={VIEW_W / 2 - 18} height={VIEW_H - 12} rx={14} fill="#f8fafc" stroke="#e2e8f0" />
        <rect x={VIEW_W / 2 + 12} y={6} width={VIEW_W / 2 - 18} height={VIEW_H - 12} rx={14} fill="#f5f3ff" stroke="#ede9fe" />
        <text x={24} y={34} fontSize={17} fontWeight={700} fill="#0f172a">
          Reactants
        </text>
        <text x={VIEW_W / 2 + 30} y={34} fontSize={17} fontWeight={700} fill="#4c1d95">
          Products
        </text>
        <path d={`M ${VIEW_W / 2 - 8} ${VIEW_H / 2} L ${VIEW_W / 2 + 8} ${VIEW_H / 2}`} stroke="#94a3b8" strokeWidth={3} markerEnd="url(#lr-arrow)" />
        <defs>
          <marker id="lr-arrow" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={4} markerHeight={4} orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
          </marker>
        </defs>
        {[...reactantSlots, ...productSlots].map((s) => (
          <g key={s.key} style={{ transition: 'opacity 350ms ease' }} opacity={s.visible ? 1 : 0}>
            <MoleculeGlyph comp={s.species.comp} x={s.x} y={s.y} scale={glyphScale(s.species)} ring={s.ring} />
          </g>
        ))}
        {events === 0 && (
          <text x={VIEW_W / 4} y={VIEW_H - 24} fontSize={14} textAnchor="middle" fill="#b45309">
            Not enough of every reactant for even one reaction
          </text>
        )}
      </svg>

      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {reaction.reactants.map((s, i) => {
          const isLimiting = result.limiting.includes(i);
          return (
            <div key={s.formula} className={`rounded-xl border p-3 ${isLimiting ? 'border-amber-300 bg-amber-50' : 'border-line bg-subtle'}`}>
              <p className="flex flex-wrap items-center justify-between gap-2 font-semibold text-ink">
                <ChemFormula formula={s.formula} />
                <span className={`rounded-full px-2 py-0.5 text-xs ${isLimiting ? 'bg-amber-200 text-amber-900' : 'bg-sky-100 text-sky-800'}`}>
                  {isLimiting ? 'Limiting' : 'In excess'}
                </span>
              </p>
              <p className="mt-1 font-mono text-xs text-ink-muted">
                {counts[i]} ÷ {s.coef} = {(counts[i] / s.coef).toFixed(2)} reaction sets
              </p>
              <p className="mt-1 text-ink-muted">
                Used <span className="font-mono text-ink">{usedNow[i]}</span>, left <span className="font-mono text-ink">{leftNow[i]}</span>
              </p>
              {done && tick > 0 && isLimiting && leftNow[i] > 0 && (
                <p className="mt-1 text-xs text-amber-800">
                  {leftNow[i]} left over, but each reaction needs {s.coef}, so no further reaction is possible.
                </p>
              )}
            </div>
          );
        })}
        <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-3">
          <p className="font-semibold text-violet-900">Products</p>
          {reaction.products.map((p, j) => (
            <p key={p.formula} className="mt-1 text-ink-muted">
              <ChemFormula formula={p.formula} />: <span className="font-mono text-ink">{formedNow[j]}</span> of {result.formed[j]} possible
            </p>
          ))}
          <p className="mt-1 text-xs text-ink-muted">
            Reactions run: {Math.min(completed, events)} of {events}
          </p>
        </div>
      </div>
    </div>
  );
}

function NumberField({ value, digits, onCommit, label }: { value: number; digits: number; onCommit: (v: number) => void; label: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      type="text"
      inputMode="decimal"
      value={draft ?? String(Number(value.toFixed(digits)))}
      onFocus={() => setDraft(String(Number(value.toFixed(digits))))}
      onChange={(e) => {
        setDraft(e.target.value);
        const v = Number(e.target.value);
        if (e.target.value.trim() !== '' && Number.isFinite(v) && v >= 0) onCommit(v);
      }}
      onBlur={() => setDraft(null)}
      className="w-24 rounded-md border border-line-strong bg-white px-2 py-1 text-right font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      aria-label={label}
    />
  );
}

function fmt(x: number, d = 3) {
  return Number.isFinite(x) ? x.toFixed(d) : '–';
}

function MassView({ reaction }: { reaction: Reaction }) {
  const [unit, setUnit] = useState<Unit>('g');
  const [moles, setMoles] = useState<number[]>(() => reaction.defaultGrams.map((g, i) => g / reaction.reactants[i].M));
  const [productIndex, setProductIndex] = useState(0);
  const [actual, setActual] = useState('');

  const result = analyse(reaction, moles);
  const product = reaction.products[productIndex];
  const theoMol = result.formed[productIndex];
  const theoG = theoMol * product.M;
  const actualG = Number(actual);
  const hasActual = actual.trim() !== '' && Number.isFinite(actualG) && actualG >= 0;
  const pct = hasActual && theoG > 0 ? (actualG / theoG) * 100 : NaN;

  const max = (s: ReactionSpecies) => (unit === 'g' ? Math.max(100, Math.ceil(s.M * 4)) : 10);
  const step = unit === 'g' ? 0.5 : 0.05;
  const display = (i: number) => (unit === 'g' ? moles[i] * reaction.reactants[i].M : moles[i]);
  const setDisplay = (i: number, v: number) => {
    const mol = unit === 'g' ? v / reaction.reactants[i].M : v;
    setMoles((prev) => prev.map((m, j) => (j === i ? Math.max(0, mol) : m)));
  };

  const reactantMassUsed = reaction.reactants.reduce((s, r, i) => s + result.used[i] * r.M, 0);
  const productMass = reaction.products.reduce((s, p, j) => s + result.formed[j] * p.M, 0);
  const smallest = Math.min(...result.ratios);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-ink">Enter amounts in</span>
        {(['g', 'mol'] as Unit[]).map((u) => (
          <Button key={u} size="sm" variant={unit === u ? 'primary' : 'outline'} aria-pressed={unit === u} onClick={() => setUnit(u)}>
            {u === 'g' ? 'grams' : 'moles'}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {reaction.reactants.map((s, i) => (
          <div key={s.formula}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-ink">
              <span>
                <ChemFormula formula={s.formula} /> <span className="font-normal text-ink-muted">(M = {s.M.toFixed(3)} g/mol)</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <NumberField
                  value={display(i)}
                  digits={unit === 'g' ? 2 : 4}
                  onCommit={(v) => setDisplay(i, v)}
                  label={`Amount of ${s.formula} in ${unit}`}
                />
                <span className="w-7 text-ink-muted">{unit}</span>
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={max(s)}
              step={step}
              value={Math.min(display(i), max(s))}
              onChange={(e) => setDisplay(i, Number(e.target.value))}
              className="mt-2 w-full accent-brand-600"
              aria-label={`${s.formula} slider`}
            />
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-subtle text-left text-ink">
            <tr>
              <th className="px-3 py-2 font-semibold">Reactant</th>
              <th className="px-3 py-2 text-right font-semibold">Mass (g)</th>
              <th className="px-3 py-2 text-right font-semibold">Moles</th>
              <th className="px-3 py-2 text-right font-semibold">Coef.</th>
              <th className="px-3 py-2 text-right font-semibold">Moles ÷ coef.</th>
              <th className="px-3 py-2 text-right font-semibold">Left over</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line font-mono tabular-nums text-gray-700">
            {reaction.reactants.map((s, i) => {
              const lim = result.limiting.includes(i);
              return (
                <tr key={s.formula} className={lim ? 'bg-amber-50' : ''}>
                  <td className="px-3 py-2 font-sans">
                    <span className="font-semibold text-ink">
                      <ChemFormula formula={s.formula} />
                    </span>
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${lim ? 'bg-amber-200 text-amber-900' : 'bg-sky-100 text-sky-800'}`}>
                      {lim ? 'limiting' : 'excess'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">{fmt(moles[i] * s.M, 2)}</td>
                  <td className="px-3 py-2 text-right">{fmt(moles[i], 4)}</td>
                  <td className="px-3 py-2 text-right">{s.coef}</td>
                  <td className={`px-3 py-2 text-right ${lim ? 'font-bold text-amber-900' : ''}`}>{fmt(result.ratios[i], 4)}</td>
                  <td className="px-3 py-2 text-right">
                    {fmt(result.left[i] * s.M, 2)} g
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-ink">How much of each reactant is used</p>
        {reaction.reactants.map((s, i) => {
          const total = moles[i];
          const usedFrac = total > 0 ? result.used[i] / total : 0;
          return (
            <div key={s.formula} className="flex items-center gap-2 text-sm">
              <span className="w-12 shrink-0 font-semibold text-ink">
                <ChemFormula formula={s.formula} />
              </span>
              <div className="flex h-4 flex-1 overflow-hidden rounded-full bg-subtle">
                <div className="h-full transition-all duration-300" style={{ width: `${usedFrac * 100}%`, backgroundColor: s.color }} />
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(1 - usedFrac) * 100}%`,
                    backgroundImage: 'repeating-linear-gradient(45deg, #cbd5e1 0 4px, #f1f5f9 4px 8px)',
                  }}
                />
              </div>
              <span className="w-24 shrink-0 text-right font-mono text-xs text-ink-muted">{fmt(usedFrac * 100, 1)}% used</span>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 text-sm text-gray-700">
        <p className="mb-2 font-semibold text-violet-900">The calculation</p>
        <ol className="list-decimal space-y-1 pl-5 font-mono text-[13px]">
          {reaction.reactants.map((s, i) => (
            <li key={s.formula}>
              {s.formula}: {fmt(moles[i] * s.M, 2)} g ÷ {s.M.toFixed(3)} g/mol = {fmt(moles[i], 4)} mol; ÷ {s.coef} = {fmt(result.ratios[i], 4)}
              {result.ratios[i] === smallest && ' ← smallest'}
            </li>
          ))}
          <li>
            Limiting: {result.limiting.map((i) => reaction.reactants[i].formula).join(' and ')}
            {result.limiting.length > 1 ? ' (exact stoichiometric mixture, nothing left over)' : ''}. Reaction extent = {fmt(result.extent, 4)} mol
          </li>
          {reaction.products.map((p, j) => (
            <li key={p.formula}>
              {p.formula}: {fmt(result.extent, 4)} × {p.coef} = {fmt(result.formed[j], 4)} mol × {p.M.toFixed(3)} g/mol = {fmt(result.formed[j] * p.M, 2)} g
            </li>
          ))}
          {reaction.reactants.map((s, i) =>
            result.limiting.includes(i) ? null : (
              <li key={`ex-${s.formula}`}>
                Excess {s.formula}: {fmt(moles[i], 4)} − {s.coef} × {fmt(result.extent, 4)} = {fmt(result.left[i], 4)} mol = {fmt(result.left[i] * s.M, 2)} g left
              </li>
            ),
          )}
        </ol>
        <p className="mt-2 text-xs text-ink-muted">
          Mass check: reactants consumed {fmt(reactantMassUsed, 2)} g = products formed {fmt(productMass, 2)} g.
        </p>
      </div>

      <div className="rounded-xl border border-line p-4">
        <p className="mb-3 text-sm font-semibold text-ink">Percent yield</p>
        <div className="flex flex-wrap items-end gap-3">
          {reaction.products.length > 1 && (
            <div className="w-40">
              <Select label="Product" value={productIndex} onChange={(e) => setProductIndex(Number(e.target.value))}>
                {reaction.products.map((p, j) => (
                  <option key={p.formula} value={j}>
                    {p.formula}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Actual yield of {product.formula} (g)</span>
            <input
              type="number"
              min={0}
              step={0.1}
              value={actual}
              placeholder={fmt(theoG * 0.85, 2)}
              onChange={(e) => setActual(e.target.value)}
              className="h-11 w-40 rounded-control border border-line-strong bg-white px-3 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </label>
        </div>
        <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-lg bg-subtle p-3">
            <dt className="text-ink-muted">Theoretical yield</dt>
            <dd className="font-mono font-semibold text-ink">
              {fmt(theoG, 2)} g <span className="font-normal text-ink-muted">({fmt(theoMol, 4)} mol)</span>
            </dd>
          </div>
          <div className="rounded-lg bg-subtle p-3">
            <dt className="text-ink-muted">Percent yield = actual ÷ theoretical × 100%</dt>
            <dd className="font-mono font-semibold text-ink">{hasActual && Number.isFinite(pct) ? `${fmt(pct, 1)}%` : 'enter an actual yield'}</dd>
          </div>
        </dl>
        {hasActual && pct > 100 && (
          <p className="mt-2 text-sm text-amber-700">
            Above 100% is impossible for a pure, dry product. It usually means the product is still wet or contains impurities.
          </p>
        )}
      </div>
    </div>
  );
}

export default function LimitingReagentVisualizer() {
  const [reactionId, setReactionId] = useState(REACTIONS[0].id);
  const [mode, setMode] = useState<Mode>('particles');
  const reaction = useMemo(() => REACTIONS.find((r) => r.id === reactionId) ?? REACTIONS[0], [reactionId]);

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Select label="Reaction" value={reactionId} onChange={(e) => setReactionId(e.target.value)}>
          {REACTIONS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </Select>
        <div>
          <p className="mb-1.5 text-sm font-medium text-ink">Mode</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={mode === 'particles' ? 'primary' : 'outline'} aria-pressed={mode === 'particles'} onClick={() => setMode('particles')}>
              Particle picture
            </Button>
            <Button size="sm" variant={mode === 'mass' ? 'primary' : 'outline'} aria-pressed={mode === 'mass'} onClick={() => setMode('mass')}>
              Grams and moles
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-subtle p-3 text-center">
        <EquationLine reaction={reaction} />
      </div>

      {mode === 'particles' ? <ParticleView key={reaction.id} reaction={reaction} /> : <MassView key={reaction.id} reaction={reaction} />}
    </div>
  );
}
