export const R = 8.314;

const SUPERSCRIPTS: Record<string, string> = {
  '-': '⁻',
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

export function superscript(n: number): string {
  return String(n)
    .split('')
    .map((c) => SUPERSCRIPTS[c] ?? c)
    .join('');
}

export function sci(x: number, digits = 3): string {
  if (!Number.isFinite(x)) return '–';
  if (x === 0) return '0';
  let exponent = Math.floor(Math.log10(Math.abs(x)));
  if (exponent >= -2 && exponent < 4) return String(Number(x.toPrecision(digits)));
  let mantissa = (x / 10 ** exponent).toFixed(digits - 1);
  if (Math.abs(Number(mantissa)) >= 10) {
    exponent += 1;
    mantissa = (x / 10 ** exponent).toFixed(digits - 1);
  }
  return `${mantissa} × 10${superscript(exponent)}`;
}

export function fixed(x: number, digits = 2): string {
  if (!Number.isFinite(x)) return '–';
  return x.toFixed(digits);
}

export function niceStep(span: number, count: number): number {
  const raw = span / Math.max(1, count);
  const power = 10 ** Math.floor(Math.log10(raw));
  const scaled = raw / power;
  const nice = scaled < 1.5 ? 1 : scaled < 3 ? 2 : scaled < 7 ? 5 : 10;
  return nice * power;
}

export function niceTicks(min: number, max: number, count = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return [min];
  const step = niceStep(max - min, count);
  const ticks: number[] = [];
  const start = Math.ceil(min / step - 1e-9) * step;
  for (let v = start; v <= max + step * 1e-9; v += step) ticks.push(Number(v.toPrecision(12)));
  return ticks;
}

export function tickLabel(v: number): string {
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1e4 || a < 1e-3) return v.toExponential(0).replace('e+', 'e');
  return String(Number(v.toPrecision(4)));
}

export function linearFit(points: [number, number][]) {
  const n = points.length;
  const mx = points.reduce((s, p) => s + p[0], 0) / n;
  const my = points.reduce((s, p) => s + p[1], 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (const [x, y] of points) {
    sxx += (x - mx) ** 2;
    sxy += (x - mx) * (y - my);
    syy += (y - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
  return { slope, intercept, r2 };
}
