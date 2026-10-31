'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ImageIcon, RotateCcw, Upload } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import {
  LAPLACIAN,
  OPERATORS,
  SECTOR_OFFSETS,
  STRONG,
  WEAK,
  at,
  canny,
  classesToRGBA,
  directionToRGBA,
  filter3,
  gradient,
  grayToRGBA,
  loadGrayFromFile,
  makeSyntheticImage,
  maskToRGBA,
  maxOf,
  sectorOf,
  signedToRGBA,
  type Gray,
  type Kernel3,
} from './edgeOps';

type Mode = 'operators' | 'canny';
type OperatorId = 'sobel' | 'prewitt' | 'laplacian';
type Stage = 'blur' | 'gradient' | 'nms' | 'threshold' | 'hysteresis';

const STAGES: { id: Stage; label: string; caption: string }[] = [
  { id: 'blur', label: '1. Gaussian blur', caption: 'Smooths noise so it does not produce false edges.' },
  { id: 'gradient', label: '2. Gradient', caption: 'Sobel magnitude of the blurred image: thick, bright ridges along edges.' },
  { id: 'nms', label: '3. Non-max suppression', caption: 'Keeps only pixels that are the peak across the edge, thinning ridges to 1 px.' },
  { id: 'threshold', label: '4. Double threshold', caption: 'White = strong (above high), amber = weak (between low and high), black = discarded.' },
  { id: 'hysteresis', label: '5. Hysteresis', caption: 'Weak pixels survive only if they connect to a strong pixel. This is the final Canny output.' },
];

interface Point {
  x: number;
  y: number;
}

/** Draws an RGBA buffer to a canvas at native resolution, scaled up with CSS. Tapping picks a pixel. */
function PixelCanvas({
  width,
  height,
  rgba,
  label,
  picked,
  onPick,
}: {
  width: number;
  height: number;
  rgba: Uint8ClampedArray;
  label: string;
  picked: Point;
  onPick: (p: Point) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const img = ctx.createImageData(width, height);
    img.data.set(rgba);
    ctx.putImageData(img, 0, 0);
  }, [rgba, width, height]);

  const pick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = toDrawingPoint(e, e.currentTarget);
    onPick({ x: Math.min(width - 1, Math.max(0, Math.floor(x))), y: Math.min(height - 1, Math.max(0, Math.floor(y))) });
  };

  return (
    <figure className="min-w-0">
      <div className="relative overflow-hidden rounded-lg border border-line-strong bg-black">
        <canvas
          ref={ref}
          width={width}
          height={height}
          aria-label={label}
          onPointerDown={pick}
          className={`${responsiveSurface} cursor-crosshair [image-rendering:pixelated]`}
        />
        {/* Marker for the inspected pixel: a 3×3 box, positioned in % so it scales with the canvas. */}
        <div
          className="pointer-events-none absolute border-2 border-fuchsia-500"
          style={{
            left: `${((picked.x - 1) / width) * 100}%`,
            top: `${((picked.y - 1) / height) * 100}%`,
            width: `${(3 / width) * 100}%`,
            height: `${(3 / height) * 100}%`,
            minWidth: 8,
            minHeight: 8,
          }}
        />
      </div>
      <figcaption className="mt-1.5 text-sm font-medium text-ink">{label}</figcaption>
    </figure>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = (v: number) => String(v),
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <label className="block min-w-0 flex-1 basis-48">
      <span className="flex justify-between text-sm text-ink-muted">
        <span>{label}</span>
        <span className="font-mono text-ink">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-brand-600"
      />
    </label>
  );
}

