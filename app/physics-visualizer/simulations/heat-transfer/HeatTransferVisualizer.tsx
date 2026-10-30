'use client';

import { useState, useRef, useEffect } from 'react';
import { responsiveSurface } from '@/lib/visualization';

export default function HeatTransferVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Canvas text is drawn in drawing units; enlarge it when the canvas is shown scaled down (phones).
  const fontScaleRef = useRef(1);
  const scaledFont = (font: string) =>
    font.replace(/(\d+)px/, (_, size) => `${Math.round(Number(size) * fontScaleRef.current)}px`);
  const animationRef = useRef<number | null>(null);
  
  const [transferMode, setTransferMode] = useState<'conduction' | 'convection' | 'radiation'>('conduction');
  const [hotTemp, setHotTemp] = useState(100); // Celsius
  const [coldTemp, setColdTemp] = useState(20); // Celsius
  const [material, setMaterial] = useState('copper'); // for conduction
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const canvasWidth = 600;
  const canvasHeight = 400;

  const materials: Record<string, {k: number, name: string}> = {
    copper: { k: 401, name: 'Copper' },
    aluminum: { k: 237, name: 'Aluminum' },
    steel: { k: 50, name: 'Steel' },
    wood: { k: 0.15, name: 'Wood' },
    air: { k: 0.026, name: 'Air' }
  };

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
    drawScene();
  }, [time, transferMode, hotTemp, coldTemp, material]);

  const getTemperatureColor = (temp: number): string => {
    // Map temperature (0-100°C) to color gradient
    const normalized = Math.max(0, Math.min(1, temp / 100));
    const r = Math.floor(255 * normalized);
    const b = Math.floor(255 * (1 - normalized));
    return `rgb(${r}, 100, ${b})`;
  };

  const drawConduction = (ctx: CanvasRenderingContext2D) => {
    const barWidth = 400;
    const barHeight = 60;
    const barX = 100;
    const barY = 170;
    
    // Draw conducting bar with temperature gradient
    for (let x = 0; x < barWidth; x++) {
      const progress = x / barWidth;
      // Temperature distribution using exponential decay (simplified)
      const temp = coldTemp + (hotTemp - coldTemp) * Math.exp(-progress * 2 * (1 - materials[material].k / 500));
      
      ctx.fillStyle = getTemperatureColor(temp);
      ctx.fillRect(barX + x, barY, 1, barHeight);
    }
    
    // Draw bar outline
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Hot source (left)
    ctx.fillStyle = getTemperatureColor(hotTemp);
    ctx.fillRect(barX - 30, barY - 10, 30, barHeight + 20);
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX - 30, barY - 10, 30, barHeight + 20);
    
    // Cold sink (right)
    ctx.fillStyle = getTemperatureColor(coldTemp);
    ctx.fillRect(barX + barWidth, barY - 10, 30, barHeight + 20);
    ctx.strokeRect(barX + barWidth, barY - 10, 30, barHeight + 20);

    // Labels
    ctx.fillStyle = '#000000';
    ctx.font = scaledFont('bold 14px sans-serif');
    ctx.textAlign = 'center';
    ctx.fillText(`${hotTemp}°C`, barX - 15, barY - 20);
    ctx.fillText(`${coldTemp}°C`, barX + barWidth + 15, barY - 20);
    ctx.fillText(materials[material].name, barX + barWidth / 2, barY + barHeight + 30);
    
    // Heat flow arrows
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.lineWidth = 2;
    const arrowY = barY + barHeight / 2;
    for (let i = 0; i < 5; i++) {
      const x = barX + 60 + i * 70;
      ctx.beginPath();
      ctx.moveTo(x, arrowY);
      ctx.lineTo(x + 40, arrowY);
      ctx.stroke();
      
      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(x + 40, arrowY);
      ctx.lineTo(x + 35, arrowY - 5);
      ctx.lineTo(x + 35, arrowY + 5);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.fillStyle = '#ef4444';
    ctx.font = scaledFont('12px sans-serif');
    ctx.fillText('Heat Flow →', barX + barWidth / 2, arrowY - 15);
  };

  const drawConvection = (ctx: CanvasRenderingContext2D) => {
    const containerX = 150;
    const containerY = 100;
    const containerWidth = 300;
    const containerHeight = 250;
    
    // Draw container
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(containerX, containerY, containerWidth, containerHeight);
    ctx.strokeRect(containerX, containerY, containerWidth, containerHeight);

    // Draw heat source at bottom
    const heaterHeight = 30;
    ctx.fillStyle = getTemperatureColor(hotTemp);
    ctx.fillRect(containerX, containerY + containerHeight - heaterHeight, containerWidth, heaterHeight);
    
    // Draw convection currents (simplified circulation)
    const numCells = 3;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < numCells; i++) {
      const cellX = containerX + 50 + i * 80;
      const phase = time + i * Math.PI / 1.5;
      
      // Rising hot fluid
      ctx.strokeStyle = '#ef4444';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cellX, containerY + containerHeight - heaterHeight);
      ctx.lineTo(cellX, containerY + 20);
      ctx.stroke();
      
      // Falling cool fluid
      ctx.strokeStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(cellX + 40, containerY + 20);
      ctx.lineTo(cellX + 40, containerY + containerHeight - heaterHeight);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Animated particles showing circulation
      const particleY = containerY + 50 + Math.abs(Math.sin(phase)) * 150;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cellX, particleY, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(cellX + 40, containerY + containerHeight - particleY + containerY + 50, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Curved arrows at top and bottom
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cellX + 20, containerY + 20, 20, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cellX + 20, containerY + containerHeight - heaterHeight, 20, 0, Math.PI);
      ctx.stroke();
    }

    // Labels
    ctx.fillStyle = '#000000';
    ctx.font = scaledFont('bold 14px sans-serif');
    ctx.textAlign = 'center';
    ctx.fillText(`Heat Source: ${hotTemp}°C`, containerX + containerWidth / 2, containerY + containerHeight + 30);
    
    ctx.font = scaledFont('12px sans-serif');
    ctx.fillStyle = '#ef4444';
    ctx.fillText('↑ Hot fluid rises', containerX - 50, containerY + 150);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('↓ Cool fluid sinks', containerX + containerWidth + 50, containerY + 150);
  };

  const drawRadiation = (ctx: CanvasRenderingContext2D) => {
    const sourceX = 150;
    const sourceY = 200;
    const sourceRadius = 40;
    const targetX = 450;
    const targetY = 200;
    const targetSize = 60;
    
    // Draw heat source (hot object)
    ctx.fillStyle = getTemperatureColor(hotTemp);
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, sourceRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw radiation waves
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    const numWaves = 8;
    for (let i = 0; i < numWaves; i++) {
      const angle = (i / numWaves) * Math.PI * 2;
      const wavePhase = time * 2 + i * 0.5;
      const radius = sourceRadius + 10 + (Math.sin(wavePhase) * 10 + 10);
      
      ctx.globalAlpha = 0.3 + Math.sin(wavePhase) * 0.2;
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, radius, angle - 0.3, angle + 0.3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    
    // Draw electromagnetic wave lines
    const numRays = 12;
    for (let i = 0; i < numRays; i++) {
      const angle = (i / numRays) * Math.PI * 2 + time * 0.5;
      const startX = sourceX + Math.cos(angle) * sourceRadius;
      const startY = sourceY + Math.sin(angle) * sourceRadius;
      const endX = sourceX + Math.cos(angle) * 150;
      const endY = sourceY + Math.sin(angle) * 150;
      
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Wave particles
      const particlePhase = (time * 3 + i * 0.5) % 1;
      const particleX = startX + (endX - startX) * particlePhase;
      const particleY = startY + (endY - startY) * particlePhase;
      
      ctx.fillStyle = '#fbbf24';
      ctx.globalAlpha = 1 - particlePhase;
      ctx.beginPath();
      ctx.arc(particleX, particleY, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // Draw target object (absorber)
    const absorbedHeat = Math.min(hotTemp * 0.7, 100);
    ctx.fillStyle = getTemperatureColor(absorbedHeat);
    ctx.fillRect(targetX - targetSize / 2, targetY - targetSize / 2, targetSize, targetSize);
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.strokeRect(targetX - targetSize / 2, targetY - targetSize / 2, targetSize, targetSize);

    // Labels
    ctx.fillStyle = '#000000';
    ctx.font = scaledFont('bold 14px sans-serif');
    ctx.textAlign = 'center';
    ctx.fillText(`Source: ${hotTemp}°C`, sourceX, sourceY + sourceRadius + 25);
    ctx.fillText(`Absorber: ${absorbedHeat.toFixed(0)}°C`, targetX, targetY + targetSize / 2 + 25);
    
    ctx.font = scaledFont('12px sans-serif');
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Electromagnetic Radiation →', 300, 150);
    ctx.fillText('(No medium required)', 300, 170);
  };

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    fontScaleRef.current = Math.min(1.4, Math.max(1, canvas.width / (canvas.clientWidth || canvas.width)));

    // Clear canvas
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Title
    ctx.fillStyle = '#000000';
    ctx.font = scaledFont('bold 16px sans-serif');
    ctx.textAlign = 'left';
    const modeTitle = transferMode.charAt(0).toUpperCase() + transferMode.slice(1);
    ctx.fillText(`Heat Transfer: ${modeTitle}`, 20, 30);

    // Draw based on mode
    if (transferMode === 'conduction') {
      drawConduction(ctx);
    } else if (transferMode === 'convection') {
      drawConvection(ctx);
    } else if (transferMode === 'radiation') {
      drawRadiation(ctx);
    }
  };

  const calculateHeatFlow = (): number => {
    if (transferMode === 'conduction') {
      // Simplified Q = kA(ΔT)/L
      const k = materials[material].k;
      const deltaT = hotTemp - coldTemp;
      return k * deltaT / 10; // Arbitrary scale
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="border border-line rounded-lg p-4 bg-subtle">
        <div className="text-xs font-semibold text-gray-700 mb-3">Heat Transfer Visualization</div>
        <div className="mx-auto max-w-[600px]">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className={`${responsiveSurface} border border-line-strong bg-white`}
          />
        </div>
        <div className="text-xs text-ink-muted text-center mt-2">
          {transferMode === 'conduction' && 'Heat flows through direct contact'}
          {transferMode === 'convection' && 'Heat transfer through fluid circulation'}
          {transferMode === 'radiation' && 'Heat transfer through electromagnetic waves'}
        </div>
      </div>

      {/* Transfer Mode */}
      <div className="border border-line rounded-lg p-4 bg-subtle">
        <div className="text-xs font-semibold text-gray-700 mb-3">Heat Transfer Mode</div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setTransferMode('conduction')}
            className={`px-3 py-2 text-sm rounded ${
              transferMode === 'conduction'
                ? 'bg-red-600 text-white'
                : 'bg-white border border-line-strong hover:bg-subtle'
            }`}
          >
            Conduction
          </button>
          <button
            onClick={() => setTransferMode('convection')}
            className={`px-3 py-2 text-sm rounded ${
              transferMode === 'convection'
                ? 'bg-red-600 text-white'
                : 'bg-white border border-line-strong hover:bg-subtle'
            }`}
          >
            Convection
          </button>
          <button
            onClick={() => setTransferMode('radiation')}
            className={`px-3 py-2 text-sm rounded ${
              transferMode === 'radiation'
                ? 'bg-red-600 text-white'
                : 'bg-white border border-line-strong hover:bg-subtle'
            }`}
          >
            Radiation
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="border border-line rounded-lg p-4 bg-subtle">
        <div className="text-xs font-semibold text-gray-700 mb-3">Parameters</div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Hot Temperature: {hotTemp}°C
            </label>
            <input
              type="range"
              min="50"
              max="200"
              step="10"
              value={hotTemp}
              onChange={(e) => setHotTemp(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Cold Temperature: {coldTemp}°C
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={coldTemp}
              onChange={(e) => setColdTemp(Number(e.target.value))}
              className="w-full"
            />
          </div>
          
          {transferMode === 'conduction' && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Material: {materials[material].name} (k = {materials[material].k} W/(m·K))
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Object.entries(materials).map(([key, mat]) => (
                  <button
                    key={key}
                    onClick={() => setMaterial(key)}
                    className={`px-3 py-2 text-xs rounded ${
                      material === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-line-strong hover:bg-subtle'
                    }`}
                  >
                    {mat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
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
              setHotTemp(100);
              setColdTemp(20);
              setMaterial('copper');
              setTime(0);
            }}
            className="px-4 py-2 border border-line-strong rounded-lg text-sm font-medium hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="border border-line rounded-lg p-4 bg-red-50">
        <div className="text-sm text-red-900">
          <p className="font-medium mb-2">Key Concepts:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Conduction:</strong> Direct contact - metals are good conductors</li>
            <li><strong>Convection:</strong> Fluid motion - hot rises, cold sinks</li>
            <li><strong>Radiation:</strong> EM waves - works in vacuum (like sunlight)</li>
            <li>Heat always flows from hot to cold</li>
            <li>Higher temperature difference = faster heat transfer</li>
            <li>Material properties affect conduction rate significantly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
