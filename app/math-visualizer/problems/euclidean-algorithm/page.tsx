import type { Metadata } from 'next';
import {
  Callout,
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
import EuclideanAlgorithmVisualizer from './EuclideanAlgorithmVisualizer';

export const metadata: Metadata = {
  title: 'Euclidean Algorithm - Math Visualizer | AllVisualizer',
  description:
    'Compute the greatest common divisor with repeated division. Step through a = qb + r, see the rectangle tiled with squares, and find the LCM and Bézout coefficients.',
  keywords: ['Euclidean algorithm', 'GCD', 'greatest common divisor', 'LCM', 'extended Euclid', 'Bézout', 'number theory'],
};

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a

def lcm(a, b):
    return a // gcd(a, b) * b`,
  },
  {
    label: 'JavaScript',
    language: 'javascript',
    code: `function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

const lcm = (a, b) => (a / gcd(a, b)) * b;`,
  },
];

export default function EuclideanAlgorithmPage() {
  return (
    <DetailPage subject="math" item="euclidean-algorithm">
      <EuclideanAlgorithmVisualizer />

      <ContentSection title="Why repeated division works">
        <Prose>
          <p>
            The greatest common divisor of a and b is the largest number that divides both. Instead of listing
            factors, Euclid noticed that if a = q·b + r, then <strong>gcd(a, b) = gcd(b, r)</strong>: any number that
            divides a and b also divides r = a − q·b, and any number that divides b and r also divides a. So we can
            replace the pair with a smaller pair without changing the answer.
          </p>
          <p>
            The remainders shrink every step, so they must eventually reach 0. At that point gcd(g, 0) = g, and the
            last non-zero remainder is the GCD.
          </p>
          <p>
            Geometrically, the GCD is the side of the largest square tile that can cover an a × b rectangle exactly.
            Cutting off as many b × b squares as possible leaves an r × b strip, and any square that tiles the whole
            rectangle must also tile that strip. Repeat until the strip is covered by squares with no leftover.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="space-y-4">
          <Callout tone="formula" title="Division step">
            <Formula
              where={[
                { symbol: 'q', meaning: 'the quotient, ⌊a / b⌋' },
                { symbol: 'r', meaning: 'the remainder, 0 ≤ r < b' },
              ]}
            >
              a = q·b + r &nbsp;⟹&nbsp; gcd(a, b) = gcd(b, r)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Least common multiple">
            <Formula>lcm(a, b) = a·b / gcd(a, b)</Formula>
            <p className="mt-2 text-sm">
              Compute it as (a / gcd)·b to keep the intermediate numbers small.
            </p>
          </Callout>
          <Callout tone="formula" title="Bézout's identity">
            <Formula where={[{ symbol: 's, t', meaning: 'integers found by the extended Euclidean algorithm' }]}>
              gcd(a, b) = s·a + t·b
            </Formula>
            <p className="mt-2 text-sm">
              Running the division steps backwards (back-substitution) writes the GCD as a combination of a and b.
              When gcd = 1, s is the inverse of a modulo b, which is how RSA keys are computed.
            </p>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Enter two whole numbers a and b, or pick one of the suggested pairs.',
            'Press Start over, then Next step to perform one division at a time. Each row and its squares share a colour.',
            'Watch the rectangle: each step places the largest squares that fit in the strip left over by the previous step.',
            'When the remainder reaches 0, read off the GCD (the side of the smallest square) and the LCM.',
            'Tick "Show extended Euclid" to see the table that produces the Bézout coefficients s and t.',
          ]}
        />
      </ContentSection>

      <ContentSection title="The algorithm in code">
        <div className="space-y-5">
          <CodeTabs samples={samples} />
          <Complexity
            time="O(log min(a, b))"
            space="O(1)"
            timeNote="The remainder at least halves every two steps. Consecutive Fibonacci numbers, such as 89 and 55, are the slowest case."
            spaceNote="Only the current pair is kept."
          />
        </div>
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: GCD and LCM"
            question="Use the Euclidean algorithm to find gcd(252, 105), then find lcm(252, 105)."
            solution={
              <>
                <p>252 = 2 × 105 + 42</p>
                <p>105 = 2 × 42 + 21</p>
                <p>42 = 2 × 21 + 0</p>
                <p>gcd(252, 105) = 21</p>
                <p className="font-semibold text-emerald-700">lcm = 252 × 105 / 21 = 12 × 105 = 1260</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Bézout coefficients"
            question="Find integers s and t with 240s + 46t = gcd(240, 46)."
            solution={
              <>
                <p>240 = 5 × 46 + 10</p>
                <p>46 = 4 × 10 + 6</p>
                <p>10 = 1 × 6 + 4</p>
                <p>6 = 1 × 4 + 2</p>
                <p>4 = 2 × 2 + 0, so gcd = 2</p>
                <p>Back-substitute:</p>
                <p>2 = 6 − 4 = 6 − (10 − 6) = 2·6 − 10</p>
                <p>&nbsp; = 2(46 − 4·10) − 10 = 2·46 − 9·10</p>
                <p>&nbsp; = 2·46 − 9(240 − 5·46) = 47·46 − 9·240</p>
                <p className="font-semibold text-emerald-700">s = −9, t = 47 (check: −2160 + 2162 = 2)</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
