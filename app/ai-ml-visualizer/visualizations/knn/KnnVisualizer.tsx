'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface, toDrawingPoint } from '@/lib/visualization';
import {
  CLASS_COLORS,
  CLASS_NAMES,
  CLASS_RGB,
  PLANE_H,
  PLANE_W,
  canvasToData,
  drawPlaneBorder,
  drawPlaneFrame,
  flipLabels,
  fromCanvasX,
  fromCanvasY,
  makeBlobs,
  makeMoons,
  makeXor,
  rgba,
  testMask,
  toCanvasX,
  toCanvasY,
  type LabeledPoint,
} from '../_classical-ml/ml-shared';
import LineChart, { ChartLegend } from '../_classical-ml/LineChart';
import { Panel, RangeField, Segmented, Stat } from '../_classical-ml/controls';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface KPoint extends LabeledPoint {
  /** Held out for testing: never used as a neighbour. */
  test: boolean;
}

type DatasetId = 'blobs' | 'three' | 'moons' | 'xor';

const datasets: { id: DatasetId; name: string; classes: number; make: () => LabeledPoint[] }[] = [
  {
    id: 'blobs',
    name: 'Overlapping blobs',
    classes: 2,
    make: () =>
      makeBlobs(31, [
        { x: 0.36, y: 0.58, sd: 0.13, n: 90, label: 0 },
        { x: 0.64, y: 0.42, sd: 0.13, n: 90, label: 1 },
      ]),
  },
  {
    id: 'three',
    name: 'Three classes',
    classes: 3,
    make: () =>
      flipLabels(
        makeBlobs(41, [
          { x: 0.3, y: 0.68, sd: 0.11, n: 60, label: 0 },
          { x: 0.7, y: 0.68, sd: 0.11, n: 60, label: 1 },
          { x: 0.5, y: 0.3, sd: 0.11, n: 60, label: 2 },
        ]),
        0.06,
        3,
        42,
      ),
  },
  { id: 'moons', name: 'Moons', classes: 2, make: () => flipLabels(makeMoons(17, 200, 0.06), 0.06, 2, 18) },
  { id: 'xor', name: 'XOR', classes: 2, make: () => flipLabels(makeXor(51, 45, 0.1), 0.05, 2, 52) },
];

function loadPoints(id: DatasetId): KPoint[] {
  const raw = datasets.find((d) => d.id === id)!.make();
  const mask = testMask(raw.length, 0.3, 99);
  return raw.map((p, i) => ({ ...p, test: mask[i] }));
}

/* ------------------------------------------------------------------ */
/* k-nearest neighbours                                                */
/* ------------------------------------------------------------------ */

type Metric = 'euclidean' | 'manhattan';

function distance(ax: number, ay: number, bx: number, by: number, metric: Metric) {
  const dx = ax - bx;
  const dy = ay - by;
  return metric === 'euclidean' ? Math.sqrt(dx * dx + dy * dy) : Math.abs(dx) + Math.abs(dy);
}

/** Indices of `train` sorted by distance to (x, y), nearest first. Only the first `limit` are guaranteed sorted. */
function nearestIndices(x: number, y: number, train: LabeledPoint[], metric: Metric, limit: number): number[] {
  if (limit <= 0) return [];
  const d = train.map((p) => distance(x, y, p.x, p.y, metric));
  const best: number[] = [];
  for (let i = 0; i < train.length; i++) {
    if (best.length === limit && d[i] >= d[best[best.length - 1]]) continue;
    let j = best.length < limit ? best.length : limit - 1;
    if (best.length < limit) best.push(i);
    while (j > 0 && d[best[j - 1]] > d[i]) {
      best[j] = best[j - 1];
      j--;
    }
    best[j] = i;
  }
  return best;
}

/**
 * Majority vote among the first k neighbours (already sorted by distance).
 * Ties go to the tied class whose member is nearest.
 */
function vote(labels: number[], k: number, classes: number) {
  const counts = new Array<number>(classes).fill(0);
  const kk = Math.min(k, labels.length);
  for (let i = 0; i < kk; i++) counts[labels[i]]++;
  const max = Math.max(...counts);
  let predicted = -1;
  for (let i = 0; i < kk && predicted < 0; i++) if (counts[labels[i]] === max) predicted = labels[i];
  return { counts, predicted, share: kk === 0 ? 0 : max / kk };
}

