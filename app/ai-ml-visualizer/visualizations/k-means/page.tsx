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
import KMeansVisualizer from './KMeansVisualizer';

export const metadata: Metadata = {
  title: 'K-Means Clustering - AI/ML Visualizer | AllVisualizer',
  description:
    'Step through k-means clustering one phase at a time: assign points to the nearest centroid, move centroids to the mean, and watch the WCSS fall. Compare random and k-means++ starts and use the elbow method to pick k.',
  keywords: ['k-means', 'clustering', 'centroids', 'elbow method', 'k-means++', 'unsupervised learning', 'WCSS', 'inertia'],
};

const ideas: CardGridItem[] = [
  {
    title: 'Centroid',
    description: 'The centre of a cluster: the mean of the points assigned to it. K-means keeps exactly k of them.',
  },
  {
    title: 'Assignment step',
    description: 'Every point joins the cluster of its nearest centroid. This carves the plane into Voronoi regions with straight borders.',
  },
  {
    title: 'Update step',
    description: 'Every centroid jumps to the mean of its points, the position that minimises that cluster’s squared distances.',
  },
  {
    title: 'Inertia (WCSS)',
    description: 'The total squared distance from each point to its centroid. Both steps can only lower it, so the algorithm always stops.',
  },
];

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `import numpy as np

def kmeans(X, k, iters=100, seed=0):
    rng = np.random.default_rng(seed)
    C = X[rng.choice(len(X), k, replace=False)]      # random data points
    for _ in range(iters):
        d = ((X[:, None, :] - C[None, :, :]) ** 2).sum(axis=2)
        labels = d.argmin(axis=1)                    # assignment step
        new_C = np.array([X[labels == j].mean(axis=0) if np.any(labels == j) else C[j]
                          for j in range(k)])        # update step
        if np.allclose(new_C, C):
            break
        C = new_C
    wcss = ((X - C[labels]) ** 2).sum()
    return C, labels, wcss`,
  },
  {
    label: 'scikit-learn',
    language: 'python',
    code: `from sklearn.cluster import KMeans

model = KMeans(n_clusters=3, init="k-means++", n_init=10, random_state=0)
labels = model.fit_predict(X)
print(model.cluster_centers_, model.inertia_)

# Elbow method
wcss = [KMeans(n_clusters=k, n_init=10).fit(X).inertia_ for k in range(1, 9)]`,
  },
];

export default function KMeansPage() {
  return (
    <DetailPage subject="ai-ml" item="k-means">
      <KMeansVisualizer />

      <ContentSection title="What is k-means?">
        <Prose>
          <p>
            K-means is an <strong>unsupervised</strong> algorithm: it gets points with no labels and has to find groups on
            its own. You choose the number of clusters k, and the algorithm looks for k centroids that make every point
            as close as possible to the centroid of its own cluster.
          </p>
          <p>
            It does this with two alternating steps (Lloyd&apos;s algorithm). Assign every point to its nearest centroid,
            then move every centroid to the mean of its points. Repeat until no point changes cluster. Each step lowers
            the within-cluster sum of squares, so the process always converges, but only to a <strong>local</strong>{' '}
            minimum that depends on where the centroids started.
          </p>
        </Prose>
        <div className="mt-5">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Objective: within-cluster sum of squares">
            <Formula
              where={[
                { symbol: 'Cⱼ', meaning: 'the set of points in cluster j' },
                { symbol: 'μⱼ', meaning: 'the centroid of cluster j' },
              ]}
            >
              WCSS = Σⱼ Σ<sub>x ∈ Cⱼ</sub> ‖x − μⱼ‖²
            </Formula>
          </Callout>
          <Callout tone="formula" title="The two steps">
            <Formula>
              assign: c(x) = argminⱼ ‖x − μⱼ‖² &nbsp;&nbsp; update: μⱼ = (1 / |Cⱼ|) Σ<sub>x ∈ Cⱼ</sub> x
            </Formula>
          </Callout>
          <Callout tone="formula" title="k-means++ seeding">
            <Formula where={[{ symbol: 'D(x)', meaning: 'distance from x to the nearest centroid chosen so far' }]}>
              P(pick x as next centroid) = D(x)² / Σ D(x′)²
            </Formula>
          </Callout>
          <Callout tone="tip" title="Choosing k with the elbow method">
            WCSS always falls as k grows (with k = n it reaches zero), so you cannot just minimise it. Plot it against k
            and pick the point where the curve bends: after that, extra clusters buy very little.
          </Callout>
          <Callout tone="warning" title="Where k-means fails">
            It assumes roughly round clusters of similar size and spread, because boundaries between clusters are always
            straight lines halfway between centroids. Curved shapes such as the moons, or clusters of very different
            sizes, need methods like DBSCAN, spectral clustering or Gaussian mixtures.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a dataset or press Clear and tap the plot to add your own points.',
            'Set k and choose an initialisation. Random picks k data points; k-means++ spreads the starts out.',
            'Press Assign points: each point takes the colour of its nearest centroid and a line is drawn to it.',
            'Press Update centroids: each centroid moves to the mean of its points, leaving a dashed trail.',
            'Keep stepping (or use Auto-play) until no point changes cluster. Watch WCSS fall in the chart.',
            'Use New random start several times with Random points to find starts that get stuck in a worse solution.',
            'Check the elbow chart, then load Moons with k = 2 to see the classic failure case.',
          ]}
        />
      </ContentSection>

      <ContentSection title="K-means in code">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Complexity">
        <Complexity
          time="O(n · k · d · i)"
          space="O(n + k · d)"
          timeNote="n points, k clusters, d dimensions, i iterations. Each assignment step compares every point with every centroid."
          spaceNote="The data, one label per point and k centroids."
        />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: One full iteration by hand"
            question="Points on a line: 1, 2, 3, 8, 9, 10, 11. Start with k = 2 and centroids μ₁ = 1, μ₂ = 3. Run k-means until it converges and give the final WCSS."
            solution={
              <>
                <p>Assign: 1 → μ₁. 2 is a tie (distance 1 to both); break it towards μ₁.</p>
                <p>3, 8, 9, 10, 11 → μ₂</p>
                <p>Update: μ₁ = 1.5, μ₂ = (3+8+9+10+11)/5 = 8.2</p>
                <p>Assign: 1, 2, 3 → μ₁ (3 is 1.5 from μ₁, 5.2 from μ₂); 8, 9, 10, 11 → μ₂</p>
                <p>Update: μ₁ = 2, μ₂ = 9.5</p>
                <p>Assign: nothing changes, so the algorithm has converged.</p>
                <p>WCSS = (1 + 0 + 1) + (2.25 + 0.25 + 0.25 + 2.25) = 2 + 5 = 7</p>
                <p className="font-semibold text-emerald-700">Final clusters {'{1, 2, 3}'} and {'{8, 9, 10, 11}'}, WCSS = 7.</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Reading an elbow chart"
            question="A dataset gives these WCSS values for k = 1 to 6: 120, 48, 21, 18, 16, 15. Which k would you choose, and why not k = 6?"
            solution={
              <>
                <p>Drops: 1→2: 72, 2→3: 27, 3→4: 3, 4→5: 2, 5→6: 1</p>
                <p>The big gains stop after k = 3; every extra cluster after that removes only 1 to 3 units.</p>
                <p>k = 6 has the lowest WCSS, but WCSS always decreases with k (it is 0 when every point is its own cluster),</p>
                <p>so the lowest value just means the most clusters, not the best structure.</p>
                <p className="font-semibold text-emerald-700">Choose k = 3, the elbow of the curve.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
