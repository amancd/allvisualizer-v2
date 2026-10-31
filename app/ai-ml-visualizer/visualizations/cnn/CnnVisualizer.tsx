'use client';

import { useEffect, useRef, useState } from 'react';
import { Eraser, Pause, Play, RotateCcw, SkipForward, StepForward } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const W = 8; // input width and height
const K = 3; // kernel size

type Grid = number[][];

function fromPattern(rows: string[]): Grid {
  return rows.map((row) => row.split('').map((ch) => (ch === '#' ? 1 : 0)));
}

const INPUT_PRESETS: Record<string, Grid> = {
  'Digit 7': fromPattern([
    '........',
    '.######.',
    '......#.',
    '.....#..',
    '....#...',
    '...#....',
    '...#....',
    '........',
  ]),
  Cross: fromPattern([
    '#......#',
    '.#....#.',
    '..#..#..',
    '...##...',
    '...##...',
    '..#..#..',
    '.#....#.',
    '#......#',
  ]),
  Square: fromPattern([
    '........',
    '.######.',
    '.#....#.',
    '.#....#.',
    '.#....#.',
    '.#....#.',
    '.######.',
    '........',
  ]),
  'Vertical bar': fromPattern([
    '...##...',
    '...##...',
    '...##...',
    '...##...',
    '...##...',
    '...##...',
    '...##...',
    '...##...',
  ]),
};

const KERNEL_PRESETS: Record<string, Grid> = {
  'Vertical edge': [
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
  ],
  'Horizontal edge': [
    [-1, -1, -1],
    [0, 0, 0],
    [1, 1, 1],
  ],
  Diagonal: [
    [2, -1, -1],
    [-1, 2, -1],
    [-1, -1, 2],
  ],
  Sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
  'Box blur': [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],
  Identity: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
};

/* ------------------------------------------------------------------ */
/* Maths                                                               */
/* ------------------------------------------------------------------ */

/** Output size of a convolution: floor((W − K + 2P) / S) + 1. */
function convOutputSize(w: number, k: number, p: number, s: number) {
  return Math.floor((w - k + 2 * p) / s) + 1;
}

function padded(input: Grid, p: number, r: number, c: number) {
  const rr = r - p;
  const cc = c - p;
  if (rr < 0 || cc < 0 || rr >= W || cc >= W) return 0;
  return input[rr][cc];
}

function convolve(input: Grid, kernel: Grid, p: number, s: number): Grid {
  const o = convOutputSize(W, K, p, s);
  const out: Grid = [];
  for (let i = 0; i < o; i++) {
    const row: number[] = [];
    for (let j = 0; j < o; j++) {
      let sum = 0;
      for (let a = 0; a < K; a++) for (let b = 0; b < K; b++) sum += kernel[a][b] * padded(input, p, i * s + a, j * s + b);
      row.push(sum);
    }
    out.push(row);
  }
  return out;
}

function maxPool(map: Grid): Grid {
  const n = Math.floor(map.length / 2);
  const out: Grid = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      row.push(Math.max(map[2 * i][2 * j], map[2 * i][2 * j + 1], map[2 * i + 1][2 * j], map[2 * i + 1][2 * j + 1]));
    }
    out.push(row);
  }
  return out;
}

/** Blue for negative, white for zero, orange for positive. */
function divergingColor(v: number, maxAbs: number) {
  const t = maxAbs === 0 ? 0 : Math.max(-1, Math.min(1, v / maxAbs));
  if (t >= 0) {
    const r = 255;
    const g = Math.round(255 - t * (255 - 140));
    const b = Math.round(255 - t * 255);
    return `rgb(${r},${g},${b})`;
  }
  const u = -t;
  const r = Math.round(255 - u * (255 - 59));
  const g = Math.round(255 - u * (255 - 130));
  const b = Math.round(255 - u * (255 - 246));
  return `rgb(${r},${g},${b})`;
}

