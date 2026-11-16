'use client';

import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Select } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { CPK } from '../_chemical-bonding/cpk';
import { DEFAULT_VIEW, apply, project, scale, useDragRotation, type Projection, type Vec3 } from '../_chemical-bonding/molecule3d';
import {
  BOND_LABEL,
  ELEMENTS,
  EN,
  EN_SCALE_MAX,
  IONIC_LIMIT,
  MOLECULES,
  NONPOLAR_LIMIT,
  QUICK_PAIRS,
  bondDipole,
  classify,
  netDipole,
  percentIonic,
  type BondType,
} from './polarity';

const enDiff = (center: string, ligand: string) => (EN[ligand] ?? 0) - (EN[center] ?? 0);

const TYPE_STYLE: Record<BondType, string> = {
  nonpolar: 'bg-emerald-100 text-emerald-800',
  polar: 'bg-amber-100 text-amber-800',
  ionic: 'bg-rose-100 text-rose-800',
  metallic: 'bg-slate-200 text-slate-700',
};

function useTween(target: number, duration = 450) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (from === target) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      const v = from + (target - from) * eased;
      current.current = v;
      setValue(v);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

const CW = 600;
const CH = 250;
const XA = 205;
const XB = 395;
const AY = 112;

function BondCloud({ a, b, delta, type }: { a: string; b: string; delta: number; type: BondType }) {
  const enA = ELEMENTS.find((e) => e.symbol === a)?.en ?? 0;
  const enB = ELEMENTS.find((e) => e.symbol === b)?.en ?? 0;
  const direction = enB > enA ? 1 : enB < enA ? -1 : 0;
  const fraction = type === 'metallic' ? 0 : percentIonic(delta) / 100;
  const shift = useTween(direction * fraction);
  const f = Math.abs(shift);

  const cloudX = (XA + XB) / 2 + shift * 92;
  const rx = 160 - 78 * f;
  const ry = 76 - 12 * f;
  const negativeX = direction >= 0 ? XB : XA;
  const positiveX = direction >= 0 ? XA : XB;
  const arrowLen = Math.min(170, 30 + 45 * delta);
  const ionic = type === 'ionic';
  const showCharges = type === 'polar' || type === 'ionic';

  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label={`Electron density in the ${a}–${b} bond`}>
      <defs>
        <radialGradient id="bond-cloud" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.6} />
          <stop offset="60%" stopColor="#38bdf8" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0} />
        </radialGradient>
      </defs>
      {type === 'metallic' ? (
        <rect x={60} y={40} width={480} height={150} rx={30} fill="#e2e8f0" opacity={0.6} />
      ) : (
        <ellipse cx={cloudX} cy={AY} rx={rx} ry={ry} fill="url(#bond-cloud)" />
      )}
      {!ionic && <line x1={XA + 34} y1={AY} x2={XB - 34} y2={AY} stroke="#334155" strokeWidth={3} strokeDasharray={type === 'metallic' ? '6 6' : undefined} />}
      {[
        { x: XA, el: a },
        { x: XB, el: b },
      ].map((atom) => {
        const style = CPK[atom.el] ?? (ELEMENTS.find((e) => e.symbol === atom.el)?.metal ? { fill: '#cbd5e1', stroke: '#475569', text: '#1e293b' } : { fill: '#fde68a', stroke: '#b45309', text: '#451a03' });
        return (
          <g key={atom.x}>
            <circle cx={atom.x} cy={AY} r={34} fill={style.fill} stroke={style.stroke} strokeWidth={2} />
            <text x={atom.x} y={AY} fontSize={24} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill={style.text}>
              {atom.el}
            </text>
          </g>
        );
      })}
      {showCharges && direction !== 0 && (
        <g fontSize={22} fontWeight={700} textAnchor="middle">
          <text x={positiveX} y={AY - 52} fill="#1d4ed8">
            {ionic ? '+' : 'δ+'}
          </text>
          <text x={negativeX} y={AY - 52} fill="#b91c1c">
            {ionic ? '−' : 'δ−'}
          </text>
        </g>
      )}
      {direction !== 0 && type !== 'metallic' && delta > 0 ? (
        <g stroke="#475569" strokeWidth={3} fill="#475569">
          {(() => {
            const mid = (XA + XB) / 2;
            const x0 = mid - (direction * arrowLen) / 2;
            const x1 = mid + (direction * arrowLen) / 2;
            const y = 214;
            return (
              <>
                <line x1={x0} y1={y} x2={x1 - direction * 12} y2={y} />
                <line x1={x0 + direction * 14} y1={y - 9} x2={x0 + direction * 14} y2={y + 9} />
                <polygon points={`${x1},${y} ${x1 - direction * 14},${y - 8} ${x1 - direction * 14},${y + 8}`} stroke="none" />
              </>
            );
          })()}
        </g>
      ) : (
        <text x={CW / 2} y={220} fontSize={16} textAnchor="middle" fill="#64748b">
          {type === 'metallic' ? 'Metals share a sea of delocalized electrons' : 'Electrons shared equally: no bond dipole'}
        </text>
      )}
    </svg>
  );
}

