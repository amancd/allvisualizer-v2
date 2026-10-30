/** Small neutral chip for keywords. */
export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-subtle px-2 py-0.5 text-xs text-ink-muted ring-1 ring-inset ring-line">{children}</span>
  );
}
