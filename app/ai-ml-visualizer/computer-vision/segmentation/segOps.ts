/**
 * Classical segmentation algorithms used by the visualizer: Otsu thresholding,
 * k-means colour clustering, region growing, connected-component labelling and
 * mask metrics. Plain TypeScript on typed arrays; index = y * width + x.
 */

export interface SegImage {
  width: number;
  height: number;
  /** RGB, 3 bytes per pixel. */
  rgb: Uint8ClampedArray;
  /** Ground-truth class per pixel (0 = background), or null for uploaded images. */
  gtClass: Uint8Array | null;
  /** Ground-truth instance id per pixel (0 = background), or null for uploaded images. */
  gtInstance: Uint8Array | null;
}

export const GT_CLASS_NAMES = ['background', 'disc', 'rectangle', 'triangle'];

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function insideTriangle(px: number, py: number, a: number[], b: number[], c: number[]) {
  const d1 = (px - b[0]) * (a[1] - b[1]) - (a[0] - b[0]) * (py - b[1]);
  const d2 = (px - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (py - c[1]);
  const d3 = (px - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (py - a[1]);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}

/** Which object (if any) covers a point: [class, instance, colour]. */
function objectAt(x: number, y: number): [number, number, [number, number, number]] | null {
  if (Math.hypot(x - 40, y - 42) <= 22) return [1, 1, [210, 55, 60]];
  if (Math.hypot(x - 122, y - 86) <= 20) return [1, 2, [200, 62, 52]];
  if (x >= 84 && x <= 142 && y >= 14 && y <= 50) return [2, 3, [52, 92, 185]];
  if (insideTriangle(x, y, [14, 108], [72, 108], [43, 70])) return [3, 4, [228, 192, 64]];
  return null;
}

/**
 * 160×120 test image: two red discs (same class, two instances), a blue rectangle and a yellow
 * triangle on an unevenly lit background, with seeded noise. Ground truth comes from the geometry.
 */
export function makeScene(seed = 11): SegImage {
  const width = 160;
  const height = 120;
  const rgb = new Uint8ClampedArray(width * height * 3);
  const gtClass = new Uint8Array(width * height);
  const gtInstance = new Uint8Array(width * height);
  const rand = mulberry32(seed);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const light = 1.08 - 0.22 * (x / width) - 0.08 * (y / height); // uneven lighting
      const obj = objectAt(x + 0.5, y + 0.5);
      const base: [number, number, number] = obj ? obj[2] : [205, 212, 222];
      if (obj) {
        gtClass[i] = obj[0];
        gtInstance[i] = obj[1];
      }
      for (let c = 0; c < 3; c++) rgb[i * 3 + c] = base[c] * light + (rand() * 2 - 1) * 14;
    }
  }
  return { width, height, rgb, gtClass, gtInstance };
}

export function toGray(img: SegImage): Uint8Array {
  const out = new Uint8Array(img.width * img.height);
  for (let i = 0; i < out.length; i++) {
    out[i] = Math.round(0.299 * img.rgb[i * 3] + 0.587 * img.rgb[i * 3 + 1] + 0.114 * img.rgb[i * 3 + 2]);
  }
  return out;
}

export function histogram(gray: Uint8Array): number[] {
  const h = new Array<number>(256).fill(0);
  for (let i = 0; i < gray.length; i++) h[gray[i]]++;
  return h;
}

/**
 * Otsu's method: try every threshold t (class 0 = values ≤ t, class 1 = values > t) and pick the one
 * that maximises the between-class variance w0·w1·(μ0 − μ1)².
 */
export function otsu(hist: number[]): { threshold: number; between: number[] } {
  const total = hist.reduce((a, b) => a + b, 0);
  let sumAll = 0;
  for (let v = 0; v < 256; v++) sumAll += v * hist[v];
  let w0 = 0;
  let sum0 = 0;
  let best = 0;
  let threshold = 0;
  const between: number[] = [];
  for (let t = 0; t < 256; t++) {
    w0 += hist[t];
    sum0 += t * hist[t];
    const w1 = total - w0;
    if (w0 === 0 || w1 === 0) {
      between.push(0);
      continue;
    }
    const mu0 = sum0 / w0;
    const mu1 = (sumAll - sum0) / w1;
    const v = (w0 / total) * (w1 / total) * (mu0 - mu1) ** 2;
    between.push(v);
    if (v > best) {
      best = v;
      threshold = t;
    }
  }
  return { threshold, between };
}

