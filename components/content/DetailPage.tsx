import type { LucideIcon } from 'lucide-react';
import { breadcrumbsFor, getItem, type SubjectId } from '@/config/content';
import ContentHeader, { contentWidth } from './ContentHeader';
import DifficultyBadge from './DifficultyBadge';
import Discussion from './Discussion';
import ItemNav from './ItemNav';

interface DetailPageProps {
  subject: SubjectId;
  /** The item's slug in `config/content/<subject>.ts`. Title, breadcrumbs and difficulty come from there. */
  item: string;
  /** Override the registry title, e.g. "Newton's Laws of Motion". */
  title?: React.ReactNode;
  /** Intro paragraph under the title. Defaults to the registry description. */
  description?: React.ReactNode;
  icon?: LucideIcon | string;
  /** Extra header badges, shown after the difficulty badge. */
  meta?: React.ReactNode;
  /** 'narrow' suits reading-heavy problem pages; 'wide' suits big simulations. */
  width?: 'narrow' | 'wide';
  /** Show the Giscus discussion at the end. */
  discussion?: boolean;
  children: React.ReactNode;
}

/**
 * Shell for every visualizer, simulation and problem page: header, body, prev/next links, discussion.
 * Put the page's sections inside as children, usually <ContentSection> blocks.
 */
export default function DetailPage({
  subject,
  item: slug,
  title,
  description,
  icon,
  meta,
  width = 'wide',
  discussion = true,
  children,
}: DetailPageProps) {
  const { item } = getItem(subject, slug);

  return (
    <article>
      <ContentHeader
        breadcrumbs={breadcrumbsFor(subject, undefined, slug)}
        icon={icon}
        title={title ?? item.title}
        description={description ?? item.description}
        width={width}
        meta={
          <>
            <DifficultyBadge level={item.difficulty} />
            {meta}
          </>
        }
      />
      <div className={`${contentWidth[width]} mx-auto space-y-12 px-4 sm:px-6 lg:px-8 py-10`}>
        {children}
        <ItemNav subject={subject} item={slug} />
        {discussion && <Discussion />}
      </div>
    </article>
  );
}
