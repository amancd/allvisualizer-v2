'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { Legend, Panel, Slider, Stat, Toggle } from '../_kinetics/Controls';
import LinePlot, { type Point } from '../_kinetics/LinePlot';
import { R, fixed, sci } from '../_kinetics/format';
import {
  BOX_H,
  BOX_W,
  CATALYST_FACTOR,
  KIND_A,
  ORIENTATION_HALF_ANGLE,
  RADIUS,
  STERIC_FACTOR,
  advance,
  countKinds,
  createSim,
  fractionAbove,
  mbEnergyDensity,
  measuredTemperature,
  rescaleTemperature,
  thresholdFor,
  type Sample,
  type Sim,
} from './collisionSim';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
const DARK = ['#1e3a8a', '#92400e', '#065f46', '#4c1d95'];
const WINDOW = 60;
const E_MAX = 30;

interface Snapshot {
  time: number;
  counts: [number, number, number, number];
  collisions: number;
  abCollisions: number;
  energetic: number;
  reactions: number;
  rate: number;
  measuredT: number;
  history: Sample[];
}

function snapshotOf(sim: Sim): Snapshot {
  return {
    time: sim.time,
    counts: countKinds(sim),
    collisions: sim.collisions,
    abCollisions: sim.abCollisions,
    energetic: sim.energetic,
    reactions: sim.reactions,
    rate: sim.reactionTimes.length / Math.min(5, Math.max(sim.time, 0.25)),
    measuredT: measuredTemperature(sim),
    history: sim.history.slice(),
  };
}

