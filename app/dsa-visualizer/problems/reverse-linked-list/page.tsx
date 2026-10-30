import type { Metadata } from 'next';
import { Callout, CodeTabs, Complexity, ContentSection, DetailPage, Prose, StepList } from '@/components/content';

export const metadata: Metadata = {
  title: 'Reverse Linked List - Linked List Algorithm | DSA Visualizer',
  description:
    'Learn to reverse a singly linked list using both iterative and recursive approaches. Master pointer manipulation with solutions in multiple programming languages.',
  keywords: ['reverse linked list', 'linked list', 'pointers', 'recursion', 'leetcode', 'coding interview', 'algorithm visualization'],
  openGraph: {
    title: 'Reverse Linked List - Iterative and Recursive Solutions',
    description: 'Master pointer manipulation by reversing a singly linked list',
  },
};

const solutions = [
  { label: 'JavaScript', language: 'javascript', code: `// Definition for singly-linked list node
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

// Iterative Solution
function reverseList(head) {
    let prev = null;
    let current = head;

    while (current !== null) {
        // Save next node
        let nextTemp = current.next;
        // Reverse the pointer
        current.next = prev;
        // Move pointers forward
        prev = current;
        current = nextTemp;
    }

    return prev; // New head
}

// Recursive Solution
function reverseListRecursive(head) {
    // Base case
    if (head === null || head.next === null) {
        return head;
    }

    // Recursive call
    let newHead = reverseListRecursive(head.next);

    // Reverse the links
    head.next.next = head;
    head.next = null;

    return newHead;
}` },
  { label: 'Python', language: 'python', code: `# Definition for singly-linked list node
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Iterative Solution
def reverseList(head):
    prev = None
    current = head

    while current is not None:
        # Save next node
        next_temp = current.next
        # Reverse the pointer
        current.next = prev
        # Move pointers forward
        prev = current
        current = next_temp

    return prev  # New head

# Recursive Solution
def reverseListRecursive(head):
    # Base case
    if head is None or head.next is None:
        return head

    # Recursive call
    new_head = reverseListRecursive(head.next)

    # Reverse the links
    head.next.next = head
    head.next = None

    return new_head` },
  { label: 'Java', language: 'java', code: `// Definition for singly-linked list node
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) {
        this.val = val;
        this.next = next;
    }
}

class Solution {
    // Iterative Solution
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode current = head;

        while (current != null) {
            // Save next node
            ListNode nextTemp = current.next;
            // Reverse the pointer
            current.next = prev;
            // Move pointers forward
            prev = current;
            current = nextTemp;
        }

        return prev; // New head
    }

    // Recursive Solution
    public ListNode reverseListRecursive(ListNode head) {
        // Base case
        if (head == null || head.next == null) {
            return head;
        }

        // Recursive call
        ListNode newHead = reverseListRecursive(head.next);

        // Reverse the links
        head.next.next = head;
        head.next = null;

        return newHead;
    }
}` },
  { label: 'C++', language: 'cpp', code: `// Definition for singly-linked list node
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    // Iterative Solution
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* current = head;

        while (current != nullptr) {
            // Save next node
            ListNode* nextTemp = current->next;
            // Reverse the pointer
            current->next = prev;
            // Move pointers forward
            prev = current;
            current = nextTemp;
        }

        return prev; // New head
    }

    // Recursive Solution
    ListNode* reverseListRecursive(ListNode* head) {
        // Base case
        if (head == nullptr || head->next == nullptr) {
            return head;
        }

        // Recursive call
        ListNode* newHead = reverseListRecursive(head->next);

        // Reverse the links
        head->next->next = head;
        head->next = nullptr;

        return newHead;
    }
};` },
];

export default function ReverseLinkedListPage() {
  return (
    <DetailPage
      subject="dsa"
      item="reverse-linked-list"
      description="Learn to reverse a singly linked list using both iterative and recursive approaches. Master pointer manipulation fundamentals."
      meta={<span className="font-mono">Time O(n) · Space O(1) iterative</span>}
    >
      <ContentSection title="Problem statement">
        <Prose>
          <p>
            Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.
          </p>
        </Prose>
        <Callout tone="example" title="Example 1" className="mt-5">
          <pre className="whitespace-pre-wrap font-mono text-[13px]">{`Input:  head = [1, 2, 3, 4, 5]
Output: [5, 4, 3, 2, 1]`}</pre>
        </Callout>
        <Callout tone="example" title="Example 2" className="mt-4">
          <pre className="whitespace-pre-wrap font-mono text-[13px]">{`Input:  head = [1, 2]
Output: [2, 1]`}</pre>
        </Callout>
        <Callout tone="example" title="Example 3" className="mt-4">
          <pre className="whitespace-pre-wrap font-mono text-[13px]">{`Input:  head = []
Output: []`}</pre>
        </Callout>
      </ContentSection>

      <ContentSection title="Approach">
        <h3 className="mb-3 text-lg font-semibold text-ink">Iterative approach</h3>
        <StepList
          steps={[
            <>
              <strong className="text-ink">Initialize pointers.</strong> Start with{' '}
              <code className="font-mono text-ink">prev = null</code> and{' '}
              <code className="font-mono text-ink">current = head</code>.
            </>,
            <>
              <strong className="text-ink">Iterate through the list.</strong> For each node, save the next node, reverse the
              current node&apos;s pointer to point to prev, then move both pointers forward.
            </>,
            <>
              <strong className="text-ink">Return the new head.</strong> When iteration completes, prev points to the new head
              of the reversed list.
            </>,
          ]}
        />

        <h3 className="mb-3 mt-8 text-lg font-semibold text-ink">Recursive approach</h3>
        <StepList
          steps={[
            <>
              <strong className="text-ink">Base case.</strong> If the list is empty or has only one node, return the head.
            </>,
            <>
              <strong className="text-ink">Recursive call.</strong> Recursively reverse the rest of the list starting from
              head.next.
            </>,
            <>
              <strong className="text-ink">Reverse links.</strong> Make the next node point back to the current node, then set
              the current node&apos;s next to null.
            </>,
          ]}
        />
      </ContentSection>

      <ContentSection title="Solution">
        <CodeTabs samples={solutions} />
      </ContentSection>

      <ContentSection title="Time & space complexity">
        <h3 className="mb-3 text-lg font-semibold text-ink">Iterative approach</h3>
        <Complexity
          time="O(n)"
          timeNote="We visit each node exactly once."
          space="O(1)"
          spaceNote="Only a constant amount of extra space for pointers."
        />

        <h3 className="mb-3 mt-8 text-lg font-semibold text-ink">Recursive approach</h3>
        <Complexity
          time="O(n)"
          timeNote="We visit each node exactly once."
          space="O(n)"
          spaceNote="Due to the recursion call stack, which can go n levels deep."
        />
      </ContentSection>
    </DetailPage>
  );
}
