/**
 * Data model for the DSA Patterns notes (/dsa-patterns).
 * Each file in ./categories exports one PatternCategory.
 */

export interface Problem {
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lc: number;
  code?: string;           // solution snippet
  explanation?: string;    // how this solution works
}

export interface SubPattern {
  title: string;
  slug: string;
  recall?: string;         // how to recall / identify this pattern
  theory: string[];        // theory bullet points
  template: string;        // Python code template
  problems: Problem[];     // example problems with code
}

export interface PatternCategory {
  name: string;
  slug: string;
  subPatterns: SubPattern[];
}

