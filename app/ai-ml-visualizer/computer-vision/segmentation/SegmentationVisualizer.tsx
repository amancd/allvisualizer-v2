'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FastForward, Play, RotateCcw, Shuffle, StepForward, Upload } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import {
  GT_CLASS_NAMES,
  assign,
  connectedComponents,
  histogram,
  initCentroids,
  loadImageFile,
  makeScene,
  maskMetrics,
  otsu,
  paletteColor,
  regionGrow,
  thresholdMask,
  toGray,
  update,
  type Color,
  type SegImage,
} from './segOps';

type Method = 'threshold' | 'kmeans' | 'region';
type View = 'overlay' | 'mask' | 'errors' | 'clusters';

interface Point {
  x: number;
  y: number;
}

/* ---------- small UI pieces ---------- */

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

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block min-w-0 flex-1 basis-48">
      <span className="flex justify-between text-sm text-ink-muted">
        <span>{label}</span>
        <span className="font-mono text-ink">{value}</span>
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

/** Draws an RGBA buffer at native resolution and scales it up with CSS. */
function PixelCanvas({
  width,
  height,
  rgba,
  label,
  onPick,
  marker,
}: {
  width: number;
  height: number;
  rgba: Uint8ClampedArray;
  label: string;
  onPick?: (p: Point) => void;
  marker?: Point | null;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    const img = ctx.createImageData(width, height);
    img.data.set(rgba);
    ctx.putImageData(img, 0, 0);
  }, [rgba, width, height]);

  return (
    <figure className="min-w-0">
      <div className="relative overflow-hidden rounded-lg border border-line-strong bg-black">
        <canvas
          ref={ref}
          width={width}
          height={height}
          aria-label={label}
          onPointerDown={
            onPick
              ? (e) => {
                  const p = toDrawingPoint(e, e.currentTarget);
                  onPick({ x: Math.min(width - 1, Math.max(0, Math.floor(p.x))), y: Math.min(height - 1, Math.max(0, Math.floor(p.y))) });
                }
              : undefined
          }
          className={`${responsiveSurface} [image-rendering:pixelated] ${onPick ? 'cursor-crosshair' : ''}`}
        />
        {marker && (
          <div
            className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-fuchsia-600 shadow"
            style={{ left: `${((marker.x + 0.5) / width) * 100}%`, top: `${((marker.y + 0.5) / height) * 100}%` }}
          />
        )}
      </div>
      <figcaption className="mt-1.5 text-sm font-medium text-ink">{label}</figcaption>
    </figure>
  );
}

/* ---------- rendering helpers (pure) ---------- */

/** Colours each pixel by its label: 0 = black, otherwise a palette colour. Optionally blends over the image. */
function labelsToRGBA(img: SegImage, labels: ArrayLike<number>, colorOf: (label: number) => Color, overlay: boolean): Uint8ClampedArray {
  const n = img.width * img.height;
  const out = new Uint8ClampedArray(n * 4);
  for (let i = 0; i < n; i++) {
    const l = labels[i];
    let r = overlay ? img.rgb[i * 3] : 0;
    let g = overlay ? img.rgb[i * 3 + 1] : 0;
    let b = overlay ? img.rgb[i * 3 + 2] : 0;
    if (l > 0) {
      const c = colorOf(l);
      const a = overlay ? 0.6 : 1;
      r = r * (1 - a) + c[0] * a;
      g = g * (1 - a) + c[1] * a;
      b = b * (1 - a) + c[2] * a;
    } else if (overlay) {
      r *= 0.55;
      g *= 0.55;
      b *= 0.55;
    }
    out[i * 4] = r;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = b;
    out[i * 4 + 3] = 255;
  }
  return out;
}

