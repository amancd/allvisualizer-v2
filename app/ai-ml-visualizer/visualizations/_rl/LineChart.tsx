import { responsiveSurface } from '@/lib/visualization';

/**
 * Minimal SVG line chart shared by the reinforcement-learning pages.
 * Drawn in a fixed 440 × `height` coordinate space and scaled with CSS.
 */

export interface ChartSeries {
  label: string;
  color: string;
  points: [number, number][];
  dashed?: boolean;
}

interface LineChartProps {
  series: ChartSeries[];
  xLabel: string;
  yLabel: string;
  /** Plot log10(y). Useful for convergence curves. */
  logY?: boolean;
  height?: number;
  emptyText?: string;
}

const W = 440;
const PAD = { left: 52, right: 12, top: 12, bottom: 38 };
const MAX_POINTS = 400;

function thin(points: [number, number][]): [number, number][] {
  if (points.length <= MAX_POINTS) return points;
  const stride = points.length / MAX_POINTS;
  const out: [number, number][] = [];
  for (let i = 0; i < MAX_POINTS; i++) out.push(points[Math.floor(i * stride)]);
  out.push(points[points.length - 1]);
  return out;
}

function formatTick(v: number, span: number): string {
  if (span >= 100) return v.toFixed(0);
  if (span >= 10) return v.toFixed(1);
  if (span >= 1) return v.toFixed(2);
  return v.toFixed(3);
}

export default function LineChart({ series, xLabel, yLabel, logY = false, height = 220, emptyText = 'No data yet' }: LineChartProps) {
  const ty = (y: number) => (logY ? Math.log10(Math.max(y, 1e-8)) : y);
  const visible = series.filter((s) => s.points.length > 0).map((s) => ({ ...s, points: thin(s.points) }));

  let xMax = 1;
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const s of visible) {
    for (const [x, y] of s.points) {
      xMax = Math.max(xMax, x);
      yMin = Math.min(yMin, ty(y));
      yMax = Math.max(yMax, ty(y));
    }
  }
  if (!Number.isFinite(yMin)) {
    yMin = 0;
    yMax = 1;
  }
  if (logY) {
    yMin = Math.floor(yMin);
    yMax = Math.ceil(yMax);
  }
  if (yMax - yMin < 1e-9) {
    yMin -= 0.5;
    yMax += 0.5;
  }

  const plotW = W - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;
  const sx = (x: number) => PAD.left + (x / xMax) * plotW;
  const sy = (y: number) => PAD.top + (1 - (ty(y) - yMin) / (yMax - yMin)) * plotH;
  const syRaw = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * plotH;

  const yTicks = Array.from({ length: 5 }, (_, i) => yMin + ((yMax - yMin) * i) / 4);
  const xTicks = [0, xMax / 2, xMax];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${height}`} className={responsiveSurface} role="img" aria-label={`${yLabel} versus ${xLabel}`}>
        <rect x={PAD.left} y={PAD.top} width={plotW} height={plotH} fill="#f8fafc" stroke="#e5e7eb" />
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={PAD.left} x2={W - PAD.right} y1={syRaw(v)} y2={syRaw(v)} stroke="#e5e7eb" />
            <text x={PAD.left - 6} y={syRaw(v) + 4} textAnchor="end" fontSize="11" fill="#6b7280">
              {logY ? `1e${Math.round(v)}` : formatTick(v, yMax - yMin)}
            </text>
          </g>
        ))}
        {xTicks.map((v, i) => (
          <text key={i} x={sx(v)} y={height - PAD.bottom + 15} textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'} fontSize="11" fill="#6b7280">
            {Math.round(v)}
          </text>
        ))}
        <text x={PAD.left + plotW / 2} y={height - 6} textAnchor="middle" fontSize="12" fill="#374151">
          {xLabel}
        </text>
        <text x={12} y={PAD.top + plotH / 2} textAnchor="middle" fontSize="12" fill="#374151" transform={`rotate(-90 12 ${PAD.top + plotH / 2})`}>
          {yLabel}
        </text>
        {visible.map((s) => (
          <polyline
            key={s.label}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeDasharray={s.dashed ? '6 4' : undefined}
            strokeLinejoin="round"
            points={s.points.map(([x, y]) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(' ')}
          />
        ))}
        {visible.length === 0 && (
          <text x={PAD.left + plotW / 2} y={PAD.top + plotH / 2} textAnchor="middle" fontSize="13" fill="#9ca3af">
            {emptyText}
          </text>
        )}
      </svg>
      {series.length > 1 && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
          {series.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-4"
                style={{ backgroundColor: s.color, opacity: s.dashed ? 0.6 : 1 }}
                aria-hidden
              />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
