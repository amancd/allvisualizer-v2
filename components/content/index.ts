/**
 * Building blocks for content pages. A typical visualizer page looks like:
 *
 *   <DetailPage subject="physics" item="newtons-laws">
 *     <NewtonsLawsVisualizer />
 *     <ContentSection title="How to use this visualizer" variant="card">
 *       <StepList steps={[...]} />
 *     </ContentSection>
 *     <ContentSection title="Real-world applications">
 *       <CardGrid items={[...]} />
 *     </ContentSection>
 *   </DetailPage>
 */
export { default as Callout } from './Callout';
export type { CalloutTone } from './Callout';
export { default as CardGrid } from './CardGrid';
export type { CardGridItem } from './CardGrid';
export { default as CodeBlock } from './CodeBlock';
export { default as CodeTabs } from './CodeTabs';
export type { CodeSample } from './CodeTabs';
export { default as Complexity } from './Complexity';
export { default as ContentHeader } from './ContentHeader';
export { default as ContentSection, Prose } from './ContentSection';
export { default as DataTable } from './DataTable';
export { default as DetailPage } from './DetailPage';
export { default as DifficultyBadge } from './DifficultyBadge';
export { default as Discussion } from './Discussion';
export { default as Formula } from './Formula';
export { default as ItemNav } from './ItemNav';
export { default as ItemCard } from './ItemCard';
export { default as PracticeProblem } from './PracticeProblem';
export { default as RelatedItems } from './RelatedItems';
export type { RelatedEntry } from './RelatedItems';
export { default as StepList } from './StepList';
export { default as SubHeading } from './SubHeading';
export { default as SubjectPage } from './SubjectPage';
export { default as Tag } from './Tag';
export { default as TopicCard } from './TopicCard';
export { default as TopicPage, topicMetadata } from './TopicPage';
