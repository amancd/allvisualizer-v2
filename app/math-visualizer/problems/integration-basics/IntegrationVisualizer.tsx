'use client';

import { useState, useRef } from 'react';

export default function IntegrationVisualizer() {
  const [upperBound, setUpperBound] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 600;
  const height = 400;
  const padding = 50;
  
  const xMin = -1;
  const xMax = 3;
  const yMin = -1;
  const yMax = 10;

  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const toSvgY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);
  const toMathX = (svgX: number) => xMin + ((svgX - padding) / (width - 2 * padding)) * (xMax - xMin);

  // Function: f(x) = x²
  const f = (x: number) => x * x;
  
  // Antiderivative (integral): F(x) = x³/3
  const F = (x: number) => (x * x * x) / 3;
  
  // Definite integral from 0 to upperBound
  const lowerBound = 0;
  const definiteIntegral = F(upperBound) - F(lowerBound);

  const generateCurve = () => {
    const points: string[] = [];
    for (let x = xMin; x <= xMax; x += 0.05) {
      const svgX = toSvgX(x);
      const svgY = toSvgY(f(x));
      points.push(`${svgX},${svgY}`);
    }
    return points.join(' ');
  };

  // Generate area under curve (Riemann rectangles)
  const generateRectangles = () => {
    const numRectangles = 20;
    const dx = (upperBound - lowerBound) / numRectangles;
    const rectangles = [];
    
    for (let i = 0; i < numRectangles; i++) {
      const x = lowerBound + i * dx;
      const height = f(x);
      const rectX = toSvgX(x);
      const rectY = toSvgY(height);
      const rectWidth = toSvgX(x + dx) - rectX;
      const rectHeight = toSvgY(0) - rectY;
      
      rectangles.push(
        <rect
          key={i}
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          fill="#4f46e5"
          fillOpacity="0.2"
          stroke="#4f46e5"
          strokeWidth="0.5"
        />
      );
    }
    
    return rectangles;
  };

  // Generate shaded area polygon
  const generateShadedArea = () => {
    const points: string[] = [];
    
    // Start at lower bound on x-axis
    points.push(`${toSvgX(lowerBound)},${toSvgY(0)}`);
    
    // Trace along the curve
    for (let x = lowerBound; x <= upperBound; x += 0.05) {
      points.push(`${toSvgX(x)},${toSvgY(f(x))}`);
    }
    
    // End at upper bound
    points.push(`${toSvgX(upperBound)},${toSvgY(f(upperBound))}`);
    
    // Back to x-axis at upper bound
    points.push(`${toSvgX(upperBound)},${toSvgY(0)}`);
    
    // Close the polygon
    points.push(`${toSvgX(lowerBound)},${toSvgY(0)}`);
    
    return points.join(' ');
  };

  const handlePointerDown = (e: React.PointerEvent<SVGCircleElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = e.clientX - rect.left;
    const mathX = toMathX(svgX);
    const clampedX = Math.max(0.2, Math.min(2.8, mathX));
    setUpperBound(Number(clampedX.toFixed(2)));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Upper Bound: x = {upperBound.toFixed(2)}
          </label>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-900">
              ∫₀^{upperBound.toFixed(2)} x² dx = {definiteIntegral.toFixed(3)}
            </span>
          </div>
        </div>
        
        <input
          type="range"
          min={0.2}
          max={2.8}
          step={0.1}
          value={upperBound}
          onChange={(e) => setUpperBound(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="mx-auto touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            <pattern id="grid-integration" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#grid-integration)" />
          
          {/* Shaded area under curve */}
          <polygon
            points={generateShadedArea()}
            fill="#4f46e5"
            fillOpacity="0.3"
            stroke="none"
          />
          
          {/* Riemann rectangles overlay */}
          {generateRectangles()}
          
          {/* Axes */}
          <line x1={padding} y1={toSvgY(0)} x2={width - padding} y2={toSvgY(0)} stroke="#374151" strokeWidth="2" />
          <line x1={toSvgX(0)} y1={padding} x2={toSvgX(0)} y2={height - padding} stroke="#374151" strokeWidth="2" />
          
          <text x={width - padding + 5} y={toSvgY(0) + 5} fontSize="12" fill="#6b7280">x</text>
          <text x={toSvgX(0) + 5} y={padding - 5} fontSize="12" fill="#6b7280">y</text>
          
          {/* X-axis markers */}
          {[0, 1, 2].map(x => (
            <g key={x}>
              <line x1={toSvgX(x)} y1={toSvgY(0) - 5} x2={toSvgX(x)} y2={toSvgY(0) + 5} stroke="#374151" strokeWidth="1" />
              <text x={toSvgX(x)} y={toSvgY(0) + 20} fontSize="11" fill="#6b7280" textAnchor="middle">{x}</text>
            </g>
          ))}
          
          {/* Y-axis markers */}
          {[0, 2, 4, 6, 8].map(y => (
            <g key={y}>
              <line x1={toSvgX(0) - 5} y1={toSvgY(y)} x2={toSvgX(0) + 5} y2={toSvgY(y)} stroke="#374151" strokeWidth="1" />
              <text x={toSvgX(0) - 10} y={toSvgY(y) + 4} fontSize="11" fill="#6b7280" textAnchor="end">{y}</text>
            </g>
          ))}
          
          {/* Function curve */}
          <polyline points={generateCurve()} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Vertical lines at bounds */}
          <line x1={toSvgX(lowerBound)} y1={toSvgY(0)} x2={toSvgX(lowerBound)} y2={toSvgY(f(lowerBound))} stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
          <line x1={toSvgX(upperBound)} y1={toSvgY(0)} x2={toSvgX(upperBound)} y2={toSvgY(f(upperBound))} stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* Draggable point at upper bound */}
          <circle
            cx={toSvgX(upperBound)}
            cy={toSvgY(f(upperBound))}
            r="8"
            fill="#ef4444"
            stroke="white"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            style={{ touchAction: 'none' }}
          />
          
          {/* Labels */}
          <text x={width / 2} y={height - 10} fontSize="14" fill="#4f46e5" textAnchor="middle" fontWeight="600">
            f(x) = x²
          </text>
          
          <text x={toSvgX(upperBound / 2)} y={toSvgY(f(upperBound / 2)) - 20} fontSize="12" fill="#4f46e5" fontWeight="500" textAnchor="middle">
            Area = {definiteIntegral.toFixed(3)}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
          <div className="text-xs text-gray-900 font-medium mb-1">Function</div>
          <div className="text-sm font-semibold text-gray-900">f(x) = x²</div>
        </div>
        
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
          <div className="text-xs text-gray-900 font-medium mb-1">Antiderivative</div>
          <div className="text-sm font-semibold text-gray-900">F(x) = x³/3</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-600 font-medium mb-1">Definite Integral</div>
          <div className="text-sm font-semibold text-green-900">∫₀^{upperBound.toFixed(2)} = {definiteIntegral.toFixed(3)}</div>
        </div>
      </div>

      <div className="bg-gray-50 border-l-4 border-indigo-500 p-3">
        <p className="text-sm text-gray-700">
          <strong>Try it:</strong> Drag the red point to change the upper bound. The shaded area represents the definite integral 
          ∫₀^b x² dx = [x³/3]₀^b = b³/3. Notice how the area grows as you increase b.
        </p>
      </div>
    </div>
  );
}
