export const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);

export const mean = (xs: number[]) => (xs.length ? sum(xs) / xs.length : NaN);

export const sortAsc = (xs: number[]) => [...xs].sort((a, b) => a - b);

export function medianOfSorted(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  const mid = Math.floor(n / 2);
  return n % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export const median = (xs: number[]) => medianOfSorted(sortAsc(xs));

export function sumSquaredDeviations(xs: number[]) {
  const m = mean(xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0);
}

export const populationSd = (xs: number[]) => (xs.length ? Math.sqrt(sumSquaredDeviations(xs) / xs.length) : NaN);

export const sampleSd = (xs: number[]) => (xs.length > 1 ? Math.sqrt(sumSquaredDeviations(xs) / (xs.length - 1)) : NaN);

export function modes(xs: number[]): { values: number[]; count: number } {
  const counts = new Map<number, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  const max = Math.max(0, ...counts.values());
  if (max <= 1) return { values: [], count: max };
  const values = [...counts.entries()].filter(([, c]) => c === max).map(([v]) => v);
  if (values.length === counts.size) return { values: [], count: max };
  return { values: values.sort((a, b) => a - b), count: max };
}

export interface Quartiles {
  sorted: number[];
  n: number;
  q1: number;
  q2: number;
  q3: number;
  lower: number[];
  upper: number[];
  iqr: number;
  lowerFence: number;
  upperFence: number;
  outliers: number[];
  whiskerLow: number;
  whiskerHigh: number;
  min: number;
  max: number;
}

export function quartiles(xs: number[]): Quartiles {
  const sorted = sortAsc(xs);
  const n = sorted.length;
  const half = Math.floor(n / 2);
  const lower = sorted.slice(0, half);
  const upper = sorted.slice(n - half);
  const q2 = medianOfSorted(sorted);
  const q1 = lower.length ? medianOfSorted(lower) : q2;
  const q3 = upper.length ? medianOfSorted(upper) : q2;
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const inside = sorted.filter((x) => x >= lowerFence && x <= upperFence);
  return {
    sorted,
    n,
    q1,
    q2,
    q3,
    lower,
    upper,
    iqr,
    lowerFence,
    upperFence,
    outliers: sorted.filter((x) => x < lowerFence || x > upperFence),
    whiskerLow: inside.length ? inside[0] : q1,
    whiskerHigh: inside.length ? inside[inside.length - 1] : q3,
    min: sorted[0],
    max: sorted[n - 1],
  };
}

export function correlationParts(xs: number[], ys: number[]) {
  const n = xs.length;
  const mx = mean(xs);
  const my = mean(ys);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }
  const sx = Math.sqrt(sxx / (n - 1));
  const sy = Math.sqrt(syy / (n - 1));
  const cov = sxy / (n - 1);
  const r = sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN;
  return { n, mx, my, sxy, sxx, syy, sx, sy, cov, r };
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function normalSampler(rand: () => number) {
  return () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}

export function niceStep(span: number, target = 8) {
  const raw = span / Math.max(1, target);
  const p = 10 ** Math.floor(Math.log10(raw));
  const f = raw / p;
  return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p;
}

export function niceRange(lo: number, hi: number, target = 8) {
  if (lo === hi) {
    lo -= 1;
    hi += 1;
  }
  const step = niceStep(hi - lo, target);
  return { min: Math.floor(lo / step) * step, max: Math.ceil(hi / step) * step, step };
}

export function ticks(min: number, max: number, step: number) {
  const out: number[] = [];
  const count = Math.round((max - min) / step);
  for (let i = 0; i <= count; i++) out.push(roundTo(min + i * step, 10));
  return out;
}

export function roundTo(x: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(x * f) / f;
}

export function fmt(x: number, digits = 2) {
  if (!Number.isFinite(x)) return '–';
  const v = roundTo(x, digits);
  return (Object.is(v, -0) ? 0 : v).toString().replace('-', '−');
}

export function stackLevels(xs: number[], minGap: number): number[] {
  const order = xs.map((x, i) => ({ x, i })).sort((a, b) => a.x - b.x || a.i - b.i);
  const placed: { x: number; level: number }[] = [];
  const levels = new Array<number>(xs.length).fill(0);
  for (const { x, i } of order) {
    const taken = new Set(placed.filter((p) => Math.abs(p.x - x) < minGap).map((p) => p.level));
    let level = 0;
    while (taken.has(level)) level++;
    placed.push({ x, level });
    levels[i] = level;
  }
  return levels;
}

export function parseNumbers(text: string): number[] {
  return text
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number)
    .filter((v) => Number.isFinite(v));
}
