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
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl ${category.gradient} opacity-10`}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 animate-fade-in">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/dsa-visualizer" className="hover:text-indigo-600 transition-colors">DSA Visualizer</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{category.title}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${category.gradient} rounded-2xl text-4xl mb-6 shadow-lg`}>
                {category.icon}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {category.title}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                {category.description}
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                  {category.problems.length} Problems
                </div>
                <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                  Interactive Visualizations
                </div>
                <div className="px-4 py-2 bg-pink-50 text-pink-700 rounded-lg text-sm font-medium">
                  Step-by-Step Guides
                </div>
              </div>
            </div>

            {/* Key Points Card */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className={`w-2 h-2 bg-gradient-to-r ${category.gradient} rounded-full`}></span>
                Key Concepts
              </h2>
              <ul className="space-y-3">
                {category.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <svg className={`w-5 h-5 text-${category.color}-500 flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Overview</h2>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            {category.overview}
          </p>
        </div>
      </section>

      {/* Problems Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-white">
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Practice Problems</h2>
          <p className="text-base md:text-lg text-gray-600">
            Master {category.title.toLowerCase()} with these carefully curated problems
          </p>
        </div>

        <div className="grid gap-6">
          {category.problems.map((problem, index) => (
            <div
              key={index}
              className={`bg-white p-6 md:p-8 rounded-2xl border-2 ${
                problem.isAvailable ? 'border-gray-200 hover:border-indigo-300 hover:shadow-lg' : 'border-gray-100 bg-gray-50'
              } transition-all animate-fade-in`}
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {problem.isAvailable ? (
                      <Link
                        href={`/dsa-visualizer/problems/${problem.slug}`}
                        className="text-xl md:text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors"
                      >
                        {problem.title}
                      </Link>
                    ) : (
                      <h3 className="text-xl md:text-2xl font-bold text-gray-400">
                        {problem.title}
                      </h3>
                    )}
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${difficultyColors[problem.difficulty]}`}>
                      {problem.difficulty}
                    </span>
                    {!problem.isAvailable && (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className={`text-sm md:text-base mb-4 ${problem.isAvailable ? 'text-gray-700' : 'text-gray-500'}`}>
                    {problem.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {problem.topics.map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className={`px-3 py-1 text-xs font-medium rounded-lg ${
                          problem.isAvailable
                            ? `bg-${category.color}-50 text-${category.color}-700`
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                {problem.isAvailable && (
                  <Link
                    href={`/dsa-visualizer/problems/${problem.slug}`}
                    className={`flex-shrink-0 inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r ${category.gradient} text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all hover:-translate-y-0.5`}
                  >
                    Start Learning
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Resources */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Learning Resources</h2>
          <p className="text-base md:text-lg text-gray-600">
            Additional materials to deepen your understanding
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {category.resources.map((resource, index) => {
            const typeColors = {
              Article: 'from-blue-500 to-cyan-500',
              Video: 'from-purple-500 to-pink-500',
              Practice: 'from-green-500 to-emerald-500'
            };

            const typeIcons = {
              Article: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ),
              Video: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              ),
              Practice: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              )
            };

            return (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${typeColors[resource.type]} rounded-xl flex items-center justify-center mb-4`}>
                  {typeIcons[resource.type]}
                </div>
                <div className="mb-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded bg-gradient-to-r ${typeColors[resource.type]} text-white`}>
                    {resource.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <a
                  href={resource.link}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className={`bg-gradient-to-br ${category.gradient} rounded-2xl p-8 md:p-12 text-white text-center animate-fade-in`} style={{ animationDelay: '1.2s' }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help?</h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our Discord community to discuss {category.title.toLowerCase()} problems, share solutions, and learn together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://discord.gg/z4TgSrJQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Join Discord Community
            </a>
            <Link
              href="/dsa-visualizer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-xl font-semibold hover:bg-white/30 transition-all hover:-translate-y-0.5"
            >
              Explore More Categories
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
