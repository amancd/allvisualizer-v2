'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { responsiveSurface } from '@/lib/visualization';

export default function UnitCircleVisualizer() {
  const [angle, setAngle] = useState(0); // in radians
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSpecialAngles, setShowSpecialAngles] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [showAllFunctions, setShowAllFunctions] = useState(false);
  const [angleMode, setAngleMode] = useState<'radians' | 'degrees'>('radians');
  const [speed, setSpeed] = useState(1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Convert radians to degrees
  const radToDeg = (rad: number) => (rad * 180 / Math.PI) % 360;
  
  // Convert degrees to radians
  const degToRad = (deg: number) => (deg * Math.PI / 180);

  // Calculate trig values
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  const tan = Math.abs(cos) > 0.001 ? sin / cos : Infinity;
  const csc = Math.abs(sin) > 0.001 ? 1 / sin : Infinity;
  const sec = Math.abs(cos) > 0.001 ? 1 / cos : Infinity;
  const cot = Math.abs(sin) > 0.001 ? cos / sin : Infinity;

  // Format number for display
  const formatNumber = (num: number): string => {
    if (!isFinite(num)) return '∞';
    if (Math.abs(num) < 0.0001) return '0';
    return num.toFixed(4);
  };

  // Special angles data
  const specialAngles = [
    { rad: 0, deg: 0, label: '0' },
    { rad: Math.PI / 6, deg: 30, label: 'π/6' },
    { rad: Math.PI / 4, deg: 45, label: 'π/4' },
    { rad: Math.PI / 3, deg: 60, label: 'π/3' },
    { rad: Math.PI / 2, deg: 90, label: 'π/2' },
    { rad: 2 * Math.PI / 3, deg: 120, label: '2π/3' },
    { rad: 3 * Math.PI / 4, deg: 135, label: '3π/4' },
    { rad: 5 * Math.PI / 6, deg: 150, label: '5π/6' },
    { rad: Math.PI, deg: 180, label: 'π' },
    { rad: 7 * Math.PI / 6, deg: 210, label: '7π/6' },
    { rad: 5 * Math.PI / 4, deg: 225, label: '5π/4' },
    { rad: 4 * Math.PI / 3, deg: 240, label: '4π/3' },
    { rad: 3 * Math.PI / 2, deg: 270, label: '3π/2' },
    { rad: 5 * Math.PI / 3, deg: 300, label: '5π/3' },
    { rad: 7 * Math.PI / 4, deg: 315, label: '7π/4' },
    { rad: 11 * Math.PI / 6, deg: 330, label: '11π/6' },
  ];

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setAngle((prev) => (prev + 0.01 * speed) % (2 * Math.PI));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  // Draw unit circle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    for (let i = -10; i <= 10; i++) {
      const x = centerX + i * radius / 2;
      const y = centerY + i * radius / 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#000000';
    ctx.font = '22px sans-serif';
    ctx.fillText('x', width - 24, centerY - 16);
    ctx.fillText('y', centerX + 12, 24);

    // Draw unit circle
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw special angles if enabled
    if (showSpecialAngles) {
      specialAngles.forEach(({ rad, label }) => {
        const x = centerX + radius * Math.cos(rad);
        const y = centerY - radius * Math.sin(rad);
        
        // Dot
        ctx.fillStyle = '#9ca3af';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();

        // Label
        ctx.fillStyle = '#6b7280';
        ctx.font = '20px sans-serif';
        const labelX = centerX + (radius + 30) * Math.cos(rad);
        const labelY = centerY - (radius + 30) * Math.sin(rad);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, labelX, labelY);
      });
    }

    // Calculate point on circle
    const pointX = centerX + radius * cos;
    const pointY = centerY - radius * sin; // Negative because canvas y is inverted

    // Draw angle arc
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, -angle, true);
    ctx.stroke();

    // Draw radius line to point
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointX, pointY);
    ctx.stroke();

    // Draw sine (vertical line from point to x-axis)
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(pointX, centerY);
    ctx.stroke();
    
    // Draw cosine (horizontal line from point to y-axis)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointX, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw tangent line if visible
    if (Math.abs(cos) > 0.01) {
      const tangentX = centerX + radius;
      const tangentY = centerY - radius * tan;
      if (Math.abs(tangentY - centerY) < height / 2) {
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(tangentX, centerY);
        ctx.lineTo(tangentX, tangentY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw point on circle
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(pointX, pointY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw coordinates if enabled
    if (showCoordinates) {
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'left';
      const coordText = `(${formatNumber(cos)}, ${formatNumber(sin)})`;
      const coordWidth = ctx.measureText(coordText).width;
      const coordX = cos < 0 ? pointX - 12 - coordWidth : pointX + 12;
      const coordY = sin < 0 ? pointY + 24 : pointY - 16;
      ctx.fillText(coordText, Math.max(8, Math.min(width - 8 - coordWidth, coordX)), coordY);
    }

    // Draw legend
    const legendX = 20;
    const legendY = 16;
    const legendItems = [
      { color: '#ef4444', text: 'Radius' },
      { color: '#f59e0b', text: 'cos θ' },
      { color: '#8b5cf6', text: 'sin θ' },
      { color: '#ec4899', text: 'tan θ' },
      { color: '#10b981', text: 'Angle' },
    ];

    legendItems.forEach((item, i) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, legendY + i * 24, 20, 4);
      ctx.fillStyle = '#000000';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.text, legendX + 26, legendY + i * 24 + 3);
    });

  }, [angle, cos, sin, tan, showSpecialAngles, showCoordinates]);

  const handleAngleChange = (value: number) => {
    if (angleMode === 'degrees') {
      setAngle(degToRad(value));
    } else {
      setAngle(value);
    }
  };

  const displayAngle = angleMode === 'degrees' ? radToDeg(angle) : angle;
  const maxAngle = angleMode === 'degrees' ? 360 : 2 * Math.PI;
  const step = angleMode === 'degrees' ? 1 : 0.01;

  return (
    <div className="space-y-12">
      <section>
        <div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Playback Controls */}
              <div className="bg-white border border-line rounded-card p-4 sm:p-6 shadow-card">
                <h3 className="text-lg font-semibold text-ink mb-4">
                  Controls
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsPlaying(!isPlaying)}
                      variant={isPlaying ? 'primary' : 'outline'}
                      className="flex-1"
                      leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button
                      onClick={() => setAngle(0)}
                      variant="ghost"
                      leftIcon={<RotateCcw className="w-4 h-4" />}
                    >
                      Reset
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animation Speed
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-ink-muted text-center mt-1">
                      {speed.toFixed(1)}x
                    </div>
                  </div>
                </div>
              </div>

              {/* Angle Input */}
              <div className="bg-white border border-line rounded-card p-4 sm:p-6 shadow-card">
                <h3 className="text-lg font-semibold text-ink mb-4">
                  Angle
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAngleMode('radians')}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        angleMode === 'radians'
                          ? 'border-black bg-brand-600 text-white shadow-brand'
                          : 'border-line text-gray-700 hover:border-line-strong'
                      }`}
                    >
                      Radians
                    </button>
                    <button
                      onClick={() => setAngleMode('degrees')}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        angleMode === 'degrees'
                          ? 'border-black bg-brand-600 text-white shadow-brand'
                          : 'border-line text-gray-700 hover:border-line-strong'
                      }`}
                    >
                      Degrees
                    </button>
                  </div>

                  <div>
                    <input
                      type="range"
                      min="0"
                      max={maxAngle}
                      step={step}
                      value={displayAngle}
                      onChange={(e) => handleAngleChange(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-center mt-2">
                      <span className="text-2xl font-bold text-ink">
                        {angleMode === 'degrees' 
                          ? `${displayAngle.toFixed(1)}°`
                          : `${displayAngle.toFixed(3)}`
                        }
                      </span>
                      {angleMode === 'radians' && (
                        <span className="text-sm text-ink-muted ml-2">rad</span>
                      )}
                    </div>
                  </div>

                  {/* Quick angle buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {specialAngles.slice(0, 8).map((special) => (
                      <button
                        key={special.rad}
                        onClick={() => setAngle(special.rad)}
                        className="px-2 py-1 text-xs border-2 border-line rounded hover:border-brand-300 transition-all"
                      >
                        {angleMode === 'degrees' ? `${special.deg}°` : special.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Display Options */}
              <div className="bg-white border border-line rounded-card p-4 sm:p-6 shadow-card">
                <h3 className="text-lg font-semibold text-ink mb-4">
                  Display Options
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSpecialAngles}
                      onChange={(e) => setShowSpecialAngles(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Show special angles</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCoordinates}
                      onChange={(e) => setShowCoordinates(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Show coordinates</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAllFunctions}
                      onChange={(e) => setShowAllFunctions(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Show all 6 functions</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Visualization */}
            <div className="lg:col-span-2 space-y-6">
              {/* Canvas */}
              <div className="bg-white border border-line rounded-card p-4 sm:p-6 shadow-card">
                <h3 className="text-lg font-semibold text-ink mb-4">
                  Unit Circle
                </h3>
                <div className="mx-auto max-w-xl">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={600}
                    className={`${responsiveSurface} border border-line-strong rounded-lg`}
                  />
                </div>
              </div>

              {/* Trig Values */}
              <div className="bg-white border border-line rounded-card p-4 sm:p-6 shadow-card">
                <h3 className="text-lg font-semibold text-ink mb-4">
                  Trigonometric Values
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="text-sm font-medium text-orange-900 mb-1">cos θ</div>
                    <div className="text-xl sm:text-2xl font-bold text-orange-700">{formatNumber(cos)}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="text-sm font-medium text-purple-900 mb-1">sin θ</div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-700">{formatNumber(sin)}</div>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                    <div className="text-sm font-medium text-pink-900 mb-1">tan θ</div>
                    <div className="text-xl sm:text-2xl font-bold text-pink-700">{formatNumber(tan)}</div>
                  </div>
                  
                  {showAllFunctions && (
                    <>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-sm font-medium text-blue-900 mb-1">csc θ</div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-700">{formatNumber(csc)}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-sm font-medium text-green-900 mb-1">sec θ</div>
                        <div className="text-xl sm:text-2xl font-bold text-green-700">{formatNumber(sec)}</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <div className="text-sm font-medium text-yellow-900 mb-1">cot θ</div>
                        <div className="text-xl sm:text-2xl font-bold text-yellow-700">{formatNumber(cot)}</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Point coordinates */}
                <div className="mt-4 p-4 bg-subtle rounded-lg border border-line">
                  <div className="text-sm font-medium text-gray-700 mb-2">Point on Unit Circle</div>
                  <div className="text-lg font-mono text-ink">
                    ({formatNumber(cos)}, {formatNumber(sin)})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theory Section */}
      <section className="border-t border-line pt-12">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-8 tracking-tight">
            Understanding the Unit Circle
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-card p-6 border border-line shadow-card">
              <h3 className="text-lg font-semibold text-ink mb-3">
                What is the Unit Circle?
              </h3>
              <p className="text-ink-muted text-sm leading-relaxed mb-3">
                The unit circle is a circle with radius 1 centered at the origin (0, 0). It provides a geometric way to define trigonometric functions for all angles.
              </p>
              <p className="text-ink-muted text-sm leading-relaxed">
                For any angle θ measured from the positive x-axis, the point where the terminal side intersects the circle has coordinates (cos θ, sin θ).
              </p>
            </div>

            <div className="bg-white rounded-card p-6 border border-line shadow-card">
              <h3 className="text-lg font-semibold text-ink mb-3">
                Radians vs Degrees
              </h3>
              <p className="text-ink-muted text-sm leading-relaxed mb-3">
                <strong>Degrees:</strong> Full circle = 360°, based on Babylonian astronomy.
              </p>
              <p className="text-ink-muted text-sm leading-relaxed mb-3">
                <strong>Radians:</strong> Full circle = 2π, based on arc length. One radian is the angle where the arc length equals the radius.
              </p>
              <p className="text-ink-muted text-sm">
                Conversion: <code className="bg-gray-100 px-1 rounded">radians = degrees × π/180</code>
              </p>
            </div>

            <div className="bg-white rounded-card p-6 border border-line shadow-card">
              <h3 className="text-lg font-semibold text-ink mb-3">
                The Six Trig Functions
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">sin θ =</span>
                  <span className="font-mono bg-orange-50 px-2 py-1 rounded">y / 1 = y</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">cos θ =</span>
                  <span className="font-mono bg-purple-50 px-2 py-1 rounded">x / 1 = x</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">tan θ =</span>
                  <span className="font-mono bg-pink-50 px-2 py-1 rounded">sin θ / cos θ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">csc θ =</span>
                  <span className="font-mono bg-blue-50 px-2 py-1 rounded">1 / sin θ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">sec θ =</span>
                  <span className="font-mono bg-green-50 px-2 py-1 rounded">1 / cos θ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">cot θ =</span>
                  <span className="font-mono bg-yellow-50 px-2 py-1 rounded">1 / tan θ</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-card p-6 border border-line shadow-card">
              <h3 className="text-lg font-semibold text-ink mb-3">
                Special Angles
              </h3>
              <p className="text-ink-muted text-sm leading-relaxed mb-3">
                Certain angles have exact trigonometric values that can be expressed using simple radicals:
              </p>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2 font-mono text-xs bg-subtle p-2 rounded">
                  <div className="font-semibold">Angle</div>
                  <div className="font-semibold">sin</div>
                  <div className="font-semibold">cos</div>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div>0° (0)</div>
                  <div>0</div>
                  <div>1</div>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div>30° (π/6)</div>
                  <div>1/2</div>
                  <div>√3/2</div>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div>45° (π/4)</div>
                  <div>√2/2</div>
                  <div>√2/2</div>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div>60° (π/3)</div>
                  <div>√3/2</div>
                  <div>1/2</div>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <div>90° (π/2)</div>
                  <div>1</div>
                  <div>0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Fundamental Identity */}
          <div className="bg-white rounded-card p-5 sm:p-8 border border-line shadow-card">
            <h3 className="text-2xl font-bold text-ink mb-6">
              The Pythagorean Identity
            </h3>
            <p className="text-ink-muted mb-4 leading-relaxed">
              Since any point on the unit circle has coordinates (cos θ, sin θ) and is exactly 1 unit from the origin, we can apply the Pythagorean theorem:
            </p>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-4">
              <div className="text-center text-2xl font-bold text-ink mb-2">
                sin²θ + cos²θ = 1
              </div>
              <p className="text-center text-sm text-ink-muted">
                This fundamental identity holds for <strong>all</strong> angles θ
              </p>
            </div>
            <p className="text-ink-muted text-sm leading-relaxed">
              This identity is the foundation for many other trigonometric identities and is essential in calculus, physics, and engineering. It comes directly from the definition of the unit circle and the distance formula.
            </p>
          </div>
        </div>
      </section>

      {/* Comments */}
    </div>
  );
}
