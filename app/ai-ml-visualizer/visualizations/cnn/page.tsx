import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  CodeTabs,
  ContentSection,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
  Tag,
  type CardGridItem,
} from '@/components/content';
import CnnVisualizer from './CnnVisualizer';

export const metadata: Metadata = {
  title: 'Convolutional Neural Networks Visualizer - AI/ML | AllVisualizer',
  description:
    'Paint an image, slide a 3×3 kernel across it with stride and padding, and watch the feature map, ReLU and max pooling fill in. See how a small CNN shrinks space and grows channels.',
  keywords: ['CNN', 'convolutional neural network', 'convolution', 'kernel', 'feature map', 'stride', 'padding', 'max pooling', 'deep learning'],
};

const tags = ['Convolution', 'Feature Maps', 'Pooling', 'Stride & Padding'];

const concepts: CardGridItem[] = [
  {
    title: 'Kernel (filter)',
    description: 'A small grid of learned weights. The same kernel is reused at every position, so a CNN has far fewer weights than a fully connected layer on the same image.',
  },
  {
    title: 'Feature map',
    description: 'The grid of kernel responses. A high value means the patch under the kernel looks like the pattern the kernel encodes.',
  },
  {
    title: 'Stride and padding',
    description: 'Stride is how far the kernel jumps between positions. Padding adds a border of zeros so edges get covered and the output can stay the same size.',
  },
  {
    title: 'Pooling',
    description: 'Max pooling keeps the strongest response in each 2×2 block. It halves the width and height and makes the network less sensitive to small shifts.',
  },
  {
    title: 'Channels',
    description: 'Each filter in a layer produces its own feature map. The next layer’s kernels span all of those maps, so they combine edges into corners, textures and shapes.',
  },
  {
    title: 'Receptive field',
    description: 'Every conv and pool layer widens the patch of the original image that one deep unit can see, which is how depth builds up from edges to objects.',
  },
];

const pythonCode = `import numpy as np

def conv2d(x, k, stride=1, pad=0):
    """Single-channel 2D convolution (cross-correlation, as in deep learning)."""
    x = np.pad(x, pad)                       # zero padding
    K = k.shape[0]
    out = (x.shape[0] - K) // stride + 1     # = (W - K + 2P) // S + 1
    y = np.zeros((out, out))
    for i in range(out):
        for j in range(out):
            patch = x[i*stride:i*stride+K, j*stride:j*stride+K]
            y[i, j] = np.sum(patch * k)      # element-wise multiply, then sum
    return y

def max_pool(y, size=2):
    n = y.shape[0] // size
    return y[:n*size, :n*size].reshape(n, size, n, size).max(axis=(1, 3))

feature = np.maximum(conv2d(image, kernel, stride=1, pad=0), 0)  # ReLU
pooled = max_pool(feature)`;

const pytorchCode = `import torch.nn as nn

# The small CNN from the layer-stack diagram (28×28 grayscale input)
model = nn.Sequential(
    nn.Conv2d(1, 8, kernel_size=3, padding=1),   # 28×28×8
    nn.ReLU(),
    nn.MaxPool2d(2),                             # 14×14×8
    nn.Conv2d(8, 16, kernel_size=3, padding=1),  # 14×14×16
    nn.ReLU(),
    nn.MaxPool2d(2),                             # 7×7×16
    nn.Conv2d(16, 32, kernel_size=3),            # 5×5×32
    nn.ReLU(),
    nn.Flatten(),                                # 800
    nn.Linear(800, 10),                          # 10 class scores
)`;

