'use client';

import { useState, useRef, useEffect } from 'react';

export default function DoubleSlitVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Parameters
  const [wavelength, setWavelength] = useState(550); // nm (green light)
  const [slitSeparation, setSlitSeparation] = useState(0.2); // mm
  const [slitWidth, setSlitWidth] = useState(0.05); // mm
  const [screenDistance, setScreenDistance] = useState(1.0); // meters
  const [showWaves, setShowWaves] = useState(true);
  const [showIntensity, setShowIntensity] = useState(true);
  
  const canvasWidth = 600;
  const canvasHeight = 500;

  useEffect(() => {
    drawExperiment();
  }, [wavelength, slitSeparation, slitWidth, screenDistance, showWaves, showIntensity]);

  const getWavelengthColor = (wl: number): string => {
    if (wl < 450) return '#8b00ff'; // violet
    if (wl < 495) return '#0000ff'; // blue
    if (wl < 570) return '#00ff00'; // green
    if (wl < 590) return '#ffff00'; // yellow
    if (wl < 620) return '#ff7f00'; // orange
    return '#ff0000'; // red
  };

  const calculateIntensity = (y: number): number => {
    const lambda = wavelength * 1e-9; // convert to meters
    const d = slitSeparation * 1e-3;  // convert to meters
    const a = slitWidth * 1e-3;       // convert to meters
    const L = screenDistance;
    
    const theta = Math.atan(y / L);
    const sinTheta = Math.sin(theta);
    
    // Single-slit diffraction envelope
    const beta = (Math.PI * a * sinTheta) / lambda;
    const singleSlitPattern = beta === 0 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
    
    // Double-slit interference
    const delta = (Math.PI * d * sinTheta) / lambda;
    const doubleSlitPattern = Math.pow(Math.cos(delta), 2);
    
    return singleSlitPattern * doubleSlitPattern;
  };

  const drawExperiment = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Setup coordinates
    const slitsX = 100;
    const screenX = 500;
    const centerY = canvasHeight / 2;
    const slitLength = 60;
    
    const d_pixels = (slitSeparation * 1e-3 / screenDistance) * (screenX - slitsX);
    const slit1Y = centerY - d_pixels / 2;
    const slit2Y = centerY + d_pixels / 2;

    // Draw light source
    ctx.fillStyle = getWavelengthColor(wavelength);
    ctx.beginPath();
    ctx.arc(20, centerY, 10, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = getWavelengthColor(wavelength);
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(20, centerY, 10 + i * 8, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw barrier with slits
    ctx.fillStyle = '#333333';
    ctx.fillRect(slitsX - 5, 0, 10, slit1Y - slitLength / 2);
    ctx.fillRect(slitsX - 5, slit1Y + slitLength / 2, 10, slit2Y - slitLength / 2 - (slit1Y + slitLength / 2));
    ctx.fillRect(slitsX - 5, slit2Y + slitLength / 2, 10, canvasHeight - (slit2Y + slitLength / 2));

    // Highlight slits
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    ctx.strokeRect(slitsX - 5, slit1Y - slitLength / 2, 10, slitLength);
    ctx.strokeRect(slitsX - 5, slit2Y - slitLength / 2, 10, slitLength);

    // Draw waves emanating from slits
    if (showWaves) {
      const color = getWavelengthColor(wavelength);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;

      const numWavefronts = 8;
      for (let i = 0; i < numWavefronts; i++) {
        const radius = (i + 1) * 30;
        
        // Waves from slit 1
        ctx.beginPath();
        ctx.arc(slitsX, slit1Y, radius, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
        
        // Waves from slit 2
        ctx.beginPath();
        ctx.arc(slitsX, slit2Y, radius, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Draw screen
    ctx.fillStyle = '#222222';
    ctx.fillRect(screenX, 0, 5, canvasHeight);

    // Draw interference pattern on screen
    if (showIntensity) {
      const maxHeight = canvasHeight / 2;
      const numPoints = canvasHeight;
      
      for (let i = 0; i < numPoints; i++) {
        const y = (i / numPoints - 0.5) * 2 * maxHeight * 1e-3; // Convert to meters
        const intensity = calculateIntensity(y);
        
        const pixelY = i;
        const brightness = Math.floor(intensity * 255);
        const color = getWavelengthColor(wavelength);
        
        // Parse RGB from hex color
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intensity})`;
        ctx.fillRect(screenX + 5, pixelY, 50, 1);
      }
    }

    // Draw intensity graph
    const graphX = screenX + 60;
    const graphWidth = 35;
    
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < canvasHeight; i++) {
      const y = (i / canvasHeight - 0.5) * 2 * (canvasHeight / 2) * 1e-3;
      const intensity = calculateIntensity(y);
      const x = graphX + intensity * graphWidth;
      
      if (i === 0) ctx.moveTo(x, i);
      else ctx.lineTo(x, i);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.fillText('Light Source', 5, centerY - 20);
    ctx.fillText('Slits', slitsX - 20, 20);
    ctx.fillText('Screen', screenX - 20, 20);
    ctx.fillText('Intensity', graphX, 20);

    // Draw measurement indicators
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(slitsX, slit1Y);
    ctx.lineTo(slitsX, slit2Y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#888888';
    ctx.font = '10px sans-serif';
    ctx.fillText('d', slitsX + 10, (slit1Y + slit2Y) / 2);
  };

  const calculateFringeSpacing = (): number => {
    const lambda = wavelength * 1e-9;
    const d = slitSeparation * 1e-3;
    const L = screenDistance;
    return (lambda * L / d) * 1000; // Convert to mm
  };

  const getColorName = (wl: number): string => {
    if (wl < 450) return 'Violet';
    if (wl < 495) return 'Blue';
    if (wl < 570) return 'Green';
    if (wl < 590) return 'Yellow';
    if (wl < 620) return 'Orange';
    return 'Red';
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-900">
        <div className="text-xs font-semibold text-gray-300 mb-3">Double-Slit Experiment Setup</div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-gray-600 mx-auto block"
        />
        <div className="text-xs text-gray-400 text-center mt-2">
          Light passes through two slits and creates an interference pattern
        </div>
      </div>

      {/* Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Experiment Parameters</div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Wavelength: {wavelength} nm ({getColorName(wavelength)})
            </label>
            <input
              type="range"
              min="400"
              max="700"
              step="10"
              value={wavelength}
              onChange={(e) => setWavelength(Number(e.target.value))}
              className="w-full"
              style={{
                background: `linear-gradient(to right, #8b00ff, #0000ff, #00ff00, #ffff00, #ff7f00, #ff0000)`
              }}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Slit Separation (d): {slitSeparation.toFixed(2)} mm
            </label>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.05"
              value={slitSeparation}
              onChange={(e) => setSlitSeparation(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Slit Width (a): {slitWidth.toFixed(3)} mm
            </label>
            <input
              type="range"
              min="0.01"
              max="0.1"
              step="0.01"
              value={slitWidth}
              onChange={(e) => setSlitWidth(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Screen Distance (L): {screenDistance.toFixed(1)} m
            </label>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={screenDistance}
              onChange={(e) => setScreenDistance(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showWaves}
              onChange={(e) => setShowWaves(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Show Wave Fronts</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showIntensity}
              onChange={(e) => setShowIntensity(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Show Intensity Pattern</span>
          </label>
        </div>

        <button
          onClick={() => {
            setWavelength(550);
            setSlitSeparation(0.2);
            setSlitWidth(0.05);
            setScreenDistance(1.0);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
        >
          Reset to Defaults
        </button>
      </div>

      {/* Measurements */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Calculated Values</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Fringe Spacing</div>
            <div className="text-lg font-bold text-teal-600">
              {calculateFringeSpacing().toFixed(2)} mm
            </div>
            <div className="text-xs text-gray-500">Δy = λL/d</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Wavelength</div>
            <div className="text-lg font-bold text-purple-600">
              {wavelength} nm
            </div>
            <div className="text-xs text-gray-500">{getColorName(wavelength)} light</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">d/λ Ratio</div>
            <div className="text-lg font-bold text-blue-600">
              {(slitSeparation * 1e6 / wavelength).toFixed(0)}
            </div>
            <div className="text-xs text-gray-500">Separation ratio</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Angular Width</div>
            <div className="text-lg font-bold text-green-600">
              {((wavelength * 1e-9 / (slitSeparation * 1e-3)) * 180 / Math.PI).toFixed(2)}°
            </div>
            <div className="text-xs text-gray-500">First minimum</div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-teal-50">
        <div className="text-sm text-teal-900">
          <p className="font-medium mb-2">💡 Experiment Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Wavelength:</strong> Change color to see how different wavelengths affect fringe spacing</li>
            <li><strong>Slit separation:</strong> Smaller separation = wider fringes</li>
            <li><strong>Screen distance:</strong> Further screen = larger, more spread out pattern</li>
            <li><strong>Slit width:</strong> Affects the envelope (single-slit diffraction) that modulates the pattern</li>
            <li>Central bright fringe is always at the center (zero path difference)</li>
            <li>The pattern demonstrates that light behaves as a wave!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
