'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FastForward, RotateCcw, StepBack, StepForward } from 'lucide-react';
import { Button } from '@/components/ui';
import { responsiveSurface } from '@/lib/visualization';
import {
  CLASS_COLORS,
  CLASS_NAMES,
  CLASS_RGB,
  PLANE_H,
  PLANE_W,
  drawPlaneBorder,
  drawPlaneFrame,
  flipLabels,
  makeBlobs,
  makeCircles,
  makeMoons,
  makeUniform,
  makeXor,
  rgba,
  testMask,
  toCanvasX,
  toCanvasY,
  type LabeledPoint,
} from '../_classical-ml/ml-shared';
import LineChart, { ChartLegend } from '../_classical-ml/LineChart';
import { Panel, RangeField, Segmented, Stat } from '../_classical-ml/controls';
import {
  accuracy,
  growTree,
  isSplit,
  majority,
  scanFeature,
  visibleNodes,
  type Criterion,
  type TreeNode,
} from './cart';

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type DatasetId = 'blobs' | 'moons' | 'xor' | 'circles' | 'diagonal';

const datasets: { id: DatasetId; name: string; make: () => LabeledPoint[] }[] = [
  {
    id: 'blobs',
    name: 'Overlapping blobs',
    make: () =>
      makeBlobs(61, [
        { x: 0.37, y: 0.6, sd: 0.14, n: 100, label: 0 },
        { x: 0.63, y: 0.4, sd: 0.14, n: 100, label: 1 },
      ]),
  },
  { id: 'moons', name: 'Moons', make: () => flipLabels(makeMoons(71, 200, 0.06), 0.07, 2, 72) },
  { id: 'xor', name: 'XOR', make: () => flipLabels(makeXor(81, 50, 0.11), 0.06, 2, 82) },
  { id: 'circles', name: 'Circles', make: () => flipLabels(makeCircles(91, 200, 0.05), 0.05, 2, 92) },
  {
    id: 'diagonal',
    name: 'Diagonal',
    make: () =>
      flipLabels(
        makeUniform(101, 200).map((p) => ({ ...p, label: p.y > p.x ? 0 : 1 })),
        0.07,
        2,
        102,
      ),
  },
];

function loadSplit(id: DatasetId) {
  const raw = datasets.find((d) => d.id === id)!.make();
  const mask = testMask(raw.length, 0.3, 7);
  return { train: raw.filter((_, i) => !mask[i]), test: raw.filter((_, i) => mask[i]) };
}

