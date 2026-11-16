import { invertCdf, logBeta, logGamma, niceStep, normalCdf, normalQuantile, regularizedBeta, regularizedGammaP } from '../_distributions/math';

export type Params = Record<string, number>;

export interface ParamSpec {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  initial: number;
}

export interface Distribution {
  key: DistributionKey;
  label: string;
  params: ParamSpec[];
  pdfFormula: string;
  cdfFormula: string;
  range: (ps: Params) => [number, number];
  unbounded: (ps: Params) => boolean;
  pdf: (x: number, ps: Params) => number;
  cdf: (x: number, ps: Params) => number;
  quantile: (p: number, ps: Params) => number;
  mean: (ps: Params) => number;
  variance: (ps: Params) => number;
  normalize?: (ps: Params, changed: string) => Params;
}

export type DistributionKey = 'uniform' | 'exponential' | 'normal' | 'beta' | 'gamma';

function niceCeil(v: number) {
  const step = niceStep(v, 5);
  return Math.ceil(v / step) * step;
}

const uniform: Distribution = {
  key: 'uniform',
  label: 'Uniform',
  params: [
    { key: 'a', label: 'Lower bound a', min: -5, max: 5, step: 0.1, initial: -2 },
    { key: 'b', label: 'Upper bound b', min: -5, max: 5, step: 0.1, initial: 3 },
  ],
  pdfFormula: 'f(x) = 1 / (b − a) for a ≤ x ≤ b, else 0',
  cdfFormula: 'F(x) = (x − a) / (b − a) for a ≤ x ≤ b',
  range: () => [-6, 6],
  unbounded: () => false,
  pdf: (x, { a, b }) => (x >= a && x <= b ? 1 / (b - a) : 0),
  cdf: (x, { a, b }) => (x <= a ? 0 : x >= b ? 1 : (x - a) / (b - a)),
  quantile: (p, { a, b }) => a + p * (b - a),
  mean: ({ a, b }) => (a + b) / 2,
  variance: ({ a, b }) => (b - a) ** 2 / 12,
  normalize: (ps, changed) => {
    const gap = 0.2;
    let { a, b } = ps;
    if (b - a < gap) {
      if (changed === 'a') b = Math.min(5, a + gap);
      else a = Math.max(-5, b - gap);
      if (b - a < gap) {
        if (changed === 'a') a = b - gap;
        else b = a + gap;
      }
    }
    return { a: Math.round(a * 10) / 10, b: Math.round(b * 10) / 10 };
  },
};

const exponential: Distribution = {
  key: 'exponential',
  label: 'Exponential',
  params: [{ key: 'rate', label: 'Rate λ', min: 0.2, max: 3, step: 0.05, initial: 1 }],
  pdfFormula: 'f(x) = λ e^(−λx) for x ≥ 0',
  cdfFormula: 'F(x) = 1 − e^(−λx) for x ≥ 0',
  range: ({ rate }) => [0, Math.max(4, niceCeil(Math.log(200) / rate))],
  unbounded: () => false,
  pdf: (x, { rate }) => (x < 0 ? 0 : rate * Math.exp(-rate * x)),
  cdf: (x, { rate }) => (x <= 0 ? 0 : -Math.expm1(-rate * x)),
  quantile: (p, { rate }) => -Math.log1p(-p) / rate,
  mean: ({ rate }) => 1 / rate,
  variance: ({ rate }) => 1 / rate ** 2,
};

const normal: Distribution = {
  key: 'normal',
  label: 'Normal',
  params: [
    { key: 'mu', label: 'Mean μ', min: -5, max: 5, step: 0.1, initial: 0 },
    { key: 'sigma', label: 'Std. dev. σ', min: 0.3, max: 3, step: 0.05, initial: 1.5 },
  ],
  pdfFormula: 'f(x) = e^(−(x − μ)² / (2σ²)) / (σ√(2π))',
  cdfFormula: 'F(x) = Φ((x − μ) / σ) = ½[1 + erf((x − μ) / (σ√2))]',
  range: () => [-10, 10],
  unbounded: () => false,
  pdf: (x, { mu, sigma }) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI)),
  cdf: (x, { mu, sigma }) => normalCdf((x - mu) / sigma),
  quantile: (p, { mu, sigma }) => normalQuantile(p, mu, sigma),
  mean: ({ mu }) => mu,
  variance: ({ sigma }) => sigma ** 2,
};

