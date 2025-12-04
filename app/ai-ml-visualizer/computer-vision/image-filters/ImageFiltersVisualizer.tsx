'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button, GiscusComments } from '@/components/ui';
import { Upload, RotateCcw, Download } from 'lucide-react';

type FilterType = 'none' | 'blur' | 'sharpen' | 'edge-sobel' | 'edge-laplacian' | 'emboss' | 'custom';

interface Kernel {
  matrix: number[][];
  divisor: number;
}

const KERNELS: Record<FilterType, Kernel | null> = {
  none: null,
  blur: {
    matrix: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ],
    divisor: 16
  },
  sharpen: {
    matrix: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ],
    divisor: 1
  },
  'edge-sobel': {
    matrix: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ],
    divisor: 1
  },
  'edge-laplacian': {
    matrix: [
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0]
    ],
    divisor: 1
  },
  emboss: {
    matrix: [
      [-2, -1, 0],
      [-1, 1, 1],
      [0, 1, 2]
    ],
    divisor: 1
  },
  custom: {
    matrix: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ],
    divisor: 1
  }
};

export default function ImageFiltersVisualizer() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [customKernel, setCustomKernel] = useState<number[][]>([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
  ]);
  const [customDivisor, setCustomDivisor] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load default image
  useEffect(() => {
    loadDefaultImage();
  }, []);

  // Apply filter when selection changes
  useEffect(() => {
    if (imageLoaded) {
      applyFilter();
    }
  }, [selectedFilter, customKernel, customDivisor, imageLoaded]);

  const loadDefaultImage = () => {
    const canvas = sourceCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a gradient pattern as default
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f093fb');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);

    // Add some shapes for visual interest
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(100, 100, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(250, 150, 100, 80);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(150, 200);
    ctx.lineTo(250, 270);
    ctx.stroke();

    setImageLoaded(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = sourceCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas to fit image (max 400x300)
        const scale = Math.min(400 / img.width, 300 / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImageLoaded(true);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const applyFilter = () => {
    const sourceCanvas = sourceCanvasRef.current;
    const resultCanvas = resultCanvasRef.current;
    if (!sourceCanvas || !resultCanvas) return;

    const sourceCtx = sourceCanvas.getContext('2d');
    const resultCtx = resultCanvas.getContext('2d');
    if (!sourceCtx || !resultCtx) return;

    setIsProcessing(true);

    // Set result canvas size to match source
    resultCanvas.width = sourceCanvas.width;
    resultCanvas.height = sourceCanvas.height;

    const sourceData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    const resultData = resultCtx.createImageData(sourceCanvas.width, sourceCanvas.height);

    if (selectedFilter === 'none') {
      resultData.data.set(sourceData.data);
    } else {
      const kernel = selectedFilter === 'custom' 
        ? { matrix: customKernel, divisor: customDivisor }
        : KERNELS[selectedFilter];
      
      if (kernel) {
        applyConvolution(sourceData, resultData, kernel);
      }
    }

    resultCtx.putImageData(resultData, 0, 0);
    setIsProcessing(false);
  };

  const applyConvolution = (
    source: ImageData,
    result: ImageData,
    kernel: Kernel
  ) => {
    const { width, height, data: srcData } = source;
    const { data: dstData } = result;
    const { matrix, divisor } = kernel;
    const kernelSize = matrix.length;
    const half = Math.floor(kernelSize / 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0;

        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const pixelY = Math.min(Math.max(y + ky - half, 0), height - 1);
            const pixelX = Math.min(Math.max(x + kx - half, 0), width - 1);
            const idx = (pixelY * width + pixelX) * 4;
            const weight = matrix[ky][kx];

            r += srcData[idx] * weight;
            g += srcData[idx + 1] * weight;
            b += srcData[idx + 2] * weight;
          }
        }

        const dstIdx = (y * width + x) * 4;
        dstData[dstIdx] = Math.min(Math.max(r / divisor, 0), 255);
        dstData[dstIdx + 1] = Math.min(Math.max(g / divisor, 0), 255);
        dstData[dstIdx + 2] = Math.min(Math.max(b / divisor, 0), 255);
        dstData[dstIdx + 3] = 255; // Alpha
      }
    }
  };

  const handleDownload = () => {
    const canvas = resultCanvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `filtered-image-${selectedFilter}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const updateKernelCell = (row: number, col: number, value: string) => {
    const newKernel = customKernel.map((r, i) => 
      i === row ? r.map((c, j) => j === col ? parseFloat(value) || 0 : c) : r
    );
    setCustomKernel(newKernel);
  };

  const filters = [
    { id: 'none' as FilterType, name: 'Original', description: 'No filter applied' },
    { id: 'blur' as FilterType, name: 'Gaussian Blur', description: '3x3 averaging kernel' },
    { id: 'sharpen' as FilterType, name: 'Sharpen', description: 'Enhances edges' },
    { id: 'edge-sobel' as FilterType, name: 'Edge (Sobel)', description: 'Horizontal edge detection' },
    { id: 'edge-laplacian' as FilterType, name: 'Edge (Laplacian)', description: 'All-direction edge detection' },
    { id: 'emboss' as FilterType, name: 'Emboss', description: '3D effect' },
    { id: 'custom' as FilterType, name: 'Custom Kernel', description: 'Design your own filter' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <nav className="pt-24 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/ai-ml-visualizer" className="hover:text-gray-900">
                AI & ML
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/ai-ml-visualizer/computer-vision" className="hover:text-gray-900">
                Computer Vision
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Image Filters</li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Filters & Convolution
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explore how convolution kernels transform images. Apply different filters and see the mathematical operations in action.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Upload Section */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Image Upload
                </h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="space-y-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                    leftIcon={<Upload className="w-4 h-4" />}
                  >
                    Upload Image
                  </Button>
                  <Button
                    onClick={loadDefaultImage}
                    variant="ghost"
                    className="w-full"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>

              {/* Filter Selection */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Filter
                </h3>
                <div className="space-y-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedFilter === filter.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{filter.name}</div>
                      <div className="text-sm text-gray-600">{filter.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Kernel Editor */}
              {selectedFilter === 'custom' && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Custom Kernel
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {customKernel.map((row, i) =>
                        row.map((val, j) => (
                          <input
                            key={`${i}-${j}`}
                            type="number"
                            value={val}
                            onChange={(e) => updateKernelCell(i, j, e.target.value)}
                            className="w-full px-2 py-2 text-center border-2 border-gray-200 rounded focus:border-black focus:outline-none"
                            step="0.1"
                          />
                        ))
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Divisor
                      </label>
                      <input
                        type="number"
                        value={customDivisor}
                        onChange={(e) => setCustomDivisor(parseFloat(e.target.value) || 1)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded focus:border-black focus:outline-none"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas Display */}
            <div className="lg:col-span-2 space-y-6">
              {/* Original Image */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Original Image
                </h3>
                <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                  <canvas
                    ref={sourceCanvasRef}
                    width={400}
                    height={300}
                    className="border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Filtered Result */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filtered Result
                  </h3>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                    disabled={!imageLoaded}
                  >
                    Download
                  </Button>
                </div>
                <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                  <canvas
                    ref={resultCanvasRef}
                    width={400}
                    height={300}
                    className="border border-gray-300 rounded"
                  />
                </div>
                {isProcessing && (
                  <div className="text-center text-sm text-gray-600 mt-2">
                    Processing...
                  </div>
                )}
              </div>

              {/* Kernel Visualization */}
              {selectedFilter !== 'none' && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Convolution Kernel
                  </h3>
                  <div className="space-y-4">
                    <div className="inline-block">
                      <div className="grid grid-cols-3 gap-1 bg-gray-100 p-2 rounded">
                        {(selectedFilter === 'custom' ? customKernel : KERNELS[selectedFilter]?.matrix || []).map((row, i) =>
                          row.map((val, j) => (
                            <div
                              key={`${i}-${j}`}
                              className="w-16 h-16 flex items-center justify-center bg-white border-2 border-gray-300 rounded font-mono text-sm font-semibold"
                            >
                              {val}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-600">
                        Divisor: {selectedFilter === 'custom' ? customDivisor : KERNELS[selectedFilter]?.divisor}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      This 3×3 kernel slides across the image, multiplying each pixel with its neighbors and summing the results.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Theory Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            How Convolution Works
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Sliding Window
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The kernel moves across the image pixel by pixel. At each position, it multiplies the kernel values with the corresponding pixel values and sums them up.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Normalization
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The divisor normalizes the result to keep pixel values in the valid range (0-255). For blur kernels, this prevents the image from becoming too bright.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Edge Detection
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Kernels like Sobel and Laplacian detect edges by finding areas with high pixel intensity changes. Positive and negative values highlight different edge directions.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                CNN Foundation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Convolutional Neural Networks learn optimal kernels automatically. Understanding manual filters helps grasp how CNNs extract features from images.
              </p>
            </div>
          </div>

          {/* Mathematical Foundation */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Mathematical Foundation
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Convolution Operation
                </h4>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  For a 3×3 kernel <strong>K</strong> applied to an image <strong>I</strong>, the output pixel value at position (x, y) is computed as:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 overflow-x-auto">
                  <code className="text-sm font-mono">
                    Output(x, y) = Σ Σ I(x+i-1, y+j-1) × K(i, j) / divisor
                    <br />
                    <span className="text-gray-500">where i, j ∈ {`{0, 1, 2}`}</span>
                  </code>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Example: Gaussian Blur
                </h4>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  The Gaussian blur kernel approximates a 2D Gaussian distribution, giving more weight to the center pixel:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <pre className="text-sm font-mono">
{`┌         ┐
│ 1  2  1 │
│ 2  4  2 │  ÷ 16
│ 1  2  1 │
└         ┘`}
                  </pre>
                  <p className="text-gray-600 text-sm mt-4">
                    Sum of weights = 16, so we divide by 16 to maintain brightness. The center pixel has weight 4/16 = 0.25, corners have 1/16 = 0.0625.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Example: Sobel Edge Detection
                </h4>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Sobel kernels detect edges by computing intensity gradients. Two kernels detect horizontal and vertical edges:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Horizontal (Gx)</p>
                    <pre className="text-sm font-mono">
{`┌          ┐
│ -1  0  1 │
│ -2  0  2 │
│ -1  0  1 │
└          ┘`}
                    </pre>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Vertical (Gy)</p>
                    <pre className="text-sm font-mono">
{`┌           ┐
│ -1 -2 -1 │
│  0  0  0 │
│  1  2  1 │
└           ┘`}
                    </pre>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-4">
                  Gradient magnitude: G = √(Gx² + Gy²) | Gradient direction: θ = arctan(Gy / Gx)
                </p>
              </div>
            </div>
          </div>

          {/* Filter Types Deep Dive */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Filter Types Explained
            </h3>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                1. Smoothing Filters (Low-Pass)
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    <strong>Purpose:</strong> Reduce noise and detail by averaging neighboring pixels. Called "low-pass" because they allow low-frequency components (smooth areas) to pass while blocking high frequencies (edges, noise).
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                      <strong>Use Cases:</strong> Preprocessing for edge detection, removing sensor noise, creating depth-of-field effects, reducing compression artifacts.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Box Blur (Simple Average)</p>
                    <pre className="text-xs font-mono mb-2">
{`┌         ┐
│ 1  1  1 │
│ 1  1  1 │  ÷ 9
│ 1  1  1 │
└         ┘`}
                    </pre>
                    <p className="text-xs text-gray-600">Equal weights - fast but less natural</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Gaussian Blur</p>
                    <pre className="text-xs font-mono mb-2">
{`┌         ┐
│ 1  2  1 │
│ 2  4  2 │  ÷ 16
│ 1  2  1 │
└         ┘`}
                    </pre>
                    <p className="text-xs text-gray-600">Weighted by distance - more natural</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                2. Sharpening Filters (High-Pass)
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    <strong>Purpose:</strong> Enhance edges and fine details by amplifying high-frequency components. Works by adding a scaled version of the Laplacian (second derivative) to the original image.
                  </p>
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <p className="text-sm text-gray-700">
                      <strong>Use Cases:</strong> Enhancing blurry photos, improving OCR accuracy, preparing images for printing, emphasizing textures.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Standard Sharpen</p>
                  <pre className="text-xs font-mono mb-2">
{`┌           ┐
│  0  -1  0 │
│ -1   5 -1 │  ÷ 1
│  0  -1  0 │
└           ┘`}
                  </pre>
                  <p className="text-xs text-gray-600 mb-3">Center: 5 (original + enhancement), Neighbors: -1 (subtract surrounding blur)</p>
                  <p className="text-xs text-gray-600">
                    <strong>Formula:</strong> Sharpened = Original + α × (Original - Blurred)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                3. Edge Detection Filters
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    <strong>Purpose:</strong> Identify boundaries between regions by detecting rapid intensity changes. Essential for object recognition, image segmentation, and feature extraction.
                  </p>
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Use Cases:</strong> Object detection preprocessing, lane detection in autonomous vehicles, medical image analysis, QR code scanning.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Sobel X</p>
                    <pre className="text-xs font-mono mb-2">
{`┌          ┐
│ -1  0  1 │
│ -2  0  2 │
│ -1  0  1 │
└          ┘`}
                    </pre>
                    <p className="text-xs text-gray-600">Vertical edges (left-right gradient)</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Laplacian</p>
                    <pre className="text-xs font-mono mb-2">
{`┌           ┐
│  0  -1  0 │
│ -1   4 -1 │
│  0  -1  0 │
└           ┘`}
                    </pre>
                    <p className="text-xs text-gray-600">All directions (2nd derivative)</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Prewitt</p>
                    <pre className="text-xs font-mono mb-2">
{`┌          ┐
│ -1  0  1 │
│ -1  0  1 │
│ -1  0  1 │
└          ┘`}
                    </pre>
                    <p className="text-xs text-gray-600">Similar to Sobel, equal weights</p>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Why Sobel uses [-2, 0, 2]?</p>
                  <p className="text-xs text-gray-600">
                    The center row has double weight because it's directly aligned with the edge direction. This provides better noise suppression while maintaining edge detection accuracy - it's essentially a combination of gradient and smoothing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                4. Emboss Filter
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    <strong>Purpose:</strong> Creates a 3D raised relief effect by emphasizing edges in a specific direction. Simulates light coming from one corner.
                  </p>
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Use Cases:</strong> Artistic effects, watermarking, texture analysis, visualizing surface topology.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Emboss Kernel</p>
                  <pre className="text-xs font-mono mb-2">
{`┌           ┐
│ -2  -1  0 │
│ -1   1  1 │
│  0   1  2 │
└           ┘`}
                  </pre>
                  <p className="text-xs text-gray-600 mb-2">Light from bottom-right, shadows top-left</p>
                  <p className="text-xs text-gray-700">
                    <strong>How it works:</strong> Negative values on one side, positive on the opposite. The difference creates the illusion of depth. Often combined with a gray offset (128) to center values.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                5. Advanced Concepts
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-md font-semibold text-gray-900 mb-2">Separable Filters</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    Some 2D kernels can be decomposed into two 1D kernels (row and column), making them much faster to compute.
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                    Gaussian 3×3 = [1,2,1]ᵀ × [1,2,1]
                    <br />
                    <span className="text-gray-500">Complexity: O(N²M²) → O(2NM)</span>
                  </div>
                </div>
                <div>
                  <h5 className="text-md font-semibold text-gray-900 mb-2">Padding Strategies</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    How to handle edges where the kernel extends beyond the image:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                    <li><strong>Zero padding:</strong> Assume 0 outside image</li>
                    <li><strong>Replicate:</strong> Repeat edge pixels</li>
                    <li><strong>Reflect:</strong> Mirror the image</li>
                    <li><strong>Wrap:</strong> Tile the image</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-md font-semibold text-gray-900 mb-2">Kernel Size Trade-offs</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    Larger kernels (5×5, 7×7) provide:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>✅ Stronger effects (more blur, better noise reduction)</li>
                    <li>✅ Wider context for feature detection</li>
                    <li>❌ Higher computational cost (O(K²) per pixel)</li>
                    <li>❌ More edge shrinkage</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-md font-semibold text-gray-900 mb-2">In CNNs</h5>
                  <p className="text-sm text-gray-600 mb-2">
                    Deep learning networks learn kernel values through backpropagation:
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Early layers: Edge/texture detectors (like manual filters)</li>
                    <li>• Middle layers: Shape/pattern detectors</li>
                    <li>• Deep layers: High-level features (faces, objects)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comments */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Discussion
          </h2>
          <GiscusComments />
        </div>
      </section>
    </div>
  );
}