function Toggle<T extends string>({ options, value, onChange }: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-subtle p-1 ring-1 ring-inset ring-line">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={o.id === value}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            o.id === value ? 'bg-white text-ink shadow-card ring-1 ring-line' : 'text-ink-muted hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A 3×3 grid of numbers. `shade` colours each cell by its value (used for the pixel neighbourhood). */
function Grid3({ title, values, shade = false, digits = 0 }: { title: string; values: number[][]; shade?: boolean; digits?: number }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">{title}</p>
      <div className="grid w-fit grid-cols-3 gap-0.5 rounded-md bg-line p-0.5">
        {values.flat().map((v, i) => {
          const g = Math.max(0, Math.min(255, Math.round(v)));
          return (
            <div
              key={i}
              className={`grid h-10 w-12 place-items-center rounded-sm font-mono text-xs ${i === 4 ? 'ring-2 ring-inset ring-fuchsia-500' : ''}`}
              style={shade ? { background: `rgb(${g},${g},${g})`, color: g > 140 ? '#0b1020' : '#ffffff' } : { background: '#ffffff' }}
            >
              {Number.isInteger(v) ? v : v.toFixed(digits)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function neighbourhood(img: Gray, p: Point): number[][] {
  return [-1, 0, 1].map((j) => [-1, 0, 1].map((i) => Math.round(at(img, p.x + i, p.y + j))));
}

function products(n: number[][], k: Kernel3) {
  return n.map((row, j) => row.map((v, i) => v * k[j][i]));
}

function sum(m: number[][]) {
  return m.flat().reduce((a, b) => a + b, 0);
}

/** Kernel, element-wise products and their sum for one kernel at the inspected pixel. */
function KernelArithmetic({ name, n, k }: { name: string; n: number[][]; k: Kernel3 }) {
  const p = products(n, k);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-3">
        <Grid3 title={`${name} kernel`} values={k} />
        <span className="pb-12 font-mono text-ink-muted">×</span>
        <Grid3 title="pixel × weight" values={p} />
        <span className="pb-12 font-mono text-ink-muted">→</span>
        <div className="pb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">sum</p>
          <p className="font-mono text-lg text-ink">
            {name} = {sum(p)}
          </p>
        </div>
      </div>
      <p className="break-words font-mono text-xs text-ink-muted">
        {p
          .flat()
          .filter((v, i) => k[Math.floor(i / 3)][i % 3] !== 0)
          .map((v) => (v < 0 ? `(${v})` : String(v)))
          .join(' + ')}{' '}
        = {sum(p)}
      </p>
    </div>
  );
}

export default function EdgeDetectionVisualizer() {
  const [mode, setMode] = useState<Mode>('operators');
  const [operator, setOperator] = useState<OperatorId>('sobel');
  const [noise, setNoise] = useState(6);
  const [uploaded, setUploaded] = useState<Gray | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [sigma, setSigma] = useState(1.4);
  const [low, setLow] = useState(40);
  const [high, setHigh] = useState(100);
  const [stage, setStage] = useState<Stage>('hysteresis');
  const [picked, setPicked] = useState<Point>({ x: 71, y: 45 });
  const fileRef = useRef<HTMLInputElement>(null);

  const image = useMemo(() => uploaded ?? makeSyntheticImage(noise), [uploaded, noise]);
  const { width, height } = image;
  const p = { x: Math.min(picked.x, width - 1), y: Math.min(picked.y, height - 1) };

  // Gradient operators (Sobel / Prewitt) or the Laplacian, on the raw image.
  const ops = useMemo(() => {
    if (operator === 'laplacian') {
      const response = filter3(image, LAPLACIAN);
      const abs = response.map(Math.abs);
      return { kind: 'laplacian' as const, response, abs, maxAbs: maxOf(response, true) };
    }
    const op = OPERATORS[operator];
    const g = gradient(image, op.kx, op.ky);
    return { kind: 'gradient' as const, g, maxG: Math.max(maxOf(g.gx, true), maxOf(g.gy, true)), maxMag: maxOf(g.mag) };
  }, [image, operator]);

  const cannyResult = useMemo(() => canny(image, sigma, low, high), [image, sigma, low, high]);

  const originalRGBA = useMemo(() => grayToRGBA(image.data), [image]);

  const operatorPanels = useMemo(() => {
    if (ops.kind === 'laplacian') {
      return [
        { label: 'Laplacian response (signed)', rgba: signedToRGBA(ops.response, ops.maxAbs) },
        { label: '|Laplacian|', rgba: grayToRGBA(ops.abs, 255 / (ops.maxAbs || 1)) },
      ];
    }
    return [
      { label: 'Gx (horizontal change)', rgba: signedToRGBA(ops.g.gx, ops.maxG) },
      { label: 'Gy (vertical change)', rgba: signedToRGBA(ops.g.gy, ops.maxG) },
      { label: 'Magnitude |G|', rgba: grayToRGBA(ops.g.mag, 255 / (ops.maxMag || 1)) },
      { label: 'Direction θ (hue)', rgba: directionToRGBA(ops.g, ops.maxMag) },
    ];
  }, [ops]);

  const stageRGBA = useMemo(() => {
    const c = cannyResult;
    const maxMag = maxOf(c.grad.mag) || 1;
    return {
      blur: grayToRGBA(c.blurred.data),
      gradient: grayToRGBA(c.grad.mag, 255 / maxMag),
      nms: grayToRGBA(c.thin, 255 / maxMag),
      threshold: classesToRGBA(c.classes),
      hysteresis: maskToRGBA(c.edges),
    } satisfies Record<Stage, Uint8ClampedArray>;
  }, [cannyResult]);

  const stats = useMemo(() => {
    let strong = 0;
    let weak = 0;
    let edges = 0;
    let weakKept = 0;
    for (let i = 0; i < cannyResult.classes.length; i++) {
      if (cannyResult.classes[i] === STRONG) strong++;
      if (cannyResult.classes[i] === WEAK) {
        weak++;
        if (cannyResult.edges[i]) weakKept++;
      }
      if (cannyResult.edges[i]) edges++;
    }
    return { strong, weak, edges, weakKept };
  }, [cannyResult]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    loadGrayFromFile(file, 200, 150)
      .then((g) => {
        setUploaded(g);
        setUploadError('');
        setPicked({ x: Math.floor(g.width / 2), y: Math.floor(g.height / 2) });
      })
      .catch((err: Error) => setUploadError(err.message));
  };

  const setLowClamped = (v: number) => {
    setLow(v);
    if (v > high) setHigh(v);
  };
  const setHighClamped = (v: number) => {
    setHigh(v);
    if (v < low) setLow(v);
  };

  // Inspector numbers. In Canny mode the kernels run on the blurred image, exactly as the pipeline does.
  const inspectSource = mode === 'canny' ? cannyResult.blurred : image;
  const n = neighbourhood(inspectSource, p);
  const i = p.y * width + p.x;

  const sobelLike = mode === 'canny' ? OPERATORS.sobel : operator === 'laplacian' ? null : OPERATORS[operator];

  const panelClass = 'rounded-card border border-line bg-white p-4 shadow-card sm:p-6';

  return (
    <div className="space-y-6">
      {/* Source and mode */}
      <div className={`${panelClass} space-y-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <Toggle
            options={[
              { id: 'operators', label: 'Gradient operators' },
              { id: 'canny', label: 'Canny pipeline' },
            ]}
            value={mode}
            onChange={setMode}
          />
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <Button variant="outline" size="sm" leftIcon={<Upload className="h-4 w-4" />} onClick={() => fileRef.current?.click()}>
            Use your image
          </Button>
          {uploaded && (
            <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => setUploaded(null)}>
              Back to test image
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {!uploaded && (
            <Slider label="Noise added to test image" value={noise} min={0} max={40} step={1} onChange={setNoise} format={(v) => `±${v}`} />
          )}
          {mode === 'canny' && (
            <>
              <Slider label="Blur σ" value={sigma} min={0.5} max={3} step={0.1} onChange={setSigma} format={(v) => v.toFixed(1)} />
              <Slider label="Low threshold" value={low} min={0} max={400} step={5} onChange={setLowClamped} />
              <Slider label="High threshold" value={high} min={0} max={400} step={5} onChange={setHighClamped} />
            </>
          )}
        </div>
        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
        <p className="flex items-start gap-2 text-sm text-ink-muted">
          <ImageIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {uploaded
            ? `Your image, converted to grayscale at ${width}×${height}. It never leaves your browser.`
            : 'A 160×120 grayscale test image generated in the browser. Tap any image to inspect a pixel.'}
        </p>
      </div>

      {mode === 'operators' ? (
        <div className={`${panelClass} space-y-4`}>
          <Toggle
            options={[
              { id: 'sobel', label: 'Sobel' },
              { id: 'prewitt', label: 'Prewitt' },
              { id: 'laplacian', label: 'Laplacian' },
            ]}
            value={operator}
            onChange={setOperator}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PixelCanvas width={width} height={height} rgba={originalRGBA} label="Original (grayscale)" picked={p} onPick={setPicked} />
            {operatorPanels.map((panel) => (
              <PixelCanvas key={panel.label} width={width} height={height} rgba={panel.rgba} label={panel.label} picked={p} onPick={setPicked} />
            ))}
          </div>
          <p className="text-sm text-ink-muted">
            {ops.kind === 'laplacian'
              ? 'Orange = positive second derivative, blue = negative. Edges sit on the zero crossing between an orange and a blue band, which is why the Laplacian draws double lines and reacts strongly to noise.'
              : 'Gx and Gy: orange = brightness increases (right / down), blue = it decreases. Direction: hue encodes the angle of the gradient (red → right, yellow-green → down, cyan → left, violet → up), brightness encodes strength.'}
          </p>
        </div>
      ) : (
        <div className={`${panelClass} space-y-4`}>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((s) => (
              <Button key={s.id} size="sm" variant={s.id === stage ? 'primary' : 'outline'} onClick={() => setStage(s.id)}>
                {s.label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="min-w-0">
              <PixelCanvas
                width={width}
                height={height}
                rgba={stageRGBA[stage]}
                label={STAGES.find((s) => s.id === stage)!.label}
                picked={p}
                onPick={setPicked}
              />
              <p className="mt-2 text-sm text-ink-muted">{STAGES.find((s) => s.id === stage)!.caption}</p>
            </div>
            <div className="min-w-0 space-y-4">
              <PixelCanvas width={width} height={height} rgba={originalRGBA} label="Input" picked={p} onPick={setPicked} />
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['Strong pixels', stats.strong],
                  ['Weak pixels', stats.weak],
                  ['Weak kept', stats.weakKept],
                  ['Final edge pixels', stats.edges],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-line bg-subtle p-2">
                    <dt className="text-ink-muted">{k}</dt>
                    <dd className="font-mono text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStage(s.id)}
                className={`min-w-0 rounded-lg p-1 text-left ring-2 transition ${s.id === stage ? 'ring-brand-500' : 'ring-transparent hover:ring-line-strong'}`}
              >
                <StageThumb width={width} height={height} rgba={stageRGBA[s.id]} />
                <span className="mt-1 block truncate text-xs text-ink-muted">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pixel inspector */}
      <div className={`${panelClass} space-y-4`}>
        <div>
          <h3 className="text-lg font-semibold text-ink">
            Pixel inspector at ({p.x}, {p.y})
          </h3>
          <p className="text-sm text-ink-muted">
            The 3×3 neighbourhood {mode === 'canny' ? 'of the blurred image' : 'of the original image'} around the tapped pixel, and the exact arithmetic
            the kernel performs there.
          </p>
        </div>
        <div className="overflow-x-auto">
          <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start">
            <Grid3 title="Neighbourhood" values={n} shade />
            <div className="min-w-0 space-y-5">
              {sobelLike ? (
                <>
                  <KernelArithmetic name="Gx" n={n} k={sobelLike.kx} />
                  <KernelArithmetic name="Gy" n={n} k={sobelLike.ky} />
                  <GradientSummary gx={sum(products(n, sobelLike.kx))} gy={sum(products(n, sobelLike.ky))} />
                </>
              ) : (
                <KernelArithmetic name="L" n={n} k={LAPLACIAN} />
              )}
            </div>
          </div>
        </div>
        {mode === 'canny' && <CannyPixelReport result={cannyResult} p={p} width={width} height={height} index={i} low={low} high={high} />}
      </div>
    </div>
  );
}

function StageThumb({ width, height, rgba }: { width: number; height: number; rgba: Uint8ClampedArray }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(width, height);
    img.data.set(rgba);
    ctx.putImageData(img, 0, 0);
  }, [rgba, width, height]);
  return <canvas ref={ref} width={width} height={height} className={`${responsiveSurface} rounded border border-line bg-black [image-rendering:pixelated]`} />;
}

function GradientSummary({ gx, gy }: { gx: number; gy: number }) {
  const mag = Math.hypot(gx, gy);
  const deg = (Math.atan2(gy, gx) * 180) / Math.PI;
  return (
    <div className="rounded-lg border border-line bg-subtle p-3 font-mono text-sm text-ink">
      <p>
        |G| = √(Gx² + Gy²) = √({gx}² + {gy}²) = {mag.toFixed(1)}
      </p>
      <p>
        θ = atan2(Gy, Gx) = {deg.toFixed(1)}°
      </p>
    </div>
  );
}

function CannyPixelReport({
  result,
  p,
  width,
  height,
  index,
  low,
  high,
}: {
  result: ReturnType<typeof canny>;
  p: Point;
  width: number;
  height: number;
  index: number;
  low: number;
  high: number;
}) {
  const { gx, gy, mag } = result.grad;
  const sector = sectorOf(gx[index], gy[index]);
  const magImg: Gray = { width, height, data: mag };
  const [a, b] = SECTOR_OFFSETS[sector].map(([dx, dy]) => at(magImg, p.x + dx, p.y + dy));
  const m = mag[index];
  const kept = m > 0 && m >= a && m >= b;
  const cls = result.classes[index];
  const final = result.edges[index] === 1;
  return (
    <ol className="list-decimal space-y-1 rounded-lg border border-line bg-subtle p-4 pl-8 text-sm text-gray-700">
      <li>
        Direction rounded to {sector}°, so compare with the two neighbours along it: {a.toFixed(1)} and {b.toFixed(1)}.
      </li>
      <li>
        This pixel&apos;s magnitude is {m.toFixed(1)}: {kept ? 'a local maximum, so it is kept.' : 'not the peak, so non-max suppression removes it.'}
      </li>
      <li>
        {kept
          ? cls === STRONG
            ? `${m.toFixed(1)} ≥ high (${high}): strong.`
            : cls === WEAK
              ? `low (${low}) ≤ ${m.toFixed(1)} < high (${high}): weak.`
              : `${m.toFixed(1)} < low (${low}): discarded.`
          : 'Already removed, so thresholding does not apply.'}
      </li>
      <li className="font-semibold text-ink">{final ? 'Final result: edge pixel.' : 'Final result: not an edge.'}</li>
    </ol>
  );
}
