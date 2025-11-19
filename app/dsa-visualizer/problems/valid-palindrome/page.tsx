import type { Metadata } from "next";
import ValidPalindromeVisualizer from './ValidPalindromeVisualizer';
import GiscusComments from "@/components/ui/GiscusComments";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Valid Palindrome - DSA Visualizer | AllVisualizer",
  description: "Learn how to check if a string is a valid palindrome using the two pointers technique. Interactive visualization with step-by-step execution.",
  keywords: ["valid palindrome", "two pointers", "string algorithms", "palindrome checker", "leetcode"],
  openGraph: {
    title: "Valid Palindrome Visualizer - Interactive Learning",
    description: "Master the two pointers technique for palindrome checking",
  },
};

export default function ValidPalindromePage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/dsa-visualizer" className="hover:text-gray-900">DSA</Link>
          <span>/</span>
          <Link href="/dsa-visualizer/strings" className="hover:text-gray-900">Strings</Link>
          <span>/</span>
          <span className="text-gray-900">Valid Palindrome</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Valid Palindrome
            </h1>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              Easy
            </span>
          </div>
          <p className="text-lg text-gray-600">
            Check if a string is a palindrome after removing non-alphanumeric characters and ignoring case.
          </p>
        </header>

        {/* Problem Statement */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Problem Statement</h2>
          <p className="text-gray-700 mb-4">
            A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters 
            and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters 
            include letters and numbers.
          </p>
          <p className="text-gray-700">
            Given a string <code className="px-2 py-1 bg-white border border-gray-300 rounded text-sm">s</code>, 
            return <code className="px-2 py-1 bg-white border border-gray-300 rounded text-sm">true</code> if it is a palindrome, 
            or <code className="px-2 py-1 bg-white border border-gray-300 rounded text-sm">false</code> otherwise.
          </p>
          
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Example 1:</h3>
              <div className="bg-white border border-gray-300 rounded p-3 font-mono text-sm">
                <div><strong>Input:</strong> s = "A man, a plan, a canal: Panama"</div>
                <div><strong>Output:</strong> true</div>
                <div className="text-gray-600 mt-1"><strong>Explanation:</strong> "amanaplanacanalpanama" is a palindrome.</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Example 2:</h3>
              <div className="bg-white border border-gray-300 rounded p-3 font-mono text-sm">
                <div><strong>Input:</strong> s = "race a car"</div>
                <div><strong>Output:</strong> false</div>
                <div className="text-gray-600 mt-1"><strong>Explanation:</strong> "raceacar" is not a palindrome.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Visualizer */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Interactive Visualization</h2>
          <ValidPalindromeVisualizer />
        </section>

        {/* Approach */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Approach: Two Pointers</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Algorithm:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Initialize two pointers: <code className="px-2 py-1 bg-white border border-gray-300 rounded text-sm">left</code> at the start and <code className="px-2 py-1 bg-white border border-gray-300 rounded text-sm">right</code> at the end</li>
                <li>While left {'<'} right:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Skip non-alphanumeric characters on both sides</li>
                    <li>Compare characters (case-insensitive)</li>
                    <li>If different, return false</li>
                    <li>Move pointers inward</li>
                  </ul>
                </li>
                <li>If all characters match, return true</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Complexity Analysis:</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Time Complexity:</strong> O(n) - single pass through the string</li>
                <li><strong>Space Complexity:</strong> O(1) - only using two pointers</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Key Insights:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Two pointers technique efficiently checks from both ends simultaneously</li>
                <li>In-place comparison without creating a new string saves memory</li>
                <li>Case-insensitive comparison using toLowerCase() or character code comparison</li>
                <li>Regular expressions can filter alphanumeric, but two pointers is more efficient</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Solution Code */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Solution Code</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">TypeScript/JavaScript:</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`function isPalindrome(s: string): boolean {
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
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Python:</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`def isPalindrome(s: str) -> bool:
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
    
    return True`}
              </pre>
            </div>
          </div>
        </section>

        {/* Related Problems */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Problems</h2>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-gray-700">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Valid Palindrome II - Given at most one character deletion
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Longest Palindromic Substring - Find the longest palindrome
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Palindrome Linked List - Check if a linked list is a palindrome
            </li>
          </ul>
        </section>

        {/* Discussion */}
        <section className="mb-8 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Discussion</h2>
          <p className="text-gray-600 mb-6">
            Have questions or want to discuss alternative approaches? Join the conversation below.
          </p>
          <GiscusComments />
        </section>

        {/* Back Link */}
        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/dsa-visualizer/strings"
            className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Strings
          </Link>
        </div>
      </div>
    </div>
  );
}
