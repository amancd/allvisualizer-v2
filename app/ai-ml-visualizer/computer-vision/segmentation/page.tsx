import type { Metadata } from 'next';
import { Contrast, Palette, Shapes, Sprout } from 'lucide-react';
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
import SegmentationVisualizer from './SegmentationVisualizer';
import UNetDiagram from './UNetDiagram';

export const metadata: Metadata = {
  title: 'Image Segmentation Visualizer: Otsu, K-means, Region Growing and U-Net | AllVisualizer',
  description:
    "Segment an image in your browser with Otsu thresholding, k-means colour clustering and region growing. Compare semantic and instance masks, measure IoU and Dice, and see how U-Net's encoder-decoder works.",
  keywords: ['image segmentation', 'semantic segmentation', 'instance segmentation', 'Otsu', 'k-means', 'region growing', 'U-Net', 'Mask R-CNN', 'IoU', 'Dice'],
};

const methods = [
  {
    icon: Contrast,
    title: 'Thresholding',
    description: 'Split pixels by brightness. Otsu chooses the threshold automatically from the histogram.',
  },
  {
    icon: Palette,
    title: 'Clustering',
    description: 'Group pixels with similar colours using k-means. Works in colour space, ignores where pixels are.',
  },
  {
    icon: Sprout,
    title: 'Region growing',
    description: 'Start at a seed pixel and absorb neighbours that look similar. Uses position and colour.',
  },
  {
    icon: Shapes,
    title: 'Instances',
    description: 'Connected-component labelling splits a class mask into separate touching blobs, one per object.',
  },
];

const tasks = [
  { task: 'Semantic segmentation', output: 'A class for every pixel', example: 'U-Net, DeepLab, SegFormer', instances: 'No: two people are one "person" region' },
  { task: 'Instance segmentation', output: 'A mask per object (things only)', example: 'Mask R-CNN, YOLACT', instances: 'Yes' },
  { task: 'Panoptic segmentation', output: 'Both: classes for stuff (sky, road), instances for things', example: 'Panoptic FPN, Mask2Former', instances: 'Yes' },
];

const code = `// Otsu's threshold from a 256-bin histogram
function otsu(hist) {
  const total = hist.reduce((a, b) => a + b, 0);
  const sumAll = hist.reduce((s, h, v) => s + v * h, 0);
  let w0 = 0, sum0 = 0, best = 0, threshold = 0;
  for (let t = 0; t < 256; t++) {
    w0 += hist[t];
    sum0 += t * hist[t];
    const w1 = total - w0;
    if (w0 === 0 || w1 === 0) continue;
    const mu0 = sum0 / w0, mu1 = (sumAll - sum0) / w1;
    const between = (w0 / total) * (w1 / total) * (mu0 - mu1) ** 2;
    if (between > best) { best = between; threshold = t; }
  }
  return threshold;
}

// IoU and Dice of two binary masks
function scores(pred, truth) {
  let tp = 0, fp = 0, fn = 0;
  for (let i = 0; i < pred.length; i++) {
    if (pred[i] && truth[i]) tp++;
    else if (pred[i]) fp++;
    else if (truth[i]) fn++;
  }
  return { iou: tp / (tp + fp + fn), dice: (2 * tp) / (2 * tp + fp + fn) };
}`;

const python = `import cv2
import numpy as np

img = cv2.imread("photo.png")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Otsu threshold (THRESH_BINARY_INV: dark objects become foreground)
t, mask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

# k-means on colours
pixels = img.reshape(-1, 3).astype(np.float32)
criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 50, 0.5)
_, labels, centres = cv2.kmeans(pixels, 4, None, criteria, 3, cv2.KMEANS_PP_CENTERS)

# instances from a binary mask
count, instance_ids = cv2.connectedComponents(mask, connectivity=4)`;

