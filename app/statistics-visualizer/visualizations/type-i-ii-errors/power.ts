import { normalCdf, normalInv } from '../_inference/stats';

export type Sides = 'one' | 'two';

export const MU0 = 100;

export function criticalZ(alpha: number, sides: Sides) {
  return normalInv(1 - (sides === 'two' ? alpha / 2 : alpha));
}

export function power(delta: number, sigma: number, n: number, alpha: number, sides: Sides) {
  const shift = delta / (sigma / Math.sqrt(n));
  const z = criticalZ(alpha, sides);
  const upper = 1 - normalCdf(z - shift);
  return sides === 'two' ? upper + normalCdf(-z - shift) : upper;
}

export function requiredN(delta: number, sigma: number, alpha: number, sides: Sides, target: number) {
  if (delta <= 0) return null;
  const raw = (((criticalZ(alpha, sides) + normalInv(target)) * sigma) / delta) ** 2;
  let n = Math.max(1, Math.ceil(raw - 1e-9));
  while (n > 1 && power(delta, sigma, n - 1, alpha, sides) >= target) n--;
  return { raw, n };
}
