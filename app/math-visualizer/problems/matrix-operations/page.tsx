import type { Metadata } from 'next';
import { Callout, CardGrid, type CardGridItem, type CodeSample, CodeTabs, ContentSection, DetailPage, Prose, type RelatedEntry, RelatedItems } from '@/components/content';
import MatrixOperationsVisualizer from './MatrixOperationsVisualizer';

export const metadata: Metadata = {
  title: 'Matrix Operations - Linear Algebra | AllVisualizer',
  description:
    'Learn matrix operations with interactive visualizations. Master matrix addition, multiplication, scalar multiplication, and understand their properties with step-by-step examples.',
  keywords: ['matrix operations', 'linear algebra', 'matrix multiplication', 'matrix addition', 'scalar multiplication', 'linear transformations'],
  openGraph: {
    title: 'Matrix Operations - Interactive Linear Algebra | AllVisualizer',
    description: 'Master matrix operations with interactive visualizations',
  },
};

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np

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
  },
  {
    label: 'JavaScript',
    language: 'javascript',
    code: `// Matrix Operations in Linear Algebra

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
  },
  {
    label: 'Math',
    language: 'text',
    code: `MATRIX OPERATIONS
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
• Engineering (systems of equations)`,
  },
];
const applications: CardGridItem[] = [
  { title: 'Computer graphics', description: '3D transformations (rotation, scaling, translation) use matrix multiplication.' },
  { title: 'Machine learning', description: 'Neural networks use matrix operations for forward and backward propagation.' },
  { title: 'Image processing', description: 'Images are matrices; filters and transformations use matrix operations.' },
  { title: 'Systems of equations', description: 'Linear systems Ax = b are solved using matrix operations.' },
];

const relatedTopics: RelatedEntry[] = [
  { slug: 'determinants', note: 'Calculate matrix determinants and their properties' },
  { slug: 'matrix-inverse', note: 'Finding inverse matrices and solving equations' },
  { title: 'Eigenvalues & Eigenvectors', note: 'Understanding matrix transformations' },
  { title: 'Linear Transformations', note: 'Visualize how matrices transform space' },
];

export default function MatrixOperationsPage() {
  return (
    <DetailPage
      subject="math"
      item="matrix-operations"
      description="Learn fundamental matrix operations: addition, multiplication, and scalar multiplication. Understand how matrices work and their essential properties."
    >
      <ContentSection title="What are matrices?" variant="card">
        <Prose>
          <p>
            A <strong>matrix</strong> is a rectangular array of numbers arranged in rows and columns. Matrices are
            fundamental in linear algebra and used extensively in computer graphics, machine learning, physics, and
            engineering.
          </p>
        </Prose>
        <Callout tone="example" title="Example matrix (2×2)" className="mt-5">
          <div className="flex items-center gap-2 font-mono text-lg text-ink">
            <span>A =</span>
            <span className="text-2xl text-ink-muted">[</span>
            <div className="grid grid-cols-2 gap-2">
              {[2, 1, 3, 4].map((n, i) => (
                <span key={i} className="w-8 text-center">{n}</span>
              ))}
            </div>
            <span className="text-2xl text-ink-muted">]</span>
          </div>
          <p className="mt-2">This is a 2×2 matrix (2 rows, 2 columns).</p>
        </Callout>
      </ContentSection>

      <ContentSection
        title="Interactive operations"
        description="Experiment with matrix addition, multiplication, and scalar multiplication. Change the values and operation to see results in real time."
      >
        <MatrixOperationsVisualizer />
      </ContentSection>

      <ContentSection title="Understanding the operations">
        <div className="space-y-4">
          <Callout tone="note" title="Matrix addition">
            Add corresponding elements element-wise. Both matrices must have the same dimensions. Simple and intuitive:
            A + B means add each element in A to the corresponding element in B.
          </Callout>
          <Callout tone="note" title="Matrix multiplication">
            <p>
              More complex: multiply rows of the first matrix by columns of the second matrix using the dot product. For
              A×B, the number of columns in A must equal the number of rows in B.
            </p>
            <p className="mt-2">
              <strong>Important:</strong> Matrix multiplication is NOT commutative! A×B ≠ B×A in general.
            </p>
          </Callout>
          <Callout tone="note" title="Scalar multiplication">
            Multiply every element in the matrix by a single number (scalar). This scales the entire matrix uniformly.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="Implementation">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Real-world applications">
        <CardGrid items={applications} />
      </ContentSection>

      <ContentSection title="Related topics">
        <RelatedItems subject="math" current="matrix-operations" items={relatedTopics} />
      </ContentSection>
    </DetailPage>
  );
}
