'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, SkipForward, StepBack, StepForward } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { CATEGORY_LABELS, ELEMENTS } from '../_atomic-structure/elements';
import {
  AUFBAU_ORDER,
  EXCEPTIONS,
  PREDICTED_FROM,
  actualOccupancy,
  boxSpins,
  formatNotation,
  madelungOccupancy,
  madelungStep,
  notationParts,
  shorthandParts,
  totalUnpaired,
  unpairedIn,
  valenceElectrons,
  type Occupancy,
} from './configuration';

type Mode = 'ground' | 'build';
type Highlight = { label: string; box: number; up: boolean } | null;

const STEP_MS = 380;

function Arrow({ x, top, bottom, up, color }: { x: number; top: number; bottom: number; up: boolean; color: string }) {
  const head = up ? `M ${x - 3} ${top + 5} L ${x} ${top} L ${x + 3} ${top + 5}` : `M ${x - 3} ${bottom - 5} L ${x} ${bottom} L ${x + 3} ${bottom - 5}`;
  return (
    <g stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1={x} y1={top} x2={x} y2={bottom} />
      <path d={head} />
    </g>
  );
}

const LADDER = {
  width: 470,
  rowH: 29,
  top: 22,
  box: 16,
  boxH: 21,
  columns: [60, 128, 222, 350],
};
const LADDER_HEIGHT = LADDER.top + AUFBAU_ORDER.length * LADDER.rowH + 18;

