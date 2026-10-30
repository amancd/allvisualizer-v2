import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, type CodeSample, CodeTabs, ContentSection, DetailPage, Prose, type RelatedEntry, RelatedItems } from '@/components/content';
import DeterminantVisualizer from './DeterminantVisualizer';

export const metadata: Metadata = {
  title: 'Determinants - Linear Algebra | AllVisualizer',
  description:
    'Learn to calculate and interpret determinants for 2×2 and 3×3 matrices. Understand invertibility, volume scaling, and geometric meaning with interactive visualizations.',
  keywords: ['determinants', 'linear algebra', 'matrix determinant', 'cofactor expansion', 'invertibility', '2x2 determinant', '3x3 determinant'],
  openGraph: {
    title: 'Determinants - Interactive Linear Algebra | AllVisualizer',
    description: 'Master determinant calculations with step-by-step visualizations',
  },
};

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np

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
  },
  {
    label: 'JavaScript',
    language: 'javascript',
    code: `// Computing Determinants in Linear Algebra

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
  },
  {
    label: 'Math',
    language: 'text',
    code: `DETERMINANTS
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
• Software: Uses LU decomposition for efficiency`,
  },
];
const properties: CardGridItem[] = [
  { title: 'Multiplicative', description: <><p>det(AB) = det(A) × det(B)</p><p>The determinant of a product equals the product of the determinants.</p></> },
  { title: 'Invertibility test', description: <><p>det(A) ≠ 0 ⟺ A is invertible</p><p>A non-zero determinant means the inverse exists.</p></> },
  { title: 'Transpose invariant', description: <><p>det(Aᵀ) = det(A)</p><p>Transposing doesn&apos;t change the determinant.</p></> },
  { title: 'Geometric meaning', description: <><p>|det(A)| = volume scaling factor</p><p>The absolute value is the area (2D) or volume (3D) scaling.</p></> },
];

const applications: CardGridItem[] = [
  { title: 'System solvability', description: 'Check whether the system Ax = b has a unique solution (det(A) ≠ 0).' },
  { title: 'Area & volume', description: 'Calculate the area of a parallelogram or the volume of a parallelepiped.' },
  { title: 'Eigenvalues', description: 'Find eigenvalues by solving det(A − λI) = 0.' },
  { title: 'Matrix inverse', description: 'Compute the inverse using A⁻¹ = (1/det(A)) × adj(A).' },
];

const relatedTopics: RelatedEntry[] = [
  { slug: 'matrix-operations', note: 'Review matrix multiplication and addition' },
  { slug: 'matrix-inverse', note: 'Use determinants to find matrix inverses' },
  { title: 'Eigenvalues & Eigenvectors', note: 'Solve the characteristic equation using determinants' },
  { title: "Cramer's Rule", note: 'Solve linear systems using determinants' },
];

export default function DeterminantsPage() {
  return (
    <DetailPage
      subject="math"
      item="determinants"
      description="Master the computation and interpretation of determinants. Learn how this powerful scalar value reveals matrix properties, invertibility, and geometric transformations."
    >
      <ContentSection title="What is a determinant?" variant="card">
        <Prose>
          <p>
            The <strong>determinant</strong> is a scalar value computed from a square matrix that encodes important
            properties:
          </p>
          <ul>
            <li><strong>Invertibility:</strong> a matrix is invertible if and only if its determinant is non-zero.</li>
            <li><strong>Volume scaling:</strong> |det(A)| tells how much the transformation scales volumes.</li>
            <li><strong>Orientation:</strong> the sign indicates whether the transformation preserves or reverses orientation.</li>
            <li><strong>Linear independence:</strong> a zero determinant means the columns are linearly dependent.</li>
          </ul>
        </Prose>
      </ContentSection>

      <ContentSection
        title="Interactive calculator"
        description="Calculate determinants for 2×2 and 3×3 matrices. See step-by-step calculations and geometric interpretation."
      >
        <DeterminantVisualizer />
      </ContentSection>

      <ContentSection title="Understanding the formula">
        <div className="space-y-4">
          <Callout tone="formula" title="2×2 determinant: ad − bc">
            <p>
              For a 2×2 matrix, multiply the main diagonal elements and subtract the product of the off-diagonal
              elements.
            </p>
            <pre className="mt-2 rounded-lg border border-line bg-white p-3 font-mono text-[13px] text-ink">{`|a  b|
|c  d| = (a×d) − (b×c)`}</pre>
          </Callout>
          <Callout tone="formula" title="3×3 determinant: cofactor expansion">
            <p>
              For a 3×3 matrix, expand along the first row. Each element is multiplied by its <em>minor</em> (the
              determinant of the 2×2 submatrix) with alternating signs.
            </p>
            <div className="mt-2 rounded-lg border border-line bg-white p-3 font-mono text-[13px] text-ink">
              <p>det(A) = a₁₁M₁₁ − a₁₂M₁₂ + a₁₃M₁₃</p>
              <p className="text-xs text-ink-muted">(+ − + pattern continues)</p>
            </div>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Implementation">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Key properties">
        <CardGrid items={properties} />
      </ContentSection>

      <ContentSection title="Applications">
        <CardGrid items={applications} />
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems subject="math" current="determinants" items={relatedTopics} />
      </ContentSection>
    </DetailPage>
  );
}
