'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, SplitSquareHorizontal } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';

/* ------------------------------------------------------------------ */
/* Counting microstates                                                */
/* ------------------------------------------------------------------ */

const MAX_N = 400;

/** LN_FACTORIAL[k] = ln(k!) built from summed logs, so huge factorials never overflow. */
const LN_FACTORIAL = (() => {
  const table = [0];
  for (let k = 1; k <= MAX_N; k++) table.push(table[k - 1] + Math.log(k));
  return table;
})();

/** ln Ω for k of N particles on the left: ln C(N, k). */
const lnMicrostates = (N: number, k: number) => LN_FACTORIAL[N] - LN_FACTORIAL[k] - LN_FACTORIAL[N - k];

/** Formats e^x (x may be in the hundreds) as a power of ten. */
function formatExp(lnValue: number) {
  const log10 = lnValue / Math.LN10;
  if (Math.abs(log10) < 6) return Math.exp(lnValue).toPrecision(3);
  const exponent = Math.floor(log10);
  const mantissa = 10 ** (log10 - exponent);
  return `${mantissa.toFixed(2)} × 10^${exponent}`;
}

/* ------------------------------------------------------------------ */
/* Shared UI                                                           */
/* ------------------------------------------------------------------ */

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block min-w-0 flex-1 basis-48 text-sm font-medium text-ink">
      <span className="flex justify-between gap-2">
        <span>{label}</span>
        <span className="font-mono text-ink-muted">
          {value}
          {unit}
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

function Stat({ label, value, tone = 'text-ink' }: { label: string; value: React.ReactNode; tone?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-3 shadow-card">
      <div className="text-xs font-medium text-ink-muted">{label}</div>
      <div className={`mt-1 break-words font-mono text-base font-semibold ${tone}`}>{value}</div>
    </div>
  );
}

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Free expansion                                                      */
/* ------------------------------------------------------------------ */

const BOX_W = 800;
const BOX_H = 360;
const WALL = { left: 20, right: 780, top: 20, bottom: 340 };
const MID = BOX_W / 2;

const PLOT_W = 800;
const PLOT_H = 280;
const PLOT = { left: 70, right: 780, top: 20, bottom: 230 };
const HISTORY_LENGTH = 360; // samples kept on the plot
const SAMPLE_EVERY = 3; // frames per plot sample

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Sample {
  leftFraction: number;
  entropyFraction: number;
}

const radiusFor = (N: number) => (N > 200 ? 3.5 : N > 60 ? 5 : 7);

/** N particles placed at random in the left half, moving in random directions. */
function createParticles(N: number): Particle[] {
  const r = radiusFor(N);
  return Array.from({ length: N }, () => {
    const speed = 120 + Math.random() * 140; // drawing units per second
    const angle = Math.random() * 2 * Math.PI;
    return {
      x: WALL.left + r + Math.random() * (MID - WALL.left - 2 * r - 4),
      y: WALL.top + r + Math.random() * (WALL.bottom - WALL.top - 2 * r),
      vx: speed * Math.cos(angle),
      vy: speed * Math.sin(angle),
    };
  });
}

