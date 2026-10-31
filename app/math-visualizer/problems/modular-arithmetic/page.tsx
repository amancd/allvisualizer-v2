import type { Metadata } from 'next';
import {
  Callout,
  CardGrid,
  ContentSection,
  DetailPage,
  Formula,
  PracticeProblem,
  Prose,
  StepList,
  type CardGridItem,
} from '@/components/content';
import ModularArithmeticVisualizer from './ModularArithmeticVisualizer';

export const metadata: Metadata = {
  title: 'Modular Arithmetic - Math Visualizer | AllVisualizer',
  description:
    'Visualize addition and multiplication mod n on a clock, draw times-table circle patterns such as the cardioid, and explore congruence classes and modular inverses.',
  keywords: ['modular arithmetic', 'congruence', 'clock arithmetic', 'remainders', 'modular inverse', 'times table circle', 'cardioid'],
};

const applications: CardGridItem[] = [
  { title: 'Clocks and calendars', description: '15:00 is 3 o’clock because 15 mod 12 = 3. Weekdays repeat mod 7.' },
  { title: 'Check digits', description: 'ISBN and IBAN numbers include a digit chosen so a weighted sum is 0 mod 11 or mod 97, catching typos.' },
  { title: 'Hashing', description: 'Hash tables map a large key to a bucket with key mod table size.' },
  { title: 'Cryptography', description: 'RSA and Diffie–Hellman are built on exponentiation and inverses mod large numbers.' },
];

export default function ModularArithmeticPage() {
  return (
    <DetailPage
      subject="math"
      item="modular-arithmetic"
      description="Arithmetic where numbers wrap around after reaching the modulus. Walk around a clock, draw multiplication as a curve, and see which numbers have inverses."
    >
      <ModularArithmeticVisualizer />

      <ContentSection title="What modular arithmetic is">
        <Prose>
          <p>
            Fix a positive integer <strong>n</strong>, the modulus. Two integers are <strong>congruent mod n</strong> when
            they leave the same remainder after division by n, or equivalently when their difference is a multiple of n.
            So 17 ≡ 5 (mod 12) because 17 − 5 = 12.
          </p>
          <p>
            Every integer belongs to exactly one of the n <strong>congruence classes</strong> [0], [1], …, [n − 1]. You
            can add and multiply classes: take any member of each, do the ordinary arithmetic, and reduce. The answer
            does not depend on which members you picked, which is why the clock picture works.
          </p>
          <p>
            Division is the subtle part. A class a has a <strong>modular inverse</strong> a⁻¹ (a number with
            a·a⁻¹ ≡ 1) exactly when gcd(a, n) = 1. When n is prime every non-zero class is invertible, so you can divide
            by anything except 0.
          </p>
        </Prose>
      </ContentSection>

      <ContentSection title="Key formulas">
        <div className="grid gap-4 lg:grid-cols-2">
          <Callout tone="formula" title="Congruence">
            <Formula
              where={[
                { symbol: 'n', meaning: 'the modulus, a positive integer' },
                { symbol: 'a mod n', meaning: 'the remainder in 0, 1, …, n − 1' },
              ]}
            >
              a ≡ b (mod n) ⇔ n divides a − b
            </Formula>
          </Callout>
          <Callout tone="formula" title="Arithmetic on remainders">
            <Formula>(a + b) mod n = ((a mod n) + (b mod n)) mod n</Formula>
            <div className="mt-2">
              <Formula>(a × b) mod n = ((a mod n) × (b mod n)) mod n</Formula>
            </div>
          </Callout>
          <Callout tone="formula" title="Modular inverse">
            <Formula where={[{ symbol: 'x, y', meaning: 'integers found by the extended Euclidean algorithm' }]}>
              a·x + n·y = gcd(a, n) = 1 ⇒ a⁻¹ ≡ x (mod n)
            </Formula>
          </Callout>
          <Callout tone="formula" title="Times-table circle">
            <Formula where={[{ symbol: 'm', meaning: 'multiplier; the curve has m − 1 cusps' }]}>
              k → k·m mod n, for k = 0, 1, …, n − 1
            </Formula>
          </Callout>
        </div>
      </ContentSection>

      <ContentSection title="How to use this visualizer" variant="card">
        <StepList
          steps={[
            'Pick addition or multiplication and set the modulus n with the slider.',
            'Choose a and b. Values larger than n show how the walk wraps around the clock more than once.',
            'Press Animate steps to watch the marker move. Addition walks one step at a time; multiplication makes b jumps of size a.',
            'In the times-table circle, start with m = 2 to see the cardioid, then raise m and n to explore other curves.',
            'Use the congruence table to see each class, its gcd with n, and its inverse when one exists. Compare prime and composite n.',
          ]}
        />
      </ContentSection>

      <ContentSection title="Where it is used">
        <CardGrid items={applications} />
      </ContentSection>

      <ContentSection title="Practice problems">
        <div className="space-y-4">
          <PracticeProblem
            title="Problem 1: What day will it be?"
            question="Today is Wednesday. What day of the week will it be 100 days from now?"
            solution={
              <>
                <p>Weekdays repeat every 7 days, so work mod 7.</p>
                <p>100 = 14 × 7 + 2, so 100 ≡ 2 (mod 7).</p>
                <p>Moving 100 days is the same as moving 2 days.</p>
                <p className="font-semibold text-emerald-700">Wednesday + 2 days = Friday</p>
              </>
            }
          />
          <PracticeProblem
            title="Problem 2: Find an inverse"
            question="Find the inverse of 7 modulo 26, then solve 7x ≡ 3 (mod 26)."
            solution={
              <>
                <p>gcd(7, 26) = 1, so an inverse exists. Run Euclid:</p>
                <p>26 = 3 × 7 + 5, 7 = 1 × 5 + 2, 5 = 2 × 2 + 1</p>
                <p>Back-substitute: 1 = 5 − 2·2 = 5 − 2(7 − 5) = 3·5 − 2·7</p>
                <p>= 3(26 − 3·7) − 2·7 = 3·26 − 11·7</p>
                <p>So 7 × (−11) ≡ 1, and −11 ≡ 15 (mod 26). Check: 7 × 15 = 105 = 4 × 26 + 1.</p>
                <p>x ≡ 15 × 3 = 45 ≡ 19 (mod 26).</p>
                <p className="font-semibold text-emerald-700">7⁻¹ ≡ 15 and x ≡ 19 (mod 26)</p>
              </>
            }
          />
        </div>
      </ContentSection>
    </DetailPage>
  );
}
