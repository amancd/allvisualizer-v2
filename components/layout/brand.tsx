/**
 * The AllVisualizer mark: a rising zig-zag line on an indigo→fuchsia gradient.
 * Shared by the header/footer logo and the generated favicons so they always match.
 */
export const BRAND_GRADIENT = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)';
export const BRAND_MARK_PATH = 'M4 19 L10 5 L14 14 L16.5 10 L20 19';

/** Square icon used by app/icon.tsx and app/apple-icon.tsx (rendered with next/og, so inline styles only). */
export function BrandIcon({ size, radius }: { size: number; radius: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: BRAND_GRADIENT,
        borderRadius: radius,
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <path d={BRAND_MARK_PATH} />
      </svg>
    </div>
  );
}
