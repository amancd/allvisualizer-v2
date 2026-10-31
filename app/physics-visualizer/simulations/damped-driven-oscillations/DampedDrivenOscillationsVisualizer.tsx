'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

// ---------------------------------------------------------------------------
// Drawing coordinates (canvases and SVGs are scaled to fit with CSS)
// ---------------------------------------------------------------------------
const SCENE_W = 800;
const SCENE_H = 260;
const GRAPH_W = 800;
const GRAPH_H = 300;
const PLOT_W = 800;
const RES_H = 320;
const PHASE_H = 220;

const WALL_X = 40;
const EQ_X = 420; // block centre at x = 0
const BLOCK_W = 80;
const BLOCK_TOP = 60;
const BLOCK_H = 140;
const TRACK_Y = BLOCK_TOP + BLOCK_H + 4;
const SPRING_Y = 100;
const DAMPER_Y = 165;
const TRAVEL_PX = 110; // the view range ±R maps to ±110 px
const CYLINDER = { left: WALL_X, right: 270, half: 17 };

const GRAPH_WINDOW = 10; // seconds of history
const SUBSTEP = 1 / 2000; // integrator step (s)
const DEFAULT_X0 = 0.2;
const DRAG_RANGE = 0.3; // view range (m) while dragging; the pointer maps onto ±0.3 m
const MAX_DRIVE_FREQ = 15; // rad/s, slider and resonance-plot range

const COLORS = { x: '#2563eb', envelope: '#94a3b8', drive: '#f97316', marker: '#dc2626' };

type State = { x: number; v: number; t: number };
type Sample = { t: number; x: number; f: number };
type Params = { m: number; k: number; b: number; f0: number; wd: number; driven: boolean };

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

/** One RK4 step of m x'' = −kx − bv + F₀ cos(ω_d t). */
function rk4Step(s: State, p: Params, h: number): State {
  const acc = (t: number, x: number, v: number) => {
    const drive = p.driven ? p.f0 * Math.cos(p.wd * t) : 0;
    return (drive - p.k * x - p.b * v) / p.m;
  };
  const k1x = s.v;
  const k1v = acc(s.t, s.x, s.v);
  const k2x = s.v + (h / 2) * k1v;
  const k2v = acc(s.t + h / 2, s.x + (h / 2) * k1x, s.v + (h / 2) * k1v);
  const k3x = s.v + (h / 2) * k2v;
  const k3v = acc(s.t + h / 2, s.x + (h / 2) * k2x, s.v + (h / 2) * k2v);
  const k4x = s.v + h * k3v;
  const k4v = acc(s.t + h, s.x + h * k3x, s.v + h * k3v);
  return {
    x: s.x + (h / 6) * (k1x + 2 * k2x + 2 * k3x + k4x),
    v: s.v + (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v),
    t: s.t + h,
  };
}

/** Steady-state amplitude A(ω_d) = (F₀/m) / √((ω₀² − ω_d²)² + (2γω_d)²). */
function steadyAmplitude(f0: number, m: number, w0: number, gamma: number, wd: number) {
  return f0 / m / Math.sqrt((w0 * w0 - wd * wd) ** 2 + (2 * gamma * wd) ** 2);
}

/** Phase lag of the displacement behind the drive, from 0 (slow drive) to π (fast drive). */
function phaseLag(w0: number, gamma: number, wd: number) {
  return Math.atan2(2 * gamma * wd, w0 * w0 - wd * wd);
}

type Regime = 'undamped' | 'underdamped' | 'critical' | 'overdamped';

function regimeOf(gamma: number, w0: number): Regime {
  if (gamma === 0) return 'undamped';
  if (Math.abs(gamma - w0) / w0 < 0.005) return 'critical';
  return gamma < w0 ? 'underdamped' : 'overdamped';
}

/**
 * For free underdamped motion, x = A e^(−γt) cos(ω₁t − φ). Given the state at one instant,
 * the current envelope height is A e^(−γt) = √(x² + ((v + γx)/ω₁)²).
 */
