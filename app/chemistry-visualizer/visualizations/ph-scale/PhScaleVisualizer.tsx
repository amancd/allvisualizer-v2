'use client';

import { useMemo, useState } from 'react';
import { Button, Select } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { KW, formatSci, speciate } from '../_equilibrium/acidBase';

type Kind = 'strongAcid' | 'weakAcid' | 'strongBase' | 'weakBase';

interface Compound {
  name: string;
  formula: string;
  k?: number;
  ion: [string, string];
}

const COMPOUNDS: Record<Kind, Compound[]> = {
  strongAcid: [
    { name: 'Hydrochloric acid', formula: 'HCl', ion: ['H₃O⁺', 'Cl⁻'] },
    { name: 'Nitric acid', formula: 'HNO₃', ion: ['H₃O⁺', 'NO₃⁻'] },
  ],
  weakAcid: [
    { name: 'Acetic acid', formula: 'CH₃COOH', k: 1.8e-5, ion: ['H₃O⁺', 'CH₃COO⁻'] },
    { name: 'Formic acid', formula: 'HCOOH', k: 1.8e-4, ion: ['H₃O⁺', 'HCOO⁻'] },
    { name: 'Hydrofluoric acid', formula: 'HF', k: 6.8e-4, ion: ['H₃O⁺', 'F⁻'] },
    { name: 'Hypochlorous acid', formula: 'HOCl', k: 3.0e-8, ion: ['H₃O⁺', 'OCl⁻'] },
    { name: 'Hydrocyanic acid', formula: 'HCN', k: 4.9e-10, ion: ['H₃O⁺', 'CN⁻'] },
  ],
  strongBase: [
    { name: 'Sodium hydroxide', formula: 'NaOH', ion: ['Na⁺', 'OH⁻'] },
    { name: 'Potassium hydroxide', formula: 'KOH', ion: ['K⁺', 'OH⁻'] },
  ],
  weakBase: [
    { name: 'Ammonia', formula: 'NH₃', k: 1.8e-5, ion: ['NH₄⁺', 'OH⁻'] },
    { name: 'Methylamine', formula: 'CH₃NH₂', k: 4.4e-4, ion: ['CH₃NH₃⁺', 'OH⁻'] },
    { name: 'Pyridine', formula: 'C₅H₅N', k: 1.7e-9, ion: ['C₅H₅NH⁺', 'OH⁻'] },
  ],
};

const KINDS: { id: Kind; label: string }[] = [
  { id: 'strongAcid', label: 'Strong acid' },
  { id: 'weakAcid', label: 'Weak acid' },
  { id: 'strongBase', label: 'Strong base' },
  { id: 'weakBase', label: 'Weak base' },
];

const SUBSTANCES = [
  { name: 'Battery acid', pH: 0.8 },
  { name: 'Stomach acid', pH: 1.5 },
  { name: 'Lemon juice', pH: 2.3 },
  { name: 'Vinegar', pH: 2.9 },
  { name: 'Orange juice', pH: 3.5 },
  { name: 'Tomato juice', pH: 4.2 },
  { name: 'Black coffee', pH: 5.0 },
  { name: 'Clean rain', pH: 5.6 },
  { name: 'Milk', pH: 6.7 },
  { name: 'Pure water (25 °C)', pH: 7.0 },
  { name: 'Blood', pH: 7.4 },
  { name: 'Seawater', pH: 8.1 },
  { name: 'Baking soda solution', pH: 8.3 },
  { name: 'Milk of magnesia', pH: 10.5 },
  { name: 'Household ammonia', pH: 11.6 },
  { name: 'Bleach', pH: 12.5 },
  { name: 'Drain cleaner', pH: 14.0 },
];

const INDICATOR = ['#b91c1c', '#dc2626', '#ef4444', '#f97316', '#fb923c', '#facc15', '#eab308', '#22c55e', '#16a34a', '#0d9488', '#0284c7', '#2563eb', '#4f46e5', '#6d28d9', '#7c3aed'];

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function indicatorColor(pH: number) {
  const x = Math.max(0, Math.min(14, pH));
  const i = Math.min(13, Math.floor(x));
  const f = x - i;
  const a = hexToRgb(INDICATOR[i]);
  const b = hexToRgb(INDICATOR[i + 1]);
  const mix = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `rgb(${mix.join(', ')})`;
}

function hash(n: number) {
  const s = Math.sin(n * 91.7 + 47.3) * 43758.5453;
  return s - Math.floor(s);
}

const SCALE_W = 800;
const SCALE_H = 170;
const BAR = { x: 30, w: 740, y: 70, h: 30 };
const px = (pH: number) => BAR.x + (pH / 14) * BAR.w;

