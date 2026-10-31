'use client';

import { useEffect, useRef, useState } from 'react';
import { FastForward, Pause, Pencil, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import LineChart, { type ChartSeries } from '../_rl/LineChart';
import { Panel, Segmented, Slider, Stat } from '../_rl/controls';
import {
  ACTIONS,
  NEXT_CELL,
  argmax,
  cellLabel,
  isTerminal,
  move,
  mulberry32,
  parseLayout,
  reward,
  valueColor,
  valueTextColor,
  type GridWorld,
  type Rewards,
} from '../_rl/gridWorld';

type Algo = 'q' | 'sarsa';
type LayoutId = 'maze' | 'cliff';
type Speed = 'watch' | 'walk' | 'fast' | 'max';

const LAYOUTS: Record<LayoutId, { lines: string[]; rewards: Rewards; maxSteps: number }> = {
  maze: {
    lines: [
      '.....G', //
      '.##.#P',
      '...#..',
      '.#....',
      'S..P..',
    ],
    rewards: { step: -0.04, goal: 1, pit: -1 },
    maxSteps: 200,
  },
  cliff: {
    lines: [
      '............', //
      '............',
      '............',
      'SPPPPPPPPPPG',
    ],
    rewards: { step: -1, goal: 0, pit: -100 },
    maxSteps: 300,
  },
};

const ALGO_NAME: Record<Algo, string> = { q: 'Q-learning', sarsa: 'SARSA' };
const ALGO_COLOR: Record<Algo, string> = { q: '#4f46e5', sarsa: '#ea580c' };
/** 'watch' and 'walk' take one step every N ms; the others run many steps per animation frame. */
const SPEEDS: Record<Speed, { label: string; everyMs?: number; perFrame?: number }> = {
  watch: { label: 'Watch', everyMs: 350 },
  walk: { label: 'Quick', everyMs: 60 },
  fast: { label: 'Fast', perFrame: 60 },
  max: { label: 'Max', perFrame: 1500 },
};
const MAX_EPISODES = 20000;
const EPS_MIN = 0.01;
const EPS_DECAY = 0.99;
const SEED = 7;
const CELL = 100;

interface Params {
  alpha: number;
  gamma: number;
  algo: Algo;
  decay: boolean;
  /** Starting ε for a fresh agent. */
  eps: number;
}

interface Env {
  world: GridWorld;
  rewards: Rewards;
  maxSteps: number;
}

interface Transition {
  s: number;
  a: number;
  r: number;
  s2: number;
  /** SARSA's next action, or null for Q-learning / terminal steps. */
  a2: number | null;
  terminal: boolean;
  bootstrap: number;
  target: number;
  oldQ: number;
  newQ: number;
  alpha: number;
  gamma: number;
  algo: Algo;
}

/** Mutable learner state, kept in a ref and advanced by the animation loop. */
interface Agent {
  Q: Float64Array;
  rng: () => number;
  pos: number;
  nextAction: number | null;
  stepInEp: number;
  epReward: number;
  episode: number;
  eps: number;
  totalSteps: number;
  rewards: number[];
  steps: number[];
  last: Transition | null;
}

/** Plain copy of the agent for rendering. */
interface View {
  Q: number[];
  pos: number;
  stepInEp: number;
  epReward: number;
  episode: number;
  eps: number;
  totalSteps: number;
  rewards: number[];
  steps: number[];
  last: Transition | null;
}

function createAgent(env: Env, eps: number): Agent {
  return {
    Q: new Float64Array(env.world.cells.length * 4),
    rng: mulberry32(SEED),
    pos: env.world.start,
    nextAction: null,
    stepInEp: 0,
    epReward: 0,
    episode: 0,
    eps,
    totalSteps: 0,
    rewards: [],
    steps: [],
    last: null,
  };
}

function snapshot(ag: Agent): View {
  return {
    Q: Array.from(ag.Q),
    pos: ag.pos,
    stepInEp: ag.stepInEp,
    epReward: ag.epReward,
    episode: ag.episode,
    eps: ag.eps,
    totalSteps: ag.totalSteps,
    rewards: ag.rewards.slice(),
    steps: ag.steps.slice(),
    last: ag.last,
  };
}

/** ε-greedy: random action with probability ε, otherwise the best one (ties broken at random). */
function chooseAction(ag: Agent, s: number): number {
  if (ag.rng() < ag.eps) return Math.floor(ag.rng() * 4);
  let best = -Infinity;
  const ties: number[] = [];
  for (let a = 0; a < 4; a++) {
    const q = ag.Q[s * 4 + a];
    if (q > best + 1e-12) {
      best = q;
      ties.length = 0;
      ties.push(a);
    } else if (Math.abs(q - best) <= 1e-12) ties.push(a);
  }
  return ties[Math.floor(ag.rng() * ties.length)];
}

function maxQ(Q: ArrayLike<number>, s: number): number {
  return Math.max(Q[s * 4], Q[s * 4 + 1], Q[s * 4 + 2], Q[s * 4 + 3]);
}

/** One environment step plus one temporal-difference update. */
function stepAgent(ag: Agent, env: Env, p: Params) {
  const s = ag.pos;
  const a = ag.nextAction ?? chooseAction(ag, s);
  const s2 = move(env.world, s, a);
  const r = reward(env.world, env.rewards, s2);
  const terminal = isTerminal(env.world.cells[s2]);
  const truncated = !terminal && ag.stepInEp + 1 >= env.maxSteps;

  let a2: number | null = null;
  let bootstrap = 0;
  if (!terminal) {
    if (p.algo === 'sarsa') {
      a2 = chooseAction(ag, s2); // on-policy: the action we will actually take next
      bootstrap = ag.Q[s2 * 4 + a2];
    } else {
      bootstrap = maxQ(ag.Q, s2); // off-policy: the best action, whatever we take
    }
  }
  const target = r + p.gamma * bootstrap;
  const oldQ = ag.Q[s * 4 + a];
  const newQ = oldQ + p.alpha * (target - oldQ);
  ag.Q[s * 4 + a] = newQ;
  ag.last = { s, a, r, s2, a2, terminal, bootstrap, target, oldQ, newQ, alpha: p.alpha, gamma: p.gamma, algo: p.algo };

  ag.epReward += r;
  ag.stepInEp += 1;
  ag.totalSteps += 1;

  if (terminal || truncated) {
    ag.rewards.push(ag.epReward);
    ag.steps.push(ag.stepInEp);
    ag.episode += 1;
    if (p.decay) ag.eps = Math.max(EPS_MIN, ag.eps * EPS_DECAY);
    ag.pos = env.world.start;
    ag.nextAction = null;
    ag.stepInEp = 0;
    ag.epReward = 0;
  } else {
    ag.pos = s2;
    ag.nextAction = a2;
  }
}

/** Trailing moving average, thinned to at most `maxPoints` chart points. */
function smooth(values: number[], window: number, maxPoints = 250): [number, number][] {
  const out: [number, number][] = [];
  const stride = Math.max(1, Math.ceil(values.length / maxPoints));
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= window) sum -= values[i - window];
    if (i % stride === 0 || i === values.length - 1) out.push([i + 1, sum / Math.min(window, i + 1)]);
  }
  return out;
}

