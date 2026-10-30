/** An <h3> inside a ContentSection. */
export default function SubHeading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`mb-3 text-lg font-semibold text-ink ${className}`}>{children}</h3>;
}
