'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Equal, Minimize2, Maximize2, Pause, Play, RotateCcw, Snowflake, Flame } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { formatSci } from '../_equilibrium/acidBase';
import {
  REACTIONS,
  R_LATM,
  equilibrate,
  equilibriumConstant,
  gasMoleChange,
  rateScaleFor,
  reactionQuotient,
  step,
  type Reaction,
} from './equilibrium';

type ReactionId = Reaction['id'];

interface Point {
  t: number;
  c: number[];
}

interface Marker {
  t: number;
  label: string;
}

interface Sim {
  rxId: ReactionId;
  T: number;
  V: number;
  c: number[];
  t: number;
  scale: number;
  history: Point[];
  markers: Marker[];
  message: string;
}

const RELAXATION = 1.5;
const WINDOW = 30;
const SAMPLE = 0.05;
const VOLUMES = [0.25, 0.5, 1, 2, 4];

function initialSim(rxId: ReactionId, fromStart: boolean): Sim {
  const rx = REACTIONS[rxId];
  const K = equilibriumConstant(rx, rx.t0);
  const c = fromStart ? [...rx.start] : equilibrate(rx, rx.start, K);
  return {
    rxId,
    T: rx.t0,
    V: 1,
    c,
    t: 0,
    scale: rateScaleFor(rx, c, K, RELAXATION),
    history: [{ t: 0, c }],
    markers: [],
    message: fromStart
      ? `The vessel starts with reactants only. Q = 0 is far below K, so the forward reaction runs until the forward and reverse rates are equal.`
      : 'The mixture is at equilibrium: Q = K, so the forward and reverse reactions run at the same rate and the concentrations stay flat. Disturb it with the buttons below.',
  };
}

function joinLabels(rx: Reaction, side: 'reactant' | 'product') {
  return rx.species
    .filter((s) => s.side === side)
    .map((s) => s.label)
    .join(' and ');
}

function directionWord(Q: number, K: number) {
  const r = Math.log10(Q / K);
  if (!Number.isFinite(r)) return Q === 0 ? 'forward' : 'reverse';
  if (Math.abs(r) < 0.004) return 'none';
  return r < 0 ? 'forward' : 'reverse';
}

function shiftSentence(rx: Reaction, Q: number, K: number) {
  const dir = directionWord(Q, K);
  if (dir === 'none') return 'Q still equals K, so nothing shifts.';
  if (dir === 'forward') return `Now Q < K, so the forward reaction outpaces the reverse one and makes more ${joinLabels(rx, 'product')} until Q = K again.`;
  return `Now Q > K, so the reverse reaction outpaces the forward one and makes more ${joinLabels(rx, 'reactant')} until Q = K again.`;
}

function niceMax(x: number) {
  if (x <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(x));
  for (const m of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p >= x) return m * p;
  return 10 * p;
}

function hash(n: number) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const CHART_W = 800;
const CHART_H = 340;
const PAD = { l: 64, r: 16, t: 20, b: 44 };