function errorsToRGBA(img: SegImage, pred: Uint8Array, truth: Uint8Array): Uint8ClampedArray {
  const n = img.width * img.height;
  const out = new Uint8ClampedArray(n * 4);
  for (let i = 0; i < n; i++) {
    const p = pred[i] > 0;
    const t = truth[i] > 0;
    const gray = (img.rgb[i * 3] + img.rgb[i * 3 + 1] + img.rgb[i * 3 + 2]) / 3;
    const [r, g, b] = p && t ? [34, 197, 94] : p ? [239, 68, 68] : t ? [59, 130, 246] : [gray * 0.35, gray * 0.35, gray * 0.35];
    out[i * 4] = r;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = b;
    out[i * 4 + 3] = 255;
  }
  return out;
}

function clustersToRGBA(img: SegImage, labels: Uint8Array, centroids: Color[]): Uint8ClampedArray {
  const n = img.width * img.height;
  const out = new Uint8ClampedArray(n * 4);
  for (let i = 0; i < n; i++) {
    const c = centroids[labels[i]];
    out[i * 4] = c[0];
    out[i * 4 + 1] = c[1];
    out[i * 4 + 2] = c[2];
    out[i * 4 + 3] = 255;
  }
  return out;
}

/** k-means does not know which cluster is "background". Guess: any cluster that owns an image corner. */
function cornerClusters(img: SegImage, labels: Uint8Array): Set<number> {
  const { width: w, height: h } = img;
  return new Set([labels[0], labels[w - 1], labels[(h - 1) * w], labels[h * w - 1]]);
}

function imageToRGBA(img: SegImage): Uint8ClampedArray {
  const n = img.width * img.height;
  const out = new Uint8ClampedArray(n * 4);
  for (let i = 0; i < n; i++) {
    out[i * 4] = img.rgb[i * 3];
    out[i * 4 + 1] = img.rgb[i * 3 + 1];
    out[i * 4 + 2] = img.rgb[i * 3 + 2];
    out[i * 4 + 3] = 255;
  }
  return out;
}

const FOREGROUND: Color = [217, 70, 239];

const rgbCss = (c: Color) => `rgb(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])})`;

const GT_COLORS: Color[] = [
  [0, 0, 0],
  [236, 72, 153],
  [59, 130, 246],
  [234, 179, 8],
];

/* ---------- main component ---------- */

