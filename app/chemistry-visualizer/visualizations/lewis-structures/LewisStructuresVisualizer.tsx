'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import {
  PRESETS,
  VALENCE,
  atomElements,
  bondSum,
  electronsAround,
  formalCharge,
  formatCharge,
  solve,
  type Preset,
  type Structure,
} from './lewis';

const W = 520;
const H = 380;
const CX = W / 2;
const CY = H / 2;
const HIGHLIGHT = '#d97706';
const INK = '#1e293b';

const angDist = (a: number, b: number) => {
  const d = Math.abs((((a - b) % 360) + 360) % 360);
  return Math.min(d, 360 - d);
};

const toRad = (deg: number) => (deg * Math.PI) / 180;

function spreadAround(away: number, k: number) {
  if (k === 0) return [];
  if (k === 1) return [away];
  if (k === 2) return [away - 55, away + 55];
  return Array.from({ length: k }, (_, i) => away + (i - (k - 1) / 2) * 90);
}

function greedyAngles(occupied: number[], k: number) {
  const placed: number[] = [];
  for (let n = 0; n < k; n++) {
    let best = 270;
    let bestScore = -1;
    for (let i = 0; i < 72; i++) {
      const a = (270 + i * 5) % 360;
      const score = Math.min(360, ...[...occupied, ...placed].map((o) => angDist(a, o)));
      if (score > bestScore + 1e-6) {
        best = a;
        bestScore = score;
      }
    }
    placed.push(best);
  }
  return placed;
}

interface Layout {
  x: number;
  y: number;
  bondAngles: number[];
  lonePairAngles: number[];
}

function layout(p: Preset, s: Structure): Layout[] {
  const L = p.terminals.length >= 5 ? 112 : 104;
  const k = s.lonePairs[0];
  let centerPairs: number[];
  if (p.terminals.length === 1) {
    centerPairs = spreadAround(p.terminals[0].angle + 180, k);
  } else if (p.centerLonePairAngles && k <= p.centerLonePairAngles.length) {
    centerPairs = p.centerLonePairAngles.slice(0, k);
  } else {
    centerPairs = greedyAngles(p.terminals.map((t) => t.angle), k);
  }
  const center: Layout = { x: CX, y: CY, bondAngles: p.terminals.map((t) => t.angle), lonePairAngles: centerPairs };
  const terms: Layout[] = p.terminals.map((t, i) => ({
    x: CX + L * Math.cos(toRad(t.angle)),
    y: CY + L * Math.sin(toRad(t.angle)),
    bondAngles: [t.angle + 180],
    lonePairAngles: spreadAround(t.angle, s.lonePairs[i + 1]),
  }));
  return [center, ...terms];
}

function freeDirection(occupied: number[]) {
  const options = [315, 45, 225, 135, 0, 180, 270, 90];
  let best = options[0];
  let bestScore = -1;
  for (const a of options) {
    const score = Math.min(360, ...occupied.map((o) => angDist(a, o)));
    if (score > bestScore) {
      best = a;
      bestScore = score;
    }
  }
  return best;
}

