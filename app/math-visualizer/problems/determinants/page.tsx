'use client';

import { useState } from 'react';
import Link from 'next/link';
import GiscusComments from '@/components/ui/GiscusComments';
import DeterminantVisualizer from './DeterminantVisualizer';

export default function DeterminantsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'mathematical'>('python');

  const codeExamples = {
    python: `import numpy as np

# Computing Determinants in Linear Algebra

# ==========================================
# 2×2 DETERMINANT
# ==========================================

# Define a 2x2 matrix
A_2x2 = np.array([
    [3, 1],
    [2, 4]
])

print("Matrix A (2×2):")
print(A_2x2)

# Calculate determinant
det_A = np.linalg.det(A_2x2)
print(f"\\ndet(A) = {det_A}")

# Manual calculation: ad - bc
a, b = A_2x2[0]
c, d = A_2x2[1]
det_manual = a*d - b*c
print(f"Manual: {a}×{d} - {b}×{c} = {det_manual}")

# ==========================================
# 3×3 DETERMINANT
# ==========================================

A_3x3 = np.array([
    [3, 1, 2],
    [2, 4, 1],
    [1, 3, 2]
])

print("\\n" + "="*40)
print("Matrix A (3×3):")
print(A_3x3)

# Calculate determinant
det_A_3x3 = np.linalg.det(A_3x3)
print(f"\\ndet(A) = {det_A_3x3:.2f}")

# Manual calculation using cofactor expansion
# Expand along first row: a11*M11 - a12*M12 + a13*M13

# Minor M11 (remove row 1, col 1)
M11 = np.linalg.det(A_3x3[1:, 1:])  # [[4,1],[3,2]]
print(f"\\nM11 = {M11}")

# Minor M12 (remove row 1, col 2)
M12 = np.linalg.det(A_3x3[1:, [0,2]])  # [[2,1],[1,2]]
print(f"M12 = {M12}")

# Minor M13 (remove row 1, col 3)
M13 = np.linalg.det(A_3x3[1:, :2])  # [[2,4],[1,3]]
print(f"M13 = {M13}")

# Cofactor expansion
a11, a12, a13 = A_3x3[0]
det_manual_3x3 = a11*M11 - a12*M12 + a13*M13
print(f"\\nManual: {a11}×{M11} - {a12}×{M12} + {a13}×{M13} = {det_manual_3x3}")

# ==========================================
# DETERMINANT PROPERTIES
# ==========================================

B = np.array([
    [1, 2],
    [3, 4]
])

print("\\n" + "="*40)
print("PROPERTIES")
print("="*40)

# Property 1: det(AB) = det(A) × det(B)
C = A_2x2 @ B
det_C = np.linalg.det(C)
det_product = np.linalg.det(A_2x2) * np.linalg.det(B)
print(f"\\n1. Multiplicative Property:")
print(f"   det(AB) = {det_C:.2f}")
print(f"   det(A)×det(B) = {det_product:.2f}")

# Property 2: det(A^T) = det(A)
det_A_T = np.linalg.det(A_2x2.T)
print(f"\\n2. Transpose Property:")
print(f"   det(A) = {np.linalg.det(A_2x2):.2f}")
print(f"   det(A^T) = {det_A_T:.2f}")

# Property 3: det(kA) = k^n × det(A) for n×n matrix
k = 2
kA = k * A_2x2
det_kA = np.linalg.det(kA)
det_scaled = (k**2) * np.linalg.det(A_2x2)
print(f"\\n3. Scalar Multiplication (k={k}, n=2):")
print(f"   det({k}A) = {det_kA:.2f}")
print(f"   {k}^2 × det(A) = {det_scaled:.2f}")

# Property 4: det(A^-1) = 1/det(A)
if np.linalg.det(A_2x2) != 0:
    A_inv = np.linalg.inv(A_2x2)
    det_A_inv = np.linalg.det(A_inv)
    det_inverse = 1 / np.linalg.det(A_2x2)
    print(f"\\n4. Inverse Property:")
    print(f"   det(A^-1) = {det_A_inv:.2f}")
    print(f"   1/det(A) = {det_inverse:.2f}")

# ==========================================
# GEOMETRIC INTERPRETATION (2×2)
# ==========================================

print("\\n" + "="*40)
print("GEOMETRIC MEANING")
print("="*40)

# The determinant represents the signed area of the parallelogram
# formed by the column vectors

v1 = A_2x2[:, 0]  # First column
v2 = A_2x2[:, 1]  # Second column

print(f"\\nColumn vectors:")
print(f"v1 = {v1}")
print(f"v2 = {v2}")

area = abs(np.linalg.det(A_2x2))
print(f"\\nArea of parallelogram formed by v1 and v2: {area}")
print(f"Determinant (signed area): {np.linalg.det(A_2x2):.2f}")

if np.linalg.det(A_2x2) > 0:
    print("Positive det → vectors in counterclockwise orientation")
elif np.linalg.det(A_2x2) < 0:
    print("Negative det → vectors in clockwise orientation")
else:
    print("Zero det → vectors are collinear (linearly dependent)")

# ==========================================
# INVERTIBILITY CHECK
# ==========================================

def check_invertibility(matrix):
    det = np.linalg.det(matrix)
    print(f"\\nDeterminant: {det:.4f}")
    
    if abs(det) < 1e-10:  # Close to zero
        print("→ Matrix is SINGULAR (not invertible)")
        print("→ Columns are linearly dependent")
        print("→ No unique solution to Ax=b")
    else:
        print("→ Matrix is INVERTIBLE")
        print("→ Columns are linearly independent")
        print("→ Unique solution exists for Ax=b")

print("\\n" + "="*40)
print("INVERTIBILITY")
print("="*40)

check_invertibility(A_2x2)

# Singular matrix example
singular = np.array([[1, 2], [2, 4]])
print("\\nSingular matrix:")
print(singular)
check_invertibility(singular)`,

    javascript: `// Computing Determinants in Linear Algebra

// ==========================================
// 2×2 DETERMINANT
// ==========================================

function det2x2(matrix) {
  const [[a, b], [c, d]] = matrix;
  return a * d - b * c;
}

const A_2x2 = [
  [3, 1],
  [2, 4]
];

console.log("Matrix A (2×2):");
console.log(A_2x2);

const det_A = det2x2(A_2x2);
console.log(\`\\ndet(A) = \${det_A}\`);

// Manual breakdown
const [[a, b], [c, d]] = A_2x2;
console.log(\`Manual: \${a}×\${d} - \${b}×\${c} = \${a*d} - \${b*c} = \${det_A}\`);

// ==========================================
// 3×3 DETERMINANT
// ==========================================

function det3x3(matrix) {
  const [[a11, a12, a13],
         [a21, a22, a23],
         [a31, a32, a33]] = matrix;
  
  // Cofactor expansion along first row
  const M11 = det2x2([[a22, a23], [a32, a33]]);
  const M12 = det2x2([[a21, a23], [a31, a33]]);
  const M13 = det2x2([[a21, a22], [a31, a32]]);
  
  return a11 * M11 - a12 * M12 + a13 * M13;
}

const A_3x3 = [
  [3, 1, 2],
  [2, 4, 1],
  [1, 3, 2]
];

console.log("\\n" + "=".repeat(40));
console.log("Matrix A (3×3):");
console.log(A_3x3);

const det_A_3x3 = det3x3(A_3x3);
console.log(\`\\ndet(A) = \${det_A_3x3}\`);

// Manual calculation with steps
const [[a11, a12, a13]] = A_3x3;
const M11 = det2x2([[4, 1], [3, 2]]);
const M12 = det2x2([[2, 1], [1, 2]]);
const M13 = det2x2([[2, 4], [1, 3]]);

console.log(\`\\nCofactor expansion:\`);
console.log(\`M11 = \${M11}\`);
console.log(\`M12 = \${M12}\`);
console.log(\`M13 = \${M13}\`);
console.log(\`\${a11}×\${M11} - \${a12}×\${M12} + \${a13}×\${M13} = \${det_A_3x3}\`);

// ==========================================
// DETERMINANT PROPERTIES
// ==========================================

console.log("\\n" + "=".repeat(40));
console.log("PROPERTIES");
console.log("=".repeat(40));

// Matrix multiplication helper
function matrixMultiply(A, B) {
  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < A[0].length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

// Transpose helper
function transpose(matrix) {
  return matrix[0].map((_, colIndex) => 
    matrix.map(row => row[colIndex])
  );
}

const B = [[1, 2], [3, 4]];

// Property 1: det(AB) = det(A) × det(B)
const AB = matrixMultiply(A_2x2, B);
console.log(\`\\n1. Multiplicative: det(AB) = \${det2x2(AB)}\`);
console.log(\`   det(A)×det(B) = \${det2x2(A_2x2) * det2x2(B)}\`);

// Property 2: det(A^T) = det(A)
const A_T = transpose(A_2x2);
console.log(\`\\n2. Transpose: det(A^T) = \${det2x2(A_T)}\`);
console.log(\`   det(A) = \${det2x2(A_2x2)}\`);

// ==========================================
// GEOMETRIC INTERPRETATION
// ==========================================

console.log("\\n" + "=".repeat(40));
console.log("GEOMETRIC MEANING");
console.log("=".repeat(40));

const v1 = [A_2x2[0][0], A_2x2[1][0]];  // First column
const v2 = [A_2x2[0][1], A_2x2[1][1]];  // Second column

console.log(\`\\nColumn vectors: v1=[\${v1}], v2=[\${v2}]\`);
console.log(\`Area of parallelogram: \${Math.abs(det_A)}\`);

if (det_A > 0) {
  console.log("Positive → counterclockwise orientation");
} else if (det_A < 0) {
  console.log("Negative → clockwise orientation");
} else {
  console.log("Zero → vectors are collinear");
}

// ==========================================
// INVERTIBILITY CHECK
// ==========================================

function checkInvertibility(matrix) {
  const det = det2x2(matrix);
  console.log(\`\\nDeterminant: \${det}\`);
  
  if (Math.abs(det) < 0.0001) {
    console.log("→ Matrix is SINGULAR (not invertible)");
  } else {
    console.log("→ Matrix is INVERTIBLE");
  }
}

console.log("\\n" + "=".repeat(40));
console.log("INVERTIBILITY");
console.log("=".repeat(40));

checkInvertibility(A_2x2);

const singular = [[1, 2], [2, 4]];
console.log("\\nSingular matrix:");
checkInvertibility(singular);`,

    mathematical: `DETERMINANTS
━━━━━━━━━━━━

The determinant is a scalar value that encodes important 
properties of a square matrix.


NOTATION
━━━━━━━━

    det(A)  or  |A|  or  |a  b|
                        |c  d|


2×2 DETERMINANT
━━━━━━━━━━━━━━━

For matrix A = [a  b]
              [c  d]

    det(A) = ad - bc

Example:
    |3  1|
    |2  4| = (3)(4) - (1)(2) = 12 - 2 = 10

Step-by-step:
    1. Multiply diagonal elements: a×d = 3×4 = 12
    2. Multiply off-diagonal: b×c = 1×2 = 2
    3. Subtract: ad - bc = 12 - 2 = 10


3×3 DETERMINANT
━━━━━━━━━━━━━━━

For matrix A = [a₁₁  a₁₂  a₁₃]
              [a₂₁  a₂₂  a₂₃]
              [a₃₁  a₃₂  a₃₃]

Cofactor expansion along row 1:

    det(A) = a₁₁M₁₁ - a₁₂M₁₂ + a₁₃M₁₃

Where Mᵢⱼ is the minor (determinant of 2×2 submatrix
obtained by removing row i and column j).

Example:
    |3  1  2|
    |2  4  1| = 3|4  1| - 1|2  1| + 2|2  4|
    |1  3  2|     |3  2|    |1  2|    |1  3|

    = 3(4×2 - 1×3) - 1(2×2 - 1×1) + 2(2×3 - 4×1)
    = 3(8 - 3) - 1(4 - 1) + 2(6 - 4)
    = 3(5) - 1(3) + 2(2)
    = 15 - 3 + 4
    = 16

Alternative: Rule of Sarrus (3×3 only)
    Copy first two columns, multiply diagonals:
    (+) ↘ diagonals minus (-) ↙ diagonals


PROPERTIES OF DETERMINANTS
━━━━━━━━━━━━━━━━━━━━━━━━━

1. Multiplicative Property
   det(AB) = det(A) × det(B)

2. Transpose Property
   det(Aᵀ) = det(A)

3. Inverse Property
   det(A⁻¹) = 1/det(A)  (if det(A) ≠ 0)

4. Scalar Multiplication
   det(kA) = kⁿ × det(A)  for n×n matrix

5. Row Operations
   • Swap two rows → det changes sign
   • Multiply row by k → det multiplied by k
   • Add multiple of one row to another → det unchanged

6. Triangular Matrices
   det(diagonal/triangular) = product of diagonal elements

7. Row/Column Properties
   • Zero row/column → det = 0
   • Identical rows/columns → det = 0
   • Proportional rows/columns → det = 0


GEOMETRIC INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━

2D (2×2 Matrix):
The determinant equals the signed area of the parallelogram
formed by the column vectors.

For A = [a  b], columns are v₁ = [a] and v₂ = [b]
        [c  d]                    [c]        [d]

    |det(A)| = area of parallelogram spanned by v₁, v₂

    Sign of det(A):
    • Positive → v₁ to v₂ is counterclockwise
    • Negative → v₁ to v₂ is clockwise
    • Zero → vectors are collinear (parallel)

3D (3×3 Matrix):
The determinant equals the signed volume of the
parallelepiped formed by the three column vectors.


INVERTIBILITY
━━━━━━━━━━━━━

A matrix A is invertible if and only if det(A) ≠ 0

    det(A) = 0  →  Singular (not invertible)
                   • No inverse exists
                   • Columns linearly dependent
                   • Maps space to lower dimension

    det(A) ≠ 0  →  Non-singular (invertible)
                   • Inverse exists
                   • Columns linearly independent
                   • Unique solution to Ax = b


APPLICATIONS
━━━━━━━━━━━━

1. Solving Linear Systems
   Cramer's rule uses determinants to solve Ax = b

2. Computing Inverses
   A⁻¹ = (1/det(A)) × adj(A)

3. Eigenvalues
   det(A - λI) = 0 gives characteristic equation

4. Volume Scaling
   det(A) tells how transformation A scales volumes

5. Orientation
   Sign of det indicates if transformation preserves
   or reverses orientation


COMPUTATION TIPS
━━━━━━━━━━━━━━━━

• For 2×2: Use formula directly (fast)
• For 3×3: Cofactor expansion or Sarrus
• For n×n (n>3): Use row reduction to triangular form,
  then multiply diagonal elements
• Software: Uses LU decomposition for efficiency`
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
            <li><Link href="/math-visualizer/linear-algebra" className="hover:text-gray-900">Linear Algebra</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Determinants</li>
          </ol>
        </nav>

        <article className="space-y-8">
          <header className="space-y-4 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-gray-200 text-gray-900 rounded font-medium">Linear Algebra</span>
              <span className="text-gray-400">•</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">Intermediate</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Determinants
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Master the computation and interpretation of determinants. Learn how this powerful scalar value reveals matrix properties, invertibility, and geometric transformations.
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">What is a Determinant?</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
              <p className="text-gray-700">
                The <strong>determinant</strong> is a scalar value computed from a square matrix that encodes important properties:
              </p>
              
              <ul className="space-y-2 text-gray-700 list-disc list-inside">
                <li><strong>Invertibility:</strong> A matrix is invertible if and only if its determinant is non-zero</li>
                <li><strong>Volume scaling:</strong> |det(A)| tells how much the transformation scales volumes</li>
                <li><strong>Orientation:</strong> The sign indicates if the transformation preserves or reverses orientation</li>
                <li><strong>Linear independence:</strong> Zero determinant means columns are linearly dependent</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Calculator</h2>
            <p className="text-gray-600">
              Calculate determinants for 2×2 and 3×3 matrices. See step-by-step calculations and geometric interpretation.
            </p>
            <DeterminantVisualizer />
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Understanding the Formula</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 border-l-4 border-gray-900 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">2×2 Determinant: ad - bc</h3>
                <p className="text-sm text-gray-900 mb-2">
                  For a 2×2 matrix, multiply the main diagonal elements and subtract the product of the off-diagonal elements.
                </p>
                <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm">
                  |a  b|<br/>
                  |c  d| = (a×d) - (b×c)
                </div>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-900 p-4">
                <h3 className="font-semibold text-gray-900 mb-2">3×3 Determinant: Cofactor Expansion</h3>
                <p className="text-sm text-gray-900 mb-2">
                  For a 3×3 matrix, expand along the first row. Each element is multiplied by its <em>minor</em> (the determinant of the 2×2 submatrix) with alternating signs.
                </p>
                <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm">
                  det(A) = a₁₁M₁₁ - a₁₂M₁₂ + a₁₃M₁₃<br/>
                  <span className="text-xs text-gray-600">(+ - + pattern continues)</span>
                </div>
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
                  {selectedLanguage === 'mathematical' ? 'Mathematical Notation' : selectedLanguage === 'python' ? 'determinants.py' : 'determinants.js'}
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
            <h2 className="text-2xl font-bold text-gray-900">Key Properties</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Multiplicative</h3>
                <p className="text-gray-900 text-sm mb-1">det(AB) = det(A) × det(B)</p>
                <p className="text-gray-900 text-xs">Determinant of product equals product of determinants</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Invertibility Test</h3>
                <p className="text-green-800 text-sm mb-1">det(A) ≠ 0 ⟺ A is invertible</p>
                <p className="text-green-700 text-xs">Non-zero determinant means inverse exists</p>
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Transpose Invariant</h3>
                <p className="text-gray-900 text-sm mb-1">det(Aᵀ) = det(A)</p>
                <p className="text-gray-900 text-xs">Transposing doesn't change the determinant</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-2">Geometric Meaning</h3>
                <p className="text-orange-800 text-sm mb-1">|det(A)| = volume scaling factor</p>
                <p className="text-orange-700 text-xs">Absolute value is area (2D) or volume (3D) scaling</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">System Solvability</h3>
                <p className="text-gray-900 text-sm">
                  Check if system Ax = b has unique solution (det(A) ≠ 0)
                </p>
              </div>
              
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h3 className="font-semibold text-pink-900 mb-2">Area & Volume</h3>
                <p className="text-pink-800 text-sm">
                  Calculate area of parallelogram or volume of parallelepiped
                </p>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <h3 className="font-semibold text-teal-900 mb-2">🎯 Eigenvalues</h3>
                <p className="text-teal-800 text-sm">
                  Find eigenvalues by solving det(A - λI) = 0
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-2">🔄 Matrix Inverse</h3>
                <p className="text-amber-800 text-sm">
                  Compute inverse using A⁻¹ = (1/det(A)) × adj(A)
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Related Topics</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href="/math-visualizer/problems/matrix-operations"
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors group"
              >
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-900">← Matrix Operations</h3>
                <p className="text-sm text-gray-600">Review matrix multiplication and addition</p>
              </Link>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Matrix Inverse
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Use determinants to find matrix inverses</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Eigenvalues & Eigenvectors
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Solve characteristic equation using determinants</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors opacity-60 cursor-not-allowed">
                <h3 className="font-semibold text-gray-700 mb-1 flex items-center justify-between">
                  Cramer's Rule
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </h3>
                <p className="text-sm text-gray-500">Solve linear systems using determinants</p>
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
