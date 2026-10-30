'use client';

import { useState, useRef, useEffect } from 'react';

export default function WaveInterferenceVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Wave parameters
  const [frequency1, setFrequency1] = useState(2);
  const [frequency2, setFrequency2] = useState(2);
  const [amplitude1, setAmplitude1] = useState(30);
  const [amplitude2, setAmplitude2] = useState(30);
  const [phase1, setPhase1] = useState(0);
  const [phase2, setPhase2] = useState(0);
  
  // Source positions
  const [source1X, setSource1X] = useState(200);
  const [source1Y, setSource1Y] = useState(250);
  const [source2X, setSource2X] = useState(400);
  const [source2Y, setSource2Y] = useState(250);
  
  // Animation
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showWave1, setShowWave1] = useState(true);
  const [showWave2, setShowWave2] = useState(true);
  const [showInterference, setShowInterference] = useState(true);
  const [viewMode, setViewMode] = useState<'2D' | 'pattern'>('pattern');
  
  const canvasWidth = 600;
  const canvasHeight = 500;
  const waveSpeed = 100; // pixels per second

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime(t => t + 0.016);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying]);

  useEffect(() => {
    if (viewMode === '2D') {
      draw2DWaves();
    } else {
      drawInterferencePattern();
    }
  }, [time, frequency1, frequency2, amplitude1, amplitude2, phase1, phase2, 
      source1X, source1Y, source2X, source2Y, showWave1, showWave2, showInterference, viewMode]);

  const draw2DWaves = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const centerY = canvasHeight / 2;
    const wavelength1 = 100 / frequency1;
    const wavelength2 = 100 / frequency2;

    // Draw individual waves
    ctx.lineWidth = 2;

    if (showWave1) {
      ctx.strokeStyle = '#3b82f6';
      ctx.beginPath();
      for (let x = 0; x < canvasWidth; x++) {
        const y = centerY + amplitude1 * Math.sin((2 * Math.PI * x / wavelength1) - time * frequency1 * 2 + phase1);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    if (showWave2) {
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      for (let x = 0; x < canvasWidth; x++) {
        const y = centerY + amplitude2 * Math.sin((2 * Math.PI * x / wavelength2) - time * frequency2 * 2 + phase2);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw interference pattern (sum)
    if (showInterference) {
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < canvasWidth; x++) {
        const y1 = amplitude1 * Math.sin((2 * Math.PI * x / wavelength1) - time * frequency1 * 2 + phase1);
        const y2 = amplitude2 * Math.sin((2 * Math.PI * x / wavelength2) - time * frequency2 * 2 + phase2);
        const y = centerY + y1 + y2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw center line
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvasWidth, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px sans-serif';
    if (showWave1) {
      ctx.fillStyle = '#3b82f6';
      ctx.fillText('Wave 1', 10, 20);
    }
    if (showWave2) {
      ctx.fillStyle = '#ef4444';
      ctx.fillText('Wave 2', 10, 40);
    }
    if (showInterference) {
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText('Interference Pattern', 10, 60);
    }
  };

  const drawInterferencePattern = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(canvasWidth, canvasHeight);
    const data = imageData.data;

    const k1 = (2 * Math.PI * frequency1) / waveSpeed;
    const k2 = (2 * Math.PI * frequency2) / waveSpeed;
    const omega1 = frequency1 * 2 * Math.PI;
    const omega2 = frequency2 * 2 * Math.PI;

    let maxIntensity = 0;
    const intensities: number[] = [];

    // Calculate intensities
    for (let y = 0; y < canvasHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        const r1 = Math.sqrt((x - source1X) ** 2 + (y - source1Y) ** 2);
        const r2 = Math.sqrt((x - source2X) ** 2 + (y - source2Y) ** 2);

        const wave1 = amplitude1 * Math.sin(k1 * r1 - omega1 * time + phase1) / (1 + r1 / 100);
        const wave2 = amplitude2 * Math.sin(k2 * r2 - omega2 * time + phase2) / (1 + r2 / 100);

        const interference = wave1 + wave2;
        const intensity = interference * interference;
        
        intensities.push(intensity);
        if (intensity > maxIntensity) maxIntensity = intensity;
      }
    }

    // Render pattern
    for (let y = 0; y < canvasHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        const idx = (y * canvasWidth + x) * 4;
        const intensity = intensities[y * canvasWidth + x] / maxIntensity;

        // Color mapping: blue (low) -> white (medium) -> red (high)
        if (intensity < 0.5) {
          data[idx] = 100 + intensity * 310;     // R
          data[idx + 1] = 150 + intensity * 210; // G
          data[idx + 2] = 255;                   // B
        } else {
          data[idx] = 255;                           // R
          data[idx + 1] = 255 - (intensity - 0.5) * 510; // G
          data[idx + 2] = 255 - (intensity - 0.5) * 510; // B
        }
        data[idx + 3] = 255; // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw sources
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(source1X, source1Y, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(source2X, source2Y, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('S1', source1X - 8, source1Y - 12);
    ctx.fillText('S2', source2X - 8, source2Y - 12);
  };

  const calculateInterferenceType = () => {
    const phaseDiff = Math.abs(phase2 - phase1);
    const normalizedPhase = phaseDiff % (2 * Math.PI);
    
    if (frequency1 === frequency2) {
      if (normalizedPhase < 0.2 || normalizedPhase > 2 * Math.PI - 0.2) {
        return 'Constructive';
      } else if (Math.abs(normalizedPhase - Math.PI) < 0.2) {
        return 'Destructive';
      } else {
        return 'Partial';
      }
    }
    return 'Complex';
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-700">Wave Interference Visualization</div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('2D')}
              className={`px-3 py-1 text-xs font-medium rounded ${
                viewMode === '2D' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              2D Waves
            </button>
            <button
              onClick={() => setViewMode('pattern')}
              className={`px-3 py-1 text-xs font-medium rounded ${
                viewMode === 'pattern' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Interference Pattern
            </button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-gray-300 bg-white mx-auto block"
        />
        <div className="text-xs text-gray-600 text-center mt-2">
          {viewMode === '2D' ? 'Superposition of two waves' : 'Two-source interference pattern'}
        </div>
      </div>

      {/* Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Wave Parameters</div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Wave 1 Controls */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-blue-600">Wave 1</div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Frequency: {frequency1.toFixed(1)} Hz
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={frequency1}
                onChange={(e) => setFrequency1(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Amplitude: {amplitude1}
              </label>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={amplitude1}
                onChange={(e) => setAmplitude1(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Phase: {(phase1 / Math.PI).toFixed(2)}π
              </label>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.1"
                value={phase1}
                onChange={(e) => setPhase1(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Wave 2 Controls */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-red-600">Wave 2</div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Frequency: {frequency2.toFixed(1)} Hz
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={frequency2}
                onChange={(e) => setFrequency2(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Amplitude: {amplitude2}
              </label>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={amplitude2}
                onChange={(e) => setAmplitude2(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Phase: {(phase2 / Math.PI).toFixed(2)}π
              </label>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.1"
                value={phase2}
                onChange={(e) => setPhase2(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Display toggles for 2D mode */}
        {viewMode === '2D' && (
          <div className="mt-4 flex gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showWave1}
                onChange={(e) => setShowWave1(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-blue-600 font-medium">Show Wave 1</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showWave2}
                onChange={(e) => setShowWave2(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-red-600 font-medium">Show Wave 2</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showInterference}
                onChange={(e) => setShowInterference(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-purple-600 font-medium">Show Interference</span>
            </label>
          </div>
        )}

        <div className="flex gap-2 mt-4">
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
              setFrequency1(2);
              setFrequency2(2);
              setAmplitude1(30);
              setAmplitude2(30);
              setPhase1(0);
              setPhase2(0);
              setTime(0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Analysis */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Interference Analysis</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Type</div>
            <div className={`text-lg font-bold ${
              calculateInterferenceType() === 'Constructive' ? 'text-green-600' :
              calculateInterferenceType() === 'Destructive' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {calculateInterferenceType()}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Max Amplitude</div>
            <div className="text-lg font-bold text-purple-600">
              {(amplitude1 + amplitude2).toFixed(0)}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Phase Diff</div>
            <div className="text-lg font-bold text-blue-600">
              {((phase2 - phase1) / Math.PI).toFixed(2)}π
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Freq Match</div>
            <div className={`text-lg font-bold ${
              frequency1 === frequency2 ? 'text-green-600' : 'text-orange-600'
            }`}>
              {frequency1 === frequency2 ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="border border-gray-200 rounded-lg p-4 bg-teal-50">
        <div className="text-sm font-semibold text-teal-900 mb-3">Quick Presets</div>
        <div className="grid sm:grid-cols-3 gap-2">
          <button
            onClick={() => {
              setFrequency1(2);
              setFrequency2(2);
              setAmplitude1(30);
              setAmplitude2(30);
              setPhase1(0);
              setPhase2(0);
            }}
            className="px-3 py-2 bg-white border border-teal-300 rounded text-sm font-medium hover:bg-teal-50"
          >
            ✅ Constructive
          </button>
          <button
            onClick={() => {
              setFrequency1(2);
              setFrequency2(2);
              setAmplitude1(30);
              setAmplitude2(30);
              setPhase1(0);
              setPhase2(Math.PI);
            }}
            className="px-3 py-2 bg-white border border-teal-300 rounded text-sm font-medium hover:bg-teal-50"
          >
            ❌ Destructive
          </button>
          <button
            onClick={() => {
              setFrequency1(2);
              setFrequency2(3);
              setAmplitude1(30);
              setAmplitude2(25);
              setPhase1(0);
              setPhase2(0);
            }}
            className="px-3 py-2 bg-white border border-teal-300 rounded text-sm font-medium hover:bg-teal-50"
          >
            🌀 Beat Pattern
          </button>
        </div>
      </div>
    </div>
  );
}