const MAX_DEPTH = 8;
const fmt = (v: number) => v.toFixed(3);
const pct = (v: number) => `${Math.round(v * 100)}%`;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function DecisionTreeVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataset, setDataset] = useState<DatasetId>('moons');
  const [{ train, test }, setData] = useState(() => loadSplit('moons'));
  const [maxDepth, setMaxDepth] = useState(4);
  const [minSamples, setMinSamples] = useState(5);
  const [criterion, setCriterion] = useState<Criterion>('gini');
  const [step, setStep] = useState(0);
  const [showTest, setShowTest] = useState(false);

  const nodes = useMemo(() => growTree(train, { maxDepth, minSamples, criterion }), [train, maxDepth, minSamples, criterion]);
  const totalSplits = nodes.filter((n) => n.order >= 0).length;
  const shown = Math.min(step, totalSplits);
  const visible = useMemo(() => visibleNodes(nodes, shown), [nodes, shown]);
  const current = nodes.find((n) => n.order === shown) ?? null;

  const scan = useMemo(() => {
    if (!current) return null;
    return {
      x: scanFeature(train, current.idx, 0, criterion),
      y: scanFeature(train, current.idx, 1, criterion),
    };
  }, [current, train, criterion]);

  const trainAcc = accuracy(nodes, shown, train);
  const testAcc = accuracy(nodes, shown, test);
  const leaves = visible.filter((n) => !isSplit(n, shown));
  const depth = Math.max(0, ...leaves.map((n) => n.depth));

  const depthCurve = useMemo(() => {
    const out = { train: [] as number[], test: [] as number[] };
    for (let d = 1; d <= MAX_DEPTH; d++) {
      const t = growTree(train, { maxDepth: d, minSamples, criterion });
      out.train.push(accuracy(t, Infinity, train));
      out.test.push(accuracy(t, Infinity, test));
    }
    return out;
  }, [train, test, minSamples, criterion]);

  // Draw the partitioned plane.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, PLANE_W, PLANE_H);

    const rect = (b: TreeNode['bounds']) => ({
      x: toCanvasX(b.x0),
      y: toCanvasY(b.y1),
      w: toCanvasX(b.x1) - toCanvasX(b.x0),
      h: toCanvasY(b.y0) - toCanvasY(b.y1),
    });

    // Leaf regions, shaded by their majority class and how pure they are.
    for (const leaf of visible) {
      if (isSplit(leaf, shown)) continue;
      const n = leaf.counts[0] + leaf.counts[1];
      const purity = n === 0 ? 0 : (Math.max(...leaf.counts) / n - 0.5) * 2;
      const r = rect(leaf.bounds);
      ctx.fillStyle = rgba(CLASS_RGB[majority(leaf)], 0.07 + 0.23 * purity);
      ctx.fillRect(r.x, r.y, r.w, r.h);
    }
    drawPlaneFrame(ctx);

    // Split lines.
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    for (const node of visible) {
      if (!isSplit(node, shown)) continue;
      const { feature, threshold } = node.split!;
      const b = node.bounds;
      ctx.beginPath();
      if (feature === 0) {
        ctx.moveTo(toCanvasX(threshold), toCanvasY(b.y0));
        ctx.lineTo(toCanvasX(threshold), toCanvasY(b.y1));
      } else {
        ctx.moveTo(toCanvasX(b.x0), toCanvasY(threshold));
        ctx.lineTo(toCanvasX(b.x1), toCanvasY(threshold));
      }
      ctx.stroke();
    }

    // Points.
    const drawPoint = (p: LabeledPoint, hollow: boolean) => {
      ctx.beginPath();
      ctx.arc(toCanvasX(p.x), toCanvasY(p.y), hollow ? 4 : 4.5, 0, Math.PI * 2);
      if (hollow) {
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = CLASS_COLORS[p.label];
      } else {
        ctx.fillStyle = CLASS_COLORS[p.label];
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
      }
      ctx.stroke();
    };
    train.forEach((p) => drawPoint(p, false));
    if (showTest) test.forEach((p) => drawPoint(p, true));

    // The node about to be split, and its best threshold.
    if (current && current.split) {
      const r = rect(current.bounds);
      ctx.setLineDash([8, 6]);
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 3;
      ctx.strokeRect(r.x + 1.5, r.y + 1.5, r.w - 3, r.h - 3);
      const { feature, threshold } = current.split;
      const b = current.bounds;
      ctx.strokeStyle = '#a21caf';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      if (feature === 0) {
        ctx.moveTo(toCanvasX(threshold), toCanvasY(b.y0));
        ctx.lineTo(toCanvasX(threshold), toCanvasY(b.y1));
      } else {
        ctx.moveTo(toCanvasX(b.x0), toCanvasY(threshold));
        ctx.lineTo(toCanvasX(b.x1), toCanvasY(threshold));
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    drawPlaneBorder(ctx);
  }, [visible, shown, train, test, showTest, current]);

  const loadDataset = (id: DatasetId) => {
    setDataset(id);
    setData(loadSplit(id));
    setStep(0);
  };

  const criterionName = criterion === 'gini' ? 'Gini' : 'Entropy';
  const depthMin = Math.min(0.5, Math.floor(Math.min(...depthCurve.train, ...depthCurve.test) * 10) / 10);
  const scanMax = scan ? Math.max(current!.impurity, ...scan.x.map((c) => c.weighted), ...scan.y.map((c) => c.weighted), 0.05) : 1;

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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RangeField label="Max depth" value={maxDepth} min={1} max={MAX_DEPTH} onChange={setMaxDepth} />
        <RangeField label="Min samples to split" value={minSamples} min={2} max={40} onChange={setMinSamples} />
        <Segmented
          label="Impurity"
          value={criterion}
          options={[
            { value: 'gini', label: 'Gini' },
            { value: 'entropy', label: 'Entropy' },
          ]}
          onChange={setCriterion}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          leftIcon={<StepForward className="h-4 w-4" />}
          onClick={() => setStep(shown + 1)}
          disabled={shown >= totalSplits}
        >
          Next split
        </Button>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<StepBack className="h-4 w-4" />}
          onClick={() => setStep(Math.max(0, shown - 1))}
          disabled={shown === 0}
        >
          Undo split
        </Button>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<FastForward className="h-4 w-4" />}
          onClick={() => setStep(totalSplits)}
          disabled={shown >= totalSplits}
        >
          Grow full tree
        </Button>
        <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={() => setStep(0)}>
          Reset
        </Button>
        <label className="ml-1 inline-flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={showTest} onChange={(e) => setShowTest(e.target.checked)} />
          Show test points
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <canvas
            ref={canvasRef}
            width={PLANE_W}
            height={PLANE_H}
            className={`${responsiveSurface} rounded-lg border border-line`}
            role="img"
            aria-label="Training points with the regions carved out by the decision tree's axis-aligned splits"
          />
          <p className="mt-2 text-sm text-ink-muted">
            Each region is a leaf, shaded by its majority class (stronger colour = purer leaf). The dashed box is the
            node being split next and the magenta line is its best threshold.
          </p>
        </div>

        <div className="space-y-4">
          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Stat label="Splits" value={`${shown} / ${totalSplits}`} />
            <Stat label="Leaves / depth" value={`${leaves.length} / ${depth}`} />
            <Stat label="Train accuracy" value={pct(trainAcc)} />
            <Stat label="Test accuracy" value={pct(testAcc)} tone="text-brand-700" />
          </dl>

          <Panel title="Split scan for the next node">
            {current && current.split && scan ? (
              <>
                <p className="mb-2 text-sm text-ink">
                  Node with {current.idx.length} samples ({current.counts[0]} blue, {current.counts[1]} orange), {criterionName}{' '}
                  {fmt(current.impurity)}. Every threshold on x and on y is tried; the lowest weighted child impurity wins:{' '}
                  <span className="font-mono font-semibold text-fuchsia-700">
                    {current.split.feature === 0 ? 'x' : 'y'} ≤ {current.split.threshold.toFixed(3)}
                  </span>{' '}
                  (gain {fmt(current.split.gain)}).
                </p>
                <LineChart
                  series={[
                    { name: 'x', color: '#0891b2', dots: false, points: scan.x.map((c) => ({ x: c.threshold, y: c.weighted })) },
                    { name: 'y', color: '#ca8a04', dots: false, points: scan.y.map((c) => ({ x: c.threshold, y: c.weighted })) },
                  ]}
                  xDomain={[0, 1]}
                  yDomain={[0, scanMax * 1.08]}
                  xTicks={[0, 0.25, 0.5, 0.75, 1]}
                  yTicks={[0, scanMax / 2, scanMax].map((v) => Math.round(v * 100) / 100)}
                  formatY={(v) => v.toFixed(2)}
                  xLabel="threshold"
                  yLabel={`weighted ${criterionName.toLowerCase()}`}
                  hLines={[{ y: current.impurity, color: '#64748b', label: 'parent' }]}
                  markers={[{ x: current.split.threshold, y: current.split.weighted, color: '#a21caf' }]}
                  ariaLabel="Weighted child impurity for every candidate threshold on x and on y"
                />
                <ChartLegend
                  items={[
                    { name: 'split on x', color: '#0891b2' },
                    { name: 'split on y', color: '#ca8a04' },
                    { name: 'parent impurity', color: '#64748b', dashed: true },
                  ]}
                />
              </>
            ) : (
              <p className="text-sm text-ink-muted">
                {totalSplits === 0
                  ? 'The root cannot be split with these settings.'
                  : 'The tree is fully grown: every leaf is pure, at max depth, or has too few samples to split.'}
              </p>
            )}
          </Panel>

          <Panel title="Accuracy vs max depth">
            <LineChart
              series={[
                { name: 'Train', color: '#64748b', dashed: true, points: depthCurve.train.map((v, i) => ({ x: i + 1, y: v })) },
                { name: 'Test', color: '#4f46e5', points: depthCurve.test.map((v, i) => ({ x: i + 1, y: v })) },
              ]}
              xDomain={[1, MAX_DEPTH]}
              yDomain={[depthMin, 1]}
              xTicks={Array.from({ length: MAX_DEPTH }, (_, i) => i + 1)}
              yTicks={Array.from({ length: Math.round((1 - depthMin) * 10) + 1 }, (_, i) => depthMin + i / 10)}
              formatY={(v) => `${Math.round(v * 100)}%`}
              xLabel="max depth"
              yLabel="accuracy"
              highlightX={maxDepth}
              selectableXs={Array.from({ length: MAX_DEPTH }, (_, i) => i + 1)}
              onSelectX={(d) => setMaxDepth(d)}
              ariaLabel="Training and test accuracy of fully grown trees for max depth 1 to 8"
            />
            <ChartLegend
              items={[
                { name: 'training accuracy', color: '#64748b', dashed: true },
                { name: 'test accuracy', color: '#4f46e5' },
              ]}
            />
            <p className="mt-2 text-xs text-ink-muted">
              Deeper trees keep fitting the training set better, but past a point they memorise noise and test accuracy
              stalls or drops. Tap the chart to set max depth.
            </p>
          </Panel>
        </div>
      </div>

      <TreeDiagram nodes={nodes} visible={visible} shown={shown} current={current} criterion={criterion} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tree diagram                                                        */
