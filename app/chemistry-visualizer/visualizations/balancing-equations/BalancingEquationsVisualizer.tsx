'use client';

import { Fragment, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, CircleAlert, Lightbulb, Minus, Plus, RotateCcw } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { balance, elementsOf, gcdList, molarMass, parseEquation, type ParsedEquation } from '../_stoichiometry/chem';
import { ChemFormula, ElementSwatch, MoleculeIcon } from '../_stoichiometry/Molecule';

const PRESETS = [
  { label: 'Water: H2 + O2 → H2O', equation: 'H2 + O2 -> H2O' },
  { label: 'Ammonia: N2 + H2 → NH3', equation: 'N2 + H2 -> NH3' },
  { label: 'Methane combustion: CH4 + O2 → CO2 + H2O', equation: 'CH4 + O2 -> CO2 + H2O' },
  { label: 'Propane combustion: C3H8 + O2 → CO2 + H2O', equation: 'C3H8 + O2 -> CO2 + H2O' },
  { label: 'Ethane combustion: C2H6 + O2 → CO2 + H2O', equation: 'C2H6 + O2 -> CO2 + H2O' },
  { label: 'Rusting: Fe + O2 → Fe2O3', equation: 'Fe + O2 -> Fe2O3' },
  { label: 'Aluminium oxide: Al + O2 → Al2O3', equation: 'Al + O2 -> Al2O3' },
  { label: 'Al + HCl → AlCl3 + H2', equation: 'Al + HCl -> AlCl3 + H2' },
  { label: 'Sodium in water: Na + H2O → NaOH + H2', equation: 'Na + H2O -> NaOH + H2' },
  { label: 'KClO3 decomposition: KClO3 → KCl + O2', equation: 'KClO3 -> KCl + O2' },
  { label: 'Photosynthesis: CO2 + H2O → C6H12O6 + O2', equation: 'CO2 + H2O -> C6H12O6 + O2' },
  { label: 'Neutralisation: Ca(OH)2 + H3PO4 → Ca3(PO4)2 + H2O', equation: 'Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O' },
  { label: 'Ostwald process: NH3 + O2 → NO + H2O', equation: 'NH3 + O2 -> NO + H2O' },
  { label: 'Octane combustion: C8H18 + O2 → CO2 + H2O', equation: 'C8H18 + O2 -> CO2 + H2O' },
];

const MAX_COEF = 30;
const MAX_PICTURED = 12;
const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

function Stepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="inline-flex items-center rounded-control border border-line-strong bg-white shadow-card">
      <button
        type="button"
        className="grid h-8 w-8 place-items-center rounded-l-control text-ink-muted hover:bg-subtle hover:text-ink disabled:opacity-40"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Decrease coefficient of ${label}`}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center font-mono text-lg font-bold text-brand-700 tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="grid h-8 w-8 place-items-center rounded-r-control text-ink-muted hover:bg-subtle hover:text-ink disabled:opacity-40"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_COEF}
        aria-label={`Increase coefficient of ${label}`}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function SidePicture({ title, eq, coefs, offset, side }: { title: string; eq: ParsedEquation; coefs: number[]; offset: number; side: 'reactants' | 'products' }) {
  const species = side === 'reactants' ? eq.reactants : eq.products;
  const atoms = species.reduce((s, sp, i) => s + coefs[offset + i] * Object.values(sp.comp).reduce((a, b) => a + b, 0), 0);
  return (
    <div className="rounded-xl border border-line bg-subtle p-3">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="text-xs text-ink-muted">{atoms} atoms in total</p>
      </div>
      <div className="space-y-3">
        {species.map((sp, i) => {
          const c = coefs[offset + i];
          const shown = Math.min(c, MAX_PICTURED);
          return (
            <div key={i} className="rounded-lg border border-line bg-white p-2">
              <p className="mb-1 text-xs font-medium text-ink-muted">
                {c} × <ChemFormula formula={sp.formula} />
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {Array.from({ length: shown }, (_, k) => (
                  <MoleculeIcon key={k} comp={sp.comp} title={sp.formula} className="h-8 w-auto max-w-full" />
                ))}
                {c > shown && <span className="text-xs text-ink-muted">+{c - shown} more</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BalancingEquationsVisualizer() {
  const [presetIndex, setPresetIndex] = useState(2);
  const [eq, setEq] = useState<ParsedEquation>(() => parseEquation(PRESETS[2].equation));
  const [coefs, setCoefs] = useState<number[]>(() => eq.given.map(() => 1));
  const [custom, setCustom] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showSolver, setShowSolver] = useState(false);

  const species = useMemo(() => [...eq.reactants, ...eq.products], [eq]);
  const elements = useMemo(() => elementsOf(species), [species]);
  const solution = useMemo(() => balance(eq.reactants, eq.products), [eq]);
  const nR = eq.reactants.length;

  const counts = elements.map((el) => {
    const left = eq.reactants.reduce((s, sp, i) => s + coefs[i] * (sp.comp[el] ?? 0), 0);
    const right = eq.products.reduce((s, sp, i) => s + coefs[nR + i] * (sp.comp[el] ?? 0), 0);
    return { el, left, right };
  });
  const maxCount = Math.max(1, ...counts.flatMap((c) => [c.left, c.right]));
  const balanced = counts.every((c) => c.left === c.right);
  const common = gcdList(coefs);
  const massLeft = eq.reactants.reduce((s, sp, i) => s + coefs[i] * molarMass(sp.comp), 0);
  const massRight = eq.products.reduce((s, sp, i) => s + coefs[nR + i] * molarMass(sp.comp), 0);
  const off = counts.filter((c) => c.left !== c.right);

  const load = (next: ParsedEquation) => {
    setEq(next);
    setCoefs(next.given.map(() => 1));
    setShowSolver(false);
    setError(null);
  };

  const choosePreset = (i: number) => {
    setPresetIndex(i);
    load(parseEquation(PRESETS[i].equation));
  };

  const loadCustom = () => {
    try {
      const parsed = parseEquation(custom);
      setPresetIndex(-1);
      setEq(parsed);
      setCoefs(parsed.given.map((g) => Math.min(Math.max(g, 1), MAX_COEF)));
      setShowSolver(false);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read that equation');
    }
  };

  const setCoef = (i: number, v: number) => setCoefs((prev) => prev.map((c, j) => (j === i ? Math.min(Math.max(v, 1), MAX_COEF) : c)));

  const solve = () => {
    if (solution.ok) setCoefs(solution.coefficients.map((c) => Math.min(c, MAX_COEF)));
    setShowSolver(true);
  };

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Select label="Preset reaction" value={presetIndex} onChange={(e) => choosePreset(Number(e.target.value))}>
          {presetIndex === -1 && <option value={-1}>Custom equation</option>}
          {PRESETS.map((p, i) => (
            <option key={p.equation} value={i}>
              {p.label}
            </option>
          ))}
        </Select>
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            loadCustom();
          }}
        >
          <div className="min-w-0 flex-1 basis-48">
            <Input
              label="Or type your own"
              placeholder="e.g. Fe2(SO4)3 + KOH -> K2SO4 + Fe(OH)3"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              fullWidth
              spellCheck={false}
              autoCapitalize="off"
            />
          </div>
          <Button type="submit" variant="outline">
            Load
          </Button>
        </form>
      </div>
      {error && <p className="-mt-2 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-xl border border-line bg-subtle p-4">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4">
          {species.map((sp, i) => (
            <Fragment key={i}>
              {i > 0 && i !== nR && <span className="text-xl font-semibold text-ink-muted">+</span>}
              {i === nR && <ArrowRight className="h-6 w-6 text-ink-muted" aria-label="yields" />}
              <div className="flex flex-col items-center gap-1.5">
                <Stepper value={coefs[i]} onChange={(v) => setCoef(i, v)} label={sp.formula} />
                <span className="text-xl font-semibold text-ink">
                  <span className="mr-0.5 text-brand-700">{coefs[i] > 1 ? coefs[i] : ''}</span>
                  <ChemFormula formula={sp.formula} />
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      <div
        className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${
          balanced ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900'
        }`}
        role="status"
      >
        {balanced ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> : <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />}
        <div>
          {balanced ? (
            <p>
              <strong>Balanced.</strong> Every element has the same number of atoms on both sides, and the mass is conserved:{' '}
              {massLeft.toFixed(2)} g of reactants give {massRight.toFixed(2)} g of products per mole of reaction.
              {common > 1 && ` All coefficients share a factor of ${common}; divide by it to get the simplest whole numbers.`}
            </p>
          ) : (
            <p>
              <strong>Not balanced yet.</strong>{' '}
              {off.map((c) => `${c.el}: ${c.left} on the left, ${c.right} on the right`).join('; ')}.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={solve} leftIcon={<Lightbulb className="h-4 w-4" />}>
          Show solution
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setCoefs(coefs.map(() => 1))} leftIcon={<RotateCcw className="h-4 w-4" />}>
          Reset coefficients
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="rounded-xl border border-line p-4">
          <p className="mb-1 text-sm font-semibold text-ink">Atom count per element</p>
          <div className="mb-3 flex flex-wrap gap-4 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-5 rounded-sm bg-sky-500" /> Reactants
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-5 rounded-sm bg-violet-500" /> Products
            </span>
          </div>
          <div className="space-y-3">
            {counts.map((c) => {
              const ok = c.left === c.right;
              return (
                <div key={c.el} className="grid grid-cols-[3.5rem_minmax(0,1fr)_1.25rem] items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                    <ElementSwatch el={c.el} />
                    {c.el}
                  </span>
                  <div className="space-y-1">
                    {[
                      { v: c.left, color: 'bg-sky-500' },
                      { v: c.right, color: 'bg-violet-500' },
                    ].map((bar, k) => (
                      <div key={k} className="flex items-center gap-2">
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-subtle">
                          <div className={`h-full rounded-full ${bar.color} transition-all duration-300`} style={{ width: `${(bar.v / maxCount) * 100}%` }} />
                        </div>
                        <span className="w-7 text-right font-mono text-xs tabular-nums text-ink">{bar.v}</span>
                      </div>
                    ))}
                  </div>
                  {ok ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-label="equal" />
                  ) : (
                    <CircleAlert className="h-5 w-5 text-amber-500" aria-label="unequal" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SidePicture title="Reactants" eq={eq} coefs={coefs} offset={0} side="reactants" />
          <SidePicture title="Products" eq={eq} coefs={coefs} offset={nR} side="products" />
        </div>
      </div>

      {showSolver && (
        <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 text-sm text-gray-700">
          <p className="mb-2 font-semibold text-violet-900">How the solver finds the coefficients</p>
          <p className="mb-2">
            Give each species an unknown coefficient ({species.map((_, i) => LETTERS[i]).join(', ')}) and write one equation per element:
            atoms on the left = atoms on the right.
          </p>
          <ul className="mb-3 space-y-1 font-mono text-[13px]">
            {elements.map((el) => {
              const term = (idx: number, n: number) => `${n > 1 ? n : ''}${LETTERS[idx]}`;
              const left = eq.reactants.map((sp, i) => (sp.comp[el] ? term(i, sp.comp[el]) : null)).filter(Boolean).join(' + ');
              const right = eq.products.map((sp, i) => (sp.comp[el] ? term(nR + i, sp.comp[el]) : null)).filter(Boolean).join(' + ');
              return (
                <li key={el}>
                  {el}: {left} = {right}
                </li>
              );
            })}
          </ul>
          {solution.ok ? (
            <p>
              Solving this linear system exactly (with fractions) and scaling to the smallest whole numbers gives{' '}
              <span className="font-mono font-semibold text-ink">
                {solution.coefficients.map((c, i) => `${LETTERS[i]} = ${c}`).join(', ')}
              </span>
              .{solution.coefficients.some((c) => c > MAX_COEF) && ` Some coefficients exceed ${MAX_COEF}, the largest the steppers show.`}
            </p>
          ) : (
            <p className="font-medium text-amber-800">{solution.reason}</p>
          )}
        </div>
      )}
    </div>
  );
}
