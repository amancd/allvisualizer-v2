import type { Metadata } from 'next';
import { Callout, CodeTabs, Complexity, ContentSection, DetailPage, Prose, type RelatedEntry, RelatedItems, StepList } from '@/components/content';
import ValidPalindromeVisualizer from './ValidPalindromeVisualizer';

export const metadata: Metadata = {
  title: 'Valid Palindrome - DSA Visualizer | AllVisualizer',
  description:
    'Learn how to check if a string is a valid palindrome using the two pointers technique. Interactive visualization with step-by-step execution.',
  keywords: ['valid palindrome', 'two pointers', 'string algorithms', 'palindrome checker', 'leetcode'],
  openGraph: {
    title: 'Valid Palindrome Visualizer - Interactive Learning',
    description: 'Master the two pointers technique for palindrome checking',
  },
};

const solutions = [
  { label: 'TypeScript', language: 'typescript', code: `function isPalindrome(s: string): boolean {
    let left = 0;
    let right = s.length - 1;

    while (left < right) {
        // Skip non-alphanumeric from left
        while (left < right && !isAlphanumeric(s[left])) {
            left++;
        }

        // Skip non-alphanumeric from right
        while (left < right && !isAlphanumeric(s[right])) {
            right--;
        }

        // Compare characters (case-insensitive)
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}

function isAlphanumeric(char: string): boolean {
    return /[a-zA-Z0-9]/.test(char);
}` },
  { label: 'Python', language: 'python', code: `def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1

    while left < right:
        # Skip non-alphanumeric from left
        while left < right and not s[left].isalnum():
            left += 1

        # Skip non-alphanumeric from right
        while left < right and not s[right].isalnum():
            right -= 1

        # Compare characters (case-insensitive)
        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True` },
];

const relatedProblems: RelatedEntry[] = [
  { slug: 'longest-palindrome', note: 'Find the longest palindrome within a string.' },
  { title: 'Valid Palindrome II', note: 'Check for a palindrome when at most one character may be deleted.' },
  { title: 'Palindrome Linked List', note: 'Check if a linked list is a palindrome.' },
];

export default function ValidPalindromePage() {
  return (
    <DetailPage
      subject="dsa"
      item="valid-palindrome"
      width="narrow"
      description="Check if a string is a palindrome after removing non-alphanumeric characters and ignoring case."
      meta={<span className="font-mono">Time O(n) · Space O(1)</span>}
    >
      <ContentSection title="Problem statement">
        <Prose>
          <p>
            A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters and
            removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include
            letters and numbers.
          </p>
          <p>
            Given a string <code>s</code>, return <code>true</code> if it is a palindrome, or <code>false</code> otherwise.
          </p>
        </Prose>
        <Callout tone="example" title="Example 1" className="mt-5">
          <pre className="whitespace-pre-wrap font-mono text-[13px]">{`Input:  s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.`}</pre>
        </Callout>
        <Callout tone="example" title="Example 2" className="mt-4">
          <pre className="whitespace-pre-wrap font-mono text-[13px]">{`Input:  s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.`}</pre>
        </Callout>
      </ContentSection>

      <ContentSection title="Interactive visualizer" description="See the two pointers move step by step.">
        <ValidPalindromeVisualizer />
      </ContentSection>

      <ContentSection title="Approach: two pointers">
        <StepList
          steps={[
            <>
              Initialize two pointers: <code className="font-mono text-ink">left</code> at the start and{' '}
              <code className="font-mono text-ink">right</code> at the end.
            </>,
            <>
              While <code className="font-mono text-ink">left &lt; right</code>:
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Skip non-alphanumeric characters on both sides</li>
                <li>Compare characters (case-insensitive)</li>
                <li>If they differ, return false</li>
                <li>Move both pointers inward</li>
              </ul>
            </>,
            'If all characters match, return true.',
          ]}
        />
        <Callout tone="tip" title="Key insights" className="mt-5">
          <ul className="list-disc space-y-1 pl-5">
            <li>The two pointers technique efficiently checks from both ends simultaneously.</li>
            <li>In-place comparison without creating a new string saves memory.</li>
            <li>Case-insensitive comparison uses toLowerCase() or character code comparison.</li>
            <li>Regular expressions can filter alphanumeric characters, but two pointers is more efficient.</li>
          </ul>
        </Callout>
      </ContentSection>

      <ContentSection title="Solution">
        <CodeTabs samples={solutions} />
      </ContentSection>

      <ContentSection title="Time & space complexity">
        <Complexity time="O(n)" timeNote="Single pass through the string" space="O(1)" spaceNote="Only two pointers are used" />
      </ContentSection>

      <ContentSection title="Related problems">
        <RelatedItems subject="dsa" items={relatedProblems} />
      </ContentSection>
    </DetailPage>
  );
}
