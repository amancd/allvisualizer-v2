'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Droplet, Pause, Play, RotateCcw, Target } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { INDICATORS, equivalenceVolume, indicatorColor, phAt, volumeAtPh, type Mode, type Setup } from './titration';

const MODES: { id: Mode; label: string; analyte: string; titrant: string }[] = [
  { id: 'sa-sb', label: 'Strong acid + strong base', analyte: 'HCl', titrant: 'NaOH' },
  { id: 'wa-sb', label: 'Weak acid + strong base', analyte: 'HA', titrant: 'NaOH' },
  { id: 'wb-sa', label: 'Weak base + strong acid', analyte: 'B', titrant: 'HCl' },
];

const PRESETS: Record<Exclude<Mode, 'sa-sb'>, { name: string; pk: number }[]> = {
  'wa-sb': [
    { name: 'Acetic acid (Ka 1.8 × 10⁻⁵)', pk: 4.74 },
    { name: 'Formic acid (Ka 1.8 × 10⁻⁴)', pk: 3.74 },
    { name: 'Hypochlorous acid (Ka 3.0 × 10⁻⁸)', pk: 7.52 },
  ],
  'wb-sa': [
    { name: 'Ammonia (Kb 1.8 × 10⁻⁵)', pk: 4.74 },
    { name: 'Methylamine (Kb 4.4 × 10⁻⁴)', pk: 3.36 },
    { name: 'Pyridine (Kb 1.7 × 10⁻⁹)', pk: 8.77 },
  ],
};

const DROP = 0.05;
const W = 800;
const H = 440;
const PAD = { l: 56, r: 20, t: 20, b: 52 };

function Slider({ label, value, display, min, max, step, onChange }: { label: string; value: number; display: string; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="flex justify-between gap-2 text-sm font-medium text-ink">
        {label} <span className="font-mono">{display}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full accent-brand-600" />
    </label>
  );
}

function Stat({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-mono font-semibold text-ink">{value}</dd>
    </div>
  );
}

function Apparatus({ vt, vMax, va, color, titrant, running }: { vt: number; vMax: number; va: number; color: string; titrant: string; running: boolean }) {
  const buretteTop = 20;
  const buretteBottom = 200;
  const level = buretteTop + 10 + (vt / vMax) * (buretteBottom - buretteTop - 10);
  const fill = (va + vt) / (va + vMax);
  const flaskBottom = 400;
  const liquidTop = flaskBottom - 30 - fill * 90;
  const halfWidthAt = (y: number) => (y < 290 ? 22 : 22 + ((y - 290) / (flaskBottom - 290)) * 78);
  const lw = halfWidthAt(liquidTop);
  return (
    <svg viewBox="0 0 240 420" className={`${responsiveSurface} mx-auto max-w-xs`} role="img" aria-label={`Burette has delivered ${vt.toFixed(2)} mL`}>
      <rect x={110} y={buretteTop} width={20} height={buretteBottom - buretteTop} fill="white" stroke="#334155" strokeWidth={2} />
      <rect x={112} y={level} width={16} height={buretteBottom - level} fill="#bfdbfe" />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={110} x2={i % 5 === 0 ? 100 : 104} y1={buretteTop + 10 + (i * (buretteBottom - buretteTop - 10)) / 10} y2={buretteTop + 10 + (i * (buretteBottom - buretteTop - 10)) / 10} stroke="#334155" strokeWidth={1.5} />
      ))}
      <rect x={104} y={buretteBottom} width={32} height={10} rx={3} fill="#64748b" />
      <rect x={116} y={buretteBottom + 10} width={8} height={24} fill="#cbd5e1" stroke="#334155" />
      {running && <ellipse cx={120} cy={buretteBottom + 48} rx={4} ry={6} fill="#93c5fd" />}
      <text x={140} y={buretteTop + 14} fontSize={13} fill="#334155">
        {titrant}
      </text>
      <path
        d={`M ${120 - lw} ${liquidTop} L ${120 - halfWidthAt(flaskBottom)} ${flaskBottom} L ${120 + halfWidthAt(flaskBottom)} ${flaskBottom} L ${120 + lw} ${liquidTop} Z`}
        fill={color}
      />
      <path d={`M 98 250 L 98 290 L 20 ${flaskBottom} L 220 ${flaskBottom} L 142 290 L 142 250`} fill="none" stroke="#334155" strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
}

