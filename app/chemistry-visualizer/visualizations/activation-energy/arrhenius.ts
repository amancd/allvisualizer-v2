import { R } from '../_kinetics/format';

export const PRE_EXPONENTIAL = 1e13;
export const E_MIN = -160;
export const E_MAX = 220;
export const EA_MAX = 200;
export const DH_LIMIT = 150;

export type Knot = [number, number];

export function rateConstant(eaKJ: number, T: number, A = PRE_EXPONENTIAL): number {
  return A * Math.exp((-eaKJ * 1000) / (R * T));
}

export function lnRateConstant(eaKJ: number, T: number, A = PRE_EXPONENTIAL): number {
  return Math.log(A) - (eaKJ * 1000) / (R * T);
}

export function rateRatio(eaKJ: number, T1: number, T2: number): number {
  return Math.exp(((eaKJ * 1000) / R) * (1 / T1 - 1 / T2));
}

export function minEa(dh: number): number {
  return Math.max(dh, 0) + 5;
}

export function catalysedBounds(ea: number, dh: number): [number, number] {
  return [Math.max(dh, 0) + 2, ea];
}

export function uncatalysedKnots(ea: number, dh: number): Knot[] {
  return [
    [0, 0],
    [0.15, 0],
    [0.5, ea],
    [0.85, dh],
    [1, dh],
  ];
}

export function catalysedKnots(eaCat: number, dh: number): Knot[] {
  const base = Math.min(0, dh);
  const intermediate = base + 0.4 * (eaCat - base);
  const floor = Math.max(intermediate, dh);
  const secondPeak = floor + 0.75 * (eaCat - floor);
  return [
    [0, 0],
    [0.15, 0],
    [0.35, eaCat],
    [0.5, intermediate],
    [0.65, secondPeak],
    [0.85, dh],
    [1, dh],
  ];
}

export function profile(knots: Knot[], samples = 200): Knot[] {
  const pts: Knot[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = i / samples;
    let s = 0;
    while (s < knots.length - 2 && x > knots[s + 1][0]) s++;
    const [x0, e0] = knots[s];
    const [x1, e1] = knots[s + 1];
    const u = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
    pts.push([x, e0 + ((e1 - e0) * (1 - Math.cos(Math.PI * u))) / 2]);
  }
  return pts;
}
