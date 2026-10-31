/**
 * Edge detection algorithms used by the visualizer. Everything here is plain
 * TypeScript on Float32Arrays so it can be read top to bottom.
 *
 * Images are grayscale, values 0..255, stored row by row: index = y * width + x.
 * Borders are handled by clamping (the nearest edge pixel is repeated).
 */

export interface Gray {
  width: number;
  height: number;
  data: Float32Array;
}

export type Kernel3 = number[][];

export const OPERATORS = {
  sobel: {
    name: 'Sobel',
    kx: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
    ky: [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ],
  },
  prewitt: {
    name: 'Prewitt',
    kx: [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1],
    ],
    ky: [
      [-1, -1, -1],
      [0, 0, 0],
      [1, 1, 1],
    ],
  },
} satisfies Record<string, { name: string; kx: Kernel3; ky: Kernel3 }>;

export const LAPLACIAN: Kernel3 = [
  [0, 1, 0],
  [1, -4, 1],
  [0, 1, 0],
];

/** Small deterministic PRNG so the synthetic image is identical on server and client. */
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
  const neg = d1 < 0 || d2 < 0 || d3 < 0;
  const pos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(neg && pos);
}

function distanceToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

/** Brightness of the synthetic scene at a sub-pixel position. Later shapes are drawn on top. */
function sceneValue(x: number, y: number) {
  let v = 70 + (x / 160) * 40 + (y / 120) * 10; // soft background gradient
  if (Math.hypot(x - 45, y - 45) <= 26) v = 225; // bright disc
  if (x >= 92 && x <= 146 && y >= 16 && y <= 58) v = 165; // grey rectangle
  if (insideTriangle(x, y, [86, 108], [152, 108], [119, 70])) v = 25; // dark triangle
  if (distanceToSegment(x, y, 8, 112, 72, 80) <= 1.2) v = 200; // thin bright line
  return v;
}

/** 160×120 test image: a disc, a rectangle, a triangle and a thin line, plus optional noise. */
export function makeSyntheticImage(noise: number, seed = 7): Gray {
  const width = 160;
  const height = 120;
  const data = new Float32Array(width * height);
  const rand = mulberry32(seed);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 2×2 supersampling gives anti-aliased shape borders, like a real photo.
      let sum = 0;
      for (const oy of [0.25, 0.75]) for (const ox of [0.25, 0.75]) sum += sceneValue(x + ox, y + oy);
      const n = (rand() * 2 - 1) * noise;
      data[y * width + x] = Math.max(0, Math.min(255, sum / 4 + n));
    }
  }
  return { width, height, data };
}

export function at(img: Gray, x: number, y: number) {
  const cx = Math.min(Math.max(x, 0), img.width - 1);
  const cy = Math.min(Math.max(y, 0), img.height - 1);
  return img.data[cy * img.width + cx];
}

/** Slides a 3×3 kernel over the image (cross-correlation, as most libraries implement "convolution"). */
export function filter3(img: Gray, k: Kernel3): Float32Array {
  const out = new Float32Array(img.width * img.height);
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let s = 0;
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) s += k[j + 1][i + 1] * at(img, x + i, y + j);
      out[y * img.width + x] = s;
    }
  }
  return out;
}

export interface Gradient {
  gx: Float32Array;
  gy: Float32Array;
  mag: Float32Array;
}

export function gradient(img: Gray, kx: Kernel3, ky: Kernel3): Gradient {
  const gx = filter3(img, kx);
  const gy = filter3(img, ky);
  const mag = new Float32Array(gx.length);
  for (let i = 0; i < gx.length; i++) mag[i] = Math.hypot(gx[i], gy[i]);
  return { gx, gy, mag };
}

/** 1-D Gaussian weights covering ±3σ, normalised to sum to 1. */
export function gaussianKernel(sigma: number): number[] {
  const radius = Math.max(1, Math.ceil(3 * sigma));
  const w: number[] = [];
  let sum = 0;
  for (let i = -radius; i <= radius; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma));
    w.push(v);
    sum += v;
  }
  return w.map((v) => v / sum);
}

