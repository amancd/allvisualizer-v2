'use client';

import { useState, useRef, useEffect } from 'react';

type ProcessPhase = 'isothermal-expansion' | 'adiabatic-expansion' | 'isothermal-compression' | 'adiabatic-compression';

export default function CarnotCycleVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<ProcessPhase>('isothermal-expansion');
  const [progress, setProgress] = useState(0); // 0 to 1 for current phase
  const [tempHot, setTempHot] = useState(600); // Kelvin
  const [tempCold, setTempCold] = useState(300); // Kelvin
  const [showLabels, setShowLabels] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);
  
  const canvasWidth = 600;
  const canvasHeight = 500;
  const gamma = 1.4; // Heat capacity ratio for ideal gas

  // Calculate Carnot efficiency
  const efficiency = ((tempHot - tempCold) / tempHot * 100).toFixed(1);

  // State points on PV diagram (normalized coordinates)
  const getStatePoints = () => {
    // Point A: (V1, P1) at TH
    const V_A = 2;
    const P_A = 8;
    
    // Point B: Isothermal expansion to (V2, P2) at TH
    const V_B = 5;
    const P_B = P_A * V_A / V_B; // PV = constant
    
    // Point C: Adiabatic expansion to (V3, P3) at TC
    const V_C = 7;
    const P_C = P_B * Math.pow(V_B / V_C, gamma);
    
    // Point D: Isothermal compression at TC
    const V_D = V_A * Math.pow(V_C / V_B, gamma);
    const P_D = P_C * V_C / V_D;
    
    return { A: {V: V_A, P: P_A}, B: {V: V_B, P: P_B}, C: {V: V_C, P: P_C}, D: {V: V_D, P: P_D} };
  };

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setProgress(p => {
          const newProgress = p + 0.01;
          if (newProgress >= 1) {
            // Move to next phase
            const phases: ProcessPhase[] = ['isothermal-expansion', 'adiabatic-expansion', 'isothermal-compression', 'adiabatic-compression'];
            const currentIndex = phases.indexOf(currentPhase);
            const nextIndex = (currentIndex + 1) % phases.length;
            setCurrentPhase(phases[nextIndex]);
            
            if (nextIndex === 0) {
              setCycleCount(c => c + 1);
            }
            
            return 0;
          }
          return newProgress;
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
  }, [isPlaying, currentPhase]);

  useEffect(() => {
    drawScene();
  }, [progress, currentPhase, tempHot, tempCold, showLabels]);

  const getCurrentState = () => {
    const points = getStatePoints();
    let V = 0, P = 0, T = 0;
    
    if (currentPhase === 'isothermal-expansion') {
      // From A to B
      V = points.A.V + (points.B.V - points.A.V) * progress;
      P = points.A.P * points.A.V / V;
      T = tempHot;
    } else if (currentPhase === 'adiabatic-expansion') {
      // From B to C
      V = points.B.V + (points.C.V - points.B.V) * progress;
      P = points.B.P * Math.pow(points.B.V / V, gamma);
      T = tempHot - (tempHot - tempCold) * progress;
    } else if (currentPhase === 'isothermal-compression') {
      // From C to D
      V = points.C.V + (points.D.V - points.C.V) * progress;
      P = points.C.P * points.C.V / V;
      T = tempCold;
    } else {
      // From D to A (adiabatic-compression)
      V = points.D.V + (points.A.V - points.D.V) * progress;
      P = points.D.P * Math.pow(points.D.V / V, gamma);
      T = tempCold + (tempHot - tempCold) * progress;
    }
    
    return { V, P, T };
  };

  const drawPVDiagram = (ctx: CanvasRenderingContext2D) => {
    const points = getStatePoints();
    const offsetX = 80;
    const offsetY = 380;
    const scaleX = 45;
    const scaleY = -32;
    
    const toCanvas = (V: number, P: number) => ({
      x: offsetX + V * scaleX,
      y: offsetY + P * scaleY
    });

    // Draw axes
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineTo(offsetX + 360, offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    ctx.lineTo(offsetX, offsetY - 280);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Volume (V)', offsetX + 180, offsetY + 25);
    ctx.save();
    ctx.translate(offsetX - 35, offsetY - 140);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Pressure (P)', 0, 0);
    ctx.restore();

    // Draw the four processes
    ctx.lineWidth = 3;
    
    // 1. Isothermal expansion A→B (red)
    ctx.strokeStyle = currentPhase === 'isothermal-expansion' ? '#ef4444' : '#fca5a5';
    ctx.beginPath();
    const aPos = toCanvas(points.A.V, points.A.P);
    ctx.moveTo(aPos.x, aPos.y);
    for (let i = 0; i <= 50; i++) {
      const v = points.A.V + (points.B.V - points.A.V) * (i / 50);
      const p = points.A.P * points.A.V / v;
      const pos = toCanvas(v, p);
      ctx.lineTo(pos.x, pos.y);
    }
    ctx.stroke();

    // 2. Adiabatic expansion B→C (blue)
    ctx.strokeStyle = currentPhase === 'adiabatic-expansion' ? '#3b82f6' : '#93c5fd';
    ctx.beginPath();
    const bPos = toCanvas(points.B.V, points.B.P);
    ctx.moveTo(bPos.x, bPos.y);
    for (let i = 0; i <= 50; i++) {
      const v = points.B.V + (points.C.V - points.B.V) * (i / 50);
      const p = points.B.P * Math.pow(points.B.V / v, gamma);
      const pos = toCanvas(v, p);
      ctx.lineTo(pos.x, pos.y);
    }
    ctx.stroke();

    // 3. Isothermal compression C→D (green)
    ctx.strokeStyle = currentPhase === 'isothermal-compression' ? '#10b981' : '#6ee7b7';
    ctx.beginPath();
    const cPos = toCanvas(points.C.V, points.C.P);
    ctx.moveTo(cPos.x, cPos.y);
    for (let i = 0; i <= 50; i++) {
      const v = points.C.V + (points.D.V - points.C.V) * (i / 50);
      const p = points.C.P * points.C.V / v;
      const pos = toCanvas(v, p);
      ctx.lineTo(pos.x, pos.y);
    }
    ctx.stroke();

    // 4. Adiabatic compression D→A (purple)
    ctx.strokeStyle = currentPhase === 'adiabatic-compression' ? '#8b5cf6' : '#c4b5fd';
    ctx.beginPath();
    const dPos = toCanvas(points.D.V, points.D.P);
    ctx.moveTo(dPos.x, dPos.y);
    for (let i = 0; i <= 50; i++) {
      const v = points.D.V + (points.A.V - points.D.V) * (i / 50);
      const p = points.D.P * Math.pow(points.D.V / v, gamma);
      const pos = toCanvas(v, p);
      ctx.lineTo(pos.x, pos.y);
    }
    ctx.stroke();

    // Draw state points
    if (showLabels) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 3;
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      
      // Draw labels with background circles for better visibility
      const drawLabel = (text: string, x: number, y: number) => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.fillText(text, x, y + 5);
      };
      
      drawLabel('A', aPos.x - 20, aPos.y - 15);
      drawLabel('B', bPos.x + 20, bPos.y - 15);
      drawLabel('C', cPos.x + 20, cPos.y + 20);
      drawLabel('D', dPos.x - 20, dPos.y + 20);

      // Temperature labels with background
      ctx.font = '11px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(aPos.x + 30, aPos.y - 42, 80, 18);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.strokeRect(aPos.x + 30, aPos.y - 42, 80, 18);
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText(`TH = ${tempHot}K`, aPos.x + 70, aPos.y - 30);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(cPos.x + 30, cPos.y + 24, 80, 18);
      ctx.strokeStyle = '#3b82f6';
      ctx.strokeRect(cPos.x + 30, cPos.y + 24, 80, 18);
      ctx.fillStyle = '#3b82f6';
      ctx.fillText(`TC = ${tempCold}K`, cPos.x + 70, cPos.y + 36);
    }

    // Draw current position
    const current = getCurrentState();
    const currentPos = toCanvas(current.V, current.P);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(currentPos.x, currentPos.y, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawSchematic = (ctx: CanvasRenderingContext2D) => {
    const x = 420;
    const y = 50;
    
    // Draw hot reservoir
    ctx.fillStyle = '#fee2e2';
    ctx.fillRect(x, y, 140, 38);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 140, 38);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Hot Reservoir`, x + 70, y + 14);
    ctx.font = '11px sans-serif';
    ctx.fillText(`TH = ${tempHot}K`, x + 70, y + 28);

    // Draw engine
    const engineY = y + 68;
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(x + 20, engineY, 100, 55);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x + 20, engineY, 100, 55);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Heat Engine', x + 70, engineY + 22);
    ctx.font = '11px sans-serif';
    ctx.fillText(`η = ${efficiency}%`, x + 70, engineY + 40);

    // Draw cold reservoir
    const coldY = engineY + 85;
    ctx.fillStyle = '#dbeafe';
    ctx.fillRect(x, coldY, 140, 38);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, coldY, 140, 38);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Cold Reservoir`, x + 70, coldY + 14);
    ctx.font = '11px sans-serif';
    ctx.fillText(`TC = ${tempCold}K`, x + 70, coldY + 28);

    // Draw heat flows
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    // QH down
    ctx.beginPath();
    ctx.moveTo(x + 70, y + 38);
    ctx.lineTo(x + 70, engineY);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('QH', x + 78, y + 56);

    // QC down
    ctx.strokeStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(x + 70, engineY + 55);
    ctx.lineTo(x + 70, coldY);
    ctx.stroke();
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('QC', x + 78, coldY - 10);

    ctx.setLineDash([]);

    // Work output arrow
    ctx.strokeStyle = '#10b981';
    ctx.fillStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + 120, engineY + 28);
    ctx.lineTo(x + 165, engineY + 28);
    ctx.stroke();
    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(x + 165, engineY + 28);
    ctx.lineTo(x + 158, engineY + 23);
    ctx.lineTo(x + 158, engineY + 33);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('W', x + 172, engineY + 33);
  };

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 10, 390, 50);
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 390, 50);
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Carnot Cycle - PV Diagram', 20, 30);

    // Current phase indicator
    const phaseNames = {
      'isothermal-expansion': '1. Isothermal Expansion (A→B)',
      'adiabatic-expansion': '2. Adiabatic Expansion (B→C)',
      'isothermal-compression': '3. Isothermal Compression (C→D)',
      'adiabatic-compression': '4. Adiabatic Compression (D→A)'
    };
    ctx.font = '13px sans-serif';
    ctx.fillText(phaseNames[currentPhase], 20, 50);

    // Draw PV diagram
    drawPVDiagram(ctx);

    // Draw schematic
    drawSchematic(ctx);

    // Current state info - positioned below schematic
    const current = getCurrentState();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(410, 380, 180, 90);
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(410, 380, 180, 90);
    
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Current State:`, 420, 398);
    ctx.font = '11px sans-serif';
    ctx.fillText(`T = ${current.T.toFixed(0)} K`, 420, 418);
    ctx.fillText(`V ∝ ${current.V.toFixed(2)}`, 420, 438);
    ctx.fillText(`P ∝ ${current.P.toFixed(2)}`, 420, 458);
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-gray-300 bg-white mx-auto block"
        />
      </div>

      {/* Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Simulation Controls</div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Hot Temperature (TH): {tempHot} K ({(tempHot - 273).toFixed(0)}°C)
            </label>
            <input
              type="range"
              min="400"
              max="800"
              step="50"
              value={tempHot}
              onChange={(e) => setTempHot(Number(e.target.value))}
              className="w-full"
              disabled={isPlaying}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Cold Temperature (TC): {tempCold} K ({(tempCold - 273).toFixed(0)}°C)
            </label>
            <input
              type="range"
              min="200"
              max="400"
              step="50"
              value={tempCold}
              onChange={(e) => setTempCold(Number(e.target.value))}
              className="w-full"
              disabled={isPlaying}
            />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
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
              setProgress(0);
              setCurrentPhase('isothermal-expansion');
              setIsPlaying(false);
              setCycleCount(0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              showLabels 
                ? 'bg-blue-500 text-white' 
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {showLabels ? 'Hide' : 'Show'} Labels
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Cycles completed: {cycleCount}
        </div>
      </div>

      {/* Efficiency Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-red-50 to-blue-50">
        <div className="text-sm font-semibold text-gray-900 mb-2">⚡ Carnot Efficiency</div>
        <div className="text-2xl font-bold text-gray-900 mb-2">
          η = {efficiency}%
        </div>
        <div className="text-xs text-gray-700 space-y-1">
          <div>η = 1 - TC/TH = 1 - {tempCold}/{tempHot}</div>
          <div>Maximum theoretical efficiency for these temperatures</div>
          <div className="text-yellow-700 font-medium mt-2">
            💡 Tip: Increase TH or decrease TC to improve efficiency
          </div>
        </div>
      </div>

      {/* Process Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-sm font-semibold text-gray-900 mb-3">🔄 Four Reversible Processes</div>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className={`p-3 rounded ${currentPhase === 'isothermal-expansion' ? 'bg-red-100 border-2 border-red-500' : 'bg-white border border-gray-200'}`}>
            <div className="font-semibold text-red-700">1. Isothermal Expansion</div>
            <div className="text-xs text-gray-600 mt-1">T = TH constant, absorb QH</div>
          </div>
          <div className={`p-3 rounded ${currentPhase === 'adiabatic-expansion' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-gray-200'}`}>
            <div className="font-semibold text-blue-700">2. Adiabatic Expansion</div>
            <div className="text-xs text-gray-600 mt-1">Q = 0, T drops to TC</div>
          </div>
          <div className={`p-3 rounded ${currentPhase === 'isothermal-compression' ? 'bg-green-100 border-2 border-green-500' : 'bg-white border border-gray-200'}`}>
            <div className="font-semibold text-green-700">3. Isothermal Compression</div>
            <div className="text-xs text-gray-600 mt-1">T = TC constant, release QC</div>
          </div>
          <div className={`p-3 rounded ${currentPhase === 'adiabatic-compression' ? 'bg-purple-100 border-2 border-purple-500' : 'bg-white border border-gray-200'}`}>
            <div className="font-semibold text-purple-700">4. Adiabatic Compression</div>
            <div className="text-xs text-gray-600 mt-1">Q = 0, T rises to TH</div>
          </div>
        </div>
      </div>
    </div>
  );
}
