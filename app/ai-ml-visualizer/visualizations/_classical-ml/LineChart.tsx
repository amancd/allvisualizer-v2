'use client';

import { responsiveSurface } from '@/lib/visualization';

/**
 * A small responsive SVG line chart shared by the classical-ML visualizers
 * (elbow curve, accuracy vs k, accuracy vs depth, split scans).
 */

export interface ChartSeries {
  name: string;
  color: string;
  points: { x: number; y: number }[];
  dashed?: boolean;
  /** Draw a dot on every point (default true). */
  dots?: boolean;
}

interface LineChartProps {
  series: ChartSeries[];
  xDomain: [number, number];
  yDomain: [number, number];
  xTicks: number[];
  yTicks: number[];
  xLabel: string;
  yLabel: string;
  ariaLabel: string;
  formatX?: (v: number) => string;
  formatY?: (v: number) => string;
  /** Shade a vertical band at this x (e.g. the current k). */
  highlightX?: number;
  /** Horizontal reference lines. */
  hLines?: { y: number; color: string; label?: string }[];
  /** Emphasised markers, e.g. the best split. */
  markers?: { x: number; y: number; color: string }[];
  /** Make these x values clickable. */
  selectableXs?: number[];
  onSelectX?: (x: number) => void;
}

const W = 440;
const H = 240;
const PAD = { left: 50, right: 14, top: 14, bottom: 44 };
const PW = W - PAD.left - PAD.right;
const PH = H - PAD.top - PAD.bottom;

export default function LineChart({
  series,
  xDomain,
  yDomain,
  xTicks,
  yTicks,
  xLabel,
  yLabel,
  ariaLabel,
  formatX = (v) => String(v),
  formatY = (v) => String(v),
  highlightX,
  hLines = [],
  markers = [],
  selectableXs,
  onSelectX,
}: LineChartProps) {
  const [x0, x1] = xDomain;
  const [y0, y1] = yDomain;
  const sx = (x: number) => PAD.left + (x1 === x0 ? 0.5 : (x - x0) / (x1 - x0)) * PW;
  const sy = (y: number) => PAD.top + PH - (y1 === y0 ? 0.5 : (y - y0) / (y1 - y0)) * PH;
  const step = selectableXs && selectableXs.length > 1 ? Math.abs(sx(selectableXs[1]) - sx(selectableXs[0])) : 24;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`${responsiveSurface} select-none`} role="img" aria-label={ariaLabel}>
      {/* Grid */}
      {yTicks.map((t) => (
        <g key={`y${t}`}>
          <line x1={PAD.left} x2={W - PAD.right} y1={sy(t)} y2={sy(t)} stroke="#eef0f3" />
          <text x={PAD.left - 6} y={sy(t) + 4} textAnchor="end" fontSize={11} fill="#6b7280">
            {formatY(t)}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <text key={`x${t}`} x={sx(t)} y={PAD.top + PH + 16} textAnchor="middle" fontSize={11} fill="#6b7280">
          {formatX(t)}
        </text>
      ))}
      <rect x={PAD.left} y={PAD.top} width={PW} height={PH} fill="none" stroke="#d1d5db" />
      <text x={PAD.left + PW / 2} y={H - 6} textAnchor="middle" fontSize={12} fill="#374151">
        {xLabel}
      </text>
      <text
        x={12}
        y={PAD.top + PH / 2}
        textAnchor="middle"
        fontSize={12}
        fill="#374151"
        transform={`rotate(-90 12 ${PAD.top + PH / 2})`}
      >
        {yLabel}
      </text>

      {highlightX !== undefined && (
        <rect x={sx(highlightX) - step / 2} y={PAD.top} width={step} height={PH} fill="#4f46e5" opacity={0.09} />
      )}

      {hLines.map((h, i) => (
        <g key={`h${i}`}>
          <line x1={PAD.left} x2={W - PAD.right} y1={sy(h.y)} y2={sy(h.y)} stroke={h.color} strokeDasharray="5 4" />
          {h.label && (
            <text x={W - PAD.right - 4} y={sy(h.y) - 4} textAnchor="end" fontSize={10} fill={h.color}>
              {h.label}
            </text>
          )}
        </g>
      ))}

      {series.map((s) => (
        <g key={s.name}>
          {s.points.length > 1 && (
            <polyline
              points={s.points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ')}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.dashed ? '6 4' : undefined}
              strokeLinejoin="round"
            />
          )}
          {s.dots !== false &&
            s.points.map((p, i) => <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={3} fill={s.color} />)}
        </g>
      ))}

      {markers.map((m, i) => (
        <circle key={`m${i}`} cx={sx(m.x)} cy={sy(m.y)} r={6} fill="none" stroke={m.color} strokeWidth={2.5} />
      ))}

      {selectableXs &&
        onSelectX &&
        selectableXs.map((x) => (
          <rect
            key={`s${x}`}
            x={sx(x) - step / 2}
            y={PAD.top}
            width={step}
            height={PH}
            fill="transparent"
            className="cursor-pointer"
            onClick={() => onSelectX(x)}
          >
            <title>{`${xLabel} = ${formatX(x)}`}</title>
          </rect>
        ))}
    </svg>
  );
}

/** Legend row for a chart, as HTML so it wraps on small screens. */
export function ChartLegend({ items }: { items: { name: string; color: string; dashed?: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
      {items.map((it) => (
        <span key={it.name} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-5"
            style={
              it.dashed
                ? { backgroundImage: `linear-gradient(to right, ${it.color} 60%, transparent 0)`, backgroundSize: '6px 2px' }
                : { backgroundColor: it.color }
            }
          />
          {it.name}
        </span>
      ))}
    </div>
  );
}
