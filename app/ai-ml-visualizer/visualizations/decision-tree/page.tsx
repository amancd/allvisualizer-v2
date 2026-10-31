import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  type CardGridItem,
  type CodeSample,
  CodeTabs,
  Complexity,
  ContentSection,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
} from '@/components/content';
import DecisionTreeVisualizer from './DecisionTreeVisualizer';

export const metadata: Metadata = {
  title: 'Decision Trees - AI/ML Visualizer | AllVisualizer',
  description:
    'Grow a CART decision tree one split at a time. See every candidate threshold scored by Gini impurity or entropy, the regions the tree carves out of the plane, and how depth trades training accuracy for overfitting.',
  keywords: ['decision tree', 'CART', 'Gini impurity', 'entropy', 'information gain', 'overfitting', 'max depth', 'classification'],
};

const ideas: CardGridItem[] = [
  {
    title: 'Axis-aligned splits',
    description: 'Each internal node asks one yes/no question about one feature, such as "x ≤ 0.42?". The plane is cut into rectangles.',
  },
  {
    title: 'Impurity',
    description: 'A node is pure when all its samples share a class. Gini impurity and entropy are both 0 for a pure node and largest for a 50/50 mix.',
  },
  {
    title: 'Greedy growth',
    description: 'CART picks the single best split for the current node and never looks ahead. It is fast, but can miss splits that only pay off later (XOR).',
  },
  {
    title: 'Stopping rules',
    description: 'Max depth and a minimum number of samples per split stop the tree before it memorises every noisy point.',
  },
];

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np

def gini(y):
    if len(y) == 0:
        return 0.0
    p = np.bincount(y) / len(y)
    return 1 - (p ** 2).sum()

def best_split(X, y):
    best = (None, None, gini(y))              # feature, threshold, weighted impurity
    for f in range(X.shape[1]):
        values = np.unique(X[:, f])
        for t in (values[:-1] + values[1:]) / 2:  # midpoints
            left = X[:, f] <= t
            w = (left.sum() * gini(y[left]) + (~left).sum() * gini(y[~left])) / len(y)
            if w < best[2]:
                best = (f, t, w)
    return best`,
  },
  {
    label: 'scikit-learn',
    language: 'python',
    code: `from sklearn.tree import DecisionTreeClassifier, export_text

for depth in range(1, 9):
    tree = DecisionTreeClassifier(criterion="gini", max_depth=depth, min_samples_split=5)
    tree.fit(X_train, y_train)
    print(depth, tree.score(X_train, y_train), tree.score(X_test, y_test))

print(export_text(tree, feature_names=["x", "y"]))`,
  },
];

export default function DecisionTreePage() {
  return (
    <DetailPage subject="ai-ml" item="decision-tree">
      <DecisionTreeVisualizer />

      <ContentSection title="How a decision tree learns">
        <Prose>
          <p>
            A decision tree classifies a point by asking a sequence of simple questions. Start at the root, check one
            feature against a threshold, go left if the answer is yes and right if it is no, and repeat until you reach a
            leaf. The leaf predicts the majority class of the training samples that ended up there.
          </p>
          <p>
            <strong>CART</strong> (Classification and Regression Trees) builds the tree top-down. For the current node it
            tries every feature and every threshold between neighbouring values, scores each candidate by how pure the two
            children would be, and keeps the best one. Then it repeats on each child until a stopping rule kicks in.
          </p>
        </Prose>
        <div className="mt-5">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Impurity of a node">
            <Formula where={[{ symbol: 'pₖ', meaning: 'fraction of the node’s samples in class k' }]}>
              Gini = 1 − Σₖ pₖ² &nbsp;&nbsp; Entropy = −Σₖ pₖ log₂ pₖ
            </Formula>
          </Callout>
          <Callout tone="formula" title="Scoring a split">
            <Formula
              where={[
                { symbol: 'n, n_L, n_R', meaning: 'samples in the parent, left child and right child' },
                { symbol: 'I(·)', meaning: 'the chosen impurity (Gini or entropy)' },
              ]}
            >
              Gain = I(parent) − (n_L / n)·I(left) − (n_R / n)·I(right)
            </Formula>
          </Callout>
          <Callout tone="tip" title="Information gain">
            With entropy as the impurity, the gain is called information gain: the number of bits of uncertainty about the
            class that the question removes. Gini and entropy usually choose the same or very similar splits.
          </Callout>
          <Callout tone="warning" title="Overfitting">
            Grown without limits, a tree keeps splitting until every leaf is pure, carving tiny boxes around single noisy
            points. Training accuracy reaches 100% while test accuracy falls. Limit depth, require more samples per split,
            prune, or average many trees (random forests).
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a dataset. The tree starts as a single root node covering the whole plane.',
            'Read the split scan: each curve shows the weighted child impurity for every threshold on x or y. The lowest point is the split CART will make.',
            'Press Next split to apply it. A line divides the dashed region and two children appear in the tree diagram.',
            'Keep stepping, or press Grow full tree. Undo split walks back one step at a time.',
            'Raise max depth and lower min samples, then turn on Show test points: watch small boxes form around noise.',
            'Use the accuracy vs depth chart to find the depth where test accuracy stops improving.',
            'Load XOR: the first split barely helps because no single line separates the classes, which shows how greedy growth works.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Finding the best split in code">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Complexity">
        <Complexity
          time="O(d · n log n · depth)"
          space="O(nodes + n)"
          timeNote="Training: at each level of the tree, every feature is sorted and swept once over the samples it holds. Predicting one point takes O(depth)."
          spaceNote="The tree itself plus index lists for the samples at each node."
        />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Score a split with Gini"
            question="A node holds 10 samples: 6 blue and 4 orange. A split sends 5 blue and 1 orange left, and 1 blue and 3 orange right. Compute the Gini impurity of the node, of each child, and the gain."
            solution={
              <>
                <p>Parent: 1 − (0.6² + 0.4²) = 1 − 0.52 = 0.48</p>
                <p>Left (5, 1): 1 − ((5/6)² + (1/6)²) = 1 − 26/36 ≈ 0.278</p>
                <p>Right (1, 3): 1 − ((1/4)² + (3/4)²) = 1 − 10/16 = 0.375</p>
                <p>Weighted: 0.6 × 0.278 + 0.4 × 0.375 = 0.167 + 0.150 = 0.317</p>
                <p className="font-semibold text-emerald-700">Gain = 0.48 − 0.317 ≈ 0.163</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Choose the threshold"
            question="One feature, sorted: values 1, 2, 3, 4, 5, 6 with labels A, A, B, A, B, B. Which threshold does CART choose using entropy?"
            solution={
              <>
                <p>Candidates are the midpoints 1.5, 2.5, 3.5, 4.5, 5.5. Parent entropy = 1 (3 A, 3 B).</p>
                <p>2.5: left (A, A) H = 0; right (B, A, B, B) H = 0.811 → weighted 4/6 × 0.811 = 0.541</p>
                <p>4.5: left (A, A, B, A) H = 0.811; right (B, B) H = 0 → weighted 0.541</p>
                <p>3.5: left (A, A, B) H = 0.918; right (A, B, B) H = 0.918 → weighted 0.918</p>
                <p>1.5 and 5.5: one pure child of 1, the other (2, 3) mix: 5/6 × 0.971 = 0.809</p>
                <p className="font-semibold text-emerald-700">
                  2.5 and 4.5 tie with information gain 1 − 0.541 = 0.459; CART keeps the first one found, x ≤ 2.5.
                </p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
