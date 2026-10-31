import type { Metadata } from 'next';
import { Compass, Filter, Layers, ScanLine } from 'lucide-react';
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
import EdgeDetectionVisualizer from './EdgeDetectionVisualizer';

export const metadata: Metadata = {
  title: 'Edge Detection Visualizer: Sobel, Prewitt, Laplacian and Canny | AllVisualizer',
  description:
    'Run Sobel, Prewitt and Laplacian filters and the full Canny pipeline in your browser. See Gx, Gy, gradient magnitude and direction, and inspect the kernel arithmetic at any pixel.',
  keywords: ['edge detection', 'Sobel', 'Prewitt', 'Laplacian', 'Canny', 'non-maximum suppression', 'hysteresis', 'image gradient', 'computer vision'],
};

const operators = [
  { name: 'Sobel', kernel: '[-1 0 1; -2 0 2; -1 0 1]', measures: 'First derivative, with built-in smoothing across the edge', noise: 'Moderate' },
  { name: 'Prewitt', kernel: '[-1 0 1; -1 0 1; -1 0 1]', measures: 'First derivative, plain average across the edge', noise: 'Slightly worse than Sobel' },
  { name: 'Laplacian', kernel: '[0 1 0; 1 -4 1; 0 1 0]', measures: 'Second derivative, all directions at once', noise: 'Poor: amplifies noise' },
  { name: 'Canny', kernel: 'Gaussian + Sobel + NMS + hysteresis', measures: 'Thin, connected edge map', noise: 'Good, tuned by σ' },
];

const ideas = [
  {
    icon: ScanLine,
    title: 'An edge is a fast change',
    description: 'Where brightness jumps from dark to light, the first derivative spikes and the second derivative crosses zero.',
  },
  {
    icon: Compass,
    title: 'Gradients have a direction',
    description: 'Gx and Gy together form a vector that points from dark to light. The edge itself runs perpendicular to it.',
  },
  {
    icon: Filter,
    title: 'Derivatives amplify noise',
    description: 'Subtracting neighbouring pixels turns small random noise into many small "edges", so detectors smooth first.',
  },
  {
    icon: Layers,
    title: 'Canny adds decisions',
    description: 'Thinning (non-max suppression) and two thresholds turn a blurry gradient image into clean one-pixel contours.',
  },
];

const code = `// Sobel gradient at pixel (x, y) of a grayscale image (values 0..255)
const KX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
const KY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

function sobelAt(img, x, y) {
  let gx = 0, gy = 0;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const v = img.get(x + i, y + j); // clamp at the borders
      gx += KX[j + 1][i + 1] * v;
      gy += KY[j + 1][i + 1] * v;
    }
  }
  return { magnitude: Math.hypot(gx, gy), angle: Math.atan2(gy, gx) };
}`;

const python = `import cv2

img = cv2.imread("photo.png", cv2.IMREAD_GRAYSCALE)

gx = cv2.Sobel(img, cv2.CV_32F, 1, 0, ksize=3)
gy = cv2.Sobel(img, cv2.CV_32F, 0, 1, ksize=3)
magnitude, angle = cv2.cartToPolar(gx, gy, angleInDegrees=True)

blurred = cv2.GaussianBlur(img, (0, 0), sigmaX=1.4)
edges = cv2.Canny(blurred, threshold1=40, threshold2=100)`;