function EnergyLadder({ occ, highlight, changed }: { occ: Occupancy; highlight: Highlight; changed: Set<string> }) {
  const rowY = (i: number) => LADDER.top + (AUFBAU_ORDER.length - 1 - i) * LADDER.rowH;
  const path = AUFBAU_ORDER.map((s, i) => {
    const x = LADDER.columns[s.l] + (s.orbitals * LADDER.box) / 2;
    const y = rowY(i) + LADDER.boxH / 2;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${LADDER.width} ${LADDER_HEIGHT}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Subshell energy ladder in filling order">
      <defs>
        <marker id="ladder-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
        </marker>
      </defs>
      <line x1={8} y1={LADDER_HEIGHT - 14} x2={8} y2={12} stroke="#64748b" strokeWidth={1.5} markerEnd="url(#ladder-arrow)" />
      <text x={26} y={LADDER_HEIGHT - 10} fontSize={11} fill="#64748b" transform={`rotate(-90 26 ${LADDER_HEIGHT - 10})`}>
        Energy (filling order)
      </text>
      <path d={path} fill="none" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 4" />
      {AUFBAU_ORDER.map((s, i) => {
        const y = rowY(i);
        const x0 = LADDER.columns[s.l];
        const count = occ[s.label] ?? 0;
        const spins = boxSpins(count, s.orbitals);
        const isChanged = changed.has(s.label);
        const full = count === s.capacity;
        return (
          <g key={s.label}>
            <title>{`${s.label}: n + l = ${s.n + s.l}, ${count}/${s.capacity} electrons`}</title>
            <text x={x0 - 6} y={y + 15} fontSize={13} textAnchor="end" fill={count > 0 ? '#0f172a' : '#94a3b8'} fontWeight={count > 0 ? 700 : 400}>
              {s.label}
            </text>
            {spins.map(([up, down], b) => {
              const bx = x0 + b * LADDER.box;
              const hl = highlight && highlight.label === s.label && highlight.box === b ? highlight : null;
              return (
                <g key={b}>
                  <rect
                    x={bx}
                    y={y}
                    width={LADDER.box}
                    height={LADDER.boxH}
                    fill={isChanged ? '#fef3c7' : full ? '#eef2ff' : count > 0 ? '#f8fafc' : 'white'}
                    stroke={isChanged ? '#d97706' : count > 0 ? '#6366f1' : '#cbd5e1'}
                    strokeWidth={1.2}
                  />
                  {up && <Arrow x={bx + 5} top={y + 3} bottom={y + LADDER.boxH - 3} up color={hl?.up ? '#d97706' : '#4338ca'} />}
                  {down && <Arrow x={bx + 11} top={y + 3} bottom={y + LADDER.boxH - 3} up={false} color={hl && !hl.up ? '#d97706' : '#4338ca'} />}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function BoxDiagram({ occ, highlight, changed }: { occ: Occupancy; highlight: Highlight; changed: Set<string> }) {
  const shown = AUFBAU_ORDER.filter((s) => (occ[s.label] ?? 0) > 0 || changed.has(s.label));
  if (shown.length === 0) {
    return <p className="rounded-xl border border-dashed border-line-strong bg-subtle p-4 text-sm text-ink-muted">No electrons yet. Press Next electron to add the first one to 1s.</p>;
  }
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-3 rounded-xl border border-line bg-subtle p-3">
      {shown.map((s) => {
        const count = occ[s.label] ?? 0;
        const isChanged = changed.has(s.label);
        return (
          <div key={s.label} className="flex flex-col items-center">
            <div className="flex">
              {boxSpins(count, s.orbitals).map(([up, down], b) => {
                const hl = highlight && highlight.label === s.label && highlight.box === b ? highlight : null;
                return (
                  <span
                    key={b}
                    className={`-ml-px flex h-9 w-7 items-center justify-center border bg-white font-mono text-base leading-none first:ml-0 ${isChanged ? 'border-amber-500 bg-amber-50' : 'border-indigo-400'}`}
                  >
                    <span className={hl?.up ? 'font-bold text-amber-600' : 'text-indigo-700'}>{up ? '↑' : ' '}</span>
                    <span className={hl && !hl.up ? 'font-bold text-amber-600' : 'text-indigo-700'}>{down ? '↓' : ' '}</span>
                  </span>
                );
              })}
            </div>
            <span className="mt-1 font-mono text-xs font-semibold text-ink">
              {s.label}
              <sup>{count}</sup>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-mono font-semibold text-ink">
        {value}
        {hint && <span className="ml-1 text-xs font-normal text-ink-faint">{hint}</span>}
      </dd>
    </div>
  );
}

export default function ElectronConfigurationVisualizer() {
  const [z, setZ] = useState(26);
  const [mode, setMode] = useState<Mode>('ground');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const element = ELEMENTS[z - 1];
  const isException = z in EXCEPTIONS;
  const totalSteps = z + (isException ? 1 : 0);
  const animating = mode === 'build' && playing && step < totalSteps;

  const choose = (next: number) => {
    setZ(Math.min(118, Math.max(1, next)));
    setStep(0);
    setPlaying(false);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setStep(0);
    setPlaying(false);
  };

  useEffect(() => {
    if (!animating) return;
    const id = window.setInterval(() => setStep((s) => Math.min(s + 1, totalSteps)), STEP_MS);
    return () => window.clearInterval(id);
  }, [animating, totalSteps]);

  const ground = useMemo(() => actualOccupancy(z), [z]);
  const madelung = useMemo(() => madelungOccupancy(z), [z]);
  const exceptionLabels = useMemo(() => new Set(Object.keys(EXCEPTIONS[z] ?? {})), [z]);

  const rearranged = mode === 'build' && isException && step === totalSteps;
  const shownOcc = mode === 'ground' || rearranged ? ground : madelungOccupancy(step);
  const highlight: Highlight = mode === 'build' && !rearranged ? madelungStep(step) : null;
  const changed = mode === 'ground' || rearranged ? exceptionLabels : new Set<string>();

  const { core, parts } = shorthandParts(z, ground);
  const shorthand = core ? `[${core.symbol}] ${formatNotation(parts)}` : formatNotation(parts);
  const predicted = isException ? (() => {
    const p = shorthandParts(z, madelung);
    return p.core ? `[${p.core.symbol}] ${formatNotation(p.parts)}` : formatNotation(p.parts);
  })() : null;
  const valence = valenceElectrons(element, ground);
  const unpaired = totalUnpaired(ground);
  const maxShell = Math.max(...AUFBAU_ORDER.filter((s) => (ground[s.label] ?? 0) > 0).map((s) => s.n));
  const shells = Array.from({ length: maxShell }, (_, i) => AUFBAU_ORDER.filter((s) => s.n === i + 1).reduce((sum, s) => sum + (ground[s.label] ?? 0), 0));

  const currentNotation = formatNotation(notationParts(shownOcc));
  const stepMessage = (() => {
    if (mode !== 'build') return null;
    if (step === 0) return 'Start with a bare nucleus. Each press of Next electron adds one electron to the lowest-energy open orbital.';
    if (rearranged) return `Real ${element.symbol} does not stop at the Madelung prediction: electrons shift so the configuration becomes ${shorthand}, which has lower energy.`;
    const h = madelungStep(step)!;
    const sub = AUFBAU_ORDER.find((s) => s.label === h.label)!;
    const count = madelungOccupancy(step)[h.label];
    const hund = h.up ? (sub.orbitals > 1 ? `Hund's rule: it goes into an empty ${h.label} orbital with spin up before any pairing.` : `It enters the ${h.label} orbital with spin up.`) : `All ${sub.orbitals} ${h.label} orbital${sub.orbitals > 1 ? 's' : ''} already hold one electron, so it pairs with opposite spin (Pauli exclusion).`;
    const next = step === z && isException ? ' This is the Madelung prediction. Press Next electron once more to see the real ground state.' : '';
    return `Electron ${step} goes into ${h.label} (${count}/${sub.capacity}). ${hund}${next}`;
  })();

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <Select label="Element" value={z} onChange={(e) => choose(Number(e.target.value))}>
            {ELEMENTS.map((el) => (
              <option key={el.z} value={el.z}>
                {el.z}. {el.name} ({el.symbol}){el.z in EXCEPTIONS ? ' - exception' : ''}
              </option>
            ))}
          </Select>
          <div className="flex flex-wrap gap-2">
            <Button size="md" variant="outline" onClick={() => choose(z - 1)} disabled={z <= 1} leftIcon={<ChevronLeft className="h-4 w-4" />}>
              Prev
            </Button>
            <Button size="md" variant="outline" onClick={() => choose(z + 1)} disabled={z >= 118} rightIcon={<ChevronRight className="h-4 w-4" />}>
              Next
            </Button>
          </div>
        </div>
        <label className="block">
          <span className="flex justify-between text-sm font-medium text-ink">
            Atomic number Z <span className="font-mono">{z}</span>
          </span>
          <input type="range" min={1} max={118} value={z} onChange={(e) => choose(Number(e.target.value))} className="mt-1 w-full accent-brand-600" />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink">View</span>
          <Button size="sm" variant={mode === 'ground' ? 'primary' : 'outline'} aria-pressed={mode === 'ground'} onClick={() => switchMode('ground')}>
            Ground state
          </Button>
          <Button size="sm" variant={mode === 'build' ? 'primary' : 'outline'} aria-pressed={mode === 'build'} onClick={() => switchMode('build')}>
            Build up electron by electron
          </Button>
        </div>
        {mode === 'build' && (
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => {
                setPlaying(false);
                setStep((s) => Math.max(0, s - 1));
              }} disabled={step === 0} leftIcon={<StepBack className="h-4 w-4" />}>
              Back
            </Button>
            <Button size="sm" variant="secondary" onClick={() => {
                setPlaying(false);
                setStep((s) => Math.min(totalSteps, s + 1));
              }} disabled={step >= totalSteps} leftIcon={<StepForward className="h-4 w-4" />}>
              Next electron
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (step >= totalSteps) setStep(0);
                setPlaying((p) => !p || step >= totalSteps);
              }}
              leftIcon={animating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            >
              {animating ? 'Pause' : 'Play'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setStep(totalSteps)} disabled={step >= totalSteps} leftIcon={<SkipForward className="h-4 w-4" />}>
              End
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setStep(0);
                setPlaying(false);
              }}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Reset
            </Button>
            <span className="font-mono text-sm text-ink-muted">
              {Math.min(step, z)} / {z} electrons
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="min-w-0 space-y-4 lg:col-span-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-brand-300 bg-brand-50">
              <span className="text-xs text-ink-muted">{z}</span>
              <span className="text-2xl font-bold text-ink">{element.symbol}</span>
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-ink">{element.name}</p>
              <p className="text-sm text-ink-muted">
                {CATEGORY_LABELS[element.category]}, period {element.period}, {element.group ? `group ${element.group}` : 'f-block'}, {element.block}-block
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1 text-sm font-semibold text-ink">{mode === 'build' ? 'Current configuration' : 'Full configuration'}</p>
            <p className="break-words rounded-xl border border-line bg-subtle px-3 py-2 font-mono text-sm text-ink">{currentNotation || '(no electrons)'}</p>
          </div>

          <div>
            <p className="mb-1 text-sm font-semibold text-ink">Orbital box diagram</p>
            <BoxDiagram occ={shownOcc} highlight={highlight} changed={changed} />
          </div>

          {stepMessage && <p className="rounded-xl border border-brand-200 bg-brand-50/60 p-3 text-sm text-ink">{stepMessage}</p>}

          {isException && (mode === 'ground' || rearranged) && (
            <div className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold">{element.name} is an exception to the Aufbau (Madelung) order</p>
                <p className="mt-1">
                  Predicted: <span className="font-mono">{predicted}</span>
                  <br />
                  Actual: <span className="font-mono">{shorthand}</span>
                </p>
                <p className="mt-1 text-amber-800">
                  {element.z === 103
                    ? 'Relativistic effects lower the 7p level below 6d, so the last electron goes into 7p.'
                    : element.block === 'd'
                      ? 'The ns and (n−1)d levels are so close in energy that moving an s electron into d, giving a half-filled or filled d subshell or simply lower electron repulsion, makes the atom more stable.'
                      : 'The (n−2)f and (n−1)d levels are nearly degenerate here, so one or two electrons sit in d instead of f.'}{' '}
                  Changed subshells are outlined in amber.
                </p>
              </div>
            </div>
          )}
          {z >= PREDICTED_FROM && (
            <p className="text-sm text-ink-muted">
              Elements from Z = {PREDICTED_FROM} onward have only been made a few atoms at a time. Their configurations shown here follow the Madelung rule and are predictions, not measurements.
            </p>
          )}
        </div>

        <div className="min-w-0 space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-line bg-subtle p-4 text-sm">
            <p className="mb-2 font-semibold text-ink">Ground state of {element.symbol}</p>
            <dl className="space-y-1.5">
              <Stat label="Noble-gas shorthand" value={shorthand} />
              <Stat label="Valence electrons" value={valence.count} hint={`(${valence.rule})`} />
              <Stat label="Unpaired electrons" value={unpaired} />
              <Stat label="Magnetism" value={unpaired > 0 ? 'Paramagnetic' : 'Diamagnetic'} />
              <Stat label="Electrons per shell" value={shells.join(', ')} />
              <Stat label="Highest occupied subshell" value={[...AUFBAU_ORDER].reverse().find((s) => (ground[s.label] ?? 0) > 0)?.label ?? '-'} />
            </dl>
          </div>
          <div className="rounded-xl border border-line bg-subtle p-4 text-sm">
            <p className="mb-2 font-semibold text-ink">Unpaired electrons by subshell</p>
            <ul className="flex flex-wrap gap-2">
              {AUFBAU_ORDER.filter((s) => (ground[s.label] ?? 0) > 0).map((s) => {
                const u = unpairedIn(ground[s.label], s.orbitals);
                return (
                  <li key={s.label} className={`rounded-md border px-2 py-0.5 font-mono text-xs ${u > 0 ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-line bg-white text-ink-muted'}`}>
                    {s.label}: {u}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold text-ink">
              Energy-level ladder <span className="font-normal text-ink-muted">(lowest at the bottom)</span>
            </p>
            <EnergyLadder occ={shownOcc} highlight={highlight} changed={changed} />
          </div>
        </div>
      </div>
    </div>
  );
}