function envelopeHeight(x: number, v: number, gamma: number, w1: number) {
  return Math.sqrt(x * x + ((v + gamma * x) / w1) ** 2);
}

/**
 * Envelope start point for free underdamped motion, or null when there is no exponential envelope
 * (driven, critically damped or overdamped).
 */
function freeEnvelope(s: State, p: Params) {
  const w0 = Math.sqrt(p.k / p.m);
  const gamma = p.b / (2 * p.m);
  if (p.driven || regimeOf(gamma, w0) !== 'underdamped') return null;
  return { t0: s.t, a0: envelopeHeight(s.x, s.v, gamma, Math.sqrt(w0 * w0 - gamma * gamma)) };
}

/** Round up to 1, 1.5, 2, 3 or 5 × 10ⁿ for tidy axis limits. */
function niceCeil(value: number) {
  const exp = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / exp;
  const step = [1, 1.5, 2, 3, 5, 10].find((c) => n <= c + 1e-9) ?? 10;
  return step * exp;
}

function formatMeters(value: number) {
  if (value >= 1) return `${value.toFixed(2)} m`;
  if (value >= 0.01) return `${(value * 100).toFixed(1)} cm`;
  return `${(value * 1000).toFixed(1)} mm`;
}

// ---------------------------------------------------------------------------
// Canvas drawing
// ---------------------------------------------------------------------------

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y: number, x2: number, color: string) {
  const dir = Math.sign(x2 - x1);
  if (Math.abs(x2 - x1) < 6) return;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2 - dir * 12, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y);
  ctx.lineTo(x2 - dir * 16, y - 9);
  ctx.lineTo(x2 - dir * 16, y + 9);
  ctx.closePath();
  ctx.fill();
}

function drawSpring(ctx: CanvasRenderingContext2D, x1: number, x2: number, y: number) {
  const coils = 12;
  const lead = 14;
  const span = x2 - x1 - 2 * lead;
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x1 + lead, y);
  for (let i = 0; i < coils * 2; i++) {
    ctx.lineTo(x1 + lead + ((i + 0.5) / (coils * 2)) * span, y + (i % 2 === 0 ? -14 : 14));
  }
  ctx.lineTo(x2 - lead, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
}

/** Dashpot: a fixed cylinder of oil and a piston rod attached to the block. */
function drawDamper(ctx: CanvasRenderingContext2D, blockLeft: number, strength: number) {
  const pistonX = blockLeft - (EQ_X - BLOCK_W / 2 - 150);
  const { left, right, half } = CYLINDER;
  // Oil gets darker as b increases.
  ctx.fillStyle = `rgba(234, 179, 8, ${0.12 + 0.5 * strength})`;
  ctx.fillRect(left, DAMPER_Y - half, right - left, half * 2);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(right, DAMPER_Y - half);
  ctx.lineTo(left, DAMPER_Y - half);
  ctx.lineTo(left, DAMPER_Y + half);
  ctx.lineTo(right, DAMPER_Y + half);
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.fillRect(pistonX - 4, DAMPER_Y - half + 4, 8, half * 2 - 8);
  ctx.beginPath();
  ctx.moveTo(pistonX, DAMPER_Y);
  ctx.lineTo(blockLeft, DAMPER_Y);
  ctx.stroke();
}

