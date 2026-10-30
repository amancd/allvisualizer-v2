import GiscusComments from '@/components/ui/GiscusComments';

/** Comment thread (GitHub Discussions via Giscus) shown at the end of a page. */
export default function Discussion() {
  return (
    <section className="border-t border-line pt-10">
      <h2 className="text-2xl font-bold tracking-tight text-ink">Discussion</h2>
      <p className="mt-2 mb-6 text-ink-muted">Questions, ideas or a different approach? Join the conversation.</p>
      <GiscusComments />
    </section>
  );
}
