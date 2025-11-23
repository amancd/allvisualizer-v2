'use client';

import { useState, useRef, useEffect } from 'react';

export default function StandingWavesVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Parameters
  const [harmonic, setHarmonic] = useState(1);
  const [amplitude, setAmplitude] = useState(40);
  const [frequency, setFrequency] = useState(2);
  const [tension, setTension] = useState(50);
  const [boundaryType, setBoundaryType] = useState<'string' | 'open-pipe' | 'closed-pipe'>('string');
  const [isPlaying, setIsPlaying] = useState(true);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [showNodes, setShowNodes] = useState(true);
  
  const [time, setTime] = useState(0);
  
  const canvasWidth = 600;
  const canvasHeight = 400;
  const stringLength = 500;
  const offsetX = 50;
  const centerY = canvasHeight / 2;

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setTime(t => t + 0.05);
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
    drawStandingWave();
  }, [time, harmonic, amplitude, frequency, tension, boundaryType, showEnvelope, showNodes]);

  const getNodePositions = (): number[] => {
    const nodes: number[] = [];
    
    if (boundaryType === 'closed-pipe') {
      // Only odd harmonics for closed pipe (one end closed)
      const effectiveHarmonic = 2 * harmonic - 1;
      for (let i = 0; i <= effectiveHarmonic; i++) {
        nodes.push(i / effectiveHarmonic);
      }
    } else {
      // String or open pipe - all harmonics
      for (let i = 0; i <= harmonic; i++) {
        nodes.push(i / harmonic);
      }
    }
    
    return nodes;
  };

  const getAntinodePositions = (): number[] => {
    const antinodes: number[] = [];
    
    if (boundaryType === 'closed-pipe') {
      const effectiveHarmonic = 2 * harmonic - 1;
      for (let i = 0; i < effectiveHarmonic; i++) {
        antinodes.push((i + 0.5) / effectiveHarmonic);
      }
    } else {
      for (let i = 0; i < harmonic; i++) {
        antinodes.push((i + 0.5) / harmonic);
      }
    }
    
    return antinodes;
  };

  const drawStandingWave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw envelope if enabled
    if (showEnvelope) {
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      // Upper envelope
      ctx.beginPath();
      for (let x = 0; x <= stringLength; x++) {
        const normalizedX = x / stringLength;
        let envelopeY;
        
        if (boundaryType === 'closed-pipe') {
          const effectiveHarmonic = 2 * harmonic - 1;
          envelopeY = amplitude * Math.abs(Math.sin(effectiveHarmonic * Math.PI * normalizedX));
        } else {
          envelopeY = amplitude * Math.abs(Math.sin(harmonic * Math.PI * normalizedX));
        }
        
        const y = centerY - envelopeY;
        if (x === 0) ctx.moveTo(offsetX + x, y);
        else ctx.lineTo(offsetX + x, y);
      }
      ctx.stroke();
      
      // Lower envelope
      ctx.beginPath();
      for (let x = 0; x <= stringLength; x++) {
        const normalizedX = x / stringLength;
        let envelopeY;
        
        if (boundaryType === 'closed-pipe') {
          const effectiveHarmonic = 2 * harmonic - 1;
          envelopeY = amplitude * Math.abs(Math.sin(effectiveHarmonic * Math.PI * normalizedX));
        } else {
          envelopeY = amplitude * Math.abs(Math.sin(harmonic * Math.PI * normalizedX));
        }
        
        const y = centerY + envelopeY;
        if (x === 0) ctx.moveTo(offsetX + x, y);
        else ctx.lineTo(offsetX + x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw standing wave
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = 0; x <= stringLength; x++) {
      const normalizedX = x / stringLength;
      let y;
      
      if (boundaryType === 'closed-pipe') {
        const effectiveHarmonic = 2 * harmonic - 1;
        y = centerY + amplitude * Math.sin(effectiveHarmonic * Math.PI * normalizedX) * Math.cos(frequency * time);
      } else {
        y = centerY + amplitude * Math.sin(harmonic * Math.PI * normalizedX) * Math.cos(frequency * time);
      }
      
      if (x === 0) ctx.moveTo(offsetX + x, y);
      else ctx.lineTo(offsetX + x, y);
    }
    ctx.stroke();

    // Draw center line
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(offsetX, centerY);
    ctx.lineTo(offsetX + stringLength, centerY);
    ctx.stroke();

    // Draw boundaries
    ctx.fillStyle = '#1f2937';
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 4;
    
    if (boundaryType === 'string' || boundaryType === 'closed-pipe') {
      // Left boundary - always fixed
      ctx.beginPath();
      ctx.moveTo(offsetX, centerY - 30);
      ctx.lineTo(offsetX, centerY + 30);
      ctx.stroke();
    } else {
      // Open end - draw as opening
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(offsetX, centerY, 15, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    if (boundaryType === 'string' || boundaryType === 'open-pipe') {
      // Right boundary - fixed for string, open for open-pipe
      if (boundaryType === 'string') {
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(offsetX + stringLength, centerY - 30);
        ctx.lineTo(offsetX + stringLength, centerY + 30);
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(offsetX + stringLength, centerY, 15, 0, 2 * Math.PI);
        ctx.stroke();
      }
    } else {
      // Closed end for closed-pipe
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(offsetX + stringLength - 5, centerY - 30, 10, 60);
    }

    // Draw nodes
    if (showNodes) {
      const nodePositions = getNodePositions();
      nodePositions.forEach(pos => {
        const x = offsetX + pos * stringLength;
        
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, centerY, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw vertical line
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, centerY - 60);
        ctx.lineTo(x, centerY + 60);
        ctx.stroke();
        ctx.setLineDash([]);
      });
      
      // Draw antinodes
      const antinodePositions = getAntinodePositions();
      antinodePositions.forEach(pos => {
        const x = offsetX + pos * stringLength;
        
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x, centerY, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw vertical line
        ctx.strokeStyle = '#6ee7b7';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, centerY - 60);
        ctx.lineTo(x, centerY + 60);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // Labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px sans-serif';
    
    const typeLabel = boundaryType === 'string' ? 'String (Both Fixed)' : 
                     boundaryType === 'open-pipe' ? 'Pipe (Both Open)' : 
                     'Pipe (One Closed)';
    ctx.fillText(typeLabel, 10, 20);
    
    const harmonicLabel = boundaryType === 'closed-pipe' ? 
                         `${harmonic}${getOrdinalSuffix(harmonic)} Odd Harmonic (n=${2 * harmonic - 1})` :
                         `${harmonic}${getOrdinalSuffix(harmonic)} Harmonic`;
    ctx.fillText(harmonicLabel, 10, 40);

    // Legend
    if (showNodes) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(10, canvasHeight - 40, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.fillText('Nodes', 20, canvasHeight - 36);
      
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(10, canvasHeight - 20, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.fillText('Antinodes', 20, canvasHeight - 16);
    }
  };

  const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const calculateWavelength = (): number => {
    if (boundaryType === 'closed-pipe') {
      const effectiveHarmonic = 2 * harmonic - 1;
      return (2 * stringLength) / effectiveHarmonic;
    }
    return (2 * stringLength) / harmonic;
  };

  const calculateFrequency = (): number => {
    const wavelength = calculateWavelength();
    const waveSpeed = Math.sqrt(tension / 10); // Simplified
    return waveSpeed / wavelength * frequency;
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Standing Wave Visualization</div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-gray-300 bg-white mx-auto block"
        />
        <div className="text-xs text-gray-600 text-center mt-2">
          {boundaryType === 'string' && 'Vibrating string with both ends fixed'}
          {boundaryType === 'open-pipe' && 'Air column in pipe with both ends open'}
          {boundaryType === 'closed-pipe' && 'Air column in pipe with one end closed'}
        </div>
      </div>

      {/* Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Parameters</div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Boundary Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setBoundaryType('string')}
                className={`px-3 py-2 text-xs rounded ${
                  boundaryType === 'string'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                String
              </button>
              <button
                onClick={() => setBoundaryType('open-pipe')}
                className={`px-3 py-2 text-xs rounded ${
                  boundaryType === 'open-pipe'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Open Pipe
              </button>
              <button
                onClick={() => setBoundaryType('closed-pipe')}
                className={`px-3 py-2 text-xs rounded ${
                  boundaryType === 'closed-pipe'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Closed Pipe
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Harmonic: {harmonic}
              {boundaryType === 'closed-pipe' && ` (n=${2 * harmonic - 1})`}
            </label>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={harmonic}
              onChange={(e) => setHarmonic(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Amplitude: {amplitude}
            </label>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={amplitude}
              onChange={(e) => setAmplitude(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Frequency: {frequency.toFixed(1)} Hz
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showEnvelope}
              onChange={(e) => setShowEnvelope(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Show Envelope</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showNodes}
              onChange={(e) => setShowNodes(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Show Nodes/Antinodes</span>
          </label>
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
              setHarmonic(1);
              setAmplitude(40);
              setFrequency(2);
              setBoundaryType('string');
              setTime(0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Measurements */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Wave Properties</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Nodes</div>
            <div className="text-lg font-bold text-red-600">
              {getNodePositions().length}
            </div>
            <div className="text-xs text-gray-500">Zero displacement</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Antinodes</div>
            <div className="text-lg font-bold text-green-600">
              {getAntinodePositions().length}
            </div>
            <div className="text-xs text-gray-500">Max displacement</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Wavelength</div>
            <div className="text-lg font-bold text-blue-600">
              {calculateWavelength().toFixed(0)} px
            </div>
            <div className="text-xs text-gray-500">λ = 2L/n</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Frequency</div>
            <div className="text-lg font-bold text-purple-600">
              {calculateFrequency().toFixed(2)} Hz
            </div>
            <div className="text-xs text-gray-500">f = nf₁</div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-teal-50">
        <div className="text-sm text-teal-900">
          <p className="font-medium mb-2">💡 How to Use:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Harmonic number:</strong> Higher harmonics have more nodes and shorter wavelengths</li>
            <li><strong>String:</strong> Both ends fixed - supports all harmonics (n = 1, 2, 3, ...)</li>
            <li><strong>Open pipe:</strong> Both ends open - supports all harmonics (antinodes at ends)</li>
            <li><strong>Closed pipe:</strong> One end closed - only odd harmonics (n = 1, 3, 5, ...)</li>
            <li><strong>Nodes:</strong> Points that never move (destructive interference)</li>
            <li><strong>Antinodes:</strong> Points of maximum motion (constructive interference)</li>
            <li>Watch how the wave pattern changes while the nodes remain stationary!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
