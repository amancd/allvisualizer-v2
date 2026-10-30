'use client';

import { useState, useEffect, useRef } from 'react';

export default function NewtonsLawsVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  // Parameters
  const [mass, setMass] = useState(10); // kg
  const [appliedForce, setAppliedForce] = useState(50); // N
  const [frictionCoefficient, setFrictionCoefficient] = useState(0.2);
  const [selectedLaw, setSelectedLaw] = useState<1 | 2 | 3>(2); // Default to 2nd law
  
  // Physics state
  const [position, setPosition] = useState(0); // meters
  const [velocity, setVelocity] = useState(0); // m/s
  const [acceleration, setAcceleration] = useState(0); // m/s²
  const [currentTime, setCurrentTime] = useState(0);
  
  // Constants
  const gravity = 9.81; // m/s²
  const normalForce = mass * gravity;
  const frictionForce = frictionCoefficient * normalForce;
  const netForce = appliedForce - frictionForce;
  
  // Calculate acceleration (F = ma)
  useEffect(() => {
    const acc = netForce / mass;
    setAcceleration(acc);
  }, [mass, netForce]);
  
  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;
    
    const startTime = Date.now();
    let lastTime = startTime;
    
    const animate = () => {
      const now = Date.now();
      const dt = (now - lastTime) / 1000; // seconds
      lastTime = now;
      
      const elapsed = (now - startTime) / 1000;
      
      if (elapsed >= 5) { // 5 second animation
        setIsAnimating(false);
        return;
      }
      
      // Update physics (F = ma, v = v0 + at, x = x0 + vt + 0.5at²)
      setVelocity(v => {
        const newV = v + acceleration * dt;
        return newV;
      });
      
      setPosition(x => {
        const newX = x + velocity * dt + 0.5 * acceleration * dt * dt;
        return Math.max(0, newX); // Don't go backwards
      });
      
      setCurrentTime(elapsed);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, acceleration, velocity]);
  
  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ground
    const groundY = canvas.height - 100;
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();
    
    // Ground pattern
    ctx.strokeStyle = '#A0522D';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, groundY);
      ctx.lineTo(i + 10, groundY + 10);
      ctx.stroke();
    }
    
    // Box
    const boxSize = 60;
    const boxX = 100 + position * 5; // Scale position for display
    const boxY = groundY - boxSize;
    
    // Draw box
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(boxX, boxY, boxSize, boxSize);
    ctx.strokeStyle = '#1E40AF';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxSize, boxSize);
    
    // Mass label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass} kg`, boxX + boxSize / 2, boxY + boxSize / 2 + 5);
    
    // Draw forces as arrows
    const centerX = boxX + boxSize / 2;
    const centerY = boxY + boxSize / 2;
    
    // Applied force (right)
    if (appliedForce > 0) {
      drawArrow(ctx, centerX + boxSize / 2, centerY, appliedForce * 2, 0, '#10B981', `F = ${appliedForce}N`);
    }
    
    // Friction force (left)
    if (frictionForce > 0 && velocity >= 0) {
      drawArrow(ctx, centerX - boxSize / 2, centerY, -frictionForce * 2, 0, '#EF4444', `f = ${frictionForce.toFixed(1)}N`);
    }
    
    // Normal force (up)
    drawArrow(ctx, centerX, boxY, 0, -40, '#8B5CF6', `N = ${normalForce.toFixed(1)}N`);
    
    // Weight (down)
    drawArrow(ctx, centerX, boxY + boxSize, 0, 40, '#F59E0B', `W = ${normalForce.toFixed(1)}N`);
    
    // Net force indicator
    if (Math.abs(netForce) > 0.1) {
      ctx.fillStyle = netForce > 0 ? '#10B981' : '#EF4444';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Net Force: ${netForce.toFixed(1)} N`, 20, 30);
      ctx.fillText(`Acceleration: ${acceleration.toFixed(2)} m/s²`, 20, 55);
    } else {
      ctx.fillStyle = '#6B7280';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Net Force: 0 N (Equilibrium)', 20, 30);
      ctx.fillText('Acceleration: 0 m/s²', 20, 55);
    }
    
  }, [position, mass, appliedForce, frictionForce, normalForce, netForce, acceleration, velocity]);
  
  // Helper function to draw arrows
  function drawArrow(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    dx: number,
    dy: number,
    color: string,
    label: string
  ) {
    const endX = startX + dx;
    const endY = startY + dy;
    
    // Arrow line
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Arrow head
    const angle = Math.atan2(dy, dx);
    const headLength = 10;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
    
    // Label
    ctx.fillStyle = color;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, endX + dx * 0.2, endY + dy * 0.2 - 10);
  }
  
  const handleStart = () => {
    setPosition(0);
    setVelocity(0);
    setCurrentTime(0);
    setIsAnimating(true);
  };
  
  const handleReset = () => {
    setIsAnimating(false);
    setPosition(0);
    setVelocity(0);
    setCurrentTime(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return (
    <div className="space-y-6">
      {/* Law Selector */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Newton's Law</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setSelectedLaw(1)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedLaw === 1
                ? 'border-gray-900 bg-gray-200'
                : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
          >
            <div className="text-2xl mb-2">1️⃣</div>
            <div className="font-semibold text-sm mb-1">First Law</div>
            <div className="text-xs text-gray-600">Law of Inertia</div>
          </button>
          
          <button
            onClick={() => setSelectedLaw(2)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedLaw === 2
                ? 'border-gray-900 bg-gray-200'
                : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
          >
            <div className="text-2xl mb-2">2️⃣</div>
            <div className="font-semibold text-sm mb-1">Second Law</div>
            <div className="text-xs text-gray-600">F = ma</div>
          </button>
          
          <button
            onClick={() => setSelectedLaw(3)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedLaw === 3
                ? 'border-gray-900 bg-gray-200'
                : 'border-gray-200 bg-white hover:border-gray-400'
            }`}
          >
            <div className="text-2xl mb-2">3️⃣</div>
            <div className="font-semibold text-sm mb-1">Third Law</div>
            <div className="text-xs text-gray-600">Action-Reaction</div>
          </button>
        </div>
        
        {/* Law Explanation */}
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300">
          {selectedLaw === 1 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">First Law (Law of Inertia)</h4>
              <p className="text-sm text-gray-700">
                An object at rest stays at rest, and an object in motion stays in motion with constant velocity, 
                unless acted upon by a net external force.
              </p>
            </div>
          )}
          {selectedLaw === 2 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Second Law (F = ma)</h4>
              <p className="text-sm text-gray-700">
                The acceleration of an object is directly proportional to the net force acting on it and 
                inversely proportional to its mass: <strong>F<sub>net</sub> = m × a</strong>
              </p>
            </div>
          )}
          {selectedLaw === 3 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Third Law (Action-Reaction)</h4>
              <p className="text-sm text-gray-700">
                For every action, there is an equal and opposite reaction. Forces always occur in pairs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full border border-gray-300 rounded"
        />
      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parameters</h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Mass */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mass (kg): {mass}
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={mass}
              onChange={(e) => setMass(Number(e.target.value))}
              disabled={isAnimating}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 kg</span>
              <span>50 kg</span>
            </div>
          </div>

          {/* Applied Force */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applied Force (N): {appliedForce}
            </label>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={appliedForce}
              onChange={(e) => setAppliedForce(Number(e.target.value))}
              disabled={isAnimating}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 N</span>
              <span>200 N</span>
            </div>
          </div>

          {/* Friction Coefficient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Friction Coefficient (μ): {frictionCoefficient.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={frictionCoefficient}
              onChange={(e) => setFrictionCoefficient(Number(e.target.value))}
              disabled={isAnimating}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 (Frictionless)</span>
              <span>1 (High Friction)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleStart}
            disabled={isAnimating}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAnimating ? 'Running...' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Physics Data */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Physics Data</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Position</div>
            <div className="text-2xl font-bold text-gray-900">{position.toFixed(2)} m</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Velocity</div>
            <div className="text-2xl font-bold text-gray-900">{velocity.toFixed(2)} m/s</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Acceleration</div>
            <div className="text-2xl font-bold text-cyan-600">{acceleration.toFixed(2)} m/s²</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Net Force</div>
            <div className="text-2xl font-bold text-green-600">{netForce.toFixed(2)} N</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Friction Force</div>
            <div className="text-2xl font-bold text-red-600">{frictionForce.toFixed(2)} N</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Time</div>
            <div className="text-2xl font-bold text-gray-900">{currentTime.toFixed(2)} s</div>
          </div>
        </div>
      </div>

      {/* Formulas */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Formulas</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="bg-gray-200 text-gray-900 px-3 py-1 rounded font-mono text-xs">
              F<sub>net</sub> = ma
            </div>
            <div className="text-gray-700">Newton's Second Law</div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded font-mono text-xs">
              f = μN
            </div>
            <div className="text-gray-700">Friction force (μ = coefficient, N = normal force)</div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded font-mono text-xs">
              v = v₀ + at
            </div>
            <div className="text-gray-700">Velocity with constant acceleration</div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-gray-200 text-gray-900 px-3 py-1 rounded font-mono text-xs">
              x = x₀ + v₀t + ½at²
            </div>
            <div className="text-gray-700">Position with constant acceleration</div>
          </div>
        </div>
      </div>
    </div>
  );
}
