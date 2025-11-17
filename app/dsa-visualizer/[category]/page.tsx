import type { Metadata } from "next";
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Category data
const categoryData: Record<string, {
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  overview: string;
  keyPoints: string[];
  problems: {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    topics: string[];
    slug: string;
    isAvailable: boolean;
  }[];
  resources: {
    title: string;
    type: 'Article' | 'Video' | 'Practice';
    description: string;
    link: string;
  }[];
}> = {
  'arrays': {
    title: 'Arrays',
    description: 'Visualize array operations, sorting, and searching algorithms',
    icon: '📊',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    overview: 'Arrays are fundamental data structures that store elements in contiguous memory locations. They provide constant-time access to elements using indices and are the foundation for many other data structures and algorithms.',
    keyPoints: [
      'Random access in O(1) time using indices',
      'Fixed or dynamic size depending on implementation',
      'Cache-friendly due to contiguous memory',
      'Foundation for sorting and searching algorithms',
      'Efficient iteration and bulk operations'
    ],
    problems: [
      {
        title: 'Two Sum',
        difficulty: 'Easy',
        description: 'Find two numbers in an array that add up to a target sum',
        topics: ['Hash Map', 'Array Traversal'],
        slug: 'two-sum',
        isAvailable: true
      },
      {
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        description: 'Find maximum profit from stock price array',
        topics: ['Dynamic Programming', 'Greedy'],
        slug: 'best-time-to-buy-sell-stock',
        isAvailable: false
      },
      {
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        description: 'Find contiguous subarray with largest sum',
        topics: ['Kadane\'s Algorithm', 'Dynamic Programming'],
        slug: 'maximum-subarray',
        isAvailable: false
      },
      {
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        description: 'Calculate products without using division',
        topics: ['Prefix Sum', 'Array Manipulation'],
        slug: 'product-except-self',
        isAvailable: false
      },
      {
        title: 'Container With Most Water',
        difficulty: 'Medium',
        description: 'Find two lines that form maximum area container',
        topics: ['Two Pointers', 'Greedy'],
        slug: 'container-most-water',
        isAvailable: false
      },
      {
        title: 'Merge Intervals',
        difficulty: 'Medium',
        description: 'Merge overlapping intervals in an array',
        topics: ['Sorting', 'Intervals'],
        slug: 'merge-intervals',
        isAvailable: false
      }
    ],
    resources: [
      {
        title: 'Array Time Complexity Guide',
        type: 'Article',
        description: 'Understanding Big O notation for array operations',
        link: '#'
      },
      {
        title: 'Sorting Algorithms Visualization',
        type: 'Video',
        description: 'Visual comparison of different sorting techniques',
        link: '#'
      },
      {
        title: 'Array Practice Problems',
        type: 'Practice',
        description: '100+ curated array problems by difficulty',
        link: '#'
      }
    ]
  },
  'linked-lists': {
    title: 'Linked Lists',
    description: 'Understand pointer manipulation and list operations',
    icon: '🔗',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    overview: 'Linked Lists are linear data structures where elements are stored in nodes. Each node contains data and a reference (link) to the next node. They excel at insertions and deletions but require sequential access.',
    keyPoints: [
      'Dynamic size - grow and shrink at runtime',
      'Efficient insertions/deletions at O(1) with pointer',
      'No random access - requires O(n) traversal',
      'No wasted memory from pre-allocation',
      'Variants: Singly, Doubly, Circular linked lists'
    ],
    problems: [
      {
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        description: 'Reverse a singly linked list iteratively and recursively',
        topics: ['Pointers', 'Recursion'],
        slug: 'reverse-linked-list',
        isAvailable: false
      },
      {
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        description: 'Merge two sorted linked lists into one',
        topics: ['Two Pointers', 'Recursion'],
        slug: 'merge-two-lists',
        isAvailable: false
      },
      {
        title: 'Linked List Cycle',
        difficulty: 'Easy',
        description: 'Detect if a linked list has a cycle',
        topics: ['Floyd\'s Algorithm', 'Two Pointers'],
        slug: 'linked-list-cycle',
        isAvailable: false
      },
      {
        title: 'Remove Nth Node From End',
        difficulty: 'Medium',
        description: 'Remove the nth node from the end of the list',
        topics: ['Two Pointers', 'One Pass'],
        slug: 'remove-nth-node',
        isAvailable: false
      },
      {
        title: 'Add Two Numbers',
        difficulty: 'Medium',
        description: 'Add two numbers represented by linked lists',
        topics: ['Math', 'Linked List'],
        slug: 'add-two-numbers',
        isAvailable: false
      },
      {
        title: 'Copy List with Random Pointer',
        difficulty: 'Medium',
        description: 'Deep copy a linked list with random pointers',
        topics: ['Hash Map', 'Linked List'],
        slug: 'copy-random-list',
        isAvailable: false
      }
    ],
    resources: [
      {
        title: 'Linked List Fundamentals',
        type: 'Article',
        description: 'Complete guide to linked list implementation',
        link: '#'
      },
      {
        title: 'Pointer Manipulation Techniques',
        type: 'Video',
        description: 'Master pointer operations and edge cases',
        link: '#'
      },
      {
        title: 'Linked List Pattern Practice',
        type: 'Practice',
        description: 'Common patterns: Fast/slow pointers, dummy nodes',
        link: '#'
      }
    ]
  },
  'stacks-queues': {
    title: 'Stacks & Queues',
    description: 'Learn LIFO and FIFO data structures',
    icon: '📚',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    overview: 'Stacks follow Last-In-First-Out (LIFO) principle, while Queues follow First-In-First-Out (FIFO). These abstract data types are crucial for managing data in specific orders and have numerous real-world applications.',
    keyPoints: [
      'Stack: LIFO - Last element added is first removed',
      'Queue: FIFO - First element added is first removed',
      'Common operations: Push, Pop, Peek in O(1)',
      'Used in recursion, parsing, BFS/DFS algorithms',
      'Variants: Priority Queue, Deque, Circular Queue'
    ],
    problems: [
      {
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        description: 'Check if string has valid bracket combinations',
        topics: ['Stack', 'String'],
        slug: 'valid-parentheses',
        isAvailable: false
      },
      {
        title: 'Min Stack',
        difficulty: 'Medium',
        description: 'Design stack with constant time min operation',
        topics: ['Stack', 'Design'],
        slug: 'min-stack',
        isAvailable: false
      },
      {
        title: 'Daily Temperatures',
        difficulty: 'Medium',
        description: 'Find next warmer temperature for each day',
        topics: ['Monotonic Stack'],
        slug: 'daily-temperatures',
        isAvailable: false
      },
      {
        title: 'Implement Queue using Stacks',
        difficulty: 'Easy',
        description: 'Build FIFO queue using two stacks',
        topics: ['Stack', 'Queue', 'Design'],
        slug: 'queue-using-stacks',
        isAvailable: false
      },
      {
        title: 'Largest Rectangle in Histogram',
        difficulty: 'Hard',
        description: 'Find largest rectangle area in histogram',
        topics: ['Monotonic Stack', 'Array'],
        slug: 'largest-rectangle',
        isAvailable: false
      }
    ],
    resources: [
      {
        title: 'Stack vs Queue Comparison',
        type: 'Article',
        description: 'When to use each data structure',
        link: '#'
      },
      {
        title: 'Monotonic Stack Pattern',
        type: 'Video',
        description: 'Solve next greater/smaller element problems',
        link: '#'
      },
      {
        title: 'Implementation Practice',
        type: 'Practice',
        description: 'Implement stacks and queues from scratch',
        link: '#'
      }
    ]
  },
  'trees': {
    title: 'Trees',
    description: 'Explore binary trees, BST, and tree traversals',
    icon: '🌳',
    color: 'green',
    gradient: 'from-green-500 to-lime-500',
    overview: 'Trees are hierarchical data structures with a root node and child nodes forming a parent-child relationship. Binary trees, BSTs, AVL trees, and heaps are fundamental for efficient searching, sorting, and hierarchical data representation.',
    keyPoints: [
      'Hierarchical structure with root and leaf nodes',
      'Binary Search Tree: Left < Parent < Right',
      'Traversals: Inorder, Preorder, Postorder, Level-order',
      'Self-balancing trees: AVL, Red-Black for O(log n)',
      'Heaps for priority queue implementation'
    ],
    problems: [
      {
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        description: 'Find the maximum depth from root to leaf',
        topics: ['DFS', 'Recursion'],
        slug: 'max-depth',
        isAvailable: false
      },
      {
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        description: 'Swap left and right children of all nodes',
        topics: ['Tree', 'Recursion'],
        slug: 'invert-tree',
        isAvailable: false
      },
      {
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        description: 'Check if tree satisfies BST properties',
        topics: ['BST', 'Inorder Traversal'],
        slug: 'validate-bst',
        isAvailable: false
      },
      {
        title: 'Lowest Common Ancestor',
        difficulty: 'Medium',
        description: 'Find LCA of two nodes in BST',
        topics: ['BST', 'Tree Traversal'],
        slug: 'lowest-common-ancestor',
        isAvailable: false
      },
      {
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        description: 'Traverse tree level by level',
        topics: ['BFS', 'Queue'],
        slug: 'level-order',
        isAvailable: false
      }
    ],
    resources: [
      {
        title: 'Tree Traversal Guide',
        type: 'Article',
        description: 'Master all traversal techniques',
        link: '#'
      },
      {
        title: 'BST Operations Visualization',
        type: 'Video',
        description: 'Insert, delete, search operations explained',
        link: '#'
      },
      {
        title: 'Tree Problems by Pattern',
        type: 'Practice',
        description: 'DFS, BFS, and recursion patterns',
        link: '#'
      }
    ]
  },
  'graphs': {
    title: 'Graphs',
    description: 'Understand graph representations and algorithms',
    icon: '🕸️',
    color: 'orange',
    gradient: 'from-orange-500 to-amber-500',
    overview: 'Graphs are versatile data structures consisting of vertices (nodes) and edges (connections). They model relationships and networks, from social connections to routing algorithms, making them essential for solving complex real-world problems.',
    keyPoints: [
      'Directed vs Undirected, Weighted vs Unweighted',
      'Representations: Adjacency Matrix, Adjacency List',
      'Traversals: BFS (shortest path), DFS (connectivity)',
      'Shortest path: Dijkstra, Bellman-Ford, Floyd-Warshall',
      'Minimum Spanning Tree: Prim\'s, Kruskal\'s algorithms'
    ],
    problems: [
      {
        title: 'Number of Islands',
        difficulty: 'Medium',
        description: 'Count connected components in 2D grid',
        topics: ['DFS', 'BFS', 'Union Find'],
        slug: 'number-of-islands',
        isAvailable: false
      },
      {
        title: 'Clone Graph',
        difficulty: 'Medium',
        description: 'Deep copy an undirected graph',
        topics: ['DFS', 'BFS', 'Hash Map'],
        slug: 'clone-graph',
        isAvailable: false
      },
      {
        title: 'Course Schedule',
        difficulty: 'Medium',
        description: 'Detect cycle in directed graph (topological sort)',
        topics: ['Topological Sort', 'DFS'],
        slug: 'course-schedule',
        isAvailable: false
      },
      {
        title: 'Pacific Atlantic Water Flow',
        difficulty: 'Medium',
        description: 'Find cells that can flow to both oceans',
        topics: ['DFS', 'Matrix'],
        slug: 'pacific-atlantic',
        isAvailable: false
      },
      {
        title: 'Network Delay Time',
        difficulty: 'Medium',
        description: 'Find minimum time for signal to reach all nodes',
        topics: ['Dijkstra', 'Shortest Path'],
        slug: 'network-delay',
        isAvailable: false
      }
    ],
    resources: [
      {
        title: 'Graph Representations',
        type: 'Article',
        description: 'Compare adjacency matrix vs list',
        link: '#'
      },
      {
        title: 'BFS vs DFS Visualization',
        type: 'Video',
        description: 'When to use each traversal method',
        link: '#'
      },
      {
        title: 'Graph Algorithm Practice',
        type: 'Practice',
        description: 'Shortest path, MST, and connectivity problems',
        link: '#'
      }
    ]
  }
};

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryName = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `${categoryName} - DSA Visualizer | AllVisualizer`,
    description: `Learn ${categoryName} through interactive visualizations. Explore problems, algorithms, and step-by-step solutions with visual representations.`,
    openGraph: {
      title: `${categoryName} - DSA Visualizer`,
      description: `Interactive ${categoryName} visualization and learning`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const category = categoryData[categorySlug];

  if (!category) {
    notFound();
  }

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Hard: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link href="/dsa-visualizer" className="hover:text-gray-900">DSA</Link>
          <span>/</span>
          <span className="text-gray-900">{category.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {category.title}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {category.description}
          </p>
          <div className="prose max-w-none">
            <p className="text-gray-700">{category.overview}</p>
          </div>
        </header>

        {/* Key Concepts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Concepts</h2>
          <ul className="space-y-2 text-gray-700">
            {category.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Problems */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Problems</h2>
          <div className="space-y-4">
            {category.problems.map((problem, index) => (
              <div
                key={index}
                className={`border border-gray-200 rounded-lg p-4 ${
                  problem.isAvailable ? 'hover:border-gray-600 hover:shadow-md' : 'opacity-60'
                } transition-all`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {problem.isAvailable ? (
                        <Link
                          href={`/dsa-visualizer/problems/${problem.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-gray-900"
                        >
                          {problem.title}
                        </Link>
                      ) : (
                        <h3 className="text-lg font-semibold text-gray-600">
                          {problem.title}
                        </h3>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                      {!problem.isAvailable && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs font-medium">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{problem.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {problem.topics.map((topic, i) => (
                        <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  {problem.isAvailable && (
                    <Link
                      href={`/dsa-visualizer/problems/${problem.slug}`}
                      className="text-gray-900 hover:text-gray-800 flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Back Link */}
        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/dsa-visualizer"
            className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
