'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { Legend, Panel, Slider, Stat, Toggle } from '../_kinetics/Controls';
import LinePlot, { type Point } from '../_kinetics/LinePlot';
import { R, fixed, sci } from '../_kinetics/format';
import {
  DH_LIMIT,
  EA_MAX,
  E_MAX,
  E_MIN,
  PRE_EXPONENTIAL,
  catalysedBounds,
  catalysedKnots,
  lnRateConstant,
  minEa,
  profile,
  rateConstant,
  rateRatio,
  uncatalysedKnots,
} from './arrhenius';

const W = 640;
const H = 400;
const PAD = { left: 64, right: 20, top: 24, bottom: 36 };
const px = (x: number) => PAD.left + x * (W - PAD.left - PAD.right);
const py = (e: number) => PAD.top + ((E_MAX - e) / (E_MAX - E_MIN)) * (H - PAD.top - PAD.bottom);
const toEnergy = (y: number) => E_MAX - ((y - PAD.top) / (H - PAD.top - PAD.bottom)) * (E_MAX - E_MIN);

const UNCAT = '#dc2626';
const CAT = '#059669';
const NEUTRAL = '#475569';

type Handle = 'ts' | 'products' | 'catalyst';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function Arrow({ x, from, to, color, label, side = 'right' }: { x: number; from: number; to: number; color: string; label: string; side?: 'left' | 'right' }) {
  const y1 = py(from);
  const y2 = py(to);
  const len = Math.abs(y2 - y1);
  const dir = y2 < y1 ? -1 : 1;
  const head = (y: number, d: number) => `${px(x)},${y} ${px(x) - 6},${y - d * 11} ${px(x) + 6},${y - d * 11}`;
  return (
    <g>
      <line x1={px(x)} x2={px(x)} y1={y1} y2={y2} stroke={color} strokeWidth={2.5} />
      {len > 24 && (
        <>
          <polygon points={head(y2, dir)} fill={color} />
          <polygon points={head(y1, -dir)} fill={color} />
        </>
      )}
      <text
        x={px(x) + (side === 'right' ? 9 : -9)}
        y={(y1 + y2) / 2 + 5}
        fontSize={15}
        fontWeight={700}
        fill={color}
        textAnchor={side === 'right' ? 'start' : 'end'}
        paintOrder="stroke"
        stroke="white"
        strokeWidth={4}
      >
        {label}
      </text>
    </g>
  );
}

