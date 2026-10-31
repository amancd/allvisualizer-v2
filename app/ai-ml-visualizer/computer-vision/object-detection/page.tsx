import type { Metadata } from 'next';
import { Boxes, Grid3x3, Layers, Target } from 'lucide-react';
import {
  Callout,
  CardGrid,
  CodeTabs,
  ContentSection,
  DataTable,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
} from '@/components/content';
import ObjectDetectionVisualizer from './ObjectDetectionVisualizer';
import IoUCalculator from './IoUCalculator';
import YoloGrid from './YoloGrid';

export const metadata: Metadata = {
  title: 'Object Detection Visualizer: IoU, NMS and YOLO Grids | AllVisualizer',
  description:
    'Step through non-maximum suppression on overlapping candidate boxes, drag boxes to compute IoU, see how a YOLO grid assigns objects to cells, and measure precision and recall.',
  keywords: ['object detection', 'bounding boxes', 'IoU', 'non-maximum suppression', 'NMS', 'YOLO', 'R-CNN', 'precision', 'recall'],
};

const concepts = [
  {
    icon: Boxes,
    title: 'Boxes plus scores',
    description: 'A detector outputs many boxes, each with a class and a confidence score. Most are duplicates or noise.',
  },
  {
    icon: Target,
    title: 'IoU measures overlap',
    description: 'Intersection over union is 1 for identical boxes and 0 for disjoint ones. It is used both to match and to de-duplicate.',
  },
  {
    icon: Layers,
    title: 'NMS removes duplicates',
    description: 'Keep the best box, remove its same-class neighbours that overlap too much, repeat.',
  },
  {
    icon: Grid3x3,
    title: 'Grids make it one pass',
    description: 'YOLO splits the image into cells and predicts boxes for every cell at once, which makes it fast.',
  },
];

const families = [
  { name: 'R-CNN / Fast R-CNN', stages: 'Two', idea: 'Propose ~2000 regions, then classify and refine each one', speed: 'Slow' },
  { name: 'Faster R-CNN', stages: 'Two', idea: 'A Region Proposal Network shares features with the classifier', speed: 'Medium' },
  { name: 'YOLO', stages: 'One', idea: 'Grid cells predict boxes, objectness and classes in a single forward pass', speed: 'Fast' },
  { name: 'SSD / RetinaNet', stages: 'One', idea: 'Anchor boxes at several feature-map scales; focal loss for class imbalance', speed: 'Fast' },
  { name: 'DETR', stages: 'One', idea: 'A transformer predicts a fixed set of boxes, matched one-to-one, so no NMS needed', speed: 'Medium' },
];

const code = `function iou(a, b) {
  const x1 = Math.max(a.x, b.x), y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w), y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  return inter / (a.w * a.h + b.w * b.h - inter);
}

function nms(boxes, scoreThreshold, iouThreshold) {
  let remaining = boxes
    .filter((b) => b.score >= scoreThreshold)
    .sort((a, b) => b.score - a.score);
  const kept = [];
  while (remaining.length) {
    const best = remaining.shift();
    kept.push(best);
    remaining = remaining.filter((b) => b.cls !== best.cls || iou(best, b) <= iouThreshold);
  }
  return kept;
}`;

const python = `import torch
from torchvision.ops import batched_nms

# boxes: (N, 4) as x1, y1, x2, y2; scores: (N,); labels: (N,)
keep = scores >= 0.3
boxes, scores, labels = boxes[keep], scores[keep], labels[keep]

# class-aware NMS: boxes only suppress boxes with the same label
kept = batched_nms(boxes, scores, labels, iou_threshold=0.5)
detections = boxes[kept], scores[kept], labels[kept]`;