const BW = 600;
const BH = 110;
const bx = (d: number) => 30 + (Math.min(d, EN_SCALE_MAX) / EN_SCALE_MAX) * (BW - 60);

function Continuum({ delta, muted }: { delta: number; muted: boolean }) {
  const ticks = [0, 0.5, 1, 1.5, 2, 2.5, 3];
  return (
    <svg viewBox={`0 0 ${BW} ${BH}`} className={`${responsiveSurface}`} role="img" aria-label={`Electronegativity difference ${delta.toFixed(2)} on the bond-type continuum`}>
      <defs>
        <linearGradient id="bond-continuum" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset={`${(NONPOLAR_LIMIT / EN_SCALE_MAX) * 100}%`} stopColor="#a7f3d0" />
          <stop offset={`${((NONPOLAR_LIMIT + 0.15) / EN_SCALE_MAX) * 100}%`} stopColor="#fde68a" />
          <stop offset={`${((IONIC_LIMIT - 0.1) / EN_SCALE_MAX) * 100}%`} stopColor="#fcd34d" />
          <stop offset={`${((IONIC_LIMIT + 0.15) / EN_SCALE_MAX) * 100}%`} stopColor="#fda4af" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
      </defs>
      <rect x={bx(0)} y={34} width={bx(EN_SCALE_MAX) - bx(0)} height={22} rx={6} fill="url(#bond-continuum)" />
      {[NONPOLAR_LIMIT, IONIC_LIMIT].map((v) => (
        <line key={v} x1={bx(v)} y1={28} x2={bx(v)} y2={62} stroke="#334155" strokeWidth={1.5} strokeDasharray="4 3" />
      ))}
      <g fontSize={13} fill="#334155" textAnchor="middle" fontWeight={600}>
        <text x={(bx(0) + bx(NONPOLAR_LIMIT)) / 2} y={20}>
          nonpolar
        </text>
        <text x={(bx(NONPOLAR_LIMIT) + bx(IONIC_LIMIT)) / 2} y={20}>
          polar covalent
        </text>
        <text x={(bx(IONIC_LIMIT) + bx(EN_SCALE_MAX)) / 2} y={20}>
          mostly ionic
        </text>
      </g>
      {ticks.map((t) => (
        <text key={t} x={bx(t)} y={80} fontSize={12} textAnchor="middle" fill="#64748b">
          {t.toFixed(1)}
        </text>
      ))}
      <text x={bx(NONPOLAR_LIMIT)} y={100} fontSize={12} textAnchor="middle" fill="#334155">
        ≈ 0.4
      </text>
      <text x={bx(IONIC_LIMIT)} y={100} fontSize={12} textAnchor="middle" fill="#334155">
        ≈ 1.8
      </text>
      {!muted && (
        <g>
          <polygon points={`${bx(delta)},58 ${bx(delta) - 9},72 ${bx(delta) + 9},72`} fill="#0f172a" />
          <line x1={bx(delta)} y1={30} x2={bx(delta)} y2={60} stroke="#0f172a" strokeWidth={3} />
        </g>
      )}
    </svg>
  );
}

const PW = 320;
const PH = 210;
const px = (d: number) => 40 + (d / EN_SCALE_MAX) * (PW - 55);
const py = (p: number) => 180 - (p / 100) * 160;