export default function ActivationEnergyVisualizer() {
  const [ea, setEa] = useState(75);
  const [dh, setDh] = useState(-40);
  const [catalyst, setCatalyst] = useState(false);
  const [eaCatRaw, setEaCat] = useState(50);
  const [temperature, setTemperature] = useState(300);
  const [deltaT, setDeltaT] = useState('10');
  const [dragging, setDragging] = useState<Handle | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [catLo, catHi] = catalysedBounds(ea, dh);
  const eaCat = clamp(eaCatRaw, catLo, catHi);
  const eaRev = ea - dh;

  const changeDh = (v: number) => {
    setDh(v);
    if (ea < minEa(v)) setEa(minEa(v));
  };
  const changeEa = (v: number) => setEa(clamp(v, minEa(dh), EA_MAX));

  const handles: { id: Handle; x: number; e: number }[] = [
    { id: 'ts', x: 0.5, e: ea },
    { id: 'products', x: 0.92, e: dh },
    ...(catalyst ? [{ id: 'catalyst' as Handle, x: 0.35, e: eaCat }] : []),
  ];

  const applyDrag = (handle: Handle, energy: number) => {
    const e = Math.round(energy);
    if (handle === 'ts') changeEa(e);
    else if (handle === 'products') changeDh(clamp(e, -DH_LIMIT, DH_LIMIT));
    else setEaCat(clamp(e, catLo, catHi));
  };

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const p = toDrawingPoint(e, svgRef.current);
    let best: Handle | null = null;
    let bestD = 40;
    for (const h of handles) {
      const d = Math.hypot(px(h.x) - p.x, py(h.e) - p.y);
      if (d < bestD) {
        bestD = d;
        best = h.id;
      }
    }
    if (!best) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(best);
  };

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging || !svgRef.current) return;
    applyDrag(dragging, toEnergy(toDrawingPoint(e, svgRef.current).y));
  };

  const uncatPath = profile(uncatalysedKnots(ea, dh));
  const catPath = profile(catalysedKnots(eaCat, dh));
  const toD = (pts: Point[]) => pts.map(([x, e], i) => `${i === 0 ? 'M' : 'L'}${px(x).toFixed(1)} ${py(e).toFixed(1)}`).join(' ');
  const energyTicks = [-150, -100, -50, 0, 50, 100, 150, 200];

  const k = rateConstant(ea, temperature);
  const kCat = rateConstant(eaCat, temperature);
  const kRev = rateConstant(eaRev, temperature);
  const dT = Number(deltaT);
  const validDT = Number.isFinite(dT) && temperature + dT > 0;
  const T2 = temperature + (validDT ? dT : 0);
  const ratio = rateRatio(ea, temperature, T2);
  const ratioCat = rateRatio(eaCat, temperature, T2);
  const doublingEa = (R * Math.LN2) / (1 / temperature - 1 / (temperature + 10)) / 1000;

  const temps = Array.from({ length: 151 }, (_, i) => 250 + i * 5);
  const kCurve: Point[] = temps.map((T) => [T, rateConstant(ea, T)]);
  const kCatCurve: Point[] = temps.map((T) => [T, rateConstant(eaCat, T)]);
  const kMax = Math.max(...kCurve.map((p) => p[1]), ...(catalyst ? kCatCurve.map((p) => p[1]) : [0]));
  const invs = Array.from({ length: 61 }, (_, i) => 1 + i * 0.05);
  const lnLine: Point[] = invs.map((x) => [x, lnRateConstant(ea, 1000 / x)]);
  const lnCatLine: Point[] = invs.map((x) => [x, lnRateConstant(eaCat, 1000 / x)]);
  const lnValues = [...lnLine, ...(catalyst ? lnCatLine : [])].map((p) => p[1]);
  const lnRange: [number, number] = [Math.min(...lnValues) - 2, Math.max(...lnValues) + 2];

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <Slider label="Activation energy Ea" value={ea} min={minEa(dh)} max={EA_MAX} step={1} display={`${ea} kJ/mol`} onChange={changeEa} />
        <Slider label="Enthalpy change ΔH" value={dh} min={-DH_LIMIT} max={DH_LIMIT} step={1} display={`${dh > 0 ? '+' : ''}${dh} kJ/mol`} onChange={changeDh} />
        <div className="space-y-2">
          <Toggle checked={catalyst} onChange={setCatalyst}>
            Add a catalyst
          </Toggle>
          {catalyst && (
            <Slider label="Catalysed Ea" value={eaCat} min={catLo} max={catHi} step={1} display={`${eaCat} kJ/mol`} onChange={(v) => setEaCat(v)} />
          )}
        </div>
        <Slider label="Temperature T" value={temperature} min={250} max={1000} step={5} display={`${temperature} K`} onChange={setTemperature} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          <p className="text-sm font-medium text-ink">
            Reaction energy profile
            <span className="ml-2 font-normal text-ink-muted">(drag the peak or the products level)</span>
          </p>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className={`${responsiveSurface} touch-none select-none rounded-xl border border-line bg-white ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            role="img"
            aria-label={`Energy profile with Ea ${ea} kJ/mol and ΔH ${dh} kJ/mol`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => setDragging(null)}
            onPointerCancel={() => setDragging(null)}
          >
            {energyTicks.map((e) => (
              <g key={e}>
                <line x1={PAD.left} x2={W - PAD.right} y1={py(e)} y2={py(e)} stroke="#f1f5f9" />
                <text x={PAD.left - 8} y={py(e) + 5} fontSize={13} textAnchor="end" fill="#64748b">
                  {e}
                </text>
              </g>
            ))}
            <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={H - PAD.bottom} stroke="#334155" strokeWidth={1.5} />
            <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} stroke="#334155" strokeWidth={1.5} />
            <text x={(PAD.left + W - PAD.right) / 2} y={H - 10} fontSize={15} textAnchor="middle" fill="#334155">
              reaction coordinate
            </text>
            <text x={16} y={(PAD.top + H - PAD.bottom) / 2} fontSize={15} textAnchor="middle" fill="#334155" transform={`rotate(-90 16 ${(PAD.top + H - PAD.bottom) / 2})`}>
              energy (kJ/mol)
            </text>

            <line x1={px(0)} x2={px(0.97)} y1={py(0)} y2={py(0)} stroke={NEUTRAL} strokeWidth={1} strokeDasharray="5 5" />
            <line x1={px(0.5)} x2={px(0.97)} y1={py(dh)} y2={py(dh)} stroke={NEUTRAL} strokeWidth={1} strokeDasharray="5 5" />
            <line x1={px(0.5)} x2={px(0.68)} y1={py(ea)} y2={py(ea)} stroke={NEUTRAL} strokeWidth={1} strokeDasharray="5 5" />

            {catalyst && <path d={toD(catPath)} fill="none" stroke={CAT} strokeWidth={3} strokeDasharray="9 6" />}
            <path d={toD(uncatPath)} fill="none" stroke="#1e293b" strokeWidth={3.5} />

            <Arrow x={0.5} from={0} to={ea} color={UNCAT} label={`Ea = ${ea}`} side="left" />
            <Arrow x={0.66} from={dh} to={ea} color={NEUTRAL} label={`Ea,rev = ${eaRev}`} />
            <Arrow x={0.95} from={0} to={dh} color="#2563eb" label={`ΔH = ${dh > 0 ? '+' : ''}${dh}`} side="left" />
            {catalyst && <Arrow x={0.3} from={0} to={eaCat} color={CAT} label={`Ea,cat = ${eaCat}`} side="left" />}

            <text x={px(0.075)} y={py(0) - 10} fontSize={14} textAnchor="middle" fill="#0f172a" fontWeight={600}>
              Reactants
            </text>
            <text x={px(0.82)} y={dh >= 0 ? py(dh) - 10 : py(dh) + 22} fontSize={14} textAnchor="middle" fill="#0f172a" fontWeight={600}>
              Products
            </text>
            <text x={px(0.5)} y={py(ea) - 14} fontSize={14} textAnchor="middle" fill="#0f172a" fontWeight={600}>
              Transition state
            </text>

            {handles.map((h) => (
              <circle
                key={h.id}
                cx={px(h.x)}
                cy={py(h.e)}
                r={dragging === h.id ? 10 : 8}
                fill={h.id === 'catalyst' ? CAT : h.id === 'ts' ? UNCAT : '#2563eb'}
                stroke="white"
                strokeWidth={2.5}
              />
            ))}
          </svg>
          <Legend
            items={[
              { color: '#1e293b', label: 'uncatalysed pathway' },
              ...(catalyst ? [{ color: CAT, label: 'catalysed pathway (via an intermediate)', dashed: true }] : []),
            ]}
          />
          <p className="text-sm text-ink-muted">
            {dh < 0 ? `Exothermic: products are ${-dh} kJ/mol lower than reactants, so heat is released.` : dh > 0 ? `Endothermic: products are ${dh} kJ/mol higher than reactants, so heat is absorbed.` : 'Thermoneutral: reactants and products have the same energy.'}
            {catalyst && ' The catalyst lowers the barrier for both directions by the same amount and leaves ΔH unchanged.'}
          </p>
        </div>

        <div className="space-y-4">
          <Panel title={`Arrhenius at ${temperature} K`}>
            <dl className="space-y-1">
              <Stat label="A (assumed)" value={`${sci(PRE_EXPONENTIAL, 2)} s⁻¹`} />
              <Stat label="Ea / RT" value={fixed((ea * 1000) / (R * temperature), 2)} />
              <Stat label="k forward" value={`${sci(k, 3)} s⁻¹`} />
              <Stat label="k reverse" value={`${sci(kRev, 3)} s⁻¹`} />
              <Stat label="Slope of ln k vs 1/T" value={`${sci((-ea * 1000) / R, 4)} K`} />
              {catalyst && (
                <>
                  <Stat label="k catalysed" value={`${sci(kCat, 3)} s⁻¹`} />
                  <Stat label="Speed-up" value={`${sci(kCat / k, 3)}×`} hint="e^(ΔEa/RT)" />
                </>
              )}
            </dl>
          </Panel>
          <Panel title="Two-temperature calculator">
            <label className="flex flex-wrap items-center gap-2 text-sm text-ink">
              Raise T by
              <input
                type="number"
                value={deltaT}
                step={5}
                onChange={(e) => setDeltaT(e.target.value)}
                className="h-9 w-20 rounded-control border border-line-strong bg-white px-2 font-mono text-ink"
                aria-label="Temperature change in kelvin"
              />
              K
            </label>
            {validDT ? (
              <div className="mt-3 space-y-1 font-mono text-xs text-ink">
                <p>
                  T₁ = {temperature} K, T₂ = {T2} K
                </p>
                <p>k₂/k₁ = exp[(Ea/R)(1/T₁ − 1/T₂)]</p>
                <p>
                  = exp[{sci((ea * 1000) / R, 4)} × {sci(1 / temperature - 1 / T2, 4)}]
                </p>
                <p className="text-sm font-semibold text-brand-700">= {sci(ratio, 3)}</p>
                {catalyst && <p className="text-ink-muted">catalysed: k₂/k₁ = {sci(ratioCat, 3)}</p>}
                <p className="pt-1 font-sans text-ink-muted">
                  {ratio >= 1 ? `${sci(ratio, 3)} times faster` : `${sci(1 / ratio, 3)} times slower`} at {T2} K. A 10 K rise doubles the rate at {temperature} K only
                  when Ea ≈ {fixed(doublingEa, 1)} kJ/mol.
                </p>
              </div>
            ) : (
              <p className="mt-2 text-red-700">Enter a change that keeps T above 0 K.</p>
            )}
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink">k = A e^(−Ea/RT) against T</p>
          <LinePlot
            x={[250, 1000]}
            y={[0, kMax * 1.05]}
            xLabel="temperature T (K)"
            yLabel="k (s⁻¹)"
            ariaLabel="Rate constant against temperature"
            series={[{ points: kCurve, color: UNCAT, width: 3 }, ...(catalyst ? [{ points: kCatCurve, color: CAT, width: 3, dash: '9 6' }] : [])]}
          >
            {(sx, sy) => (
              <g>
                <line x1={sx(temperature)} x2={sx(temperature)} y1={sy(0)} y2={sy(kMax * 1.05)} stroke="#0f172a" strokeWidth={1.5} opacity={0.4} />
                <circle cx={sx(temperature)} cy={sy(Math.min(k, kMax * 1.05))} r={6} fill={UNCAT} stroke="white" strokeWidth={2} />
                {catalyst && <circle cx={sx(temperature)} cy={sy(Math.min(kCat, kMax * 1.05))} r={6} fill={CAT} stroke="white" strokeWidth={2} />}
              </g>
            )}
          </LinePlot>
          <p className="text-xs text-ink-muted">The curve rises exponentially, so at low T it looks flat on this scale. The ln k plot shows every temperature clearly.</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink">Arrhenius plot: ln k against 1/T</p>
          <LinePlot
            x={[1, 4]}
            y={lnRange}
            xLabel="1000 / T (K⁻¹)"
            yLabel="ln k"
            ariaLabel="Arrhenius plot of ln k against 1/T"
            series={[{ points: lnLine, color: UNCAT, width: 3 }, ...(catalyst ? [{ points: lnCatLine, color: CAT, width: 3, dash: '9 6' }] : [])]}
          >
            {(sx, sy) => (
              <g>
                <circle cx={sx(1000 / temperature)} cy={sy(Math.log(k))} r={6} fill={UNCAT} stroke="white" strokeWidth={2} />
                {catalyst && <circle cx={sx(1000 / temperature)} cy={sy(Math.log(kCat))} r={6} fill={CAT} stroke="white" strokeWidth={2} />}
                <text x={sx(2.5)} y={sy(lnRange[1]) + 22} fontSize={15} fill={UNCAT} fontWeight={700} textAnchor="middle">
                  {`slope = −Ea/R = ${Math.round((-ea * 1000) / R)} K`}
                </text>
              </g>
            )}
          </LinePlot>
          <Legend
            items={[
              { color: UNCAT, label: `uncatalysed, Ea = ${ea} kJ/mol` },
              ...(catalyst ? [{ color: CAT, label: `catalysed, Ea = ${eaCat} kJ/mol`, dashed: true }] : []),
            ]}
          />
        </div>
      </div>
    </div>
  );
}
