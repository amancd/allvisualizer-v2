'use client';

import { useState, useRef, useEffect } from 'react';

export default function IdealGasLawVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Gas parameters
  const [temperature, setTemperature] = useState(300); // Kelvin
  const [volume, setVolume] = useState(50); // Liters
  const [moles, setMoles] = useState(2); // moles
  const [pressure, setPressure] = useState(0); // calculated
  
  // Particle visualization
  const [particles, setParticles] = useState<Array<{x: number, y: number, vx: number, vy: number}>>([]);
  const [processType, setProcessType] = useState<'free' | 'isothermal' | 'isobaric' | 'isochoric'>('free');
  
  const R = 0.0821; // L·atm/(mol·K)
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  // Initialize particles
  useEffect(() => {
    const numParticles = Math.floor(moles * 30);
    const containerWidth = 400;
    const containerHeight = Math.min(300, volume * 4);
    
    const newParticles = [];
    for (let i = 0; i < numParticles; i++) {
      const speed = Math.sqrt(temperature / 100);
      const angle = Math.random() * 2 * Math.PI;
      newParticles.push({
        x: 100 + Math.random() * containerWidth,
        y: 50 + Math.random() * containerHeight,
        vx: speed * Math.cos(angle),
        vy: speed * Math.sin(angle)
      });
    }
    setParticles(newParticles);
  }, [moles]);

  // Calculate pressure from ideal gas law
  useEffect(() => {
    const P = (moles * R * temperature) / volume;
    setPressure(P);
  }, [temperature, volume, moles]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateParticles();
      drawScene();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles, temperature, volume, pressure]);

  const updateParticles = () => {
    const containerWidth = 400;
    const containerHeight = Math.min(300, volume * 4);
    const speed = Math.sqrt(temperature / 100);
    
    setParticles(prevParticles => {
      return prevParticles.map(p => {
        let newX = p.x + p.vx;
        let newY = p.y + p.vy;
        let newVx = p.vx;
        let newVy = p.vy;
        
        // Wall collisions
        if (newX < 100 || newX > 100 + containerWidth) {
          newVx = -newVx;
          newX = Math.max(100, Math.min(100 + containerWidth, newX));
        }
        if (newY < 50 || newY > 50 + containerHeight) {
          newVy = -newVy;
          newY = Math.max(50, Math.min(50 + containerHeight, newY));
        }
        
        // Adjust speed based on temperature
        const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
        if (currentSpeed > 0) {
          const targetSpeed = speed;
          const ratio = targetSpeed / currentSpeed;
          newVx *= ratio;
          newVy *= ratio;
        }
        
        return { x: newX, y: newY, vx: newVx, vy: newVy };
      });
    });
  };

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const containerWidth = 400;
    const containerHeight = Math.min(300, volume * 4);

    // Draw container
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(100, 50, containerWidth, containerHeight);
    ctx.strokeRect(100, 50, containerWidth, containerHeight);

    // Draw movable piston/lid
    const pistonY = 50 + containerHeight;
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(100, pistonY - 10, containerWidth, 10);
    
    // Piston arrows
    ctx.fillStyle = '#ef4444';
    for (let i = 0; i < 3; i++) {
      const x = 150 + i * 150;
      ctx.beginPath();
      ctx.moveTo(x, pistonY - 5);
      ctx.lineTo(x - 5, pistonY - 15);
      ctx.lineTo(x + 5, pistonY - 15);
      ctx.closePath();
      ctx.fill();
    }

    // Draw particles
    particles.forEach(p => {
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Labels
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Gas Container', 10, 30);
    
    // Volume indicator
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.save();
    ctx.translate(80, 200);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`V = ${volume.toFixed(1)} L`, 0, 0);
    ctx.restore();

    // Pressure indicator
    ctx.fillStyle = '#ef4444';
    ctx.font = '11px sans-serif';
    ctx.fillText(`P = ${pressure.toFixed(2)} atm`, 300, pistonY - 20);
  };

  const handleProcessChange = (type: typeof processType, param: 'temperature' | 'volume' | 'pressure', value: number) => {
    setProcessType(type);
    
    if (type === 'isothermal') {
      // PV = constant
      if (param === 'volume') {
        const newVolume = value;
        setVolume(newVolume);
        // Keep temperature constant
      } else if (param === 'pressure') {
        const newPressure = value;
        const newVolume = (moles * R * temperature) / newPressure;
        setVolume(newVolume);
      }
    } else if (type === 'isobaric') {
      // V/T = constant
      if (param === 'temperature') {
        const newTemp = value;
        setTemperature(newTemp);
        // Pressure stays constant, volume adjusts
      } else if (param === 'volume') {
        const newVolume = value;
        setVolume(newVolume);
      }
    } else if (type === 'isochoric') {
      // P/T = constant
      if (param === 'temperature') {
        const newTemp = value;
        setTemperature(newTemp);
        // Volume stays constant, pressure adjusts
      }
    } else {
      // Free control
      if (param === 'temperature') setTemperature(value);
      else if (param === 'volume') setVolume(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Gas Particle Simulation</div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-gray-300 bg-white mx-auto block"
        />
        <div className="text-xs text-gray-600 text-center mt-2">
          Particle speed represents temperature • Container size represents volume
        </div>
      </div>

      {/* Process Type */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Process Type</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setProcessType('free')}
            className={`px-3 py-2 text-sm rounded ${
              processType === 'free'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Free Control
          </button>
          <button
            onClick={() => setProcessType('isothermal')}
            className={`px-3 py-2 text-sm rounded ${
              processType === 'isothermal'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Isothermal (T const)
          </button>
          <button
            onClick={() => setProcessType('isobaric')}
            className={`px-3 py-2 text-sm rounded ${
              processType === 'isobaric'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Isobaric (P const)
          </button>
          <button
            onClick={() => setProcessType('isochoric')}
            className={`px-3 py-2 text-sm rounded ${
              processType === 'isochoric'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Isochoric (V const)
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Gas Parameters</div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Temperature: {temperature} K ({(temperature - 273.15).toFixed(1)}°C)
            </label>
            <input
              type="range"
              min="200"
              max="500"
              step="10"
              value={temperature}
              onChange={(e) => handleProcessChange(processType, 'temperature', Number(e.target.value))}
              disabled={processType === 'isothermal'}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Volume: {volume.toFixed(1)} L
            </label>
            <input
              type="range"
              min="20"
              max="80"
              step="5"
              value={volume}
              onChange={(e) => handleProcessChange(processType, 'volume', Number(e.target.value))}
              disabled={processType === 'isochoric'}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Moles (n): {moles.toFixed(1)} mol
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={moles}
              onChange={(e) => setMoles(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Pressure: {pressure.toFixed(2)} atm (calculated)
            </label>
            <div className="h-10 flex items-center px-3 bg-gray-100 border border-gray-300 rounded">
              <span className="text-sm text-gray-600">Auto-calculated from PV=nRT</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setTemperature(300);
            setVolume(50);
            setMoles(2);
            setProcessType('free');
          }}
          className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
        >
          Reset to Standard Conditions
        </button>
      </div>

      {/* Real-time Calculations */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Ideal Gas Law Equation</div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="font-mono text-sm space-y-2">
            <p className="text-lg font-bold text-center mb-3">PV = nRT</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Left Side (PV):</p>
                <p className="font-semibold">{pressure.toFixed(2)} × {volume.toFixed(1)} = {(pressure * volume).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Right Side (nRT):</p>
                <p className="font-semibold">{moles.toFixed(1)} × {R} × {temperature} = {(moles * R * temperature).toFixed(2)}</p>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-3">
              Both sides equal: {Math.abs((pressure * volume) - (moles * R * temperature)) < 0.01 ? '✓ Verified' : '⚠️ Check'}
            </p>
          </div>
        </div>
      </div>

      {/* Measurements */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Current State</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Pressure (P)</div>
            <div className="text-lg font-bold text-red-600">{pressure.toFixed(2)} atm</div>
            <div className="text-xs text-gray-500">{(pressure * 101.325).toFixed(1)} kPa</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Volume (V)</div>
            <div className="text-lg font-bold text-blue-600">{volume.toFixed(1)} L</div>
            <div className="text-xs text-gray-500">{(volume / 1000).toFixed(4)} m³</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Temperature (T)</div>
            <div className="text-lg font-bold text-orange-600">{temperature} K</div>
            <div className="text-xs text-gray-500">{(temperature - 273.15).toFixed(1)}°C</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Moles (n)</div>
            <div className="text-lg font-bold text-green-600">{moles.toFixed(1)} mol</div>
            <div className="text-xs text-gray-500">{(moles * 6.022e23).toExponential(2)} particles</div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-red-50">
        <div className="text-sm text-red-900">
          <p className="font-medium mb-2">💡 How to Use:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Free Control:</strong> Adjust any parameter independently</li>
            <li><strong>Isothermal (Boyle's Law):</strong> Temperature fixed, P and V inversely related</li>
            <li><strong>Isobaric (Charles's Law):</strong> Pressure constant, V and T directly related</li>
            <li><strong>Isochoric (Gay-Lussac's):</strong> Volume fixed, P and T directly related</li>
            <li>Watch particle speed increase with temperature</li>
            <li>Container size changes with volume</li>
            <li>More moles = more particles in the container</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
