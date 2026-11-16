export type Order = 0 | 1 | 2;

export const ORDERS: Order[] = [0, 1, 2];
export const T_MAX = 100;

export const ORDER_INFO: Record<Order, { name: string; kUnit: string; kMin: number; kMax: number; kStep: number; kDefault: number; linear: string; slope: string }> = {
  0: { name: 'Zero order', kUnit: 'M s⁻¹', kMin: 0.002, kMax: 0.05, kStep: 0.001, kDefault: 0.01, linear: '[A] vs t', slope: '−k' },
  1: { name: 'First order', kUnit: 's⁻¹', kMin: 0.005, kMax: 0.2, kStep: 0.005, kDefault: 0.05, linear: 'ln[A] vs t', slope: '−k' },
  2: { name: 'Second order', kUnit: 'M⁻¹ s⁻¹', kMin: 0.005, kMax: 0.5, kStep: 0.005, kDefault: 0.05, linear: '1/[A] vs t', slope: '+k' },
};

export function concentration(order: Order, k: number, a0: number, t: number): number {
  if (order === 0) return Math.max(0, a0 - k * t);
  if (order === 1) return a0 * Math.exp(-k * t);
  return a0 / (1 + k * a0 * t);
}

export function rate(order: Order, k: number, a: number): number {
  return k * a ** order;
}

export function halfLife(order: Order, k: number, a: number): number {
  if (order === 0) return a / (2 * k);
  if (order === 1) return Math.LN2 / k;
  return 1 / (k * a);
}

export function halvingTimes(order: Order, k: number, a0: number, tMax: number, limit = 6): number[] {
  const times: number[] = [];
  for (let m = 1; m <= limit; m++) {
    const frac = 1 - 2 ** -m;
    const t = order === 0 ? (a0 * frac) / k : order === 1 ? (m * Math.LN2) / k : (2 ** m - 1) / (k * a0);
    if (t > tMax) break;
    times.push(t);
  }
  return times;
}

export const TRANSFORMS = [
  { key: 'A', label: '[A] (M)', title: '[A] vs t', order: 0 as Order, f: (a: number) => a },
  { key: 'lnA', label: 'ln[A]', title: 'ln[A] vs t', order: 1 as Order, f: (a: number) => (a > 0 ? Math.log(a) : NaN) },
  { key: 'invA', label: '1/[A] (M⁻¹)', title: '1/[A] vs t', order: 2 as Order, f: (a: number) => (a > 0 ? 1 / a : NaN) },
];

export interface Mystery {
  order: Order;
  k: number;
  a0: number;
  data: [number, number][];
}

function gaussian(): number {
  let u = 0;
  while (u === 0) u = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
}

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export function makeMystery(): Mystery {
  const order = pick(ORDERS);
  const a0 = pick([0.5, 0.8, 1.0, 1.2, 1.5, 2.0]);
  const tEnd = pick([40, 60, 80, 100, 120, 140]);
  const remaining = 0.12 + Math.random() * 0.13;
  const k = order === 0 ? (a0 * (1 - remaining)) / tEnd : order === 1 ? Math.log(1 / remaining) / tEnd : (1 / remaining - 1) / (a0 * tEnd);
  const data: [number, number][] = Array.from({ length: 8 }, (_, i) => {
    const t = (tEnd * i) / 7;
    const exact = concentration(order, k, a0, t);
    const noisy = i === 0 ? exact : exact * (1 + 0.005 * gaussian());
    return [t, Number(noisy.toPrecision(3))];
  });
  return { order, k, a0, data };
}