export default function TitrationCurvesVisualizer() {
  const [mode, setMode] = useState<Mode>('wa-sb');
  const [ca, setCa] = useState(0.1);
  const [va, setVa] = useState(25);
  const [ct, setCt] = useState(0.1);
  const [pk, setPk] = useState(4.74);
  const [vt, setVt] = useState(0);
  const [running, setRunning] = useState(false);
  const [indicatorId, setIndicatorId] = useState('phenolphthalein');
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const setup: Setup = useMemo(() => ({ mode, ca, va, ct, pk }), [mode, ca, va, ct, pk]);
  const veq = equivalenceVolume(setup);
  const vMax = 2 * veq;
  const vNow = Math.min(vt, vMax);
  const indicator = INDICATORS.find((i) => i.id === indicatorId) ?? INDICATORS[0];
  const modeInfo = MODES.find((m) => m.id === mode) ?? MODES[0];
  const pH = phAt(setup, vNow);
  const pHeq = phAt(setup, veq);
  const pHhalf = phAt(setup, veq / 2);
  const isWeak = mode !== 'sa-sb';
  const halfTarget = mode === 'wa-sb' ? pk : 14 - pk;

  const curve = useMemo(() => {
    const n = 500;
    return Array.from({ length: n + 1 }, (_, i) => {
      const v = (vMax * i) / n;
      return { v, pH: phAt(setup, v) };
    });
  }, [setup, vMax]);

  const endpoint = useMemo(() => volumeAtPh(setup, (indicator.low + indicator.high) / 2, vMax), [setup, indicator, vMax]);

  const vtRef = useRef(vNow);
  useEffect(() => {
    vtRef.current = vNow;
  }, [vNow]);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = -1;
    const tick = (now: number) => {
      if (last < 0) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const distance = Math.abs(vtRef.current - veq) / veq;
      const rate = (veq / 8) * Math.max(0.06, Math.min(1, distance / 0.15));
      const next = Math.min(vMax, vtRef.current + rate * dt);
      vtRef.current = next;
      setVt(next);
      if (next >= vMax) {
        setRunning(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, veq, vMax]);

  const sx = (v: number) => PAD.l + (v / vMax) * (W - PAD.l - PAD.r);
  const sy = (p: number) => H - PAD.b - (Math.max(0, Math.min(14, p)) / 14) * (H - PAD.t - PAD.b);
  const path = (pts: { v: number; pH: number }[]) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.v).toFixed(1)} ${sy(p.pH).toFixed(1)}`).join(' ');
  const traced = [...curve.filter((p) => p.v <= vNow), { v: vNow, pH }];
  const xStep = vMax > 120 ? 50 : vMax > 60 ? 20 : vMax > 25 ? 10 : 5;
  const xTicks = Array.from({ length: Math.floor(vMax / xStep) + 1 }, (_, i) => i * xStep);

  const setFromPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const { x } = toDrawingPoint(e, svgRef.current);
    const v = ((x - PAD.l) / (W - PAD.l - PAD.r)) * vMax;
    setVt(Math.max(0, Math.min(vMax, v)));
  };

  const changeMode = (m: Mode) => {
    setMode(m);
    setVt(0);
    setRunning(false);
    if (m === 'wa-sb') setPk(4.74);
    if (m === 'wb-sa') setPk(4.74);
  };

  const presetList = mode === 'sa-sb' ? [] : PRESETS[mode];
  const presetIndex = presetList.findIndex((p) => Math.abs(p.pk - pk) < 0.005);
  const nearEq = Math.abs(vNow - veq) < Math.max(0.025, veq * 0.004);

  let region: string;
  if (vNow === 0) {
    region =
      mode === 'sa-sb'
        ? 'Only HCl in the flask: it is fully ionized, so pH = −log C.'
        : mode === 'wa-sb'
          ? 'Only the weak acid HA: a little of it ionizes, so the pH is higher than for a strong acid of the same concentration.'
          : 'Only the weak base B: it takes a little H⁺ from water, making OH⁻.';
  } else if (nearEq) {
    region =
      mode === 'sa-sb'
        ? 'Equivalence point: all H₃O⁺ has been neutralized. Only Na⁺, Cl⁻ and water remain, so pH = 7.00.'
        : mode === 'wa-sb'
          ? 'Equivalence point: all HA has become A⁻, a weak base, so the solution is basic (pH > 7).'
          : 'Equivalence point: all B has become BH⁺, a weak acid, so the solution is acidic (pH < 7).';
  } else if (vNow < veq) {
    const half = Math.abs(vNow - veq / 2) < Math.max(0.025, veq * 0.01);
    region =
      mode === 'sa-sb'
        ? 'Before equivalence: unreacted HCl sets the pH. It changes slowly at first because [H₃O⁺] only falls by a small fraction with each drop.'
        : half
          ? `Half-equivalence point: [${mode === 'wa-sb' ? 'HA] = [A⁻' : 'B] = [BH⁺'}], so pH = ${mode === 'wa-sb' ? 'pKa' : 'pKa of BH⁺'} = ${halfTarget.toFixed(2)}.`
          : `Buffer region: both ${mode === 'wa-sb' ? 'HA and A⁻' : 'B and BH⁺'} are present, so the pH resists change (Henderson-Hasselbalch).`;
  } else {
    region = `After equivalence: excess ${modeInfo.titrant} sets the pH, which levels off toward the titrant's own pH.`;
  }

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <Button key={m.id} size="sm" variant={mode === m.id ? 'primary' : 'outline'} aria-pressed={mode === m.id} onClick={() => changeMode(m.id)}>
              {m.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Slider label={`[${modeInfo.analyte}] in flask`} value={ca} display={`${ca.toFixed(3)} M`} min={0.01} max={0.5} step={0.005} onChange={setCa} />
          <Slider label="Flask volume" value={va} display={`${va} mL`} min={10} max={50} step={1} onChange={setVa} />
          <Slider label={`[${modeInfo.titrant}] in burette`} value={ct} display={`${ct.toFixed(3)} M`} min={0.01} max={0.5} step={0.005} onChange={setCt} />
          {isWeak && (
            <Slider
              label={mode === 'wa-sb' ? 'pKa of HA' : 'pKb of B'}
              value={pk}
              display={`${pk.toFixed(2)} (${mode === 'wa-sb' ? 'Ka' : 'Kb'} ${(10 ** -pk).toExponential(1)})`}
              min={2}
              max={10}
              step={0.01}
              onChange={setPk}
            />
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {isWeak && (
            <Select label={mode === 'wa-sb' ? 'Weak acid' : 'Weak base'} id="titration-preset" value={presetIndex} onChange={(e) => Number(e.target.value) >= 0 && setPk(presetList[Number(e.target.value)].pk)}>
              {presetIndex < 0 && <option value={-1}>Custom</option>}
              {presetList.map((p, i) => (
                <option key={p.name} value={i}>
                  {p.name}
                </option>
              ))}
            </Select>
          )}
          <Select label="Indicator" id="titration-indicator" value={indicatorId} onChange={(e) => setIndicatorId(e.target.value)}>
            {INDICATORS.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.name} ({ind.low}–{ind.high}, {ind.acidName} → {ind.baseName})
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => setVt((v) => Math.min(vMax, v + DROP))} disabled={vNow >= vMax} leftIcon={<Droplet className="h-4 w-4" />}>
            Add 1 drop
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setVt((v) => Math.min(vMax, v + 1))} disabled={vNow >= vMax}>
            Add 1 mL
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRunning((r) => !r)}
            disabled={vNow >= vMax}
            leftIcon={running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          >
            {running ? 'Close stopcock' : 'Open stopcock'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setVt(veq)} leftIcon={<Target className="h-4 w-4" />}>
            Jump to equivalence
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setVt(0);
              setRunning(false);
            }}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Refill and reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="mb-1 text-sm font-medium text-ink">
            pH against volume of {modeInfo.titrant} added
            <span className="ml-2 font-normal text-ink-muted">(drag on the chart to scrub)</span>
          </p>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className={`${responsiveSurface} touch-none cursor-ew-resize rounded-xl border border-line bg-white`}
            role="img"
            aria-label={`Titration curve, pH ${pH.toFixed(2)} after ${vNow.toFixed(2)} mL`}
            onPointerDown={(e) => {
              dragging.current = true;
              setRunning(false);
              e.currentTarget.setPointerCapture(e.pointerId);
              setFromPointer(e);
            }}
            onPointerMove={(e) => dragging.current && setFromPointer(e)}
            onPointerUp={() => {
              dragging.current = false;
            }}
            onPointerCancel={() => {
              dragging.current = false;
            }}
          >
            <rect x={PAD.l} y={sy(indicator.high)} width={W - PAD.l - PAD.r} height={sy(indicator.low) - sy(indicator.high)} fill={indicatorColor(indicator, (indicator.low + indicator.high) / 2)} opacity={0.35} />
            <text x={W - PAD.r - 6} y={sy(indicator.high) - 6} fontSize={15} textAnchor="end" fill="#475569">
              {indicator.name} range
            </text>
            {isWeak && (
              <>
                <rect x={sx(veq / 11)} y={PAD.t} width={sx((10 * veq) / 11) - sx(veq / 11)} height={H - PAD.t - PAD.b} fill="#22c55e" opacity={0.08} />
                <text x={sx(veq / 2)} y={PAD.t + 18} fontSize={15} textAnchor="middle" fill="#15803d">
                  buffer region
                </text>
                <line x1={PAD.l} x2={sx(veq / 2)} y1={sy(pHhalf)} y2={sy(pHhalf)} stroke="#15803d" strokeDasharray="5 5" />
                <line x1={sx(veq / 2)} x2={sx(veq / 2)} y1={sy(pHhalf)} y2={H - PAD.b} stroke="#15803d" strokeDasharray="5 5" />
                <circle cx={sx(veq / 2)} cy={sy(pHhalf)} r={6} fill="#15803d" />
                <text x={sx(veq / 2) + 10} y={sy(pHhalf) + (mode === 'wa-sb' ? 22 : -10)} fontSize={15} fill="#15803d">
                  ½ eq: pH {pHhalf.toFixed(2)}
                </text>
              </>
            )}
            {Array.from({ length: 8 }, (_, i) => i * 2).map((p) => (
              <g key={p}>
                <line x1={PAD.l} x2={W - PAD.r} y1={sy(p)} y2={sy(p)} stroke="#e5e7eb" />
                <text x={PAD.l - 8} y={sy(p) + 6} fontSize={16} textAnchor="end" fill="#64748b">
                  {p}
                </text>
              </g>
            ))}
            {xTicks.map((v) => (
              <text key={v} x={sx(v)} y={H - PAD.b + 22} fontSize={16} textAnchor="middle" fill="#64748b">
                {v}
              </text>
            ))}
            <text x={W - PAD.r} y={H - 8} fontSize={15} textAnchor="end" fill="#64748b">
              mL {modeInfo.titrant} added
            </text>
            <text x={14} y={PAD.t + 10} fontSize={15} fill="#64748b">
              pH
            </text>
            <line x1={sx(veq)} x2={sx(veq)} y1={PAD.t} y2={H - PAD.b} stroke="#7c3aed" strokeDasharray="6 5" strokeWidth={1.5} />
            <circle cx={sx(veq)} cy={sy(pHeq)} r={6} fill="#7c3aed" />
            <text x={sx(veq) + 8} y={sy(pHeq) + (mode === 'wb-sa' ? 22 : -10)} fontSize={15} fill="#6d28d9">
              equivalence: pH {pHeq.toFixed(2)}
            </text>
            {endpoint !== null && (
              <line x1={sx(endpoint)} x2={sx(endpoint)} y1={sy(indicator.high) - 4} y2={sy(indicator.low) + 4} stroke="#0f172a" strokeWidth={3} />
            )}
            <path d={path(curve)} fill="none" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="6 6" />
            <path d={path(traced)} fill="none" stroke="#2563eb" strokeWidth={3.5} strokeLinejoin="round" />
            <circle cx={sx(vNow)} cy={sy(pH)} r={8} fill="#2563eb" stroke="white" strokeWidth={2} />
            <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={H - PAD.b} stroke="#334155" strokeWidth={1.5} />
            <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="#334155" strokeWidth={1.5} />
          </svg>
          <p className="mt-3 rounded-xl border border-line bg-subtle p-3 text-sm leading-relaxed text-ink" aria-live="polite">
            {region}
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <Apparatus vt={vNow} vMax={vMax} va={va} color={indicatorColor(indicator, pH)} titrant={`${ct.toFixed(3)} M ${modeInfo.titrant}`} running={running} />
          <div className="rounded-xl border border-line bg-subtle p-4">
            <dl className="space-y-1">
              <Stat label={`${modeInfo.titrant} added`} value={`${vNow.toFixed(2)} mL`} />
              <Stat label="pH" value={pH.toFixed(2)} />
              <Stat label={`${modeInfo.analyte} at start`} value={`${(ca * va).toFixed(3)} mmol`} />
              <Stat label={`${modeInfo.titrant} added`} value={`${(ct * vNow).toFixed(3)} mmol`} />
              <Stat label="Equivalence volume" value={`${veq.toFixed(2)} mL`} />
              <Stat label="pH at equivalence" value={pHeq.toFixed(2)} />
              {isWeak && <Stat label={`pH at ½ eq (${mode === 'wa-sb' ? 'pKa' : 'pKa of BH⁺'} ${halfTarget.toFixed(2)})`} value={pHhalf.toFixed(2)} />}
            </dl>
          </div>
          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="font-semibold text-ink">{indicator.name}</p>
            <p className="mt-1 text-ink-muted">
              {endpoint === null
                ? 'Its colour change range is never crossed in this titration.'
                : `Changes colour at about ${endpoint.toFixed(2)} mL, ${Math.abs(endpoint - veq) <= Math.max(0.05, veq * 0.005) ? 'within a drop of' : `${Math.abs(endpoint - veq).toFixed(2)} mL ${endpoint < veq ? 'before' : 'after'}`} the equivalence point. ${Math.abs(endpoint - veq) <= Math.max(0.1, veq * 0.01) ? 'A good choice here.' : 'A poor choice for this titration.'}`}
            </p>
            {veq > 50 && <p className="mt-2 text-ink-muted">This titration needs {veq.toFixed(0)} mL of titrant, more than one 50 mL burette.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