function IonicCurve({ delta }: { delta: number }) {
  const path = Array.from({ length: 101 }, (_, i) => {
    const d = (EN_SCALE_MAX * i) / 100;
    return `${i === 0 ? 'M' : 'L'} ${px(d).toFixed(1)} ${py(percentIonic(d)).toFixed(1)}`;
  }).join(' ');
  const p = percentIonic(delta);
  return (
    <svg viewBox={`0 0 ${PW} ${PH}`} className={`${responsiveSurface} rounded-xl border border-line bg-white`} role="img" aria-label="Percent ionic character against electronegativity difference">
      <line x1={px(0)} y1={py(0)} x2={px(EN_SCALE_MAX)} y2={py(0)} stroke="#334155" />
      <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(100)} stroke="#334155" />
      {[0, 50, 100].map((v) => (
        <g key={v}>
          <line x1={px(0) - 4} y1={py(v)} x2={px(EN_SCALE_MAX)} y2={py(v)} stroke="#e2e8f0" />
          <text x={px(0) - 8} y={py(v)} fontSize={11} textAnchor="end" dominantBaseline="central" fill="#64748b">
            {v}%
          </text>
        </g>
      ))}
      {[0, 1, 2, 3].map((v) => (
        <text key={v} x={px(v)} y={py(0) + 16} fontSize={11} textAnchor="middle" fill="#64748b">
          {v}
        </text>
      ))}
      <text x={px(EN_SCALE_MAX)} y={py(0) + 28} fontSize={11} textAnchor="end" fill="#64748b">
        ΔEN
      </text>
      <path d={path} fill="none" stroke="#7c3aed" strokeWidth={2.5} />
      <line x1={px(delta)} y1={py(0)} x2={px(delta)} y2={py(p)} stroke="#7c3aed" strokeDasharray="4 3" />
      <line x1={px(0)} y1={py(p)} x2={px(delta)} y2={py(p)} stroke="#7c3aed" strokeDasharray="4 3" />
      <circle cx={px(delta)} cy={py(p)} r={6} fill="#7c3aed" stroke="white" strokeWidth={2} />
    </svg>
  );
}

