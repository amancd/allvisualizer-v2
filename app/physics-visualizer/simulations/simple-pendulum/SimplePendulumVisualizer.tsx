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
const GRAPH_H = 260;

const PIVOT = { x: 400, y: 236 };
const PX_PER_M = 85; // 2.5 m rod = 212 px
const BOB_R = 16;
const MAX_ANGLE = (170 * Math.PI) / 180;
const DEFAULT_ANGLE = (60 * Math.PI) / 180;
const SUBSTEP = 1 / 2000; // integrator step (s)

const COLORS = { exact: '#4f46e5', linear: '#f59e0b' };

const GRAVITY_PRESETS = [
  { name: 'Moon', g: 1.62 },
  { name: 'Mars', g: 3.71 },
  { name: 'Earth', g: 9.81 },
  { name: 'Jupiter', g: 24.79 },
];

type State = {
  /** Exact pendulum: angle from vertical (rad) and angular velocity (rad/s). */
  theta: number;
  omega: number;
  /** Time since release (s). */
  t: number;
  /** Release angle. The bob always starts from rest. */
  theta0: number;
};

type Sample = { t: number; exact: number; linear: number };

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

/** One RK4 step of the full nonlinear equation θ'' = −(g/L) sin θ. */
function rk4Step(theta: number, omega: number, w0sq: number, h: number) {
  const acc = (th: number) => -w0sq * Math.sin(th);
  const k1t = omega;
  const k1w = acc(theta);
  const k2t = omega + (h / 2) * k1w;
  const k2w = acc(theta + (h / 2) * k1t);
  const k3t = omega + (h / 2) * k2w;
  const k3w = acc(theta + (h / 2) * k2t);
  const k4t = omega + h * k3w;
  const k4w = acc(theta + h * k3t);
  return {
    theta: theta + (h / 6) * (k1t + 2 * k2t + 2 * k3t + k4t),
    omega: omega + (h / 6) * (k1w + 2 * k2w + 2 * k3w + k4w),
  };
}

/** Arithmetic-geometric mean. Converges to machine precision in a handful of iterations. */
function agm(a: number, b: number) {
  for (let i = 0; i < 20 && Math.abs(a - b) > 1e-15; i++) {
    [a, b] = [(a + b) / 2, Math.sqrt(a * b)];
  }
  return a;
}

/** Exact period of a pendulum released from rest at θ₀: T = T₀ / AGM(1, cos(θ₀/2)). */
function exactPeriod(t0: number, theta0: number) {
  return t0 / agm(1, Math.cos(Math.abs(theta0) / 2));
}

const toDeg = (rad: number) => (rad * 180) / Math.PI;

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

function bobPosition(theta: number, lengthPx: number) {
  return { x: PIVOT.x + lengthPx * Math.sin(theta), y: PIVOT.y + lengthPx * Math.cos(theta) };
}

/** Background: vertical reference, release-angle guide and swing arc. */
function drawBackground(ctx: CanvasRenderingContext2D, s: State, length: number) {
  const lengthPx = length * PX_PER_M;

  ctx.clearRect(0, 0, SCENE_W, SCENE_H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);

  // Vertical reference and release-angle guide
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PIVOT.x, PIVOT.y);
  ctx.lineTo(PIVOT.x, PIVOT.y + lengthPx + 30);
  ctx.stroke();
  const release = bobPosition(s.theta0, lengthPx);
  ctx.beginPath();
  ctx.moveTo(PIVOT.x, PIVOT.y);
  ctx.lineTo(release.x, release.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Swing arc between ±θ₀
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const a0 = Math.abs(s.theta0);
  ctx.arc(PIVOT.x, PIVOT.y, lengthPx, Math.PI / 2 - a0, Math.PI / 2 + a0);
  ctx.stroke();

  // θ₀ label next to the release guide
  ctx.fillStyle = '#64748b';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  const labelR = Math.min(70, lengthPx * 0.6) + 26;
  const lbl = bobPosition(s.theta0 / 2, labelR);
  ctx.fillText(`θ₀ = ${toDeg(Math.abs(s.theta0)).toFixed(0)}°`, lbl.x, lbl.y + 7);
}

