/**
 * Shared helpers for the classical-ML visualizers (K-Means, KNN, Decision Trees):
 * a seeded random generator, 2D toy datasets in the unit square, a train/test split
 * and the mapping between data space [0, 1]² and canvas pixels.
 *
 * Everything is deterministic for a given seed, so the server render and the
 * client render produce the same points (no hydration mismatch).
 */

export interface LabeledPoint {
  x: number;
  y: number;
  /** Class index (0, 1, 2). Unlabelled datasets use 0. */
  label: number;
}

/* ------------------------------------------------------------------ */
/* Random numbers                                                      */
/* ------------------------------------------------------------------ */

/** Mulberry32: a tiny, fast seeded PRNG returning numbers in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal sample (Box-Muller). */
export function gaussian(rng: () => number): number {
  let u = 0;
  while (u === 0) u = rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const clampUnit = (v: number) => Math.min(0.98, Math.max(0.02, v));

/* ------------------------------------------------------------------ */
/* Datasets (all inside the unit square)                               */
/* ------------------------------------------------------------------ */

export interface BlobSpec {
  x: number;
  y: number;
  /** Standard deviation of the blob. */
  sd: number;
  n: number;
  label?: number;
}

/** Gaussian blobs around the given centres. */
export function makeBlobs(seed: number, specs: BlobSpec[]): LabeledPoint[] {
  const rng = mulberry32(seed);
  const points: LabeledPoint[] = [];
  specs.forEach((s, i) => {
    for (let j = 0; j < s.n; j++) {
      points.push({
        x: clampUnit(s.x + s.sd * gaussian(rng)),
        y: clampUnit(s.y + s.sd * gaussian(rng)),
        label: s.label ?? i,
      });
    }
  });
  return points;
}

/** Two interleaving half circles ("moons"), labels 0 and 1. `noise` is in data units. */
export function makeMoons(seed: number, n: number, noise: number): LabeledPoint[] {
  const rng = mulberry32(seed);
  const points: LabeledPoint[] = [];
  for (let i = 0; i < n; i++) {
    const label = i % 2;
    const t = rng() * Math.PI;
    // Classic moons live in x ∈ [-1, 2], y ∈ [-0.5, 1]; rescale into the unit square.
    const mx = label === 0 ? Math.cos(t) : 1 - Math.cos(t);
    const my = label === 0 ? Math.sin(t) : 0.5 - Math.sin(t);
    points.push({
      x: clampUnit(0.08 + ((mx + 1) / 3) * 0.84 + noise * gaussian(rng)),
      y: clampUnit(0.2 + ((my + 0.5) / 1.5) * 0.6 + noise * gaussian(rng)),
      label,
    });
  }
  return points;
}

/** A disc (label 1) inside a ring (label 0). */
export function makeCircles(seed: number, n: number, noise: number): LabeledPoint[] {
  const rng = mulberry32(seed);
  const points: LabeledPoint[] = [];
  for (let i = 0; i < n; i++) {
    const label = i % 2;
    const r = label === 1 ? 0.15 : 0.36;
    const a = rng() * Math.PI * 2;
    points.push({
      x: clampUnit(0.5 + r * Math.cos(a) + noise * gaussian(rng)),
      y: clampUnit(0.5 + r * Math.sin(a) + noise * gaussian(rng)),
      label,
    });
  }
  return points;
}

/** Four blobs in a checkerboard: opposite corners share a class. */
export function makeXor(seed: number, perQuadrant: number, sd: number): LabeledPoint[] {
  return makeBlobs(seed, [
    { x: 0.27, y: 0.27, sd, n: perQuadrant, label: 0 },
    { x: 0.73, y: 0.73, sd, n: perQuadrant, label: 0 },
    { x: 0.27, y: 0.73, sd, n: perQuadrant, label: 1 },
    { x: 0.73, y: 0.27, sd, n: perQuadrant, label: 1 },
  ]);
}

/** Points spread uniformly over the square (no structure at all). */
export function makeUniform(seed: number, n: number): LabeledPoint[] {
  const rng = mulberry32(seed);
  return Array.from({ length: n }, () => ({ x: clampUnit(rng()), y: clampUnit(rng()), label: 0 }));
}

/** Flip the label of a random `fraction` of points to a different class (label noise). */
export function flipLabels(points: LabeledPoint[], fraction: number, classes: number, seed: number): LabeledPoint[] {
  const rng = mulberry32(seed);
  return points.map((p) => {
    if (rng() >= fraction) return p;
    const shift = 1 + Math.floor(rng() * (classes - 1));
    return { ...p, label: (p.label + shift) % classes };
  });
}

/** Returns a flag per point: true when the point belongs to the held-out test set. */
export function testMask(n: number, testFraction: number, seed: number): boolean[] {
  const rng = mulberry32(seed);
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const mask = new Array<boolean>(n).fill(false);
  const nTest = Math.round(n * testFraction);
  for (let i = 0; i < nTest; i++) mask[order[i]] = true;
  return mask;
}

/* ------------------------------------------------------------------ */
/* Colours                                                             */
/* ------------------------------------------------------------------ */

export type RGB = [number, number, number];

export const CLASS_COLORS = ['#2563eb', '#ea580c', '#059669'];
export const CLASS_RGB: RGB[] = [
  [37, 99, 235],
  [234, 88, 12],
  [5, 150, 105],
];
export const CLASS_NAMES = ['Blue', 'Orange', 'Green'];

export const CLUSTER_COLORS = ['#2563eb', '#ea580c', '#059669', '#9333ea', '#db2777', '#0891b2', '#ca8a04', '#4b5563'];
export const CLUSTER_RGB: RGB[] = CLUSTER_COLORS.map((hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
]);

export const rgba = ([r, g, b]: RGB, a: number) => `rgba(${r}, ${g}, ${b}, ${a})`;

/* ------------------------------------------------------------------ */
/* Plane: data space [0, 1]² drawn on a fixed-size square canvas     */
/* ------------------------------------------------------------------ */

export const PLANE_W = 560;
export const PLANE_H = 560;
const MARGIN = 12;

export const toCanvasX = (x: number) => MARGIN + x * (PLANE_W - 2 * MARGIN);
export const toCanvasY = (y: number) => MARGIN + (1 - y) * (PLANE_H - 2 * MARGIN);
export const fromCanvasX = (px: number) => (px - MARGIN) / (PLANE_W - 2 * MARGIN);
export const fromCanvasY = (py: number) => 1 - (py - MARGIN) / (PLANE_H - 2 * MARGIN);

/** Convert canvas pixels to data coordinates, or null if the pixel is outside the unit square. */
export function canvasToData(px: number, py: number): { x: number; y: number } | null {
  const x = fromCanvasX(px);
  const y = fromCanvasY(py);
  if (x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x, y };
}

/** Light grid and border for the plane. */
export function drawPlaneFrame(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#eef0f3';
  ctx.lineWidth = 1;
  for (let i = 1; i < 10; i++) {
    const t = i / 10;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(t), toCanvasY(0));
    ctx.lineTo(toCanvasX(t), toCanvasY(1));
    ctx.moveTo(toCanvasX(0), toCanvasY(t));
    ctx.lineTo(toCanvasX(1), toCanvasY(t));
    ctx.stroke();
  }
}

export function drawPlaneBorder(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(toCanvasX(0), toCanvasY(1), toCanvasX(1) - toCanvasX(0), toCanvasY(0) - toCanvasY(1));
}