const fmt = (v: number, digits = 3) => v.toFixed(digits).replace('-', '−');
const fmtCell = (v: number) => (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2)).replace('-', '−');
const ARROW_PATH = 'M 0 -17 L 11 -4 L 4 -4 L 4 15 L -4 15 L -4 -4 L -11 -4 Z';

function triangle(x: number, y: number, a: number): string {
  const cx = x + CELL / 2;
  const cy = y + CELL / 2;
  const corners = [
    [x, y, x + CELL, y],
    [x + CELL, y, x + CELL, y + CELL],
    [x + CELL, y + CELL, x, y + CELL],
    [x, y + CELL, x, y],
  ][a];
  return `${corners[0]},${corners[1]} ${corners[2]},${corners[3]} ${cx},${cy}`;
}

const LABEL_POS = [
  [50, 22],
  [79, 55],
  [50, 90],
  [21, 55],
];

export default function QLearningVisualizer() {
  const [layout, setLayout] = useState<LayoutId>('maze');
  const [env, setEnv] = useState<Env>(() => ({ world: parseLayout(LAYOUTS.maze.lines), rewards: LAYOUTS.maze.rewards, maxSteps: LAYOUTS.maze.maxSteps }));
  const [alpha, setAlpha] = useState(0.5);
  const [gamma, setGamma] = useState(0.9);
  const [eps, setEps] = useState(0.3);
  const [decay, setDecay] = useState(true);
  const [algo, setAlgo] = useState<Algo>('q');
  const [speed, setSpeed] = useState<Speed>('watch');
  const [running, setRunning] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showNumbers, setShowNumbers] = useState(true);
  const [view, setView] = useState<View>(() => snapshot(createAgent(env, eps)));
  /** Reward curve of the most recent run of each algorithm, for comparison. */
  const [saved, setSaved] = useState<Partial<Record<Algo, number[]>>>({});

  const agentRef = useRef<Agent | null>(null);
  const paramsRef = useRef<Params>({ alpha, gamma, algo, decay, eps });

  useEffect(() => {
    paramsRef.current = { alpha, gamma, algo, decay, eps };
  }, [alpha, gamma, algo, decay, eps]);

  const getAgent = () => {
    if (!agentRef.current) agentRef.current = createAgent(env, paramsRef.current.eps);
    return agentRef.current;
  };

  useEffect(() => {
    if (!running) return;
    const { everyMs, perFrame } = SPEEDS[speed];
    let raf = 0;
    let lastStep = performance.now();
    const frame = (now: number) => {
      const ag = agentRef.current ?? (agentRef.current = createAgent(env, paramsRef.current.eps));
      let stepped = false;
      if (everyMs) {
        if (now - lastStep >= everyMs) {
          lastStep = now;
          stepAgent(ag, env, paramsRef.current);
          stepped = true;
        }
      } else {
        for (let i = 0; i < (perFrame ?? 1) && ag.episode < MAX_EPISODES; i++) stepAgent(ag, env, paramsRef.current);
        stepped = true;
      }
      if (stepped) setView(snapshot(ag));
      if (ag.episode >= MAX_EPISODES) {
        setRunning(false);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running, speed, env]);

  /** Start a fresh agent. Keeps the finished run's reward curve for comparison. */
  const resetAgent = (nextEnv: Env = env, nextEps: number = eps, keepCurve = true) => {
    const ag = agentRef.current;
    if (keepCurve && ag && ag.rewards.length >= 10) {
      const runAlgo = ag.last?.algo ?? algo;
      const curve = ag.rewards.slice();
      setSaved((prev) => ({ ...prev, [runAlgo]: curve }));
    }
    agentRef.current = createAgent(nextEnv, nextEps);
    setView(snapshot(agentRef.current));
  };

  const stepOnce = () => {
    const ag = getAgent();
    stepAgent(ag, env, paramsRef.current);
    setView(snapshot(ag));
  };

  const trainEpisodes = (count: number) => {
    const ag = getAgent();
    const target = ag.episode + count;
    const limit = count * env.maxSteps + 1;
    for (let i = 0; i < limit && ag.episode < target; i++) stepAgent(ag, env, paramsRef.current);
    setView(snapshot(ag));
  };

  const changeEps = (v: number) => {
    setEps(v);
    getAgent().eps = v;
    setView(snapshot(getAgent()));
  };

  const changeLayout = (id: LayoutId) => {
    const next: Env = { world: parseLayout(LAYOUTS[id].lines), rewards: LAYOUTS[id].rewards, maxSteps: LAYOUTS[id].maxSteps };
    const presetEps = id === 'cliff' ? 0.1 : 0.3;
    setLayout(id);
    setEnv(next);
    setAlpha(0.5);
    setGamma(id === 'cliff' ? 1 : 0.9);
    setEps(presetEps);
    setDecay(id !== 'cliff');
    setSaved({});
    resetAgent(next, presetEps, false);
  };

  const changeAlgo = (next: Algo) => {
    setAlgo(next);
    paramsRef.current = { ...paramsRef.current, algo: next };
    resetAgent();
  };

  const onGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!editing) return;
    const { x, y } = toDrawingPoint(e, e.currentTarget);
    const c = Math.floor(x / CELL);
    const r = Math.floor(y / CELL);
    const { world } = env;
    if (r < 0 || r >= world.rows || c < 0 || c >= world.cols) return;
    const s = r * world.cols + c;
    if (s === world.start) return;
    const cells = world.cells.slice();
    cells[s] = NEXT_CELL[cells[s]];
    const next = { ...env, world: { ...world, cells } };
    setEnv(next);
    setSaved({});
    resetAgent(next, eps, false);
  };

  const { world } = env;
  let maxAbs = 1e-6;
  for (const q of view.Q) maxAbs = Math.max(maxAbs, Math.abs(q));
  const last = view.last;
  const recent = view.rewards.slice(-20);
  const recentMean = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : 0;
  const smoothWindow = Math.max(1, Math.min(20, Math.ceil(view.rewards.length / 10)));

  const other: Algo = algo === 'q' ? 'sarsa' : 'q';
  const rewardSeries: ChartSeries[] = [
    { label: `${ALGO_NAME[algo]} (current run)`, color: ALGO_COLOR[algo], points: smooth(view.rewards, smoothWindow) },
  ];
  if (saved[other]) rewardSeries.push({ label: `${ALGO_NAME[other]} (last run)`, color: ALGO_COLOR[other], points: smooth(saved[other], 20), dashed: true });
  if (saved[algo]) rewardSeries.push({ label: `${ALGO_NAME[algo]} (last run)`, color: '#94a3b8', points: smooth(saved[algo], 20), dashed: true });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Panel
          title="Q-table on the grid"
          actions={
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant={showNumbers ? 'secondary' : 'ghost'} onClick={() => setShowNumbers(!showNumbers)} aria-pressed={showNumbers}>
                Numbers
              </Button>
              <Button size="sm" variant={editing ? 'secondary' : 'ghost'} onClick={() => setEditing(!editing)} aria-pressed={editing} leftIcon={<Pencil className="h-4 w-4" />}>
                Edit map
              </Button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${world.cols * CELL} ${world.rows * CELL}`}
              className={`${responsiveSurface} ${world.cols > 8 ? 'min-w-[560px]' : ''} select-none rounded-lg ${editing ? 'cursor-pointer' : ''}`}
              onClick={onGridClick}
              role="img"
              aria-label="Grid world with the four Q-values of each cell drawn as triangles"
            >
              {world.cells.map((cell, s) => {
                const x = (s % world.cols) * CELL;
                const y = Math.floor(s / world.cols) * CELL;
                if (cell === 'wall') return <rect key={s} x={x} y={y} width={CELL} height={CELL} fill="#334155" stroke="#e5e7eb" strokeWidth={2} />;
                if (isTerminal(cell)) {
                  const goal = cell === 'goal';
                  const value = goal ? env.rewards.goal : env.rewards.pit;
                  return (
                    <g key={s}>
                      <rect x={x} y={y} width={CELL} height={CELL} fill={goal ? '#16a34a' : '#dc2626'} stroke="#e5e7eb" strokeWidth={2} />
                      <text x={x + 50} y={y + 48} textAnchor="middle" fontSize="24" fontWeight="700" fill="#fff">
                        {value > 0 ? `+${value}` : String(value).replace('-', '−')}
                      </text>
                      <text x={x + 50} y={y + 74} textAnchor="middle" fontSize="16" fill="#fff">
                        {goal ? 'Goal' : layout === 'cliff' ? 'Cliff' : 'Pit'}
                      </text>
                    </g>
                  );
                }
                const qs = view.Q.slice(s * 4, s * 4 + 4);
                const visited = qs.some((q) => q !== 0);
                const best = argmax(qs);
                return (
                  <g key={s}>
                    {qs.map((q, a) => (
                      <polygon key={a} points={triangle(x, y, a)} fill={valueColor(q, maxAbs, 0.5)} stroke="#ffffff" strokeWidth={1.5} />
                    ))}
                    {showNumbers &&
                      qs.map((q, a) => (
                        <text
                          key={a}
                          x={x + LABEL_POS[a][0]}
                          y={y + LABEL_POS[a][1]}
                          textAnchor="middle"
                          fontSize="13"
                          fill={valueTextColor(q, maxAbs, 0.5)}
                          className="tabular-nums"
                        >
                          {fmtCell(q)}
                        </text>
                      ))}
                    {visited && view.pos !== s && (
                      <path d={ARROW_PATH} fill="#0f172a" opacity={0.7} transform={`translate(${x + 50} ${y + 50}) scale(0.75) rotate(${best * 90})`} />
                    )}
                    {s === world.start && (
                      <rect x={x + 4} y={y + 4} width={CELL - 8} height={CELL - 8} fill="none" stroke="#4f46e5" strokeWidth={3} strokeDasharray="8 6" />
                    )}
                    <rect x={x} y={y} width={CELL} height={CELL} fill="none" stroke="#e5e7eb" strokeWidth={2} />
                  </g>
                );
              })}
              {last && (
                <polygon
                  points={triangle((last.s % world.cols) * CELL, Math.floor(last.s / world.cols) * CELL, last.a)}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={5}
                  strokeLinejoin="round"
                />
              )}
              <circle
                cx={(view.pos % world.cols) * CELL + 50}
                cy={Math.floor(view.pos / world.cols) * CELL + 50}
                r={17}
                fill="#4f46e5"
                stroke="#ffffff"
                strokeWidth={4}
              />
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-full bg-brand-600" aria-hidden /> Agent
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 border-2 border-dashed border-brand-600" aria-hidden /> Start
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 border-2 border-amber-500" aria-hidden /> Last update
            </span>
            <span>Triangle colour: Q(s, a), green high, red low. Arrow: greedy action.</span>
          </div>
          {editing && <p className="mt-2 text-sm text-ink-muted">Tap a cell to cycle empty, wall, goal, pit. Editing the map resets the agent.</p>}
        </Panel>

        <div className="min-w-0 space-y-6">
          <Panel title="Controls">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Segmented<LayoutId>
                  label="Map"
                  value={layout}
                  onChange={changeLayout}
                  options={[
                    { value: 'maze', label: 'Maze' },
                    { value: 'cliff', label: 'Cliff walk' },
                  ]}
                />
                <Segmented<Algo>
                  label="Algorithm"
                  value={algo}
                  onChange={changeAlgo}
                  options={[
                    { value: 'q', label: 'Q-learning' },
                    { value: 'sarsa', label: 'SARSA' },
                  ]}
                />
              </div>
              <Slider label="Learning rate α" value={alpha} min={0.05} max={1} step={0.05} onChange={setAlpha} format={(v) => v.toFixed(2)} />
              <Slider label="Discount γ" value={gamma} min={0.5} max={1} step={0.01} onChange={setGamma} format={(v) => v.toFixed(2)} />
              <Slider label="Exploration ε" value={eps} min={0} max={1} step={0.05} onChange={changeEps} format={(v) => v.toFixed(2)} />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={decay} onChange={(e) => setDecay(e.target.checked)} className="h-4 w-4 accent-brand-600" />
                Decay ε by ×{EPS_DECAY} per episode (down to {EPS_MIN})
              </label>
              <Segmented<Speed>
                label="Speed"
                value={speed}
                onChange={setSpeed}
                options={(Object.keys(SPEEDS) as Speed[]).map((k) => ({ value: k, label: SPEEDS[k].label }))}
              />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setRunning(!running)} leftIcon={running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
                  {running ? 'Pause' : 'Run'}
                </Button>
                <Button size="sm" variant="outline" onClick={stepOnce} disabled={running} leftIcon={<StepForward className="h-4 w-4" />}>
                  Step
                </Button>
                <Button size="sm" variant="outline" onClick={() => trainEpisodes(100)} disabled={running} leftIcon={<FastForward className="h-4 w-4" />}>
                  +100 episodes
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setRunning(false);
                    resetAgent();
                  }}
                  leftIcon={<RotateCcw className="h-4 w-4" />}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Panel>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Episode" value={view.episode} />
            <Stat label="Step in episode" value={view.stepInEp} />
            <Stat label="Current ε" value={view.eps.toFixed(3)} />
            <Stat label="Total steps" value={view.totalSteps.toLocaleString('en-US')} />
            <Stat label="Last episode reward" value={view.rewards.length ? fmt(view.rewards[view.rewards.length - 1], 2) : '–'} />
            <Stat label="Mean of last 20" value={recent.length ? fmt(recentMean, 2) : '–'} />
          </div>
        </div>
      </div>

      <Panel title="Last temporal-difference update">
        {last ? (
          <div className="space-y-1.5 break-words font-mono text-sm leading-relaxed text-ink">
            <p className="text-ink-muted">
              s = {cellLabel(world, last.s)}, a = {ACTIONS[last.a].name}, r = {fmt(last.r)}, s&apos; = {cellLabel(world, last.s2)}
              {last.terminal ? ' (terminal)' : ''}
            </p>
            {last.terminal ? (
              <p>target = r = {fmt(last.target)} (no future value after a terminal state)</p>
            ) : last.algo === 'sarsa' && last.a2 !== null ? (
              <p>
                target = r + γ × Q(s&apos;, a&apos;) with a&apos; = {ACTIONS[last.a2].name} = {fmt(last.r)} + {last.gamma.toFixed(2)} × {fmt(last.bootstrap)} ={' '}
                {fmt(last.target)}
              </p>
            ) : (
              <p>
                target = r + γ × max<sub>a&apos;</sub> Q(s&apos;, a&apos;) = {fmt(last.r)} + {last.gamma.toFixed(2)} × {fmt(last.bootstrap)} = {fmt(last.target)}
              </p>
            )}
            <p>
              TD error δ = target − Q(s, a) = {fmt(last.target)} − {fmt(last.oldQ)} = {fmt(last.target - last.oldQ)}
            </p>
            <p className="font-semibold">
              Q(s, a) ← {fmt(last.oldQ)} + {last.alpha.toFixed(2)} × {fmt(last.target - last.oldQ)} = {fmt(last.newQ)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-ink-muted">Press Step or Run. Each move updates one Q-value, and the arithmetic shows up here.</p>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Reward per episode">
          <LineChart series={rewardSeries} xLabel="episode" yLabel={`reward (avg of ${smoothWindow})`} emptyText="Finish an episode to see its reward" />
        </Panel>
        <Panel title="Steps per episode">
          <LineChart
            series={[{ label: ALGO_NAME[algo], color: ALGO_COLOR[algo], points: smooth(view.steps, smoothWindow) }]}
            xLabel="episode"
            yLabel={`steps (avg of ${smoothWindow})`}
            emptyText="Finish an episode to see its length"
          />
        </Panel>
      </div>
    </div>
  );
}
