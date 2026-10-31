'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Pause, Play, Trash2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';

/* ------------------------------------------------------------------ */
/* The probability distribution on the screen                          */
/* ------------------------------------------------------------------ */

/**
 * Screen position u runs from −1 to 1. Each slit on its own produces a broad band (a Gaussian
 * envelope) centred where that slit projects onto the screen. Without a detector the two
 * amplitudes add and interfere; with a detector the probabilities add and the fringes vanish.
 */
interface Setup {
  wavelength: number; // relative, 1 = default
  separation: number; // relative, 1 = default
  detector: boolean;
}

function slitIntensities(u: number, { wavelength, separation }: Setup) {
  const centre = 0.3 * separation;
  const width = 0.17 + 0.03 * wavelength; // longer waves diffract more
  const a1 = Math.exp(-((u + centre) ** 2) / (2 * width ** 2));
  const a2 = Math.exp(-((u - centre) ** 2) / (2 * width ** 2));
  return { a1, a2 };
}

/** |ψ|² at screen position u. */
function probability(u: number, setup: Setup) {
  const { a1, a2 } = slitIntensities(u, setup);
  if (setup.detector) return a1 * a1 + a2 * a2;
  const fringePeriod = (0.16 * setup.wavelength) / setup.separation; // λL/d in screen units
  const phase = (2 * Math.PI * u) / fringePeriod;
  return a1 * a1 + a2 * a2 + 2 * a1 * a2 * Math.cos(phase);
}

const BINS = 800;

/** Cumulative distribution over BINS cells, for inverse-transform sampling. */
function buildCdf(setup: Setup) {
  const cdf = new Float64Array(BINS);
  let total = 0;
  for (let i = 0; i < BINS; i++) {
    total += Math.max(0, probability(-1 + (2 * (i + 0.5)) / BINS, setup));
    cdf[i] = total;
  }
  for (let i = 0; i < BINS; i++) cdf[i] /= total;
  return cdf;
}

function sampleScreen(cdf: Float64Array) {
  const r = Math.random();
  let lo = 0;
  let hi = BINS - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (cdf[mid] < r) lo = mid + 1;
    else hi = mid;
  }
  return -1 + (2 * (lo + Math.random())) / BINS;
}

/* ------------------------------------------------------------------ */
/* Drawing constants                                                   */
/* ------------------------------------------------------------------ */

const SIDE_W = 800;
const SIDE_H = 300;
const SOURCE = { x: 60, y: 150 };
const BARRIER_X = 360;
const SCREEN_X = 740;
const SCREEN_HALF = 130; // u = ±1 maps to ±130 around the centre line
const FLIGHT_TIME = 1.0; // seconds from source to screen
const BARRIER_TIME = 0.45; // fraction of the flight spent before the slits

const FRONT_W = 800;
const FRONT_H = 360;
const DOTS = { top: 10, bottom: 210 };
const HIST = { top: 230, bottom: 350, bins: 80 };
const MAX_HITS = 20000;

const slitOffset = (separation: number) => 45 * separation;
const screenX = (u: number) => FRONT_W / 2 + u * (FRONT_W / 2 - 10);

interface Hit {
  u: number;
  v: number; // vertical position on the screen, 0..1
}

interface Flight {
  u: number;
  born: number;
  slit: 0 | 1 | null; // which slit the detector saw, null when nobody looked
}

type ParticleKind = 'electron' | 'photon';

/* ------------------------------------------------------------------ */
/* Double-slit, one particle at a time                                 */
/* ------------------------------------------------------------------ */

