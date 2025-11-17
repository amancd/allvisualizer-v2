'use client';

import { useState, useRef } from 'react';

export default function ChainRuleVisualizer() {
  const [xPoint, setXPoint] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 600;
  const height = 400;
  const padding = 50;
  
  const xMin = -2;
  const xMax = 3;
  const yMin = -1;
  const yMax = 8;

  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - 2 * padding);
  const toSvgY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - 2 * padding);
  const toMathX = (svgX: number) => xMin + ((svgX - padding) / (width - 2 * padding)) * (xMax - xMin);

  // Composite function: f(g(x)) where g(x) = x² and f(u) = u + 1
  // So h(x) = (x²) + 1 = x² + 1
  const g = (x: number) => x * x;  // Inner function
  const f = (u: number) => u + 1;  // Outer function
  const h = (x: number) => f(g(x));  // Composite function
  
  // Derivatives
  const gPrime = (x: number) => 2 * x;  // g'(x) = 2x
  const fPrime = (u: number) => 1;  // f'(u) = 1
  const hPrime = (x: number) => fPrime(g(x)) * gPrime(x);  // h'(x) = f'(g(x)) · g'(x) = 1 · 2x = 2x

  const generateCurve = () => {
    const points: string[] = [];
    for (let x = xMin; x <= xMax; x += 0.1) {
      const svgX = toSvgX(x);
      const svgY = toSvgY(h(x));
      points.push(`${svgX},${svgY}`);
    }
    return points.join(' ');
  };

  const generateTangent = () => {
    const slope = hPrime(xPoint);
    const yPoint = h(xPoint);
    const tangent = (x: number) => slope * (x - xPoint) + yPoint;
    const x1 = xPoint - 1.2;
    const x2 = xPoint + 1.2;
    
    return {
      x1: toSvgX(x1),
      y1: toSvgY(tangent(x1)),
      x2: toSvgX(x2),
      y2: toSvgY(tangent(x2)),
      slope: slope
    };
  };

  const tangent = generateTangent();
  const yPoint = h(xPoint);
  const gValue = g(xPoint);
  const fPrimeValue = fPrime(gValue);
  const gPrimeValue = gPrime(xPoint);

  const handlePointerDown = (e: React.PointerEvent<SVGCircleElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = e.clientX - rect.left;
    const mathX = toMathX(svgX);
    const clampedX = Math.max(xMin + 0.5, Math.min(xMax - 0.5, mathX));
    setXPoint(Number(clampedX.toFixed(2)));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Point x = {xPoint.toFixed(2)}
          </label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              h({xPoint.toFixed(2)}) = {yPoint.toFixed(2)}
            </span>
            <span className="text-sm font-semibold text-indigo-600">
              h'({xPoint.toFixed(2)}) = {hPrime(xPoint).toFixed(2)}
            </span>
          </div>
        </div>
        
        <input
          type="range"
          min={xMin + 0.5}
          max={xMax - 0.5}
          step={0.1}
          value={xPoint}
          onChange={(e) => setXPoint(Number(e.target.value))}
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
            <pattern id="grid-chain" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width={width} height={height} fill="url(#grid-chain)" />
          
          <line x1={padding} y1={toSvgY(0)} x2={width - padding} y2={toSvgY(0)} stroke="#374151" strokeWidth="2" />
          <line x1={toSvgX(0)} y1={padding} x2={toSvgX(0)} y2={height - padding} stroke="#374151" strokeWidth="2" />
          
          <text x={width - padding + 5} y={toSvgY(0) + 5} fontSize="12" fill="#6b7280">x</text>
          <text x={toSvgX(0) + 5} y={padding - 5} fontSize="12" fill="#6b7280">y</text>
          
          {[-1, 1, 2].map(x => (
            <g key={x}>
              <line x1={toSvgX(x)} y1={toSvgY(0) - 5} x2={toSvgX(x)} y2={toSvgY(0) + 5} stroke="#374151" strokeWidth="1" />
              <text x={toSvgX(x)} y={toSvgY(0) + 20} fontSize="11" fill="#6b7280" textAnchor="middle">{x}</text>
            </g>
          ))}
          
          {[0, 2, 4, 6].map(y => (
            <g key={y}>
              <line x1={toSvgX(0) - 5} y1={toSvgY(y)} x2={toSvgX(0) + 5} y2={toSvgY(y)} stroke="#374151" strokeWidth="1" />
              <text x={toSvgX(0) - 10} y={toSvgY(y) + 4} fontSize="11" fill="#6b7280" textAnchor="end">{y}</text>
            </g>
          ))}
          
          <polyline points={generateCurve()} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          <line x1={tangent.x1} y1={tangent.y1} x2={tangent.x2} y2={tangent.y2} stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
          
          <circle
            cx={toSvgX(xPoint)}
            cy={toSvgY(yPoint)}
            r="8"
            fill="#ef4444"
            stroke="white"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            style={{ touchAction: 'none' }}
          />
          
          <text x={width / 2} y={height - 10} fontSize="14" fill="#4f46e5" textAnchor="middle" fontWeight="600">
            h(x) = x² + 1
          </text>
          
          <text x={tangent.x2 + 10} y={tangent.y2} fontSize="12" fill="#10b981" fontWeight="500">
            slope = {tangent.slope.toFixed(2)}
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="text-xs text-purple-600 font-medium mb-1">Inner Function</div>
          <div className="text-sm font-semibold text-purple-900">g(x) = x²</div>
          <div className="text-xs text-purple-700 mt-1">g({xPoint.toFixed(2)}) = {gValue.toFixed(2)}</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-600 font-medium mb-1">Outer Function</div>
          <div className="text-sm font-semibold text-blue-900">f(u) = u + 1</div>
          <div className="text-xs text-blue-700 mt-1">f({gValue.toFixed(2)}) = {yPoint.toFixed(2)}</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="text-xs text-orange-600 font-medium mb-1">Chain Rule Calculation</div>
          <div className="text-sm font-semibold text-orange-900">h'(x) = f'(g(x)) · g'(x)</div>
          <div className="text-xs text-orange-700 mt-1">{fPrimeValue.toFixed(2)} × {gPrimeValue.toFixed(2)} = {hPrime(xPoint).toFixed(2)}</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-600 font-medium mb-1">Result</div>
          <div className="text-sm font-semibold text-green-900">h'(x) = 2x</div>
          <div className="text-xs text-green-700 mt-1">h'({xPoint.toFixed(2)}) = {hPrime(xPoint).toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-gray-50 border-l-4 border-indigo-500 p-3">
        <p className="text-sm text-gray-700">
          <strong>Chain Rule:</strong> For h(x) = f(g(x)), the derivative is h'(x) = f'(g(x)) · g'(x). 
          Drag the point to see how the outer function derivative f'(g(x)) = 1 multiplies with the inner derivative g'(x) = 2x.
        </p>
      </div>
    </div>
  );
}
