'use client';

import { useState } from 'react';
import Link from 'next/link';
import GiscusComments from '@/components/ui/GiscusComments';
import MatrixOperationsVisualizer from './MatrixOperationsVisualizer';

export default function MatrixOperationsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'mathematical'>('python');

  const codeExamples = {
    python: `import numpy as np

# Matrix Operations in Linear Algebra

# Define matrices
A = np.array([
    [2, 1],
    [3, 4]
])

B = np.array([
    [1, 2],
    [2, 1]
])

print("Matrix A:")
print(A)
print("\\nMatrix B:")
print(B)

# ==========================================
# 1. MATRIX ADDITION
# ==========================================
# Add corresponding elements: C[i,j] = A[i,j] + B[i,j]

C_add = A + B
print("\\n=== Matrix Addition: A + B ===")
print(C_add)

# Manual calculation
C_manual = np.zeros_like(A)
for i in range(A.shape[0]):
    for j in range(A.shape[1]):
        C_manual[i, j] = A[i, j] + B[i, j]
print("Manual calculation:", C_manual)

# ==========================================
# 2. MATRIX MULTIPLICATION
# ==========================================
# Row × Column dot product

C_mult = A @ B  # or np.dot(A, B) or A.dot(B)
print("\\n=== Matrix Multiplication: A × B ===")
print(C_mult)

# Manual calculation (for 2x2)
C_manual_mult = np.array([
    [A[0,0]*B[0,0] + A[0,1]*B[1,0], A[0,0]*B[0,1] + A[0,1]*B[1,1]],
    [A[1,0]*B[0,0] + A[1,1]*B[1,0], A[1,0]*B[0,1] + A[1,1]*B[1,1]]
])
print("Manual calculation:")
print(C_manual_mult)

# Note: Matrix multiplication is NOT commutative
print("\\nA × B:")
print(A @ B)
print("B × A:")
print(B @ A)
print("A × B == B × A?", np.array_equal(A @ B, B @ A))

# ==========================================
# 3. SCALAR MULTIPLICATION
# ==========================================
# Multiply each element by scalar

k = 2
C_scalar = k * A
print(f"\\n=== Scalar Multiplication: {k} × A ===")
print(C_scalar)

# ==========================================
# 4. MATRIX PROPERTIES
# ==========================================

# Identity matrix
I = np.eye(2)
print("\\n=== Identity Matrix ===")
print(I)
print("A × I =")
print(A @ I)
print("I × A =")
print(I @ A)

# Zero matrix
Z = np.zeros((2, 2))
print("\\n=== Zero Matrix ===")
print("A + 0 =")
print(A + Z)

# Transpose
print("\\n=== Transpose ===")
print("A^T =")
print(A.T)

# Determinant (2x2: ad - bc)
det_A = np.linalg.det(A)
det_B = np.linalg.det(B)
print(f"\\ndet(A) = {det_A}")
print(f"det(B) = {det_B}")
print(f"det(A × B) = {np.linalg.det(A @ B)}")
print(f"det(A) × det(B) = {det_A * det_B}")`,

    javascript: `// Matrix Operations in Linear Algebra

// Define matrices (2D arrays)
const A = [
  [2, 1],
  [3, 4]
];

const B = [
  [1, 2],
  [2, 1]
];

console.log("Matrix A:", A);
console.log("Matrix B:", B);

// ==========================================
// 1. MATRIX ADDITION
// ==========================================
function matrixAdd(A, B) {
  const rows = A.length;
  const cols = A[0].length;
  const result = [];
  
  for (let i = 0; i < rows; i++) {
    result[i] = [];
    for (let j = 0; j < cols; j++) {
      result[i][j] = A[i][j] + B[i][j];
    }
  }
  
  return result;
}

const C_add = matrixAdd(A, B);
console.log("\\n=== Matrix Addition: A + B ===");
console.log(C_add);

// ==========================================
// 2. MATRIX MULTIPLICATION
// ==========================================
function matrixMultiply(A, B) {
  const rowsA = A.length;
  const colsA = A[0].length;
  const colsB = B[0].length;
  const result = [];
  
  for (let i = 0; i < rowsA; i++) {
    result[i] = [];
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  
  return result;
}

const C_mult = matrixMultiply(A, B);
console.log("\\n=== Matrix Multiplication: A × B ===");
console.log(C_mult);

// Verify non-commutativity
const AB = matrixMultiply(A, B);
const BA = matrixMultiply(B, A);
console.log("\\nA × B:", AB);
console.log("B × A:", BA);
console.log("Are they equal?", JSON.stringify(AB) === JSON.stringify(BA));

// ==========================================
// 3. SCALAR MULTIPLICATION
// ==========================================
function scalarMultiply(k, A) {
  const rows = A.length;
  const cols = A[0].length;
  const result = [];
  
  for (let i = 0; i < rows; i++) {
    result[i] = [];
    for (let j = 0; j < cols; j++) {
      result[i][j] = k * A[i][j];
    }
  }
  
  return result;
}

const k = 2;
const C_scalar = scalarMultiply(k, A);
console.log(\`\\n=== Scalar Multiplication: \${k} × A ===\`);
console.log(C_scalar);

// ==========================================
// 4. HELPER FUNCTIONS
// ==========================================

// Identity matrix
function identityMatrix(n) {
  const I = [];
  for (let i = 0; i < n; i++) {
    I[i] = [];
    for (let j = 0; j < n; j++) {
      I[i][j] = i === j ? 1 : 0;
    }
  }
  return I;
}

// Transpose
function transpose(A) {
  const rows = A.length;
  const cols = A[0].length;
  const result = [];
  
  for (let j = 0; j < cols; j++) {
    result[j] = [];
    for (let i = 0; i < rows; i++) {
      result[j][i] = A[i][j];
    }
  }
  
  return result;
}

// Determinant (2x2 only)
function determinant2x2(A) {
  return A[0][0] * A[1][1] - A[0][1] * A[1][0];
}

console.log("\\n=== Additional Operations ===");
console.log("Identity:", identityMatrix(2));
console.log("A^T:", transpose(A));
console.log("det(A):", determinant2x2(A));`,

    mathematical: `MATRIX OPERATIONS
━━━━━━━━━━━━━━━━━

Matrices are rectangular arrays of numbers used in 
linear algebra to represent linear transformations.


MATRIX NOTATION
━━━━━━━━━━━━━━━

A m×n matrix has m rows and n columns:

        [a₁₁  a₁₂  ...  a₁ₙ]
    A = [a₂₁  a₂₂  ...  a₂ₙ]
        [ ⋮    ⋮    ⋱    ⋮ ]
        [aₘ₁  aₘ₂  ...  aₘₙ]


1. MATRIX ADDITION
━━━━━━━━━━━━━━━━━━

Add corresponding elements (matrices must have same dimensions):

    C = A + B
    cᵢⱼ = aᵢⱼ + bᵢⱼ

Example (2×2):
    [2  1]   [1  2]   [3  3]
    [3  4] + [2  1] = [5  5]

Properties:
• Commutative: A + B = B + A
• Associative: (A + B) + C = A + (B + C)
• Identity: A + 0 = A


2. MATRIX MULTIPLICATION
━━━━━━━━━━━━━━━━━━━━━━━

Row × Column dot product:

    C = A × B
    cᵢⱼ = Σₖ aᵢₖ · bₖⱼ

For A (m×n) and B (n×p), result is (m×p).

Example (2×2):
    [2  1]   [1  2]   [2·1+1·2  2·2+1·1]   [4  5]
    [3  4] × [2  1] = [3·1+4·2  3·2+4·1] = [11 10]

Step-by-step for C[1,1]:
    C[1,1] = A[1,•] · B[•,1]
           = (2, 1) · (1, 2)
           = 2×1 + 1×2
           = 4

Properties:
• NOT Commutative: A×B ≠ B×A (usually)
• Associative: (AB)C = A(BC)
• Distributive: A(B + C) = AB + AC
• Identity: AI = IA = A


3. SCALAR MULTIPLICATION
━━━━━━━━━━━━━━━━━━━━━━━

Multiply each element by scalar k:

    C = kA
    cᵢⱼ = k · aᵢⱼ

Example:
        [2  1]   [4  2]
    2 × [3  4] = [6  8]

Properties:
• Distributive: k(A + B) = kA + kB
• Associative: (kl)A = k(lA)
• Identity: 1·A = A


SPECIAL MATRICES
━━━━━━━━━━━━━━━━

Identity Matrix I (diagonal of 1s):
    [1  0]
    [0  1]

Zero Matrix 0 (all zeros):
    [0  0]
    [0  0]

Transpose A^T (flip rows/columns):
    [a  b]^T   [a  c]
    [c  d]   = [b  d]


DETERMINANT (2×2)
━━━━━━━━━━━━━━━━━

    det([a  b]) = ad - bc
       ([c  d])

Properties:
• det(AB) = det(A) × det(B)
• If det(A) ≠ 0, matrix is invertible


WHY MATRIX MULTIPLICATION?
━━━━━━━━━━━━━━━━━━━━━━━━

Represents composition of linear transformations.
If A rotates and B scales, then AB applies both 
transformations in sequence.

Used in:
• Computer graphics (3D transformations)
• Machine learning (neural networks)
• Physics (quantum mechanics)
• Engineering (systems of equations)`
  };

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
            <li>/</li>
            <li><Link href="/math-visualizer" className="hover:text-gray-900">Math Visualizer</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Matrix Operations</li>
          </ol>
        </nav>

        <article className="space-y-8">
          <header className="space-y-4 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-gray-200 text-gray-900 rounded font-medium">Linear Algebra</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">Beginner</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Matrix Operations
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Learn fundamental matrix operations: addition, multiplication, and scalar multiplication. Understand how matrices work and their essential properties.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">What are Matrices?</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <p className="text-gray-700">
                A <strong>matrix</strong> is a rectangular array of numbers arranged in rows and columns. 
                Matrices are fundamental in linear algebra and used extensively in computer graphics, machine learning, physics, and engineering.
              </p>
              
              <div className="space-y-2">
                <p className="font-semibold text-gray-900">Example Matrix (2×2):</p>
                <div className="flex items-center gap-2 text-lg font-mono">
                  <span>A =</span>
                  <div className="flex gap-1">
                    <span className="text-2xl text-gray-400">[</span>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="w-8 text-center">2</span>
                      <span className="w-8 text-center">1</span>
                      <span className="w-8 text-center">3</span>
                      <span className="w-8 text-center">4</span>
                    </div>
                    <span className="text-2xl text-gray-400">]</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">This is a 2×2 matrix (2 rows, 2 columns)</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Operations</h2>
            <p className="text-gray-600">
              Experiment with matrix addition, multiplication, and scalar multiplication. Change the values and operation to see results in real-time.
            </p>
            <MatrixOperationsVisualizer />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Understanding the Operations</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 border-l-4 border-gray-900 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Matrix Addition</h3>
                <p className="text-sm text-gray-900">
                  Add corresponding elements element-wise. Both matrices must have the same dimensions. 
                  Simple and intuitive: A + B means add each element in A to the corresponding element in B.
                </p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-900 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Matrix Multiplication</h3>
                <p className="text-sm text-gray-900 mb-2">
                  More complex: multiply rows of first matrix by columns of second matrix using dot product. 
                  For A×B, the number of columns in A must equal the number of rows in B.
                </p>
                <p className="text-sm text-gray-900">
                  <strong>Important:</strong> Matrix multiplication is NOT commutative! A×B ≠ B×A in general.
                </p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Scalar Multiplication</h3>
                <p className="text-sm text-orange-800">
                  Multiply every element in the matrix by a single number (scalar). 
                  This scales the entire matrix uniformly.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Implementation</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedLanguage('python')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'python'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setSelectedLanguage('javascript')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'javascript'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setSelectedLanguage('mathematical')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedLanguage === 'mathematical'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Math
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-300 font-medium">
                  {selectedLanguage === 'mathematical' ? 'Mathematical Notation' : selectedLanguage === 'python' ? 'matrix_ops.py' : 'matrix_ops.js'}
                </span>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-gray-100 whitespace-pre-wrap break-words">
                  {codeExamples[selectedLanguage]}
                </code>
              </pre>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Real-World Applications</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Computer Graphics</h3>
                <p className="text-gray-900 text-sm">
                  3D transformations (rotation, scaling, translation) use matrix multiplication
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Machine Learning</h3>
                <p className="text-green-800 text-sm">
                  Neural networks use matrix operations for forward/backward propagation
                </p>
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Image Processing</h3>
                <p className="text-gray-900 text-sm">
                  Images are matrices; filters and transformations use matrix operations
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Systems of Equations</h3>
                <p className="text-orange-800 text-sm">
                  Linear systems Ax = b solved using matrix operations
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Related Topics</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Determinants
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Calculate matrix determinants and their properties</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Matrix Inverse
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Finding inverse matrices and solving equations</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Eigenvalues & Eigenvectors
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Understanding matrix transformations</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Linear Transformations
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Visualize how matrices transform space</p>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Discussion</h2>
            <GiscusComments />
          </section>
        </article>
      </div>
    </div>
  );
}
