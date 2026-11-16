'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { CATEGORY_LABELS, ELEMENTS, NOBLE_GAS_NUMBERS, type ChemicalElement } from '../_atomic-structure/elements';

type PropertyKey = 'covalentRadius' | 'ionizationEnergy' | 'electronegativity' | 'electronAffinity';

interface PropertyInfo {
  label: string;
  short: string;
  unit: string;
  digits: number;
  across: string;
  down: string;
  note: string;
}

const PROPERTIES: Record<PropertyKey, PropertyInfo> = {
  covalentRadius: {
    label: 'Atomic radius (covalent)',
    short: 'Radius',
    unit: 'pm',
    digits: 0,
    across: 'Decreases across a period',
    down: 'Increases down a group',
    note: 'Across a period each new electron joins the same shell while the nuclear charge rises, so the effective nuclear charge pulls the shell in. Down a group each period adds a new, larger shell. Values are single-bond covalent radii (Cordero et al., 2008); for the noble gases they are estimates.',
  },
  ionizationEnergy: {
    label: 'First ionization energy',
    short: 'Ionization energy',
    unit: 'kJ/mol',
    digits: 1,
    across: 'Increases across a period',
    down: 'Decreases down a group',
    note: 'Smaller atoms hold their outer electron more tightly. Look for the small dips at group 13 (B, Al: the electron comes from a higher-energy p subshell) and at group 16 (O, S: the electron removed is a paired one, pushed out by repulsion).',
  },
  electronegativity: {
    label: 'Electronegativity (Pauling)',
    short: 'Electronegativity',
    unit: '',
    digits: 2,
    across: 'Increases across a period',
    down: 'Decreases down a group',
    note: 'Electronegativity measures how strongly an atom attracts shared electrons in a bond. Fluorine is highest at 3.98, caesium and francium lowest. Most noble gases form no bonds, so they have no Pauling value.',
  },
  electronAffinity: {
    label: 'Electron affinity',
    short: 'Electron affinity',
    unit: 'kJ/mol',
    digits: 1,
    across: 'Generally increases toward the halogens',
    down: 'Varies down a group, with no single trend',
    note: 'Energy released when a gaseous atom gains an electron. The halogens release the most; chlorine (349) beats fluorine (328) because fluorine’s tiny 2p shell is crowded. Elements whose anion is unstable (noble gases, group 2, N, Mn, Zn, Cd, Hg) and most f-block elements show no data.',
  },
};

const PROPERTY_KEYS = Object.keys(PROPERTIES) as PropertyKey[];

const STOPS = [
  [68, 1, 84],
  [59, 82, 139],
  [33, 145, 140],
  [94, 201, 98],
  [253, 231, 37],
];

function colorFor(t: number) {
  const x = Math.min(1, Math.max(0, t)) * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(x));
  const f = x - i;
  const rgb = STOPS[i].map((c, k) => Math.round(c + (STOPS[i + 1][k] - c) * f));
  const lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return { bg: `rgb(${rgb.join(',')})`, fg: lum > 0.55 ? '#0b1020' : '#ffffff' };
}

function format(value: number | null, info: PropertyInfo) {
  if (value === null) return 'no data';
  return `${value.toFixed(info.digits)}${info.unit ? ` ${info.unit}` : ''}`;
}

function niceTicks(min: number, max: number, count = 5) {
  const raw = (max - min) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + 1e-9; v += step) ticks.push(Number(v.toFixed(6)));
  return ticks;
}

const CHART = { w: 800, h: 300, left: 60, right: 16, top: 20, bottom: 40 };

