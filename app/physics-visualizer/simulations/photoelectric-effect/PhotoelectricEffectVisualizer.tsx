'use client';

import { useState, useRef, useEffect } from 'react';

interface Electron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ejected: boolean;
}

export default function PhotoelectricEffectVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [frequency, setFrequency] = useState(700); // THz (10^12 Hz)
  const [intensity, setIntensity] = useState(50); // Arbitrary units
  const [metal, setMetal] = useState('sodium');
  const [isPlaying, setIsPlaying] = useState(true);
  const [electrons, setElectrons] = useState<Electron[]>([]);
  const [photonTime, setPhotonTime] = useState(0);
  const [ejectedCount, setEjectedCount] = useState(0);
  
  const canvasWidth = 600;
  const canvasHeight = 400;
  
  const h = 6.626e-34; // Planck's constant (J·s)
  const eV = 1.602e-19; // eV to Joules conversion

  const metals: Record<string, {workFunction: number, color: string}> = {
    sodium: { workFunction: 2.28, color: '#fbbf24' },
    potassium: { workFunction: 2.30, color: '#a78bfa' },
    calcium: { workFunction: 2.87, color: '#60a5fa' },
    zinc: { workFunction: 4.33, color: '#94a3b8' },
    copper: { workFunction: 4.65, color: '#f97316' }
  };

  const getWavelength = (freqTHz: number): number => {
    // c = λf, c = 3×10^8 m/s, f in THz = 10^12 Hz
    return (3e8 / (freqTHz * 1e12)) * 1e9; // in nanometers
  };

  const getPhotonEnergy = (freqTHz: number): number => {
    // E = hf, convert to eV
    return (h * freqTHz * 1e12) / eV;
  };

  const getWavelengthColor = (wavelength: number): string => {
    if (wavelength < 380) return '#8b5cf6'; // UV (violet)
    if (wavelength < 450) return '#6366f1'; // Violet
    if (wavelength < 495) return '#3b82f6'; // Blue
    if (wavelength < 570) return '#10b981'; // Green
    if (wavelength < 590) return '#fbbf24'; // Yellow
    if (wavelength < 620) return '#f97316'; // Orange
    if (wavelength < 750) return '#ef4444'; // Red
    return '#991b1b'; // IR (dark red)
  };

  const canEject = (): boolean => {
    const photonEnergy = getPhotonEnergy(frequency);
    const workFunction = metals[metal].workFunction;
    return photonEnergy >= workFunction;
  };

  const getMaxKineticEnergy = (): number => {
    const photonEnergy = getPhotonEnergy(frequency);
    const workFunction = metals[metal].workFunction;
    return Math.max(0, photonEnergy - workFunction);
  };

  const getThresholdFrequency = (): number => {
    // f0 = φ/h
    return (metals[metal].workFunction * eV) / (h * 1e12); // in THz
  };

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setPhotonTime(t => t + 0.02);
        
        // Update electrons
        setElectrons(prev => {
          const updated = prev.map(e => ({
            ...e,
            x: e.x + e.vx,
            y: e.y + e.vy,
            vy: e.vy + 0.1 // slight gravity effect
          })).filter(e => e.y < canvasHeight + 50 && e.x < canvasWidth);
          
          return updated;
        });
        
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
    // Generate electrons based on intensity and whether ejection is possible
    if (isPlaying && canEject()) {
      const interval = setInterval(() => {
        const numElectrons = Math.floor(intensity / 25) + 1;
        
        for (let i = 0; i < numElectrons; i++) {
          if (Math.random() < intensity / 100) {
            const ke = getMaxKineticEnergy();
            const speed = Math.sqrt(ke) * 3; // Arbitrary scaling for visualization
            
            const newElectron: Electron = {
              x: 150 + Math.random() * 100,
              y: 250,
              vx: 0.5 + Math.random() * 2,
              vy: -speed - Math.random() * 2,
              ejected: true
            };
            
            setElectrons(prev => [...prev, newElectron]);
            setEjectedCount(c => c + 1);
          }
        }
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, frequency, intensity, metal]);

  useEffect(() => {
    drawScene();
  }, [photonTime, electrons, frequency, intensity, metal]);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw metal surface
    const surfaceY = 250;
    ctx.fillStyle = metals[metal].color;
    ctx.fillRect(100, surfaceY, 150, 100);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, surfaceY, 150, 100);

    // Draw atoms in metal (grid pattern)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        ctx.beginPath();
        ctx.arc(115 + col * 25, 265 + row * 25, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw incoming photons
    const wavelength = getWavelength(frequency);
    const photonColor = getWavelengthColor(wavelength);
    
    for (let i = 0; i < 3; i++) {
      const phase = photonTime + i * 2;
      const photonX = 50 + (phase % 4) * 25;
      
      if (photonX < 120) {
        // Draw photon as wave packet
        ctx.strokeStyle = photonColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < 30; x++) {
          const y = 200 + i * 50 + Math.sin((x + phase * 10) * 0.3) * 10;
          if (x === 0) ctx.moveTo(photonX + x, y);
          else ctx.lineTo(photonX + x, y);
        }
        ctx.stroke();
        
        // Draw photon symbol
        ctx.fillStyle = photonColor;
        ctx.beginPath();
        ctx.arc(photonX + 15, 200 + i * 50, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw ejected electrons
    electrons.forEach(electron => {
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.arc(electron.x, electron.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw electron symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('e⁻', electron.x, electron.y + 3);
    });

    // Draw labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Incident Photons', 20, 30);
    ctx.fillText(`λ = ${wavelength.toFixed(0)} nm`, 20, 50);
    ctx.fillText(`E = ${getPhotonEnergy(frequency).toFixed(2)} eV`, 20, 70);
    
    ctx.fillText(`Metal: ${metal.charAt(0).toUpperCase() + metal.slice(1)}`, 350, 30);
    ctx.fillText(`φ = ${metals[metal].workFunction.toFixed(2)} eV`, 350, 50);
    
    if (canEject()) {
      ctx.fillStyle = '#10b981';
      ctx.fillText('✓ Electrons Ejected', 350, 90);
      ctx.fillText(`KE_max = ${getMaxKineticEnergy().toFixed(2)} eV`, 350, 110);
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.fillText('✗ No Ejection', 350, 90);
      ctx.fillText('Frequency too low', 350, 110);
    }

    // Draw work function arrow
    if (canEject()) {
      ctx.strokeStyle = '#fbbf24';
      ctx.fillStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(250, surfaceY);
      ctx.lineTo(250, surfaceY - 50);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Work Function', 255, surfaceY - 25);
    }
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Photoelectric Effect Demonstration</div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-gray-300 bg-gray-900 mx-auto block"
        />
        <div className="text-xs text-gray-600 text-center mt-2">
          Photons hit the metal surface. If energy E = hf ≥ work function φ, electrons are ejected.
        </div>
      </div>

      {/* Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Light Parameters</div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Frequency: {frequency} THz ({getWavelength(frequency).toFixed(0)} nm)
            </label>
            <input
              type="range"
              min="300"
              max="1000"
              step="10"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">
              Photon Energy: {getPhotonEnergy(frequency).toFixed(2)} eV
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Intensity: {intensity}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">
              More photons per second
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Metal Surface
          </label>
          <div className="grid grid-cols-5 gap-2">
            {Object.keys(metals).map(m => (
              <button
                key={m}
                onClick={() => {
                  setMetal(m);
                  setElectrons([]);
                  setEjectedCount(0);
                }}
                className={`px-3 py-2 text-xs rounded ${
                  metal === m
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
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
              setElectrons([]);
              setEjectedCount(0);
              setPhotonTime(0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Reset
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Electrons ejected: {ejectedCount}
        </div>
      </div>

      {/* Analysis */}
      <div className={`border border-gray-200 rounded-lg p-4 ${canEject() ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="text-sm font-semibold text-gray-900 mb-2">
          {canEject() ? '✓ Photoelectric Effect Occurs' : '✗ No Photoelectric Effect'}
        </div>
        <div className="text-sm text-gray-700 space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Photon Energy:</strong> {getPhotonEnergy(frequency).toFixed(2)} eV
            </div>
            <div>
              <strong>Work Function:</strong> {metals[metal].workFunction.toFixed(2)} eV
            </div>
            <div>
              <strong>Threshold Frequency:</strong> {getThresholdFrequency().toFixed(0)} THz
            </div>
            <div>
              <strong>Max KE:</strong> {getMaxKineticEnergy().toFixed(2)} eV
            </div>
          </div>
          {!canEject() && (
            <div className="text-red-700 mt-3">
              💡 Increase frequency above {getThresholdFrequency().toFixed(0)} THz to eject electrons
            </div>
          )}
          {canEject() && (
            <div className="text-green-700 mt-3">
              💡 Higher intensity = more electrons ejected, but same max kinetic energy
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
        <div className="text-sm text-purple-900">
          <p className="font-medium mb-2">🎯 Key Insights:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Only light above threshold frequency ejects electrons (proves photon theory)</li>
            <li>Higher frequency → higher kinetic energy of ejected electrons</li>
            <li>Higher intensity → more electrons ejected (not higher energy)</li>
            <li>Einstein's equation: KE<sub>max</sub> = hf - φ</li>
            <li>Different metals have different work functions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
