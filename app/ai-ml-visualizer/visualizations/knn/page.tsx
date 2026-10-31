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
import KnnVisualizer from './KnnVisualizer';

export const metadata: Metadata = {
  title: 'K-Nearest Neighbors - AI/ML Visualizer | AllVisualizer',
  description:
    'Drag a query point and watch its k nearest neighbours vote. See how the decision boundary changes with k and the distance metric, and find the k with the best test accuracy.',
  keywords: ['k-nearest neighbors', 'KNN', 'classification', 'decision boundary', 'Euclidean distance', 'Manhattan distance', 'overfitting'],
};

const ideas: CardGridItem[] = [
  {
    title: 'Lazy learning',
    description: 'There is no training step. The model is the training set itself; all the work happens when you ask for a prediction.',
  },
  {
    title: 'Small k',
    description: 'k = 1 copies the label of the single closest point. Boundaries become jagged islands around every noisy point: overfitting.',
  },
  {
    title: 'Large k',
    description: 'Many voters smooth the boundary. Push k too far and the majority class swallows the minority: underfitting.',
  },
  {
    title: 'Distance metric',
    description: 'Euclidean distance measures a straight line; Manhattan adds up the axis steps. The neighbourhood is a circle or a diamond.',
  },
];

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np
from collections import Counter

def knn_predict(X_train, y_train, x, k=5, metric="euclidean"):
    diff = X_train - x
    if metric == "euclidean":
        d = np.sqrt((diff ** 2).sum(axis=1))
    else:                                   # manhattan
        d = np.abs(diff).sum(axis=1)
    nearest = np.argsort(d)[:k]
    votes = Counter(y_train[nearest])
    return votes.most_common(1)[0][0]`,
  },
  {
    label: 'scikit-learn',
    language: 'python',
    code: `from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)
for k in range(1, 26):
    model = KNeighborsClassifier(n_neighbors=k, metric="euclidean").fit(X_train, y_train)
    print(k, model.score(X_train, y_train), model.score(X_test, y_test))`,
  },
];

export default function KnnPage() {
  return (
    <DetailPage subject="ai-ml" item="knn">
      <KnnVisualizer />

      <ContentSection title="How k-nearest neighbours works">
        <Prose>
          <p>
            KNN is a <strong>supervised</strong> classifier built on one idea: points that are close together usually
            share a label. To classify a new point, measure its distance to every training point, take the k closest,
            and let them vote. The most common label wins.
          </p>
          <p>
            Because every location in the plane gets a vote, KNN implicitly draws a <strong>decision boundary</strong>.
            The value of k controls how wiggly that boundary is, and the right k is found by checking accuracy on data the
            model has not seen: the held-out test set.
          </p>
        </Prose>
        <div className="mt-5">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Distance metrics">
            <Formula>
              Euclidean: d(p, q) = √((p₁ − q₁)² + (p₂ − q₂)²) &nbsp;&nbsp; Manhattan: d(p, q) = |p₁ − q₁| + |p₂ − q₂|
            </Formula>
          </Callout>
          <Callout tone="formula" title="Majority vote">
            <Formula
              where={[
                { symbol: 'Nₖ(x)', meaning: 'the k training points nearest to x' },
                { symbol: '𝟙[·]', meaning: '1 when the condition holds, otherwise 0' },
              ]}
            >
              ŷ(x) = argmax<sub>c</sub> Σ<sub>i ∈ Nₖ(x)</sub> 𝟙[yᵢ = c]
            </Formula>
          </Callout>
          <Callout tone="tip" title="Practical tips">
            Use an odd k for two classes to avoid ties. Scale features first: if one feature is measured in thousands
            and another in fractions, the large one decides every distance on its own.
          </Callout>
          <Callout tone="warning" title="The curse of dimensionality">
            In high dimensions all points end up roughly the same distance apart, so &quot;nearest&quot; stops meaning
            much. KNN works best with a modest number of meaningful features.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Drag the diamond around. The k nearest training points are circled and their votes appear in the tally.',
            'Move the k slider. At k = 1 the regions break into islands around single noisy points; larger k smooths them out.',
            'Switch between Euclidean and Manhattan and watch the neighbourhood change from a circle to a diamond.',
            'Choose "Add blue" (or another class) under "Tap to" and tap the plot to add labelled training points.',
            'Read the accuracy chart: training accuracy is highest at k = 1, but test accuracy usually peaks at a moderate k.',
          ]}
        />
      </ContentSection>

      <ContentSection title="KNN in code">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Complexity">
        <Complexity
          time="O(n · d) per query"
          space="O(n · d)"
          timeNote="Training is free. Each prediction measures the distance to all n training points in d dimensions, plus O(n) to select the k smallest. KD-trees or approximate search speed this up."
          spaceNote="The whole training set has to be stored and kept around for predictions."
        />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Classify by hand"
            question="Training points: A(1, 1) red, B(2, 1) red, C(4, 3) blue, D(5, 4) blue, E(3, 3) red. Classify q = (3, 2) with k = 3 using Euclidean distance, then again with Manhattan distance."
            solution={
              <>
                <p>Euclidean: A √5 ≈ 2.24, B √2 ≈ 1.41, C √2 ≈ 1.41, D √8 ≈ 2.83, E 1</p>
                <p>3 nearest: E (red), B (red), C (blue) → 2 red, 1 blue</p>
                <p>Manhattan: A 3, B 2, C 2, D 4, E 1</p>
                <p>3 nearest: E (red), B (red), C (blue) → 2 red, 1 blue</p>
                <p className="font-semibold text-emerald-700">Both metrics predict red.</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Picking k"
            question="A KNN model scores: k = 1 → train 100%, test 78%; k = 7 → train 90%, test 88%; k = 51 → train 74%, test 73%. Which k would you pick, and what is happening at each end?"
            solution={
              <>
                <p>k = 1: perfect on training data, much worse on test data → overfitting.</p>
                <p>The model memorises noise: every mislabelled point gets its own island.</p>
                <p>k = 51: train and test accuracy are both low and close together → underfitting.</p>
                <p>The vote is so broad that it ignores local structure.</p>
                <p className="font-semibold text-emerald-700">Pick k = 7: the highest test accuracy, with a small train/test gap.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
