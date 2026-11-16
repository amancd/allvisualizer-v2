export const KW = 1.0e-14;

export interface SolutionMix {
  strongAcid?: number;
  strongBase?: number;
  weakAcid?: number;
  ka?: number;
  weakBase?: number;
  kb?: number;
}

export interface Speciation {
  h: number;
  oh: number;
  pH: number;
  pOH: number;
  conjugateBase: number;
  conjugateAcid: number;
}

function chargeImbalance(h: number, mix: SolutionMix): number {
  const { strongAcid = 0, strongBase = 0, weakAcid = 0, ka = 1, weakBase = 0, kb = 1 } = mix;
  const kaOfConjugateAcid = KW / kb;
  const aMinus = weakAcid > 0 ? (weakAcid * ka) / (ka + h) : 0;
  const bhPlus = weakBase > 0 ? (weakBase * h) / (h + kaOfConjugateAcid) : 0;
  return h + strongBase + bhPlus - strongAcid - aMinus - KW / h;
}

export function solveH(mix: SolutionMix): number {
  let lo = -16;
  let hi = 2;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (chargeImbalance(10 ** mid, mix) > 0) hi = mid;
    else lo = mid;
    if (hi - lo < 1e-12) break;
  }
  return 10 ** ((lo + hi) / 2);
}

export function speciate(mix: SolutionMix): Speciation {
  const h = solveH(mix);
  const oh = KW / h;
  const { weakAcid = 0, ka = 1, weakBase = 0, kb = 1 } = mix;
  return {
    h,
    oh,
    pH: -Math.log10(h),
    pOH: -Math.log10(oh),
    conjugateBase: weakAcid > 0 ? (weakAcid * ka) / (ka + h) : 0,
    conjugateAcid: weakBase > 0 ? (weakBase * h) / (h + KW / kb) : 0,
  };
}

export function formatSci(x: number, digits = 2): string {
  if (x === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(x)));
  if (exp >= -2 && exp <= 3) return x.toFixed(Math.max(0, digits - exp));
  const mantissa = x / 10 ** exp;
  const sup = String(exp)
    .split('')
    .map((ch) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(ch)])
    .join('');
  return `${mantissa.toFixed(digits)} × 10${sup}`;
}
