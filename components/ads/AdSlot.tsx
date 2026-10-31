'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { adSlots, adsenseClient, type AdPlacement } from '@/config/ads';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * A responsive AdSense display unit. The slot ID comes from `config/ads.ts`.
 *
 * Remounts on every route change so client-side navigation requests a fresh ad.
 * If AdSense has no ad to show, the whole block is hidden (see `.ad-slot` in globals.css).
 */
export default function AdSlot({ placement, className = '' }: { placement: AdPlacement; className?: string }) {
  const pathname = usePathname();
  const slot = adSlots[placement];

  if (!slot) {
    if (process.env.NODE_ENV !== 'development') return null;
    return (
      <div className={`grid min-h-[100px] place-items-center rounded-card border border-dashed border-line-strong text-xs text-ink-faint ${className}`}>
        Ad placement “{placement}” (add a slot ID in config/ads.ts)
      </div>
    );
  }

  return <AdUnit key={pathname} slot={slot} className={className} />;
}

function AdUnit({ slot, className }: { slot: string; className: string }) {
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Strict Mode runs effects twice in development; AdSense errors if the same <ins> is filled twice.
    if (insRef.current?.dataset.adsbygoogleStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers and AdSense script failures must never break the page.
    }
  }, []);

  return (
    <aside aria-label="Advertisement" className={`ad-slot ${className}`}>
      <p className="mb-1 text-center text-[11px] uppercase tracking-wide text-ink-faint">Advertisement</p>
      <ins
        ref={insRef}
        className="adsbygoogle block min-h-[100px] w-full"
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
