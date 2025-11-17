'use client';

import { useState, useEffect, useRef } from 'react';

export default function ProjectileMotionVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  // Parameters
  const [velocity, setVelocity] = useState(25); // m/s
  const [angle, setAngle] = useState(45); // degrees
  const [height, setHeight] = useState(0); // initial height in meters
  const [gravity] = useState(9.81); // m/s²
  
  // Trajectory data
  const [trajectory, setTrajectory] = useState<{ x: number; y: number }[]>([]);
  const [currentPoint, setCurrentPoint] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(0);
  
  // Calculated values
  const angleRad = (angle * Math.PI) / 180;
  const vx = velocity * Math.cos(angleRad);
  const vy = velocity * Math.sin(angleRad);
  
  // Time of flight: when y = 0
  const discriminant = vy * vy + 2 * gravity * height;
  const timeOfFlight = discriminant >= 0 ? (vy + Math.sqrt(discriminant)) / gravity : 0;
  
  const maxHeight = height + (vy * vy) / (2 * gravity);
  const range = vx * timeOfFlight;
  
  // Generate full trajectory
  useEffect(() => {
    const points: { x: number; y: number }[] = [];
    const dt = 0.02; // time step
    
    for (let t = 0; t <= timeOfFlight; t += dt) {
      const x = vx * t;
      const y = height + vy * t - 0.5 * gravity * t * t;
      if (y >= 0) {
        points.push({ x, y });
      }
    }
    
    setTrajectory(points);
  }, [velocity, angle, height, vx, vy, gravity, timeOfFlight]);
  
  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;
    
    const startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      
      if (elapsed >= timeOfFlight) {
        setIsAnimating(false);
        setCurrentTime(timeOfFlight);
        const finalX = vx * timeOfFlight;
        setCurrentPoint({ x: finalX, y: 0 });
        return;
      }
      
      const t = elapsed;
      const x = vx * t;
      const y = Math.max(0, height + vy * t - 0.5 * gravity * t * t);
      
      setCurrentPoint({ x, y });
      setCurrentTime(t);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAnimating, vx, vy, gravity, height, timeOfFlight]);
  
  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Scaling
    const padding = 40;
    const maxX = Math.max(range, 50);
    const maxY = Math.max(maxHeight, 20);
    const scaleX = (canvas.width - 2 * padding) / maxX;
    const scaleY = (canvas.height - 2 * padding) / maxY;
    
    // Transform coordinates
    const toCanvasX = (x: number) => padding + x * scaleX;
    const toCanvasY = (y: number) => canvas.height - padding - y * scaleY;
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x <= maxX; x += 10) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(x), padding);
      ctx.lineTo(toCanvasX(x), canvas.height - padding);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= maxY; y += 10) {
      ctx.beginPath();
      ctx.moveTo(padding, toCanvasY(y));
      ctx.lineTo(canvas.width - padding, toCanvasY(y));
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, toCanvasY(0));
    ctx.lineTo(canvas.width - padding, toCanvasY(0));
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), padding);
    ctx.lineTo(toCanvasX(0), canvas.height - padding);
    ctx.stroke();
    
    // Draw full trajectory path
    if (trajectory.length > 0) {
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      ctx.beginPath();
      ctx.moveTo(toCanvasX(trajectory[0].x), toCanvasY(trajectory[0].y));
      
      for (let i = 1; i < trajectory.length; i++) {
        ctx.lineTo(toCanvasX(trajectory[i].x), toCanvasY(trajectory[i].y));
      }
      
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw current position
    if (isAnimating || currentTime > 0) {
      // Projectile
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(toCanvasX(currentPoint.x), toCanvasY(currentPoint.y), 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Velocity vector
      const vxCurrent = vx;
      const vyCurrent = vy - gravity * currentTime;
      const vectorScale = 3;
      
      // Horizontal component (blue)
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(currentPoint.x), toCanvasY(currentPoint.y));
      ctx.lineTo(toCanvasX(currentPoint.x + vxCurrent * vectorScale), toCanvasY(currentPoint.y));
      ctx.stroke();
      
      // Vertical component (green)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(currentPoint.x), toCanvasY(currentPoint.y));
      ctx.lineTo(toCanvasX(currentPoint.x), toCanvasY(currentPoint.y + vyCurrent * vectorScale));
      ctx.stroke();
      
      // Total velocity vector (red)
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(currentPoint.x), toCanvasY(currentPoint.y));
      ctx.lineTo(
        toCanvasX(currentPoint.x + vxCurrent * vectorScale),
        toCanvasY(currentPoint.y + vyCurrent * vectorScale)
      );
      ctx.stroke();
      
      // Arrow head for total velocity
      const arrowSize = 10;
      const arrowAngle = Math.atan2(vyCurrent, vxCurrent);
      const endX = toCanvasX(currentPoint.x + vxCurrent * vectorScale);
      const endY = toCanvasY(currentPoint.y + vyCurrent * vectorScale);
      
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
        endY + arrowSize * Math.sin(arrowAngle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
        endY + arrowSize * Math.sin(arrowAngle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw initial velocity vector at launch point
    if (!isAnimating && currentTime === 0) {
      const vectorScale = 3;
      
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(0), toCanvasY(height));
      ctx.lineTo(toCanvasX(vx * vectorScale), toCanvasY(height + vy * vectorScale));
      ctx.stroke();
      
      // Arrow
      const arrowSize = 10;
      const endX = toCanvasX(vx * vectorScale);
      const endY = toCanvasY(height + vy * vectorScale);
      
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowSize * Math.cos(angleRad - Math.PI / 6),
        endY + arrowSize * Math.sin(angleRad - Math.PI / 6)
      );
      ctx.lineTo(
        endX - arrowSize * Math.cos(angleRad + Math.PI / 6),
        endY + arrowSize * Math.sin(angleRad + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }
    
    // Labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    
    // X-axis label
    ctx.fillText('Distance (m)', canvas.width - 80, canvas.height - padding + 25);
    
    // Y-axis label
    ctx.save();
    ctx.translate(padding - 30, 60);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Height (m)', 0, 0);
    ctx.restore();
    
  }, [trajectory, currentPoint, isAnimating, currentTime, range, maxHeight, vx, vy, angleRad, height, gravity]);
  
  const handleStart = () => {
    setCurrentTime(0);
    setCurrentPoint({ x: 0, y: height });
    setIsAnimating(true);
  };
  
  const handleReset = () => {
    setIsAnimating(false);
    setCurrentTime(0);
    setCurrentPoint({ x: 0, y: height });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
            <span>Initial Velocity: {velocity} m/s</span>
          </label>
          <input
            type="range"
            min="5"
            max="50"
            step="1"
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            disabled={isAnimating}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
            <span>Launch Angle: {angle}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="90"
            step="1"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            disabled={isAnimating}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
            <span>Initial Height: {height} m</span>
          </label>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            disabled={isAnimating}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          />
        </div>
      </div>
      
      {/* Animation Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleStart}
          disabled={isAnimating}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnimating ? 'Animating...' : 'Launch'}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>
      
      {/* Canvas */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full"
        />
      </div>
      
      {/* Real-time Data */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-600 font-medium mb-1">Time Elapsed</div>
          <div className="text-lg font-bold text-blue-900">{currentTime.toFixed(2)} s</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-600 font-medium mb-1">Current Height</div>
          <div className="text-lg font-bold text-green-900">{currentPoint.y.toFixed(2)} m</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="text-xs text-purple-600 font-medium mb-1">Horizontal Distance</div>
          <div className="text-lg font-bold text-purple-900">{currentPoint.x.toFixed(2)} m</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="text-xs text-orange-600 font-medium mb-1">Current Speed</div>
          <div className="text-lg font-bold text-orange-900">
            {Math.sqrt(vx * vx + Math.pow(vy - gravity * currentTime, 2)).toFixed(2)} m/s
          </div>
        </div>
      </div>
      
      {/* Calculated Results */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Calculated Values</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Time of Flight</div>
            <div className="font-semibold text-gray-900">{timeOfFlight.toFixed(2)} s</div>
          </div>
          <div>
            <div className="text-gray-600">Maximum Height</div>
            <div className="font-semibold text-gray-900">{maxHeight.toFixed(2)} m</div>
          </div>
          <div>
            <div className="text-gray-600">Range</div>
            <div className="font-semibold text-gray-900">{range.toFixed(2)} m</div>
          </div>
          <div>
            <div className="text-gray-600">Horizontal Velocity</div>
            <div className="font-semibold text-gray-900">{vx.toFixed(2)} m/s</div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="text-xs text-gray-600 space-y-1">
            <div>• <span className="text-purple-600 font-semibold">Purple arrow</span>: Initial velocity vector</div>
            <div>• <span className="text-red-600 font-semibold">Red arrow</span>: Current velocity vector</div>
            <div>• <span className="text-blue-600 font-semibold">Blue</span>: Horizontal component (constant)</div>
            <div>• <span className="text-green-600 font-semibold">Green</span>: Vertical component (changes with gravity)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
