'use client';

import { useState } from 'react';

export default function DeterminantVisualizer() {
  const [matrixSize, setMatrixSize] = useState<2 | 3>(2);
  
  // 2x2 matrix
  const [a11, setA11] = useState(3);
  const [a12, setA12] = useState(1);
  const [a21, setA21] = useState(2);
  const [a22, setA22] = useState(4);
  
  // 3x3 matrix (extends 2x2)
  const [a13, setA13] = useState(2);
  const [a23, setA23] = useState(1);
  const [a31, setA31] = useState(1);
  const [a32, setA32] = useState(3);
  const [a33, setA33] = useState(2);

  // Calculate 2x2 determinant: ad - bc
  const det2x2 = (m11: number, m12: number, m21: number, m22: number) => {
    return m11 * m22 - m12 * m21;
  };

  // Calculate 3x3 determinant using cofactor expansion
  const det3x3 = () => {
    // det = a11(a22*a33 - a23*a32) - a12(a21*a33 - a23*a31) + a13(a21*a32 - a22*a31)
    const minor1 = det2x2(a22, a23, a32, a33);
    const minor2 = det2x2(a21, a23, a31, a33);
    const minor3 = det2x2(a21, a22, a31, a32);
    
    return a11 * minor1 - a12 * minor2 + a13 * minor3;
  };

  const determinant = matrixSize === 2 ? det2x2(a11, a12, a21, a22) : det3x3();

  // Geometric interpretation for 2x2
  const getParallelogramPoints = () => {
    const scale = 30;
    const offsetX = 200;
    const offsetY = 200;
    
    // Vector 1: (a11, a21)
    const v1x = a11 * scale;
    const v1y = -a21 * scale; // Negative because SVG y grows downward
    
    // Vector 2: (a12, a22)
    const v2x = a12 * scale;
    const v2y = -a22 * scale;
    
    return {
      origin: { x: offsetX, y: offsetY },
      v1: { x: offsetX + v1x, y: offsetY + v1y },
      v2: { x: offsetX + v2x, y: offsetY + v2y },
      sum: { x: offsetX + v1x + v2x, y: offsetY + v1y + v2y },
      scale
    };
  };

  const parallelogram = matrixSize === 2 ? getParallelogramPoints() : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Size Selector */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">Matrix Size</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMatrixSize(2)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              matrixSize === 2
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            2×2 Matrix
          </button>
          <button
            onClick={() => setMatrixSize(3)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              matrixSize === 3
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            3×3 Matrix
          </button>
        </div>
      </div>

      {/* Matrix Input */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <label className="text-sm font-semibold text-gray-700">Matrix A</label>
        <div className="flex items-center gap-3">
          <span className="text-3xl text-gray-400">|</span>
          <div className={`grid ${matrixSize === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
            {/* Row 1 */}
            <input
              type="number"
              value={a11}
              onChange={(e) => setA11(Number(e.target.value))}
              className="w-16 px-2 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <input
              type="number"
              value={a12}
              onChange={(e) => setA12(Number(e.target.value))}
              className="w-16 px-2 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            {matrixSize === 3 && (
              <input
                type="number"
                value={a13}
                onChange={(e) => setA13(Number(e.target.value))}
                className="w-16 px-2 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            )}
            
            {/* Row 2 */}
            <input
              type="number"
              value={a21}
              onChange={(e) => setA21(Number(e.target.value))}
              className="w-16 px-2 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <input
              type="number"
              value={a22}
              onChange={(e) => setA22(Number(e.target.value))}
              className="w-16 px-2 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            {matrixSize === 3 && (
              <input
                type="number"
                value={a23}
                onChange={(e) => setA23(Number(e.target.value))}
                className="w-16 px-2 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            )}
            
            {/* Row 3 */}
            {matrixSize === 3 && (
              <>
                <input
                  type="number"
                  value={a31}
                  onChange={(e) => setA31(Number(e.target.value))}
                  className="w-16 px-2 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={a32}
                  onChange={(e) => setA32(Number(e.target.value))}
                  className="w-16 px-2 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <input
                  type="number"
                  value={a33}
                  onChange={(e) => setA33(Number(e.target.value))}
                  className="w-16 px-2 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </>
            )}
          </div>
          <span className="text-3xl text-gray-400">|</span>
        </div>
      </div>

      {/* Determinant Result */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
        <div className="text-center space-y-2">
          <div className="text-sm font-semibold text-gray-700">Determinant</div>
          <div className="text-4xl font-bold text-green-700">
            det(A) = {determinant}
          </div>
          <div className="text-sm text-gray-600">
            {determinant === 0 ? (
              <span className="text-red-600 font-medium">⚠️ Matrix is singular (not invertible)</span>
            ) : determinant > 0 ? (
              <span className="text-green-600">✓ Matrix is invertible (preserves orientation)</span>
            ) : (
              <span className="text-gray-900">✓ Matrix is invertible (reverses orientation)</span>
            )}
          </div>
        </div>
      </div>

      {/* Calculation Steps */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Calculation Steps:</h3>
        
        {matrixSize === 2 ? (
          <div className="space-y-2 text-sm">
            <p className="text-gray-700 font-medium">Formula for 2×2: det(A) = ad - bc</p>
            <div className="bg-white p-4 rounded border border-gray-200 space-y-2">
              <div className="font-mono text-sm">
                <div className="mb-2 text-gray-600">
                  Where matrix A = <span className="ml-2">|{a11}  {a12}|</span>
                  <br />
                  <span className="ml-[140px]">|{a21}  {a22}|</span>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-700">
                    det(A) = <span className="text-gray-900">({a11})</span> × <span className="text-gray-900">({a22})</span> - <span className="text-red-600">({a12})</span> × <span className="text-red-600">({a21})</span>
                  </div>
                  <div className="text-gray-700 ml-16">
                    = <span className="text-gray-900">{a11 * a22}</span> - <span className="text-red-600">{a12 * a21}</span>
                  </div>
                  <div className="text-gray-700 ml-16 font-bold text-green-600">
                    = {determinant}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p className="text-gray-700 font-medium">Cofactor expansion along first row:</p>
            <div className="bg-white p-4 rounded border border-gray-200 space-y-3 font-mono text-xs">
              <div>
                det(A) = a₁₁M₁₁ - a₁₂M₁₂ + a₁₃M₁₃
              </div>
              
              <div className="space-y-2 border-t border-gray-200 pt-2">
                <div>
                  <span className="text-gray-900">M₁₁</span> = |{a22} {a23}| = ({a22})×({a33}) - ({a23})×({a32}) = <span className="font-bold">{det2x2(a22, a23, a32, a33)}</span>
                  <br />
                  <span className="ml-8">|{a32} {a33}|</span>
                </div>
                
                <div>
                  <span className="text-red-600">M₁₂</span> = |{a21} {a23}| = ({a21})×({a33}) - ({a23})×({a31}) = <span className="font-bold">{det2x2(a21, a23, a31, a33)}</span>
                  <br />
                  <span className="ml-8">|{a31} {a33}|</span>
                </div>
                
                <div>
                  <span className="text-gray-900">M₁₃</span> = |{a21} {a22}| = ({a21})×({a32}) - ({a22})×({a31}) = <span className="font-bold">{det2x2(a21, a22, a31, a32)}</span>
                  <br />
                  <span className="ml-8">|{a31} {a32}|</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-2">
                det(A) = <span className="text-gray-900">({a11})</span> × <span className="text-gray-900">({det2x2(a22, a23, a32, a33)})</span> - <span className="text-red-600">({a12})</span> × <span className="text-red-600">({det2x2(a21, a23, a31, a33)})</span> + <span className="text-gray-900">({a13})</span> × <span className="text-gray-900">({det2x2(a21, a22, a31, a32)})</span>
                <br />
                <span className="ml-[60px]">= {a11 * det2x2(a22, a23, a32, a33)} - {a12 * det2x2(a21, a23, a31, a33)} + {a13 * det2x2(a21, a22, a31, a32)}</span>
                <br />
                <span className="ml-[60px] font-bold text-green-600">= {determinant}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Geometric Interpretation (2x2 only) */}
      {matrixSize === 2 && parallelogram && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Geometric Interpretation</h3>
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
            <p className="text-sm text-gray-900 mb-3">
              For a 2×2 matrix, the determinant represents the <strong>signed area</strong> of the parallelogram 
              formed by the column vectors.
            </p>
            
            <svg width="400" height="400" className="mx-auto bg-white border border-gray-300 rounded">
              {/* Grid */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#grid)" />
              
              {/* Axes */}
              <line x1="0" y1="200" x2="400" y2="200" stroke="#9ca3af" strokeWidth="2" />
              <line x1="200" y1="0" x2="200" y2="400" stroke="#9ca3af" strokeWidth="2" />
              
              {/* Parallelogram */}
              <polygon
                points={`${parallelogram.origin.x},${parallelogram.origin.y} ${parallelogram.v1.x},${parallelogram.v1.y} ${parallelogram.sum.x},${parallelogram.sum.y} ${parallelogram.v2.x},${parallelogram.v2.y}`}
                fill={determinant >= 0 ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}
                stroke={determinant >= 0 ? "#22c55e" : "#ef4444"}
                strokeWidth="2"
              />
              
              {/* Vector 1 (blue) - column 1 */}
              <line
                x1={parallelogram.origin.x}
                y1={parallelogram.origin.y}
                x2={parallelogram.v1.x}
                y2={parallelogram.v1.y}
                stroke="#3b82f6"
                strokeWidth="3"
                markerEnd="url(#arrowhead-blue)"
              />
              
              {/* Vector 2 (red) - column 2 */}
              <line
                x1={parallelogram.origin.x}
                y1={parallelogram.origin.y}
                x2={parallelogram.v2.x}
                y2={parallelogram.v2.y}
                stroke="#ef4444"
                strokeWidth="3"
                markerEnd="url(#arrowhead-red)"
              />
              
              {/* Arrowheads */}
              <defs>
                <marker id="arrowhead-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                </marker>
                <marker id="arrowhead-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
                </marker>
              </defs>
              
              {/* Labels */}
              <text x={parallelogram.v1.x + 10} y={parallelogram.v1.y} fill="#3b82f6" fontSize="14" fontWeight="bold">
                v₁ = [{a11}, {a21}]
              </text>
              <text x={parallelogram.v2.x + 10} y={parallelogram.v2.y} fill="#ef4444" fontSize="14" fontWeight="bold">
                v₂ = [{a12}, {a22}]
              </text>
            </svg>
            
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <div>• <span className="text-gray-900 font-semibold">Blue vector</span>: First column [{a11}, {a21}]</div>
              <div>• <span className="text-red-600 font-semibold">Red vector</span>: Second column [{a12}, {a22}]</div>
              <div>• <span className={`font-semibold ${determinant >= 0 ? 'text-green-600' : 'text-red-600'}`}>Area</span>: |det(A)| = |{determinant}| = {Math.abs(determinant)}</div>
              <div>• <span className="font-semibold">Sign</span>: {determinant > 0 ? 'Positive (counterclockwise)' : determinant < 0 ? 'Negative (clockwise)' : 'Zero (vectors are collinear)'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Properties */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
          <div className="text-xs text-gray-900 font-medium mb-1">Multiplicative</div>
          <div className="text-sm text-gray-900">det(AB) = det(A)×det(B)</div>
        </div>
        
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
          <div className="text-xs text-gray-900 font-medium mb-1">Transpose</div>
          <div className="text-sm text-gray-900">det(Aᵀ) = det(A)</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="text-xs text-orange-600 font-medium mb-1">Inverse</div>
          <div className="text-sm text-orange-900">det(A⁻¹) = 1/det(A)</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-xs text-green-600 font-medium mb-1">Scalar Multiple</div>
          <div className="text-sm text-green-900">det(kA) = k^n×det(A)</div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="text-xs text-red-600 font-medium mb-1">Row Swap</div>
          <div className="text-sm text-red-900">Swapping rows negates det</div>
        </div>
        
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
          <div className="text-xs text-gray-900 font-medium mb-1">Invertibility</div>
          <div className="text-sm text-indigo-900">det(A) ≠ 0 ⟺ A is invertible</div>
        </div>
      </div>
    </div>
  );
}
