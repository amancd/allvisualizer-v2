/**
 * Content model for AllVisualizer.
 *
 * Every subject, topic and visualizer on the site is described once in this
 * folder. Subject pages, topic pages, search and the sitemap are all generated
 * from that data, so adding a visualizer means:
 *
 *   1. Build the page under `app/<subject>/...` (see CONTRIBUTING notes in README).
 *   2. Add one `ContentItem` to the matching topic in `config/content/<subject>.ts`.
 *
 * Nothing else needs to be edited.
 */
import type { LucideIcon } from 'lucide-react';
import type { Accent } from '@/components/ui/accents';

/** Science subjects use Beginner/Intermediate/Advanced; DSA uses LeetCode-style labels. */
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Easy' | 'Medium' | 'Hard';

export type Status = 'available' | 'coming-soon';

/** A single visualizer, simulation or problem page. */
export interface ContentItem {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  /** Short keywords shown as chips and used by search. */
  tags: string[];
  /** Defaults to 'available'. Coming-soon items are listed but not linked. */
  status?: Status;
}

/** A key idea shown in the "Key concepts" grid of a topic page. */
export interface Concept {
  title: string;
  description: string;
}

/** A group of related items, e.g. "Classical Mechanics" or "Arrays". */
export interface Topic {
  slug: string;
  title: string;
  icon: LucideIcon;
  /** One line, used on cards. */
  summary: string;
  /** A short paragraph, used at the top of the topic page. */
  intro: string;
  /** Path prefix for this topic's item pages, e.g. '/physics-visualizer/simulations'. */
  itemBasePath: string;
  /** Chips shown on the topic card. */
  highlights: string[];
  concepts?: Concept[];
  /** Plain bullet points, used where concepts don't fit (e.g. DSA topics). */
  keyPoints?: string[];
  items: ContentItem[];
  status?: Status;
  /** Show a Giscus discussion thread at the bottom of the topic page. */
  discussion?: boolean;
}

/** A feature/benefit card on a subject landing page. */
export interface Highlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

/** A top-level subject such as Physics. */
export interface Subject {
  id: 'dsa' | 'math' | 'physics' | 'ai-ml';
  title: string;
  /** Short label used in breadcrumbs. */
  shortTitle: string;
  href: string;
  accent: Accent;
  intro: string;
  /** Label for items in this subject, e.g. 'simulations' or 'problems'. */
  itemNoun: string;
  topics: Topic[];
  /** Optional "Why learn this?" cards. */
  whyLearn?: { title: string; description: string; items: Highlight[] };
  /** Optional "Learning features" cards. */
  features?: { title: string; description: string; items: Highlight[] };
}
