'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ADSENSE_CLIENT, adsEnabled, slotId, type Placement } from '@/lib/ads';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export type AdSlotProps = {
  slot?: Placement;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
  label?: boolean;
};

/**
 * Renders nothing unless both the publisher id and a real numeric unit id are
 * configured, so an unconfigured placement leaves no empty box on the page.
 *
 * Deliberately never used on /menu/[slug]: a diner reading a menu at the table
 * is not the audience, and AdSense discourages ads on that kind of utility page.
 */
export function AdSlot({ slot, format = 'auto', className, label = true }: AdSlotProps) {
  const pushed = useRef(false);
  const id = slot ? slotId(slot) : undefined;
  const show = adsEnabled && Boolean(id);

  useEffect(() => {
    if (!show || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      // React 18 mounts effects twice in dev; a second push logs an AdSense error.
      pushed.current = true;
    } catch {
      /* Blocked by an extension, or the script has not landed. Nothing to do. */
    }
  }, [show]);

  if (!show) return null;

  return (
    <aside className={clsx('my-10', className)} aria-label="Advertisement">
      {label ? (
        <p className="mb-2 text-center text-[10px] uppercase tracking-[0.14em] text-[var(--faint)]">
          Advertisement
        </p>
      ) : null}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={id}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
