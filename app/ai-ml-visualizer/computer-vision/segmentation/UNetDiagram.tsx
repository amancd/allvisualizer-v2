import { responsiveSurface } from '@/lib/visualization';

/** Feature-map size and channel count at each level, for a 128×128 input. */
const LEVELS = [
  { size: 128, channels: 64 },
  { size: 64, channels: 128 },
  { size: 32, channels: 256 },
  { size: 16, channels: 512 },
];
const BOTTLENECK = { size: 8, channels: 1024 };

const VIEW_W = 600;
const VIEW_H = 350;

// Block geometry: deeper levels are smaller (less spatial size) but wider (more channels).
const block = (i: number) => ({ x: 30 + i * 55, y: 30 + i * 68, w: 14 + i * 6, h: 56 - i * 8 });
const mirror = (b: ReturnType<typeof block>) => ({ ...b, x: VIEW_W - b.x - b.w });

const COLORS = {
  enc: '#6366f1',
  dec: '#0ea5e9',
  pool: '#e11d48',
  up: '#16a34a',
  skip: '#64748b',
};

/** Static diagram of the U-Net encoder-decoder with skip connections. */
export default function UNetDiagram() {
  const enc = LEVELS.map((_, i) => block(i));
  const dec = enc.map(mirror);
  const bott = { x: VIEW_W / 2 - 24, y: 30 + 4 * 68, w: 48, h: 26 };

  return (
    <figure className="rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={responsiveSurface} role="img" aria-label="U-Net architecture diagram">
        <defs>
          {Object.entries(COLORS).map(([name, color]) => (
            <marker key={name} id={`unet-${name}`} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={color} />
            </marker>
          ))}
        </defs>

        <text x={enc[0].x} y={18} fontSize={16} fill="#0b1020" fontWeight={600}>
          image in
        </text>
        <text x={dec[0].x + dec[0].w} y={18} fontSize={16} fill="#0b1020" fontWeight={600} textAnchor="end">
          mask out
        </text>

        {/* skip connections */}
        {enc.map((e, i) => {
          const yMid = e.y + e.h / 2;
          return (
            <g key={`skip-${i}`}>
              <line
                x1={e.x + e.w + 4}
                y1={yMid}
                x2={dec[i].x - 4}
                y2={yMid}
                stroke={COLORS.skip}
                strokeWidth={2}
                strokeDasharray="7 5"
                markerEnd="url(#unet-skip)"
              />
              <text x={VIEW_W / 2} y={yMid - 7} fontSize={15} fill="#334155" textAnchor="middle">
                {LEVELS[i].size}×{LEVELS[i].size} · {LEVELS[i].channels}
              </text>
            </g>
          );
        })}

        {/* down (max pool) and up (up-conv) arrows */}
        {enc.map((e, i) => {
          const next = i + 1 < enc.length ? enc[i + 1] : bott;
          const nextDec = i + 1 < dec.length ? dec[i + 1] : bott;
          return (
            <g key={`arrows-${i}`} strokeWidth={2.5}>
              <line x1={e.x + e.w / 2} y1={e.y + e.h + 3} x2={next.x + 2} y2={next.y - 3} stroke={COLORS.pool} markerEnd="url(#unet-pool)" />
              <line
                x1={nextDec.x + nextDec.w - 2}
                y1={nextDec.y - 3}
                x2={dec[i].x + dec[i].w / 2}
                y2={dec[i].y + dec[i].h + 3}
                stroke={COLORS.up}
                markerEnd="url(#unet-up)"
              />
            </g>
          );
        })}

        {enc.map((e, i) => (
          <rect key={`enc-${i}`} x={e.x} y={e.y} width={e.w} height={e.h} rx={3} fill={COLORS.enc} />
        ))}
        {dec.map((d, i) => (
          <g key={`dec-${i}`}>
            {/* left half: copied encoder features, right half: upsampled features */}
            <rect x={d.x} y={d.y} width={d.w / 2} height={d.h} rx={2} fill={COLORS.enc} opacity={0.45} />
            <rect x={d.x + d.w / 2} y={d.y} width={d.w / 2} height={d.h} rx={2} fill={COLORS.dec} />
          </g>
        ))}
        <rect x={bott.x} y={bott.y} width={bott.w} height={bott.h} rx={3} fill="#312e81" />
        <text x={VIEW_W / 2} y={bott.y + bott.h + 20} fontSize={15} fill="#334155" textAnchor="middle">
          bottleneck {BOTTLENECK.size}×{BOTTLENECK.size} · {BOTTLENECK.channels}
        </text>

        <text x={20} y={VIEW_H - 40} fontSize={15} fill="#4f46e5" fontWeight={600}>
          encoder: what
        </text>
        <text x={VIEW_W - 20} y={VIEW_H - 40} fontSize={15} fill="#0284c7" fontWeight={600} textAnchor="end">
          decoder: where
        </text>
      </svg>
      <figcaption className="mt-4 grid grid-cols-1 gap-2 text-sm text-ink-muted sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <span className="h-3 w-6 shrink-0 rounded-sm bg-indigo-500" /> Two 3×3 convolutions + ReLU (encoder)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-6 shrink-0 bg-rose-600" /> 2×2 max pool: halve the size, double the channels
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-6 shrink-0 bg-green-600" /> 2×2 up-convolution: double the size
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-6 shrink-0 border-t-2 border-dashed border-slate-500" /> Skip: copy encoder features and concatenate
        </span>
        <span className="flex items-center gap-2 sm:col-span-2">
          <span className="h-3 w-6 shrink-0 rounded-sm bg-sky-500" /> Decoder convolutions; a final 1×1 convolution gives class scores for every pixel
        </span>
      </figcaption>
    </figure>
  );
}