function drawScene(ctx: CanvasRenderingContext2D, s: State, p: Params, range: number) {
  const blockX = EQ_X + Math.max(-1, Math.min(1, s.x / range)) * TRAVEL_PX;
  const blockLeft = blockX - BLOCK_W / 2;

  ctx.clearRect(0, 0, SCENE_W, SCENE_H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);

  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(WALL_X - 14, BLOCK_TOP - 10, 14, TRACK_Y - BLOCK_TOP + 10);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(WALL_X - 14, TRACK_Y);
  ctx.lineTo(SCENE_W - 20, TRACK_Y);
  ctx.stroke();

  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(EQ_X, 30);
  ctx.lineTo(EQ_X, TRACK_Y + 20);
  ctx.stroke();
  ctx.setLineDash([]);

  drawSpring(ctx, WALL_X, blockLeft, SPRING_Y);
  drawDamper(ctx, blockLeft, Math.min(1, p.b / 20));

  ctx.fillStyle = '#4f46e5';
  ctx.beginPath();
  ctx.roundRect(blockLeft, BLOCK_TOP, BLOCK_W, BLOCK_H, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('m', blockX, BLOCK_TOP + BLOCK_H / 2 + 8);

  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'left';
  ctx.fillText('k', WALL_X + 12, SPRING_Y - 22);
  ctx.fillText('b', WALL_X + 12, DAMPER_Y + 7);
  ctx.textAlign = 'right';
  ctx.fillText(`view: ±${formatMeters(range)}`, SCENE_W - 20, SCENE_H - 14);

  if (p.driven && p.f0 > 0) {
    // Arrow centred to the right of the block, pointing along the instantaneous drive force.
    const anchor = blockX + BLOCK_W / 2 + 100;
    drawArrow(ctx, anchor, BLOCK_TOP + BLOCK_H / 2, anchor + 90 * Math.cos(p.wd * s.t), COLORS.drive);
    ctx.fillStyle = COLORS.drive;
    ctx.textAlign = 'center';
    ctx.fillText('F₀ cos(ω_d t)', anchor, BLOCK_TOP - 12);
  }
}

function drawGraph(
  ctx: CanvasRenderingContext2D,
  samples: Sample[],
  now: number,
  range: number,
  envelope: { t0: number; a0: number; gamma: number } | null,
  steady: number | null,
) {
  const left = 96;
  const right = GRAPH_W - 12;
  const top = 16;
  const bottom = GRAPH_H - 16;
  const mid = (top + bottom) / 2;
  const half = (bottom - top) / 2;
  const toX = (t: number) => right - ((now - t) / GRAPH_WINDOW) * (right - left);
  const toY = (x: number) => mid - (x / range) * half;

  ctx.clearRect(0, 0, GRAPH_W, GRAPH_H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, GRAPH_W, GRAPH_H);

  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRAPH_WINDOW; i++) {
    const x = left + (i / GRAPH_WINDOW) * (right - left);
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
  }
  ctx.strokeStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(left, mid);
  ctx.lineTo(right, mid);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`+${formatMeters(range)}`, left - 8, top + 14);
  ctx.fillText('0', left - 8, mid + 7);
  ctx.fillText(`−${formatMeters(range)}`, left - 8, bottom - 2);

  ctx.save();
  ctx.beginPath();
  ctx.rect(left, top, right - left, bottom - top);
  ctx.clip();

  const line = (points: { t: number; y: number }[], color: string, width: number, dash: number[] = []) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(toX(p.t), toY(p.y));
      else ctx.lineTo(toX(p.t), toY(p.y));
    });
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Driving force, scaled so F₀ reaches 80% of the axis.
  if (steady !== null) {
    line(samples.map((p) => ({ t: p.t, y: p.f * 0.8 * range })), COLORS.drive, 2, [3, 5]);
    for (const sign of [1, -1]) {
      line([{ t: now - GRAPH_WINDOW, y: sign * steady }, { t: now, y: sign * steady }], COLORS.envelope, 2, [10, 8]);
    }
  }

  // Exponential envelope ±A₀ e^(−γ(t − t₀)) for free underdamped motion.
  if (envelope) {
    const pts: { t: number; y: number }[] = [];
    const start = Math.max(envelope.t0, now - GRAPH_WINDOW);
    for (let t = start; t <= now; t += 0.05) pts.push({ t, y: envelope.a0 * Math.exp(-envelope.gamma * (t - envelope.t0)) });
    line(pts, COLORS.envelope, 2, [10, 8]);
    line(pts.map((p) => ({ t: p.t, y: -p.y })), COLORS.envelope, 2, [10, 8]);
  }

  line(samples.map((p) => ({ t: p.t, y: p.x })), COLORS.x, 3);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Resonance and phase plots (SVG, derived from the parameters on each render)
// ---------------------------------------------------------------------------