/** Gaussian blur done as two 1-D passes (horizontal then vertical), which is equivalent and faster. */
export function gaussianBlur(img: Gray, sigma: number): Gray {
  const w = gaussianKernel(sigma);
  const r = (w.length - 1) / 2;
  const { width, height } = img;
  const tmp = new Float32Array(width * height);
  const out = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let s = 0;
      for (let i = -r; i <= r; i++) s += w[i + r] * at(img, x + i, y);
      tmp[y * width + x] = s;
    }
  }
  const mid: Gray = { width, height, data: tmp };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let s = 0;
      for (let i = -r; i <= r; i++) s += w[i + r] * at(mid, x, y + i);
      out[y * width + x] = s;
    }
  }
  return { width, height, data: out };
}

/** Gradient direction rounded to one of four sectors (degrees, 0..180). */
export function sectorOf(gx: number, gy: number): 0 | 45 | 90 | 135 {
  let a = (Math.atan2(gy, gx) * 180) / Math.PI;
  if (a < 0) a += 180;
  if (a < 22.5 || a >= 157.5) return 0;
  if (a < 67.5) return 45;
  if (a < 112.5) return 90;
  return 135;
}

/** Pixel offsets of the two neighbours that lie along the gradient direction. */
export const SECTOR_OFFSETS: Record<0 | 45 | 90 | 135, [number, number][]> = {
  0: [
    [1, 0],
    [-1, 0],
  ],
  45: [
    [1, 1],
    [-1, -1],
  ],
  90: [
    [0, 1],
    [0, -1],
  ],
  135: [
    [-1, 1],
    [1, -1],
  ],
};

/** Keeps a pixel only if its magnitude is a local maximum across the edge. Thins thick ridges to 1 px. */
export function nonMaxSuppression(g: Gradient, width: number, height: number): Float32Array {
  const out = new Float32Array(width * height);
  const magImg: Gray = { width, height, data: g.mag };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const m = g.mag[i];
      if (m === 0) continue;
      const [[ax, ay], [bx, by]] = SECTOR_OFFSETS[sectorOf(g.gx[i], g.gy[i])];
      if (m >= at(magImg, x + ax, y + ay) && m >= at(magImg, x + bx, y + by)) out[i] = m;
    }
  }
  return out;
}

export const NONE = 0;
export const WEAK = 1;
export const STRONG = 2;

export function doubleThreshold(thin: Float32Array, low: number, high: number): Uint8Array {
  const out = new Uint8Array(thin.length);
  for (let i = 0; i < thin.length; i++) out[i] = thin[i] >= high ? STRONG : thin[i] >= low ? WEAK : NONE;
  return out;
}

/** Edge tracking: keep weak pixels only if they connect (8-neighbourhood) to a strong pixel. */
export function hysteresis(cls: Uint8Array, width: number, height: number): Uint8Array {
  const edge = new Uint8Array(cls.length);
  const stack: number[] = [];
  for (let i = 0; i < cls.length; i++) {
    if (cls[i] === STRONG) {
      edge[i] = 1;
      stack.push(i);
    }
  }
  while (stack.length) {
    const i = stack.pop()!;
    const x = i % width;
    const y = (i - x) / width;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const j = ny * width + nx;
        if (!edge[j] && cls[j] === WEAK) {
          edge[j] = 1;
          stack.push(j);
        }
      }
    }
  }
  return edge;
}

export interface CannyResult {
  blurred: Gray;
  grad: Gradient;
  thin: Float32Array;
  classes: Uint8Array;
  edges: Uint8Array;
}

export function canny(img: Gray, sigma: number, low: number, high: number): CannyResult {
  const blurred = gaussianBlur(img, sigma);
  const grad = gradient(blurred, OPERATORS.sobel.kx, OPERATORS.sobel.ky);
  const thin = nonMaxSuppression(grad, img.width, img.height);
  const classes = doubleThreshold(thin, low, high);
  const edges = hysteresis(classes, img.width, img.height);
  return { blurred, grad, thin, classes, edges };
}

