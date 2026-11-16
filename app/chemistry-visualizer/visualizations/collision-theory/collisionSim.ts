import { R } from '../_kinetics/format';

export const BOX_W = 800;
export const BOX_H = 440;
export const RADIUS = 10;
export const ENERGY_SCALE = 48;
export const ORIENTATION_HALF_ANGLE = Math.PI / 3;
export const STERIC_FACTOR = ORIENTATION_HALF_ANGLE / Math.PI;
export const CATALYST_FACTOR = 0.5;

export const KIND_A = 0;
export const KIND_B = 1;
export const KIND_C = 2;
export const KIND_D = 3;

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  kind: number;
  angle: number;
  spin: number;
}

export interface Flash {
  x: number;
  y: number;
  age: number;
}

export interface Sample {
  t: number;
  a: number;
  b: number;
  p: number;
}

export interface Sim {
  particles: Particle[];
  time: number;
  collisions: number;
  abCollisions: number;
  energetic: number;
  reactions: number;
  reactionTimes: number[];
  flashes: Flash[];
  history: Sample[];
  nextSample: number;
}

export interface StepParams {
  temperature: number;
  threshold: number;
  orientation: boolean;
}

export function gaussian(): number {
  let u = 0;
  while (u === 0) u = Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export const kTsim = (T: number) => ENERGY_SCALE * T;

export const thresholdFor = (eaKJ: number) => (ENERGY_SCALE * eaKJ * 1000) / R;

export function createSim(nA: number, nB: number, T: number): Sim {
  const particles: Particle[] = [];
  const sd = Math.sqrt(kTsim(T));
  const kinds = [...Array(nA).fill(KIND_A), ...Array(nB).fill(KIND_B)] as number[];
  for (const kind of kinds) {
    let x = 0;
    let y = 0;
    for (let tries = 0; tries < 200; tries++) {
      x = RADIUS + Math.random() * (BOX_W - 2 * RADIUS);
      y = RADIUS + Math.random() * (BOX_H - 2 * RADIUS);
      if (particles.every((p) => (p.x - x) ** 2 + (p.y - y) ** 2 > (2.2 * RADIUS) ** 2)) break;
    }
    particles.push({
      x,
      y,
      vx: sd * gaussian(),
      vy: sd * gaussian(),
      kind,
      angle: Math.random() * 2 * Math.PI,
      spin: (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2),
    });
  }
  const n = particles.length;
  if (n > 0) {
    const mvx = particles.reduce((s, p) => s + p.vx, 0) / n;
    const mvy = particles.reduce((s, p) => s + p.vy, 0) / n;
    for (const p of particles) {
      p.vx -= mvx;
      p.vy -= mvy;
    }
    const ke = particles.reduce((s, p) => s + 0.5 * (p.vx * p.vx + p.vy * p.vy), 0) / n;
    const f = ke > 0 ? Math.sqrt(kTsim(T) / ke) : 1;
    for (const p of particles) {
      p.vx *= f;
      p.vy *= f;
    }
  }
  return {
    particles,
    time: 0,
    collisions: 0,
    abCollisions: 0,
    energetic: 0,
    reactions: 0,
    reactionTimes: [],
    flashes: [],
    history: [{ t: 0, a: nA, b: nB, p: 0 }],
    nextSample: 0.25,
  };
}

export function rescaleTemperature(sim: Sim, fromT: number, toT: number) {
  if (fromT <= 0) return;
  const f = Math.sqrt(toT / fromT);
  for (const p of sim.particles) {
    p.vx *= f;
    p.vy *= f;
  }
}

export function measuredTemperature(sim: Sim): number {
  const n = sim.particles.length;
  if (n === 0) return 0;
  const ke = sim.particles.reduce((s, p) => s + 0.5 * (p.vx * p.vx + p.vy * p.vy), 0) / n;
  return ke / ENERGY_SCALE;
}

export function countKinds(sim: Sim): [number, number, number, number] {
  const c: [number, number, number, number] = [0, 0, 0, 0];
  for (const p of sim.particles) c[p.kind] += 1;
  return c;
}

function wallSpeeds(sd: number): [number, number] {
  let u = 0;
  while (u === 0) u = Math.random();
  return [sd * Math.sqrt(-2 * Math.log(u)), sd * gaussian()];
}

function substep(sim: Sim, dt: number, params: StepParams) {
  const ps = sim.particles;
  const sd = Math.sqrt(kTsim(params.temperature));
  for (const p of ps) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.angle += p.spin * dt;
    if (p.x < RADIUS || p.x > BOX_W - RADIUS) {
      const [normal, tangent] = wallSpeeds(sd);
      const left = p.x < RADIUS;
      p.x = left ? RADIUS : BOX_W - RADIUS;
      p.vx = left ? normal : -normal;
      p.vy = tangent;
    }
    if (p.y < RADIUS || p.y > BOX_H - RADIUS) {
      const [normal, tangent] = wallSpeeds(sd);
      const top = p.y < RADIUS;
      p.y = top ? RADIUS : BOX_H - RADIUS;
      p.vy = top ? normal : -normal;
      p.vx = tangent;
    }
  }

  const minD2 = 4 * RADIUS * RADIUS;
  const cosLimit = Math.cos(ORIENTATION_HALF_ANGLE);
  for (let i = 0; i < ps.length; i++) {
    const a = ps[i];
    for (let j = i + 1; j < ps.length; j++) {
      const b = ps[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d2 = dx * dx + dy * dy;
      if (d2 >= minD2 || d2 === 0) continue;
      const d = Math.sqrt(d2);
      const nx = dx / d;
      const ny = dy / d;
      const overlap = (2 * RADIUS - d) / 2;
      a.x -= nx * overlap;
      a.y -= ny * overlap;
      b.x += nx * overlap;
      b.y += ny * overlap;
      const u = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
      if (u <= 0) continue;
      a.vx -= u * nx;
      a.vy -= u * ny;
      b.vx += u * nx;
      b.vy += u * ny;
      sim.collisions += 1;

      const isAB = (a.kind === KIND_A && b.kind === KIND_B) || (a.kind === KIND_B && b.kind === KIND_A);
      if (!isAB) continue;
      sim.abCollisions += 1;
      const lineOfCentresEnergy = 0.25 * u * u;
      if (lineOfCentresEnergy < params.threshold) continue;
      sim.energetic += 1;
      if (params.orientation) {
        const molA = a.kind === KIND_A ? a : b;
        const sign = a.kind === KIND_A ? 1 : -1;
        const facing = Math.cos(molA.angle) * nx * sign + Math.sin(molA.angle) * ny * sign;
        if (facing < cosLimit) continue;
      }
      if (a.kind === KIND_A) {
        a.kind = KIND_C;
        b.kind = KIND_D;
      } else {
        a.kind = KIND_D;
        b.kind = KIND_C;
      }
      sim.reactions += 1;
      sim.reactionTimes.push(sim.time);
      sim.flashes.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, age: 0 });
    }
  }
}

