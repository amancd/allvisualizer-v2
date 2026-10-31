/**
 * A small grid-world environment shared by the Value Iteration and Q-Learning pages.
 *
 * States are cell indices (row * cols + col). Walls are never entered: a move into a
 * wall or off the grid leaves the agent where it is. Goal and pit cells are terminal.
 * Every transition earns `rewards.step`, plus `rewards.goal` / `rewards.pit` when it
 * lands on a goal or pit.
 */

export type Cell = 'empty' | 'wall' | 'goal' | 'pit';

export interface GridWorld {
  rows: number;
  cols: number;
  cells: Cell[];
  /** Start cell for agents that act in the world (Q-learning). */
  start: number;
}

export interface Rewards {
  step: number;
  goal: number;
  pit: number;
}

export const ACTIONS = [
  { name: 'Up', dr: -1, dc: 0, arrow: '↑' },
  { name: 'Right', dr: 0, dc: 1, arrow: '→' },
  { name: 'Down', dr: 1, dc: 0, arrow: '↓' },
  { name: 'Left', dr: 0, dc: -1, arrow: '←' },
] as const;

/** Order in which a tap cycles a cell. */
export const NEXT_CELL: Record<Cell, Cell> = { empty: 'wall', wall: 'goal', goal: 'pit', pit: 'empty' };

/**
 * Builds a world from strings: '.' empty, '#' wall, 'G' goal, 'P' pit, 'S' start (an empty cell).
 */
export function parseLayout(lines: string[]): GridWorld {
  const rows = lines.length;
  const cols = lines[0].length;
  const cells: Cell[] = [];
  let start = 0;
  lines.forEach((line, r) => {
    for (let c = 0; c < cols; c++) {
      const ch = line[c];
      if (ch === 'S') start = r * cols + c;
      cells.push(ch === '#' ? 'wall' : ch === 'G' ? 'goal' : ch === 'P' ? 'pit' : 'empty');
    }
  });
  return { rows, cols, cells, start };
}

export const isTerminal = (cell: Cell) => cell === 'goal' || cell === 'pit';

/** Deterministic move: the cell you end up in if action `a` succeeds. */
export function move(world: GridWorld, s: number, a: number): number {
  const r = Math.floor(s / world.cols) + ACTIONS[a].dr;
  const c = (s % world.cols) + ACTIONS[a].dc;
  if (r < 0 || r >= world.rows || c < 0 || c >= world.cols) return s;
  const next = r * world.cols + c;
  return world.cells[next] === 'wall' ? s : next;
}

export interface Outcome {
  /** The direction actually taken. */
  dir: number;
  p: number;
  next: number;
}

/**
 * Stochastic transitions: the intended direction with probability 1 − slip,
 * each perpendicular direction with probability slip / 2.
 */
export function outcomes(world: GridWorld, s: number, a: number, slip: number): Outcome[] {
  const list: Outcome[] = [{ dir: a, p: 1 - slip, next: move(world, s, a) }];
  if (slip > 0) {
    for (const dir of [(a + 1) % 4, (a + 3) % 4]) list.push({ dir, p: slip / 2, next: move(world, s, dir) });
  }
  return list;
}

/** Reward for a transition that lands in `next`. */
export function reward(world: GridWorld, rewards: Rewards, next: number): number {
  const cell = world.cells[next];
  return rewards.step + (cell === 'goal' ? rewards.goal : cell === 'pit' ? rewards.pit : 0);
}

export const cellLabel = (world: GridWorld, s: number) => `(${Math.floor(s / world.cols)}, ${s % world.cols})`;

/** Seeded PRNG so runs are reproducible. Returns floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Diverging colour for a value: red below zero, white at zero, green above.
 * `curve` < 1 boosts contrast for small values (0.5 = square-root scale).
 */
export function valueColor(v: number, maxAbs: number, curve = 1): string {
  const t = Math.min(1, Math.abs(v) / (maxAbs || 1)) ** curve;
  const [r, g, b] = v >= 0 ? [22, 163, 74] : [220, 38, 38];
  const mix = (x: number) => Math.round(255 + (x - 255) * t * 0.85);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/** Text colour that stays readable on top of `valueColor`. */
export function valueTextColor(v: number, maxAbs: number, curve = 1): string {
  const t = Math.min(1, Math.abs(v) / (maxAbs || 1)) ** curve;
  return t > 0.6 ? '#ffffff' : '#0f172a';
}

/** Index of the largest entry; ties go to the first. */
export function argmax(values: ArrayLike<number>): number {
  let best = 0;
  for (let i = 1; i < values.length; i++) if (values[i] > values[best]) best = i;
  return best;
}
