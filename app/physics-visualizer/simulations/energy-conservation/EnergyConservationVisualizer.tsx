'use client';

import { useState, useEffect, useRef } from 'react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
}

export default function EnergyConservationVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [height, setHeight] = useState(300);
  const [mass, setMass] = useState(2);
  const [gravity, setGravity] = useState(9.8);
  const [showEnergy, setShowEnergy] = useState(true);
  const [damping, setDamping] = useState(0.98);
  const [scenario, setScenario] = useState<'pendulum' | 'freefall' | 'ramp' | 'spring'>('pendulum');
  
  const [ball, setBall] = useState<Ball>({
    x: 300,
    y: 100,
    vx: 0,
    vy: 0,
    mass: 2,
    radius: 15
  });
  
  const [pendulumAngle, setPendulumAngle] = useState(-Math.PI / 3);
  const [pendulumAngularVelocity, setPendulumAngularVelocity] = useState(0);
  const [springCompression, setSpringCompression] = useState(0);
  const [springVelocity, setSpringVelocity] = useState(0);

  const WIDTH = 600;
  const HEIGHT = 400;
  const GROUND = HEIGHT - 50;
  const PENDULUM_LENGTH = 150;
  const SPRING_CONSTANT = 50;

  const resetSimulation = () => {
    setIsPlaying(false);
    setPendulumAngle(-Math.PI / 3);
    setPendulumAngularVelocity(0);
    setSpringCompression(0);
    setSpringVelocity(0);
    
    if (scenario === 'pendulum') {
      setBall({
        x: WIDTH / 2 + PENDULUM_LENGTH * Math.sin(-Math.PI / 3),
        y: 100 + PENDULUM_LENGTH * Math.cos(-Math.PI / 3),
        vx: 0,
        vy: 0,
        mass: mass,
        radius: 15
      });
    } else if (scenario === 'freefall') {
      setBall({
        x: WIDTH / 2,
        y: GROUND - height,
        vx: 0,
        vy: 0,
        mass: mass,
        radius: 15
      });
    } else if (scenario === 'ramp') {
      setBall({
        x: 100,
        y: GROUND - height,
        vx: 0,
        vy: 0,
        mass: mass,
        radius: 15
      });
    } else if (scenario === 'spring') {
      setBall({
        x: WIDTH / 2,
        y: 200,
        vx: 0,
        vy: 0,
        mass: mass,
        radius: 15
      });
    }
  };

  useEffect(() => {
    resetSimulation();
  }, [scenario, height, mass, gravity, damping]);

  const calculateEnergies = () => {
    let ke = 0, pe = 0, se = 0; // kinetic, potential, spring energy
    
    if (scenario === 'pendulum') {
      const v = Math.abs(pendulumAngularVelocity * PENDULUM_LENGTH);
      ke = 0.5 * mass * v * v;
      const h = PENDULUM_LENGTH * (1 - Math.cos(pendulumAngle));
      pe = mass * gravity * h;
    } else if (scenario === 'freefall' || scenario === 'ramp') {
      ke = 0.5 * mass * (ball.vx * ball.vx + ball.vy * ball.vy);
      const h = GROUND - ball.y;
      pe = mass * gravity * h;
    } else if (scenario === 'spring') {
      ke = 0.5 * mass * (ball.vx * ball.vx + ball.vy * ball.vy);
      const h = GROUND - ball.y;
      pe = mass * gravity * h;
      se = 0.5 * SPRING_CONSTANT * springCompression * springCompression;
    }
    
    return { ke, pe, se, total: ke + pe + se };
  };

  const animate = () => {
    if (!isPlaying) return;
    
    const dt = 0.016; // ~60 fps
    
    if (scenario === 'pendulum') {
      // Pendulum simulation
      const angularAcceleration = -(gravity / PENDULUM_LENGTH) * Math.sin(pendulumAngle);
      let newAngularVelocity = pendulumAngularVelocity + angularAcceleration * dt;
      newAngularVelocity *= damping; // Apply damping
      let newAngle = pendulumAngle + newAngularVelocity * dt;
      
      setPendulumAngle(newAngle);
      setPendulumAngularVelocity(newAngularVelocity);
      
      const pivotX = WIDTH / 2;
      const pivotY = 100;
      setBall(prev => ({
        ...prev,
        x: pivotX + PENDULUM_LENGTH * Math.sin(newAngle),
        y: pivotY + PENDULUM_LENGTH * Math.cos(newAngle)
      }));
      
    } else if (scenario === 'freefall') {
      // Free fall simulation
      const newBall = { ...ball };
      newBall.vy += gravity * dt;
      newBall.y += newBall.vy * dt;
      
      if (newBall.y + newBall.radius >= GROUND) {
        newBall.y = GROUND - newBall.radius;
        newBall.vy = -newBall.vy * damping;
      }
      
      setBall(newBall);
      
    } else if (scenario === 'ramp') {
      // Ramp simulation
      const newBall = { ...ball };
      const rampAngle = Math.PI / 6; // 30 degrees
      
      if (newBall.x < 450 && newBall.y < GROUND - newBall.radius) {
        // On ramp
        const acceleration = gravity * Math.sin(rampAngle);
        newBall.vx += acceleration * Math.cos(rampAngle) * dt;
        newBall.vy += (gravity * Math.cos(rampAngle) + acceleration * Math.sin(rampAngle)) * dt;
        
        newBall.x += newBall.vx * dt;
        newBall.y += newBall.vy * dt;
        
        // Keep on ramp
        const rampY = GROUND - (newBall.x - 100) * Math.tan(rampAngle);
        if (newBall.y + newBall.radius > rampY) {
          newBall.y = rampY - newBall.radius;
        }
      } else {
        // Free fall after leaving ramp
        newBall.vy += gravity * dt;
        newBall.x += newBall.vx * dt;
        newBall.y += newBall.vy * dt;
        
        if (newBall.y + newBall.radius >= GROUND) {
          newBall.y = GROUND - newBall.radius;
          newBall.vy = -newBall.vy * damping;
          newBall.vx *= damping;
        }
      }
      
      if (newBall.x + newBall.radius >= WIDTH) {
        newBall.x = WIDTH - newBall.radius;
        newBall.vx = -newBall.vx * damping;
      }
      
      setBall(newBall);
      
    } else if (scenario === 'spring') {
      // Spring-mass system
      const restPosition = 200;
      const displacement = ball.y - restPosition;
      
      // Spring force + gravity
      const springForce = -SPRING_CONSTANT * springCompression;
      const netForce = springForce + mass * gravity;
      const acceleration = netForce / mass;
      
      let newVelocity = springVelocity + acceleration * dt;
      newVelocity *= damping; // Apply damping
      let newCompression = springCompression + newVelocity * dt;
      
      setSpringCompression(newCompression);
      setSpringVelocity(newVelocity);
      
      setBall(prev => ({
        ...prev,
        y: restPosition + newCompression
      }));
    }
    
    // Draw
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Draw scenario-specific elements
    if (scenario === 'pendulum') {
      const pivotX = WIDTH / 2;
      const pivotY = 100;
      
      // Pendulum string
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(ball.x, ball.y);
      ctx.stroke();
      
      // Pivot point
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Reference height line (lowest point)
      ctx.strokeStyle = '#9ca3af';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, pivotY + PENDULUM_LENGTH);
      ctx.lineTo(WIDTH, pivotY + PENDULUM_LENGTH);
      ctx.stroke();
      ctx.setLineDash([]);
      
    } else if (scenario === 'freefall') {
      // Starting height line
      ctx.strokeStyle = '#9ca3af';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, GROUND - height);
      ctx.lineTo(WIDTH, GROUND - height);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Height indicator
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Inter';
      ctx.fillText(`h = ${height}m`, WIDTH / 2 + 20, GROUND - height / 2);
      
    } else if (scenario === 'ramp') {
      // Draw ramp
      ctx.fillStyle = '#d1d5db';
      ctx.beginPath();
      ctx.moveTo(100, GROUND);
      ctx.lineTo(450, GROUND);
      ctx.lineTo(450, GROUND - 350 * Math.tan(Math.PI / 6));
      ctx.lineTo(100, GROUND);
      ctx.fill();
      
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Starting height marker
      ctx.strokeStyle = '#9ca3af';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, GROUND - height);
      ctx.lineTo(WIDTH, GROUND - height);
      ctx.stroke();
      ctx.setLineDash([]);
      
    } else if (scenario === 'spring') {
      const springX = WIDTH / 2;
      const springTop = 50;
      const springBottom = ball.y - ball.radius;
      
      // Draw spring
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(springX, springTop);
      
      const coils = 15;
      const coilWidth = 15;
      for (let i = 0; i <= coils; i++) {
        const y = springTop + (springBottom - springTop) * (i / coils);
        const x = springX + (i % 2 === 0 ? coilWidth : -coilWidth);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(springX, springBottom);
      ctx.stroke();
      
      // Spring anchor
      ctx.fillStyle = '#374151';
      ctx.fillRect(springX - 20, springTop - 10, 40, 10);
      
      // Rest position line
      ctx.strokeStyle = '#9ca3af';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, 200);
      ctx.lineTo(WIDTH, 200);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw ground
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(0, GROUND, WIDTH, HEIGHT - GROUND);
    
    // Draw ball shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.ellipse(ball.x, GROUND + 5, ball.radius * 0.8, ball.radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw ball
    const gradient = ctx.createRadialGradient(ball.x - 5, ball.y - 5, 0, ball.x, ball.y, ball.radius);
    gradient.addColorStop(0, '#60a5fa');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw energy bars if enabled
    if (showEnergy) {
      const energies = calculateEnergies();
      const maxEnergy = energies.total || 1;
      const barWidth = 40;
      const barX = WIDTH - 150;
      const barMaxHeight = 200;
      
      // KE bar
      const keHeight = (energies.ke / maxEnergy) * barMaxHeight;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(barX, GROUND - keHeight, barWidth, keHeight);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, GROUND - keHeight, barWidth, keHeight);
      
      // PE bar
      const peHeight = (energies.pe / maxEnergy) * barMaxHeight;
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(barX + 50, GROUND - peHeight, barWidth, peHeight);
      ctx.strokeStyle = '#d97706';
      ctx.strokeRect(barX + 50, GROUND - peHeight, barWidth, peHeight);
      
      // SE bar (if spring scenario)
      if (scenario === 'spring') {
        const seHeight = (energies.se / maxEnergy) * barMaxHeight;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(barX + 100, GROUND - seHeight, barWidth, seHeight);
        ctx.strokeStyle = '#dc2626';
        ctx.strokeRect(barX + 100, GROUND - seHeight, barWidth, seHeight);
      }
      
      // Labels
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('KE', barX + barWidth / 2, GROUND + 20);
      ctx.fillText('PE', barX + 50 + barWidth / 2, GROUND + 20);
      if (scenario === 'spring') {
        ctx.fillText('SE', barX + 100 + barWidth / 2, GROUND + 20);
      }
      
      // Energy values
      ctx.font = '12px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(`KE: ${energies.ke.toFixed(1)} J`, 10, 20);
      ctx.fillText(`PE: ${energies.pe.toFixed(1)} J`, 10, 40);
      if (scenario === 'spring') {
        ctx.fillText(`SE: ${energies.se.toFixed(1)} J`, 10, 60);
        ctx.fillText(`Total: ${energies.total.toFixed(1)} J`, 10, 80);
      } else {
        ctx.fillText(`Total: ${energies.total.toFixed(1)} J`, 10, 60);
      }
    }
    
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
  }, [isPlaying, ball, pendulumAngle, pendulumAngularVelocity, springCompression, springVelocity, showEnergy]);

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

        {/* Scenario Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scenario
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(['pendulum', 'freefall', 'ramp', 'spring'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScenario(s)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  scenario === s
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={isPlaying}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mass Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mass: {mass} kg
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={mass}
              onChange={(e) => setMass(Number(e.target.value))}
              className="w-full"
              disabled={isPlaying}
            />
          </div>

          {/* Height/Angle Control */}
          {scenario !== 'spring' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {scenario === 'pendulum' ? 'Initial Angle' : 'Initial Height'}: {scenario === 'pendulum' ? Math.round(-pendulumAngle * 180 / Math.PI) + '°' : height + 'm'}
              </label>
              <input
                type="range"
                min={scenario === 'pendulum' ? 10 : 50}
                max={scenario === 'pendulum' ? 80 : 300}
                step={scenario === 'pendulum' ? 5 : 10}
                value={scenario === 'pendulum' ? -pendulumAngle * 180 / Math.PI : height}
                onChange={(e) => {
                  if (scenario === 'pendulum') {
                    setPendulumAngle(-Number(e.target.value) * Math.PI / 180);
                  } else {
                    setHeight(Number(e.target.value));
                  }
                  resetSimulation();
                }}
                className="w-full"
                disabled={isPlaying}
              />
            </div>
          )}

          {/* Gravity Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gravity: {gravity} m/s²
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={gravity}
              onChange={(e) => setGravity(Number(e.target.value))}
              className="w-full"
              disabled={isPlaying}
            />
          </div>

          {/* Damping Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Damping: {(damping * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.90"
              max="1.00"
              step="0.01"
              value={damping}
              onChange={(e) => setDamping(Number(e.target.value))}
              className="w-full"
              disabled={isPlaying}
            />
          </div>
        </div>

        {/* Show Energy Toggle */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showEnergy}
              onChange={(e) => setShowEnergy(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Show Energy Bars</span>
          </label>
        </div>
      </div>

      {/* Theory */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Energy Conservation Principle</h3>
        
        <div className="space-y-3 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Law of Conservation of Energy</h4>
            <p className="text-sm">In a closed system with no external forces, total mechanical energy remains constant:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 mt-1">
              E_total = KE + PE + SE = constant
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Kinetic Energy (KE)</h4>
            <p className="text-sm">Energy of motion, depends on mass and velocity:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 mt-1">
              KE = ½mv²
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Potential Energy (PE)</h4>
            <p className="text-sm">Stored energy due to position in a gravitational field:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 mt-1">
              PE = mgh
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Spring Potential Energy (SE)</h4>
            <p className="text-sm">Energy stored in a compressed or stretched spring:</p>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-300 mt-1">
              SE = ½kx²
            </p>
          </div>

          <div className="pt-2">
            <h4 className="font-semibold text-gray-900 mb-1">Energy Transformations</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong>Pendulum:</strong> PE ↔ KE (at highest point: max PE, at lowest: max KE)</li>
              <li><strong>Free Fall:</strong> PE → KE (potential energy converts to kinetic as object falls)</li>
              <li><strong>Ramp:</strong> PE → KE (gravitational PE converts to motion)</li>
              <li><strong>Spring:</strong> PE ↔ KE ↔ SE (three-way energy exchange)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