export function thresholdMask(gray: Uint8Array, t: number, darkIsForeground: boolean): Uint8Array {
  const out = new Uint8Array(gray.length);
  for (let i = 0; i < gray.length; i++) out[i] = darkIsForeground ? (gray[i] <= t ? 1 : 0) : gray[i] > t ? 1 : 0;
  return out;
}

/* ---------- k-means ---------- */

export type Color = [number, number, number];

function dist2(rgb: Uint8ClampedArray, i: number, c: Color) {
  const dr = rgb[i * 3] - c[0];
  const dg = rgb[i * 3 + 1] - c[1];
  const db = rgb[i * 3 + 2] - c[2];
  return dr * dr + dg * dg + db * db;
}

/** k-means++ start: first centre at random, each next one far from the centres chosen so far. */
export function initCentroids(img: SegImage, k: number, seed: number): Color[] {
  const rand = mulberry32(seed);
  const n = img.width * img.height;
  const sample: number[] = [];
  for (let i = 0; i < n; i += 5) sample.push(i);
  const pick = (i: number): Color => [img.rgb[i * 3], img.rgb[i * 3 + 1], img.rgb[i * 3 + 2]];
  const centroids: Color[] = [pick(sample[Math.floor(rand() * sample.length)])];
  while (centroids.length < k) {
    const d = sample.map((i) => Math.min(...centroids.map((c) => dist2(img.rgb, i, c))));
    const total = d.reduce((a, b) => a + b, 0);
    let r = rand() * total;
    let chosen = sample[sample.length - 1];
    for (let s = 0; s < sample.length; s++) {
      r -= d[s];
      if (r <= 0) {
        chosen = sample[s];
        break;
      }
    }
    centroids.push(pick(chosen));
  }
  return centroids;
}

/** Assignment step: every pixel joins its nearest centre (in RGB space). */
export function assign(img: SegImage, centroids: Color[]): Uint8Array {
  const labels = new Uint8Array(img.width * img.height);
  for (let i = 0; i < labels.length; i++) {
    let best = 0;
    let bestD = Infinity;
    for (let c = 0; c < centroids.length; c++) {
      const d = dist2(img.rgb, i, centroids[c]);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    labels[i] = best;
  }
  return labels;
}

/** Update step: every centre moves to the mean colour of its pixels. Returns the new centres and how far they moved. */
export function update(img: SegImage, labels: Uint8Array, old: Color[]): { centroids: Color[]; shift: number } {
  const k = old.length;
  const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
  for (let i = 0; i < labels.length; i++) {
    const s = sums[labels[i]];
    s[0] += img.rgb[i * 3];
    s[1] += img.rgb[i * 3 + 1];
    s[2] += img.rgb[i * 3 + 2];
    s[3]++;
  }
  let shift = 0;
  const centroids = sums.map((s, c): Color => {
    if (s[3] === 0) return old[c]; // empty cluster keeps its centre
    const next: Color = [s[0] / s[3], s[1] / s[3], s[2] / s[3]];
    shift = Math.max(shift, Math.hypot(next[0] - old[c][0], next[1] - old[c][1], next[2] - old[c][2]));
    return next;
  });
  return { centroids, shift };
}

/* ---------- region growing ---------- */

/**
 * Breadth-first growth from a seed: a 4-connected neighbour joins if its colour is within `tolerance`
 * (Euclidean RGB distance) of the seed colour. Returns pixel indices in the order they joined.
 */
export function regionGrow(img: SegImage, seedX: number, seedY: number, tolerance: number): Int32Array {
  const { width, height, rgb } = img;
  const seedIdx = seedY * width + seedX;
  const seedColor: Color = [rgb[seedIdx * 3], rgb[seedIdx * 3 + 1], rgb[seedIdx * 3 + 2]];
  const tol2 = tolerance * tolerance;
  const visited = new Uint8Array(width * height);
  const order = new Int32Array(width * height);
  let head = 0;
  let tail = 0;
  order[tail++] = seedIdx;
  visited[seedIdx] = 1;
  while (head < tail) {
    const i = order[head++];
    const x = i % width;
    const y = (i - x) / width;
    const neighbours = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    for (const [nx, ny] of neighbours) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const j = ny * width + nx;
      if (visited[j]) continue;
      visited[j] = 1;
      if (dist2(rgb, j, seedColor) <= tol2) order[tail++] = j;
    }
  }
  return order.slice(0, tail);
}

