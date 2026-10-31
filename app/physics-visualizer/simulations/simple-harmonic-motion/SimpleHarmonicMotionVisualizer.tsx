'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

// ---------------------------------------------------------------------------
// Drawing coordinates (both canvases are scaled to fit with CSS)
// ---------------------------------------------------------------------------
const SCENE_W = 800;
const SCENE_H = 480;
const GRAPH_W = 800;
const GRAPH_H = 300;

const MAX_AMPLITUDE = 0.25; // m
const PX_PER_M = 640; // 0.25 m maps to 160 px
const EQ_X = 440; // equilibrium position of the block's centre
const WALL_X = 40;
const BLOCK_Y = 90; // centre line of the block and spring
const BLOCK_W = 70;
const BLOCK_H = 60;
const TRACK_Y = BLOCK_Y + BLOCK_H / 2;
const CIRCLE_Y = 310; // centre of the reference circle

const GRAPH_WINDOW = 6; // seconds of history shown in the graph
const SUBSTEP = 1 / 1000; // integrator step (s)
const DEFAULT_X0 = 0.15;

const COLORS = { x: '#2563eb', v: '#16a34a', a: '#ea580c', force: '#dc2626' };

type State = { x: number; v: number; t: number };
/** One graph point. Each quantity is divided by its own peak value (A, Aω, Aω²), so all fit in −1..1. */
type Sample = { t: number; x: number; v: number; a: number };

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

/** One RK4 step of x'' = −ω² x. */
function rk4Step(s: State, omega2: number, h: number): State {
  const acc = (x: number) => -omega2 * x;
  const k1x = s.v;
  const k1v = acc(s.x);
  const k2x = s.v + (h / 2) * k1v;
  const k2v = acc(s.x + (h / 2) * k1x);
  const k3x = s.v + (h / 2) * k2v;
  const k3v = acc(s.x + (h / 2) * k2x);
  const k4x = s.v + h * k3v;
  const k4v = acc(s.x + h * k3x);
  return {
    x: s.x + (h / 6) * (k1x + 2 * k2x + 2 * k3x + k4x),
    v: s.v + (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v),
    t: s.t + h,
  };
}

/** Amplitude from the current state: A = √(x² + (v/ω)²). Holds at every instant of SHM. */
function amplitudeOf(x: number, v: number, omega: number) {
  return Math.sqrt(x * x + (v / omega) ** 2);
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 4) return;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - 12 * Math.cos(angle), y2 - 12 * Math.sin(angle));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 16 * Math.cos(angle - 0.45), y2 - 16 * Math.sin(angle - 0.45));
  ctx.lineTo(x2 - 16 * Math.cos(angle + 0.45), y2 - 16 * Math.sin(angle + 0.45));
  ctx.closePath();
  ctx.fill();
}

/** A zig-zag coil between x1 and x2 at height y. */
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
    const px = x1 + lead + ((i + 0.5) / (coils * 2)) * span;
    ctx.lineTo(px, y + (i % 2 === 0 ? -16 : 16));
  }
  ctx.lineTo(x2 - lead, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
}

