'use client';

import { useEffect, useMemo, useState } from 'react';
import { Eraser, LayoutGrid, Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import LineChart from '../_rl/LineChart';
import { Panel, Segmented, Slider, Stat } from '../_rl/controls';
import {
  ACTIONS,
  NEXT_CELL,
  cellLabel,
  isTerminal,
  outcomes,
  parseLayout,
  reward,
  valueColor,
  valueTextColor,
  type GridWorld,
  type Rewards,
} from '../_rl/gridWorld';

const DEFAULT_LAYOUT = [
  '.....G', //
  '.##..P',
  '...#..',
  '.#....',
  '...P..',
];

const CELL = 100;
/** Value iteration stops once no state value moves by more than this. */
const THETA = 1e-4;

type Mode = 'value' | 'policy';
type TapMode = 'edit' | 'inspect';

interface Config {
  world: GridWorld;
  rewards: Rewards;
  gamma: number;
  slip: number;
}

interface Sim {
  V: number[];
  /** Current policy (used by policy iteration). */
  policy: number[];
  iter: number;
  deltas: number[];
  converged: boolean;
  /** Policy iteration only: evaluation sweeps and policy changes in the last iteration. */
  evalSweeps: number;
  policyChanges: number;
}

const isState = (world: GridWorld, s: number) => world.cells[s] !== 'wall' && !isTerminal(world.cells[s]);

function initSim(n: number): Sim {
  return { V: new Array(n).fill(0), policy: new Array(n).fill(0), iter: 0, deltas: [], converged: false, evalSweeps: 0, policyChanges: 0 };
}

/** Q(s, a) = Σ p(s' | s, a) · [ r(s') + γ · V(s') ]. Terminal states have V = 0. */
function qValue(cfg: Config, V: number[], s: number, a: number): number {
  let q = 0;
  for (const o of outcomes(cfg.world, s, a, cfg.slip)) {
    q += o.p * (reward(cfg.world, cfg.rewards, o.next) + cfg.gamma * V[o.next]);
  }
  return q;
}

function greedyAction(cfg: Config, V: number[], s: number): number {
  let best = 0;
  let bestQ = -Infinity;
  for (let a = 0; a < 4; a++) {
    const q = qValue(cfg, V, s, a);
    if (q > bestQ + 1e-9) {
      bestQ = q;
      best = a;
    }
  }
  return best;
}

/** One synchronous Bellman optimality sweep: V'(s) = max_a Q(s, a). */
function valueIterationSweep(cfg: Config, sim: Sim): Sim {
  const n = cfg.world.cells.length;
  const V = new Array(n).fill(0);
  let delta = 0;
  for (let s = 0; s < n; s++) {
    if (!isState(cfg.world, s)) continue;
    let best = -Infinity;
    for (let a = 0; a < 4; a++) best = Math.max(best, qValue(cfg, sim.V, s, a));
    V[s] = best;
    delta = Math.max(delta, Math.abs(best - sim.V[s]));
  }
  return { ...sim, V, iter: sim.iter + 1, deltas: [...sim.deltas, delta], converged: delta < THETA };
}

/** One round of policy iteration: evaluate the current policy fully, then improve it greedily. */
function policyIterationStep(cfg: Config, sim: Sim): Sim {
  const n = cfg.world.cells.length;
  const V = sim.V.slice();
  let sweeps = 0;
  for (; sweeps < 5000; sweeps++) {
    let d = 0;
    for (let s = 0; s < n; s++) {
      if (!isState(cfg.world, s)) continue;
      const v = qValue(cfg, V, s, sim.policy[s]);
      d = Math.max(d, Math.abs(v - V[s]));
      V[s] = v;
    }
    if (d < 1e-6) break;
  }

  const policy = sim.policy.slice();
  let changes = 0;
  for (let s = 0; s < n; s++) {
    if (!isState(cfg.world, s)) continue;
    const best = greedyAction(cfg, V, s);
    // Keep the old action on ties so the policy cannot flip back and forth forever.
    if (qValue(cfg, V, s, best) > qValue(cfg, V, s, policy[s]) + 1e-9) {
      policy[s] = best;
      changes++;
    }
  }

  let delta = 0;
  for (let s = 0; s < n; s++) delta = Math.max(delta, Math.abs(V[s] - sim.V[s]));
  return {
    V,
    policy,
    iter: sim.iter + 1,
    deltas: [...sim.deltas, delta],
    converged: changes === 0,
    evalSweeps: sweeps + 1,
    policyChanges: changes,
  };
}

function advance(cfg: Config, mode: Mode, sim: Sim): Sim {
  if (sim.converged) return sim;
  return mode === 'value' ? valueIterationSweep(cfg, sim) : policyIterationStep(cfg, sim);
}

const fmt = (v: number) => (Math.abs(v) < 0.0005 ? '0.00' : v.toFixed(2)).replace('-', '−');
const fmt3 = (v: number) => v.toFixed(3).replace('-', '−');

/** Arrow pointing up, centred on (0, 0); rotated per action. */
const ARROW_PATH = 'M 0 -17 L 11 -4 L 4 -4 L 4 15 L -4 15 L -4 -4 L -11 -4 Z';

export default function ValueIterationVisualizer() {
  const [world, setWorld] = useState<GridWorld>(() => parseLayout(DEFAULT_LAYOUT));
  const [gamma, setGamma] = useState(0.9);
  const [stepCost, setStepCost] = useState(0.04);
  const [slip, setSlip] = useState(0.2);
  const [mode, setMode] = useState<Mode>('value');
  const [speed, setSpeed] = useState<'1' | '4' | '15'>('4');
  const [tapMode, setTapMode] = useState<TapMode>('inspect');
  const [selected, setSelected] = useState<number>(14);
  const [running, setRunning] = useState(false);
  const [sim, setSim] = useState<Sim>(() => initSim(DEFAULT_LAYOUT.length * DEFAULT_LAYOUT[0].length));

  const cfg = useMemo<Config>(() => ({ world, rewards: { step: -stepCost, goal: 1, pit: -1 }, gamma, slip }), [world, stepCost, gamma, slip]);

  const active = running && !sim.converged;
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setSim((prev) => advance(cfg, mode, prev)), 1000 / Number(speed));
    return () => window.clearInterval(id);
  }, [active, cfg, mode, speed]);

  /** Any change to the problem restarts the algorithm from V = 0. */
  const restart = (n = world.cells.length) => setSim(initSim(n));
  const changeSetting = (set: (v: number) => void) => (v: number) => {
    set(v);
    restart();
  };

  const onGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const { x, y } = toDrawingPoint(e, e.currentTarget);
    const c = Math.floor(x / CELL);
    const r = Math.floor(y / CELL);
    if (r < 0 || r >= world.rows || c < 0 || c >= world.cols) return;
    const s = r * world.cols + c;
    setSelected(s);
    if (tapMode === 'edit') {
      const cells = world.cells.slice();
      cells[s] = NEXT_CELL[cells[s]];
      setWorld({ ...world, cells });
      restart();
    }
  };

  const resetGrid = (layout: string[] | null) => {
    const next: GridWorld = layout ? parseLayout(layout) : { ...world, cells: world.cells.map(() => 'empty') };
    setWorld(next);
    setRunning(false);
    restart(next.cells.length);
  };

  const maxAbs = Math.max(1, ...sim.V.map(Math.abs));
  const showArrows = mode === 'policy' || sim.iter > 0;
  const actionAt = (s: number) => (mode === 'policy' ? sim.policy[s] : greedyAction(cfg, sim.V, s));
  const lastDelta = sim.deltas[sim.deltas.length - 1];
  const status = sim.converged ? 'Converged' : active ? 'Running' : sim.iter > 0 ? 'Paused' : 'Ready';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel
          title="Grid world"
          actions={
            <Segmented<TapMode>
              value={tapMode}
              onChange={setTapMode}
              options={[
                { value: 'inspect', label: 'Tap to inspect' },
                { value: 'edit', label: 'Tap to edit' },
              ]}
            />
          }
        >
          <svg
            viewBox={`0 0 ${world.cols * CELL} ${world.rows * CELL}`}
            className={`${responsiveSurface} cursor-pointer select-none rounded-lg`}
            onClick={onGridClick}
            role="img"
            aria-label="Grid world showing state values and the greedy policy"
          >
            {world.cells.map((cell, s) => {
              const x = (s % world.cols) * CELL;
              const y = Math.floor(s / world.cols) * CELL;
              if (cell === 'wall') return <rect key={s} x={x} y={y} width={CELL} height={CELL} fill="#334155" stroke="#e5e7eb" strokeWidth={2} />;
              if (isTerminal(cell)) {
                const goal = cell === 'goal';
                return (
                  <g key={s}>
                    <rect x={x} y={y} width={CELL} height={CELL} fill={goal ? '#16a34a' : '#dc2626'} stroke="#e5e7eb" strokeWidth={2} />
                    <text x={x + 50} y={y + 46} textAnchor="middle" fontSize="28" fontWeight="700" fill="#fff">
                      {goal ? '+1' : '−1'}
                    </text>
                    <text x={x + 50} y={y + 74} textAnchor="middle" fontSize="16" fill="#fff">
                      {goal ? 'Goal' : 'Pit'}
                    </text>
                  </g>
                );
              }
              const v = sim.V[s];
              const ink = valueTextColor(v, maxAbs);
              return (
                <g key={s}>
                  <rect x={x} y={y} width={CELL} height={CELL} fill={valueColor(v, maxAbs)} stroke="#e5e7eb" strokeWidth={2} />
                  {showArrows && (
                    <path d={ARROW_PATH} fill={ink} opacity={0.75} transform={`translate(${x + 50} ${y + 36}) rotate(${actionAt(s) * 90})`} />
                  )}
                  <text x={x + 50} y={y + (showArrows ? 82 : 58)} textAnchor="middle" fontSize="22" fontWeight="600" fill={ink} className="tabular-nums">
                    {fmt(v)}
                  </text>
                </g>
              );
            })}
            <rect
              x={(selected % world.cols) * CELL + 3}
              y={Math.floor(selected / world.cols) * CELL + 3}
              width={CELL - 6}
              height={CELL - 6}
              fill="none"
              stroke="#4f46e5"
              strokeWidth={6}
              rx={6}
            />
          </svg>
          <p className="mt-3 text-sm text-ink-muted">
            {tapMode === 'edit'
              ? 'Tap a cell to cycle it: empty, wall, goal (+1), pit (−1).'
              : 'Tap a cell to see its Bellman backup. Switch to "Tap to edit" to change the map.'}
          </p>
        </Panel>

        <div className="min-w-0 space-y-6">
          <Panel title="Controls">
            <div className="space-y-4">
              <Segmented<Mode>
                label="Algorithm"
                value={mode}
                onChange={(m) => {
                  setMode(m);
                  restart();
                }}
                options={[
                  { value: 'value', label: 'Value iteration' },
                  { value: 'policy', label: 'Policy iteration' },
                ]}
              />
              <Slider label="Discount γ" value={gamma} min={0.5} max={0.99} step={0.01} onChange={changeSetting(setGamma)} format={(v) => v.toFixed(2)} />
              <Slider label="Step cost" value={stepCost} min={0} max={0.2} step={0.01} onChange={changeSetting(setStepCost)} format={(v) => v.toFixed(2)} />
              <Slider label="Slip probability" value={slip} min={0} max={0.6} step={0.05} onChange={changeSetting(setSlip)} format={(v) => v.toFixed(2)} />
              <Segmented<'1' | '4' | '15'>
                label="Sweeps per second"
                value={speed}
                onChange={setSpeed}
                options={[
                  { value: '1', label: '1' },
                  { value: '4', label: '4' },
                  { value: '15', label: '15' },
                ]}
              />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setRunning(!active)} disabled={sim.converged} leftIcon={active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
                  {active ? 'Pause' : 'Run'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSim((prev) => advance(cfg, mode, prev))} disabled={active || sim.converged} leftIcon={<StepForward className="h-4 w-4" />}>
                  {mode === 'value' ? 'One sweep' : 'One iteration'}
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
                  Reset values
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => resetGrid(DEFAULT_LAYOUT)} leftIcon={<LayoutGrid className="h-4 w-4" />}>
                  Default map
                </Button>
                <Button size="sm" variant="ghost" onClick={() => resetGrid(null)} leftIcon={<Eraser className="h-4 w-4" />}>
                  Clear map
                </Button>
              </div>
            </div>
          </Panel>

          <div className="grid grid-cols-2 gap-3">
            <Stat label={mode === 'value' ? 'Sweeps' : 'Iterations'} value={sim.iter} />
            <Stat label="Status" value={status} tone={sim.converged ? 'text-emerald-700' : undefined} />
            <Stat label="Last max |ΔV|" value={lastDelta === undefined ? '–' : lastDelta.toExponential(2)} />
            {mode === 'policy' ? (
              <Stat label="Policy changes" value={sim.iter === 0 ? '–' : `${sim.policyChanges} (${sim.evalSweeps} eval sweeps)`} />
            ) : (
              <Stat label="Stop when max |ΔV| <" value={THETA.toExponential(0)} />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BackupPanel cfg={cfg} sim={sim} s={selected} mode={mode} />
        <Panel title="Convergence">
          <LineChart
            series={[{ label: 'max |ΔV|', color: '#4f46e5', points: sim.deltas.map((d, i) => [i + 1, Math.max(d, 1e-8)]) }]}
            xLabel={mode === 'value' ? 'sweep' : 'iteration'}
            yLabel="max |ΔV| (log)"
            logY
            emptyText="Run or step to see the largest value change per sweep"
          />
        </Panel>
      </div>
    </div>
  );
}