/* ---------- Turning arrays into RGBA pixels for a <canvas> ---------- */

export function grayToRGBA(values: Float32Array, scale = 1): Uint8ClampedArray {
  const out = new Uint8ClampedArray(values.length * 4);
  for (let i = 0; i < values.length; i++) {
    const v = values[i] * scale;
    out[i * 4] = v;
    out[i * 4 + 1] = v;
    out[i * 4 + 2] = v;
    out[i * 4 + 3] = 255;
  }
  return out;
}

/** Signed values: positive in orange, negative in sky blue, zero black. */
export function signedToRGBA(values: Float32Array, maxAbs: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(values.length * 4);
  const m = maxAbs || 1;
  for (let i = 0; i < values.length; i++) {
    const t = Math.min(1, Math.abs(values[i]) / m);
    const [r, g, b] = values[i] >= 0 ? [251, 146, 60] : [56, 189, 248];
    out[i * 4] = r * t;
    out[i * 4 + 1] = g * t;
    out[i * 4 + 2] = b * t;
    out[i * 4 + 3] = 255;
  }
  return out;
}

export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const c = v * s;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const [r, g, b] =
    hp < 1 ? [c, x, 0] : hp < 2 ? [x, c, 0] : hp < 3 ? [0, c, x] : hp < 4 ? [0, x, c] : hp < 5 ? [x, 0, c] : [c, 0, x];
  const m = v - c;
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/** Gradient direction as hue, gradient strength as brightness. */
export function directionToRGBA(g: Gradient, maxMag: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(g.mag.length * 4);
  const m = maxMag || 1;
  for (let i = 0; i < g.mag.length; i++) {
    const deg = (Math.atan2(g.gy[i], g.gx[i]) * 180) / Math.PI;
    const [r, gg, b] = hsvToRgb(deg, 1, Math.min(1, (g.mag[i] / m) * 1.6));
    out[i * 4] = r;
    out[i * 4 + 1] = gg;
    out[i * 4 + 2] = b;
    out[i * 4 + 3] = 255;
  }
  return out;
}

export function classesToRGBA(cls: Uint8Array): Uint8ClampedArray {
  const out = new Uint8ClampedArray(cls.length * 4);
  for (let i = 0; i < cls.length; i++) {
    const [r, g, b] = cls[i] === STRONG ? [255, 255, 255] : cls[i] === WEAK ? [245, 158, 11] : [0, 0, 0];
    out[i * 4] = r;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = b;
    out[i * 4 + 3] = 255;
  }
  return out;
}

export function maskToRGBA(mask: Uint8Array): Uint8ClampedArray {
  const out = new Uint8ClampedArray(mask.length * 4);
  for (let i = 0; i < mask.length; i++) {
    const v = mask[i] ? 255 : 0;
    out[i * 4] = v;
    out[i * 4 + 1] = v;
    out[i * 4 + 2] = v;
    out[i * 4 + 3] = 255;
  }
  return out;
}

export function maxOf(values: Float32Array, abs = false) {
  let m = 0;
  for (let i = 0; i < values.length; i++) m = Math.max(m, abs ? Math.abs(values[i]) : values[i]);
  return m;
}

/** Reads a user's image file locally (nothing is uploaded) and converts it to grayscale, fitted inside maxW×maxH. */
export function loadGrayFromFile(file: File, maxW: number, maxH: number): Promise<Gray> {
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
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas not available'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const rgba = ctx.getImageData(0, 0, width, height).data;
      const data = new Float32Array(width * height);
      for (let i = 0; i < data.length; i++) {
        data[i] = 0.299 * rgba[i * 4] + 0.587 * rgba[i * 4 + 1] + 0.114 * rgba[i * 4 + 2];
      }
      URL.revokeObjectURL(url);
      resolve({ width, height, data });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image'));
    };
    img.src = url;
  });
}