/* ------------------------------------------------------------------ */

const BOX_W = 112;
const BOX_H = 74;
const GAP_X = 14;
const LEVEL_H = 112;
const MARGIN = 12;

function TreeDiagram({
  nodes,
  visible,
  shown,
  current,
  criterion,
}: {
  nodes: TreeNode[];
  visible: TreeNode[];
  shown: number;
  current: TreeNode | null;
  criterion: Criterion;
}) {
  if (visible.length === 0) return null;

  // Leaves get consecutive slots from left to right; parents sit above the middle of their children.
  const pos = new Map<number, { x: number; y: number }>();
  let slot = 0;
  const place = (id: number): number => {
    const n = nodes[id];
    let x: number;
    if (isSplit(n, shown)) {
      x = (place(n.left) + place(n.right)) / 2;
    } else {
      x = MARGIN + slot * (BOX_W + GAP_X) + BOX_W / 2;
      slot++;
    }
    pos.set(id, { x, y: MARGIN + n.depth * LEVEL_H });
    return x;
  };
  place(0);
  const maxDepth = Math.max(...visible.map((n) => n.depth));
  const width = Math.max(2 * MARGIN + slot * (BOX_W + GAP_X) - GAP_X, 300);
  const height = 2 * MARGIN + maxDepth * LEVEL_H + BOX_H;
  const label = criterion === 'gini' ? 'gini' : 'entropy';

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-ink">Tree</h3>
      <div className="overflow-x-auto rounded-lg border border-line bg-subtle p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={responsiveSurface}
          style={{ minWidth: width * 0.75 }}
          role="img"
          aria-label="Decision tree diagram with each node's split, impurity, sample count and class mix"
        >
          {visible
            .filter((n) => isSplit(n, shown))
            .flatMap((n) => [
              { from: n, to: nodes[n.left], text: 'yes' },
              { from: n, to: nodes[n.right], text: 'no' },
            ])
            .map(({ from, to, text }) => {
              const a = pos.get(from.id)!;
              const b = pos.get(to.id)!;
              const x1 = a.x;
              const y1 = a.y + BOX_H;
              const x2 = b.x;
              const y2 = b.y;
              return (
                <g key={`${from.id}-${to.id}`}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={1.5} />
                  <text x={(x1 + x2) / 2 + (text === 'yes' ? -10 : 10)} y={(y1 + y2) / 2} textAnchor="middle" fontSize={11} fill="#64748b">
                    {text}
                  </text>
                </g>
              );
            })}

          {visible.map((n) => {
            const p = pos.get(n.id)!;
            const x = p.x - BOX_W / 2;
            const total = n.counts[0] + n.counts[1];
            const split = isSplit(n, shown);
            const isCurrent = current?.id === n.id;
            const blueW = total === 0 ? 0 : ((BOX_W - 16) * n.counts[0]) / total;
            return (
              <g key={n.id}>
                <rect
                  x={x}
                  y={p.y}
                  width={BOX_W}
                  height={BOX_H}
                  rx={8}
                  fill="#ffffff"
                  stroke={isCurrent ? '#4f46e5' : split ? '#94a3b8' : CLASS_COLORS[majority(n)]}
                  strokeWidth={isCurrent ? 3 : 1.5}
                  strokeDasharray={isCurrent ? '6 4' : undefined}
                />
                <text x={p.x} y={p.y + 17} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="#0f172a">
                  {split
                    ? `${n.split!.feature === 0 ? 'x' : 'y'} ≤ ${n.split!.threshold.toFixed(2)}`
                    : `leaf: ${CLASS_NAMES[majority(n)].toLowerCase()}`}
                </text>
                <text x={p.x} y={p.y + 33} textAnchor="middle" fontSize={11} fill="#475569">
                  {label} {n.impurity.toFixed(3)}
                </text>
                <text x={p.x} y={p.y + 48} textAnchor="middle" fontSize={11} fill="#475569">
                  n = {total} [{n.counts[0]}, {n.counts[1]}]
                </text>
                <rect x={x + 8} y={p.y + 56} width={BOX_W - 16} height={8} rx={2} fill={CLASS_COLORS[1]} />
                <rect x={x + 8} y={p.y + 56} width={blueW} height={8} rx={2} fill={CLASS_COLORS[0]} />
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        Left branch = condition true. [blue, orange] are the training samples reaching each node. The dashed node is the
        next one to split.
      </p>
    </div>
  );
}