export default function SegmentationVisualizer() {
  const [image, setImage] = useState<SegImage>(() => makeScene());
  const [method, setMethod] = useState<Method>('threshold');
  const [view, setView] = useState<View>('overlay');
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Threshold
  const gray = useMemo(() => toGray(image), [image]);
  const hist = useMemo(() => histogram(gray), [gray]);
  const otsuResult = useMemo(() => otsu(hist), [hist]);
  const [threshold, setThreshold] = useState<number | null>(null); // null = follow Otsu
  const [darkIsForeground, setDarkIsForeground] = useState(true);
  const t = threshold ?? otsuResult.threshold;

  // k-means
  const [k, setK] = useState(4);
  const [kSeed, setKSeed] = useState(1);
  const [centroids, setCentroids] = useState<Color[]>(() => initCentroids(image, 4, 1));
  const [iteration, setIteration] = useState(0);
  const [lastShift, setLastShift] = useState<number | null>(null);
  const [bgOverride, setBgOverride] = useState<Set<number> | null>(null);

  // Region growing
  const [seed, setSeed] = useState<Point>({ x: 40, y: 42 });
  const [tolerance, setTolerance] = useState(60);
  const [revealed, setRevealed] = useState<number | null>(null); // null = show the whole region
  const raf = useRef<number | null>(null);

  // Semantic vs instance
  const [minSize, setMinSize] = useState(15);

  useEffect(
    () => () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const kLabels = useMemo(() => assign(image, centroids), [image, centroids]);
  const background = useMemo(() => bgOverride ?? cornerClusters(image, kLabels), [bgOverride, image, kLabels]);
  const converged = lastShift !== null && lastShift < 0.5;

  const growOrder = useMemo(() => regionGrow(image, seed.x, seed.y, tolerance), [image, seed, tolerance]);

  /** Predicted class per pixel (0 = background). Threshold and region growing produce one class; k-means one per kept cluster. */
  const predClasses = useMemo(() => {
    const n = image.width * image.height;
    if (method === 'threshold') return thresholdMask(gray, t, darkIsForeground);
    if (method === 'kmeans') {
      const out = new Uint8Array(n);
      for (let i = 0; i < n; i++) out[i] = background.has(kLabels[i]) ? 0 : kLabels[i] + 1;
      return out;
    }
    const out = new Uint8Array(n);
    const count = revealed === null ? growOrder.length : Math.min(revealed, growOrder.length);
    for (let j = 0; j < count; j++) out[growOrder[j]] = 1;
    return out;
  }, [image, method, gray, t, darkIsForeground, background, kLabels, growOrder, revealed]);

  const predColor = useMemo(() => (method === 'kmeans' ? paletteColor : () => FOREGROUND), [method]);

  const mainRGBA = useMemo(() => {
    if (view === 'errors' && image.gtClass) return errorsToRGBA(image, predClasses, image.gtClass);
    if (view === 'clusters' && method === 'kmeans') return clustersToRGBA(image, kLabels, centroids);
    return labelsToRGBA(image, predClasses, predColor, view === 'overlay');
  }, [view, image, predClasses, method, kLabels, centroids, predColor]);

  const originalRGBA = useMemo(() => imageToRGBA(image), [image]);

  const metrics = useMemo(() => (image.gtClass ? maskMetrics(predClasses, image.gtClass) : null), [image, predClasses]);

  const predInstances = useMemo(() => connectedComponents(predClasses, image.width, image.height, minSize), [predClasses, image, minSize]);
  const gtInstances = useMemo(
    () => (image.gtClass ? connectedComponents(image.gtClass, image.width, image.height, 1) : null),
    [image],
  );

  const instanceViews = useMemo(() => {
    const views = [
      { label: 'Predicted: semantic (one colour per class)', rgba: labelsToRGBA(image, predClasses, predColor, false) },
      { label: `Predicted: instances (${predInstances.count} found)`, rgba: labelsToRGBA(image, predInstances.ids, paletteColor, false) },
    ];
    if (image.gtClass && gtInstances) {
      views.push(
        { label: 'Ground truth: semantic', rgba: labelsToRGBA(image, image.gtClass, (l) => GT_COLORS[l], false) },
        { label: `Ground truth: instances (${gtInstances.count})`, rgba: labelsToRGBA(image, gtInstances.ids, paletteColor, false) },
      );
    }
    return views;
  }, [image, predClasses, predInstances, gtInstances, predColor]);

  /* ---------- handlers ---------- */

  const resetKmeans = (img: SegImage, kk: number, s: number) => {
    setCentroids(initCentroids(img, kk, s));
    setIteration(0);
    setLastShift(null);
    setBgOverride(null);
  };

  const stepKmeans = () => {
    const { centroids: next, shift } = update(image, kLabels, centroids);
    setCentroids(next);
    setIteration((n) => n + 1);
    setLastShift(shift);
  };

  const runKmeans = () => {
    let c = centroids;
    let n = 0;
    let shift = Infinity;
    while (n < 100 && shift >= 0.5) {
      const r = update(image, assign(image, c), c);
      c = r.centroids;
      shift = r.shift;
      n++;
    }
    setCentroids(c);
    setIteration((it) => it + n);
    setLastShift(shift);
  };

  const toggleBackground = (cluster: number) => {
    const next = new Set(background);
    if (next.has(cluster)) next.delete(cluster);
    else next.add(cluster);
    setBgOverride(next);
  };

  const stopAnimation = () => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  const animateGrowth = () => {
    stopAnimation();
    const total = growOrder.length;
    const perFrame = Math.max(4, Math.ceil(total / 120));
    let shown = 0;
    const tick = () => {
      shown = Math.min(total, shown + perFrame);
      setRevealed(shown);
      if (shown < total) raf.current = requestAnimationFrame(tick);
      else {
        raf.current = null;
        setRevealed(null);
      }
    };
    setRevealed(0);
    raf.current = requestAnimationFrame(tick);
  };

  const pickSeed = (p: Point) => {
    stopAnimation();
    setRevealed(null);
    setSeed(p);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    loadImageFile(file, 200, 150)
      .then((img) => {
        stopAnimation();
        setImage(img);
        setUploadError('');
        setThreshold(null);
        setRevealed(null);
        setSeed({ x: Math.floor(img.width / 2), y: Math.floor(img.height / 2) });
        if (view === 'errors') setView('overlay');
        resetKmeans(img, k, kSeed);
      })
      .catch((err: Error) => setUploadError(err.message));
  };

  const resetImage = () => {
    const img = makeScene();
    stopAnimation();
    setImage(img);
    setThreshold(null);
    setRevealed(null);
    setSeed({ x: 40, y: 42 });
    resetKmeans(img, k, kSeed);
  };

  const changeMethod = (m: Method) => {
    setMethod(m);
    if (view === 'clusters' && m !== 'kmeans') setView('overlay');
  };

  const viewOptions: { id: View; label: string }[] = [
    { id: 'overlay', label: 'Overlay' },
    { id: 'mask', label: 'Mask' },
    ...(image.gtClass ? [{ id: 'errors' as const, label: 'Errors vs truth' }] : []),
    ...(method === 'kmeans' ? [{ id: 'clusters' as const, label: 'Cluster colours' }] : []),
  ];

  const clusterSizes = useMemo(() => {
    const s = new Array<number>(centroids.length).fill(0);
    for (let i = 0; i < kLabels.length; i++) s[kLabels[i]]++;
    return s;
  }, [kLabels, centroids.length]);

  const seedIdx = seed.y * image.width + seed.x;
  const seedColor: Color = [image.rgb[seedIdx * 3], image.rgb[seedIdx * 3 + 1], image.rgb[seedIdx * 3 + 2]];

  const panel = 'rounded-card border border-line bg-white p-4 shadow-card sm:p-6';

  return (
    <div className="space-y-6">
      <div className={`${panel} space-y-5`}>
        <div className="flex flex-wrap items-center gap-3">
          <Toggle
            options={[
              { id: 'threshold', label: 'Threshold (Otsu)' },
              { id: 'kmeans', label: 'K-means colours' },
              { id: 'region', label: 'Region growing' },
            ]}
            value={method}
            onChange={changeMethod}
          />
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <Button size="sm" variant="outline" leftIcon={<Upload className="h-4 w-4" />} onClick={() => fileRef.current?.click()}>
            Use your image
          </Button>
          {!image.gtClass && (
            <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={resetImage}>
              Back to test image
            </Button>
          )}
        </div>
        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PixelCanvas
                width={image.width}
                height={image.height}
                rgba={originalRGBA}
                label={method === 'region' ? 'Input: tap to place the seed' : 'Input image'}
                onPick={method === 'region' ? pickSeed : undefined}
                marker={method === 'region' ? seed : null}
              />
              <PixelCanvas
                width={image.width}
                height={image.height}
                rgba={mainRGBA}
                label="Segmentation"
                onPick={method === 'region' ? pickSeed : undefined}
                marker={method === 'region' ? seed : null}
              />
            </div>
            <Toggle options={viewOptions} value={view} onChange={setView} />
            {view === 'errors' && (
              <p className="text-sm text-ink-muted">
                <span className="font-semibold text-green-600">Green</span> = correct foreground,{' '}
                <span className="font-semibold text-red-600">red</span> = false positive,{' '}
                <span className="font-semibold text-blue-600">blue</span> = missed (false negative).
              </p>
            )}
          </div>

          <div className="min-w-0 space-y-4">
            {method === 'threshold' && (
              <>
                <HistogramChart hist={hist} between={otsuResult.between} otsuT={otsuResult.threshold} t={t} />
                <Slider label="Threshold t" value={t} min={0} max={255} onChange={setThreshold} />
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setThreshold(null)}>
                    Use Otsu (t = {otsuResult.threshold})
                  </Button>
                  <Toggle
                    options={[
                      { id: 'dark', label: 'Foreground darker' },
                      { id: 'bright', label: 'Foreground brighter' },
                    ]}
                    value={darkIsForeground ? 'dark' : 'bright'}
                    onChange={(v) => setDarkIsForeground(v === 'dark')}
                  />
                </div>
                <p className="text-sm text-ink-muted">
                  Otsu tries every t and picks the one that makes the two groups of brightness values as separated as possible (the green
                  curve). It only sees brightness, so the bright yellow triangle lands on the background side.
                </p>
              </>
            )}

            {method === 'kmeans' && (
              <>
                <Slider
                  label="Number of clusters k"
                  value={k}
                  min={2}
                  max={6}
                  onChange={(v) => {
                    setK(v);
                    resetKmeans(image, v, kSeed);
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" leftIcon={<StepForward className="h-4 w-4" />} onClick={stepKmeans} disabled={converged}>
                    Step
                  </Button>
                  <Button size="sm" variant="primary" leftIcon={<FastForward className="h-4 w-4" />} onClick={runKmeans} disabled={converged}>
                    Run to convergence
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Shuffle className="h-4 w-4" />}
                    onClick={() => {
                      setKSeed(kSeed + 1);
                      resetKmeans(image, k, kSeed + 1);
                    }}
                  >
                    New start
                  </Button>
                </div>
                <p className="text-sm text-ink-muted">
                  Iteration {iteration}
                  {lastShift !== null && `, largest centre move ${lastShift.toFixed(1)}`}
                  {converged && ' (converged)'}
                </p>
                <div>
                  <p className="mb-2 text-sm text-ink-muted">Cluster centres. Tap one to mark it as background or foreground.</p>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {centroids.map((c, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => toggleBackground(idx)}
                          className="flex w-full items-center gap-2 rounded-lg border border-line p-2 text-left text-sm hover:bg-subtle"
                        >
                          <span className="h-6 w-6 shrink-0 rounded ring-1 ring-line" style={{ background: rgbCss(c) }} />
                          <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: rgbCss(paletteColor(idx + 1)) }} />
                          <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink">{clusterSizes[idx]} px</span>
                          <span className={`text-xs ${background.has(idx) ? 'text-ink-faint' : 'font-semibold text-ink'}`}>
                            {background.has(idx) ? 'background' : 'foreground'}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {method === 'region' && (
              <>
                <Slider label="Colour tolerance" value={tolerance} min={5} max={160} onChange={(v) => { stopAnimation(); setRevealed(null); setTolerance(v); }} />
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="primary" leftIcon={<Play className="h-4 w-4" />} onClick={animateGrowth}>
                    Animate growth
                  </Button>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-line bg-subtle p-3 text-sm">
                  <span className="h-8 w-8 shrink-0 rounded ring-1 ring-line" style={{ background: rgbCss(seedColor) }} />
                  <div className="min-w-0">
                    <p className="text-ink">
                      Seed ({seed.x}, {seed.y}), colour ({seedColor.join(', ')})
                    </p>
                    <p className="font-mono text-xs text-ink-muted">
                      Region: {revealed === null ? growOrder.length : Math.min(revealed, growOrder.length)} of {growOrder.length} pixels
                    </p>
                  </div>
                </div>
                <p className="text-sm text-ink-muted">
                  A neighbour joins when its colour is within the tolerance of the seed colour. Too low and the uneven lighting stops
                  growth early; too high and the region leaks into the background.
                </p>
              </>
            )}

            <MetricsCard metrics={metrics} />
          </div>
        </div>
      </div>

      <div className={`${panel} space-y-4`}>
        <div>
          <h3 className="text-lg font-semibold text-ink">Semantic vs instance</h3>
          <p className="text-sm text-ink-muted">
            Semantic segmentation gives every pixel a class. Instance segmentation also separates objects of the same class. Here the
            instances come from connected-component labelling of the predicted classes: touching pixels of the same class form one
            instance.
          </p>
        </div>
        <Slider label="Ignore components smaller than (px)" value={minSize} min={1} max={100} onChange={setMinSize} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {instanceViews.map((v) => (
            <PixelCanvas key={v.label} width={image.width} height={image.height} rgba={v.rgba} label={v.label} />
          ))}
        </div>
        {image.gtClass && (
          <p className="text-sm text-ink-muted">
            Ground-truth classes: {GT_CLASS_NAMES.slice(1).join(', ')}. The two discs share a class (same colour on the left) but are
            separate instances (different colours on the right).
          </p>
        )}
      </div>
    </div>
  );
}

function MetricsCard({ metrics }: { metrics: ReturnType<typeof maskMetrics> | null }) {
  if (!metrics) {
    return (
      <p className="rounded-lg border border-line bg-subtle p-3 text-sm text-ink-muted">
        IoU and Dice need a ground-truth mask, which only the generated test image has.
      </p>
    );
  }
  return (
    <div className="rounded-lg border border-violet-200 bg-violet-50/60 p-3 text-sm">
      <p className="font-semibold text-ink">Foreground mask vs ground truth</p>
      <dl className="mt-2 grid grid-cols-3 gap-2 font-mono">
        <div>
          <dt className="font-sans text-ink-muted">TP</dt>
          <dd className="text-ink">{metrics.tp}</dd>
        </div>
        <div>
          <dt className="font-sans text-ink-muted">FP</dt>
          <dd className="text-ink">{metrics.fp}</dd>
        </div>
        <div>
          <dt className="font-sans text-ink-muted">FN</dt>
          <dd className="text-ink">{metrics.fn}</dd>
        </div>
      </dl>
      <p className="mt-2 break-words font-mono text-ink">
        IoU = TP / (TP + FP + FN) = {metrics.iou.toFixed(3)}
      </p>
      <p className="break-words font-mono text-ink">
        Dice = 2TP / (2TP + FP + FN) = {metrics.dice.toFixed(3)}
      </p>
    </div>
  );
}

/** Brightness histogram with Otsu's between-class variance curve and both thresholds. */
function HistogramChart({ hist, between, otsuT, t }: { hist: number[]; between: number[]; otsuT: number; t: number }) {
  const W = 512;
  const H = 220;
  const top = 12;
  const bottom = 196;
  const maxCount = Math.max(...hist, 1);
  const maxBetween = Math.max(...between, 1e-9);
  const y = (frac: number) => bottom - frac * (bottom - top);
  const curve = between.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * 2 + 1},${y(v / maxBetween).toFixed(1)}`).join(' ');
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className={`${responsiveSurface} rounded-lg border border-line bg-white`} role="img" aria-label="Brightness histogram">
        {hist.map((c, i) => (
          <rect key={i} x={i * 2} y={y(c / maxCount)} width={2} height={bottom - y(c / maxCount)} fill={i <= t ? '#6366f1' : '#cbd5e1'} />
        ))}
        <path d={curve} fill="none" stroke="#10b981" strokeWidth={2.5} />
        <line x1={otsuT * 2 + 1} x2={otsuT * 2 + 1} y1={top} y2={bottom} stroke="#7c3aed" strokeWidth={2} strokeDasharray="6 4" />
        <line x1={t * 2 + 1} x2={t * 2 + 1} y1={top} y2={bottom} stroke="#c026d3" strokeWidth={3} />
        <line x1={0} x2={W} y1={bottom} y2={bottom} stroke="#94a3b8" />
        <text x={4} y={H - 6} fontSize={16} fill="#475569">
          0 (dark)
        </text>
        <text x={W - 4} y={H - 6} fontSize={16} fill="#475569" textAnchor="end">
          255 (bright)
        </text>
      </svg>
      <p className="mt-1 text-xs text-ink-muted">
        Bars: pixel count per brightness (indigo = at or below t). Green: between-class variance. Dashed: Otsu&apos;s t. Solid: your t.
      </p>
    </div>
  );
}