export function advance(sim: Sim, dt: number, params: StepParams, substeps = 12) {
  const h = dt / substeps;
  for (let s = 0; s < substeps; s++) {
    substep(sim, h, params);
    sim.time += h;
  }
  for (const f of sim.flashes) f.age += dt;
  sim.flashes = sim.flashes.filter((f) => f.age < 0.6);
  sim.reactionTimes = sim.reactionTimes.filter((t) => t > sim.time - 5);
  while (sim.time >= sim.nextSample) {
    const [a, b, c] = countKinds(sim);
    sim.history.push({ t: sim.nextSample, a, b, p: c });
    sim.nextSample += 0.25;
  }
  if (sim.history.length > 1200) sim.history = sim.history.slice(-1200);
}

const A_SHAPE = 1.5;
const LN_GAMMA_SHAPE = Math.log(Math.sqrt(Math.PI) / 2);

function upperGammaQ(x: number): number {
  if (x <= 0) return 1;
  const a = A_SHAPE;
  const gln = LN_GAMMA_SHAPE;
  if (x < a + 1) {
    let ap = a;
    let del = 1 / a;
    let sum = del;
    for (let n = 0; n < 500; n++) {
      ap += 1;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 1e-14) break;
    }
    return 1 - sum * Math.exp(-x + a * Math.log(x) - gln);
  }
  const tiny = 1e-300;
  let b = x + 1 - a;
  let c = 1 / tiny;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < tiny) d = tiny;
    c = b + an / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return Math.exp(-x + a * Math.log(x) - gln) * h;
}

export function mbEnergyDensity(E: number, T: number): number {
  if (E < 0) return 0;
  const rt = (R * T) / 1000;
  return (2 / Math.sqrt(Math.PI)) * rt ** -1.5 * Math.sqrt(E) * Math.exp(-E / rt);
}

export function fractionAbove(eaKJ: number, T: number): number {
  return upperGammaQ((eaKJ * 1000) / (R * T));
}
