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
import SieveVisualizer from './SieveVisualizer';

export const metadata: Metadata = {
  title: 'Sieve of Eratosthenes - Math Visualizer | AllVisualizer',
  description:
    'Watch the Sieve of Eratosthenes find every prime up to N. Step through the algorithm as it crosses out multiples from p², coloured by smallest prime factor.',
  keywords: ['sieve of Eratosthenes', 'prime numbers', 'primes', 'multiples', 'number theory', 'algorithm'],
};

const samples: CodeSample[] = [
  {
    label: 'Python',
    language: 'python',
    code: `def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for m in range(p * p, n + 1, p):
                is_prime[m] = False
        p += 1
    return [k for k in range(n + 1) if is_prime[k]]`,
  },
  {
    label: 'JavaScript',
    language: 'javascript',
    code: `function sieve(n) {
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let p = 2; p * p <= n; p++) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = false;
  }
  return isPrime.flatMap((ok, k) => (ok ? [k] : []));
}`,
  },
];

export default function SieveOfEratosthenesPage() {
  return (
    <DetailPage subject="math" item="sieve-of-eratosthenes">
      <SieveVisualizer />

      <ContentSection title="How the sieve works">
        <Prose>
          <p>
            Write down every whole number from 2 to N. The smallest number not yet crossed out is prime, because no
            smaller prime divides it. Cross out all of its multiples, then move on to the next number that survives.
            Repeat until you are done: whatever is left standing is prime.
          </p>
          <p>
            The sieve never tests a number for divisibility. It only <em>adds</em>, jumping through the list in steps
            of p, which is why it is so fast. Each composite number gets its colour from the first prime that reaches
            it, which is always its <strong>smallest prime factor</strong>.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Two shortcuts">
        <div className="space-y-4">
          <Callout tone="formula" title="Start crossing at p²">
            <Formula>first multiple to cross = p × p</Formula>
            <p className="mt-2 text-sm">
              Any smaller multiple k·p with k &lt; p has a prime factor smaller than p, so it was already crossed out
              when that smaller prime was processed. For example, when p = 7 the numbers 14, 21, 28, 35 and 42 are
              already gone, so the first new one is 49.
            </p>
          </Callout>
          <Callout tone="formula" title="Stop once p² > N">
            <Formula>sieving primes: p ≤ √N</Formula>
            <p className="mt-2 text-sm">
              If a composite n = a × b had both factors greater than √N, then a × b would be greater than N. So every
              composite up to N has a prime factor at most √N. Once the next prime p satisfies p² &gt; N, there is
              nothing left to cross out. For N = 100 you only need 2, 3, 5 and 7.
            </p>
          </Callout>
          <Callout tone="note" title="How many primes are there?">
            The prime counting function π(N) gives the number of primes up to N: π(50) = 15, π(100) = 25, π(150) = 35
            and π(200) = 46. The prime number theorem says π(N) is roughly N / ln N, so primes slowly thin out.
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Choose how far to sieve with "Up to N".',
            'Press Play to animate, or Step to cross out one number at a time. "Next prime" jumps straight to the next sieving prime.',
            'Watch the dark ring: it marks the number being crossed out right now. Some numbers are visited twice (12 is hit by 2 and by 3), but keep the colour of their smallest prime factor.',
            'Numbers turn light indigo once they are confirmed prime: anything still standing below p² must be prime.',
            'At the end, read off π(N) and notice how few sieving primes were needed.',
          ]}
        />
      </ContentSection>

      <ContentSection title="The algorithm in code">
        <div className="space-y-5">
          <CodeTabs samples={samples} />
          <Complexity
            time="O(N log log N)"
            space="O(N)"
            timeNote="The work for prime p is about N / p, and the sum of 1/p over primes up to N grows like log log N."
            spaceNote="One boolean per number up to N."
          />
        </div>
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: Which primes do the work?"
            question="You sieve the numbers up to 120. Which primes do you need to cross out multiples of, and how many primes will you find?"
            solution={
              <>
                <p>√120 ≈ 10.95, so only primes ≤ 10 are needed.</p>
                <p>Sieving primes: 2, 3, 5, 7 (11² = 121 &gt; 120)</p>
                <p>π(100) = 25, plus 101, 103, 107, 109, 113</p>
                <p className="font-semibold text-emerald-700">There are 30 primes up to 120.</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Smallest prime factor 7"
            question="When sieving up to 100, which numbers get crossed out for the first time while processing p = 7?"
            solution={
              <>
                <p>Multiples of 7 from 7² = 49: 49, 56, 63, 70, 77, 84, 91, 98</p>
                <p>56, 70, 84, 98 are even (already crossed by 2)</p>
                <p>63 = 3 × 21 (already crossed by 3)</p>
                <p>Left: 49 = 7 × 7, 77 = 7 × 11, 91 = 7 × 13</p>
                <p className="font-semibold text-emerald-700">Three numbers: 49, 77 and 91.</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
