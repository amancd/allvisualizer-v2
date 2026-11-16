export function lensArea(r1: number, r2: number, d: number): number {
  if (r1 <= 0 || r2 <= 0 || d >= r1 + r2) return 0;
  if (d <= Math.abs(r1 - r2)) return Math.PI * Math.min(r1, r2) ** 2;
  const a1 = r1 * r1 * Math.acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1));
  const a2 = r2 * r2 * Math.acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2));
  const k = Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2));
  return a1 + a2 - k / 2;
}

export function centerDistance(r1: number, r2: number, overlap: number): number {
  if (r1 <= 0 || r2 <= 0) return r1 + r2;
  let lo = Math.abs(r1 - r2);
  let hi = r1 + r2;
  if (overlap <= 0) return hi;
  if (overlap >= Math.PI * Math.min(r1, r2) ** 2) return lo;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (lensArea(r1, r2, mid) > overlap) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export interface VennLayout {
  ax: number;
  bx: number;
  ra: number;
  rb: number;
}

export function vennLayout(a: number, b: number, ab: number, rMax: number, centerX: number, gap: number): VennLayout {
  const ra = rMax * Math.sqrt(a);
  const rb = rMax * Math.sqrt(b);
  const d = centerDistance(ra, rb, ab * Math.PI * rMax * rMax) + (ab <= 0 && ra > 0 && rb > 0 ? gap : 0);
  const left = Math.min(-ra, d - rb);
  const right = Math.max(ra, d + rb);
  const ax = centerX - (left + right) / 2;
  return { ax, bx: ax + d, ra, rb };
}

export function clampOverlap(ab: number, a: number, b: number): number {
  return Math.min(Math.min(a, b), Math.max(Math.max(0, a + b - 100), ab));
}
