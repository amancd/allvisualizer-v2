'use client';

import { useState, useRef, useEffect } from 'react';

export default function EMInductionVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Magnet state
  const [magnetPosition, setMagnetPosition] = useState(50); // Y position (0-500)
  const [magnetVelocity, setMagnetVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  
  // Simulation parameters
  const [numTurns, setNumTurns] = useState(10);
  const [magnetStrength, setMagnetStrength] = useState(5);
  const [autoMove, setAutoMove] = useState(false);
  
  // Physics values
  const [inducedEMF, setInducedEMF] = useState(0);
  const [inducedCurrent, setInducedCurrent] = useState(0);
  const [magneticFlux, setMagneticFlux] = useState(0);
  const [fluxHistory, setFluxHistory] = useState<number[]>([]);
  const [emfHistory, setEmfHistory] = useState<number[]>([]);
  
  const canvasWidth = 600;
  const canvasHeight = 500;
  const coilCenterY = 250;
  const coilHeight = 120;
  const coilWidth = 200;
  const resistance = 10; // Ohms
  
  // Calculate flux based on magnet position
  const calculateFlux = (position: number) => {
    // Distance from coil center
    const distance = Math.abs(position - coilCenterY);
    const maxDistance = 200;
    
    // Flux is high when magnet is in/near coil, low when far
    // Using inverse square approximation
    const distanceFactor = Math.max(0, 1 - (distance / maxDistance));
    const flux = magnetStrength * distanceFactor * distanceFactor * numTurns;
    
    return flux;
  };

  useEffect(() => {
    const currentFlux = calculateFlux(magnetPosition);
    setMagneticFlux(currentFlux);
    
    // Calculate induced EMF from rate of change of flux
    if (fluxHistory.length > 0) {
      const previousFlux = fluxHistory[fluxHistory.length - 1];
      const dFlux = currentFlux - previousFlux;
      const dt = 0.016; // Approximate frame time (60fps)
      const emf = -dFlux / dt; // Faraday's law
      
      setInducedEMF(emf);
      setInducedCurrent(emf / resistance);
    }
    
    // Update history
    setFluxHistory(prev => [...prev.slice(-50), currentFlux]);
    setEmfHistory(prev => [...prev.slice(-50), inducedEMF]);
    
  }, [magnetPosition, numTurns, magnetStrength]);

  useEffect(() => {
    if (autoMove) {
      let direction = 1;
      let position = magnetPosition;
      let time = 0;
      
      const animate = () => {
        time += 0.016;
        
        // Oscillate magnet up and down
        position = coilCenterY + Math.sin(time * 2) * 150;
        const velocity = Math.cos(time * 2) * 150 * 2;
        
        setMagnetPosition(position);
        setMagnetVelocity(velocity);
        
        if (autoMove) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [autoMove]);

  useEffect(() => {
    drawScene();
  }, [magnetPosition, inducedCurrent, magneticFlux, numTurns]);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw coil
    const coilX = canvasWidth / 2;
    
    // Draw coil turns
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    
    for (let i = 0; i < numTurns; i++) {
      const offset = (i - numTurns/2) * 3;
      
      // Left side of coil
      ctx.beginPath();
      ctx.arc(coilX - coilWidth/2, coilCenterY, coilHeight/2, Math.PI/2, -Math.PI/2, true);
      ctx.stroke();
      
      // Right side of coil
      ctx.beginPath();
      ctx.arc(coilX + coilWidth/2, coilCenterY, coilHeight/2, -Math.PI/2, Math.PI/2, true);
      ctx.stroke();
    }
    
    // Draw coil connections/wires
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Top wire
    ctx.beginPath();
    ctx.moveTo(coilX - coilWidth/2, coilCenterY - coilHeight/2);
    ctx.lineTo(coilX + coilWidth/2, coilCenterY - coilHeight/2);
    ctx.stroke();
    
    // Bottom wire
    ctx.beginPath();
    ctx.moveTo(coilX - coilWidth/2, coilCenterY + coilHeight/2);
    ctx.lineTo(coilX + coilWidth/2, coilCenterY + coilHeight/2);
    ctx.stroke();
    
    // Draw current flow arrows if there's induced current
    if (Math.abs(inducedCurrent) > 0.1) {
      const arrowColor = inducedCurrent > 0 ? '#10b981' : '#ef4444';
      ctx.fillStyle = arrowColor;
      ctx.strokeStyle = arrowColor;
      ctx.lineWidth = 2;
      
      const numArrows = 4;
      for (let i = 0; i < numArrows; i++) {
        const angle = (i / numArrows) * Math.PI * 2 + (Date.now() / 500);
        
        // Draw arrows on left side
        const leftX = coilX - coilWidth/2 + Math.cos(angle) * 10;
        const leftY = coilCenterY + Math.sin(angle) * (coilHeight/2);
        
        ctx.beginPath();
        if (inducedCurrent > 0) {
          // Arrows going up on left
          ctx.moveTo(leftX, leftY);
          ctx.lineTo(leftX - 5, leftY + 8);
          ctx.lineTo(leftX + 5, leftY + 8);
        } else {
          // Arrows going down on left
          ctx.moveTo(leftX, leftY);
          ctx.lineTo(leftX - 5, leftY - 8);
          ctx.lineTo(leftX + 5, leftY - 8);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
    
    // Draw magnetic field lines from magnet
    ctx.strokeStyle = magnetPosition < coilCenterY ? '#8b5cf6' : '#a78bfa';
    ctx.lineWidth = 1.5;
    
    const numFieldLines = 8;
    for (let i = 0; i < numFieldLines; i++) {
      const angle = (i / numFieldLines) * Math.PI - Math.PI/2;
      const x1 = coilX + Math.cos(angle) * 30;
      const y1 = magnetPosition + Math.sin(angle) * 30;
      const x2 = coilX + Math.cos(angle) * 80;
      const y2 = magnetPosition + Math.sin(angle) * 80;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(
        coilX + Math.cos(angle) * 55,
        magnetPosition + Math.sin(angle) * 100,
        x2,
        y2 + 50
      );
      ctx.stroke();
    }
    
    // Draw magnet
    const magnetWidth = 60;
    const magnetHeight = 40;
    
    // North pole (red)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(
      coilX - magnetWidth/2,
      magnetPosition - magnetHeight/2,
      magnetWidth,
      magnetHeight/2
    );
    
    // South pole (blue)
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(
      coilX - magnetWidth/2,
      magnetPosition,
      magnetWidth,
      magnetHeight/2
    );
    
    // Magnet border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      coilX - magnetWidth/2,
      magnetPosition - magnetHeight/2,
      magnetWidth,
      magnetHeight
    );
    
    // Labels on magnet
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', coilX, magnetPosition - magnetHeight/4);
    ctx.fillText('S', coilX, magnetPosition + magnetHeight/4);
    
    // Direction indicator
    ctx.fillStyle = '#000000';
    ctx.font = '12px sans-serif';
    if (magnetVelocity > 0.5) {
      ctx.fillText('↓ Moving Down', coilX + 80, magnetPosition);
    } else if (magnetVelocity < -0.5) {
      ctx.fillText('↑ Moving Up', coilX + 80, magnetPosition);
    }
    
    // Draw flux indicator through coil
    const fluxIndicatorStrength = Math.min(Math.abs(magneticFlux) / 50, 1);
    ctx.fillStyle = `rgba(139, 92, 246, ${fluxIndicatorStrength * 0.3})`;
    ctx.fillRect(
      coilX - coilWidth/2,
      coilCenterY - coilHeight/2,
      coilWidth,
      coilHeight
    );
    
    // Coil center label
    ctx.fillStyle = '#000000';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Coil (${numTurns} turns)`, coilX - coilWidth/2 - 10, coilCenterY);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    // Check if clicking near magnet
    if (Math.abs(y - magnetPosition) < 30) {
      setIsDragging(true);
      setDragStartY(y);
      setAutoMove(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    
    const newPosition = Math.max(50, Math.min(450, y));
    const velocity = (newPosition - magnetPosition) / 0.016;
    
    setMagnetPosition(newPosition);
    setMagnetVelocity(velocity);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Electromagnetic Induction Demonstration</div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="border border-gray-300 bg-white mx-auto block cursor-pointer"
        />
        <div className="text-xs text-gray-600 text-center mt-2">
          Drag the magnet up and down through the coil
        </div>
      </div>

      {/* Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Parameters</div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Number of Turns: {numTurns}
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={numTurns}
              onChange={(e) => setNumTurns(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Magnet Strength: {magnetStrength}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={magnetStrength}
              onChange={(e) => setMagnetStrength(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setAutoMove(!autoMove)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              autoMove 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {autoMove ? 'Stop Auto Motion' : 'Start Auto Motion'}
          </button>
          <button
            onClick={() => {
              setMagnetPosition(50);
              setMagnetVelocity(0);
              setAutoMove(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Reset Position
          </button>
        </div>
      </div>

      {/* Real-time Measurements */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Real-Time Measurements</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Magnetic Flux</div>
            <div className="text-lg font-bold text-purple-600">{magneticFlux.toFixed(2)} Wb</div>
            <div className="text-xs text-gray-500">Through coil</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Induced EMF</div>
            <div className={`text-lg font-bold ${inducedEMF > 0 ? 'text-green-600' : inducedEMF < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {inducedEMF.toFixed(2)} V
            </div>
            <div className="text-xs text-gray-500">Faraday's Law</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Induced Current</div>
            <div className={`text-lg font-bold ${inducedCurrent > 0 ? 'text-green-600' : inducedCurrent < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {inducedCurrent.toFixed(2)} A
            </div>
            <div className="text-xs text-gray-500">I = EMF / R</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Velocity</div>
            <div className="text-lg font-bold text-blue-600">
              {Math.abs(magnetVelocity).toFixed(1)} px/s
            </div>
            <div className="text-xs text-gray-500">Magnet speed</div>
          </div>
        </div>
      </div>

      {/* Graphs */}
      {fluxHistory.length > 10 && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-xs font-semibold text-gray-700 mb-3">Graphs</div>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Flux Graph */}
            <div className="bg-white border border-gray-200 rounded p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Magnetic Flux vs Time</div>
              <svg width="250" height="150" className="mx-auto">
                <polyline
                  points={fluxHistory.map((f, i) => {
                    const x = (i / fluxHistory.length) * 240 + 5;
                    const maxFlux = Math.max(...fluxHistory.map(Math.abs), 1);
                    const y = 75 - (f / maxFlux) * 60;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                />
                <line x1="5" y1="10" x2="5" y2="140" stroke="#666" strokeWidth="1" />
                <line x1="5" y1="75" x2="245" y2="75" stroke="#999" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="5" y1="140" x2="245" y2="140" stroke="#666" strokeWidth="1" />
                <text x="125" y="155" fontSize="10" textAnchor="middle" fill="#666">Time</text>
                <text x="-70" y="8" fontSize="10" textAnchor="middle" fill="#666" transform="rotate(-90)">Flux (Wb)</text>
              </svg>
            </div>

            {/* EMF Graph */}
            <div className="bg-white border border-gray-200 rounded p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">Induced EMF vs Time</div>
              <svg width="250" height="150" className="mx-auto">
                <polyline
                  points={emfHistory.map((e, i) => {
                    const x = (i / emfHistory.length) * 240 + 5;
                    const maxEMF = Math.max(...emfHistory.map(Math.abs), 1);
                    const y = 75 - (e / maxEMF) * 60;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <line x1="5" y1="10" x2="5" y2="140" stroke="#666" strokeWidth="1" />
                <line x1="5" y1="75" x2="245" y2="75" stroke="#999" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="5" y1="140" x2="245" y2="140" stroke="#666" strokeWidth="1" />
                <text x="125" y="155" fontSize="10" textAnchor="middle" fill="#666">Time</text>
                <text x="-70" y="8" fontSize="10" textAnchor="middle" fill="#666" transform="rotate(-90)">EMF (V)</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-purple-50">
        <div className="text-sm text-purple-900">
          <p className="font-medium mb-2">💡 How to Use:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Drag the magnet</strong> up and down through the coil with your mouse</li>
            <li><strong>Moving faster</strong> creates larger induced EMF and current</li>
            <li><strong>Direction matters:</strong> Moving down induces opposite current from moving up (Lenz's Law)</li>
            <li><strong>More turns</strong> multiply the induced EMF (N times larger)</li>
            <li><strong>Stronger magnet</strong> creates more magnetic flux</li>
            <li><strong>Auto motion</strong> oscillates the magnet to show continuous induction</li>
            <li><strong>No motion = no EMF:</strong> Static magnetic field produces zero induced EMF</li>
            <li>Watch the current arrows change direction based on magnet motion</li>
          </ul>
        </div>
      </div>

      {/* Lenz's Law Explanation */}
      <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-2">🧲 Lenz's Law in Action:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>North pole approaching:</strong> Induced current creates north pole facing magnet (repulsion)</li>
            <li><strong>North pole receding:</strong> Induced current creates south pole facing magnet (attraction)</li>
            <li><strong>Result:</strong> Induced effects always oppose the motion causing them</li>
            <li><strong>Energy conservation:</strong> You must do work to move the magnet against this opposition</li>
            <li>The arrows show induced current direction - green when EMF is positive, red when negative</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