function Readout({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-subtle px-3 py-2">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="font-mono text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

function BondExplorer() {
  const [a, setA] = useState('H');
  const [b, setB] = useState('Cl');
  const ea = ELEMENTS.find((e) => e.symbol === a) ?? ELEMENTS[0];
  const eb = ELEMENTS.find((e) => e.symbol === b) ?? ELEMENTS[0];
  const delta = Math.abs(ea.en - eb.en);
  const type = classify(ea, eb);
  const ionicPct = percentIonic(delta);
  const moreEn = ea.en === eb.en ? null : ea.en > eb.en ? ea : eb;
  const metalNonmetal = ea.metal !== eb.metal;

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-ink">One bond: how evenly are the electrons shared?</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <Select label="Atom A" value={a} onChange={(e) => setA(e.target.value)}>
          {ELEMENTS.map((e) => (
            <option key={e.symbol} value={e.symbol}>
              {e.symbol} ({e.en.toFixed(2)})
            </option>
          ))}
        </Select>
        <Select label="Atom B" value={b} onChange={(e) => setB(e.target.value)}>
          {ELEMENTS.map((e) => (
            <option key={e.symbol} value={e.symbol}>
              {e.symbol} ({e.en.toFixed(2)})
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        {QUICK_PAIRS.map(([x, y]) => (
          <Button
            key={`${x}-${y}`}
            size="sm"
            variant={a === x && b === y ? 'primary' : 'outline'}
            aria-pressed={a === x && b === y}
            onClick={() => {
              setA(x);
              setB(y);
            }}
          >
            {x}–{y}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          <BondCloud a={a} b={b} delta={delta} type={type} />
          <Continuum delta={delta} muted={type === 'metallic'} />
        </div>
        <div className="min-w-0 space-y-3 lg:col-span-2">
          <div className="grid grid-cols-2 gap-2">
            <Readout label={`χ(${a})`} value={ea.en.toFixed(2)} />
            <Readout label={`χ(${b})`} value={eb.en.toFixed(2)} />
            <Readout label="ΔEN = |χA − χB|" value={delta.toFixed(2)} />
            <Readout label="Ionic character" value={type === 'metallic' ? 'n/a' : `${ionicPct.toFixed(1)}%`} />
          </div>
          <p className="flex flex-wrap items-center gap-2 text-sm">
            <span className={`rounded-full px-3 py-1 font-semibold ${TYPE_STYLE[type]}`}>{BOND_LABEL[type]}</span>
            {moreEn && type !== 'metallic' && <span className="text-ink-muted">electrons pulled toward {moreEn.symbol}</span>}
          </p>
          <IonicCurve delta={type === 'metallic' ? 0 : delta} />
          <p className="text-xs leading-relaxed text-ink-muted">
            Pauling estimate: ionic character = 1 − e<sup>−(ΔEN)²/4</sup>. The 0.4 and 1.8 cut-offs are rules of thumb; textbooks use values from 1.7 to
            2.0 for the ionic boundary.
            {metalNonmetal && type === 'polar' && ' This is a metal–nonmetal pair, often called ionic, yet ΔEN puts it in the polar covalent range: real bonding is a continuum.'}
            {type === 'metallic' && ' Two metals bond by metallic bonding, which this scale does not describe.'}
          </p>
        </div>
      </div>
    </div>
  );
}

const MW = 460;
const MH = 340;
const MVIEW: Projection = { cx: MW / 2, cy: MH / 2 + 10, scale: 105, camera: 6 };

function Arrow({ from, to, color, width, crossed }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string; width: number; crossed?: boolean }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 4) return null;
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(16, len * 0.5);
  const hw = head * 0.55;
  const bx0 = to.x - ux * head;
  const by0 = to.y - uy * head;
  const cx = from.x + ux * Math.min(10, len * 0.25);
  const cy = from.y + uy * Math.min(10, len * 0.25);
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={bx0} y2={by0} stroke={color} strokeWidth={width} strokeLinecap="round" />
      {crossed && <line x1={cx - uy * 7} y1={cy + ux * 7} x2={cx + uy * 7} y2={cy - ux * 7} stroke={color} strokeWidth={width * 0.8} strokeLinecap="round" />}
      <polygon points={`${to.x},${to.y} ${bx0 - uy * hw},${by0 + ux * hw} ${bx0 + uy * hw},${by0 - ux * hw}`} fill={color} />
    </g>
  );
}

function MoleculeDipole({ index }: { index: number }) {
  const m = MOLECULES[index];
  const { rotation, setRotation, handlers } = useDragRotation(DEFAULT_VIEW);
  const net = netDipole(m);
  const origin = project(apply(rotation, [0, 0, 0]), MVIEW);
  const items: { z: number; node: React.ReactNode }[] = [];
  const centerStyle = CPK[m.center];

  m.ligands.forEach((l, i) => {
    const p = apply(rotation, l.dir);
    const end = project(p, MVIEW);
    const style = CPK[l.el];
    const r = l.el === 'H' ? 15 : 21;
    items.push({
      z: p[2] / 2 - 0.01,
      node: <line key={`b${i}`} x1={origin.x} y1={origin.y} x2={end.x} y2={end.y} stroke="#94a3b8" strokeWidth={8 * end.k} strokeLinecap="round" />,
    });
    items.push({
      z: p[2],
      node: (
        <g key={`a${i}`}>
          <circle cx={end.x} cy={end.y} r={r * end.k} fill={style.fill} stroke={style.stroke} strokeWidth={1.5} />
          <text x={end.x} y={end.y} fontSize={13 * end.k} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill={style.text}>
            {l.el}
          </text>
        </g>
      ),
    });
    const dip = bondDipole(m.center, l);
    const outward = dip[0] * l.dir[0] + dip[1] * l.dir[1] + dip[2] * l.dir[2] > 0;
    const a0: Vec3 = scale(l.dir, outward ? 0.3 : 0.78);
    const a1: Vec3 = scale(l.dir, outward ? 0.78 : 0.3);
    const offset: Vec3 = apply(rotation, a0);
    const offsetEnd: Vec3 = apply(rotation, a1);
    const width = 1.5 + 2.2 * Math.abs(enDiff(m.center, l.el));
    items.push({
      z: (offset[2] + offsetEnd[2]) / 2 + 0.02,
      node: <Arrow key={`d${i}`} from={project(offset, MVIEW)} to={project(offsetEnd, MVIEW)} color="#d97706" width={width} crossed />,
    });
  });

  if (m.lonePair) {
    const p = apply(rotation, scale(m.lonePair, 0.55));
    const c = project(p, MVIEW);
    items.push({
      z: p[2],
      node: (
        <g key="lp">
          <circle cx={c.x} cy={c.y} r={16 * c.k} fill="#ddd6fe" opacity={0.75} />
          <circle cx={c.x - 5} cy={c.y} r={3} fill="#5b21b6" />
          <circle cx={c.x + 5} cy={c.y} r={3} fill="#5b21b6" />
        </g>
      ),
    });
  }

  items.push({
    z: 0,
    node: (
      <g key="center">
        <circle cx={origin.x} cy={origin.y} r={25 * origin.k} fill={centerStyle.fill} stroke={centerStyle.stroke} strokeWidth={1.5} />
        <text x={origin.x} y={origin.y} fontSize={15} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill={centerStyle.text}>
          {m.center}
        </text>
      </g>
    ),
  });

  if (net.magnitude > 0) {
    const tip = apply(rotation, scale(net.vector, (0.7 + 0.3 * net.magnitude) / net.magnitude));
    items.push({
      z: 5,
      node: <Arrow key="net" from={origin} to={project(tip, MVIEW)} color="#dc2626" width={5} crossed />,
    });
  }

  items.sort((x, y) => x.z - y.z);

  return (
    <div>
      <svg viewBox={`0 0 ${MW} ${MH}`} className={`${responsiveSurface} touch-none cursor-grab select-none rounded-xl border border-line bg-slate-50 active:cursor-grabbing`} role="img" aria-label={`${m.name} bond dipoles and net dipole, drag to rotate`} {...handlers}>
        {items.map((item) => item.node)}
        <text x={12} y={MH - 12} fontSize={13} fill="#64748b">
          Drag to rotate
        </text>
        {net.magnitude === 0 && (
          <text x={MW - 12} y={MH - 12} fontSize={14} textAnchor="end" fill="#047857" fontWeight={600}>
            Net dipole = 0
          </text>
        )}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1 w-5 rounded bg-amber-600" /> bond dipoles (thicker = larger ΔEN)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1 w-5 rounded bg-red-600" /> net dipole
        </span>
        {m.lonePair && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-300" /> lone pair(s)
          </span>
        )}
        <button type="button" className="inline-flex items-center gap-1 font-medium text-brand-700 hover:text-brand-800" onClick={() => setRotation(DEFAULT_VIEW)}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset view
        </button>
      </div>
    </div>
  );
}

function DipoleExplorer() {
  const [index, setIndex] = useState(1);
  const m = MOLECULES[index];
  const net = netDipole(m);
  const bondTypes = [...new Set(m.ligands.map((l) => l.el))].map((el) => ({ el, d: enDiff(m.center, el) }));
  const pairs = [
    [0, 1],
    [2, 3],
    [4, 5],
  ];

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <h3 className="text-lg font-semibold text-ink">Whole molecule: do the bond dipoles cancel?</h3>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {pairs.map((pair) => (
          <div key={pair[0]} className="flex flex-wrap items-center gap-2">
            {pair.map((i) => (
              <Button key={i} size="sm" variant={index === i ? 'primary' : 'outline'} aria-pressed={index === i} onClick={() => setIndex(i)}>
                {MOLECULES[i].formula}
              </Button>
            ))}
            <span className="text-xs text-ink-faint">{pair[0] === 0 ? 'triatomic' : pair[0] === 2 ? 'tetrahedral' : 'three bonds'}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MoleculeDipole key={index} index={index} />
        </div>
        <div className="min-w-0 space-y-3 text-sm lg:col-span-2">
          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="font-semibold text-ink">
              {m.formula} <span className="font-normal text-ink-muted">({m.name})</span>
            </p>
            <dl className="mt-2 space-y-1">
              <div className="flex flex-wrap justify-between gap-x-3">
                <dt className="text-ink-muted">Shape</dt>
                <dd className="text-ink">{m.geometry}</dd>
              </div>
              {bondTypes.map((bt) => (
                <div key={bt.el} className="flex flex-wrap justify-between gap-x-3">
                  <dt className="text-ink-muted">
                    {m.center}–{bt.el} ΔEN
                  </dt>
                  <dd className="font-mono text-ink">
                    {Math.abs(bt.d).toFixed(2)} <span className="text-xs text-ink-faint">(toward {bt.d > 0 ? bt.el : m.center})</span>
                  </dd>
                </div>
              ))}
              <div className="flex flex-wrap justify-between gap-x-3">
                <dt className="text-ink-muted">Vector sum of bond dipoles</dt>
                <dd className="font-mono text-ink">{net.magnitude.toFixed(2)}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-x-3">
                <dt className="text-ink-muted">Measured dipole moment</dt>
                <dd className="font-mono text-ink">{m.measured.toFixed(2)} D</dd>
              </div>
            </dl>
            <p className={`mt-3 inline-block rounded-full px-3 py-1 font-semibold ${m.measured > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {m.measured > 0 ? 'Polar molecule' : 'Nonpolar molecule'}
            </p>
          </div>
          <p className="text-ink-muted">{m.note}</p>
          <p className="text-xs leading-relaxed text-ink-muted">
            Each bond dipole here is drawn as ΔEN along the bond, pointing to the more electronegative atom, so the vector sum is a qualitative guide in ΔEN units, not
            a value in debye. Lone pairs also contribute to real dipole moments.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BondPolarityVisualizer() {
  return (
    <div className="space-y-6">
      <BondExplorer />
      <DipoleExplorer />
    </div>
  );
}
