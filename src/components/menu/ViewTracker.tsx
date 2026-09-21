'use client';

import { useEffect } from 'react';

/**
 * Fire-and-forget beacon. Deliberately not awaited and not rendered into the
 * markup, so analytics can never delay or block the menu paint.
 */
export function ViewTracker({ restaurantId }: { restaurantId: string }) {
  useEffect(() => {
    const src = new URLSearchParams(window.location.search).get('src');
    const ref = document.referrer;

    const source =
      src === 'qr'
        ? 'QR'
        : /google|bing|duckduckgo|yahoo/i.test(ref)
          ? 'SEARCH'
          : /instagram|facebook|twitter|x\.com|t\.co|linkedin/i.test(ref)
            ? 'SOCIAL'
            : 'DIRECT';

    const body = JSON.stringify({ restaurantId, source });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/track', { method: 'POST', body, keepalive: true }).catch(() => {});
    }
  }, [restaurantId]);

  return null;
}
