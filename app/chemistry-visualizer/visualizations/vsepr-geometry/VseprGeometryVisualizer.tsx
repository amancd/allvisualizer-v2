'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import { DEFAULT_VIEW, apply, multiply, project, rotY, scale, useDragRotation, type Projection } from '../_chemical-bonding/molecule3d';
import { CPK } from '../_chemical-bonding/cpk';
import { HYBRIDIZATION, PRESETS, SHAPES, domainLayout, isValid, ligandAngles, maxLonePairs } from './vsepr';

const W = 480;
const H = 400;
const VIEW: Projection = { cx: W / 2, cy: H / 2, scale: 128, camera: 6 };

interface Drawable {
  z: number;
  node: React.ReactNode;
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 py-1">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}

function MoleculeView({
  bonds,
  lone,
  center,
  ligand,
  showLonePairs,
  autoRotate,
}: {
  bonds: number;
  lone: number;
  center: string;
  ligand: string;
  showLonePairs: boolean;
  autoRotate: boolean;
}) {
  const { rotation, setRotation, dragging, handlers } = useDragRotation(DEFAULT_VIEW);
  const spinning = autoRotate && !dragging;

  useEffect(() => {
    if (!spinning) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      setRotation((r) => multiply(rotY(dt * 0.0006), r));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [spinning, setRotation]);

  const { ligandDirections, lonePairDirections } = domainLayout(bonds, lone);
  const centerStyle = CPK[center] ?? CPK.A;
  const ligandStyle = CPK[ligand] ?? CPK.X;
  const ligandRadius = ligand === 'H' ? 16 : 22;
  const origin = project([0, 0, 0], VIEW);

  const items: Drawable[] = [];

  ligandDirections.forEach((d, i) => {
    const p = apply(rotation, d);
    const end = project(p, VIEW);
    items.push({
      z: p[2] / 2,
      node: (
        <g key={`b${i}`}>
          <line x1={origin.x} y1={origin.y} x2={end.x} y2={end.y} stroke="#64748b" strokeWidth={11 * end.k} strokeLinecap="round" />
          <line x1={origin.x} y1={origin.y} x2={end.x} y2={end.y} stroke="#cbd5e1" strokeWidth={6 * end.k} strokeLinecap="round" />
        </g>
      ),
    });
    items.push({
      z: p[2],
      node: (
        <g key={`a${i}`}>
          <circle cx={end.x} cy={end.y} r={ligandRadius * end.k} fill="url(#vsepr-ligand)" stroke={ligandStyle.stroke} strokeWidth={1.5} />
          <text x={end.x} y={end.y} fontSize={14 * end.k} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill={ligandStyle.text}>
            {ligand}
          </text>
        </g>
      ),
    });
  });

  if (showLonePairs) {
    lonePairDirections.forEach((d, i) => {
      const p = apply(rotation, d);
      const mid = project(scale(p, 0.52), VIEW);
      const tip = project(scale(p, 0.95), VIEW);
      const dx = tip.x - origin.x;
      const dy = tip.y - origin.y;
      const minor = 0.25 * VIEW.scale * mid.k;
      const major = Math.max(minor * 1.05, Math.hypot(dx, dy) / 2);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const ux = Math.cos((angle * Math.PI) / 180);
      const uy = Math.sin((angle * Math.PI) / 180);
      const dotX = mid.x + ux * major * 0.25;
      const dotY = mid.y + uy * major * 0.25;
      items.push({
        z: p[2] * 0.52,
        node: (
          <g key={`l${i}`}>
            <ellipse cx={mid.x} cy={mid.y} rx={major} ry={minor} transform={`rotate(${angle} ${mid.x} ${mid.y})`} fill="url(#vsepr-lobe)" stroke="#7c3aed" strokeWidth={1.2} strokeOpacity={0.6} />
            <circle cx={dotX - uy * 6} cy={dotY + ux * 6} r={3.5} fill="#5b21b6" />
            <circle cx={dotX + uy * 6} cy={dotY - ux * 6} r={3.5} fill="#5b21b6" />
          </g>
        ),
      });
    });
  }

  items.push({
    z: 0,
    node: (
      <g key="center">
        <circle cx={origin.x} cy={origin.y} r={30 * origin.k} fill="url(#vsepr-center)" stroke={centerStyle.stroke} strokeWidth={1.5} />
        <text x={origin.x} y={origin.y} fontSize={17} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill={centerStyle.text}>
          {center}
        </text>
      </g>
    ),
  });

  items.sort((a, b) => a.z - b.z);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`${responsiveSurface} touch-none cursor-grab select-none rounded-xl border border-line bg-slate-50 active:cursor-grabbing`}
      role="img"
      aria-label="3D ball-and-stick model, drag to rotate"
      {...handlers}
    >
      <defs>
        <radialGradient id="vsepr-center" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.7} />
          <stop offset="35%" stopColor={centerStyle.fill} />
          <stop offset="100%" stopColor={centerStyle.stroke} />
        </radialGradient>
        <radialGradient id="vsepr-ligand" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.8} />
          <stop offset="35%" stopColor={ligandStyle.fill} />
          <stop offset="100%" stopColor={ligandStyle.stroke} />
        </radialGradient>
        <radialGradient id="vsepr-lobe" cx="40%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.75} />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.35} />
        </radialGradient>
      </defs>
      {items.map((item) => item.node)}
      <text x={12} y={H - 12} fontSize={13} fill="#64748b">
        Drag to rotate
      </text>
    </svg>
  );
}