export default function EdgeDetectionPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="edge-detection"
      description="Run Sobel, Prewitt and Laplacian kernels on a real image, step through every stage of the Canny detector, and check the arithmetic at any pixel."
    >
      <EdgeDetectionVisualizer />

      <ContentSection title="What edge detection does">
        <Prose>
          <p>
            An edge is a place where image brightness changes quickly. Edge detectors estimate the <strong>derivative</strong> of
            the image with small kernels: a 3×3 grid of weights slid over every pixel. Sobel and Prewitt estimate the first
            derivative in x and y separately, giving a gradient vector with a strength (magnitude) and a direction. The Laplacian
            estimates the second derivative, which is zero right at the middle of an edge.
          </p>
          <p>
            Every image on this page is computed for real in your browser from the pixel values: nothing is pre-rendered. The
            only simplification is the size (160×120 pixels) so the pipeline reruns instantly when you move a slider.
          </p>
        </Prose>
        <div className="mt-6">
          <CardGrid items={ideas} columns={4} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Gradient magnitude and direction">
            <Formula
              where={[
                { symbol: 'Gx, Gy', meaning: 'responses of the horizontal and vertical kernels at a pixel' },
                { symbol: '|G|', meaning: 'edge strength' },
                { symbol: 'θ', meaning: 'direction of fastest brightness increase (edge runs at θ + 90°)' },
              ]}
            >
              |G| = √(Gx² + Gy²), θ = atan2(Gy, Gx)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Applying a 3×3 kernel">
            <Formula where={[{ symbol: 'K', meaning: 'the kernel weights' }, { symbol: 'I', meaning: 'image brightness' }]}>
              G(x, y) = Σ<sub>i,j ∈ {'{'}-1,0,1{'}'}</sub> K(i, j) · I(x + i, y + j)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Gaussian blur used by Canny">
            <Formula where={[{ symbol: 'σ', meaning: 'standard deviation: larger σ smooths more and keeps only bigger edges' }]}>
              g(x) = e<sup>−x² / 2σ²</sup> / Σ e<sup>−k² / 2σ²</sup>
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="The Canny pipeline">
        <Prose>
          <ol>
            <li>
              <strong>Blur</strong> with a Gaussian of width σ to suppress noise.
            </li>
            <li>
              <strong>Gradient</strong>: Sobel Gx and Gy, then magnitude and direction.
            </li>
            <li>
              <strong>Non-maximum suppression</strong>: round the direction to 0°, 45°, 90° or 135° and keep a pixel only if its
              magnitude is at least as large as both neighbours along that direction.
            </li>
            <li>
              <strong>Double threshold</strong>: above <code>high</code> is strong, between <code>low</code> and{' '}
              <code>high</code> is weak, below <code>low</code> is dropped.
            </li>
            <li>
              <strong>Hysteresis</strong>: keep weak pixels only if they are connected (8-neighbourhood) to a strong pixel.
            </li>
          </ol>
        </Prose>
        <div className="mt-6">
          <DataTable
            columns={[
              { header: 'Detector', cell: 'name' },
              { header: 'Kernel', cell: (r) => <code className="font-mono text-xs">{r.kernel}</code> },
              { header: 'Measures', cell: 'measures' },
              { header: 'Noise handling', cell: 'noise' },
            ]}
            rows={operators}
          />
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Start in Gradient operators mode and switch between Sobel, Prewitt and Laplacian. Compare Gx, Gy, magnitude and the direction (hue) image.',
            'Raise the noise slider and watch the Laplacian fill with speckle much sooner than Sobel.',
            'Tap any image to move the inspector. It shows the 3×3 neighbourhood, each kernel weight times its pixel, and the sum.',
            'Switch to Canny pipeline. Step through the five stages with the buttons or thumbnails.',
            'Increase σ to remove noise edges (and fine detail). Move the low and high thresholds and watch which weak pixels survive hysteresis.',
            'Use your own image with the upload button. It is converted to grayscale locally and never uploaded.',
          ]}
        />
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
            title="Problem 1: Sobel by hand"
            question={
              <>
                A 3×3 neighbourhood is <code>[10 10 10; 10 10 10; 90 90 90]</code> (rows top to bottom). Compute Gx, Gy, |G| and θ
                with the Sobel kernels.
              </>
            }
            solution={
              <>
                <p>Gx: every row is constant, so (−1·10 + 1·10) etc. sums to 0. Gx = 0.</p>
                <p>Gy = −1·10 −2·10 −1·10 + 1·90 + 2·90 + 1·90 = −40 + 360 = 320.</p>
                <p>|G| = √(0² + 320²) = 320.</p>
                <p>θ = atan2(320, 0) = 90°: brightness increases downward.</p>
                <p className="font-semibold text-emerald-700">A horizontal edge, strength 320, gradient pointing down.</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Which pixels survive?"
            question={
              <>
                After non-max suppression, a row of pixels has magnitudes <code>30, 70, 140, 60, 0</code>, all 8-connected in a
                line. With low = 50 and high = 120, which pixels are in the final Canny edge map?
              </>
            }
            solution={
              <>
                <p>Classify: 30 → dropped, 70 → weak, 140 → strong, 60 → weak, 0 → dropped.</p>
                <p>Hysteresis starts at the strong pixel (140) and grows into connected weak neighbours: 70 and 60.</p>
                <p className="font-semibold text-emerald-700">Final edge: the pixels with 70, 140 and 60.</p>
                <p>If the 140 were 110 instead, there would be no strong pixel and the whole run would be dropped.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
