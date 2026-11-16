export type OrbitalKey = '1s' | '2s' | '2px' | '2py' | '2pz' | '3s' | '3px' | '3py' | '3pz' | '3dz2' | '3dxz' | '3dyz' | '3dxy' | '3dx2y2';

type Shape = (x: number, y: number, z: number, r: number) => number;

export interface Orbital {
  key: OrbitalKey;
  label: string;
  sub: string;
  n: number;
  l: number;
  m: string;
  angularNodes: string;
  radialNodes: number[];
  extent: number;
  shape: Shape;
}

const SQRT3 = Math.sqrt(3);

const SHAPES: Record<string, Shape> = {
  s: () => 1,
  px: (x, _y, _z, r) => (r === 0 ? 0 : x / r),
  py: (_x, y, _z, r) => (r === 0 ? 0 : y / r),
  pz: (_x, _y, z, r) => (r === 0 ? 0 : z / r),
  dz2: (_x, _y, z, r) => (r === 0 ? 0 : (3 * z * z - r * r) / (2 * r * r)),
  dxz: (x, _y, z, r) => (r === 0 ? 0 : (2 * x * z) / (r * r)),
  dyz: (_x, y, z, r) => (r === 0 ? 0 : (2 * y * z) / (r * r)),
  dxy: (x, y, _z, r) => (r === 0 ? 0 : (2 * x * y) / (r * r)),
  dx2y2: (x, y, _z, r) => (r === 0 ? 0 : (x * x - y * y) / (r * r)),
};

export function radial(n: number, l: number, r: number): number {
  if (n === 1) return 2 * Math.exp(-r);
  if (n === 2 && l === 0) return (1 / (2 * Math.SQRT2)) * (2 - r) * Math.exp(-r / 2);
  if (n === 2) return (1 / (2 * Math.sqrt(6))) * r * Math.exp(-r / 2);
  if (l === 0) return (2 / (81 * SQRT3)) * (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3);
  if (l === 1) return (4 / (81 * Math.sqrt(6))) * (6 * r - r * r) * Math.exp(-r / 3);
  return (4 / (81 * Math.sqrt(30))) * r * r * Math.exp(-r / 3);
}

const EXTENT: Record<number, number> = { 1: 5, 2: 14, 3: 26 };

function make(key: OrbitalKey, label: string, sub: string, n: number, l: number, shape: string, m: string, angularNodes: string, radialNodes: number[] = []): Orbital {
  return { key, label, sub, n, l, m, angularNodes, radialNodes, extent: EXTENT[n], shape: SHAPES[shape] };
}

export const ORBITALS: Orbital[] = [
  make('1s', '1s', '', 1, 0, 's', '0', 'none'),
  make('2s', '2s', '', 2, 0, 's', '0', 'none', [2]),
  make('2px', '2p', 'x', 2, 1, 'px', '±1 (real combination)', 'the yz plane (x = 0)'),
  make('2py', '2p', 'y', 2, 1, 'py', '±1 (real combination)', 'the xz plane (y = 0)'),
  make('2pz', '2p', 'z', 2, 1, 'pz', '0', 'the xy plane (z = 0)'),
  make('3s', '3s', '', 3, 0, 's', '0', 'none', [4.5 - 1.5 * SQRT3, 4.5 + 1.5 * SQRT3]),
  make('3px', '3p', 'x', 3, 1, 'px', '±1 (real combination)', 'the yz plane (x = 0)', [6]),
  make('3py', '3p', 'y', 3, 1, 'py', '±1 (real combination)', 'the xz plane (y = 0)', [6]),
  make('3pz', '3p', 'z', 3, 1, 'pz', '0', 'the xy plane (z = 0)', [6]),
  make('3dz2', '3d', 'z²', 3, 2, 'dz2', '0', 'two cones at θ = 54.7° and 125.3° from the z axis'),
  make('3dxz', '3d', 'xz', 3, 2, 'dxz', '±1 (real combination)', 'the xy and yz planes'),
  make('3dyz', '3d', 'yz', 3, 2, 'dyz', '±1 (real combination)', 'the xy and xz planes'),
  make('3dxy', '3d', 'xy', 3, 2, 'dxy', '±2 (real combination)', 'the xz and yz planes'),
  make('3dx2y2', '3d', 'x²−y²', 3, 2, 'dx2y2', '±2 (real combination)', 'the planes x = y and x = −y'),
];

export function psi(o: Orbital, x: number, y: number, z: number) {
  const r = Math.sqrt(x * x + y * y + z * z);
  return radial(o.n, o.l, r) * o.shape(x, y, z, r);
}

export function radialDistribution(o: Orbital, r: number) {
  const R = radial(o.n, o.l, r);
  return r * r * R * R;
}

export function meanRadius(o: Orbital) {
  return (3 * o.n * o.n - o.l * (o.l + 1)) / 2;
}

export function energyEv(n: number) {
  return -13.606 / (n * n);
}

export interface RadialTable {
  rs: number[];
  p: number[];
  cdf: number[];
  peak: number;
}

export function radialTable(o: Orbital, rMax: number, steps = 3000): RadialTable {
  const dr = rMax / steps;
  const rs: number[] = [];
  const p: number[] = [];
  const cdf: number[] = [];
  let acc = 0;
  let peak = 0;
  let peakVal = -1;
  for (let i = 0; i <= steps; i++) {
    const r = i * dr;
    const v = radialDistribution(o, r);
    if (i > 0) acc += ((p[i - 1] + v) / 2) * dr;
    rs.push(r);
    p.push(v);
    cdf.push(acc);
    if (v > peakVal) {
      peakVal = v;
      peak = r;
    }
  }
  return { rs, p, cdf, peak };
}

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

export interface CloudPoint {
  x: number;
  y: number;
  z: number;
  positive: boolean;
}

export function sampleCloud(o: Orbital, count: number, seed: number): CloudPoint[] {
  const rand = mulberry32(seed);
  const table = radialTable(o, o.extent * 1.6, 4000);
  const total = table.cdf[table.cdf.length - 1];
  const points: CloudPoint[] = [];
  while (points.length < count) {
    const u = rand() * total;
    let lo = 0;
    let hi = table.cdf.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (table.cdf[mid] < u) lo = mid;
      else hi = mid;
    }
    const span = table.cdf[hi] - table.cdf[lo];
    const r = table.rs[lo] + (span > 0 ? (u - table.cdf[lo]) / span : 0) * (table.rs[hi] - table.rs[lo]);
    let dx = 0;
    let dy = 0;
    let dz = 0;
    let accepted = false;
    while (!accepted) {
      const cz = 2 * rand() - 1;
      const phi = 2 * Math.PI * rand();
      const s = Math.sqrt(1 - cz * cz);
      dx = s * Math.cos(phi);
      dy = s * Math.sin(phi);
      dz = cz;
      const a = o.shape(dx, dy, dz, 1);
      accepted = rand() < a * a;
    }
    const x = r * dx;
    const y = r * dy;
    const z = r * dz;
    points.push({ x, y, z, positive: psi(o, x, y, z) >= 0 });
  }
  return points;
}
