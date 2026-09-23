'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * A click on a link can take up to ~2s to resolve (RSC fetch, and a first-visit
 * compile in dev). With no feedback that reads as a dead button, so people click
 * again. This shows a progress bar the moment a same-origin link is clicked and
 * clears it when the route actually changes.
 *
 * The App Router has no router events, so the start signal comes from a
 * capture-phase click listener rather than from the router.
 */
export function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Let the browser handle anything that is not a plain left-click navigation.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const anchor = (e.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || anchor.target === '_blank') return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page, including a pure hash change: nothing will load.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      setActive(true);

      // Safety net: never leave the bar running if a navigation is cancelled.
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setActive(false), 10_000);
    }

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  // The route committed, so whatever was pending is done.
  useEffect(() => {
    setActive(false);
    if (timer.current) clearTimeout(timer.current);
  }, [pathname, search]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5"
      style={{ opacity: active ? 1 : 0, transition: 'opacity .2s ease' }}
    >
      <div
        className="h-full bg-[linear-gradient(90deg,var(--claret),#60a5fa)]"
        style={{
          width: active ? '90%' : '0%',
          transition: active ? 'width 2.2s cubic-bezier(0.12,0.85,0.3,1)' : 'none',
        }}
      />
    </div>
  );
}