function DoubleSlitBuildUp() {
  const sideRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  const [setup, setSetup] = useState<Setup>({ wavelength: 1, separation: 1, detector: false });
  const [kind, setKind] = useState<ParticleKind>('electron');
  const [rate, setRate] = useState(20);
  const [running, setRunning] = useState(true);
  const [hitCount, setHitCount] = useState(0);

  const sim = useRef({
    setup,
    kind,
    rate,
    running: true,
    cdf: null as Float64Array | null,
    hits: [] as Hit[],
    flights: [] as Flight[],
    flash: [-10, -10], // last time each slit detector fired
    pending: 0, // fractional particles waiting to be emitted
  });

  const changeSetup = (patch: Partial<Setup>) => {
    const next = { ...setup, ...patch };
    const s = sim.current;
    s.setup = next;
    s.cdf = null;
    s.hits = [];
    s.flights = [];
    setSetup(next);
    setHitCount(0);
  };

  const clear = () => {
    sim.current.hits = [];
    sim.current.flights = [];
    setHitCount(0);
  };

  const setPlaying = (value: boolean) => {
    sim.current.running = value;
    setRunning(value);
  };

  useEffect(() => {
    const s = sim.current;
    let raf = 0;
    let last = performance.now();
    let frame = 0;
    let clock = 0;

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      frame++;

      if (s.running) {
        clock += dt;
        s.cdf ??= buildCdf(s.setup);

        // Emit new particles at the chosen rate.
        s.pending += s.rate * dt;
        while (s.pending >= 1) {
          s.pending -= 1;
          const u = sampleScreen(s.cdf);
          let slit: 0 | 1 | null = null;
          if (s.setup.detector) {
            const { a1, a2 } = slitIntensities(u, s.setup);
            slit = Math.random() < (a1 * a1) / (a1 * a1 + a2 * a2) ? 0 : 1;
          }
          s.flights.push({ u, born: clock, slit });
        }

        // Particles that reached the screen become dots.
        while (s.flights.length > 0 && clock - s.flights[0].born >= FLIGHT_TIME) {
          const f = s.flights.shift()!;
          s.hits.push({ u: f.u, v: Math.random() });
        }
        // A detector clicks at the moment its particle passes the slit.
        const slitTime = FLIGHT_TIME * BARRIER_TIME;
        for (const f of s.flights) {
          const age = clock - f.born;
          if (f.slit !== null && age >= slitTime && age - dt < slitTime) s.flash[f.slit] = clock;
        }

        if (s.hits.length >= MAX_HITS) {
          s.running = false;
          setRunning(false);
        }
      }

      drawSide(sideRef.current, s.setup, s.kind, s.flights, clock, s.flash);
      drawFront(frontRef.current, s.hits, s.setup, s.kind);
      if (frame % 6 === 0) setHitCount(s.hits.length);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const particleName = kind === 'electron' ? 'electrons' : 'photons';

  return (
    <section className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <h3 className="text-lg font-semibold text-ink">Double slit, one particle at a time</h3>
      <p className="mt-1 text-sm text-ink-muted">
        Each {kind} lands as a single dot at a random spot. Where it can land is set by a wave that passes through both
        slits. Watch the fringes build up from the dots.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(['electron', 'photon'] as const).map((k) => (
          <Button
            key={k}
            size="sm"
            variant={kind === k ? 'primary' : 'outline'}
            onClick={() => {
              sim.current.kind = k;
              setKind(k);
              clear();
            }}
          >
            {k === 'electron' ? 'Electrons' : 'Photons'}
          </Button>
        ))}
        <Button
          size="sm"
          variant={setup.detector ? 'danger' : 'outline'}
          leftIcon={setup.detector ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          onClick={() => changeSetup({ detector: !setup.detector })}
          aria-pressed={setup.detector}
        >
          Which-path detector: {setup.detector ? 'on' : 'off'}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-4">
        <RangeField
          label="Particles per second"
          value={rate}
          min={1}
          max={300}
          step={1}
          display={String(rate)}
          onChange={(v) => {
            sim.current.rate = v;
            setRate(v);
          }}
        />
        <RangeField
          label="Wavelength λ (relative)"
          value={setup.wavelength}
          min={0.6}
          max={1.6}
          step={0.05}
          display={setup.wavelength.toFixed(2)}
          onChange={(v) => changeSetup({ wavelength: v })}
        />
        <RangeField
          label="Slit separation d (relative)"
          value={setup.separation}
          min={0.6}
          max={1.4}
          step={0.05}
          display={setup.separation.toFixed(2)}
          onChange={(v) => changeSetup({ separation: v })}
        />
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div>
          <canvas
            ref={sideRef}
            width={SIDE_W}
            height={SIDE_H}
            className={`${responsiveSurface} rounded-xl border border-line`}
            aria-label="Side view of the source, the two slits and the screen"
          />
          <p className="mt-2 text-center text-xs text-ink-muted">
            Side view: source, double slit{setup.detector ? ' with detectors' : ''}, screen
          </p>
        </div>
        <div>
          <canvas
            ref={frontRef}
            width={FRONT_W}
            height={FRONT_H}
            className={`${responsiveSurface} rounded-xl border border-line`}
            aria-label="Front view of the detection screen with a histogram of hits"
          />
          <p className="mt-2 text-center text-xs text-ink-muted">
            Screen, face on. Bars count hits; the line is the predicted |ψ|².
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {running ? (
          <Button size="sm" variant="outline" leftIcon={<Pause className="h-4 w-4" />} onClick={() => setPlaying(false)}>
            Pause
          </Button>
        ) : (
          <Button
            size="sm"
            leftIcon={<Play className="h-4 w-4" />}
            onClick={() => {
              if (sim.current.hits.length >= MAX_HITS) clear();
              setPlaying(true);
            }}
          >
            Fire {particleName}
          </Button>
        )}
        <Button size="sm" variant="outline" leftIcon={<Trash2 className="h-4 w-4" />} onClick={clear}>
          Clear screen
        </Button>
        <span className="font-mono text-sm text-ink">
          {hitCount.toLocaleString('en-US')} {particleName} detected
        </span>
      </div>

      <p className="mt-4 text-sm text-gray-700">
        {setup.detector
          ? `The detectors record which slit every ${kind} went through. That information destroys the interference: the screen shows two overlapping bands, one per slit, exactly as if the ${particleName} were tiny bullets.`
          : hitCount < 200
            ? `With only a few ${particleName} the dots look random. Keep going: after a few hundred, stripes appear where the waves from the two slits add up.`
            : `The stripes are an interference pattern, yet every ${kind} arrived alone. Each one interferes with itself. Turn on the which-path detector to see what happens when you look.`}
      </p>
    </section>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block min-w-0 flex-1 basis-48 text-sm font-medium text-ink">
      <span className="flex justify-between gap-2">
        <span>{label}</span>
        <span className="font-mono text-ink-muted">{display}</span>
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

const particleColor = (kind: ParticleKind) => (kind === 'electron' ? '#22d3ee' : '#facc15');

function drawSide(
  canvas: HTMLCanvasElement | null,
  setup: Setup,
  kind: ParticleKind,
  flights: Flight[],
  clock: number,
  flash: number[]
) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const color = particleColor(kind);
  const offset = slitOffset(setup.separation);
  const slitHalf = 10;
  const slits = [SOURCE.y - offset, SOURCE.y + offset];

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, SIDE_W, SIDE_H);

  // Source
  ctx.fillStyle = '#64748b';
  ctx.fillRect(SOURCE.x - 34, SOURCE.y - 24, 34, 48);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('source', SOURCE.x - 6, SOURCE.y + 56);

  // Barrier with two slits
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(BARRIER_X - 5, 10, 10, slits[0] - slitHalf - 10);
  ctx.fillRect(BARRIER_X - 5, slits[0] + slitHalf, 10, slits[1] - slits[0] - 2 * slitHalf);
  ctx.fillRect(BARRIER_X - 5, slits[1] + slitHalf, 10, SIDE_H - 10 - slits[1] - slitHalf);

  // Which-path detectors
  if (setup.detector) {
    slits.forEach((y, i) => {
      const lit = clock - flash[i] < 0.15;
      ctx.fillStyle = lit ? '#f97316' : '#7c2d12';
      ctx.beginPath();
      ctx.arc(BARRIER_X + 26, y, 9, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  // Screen
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(SCREEN_X, SOURCE.y - SCREEN_HALF - 10, 8, 2 * SCREEN_HALF + 20);
  ctx.fillText('screen', SCREEN_X - 10, SIDE_H - 6);

  // Particles in flight. Only the newest few are drawn so the view stays readable at high rates.
  const visible = flights.slice(-12);
  for (const f of visible) {
    const t = (clock - f.born) / FLIGHT_TIME;
    const landY = SOURCE.y + f.u * SCREEN_HALF;

    if (f.slit !== null) {
      // Observed: a particle on a definite path through one slit.
      const slitY = slits[f.slit];
      const [x, y] =
        t < BARRIER_TIME
          ? lerpPoint(SOURCE.x, SOURCE.y, BARRIER_X, slitY, t / BARRIER_TIME)
          : lerpPoint(BARRIER_X, slitY, SCREEN_X, landY, (t - BARRIER_TIME) / (1 - BARRIER_TIME));
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // Unobserved: a wavefront spreading from the source, then from both slits at once.
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      if (t < BARRIER_TIME) {
        const r = (t / BARRIER_TIME) * (BARRIER_X - SOURCE.x);
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(SOURCE.x, SOURCE.y, r, -0.5, 0.5);
        ctx.stroke();
      } else {
        const r = ((t - BARRIER_TIME) / (1 - BARRIER_TIME)) * (SCREEN_X - BARRIER_X);
        ctx.globalAlpha = 0.6 * (1 - (t - BARRIER_TIME) / (1 - BARRIER_TIME)) + 0.2;
        for (const y of slits) {
          ctx.beginPath();
          ctx.arc(BARRIER_X, y, r, -1.0, 1.0);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }
  }
}

function lerpPoint(x0: number, y0: number, x1: number, y1: number, t: number): [number, number] {
  return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
}

function drawFront(canvas: HTMLCanvasElement | null, hits: Hit[], setup: Setup, kind: ParticleKind) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, FRONT_W, FRONT_H);

  // Dots: fainter as more arrive, so the pattern stays visible instead of saturating.
  ctx.fillStyle = particleColor(kind);
  ctx.globalAlpha = hits.length > 4000 ? 0.45 : 0.85;
  const size = hits.length > 4000 ? 2 : 3;
  for (const h of hits) {
    ctx.fillRect(screenX(h.u) - size / 2, DOTS.top + h.v * (DOTS.bottom - DOTS.top), size, size);
  }
  ctx.globalAlpha = 1;

  // Histogram of hits
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, HIST.top - 8, FRONT_W, FRONT_H - HIST.top + 8);
  const counts = new Array(HIST.bins).fill(0);
  for (const h of hits) {
    const bin = Math.min(HIST.bins - 1, Math.floor(((h.u + 1) / 2) * HIST.bins));
    counts[bin]++;
  }

  // Predicted counts per bin, used to scale both bars and curve.
  const expected = Array.from({ length: 200 }, (_, i) => probability(-1 + (2 * (i + 0.5)) / 200, setup));
  const expectedSum = expected.reduce((a, b) => a + b, 0);
  const expectedMax = Math.max(...expected);
  const expectedPeakPerBin = (expectedMax / expectedSum) * (200 / HIST.bins) * Math.max(hits.length, 1);
  const scaleMax = Math.max(expectedPeakPerBin, ...counts, 1);
  const barH = HIST.bottom - HIST.top;
  const binW = (FRONT_W - 20) / HIST.bins;

  ctx.fillStyle = '#38bdf8';
  counts.forEach((c, i) => {
    const h = (c / scaleMax) * barH;
    ctx.fillRect(10 + i * binW + 1, HIST.bottom - h, binW - 2, h);
  });

  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= 400; i++) {
    const u = -1 + (2 * i) / 400;
    const y = HIST.bottom - (probability(u, setup) / expectedMax) * (expectedPeakPerBin / scaleMax) * barH;
    if (i === 0) ctx.moveTo(screenX(u), y);
    else ctx.lineTo(screenX(u), y);
  }
  ctx.stroke();

  if (hits.length === 0) {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Waiting for the first hit…', FRONT_W / 2, (DOTS.top + DOTS.bottom) / 2);
  }
}

/* ------------------------------------------------------------------ */
/* de Broglie wavelength calculator                                    */
/* ------------------------------------------------------------------ */

const PLANCK = 6.62607015e-34; // J·s
const LIGHT_SPEED = 2.998e8; // m/s

const presets = [
  { name: 'Electron', mass: '9.109e-31', speed: '1e6' },
  { name: 'Proton', mass: '1.673e-27', speed: '1e5' },
  { name: 'Thermal neutron', mass: '1.675e-27', speed: '2200' },
  { name: 'C60 molecule', mass: '1.197e-24', speed: '200' },
  { name: 'Baseball', mass: '0.145', speed: '40' },
];

function formatSci(x: number, unit: string) {
  if (!Number.isFinite(x)) return '–';
  const exponent = Math.floor(Math.log10(Math.abs(x)));
  if (exponent >= -2 && exponent < 4) return `${x.toPrecision(3)} ${unit}`;
  return `${(x / 10 ** exponent).toFixed(3)} × 10${superscript(exponent)} ${unit}`;
}

function superscript(n: number) {
  const digits = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  return `${n < 0 ? '⁻' : ''}${String(Math.abs(n))
    .split('')
    .map((d) => digits[Number(d)])
    .join('')}`;
}

/** What a wavelength of this size means in practice. */
function scaleDescription(lambda: number) {
  if (lambda > 4e-7) return 'Longer than visible light. Wave behaviour is easy to see.';
  if (lambda > 1e-11)
    return 'Comparable to the spacing of atoms in a crystal (about 10⁻¹⁰ m), so crystals diffract it. This is how electron microscopes and neutron scattering work.';
  if (lambda > 1e-15) return 'Around the size of an atomic nucleus. Only high-energy scattering experiments can reveal the wave nature.';
  return 'Far smaller than a proton. No slit or crystal could ever show interference, so the object behaves classically.';
}

function DeBroglieCalculator() {
  const [preset, setPreset] = useState(presets[0].name);
  const [mass, setMass] = useState(presets[0].mass);
  const [speed, setSpeed] = useState(presets[0].speed);

  const m = Number(mass);
  const v = Number(speed);
  const valid = m > 0 && v > 0 && v < LIGHT_SPEED;
  const momentum = m * v;
  const lambda = PLANCK / momentum;
  const kinetic = 0.5 * m * v * v;
  const relativistic = valid && v > 0.1 * LIGHT_SPEED;

  return (
    <section className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <h3 className="text-lg font-semibold text-ink">de Broglie wavelength calculator</h3>
      <p className="mt-1 text-sm text-ink-muted">
        Every moving object has a wavelength λ = h / (m v). Choose an object or type your own mass and speed.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {presets.map((p) => (
          <Button
            key={p.name}
            size="sm"
            variant={preset === p.name ? 'primary' : 'outline'}
            onClick={() => {
              setPreset(p.name);
              setMass(p.mass);
              setSpeed(p.speed);
            }}
          >
            {p.name}
          </Button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Mass m (kg)"
          inputMode="decimal"
          value={mass}
          onChange={(e) => {
            setMass(e.target.value);
            setPreset('');
          }}
        />
        <Input
          label="Speed v (m/s)"
          inputMode="decimal"
          value={speed}
          onChange={(e) => {
            setSpeed(e.target.value);
            setPreset('');
          }}
        />
      </div>

      {valid ? (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
              <div className="text-xs font-medium text-violet-900">Wavelength λ</div>
              <div className="mt-1 break-words font-mono text-lg font-semibold text-violet-700">{formatSci(lambda, 'm')}</div>
            </div>
            <div className="rounded-xl border border-line bg-subtle p-4">
              <div className="text-xs font-medium text-ink-muted">Momentum p = m v</div>
              <div className="mt-1 break-words font-mono text-base font-semibold text-ink">{formatSci(momentum, 'kg·m/s')}</div>
            </div>
            <div className="rounded-xl border border-line bg-subtle p-4">
              <div className="text-xs font-medium text-ink-muted">Kinetic energy ½ m v²</div>
              <div className="mt-1 break-words font-mono text-base font-semibold text-ink">{formatSci(kinetic, 'J')}</div>
            </div>
          </div>
          <p className="text-sm text-gray-700">{scaleDescription(lambda)}</p>
          {relativistic && (
            <p className="text-sm text-amber-700">
              This speed is above 10% of the speed of light, so use the relativistic momentum p = γ m v for an accurate
              answer. The value shown uses p = m v.
            </p>
          )}
        </div>
      ) : (
        <p className="mt-5 text-sm text-red-700">
          Enter a positive mass and a speed between 0 and the speed of light (3 × 10⁸ m/s). Scientific notation such as
          9.1e-31 works.
        </p>
      )}
    </section>
  );
}

export default function WaveParticleDualityVisualizer() {
  return (
    <div className="space-y-6">
      <DoubleSlitBuildUp />
      <DeBroglieCalculator />
    </div>
  );
}