export default function SegmentationPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="segmentation"
      description="Label every pixel of an image. Run three classical segmentation methods for real, turn the result into semantic and instance masks, and see how deep networks like U-Net do it."
    >
      <SegmentationVisualizer />

      <ContentSection title="What segmentation is">
        <Prose>
          <p>
            Detection draws a box around each object. Segmentation goes further and decides, for <strong>every pixel</strong>,
            what it belongs to. <strong>Semantic</strong> segmentation assigns a class (disc, rectangle, background).{' '}
            <strong>Instance</strong> segmentation also tells the two discs apart.
          </p>
          <p>
            The three methods in the visualizer are classical algorithms, and they really run on the pixels in your browser. They
            have no idea what a disc or a triangle is: they only group pixels by brightness, colour and adjacency. That is exactly
            why they fail in instructive ways (uneven lighting, objects as bright as the background). Deep networks learn
            features that cope with those problems, but nothing on this page runs a neural network: the U-Net section below is a
            diagram.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={methods} columns={4} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Otsu's method">
            <Formula
              where={[
                { symbol: 'w₀, w₁', meaning: 'fraction of pixels at or below t, and above t' },
                { symbol: 'μ₀, μ₁', meaning: 'mean brightness of each group' },
              ]}
            >
              t* = argmax<sub>t</sub> w₀(t) · w₁(t) · (μ₀(t) − μ₁(t))²
            </Formula>
          </Callout>
          <Callout tone="formula" title="K-means (one iteration)">
            <Formula where={[{ symbol: 'c_j', meaning: 'centre (mean colour) of cluster j' }, { symbol: 'S_j', meaning: 'pixels assigned to cluster j' }]}>
              assign: label(p) = argmin<sub>j</sub> ‖p − c<sub>j</sub>‖², update: c<sub>j</sub> = mean(S<sub>j</sub>)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Mask overlap">
            <Formula where={[{ symbol: 'A, B', meaning: 'predicted and true foreground pixel sets' }]}>
              IoU = |A ∩ B| / |A ∪ B|, Dice = 2|A ∩ B| / (|A| + |B|) = 2·IoU / (1 + IoU)
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'In Threshold mode, look at the histogram: the dark objects and the light background form two humps. Otsu picks the valley automatically.',
            'Switch to Errors vs truth. The yellow triangle shows up blue (missed): it is as bright as the background, so no brightness threshold can separate it.',
            'Switch to K-means colours. Press Step a few times and watch the cluster centres settle. Try k = 3, 4 and 5, and tap a cluster to mark it background or foreground.',
            'Switch to Region growing and tap inside an object to place a seed. Raise the tolerance until the object fills, and keep going until it leaks.',
            'In the Semantic vs instance panel, compare the predicted maps with the ground truth and adjust the minimum component size to drop noise specks.',
            'Try your own image with the upload button. It is processed locally; there is no ground truth for it, so IoU and Dice are hidden.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Semantic, instance and panoptic">
        <DataTable
          columns={[
            { header: 'Task', cell: 'task' },
            { header: 'Output', cell: 'output' },
            { header: 'Separates objects?', cell: 'instances' },
            { header: 'Typical models', cell: 'example' },
          ]}
          rows={tasks}
        />
        <Callout tone="note" title="Why connected components are not enough" className="mt-4">
          Labelling connected blobs gives correct instances only when objects of the same class do not touch. Two overlapping people
          form one blob. Mask R-CNN solves this by first detecting a box per object, then predicting a separate mask inside each box.
        </Callout>
      </ContentSection>

      <ContentSection
        title="How deep networks segment: U-Net"
        description="An encoder shrinks the image into abstract features; a decoder grows them back to full resolution; skip connections carry fine detail across."
      >
        <UNetDiagram />
        <Prose className="mt-6">
          <p>
            The <strong>encoder</strong> is an ordinary CNN: each level applies two 3×3 convolutions, then a 2×2 max pool halves the
            width and height. Deep features know <em>what</em> is in the image but have lost <em>where</em> exactly.
          </p>
          <p>
            The <strong>decoder</strong> reverses this with up-convolutions. On its own it would produce blurry boundaries, so at each
            level it concatenates the encoder&apos;s feature map of the same size (the <strong>skip connection</strong>). A final 1×1
            convolution turns each pixel&apos;s feature vector into class scores, and the network is trained with per-pixel
            cross-entropy or Dice loss against labelled masks.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Code">
        <CodeTabs
          samples={[
            { label: 'JavaScript', language: 'javascript', code },
            { label: 'Python (OpenCV)', language: 'python', code: python },
          ]}
        />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: IoU and Dice"
            question={
              <>
                A predicted mask has 900 pixels. The true mask has 1000 pixels. They share 800 pixels. Compute the IoU and the Dice
                score.
              </>
            }
            solution={
              <>
                <p>TP = 800, FP = 900 − 800 = 100, FN = 1000 − 800 = 200.</p>
                <p>IoU = 800 / (800 + 100 + 200) = 800 / 1100 ≈ 0.727.</p>
                <p>Dice = 2 · 800 / (900 + 1000) = 1600 / 1900 ≈ 0.842.</p>
                <p>Check: 2 · 0.727 / (1 + 0.727) ≈ 0.842.</p>
                <p className="font-semibold text-emerald-700">IoU ≈ 0.73, Dice ≈ 0.84. Dice is always at least as high as IoU.</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Otsu on a tiny histogram"
            question={
              <>
                An image has 4 pixels of brightness 20 and 4 pixels of brightness 200, nothing else. Compare the between-class
                variance for t = 20 and t = 100. Which threshold does Otsu prefer?
              </>
            }
            solution={
              <>
                <p>For t = 20: w₀ = 0.5, μ₀ = 20; w₁ = 0.5, μ₁ = 200. σ² = 0.5 · 0.5 · 180² = 8100.</p>
                <p>For t = 100: the groups are exactly the same pixels, so σ² = 8100 as well.</p>
                <p>Every t from 20 to 199 gives the same split and the same score.</p>
                <p className="font-semibold text-emerald-700">
                  It is a tie; the code above keeps the first maximum, t = 20. Any t in [20, 199] separates the image perfectly.
                </p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
