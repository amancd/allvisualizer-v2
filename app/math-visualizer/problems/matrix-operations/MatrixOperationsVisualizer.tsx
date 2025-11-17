'use client';

import { useState } from 'react';

export default function MatrixOperationsVisualizer() {
  const [operation, setOperation] = useState<'add' | 'multiply' | 'scalar'>('add');
  
  // Matrix A (2x2)
  const [a11, setA11] = useState(2);
  const [a12, setA12] = useState(1);
  const [a21, setA21] = useState(3);
  const [a22, setA22] = useState(4);
  
  // Matrix B (2x2)
  const [b11, setB11] = useState(1);
  const [b12, setB12] = useState(2);
  const [b21, setB21] = useState(2);
  const [b22, setB22] = useState(1);
  
  // Scalar
  const [scalar, setScalar] = useState(2);

  // Calculate results based on operation
  const getResult = () => {
    if (operation === 'add') {
      return {
        r11: a11 + b11,
        r12: a12 + b12,
        r21: a21 + b21,
        r22: a22 + b22
      };
    } else if (operation === 'multiply') {
      return {
        r11: a11 * b11 + a12 * b21,
        r12: a11 * b12 + a12 * b22,
        r21: a21 * b11 + a22 * b21,
        r22: a21 * b12 + a22 * b22
      };
    } else { // scalar
      return {
        r11: scalar * a11,
        r12: scalar * a12,
        r21: scalar * a21,
        r22: scalar * a22
      };
    }
  };

  const result = getResult();

  const MatrixInput = ({ 
    label, 
    values, 
    setters 
  }: { 
    label: string; 
    values: number[]; 
    setters: ((v: number) => void)[];
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-2xl text-gray-400">[</span>
        <div className="grid grid-cols-2 gap-2">
          {values.map((val, idx) => (
            <input
              key={idx}
              type="number"
              value={val}
              onChange={(e) => setters[idx](Number(e.target.value))}
              className="w-16 px-2 py-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          ))}
        </div>
        <span className="text-2xl text-gray-400">]</span>
      </div>
    </div>
  );

  const MatrixDisplay = ({ 
    label, 
    values, 
    color = "gray" 
  }: { 
    label: string; 
    values: { r11: number; r12: number; r21: number; r22: number };
    color?: string;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className={`flex items-center gap-2 bg-${color}-50 border border-${color}-200 rounded-lg p-3`}>
        <span className="text-2xl text-gray-400">[</span>
        <div className="grid grid-cols-2 gap-2">
          <div className={`w-16 px-2 py-2 text-center font-semibold text-${color}-900 bg-white border border-${color}-300 rounded`}>
            {values.r11}
          </div>
          <div className={`w-16 px-2 py-2 text-center font-semibold text-${color}-900 bg-white border border-${color}-300 rounded`}>
            {values.r12}
          </div>
          <div className={`w-16 px-2 py-2 text-center font-semibold text-${color}-900 bg-white border border-${color}-300 rounded`}>
            {values.r21}
          </div>
          <div className={`w-16 px-2 py-2 text-center font-semibold text-${color}-900 bg-white border border-${color}-300 rounded`}>
            {values.r22}
          </div>
        </div>
        <span className="text-2xl text-gray-400">]</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Operation Selector */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">Select Operation</label>
        <div className="flex gap-2">
          <button
            onClick={() => setOperation('add')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === 'add'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Addition (A + B)
          </button>
          <button
            onClick={() => setOperation('multiply')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === 'multiply'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Multiplication (A × B)
          </button>
          <button
            onClick={() => setOperation('scalar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              operation === 'scalar'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Scalar (k × A)
          </button>
        </div>
      </div>

      {/* Input Matrices */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 border-b border-gray-200">
        <MatrixInput
          label="Matrix A"
          values={[a11, a12, a21, a22]}
          setters={[setA11, setA12, setA21, setA22]}
        />
        
        {operation === 'scalar' ? (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Scalar k</label>
            <input
              type="number"
              value={scalar}
              onChange={(e) => setScalar(Number(e.target.value))}
              className="w-24 px-3 py-2 text-center text-lg font-semibold border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        ) : (
          <MatrixInput
            label="Matrix B"
            values={[b11, b12, b21, b22]}
            setters={[setB11, setB12, setB21, setB22]}
          />
        )}
        
        <MatrixDisplay
          label="Result"
          values={result}
          color="green"
        />
      </div>

      {/* Step-by-step Explanation */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Calculation Steps:</h3>
        
        {operation === 'add' && (
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">Matrix addition: Add corresponding elements</p>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs bg-white p-3 rounded border border-gray-200">
              <div>
                <span className="text-blue-600">C[1,1]</span> = A[1,1] + B[1,1] = {a11} + {b11} = <span className="font-bold text-green-600">{result.r11}</span>
              </div>
              <div>
                <span className="text-blue-600">C[1,2]</span> = A[1,2] + B[1,2] = {a12} + {b12} = <span className="font-bold text-green-600">{result.r12}</span>
              </div>
              <div>
                <span className="text-blue-600">C[2,1]</span> = A[2,1] + B[2,1] = {a21} + {b21} = <span className="font-bold text-green-600">{result.r21}</span>
              </div>
              <div>
                <span className="text-blue-600">C[2,2]</span> = A[2,2] + B[2,2] = {a22} + {b22} = <span className="font-bold text-green-600">{result.r22}</span>
              </div>
            </div>
          </div>
        )}
        
        {operation === 'multiply' && (
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">Matrix multiplication: Row × Column dot product</p>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs bg-white p-3 rounded border border-gray-200">
              <div>
                <span className="text-blue-600">C[1,1]</span> = A[1,•] · B[•,1] = ({a11}×{b11}) + ({a12}×{b21}) = <span className="font-bold text-green-600">{result.r11}</span>
              </div>
              <div>
                <span className="text-blue-600">C[1,2]</span> = A[1,•] · B[•,2] = ({a11}×{b12}) + ({a12}×{b22}) = <span className="font-bold text-green-600">{result.r12}</span>
              </div>
              <div>
                <span className="text-blue-600">C[2,1]</span> = A[2,•] · B[•,1] = ({a21}×{b11}) + ({a22}×{b21}) = <span className="font-bold text-green-600">{result.r21}</span>
              </div>
              <div>
                <span className="text-blue-600">C[2,2]</span> = A[2,•] · B[•,2] = ({a21}×{b12}) + ({a22}×{b22}) = <span className="font-bold text-green-600">{result.r22}</span>
              </div>
            </div>
          </div>
        )}
        
        {operation === 'scalar' && (
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">Scalar multiplication: Multiply each element by the scalar</p>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs bg-white p-3 rounded border border-gray-200">
              <div>
                <span className="text-blue-600">C[1,1]</span> = k × A[1,1] = {scalar} × {a11} = <span className="font-bold text-green-600">{result.r11}</span>
              </div>
              <div>
                <span className="text-blue-600">C[1,2]</span> = k × A[1,2] = {scalar} × {a12} = <span className="font-bold text-green-600">{result.r12}</span>
              </div>
              <div>
                <span className="text-blue-600">C[2,1]</span> = k × A[2,1] = {scalar} × {a21} = <span className="font-bold text-green-600">{result.r21}</span>
              </div>
              <div>
                <span className="text-blue-600">C[2,2]</span> = k × A[2,2] = {scalar} × {a22} = <span className="font-bold text-green-600">{result.r22}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Properties */}
      <div className="grid sm:grid-cols-3 gap-3">
        {operation === 'add' && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-600 font-medium mb-1">Commutative</div>
              <div className="text-sm text-blue-900">A + B = B + A</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-xs text-purple-600 font-medium mb-1">Associative</div>
              <div className="text-sm text-purple-900">(A + B) + C = A + (B + C)</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="text-xs text-orange-600 font-medium mb-1">Identity</div>
              <div className="text-sm text-orange-900">A + 0 = A</div>
            </div>
          </>
        )}
        
        {operation === 'multiply' && (
          <>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-xs text-red-600 font-medium mb-1">Not Commutative</div>
              <div className="text-sm text-red-900">A × B ≠ B × A</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-xs text-purple-600 font-medium mb-1">Associative</div>
              <div className="text-sm text-purple-900">(AB)C = A(BC)</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="text-xs text-orange-600 font-medium mb-1">Identity</div>
              <div className="text-sm text-orange-900">AI = IA = A</div>
            </div>
          </>
        )}
        
        {operation === 'scalar' && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-600 font-medium mb-1">Distributive</div>
              <div className="text-sm text-blue-900">k(A + B) = kA + kB</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="text-xs text-purple-600 font-medium mb-1">Associative</div>
              <div className="text-sm text-purple-900">(kl)A = k(lA)</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="text-xs text-orange-600 font-medium mb-1">Identity</div>
              <div className="text-sm text-orange-900">1 × A = A</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