export default function ObjectDetectionPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="object-detection"
      description="Follow a detector's raw output through score filtering and non-maximum suppression, compute IoU by dragging boxes, and see how a YOLO grid divides up the work."
    >
      <Callout tone="warning" title="Simulated detections">
        No neural network runs on this page. The candidate boxes and confidence scores are generated deterministically around the
        objects in a drawn scene, to look like what a detector outputs before post-processing. Everything that happens to those
        boxes (score filtering, IoU, NMS, matching, precision and recall) is computed for real.
      </Callout>

      <ObjectDetectionVisualizer />

      <ContentSection title="How object detection works">
        <Prose>
          <p>
            Classification answers <em>what</em> is in an image. Detection also answers <em>where</em>, with a bounding box for
            every object. A trained detector such as YOLO or Faster R-CNN produces hundreds of candidate boxes, each with a class
            and a confidence score. Many of them cover the same object, slightly shifted. Post-processing turns that crowd into
            one box per object.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={concepts} columns={4} />
        </div>
      </ContentSection>

      <ContentSection title="IoU calculator" description="Intersection over union is the overlap measure behind both NMS and evaluation.">
        <IoUCalculator />
      </ContentSection>

      <ContentSection
        title="The YOLO grid"
        description="YOLO divides the image into S × S cells. The cell that contains an object's centre is responsible for predicting it."
      >
        <YoloGrid />
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Intersection over union">
            <Formula where={[{ symbol: 'A, B', meaning: 'two boxes' }, { symbol: '|·|', meaning: 'area' }]}>
              IoU(A, B) = |A ∩ B| / |A ∪ B| = |A ∩ B| / (|A| + |B| − |A ∩ B|)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Precision and recall">
            <Formula
              where={[
                { symbol: 'TP', meaning: 'detections matched to an object (right class, IoU ≥ 0.5)' },
                { symbol: 'FP', meaning: 'unmatched detections, including duplicates' },
                { symbol: 'FN', meaning: 'objects that no detection matched' },
              ]}
            >
              precision = TP / (TP + FP), recall = TP / (TP + FN)
            </Formula>
          </Callout>
          <Callout tone="formula" title="YOLO output size">
            <Formula where={[{ symbol: 'B', meaning: 'boxes per cell, each with x, y, w, h, objectness' }, { symbol: 'C', meaning: 'number of classes' }]}>
              S × S × (B · 5 + C)
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Detector families">
        <DataTable
          columns={[
            { header: 'Model', cell: 'name' },
            { header: 'Stages', cell: 'stages' },
            { header: 'Core idea', cell: 'idea' },
            { header: 'Speed', cell: 'speed' },
          ]}
          rows={families}
        />
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Look at the scene: dotted black boxes are the ground truth, coloured boxes are the simulated candidates.',
            'Set the score threshold. Candidates below it disappear before NMS even starts.',
            'Press Step. The best remaining box is kept (filled) and every same-class box whose IoU with it exceeds the NMS threshold is suppressed (grey, dashed).',
            'Press Play or Finish to run to the end, then compare precision and recall before and after NMS.',
            'Lower the IoU threshold to suppress more aggressively; raise it and duplicates survive as false positives.',
            'Drag the two boxes in the IoU calculator, and tap cells in the YOLO grid to see what each cell is trained to predict.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Code">
        <CodeTabs
          samples={[
            { label: 'JavaScript', language: 'javascript', code },
            { label: 'Python (torchvision)', language: 'python', code: python },
          ]}
        />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Compute IoU"
            question={
              <>
                Box A spans x 0 to 10 and y 0 to 10. Box B spans x 5 to 15 and y 5 to 15. What is their IoU? Would NMS with a
                threshold of 0.5 suppress B if A has the higher score?
              </>
            }
            solution={
              <>
                <p>Intersection: x 5 to 10, y 5 to 10, so 5 × 5 = 25.</p>
                <p>Union: 100 + 100 − 25 = 175.</p>
                <p>IoU = 25 / 175 ≈ 0.143.</p>
                <p className="font-semibold text-emerald-700">0.143 ≤ 0.5, so B is kept.</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Run NMS by hand"
            question={
              <>
                Three &quot;dog&quot; boxes have scores 0.9 (P), 0.8 (Q) and 0.6 (R). IoU(P, Q) = 0.7, IoU(P, R) = 0.2 and IoU(Q, R) =
                0.6. With an IoU threshold of 0.5, which boxes survive?
              </>
            }
            solution={
              <>
                <p>Step 1: keep P (highest score). Q has IoU 0.7 &gt; 0.5 with P, so Q is suppressed. R has 0.2, so it stays.</p>
                <p>Step 2: keep R. Nothing remains.</p>
                <p className="font-semibold text-emerald-700">P and R survive.</p>
                <p>Q never gets to suppress R, because Q was removed first. Order matters in greedy NMS.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