export default function CnnPage() {
  return (
    <DetailPage
      subject="ai-ml"
      item="cnn"
      meta={tags.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    >
      <CnnVisualizer />

      <ContentSection title="What a convolution layer does">
        <Prose>
          <p>
            A convolutional layer slides a small kernel over the image. At each position it multiplies the kernel weights
            with the pixels underneath, adds them up, and writes that single number into the <strong>feature map</strong>.
            Because the same weights are used everywhere, a kernel that detects a vertical edge finds it anywhere in the
            image.
          </p>
          <p>
            After the convolution, a <strong>ReLU</strong> zeroes out negative responses and a <strong>max-pooling</strong>{' '}
            layer shrinks the map by keeping the largest value in each 2×2 block. Real networks learn dozens of kernels per
            layer and stack several layers, so early layers respond to edges and later layers to whole shapes.
          </p>
          <p>
            The kernels in this visualizer are hand-picked classics (edge detectors, blur, sharpen) so you can predict what
            they do. In a trained CNN the values are learned by backpropagation and are rarely this tidy.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Output size">
            <Formula
              where={[
                { symbol: 'W', meaning: 'input width (or height)' },
                { symbol: 'K', meaning: 'kernel size' },
                { symbol: 'P', meaning: 'padding added on each side' },
                { symbol: 'S', meaning: 'stride' },
              ]}
            >
              O = ⌊(W − K + 2P) / S⌋ + 1
            </Formula>
          </Callout>
          <Callout tone="formula" title="One feature-map value">
            <Formula>
              y[i, j] = Σ<sub>a</sub> Σ<sub>b</sub> k[a, b] · x[i·S + a, j·S + b] + bias
            </Formula>
          </Callout>
          <Callout tone="formula" title="Parameters in a conv layer">
            <Formula
              where={[
                { symbol: 'C_in', meaning: 'input channels' },
                { symbol: 'C_out', meaning: 'number of filters (output channels)' },
              ]}
            >
              params = (K · K · C<sub>in</sub> + 1) · C<sub>out</sub>
            </Formula>
          </Callout>
          <Callout tone="note">
            Deep learning libraries actually compute cross-correlation (the kernel is not flipped). Since the kernel is
            learned, the difference does not matter, and this page follows the same convention.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick an input pattern or paint your own by clicking and dragging on the 8×8 grid.',
            'Choose a kernel preset or type weights into the 3×3 kernel. Try the vertical and horizontal edge detectors on the same image.',
            'Press Play or Step to slide the kernel. The panel under the kernel shows each pixel × weight product and their sum for the current position.',
            'Switch padding between 0 and 1 and stride between 1 and 2, and watch the output-size formula and the feature map change shape.',
            'Press Finish to complete the scan, then compare the ReLU output with the 2×2 max-pooled result.',
            'Scroll to the layer-stack diagram to see how these operations shape a full (small) CNN.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Key concepts">
        <CardGrid items={concepts} columns={3} />
      </ContentSection>

      <ContentSection title="Code">
        <CodeTabs
          samples={[
            { label: 'NumPy', language: 'python', code: pythonCode },
            { label: 'PyTorch', language: 'python', code: pytorchCode },
          ]}
        />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Output sizes"
            question="A 32×32 image goes through a 5×5 convolution with padding 2. What is the output size with stride 1? With stride 2?"
            solution={
              <>
                <p>Stride 1: O = ⌊(32 − 5 + 2·2) / 1⌋ + 1 = 31 + 1 = 32</p>
                <p>Stride 2: O = ⌊(32 − 5 + 2·2) / 2⌋ + 1 = ⌊31 / 2⌋ + 1 = 15 + 1 = 16</p>
                <p className="font-semibold text-emerald-700">32×32 with stride 1 (a &quot;same&quot; convolution), 16×16 with stride 2</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Shapes and parameters"
            question="A 64×64 RGB image (3 channels) passes through a conv layer with 16 filters of size 3×3, padding 1, stride 1, followed by 2×2 max pooling. What is the output shape after each step, and how many parameters does the conv layer have?"
            solution={
              <>
                <p>Conv: O = ⌊(64 − 3 + 2) / 1⌋ + 1 = 64, one map per filter → 64×64×16</p>
                <p>Pool 2×2, stride 2: 64 / 2 = 32 → 32×32×16</p>
                <p>Each filter spans all 3 input channels: 3·3·3 = 27 weights + 1 bias = 28</p>
                <p>params = 28 · 16 = 448 (pooling has none)</p>
                <p className="font-semibold text-emerald-700">64×64×16, then 32×32×16; 448 parameters</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
