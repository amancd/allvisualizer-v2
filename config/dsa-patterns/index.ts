/**
 * DSA Patterns content. To add a pattern, edit the matching file in ./categories.
 * To add a whole category, create a new file there and add it to the list below.
 */
import { twoPointer } from './categories/two-pointer';
import { slidingWindow } from './categories/sliding-window';
import { binarySearch } from './categories/binary-search';
import { stack } from './categories/stack';
import { linkedList } from './categories/linked-list';
import { trees } from './categories/trees';
import { graphs } from './categories/graphs';
import { dynamicProgramming } from './categories/dynamic-programming';
import { backtracking } from './categories/backtracking';
import { heap } from './categories/heap';
import { trie } from './categories/trie';
import { greedy } from './categories/greedy';
import { bitManipulation } from './categories/bit-manipulation';
import { hashing } from './categories/hashing';
import type { PatternCategory } from './types';

export type { PatternCategory, Problem, SubPattern } from './types';
export { patternDiagrams } from './diagrams';

/** Sidebar order. */
export const patternCategories: PatternCategory[] = [
  twoPointer,
  slidingWindow,
  binarySearch,
  stack,
  linkedList,
  trees,
  graphs,
  dynamicProgramming,
  backtracking,
  heap,
  trie,
  greedy,
  bitManipulation,
  hashing,
];

export const totalPatterns = patternCategories.reduce((n, c) => n + c.subPatterns.length, 0);
