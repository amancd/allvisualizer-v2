/**
 * Synthetic scene, simulated detector output, IoU and non-maximum suppression.
 *
 * The candidate boxes are NOT produced by a neural network. They are generated
 * deterministically around the ground-truth objects (plus a few false alarms) to
 * look like the raw output of a detector before NMS.
 */

export type ClassName = 'car' | 'person' | 'tree' | 'dog';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GroundTruth extends Box {
  id: string;
  cls: ClassName;
}

export interface Candidate extends Box {
  id: number;
  cls: ClassName;
  score: number;
}

export const SCENE_W = 640;
export const SCENE_H = 400;

export const CLASS_COLORS: Record<ClassName, string> = {
  car: '#2563eb',
  person: '#e11d48',
  tree: '#16a34a',
  dog: '#d97706',
};

export const CLASSES: ClassName[] = ['car', 'person', 'tree', 'dog'];

export const GROUND_TRUTH: GroundTruth[] = [
  { id: 'car', cls: 'car', x: 60, y: 250, w: 200, h: 90 },
  { id: 'person', cls: 'person', x: 262, y: 172, w: 56, h: 168 },
  { id: 'tree', cls: 'tree', x: 410, y: 80, w: 150, h: 260 },
  { id: 'dog', cls: 'dog', x: 572, y: 285, w: 67, h: 55 },
];

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clipBox(b: Box): Box {
  const x = Math.max(0, Math.min(SCENE_W - 10, b.x));
  const y = Math.max(0, Math.min(SCENE_H - 10, b.y));
  return { x, y, w: Math.min(b.w, SCENE_W - x), h: Math.min(b.h, SCENE_H - y) };
}

/** Five overlapping guesses per object with falling confidence, plus four false alarms. */
function generateCandidates(): Candidate[] {
  const rand = mulberry32(2024);
  const out: Candidate[] = [];
  let id = 1;
  for (const gt of GROUND_TRUTH) {
    for (let k = 0; k < 5; k++) {
      const jitter = k === 0 ? 0.05 : 0.08 + 0.05 * k; // later guesses are sloppier
      const dx = (rand() * 2 - 1) * jitter * gt.w;
      const dy = (rand() * 2 - 1) * jitter * gt.h;
      const sw = 1 + (rand() * 2 - 1) * jitter;
      const sh = 1 + (rand() * 2 - 1) * jitter;
      const score = k === 0 ? 0.86 + rand() * 0.1 : 0.82 - 0.12 * k + rand() * 0.1;
      const box = clipBox({ x: gt.x + dx, y: gt.y + dy, w: gt.w * sw, h: gt.h * sh });
      out.push({ id: id++, cls: gt.cls, score: Math.round(score * 100) / 100, ...roundBox(box) });
    }
  }
  // False alarms: background patches the "detector" mistook for objects.
  const falseAlarms: { cls: ClassName; box: Box; score: number }[] = [
    { cls: 'person', box: { x: 52, y: 38, w: 58, h: 66 }, score: 0.31 }, // the sun
    { cls: 'tree', box: { x: 300, y: 40, w: 110, h: 70 }, score: 0.44 }, // a cloud
    { cls: 'dog', box: { x: 330, y: 300, w: 70, h: 50 }, score: 0.58 }, // a bush
    { cls: 'car', box: { x: 230, y: 268, w: 110, h: 72 }, score: 0.22 }, // half car, half person
  ];
  for (const fa of falseAlarms) out.push({ id: id++, cls: fa.cls, score: fa.score, ...fa.box });
  return out;
}

function roundBox(b: Box): Box {
  return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h) };
}

export const CANDIDATES: Candidate[] = generateCandidates();

export function area(b: Box) {
  return Math.max(0, b.w) * Math.max(0, b.h);
}

/** The overlapping rectangle of two boxes, or null if they do not overlap. */
export function intersection(a: Box, b: Box): Box | null {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  if (x2 <= x1 || y2 <= y1) return null;
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

export function iou(a: Box, b: Box) {
  const inter = intersection(a, b);
  const i = inter ? area(inter) : 0;
  const u = area(a) + area(b) - i;
  return u > 0 ? i / u : 0;
}

export interface NmsStep {
  /** The highest-scoring box still in play: it is kept. */
  pick: number;
  /** Same-class boxes that overlapped the pick too much, with their IoU. */
  suppressed: { id: number; iou: number }[];
}

export interface NmsTrace {
  /** Candidates above the score threshold, best first. */
  eligible: Candidate[];
  steps: NmsStep[];
}

/** Greedy, class-aware NMS. Records every decision so the UI can replay it one step at a time. */
export function runNms(candidates: Candidate[], scoreThreshold: number, iouThreshold: number): NmsTrace {
  const eligible = candidates.filter((c) => c.score >= scoreThreshold).sort((a, b) => b.score - a.score);
  let remaining = [...eligible];
  const steps: NmsStep[] = [];
  while (remaining.length > 0) {
    const [best, ...rest] = remaining;
    const suppressed: NmsStep['suppressed'] = [];
    remaining = rest.filter((c) => {
      if (c.cls !== best.cls) return true;
      const overlap = iou(best, c);
      if (overlap > iouThreshold) {
        suppressed.push({ id: c.id, iou: overlap });
        return false;
      }
      return true;
    });
    steps.push({ pick: best.id, suppressed });
  }
  return { eligible, steps };
}

export interface Evaluation {
  tp: number;
  fp: number;
  fn: number;
  precision: number;
  recall: number;
  matches: { detection: number; gt: string | null; iou: number }[];
}

/** Matches detections to ground truth (same class, IoU ≥ matchIou, each object at most once), best score first. */
export function evaluate(detections: Candidate[], matchIou = 0.5): Evaluation {
  const used = new Set<string>();
  const matches: Evaluation['matches'] = [];
  for (const d of [...detections].sort((a, b) => b.score - a.score)) {
    let best: GroundTruth | null = null;
    let bestIou = 0;
    for (const gt of GROUND_TRUTH) {
      if (gt.cls !== d.cls || used.has(gt.id)) continue;
      const o = iou(d, gt);
      if (o > bestIou) {
        bestIou = o;
        best = gt;
      }
    }
    if (best && bestIou >= matchIou) {
      used.add(best.id);
      matches.push({ detection: d.id, gt: best.id, iou: bestIou });
    } else {
      matches.push({ detection: d.id, gt: null, iou: bestIou });
    }
  }
  const tp = used.size;
  const fp = detections.length - tp;
  const fn = GROUND_TRUTH.length - tp;
  return {
    tp,
    fp,
    fn,
    precision: detections.length ? tp / detections.length : 0,
    recall: tp / GROUND_TRUTH.length,
    matches,
  };
}
