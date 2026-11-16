import { useId, type ReactNode } from 'react';
import { responsiveSurface } from '@/lib/visualization';
import { niceTicks, tickLabel } from './format';

export type Point = [number, number];
type Scale = (v: number) => number;

export interface Series {
  points: Point[];
  color: string;
  width?: number;
  dash?: string;
  dots?: boolean;
}

export interface Area {
  points: Point[];
  color: string;
  opacity?: number;
}

interface LinePlotProps {
  width?: number;
  height?: number;
  x: [number, number];
  y: [number, number];
  series?: Series[];
  areas?: Area[];
  xLabel?: string;
  yLabel?: string;
  xTicks?: number[];
  yTicks?: number[];
  formatX?: (v: number) => string;
  formatY?: (v: number) => string;
  fontSize?: number;
  ariaLabel: string;
  className?: string;
  children?: (sx: Scale, sy: Scale) => ReactNode;
}

function toPath(points: Point[], sx: Scale, sy: Scale): string {
  let d = '';
  let pen = false;
  for (const [x, y] of points) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(y).toFixed(1)} `;
    pen = true;
  }
  return d;
}

export default function LinePlot({
  width = 600,
  height = 340,
  x,
  y,
  series = [],
  areas = [],
  xLabel,
  yLabel,
  xTicks,
  yTicks,
  formatX = tickLabel,
  formatY = tickLabel,
  fontSize = 15,
  ariaLabel,
  className = '',
  children,
}: LinePlotProps) {
  const clipId = `clip${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const left = fontSize * 4.2;
  const right = 14;
  const top = 14;
  const bottom = fontSize * 3.2;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const sx: Scale = (v) => left + ((v - x[0]) / (x[1] - x[0] || 1)) * plotW;
  const sy: Scale = (v) => top + plotH - ((v - y[0]) / (y[1] - y[0] || 1)) * plotH;
  const xt = xTicks ?? niceTicks(x[0], x[1], 5);
  const yt = yTicks ?? niceTicks(y[0], y[1], 4);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`${responsiveSurface} rounded-xl border border-line bg-white ${className}`} role="img" aria-label={ariaLabel}>
      <defs>
        <clipPath id={clipId}>
          <rect x={left} y={top} width={plotW} height={plotH} />
        </clipPath>
      </defs>
      {yt.map((v) => (
        <g key={`y${v}`}>
          <line x1={left} x2={left + plotW} y1={sy(v)} y2={sy(v)} stroke="#e2e8f0" strokeWidth={1} />
          <text x={left - 6} y={sy(v) + fontSize * 0.35} fontSize={fontSize * 0.85} textAnchor="end" fill="#64748b">
            {formatY(v)}
          </text>
        </g>
      ))}
      {xt.map((v) => (
        <g key={`x${v}`}>
          <line x1={sx(v)} x2={sx(v)} y1={top} y2={top + plotH} stroke="#f1f5f9" strokeWidth={1} />
          <text x={sx(v)} y={top + plotH + fontSize * 1.2} fontSize={fontSize * 0.85} textAnchor="middle" fill="#64748b">
            {formatX(v)}
          </text>
        </g>
      ))}
      <g clipPath={`url(#${clipId})`}>
        {areas.map((a, i) => {
          if (a.points.length < 2) return null;
          const base = sy(Math.max(y[0], Math.min(y[1], 0)));
          const d = `M${sx(a.points[0][0]).toFixed(1)} ${base} ${toPath(a.points, sx, sy).replace(/^M/, 'L')} L${sx(a.points[a.points.length - 1][0]).toFixed(1)} ${base} Z`;
          return <path key={i} d={d} fill={a.color} opacity={a.opacity ?? 0.3} />;
        })}
        {series.map((s, i) =>
          s.dots ? (
            <g key={i}>
              {s.points.filter(([px, py]) => Number.isFinite(px) && Number.isFinite(py)).map(([px, py], j) => (
                <circle key={j} cx={sx(px)} cy={sy(py)} r={fontSize * 0.33} fill={s.color} stroke="white" strokeWidth={1} />
              ))}
            </g>
          ) : (
            <path key={i} d={toPath(s.points, sx, sy)} fill="none" stroke={s.color} strokeWidth={s.width ?? 2.5} strokeDasharray={s.dash} strokeLinejoin="round" strokeLinecap="round" />
          ),
        )}
      </g>
      {children?.(sx, sy)}
      <line x1={left} y1={top + plotH} x2={left + plotW} y2={top + plotH} stroke="#334155" strokeWidth={1.5} />
      <line x1={left} y1={top} x2={left} y2={top + plotH} stroke="#334155" strokeWidth={1.5} />
      {xLabel && (
        <text x={left + plotW / 2} y={height - fontSize * 0.5} fontSize={fontSize} textAnchor="middle" fill="#334155">
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text
          x={fontSize * 0.9}
          y={top + plotH / 2}
          fontSize={fontSize}
          textAnchor="middle"
          fill="#334155"
          transform={`rotate(-90 ${fontSize * 0.9} ${top + plotH / 2})`}
        >
          {yLabel}
        </text>
      )}
    </svg>
  );
}