function drawPendulum(
  ctx: CanvasRenderingContext2D,
  theta: number,
  lengthPx: number,
  color: string,
  ghost: boolean,
) {
  const bob = bobPosition(theta, lengthPx);
  ctx.globalAlpha = ghost ? 0.55 : 1;
  ctx.strokeStyle = ghost ? color : '#334155';
  ctx.lineWidth = 3;
  if (ghost) ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(PIVOT.x, PIVOT.y);
  ctx.lineTo(bob.x, bob.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(bob.x, bob.y, BOB_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawPivot(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(PIVOT.x - 40, PIVOT.y - 12, 80, 8);
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(PIVOT.x, PIVOT.y, 6, 0, Math.PI * 2);
  ctx.fill();
}

function drawGraph(ctx: CanvasRenderingContext2D, samples: Sample[], now: number, window: number, theta0: number) {
  const left = 70;
  const right = GRAPH_W - 12;
  const top = 16;
  const bottom = GRAPH_H - 16;
  const mid = (top + bottom) / 2;
  const half = (bottom - top) / 2 - 4;
  const range = Math.max(Math.abs(theta0), (5 * Math.PI) / 180);
  const toX = (t: number) => right - ((now - t) / window) * (right - left);
  const toY = (th: number) => mid - (th / range) * half;

  ctx.clearRect(0, 0, GRAPH_W, GRAPH_H);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, GRAPH_W, GRAPH_H);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (const y of [toY(range), toY(-range)]) {
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
  const deg = toDeg(range).toFixed(0);
  ctx.fillText(`+${deg}°`, left - 8, toY(range) + 7);
  ctx.fillText('0°', left - 8, mid + 7);
  ctx.fillText(`−${deg}°`, left - 8, toY(-range) + 7);

  const plot = (key: 'exact' | 'linear', color: string, dashed: boolean) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    if (dashed) ctx.setLineDash([8, 6]);
    ctx.beginPath();
    samples.forEach((p, i) => {
      const x = toX(p.t);
      const y = toY(p[key]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  };
  plot('linear', COLORS.linear, true);
  plot('exact', COLORS.exact, false);
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
  digits = 2,
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const initialState = (theta0: number): State => ({ theta: theta0, omega: 0, t: 0, theta0 });

export default function SimplePendulumVisualizer() {
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<HTMLCanvasElement>(null);

  // Simulation state lives in refs and is advanced by the animation loop.
  const stateRef = useRef<State>(initialState(DEFAULT_ANGLE));
  const samplesRef = useRef<Sample[]>([]);
  const draggingRef = useRef(false);
  /** Time of the last maximum of θ, used to measure the period. */
  const lastPeakRef = useRef<number | null>(null);

  const [length, setLength] = useState(1.5);
  const [gravity, setGravity] = useState(9.81);
  const [playing, setPlaying] = useState(true);
  // Copies of the simulation state for the readouts, refreshed once per frame.
  const [snapshot, setSnapshot] = useState({ theta: DEFAULT_ANGLE, linear: DEFAULT_ANGLE, theta0: DEFAULT_ANGLE });
  const [measuredPeriod, setMeasuredPeriod] = useState<number | null>(null);

  const w0 = Math.sqrt(gravity / length);
  const smallAnglePeriod = (2 * Math.PI) / w0;
  const truePeriod = exactPeriod(smallAnglePeriod, snapshot.theta0);

  useEffect(() => {
    const scene = sceneRef.current?.getContext('2d');
    const graph = graphRef.current?.getContext('2d');
    if (!scene || !graph) return;

    const w0sq = gravity / length;
    const w = Math.sqrt(w0sq);
    const lengthPx = length * PX_PER_M;
    // Show about three small-angle periods in the graph.
    const graphWindow = Math.min(24, Math.max(6, (3 * 2 * Math.PI) / w));
    let last = performance.now();
    let frameId = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const s = stateRef.current;

      if (playing && !draggingRef.current && s.theta0 !== 0) {
        const steps = Math.max(1, Math.round(dt / SUBSTEP));
        const h = dt / steps;
        for (let i = 0; i < steps; i++) {
          const next = rk4Step(s.theta, s.omega, w0sq, h);
          // A maximum of θ is where ω changes sign from + to −. Interpolate the exact crossing time.
          if (s.omega > 0 && next.omega <= 0) {
            const tPeak = s.t + (h * s.omega) / (s.omega - next.omega);
            if (lastPeakRef.current !== null) setMeasuredPeriod(tPeak - lastPeakRef.current);
            lastPeakRef.current = tPeak;
          }
          s.theta = next.theta;
          s.omega = next.omega;
          s.t += h;
        }
        samplesRef.current.push({ t: s.t, exact: s.theta, linear: s.theta0 * Math.cos(w * s.t) });
        while (samplesRef.current.length && samplesRef.current[0].t < s.t - graphWindow) samplesRef.current.shift();
      }

      // The small-angle solution for release from rest has a closed form.
      const linear = s.theta0 * Math.cos(w * s.t);

      drawBackground(scene, s, length);
      drawPendulum(scene, linear, lengthPx, COLORS.linear, true);
      drawPendulum(scene, s.theta, lengthPx, COLORS.exact, false);
      drawPivot(scene);
      drawGraph(graph, samplesRef.current, s.t, graphWindow, s.theta0);

      setSnapshot((prev) =>
        prev.theta === s.theta && prev.linear === linear && prev.theta0 === s.theta0
          ? prev
          : { theta: s.theta, linear, theta0: s.theta0 },
      );
      frameId = requestAnimationFrame(frame);
    };

    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [length, gravity, playing]);

  /** Start a fresh swing from rest at the given angle. */
  const restart = (theta0 = stateRef.current.theta0) => {
    stateRef.current = initialState(theta0);
    samplesRef.current = [];
    lastPeakRef.current = null;
    setMeasuredPeriod(null);
  };

  const changeLength = (value: number) => {
    setLength(value);
    restart();
  };

  const changeGravity = (value: number) => {
    setGravity(value);
    restart();
  };

  // Drag anywhere on the scene to swing the bob out to that angle.
  const setAngleFromPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = toDrawingPoint(e, e.currentTarget);
    const angle = Math.atan2(p.x - PIVOT.x, p.y - PIVOT.y);
    restart(Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, angle)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setAngleFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggingRef.current) setAngleFromPointer(e);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const theta0Deg = toDeg(Math.abs(snapshot.theta0));
  const drift = toDeg(snapshot.theta - snapshot.linear);

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
              aria-label="Pendulum. Drag to set the release angle."
            />
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <span className="flex items-center gap-2 text-ink">
                <span className="h-3 w-3 rounded-full" style={{ background: COLORS.exact }} /> Exact: θ&apos;&apos; = −(g/L) sin θ
              </span>
              <span className="flex items-center gap-2 text-ink">
                <span className="h-3 w-3 rounded-full opacity-60" style={{ background: COLORS.linear }} /> Small-angle: θ&apos;&apos; = −(g/L) θ
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-muted">Drag anywhere on the picture to pull the bob out, then let go.</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">Angle θ over time</p>
            <canvas
              ref={graphRef}
              width={GRAPH_W}
              height={GRAPH_H}
              className={`${responsiveSurface} rounded-lg border border-line`}
              aria-label="Graph of the exact and small-angle angles over time"
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
            <Button size="sm" variant="outline" onClick={() => restart()} leftIcon={<RotateCcw className="h-4 w-4" />}>
              Restart swing
            </Button>
          </div>

          <div className="space-y-4">
            <Slider label="Length L" value={length} min={0.5} max={2.5} step={0.05} unit="m" onChange={changeLength} />
            <div>
              <Slider label="Gravity g" value={gravity} min={1} max={25} step={0.01} unit="m/s²" onChange={changeGravity} />
              <div className="mt-2 flex flex-wrap gap-2">
                {GRAVITY_PRESETS.map((preset) => (
                  <Button
                    key={preset.name}
                    size="sm"
                    variant={gravity === preset.g ? 'secondary' : 'outline'}
                    onClick={() => changeGravity(preset.g)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Readout label="Release angle θ₀" value={`${theta0Deg.toFixed(1)}°`} />
            <Readout label="Exact − small-angle" value={`${drift.toFixed(1)}°`} />
            <Readout label="θ exact" value={`${toDeg(snapshot.theta).toFixed(1)}°`} color={COLORS.exact} />
            <Readout label="θ small-angle" value={`${toDeg(snapshot.linear).toFixed(1)}°`} color="#b45309" />
            <Readout label="T₀ = 2π√(L/g)" value={`${smallAnglePeriod.toFixed(3)} s`} />
            <Readout label="Exact period T" value={`${truePeriod.toFixed(3)} s`} />
            <Readout label="Measured T" value={measuredPeriod === null ? 'measuring…' : `${measuredPeriod.toFixed(3)} s`} />
            <Readout label="T / T₀" value={truePeriod > 0 ? (truePeriod / smallAnglePeriod).toFixed(4) : '–'} />
          </div>
          <p className="text-xs text-ink-muted">
            Exact period from T = T₀ / AGM(1, cos(θ₀/2)). The measured value is timed from one peak of the simulated swing to
            the next.
          </p>
        </div>
      </div>
    </div>
  );
}
