'use client';

import { useState, useRef, useEffect } from 'react';

export default function TimeDilationVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [velocity, setVelocity] = useState(0.5); // Fraction of speed of light
  const [earthTime, setEarthTime] = useState(0);
  const [shipTime, setShipTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLightCones, setShowLightCones] = useState(false);
  const [distance, setDistance] = useState(0);
  
  const canvasWidth = 600;
  const canvasHeight = 400;
  const c = 1; // Speed of light (normalized to 1)

  const getLorentzFactor = (v: number): number => {
    return 1 / Math.sqrt(1 - v * v);
  };

  const gamma = getLorentzFactor(velocity);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setEarthTime(t => t + 0.1);
        setShipTime(t => t + 0.1 / gamma);
        setDistance(d => d + velocity * 0.1);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, gamma, velocity]);

  useEffect(() => {
    const animate = () => {
      drawScene();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [earthTime, shipTime, velocity, showLightCones, distance]);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw Earth (stationary observer)
    const earthX = 100;
    const earthY = 200;
    
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(earthX, earthY, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // Earth details
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(earthX - 8, earthY - 5, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(earthX + 10, earthY + 8, 10, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Earth', earthX, earthY + 55);
    ctx.font = '12px monospace';
    ctx.fillText(`t = ${earthTime.toFixed(1)} s`, earthX, earthY + 75);

    // Draw spaceship (moving observer)
    const shipX = earthX + 100 + (distance * 200);
    const shipY = earthY;
    
    // Spaceship body
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(shipX - 25, shipY);
    ctx.lineTo(shipX + 15, shipY - 10);
    ctx.lineTo(shipX + 15, shipY + 10);
    ctx.closePath();
    ctx.fill();
    
    // Spaceship window
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(shipX - 5, shipY, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Rocket flames
    if (isPlaying) {
      ctx.fillStyle = '#fbbf24';
      const flameIntensity = Math.sin(earthTime * 10) * 0.3 + 0.7;
      ctx.globalAlpha = flameIntensity;
      ctx.beginPath();
      ctx.moveTo(shipX - 25, shipY - 5);
      ctx.lineTo(shipX - 35, shipY);
      ctx.lineTo(shipX - 25, shipY + 5);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Spaceship', shipX, shipY + 55);
    ctx.font = '12px monospace';
    ctx.fillText(`t = ${shipTime.toFixed(1)} s`, shipX, shipY + 75);

    // Velocity indicator
    ctx.strokeStyle = '#fbbf24';
    ctx.fillStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(earthX + 50, earthY - 60);
    ctx.lineTo(shipX - 30, earthY - 60);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(shipX - 30, earthY - 60);
    ctx.lineTo(shipX - 38, earthY - 65);
    ctx.lineTo(shipX - 38, earthY - 55);
    ctx.closePath();
    ctx.fill();
    
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`v = ${(velocity * 100).toFixed(0)}% c`, (earthX + shipX) / 2, earthY - 70);

    // Draw clocks
    const drawClock = (x: number, y: number, time: number, label: string, color: string) => {
      // Clock circle
      ctx.strokeStyle = color;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Clock hands
      const angle = (time % 12) * (Math.PI / 6) - Math.PI / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * 15, y + Math.sin(angle) * 15);
      ctx.stroke();
      
      // Center dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
      
      // Label
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, y - 35);
    };
    
    drawClock(earthX, earthY - 100, earthTime, 'Earth Clock', '#3b82f6');
    drawClock(shipX, shipY - 100, shipTime, 'Ship Clock', '#ef4444');

    // Light cones (if enabled)
    if (showLightCones) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      
      // Future light cone from Earth
      ctx.beginPath();
      ctx.moveTo(earthX, earthY);
      ctx.lineTo(earthX - 100, earthY - 100);
      ctx.moveTo(earthX, earthY);
      ctx.lineTo(earthX + 100, earthY - 100);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }

    // Title and info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Time Dilation Visualization', 20, 30);
    
    ctx.font = '14px sans-serif';
    ctx.fillText(`Lorentz Factor γ = ${gamma.toFixed(3)}`, 20, 355);
    ctx.fillText(`Time Ratio: ${(earthTime / (shipTime || 0.01)).toFixed(2)}:1`, 20, 375);
  };

  const velocityPresets = [
    { label: '50% c', value: 0.5 },
    { label: '80% c', value: 0.8 },
    { label: '90% c', value: 0.9 },
    { label: '95% c', value: 0.95 },
    { label: '99% c', value: 0.99 },
    { label: '99.9% c', value: 0.999 },
  ];

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-gray-300 bg-gray-900 mx-auto block"
        />
      </div>

      {/* Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Simulation Controls</div>
        
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Velocity: {(velocity * 100).toFixed(1)}% of light speed
          </label>
          <input
            type="range"
            min="0"
            max="0.999"
            step="0.001"
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="w-full"
            disabled={isPlaying}
          />
        </div>

        <div className="grid grid-cols-6 gap-2 mb-4">
          {velocityPresets.map(preset => (
            <button
              key={preset.label}
              onClick={() => setVelocity(preset.value)}
              disabled={isPlaying}
              className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isPlaying 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={() => {
              setEarthTime(0);
              setShipTime(0);
              setDistance(0);
              setIsPlaying(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            onClick={() => setShowLightCones(!showLightCones)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              showLightCones 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Light Cones
          </button>
        </div>
      </div>

      {/* Time Comparison */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-red-50">
        <div className="text-sm font-semibold text-gray-900 mb-3">⏱️ Time Comparison</div>
        <div className="grid md:grid-cols-2 gap-4 mb-3">
          <div className="bg-white p-3 rounded border border-blue-200">
            <div className="text-xs text-gray-600 mb-1">Earth Observer (Stationary)</div>
            <div className="text-2xl font-bold text-blue-600">{earthTime.toFixed(2)} s</div>
          </div>
          <div className="bg-white p-3 rounded border border-red-200">
            <div className="text-xs text-gray-600 mb-1">Spaceship (Moving at {(velocity * 100).toFixed(1)}% c)</div>
            <div className="text-2xl font-bold text-red-600">{shipTime.toFixed(2)} s</div>
          </div>
        </div>
        <div className="text-sm text-gray-700">
          <strong>Time Dilation Factor:</strong> For every {gamma.toFixed(2)} seconds on Earth, 
          only 1 second passes on the spaceship.
        </div>
      </div>

      {/* Lorentz Factor Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
        <div className="text-sm font-semibold text-gray-900 mb-3">📊 Lorentz Factor Analysis</div>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="bg-white p-3 rounded">
            <div className="text-xs text-gray-600 mb-1">Lorentz Factor (γ)</div>
            <div className="text-xl font-bold text-purple-600">{gamma.toFixed(3)}</div>
          </div>
          <div className="bg-white p-3 rounded">
            <div className="text-xs text-gray-600 mb-1">v²/c²</div>
            <div className="text-xl font-bold text-purple-600">{(velocity * velocity).toFixed(4)}</div>
          </div>
          <div className="bg-white p-3 rounded">
            <div className="text-xs text-gray-600 mb-1">√(1 - v²/c²)</div>
            <div className="text-xl font-bold text-purple-600">{(1/gamma).toFixed(4)}</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-700">
          Formula: γ = 1/√(1 - v²/c²) where v is velocity and c is speed of light
        </div>
      </div>

      {/* Twin Paradox Example */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-sm font-semibold text-gray-900 mb-3">👥 Twin Paradox Scenario</div>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            If the spaceship travels for <strong>10 years</strong> Earth time at the current speed:
          </p>
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <span className="text-blue-600 font-semibold">Earth Twin Ages:</span> 10.0 years
              </div>
              <div>
                <span className="text-red-600 font-semibold">Space Twin Ages:</span> {(10 / gamma).toFixed(2)} years
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Age difference: {(10 - 10/gamma).toFixed(2)} years
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-2">💡 Key Insights:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Time passes slower for objects moving at high speeds</li>
            <li>Effect is negligible at everyday speeds but dramatic near light speed</li>
            <li>At 90% c, γ ≈ 2.3 (time passes 2.3× slower)</li>
            <li>At 99.9% c, γ ≈ 22.4 (time passes 22.4× slower)</li>
            <li>Nothing with mass can reach or exceed the speed of light</li>
            <li>This is real—confirmed by experiments with atomic clocks and particles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