function ConcentrationChart({ sim, rx }: { sim: Sim; rx: Reaction }) {
  const tEnd = Math.max(WINDOW, sim.t);
  const tStart = tEnd - WINDOW;
  const visible = sim.history.filter((p) => p.t >= tStart - SAMPLE);
  const yMax = niceMax(Math.max(...visible.flatMap((p) => p.c)) * 1.1);
  const sx = (t: number) => PAD.l + ((t - tStart) / WINDOW) * (CHART_W - PAD.l - PAD.r);
  const sy = (c: number) => CHART_H - PAD.b - (c / yMax) * (CHART_H - PAD.t - PAD.b);
  const yTicks = Array.from({ length: 5 }, (_, i) => (yMax * i) / 4);
  const xTicks = Array.from({ length: 7 }, (_, i) => Math.ceil(tStart / 5) * 5 + i * 5).filter((x) => x <= tEnd);

  return (
    <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Concentration against time">
      {yTicks.map((y) => (
        <g key={y}>
          <line x1={PAD.l} x2={CHART_W - PAD.r} y1={sy(y)} y2={sy(y)} stroke="#e5e7eb" />
          <text x={PAD.l - 8} y={sy(y) + 6} fontSize={17} textAnchor="end" fill="#64748b">
            {yMax < 0.1 ? y.toFixed(3) : y.toFixed(2)}
          </text>
        </g>
      ))}
      {xTicks.map((x) => (
        <text key={x} x={sx(x)} y={CHART_H - PAD.b + 24} fontSize={17} textAnchor="middle" fill="#64748b">
          {x}
        </text>
      ))}
      <text x={CHART_W - PAD.r} y={CHART_H - 4} fontSize={16} textAnchor="end" fill="#64748b">
        time (s, scaled)
      </text>
      <text x={16} y={PAD.t + 4} fontSize={16} fill="#64748b" transform={`rotate(-90 16 ${PAD.t + 4})`} textAnchor="end">
        mol/L
      </text>
      {sim.markers
        .filter((m) => m.t >= tStart)
        .map((m, i) => (
          <g key={`${m.t}-${i}`}>
            <line x1={sx(m.t)} x2={sx(m.t)} y1={PAD.t} y2={CHART_H - PAD.b} stroke="#94a3b8" strokeDasharray="5 5" />
            <text x={sx(m.t) + 4} y={PAD.t + 14 + (i % 3) * 18} fontSize={15} fill="#475569">
              {m.label}
            </text>
          </g>
        ))}
      {rx.species.map((s, i) => (
        <path
          key={s.label}
          d={visible.map((p, k) => `${k === 0 ? 'M' : 'L'} ${sx(Math.max(p.t, tStart)).toFixed(1)} ${sy(p.c[i]).toFixed(1)}`).join(' ')}
          fill="none"
          stroke={s.color}
          strokeWidth={3}
          strokeLinejoin="round"
        />
      ))}
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={CHART_H - PAD.b} stroke="#334155" strokeWidth={1.5} />
      <line x1={PAD.l} x2={CHART_W - PAD.r} y1={CHART_H - PAD.b} y2={CHART_H - PAD.b} stroke="#334155" strokeWidth={1.5} />
    </svg>
  );
}

const VESSEL_W = 400;
const VESSEL_H = 240;

