import { mulberry32, niceRange, normalSampler } from '../_descriptive-statistics/stats';

export type XY = { id: number; x: number; y: number };

export function generateCorrelated(r: number, n: number, seed: number): XY[] {
  const rand = mulberry32(seed * 7919 + n * 104729 + 17);
  const normal = normalSampler(rand);
  const xs = Array.from({ length: n }, normal);
  const zs = Array.from({ length: n }, normal);
  const center = (v: number[]) => {
    const m = v.reduce((s, a) => s + a, 0) / v.length;
    return v.map((a) => a - m);
  };
  const dot = (a: number[], b: number[]) => a.reduce((s, ai, i) => s + ai * b[i], 0);
  const x = center(xs);
  let z = center(zs);
  const proj = dot(z, x) / dot(x, x);
  z = z.map((zi, i) => zi - proj * x[i]);
  const nx = Math.sqrt(dot(x, x));
  const nz = Math.sqrt(dot(z, z));
  const scale = 10 * Math.sqrt(n - 1);
  const k = Math.sqrt(Math.max(0, 1 - r * r));
  return x.map((xi, i) => {
    const ux = xi / nx;
    const uz = z[i] / nz;
    return { id: i, x: 50 + scale * ux, y: 50 + scale * (r * ux + k * uz) };
  });
}

export function rangeOf(values: number[]) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = (hi - lo) * 0.08 || 1;
  return niceRange(lo - pad, hi + pad, 8);
}

export const ANSCOMBE_X = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5];

export const ANSCOMBE: { name: string; x: number[]; y: number[]; story: string }[] = [
  {
    name: 'I',
    x: ANSCOMBE_X,
    y: [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68],
    story: 'A noisy straight-line trend. This is the picture r = 0.82 suggests.',
  },
  {
    name: 'II',
    x: ANSCOMBE_X,
    y: [9.14, 8.14, 8.74, 8.77, 9.26, 8.1, 6.13, 3.1, 9.13, 7.26, 4.74],
    story: 'Points on a smooth parabola. The relationship is almost exact, just not a straight line.',
  },
  {
    name: 'III',
    x: ANSCOMBE_X,
    y: [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73],
    story: 'Ten points almost exactly on a line (r ≈ 0.99999 on their own) plus one outlier that pulls r down to 0.82.',
  },
  {
    name: 'IV',
    x: [8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8],
    y: [6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.5, 5.56, 7.91, 6.89],
    story: 'No relationship within x = 8. A single high-leverage point creates the whole correlation.',
  },
];
