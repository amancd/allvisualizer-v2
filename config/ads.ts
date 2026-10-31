/**
 * Google AdSense settings.
 *
 * Auto ads are enabled by the AdSense script in app/layout.tsx. The manual ad units below are
 * placed in the shared page templates (DetailPage, TopicPage, SubjectPage, DSA Patterns).
 *
 * To turn a placement on, create a responsive display ad unit in AdSense
 * (Ads → By ad unit → Display ads) and paste its `data-ad-slot` number here.
 * A placement with an empty slot renders nothing in production and a labelled placeholder in development.
 */
export const adsenseClient = 'ca-pub-1582736832298841';

/** "Horizontal Display Ad" unit. Every placement shares it; create separate units for per-placement reports. */
const horizontalDisplay = '5836959656';

export const adSlots = {
  /** Visualizer/problem pages, after the first two sections. */
  inContent: horizontalDisplay,
  /** Visualizer/problem pages, after the content and before the prev/next links. */
  endOfContent: horizontalDisplay,
  /** Subject and topic pages, below the list of items. */
  listing: horizontalDisplay,
  /** DSA Patterns, below the patterns of the selected category. */
  dsaPatterns: horizontalDisplay,
} as const;

export type AdPlacement = keyof typeof adSlots;