function drawScene(ctx: CanvasRenderingContext2D, s: State, omega: number, k: number) {
  const blockX = EQ_X + s.x * PX_PER_M;
  const amplitude = amplitudeOf(s.x, s.v, omega);
  const radius = amplitude * PX_PER_M;

  ctx.clearRect(0, 0, SCENE_W, SCENE_H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);

  // Wall and track
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(WALL_X - 14, 30, 14, TRACK_Y - 30);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(WALL_X - 14, TRACK_Y);
  ctx.lineTo(SCENE_W - 20, TRACK_Y);
  ctx.stroke();

  // Equilibrium line, running down through the reference circle
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(EQ_X, 24);
  ctx.lineTo(EQ_X, SCENE_H - 6);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#64748b';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('x = 0', EQ_X + 8, 22);

  // Spring and block
  drawSpring(ctx, WALL_X, blockX - BLOCK_W / 2, BLOCK_Y);
  ctx.fillStyle = '#4f46e5';
  ctx.beginPath();
  ctx.roundRect(blockX - BLOCK_W / 2, BLOCK_Y - BLOCK_H / 2, BLOCK_W, BLOCK_H, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('m', blockX, BLOCK_Y + 8);

  // Restoring force arrow F = −kx (drawn above the block, 1 N = 8 px)
  const force = -k * s.x;
  const forceLen = Math.max(-150, Math.min(150, force * 8));
  if (Math.abs(forceLen) > 6) {
    drawArrow(ctx, blockX, 40, blockX + forceLen, 40, COLORS.force);
    ctx.fillStyle = COLORS.force;
    ctx.font = '20px sans-serif';
    ctx.textAlign = forceLen > 0 ? 'left' : 'right';
    ctx.fillText('F = −kx', blockX + forceLen + (forceLen > 0 ? 8 : -8), 34);
  }

  // Reference circle: a point moving uniformly around a circle of radius A.
  // Its horizontal shadow is exactly the block's position x(t).
  if (radius > 2) {
    const px = blockX;
    const py = CIRCLE_Y + (s.v / omega) * PX_PER_M;

    ctx.strokeStyle = '#c7d2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(EQ_X, CIRCLE_Y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(EQ_X, CIRCLE_Y);
    ctx.lineTo(px, py);
    ctx.stroke();

    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = '#6366f1';
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, TRACK_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#4f46e5';
    ctx.beginPath();
    ctx.arc(px, py, 9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#64748b';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Reference circle (radius A)', 20, SCENE_H - 16);
}

function drawGraph(ctx: CanvasRenderingContext2D, samples: Sample[], now: number) {
  const left = 56;
  const right = GRAPH_W - 12;
  const top = 20;
  const bottom = GRAPH_H - 20;
  const mid = (top + bottom) / 2;
  const half = (bottom - top) / 2 - 6;
  const toX = (t: number) => right - ((now - t) / GRAPH_WINDOW) * (right - left);

  ctx.clearRect(0, 0, GRAPH_W, GRAPH_H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, GRAPH_W, GRAPH_H);

  // Grid: one vertical line per second
  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRAPH_WINDOW; i++) {
    const x = left + (i / GRAPH_WINDOW) * (right - left);
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
  }
  ctx.strokeStyle = '#cbd5e1';
  for (const y of [mid - half, mid + half]) {
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
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
  ctx.fillText('+1', left - 8, mid - half + 7);
  ctx.fillText('0', left - 8, mid + 7);
  ctx.fillText('−1', left - 8, mid + half + 7);

  const series: { key: 'x' | 'v' | 'a'; color: string }[] = [
    { key: 'a', color: COLORS.a },
    { key: 'v', color: COLORS.v },
    { key: 'x', color: COLORS.x },
  ];
  ctx.lineWidth = 3;
  for (const { key, color } of series) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    samples.forEach((p, i) => {
      const x = toX(p.t);
      const y = mid - p[key] * half;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
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
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  digits?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
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
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand-600"
      />
    </label>
  );
}

function Readout({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-lg border border-line bg-subtle px-3 py-2">
      <div className="text-xs text-ink-muted" style={color ? { color } : undefined}>
        {label}
      </div>
      <div className="font-mono text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

function EnergyBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-mono text-ink-muted">{value.toFixed(3)} J</span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-subtle ring-1 ring-inset ring-line">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SimpleHarmonicMotionVisualizer() {
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<HTMLCanvasElement>(null);

  // Simulation state lives in refs and is advanced by the animation loop.
  const stateRef = useRef<State>({ x: DEFAULT_X0, v: 0, t: 0 });
  const samplesRef = useRef<Sample[]>([]);
  const draggingRef = useRef(false);

  const [mass, setMass] = useState(1);
  const [k, setK] = useState(40);
  const [playing, setPlaying] = useState(true);
  // A copy of the state for the readouts, refreshed once per frame.
  const [snapshot, setSnapshot] = useState({ x: DEFAULT_X0, v: 0 });

  const omega = Math.sqrt(k / mass);
  const period = (2 * Math.PI) / omega;

  useEffect(() => {
    const scene = sceneRef.current?.getContext('2d');
    const graph = graphRef.current?.getContext('2d');
    if (!scene || !graph) return;

    const w = Math.sqrt(k / mass);
    let last = performance.now();
    let frameId = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      if (playing && !draggingRef.current) {
        const steps = Math.max(1, Math.round(dt / SUBSTEP));
        let s = stateRef.current;
        for (let i = 0; i < steps; i++) s = rk4Step(s, w * w, dt / steps);
        stateRef.current = s;

        const amp = amplitudeOf(s.x, s.v, w);
        const xn = amp > 1e-9 ? s.x / amp : 0;
        const vn = amp > 1e-9 ? s.v / (amp * w) : 0;
        samplesRef.current.push({ t: s.t, x: xn, v: vn, a: -xn });
        while (samplesRef.current.length && samplesRef.current[0].t < s.t - GRAPH_WINDOW) samplesRef.current.shift();
      }

      const s = stateRef.current;
      drawScene(scene, s, w, k);
      drawGraph(graph, samplesRef.current, s.t);
      setSnapshot((prev) => (prev.x === s.x && prev.v === s.v ? prev : { x: s.x, v: s.v }));
      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [mass, k, playing]);

  // Drag the block to set the starting displacement (released from rest).
  const setDisplacementFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x } = toDrawingPoint(e, e.currentTarget);
    const disp = Math.max(-MAX_AMPLITUDE, Math.min(MAX_AMPLITUDE, (x - EQ_X) / PX_PER_M));
    stateRef.current = { ...stateRef.current, x: disp, v: 0 };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = toDrawingPoint(e, e.currentTarget);
    const blockX = EQ_X + stateRef.current.x * PX_PER_M;
    const onBlock = Math.abs(p.x - blockX) < BLOCK_W && p.y < TRACK_Y + 30;
    if (!onBlock) return;
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
    stateRef.current = { x: DEFAULT_X0, v: 0, t: 0 };
    samplesRef.current = [];
  };

  const { x, v } = snapshot;
  const a = -(k / mass) * x;
  const amplitude = amplitudeOf(x, v, omega);
  const kinetic = 0.5 * mass * v * v;
  const potential = 0.5 * k * x * x;
  const total = kinetic + potential;

  return (
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
              aria-label="Mass on a spring with a reference circle below it. Drag the block to set the amplitude."
            />
            <p className="mt-2 text-xs text-ink-muted">
              Drag the block left or right to set the starting displacement, then let go. The dot on the circle moves at a
              constant angular speed ω; its horizontal shadow is the block&apos;s position.
            </p>
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="font-medium text-ink">Last {GRAPH_WINDOW} s, each scaled to its peak</span>
              <span className="font-medium" style={{ color: COLORS.x }}>x / A</span>
              <span className="font-medium" style={{ color: COLORS.v }}>v / Aω</span>
              <span className="font-medium" style={{ color: COLORS.a }}>a / Aω²</span>
            </div>
            <canvas
              ref={graphRef}
              width={GRAPH_W}
              height={GRAPH_H}
              className={`${responsiveSurface} rounded-lg border border-line`}
              aria-label="Scrolling graph of position, velocity and acceleration"
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
            <Slider label="Mass m" value={mass} min={0.2} max={5} step={0.1} unit="kg" onChange={setMass} />
            <Slider label="Spring constant k" value={k} min={5} max={200} step={1} unit="N/m" digits={0} onChange={setK} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Readout label="ω = √(k/m)" value={`${omega.toFixed(2)} rad/s`} />
            <Readout label="T = 2π/ω" value={`${period.toFixed(3)} s`} />
            <Readout label="f = 1/T" value={`${(1 / period).toFixed(3)} Hz`} />
            <Readout label="Amplitude A" value={`${amplitude.toFixed(3)} m`} />
            <Readout label="Position x" value={`${x.toFixed(3)} m`} color={COLORS.x} />
            <Readout label="Velocity v" value={`${v.toFixed(3)} m/s`} color={COLORS.v} />
            <Readout label="Acceleration a" value={`${a.toFixed(2)} m/s²`} color={COLORS.a} />
            <Readout label="Force F = −kx" value={`${(-k * x).toFixed(2)} N`} color={COLORS.force} />
          </div>

          <div className="space-y-3 rounded-lg border border-line p-3">
            <p className="text-sm font-semibold text-ink">Energy</p>
            <EnergyBar label="Kinetic ½mv²" value={kinetic} total={total} color="bg-emerald-500" />
            <EnergyBar label="Spring potential ½kx²" value={potential} total={total} color="bg-indigo-500" />
            <EnergyBar label="Total ½kA²" value={total} total={total} color="bg-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