function TrendChart({ prop, range, selected, onSelect }: { prop: PropertyKey; range: [number, number]; selected: number; onSelect: (z: number) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const info = PROPERTIES[prop];
  const ticks = niceTicks(Math.min(0, range[0]), range[1]);
  const yMin = Math.min(0, range[0], ticks[0]);
  const yMax = Math.max(range[1], ticks[ticks.length - 1]);
  const sx = (z: number) => CHART.left + ((z - 1) / 117) * (CHART.w - CHART.left - CHART.right);
  const sy = (v: number) => CHART.h - CHART.bottom - ((v - yMin) / (yMax - yMin)) * (CHART.h - CHART.top - CHART.bottom);

  const segments: string[] = [];
  let current = '';
  for (const el of ELEMENTS) {
    const v = el[prop];
    if (v === null) {
      if (current) segments.push(current);
      current = '';
      continue;
    }
    current += `${current ? 'L' : 'M'} ${sx(el.z).toFixed(1)} ${sy(v).toFixed(1)} `;
  }
  if (current) segments.push(current);

  const sel = ELEMENTS[selected - 1];
  const selValue = sel[prop];

  const pick = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const { x } = toDrawingPoint(e, svgRef.current);
    const z = Math.round(((x - CHART.left) / (CHART.w - CHART.left - CHART.right)) * 117 + 1);
    onSelect(Math.min(118, Math.max(1, z)));
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${CHART.w} ${CHART.h}`}
      className={`${responsiveSurface} cursor-crosshair rounded-xl border border-line bg-white`}
      role="img"
      aria-label={`${info.label} plotted against atomic number`}
      onPointerDown={pick}
      onPointerMove={(e) => {
        if (e.buttons === 1) pick(e);
      }}
    >
      {ticks.map((t) => (
        <g key={t}>
          <line x1={CHART.left} x2={CHART.w - CHART.right} y1={sy(t)} y2={sy(t)} stroke="#f1f5f9" />
          <text x={CHART.left - 6} y={sy(t) + 4} fontSize={12} textAnchor="end" fill="#64748b">
            {t}
          </text>
        </g>
      ))}
      {yMin < 0 && <line x1={CHART.left} x2={CHART.w - CHART.right} y1={sy(0)} y2={sy(0)} stroke="#94a3b8" />}
      {NOBLE_GAS_NUMBERS.map((z) => (
        <g key={z}>
          <line x1={sx(z)} x2={sx(z)} y1={CHART.top} y2={CHART.h - CHART.bottom} stroke="#e2e8f0" strokeDasharray="4 4" />
          <text x={sx(z)} y={CHART.h - CHART.bottom + 16} fontSize={12} textAnchor="middle" fill="#475569">
            {ELEMENTS[z - 1].symbol}
          </text>
          <text x={sx(z)} y={CHART.h - CHART.bottom + 30} fontSize={10} textAnchor="middle" fill="#94a3b8">
            {z}
          </text>
        </g>
      ))}
      {segments.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#6366f1" strokeWidth={1.8} strokeLinejoin="round" />
      ))}
      {ELEMENTS.filter((el) => el[prop] !== null && el.group === 1).map((el) => (
        <circle key={el.z} cx={sx(el.z)} cy={sy(el[prop] as number)} r={3.5} fill="#f59e0b" />
      ))}
      <line x1={sx(selected)} x2={sx(selected)} y1={CHART.top} y2={CHART.h - CHART.bottom} stroke="#0f172a" strokeWidth={1} />
      {selValue !== null && (
        <>
          <circle cx={sx(selected)} cy={sy(selValue)} r={6} fill="#0f172a" />
          <text x={Math.min(CHART.w - 80, sx(selected) + 8)} y={Math.max(CHART.top + 12, sy(selValue) - 8)} fontSize={13} fontWeight={700} fill="#0f172a">
            {sel.symbol} {selValue.toFixed(info.digits)}
          </text>
        </>
      )}
      <line x1={CHART.left} x2={CHART.w - CHART.right} y1={CHART.h - CHART.bottom} y2={CHART.h - CHART.bottom} stroke="#334155" strokeWidth={1.5} />
      <line x1={CHART.left} x2={CHART.left} y1={CHART.top} y2={CHART.h - CHART.bottom} stroke="#334155" strokeWidth={1.5} />
      <text x={16} y={(CHART.top + CHART.h - CHART.bottom) / 2} fontSize={12} fill="#334155" textAnchor="middle" transform={`rotate(-90 16 ${(CHART.top + CHART.h - CHART.bottom) / 2})`}>
        {info.short}
        {info.unit ? ` (${info.unit})` : ''}
      </text>
    </svg>
  );
}

function rankOf(el: ChemicalElement, prop: PropertyKey) {
  const v = el[prop];
  if (v === null) return null;
  const values = ELEMENTS.map((e) => e[prop]).filter((x): x is number => x !== null);
  return { rank: values.filter((x) => x > v).length + 1, of: values.length };
}

export default function PeriodicTrendsVisualizer() {
  const [prop, setProp] = useState<PropertyKey>('ionizationEnergy');
  const [selected, setSelected] = useState(17);
  const [hovered, setHovered] = useState<number | null>(null);
  const info = PROPERTIES[prop];

  const range = useMemo<[number, number]>(() => {
    const values = ELEMENTS.map((e) => e[prop]).filter((x): x is number => x !== null);
    return [Math.min(...values), Math.max(...values)];
  }, [prop]);

  const focusZ = hovered ?? selected;
  const focus = ELEMENTS[focusZ - 1];
  const sel = ELEMENTS[selected - 1];
  const rank = rankOf(focus, prop);

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Colour the table by</p>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_KEYS.map((k) => (
            <Button key={k} size="sm" variant={prop === k ? 'primary' : 'outline'} aria-pressed={prop === k} onClick={() => setProp(k)}>
              {PROPERTIES[k].label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5 text-ink">
          <ArrowRight className="h-4 w-4 text-brand-600" /> {info.across}
        </span>
        <span className="flex items-center gap-1.5 text-ink">
          <ArrowDown className="h-4 w-4 text-brand-600" /> {info.down}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-subtle p-2">
        <div
          className="grid min-w-[46rem] gap-0.5"
          style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gridTemplateRows: 'repeat(7, auto) 0.6rem repeat(2, auto)' }}
          onPointerLeave={() => setHovered(null)}
        >
          {ELEMENTS.map((el) => {
            const v = el[prop];
            const c = v === null ? null : colorFor((v - range[0]) / (range[1] - range[0]));
            const isSelected = el.z === selected;
            const related = !isSelected && ((el.period === sel.period && el.row === sel.row) || (sel.group !== null && el.group === sel.group));
            return (
              <button
                key={el.z}
                type="button"
                onClick={() => setSelected(el.z)}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') setHovered(el.z);
                }}
                onFocus={() => setHovered(el.z)}
                onBlur={() => setHovered(null)}
                aria-pressed={isSelected}
                aria-label={`${el.name}, ${format(v, info)}`}
                className={`flex aspect-square min-w-0 flex-col items-center justify-center rounded-[3px] leading-none transition-transform hover:z-10 hover:scale-110 ${
                  isSelected ? 'z-10 ring-2 ring-ink ring-offset-1' : related ? 'ring-1 ring-ink/40' : ''
                }`}
                style={{
                  gridColumn: el.column,
                  gridRow: el.row,
                  background: c ? c.bg : '#e5e7eb',
                  color: c ? c.fg : '#6b7280',
                }}
              >
                <span className="text-[0.55rem] opacity-80">{el.z}</span>
                <span className="text-xs font-bold sm:text-sm">{el.symbol}</span>
                <span className="hidden text-[0.5rem] opacity-90 md:block">{v === null ? '–' : v.toFixed(prop === 'electronegativity' ? 2 : 0)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-muted">
        <span>{format(range[0], info)}</span>
        <span
          className="h-3 min-w-[8rem] flex-1 rounded-full sm:max-w-sm"
          style={{ background: `linear-gradient(to right, ${STOPS.map((s) => `rgb(${s.join(',')})`).join(', ')})` }}
        />
        <span>{format(range[1], info)}</span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-gray-200" /> no data
        </span>
        <span>Outlined: the selected element&apos;s period and group.</span>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-3 text-sm">
          <div className="rounded-xl border border-line bg-subtle p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-brand-300 bg-white">
                <span className="text-xs text-ink-muted">{focus.z}</span>
                <span className="text-xl font-bold text-ink">{focus.symbol}</span>
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold text-ink">{focus.name}</p>
                <p className="text-ink-muted">{CATEGORY_LABELS[focus.category]}</p>
                <p className="text-ink-muted">
                  Period {focus.period}, {focus.group ? `group ${focus.group}` : 'f-block'}, {focus.block}-block
                </p>
              </div>
            </div>
            <dl className="mt-3 space-y-1">
              <div className="flex flex-wrap justify-between gap-x-3">
                <dt className="text-ink-muted">Atomic mass</dt>
                <dd className="font-mono font-semibold text-ink">{focus.mass}</dd>
              </div>
              {PROPERTY_KEYS.map((k) => (
                <div key={k} className={`flex flex-wrap justify-between gap-x-3 ${k === prop ? 'font-semibold text-brand-700' : ''}`}>
                  <dt className={k === prop ? '' : 'text-ink-muted'}>{PROPERTIES[k].short}</dt>
                  <dd className="font-mono text-ink">{format(focus[k], PROPERTIES[k])}</dd>
                </div>
              ))}
            </dl>
            {rank && (
              <p className="mt-2 text-ink-muted">
                Rank {rank.rank} of {rank.of} elements with data for {info.short.toLowerCase()}.
              </p>
            )}
            {hovered !== null && hovered !== selected && <p className="mt-2 text-xs text-ink-faint">Previewing. Tap or click to select.</p>}
          </div>
          <p className="text-ink-muted">{info.note}</p>
        </div>
        <div className="min-w-0 lg:col-span-2">
          <p className="mb-1 text-sm font-medium text-ink">
            {info.label} vs atomic number <span className="font-normal text-ink-muted">(tap to select; orange dots are the alkali metals, dashed lines the noble gases)</span>
          </p>
          <TrendChart prop={prop} range={range} selected={selected} onSelect={setSelected} />
        </div>
      </div>
    </div>
  );
}
