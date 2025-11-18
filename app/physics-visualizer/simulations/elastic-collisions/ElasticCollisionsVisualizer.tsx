'use client';

import { useState, useEffect, useRef } from 'react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
}

export default function ElasticCollisionsVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [balls, setBalls] = useState<Ball[]>([
    { x: 150, y: 200, vx: 50, vy: 0, mass: 1, radius: 20, color: '#3b82f6' },
    { x: 450, y: 200, vx: -30, vy: 0, mass: 1, radius: 20, color: '#ef4444' }
  ]);
  
  const [ball1Mass, setBall1Mass] = useState(1);
  const [ball2Mass, setBall2Mass] = useState(1);
  const [ball1Velocity, setBall1Velocity] = useState(50);
  const [ball2Velocity, setBall2Velocity] = useState(-30);
  const [gravity, setGravity] = useState(0);
  const [showVectors, setShowVectors] = useState(true);
  const [showTrails, setShowTrails] = useState(false);
  const [collisionCount, setCollisionCount] = useState(0);
  const [trails, setTrails] = useState<{x: number, y: number, color: string}[]>([]);

  const WIDTH = 600;
  const HEIGHT = 400;
  const GROUND = HEIGHT - 50;

  const resetSimulation = () => {
    setIsPlaying(false);
    setCollisionCount(0);
    setTrails([]);
    setBalls([
      { x: 150, y: 200, vx: ball1Velocity, vy: 0, mass: ball1Mass, radius: 15 + ball1Mass * 5, color: '#3b82f6' },
      { x: 450, y: 200, vx: ball2Velocity, vy: 0, mass: ball2Mass, radius: 15 + ball2Mass * 5, color: '#ef4444' }
    ]);
  };

  useEffect(() => {
    resetSimulation();
  }, [ball1Mass, ball2Mass, ball1Velocity, ball2Velocity, gravity]);

  const checkCollision = (b1: Ball, b2: Ball): boolean => {
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < b1.radius + b2.radius;
  };

  const handleCollision = (b1: Ball, b2: Ball) => {
    // Calculate relative position and velocity
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize collision vector
    const nx = dx / distance;
    const ny = dy / distance;
    
    // Relative velocity
    const dvx = b1.vx - b2.vx;
    const dvy = b1.vy - b2.vy;
    
    // Relative velocity in collision normal direction
    const dvn = dvx * nx + dvy * ny;
    
    // Do not resolve if velocities are separating
    if (dvn > 0) return;
    
    // Elastic collision formula (conservation of momentum and energy)
    const impulse = (2 * dvn) / (b1.mass + b2.mass);
    
    b1.vx -= impulse * b2.mass * nx;
    b1.vy -= impulse * b2.mass * ny;
    b2.vx += impulse * b1.mass * nx;
    b2.vy += impulse * b1.mass * ny;
    
    // Separate balls to prevent overlap
    const overlap = b1.radius + b2.radius - distance;
    const separationX = (overlap / 2) * nx;
    const separationY = (overlap / 2) * ny;
    
    b1.x -= separationX;
    b1.y -= separationY;
    b2.x += separationX;
    b2.y += separationY;
    
    setCollisionCount(prev => prev + 1);
  };

  const animate = () => {
    if (!isPlaying) return;
    
    const dt = 0.016; // ~60 fps
    const newBalls = [...balls];
    const newTrails = showTrails ? [...trails] : [];
    
    // Update positions and velocities
    newBalls.forEach((ball, index) => {
      // Add trail
      if (showTrails && Math.random() < 0.3) {
        newTrails.push({ x: ball.x, y: ball.y, color: ball.color });
        if (newTrails.length > 200) newTrails.shift();
      }
      
      // Apply gravity
      ball.vy += gravity * dt;
      
      // Update position
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      
      // Wall collisions
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx = Math.abs(ball.vx);
      }
      if (ball.x + ball.radius > WIDTH) {
        ball.x = WIDTH - ball.radius;
        ball.vx = -Math.abs(ball.vx);
      }
      
      // Floor collision
      if (ball.y + ball.radius > GROUND) {
        ball.y = GROUND - ball.radius;
        ball.vy = -Math.abs(ball.vy) * 0.95; // Some energy loss
      }
      
      // Ceiling collision
      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy = Math.abs(ball.vy);
      }
    });
    
    // Check ball-ball collisions
    if (checkCollision(newBalls[0], newBalls[1])) {
      handleCollision(newBalls[0], newBalls[1]);
    }
    
    setBalls(newBalls);
    if (showTrails) setTrails(newTrails);
    
    // Draw
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Draw trails
    if (showTrails) {
      newTrails.forEach((point, i) => {
        const alpha = i / newTrails.length;
        ctx.fillStyle = point.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
      });
    }
    
    // Draw ground
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(0, GROUND, WIDTH, HEIGHT - GROUND);
    
    // Draw center line
    ctx.strokeStyle = '#9ca3af';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, GROUND);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw balls
    newBalls.forEach((ball) => {
      // Ball shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.ellipse(ball.x, GROUND + 5, ball.radius * 0.8, ball.radius * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Ball
      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Ball outline
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Mass label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${ball.mass}kg`, ball.x, ball.y);
      
      // Velocity vectors
      if (showVectors) {
        const scale = 2;
        ctx.strokeStyle = ball.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(ball.x + ball.vx * scale, ball.y + ball.vy * scale);
        ctx.stroke();
        
        // Arrow head
        const angle = Math.atan2(ball.vy, ball.vx);
        const arrowLength = 10;
        ctx.beginPath();
        ctx.moveTo(ball.x + ball.vx * scale, ball.y + ball.vy * scale);
        ctx.lineTo(
          ball.x + ball.vx * scale - arrowLength * Math.cos(angle - Math.PI / 6),
          ball.y + ball.vy * scale - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(ball.x + ball.vx * scale, ball.y + ball.vy * scale);
        ctx.lineTo(
          ball.x + ball.vx * scale - arrowLength * Math.cos(angle + Math.PI / 6),
          ball.y + ball.vy * scale - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }
    });
    
    // Draw stats
    const totalMomentumX = newBalls.reduce((sum, ball) => sum + ball.mass * ball.vx, 0);
    const totalMomentumY = newBalls.reduce((sum, ball) => sum + ball.mass * ball.vy, 0);
    const totalKE = newBalls.reduce((sum, ball) => sum + 0.5 * ball.mass * (ball.vx * ball.vx + ball.vy * ball.vy), 0);
    
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`Collisions: ${collisionCount}`, 10, 20);
    ctx.fillText(`Total Momentum X: ${totalMomentumX.toFixed(1)} kg·m/s`, 10, 40);
    ctx.fillText(`Total Momentum Y: ${totalMomentumY.toFixed(1)} kg·m/s`, 10, 60);
    ctx.fillText(`Total KE: ${totalKE.toFixed(1)} J`, 10, 80);
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, balls, showVectors, showTrails]);

  const calculateMomentum = (ball: Ball) => {
    const p = Math.sqrt((ball.mass * ball.vx) ** 2 + (ball.mass * ball.vy) ** 2);
    return p.toFixed(1);
  };

  const calculateKE = (ball: Ball) => {
    const ke = 0.5 * ball.mass * (ball.vx ** 2 + ball.vy ** 2);
    return ke.toFixed(1);
  };

  return (
    <div className="space-y-8">
      {/* Canvas */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="border-2 border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6 space-y-6">
        <div className="flex gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={resetSimulation}
            className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Reset
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ball 1 Controls */}
          <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900">Ball 1 (Blue)</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mass: {ball1Mass} kg
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={ball1Mass}
                onChange={(e) => setBall1Mass(Number(e.target.value))}
                className="w-full"
                disabled={isPlaying}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Velocity: {ball1Velocity} m/s
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={ball1Velocity}
                onChange={(e) => setBall1Velocity(Number(e.target.value))}
                className="w-full"
                disabled={isPlaying}
              />
            </div>

            <div className="pt-2 space-y-1 text-sm">
              <p className="text-gray-700">Momentum: <span className="font-semibold">{calculateMomentum(balls[0])} kg·m/s</span></p>
              <p className="text-gray-700">Kinetic Energy: <span className="font-semibold">{calculateKE(balls[0])} J</span></p>
            </div>
          </div>

          {/* Ball 2 Controls */}
          <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-900">Ball 2 (Red)</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mass: {ball2Mass} kg
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={ball2Mass}
                onChange={(e) => setBall2Mass(Number(e.target.value))}
                className="w-full"
                disabled={isPlaying}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Velocity: {ball2Velocity} m/s
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={ball2Velocity}
                onChange={(e) => setBall2Velocity(Number(e.target.value))}
                className="w-full"
                disabled={isPlaying}
              />
            </div>

            <div className="pt-2 space-y-1 text-sm">
              <p className="text-gray-700">Momentum: <span className="font-semibold">{calculateMomentum(balls[1])} kg·m/s</span></p>
              <p className="text-gray-700">Kinetic Energy: <span className="font-semibold">{calculateKE(balls[1])} J</span></p>
            </div>
          </div>
        </div>

        {/* Environment Controls */}
        <div className="space-y-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
          <h3 className="font-semibold text-gray-900">Environment</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gravity: {gravity} m/s²
            </label>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={gravity}
              onChange={(e) => setGravity(Number(e.target.value))}
              className="w-full"
              disabled={isPlaying}
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showVectors}
                onChange={(e) => setShowVectors(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Show Velocity Vectors</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showTrails}
                onChange={(e) => setShowTrails(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Show Trails</span>
            </label>
          </div>
        </div>
      </div>

      {/* Theory */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Elastic Collision Theory</h3>
        
        <div className="space-y-3 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Conservation of Momentum</h4>
            <p className="text-sm">In any collision, total momentum is conserved:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 mt-1">
              m₁v₁ᵢ + m₂v₂ᵢ = m₁v₁f + m₂v₂f
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Conservation of Kinetic Energy</h4>
            <p className="text-sm">In elastic collisions, kinetic energy is also conserved:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 mt-1">
              ½m₁v₁ᵢ² + ½m₂v₂ᵢ² = ½m₁v₁f² + ½m₂v₂f²
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Final Velocities (1D)</h4>
            <p className="text-sm">For one-dimensional elastic collisions:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 mt-1">
              v₁f = ((m₁ - m₂)v₁ᵢ + 2m₂v₂ᵢ) / (m₁ + m₂)<br/>
              v₂f = ((m₂ - m₁)v₂ᵢ + 2m₁v₁ᵢ) / (m₁ + m₂)
            </p>
          </div>

          <div className="pt-2">
            <h4 className="font-semibold text-gray-900 mb-1">Key Observations</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>When equal masses collide head-on, they exchange velocities</li>
              <li>A light ball bounces back when hitting a heavy stationary ball</li>
              <li>A heavy ball continues forward when hitting a light stationary ball</li>
              <li>Total momentum and kinetic energy remain constant throughout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
