'use client';

import { useState, useRef } from 'react';

export default function OptimizationVisualizer() {
  const [baseWidth, setBaseWidth] = useState(4);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 600;
  const height = 500;
  const padding = 50;
  
  const xMin = 0;
  const xMax = 8;
  const yMin = 0;
  const yMax = 20;

  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const toSvgY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);
  const toMathX = (svgX: number) => xMin + ((svgX - padding) / (width - 2 * padding)) * (xMax - xMin);

  // Problem: Maximize area of rectangle with perimeter = 16
  // Perimeter: 2w + 2h = 16  =>  h = 8 - w
  // Area: A(w) = w * h = w(8 - w) = 8w - w²
  const perimeter = 16;
  const area = (w: number) => w * (perimeter / 2 - w);
  
  // Derivative: A'(w) = 8 - 2w
  const derivative = (w: number) => perimeter / 2 - 2 * w;
  
  // Critical point (where derivative = 0): w = 4
  const criticalPoint = perimeter / 4;
  const maxArea = area(criticalPoint);

  const currentArea = area(baseWidth);
  const currentHeight = perimeter / 2 - baseWidth;
  const currentDerivative = derivative(baseWidth);

  const generateCurve = () => {
    const points: string[] = [];
    for (let w = 0.5; w <= perimeter / 2 - 0.5; w += 0.1) {
      const svgX = toSvgX(w);
      const svgY = toSvgY(area(w));
      points.push(`${svgX},${svgY}`);
    }
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
    const clampedX = Math.max(0.5, Math.min(7.5, mathX));
    setBaseWidth(Number(clampedX.toFixed(2)));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Rectangle dimensions for visualization
  const rectScale = 30;
  const rectX = 50;
  const rectY = height - 180;
  const rectWidth = baseWidth * rectScale;
  const rectHeight = currentHeight * rectScale;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Width: {baseWidth.toFixed(2)} units
          </label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Height: {currentHeight.toFixed(2)} units
            </span>
            <span className={`text-sm font-semibold ${currentArea === maxArea ? 'text-green-600' : 'text-gray-900'}`}>
              Area: {currentArea.toFixed(2)} sq units
            </span>
          </div>
        </div>
        
        <input
          type="range"
          min={0.5}
          max={7.5}
          step={0.1}
          value={baseWidth}
          onChange={(e) => setBaseWidth(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      <div className="space-y-4">
        {/* Area Function Graph */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Area Function: A(w) = w(8-w)</h3>
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
              <pattern id="grid-opt" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#grid-opt)" />
            
            {/* Axes */}
            <line x1={padding} y1={toSvgY(0)} x2={width - padding} y2={toSvgY(0)} stroke="#374151" strokeWidth="2" />
            <line x1={toSvgX(0)} y1={padding} x2={toSvgX(0)} y2={height - padding} stroke="#374151" strokeWidth="2" />
            
            <text x={width - padding + 5} y={toSvgY(0) + 5} fontSize="11" fill="#6b7280">w</text>
            <text x={toSvgX(0) + 5} y={padding - 5} fontSize="11" fill="#6b7280">A</text>
            
            {/* Axis markers */}
            {[0, 2, 4, 6, 8].map(x => (
              <g key={x}>
                <line x1={toSvgX(x)} y1={toSvgY(0) - 4} x2={toSvgX(x)} y2={toSvgY(0) + 4} stroke="#374151" strokeWidth="1" />
                <text x={toSvgX(x)} y={toSvgY(0) + 18} fontSize="10" fill="#6b7280" textAnchor="middle">{x}</text>
              </g>
            ))}
            
            {[0, 5, 10, 15].map(y => (
              <g key={y}>
                <line x1={toSvgX(0) - 4} y1={toSvgY(y)} x2={toSvgX(0) + 4} y2={toSvgY(y)} stroke="#374151" strokeWidth="1" />
                <text x={toSvgX(0) - 8} y={toSvgY(y) + 4} fontSize="10" fill="#6b7280" textAnchor="end">{y}</text>
              </g>
            ))}
            
            {/* Function curve */}
            <polyline points={generateCurve()} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Critical point (maximum) */}
            <circle cx={toSvgX(criticalPoint)} cy={toSvgY(maxArea)} r="6" fill="#10b981" stroke="white" strokeWidth="2" />
            <text x={toSvgX(criticalPoint)} y={toSvgY(maxArea) - 12} fontSize="11" fill="#10b981" fontWeight="600" textAnchor="middle">
              Max
            </text>
            
            {/* Current point */}
            <circle
              cx={toSvgX(baseWidth)}
              cy={toSvgY(currentArea)}
              r="8"
              fill="#ef4444"
              stroke="white"
              strokeWidth="2"
              className="cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              style={{ touchAction: 'none' }}
            />
            
            {/* Vertical line to x-axis */}
            <line x1={toSvgX(baseWidth)} y1={toSvgY(currentArea)} x2={toSvgX(baseWidth)} y2={toSvgY(0)} stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
          </svg>
        </div>

        {/* Rectangle Visualization */}
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
          <div className="relative">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Rectangle (Perimeter = 16)</h3>
            <svg width="280" height="280">
              {/* Rectangle */}
              <rect
                x={(280 - rectWidth) / 2}
                y={(280 - rectHeight) / 2}
                width={rectWidth}
                height={rectHeight}
                fill="#4f46e5"
                fillOpacity="0.2"
                stroke="#4f46e5"
                strokeWidth="3"
              />
              
              {/* Width label */}
              <line 
                x1={(280 - rectWidth) / 2} 
                y1={(280 - rectHeight) / 2 - 15}
                x2={(280 + rectWidth) / 2}
                y2={(280 - rectHeight) / 2 - 15}
                stroke="#4f46e5"
                strokeWidth="2"
                markerStart="url(#arrowstart)"
                markerEnd="url(#arrowend)"
              />
              <text 
                x={140} 
                y={(280 - rectHeight) / 2 - 20}
                fontSize="13"
                fill="#4f46e5"
                fontWeight="600"
                textAnchor="middle"
              >
                w = {baseWidth.toFixed(2)}
              </text>
              
              {/* Height label */}
              <line 
                x1={(280 + rectWidth) / 2 + 15}
                y1={(280 - rectHeight) / 2}
                x2={(280 + rectWidth) / 2 + 15}
                y2={(280 + rectHeight) / 2}
                stroke="#10b981"
                strokeWidth="2"
              />
              <text 
                x={(280 + rectWidth) / 2 + 20}
                y={140}
                fontSize="13"
                fill="#10b981"
                fontWeight="600"
                textAnchor="start"
              >
                h = {currentHeight.toFixed(2)}
              </text>
              
              {/* Area label */}
              <text 
                x={140}
                y={140}
                fontSize="16"
                fill="#374151"
                fontWeight="700"
                textAnchor="middle"
              >
                A = {currentArea.toFixed(2)}
              </text>
              
              <defs>
                <marker id="arrowstart" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <polygon points="8,5 2,2 2,8" fill="#4f46e5" />
                </marker>
                <marker id="arrowend" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <polygon points="2,5 8,2 8,8" fill="#4f46e5" />
                </marker>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
          <div className="text-xs text-gray-900 font-medium mb-1">Constraint</div>
          <div className="text-sm font-semibold text-gray-900">2w + 2h = 16</div>
        </div>
        
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
          <div className="text-xs text-gray-900 font-medium mb-1">Objective</div>
          <div className="text-sm font-semibold text-gray-900">A = w·h</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="text-xs text-orange-600 font-medium mb-1">Derivative</div>
          <div className="text-sm font-semibold text-orange-900">A'(w) = {currentDerivative.toFixed(2)}</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-600 font-medium mb-1">Maximum</div>
          <div className="text-sm font-semibold text-green-900">A = 16 at w=4</div>
        </div>
      </div>

      <div className="bg-gray-50 border-l-4 border-indigo-500 p-3">
        <p className="text-sm text-gray-700">
          <strong>Try it:</strong> Drag the red point or slider to change the rectangle width. Notice that the area is maximized when 
          w = 4 (making it a square), where the derivative A'(w) = 0. This is a critical point!
        </p>
      </div>
    </div>
  );
}
