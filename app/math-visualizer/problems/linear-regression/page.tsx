import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  type CardGridItem,
  type CodeSample,
  CodeTabs,
  ContentSection,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
} from '@/components/content';
import LinearRegressionVisualizer from './LinearRegressionVisualizer';

export const metadata: Metadata = {
  title: 'Linear Regression - Math Visualizer | AllVisualizer',
  description:
    'Place points on a scatter plot and watch the least-squares regression line, residuals, Pearson correlation and R² update live. Try to beat the best fit with your own line.',
  keywords: ['linear regression', 'least squares', 'residuals', 'correlation', 'R squared', 'line of best fit', 'statistics'],
};

const ideas: CardGridItem[] = [
  {
    title: 'Residuals',
    description:
      'A residual is the vertical gap between a data point and the line: observed y minus predicted ŷ. Points above the line have positive residuals, points below have negative ones.',
  },
  {
    title: 'Least squares',
    description:
      'Square every residual and add them up to get the SSE. The least-squares line is the unique line that makes this sum as small as possible.',
  },
  {
    title: 'Pearson r',
    description:
      'A number from −1 to 1 measuring how tightly the points cluster around a straight line, and in which direction. r = 0 means no linear relationship.',
  },
  {
    title: 'R² (coefficient of determination)',
    description:
      'The fraction of the variation in y that the line explains. For simple linear regression R² = r². An R² of 0.9 means 90% of the spread in y is accounted for by x.',
  },
];

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `def least_squares(xs, ys):
    n = len(xs)
    mean_x = sum(xs) / n
    mean_y = sum(ys) / n
    sxx = sum((x - mean_x) ** 2 for x in xs)
    sxy = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
    slope = sxy / sxx
    intercept = mean_y - slope * mean_x
    return slope, intercept`,
  },
  {
    label: 'JavaScript',
    language: 'javascript',
    code: `function leastSquares(xs, ys) {
  const n = xs.length;
  const meanX = xs.reduce((s, x) => s + x, 0) / n;
  const meanY = ys.reduce((s, y) => s + y, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - meanX) ** 2;
    sxy += (xs[i] - meanX) * (ys[i] - meanY);
  }
  const slope = sxy / sxx;
  return { slope, intercept: meanY - slope * meanX };
}`,
  },
];

export default function LinearRegressionPage() {
  return (
    <DetailPage subject="math" item="linear-regression">
      <LinearRegressionVisualizer />

      <ContentSection title="What is linear regression?">
        <Prose>
          <p>
            Linear regression finds the straight line <strong>ŷ = bx + a</strong> that best describes how one
            variable y changes with another variable x. &quot;Best&quot; has a precise meaning: the line minimises the
            sum of the squared vertical distances (residuals) between the points and the line. This is the{' '}
            <strong>method of least squares</strong>.
          </p>
          <p>
            Squaring the residuals makes every error positive and punishes big misses much more than small ones. That
            is why a single outlier can drag the whole line towards it: load the &quot;With an outlier&quot; preset
            and watch the slope and R² collapse.
          </p>
        </Prose>
        <div className="mt-5">
          <CardGrid items={ideas} />
        </div>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Slope and intercept">
            <Formula
              where={[
                { symbol: 'x̄, ȳ', meaning: 'the means of the x and y values' },
                { symbol: 'Sxx', meaning: 'Σ(x − x̄)², the spread of x' },
                { symbol: 'Sxy', meaning: 'Σ(x − x̄)(y − ȳ), how x and y vary together' },
              ]}
            >
              b = Sxy / Sxx &nbsp;&nbsp; a = ȳ − b·x̄
            </Formula>
          </Callout>
          <Callout tone="formula" title="Correlation and goodness of fit">
            <Formula
              where={[
                { symbol: 'Syy', meaning: 'Σ(y − ȳ)², the total variation in y' },
                { symbol: 'SSE', meaning: 'Σ(y − ŷ)², the variation the line leaves unexplained' },
              ]}
            >
              r = Sxy / √(Sxx·Syy) &nbsp;&nbsp; R² = 1 − SSE / Syy = r²
            </Formula>
          </Callout>
          <Callout tone="tip" title="The line always passes through the mean">
            Because a = ȳ − b·x̄, the point (x̄, ȳ) is always on the least-squares line. The residuals also always add
            up to zero.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick a preset or press Clear and tap the plot to place your own points.',
            'Drag any point and watch the indigo least-squares line, slope, intercept, r and R² update instantly.',
            'Switch to Remove and tap points to delete them.',
            'Turn on "My guess line" and drag the orange handles. Try to get your SSE down to the minimum; you can match it, but never beat it.',
            'Load "With an outlier" and remove the stray point to see how strongly one point can bend the fit.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Computing the line in code">
        <CodeTabs samples={samples} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Fit three points"
            question="Find the least-squares line through (1, 2), (2, 3) and (3, 5), then compute SSE and R²."
            solution={
              <>
                <p>x̄ = 2, ȳ = 10/3 ≈ 3.333</p>
                <p>Sxx = 1 + 0 + 1 = 2</p>
                <p>Sxy = (−1)(−4/3) + 0 + (1)(5/3) = 3</p>
                <p>b = 3 / 2 = 1.5, a = 10/3 − 1.5 × 2 = 1/3</p>
                <p>ŷ = 1.5x + 0.333 → predictions 1.833, 3.333, 4.833</p>
                <p>Residuals 0.167, −0.333, 0.167 → SSE = 1/6 ≈ 0.167</p>
                <p>Syy = 16/9 + 1/9 + 25/9 = 42/9 ≈ 4.667</p>
                <p className="font-semibold text-emerald-700">R² = 1 − 0.167 / 4.667 ≈ 0.964</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Line from summary statistics"
            question="For a data set, x̄ = 10, ȳ = 40, the standard deviations are sₓ = 2 and sᵧ = 5, and r = 0.8. Find the regression line, predict y at x = 12, and interpret R²."
            solution={
              <>
                <p>Slope b = r · sᵧ / sₓ = 0.8 × 5 / 2 = 2</p>
                <p>Intercept a = ȳ − b·x̄ = 40 − 2 × 10 = 20</p>
                <p>ŷ = 2x + 20, so at x = 12: ŷ = 44</p>
                <p className="font-semibold text-emerald-700">R² = 0.8² = 0.64: the line explains 64% of the variation in y.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