function BondLines({ a, b, order, color }: { a: { x: number; y: number; r: number }; b: { x: number; y: number; r: number }; order: number; color: string }) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const offsets = order === 1 ? [0] : order === 2 ? [-4.5, 4.5] : [-8, 0, 8];
  return (
    <g>
      {offsets.map((o) => (
        <line
          key={o}
          x1={a.x + ux * a.r + nx * o}
          y1={a.y + uy * a.r + ny * o}
          x2={b.x - ux * b.r + nx * o}
          y2={b.y - uy * b.r + ny * o}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

function LonePair({ x, y, angle, dist, color }: { x: number; y: number; angle: number; dist: number; color: string }) {
  const ux = Math.cos(toRad(angle));
  const uy = Math.sin(toRad(angle));
  const px = x + ux * dist;
  const py = y + uy * dist;
  return (
    <g fill={color}>
      <circle cx={px - uy * 5} cy={py + ux * 5} r={3.3} />
      <circle cx={px + uy * 5} cy={py - ux * 5} r={3.3} />
    </g>
  );
}

function LewisDrawing({
  preset,
  structure,
  previous,
  showBonds,
  showFormal,
  highlightCenter,
  showValence,
}: {
  preset: Preset;
  structure: Structure;
  previous: Structure | null;
  showBonds: boolean;
  showFormal: boolean;
  highlightCenter: boolean;
  showValence: boolean;
}) {
  const els = atomElements(preset);
  const pos = layout(preset, structure);
  const radius = (el: string) => (el.length > 1 ? 23 : 17);
  const lpDist = (el: string) => (el.length > 1 ? 27 : 22);

  const xs = pos.map((p) => p.x);
  const ys = pos.map((p) => p.y);
  const box = { x0: Math.min(...xs) - 50, x1: Math.max(...xs) + 50, y0: Math.min(...ys) - 48, y1: Math.max(...ys) + 48 };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label={`Lewis structure of ${preset.name}`}>
      {highlightCenter && <circle cx={CX} cy={CY} r={30} fill="#fef3c7" stroke={HIGHLIGHT} strokeWidth={2} />}

      {showBonds &&
        preset.terminals.map((t, i) => {
          const order = structure.bonds[i];
          if (order === 0) return null;
          const changed = previous ? previous.bonds[i] !== order : false;
          return (
            <BondLines
              key={i}
              a={{ x: pos[0].x, y: pos[0].y, r: radius(els[0]) }}
              b={{ x: pos[i + 1].x, y: pos[i + 1].y, r: radius(t.el) }}
              order={order}
              color={changed ? HIGHLIGHT : INK}
            />
          );
        })}

      {pos.map((p, i) => {
        const changed = previous ? previous.lonePairs[i] !== structure.lonePairs[i] : false;
        return p.lonePairAngles.map((a, k) => <LonePair key={`${i}-${k}`} x={p.x} y={p.y} angle={a} dist={lpDist(els[i])} color={changed ? HIGHLIGHT : '#334155'} />);
      })}

      {pos.map((p, i) => (
        <text key={i} x={p.x} y={p.y} fontSize={28} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill={i === 0 && highlightCenter ? '#92400e' : INK}>
          {els[i]}
        </text>
      ))}

      {showValence &&
        pos.map((p, i) => {
          const dir = freeDirection(i === 0 ? p.bondAngles : [p.bondAngles[0]]);
          const d = 38;
          return (
            <text key={i} x={p.x + d * Math.cos(toRad(dir))} y={p.y + d * Math.sin(toRad(dir))} fontSize={15} textAnchor="middle" dominantBaseline="central" fill="#2563eb" fontWeight={600}>
              {VALENCE[els[i]]} e⁻
            </text>
          );
        })}

      {showFormal &&
        pos.map((p, i) => {
          const q = formalCharge(preset, structure, i);
          if (q === 0) return null;
          const occupied = [...(i === 0 ? p.bondAngles : [p.bondAngles[0]]), ...p.lonePairAngles];
          const dir = freeDirection(occupied);
          const d = 34;
          const x = p.x + d * Math.cos(toRad(dir));
          const y = p.y + d * Math.sin(toRad(dir));
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={12} fill={q > 0 ? '#dbeafe' : '#fee2e2'} stroke={q > 0 ? '#2563eb' : '#dc2626'} strokeWidth={1.5} />
              <text x={x} y={y} fontSize={13} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill={q > 0 ? '#1d4ed8' : '#b91c1c'}>
                {formatCharge(q)}
              </text>
            </g>
          );
        })}

      {preset.charge !== 0 && showBonds && (
        <g stroke={INK} strokeWidth={2.5} fill="none">
          <path d={`M ${box.x0 + 12} ${box.y0} H ${box.x0} V ${box.y1} H ${box.x0 + 12}`} />
          <path d={`M ${box.x1 - 12} ${box.y0} H ${box.x1} V ${box.y1} H ${box.x1 - 12}`} />
          <text x={box.x1 + 6} y={box.y0 + 8} fontSize={20} fontWeight={700} fill={INK} stroke="none">
            {Math.abs(preset.charge) === 1 ? '' : Math.abs(preset.charge)}
            {preset.charge > 0 ? '+' : '−'}
          </text>
        </g>
      )}
    </svg>
  );
}

function ElectronPool({ total, remaining }: { total: number; remaining: number }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="font-semibold text-ink">Electron pool</span>
        <span className="font-mono text-ink">
          {total - remaining} placed, <span className="text-amber-700">{remaining} left</span> of {total}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-2.5 w-2.5 rounded-full ${i < total - remaining ? 'bg-slate-400' : 'bg-amber-500'}`} />
        ))}
      </div>
    </div>
  );
}

const subscripts = ['₁', '₂', '₃', '₄', '₅', '₆'];

export default function LewisStructuresVisualizer() {
  const [presetId, setPresetId] = useState('no3');
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [formIndex, setFormIndex] = useState(0);
  const [formalOverlay, setFormalOverlay] = useState(false);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const solution = useMemo(() => solve(preset), [preset]);
  const steps = solution.steps;
  const lastIndex = steps.length - 1;
  const step = steps[stepIndex];
  const atFinal = stepIndex === lastIndex;
  const structure = atFinal ? solution.resonance[formIndex] ?? step.structure : step.structure;
  const previous = stepIndex > 0 && !atFinal ? steps[stepIndex - 1].structure : null;
  const els = atomElements(preset);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setStepIndex((i) => {
        if (i >= lastIndex - 1) setPlaying(false);
        return Math.min(i + 1, lastIndex);
      });
    }, 1800);
    return () => window.clearInterval(id);
  }, [playing, lastIndex]);

  const choose = (id: string) => {
    setPresetId(id);
    setStepIndex(0);
    setFormIndex(0);
    setPlaying(false);
  };

  const goTo = (i: number) => {
    setStepIndex(Math.max(0, Math.min(lastIndex, i)));
    setPlaying(false);
  };

  const terminalLabels = useMemo(() => {
    const counts = new Map<string, number>();
    preset.terminals.forEach((t) => counts.set(t.el, (counts.get(t.el) ?? 0) + 1));
    const seen = new Map<string, number>();
    return preset.terminals.map((t) => {
      if ((counts.get(t.el) ?? 0) === 1) return t.el;
      const n = (seen.get(t.el) ?? 0) + 1;
      seen.set(t.el, n);
      return `${t.el}${subscripts[n - 1]}`;
    });
  }, [preset]);

  const rows = els.map((el, i) => {
    const lpE = 2 * structure.lonePairs[i];
    const bondE = 2 * bondSum(structure, i);
    return {
      label: i === 0 ? `${el} (central)` : terminalLabels[i - 1],
      valence: VALENCE[el],
      lpE,
      bondE,
      around: electronsAround(structure, i),
      target: el === 'H' ? 2 : 8,
      fc: formalCharge(preset, structure, i),
    };
  });

  const bondOrders = useMemo(() => {
    if (solution.resonance.length < 2) return [];
    const final = solution.resonance[0];
    const groups = new Map<string, number[]>();
    preset.terminals.forEach((t, i) => groups.set(t.el, [...(groups.get(t.el) ?? []), final.bonds[i]]));
    return [...groups.entries()]
      .filter(([, orders]) => new Set(orders).size > 1)
      .map(([el, orders]) => {
        const sum = orders.reduce((a, b) => a + b, 0);
        return { bond: `${preset.center}–${el}`, text: `${sum}/${orders.length} ≈ ${(sum / orders.length).toFixed(2)}` };
      });
  }, [solution, preset]);

  const showFormal = step.showFormalCharges || (formalOverlay && step.showBonds);

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-full sm:w-72">
          <Select label="Molecule or ion" value={presetId} onChange={(e) => choose(e.target.value)}>
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.formula} ({p.name})
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => goTo(stepIndex - 1)} disabled={stepIndex === 0} leftIcon={<ChevronLeft className="h-4 w-4" />}>
            Back
          </Button>
          <Button size="sm" variant="primary" onClick={() => goTo(stepIndex + 1)} disabled={atFinal} rightIcon={<ChevronRight className="h-4 w-4" />}>
            Next step
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              if (atFinal) setStepIndex(0);
              setPlaying((p) => !p);
            }}
            leftIcon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          >
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => goTo(0)} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset
          </Button>
        </div>
      </div>

      <ol className="flex flex-wrap gap-2" aria-label="Algorithm steps">
        {steps.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === stepIndex ? 'step' : undefined}
              title={s.title}
              className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ring-1 ring-inset transition-colors ${
                i === stepIndex ? 'bg-brand-600 text-white ring-brand-600' : i < stepIndex ? 'bg-brand-50 text-brand-700 ring-brand-100' : 'bg-white text-ink-muted ring-line-strong'
              }`}
            >
              {i + 1}
            </button>
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          <LewisDrawing
            preset={preset}
            structure={structure}
            previous={previous}
            showBonds={step.showBonds}
            showFormal={showFormal}
            highlightCenter={step.highlightCenter}
            showValence={stepIndex === 0}
          />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={formalOverlay || step.showFormalCharges} disabled={step.showFormalCharges} onChange={(e) => setFormalOverlay(e.target.checked)} className="h-4 w-4 accent-brand-600" />
              Show formal charges on every step
            </label>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-600" /> changed in this step
            </span>
          </div>
          {atFinal && solution.resonance.length > 1 && (
            <div className="rounded-xl border border-line bg-subtle p-3">
              <p className="text-sm font-semibold text-ink">Resonance forms</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {solution.resonance.map((_, i) => (
                  <Button key={i} size="sm" variant={formIndex === i ? 'primary' : 'outline'} aria-pressed={formIndex === i} onClick={() => setFormIndex(i)}>
                    Form {i + 1}
                  </Button>
                ))}
              </div>
              {bondOrders.map((b) => (
                <p key={b.bond} className="mt-2 text-sm text-ink-muted">
                  Average {b.bond} bond order in the real (hybrid) structure: <span className="font-mono text-ink">{b.text}</span>
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Step {stepIndex + 1} of {steps.length}
            </p>
            <p className="mt-1 font-semibold text-ink">{step.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{step.detail}</p>
          </div>
          <ElectronPool total={solution.total} remaining={step.remaining} />
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-subtle text-left text-ink">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">Atom</th>
                  <th scope="col" className="px-2 py-2 text-right font-semibold">V</th>
                  <th scope="col" className="px-2 py-2 text-right font-semibold">LP e⁻</th>
                  <th scope="col" className="px-2 py-2 text-right font-semibold">Bond e⁻</th>
                  <th scope="col" className="px-2 py-2 text-right font-semibold">Around</th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold">FC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-mono text-gray-700">
                {rows.map((r) => (
                  <tr key={r.label}>
                    <td className="whitespace-nowrap px-3 py-1.5 font-sans">{r.label}</td>
                    <td className="px-2 py-1.5 text-right">{r.valence}</td>
                    <td className="px-2 py-1.5 text-right">{r.lpE}</td>
                    <td className="px-2 py-1.5 text-right">{r.bondE}</td>
                    <td className={`px-2 py-1.5 text-right ${r.around < r.target && step.showBonds ? 'text-amber-700' : r.around > r.target ? 'text-violet-700' : ''}`}>
                      {r.around}/{r.target}
                    </td>
                    <td className={`px-3 py-1.5 text-right ${r.fc > 0 ? 'text-blue-700' : r.fc < 0 ? 'text-red-700' : ''}`}>{formatCharge(r.fc)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-relaxed text-ink-muted">
            V = valence electrons, LP e⁻ = electrons in lone pairs, Bond e⁻ = electrons in bonds touching the atom, Around = LP e⁻ + Bond e⁻ against the
            octet (or duet for H) target. FC = V − LP e⁻ − ½ Bond e⁻. Amber means short of the target; violet means an expanded octet.
          </p>
        </div>
      </div>
    </div>
  );
}