function BackupPanel({ cfg, sim, s, mode }: { cfg: Config; sim: Sim; s: number; mode: Mode }) {
  const { world } = cfg;
  const cell = world.cells[s];
  const title = `Bellman backup for cell ${cellLabel(world, s)}`;

  if (cell === 'wall') {
    return (
      <Panel title={title}>
        <p className="text-sm text-ink-muted">Walls are not states. Moving into one leaves the agent where it was.</p>
      </Panel>
    );
  }
  if (isTerminal(cell)) {
    return (
      <Panel title={title}>
        <p className="text-sm text-ink-muted">
          This is a terminal {cell === 'goal' ? 'goal' : 'pit'}. The episode ends here, so V = 0; its reward of {cell === 'goal' ? '+1' : '−1'} is
          collected on the move that enters it.
        </p>
      </Panel>
    );
  }

  const qs = ACTIONS.map((_, a) => qValue(cfg, sim.V, s, a));
  const best = Math.max(...qs);
  const chosen = mode === 'policy' ? sim.policy[s] : qs.indexOf(best);

  return (
    <Panel title={title}>
      <p className="mb-3 text-sm text-ink-muted">
        Each action&apos;s expected value, Σ p × (r + γ × V(s&apos;)), using the current V. Step reward r = {fmt3(cfg.rewards.step)} (plus ±1 on entering a goal or
        pit), γ = {cfg.gamma.toFixed(2)}.
      </p>
      <ul className="space-y-2">
        {ACTIONS.map((act, a) => {
          const isChosen = a === chosen;
          return (
            <li key={act.name} className={`rounded-lg border px-3 py-2 ${isChosen ? 'border-brand-300 bg-brand-50' : 'border-line bg-subtle'}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-ink">
                  {act.arrow} {act.name}
                </span>
                <span className="font-mono text-sm font-semibold tabular-nums text-ink">Q = {fmt3(qs[a])}</span>
              </div>
              <div className="mt-1 break-words font-mono text-xs leading-relaxed text-ink-muted">
                {outcomes(world, s, a, cfg.slip)
                  .map((o) => `${o.p.toFixed(2)} × (${fmt3(reward(world, cfg.rewards, o.next))} + ${cfg.gamma.toFixed(2)} × ${fmt3(sim.V[o.next])})`)
                  .join(' + ')}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 font-mono text-sm text-ink">
        {mode === 'value'
          ? `V(s) ← max_a Q(s, a) = ${fmt3(best)}   (now ${fmt3(sim.V[s])})`
          : `π(s) = ${ACTIONS[chosen].name}; greedy best is ${fmt3(best)}`}
      </p>
    </Panel>
  );
}
