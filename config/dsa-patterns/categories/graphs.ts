import type { PatternCategory } from '../types';

export const graphs: PatternCategory = {
  name: 'Graph Patterns',
  slug: 'graphs',
  subPatterns: [
    {
      title: 'Graph - BFS (Shortest Path Unweighted)',
      slug: 'graph-bfs',
      theory: [
        'BFS explores nodes level by level — first time you reach a node is the shortest path.',
        'Use a queue and a visited set. Process all neighbors before going deeper.',
        'Multi-source BFS: add all sources to the queue initially for "distance from nearest source".',
        'Time: O(V + E), Space: O(V).',
      ],
      template: `from collections import deque

def bfs_shortest_path(graph, start, end):
    queue = deque([(start, 0)])
    visited = {start}
    while queue:
        node, dist = queue.popleft()
        if node == end:
            return dist
        for nei in graph[node]:
            if nei not in visited:
                visited.add(nei)
                queue.append((nei, dist + 1))
    return -1`,
      problems: [
        { name: 'Number of Islands', difficulty: 'Medium', lc: 200 },
        { name: 'Word Ladder', difficulty: 'Hard', lc: 127 },
        { name: 'Rotting Oranges', difficulty: 'Medium', lc: 994 },
        { name: 'Shortest Path in Binary Matrix', difficulty: 'Medium', lc: 1091 },
        { name: 'Open the Lock', difficulty: 'Medium', lc: 752 },
      ],
    },
    {
      title: 'Graph - DFS (Connected Components / Cycle Detection)',
      slug: 'graph-dfs',
      theory: [
        'DFS explores as deep as possible before backtracking.',
        'For connected components: run DFS from every unvisited node, count starts.',
        'Cycle detection (directed): track recursion stack. If you revisit a node in the current path — cycle.',
        'Cycle detection (undirected): if you visit an already-visited node that is not the parent — cycle.',
      ],
      template: `def count_components(n, edges):
    graph = {i: [] for i in range(n)}
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    visited = set()
    count = 0
    def dfs(node):
        visited.add(node)
        for nei in graph[node]:
            if nei not in visited:
                dfs(nei)
    for i in range(n):
        if i not in visited:
            dfs(i)
            count += 1
    return count`,
      problems: [
        { name: 'Number of Connected Components in an Undirected Graph', difficulty: 'Medium', lc: 323 },
        { name: 'Course Schedule', difficulty: 'Medium', lc: 207 },
        { name: 'Clone Graph', difficulty: 'Medium', lc: 133 },
        { name: 'Pacific Atlantic Water Flow', difficulty: 'Medium', lc: 417 },
        { name: 'Surrounded Regions', difficulty: 'Medium', lc: 130 },
      ],
    },
    {
      title: 'Graph - Topological Sort',
      slug: 'graph-topo',
      theory: [
        'Only works on DAGs (Directed Acyclic Graphs).',
        'Kahn\'s algorithm (BFS): process nodes with in-degree 0, reduce neighbors\' in-degree.',
        'DFS variant: add node to result in postorder (after all descendants), then reverse.',
        'If result length < number of nodes — cycle exists.',
      ],
      template: `from collections import deque

def topo_sort(num_nodes, edges):
    graph = {i: [] for i in range(num_nodes)}
    in_degree = {i: 0 for i in range(num_nodes)}
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    queue = deque([n for n in in_degree if in_degree[n] == 0])
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nei in graph[node]:
            in_degree[nei] -= 1
            if in_degree[nei] == 0:
                queue.append(nei)
    return order if len(order) == num_nodes else []`,
      problems: [
        { name: 'Course Schedule', difficulty: 'Medium', lc: 207 },
        { name: 'Course Schedule II', difficulty: 'Medium', lc: 210 },
        { name: 'Alien Dictionary', difficulty: 'Hard', lc: 269 },
        { name: 'Minimum Height Trees', difficulty: 'Medium', lc: 310 },
        { name: 'Sequence Reconstruction', difficulty: 'Medium', lc: 444 },
      ],
    },
    {
      title: 'Graph - Union Find (Disjoint Set)',
      slug: 'graph-union-find',
      theory: [
        'Track connected components with parent[] and rank[] arrays.',
        'find(x): follow parent pointers to root, with path compression.',
        'union(x, y): merge two sets by connecting roots. Use union by rank to keep trees flat.',
        'Near O(1) amortized per operation with both optimizations.',
      ],
      template: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py: return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        self.components -= 1
        return True`,
      problems: [
        { name: 'Number of Provinces', difficulty: 'Medium', lc: 547 },
        { name: 'Redundant Connection', difficulty: 'Medium', lc: 684 },
        { name: 'Accounts Merge', difficulty: 'Medium', lc: 721 },
        { name: 'Longest Consecutive Sequence', difficulty: 'Medium', lc: 128 },
        { name: 'Graph Valid Tree', difficulty: 'Medium', lc: 261 },
      ],
    },
  ],
};
