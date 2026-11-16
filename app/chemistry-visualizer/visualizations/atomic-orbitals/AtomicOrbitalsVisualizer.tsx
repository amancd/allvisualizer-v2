'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import { ORBITALS, energyEv, meanRadius, psi, radialTable, sampleCloud, type Orbital, type OrbitalKey } from './orbitals';

type Plane = 'xz' | 'xy' | 'yz';

const CLOUD_SIZE = 440;
const MAP_SIZE = 440;
const POSITIVE = [220, 38, 38];
const NEGATIVE = [37, 99, 235];
const NEUTRAL = [79, 70, 229];
const POINT_COUNTS = [2000, 5000, 10000];

const PLANE_AXES: Record<Plane, [string, string]> = { xz: ['x', 'z'], xy: ['x', 'y'], yz: ['y', 'z'] };

function planePoint(plane: Plane, u: number, v: number): [number, number, number] {
  if (plane === 'xz') return [u, 0, v];
  if (plane === 'xy') return [u, v, 0];
  return [0, u, v];
}

function globalMax(o: Orbital) {
  let max = 0;
  const steps = 120;
  for (const plane of ['xz', 'xy', 'yz'] as Plane[]) {
    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps; j++) {
        const u = -o.extent + (2 * o.extent * i) / steps;
        const v = -o.extent + (2 * o.extent * j) / steps;
        const [x, y, z] = planePoint(plane, u, v);
        max = Math.max(max, Math.abs(psi(o, x, y, z)));
      }
    }
  }
  return max;
}

function OrbitalName({ o }: { o: Orbital }) {
  return (
    <>
      {o.label}
      {o.sub && <sub className="text-[0.75em]">{o.sub}</sub>}
    </>
  );
}

function Stat({ label, value, hint }: { label: React.ReactNode; value: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-mono font-semibold text-ink">
        {value}
        {hint && <span className="ml-1 text-xs font-normal text-ink-faint">{hint}</span>}
      </dd>
    </div>
  );
}

const RP = { w: 640, h: 270, left: 56, right: 20, top: 18, bottom: 44 };

