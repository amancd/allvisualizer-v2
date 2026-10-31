/**
 * A small CART implementation for two features and two classes.
 *
 * The full tree (up to maxDepth) is grown breadth-first and each split is
 * numbered in the order it was made. The visualizer then shows only the first
 * `step` splits, so stepping forward and back never has to rebuild anything.
 */

import type { LabeledPoint } from '../_classical-ml/ml-shared';

export type Criterion = 'gini' | 'entropy';
export type Feature = 0 | 1; // 0 = x, 1 = y

export interface Bounds {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface Split {
  feature: Feature;
  threshold: number;
  /** Weighted impurity of the two children. */
  weighted: number;
  /** Parent impurity minus weighted child impurity. */
  gain: number;
}

export interface TreeNode {
  id: number;
  depth: number;
  /** Indices into the training set. */
  idx: number[];
  counts: [number, number];
  impurity: number;
  bounds: Bounds;
  /** Best split for this node, if it was split in the full tree. */
  split: Split | null;
  /** Position of this node's split in the growth order, or -1 for a leaf of the full tree. */
  order: number;
  left: number;
  right: number;
}

export interface GrowParams {
  maxDepth: number;
  /** A node needs at least this many samples to be split. */
  minSamples: number;
  criterion: Criterion;
}

const featureValue = (p: LabeledPoint, f: Feature) => (f === 0 ? p.x : p.y);

export function impurity(c0: number, c1: number, criterion: Criterion): number {
  const n = c0 + c1;
  if (n === 0) return 0;
  const p0 = c0 / n;
  const p1 = c1 / n;
  if (criterion === 'gini') return 1 - p0 * p0 - p1 * p1;
  const h = (p: number) => (p === 0 ? 0 : -p * Math.log2(p));
  return h(p0) + h(p1);
}

export interface Candidate {
  threshold: number;
  weighted: number;
}

/** Every threshold (midpoint between consecutive distinct values) for one feature, with its weighted child impurity. */
export function scanFeature(train: LabeledPoint[], idx: number[], feature: Feature, criterion: Criterion): Candidate[] {
  const sorted = [...idx].sort((a, b) => featureValue(train[a], feature) - featureValue(train[b], feature));
  const total: [number, number] = [0, 0];
  for (const i of idx) total[train[i].label]++;
  const n = idx.length;
  const left: [number, number] = [0, 0];
  const out: Candidate[] = [];
  for (let j = 0; j < n - 1; j++) {
    left[train[sorted[j]].label]++;
    const v = featureValue(train[sorted[j]], feature);
    const next = featureValue(train[sorted[j + 1]], feature);
    if (next === v) continue;
    const nl = j + 1;
    const nr = n - nl;
    const weighted =
      (nl / n) * impurity(left[0], left[1], criterion) +
      (nr / n) * impurity(total[0] - left[0], total[1] - left[1], criterion);
    out.push({ threshold: (v + next) / 2, weighted });
  }
  return out;
}

export function bestSplit(train: LabeledPoint[], idx: number[], parentImpurity: number, criterion: Criterion): Split | null {
  let best: Split | null = null;
  for (const feature of [0, 1] as Feature[]) {
    for (const c of scanFeature(train, idx, feature, criterion)) {
      const gain = parentImpurity - c.weighted;
      if (gain > 1e-12 && (!best || gain > best.gain + 1e-12)) best = { feature, threshold: c.threshold, weighted: c.weighted, gain };
    }
  }
  return best;
}

export function growTree(train: LabeledPoint[], params: GrowParams): TreeNode[] {
  const nodes: TreeNode[] = [];
  const make = (idx: number[], depth: number, bounds: Bounds): TreeNode => {
    const counts: [number, number] = [0, 0];
    for (const i of idx) counts[train[i].label]++;
    const node: TreeNode = {
      id: nodes.length,
      depth,
      idx,
      counts,
      impurity: impurity(counts[0], counts[1], params.criterion),
      bounds,
      split: null,
      order: -1,
      left: -1,
      right: -1,
    };
    nodes.push(node);
    return node;
  };

  if (train.length === 0) return nodes;
  const queue = [make(train.map((_, i) => i), 0, { x0: 0, x1: 1, y0: 0, y1: 1 })];
  let order = 0;
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node.depth >= params.maxDepth || node.idx.length < params.minSamples || node.impurity === 0) continue;
    const split = bestSplit(train, node.idx, node.impurity, params.criterion);
    if (!split) continue;
    node.split = split;
    node.order = order++;
    const goesLeft = (i: number) => featureValue(train[i], split.feature) <= split.threshold;
    const b = node.bounds;
    const leftBounds = split.feature === 0 ? { ...b, x1: split.threshold } : { ...b, y1: split.threshold };
    const rightBounds = split.feature === 0 ? { ...b, x0: split.threshold } : { ...b, y0: split.threshold };
    const left = make(node.idx.filter(goesLeft), node.depth + 1, leftBounds);
    const right = make(
      node.idx.filter((i) => !goesLeft(i)),
      node.depth + 1,
      rightBounds,
    );
    node.left = left.id;
    node.right = right.id;
    queue.push(left, right);
  }
  return nodes;
}

/** True when this node is split in the tree that shows only the first `step` splits. */
export const isSplit = (node: TreeNode, step: number) => node.order >= 0 && node.order < step;

export const majority = (node: TreeNode) => (node.counts[1] > node.counts[0] ? 1 : 0);

export function predict(nodes: TreeNode[], step: number, p: { x: number; y: number }): number {
  let node = nodes[0];
  while (isSplit(node, step)) {
    const s = node.split!;
    node = nodes[(s.feature === 0 ? p.x : p.y) <= s.threshold ? node.left : node.right];
  }
  return majority(node);
}

export function accuracy(nodes: TreeNode[], step: number, points: LabeledPoint[]): number {
  if (nodes.length === 0 || points.length === 0) return 0;
  return points.filter((p) => predict(nodes, step, p) === p.label).length / points.length;
}

/** Nodes that are visible when only the first `step` splits are shown (root plus children of shown splits). */
export function visibleNodes(nodes: TreeNode[], step: number): TreeNode[] {
  if (nodes.length === 0) return [];
  const out: TreeNode[] = [];
  const walk = (id: number) => {
    const n = nodes[id];
    out.push(n);
    if (isSplit(n, step)) {
      walk(n.left);
      walk(n.right);
    }
  };
  walk(0);
  return out;
}