function FreeExpansion() {
  const boxRef = useRef<HTMLCanvasElement>(null);
  const plotRef = useRef<HTMLCanvasElement>(null);

  const [N, setN] = useState(80);
  const [partitionIn, setPartitionIn] = useState(true);
  const [stats, setStats] = useState({ left: 80, returns: 0 });

  // Mutable simulation state lives in refs and is read by the animation loop.
  const sim = useRef({
    N: 80,
    partitionIn: true,
    particles: [] as Particle[],
    history: [] as Sample[],
    removedAt: -1, // history index where the partition was removed
    returns: 0, // how often all particles were back on the left after removal
    lastLeft: 80,
  });

  const reset = (count: number) => {
    const s = sim.current;
    s.N = count;
    s.partitionIn = true;
    s.particles = createParticles(count);
    s.history = [];
    s.removedAt = -1;
    s.returns = 0;
    s.lastLeft = count;
    setPartitionIn(true);
    setStats({ left: count, returns: 0 });
  };

  const togglePartition = () => {
    const s = sim.current;
    s.partitionIn = !s.partitionIn;
    if (!s.partitionIn) s.removedAt = s.history.length;
    setPartitionIn(s.partitionIn);
  };

  useEffect(() => {
    const s = sim.current;
    if (s.particles.length === 0) s.particles = createParticles(s.N);

    let frame = 0;
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      frame++;

      const r = radiusFor(s.N);
      let left = 0;
      for (const p of s.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Outer walls
        if (p.x < WALL.left + r) { p.x = WALL.left + r; p.vx = Math.abs(p.vx); }
        if (p.x > WALL.right - r) { p.x = WALL.right - r; p.vx = -Math.abs(p.vx); }
        if (p.y < WALL.top + r) { p.y = WALL.top + r; p.vy = Math.abs(p.vy); }
        if (p.y > WALL.bottom - r) { p.y = WALL.bottom - r; p.vy = -Math.abs(p.vy); }

        // Partition: keep each particle on the side it is on.
        if (s.partitionIn) {
          const halfThickness = 4 + r;
          if (p.x < MID && p.x > MID - halfThickness) { p.x = MID - halfThickness; p.vx = -Math.abs(p.vx); }
          if (p.x >= MID && p.x < MID + halfThickness) { p.x = MID + halfThickness; p.vx = Math.abs(p.vx); }
        }

        if (p.x < MID) left++;
      }

      if (!s.partitionIn && left === s.N && s.lastLeft !== s.N) s.returns++;
      s.lastLeft = left;

      if (frame % SAMPLE_EVERY === 0) {
        s.history.push({
          leftFraction: left / s.N,
          entropyFraction: lnMicrostates(s.N, left) / lnMicrostates(s.N, Math.floor(s.N / 2)),
        });
        if (s.history.length > HISTORY_LENGTH) {
          s.history.shift();
          s.removedAt--;
        }
      }
      if (frame % 8 === 0) setStats({ left, returns: s.returns });

      drawBox(boxRef.current, s.particles, r, s.partitionIn);
      drawPlot(plotRef.current, s.history, s.removedAt);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const left = Math.min(stats.left, N);
  const lnOmega = lnMicrostates(N, left);
  const lnOmegaMax = lnMicrostates(N, Math.floor(N / 2));

  return (
    <Panel
      title="Free expansion of a gas"
      description="All particles start in the left half. Remove the partition and they spread out. Nothing pushes them right; there are simply far more ways to be spread out."
    >
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <Slider
          label="Number of particles N"
          value={N}
          min={2}
          max={MAX_N}
          onChange={(v) => {
            setN(v);
            reset(v);
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" leftIcon={<SplitSquareHorizontal className="h-4 w-4" />} onClick={togglePartition}>
            {partitionIn ? 'Remove partition' : 'Insert partition'}
          </Button>
          <Button size="sm" variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => reset(N)}>
            Reset to left side
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div>
          <canvas
            ref={boxRef}
            width={BOX_W}
            height={BOX_H}
            className={`${responsiveSurface} rounded-xl border border-line`}
            aria-label="Box of gas particles"
          />
          <p className="mt-2 text-center text-xs text-ink-muted">
            Particles do not collide with each other, so each one wanders independently.
          </p>
        </div>
        <div>
          <canvas
            ref={plotRef}
            width={PLOT_W}
            height={PLOT_H}
            className={`${responsiveSurface} rounded-xl border border-line`}
            aria-label="Plot of left-side fraction and entropy over time"
          />
          <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-5 bg-blue-500" /> fraction on the left
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-5 bg-emerald-500" /> S / S<sub>max</sub>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-5 border-t-2 border-dashed border-red-400" /> partition removed
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Left / right" value={`${left} / ${N - left}`} tone="text-blue-700" />
        <Stat label="Microstates Ω = C(N, n_left)" value={formatExp(lnOmega)} />
        <Stat
          label="Entropy S = k ln Ω"
          value={`${lnOmega.toFixed(1)} k  (max ${lnOmegaMax.toFixed(1)} k)`}
          tone="text-emerald-700"
        />
        <Stat label="P(all on left) = 2^−N" value={formatExp(-N * Math.LN2)} tone="text-red-700" />
      </div>

      <p className="mt-4 text-sm text-gray-700">
        {partitionIn
          ? 'The partition is in place. Remove it to start the expansion.'
          : `Since the partition was removed, all ${N} particles have gathered on the left ${stats.returns} time${stats.returns === 1 ? '' : 's'}.`}{' '}
        {N <= 10
          ? 'With so few particles the left fraction jumps around a lot and the gas often "un-mixes" by chance.'
          : N <= 60
            ? 'Fluctuations are visible but already small compared with N.'
            : 'For large N the fraction hugs 1/2. A spontaneous return to the left side is possible in principle but you would wait far longer than the age of the universe.'}
      </p>
    </Panel>
  );
}

function drawBox(canvas: HTMLCanvasElement | null, particles: Particle[], r: number, partitionIn: boolean) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, BOX_W, BOX_H);

  // Tint the half that started with the gas.
  ctx.fillStyle = '#eff6ff';
  ctx.fillRect(WALL.left, WALL.top, MID - WALL.left, WALL.bottom - WALL.top);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 6;
  ctx.strokeRect(WALL.left, WALL.top, WALL.right - WALL.left, WALL.bottom - WALL.top);

  if (partitionIn) {
    ctx.fillStyle = '#475569';
    ctx.fillRect(MID - 4, WALL.top, 8, WALL.bottom - WALL.top);
  } else {
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(MID, WALL.top);
    ctx.lineTo(MID, WALL.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  for (const p of particles) {
    ctx.fillStyle = p.x < MID ? '#2563eb' : '#f97316';
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawPlot(canvas: HTMLCanvasElement | null, history: Sample[], removedAt: number) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, PLOT_W, PLOT_H);

  const yFor = (v: number) => PLOT.bottom - v * (PLOT.bottom - PLOT.top);
  const xFor = (i: number) => PLOT.left + (i / (HISTORY_LENGTH - 1)) * (PLOT.right - PLOT.left);

  // Grid and axis labels
  ctx.font = '20px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (const v of [0, 0.5, 1]) {
    ctx.strokeStyle = v === 0.5 ? '#cbd5e1' : '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PLOT.left, yFor(v));
    ctx.lineTo(PLOT.right, yFor(v));
    ctx.stroke();
    ctx.fillStyle = '#475569';
    ctx.fillText(v === 0.5 ? '½' : String(v), PLOT.left - 12, yFor(v));
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('time', (PLOT.left + PLOT.right) / 2, PLOT_H - 18);

  if (removedAt >= 0 && removedAt < history.length) {
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(xFor(removedAt), PLOT.top);
    ctx.lineTo(xFor(removedAt), PLOT.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  const line = (pick: (s: Sample) => number, color: string) => {
    if (history.length < 2) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    history.forEach((s, i) => (i === 0 ? ctx.moveTo(xFor(i), yFor(pick(s))) : ctx.lineTo(xFor(i), yFor(pick(s)))));
    ctx.stroke();
  };
  line((s) => s.entropyFraction, '#10b981');
  line((s) => s.leftFraction, '#3b82f6');
}

/* ------------------------------------------------------------------ */
/* Heat flow between two blocks                                        */
/* ------------------------------------------------------------------ */

const HEAT_CAPACITY = 500; // J/K for each block
const CONDUCTANCE = 25; // W/K through the contact
const TAU = HEAT_CAPACITY / (2 * CONDUCTANCE); // s, time constant of the temperature difference
const T_END = 5 * TAU;
const TIME_SPEEDUP = 5; // simulated seconds per real second

/** Colour from blue (cold) to red (hot) for a temperature in kelvin. */
function temperatureColor(T: number) {
  const t = Math.min(1, Math.max(0, (T - 150) / (700 - 150)));
  const hue = 220 - 220 * t;
  return `hsl(${hue}, 75%, ${55 - 10 * Math.abs(t - 0.5)}%)`;
}

const HEAT_W = 800;
const HEAT_H = 280;
const CHART_W = 800;
const CHART_H = 260;
const CHART = { left: 90, right: 780, top: 24, bottom: 200 };

function HeatFlow() {
  const [hot0, setHot0] = useState(500);
  const [cold0, setCold0] = useState(250);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  const running = playing && time < T_END;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) * TIME_SPEEDUP;
      last = now;
      setTime((t) => Math.min(T_END, t + dt));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  // Equal heat capacities: the difference decays exponentially towards the average temperature.
  const finalT = (hot0 + cold0) / 2;
  const temps = (t: number) => {
    const half = ((hot0 - cold0) / 2) * Math.exp(-t / TAU);
    return { hot: finalT + half, cold: finalT - half };
  };
  const entropyChange = (t: number) => {
    const { hot, cold } = temps(t);
    return HEAT_CAPACITY * Math.log(hot / hot0) + HEAT_CAPACITY * Math.log(cold / cold0);
  };

  const { hot, cold } = temps(time);
  const heat = HEAT_CAPACITY * (hot0 - hot);
  const dSHot = HEAT_CAPACITY * Math.log(hot / hot0);
  const dSCold = HEAT_CAPACITY * Math.log(cold / cold0);
  const dSTotal = dSHot + dSCold;
  const dSFinal = entropyChange(T_END * 10);
  const power = CONDUCTANCE * (hot - cold);

  // A small parcel of heat moving right now:
  const parcel = 100; // J
  const parcelGain = parcel / cold - parcel / hot;

  const restart = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    setTime(0);
    setPlaying(false);
  };

  // Entropy chart path
  const chartX = (t: number) => CHART.left + (t / T_END) * (CHART.right - CHART.left);
  const chartY = (s: number) => CHART.bottom - (s / (dSFinal * 1.1 || 1)) * (CHART.bottom - CHART.top);
  const curve = Array.from({ length: 101 }, (_, i) => {
    const t = (i / 100) * T_END;
    return `${chartX(t).toFixed(1)},${chartY(entropyChange(t)).toFixed(1)}`;
  }).join(' L ');

  const arrowWidth = 4 + (24 * power) / (CONDUCTANCE * (700 - 150));

  return (
    <Panel
      title="Heat flow between a hot and a cold block"
      description="Two identical blocks touch. Heat flows from hot to cold until they share one temperature, and the total entropy only goes up."
    >
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <Slider label="Hot block, start" value={hot0} min={360} max={700} step={10} unit=" K" onChange={restart(setHot0)} />
        <Slider label="Cold block, start" value={cold0} min={150} max={350} step={10} unit=" K" onChange={restart(setCold0)} />
        <div className="flex flex-wrap gap-2">
          {running ? (
            <Button size="sm" variant="outline" leftIcon={<Pause className="h-4 w-4" />} onClick={() => setPlaying(false)}>
              Pause
            </Button>
          ) : (
            <Button
              size="sm"
              leftIcon={<Play className="h-4 w-4" />}
              onClick={() => {
                if (time >= T_END) setTime(0);
                setPlaying(true);
              }}
            >
              {time > 0 && time < T_END ? 'Resume' : 'Start contact'}
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RotateCcw className="h-4 w-4" />}
            onClick={() => {
              setTime(0);
              setPlaying(false);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <svg viewBox={`0 0 ${HEAT_W} ${HEAT_H}`} className={`${responsiveSurface} rounded-xl border border-line`} role="img" aria-label="Hot and cold blocks">
          <rect width={HEAT_W} height={HEAT_H} fill="#ffffff" />
          <rect x={60} y={50} width={260} height={180} rx={16} fill={temperatureColor(hot)} />
          <rect x={480} y={50} width={260} height={180} rx={16} fill={temperatureColor(cold)} />
          <text x={190} y={125} textAnchor="middle" fontSize={26} fontWeight={600} fill="white">A</text>
          <text x={190} y={170} textAnchor="middle" fontSize={34} fontWeight={700} fill="white">{hot.toFixed(0)} K</text>
          <text x={610} y={125} textAnchor="middle" fontSize={26} fontWeight={600} fill="white">B</text>
          <text x={610} y={170} textAnchor="middle" fontSize={34} fontWeight={700} fill="white">{cold.toFixed(0)} K</text>
          {/* Heat arrow, thickness proportional to the heat current */}
          {power > 0.5 && (
            <g>
              <line x1={335} y1={140} x2={440} y2={140} stroke="#f97316" strokeWidth={arrowWidth} strokeLinecap="round" />
              <polygon points={`${465},140 ${435},${140 - arrowWidth - 8} ${435},${140 + arrowWidth + 8}`} fill="#f97316" />
            </g>
          )}
          <text x={400} y={95} textAnchor="middle" fontSize={24} fill="#9a3412">Q</text>
          <text x={400} y={262} textAnchor="middle" fontSize={22} fill="#475569">
            t = {time.toFixed(1)} s
          </text>
        </svg>

        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className={`${responsiveSurface} rounded-xl border border-line`} role="img" aria-label="Total entropy change over time">
          <rect width={CHART_W} height={CHART_H} fill="#ffffff" />
          <line x1={CHART.left} y1={CHART.bottom} x2={CHART.right} y2={CHART.bottom} stroke="#94a3b8" strokeWidth={2} />
          <line x1={CHART.left} y1={CHART.top} x2={CHART.left} y2={CHART.bottom} stroke="#94a3b8" strokeWidth={2} />
          <line
            x1={CHART.left}
            y1={chartY(dSFinal)}
            x2={CHART.right}
            y2={chartY(dSFinal)}
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="8 8"
          />
          <text x={CHART.left - 10} y={chartY(dSFinal) + 7} textAnchor="end" fontSize={20} fill="#047857">
            {dSFinal.toFixed(0)}
          </text>
          <text x={CHART.left - 10} y={CHART.bottom + 7} textAnchor="end" fontSize={20} fill="#475569">0</text>
          <path d={`M ${curve}`} fill="none" stroke="#10b981" strokeWidth={4} />
          <circle cx={chartX(time)} cy={chartY(dSTotal)} r={9} fill="#047857" stroke="white" strokeWidth={3} />
          <text x={(CHART.left + CHART.right) / 2} y={CHART_H - 20} textAnchor="middle" fontSize={20} fill="#475569">
            time (0 to {T_END} s)
          </text>
          <text x={CHART.left + 12} y={CHART.top + 18} fontSize={20} fill="#475569">
            ΔS total (J/K)
          </text>
        </svg>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Heat transferred Q" value={`${heat.toFixed(0)} J`} tone="text-orange-700" />
        <Stat label="ΔS of hot block" value={`${dSHot.toFixed(1)} J/K`} tone="text-red-700" />
        <Stat label="ΔS of cold block" value={`+${dSCold.toFixed(1)} J/K`} tone="text-blue-700" />
        <Stat label="ΔS total" value={`+${dSTotal.toFixed(1)} J/K`} tone="text-emerald-700" />
      </div>

      <p className="mt-4 text-sm text-gray-700">
        Right now a parcel of {parcel} J leaving A at {hot.toFixed(0)} K and entering B at {cold.toFixed(0)} K changes the
        total entropy by {parcel} / {cold.toFixed(0)} − {parcel} / {hot.toFixed(0)} = {parcelGain >= 0 ? '+' : ''}
        {parcelGain.toFixed(3)} J/K. The reverse transfer, cold to hot, would give {(-parcelGain).toFixed(3)} J/K, which
        the second law forbids. The flow stops at {finalT.toFixed(0)} K, where the gain becomes zero.
      </p>
    </Panel>
  );
}

export default function EntropyVisualizer() {
  return (
    <div className="space-y-6">
      <FreeExpansion />
      <HeatFlow />
    </div>
  );
}