const K_MAX = 25;

/** Train and test accuracy for k = 1..K_MAX. Training accuracy counts each point as its own neighbour. */
function accuracyCurve(train: LabeledPoint[], test: LabeledPoint[], metric: Metric, classes: number) {
  const limit = Math.min(K_MAX, train.length);
  const score = (set: LabeledPoint[]) => {
    const correct = new Array<number>(limit).fill(0);
    for (const p of set) {
      const labels = nearestIndices(p.x, p.y, train, metric, limit).map((i) => train[i].label);
      for (let k = 1; k <= limit; k++) if (vote(labels, k, classes).predicted === p.label) correct[k - 1]++;
    }
    return correct.map((c) => (set.length === 0 ? 0 : c / set.length));
  };
  return { train: score(train), test: score(test) };
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const CELL = 8;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
type TapMode = 'query' | 0 | 1 | 2;

export default function KnnVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);
  const [dataset, setDataset] = useState<DatasetId>('blobs');
  const [points, setPoints] = useState<KPoint[]>(() => loadPoints('blobs'));
  const [k, setK] = useState(5);
  const [metric, setMetric] = useState<Metric>('euclidean');
  const [query, setQuery] = useState({ x: 0.5, y: 0.5 });
  const [tapMode, setTapMode] = useState<TapMode>('query');
  const [showBoundary, setShowBoundary] = useState(true);
  const [showTest, setShowTest] = useState(true);

  const classes = datasets.find((d) => d.id === dataset)!.classes;
  const train = useMemo(() => points.filter((p) => !p.test), [points]);
  const test = useMemo(() => points.filter((p) => p.test), [points]);
  const effectiveK = Math.min(k, train.length);

  const neighbours = useMemo(
    () => nearestIndices(query.x, query.y, train, metric, effectiveK),
    [query, train, metric, effectiveK],
  );
  const result = vote(
    neighbours.map((i) => train[i].label),
    effectiveK,
    classes,
  );

  const curve = useMemo(() => accuracyCurve(train, test, metric, classes), [train, test, metric, classes]);
  const testAcc = curve.test[effectiveK - 1];
  const trainAcc = curve.train[effectiveK - 1];

  // Decision regions: classify the centre of each coarse cell.
  const regions = useMemo(() => {
    if (train.length === 0) return null;
    const cols = Math.ceil(PLANE_W / CELL);
    const rows = Math.ceil(PLANE_H / CELL);
    const label = new Int8Array(cols * rows).fill(-1);
    const share = new Float32Array(cols * rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const d = canvasToData(c * CELL + CELL / 2, r * CELL + CELL / 2);
        if (!d) continue;
        const labels = nearestIndices(d.x, d.y, train, metric, effectiveK).map((i) => train[i].label);
        const v = vote(labels, effectiveK, classes);
        label[r * cols + c] = v.predicted;
        share[r * cols + c] = v.share;
      }
    }
    return { cols, rows, label, share };
  }, [train, metric, effectiveK, classes]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, PLANE_W, PLANE_H);

    if (showBoundary && regions) {
      for (let r = 0; r < regions.rows; r++) {
        for (let c = 0; c < regions.cols; c++) {
          const l = regions.label[r * regions.cols + c];
          if (l < 0) continue;
          ctx.fillStyle = rgba(CLASS_RGB[l], 0.06 + 0.22 * regions.share[r * regions.cols + c]);
          ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
        }
      }
    }
    drawPlaneFrame(ctx);

    const qx = toCanvasX(query.x);
    const qy = toCanvasY(query.y);

    // Neighbourhood: a circle (Euclidean) or a diamond (Manhattan) reaching the k-th neighbour.
    if (neighbours.length > 0) {
      const far = train[neighbours[neighbours.length - 1]];
      const radius = distance(query.x, query.y, far.x, far.y, metric) * (toCanvasX(1) - toCanvasX(0));
      ctx.beginPath();
      if (metric === 'euclidean') ctx.arc(qx, qy, radius, 0, Math.PI * 2);
      else {
        ctx.moveTo(qx, qy - radius);
        ctx.lineTo(qx + radius, qy);
        ctx.lineTo(qx, qy + radius);
        ctx.lineTo(qx - radius, qy);
        ctx.closePath();
      }
      ctx.fillStyle = 'rgba(15, 23, 42, 0.04)';
      ctx.fill();
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = 'rgba(51, 65, 85, 0.55)';
      ctx.lineWidth = 1.25;
      neighbours.forEach((i) => {
        const p = train[i];
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        if (metric === 'euclidean') ctx.lineTo(toCanvasX(p.x), toCanvasY(p.y));
        else {
          ctx.lineTo(toCanvasX(p.x), qy);
          ctx.lineTo(toCanvasX(p.x), toCanvasY(p.y));
        }
        ctx.stroke();
      });
    }

    // Training points (filled) and test points (hollow rings).
    for (const p of points) {
      if (p.test && !showTest) continue;
      const x = toCanvasX(p.x);
      const y = toCanvasY(p.y);
      ctx.beginPath();
      ctx.arc(x, y, p.test ? 4 : 5, 0, Math.PI * 2);
      if (p.test) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = CLASS_COLORS[p.label];
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = CLASS_COLORS[p.label];
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      }
    }

    // Circle the neighbours.
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    neighbours.forEach((i) => {
      const p = train[i];
      ctx.beginPath();
      ctx.arc(toCanvasX(p.x), toCanvasY(p.y), 9, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Query point: a diamond in the predicted colour.
    ctx.beginPath();
    ctx.moveTo(qx, qy - 13);
    ctx.lineTo(qx + 13, qy);
    ctx.lineTo(qx, qy + 13);
    ctx.lineTo(qx - 13, qy);
    ctx.closePath();
    ctx.fillStyle = result.predicted >= 0 ? CLASS_COLORS[result.predicted] : '#9ca3af';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    drawPlaneBorder(ctx);
  }, [points, train, neighbours, query, metric, regions, showBoundary, showTest, result.predicted]);

  const loadDataset = (id: DatasetId) => {
    setDataset(id);
    setPoints(loadPoints(id));
    if (typeof tapMode === 'number' && tapMode >= datasets.find((d) => d.id === id)!.classes) setTapMode('query');
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = toDrawingPoint(e, e.currentTarget);
    const d = canvasToData(x, y);
    const nearQuery = Math.hypot(x - toCanvasX(query.x), y - toCanvasY(query.y)) < 36;
    if (nearQuery || tapMode === 'query') {
      if (d) setQuery(d);
      dragging.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    if (d && points.length < 500) setPoints((ps) => [...ps, { ...d, label: tapMode, test: false }]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragging.current) return;
    const { x, y } = toDrawingPoint(e, e.currentTarget);
    setQuery({ x: clamp01(fromCanvasX(x)), y: clamp01(fromCanvasY(y)) });
  };

  const endDrag = () => {
    dragging.current = false;
  };

  const kValues = Array.from({ length: curve.train.length }, (_, i) => i + 1);
  const yMin = Math.min(0.5, Math.floor(Math.min(...curve.test, ...curve.train, 1) * 10) / 10);
  const bestTestK = curve.test.reduce((best, v, i) => (v > curve.test[best] ? i : best), 0) + 1;

  const tapOptions: { value: TapMode; label: string }[] = [
    { value: 'query', label: 'Move query' },
    ...CLASS_NAMES.slice(0, classes).map((name, i) => ({ value: i as TapMode, label: `Add ${name.toLowerCase()}` })),
  ];

  return (
    <div className="space-y-5 rounded-card border border-line bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-ink-muted">Dataset:</span>
        {datasets.map((d) => (
          <Button
            key={d.id}
            size="sm"
            variant={dataset === d.id ? 'primary' : 'outline'}
            aria-pressed={dataset === d.id}
            onClick={() => loadDataset(d.id)}
          >
            {d.name}
          </Button>
        ))}
        <Button size="sm" variant="ghost" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setPoints([])}>
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RangeField label="Neighbours (k)" value={k} min={1} max={K_MAX} onChange={setK} />
        <Segmented
          label="Distance"
          value={metric}
          options={[
            { value: 'euclidean', label: 'Euclidean' },
            { value: 'manhattan', label: 'Manhattan' },
          ]}
          onChange={setMetric}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Segmented label="Tap to" value={tapMode} options={tapOptions} onChange={setTapMode} />
        <label className="inline-flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={showBoundary} onChange={(e) => setShowBoundary(e.target.checked)} />
          Decision regions
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={showTest} onChange={(e) => setShowTest(e.target.checked)} />
          Test points
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <canvas
            ref={canvasRef}
            width={PLANE_W}
            height={PLANE_H}
            className={`${responsiveSurface} touch-none cursor-crosshair rounded-lg border border-line`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            role="img"
            aria-label="Labelled training points, a draggable query point with its nearest neighbours circled, and the decision regions"
          />
          <p className="mt-2 text-sm text-ink-muted">
            Drag the diamond (the query point). Filled dots are training data; hollow rings are the held-out test set,
            which never votes.
          </p>
        </div>

        <div className="space-y-4">
          <Panel title={`Vote among the ${effectiveK} nearest`}>
            {effectiveK === 0 ? (
              <p className="text-sm text-ink-muted">Add some training points.</p>
            ) : (
              <div className="space-y-2">
                {result.counts.map((count, c) => (
                  <div key={c} className="flex items-center gap-2 text-sm">
                    <span className="w-16 shrink-0 text-ink">{CLASS_NAMES[c]}</span>
                    <div className="h-4 min-w-0 flex-1 overflow-hidden rounded bg-white ring-1 ring-inset ring-line">
                      <div
                        className="h-full rounded"
                        style={{ width: `${(count / effectiveK) * 100}%`, backgroundColor: CLASS_COLORS[c] }}
                      />
                    </div>
                    <span className="w-6 shrink-0 text-right font-mono text-ink">{count}</span>
                  </div>
                ))}
                <p className="pt-1 text-sm text-ink">
                  Prediction:{' '}
                  <span className="font-semibold" style={{ color: CLASS_COLORS[result.predicted] }}>
                    {CLASS_NAMES[result.predicted]}
                  </span>
                  {result.counts.filter((c) => c === Math.max(...result.counts)).length > 1 && (
                    <span className="text-ink-muted"> (tie, broken by the nearest neighbour)</span>
                  )}
                </p>
              </div>
            )}
          </Panel>

          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Stat label="Training points" value={String(train.length)} />
            <Stat label="Test points" value={String(test.length)} />
            <Stat label="Train accuracy" value={trainAcc === undefined ? '-' : `${(trainAcc * 100).toFixed(0)}%`} />
            <Stat label="Test accuracy" value={testAcc === undefined || test.length === 0 ? '-' : `${(testAcc * 100).toFixed(0)}%`} tone="text-brand-700" />
          </dl>

          <Panel title="Accuracy vs k (70/30 split)">
            {kValues.length === 0 || test.length === 0 ? (
              <p className="text-sm text-ink-muted">Load a dataset to see the accuracy curve.</p>
            ) : (
              <>
                <LineChart
                  series={[
                    { name: 'Train', color: '#64748b', dashed: true, points: curve.train.map((v, i) => ({ x: i + 1, y: v })) },
                    { name: 'Test', color: '#4f46e5', points: curve.test.map((v, i) => ({ x: i + 1, y: v })) },
                  ]}
                  xDomain={[1, Math.max(2, kValues.length)]}
                  yDomain={[yMin, 1]}
                  xTicks={kValues.filter((v) => v === 1 || v % 4 === 0)}
                  yTicks={Array.from({ length: Math.round((1 - yMin) * 10) + 1 }, (_, i) => yMin + i / 10)}
                  formatY={(v) => `${Math.round(v * 100)}%`}
                  xLabel="k"
                  yLabel="accuracy"
                  highlightX={effectiveK}
                  selectableXs={kValues}
                  onSelectX={setK}
                  ariaLabel="Training and test accuracy for k from 1 to 25"
                />
                <ChartLegend
                  items={[
                    { name: 'training accuracy', color: '#64748b', dashed: true },
                    { name: 'test accuracy', color: '#4f46e5' },
                  ]}
                />
                <p className="mt-2 text-xs text-ink-muted">
                  k = 1 scores 100% on the training set (every point is its own nearest neighbour) but not on the test
                  set. Best test accuracy here: k = {bestTestK}. Tap the chart to set k.
                </p>
              </>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
