'use client';

import { useState, useRef, useEffect } from 'react';

export default function ReflectionRefractionVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Parameters
  const [n1, setN1] = useState(1.0); // Refractive index of medium 1 (air)
  const [n2, setN2] = useState(1.5); // Refractive index of medium 2 (glass)
  const [incidentAngle, setIncidentAngle] = useState(30); // degrees
  const [showNormals, setShowNormals] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  
  const canvasWidth = 600;
  const canvasHeight = 500;
  const interfaceY = canvasHeight / 2;

  useEffect(() => {
    drawScene();
  }, [n1, n2, incidentAngle, showNormals, showAngles]);

  const calculateRefractedAngle = (): number | null => {
    const theta1Rad = (incidentAngle * Math.PI) / 180;
    const sinTheta2 = (n1 * Math.sin(theta1Rad)) / n2;
    
    // Check for total internal reflection
    if (Math.abs(sinTheta2) > 1) {
      return null; // Total internal reflection
    }
    
    return Math.asin(sinTheta2) * (180 / Math.PI);
  };

  const calculateCriticalAngle = (): number | null => {
    if (n1 <= n2) return null; // No critical angle when going to denser medium
    const sinCritical = n2 / n1;
    if (sinCritical > 1) return null;
    return Math.asin(sinCritical) * (180 / Math.PI);
  };

  const isTotalInternalReflection = (): boolean => {
    const criticalAngle = calculateCriticalAngle();
    return criticalAngle !== null && incidentAngle > criticalAngle;
  };

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw two media
    // Medium 1 (top)
    ctx.fillStyle = n1 === 1.0 ? '#e0f2fe' : '#dbeafe';
    ctx.fillRect(0, 0, canvasWidth, interfaceY);
    
    // Medium 2 (bottom)
    ctx.fillStyle = n2 === 1.0 ? '#e0f2fe' : n2 === 1.33 ? '#cffafe' : '#ddd6fe';
    ctx.fillRect(0, interfaceY, canvasWidth, canvasHeight - interfaceY);

    // Draw interface line
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, interfaceY);
    ctx.lineTo(canvasWidth, interfaceY);
    ctx.stroke();

    const centerX = canvasWidth / 2;

    // Draw normal line
    if (showNormals) {
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvasHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.fillText('Normal', centerX + 5, 20);
    }

    // Calculate ray positions
    const rayLength = 150;
    const theta1Rad = (incidentAngle * Math.PI) / 180;
    
    // Incident ray (coming from top-left)
    const incidentStartX = centerX - rayLength * Math.sin(theta1Rad);
    const incidentStartY = interfaceY - rayLength * Math.cos(theta1Rad);
    
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(incidentStartX, incidentStartY);
    ctx.lineTo(centerX, interfaceY);
    ctx.stroke();

    // Draw arrowhead for incident ray
    drawArrowhead(ctx, incidentStartX, incidentStartY, centerX, interfaceY, '#ef4444');

    // Reflected ray (going to top-right)
    const reflectedEndX = centerX + rayLength * Math.sin(theta1Rad);
    const reflectedEndY = interfaceY - rayLength * Math.cos(theta1Rad);
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, interfaceY);
    ctx.lineTo(reflectedEndX, reflectedEndY);
    ctx.stroke();

    drawArrowhead(ctx, centerX, interfaceY, reflectedEndX, reflectedEndY, '#3b82f6');

    // Refracted ray or total internal reflection indicator
    const refractedAngle = calculateRefractedAngle();
    
    if (refractedAngle !== null && !isTotalInternalReflection()) {
      const theta2Rad = (refractedAngle * Math.PI) / 180;
      const refractedEndX = centerX + rayLength * Math.sin(theta2Rad);
      const refractedEndY = interfaceY + rayLength * Math.cos(theta2Rad);
      
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, interfaceY);
      ctx.lineTo(refractedEndX, refractedEndY);
      ctx.stroke();

      drawArrowhead(ctx, centerX, interfaceY, refractedEndX, refractedEndY, '#10b981');
    } else if (isTotalInternalReflection()) {
      // Draw enhanced reflected ray for TIR
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX, interfaceY);
      ctx.lineTo(reflectedEndX, reflectedEndY);
      ctx.stroke();

      // TIR indicator
      ctx.fillStyle = '#8b5cf6';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Total Internal Reflection!', centerX + 50, interfaceY + 30);
    }

    // Draw angles
    if (showAngles) {
      // Incident angle
      drawAngle(ctx, centerX, interfaceY, 40, 90 - incidentAngle, 90, '#ef4444', `θ₁ = ${incidentAngle}°`);
      
      // Reflected angle
      drawAngle(ctx, centerX, interfaceY, 50, 90, 90 + incidentAngle, '#3b82f6', `θᵣ = ${incidentAngle}°`);
      
      // Refracted angle
      if (refractedAngle !== null && !isTotalInternalReflection()) {
        drawAngle(ctx, centerX, interfaceY, 60, 270, 270 + refractedAngle, '#10b981', `θ₂ = ${refractedAngle.toFixed(1)}°`);
      }
    }

    // Labels for media
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`Medium 1: n = ${n1.toFixed(2)}`, 10, 30);
    ctx.fillText(`Medium 2: n = ${n2.toFixed(2)}`, 10, interfaceY + 30);

    // Ray labels
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('Incident', incidentStartX - 50, incidentStartY - 10);
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('Reflected', reflectedEndX + 10, reflectedEndY - 10);
    
    if (!isTotalInternalReflection() && refractedAngle !== null) {
      ctx.fillStyle = '#10b981';
      ctx.fillText('Refracted', centerX + 80, interfaceY + 120);
    }
  };

  const drawArrowhead = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) => {
    const headLength = 12;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 6),
      y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 6),
      y2 - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawAngle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, startAngle: number, endAngle: number, color: string, label: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, radius, (startAngle * Math.PI) / 180, (endAngle * Math.PI) / 180);
    ctx.stroke();

    // Label
    const labelAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
    const labelX = x + (radius + 15) * Math.cos(labelAngle);
    const labelY = y + (radius + 15) * Math.sin(labelAngle);
    
    ctx.fillStyle = color;
    ctx.font = '11px sans-serif';
    ctx.fillText(label, labelX - 20, labelY + 5);
  };

  const getMaterialName = (n: number): string => {
    if (n === 1.0) return 'Air/Vacuum';
    if (n === 1.33) return 'Water';
    if (n === 1.5) return 'Glass';
    if (n === 2.42) return 'Diamond';
    return 'Custom';
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Reflection & Refraction Visualization</div>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="border border-gray-300 bg-white mx-auto block"
        />
        <div className="flex justify-center gap-6 text-xs mt-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Incident Ray</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Reflected Ray</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Refracted Ray</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Parameters</div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Medium 1 (Top): n₁ = {n1.toFixed(2)} ({getMaterialName(n1)})
            </label>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.01"
              value={n1}
              onChange={(e) => setN1(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex gap-1 mt-1">
              <button onClick={() => setN1(1.0)} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50">Air</button>
              <button onClick={() => setN1(1.33)} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50">Water</button>
              <button onClick={() => setN1(1.5)} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50">Glass</button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Medium 2 (Bottom): n₂ = {n2.toFixed(2)} ({getMaterialName(n2)})
            </label>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.01"
              value={n2}
              onChange={(e) => setN2(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex gap-1 mt-1">
              <button onClick={() => setN2(1.0)} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50">Air</button>
              <button onClick={() => setN2(1.33)} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50">Water</button>
              <button onClick={() => setN2(1.5)} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50">Glass</button>
              <button onClick={() => setN2(2.42)} className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50">Diamond</button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Incident Angle: {incidentAngle}°
            </label>
            <input
              type="range"
              min="0"
              max="89"
              step="1"
              value={incidentAngle}
              onChange={(e) => setIncidentAngle(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showNormals}
              onChange={(e) => setShowNormals(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Show Normal Line</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showAngles}
              onChange={(e) => setShowAngles(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Show Angles</span>
          </label>
        </div>

        <button
          onClick={() => {
            setN1(1.0);
            setN2(1.5);
            setIncidentAngle(30);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100"
        >
          Reset (Air to Glass)
        </button>
      </div>

      {/* Calculations */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="text-xs font-semibold text-gray-700 mb-3">Calculations</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Incident Angle</div>
            <div className="text-lg font-bold text-red-600">{incidentAngle}°</div>
            <div className="text-xs text-gray-500">From normal</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Reflected Angle</div>
            <div className="text-lg font-bold text-blue-600">{incidentAngle}°</div>
            <div className="text-xs text-gray-500">θᵢ = θᵣ</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Refracted Angle</div>
            <div className={`text-lg font-bold ${isTotalInternalReflection() ? 'text-purple-600' : 'text-green-600'}`}>
              {isTotalInternalReflection() ? 'TIR' : `${calculateRefractedAngle()?.toFixed(1)}°`}
            </div>
            <div className="text-xs text-gray-500">Snell's law</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600 font-medium">Critical Angle</div>
            <div className="text-lg font-bold text-orange-600">
              {calculateCriticalAngle() ? `${calculateCriticalAngle()?.toFixed(1)}°` : 'N/A'}
            </div>
            <div className="text-xs text-gray-500">For TIR</div>
          </div>
        </div>
      </div>

      {/* Snell's Law Display */}
      <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
        <div className="text-sm font-semibold text-blue-900 mb-2">Snell's Law Verification</div>
        <div className="font-mono text-sm text-blue-800 space-y-1">
          <p>n₁ sin(θ₁) = n₂ sin(θ₂)</p>
          <p>{n1.toFixed(2)} × sin({incidentAngle}°) = {n2.toFixed(2)} × sin({calculateRefractedAngle()?.toFixed(1) || 'N/A'}°)</p>
          <p className="text-xs">
            {(n1 * Math.sin(incidentAngle * Math.PI / 180)).toFixed(4)} = 
            {!isTotalInternalReflection() && calculateRefractedAngle() 
              ? ` ${(n2 * Math.sin(calculateRefractedAngle()! * Math.PI / 180)).toFixed(4)}`
              : ' (Total Internal Reflection)'}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="border border-gray-200 rounded-lg p-4 bg-teal-50">
        <div className="text-sm text-teal-900">
          <p className="font-medium mb-2">💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Into denser medium (n₂ &gt; n₁):</strong> Light bends toward the normal</li>
            <li><strong>Into less dense (n₂ &lt; n₁):</strong> Light bends away from the normal</li>
            <li><strong>Total internal reflection:</strong> Set n₁ &gt; n₂ and increase angle past critical angle</li>
            <li><strong>Law of reflection:</strong> Angle of incidence always equals angle of reflection</li>
            <li>Try air→water (1.0→1.33), water→air (1.33→1.0), or air→diamond (1.0→2.42)</li>
            <li>Critical angle only exists when going from denser to less dense medium</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