const beta: Distribution = {
  key: 'beta',
  label: 'Beta',
  params: [
    { key: 'alpha', label: 'Shape α', min: 0.5, max: 10, step: 0.1, initial: 2 },
    { key: 'beta', label: 'Shape β', min: 0.5, max: 10, step: 0.1, initial: 5 },
  ],
  pdfFormula: 'f(x) = x^(α−1) (1 − x)^(β−1) / B(α, β) for 0 < x < 1',
  cdfFormula: 'F(x) = I_x(α, β), the regularized incomplete beta function',
  range: () => [0, 1],
  unbounded: ({ alpha, beta: b }) => alpha < 1 || b < 1,
  pdf: (x, { alpha, beta: b }) => {
    if (x < 0 || x > 1) return 0;
    if (x === 0) return alpha < 1 ? Infinity : alpha === 1 ? b : 0;
    if (x === 1) return b < 1 ? Infinity : b === 1 ? alpha : 0;
    return Math.exp((alpha - 1) * Math.log(x) + (b - 1) * Math.log1p(-x) - logBeta(alpha, b));
  },
  cdf: (x, { alpha, beta: b }) => regularizedBeta(x, alpha, b),
  quantile: (p, ps) => invertCdf((x) => regularizedBeta(x, ps.alpha, ps.beta), p, 0, 1),
  mean: ({ alpha, beta: b }) => alpha / (alpha + b),
  variance: ({ alpha, beta: b }) => (alpha * b) / ((alpha + b) ** 2 * (alpha + b + 1)),
};

const gammaQuantile = (p: number, { shape, scale }: Params) => {
  let hi = shape * scale + 10 * Math.sqrt(shape) * scale + 10 * scale;
  while (regularizedGammaP(shape, hi / scale) < p) hi *= 2;
  return invertCdf((x) => regularizedGammaP(shape, x / scale), p, 0, hi);
};

const gamma: Distribution = {
  key: 'gamma',
  label: 'Gamma',
  params: [
    { key: 'shape', label: 'Shape k', min: 0.5, max: 10, step: 0.1, initial: 2 },
    { key: 'scale', label: 'Scale θ', min: 0.5, max: 3, step: 0.05, initial: 1 },
  ],
  pdfFormula: 'f(x) = x^(k−1) e^(−x/θ) / (Γ(k) θ^k) for x > 0',
  cdfFormula: 'F(x) = P(k, x/θ), the regularized lower incomplete gamma function',
  range: (ps) => [0, Math.max(4, niceCeil(gammaQuantile(0.995, ps)))],
  unbounded: ({ shape }) => shape < 1,
  pdf: (x, { shape, scale }) => {
    if (x < 0) return 0;
    if (x === 0) return shape < 1 ? Infinity : shape === 1 ? 1 / scale : 0;
    return Math.exp((shape - 1) * Math.log(x) - x / scale - logGamma(shape) - shape * Math.log(scale));
  },
  cdf: (x, { shape, scale }) => regularizedGammaP(shape, Math.max(0, x) / scale),
  quantile: gammaQuantile,
  mean: ({ shape, scale }) => shape * scale,
  variance: ({ shape, scale }) => shape * scale ** 2,
};

export const DISTRIBUTIONS: Record<DistributionKey, Distribution> = { uniform, exponential, normal, beta, gamma };

export const DISTRIBUTION_KEYS: DistributionKey[] = ['uniform', 'exponential', 'normal', 'beta', 'gamma'];

export function initialParams(d: Distribution): Params {
  return Object.fromEntries(d.params.map((p) => [p.key, p.initial]));
}