function draw(ctx: CanvasRenderingContext2D, sim: Sim, orientation: boolean) {
  ctx.clearRect(0, 0, BOX_W, BOX_H);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, BOX_W, BOX_H);
  for (const f of sim.flashes) {
    const k = f.age / 0.6;
    ctx.beginPath();
    ctx.arc(f.x, f.y, RADIUS * (1.5 + 3 * k), 0, 2 * Math.PI);
    ctx.strokeStyle = `rgba(239, 68, 68, ${1 - k})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  for (const p of sim.particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = COLORS[p.kind];
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = DARK[p.kind];
    ctx.stroke();
    if (orientation && p.kind === KIND_A) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, RADIUS, p.angle - ORIENTATION_HALF_ANGLE, p.angle + ORIENTATION_HALF_ANGLE);
      ctx.closePath();
      ctx.fillStyle = DARK[KIND_A];
      ctx.fill();
    }
  }
}

export default function CollisionTheoryVisualizer() {
  const [temperature, setTemperature] = useState(300);
  const [ea, setEa] = useState(6);
  const [nA, setNA] = useState(40);
  const [nB, setNB] = useState(40);
  const [catalyst, setCatalyst] = useState(false);
  const [orientation, setOrientation] = useState(false);
  const [running, setRunning] = useState(true);
  const [snap, setSnap] = useState<Snapshot | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<Sim | null>(null);
  const dirtyRef = useRef(true);
  const eaEff = catalyst ? ea * CATALYST_FACTOR : ea;
  const paramsRef = useRef({ temperature, eaEff, orientation, nA, nB, running });

  useEffect(() => {
    paramsRef.current = { temperature, eaEff, orientation, nA, nB, running };
  });

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let sinceSnap = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const params = paramsRef.current;
      if (!simRef.current) {
        simRef.current = createSim(params.nA, params.nB, params.temperature);
        dirtyRef.current = true;
      }
      const sim = simRef.current;
      if (params.running) {
        advance(sim, dt, { temperature: params.temperature, threshold: thresholdFor(params.eaEff), orientation: params.orientation });
        sinceSnap += dt;
      }
      if (sinceSnap >= 0.2 || dirtyRef.current) {
        sinceSnap = 0;
        dirtyRef.current = false;
        setSnap(snapshotOf(sim));
      }
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) draw(ctx, sim, params.orientation);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const reset = (a = nA, b = nB) => {
    simRef.current = createSim(a, b, temperature);
    dirtyRef.current = true;
  };

  const changeTemperature = (t: number) => {
    if (simRef.current) rescaleTemperature(simRef.current, temperature, t);
    setTemperature(t);
  };

  const rt = (R * temperature) / 1000;
  const boltzmann = Math.exp(-eaEff / rt);
  const predictedSuccess = boltzmann * (orientation ? STERIC_FACTOR : 1);
  const fracMolecules = fractionAbove(eaEff, temperature);
  const fracUncat = fractionAbove(ea, temperature);

  const t = snap?.time ?? 0;
  const xMax = Math.max(WINDOW, t);
  const xMin = xMax - WINDOW;
  const hist = (snap?.history ?? []).filter((s) => s.t >= xMin - 0.5);
  const yMax = Math.max(nA, nB, 1);

  const energies = Array.from({ length: 301 }, (_, i) => (E_MAX * i) / 300);
  const curve = (T: number): Point[] => energies.map((E) => [E, mbEnergyDensity(E, T)]);
  const current = curve(temperature);
  const reference = curve(300);
  const peak = mbEnergyDensity(((R * Math.min(temperature, 300)) / 1000) / 2, Math.min(temperature, 300));
  const shaded: Point[] = [[eaEff, mbEnergyDensity(eaEff, temperature)], ...current.filter(([E]) => E > eaEff)];

  const ab = snap?.abCollisions ?? 0;

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <Slider label="Temperature T" value={temperature} min={100} max={1000} step={10} display={`${temperature} K`} onChange={changeTemperature} />
        <Slider label="Activation energy Ea" value={ea} min={0} max={20} step={0.5} display={`${fixed(ea, 1)} kJ/mol`} onChange={setEa} />
        <Slider
          label="Particles of A"
          value={nA}
          min={5}
          max={60}
          step={1}
          display={nA}
          onChange={(v) => {
            setNA(v);
            reset(v, nB);
          }}
        />
        <Slider
          label="Particles of B"
          value={nB}
          min={5}
          max={60}
          step={1}
          display={nB}
          onChange={(v) => {
            setNB(v);
            reset(nA, v);
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setRunning((r) => !r)} leftIcon={running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
            {running ? 'Pause' : 'Play'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => reset()} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset
          </Button>
        </div>
        <Toggle checked={catalyst} onChange={setCatalyst}>
          Catalyst (halves Ea)
        </Toggle>
        <Toggle checked={orientation} onChange={setOrientation}>
          Require correct orientation
        </Toggle>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          <canvas
            ref={canvasRef}
            width={BOX_W}
            height={BOX_H}
            className={`${responsiveSurface} rounded-xl border border-line-strong`}
            role="img"
            aria-label="Particles of A and B moving in a box and reacting to form C and D"
          />
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            {['A', 'B', 'C (product)', 'D (product)'].map((name, i) => (
              <span key={name} className="inline-flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {name}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-full border-2 border-red-500" />
              successful collision
            </span>
            {orientation && <span>Dark wedge on A: the reactive side, which must face B</span>}
          </div>
        </div>

        <div className="space-y-4">
          <Panel title="Live counts">
            <dl className="space-y-1">
              <Stat label="Time" value={`${fixed(t, 1)} s`} />
              <Stat label="A / B left" value={`${snap?.counts[0] ?? nA} / ${snap?.counts[1] ?? nB}`} />
              <Stat label="Products C + D" value={`${snap?.counts[2] ?? 0} + ${snap?.counts[3] ?? 0}`} />
              <Stat label="All collisions" value={(snap?.collisions ?? 0).toLocaleString('en-US')} />
              <Stat label="A–B collisions" value={ab.toLocaleString('en-US')} />
              <Stat label="…with E ≥ Ea" value={(snap?.energetic ?? 0).toLocaleString('en-US')} />
              <Stat label="Successful" value={(snap?.reactions ?? 0).toLocaleString('en-US')} />
              <Stat label="Rate (last 5 s)" value={`${fixed(snap?.rate ?? 0, 2)} /s`} />
              <Stat label="Gas temperature" value={`${Math.round(snap?.measuredT ?? temperature)} K`} hint="(from mean KE)" />
            </dl>
          </Panel>
          <Panel title="Collision theory check">
            <dl className="space-y-1">
              <Stat label="Ea in use" value={`${fixed(eaEff, 1)} kJ/mol`} />
              <Stat label="Ea / RT" value={fixed(eaEff / rt, 2)} />
              <Stat label="Energetic share" value={ab ? `${fixed((100 * (snap?.energetic ?? 0)) / ab, 1)}%` : '–'} hint={`(e^(−Ea/RT) = ${fixed(100 * boltzmann, 1)}%)`} />
              <Stat
                label="Success share"
                value={ab ? `${fixed((100 * (snap?.reactions ?? 0)) / ab, 1)}%` : '–'}
                hint={orientation ? `(p·e^(−Ea/RT) = ${fixed(100 * predictedSuccess, 1)}%)` : `(predicted ${fixed(100 * predictedSuccess, 1)}%)`}
              />
            </dl>
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink">Number of particles vs time</p>
          <LinePlot
            x={[xMin, xMax]}
            y={[0, yMax * 1.05]}
            xLabel="time (s)"
            yLabel="particles"
            ariaLabel="Number of A, B and product particles over time"
            series={[
              { points: hist.map((s) => [s.t, s.a]), color: COLORS[0] },
              { points: hist.map((s) => [s.t, s.b]), color: COLORS[1], dash: nA === nB ? '8 6' : undefined },
              { points: hist.map((s) => [s.t, s.p]), color: COLORS[2] },
            ]}
          />
          <Legend
            items={[
              { color: COLORS[0], label: '[A]' },
              { color: COLORS[1], label: '[B]', dashed: nA === nB },
              { color: COLORS[2], label: '[C] = [D]' },
            ]}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink">Maxwell-Boltzmann energy distribution</p>
          <LinePlot
            x={[0, E_MAX]}
            y={[0, peak * 1.12]}
            xLabel="kinetic energy E (kJ/mol)"
            yLabel="fraction of molecules"
            formatY={() => ''}
            ariaLabel={`Maxwell-Boltzmann distribution at ${temperature} K with the area above Ea shaded`}
            areas={[{ points: shaded, color: '#ef4444', opacity: 0.35 }]}
            series={[
              ...(temperature !== 300 ? [{ points: reference, color: '#94a3b8', dash: '7 6', width: 2 }] : []),
              { points: current, color: '#4f46e5', width: 3 },
            ]}
          >
            {(sx, sy) => (
              <g>
                {catalyst && (
                  <g>
                    <line x1={sx(ea)} x2={sx(ea)} y1={sy(0)} y2={sy(peak * 1.12)} stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" />
                    <text x={sx(ea) + 5} y={sy(peak * 0.98)} fontSize={14} fill="#64748b">
                      Ea uncatalysed
                    </text>
                  </g>
                )}
                <line x1={sx(eaEff)} x2={sx(eaEff)} y1={sy(0)} y2={sy(peak * 1.12)} stroke="#dc2626" strokeWidth={2.5} />
                <text x={sx(eaEff) + 5} y={sy(peak * 1.03)} fontSize={15} fill="#dc2626" fontWeight={700}>
                  {catalyst ? 'Ea (catalysed)' : 'Ea'}
                </text>
              </g>
            )}
          </LinePlot>
          <Legend
            items={[
              { color: '#4f46e5', label: `${temperature} K` },
              ...(temperature !== 300 ? [{ color: '#94a3b8', label: '300 K for comparison', dashed: true }] : []),
              { color: '#ef4444', label: 'shaded: E ≥ Ea' },
            ]}
          />
          <dl className="space-y-1 rounded-xl border border-line bg-subtle p-3 text-sm">
            <Stat label="Fraction of molecules with E ≥ Ea" value={`${sci(100 * fracMolecules, 3)}%`} />
            {catalyst && <Stat label="Without the catalyst" value={`${sci(100 * fracUncat, 3)}%`} hint={fracUncat > 0 ? `(catalyst: ${sci(fracMolecules / fracUncat, 3)}× more)` : undefined} />}
          </dl>
        </div>
      </div>
    </div>
  );
}