export default function VseprGeometryVisualizer() {
  const [bonds, setBonds] = useState(2);
  const [lone, setLone] = useState(2);
  const [presetFormula, setPresetFormula] = useState<string | null>('H₂O');
  const [showLonePairs, setShowLonePairs] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewKey, setViewKey] = useState(0);

  const preset = PRESETS.find((p) => p.formula === presetFormula) ?? null;
  const shape = SHAPES[`${bonds}-${lone}`];
  const stericNumber = bonds + lone;
  const modelAngles = useMemo(() => ligandAngles(domainLayout(bonds, lone).ligandDirections), [bonds, lone]);
  const matching = PRESETS.find((p) => p.bonds === bonds && p.lone === lone);

  const choosePreset = (formula: string) => {
    const p = PRESETS.find((x) => x.formula === formula);
    if (!p) return;
    setBonds(p.bonds);
    setLone(p.lone);
    setPresetFormula(formula);
  };

  const chooseBonds = (b: number) => {
    setBonds(b);
    setLone((l) => Math.min(l, maxLonePairs(b)));
    setPresetFormula(null);
  };

  const chooseLone = (l: number) => {
    setLone(l);
    setPresetFormula(null);
  };

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Preset molecule</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button key={p.formula} size="sm" variant={presetFormula === p.formula ? 'primary' : 'outline'} aria-pressed={presetFormula === p.formula} onClick={() => choosePreset(p.formula)}>
                {p.formula}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Bonded atoms (X)</p>
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6].map((b) => (
                <Button key={b} size="sm" variant={bonds === b ? 'primary' : 'outline'} aria-pressed={bonds === b} onClick={() => chooseBonds(b)}>
                  {b}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Lone pairs on the central atom (E)</p>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3].map((l) => (
                <Button key={l} size="sm" variant={lone === l ? 'primary' : 'outline'} aria-pressed={lone === l} disabled={!isValid(bonds, l)} onClick={() => chooseLone(l)}>
                  {l}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setAutoRotate((a) => !a)} leftIcon={autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
            {autoRotate ? 'Stop spinning' : 'Auto-rotate'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setViewKey((k) => k + 1)} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Reset view
          </Button>
          <label className="ml-1 inline-flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" checked={showLonePairs} onChange={(e) => setShowLonePairs(e.target.checked)} className="h-4 w-4 accent-brand-600" />
            Show lone pairs
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <MoleculeView
            key={viewKey}
            bonds={bonds}
            lone={lone}
            center={preset?.center ?? 'A'}
            ligand={preset?.ligand ?? 'X'}
            showLonePairs={showLonePairs}
            autoRotate={autoRotate}
          />
          <p className="mt-2 text-sm text-ink-muted">
            {preset ? `${preset.formula}: ${preset.center} in the middle, ${preset.ligand} on the outside.` : 'Generic molecule: A is the central atom, X the bonded atoms.'} Violet lobes are lone pairs.
          </p>
        </div>

        <div className="min-w-0 space-y-4 text-sm lg:col-span-2">
          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="mb-1 font-semibold text-ink">
              {shape.axe}
              <span className="ml-2 font-normal text-ink-muted">steric number {stericNumber} = {bonds} X + {lone} E</span>
            </p>
            <dl className="divide-y divide-line">
              <Stat label="Electron geometry" value={shape.electronGeometry} />
              <Stat label="Molecular geometry" value={shape.molecularGeometry} />
              <Stat label="Ideal bond angles" value={shape.idealAngles} />
              <Stat label="Angles in this model" value={<span className="font-mono">{modelAngles.map((a) => `${a}°`).join(', ')}</span>} />
              <Stat label="Hybridization" value={HYBRIDIZATION[stericNumber]} />
              <Stat label="Example" value={shape.example} />
            </dl>
          </div>

          <div className="rounded-xl border border-line bg-white p-4">
            {preset ? (
              <>
                <p className="font-semibold text-ink">Real {preset.formula}</p>
                <p className="mt-1 font-mono text-ink">{preset.realAngles}</p>
                <p className="mt-2 text-ink-muted">{preset.note}</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-ink">Real molecule with this shape</p>
                <p className="mt-1 text-ink-muted">
                  {matching ? (
                    <>
                      {matching.formula}: <span className="font-mono text-ink">{matching.realAngles}</span>
                    </>
                  ) : (
                    'No preset for this combination.'
                  )}
                </p>
              </>
            )}
          </div>

          <p className="text-ink-muted">
            {lone === 0
              ? 'With no lone pairs, the molecular geometry is the same as the electron geometry.'
              : 'Lone pairs take up space but are not counted in the shape name. They repel more strongly than bonding pairs, so real angles come out smaller than the ideal ones.'}
          </p>
        </div>
      </div>
    </div>
  );
}