function PhBar({ pH, highlighted }: { pH: number; highlighted: number | null }) {
  return (
    <svg viewBox={`0 0 ${SCALE_W} ${SCALE_H}`} className={responsiveSurface} role="img" aria-label={`pH scale, current pH ${pH.toFixed(2)}`}>
      <defs>
        <linearGradient id="ph-gradient" x1="0" x2="1" y1="0" y2="0">
          {INDICATOR.map((c, i) => (
            <stop key={i} offset={`${(i / 14) * 100}%`} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <rect x={BAR.x} y={BAR.y} width={BAR.w} height={BAR.h} rx={6} fill="url(#ph-gradient)" />
      {Array.from({ length: 15 }, (_, i) => (
        <g key={i}>
          <line x1={px(i)} x2={px(i)} y1={BAR.y + BAR.h} y2={BAR.y + BAR.h + 6} stroke="#334155" strokeWidth={2} />
          <text x={px(i)} y={BAR.y + BAR.h + 24} fontSize={17} textAnchor="middle" fill="#334155">
            {i}
          </text>
        </g>
      ))}
      {SUBSTANCES.map((s, i) => (
        <g key={s.name}>
          <line x1={px(s.pH)} x2={px(s.pH)} y1={BAR.y - 10 - (i % 2) * 24} y2={BAR.y} stroke={highlighted === i ? '#0f172a' : '#64748b'} strokeWidth={highlighted === i ? 3 : 1.5} />
          <circle cx={px(s.pH)} cy={BAR.y - 14 - (i % 2) * 24} r={highlighted === i ? 12 : 10} fill="white" stroke={highlighted === i ? '#0f172a' : '#64748b'} strokeWidth={2} />
          <text x={px(s.pH)} y={BAR.y - 10 - (i % 2) * 24} fontSize={12} fontWeight={700} textAnchor="middle" fill="#0f172a">
            {i + 1}
          </text>
        </g>
      ))}
      <text x={BAR.x} y={18} fontSize={16} fill="#b91c1c" fontWeight={600}>
        more acidic
      </text>
      <text x={BAR.x + BAR.w} y={18} fontSize={16} fill="#6d28d9" fontWeight={600} textAnchor="end">
        more basic
      </text>
      <polygon points={`${px(pH)},${BAR.y + BAR.h + 32} ${px(pH) - 12},${BAR.y + BAR.h + 52} ${px(pH) + 12},${BAR.y + BAR.h + 52}`} fill="#0f172a" />
      <text x={Math.max(60, Math.min(SCALE_W - 60, px(pH)))} y={BAR.y + BAR.h + 72} fontSize={18} fontWeight={700} textAnchor="middle" fill="#0f172a">
        pH {pH.toFixed(2)}
      </text>
    </svg>
  );
}

const UNITS = 24;

function Beaker({ kind, compound, fraction, pH }: { kind: Kind; compound: Compound; fraction: number; pH: number }) {
  const ionized = Math.round(fraction * UNITS);
  const isAcid = kind === 'strongAcid' || kind === 'weakAcid';
  const isWeak = kind === 'weakAcid' || kind === 'weakBase';
  const [ionA, ionB] = compound.ion;
  const items: { x: number; y: number; type: 'whole' | 'a' | 'b' }[] = [];
  const left = 50;
  const width = 260;
  const top = 80;
  const height = 200;
  for (let k = 0; k < UNITS; k++) {
    const col = k % 6;
    const row = Math.floor(k / 6);
    const x = left + 22 + col * (width - 44) / 5 + (hash(k) - 0.5) * 14;
    const y = top + 26 + row * (height - 52) / 3 + (hash(k + 50) - 0.5) * 14;
    if (k < ionized) {
      items.push({ x: x - 9, y: y - 6, type: 'a' });
      items.push({ x: x + 9, y: y + 6, type: 'b' });
    } else {
      items.push({ x, y, type: 'whole' });
    }
  }
  const fill = indicatorColor(pH);
  const colA = isAcid ? '#dc2626' : '#7c3aed';
  const colB = isAcid ? '#2563eb' : '#0891b2';

  return (
    <svg viewBox="0 0 360 330" className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label={`${ionized} of ${UNITS} formula units ionized`}>
      <path d={`M ${left} 50 L ${left} ${top + height + 10} Q ${left} ${top + height + 30} ${left + 20} ${top + height + 30} L ${left + width - 20} ${top + height + 30} Q ${left + width} ${top + height + 30} ${left + width} ${top + height + 10} L ${left + width} 50`} fill="none" stroke="#334155" strokeWidth={4} />
      <rect x={left + 2} y={top - 10} width={width - 4} height={height + 38} fill={fill} opacity={0.22} />
      {items.map((it, i) =>
        it.type === 'whole' ? (
          <g key={i}>
            <circle cx={it.x} cy={it.y} r={11} fill={isAcid ? '#93c5fd' : '#c4b5fd'} stroke="#334155" strokeWidth={1.5} />
            <circle cx={it.x + 10} cy={it.y - 7} r={6} fill={isAcid ? '#fca5a5' : '#e2e8f0'} stroke="#334155" strokeWidth={1.5} />
          </g>
        ) : (
          <circle key={i} cx={it.x} cy={it.y} r={it.type === 'a' ? 7 : 9} fill={it.type === 'a' ? colA : colB} stroke="#334155" strokeWidth={1} />
        ),
      )}
      <text x={180} y={22} fontSize={15} textAnchor="middle" fill="#334155" fontWeight={600}>
        {ionized} of {UNITS} {compound.formula} units ionized
      </text>
      <circle cx={30} cy={318} r={6} fill={colA} />
      <text x={40} y={323} fontSize={13} fill="#334155">
        {isAcid ? ionA : ionB}
      </text>
      <circle cx={130} cy={318} r={7} fill={colB} />
      <text x={141} y={323} fontSize={13} fill="#334155">
        {isAcid ? ionB : ionA}
      </text>
      <circle cx={250} cy={318} r={7} fill={isAcid ? '#93c5fd' : '#c4b5fd'} stroke="#334155" />
      <text x={261} y={323} fontSize={13} fill="#334155">
        {isWeak ? compound.formula : 'none left'}
      </text>
    </svg>
  );
}

function Stat({ label, value, hint }: { label: React.ReactNode; value: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-mono font-semibold text-ink">
        {value}
        {hint && <span className="ml-1 text-xs font-normal text-ink-faint">{hint}</span>}
      </dd>
    </div>
  );
}

export default function PhScaleVisualizer() {
  const [kind, setKind] = useState<Kind>('weakAcid');
  const [compoundIndex, setCompoundIndex] = useState(0);
  const [pK, setPK] = useState(-Math.log10(1.8e-5));
  const [logC, setLogC] = useState(-1);
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const compound = COMPOUNDS[kind][compoundIndex] ?? COMPOUNDS[kind][0];
  const isWeak = kind === 'weakAcid' || kind === 'weakBase';
  const isAcid = kind === 'strongAcid' || kind === 'weakAcid';
  const K = 10 ** -pK;
  const C = 10 ** logC;
  const preset = compound.k !== undefined && Math.abs(-Math.log10(compound.k) - pK) < 0.005;

  const result = useMemo(() => {
    const mix =
      kind === 'strongAcid'
        ? { strongAcid: C }
        : kind === 'strongBase'
          ? { strongBase: C }
          : kind === 'weakAcid'
            ? { weakAcid: C, ka: K }
            : { weakBase: C, kb: K };
    return speciate(mix);
  }, [kind, C, K]);

  const fraction = kind === 'weakAcid' ? result.conjugateBase / C : kind === 'weakBase' ? result.conjugateAcid / C : 1;
  const fromWater = isAcid ? result.oh : result.h;
  const naive = kind === 'strongAcid' ? logC * -1 : kind === 'strongBase' ? 14 + logC : kind === 'weakAcid' ? -Math.log10(Math.sqrt(K * C)) : 14 + Math.log10(Math.sqrt(K * C));
  const ionizedCount = Math.round(fraction * UNITS);

  const chooseKind = (k: Kind) => {
    setKind(k);
    setCompoundIndex(0);
    const first = COMPOUNDS[k][0];
    if (first.k) setPK(-Math.log10(first.k));
  };

  const chooseCompound = (i: number) => {
    setCompoundIndex(i);
    const c = COMPOUNDS[kind][i];
    if (c.k) setPK(-Math.log10(c.k));
  };

  const kLabel = kind === 'weakBase' ? 'Kb' : 'Ka';
  const pKLabel = kind === 'weakBase' ? 'pKb' : 'pKa';

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <Button key={k.id} size="sm" variant={kind === k.id ? 'primary' : 'outline'} aria-pressed={kind === k.id} onClick={() => chooseKind(k.id)}>
              {k.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="Compound" id="ph-compound" value={compoundIndex} onChange={(e) => chooseCompound(Number(e.target.value))}>
            {COMPOUNDS[kind].map((c, i) => (
              <option key={c.formula} value={i}>
                {c.name} ({c.formula}){c.k ? `, ${kind === 'weakBase' ? 'Kb' : 'Ka'} = ${formatSci(c.k, 1)}` : ''}
              </option>
            ))}
          </Select>
          <label className="block">
            <span className="flex justify-between text-sm font-medium text-ink">
              Concentration <span className="font-mono">{formatSci(C)} M</span>
            </span>
            <input type="range" min={-8} max={0} step={0.05} value={logC} onChange={(e) => setLogC(Number(e.target.value))} className="mt-2 w-full accent-brand-600" />
            <span className="flex justify-between text-xs text-ink-faint">
              <span>10⁻⁸ M</span>
              <span>1 M</span>
            </span>
          </label>
          {isWeak && (
            <label className="block">
              <span className="flex justify-between text-sm font-medium text-ink">
                {kLabel} <span className="font-mono">{formatSci(K)}{preset ? '' : ' (custom)'}</span>
              </span>
              <input type="range" min={1} max={12} step={0.01} value={pK} onChange={(e) => setPK(Number(e.target.value))} className="mt-2 w-full accent-brand-600" />
              <span className="flex justify-between text-xs text-ink-faint">
                <span>stronger ({pKLabel} 1)</span>
                <span>weaker ({pKLabel} 12)</span>
              </span>
            </label>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-line p-2 sm:p-4">
        <PhBar pH={result.pH} highlighted={highlighted} />
        <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {SUBSTANCES.map((s, i) => (
            <li key={s.name}>
              <button
                type="button"
                onMouseEnter={() => setHighlighted(i)}
                onMouseLeave={() => setHighlighted(null)}
                onFocus={() => setHighlighted(i)}
                onBlur={() => setHighlighted(null)}
                className="flex w-full items-center gap-2 rounded px-1 py-0.5 text-left text-ink-muted hover:bg-subtle hover:text-ink"
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line-strong text-[10px] font-bold text-ink">{i + 1}</span>
                <span className="inline-block h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: indicatorColor(s.pH) }} />
                <span className="flex-1">{s.name}</span>
                <span className="font-mono text-ink">≈ {s.pH.toFixed(1)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-sm font-medium text-ink">
            In the beaker
            <span className="ml-2 font-normal text-ink-muted">(a sample of {UNITS} dissolved units; tint = universal indicator)</span>
          </p>
          <Beaker kind={kind} compound={compound} fraction={fraction} pH={result.pH} />
          {isWeak && ionizedCount === 0 && fraction > 0 && (
            <p className="mt-2 text-sm text-ink-muted">Fewer than 1 in {UNITS} units is ionized ({(fraction * 100).toPrecision(2)}%), so none show as ions here.</p>
          )}
        </div>
        <div className="space-y-4 text-sm">
          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="mb-2 font-semibold text-ink">
              {formatSci(C)} M {compound.formula}
            </p>
            <dl className="space-y-1">
              <Stat label="pH" value={result.pH.toFixed(3)} />
              <Stat label="pOH" value={result.pOH.toFixed(3)} hint={`(pH + pOH = ${(result.pH + result.pOH).toFixed(2)})`} />
              <Stat label="[H₃O⁺]" value={`${formatSci(result.h)} M`} />
              <Stat label="[OH⁻]" value={`${formatSci(result.oh)} M`} />
              <Stat label="[H₃O⁺][OH⁻]" value={formatSci(result.h * result.oh)} hint={`(Kw = ${formatSci(KW, 1)})`} />
              <Stat label="Percent ionized" value={`${(fraction * 100).toPrecision(3)}%`} />
              {isWeak && <Stat label={pKLabel} value={pK.toFixed(2)} />}
            </dl>
          </div>
          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="mb-2 font-semibold text-ink">Where the ions come from</p>
            <dl className="space-y-1">
              <Stat label={isAcid ? 'H₃O⁺ from water' : 'OH⁻ from water'} value={`${formatSci(fromWater)} M`} />
              <Stat label={isAcid ? 'H₃O⁺ from the acid' : 'OH⁻ from the base'} value={`${formatSci(Math.max(0, (isAcid ? result.h : result.oh) - fromWater))} M`} />
              <Stat label={isWeak ? 'Simple estimate √(KC)' : 'Simple estimate −log C'} value={`pH ${naive.toFixed(2)}`} />
            </dl>
            <p className="mt-2 text-ink-muted">
              {Math.abs(naive - result.pH) > 0.05
                ? C < 1e-6
                  ? `The solution is so dilute that water's own ions matter. The simple estimate is off by ${Math.abs(naive - result.pH).toFixed(2)} pH units; the exact charge-balance solution stays on the correct side of 7.`
                  : `The simple estimate is off by ${Math.abs(naive - result.pH).toFixed(2)} pH units because so much of the ${isAcid ? 'acid' : 'base'} ionizes that x ≪ C no longer holds.`
                : 'The simple estimate agrees with the exact charge-balance result to within 0.05 pH units here.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