const PLOT = { left: 80, right: PLOT_W - 20, top: 16 };
const freqToX = (w: number) => PLOT.left + (w / MAX_DRIVE_FREQ) * (PLOT.right - PLOT.left);

function FrequencyAxis({ bottom, w0 }: { bottom: number; w0: number }) {
  const ticks = [0, 3, 6, 9, 12, 15];
  return (
    <g fontSize={20} fill="#64748b">
      <line x1={PLOT.left} x2={PLOT.right} y1={bottom} y2={bottom} stroke="#94a3b8" strokeWidth={2} />
      {ticks.map((t) => (
        <text key={t} x={freqToX(t)} y={bottom + 26} textAnchor="middle">
          {t}
        </text>
      ))}
      <line x1={freqToX(w0)} x2={freqToX(w0)} y1={PLOT.top} y2={bottom} stroke="#a5b4fc" strokeWidth={2} strokeDasharray="6 6" />
      <text x={freqToX(w0) + 6} y={PLOT.top + 18} fill="#6366f1">
        ω₀
      </text>
    </g>
  );
}

function ResonancePlot({ w0, gamma, wd, k, m }: { w0: number; gamma: number; wd: number; k: number; m: number }) {
  const bottom = RES_H - 40;
  // Plot A relative to the static stretch F₀/k, so the curve does not depend on F₀.
  const gain = (w: number) => (k / m) / Math.sqrt((w0 * w0 - w * w) ** 2 + (2 * gamma * w) ** 2);
  const freqs = Array.from({ length: 401 }, (_, i) => (i / 400) * MAX_DRIVE_FREQ);
  const peak = Math.max(...freqs.map(gain), gain(w0));
  const yMax = niceCeil(Math.min(30, Math.max(1.5, peak * 1.1)));
  const toY = (g: number) => bottom - (Math.min(g, yMax * 1.05) / yMax) * (bottom - PLOT.top);
  const path = freqs.map((w, i) => `${i === 0 ? 'M' : 'L'}${freqToX(w).toFixed(1)},${toY(gain(w)).toFixed(1)}`).join(' ');
  const current = gain(wd);

  return (
    <svg viewBox={`0 0 ${PLOT_W} ${RES_H}`} className={responsiveSurface} role="img" aria-label="Resonance curve">
      <rect width={PLOT_W} height={RES_H} fill="#ffffff" />
      <g fontSize={20} fill="#64748b" textAnchor="end">
        <text x={PLOT.left - 10} y={PLOT.top + 14}>
          {yMax}
        </text>
        <text x={PLOT.left - 10} y={bottom}>
          0
        </text>
      </g>
      <line x1={PLOT.left} x2={PLOT.left} y1={PLOT.top} y2={bottom} stroke="#94a3b8" strokeWidth={2} />
      <line x1={PLOT.left} x2={PLOT.right} y1={toY(1)} y2={toY(1)} stroke="#e2e8f0" strokeWidth={2} strokeDasharray="4 6" />
      <svg x={PLOT.left} y={PLOT.top} width={PLOT.right - PLOT.left} height={bottom - PLOT.top} overflow="hidden">
        <path d={path} transform={`translate(${-PLOT.left} ${-PLOT.top})`} fill="none" stroke={COLORS.x} strokeWidth={3} />
      </svg>
      <FrequencyAxis bottom={bottom} w0={w0} />
      <line x1={freqToX(wd)} x2={freqToX(wd)} y1={toY(current)} y2={bottom} stroke={COLORS.marker} strokeWidth={2} />
      <circle cx={freqToX(wd)} cy={toY(current)} r={8} fill={COLORS.marker} />
    </svg>
  );
}

