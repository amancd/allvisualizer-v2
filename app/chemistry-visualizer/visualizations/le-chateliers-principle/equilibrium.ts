export const R_GAS = 8.314;
export const R_LATM = 0.08206;

export interface Species {
  label: string;
  coef: number;
  side: 'reactant' | 'product';
  color: string;
  addAmount: number;
}

export interface Reaction {
  id: 'haber' | 'n2o4';
  name: string;
  equation: string;
  deltaH: number;
  k0: number;
  t0: number;
  tMin: number;
  tMax: number;
  start: number[];
  species: Species[];
}

export const REACTIONS: Record<Reaction['id'], Reaction> = {
  haber: {
    id: 'haber',
    name: 'Haber process',
    equation: 'N₂ + 3H₂ ⇌ 2NH₃',
    deltaH: -92000,
    k0: 0.06,
    t0: 773,
    tMin: 600,
    tMax: 900,
    start: [1, 3, 0],
    species: [
      { label: 'N₂', coef: 1, side: 'reactant', color: '#2563eb', addAmount: 0.5 },
      { label: 'H₂', coef: 3, side: 'reactant', color: '#16a34a', addAmount: 1 },
      { label: 'NH₃', coef: 2, side: 'product', color: '#dc2626', addAmount: 0.5 },
    ],
  },
  n2o4: {
    id: 'n2o4',
    name: 'Nitrogen dioxide',
    equation: 'N₂O₄ ⇌ 2NO₂',
    deltaH: 57200,
    k0: 4.6e-3,
    t0: 298,
    tMin: 273,
    tMax: 373,
    start: [0.1, 0],
    species: [
      { label: 'N₂O₄', coef: 1, side: 'reactant', color: '#64748b', addAmount: 0.05 },
      { label: 'NO₂', coef: 2, side: 'product', color: '#b45309', addAmount: 0.02 },
    ],
  },
};

export function equilibriumConstant(rx: Reaction, T: number): number {
  return rx.k0 * Math.exp((-rx.deltaH / R_GAS) * (1 / T - 1 / rx.t0));
}

function sign(s: Species) {
  return s.side === 'reactant' ? -1 : 1;
}

function products(rx: Reaction, c: number[], side: Species['side']) {
  return rx.species.reduce((p, s, i) => (s.side === side ? p * Math.max(c[i], 0) ** s.coef : p), 1);
}

export function reactionQuotient(rx: Reaction, c: number[]): number {
  const den = products(rx, c, 'reactant');
  const num = products(rx, c, 'product');
  if (den === 0) return num === 0 ? NaN : Infinity;
  return num / den;
}

export function gasMoleChange(rx: Reaction): number {
  return rx.species.reduce((d, s) => d + sign(s) * s.coef, 0);
}

function shifted(rx: Reaction, c: number[], xi: number) {
  return c.map((ci, i) => ci + sign(rx.species[i]) * rx.species[i].coef * xi);
}

function extentBounds(rx: Reaction, c: number[]) {
  let hi = Infinity;
  let lo = -Infinity;
  rx.species.forEach((s, i) => {
    if (s.side === 'reactant') hi = Math.min(hi, c[i] / s.coef);
    else lo = Math.max(lo, -c[i] / s.coef);
  });
  return { lo, hi };
}

function netRate(rx: Reaction, c: number[], K: number, scale = 1) {
  return scale * (K * products(rx, c, 'reactant') - products(rx, c, 'product'));
}

function rateSlope(rx: Reaction, c: number[], K: number, scale: number) {
  const eps = 1e-7 * Math.max(1e-6, ...c);
  return Math.abs((netRate(rx, shifted(rx, c, eps), K, scale) - netRate(rx, shifted(rx, c, -eps), K, scale)) / (2 * eps));
}

export function rateScaleFor(rx: Reaction, c: number[], K: number, relaxationTime: number): number {
  const slope = rateSlope(rx, equilibrate(rx, c, K), K, 1);
  return slope > 0 ? 1 / (relaxationTime * slope) : 1;
}

export function equilibrate(rx: Reaction, c: number[], K: number): number[] {
  const { lo, hi } = extentBounds(rx, c);
  let a = lo;
  let b = hi;
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (netRate(rx, shifted(rx, c, m), K) > 0) a = m;
    else b = m;
  }
  return shifted(rx, c, (a + b) / 2);
}

export function step(rx: Reaction, c: number[], K: number, dt: number, scale: number): number[] {
  let state = c;
  let remaining = dt;
  let guard = 0;
  while (remaining > 1e-9 && guard < 5000) {
    guard++;
    const r = netRate(rx, state, K, scale);
    const { lo, hi } = extentBounds(rx, state);
    const slope = rateSlope(rx, state, K, scale);
    const h = Math.min(remaining, slope > 0 ? 0.2 / slope : remaining);
    const mid = shifted(rx, state, Math.max(lo, Math.min(hi, (r * h) / 2)));
    const r2 = netRate(rx, mid, K, scale);
    const dxi = Math.max(lo, Math.min(hi, r2 * h));
    state = shifted(rx, state, dxi).map((x) => Math.max(0, x));
    remaining -= h;
  }
  return state;
}
