export interface TestInputs {
  prior: number;
  sensitivity: number;
  specificity: number;
}

const div = (num: number, den: number) => (den > 0 ? num / den : NaN);

export function posterior({ prior, sensitivity, specificity }: TestInputs) {
  const truePos = sensitivity * prior;
  const falsePos = (1 - specificity) * (1 - prior);
  const trueNeg = specificity * (1 - prior);
  const falseNeg = (1 - sensitivity) * prior;
  return {
    pPositive: truePos + falsePos,
    ppv: div(truePos, truePos + falsePos),
    npv: div(trueNeg, trueNeg + falseNeg),
    diseaseGivenNegative: div(falseNeg, trueNeg + falseNeg),
    likelihoodRatio: div(sensitivity, 1 - specificity),
  };
}

export function naturalFrequencies({ prior, sensitivity, specificity }: TestInputs, total: number) {
  const sick = Math.round(total * prior);
  const healthy = total - sick;
  const tp = Math.round(sick * sensitivity);
  const tn = Math.round(healthy * specificity);
  return { total, sick, healthy, tp, fn: sick - tp, tn, fp: healthy - tn };
}

export const fmtPct = (x: number, digits = 1) => (Number.isFinite(x) ? `${(x * 100).toFixed(digits)}%` : '–');