function maxAbsOf(grid: Grid) {
  return grid.reduce((m, row) => row.reduce((mm, v) => Math.max(mm, Math.abs(v)), m), 0);
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

const CELL = 40;

function ValueGrid({
  grid,
  label,
  highlight,
  revealed = Infinity,
  maxAbs,
}: {
  grid: Grid;
  label: string;
  highlight?: [number, number];
  revealed?: number;
  maxAbs?: number;
}) {
  const n = grid.length;
  const size = Math.max(n, 1) * CELL;
  const scale = maxAbs ?? maxAbsOf(grid);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={`${responsiveSurface} mx-auto`} role="img" aria-label={label}>
      {grid.map((row, i) =>
        row.map((v, j) => {
          const idx = i * n + j;
          const shown = idx < revealed;
          return (
            <g key={`${i}-${j}`}>
              <rect
                x={j * CELL}
                y={i * CELL}
                width={CELL}
                height={CELL}
                fill={shown ? divergingColor(v, scale) : '#f8fafc'}
                stroke="#d1d5db"
              />
              {shown && (
                <text x={j * CELL + CELL / 2} y={i * CELL + CELL / 2 + 5} textAnchor="middle" fontSize={14} fill="#0b1020">
                  {Number.isInteger(v) ? v : v.toFixed(1)}
                </text>
              )}
            </g>
          );
        }),
      )}
      {highlight && (
        <rect
          x={highlight[1] * CELL + 1.5}
          y={highlight[0] * CELL + 1.5}
          width={CELL - 3}
          height={CELL - 3}
          fill="none"
          stroke="#4f46e5"
          strokeWidth={3}
        />
      )}
    </svg>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-card border border-line bg-white p-4 shadow-card">
      <h3 className="font-semibold text-ink">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layer-stack diagram for a small CNN                                 */
/* ------------------------------------------------------------------ */

interface StackLayer {
  name: string;
  detail: string;
  size: number;
  channels: number;
  params: number;
}

function buildStack(): StackLayer[] {
  const layers: StackLayer[] = [{ name: 'Input', detail: 'grayscale image', size: 28, channels: 1, params: 0 }];
  const conv = (name: string, cout: number, k: number, p: number) => {
    const prev = layers[layers.length - 1];
    layers.push({
      name,
      detail: `${cout} filters ${k}×${k}, P=${p}, S=1`,
      size: convOutputSize(prev.size, k, p, 1),
      channels: cout,
      params: (k * k * prev.channels + 1) * cout,
    });
  };
  const pool = (name: string) => {
    const prev = layers[layers.length - 1];
    layers.push({ name, detail: 'max 2×2, S=2', size: Math.floor(prev.size / 2), channels: prev.channels, params: 0 });
  };
  conv('Conv 1 + ReLU', 8, 3, 1);
  pool('Pool 1');
  conv('Conv 2 + ReLU', 16, 3, 1);
  pool('Pool 2');
  conv('Conv 3 + ReLU', 32, 3, 0);
  const last = layers[layers.length - 1];
  const flat = last.size * last.size * last.channels;
  layers.push({ name: 'Dense', detail: `flatten ${flat} → 10 classes`, size: 1, channels: 10, params: (flat + 1) * 10 });
  return layers;
}

const STACK = buildStack();

function LayerStackDiagram() {
  const colW = 125;
  const height = 230;
  const base = 175;
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${STACK.length * colW} ${height}`}
          className={`${responsiveSurface} min-w-[560px]`}
          role="img"
          aria-label="Layer stack of a small CNN: spatial size shrinks while the number of channels grows"
        >
          {STACK.map((layer, i) => {
            const cx = i * colW + colW / 2;
            const side = layer.name === 'Dense' ? 10 : 20 + (layer.size / 28) * 70;
            const sheets = Math.min(layer.channels, layer.name === 'Dense' ? 1 : 8);
            const offset = layer.channels > 1 ? Math.min(4, 40 / sheets) : 0;
            const fill = layer.name.startsWith('Pool') ? '#d1fae5' : layer.name === 'Input' ? '#e5e7eb' : layer.name === 'Dense' ? '#fde68a' : '#c7d2fe';
            const stroke = layer.name.startsWith('Pool') ? '#059669' : layer.name === 'Input' ? '#6b7280' : layer.name === 'Dense' ? '#d97706' : '#4f46e5';
            const totalW = side + offset * (sheets - 1);
            const x0 = cx - totalW / 2;
            const denseH = 100;
            return (
              <g key={layer.name}>
                {layer.name === 'Dense' ? (
                  <rect x={cx - 6} y={base - denseH} width={12} height={denseH} fill={fill} stroke={stroke} rx={2} />
                ) : (
                  Array.from({ length: sheets }).map((_, s) => (
                    <rect
                      key={s}
                      x={x0 + s * offset}
                      y={base - side - s * offset * 0.6}
                      width={side}
                      height={side}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={1}
                      opacity={0.95}
                    />
                  ))
                )}
                {i < STACK.length - 1 && (
                  <path
                    d={`M ${i * colW + colW - 8} ${base - 40} l 14 0 m -5 -4 l 5 4 l -5 4`}
                    stroke="#9ca3af"
                    fill="none"
                    strokeWidth={1.5}
                  />
                )}
                <text x={cx} y={base + 20} textAnchor="middle" fontSize={13} fontWeight={600} fill="#0b1020">
                  {layer.name}
                </text>
                <text x={cx} y={base + 38} textAnchor="middle" fontSize={12} fill="#4b5563" fontFamily="monospace">
                  {layer.name === 'Dense' ? '10' : `${layer.size}×${layer.size}×${layer.channels}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-sm">
          <thead className="bg-subtle text-left text-ink">
            <tr>
              <th className="px-3 py-2 font-semibold">Layer</th>
              <th className="px-3 py-2 font-semibold">Operation</th>
              <th className="px-3 py-2 text-right font-semibold">Output shape</th>
              <th className="px-3 py-2 text-right font-semibold">Parameters</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink-muted">
            {STACK.map((l) => (
              <tr key={l.name}>
                <td className="px-3 py-2 text-ink">{l.name}</td>
                <td className="px-3 py-2">{l.detail}</td>
                <td className="px-3 py-2 text-right font-mono">{l.name === 'Dense' ? '10' : `${l.size}×${l.size}×${l.channels}`}</td>
                <td className="px-3 py-2 text-right font-mono">{l.params.toLocaleString('en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main visualizer                                                     */
/* ------------------------------------------------------------------ */

export default function CnnVisualizer() {
  const [input, setInput] = useState<Grid>(INPUT_PRESETS['Digit 7']);
  const [kernel, setKernel] = useState<Grid>(KERNEL_PRESETS['Vertical edge']);
  const [padding, setPadding] = useState(0);
  const [stride, setStride] = useState(1);
  const [pos, setPos] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [delay, setDelay] = useState(400);

  const svgRef = useRef<SVGSVGElement>(null);
  const paintValue = useRef<number | null>(null);

  const o = convOutputSize(W, K, padding, stride);
  const total = o * o;
  const current = Math.min(pos, total - 1);
  const ci = Math.floor(current / o);
  const cj = current % o;
  const done = current === total - 1;

  const featureMap = convolve(input, kernel, padding, stride);
  const relu = featureMap.map((row) => row.map((v) => Math.max(0, v)));
  const pooled = maxPool(relu);
  const featureMaxAbs = maxAbsOf(featureMap);

  // Animation: one setTimeout per step, cleared on unmount or when anything changes.
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      if (current >= total - 1) setPlaying(false);
      else setPos(current + 1);
    }, delay);
    return () => clearTimeout(id);
  }, [playing, current, total, delay]);

  const resetScan = () => {
    setPos(0);
    setPlaying(false);
  };

  // Painting on the input grid
  const N = W + 2 * padding;
  const inputSize = N * CELL;

  const cellAt = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return null;
    const { x, y } = toDrawingPoint(e, svgRef.current);
    const r = Math.floor(y / CELL) - padding;
    const c = Math.floor(x / CELL) - padding;
    if (r < 0 || c < 0 || r >= W || c >= W) return null;
    return [r, c] as const;
  };

  const paint = (r: number, c: number, value: number) => {
    setInput((prev) => {
      if (prev[r][c] === value) return prev;
      const next = prev.map((row) => row.slice());
      next[r][c] = value;
      return next;
    });
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const cell = cellAt(e);
    if (!cell) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const value = input[cell[0]][cell[1]] ? 0 : 1;
    paintValue.current = value;
    paint(cell[0], cell[1], value);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (paintValue.current === null) return;
    const cell = cellAt(e);
    if (cell) paint(cell[0], cell[1], paintValue.current);
  };

  const onPointerUp = () => {
    paintValue.current = null;
  };

  const setKernelCell = (a: number, b: number, raw: string) => {
    const v = Math.max(-9, Math.min(9, Math.round(Number(raw) || 0)));
    setKernel((prev) => prev.map((row, i) => row.map((x, j) => (i === a && j === b ? v : x))));
  };

  // Element-wise products for the current window
  const products: { x: number; k: number }[][] = [];
  for (let a = 0; a < K; a++) {
    const row: { x: number; k: number }[] = [];
    for (let b = 0; b < K; b++) row.push({ x: padded(input, padding, ci * stride + a, cj * stride + b), k: kernel[a][b] });
    products.push(row);
  }
  const currentSum = featureMap[ci][cj];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-card border border-line bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Input pattern</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(INPUT_PRESETS).map((name) => (
                <Button key={name} size="sm" variant="outline" onClick={() => setInput(INPUT_PRESETS[name])}>
                  {name}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Eraser className="h-4 w-4" />}
                onClick={() => setInput(Array.from({ length: W }, () => Array(W).fill(0)))}
              >
                Clear
              </Button>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Padding P</p>
            <div className="flex gap-2">
              {[0, 1].map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={padding === p ? 'primary' : 'outline'}
                  onClick={() => {
                    setPadding(p);
                    resetScan();
                  }}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Stride S</p>
            <div className="flex gap-2">
              {[1, 2].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={stride === s ? 'primary' : 'outline'}
                  onClick={() => {
                    setStride(s);
                    resetScan();
                  }}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            leftIcon={playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            onClick={() => {
              if (!playing && done) setPos(0);
              setPlaying(!playing);
            }}
          >
            {playing ? 'Pause' : 'Play'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<StepForward className="h-4 w-4" />}
            disabled={done}
            onClick={() => {
              setPlaying(false);
              setPos(Math.min(current + 1, total - 1));
            }}
          >
            Step
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<SkipForward className="h-4 w-4" />}
            onClick={() => {
              setPlaying(false);
              setPos(total - 1);
            }}
          >
            Finish
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={resetScan}>
            Reset
          </Button>
          <label className="ml-auto flex items-center gap-2 text-sm text-ink-muted">
            Speed
            <input
              type="range"
              min={100}
              max={900}
              step={100}
              value={1000 - delay}
              onChange={(e) => setDelay(1000 - Number(e.target.value))}
              className="w-28 accent-brand-600"
              aria-label="Animation speed"
            />
          </label>
        </div>

        <div className="mt-4 rounded-lg bg-subtle p-3 font-mono text-sm text-ink ring-1 ring-inset ring-line">
          O = ⌊(W − K + 2P) / S⌋ + 1 = ⌊({W} − {K} + 2·{padding}) / {stride}⌋ + 1 ={' '}
          <strong>{o}</strong>
          <span className="text-ink-muted">
            {'  '}→ feature map {o}×{o}, after 2×2 pooling {Math.floor(o / 2)}×{Math.floor(o / 2)}
          </span>
        </div>
      </div>

      {/* Input, kernel, feature map */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel
          title={`Input ${W}×${W}${padding ? ` + padding (${N}×${N})` : ''}`}
          subtitle="Click or drag to paint. Grey cells are zero padding."
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${inputSize} ${inputSize}`}
            className={`${responsiveSurface} mx-auto max-w-[360px] cursor-crosshair touch-none select-none`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="img"
            aria-label="Paintable input grid"
          >
            {Array.from({ length: N }).map((_, r) =>
              Array.from({ length: N }).map((__, c) => {
                const isPad = r < padding || c < padding || r >= padding + W || c >= padding + W;
                const v = padded(input, padding, r, c);
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={c * CELL}
                    y={r * CELL}
                    width={CELL}
                    height={CELL}
                    fill={isPad ? '#e5e7eb' : v ? '#1e293b' : '#ffffff'}
                    stroke="#d1d5db"
                  />
                );
              }),
            )}
            <rect
              x={cj * stride * CELL + 1.5}
              y={ci * stride * CELL + 1.5}
              width={K * CELL - 3}
              height={K * CELL - 3}
              fill="rgba(79,70,229,0.15)"
              stroke="#4f46e5"
              strokeWidth={3}
              pointerEvents="none"
            />
          </svg>
        </Panel>

        <Panel title="Kernel 3×3" subtitle="Pick a preset or type your own weights (−9 to 9).">
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(KERNEL_PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => setKernel(KERNEL_PRESETS[name])}
                className="rounded-md border border-line bg-white px-2 py-1 text-xs font-medium text-ink-muted hover:bg-subtle hover:text-ink"
              >
                {name}
              </button>
            ))}
          </div>
          <div className="mx-auto mt-3 grid w-fit grid-cols-3 gap-1.5">
            {kernel.map((row, a) =>
              row.map((v, b) => (
                <input
                  key={`${a}-${b}`}
                  type="number"
                  min={-9}
                  max={9}
                  value={v}
                  onChange={(e) => setKernelCell(a, b, e.target.value)}
                  aria-label={`Kernel row ${a + 1} column ${b + 1}`}
                  className="h-12 w-14 rounded-md border border-line-strong text-center font-mono text-base text-ink focus:border-brand-500 focus:outline-none"
                  style={{ backgroundColor: divergingColor(v, 5) }}
                />
              )),
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-ink">
              Position ({ci}, {cj}): multiply and sum
            </p>
            <div className="mt-2 overflow-x-auto">
              <div className="grid w-fit grid-cols-3 gap-1 font-mono text-xs">
                {products.map((row, a) =>
                  row.map(({ x, k }, b) => (
                    <div
                      key={`${a}-${b}`}
                      className={`rounded px-2 py-1 text-center ring-1 ring-inset ring-line ${x * k !== 0 ? 'bg-brand-50 text-ink' : 'bg-subtle text-ink-faint'}`}
                    >
                      {x}·{k < 0 ? `(${k})` : k}
                    </div>
                  )),
                )}
              </div>
            </div>
            <p className="mt-2 font-mono text-sm text-ink">
              Σ = <strong>{currentSum}</strong>
            </p>
          </div>
        </Panel>

        <Panel title={`Feature map ${o}×${o}`} subtitle={`Filled cell by cell: ${current + 1} of ${total}`}>
          <div className="mx-auto max-w-[320px]">
            <ValueGrid grid={featureMap} label="Feature map" highlight={[ci, cj]} revealed={current + 1} maxAbs={featureMaxAbs} />
          </div>
          <p className="mt-2 text-xs text-ink-muted">Orange = positive response, blue = negative.</p>
        </Panel>
      </div>

      {/* ReLU + pooling */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title={`ReLU ${o}×${o}`} subtitle="max(0, x) keeps only positive responses.">
          {done ? (
            <div className="mx-auto max-w-[280px]">
              <ValueGrid grid={relu} label="Feature map after ReLU" maxAbs={featureMaxAbs} />
            </div>
          ) : (
            <p className="rounded-lg bg-subtle p-4 text-sm text-ink-muted">Finish the scan to apply ReLU to the whole feature map.</p>
          )}
        </Panel>
        <Panel
          title={`Max pool 2×2 → ${Math.floor(o / 2)}×${Math.floor(o / 2)}`}
          subtitle={o % 2 === 1 ? 'Odd size: the last row and column are dropped.' : 'Each output keeps the largest value in its 2×2 block.'}
        >
          {done ? (
            pooled.length > 0 ? (
              <div className="mx-auto max-w-[200px]">
                <ValueGrid grid={pooled} label="Pooled map" maxAbs={featureMaxAbs} />
              </div>
            ) : (
              <p className="text-sm text-ink-muted">Feature map is too small to pool.</p>
            )
          ) : (
            <p className="rounded-lg bg-subtle p-4 text-sm text-ink-muted">Finish the scan to pool the ReLU output.</p>
          )}
        </Panel>
      </div>

      {/* Layer stack */}
      <Panel
        title="Through a small CNN"
        subtitle="Spatial size shrinks with pooling while the number of feature maps (channels) grows. Shapes and parameter counts are computed with the same formula."
      >
        <LayerStackDiagram />
      </Panel>
    </div>
  );
}