function RadialPlot({ o, cursor, onCursor }: { o: Orbital; cursor: number; onCursor: (r: number) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const table = useMemo(() => radialTable(o, o.extent, 1200), [o]);
  const pMax = Math.max(...table.p) * 1.1;
  const sx = (r: number) => RP.left + (r / o.extent) * (RP.w - RP.left - RP.right);
  const sy = (p: number) => RP.h - RP.bottom - (p / pMax) * (RP.h - RP.top - RP.bottom);
  const line = table.rs.map((r, i) => `${i === 0 ? 'M' : 'L'} ${sx(r).toFixed(1)} ${sy(table.p[i]).toFixed(1)}`).join(' ');
  const cutIndex = Math.min(table.rs.length - 1, Math.round((cursor / o.extent) * (table.rs.length - 1)));
  const shaded = `M ${sx(0)} ${sy(0)} ` + table.rs.slice(0, cutIndex + 1).map((r, i) => `L ${sx(r).toFixed(1)} ${sy(table.p[i]).toFixed(1)}`).join(' ') + ` L ${sx(table.rs[cutIndex])} ${sy(0)} Z`;
  const tickStep = o.extent <= 5 ? 1 : o.extent <= 14 ? 2 : 5;
  const xTicks = Array.from({ length: Math.floor(o.extent / tickStep) + 1 }, (_, i) => i * tickStep);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => (f * pMax) / 1.1);
  const mean = meanRadius(o);

  const update = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const { x } = toDrawingPoint(e, svgRef.current);
    const r = ((x - RP.left) / (RP.w - RP.left - RP.right)) * o.extent;
    onCursor(Math.min(o.extent, Math.max(0, r)));
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${RP.w} ${RP.h}`}
      className={`${responsiveSurface} touch-none cursor-ew-resize rounded-xl border border-line bg-white`}
      role="img"
      aria-label={`Radial distribution function for the ${o.label}${o.sub} orbital`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        update(e);
      }}
      onPointerMove={(e) => {
        if (dragging || e.pointerType === 'mouse') update(e);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      {yTicks.map((p) => (
        <g key={p}>
          <line x1={RP.left} x2={RP.w - RP.right} y1={sy(p)} y2={sy(p)} stroke="#f1f5f9" />
          <text x={RP.left - 6} y={sy(p) + 4} fontSize={12} textAnchor="end" fill="#64748b">
            {p.toFixed(p < 0.1 ? 3 : 2)}
          </text>
        </g>
      ))}
      <path d={shaded} fill="#c7d2fe" opacity={0.7} />
      <path d={line} fill="none" stroke="#4f46e5" strokeWidth={2.5} />
      {o.radialNodes.map((r) => (
        <g key={r}>
          <line x1={sx(r)} x2={sx(r)} y1={RP.top} y2={RP.h - RP.bottom} stroke="#dc2626" strokeDasharray="5 4" strokeWidth={1.5} />
          <text x={sx(r) + 4} y={RP.top + 12} fontSize={12} fill="#dc2626">
            node {r.toFixed(2)}
          </text>
        </g>
      ))}
      <line x1={sx(table.peak)} x2={sx(table.peak)} y1={sy(Math.max(...table.p))} y2={RP.h - RP.bottom} stroke="#0f766e" strokeWidth={1.5} strokeDasharray="2 3" />
      <line x1={sx(mean)} x2={sx(mean)} y1={RP.h - RP.bottom - 10} y2={RP.h - RP.bottom} stroke="#b45309" strokeWidth={3} />
      <line x1={RP.left} x2={RP.w - RP.right} y1={RP.h - RP.bottom} y2={RP.h - RP.bottom} stroke="#334155" strokeWidth={1.5} />
      <line x1={RP.left} x2={RP.left} y1={RP.top} y2={RP.h - RP.bottom} stroke="#334155" strokeWidth={1.5} />
      {xTicks.map((r) => (
        <g key={r}>
          <line x1={sx(r)} x2={sx(r)} y1={RP.h - RP.bottom} y2={RP.h - RP.bottom + 5} stroke="#334155" />
          <text x={sx(r)} y={RP.h - RP.bottom + 19} fontSize={12} textAnchor="middle" fill="#475569">
            {r}
          </text>
        </g>
      ))}
      <text x={(RP.left + RP.w - RP.right) / 2} y={RP.h - 6} fontSize={13} textAnchor="middle" fill="#334155">
        r (Bohr radii, a₀)
      </text>
      <text x={14} y={RP.top + 2} fontSize={13} fill="#334155" transform={`rotate(-90 14 ${RP.top + 2})`} textAnchor="end">
        P(r) = r²R(r)²
      </text>
      <line x1={sx(cursor)} x2={sx(cursor)} y1={RP.top} y2={RP.h - RP.bottom} stroke="#0f172a" strokeWidth={1.5} />
      <circle cx={sx(cursor)} cy={sy(table.p[cutIndex])} r={5} fill="#0f172a" />
    </svg>
  );
}

export default function AtomicOrbitalsVisualizer() {
  const [key, setKey] = useState<OrbitalKey>('2pz');
  const [plane, setPlane] = useState<Plane>('xz');
  const [showPhase, setShowPhase] = useState(true);
  const [count, setCount] = useState(5000);
  const [seed, setSeed] = useState(1);
  const [angles, setAngles] = useState({ yaw: 0.6, pitch: 0.35 });
  const [spinning, setSpinning] = useState(true);
  const [cursorByKey, setCursorByKey] = useState<Partial<Record<OrbitalKey, number>>>({});

  const cloudRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const orbital = ORBITALS.find((o) => o.key === key)!;
  const points = useMemo(() => sampleCloud(orbital, count, seed * 7919 + orbital.n * 31 + orbital.l), [orbital, count, seed]);
  const maxPsi = useMemo(() => globalMax(orbital), [orbital]);
  const table = useMemo(() => radialTable(orbital, orbital.extent, 1200), [orbital]);
  const cursor = cursorByKey[key] ?? table.peak;
  const cursorIndex = Math.min(table.rs.length - 1, Math.round((cursor / orbital.extent) * (table.rs.length - 1)));

  const planeMax = useMemo(() => {
    let max = 0;
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps; j++) {
        const [x, y, z] = planePoint(plane, -orbital.extent + (2 * orbital.extent * i) / steps, -orbital.extent + (2 * orbital.extent * j) / steps);
        max = Math.max(max, Math.abs(psi(orbital, x, y, z)));
      }
    }
    return max;
  }, [orbital, plane]);
  const nodalPlane = planeMax < maxPsi * 1e-6;

  useEffect(() => {
    if (!spinning) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      setAngles((a) => ({ ...a, yaw: a.yaw + dt * 0.0005 }));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [spinning]);

  useEffect(() => {
    const canvas = cloudRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { yaw, pitch } = angles;
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const scale = (CLOUD_SIZE / 2) * 0.92 / orbital.extent;
    const c = CLOUD_SIZE / 2;
    const project = (x: number, y: number, z: number) => {
      const x1 = x * cy - y * sy;
      const y1 = x * sy + y * cy;
      const y2 = y1 * cp - z * sp;
      const z2 = y1 * sp + z * cp;
      return { px: c + x1 * scale, py: c - z2 * scale, depth: y2 };
    };

    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, CLOUD_SIZE, CLOUD_SIZE);

    const axisLen = orbital.extent * 0.95;
    ctx.lineWidth = 1;
    ctx.font = '14px sans-serif';
    for (const [label, v] of [['x', [1, 0, 0]], ['y', [0, 1, 0]], ['z', [0, 0, 1]]] as const) {
      const a = project(-v[0] * axisLen, -v[1] * axisLen, -v[2] * axisLen);
      const b = project(v[0] * axisLen, v[1] * axisLen, v[2] * axisLen);
      ctx.strokeStyle = 'rgba(148,163,184,0.45)';
      ctx.beginPath();
      ctx.moveTo(a.px, a.py);
      ctx.lineTo(b.px, b.py);
      ctx.stroke();
      ctx.fillStyle = 'rgba(203,213,225,0.9)';
      ctx.fillText(label, b.px + 4, b.py - 4);
    }

    const projected = points.map((p) => ({ ...project(p.x, p.y, p.z), positive: p.positive }));
    projected.sort((a, b) => b.depth - a.depth);
    for (const p of projected) {
      const near = Math.min(1, Math.max(0, 0.5 - p.depth / (2 * orbital.extent)));
      const rgb = showPhase ? (p.positive ? POSITIVE : NEGATIVE) : NEUTRAL;
      const lift = showPhase ? 60 : 90;
      ctx.fillStyle = `rgba(${Math.min(255, rgb[0] + lift)},${Math.min(255, rgb[1] + lift)},${Math.min(255, rgb[2] + lift)},${(0.3 + 0.55 * near).toFixed(3)})`;
      ctx.fillRect(p.px - 1.1, p.py - 1.1, 2.2, 2.2);
    }
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(c, c, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }, [points, angles, showPhase, orbital]);

  useEffect(() => {
    const canvas = mapRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const img = ctx.createImageData(MAP_SIZE, MAP_SIZE);
    const L = orbital.extent;
    for (let j = 0; j < MAP_SIZE; j++) {
      const v = L - (2 * L * (j + 0.5)) / MAP_SIZE;
      for (let i = 0; i < MAP_SIZE; i++) {
        const u = -L + (2 * L * (i + 0.5)) / MAP_SIZE;
        const [x, y, z] = planePoint(plane, u, v);
        const value = maxPsi > 0 ? psi(orbital, x, y, z) / maxPsi : 0;
        const t = Math.pow(value * value, 0.35);
        const rgb = showPhase ? (value >= 0 ? POSITIVE : NEGATIVE) : NEUTRAL;
        const k = (j * MAP_SIZE + i) * 4;
        img.data[k] = 255 + (rgb[0] - 255) * t;
        img.data[k + 1] = 255 + (rgb[1] - 255) * t;
        img.data[k + 2] = 255 + (rgb[2] - 255) * t;
        img.data[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const [h, vLabel] = PLANE_AXES[plane];
    ctx.strokeStyle = 'rgba(15,23,42,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, MAP_SIZE / 2);
    ctx.lineTo(MAP_SIZE, MAP_SIZE / 2);
    ctx.moveTo(MAP_SIZE / 2, 0);
    ctx.lineTo(MAP_SIZE / 2, MAP_SIZE);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(h, MAP_SIZE - 18, MAP_SIZE / 2 - 8);
    ctx.fillText(vLabel, MAP_SIZE / 2 + 8, 20);
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(`${-L} a₀`, 6, MAP_SIZE / 2 + 18);
    ctx.textAlign = 'right';
    ctx.fillText(`${L} a₀`, MAP_SIZE - 6, MAP_SIZE / 2 + 18);
    ctx.textAlign = 'left';
  }, [orbital, plane, showPhase, maxPsi]);

  const onCloudDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = toDrawingPoint(e, e.currentTarget);
    setSpinning(false);
  };
  const onCloudMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return;
    const p = toDrawingPoint(e, e.currentTarget);
    const dx = p.x - dragRef.current.x;
    const dy = p.y - dragRef.current.y;
    dragRef.current = p;
    setAngles((a) => ({ yaw: a.yaw + dx * 0.01, pitch: Math.max(-1.5, Math.min(1.5, a.pitch + dy * 0.01)) }));
  };
  const onCloudUp = () => {
    dragRef.current = null;
  };

  const radialCount = orbital.radialNodes.length;
  const groups = [1, 2, 3].map((n) => ORBITALS.filter((o) => o.n === n));

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-ink">Orbital</p>
        {groups.map((group, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <span className="w-12 shrink-0 font-mono text-sm text-ink-muted">n = {i + 1}</span>
            {group.map((o) => (
              <Button key={o.key} size="sm" variant={key === o.key ? 'primary' : 'outline'} aria-pressed={key === o.key} onClick={() => setKey(o.key)}>
                <OrbitalName o={o} />
              </Button>
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="mb-1 text-sm font-medium text-ink">
            Probability cloud <span className="font-normal text-ink-muted">(drag to rotate; each dot is one sampled electron position)</span>
          </p>
          <canvas
            ref={cloudRef}
            width={CLOUD_SIZE}
            height={CLOUD_SIZE}
            className={`${responsiveSurface} touch-none cursor-grab rounded-xl active:cursor-grabbing`}
            onPointerDown={onCloudDown}
            onPointerMove={onCloudMove}
            onPointerUp={onCloudUp}
            onPointerCancel={onCloudUp}
            role="img"
            aria-label={`3D point cloud of the ${orbital.label}${orbital.sub} orbital`}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setSpinning((s) => !s)} leftIcon={spinning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}>
              {spinning ? 'Stop rotation' : 'Auto-rotate'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSeed((s) => s + 1)} leftIcon={<RefreshCw className="h-4 w-4" />}>
              Resample
            </Button>
            <span className="text-sm text-ink-muted">Points</span>
            {POINT_COUNTS.map((c) => (
              <Button key={c} size="sm" variant={count === c ? 'secondary' : 'ghost'} aria-pressed={count === c} onClick={() => setCount(c)}>
                {c.toLocaleString('en-US')}
              </Button>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-1 text-sm font-medium text-ink">
            Cross-section of |ψ|² <span className="font-normal text-ink-muted">(darker = more likely)</span>
          </p>
          <div className="relative">
            <canvas ref={mapRef} width={MAP_SIZE} height={MAP_SIZE} className={`${responsiveSurface} rounded-xl border border-line`} role="img" aria-label={`Cross-section of the ${orbital.label}${orbital.sub} orbital in the ${plane} plane`} />
            {nodalPlane && (
              <p className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-lg border border-line bg-white/90 p-3 text-center text-sm text-ink">
                The {plane} plane is a nodal plane of this orbital: ψ = 0 everywhere on it.
              </p>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-muted">Plane</span>
            {(['xz', 'xy', 'yz'] as Plane[]).map((p) => (
              <Button key={p} size="sm" variant={plane === p ? 'primary' : 'outline'} aria-pressed={plane === p} onClick={() => setPlane(p)}>
                {p}
              </Button>
            ))}
            <label className="ml-1 flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={showPhase} onChange={(e) => setShowPhase(e.target.checked)} className="h-4 w-4 accent-brand-600" />
              Colour by sign of ψ
            </label>
          </div>
          {showPhase && (
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500" /> ψ &gt; 0
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-blue-500" /> ψ &lt; 0
              </span>
              <span>White gaps between colours are nodes.</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <p className="mb-1 text-sm font-medium text-ink">
            Radial distribution function <span className="font-normal text-ink-muted">(drag or hover to move the cursor; shaded area = probability inside r)</span>
          </p>
          <RadialPlot o={orbital} cursor={cursor} onCursor={(r) => setCursorByKey((c) => ({ ...c, [key]: r }))} />
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-teal-700" /> most probable r
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-1 bg-amber-700" /> mean ⟨r⟩
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-red-600" /> radial node
            </span>
          </p>
        </div>
        <div className="space-y-4 text-sm">
          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="mb-2 font-semibold text-ink">
              Cursor at r = {cursor.toFixed(2)} a₀
            </p>
            <dl className="space-y-1">
              <Stat label="P(r)" value={table.p[cursorIndex].toFixed(4)} hint="per a₀" />
              <Stat label="Probability inside r" value={`${(Math.min(1, table.cdf[cursorIndex]) * 100).toFixed(1)}%`} />
            </dl>
          </div>
          <div className="rounded-xl border border-line bg-subtle p-4">
            <p className="mb-2 font-semibold text-ink">
              <OrbitalName o={orbital} /> orbital (hydrogen)
            </p>
            <dl className="space-y-1">
              <Stat label="n (principal)" value={orbital.n} />
              <Stat label="l (angular)" value={`${orbital.l} (${'spd'[orbital.l]})`} />
              <Stat label={<>m<sub>l</sub></>} value={orbital.m} />
              <Stat label="Radial nodes" value={radialCount} hint="n − l − 1" />
              <Stat label="Angular nodes" value={orbital.l} hint="= l" />
              <Stat label="Total nodes" value={orbital.n - 1} hint="n − 1" />
              <Stat label="Most probable r" value={`${table.peak.toFixed(2)} a₀`} />
              <Stat label="Mean ⟨r⟩" value={`${meanRadius(orbital).toFixed(1)} a₀`} />
              <Stat label="Energy" value={`${energyEv(orbital.n).toFixed(2)} eV`} />
            </dl>
            <p className="mt-2 text-ink-muted">Angular nodes: {orbital.angularNodes}.</p>
            {radialCount > 0 && <p className="mt-1 text-ink-muted">Radial nodes at r = {orbital.radialNodes.map((r) => r.toFixed(2)).join(' and ')} a₀.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
