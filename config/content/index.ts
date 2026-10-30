/**
 * Entry point for site content. Pages should read subjects, topics and items
 * through these helpers instead of hard-coding lists.
 */
import { dsa } from './dsa';
import { math } from './math';
import { physics } from './physics';
import { aiMl } from './ai-ml';
import type { Crumb } from '@/components/ui/Breadcrumbs';
import type { ContentItem, Subject, Topic } from './types';

export type { Crumb };
export type { ContentItem, Concept, Difficulty, Highlight, Status, Subject, Topic } from './types';

export const subjects: Subject[] = [dsa, math, physics, aiMl];

export type SubjectId = Subject['id'];

export function getSubject(id: SubjectId): Subject {
  const subject = subjects.find((s) => s.id === id);
  if (!subject) throw new Error(`Unknown subject "${id}"`);
  return subject;
}

export function getTopic(subjectId: SubjectId, topicSlug: string): Topic | undefined {
  return getSubject(subjectId).topics.find((t) => t.slug === topicSlug);
}

/** Finds an item and the topic it belongs to. Throws so a typo fails the build instead of rendering a broken page. */
export function getItem(subjectId: SubjectId, itemSlug: string): { topic: Topic; item: ContentItem } {
  for (const topic of getSubject(subjectId).topics) {
    const item = topic.items.find((i) => i.slug === itemSlug);
    if (item) return { topic, item };
  }
  throw new Error(`Unknown item "${itemSlug}" in subject "${subjectId}"`);
}

export const isAvailable = (x: { status?: string }) => x.status !== 'coming-soon';

export const topicHref = (subject: Subject, topic: Topic) => `${subject.href}/${topic.slug}`;

export const itemHref = (topic: Topic, item: ContentItem) => `${topic.itemBasePath}/${item.slug}`;

/** The live items before and after this one in its topic, for prev/next links. */
export function neighboursOf(subjectId: SubjectId, itemSlug: string) {
  const { topic } = getItem(subjectId, itemSlug);
  const live = topic.items.filter(isAvailable);
  const i = live.findIndex((it) => it.slug === itemSlug);
  const link = (item?: ContentItem) => item && { title: item.title, href: itemHref(topic, item) };
  return { prev: link(live[i - 1]), next: link(live[i + 1]) };
}

/** Number of live items in a subject or topic. */
export function countAvailable(source: Subject | Topic): number {
  const topics = 'topics' in source ? source.topics : [source];
  return topics.reduce((n, t) => n + t.items.filter(isAvailable).length, 0);
}

/** Breadcrumb trail for a subject, topic or item page. The last crumb is the current page and has no link. */
export function breadcrumbsFor(subjectId: SubjectId, topicSlug?: string, itemSlug?: string): Crumb[] {
  const subject = getSubject(subjectId);
  const crumbs: Crumb[] = [{ label: 'Home', href: '/' }, { label: subject.shortTitle, href: subject.href }];

  const topic = itemSlug ? getItem(subjectId, itemSlug).topic : topicSlug ? getTopic(subjectId, topicSlug) : undefined;
  if (topic) crumbs.push({ label: topic.title, href: topicHref(subject, topic) });
  if (itemSlug) crumbs.push({ label: getItem(subjectId, itemSlug).item.title });

  // The current page is never a link.
  delete crumbs[crumbs.length - 1].href;
  return crumbs;
}

export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  subject: string;
  topic: string;
  tags: string[];
}

/** Every live page, flattened for the search page and sitemap. */
export const searchIndex: SearchEntry[] = [
  {
    title: 'DSA Patterns',
    description: 'Notes and code templates for coding interview patterns',
    href: '/dsa-patterns',
    subject: 'DSA',
    topic: 'Patterns',
    tags: ['patterns', 'two pointers', 'sliding window', 'binary search', 'dynamic programming', 'templates', 'notes'],
  },
  ...subjects.flatMap((subject) => [
    { title: subject.title, description: subject.intro, href: subject.href, subject: subject.shortTitle, topic: 'Overview', tags: [subject.shortTitle.toLowerCase()] },
    ...subject.topics.filter(isAvailable).flatMap((topic) => [
      { title: topic.title, description: topic.summary, href: topicHref(subject, topic), subject: subject.shortTitle, topic: 'Topic', tags: topic.highlights.map((h) => h.toLowerCase()) },
      ...topic.items.filter(isAvailable).map((item) => ({
        title: item.title,
        description: item.description,
        href: itemHref(topic, item),
        subject: subject.shortTitle,
        topic: topic.title,
        tags: [...item.tags.map((t) => t.toLowerCase()), item.difficulty.toLowerCase()],
      })),
    ]),
  ]),
];