/* ---------- connected components ---------- */

/**
 * Splits a class map into instances: pixels with the same (non-zero) class that touch (4-connectivity)
 * get the same instance id. Components smaller than `minSize` are treated as noise and dropped.
 */
export function connectedComponents(classes: Uint8Array, width: number, height: number, minSize: number) {
  const ids = new Int32Array(classes.length);
  let count = 0;
  const stack: number[] = [];
  const members: number[] = [];
  for (let start = 0; start < classes.length; start++) {
    if (classes[start] === 0 || ids[start] !== 0) continue;
    const cls = classes[start];
    const id = count + 1;
    members.length = 0;
    stack.push(start);
    ids[start] = id;
    while (stack.length) {
      const i = stack.pop()!;
      members.push(i);
      const x = i % width;
      const y = (i - x) / width;
      const neighbours = [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, y > 0 ? i - width : -1, y < height - 1 ? i + width : -1];
      for (const j of neighbours) {
        if (j >= 0 && ids[j] === 0 && classes[j] === cls) {
          ids[j] = id;
          stack.push(j);
        }
      }
    }
    if (members.length < minSize) {
      for (const m of members) ids[m] = -1; // too small: noise
    } else {
      count++;
    }
  }
  for (let i = 0; i < ids.length; i++) if (ids[i] < 0) ids[i] = 0;
  return { ids, count };
}

/* ---------- metrics ---------- */

export function maskMetrics(pred: Uint8Array, truth: Uint8Array) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  for (let i = 0; i < pred.length; i++) {
    const p = pred[i] > 0;
    const t = truth[i] > 0;
    if (p && t) tp++;
    else if (p) fp++;
    else if (t) fn++;
  }
  const iou = tp + fp + fn ? tp / (tp + fp + fn) : 1;
  const dice = 2 * tp + fp + fn ? (2 * tp) / (2 * tp + fp + fn) : 1;
  return { tp, fp, fn, iou, dice };
}

/* ---------- colours ---------- */

export const PALETTE: Color[] = [
  [236, 72, 153],
  [59, 130, 246],
  [234, 179, 8],
  [16, 185, 129],
  [168, 85, 247],
  [249, 115, 22],
  [20, 184, 166],
  [239, 68, 68],
  [132, 204, 22],
  [99, 102, 241],
  [14, 165, 233],
  [217, 70, 239],
];

export function paletteColor(i: number): Color {
  return PALETTE[(i - 1 + PALETTE.length * 10) % PALETTE.length];
}

/** Reads a user's image file locally (nothing is uploaded), fitted inside maxW×maxH. */
export function loadImageFile(file: File, maxW: number, maxH: number): Promise<SegImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const width = Math.max(8, Math.round(img.width * scale));
      const height = Math.max(8, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      URL.revokeObjectURL(url);
      if (!ctx) {
        reject(new Error('Canvas not available'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const rgba = ctx.getImageData(0, 0, width, height).data;
      const rgb = new Uint8ClampedArray(width * height * 3);
      for (let i = 0; i < width * height; i++) {
        rgb[i * 3] = rgba[i * 4];
        rgb[i * 3 + 1] = rgba[i * 4 + 1];
        rgb[i * 3 + 2] = rgba[i * 4 + 2];
      }
      resolve({ width, height, rgb, gtClass: null, gtInstance: null });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image'));
    };
    img.src = url;
  });
}
