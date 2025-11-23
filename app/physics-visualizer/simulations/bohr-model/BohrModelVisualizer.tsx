'use client';

import { useState, useRef, useEffect } from 'react';

export default function BohrModelVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [angle, setAngle] = useState(0);
  const [showOrbits, setShowOrbits] = useState(true);
  const [emittedPhotons, setEmittedPhotons] = useState<{level: number, energy: number, wavelength: number, x: number, y: number, life: number}[]>([]);
  
  const canvasWidth = 600;
  const canvasHeight = 500;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  const getEnergyLevel = (n: number): number => {
    return -13.6 / (n * n); // eV
  };

  const getOrbitalRadius = (n: number): number => {
    const baseRadius = 40;
    return baseRadius * n * n / 4; // Scaled for visualization
  };

  const getTransitionEnergy = (n1: number, n2: number): number => {
    return Math.abs(getEnergyLevel(n2) - getEnergyLevel(n1));
  };

  const getWavelength = (energyEV: number): number => {
    // E = hc/λ, λ = hc/E
    const h = 6.626e-34; // J·s
    const c = 3e8; // m/s
    const eV = 1.602e-19; // J
    return (h * c) / (energyEV * eV) * 1e9; // in nm
  };

  const getPhotonColor = (wavelength: number): string => {
    if (wavelength < 380) return '#8b5cf6'; // UV
    if (wavelength < 450) return '#6366f1'; // Violet
    if (wavelength < 495) return '#3b82f6'; // Blue
    if (wavelength < 570) return '#10b981'; // Green
    if (wavelength < 590) return '#fbbf24'; // Yellow
    if (wavelength < 620) return '#f97316'; // Orange
    if (wavelength < 750) return '#ef4444'; // Red
    return '#991b1b'; // IR
  };

  const transitionTo = (newLevel: number) => {
    if (newLevel === currentLevel || isTransitioning) return;
    
    setTargetLevel(newLevel);
    setIsTransitioning(true);
    setTransitionProgress(0);

    // If de-excitation (downward transition), emit photon
    if (newLevel < currentLevel) {
      const energy = getTransitionEnergy(currentLevel, newLevel);
      const wavelength = getWavelength(energy);
      const currentRadius = getOrbitalRadius(currentLevel);
      
      setEmittedPhotons(prev => [...prev, {
        level: currentLevel,
        energy,
        wavelength,
        x: centerX + currentRadius,
        y: centerY,
        life: 1.0
      }]);
    }
  };

  useEffect(() => {
    const animate = () => {
      setAngle(a => (a + 0.02) % (2 * Math.PI));
      
      if (isTransitioning) {
        setTransitionProgress(p => {
          const newProgress = p + 0.03;
          if (newProgress >= 1) {
            setIsTransitioning(false);
            setCurrentLevel(targetLevel);
            return 0;
          }
          return newProgress;
        });
      }

      // Update photons
      setEmittedPhotons(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + 3,
          y: p.y - 1,
          life: p.life - 0.015
        })).filter(p => p.life > 0)
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTransitioning, targetLevel]);

  useEffect(() => {
    drawScene();
  }, [angle, currentLevel, transitionProgress, isTransitioning, showOrbits, emittedPhotons]);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw nucleus
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('p⁺', centerX, centerY + 3);

    // Draw orbits and energy levels
    for (let n = 1; n <= 6; n++) {
      const radius = getOrbitalRadius(n);
      
      if (showOrbits) {
        ctx.strokeStyle = n === currentLevel ? '#60a5fa' : 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = n === currentLevel ? 2 : 1;
        ctx.setLineDash(n === currentLevel ? [] : [5, 5]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Energy level labels
      ctx.fillStyle = n === currentLevel ? '#60a5fa' : '#94a3b8';
      ctx.font = n === currentLevel ? 'bold 12px sans-serif' : '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`n=${n}`, centerX + radius + 10, centerY);
      ctx.font = '10px sans-serif';
      ctx.fillText(`${getEnergyLevel(n).toFixed(2)} eV`, centerX + radius + 10, centerY + 14);
    }

    // Draw electron
    let electronRadius = getOrbitalRadius(currentLevel);
    let electronAngle = angle;

    if (isTransitioning) {
      const startRadius = getOrbitalRadius(currentLevel);
      const endRadius = getOrbitalRadius(targetLevel);
      electronRadius = startRadius + (endRadius - startRadius) * transitionProgress;
    }

    const electronX = centerX + electronRadius * Math.cos(electronAngle);
    const electronY = centerY + electronRadius * Math.sin(electronAngle);

    // Electron glow
    const gradient = ctx.createRadialGradient(electronX, electronY, 0, electronX, electronY, 15);
    gradient.addColorStop(0, 'rgba(96, 165, 250, 0.8)');
    gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(electronX, electronY, 15, 0, 2 * Math.PI);
    ctx.fill();

    // Electron
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(electronX, electronY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('e⁻', electronX, electronY + 2);

    // Draw emitted photons
    emittedPhotons.forEach(photon => {
      const color = getPhotonColor(photon.wavelength);
      ctx.globalAlpha = photon.life;
      
      // Photon wave
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 20; i++) {
        const x = photon.x + i * 2;
        const y = photon.y + Math.sin(i * 0.5) * 5;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Photon particle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(photon.x, photon.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.globalAlpha = 1;
    });

    // Draw title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Bohr Model - Hydrogen Atom', 20, 30);

    // Current state info
    ctx.font = '14px sans-serif';
    ctx.fillText(`Current State: n = ${currentLevel}`, 20, 55);
    ctx.fillText(`Energy: ${getEnergyLevel(currentLevel).toFixed(2)} eV`, 20, 75);
    
    if (isTransitioning) {
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`Transitioning to n = ${targetLevel}...`, 20, 95);
    }
  };

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

      {/* Energy Level Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Electron Energy Level</div>
        
        <div className="grid grid-cols-6 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <button
              key={n}
              onClick={() => transitionTo(n)}
              disabled={isTransitioning}
              className={`px-3 py-2 text-sm rounded ${
                currentLevel === n
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50'
              }`}
            >
              n = {n}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowOrbits(!showOrbits)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              showOrbits 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {showOrbits ? 'Hide' : 'Show'} Orbits
          </button>
          <button
            onClick={() => {
              setCurrentLevel(1);
              setTargetLevel(1);
              setIsTransitioning(false);
              setEmittedPhotons([]);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Reset to Ground State
          </button>
        </div>
      </div>

      {/* Quick Transitions */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Common Transitions</div>
        <div className="grid md:grid-cols-3 gap-2">
          <button
            onClick={() => {
              if (currentLevel !== 3) {
                transitionTo(3);
                setTimeout(() => transitionTo(2), 1500);
              }
            }}
            disabled={isTransitioning}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            3→2 (Balmer Hα, 656nm)
          </button>
          <button
            onClick={() => {
              if (currentLevel !== 4) {
                transitionTo(4);
                setTimeout(() => transitionTo(2), 1500);
              }
            }}
            disabled={isTransitioning}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            4→2 (Balmer Hβ, 486nm)
          </button>
          <button
            onClick={() => {
              if (currentLevel !== 2) {
                transitionTo(2);
                setTimeout(() => transitionTo(1), 1500);
              }
            }}
            disabled={isTransitioning}
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            2→1 (Lyman α, 121nm)
          </button>
        </div>
      </div>

      {/* Energy Level Diagram */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Energy Level Diagram</div>
        <div className="bg-white p-4 rounded border border-gray-200">
          {[6, 5, 4, 3, 2, 1].map(n => {
            const energy = getEnergyLevel(n);
            return (
              <div key={n} className="flex items-center gap-4 mb-2">
                <div className={`flex-1 h-2 rounded ${
                  currentLevel === n ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <div className="w-16 text-sm font-mono text-gray-700">
                  n = {n}
                </div>
                <div className="w-32 text-sm text-gray-600">
                  {energy.toFixed(2)} eV
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
        <div className="text-sm text-purple-900">
          <p className="font-medium mb-2">💡 Key Concepts:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Energy levels are quantized: E<sub>n</sub> = -13.6/n² eV</li>
            <li>Ground state (n=1) has lowest energy at -13.6 eV</li>
            <li>Photon emitted when electron drops to lower level</li>
            <li>Photon energy: ΔE = E<sub>final</sub> - E<sub>initial</sub></li>
            <li>Balmer series (n→2) produces visible light</li>
            <li>Higher n levels are closer together in energy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