function PhasePlot({ w0, gamma, wd }: { w0: number; gamma: number; wd: number }) {
  const bottom = PHASE_H - 40;
  const toY = (rad: number) => bottom - (rad / Math.PI) * (bottom - PLOT.top);
  const freqs = Array.from({ length: 401 }, (_, i) => (i / 400) * MAX_DRIVE_FREQ);
  const path = freqs.map((w, i) => `${i === 0 ? 'M' : 'L'}${freqToX(w).toFixed(1)},${toY(phaseLag(w0, gamma, w)).toFixed(1)}`).join(' ');
  const current = phaseLag(w0, gamma, wd);

  return (
    <svg viewBox={`0 0 ${PLOT_W} ${PHASE_H}`} className={responsiveSurface} role="img" aria-label="Phase lag against driving frequency">
      <rect width={PLOT_W} height={PHASE_H} fill="#ffffff" />
      <g fontSize={20} fill="#64748b" textAnchor="end">
        <text x={PLOT.left - 10} y={PLOT.top + 14}>
          180°
        </text>
        <text x={PLOT.left - 10} y={toY(Math.PI / 2) + 7}>
          90°
        </text>
        <text x={PLOT.left - 10} y={bottom}>
          0°
        </text>
      </g>
      <line x1={PLOT.left} x2={PLOT.left} y1={PLOT.top} y2={bottom} stroke="#94a3b8" strokeWidth={2} />
      <line x1={PLOT.left} x2={PLOT.right} y1={toY(Math.PI / 2)} y2={toY(Math.PI / 2)} stroke="#e2e8f0" strokeWidth={2} strokeDasharray="4 6" />
      <path d={path} fill="none" stroke="#7c3aed" strokeWidth={3} />
      <FrequencyAxis bottom={bottom} w0={w0} />
      <circle cx={freqToX(wd)} cy={toY(current)} r={8} fill={COLORS.marker} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// UI pieces
// ---------------------------------------------------------------------------

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  digits = 1,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  digits?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className={`block ${disabled ? 'opacity-50' : ''}`}>
      <span className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-mono text-ink-muted">
          {value.toFixed(digits)} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand-600"
      />
    </label>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-subtle px-3 py-2">
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="font-mono text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

const regimeInfo: Record<Regime, { title: string; text: string; tone: string }> = {
  undamped: {
    title: 'Undamped (b = 0)',
    text: 'No friction: the oscillation never dies out.',
    tone: 'border-line bg-subtle text-ink',
  },
  underdamped: {
    title: 'Underdamped (γ < ω₀)',
    text: 'Oscillates at ω₁ = √(ω₀² − γ²) inside an envelope that shrinks like e^(−γt).',
    tone: 'border-sky-200 bg-sky-50 text-sky-900',
  },
  critical: {
    title: 'Critically damped (γ = ω₀)',
    text: 'Returns to equilibrium as fast as possible without overshooting.',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  overdamped: {
    title: 'Overdamped (γ > ω₀)',
    text: 'Creeps back to equilibrium without oscillating, more slowly than critical damping.',
    tone: 'border-amber-200 bg-amber-50 text-amber-900',
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DampedDrivenOscillationsVisualizer() {
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<HTMLCanvasElement>(null);

  // Simulation state lives in refs and is advanced by the animation loop.
  const stateRef = useRef<State>({ x: DEFAULT_X0, v: 0, t: 0 });
  const samplesRef = useRef<Sample[]>([]);
  const draggingRef = useRef(false);
  /** Envelope start point for free underdamped motion; refreshed when parameters change or the block is released. */
  const envelopeRef = useRef<{ t0: number; a0: number } | null>(null);

  const [mass, setMass] = useState(1);
  const [k, setK] = useState(25);
  const [b, setB] = useState(1);
  const [driven, setDriven] = useState(false);
  const [f0, setF0] = useState(1);
  const [wd, setWd] = useState(4);
  const [playing, setPlaying] = useState(true);

  const w0 = Math.sqrt(k / mass);
  const gamma = b / (2 * mass);
  const regime = regimeOf(gamma, w0);
  const criticalB = 2 * Math.sqrt(k * mass);
  const q = b > 0 ? w0 / (2 * gamma) : Infinity;
  const amplitude = steadyAmplitude(f0, mass, w0, gamma, wd);
  const lag = phaseLag(w0, gamma, wd);
  const resonanceFreq = gamma < w0 / Math.SQRT2 ? Math.sqrt(w0 * w0 - 2 * gamma * gamma) : 0;

  useEffect(() => {
    const scene = sceneRef.current?.getContext('2d');
    const graph = graphRef.current?.getContext('2d');
    if (!scene || !graph) return;

    const params: Params = { m: mass, k, b, f0, wd, driven };
    const g = b / (2 * mass);
    const ss = steadyAmplitude(f0, mass, Math.sqrt(k / mass), g, wd);
    // Undamped and driven exactly at ω₀ has no steady state: the amplitude grows without limit.
    const steady = driven && Number.isFinite(ss) ? ss : null;

    const resetEnvelope = () => {
      envelopeRef.current = freeEnvelope(stateRef.current, params);
    };
    resetEnvelope();

    let last = performance.now();
    let frameId = 0;
    let wasDragging = false;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const dragging = draggingRef.current;
      if (wasDragging && !dragging) resetEnvelope();
      wasDragging = dragging;

      if (playing && !dragging) {
        const steps = Math.max(1, Math.round(dt / SUBSTEP));
        let s = stateRef.current;
        for (let i = 0; i < steps; i++) s = rk4Step(s, params, dt / steps);
        stateRef.current = s;
        samplesRef.current.push({ t: s.t, x: s.x, f: driven ? Math.cos(wd * s.t) : 0 });
        while (samplesRef.current.length && samplesRef.current[0].t < s.t - GRAPH_WINDOW) samplesRef.current.shift();
      }

      const s = stateRef.current;
      // Zoom both views to the largest displacement in the graph window.
      let peak = Math.max(Math.abs(s.x), steady ?? 0, 0.02);
      for (const p of samplesRef.current) peak = Math.max(peak, Math.abs(p.x));
      const range = dragging ? DRAG_RANGE : niceCeil(peak * 1.05);

      const env = envelopeRef.current;
      drawScene(scene, s, params, range);
      drawGraph(graph, samplesRef.current, s.t, range, env && !dragging ? { ...env, gamma: g } : null, steady);
      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [mass, k, b, driven, f0, wd, playing]);

  // Drag the block to set a displacement; it is released from rest.
  const setDisplacementFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x } = toDrawingPoint(e, e.currentTarget);
    const disp = Math.max(-1, Math.min(1, (x - EQ_X) / TRAVEL_PX)) * DRAG_RANGE;
    stateRef.current = { ...stateRef.current, x: disp, v: 0 };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    samplesRef.current = [];
    setDisplacementFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggingRef.current) setDisplacementFromPointer(e);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const reset = () => {
    stateRef.current = { x: driven ? 0 : DEFAULT_X0, v: 0, t: 0 };
    samplesRef.current = [];
    envelopeRef.current = freeEnvelope(stateRef.current, { m: mass, k, b, f0, wd, driven });
  };

  const info = regimeInfo[regime];

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-4">
            <div>
              <canvas
                ref={sceneRef}
                width={SCENE_W}
                height={SCENE_H}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`${responsiveSurface} cursor-grab touch-none rounded-lg border border-line`}
                aria-label="Mass on a spring with a damper. Drag to displace the block."
              />
              <p className="mt-2 text-xs text-ink-muted">
                Drag the block to pull it aside, then let go. The views zoom automatically to fit the motion.
              </p>
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-medium text-ink">Position x(t), last {GRAPH_WINDOW} s</span>
                <span className="font-medium" style={{ color: COLORS.x }}>x</span>
                {driven ? (
                  <>
                    <span className="font-medium text-ink-muted">dashed: ±steady-state amplitude</span>
                    <span className="font-medium" style={{ color: COLORS.drive }}>dotted: drive force (scaled)</span>
                  </>
                ) : (
                  regime === 'underdamped' && <span className="font-medium text-ink-muted">dashed: envelope ±A₀e^(−γt)</span>
                )}
              </div>
              <canvas
                ref={graphRef}
                width={GRAPH_W}
                height={GRAPH_H}
                className={`${responsiveSurface} rounded-lg border border-line`}
                aria-label="Scrolling graph of displacement against time"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => setPlaying((p) => !p)}
                leftIcon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              >
                {playing ? 'Pause' : 'Play'}
              </Button>
              <Button size="sm" variant="outline" onClick={reset} leftIcon={<RotateCcw className="h-4 w-4" />}>
                Reset
              </Button>
            </div>

            <div className="space-y-4">
              <Slider label="Mass m" value={mass} min={0.5} max={5} step={0.1} unit="kg" onChange={setMass} />
              <Slider label="Spring constant k" value={k} min={5} max={100} step={1} unit="N/m" digits={0} onChange={setK} />
              <div>
                <Slider label="Damping b" value={b} min={0} max={30} step={0.1} unit="N·s/m" digits={2} onChange={setB} />
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setB(0)}>
                    b = 0
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setB(criticalB)}>
                    Critical
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-line p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-ink">Driving force</span>
                <Button size="sm" variant={driven ? 'primary' : 'outline'} onClick={() => setDriven((d) => !d)} aria-pressed={driven}>
                  {driven ? 'On' : 'Off'}
                </Button>
              </div>
              <Slider label="Amplitude F₀" value={f0} min={0} max={5} step={0.1} unit="N" disabled={!driven} onChange={setF0} />
              <Slider
                label="Frequency ω_d"
                value={wd}
                min={0.2}
                max={MAX_DRIVE_FREQ}
                step={0.05}
                unit="rad/s"
                digits={2}
                disabled={!driven}
                onChange={setWd}
              />
              <Button size="sm" variant="outline" disabled={!driven} onClick={() => setWd(Math.min(MAX_DRIVE_FREQ, w0))}>
                Drive at ω₀
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
          <h3 className="font-semibold text-ink">System</h3>
          <div className={`rounded-lg border p-3 text-sm ${info.tone}`}>
            <p className="font-semibold">{info.title}</p>
            <p className="mt-1">{info.text}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Readout label="ω₀ = √(k/m)" value={`${w0.toFixed(2)} rad/s`} />
            <Readout label="γ = b/2m" value={`${gamma.toFixed(2)} s⁻¹`} />
            <Readout label="Critical b = 2√(km)" value={`${criticalB.toFixed(2)} N·s/m`} />
            <Readout label="Q = ω₀/2γ" value={Number.isFinite(q) ? q.toFixed(2) : '∞'} />
            <Readout label="ω₁ = √(ω₀² − γ²)" value={regime === 'underdamped' || regime === 'undamped' ? `${Math.sqrt(w0 * w0 - gamma * gamma).toFixed(2)} rad/s` : 'none'} />
            <Readout label="Decay time 1/γ" value={gamma > 0 ? `${(1 / gamma).toFixed(2)} s` : '∞'} />
          </div>
          {driven && (
            <div className="grid grid-cols-2 gap-2">
              <Readout label="ω_d / ω₀" value={(wd / w0).toFixed(2)} />
              <Readout label="Steady amplitude A" value={Number.isFinite(amplitude) ? formatMeters(amplitude) : '∞'} />
              <Readout label="Phase lag δ" value={`${((lag * 180) / Math.PI).toFixed(1)}°`} />
              <Readout label="Peak at ω_r" value={resonanceFreq > 0 ? `${resonanceFreq.toFixed(2)} rad/s` : 'ω = 0 (no peak)'} />
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
          <div>
            <h3 className="font-semibold text-ink">Resonance curve</h3>
            <p className="text-sm text-ink-muted">
              Steady-state amplitude as a multiple of the static stretch F₀/k, against ω_d (rad/s). The red dot is the current drive.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-line">
            <ResonancePlot w0={w0} gamma={gamma} wd={wd} k={k} m={mass} />
          </div>
          <div>
            <h3 className="font-semibold text-ink">Phase lag δ</h3>
            <p className="text-sm text-ink-muted">How far the motion trails the driving force. It passes 90° exactly at ω₀.</p>
          </div>
          <div className="overflow-hidden rounded-lg border border-line">
            <PhasePlot w0={w0} gamma={gamma} wd={wd} />
          </div>
        </div>
      </div>
    </div>
  );
}
