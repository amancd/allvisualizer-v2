'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button, GiscusComments } from '@/components/ui';
import { Play, Pause, RotateCcw } from 'lucide-react';

type FunctionType = 'sin' | 'cos' | 'tan' | 'all';

export default function TrigFunctionsVisualizer() {
  const [selectedFunction, setSelectedFunction] = useState<FunctionType>('sin');
  const [amplitude, setAmplitude] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [phaseShift, setPhaseShift] = useState(0);
  const [verticalShift, setVerticalShift] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showUnitCircle, setShowUnitCircle] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circleCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Animation loop
  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setAnimationPhase((prev) => (prev + 0.02) % (2 * Math.PI));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Draw function graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const scale = 50; // pixels per unit

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      
      // Vertical grid lines (every π/2)
      for (let x = 0; x < width; x += scale * Math.PI / 2) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Draw y-axis at x=0 if visible
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis labels (in terms of π)
    const labels = ['0', 'π/2', 'π', '3π/2', '2π', '5π/2', '3π', '7π/2', '4π'];
    for (let i = 0; i < labels.length; i++) {
      const x = i * scale * Math.PI / 2;
      if (x < width) {
        ctx.fillText(labels[i], x, centerY + 15);
      }
    }

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = -3; i <= 3; i++) {
      if (i !== 0) {
        const y = centerY - i * scale;
        if (y > 0 && y < height) {
          ctx.fillText(i.toString(), 20, y + 5);
        }
      }
    }

    // Function to calculate y value
    const calcFunction = (x: number, type: 'sin' | 'cos' | 'tan') => {
      const arg = frequency * x - phaseShift;
      let y = 0;
      
      switch (type) {
        case 'sin':
          y = amplitude * Math.sin(arg) + verticalShift;
          break;
        case 'cos':
          y = amplitude * Math.cos(arg) + verticalShift;
          break;
        case 'tan':
          y = amplitude * Math.tan(arg) + verticalShift;
          break;
      }
      
      return y;
    };

    // Draw function(s)
    const drawFunction = (type: 'sin' | 'cos' | 'tan', color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      let isFirstPoint = true;
      for (let pixelX = 0; pixelX < width; pixelX += 2) {
        const x = pixelX / scale;
        const y = calcFunction(x, type);
        
        // Skip if value is too large (for tan) or NaN
        if (!isFinite(y) || Math.abs(y) > 10) {
          isFirstPoint = true;
          continue;
        }
        
        const canvasY = centerY - y * scale;
        
        if (isFirstPoint) {
          ctx.moveTo(pixelX, canvasY);
          isFirstPoint = false;
        } else {
          ctx.lineTo(pixelX, canvasY);
        }
      }
      
      ctx.stroke();
    };

    // Draw based on selected function
    if (selectedFunction === 'all') {
      drawFunction('sin', '#ef4444'); // red
      drawFunction('cos', '#3b82f6'); // blue
      drawFunction('tan', '#10b981'); // green
    } else {
      const colors = {
        sin: '#ef4444',
        cos: '#3b82f6',
        tan: '#10b981'
      };
      drawFunction(selectedFunction, colors[selectedFunction]);
    }

    // Draw animation marker if animating
    if (isAnimating) {
      const markerX = (animationPhase / (2 * Math.PI)) * (4 * Math.PI * scale);
      if (markerX < width && selectedFunction !== 'all') {
        const markerY = calcFunction(animationPhase, selectedFunction);
        if (isFinite(markerY) && Math.abs(markerY) < 10) {
          const canvasY = centerY - markerY * scale;
          
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(markerX, canvasY, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    }

    // Draw legend
    if (selectedFunction === 'all') {
      const legendItems = [
        { color: '#ef4444', text: 'sin(x)' },
        { color: '#3b82f6', text: 'cos(x)' },
        { color: '#10b981', text: 'tan(x)' },
      ];

      legendItems.forEach((item, i) => {
        ctx.fillStyle = item.color;
        ctx.fillRect(width - 100, 20 + i * 25, 20, 3);
        ctx.fillStyle = '#000000';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(item.text, width - 75, 25 + i * 25);
      });
    }

  }, [selectedFunction, amplitude, frequency, phaseShift, verticalShift, showGrid, animationPhase, isAnimating]);

  // Draw unit circle
  useEffect(() => {
    if (!showUnitCircle) return;
    
    const canvas = circleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw unit circle
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Calculate current angle
    const angle = animationPhase;
    const pointX = centerX + radius * Math.cos(angle);
    const pointY = centerY - radius * Math.sin(angle);

    // Draw radius line
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointX, pointY);
    ctx.stroke();

    // Draw sine line (vertical)
    if (selectedFunction === 'sin' || selectedFunction === 'all') {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pointX, pointY);
      ctx.lineTo(pointX, centerY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw cosine line (horizontal)
    if (selectedFunction === 'cos' || selectedFunction === 'all') {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(pointX, centerY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw point
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(pointX, pointY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw angle arc
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, -angle, true);
    ctx.stroke();

  }, [animationPhase, selectedFunction, showUnitCircle]);

  const resetParameters = () => {
    setAmplitude(1);
    setFrequency(1);
    setPhaseShift(0);
    setVerticalShift(0);
    setAnimationPhase(0);
  };

  // Format equation
  const getEquation = () => {
    const a = amplitude === 1 ? '' : amplitude === -1 ? '-' : amplitude.toFixed(1);
    const b = frequency === 1 ? '' : frequency.toFixed(1);
    const c = phaseShift === 0 ? '' : ` - ${phaseShift.toFixed(2)}`;
    const d = verticalShift === 0 ? '' : verticalShift > 0 ? ` + ${verticalShift.toFixed(1)}` : ` - ${Math.abs(verticalShift).toFixed(1)}`;
    
    const func = selectedFunction === 'all' ? 'f' : selectedFunction;
    const xPart = b ? `${b}x` : 'x';
    
    return `y = ${a}${func}(${xPart}${c})${d}`;
  };

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
              <Link href="/math-visualizer" className="hover:text-gray-900">
                Math
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/math-visualizer/trigonometry" className="hover:text-gray-900">
                Trigonometry
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Trig Functions</li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trigonometric Functions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explore sine, cosine, and tangent functions interactively. Adjust amplitude, frequency, phase shift, and vertical shift to see how they transform the graphs.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Function Selection */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Function
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'sin' as FunctionType, name: 'Sine', color: 'bg-red-500' },
                    { id: 'cos' as FunctionType, name: 'Cosine', color: 'bg-blue-500' },
                    { id: 'tan' as FunctionType, name: 'Tangent', color: 'bg-green-500' },
                    { id: 'all' as FunctionType, name: 'All Three', color: 'bg-gray-500' },
                  ].map((func) => (
                    <button
                      key={func.id}
                      onClick={() => setSelectedFunction(func.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        selectedFunction === func.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${func.color}`} />
                      <span className="font-medium text-gray-900">{func.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameters */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Parameters
                </h3>
                <div className="space-y-4">
                  {/* Amplitude */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amplitude (A): {amplitude.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.1"
                      value={amplitude}
                      onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency (B): {frequency.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={frequency}
                      onChange={(e) => setFrequency(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Phase Shift */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phase Shift (C): {phaseShift.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="-6.28"
                      max="6.28"
                      step="0.1"
                      value={phaseShift}
                      onChange={(e) => setPhaseShift(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Vertical Shift */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vertical Shift (D): {verticalShift.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.1"
                      value={verticalShift}
                      onChange={(e) => setVerticalShift(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Controls
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => setIsAnimating(!isAnimating)}
                    variant={isAnimating ? 'primary' : 'outline'}
                    className="w-full"
                    leftIcon={isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  >
                    {isAnimating ? 'Pause' : 'Animate'}
                  </Button>
                  <Button
                    onClick={resetParameters}
                    variant="ghost"
                    className="w-full"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* Display Options */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Display
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGrid}
                      onChange={(e) => setShowGrid(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Show grid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showUnitCircle}
                      onChange={(e) => setShowUnitCircle(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Show unit circle</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Visualization */}
            <div className="lg:col-span-3 space-y-6">
              {/* Equation Display */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-8">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Equation</h3>
                <div className="text-4xl font-bold text-gray-900 font-mono mb-6">
                  {getEquation()}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Amplitude</div>
                    <div className="text-lg font-bold text-gray-900">{Math.abs(amplitude).toFixed(1)}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Period</div>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedFunction === 'tan' 
                        ? `π/${frequency.toFixed(1)}`
                        : `2π/${frequency.toFixed(1)}`
                      }
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Phase Shift</div>
                    <div className="text-lg font-bold text-gray-900">{phaseShift.toFixed(2)}</div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Vertical Shift</div>
                    <div className="text-lg font-bold text-gray-900">{verticalShift.toFixed(1)}</div>
                  </div>
                </div>
              </div>

              {/* Function Graph */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Graph
                </h3>
                <div className="overflow-x-auto">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={400}
                    className="border border-gray-300 rounded-lg w-full"
                  />
                </div>
              </div>

              {/* Unit Circle */}
              {showUnitCircle && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Unit Circle Connection
                  </h3>
                  <div className="flex justify-center">
                    <canvas
                      ref={circleCanvasRef}
                      width={300}
                      height={300}
                      className="border border-gray-300 rounded-lg"
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-4">
                    The angle rotates as the function progresses through its period
                  </p>
                </div>
              )}

              {/* Key Properties */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Properties
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-700 mb-1">Amplitude</div>
                    <div className="text-xl font-bold text-gray-900">{Math.abs(amplitude).toFixed(1)}</div>
                    <div className="text-xs text-gray-600 mt-1">Max distance from midline</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-700 mb-1">Period</div>
                    <div className="text-xl font-bold text-gray-900">
                      {selectedFunction === 'tan' 
                        ? `π/${frequency.toFixed(1)}`
                        : `2π/${frequency.toFixed(1)}`
                      }
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Length of one complete cycle</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-700 mb-1">Phase Shift</div>
                    <div className="text-xl font-bold text-gray-900">{phaseShift.toFixed(2)}</div>
                    <div className="text-xs text-gray-600 mt-1">Horizontal translation</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-700 mb-1">Vertical Shift</div>
                    <div className="text-xl font-bold text-gray-900">{verticalShift.toFixed(1)}</div>
                    <div className="text-xs text-gray-600 mt-1">Midline position</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theory Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Understanding Trigonometric Functions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                General Form
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-3">
                <code className="text-lg font-mono text-gray-900">
                  y = A·f(Bx - C) + D
                </code>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><strong>A (Amplitude):</strong> Vertical stretch/compression. |A| is the max distance from midline.</li>
                <li><strong>B (Frequency):</strong> Horizontal compression. Period = 2π/B for sin/cos, π/B for tan.</li>
                <li><strong>C (Phase Shift):</strong> Horizontal shift. Positive C shifts right by C/B units.</li>
                <li><strong>D (Vertical Shift):</strong> Moves the midline up/down by D units.</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Function Characteristics
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-semibold text-red-600 mb-1">Sine (sin x)</div>
                  <p className="text-gray-600">Domain: All reals | Range: [-1, 1]<br/>
                  Period: 2π | Starts at (0, 0)</p>
                </div>
                <div>
                  <div className="font-semibold text-blue-600 mb-1">Cosine (cos x)</div>
                  <p className="text-gray-600">Domain: All reals | Range: [-1, 1]<br/>
                  Period: 2π | Starts at (0, 1)</p>
                </div>
                <div>
                  <div className="font-semibold text-green-600 mb-1">Tangent (tan x)</div>
                  <p className="text-gray-600">Domain: x ≠ π/2 + nπ | Range: All reals<br/>
                  Period: π | Has vertical asymptotes</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Amplitude & Period
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                <strong>Amplitude</strong> measures the height of the wave. For y = A·sin(x), the function oscillates between -A and A.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                <strong>Period</strong> is the horizontal length of one complete cycle. Increasing frequency B makes the function oscillate faster (shorter period).
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Phase Shift & Vertical Shift
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                <strong>Phase shift</strong> moves the graph left or right. In y = sin(Bx - C), the shift is C/B to the right.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                <strong>Vertical shift</strong> D moves the entire graph up or down, changing the midline from y = 0 to y = D.
              </p>
            </div>
          </div>

          {/* Applications */}
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Real-World Applications
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Sound Waves</h4>
                <p className="text-sm text-gray-600">
                  Sound is modeled as sine waves. Amplitude represents volume, frequency determines pitch. Musical notes are specific frequencies.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">AC Electricity</h4>
                <p className="text-sm text-gray-600">
                  Alternating current follows a sinusoidal pattern. Voltage oscillates at 60 Hz (US) or 50 Hz (most other countries).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tides & Seasons</h4>
                <p className="text-sm text-gray-600">
                  Ocean tides and daylight hours vary sinusoidally. The period for tides is about 12.4 hours, for seasons it's one year.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Spring Motion</h4>
                <p className="text-sm text-gray-600">
                  A mass on a spring oscillates sinusoidally. The frequency depends on spring constant and mass (Hooke's Law).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Radio Waves</h4>
                <p className="text-sm text-gray-600">
                  Radio and light are electromagnetic waves modeled by sine functions. Different frequencies create different types of radiation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Biorhythms</h4>
                <p className="text-sm text-gray-600">
                  Many biological processes are periodic: heartbeat, breathing, circadian rhythms, and hormone cycles.
                </p>
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