function Vessel({ sim, rx }: { sim: Sim; rx: Reaction }) {
  const frac = (Math.log2(sim.V) + 2) / 4;
  const boxW = 120 + frac * 240;
  const x0 = 20;
  const y0 = 30;
  const boxH = 180;
  const perMole = rx.id === 'haber' ? 8 : 250;
  const no2 = rx.id === 'n2o4' ? sim.c[1] : 0;
  const tint = rx.id === 'n2o4' ? 0.85 * Math.sqrt(Math.min(1, no2 / 0.3)) : 0;

  const dots = rx.species.flatMap((s, si) => {
    const count = Math.min(90, Math.round(sim.c[si] * sim.V * perMole));
    return Array.from({ length: count }, (_, k) => {
      const seed = si * 1000 + k;
      const fx = hash(seed);
      const fy = hash(seed + 0.5);
      const wobble = 4 * Math.sin(sim.t * (1.5 + hash(seed + 0.25)) + seed);
      return {
        key: seed,
        x: x0 + 8 + fx * (boxW - 16) + wobble,
        y: y0 + 8 + fy * (boxH - 16) + 4 * Math.cos(sim.t * 1.3 + seed),
        color: s.color,
        r: s.coef === 2 && s.side === 'product' && rx.id === 'n2o4' ? 4 : 5,
      };
    });
  });

  return (
    <svg viewBox={`0 0 ${VESSEL_W} ${VESSEL_H}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Reaction vessel">
      <rect x={x0} y={y0} width={boxW} height={boxH} fill={`rgba(146, 64, 14, ${tint.toFixed(3)})`} stroke="#334155" strokeWidth={3} rx={6} />
      <rect x={x0 + boxW} y={y0 - 6} width={10} height={boxH + 12} fill="#94a3b8" stroke="#334155" strokeWidth={2} />
      <rect x={x0 + boxW + 10} y={y0 + boxH / 2 - 6} width={VESSEL_W - x0 - boxW - 10} height={12} fill="#cbd5e1" stroke="#334155" strokeWidth={1.5} />
      {dots.map((d) => (
        <circle key={d.key} cx={d.x} cy={d.y} r={d.r} fill={d.color} opacity={0.85} />
      ))}
      <text x={x0} y={20} fontSize={16} fill="#334155" fontWeight={600}>
        V = {sim.V} L, T = {Math.round(sim.T)} K
      </text>
      <text x={x0} y={VESSEL_H - 10} fontSize={14} fill="#64748b">
        {rx.id === 'haber' ? '1 dot ≈ 0.125 mol' : '1 dot ≈ 0.004 mol; brown tint = NO₂'}
      </text>
    </svg>
  );
}

function Stat({ label, value, color }: { label: React.ReactNode; value: React.ReactNode; color?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
      <dt className="flex items-center gap-2 text-ink-muted">
        {color && <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />}
        {label}
      </dt>
      <dd className="font-mono font-semibold text-ink">{value}</dd>
    </div>
  );
}

export default function LeChateliersPrincipleVisualizer() {
  const [sim, setSim] = useState<Sim>(() => initialSim('haber', false));
  const [running, setRunning] = useState(true);
  const simRef = useRef(sim);

  const rx = REACTIONS[sim.rxId];
  const K = equilibriumConstant(rx, sim.T);
  const Q = reactionQuotient(rx, sim.c);
  const dir = directionWord(Q, K);
  const pressure = sim.c.reduce((a, b) => a + b, 0) * R_LATM * sim.T;

  const commit = (next: Sim) => {
    simRef.current = next;
    setSim(next);
  };

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = -1;
    let sinceSample = 0;
    const tick = (now: number) => {
      if (last < 0) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = simRef.current;
      const r = REACTIONS[s.rxId];
      const c = step(r, s.c, equilibriumConstant(r, s.T), dt, s.scale);
      const t = s.t + dt;
      sinceSample += dt;
      let history = s.history;
      if (sinceSample >= SAMPLE) {
        sinceSample = 0;
        history = [...s.history.filter((p) => p.t >= t - WINDOW - 1), { t, c }];
      }
      const next = { ...s, c, t, history };
      simRef.current = next;
      setSim(next);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  const disturb = (changes: Partial<Sim>, label: string, describe: (Kn: number, Qn: number) => string) => {
    const s = simRef.current;
    const merged = { ...s, ...changes };
    const r = REACTIONS[merged.rxId];
    const Kn = equilibriumConstant(r, merged.T);
    const Qn = reactionQuotient(r, merged.c);
    const lastMarker = s.markers[s.markers.length - 1];
    const sameDrag = label.startsWith('T') && lastMarker?.label.startsWith('T') && s.t - lastMarker.t < 1;
    commit({
      ...merged,
      scale: rateScaleFor(r, merged.c, Kn, RELAXATION),
      history: [...s.history, { t: s.t, c: s.c }, { t: s.t + 1e-6, c: merged.c }],
      markers: sameDrag ? [...s.markers.slice(0, -1), { t: lastMarker.t, label }] : [...s.markers, { t: s.t, label }].slice(-12),
      message: describe(Kn, Qn),
    });
  };

  const changeAmount = (i: number, add: boolean) => {
    const s = simRef.current;
    const sp = rx.species[i];
    const c = s.c.map((x, k) => (k === i ? (add ? x + sp.addAmount : x / 2) : x));
    const isReactant = sp.side === 'reactant';
    disturb({ c }, `${add ? '+' : '−'}${sp.label}`, (Kn, Qn) => {
      const action = add ? `Adding ${sp.label} raised [${sp.label}]` : `Removing half the ${sp.label} lowered [${sp.label}]`;
      const effect = isReactant === add ? 'lowered Q' : 'raised Q';
      const undo = add ? `uses up part of the added ${sp.label}` : `replaces part of the lost ${sp.label}`;
      return `${action}, which ${effect} to ${formatSci(Qn)} while K stays ${formatSci(Kn)}. ${shiftSentence(rx, Qn, Kn)} The shift ${undo}, but does not fully undo the change.`;
    });
  };

  const changeVolume = (factor: number) => {
    const s = simRef.current;
    const V = s.V * factor;
    if (V < VOLUMES[0] - 1e-9 || V > VOLUMES[VOLUMES.length - 1] + 1e-9) return;
    const dn = gasMoleChange(rx);
    const c = s.c.map((x) => x / factor);
    disturb({ c, V }, factor < 1 ? '½V' : '2V', (Kn, Qn) => {
      const what =
        factor < 1
          ? 'Halving the volume doubled every concentration and the total pressure.'
          : 'Doubling the volume halved every concentration and the total pressure.';
      const fewer = dn < 0 ? `the product side (${Math.abs(dn)} fewer mol of gas)` : `the reactant side (${dn} fewer mol of gas)`;
      const more = dn < 0 ? 'the reactant side' : 'the product side';
      const toward = factor < 1 ? `toward ${fewer}, which lowers the pressure again` : `toward ${more}, which has more moles of gas and raises the pressure again`;
      return `${what} Because Δn(gas) = ${dn > 0 ? '+' : ''}${dn}, Q changed by a factor of ${formatSci((1 / factor) ** dn)} to ${formatSci(Qn)}, but K (${formatSci(Kn)}) does not depend on volume. ${shiftSentence(rx, Qn, Kn)} The system shifts ${toward}.`;
    });
  };

  const changeTemperature = (T: number) => {
    const s = simRef.current;
    const heating = T > s.T;
    const Kold = equilibriumConstant(rx, s.T);
    disturb({ T }, `T ${Math.round(T)}`, (Kn, Qn) => {
      const exo = rx.deltaH < 0;
      const kind = exo ? `exothermic (ΔH = ${rx.deltaH / 1000} kJ/mol)` : `endothermic (ΔH = +${rx.deltaH / 1000} kJ/mol)`;
      const kMove = Kn > Kold ? 'raises' : 'lowers';
      const absorb = heating ? 'the endothermic direction, absorbing some of the added heat' : 'the exothermic direction, releasing heat';
      return `${heating ? 'Heating' : 'Cooling'} an ${kind} reaction ${kMove} K to ${formatSci(Kn)}. Temperature is the only change that alters K itself. Q (${formatSci(Qn)}) has not changed yet. ${shiftSentence(rx, Qn, Kn)} The system shifts in ${absorb}.`;
    });
  };

  const switchReaction = (id: ReactionId) => {
    commit(initialSim(id, false));
  };

  const fromStart = () => commit(initialSim(sim.rxId, true));
  const resetEq = () => commit(initialSim(sim.rxId, false));

  const DirIcon = dir === 'forward' ? ArrowRight : dir === 'reverse' ? ArrowLeft : Equal;
  const dirText = dir === 'forward' ? 'Shifting right (forward)' : dir === 'reverse' ? 'Shifting left (reverse)' : 'At equilibrium';
  const ratio = Q / K;
  const logRatio = Number.isFinite(Math.log10(ratio)) ? Math.max(-2, Math.min(2, Math.log10(ratio))) : ratio === 0 ? -2 : 2;

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Reaction</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(REACTIONS) as ReactionId[]).map((id) => (
              <Button key={id} size="sm" variant={sim.rxId === id ? 'primary' : 'outline'} aria-pressed={sim.rxId === id} onClick={() => switchReaction(id)}>
                {REACTIONS[id].equation}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Change concentration</p>
          <div className="flex flex-wrap gap-2">
            {rx.species.map((s, i) => (
              <div key={s.label} className="flex flex-wrap gap-1">
                <Button size="sm" variant="secondary" onClick={() => changeAmount(i, true)}>
                  Add {s.label}
                </Button>
                <Button size="sm" variant="outline" onClick={() => changeAmount(i, false)}>
                  Remove half {s.label}
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Volume (pressure)</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => changeVolume(0.5)} disabled={sim.V <= VOLUMES[0]} leftIcon={<Minimize2 className="h-4 w-4" />}>
                Compress (½ V)
              </Button>
              <Button size="sm" variant="secondary" onClick={() => changeVolume(2)} disabled={sim.V >= VOLUMES[VOLUMES.length - 1]} leftIcon={<Maximize2 className="h-4 w-4" />}>
                Expand (2 V)
              </Button>
            </div>
          </div>
          <label className="block min-w-0 flex-1 basis-56">
            <span className="flex justify-between text-sm font-semibold text-ink">
              <span className="flex items-center gap-1">
                <Snowflake className="h-4 w-4 text-sky-600" /> Temperature <Flame className="h-4 w-4 text-orange-600" />
              </span>
              <span className="font-mono">{Math.round(sim.T)} K</span>
            </span>
            <input
              type="range"
              min={rx.tMin}
              max={rx.tMax}
              step={1}
              value={Math.round(sim.T)}
              onChange={(e) => changeTemperature(Number(e.target.value))}
              className="mt-1 w-full accent-brand-600"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setRunning((r) => !r)} leftIcon={running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
            {running ? 'Pause' : 'Play'}
          </Button>
          <Button size="sm" variant="ghost" onClick={fromStart}>
            Start from reactants only
          </Button>
          <Button size="sm" variant="ghost" onClick={resetEq} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset to equilibrium
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div>
            <p className="mb-1 text-sm font-medium text-ink">
              Concentration against time
              <span className="ml-2 font-normal text-ink-muted">(dashed lines mark each disturbance)</span>
            </p>
            <ConcentrationChart sim={sim} rx={rx} />
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
              {rx.species.map((s) => (
                <span key={s.label} className="flex items-center gap-1.5">
                  <span className="inline-block h-1 w-5 rounded" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-subtle p-4 text-sm leading-relaxed text-ink" aria-live="polite">
            {sim.message}
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <Vessel sim={sim} rx={rx} />
          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="mb-2 font-semibold text-ink">{rx.equation}</p>
            <dl className="space-y-1">
              {rx.species.map((s, i) => (
                <Stat key={s.label} label={`[${s.label}]`} value={`${sim.c[i].toFixed(rx.id === 'haber' ? 3 : 4)} M`} color={s.color} />
              ))}
              <Stat label="Total pressure" value={`${pressure.toFixed(pressure < 10 ? 2 : 0)} atm`} />
              <Stat label="ΔH" value={`${rx.deltaH > 0 ? '+' : ''}${rx.deltaH / 1000} kJ/mol`} />
            </dl>
          </div>
          <div className="rounded-xl border border-line bg-subtle p-4">
            <dl className="space-y-1">
              <Stat label="K (at this T)" value={formatSci(K)} />
              <Stat label="Q (right now)" value={Number.isFinite(Q) ? formatSci(Q) : '∞'} />
            </dl>
            <svg viewBox="0 0 300 44" className={`${responsiveSurface} mt-3`} role="img" aria-label="Q compared with K">
              <rect x={10} y={16} width={280} height={10} rx={5} fill="#e2e8f0" />
              <line x1={150} x2={150} y1={8} y2={34} stroke="#334155" strokeWidth={2} />
              <text x={150} y={44} fontSize={11} textAnchor="middle" fill="#334155">
                Q = K
              </text>
              <text x={10} y={10} fontSize={11} fill="#64748b">
                Q &lt; K
              </text>
              <text x={290} y={10} fontSize={11} textAnchor="end" fill="#64748b">
                Q &gt; K
              </text>
              <circle cx={150 + logRatio * 70} cy={21} r={8} fill={dir === 'none' ? '#16a34a' : '#f59e0b'} stroke="#334155" />
            </svg>
            <p className="mt-2 flex items-center gap-2 font-semibold text-ink">
              <DirIcon className="h-4 w-4 text-brand-600" />
              {dirText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
