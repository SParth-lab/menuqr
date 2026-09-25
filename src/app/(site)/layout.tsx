import Link from 'next/link';
import { AdSenseScript } from '@/components/ads/AdSlot';
import { Suspense } from 'react';
import { Logo } from '@/components/brand/Logo';
import { NavProgress } from '@/components/site/NavProgress';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'QR4Blueprint';

const NAV = [
  { href: '/city/surat', label: 'Discover' },
  { href: '/cuisine/surti-street-food', label: 'Cuisines' },
  { href: '/blog', label: 'Guides' },
  { href: '/digital-menu/restaurant', label: 'For venues' },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdSenseScript />
      {/* useSearchParams needs a boundary, or the whole route opts out of
          static rendering. */}
      <Suspense fallback={null}>
        <NavProgress />
      </Suspense>

      {/* The light the glass refracts. Fixed, so it sits behind every scroll. */}
      <div className="orbfield" aria-hidden="true">
      </div>

      <header className="stick-top bar">
        {/* CSS-only toggle. The panel is a sibling of the bar, not a child, so
            nothing can clip it. */}
        <input type="checkbox" id="mobile-nav" className="peer sr-only" />

        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
          <Link href="/" aria-label={`${siteName} home`} className="min-w-0 shrink">
            <Logo variant="full" size={26} />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--ink-soft)] transition-colors hover:bg-[var(--pane-hi)] hover:text-[var(--claret)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden text-[13px] font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--claret)] sm:block"
            >
              Sign in
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm sm:h-10 sm:px-4">
              List venue
            </Link>

            <label
              htmlFor="mobile-nav"
              role="button"
              tabIndex={0}
              aria-controls="mobile-nav-panel"
              aria-label="Open and close the menu"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-[var(--line-hi)] text-[var(--ink-soft)] transition-colors hover:border-[var(--claret)] hover:text-[var(--claret)] md:hidden"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path className="nav-closed" d="M4 7h16M4 12h16M4 17h16" />
                <path className="nav-open" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </label>
          </div>
        </div>

        <nav
          id="mobile-nav-panel"
          aria-label="Menu"
          className="hidden border-t border-[var(--line)] bg-[var(--ground)] peer-checked:block md:hidden"
        >
          <div className="mx-auto max-w-6xl px-3 py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-3 text-[14px] font-medium text-[var(--ink-soft)] transition-colors hover:bg-[var(--pane-hi)] hover:text-[var(--claret)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="mt-1 block border-t border-[var(--line)] px-3 py-3 pt-4 text-[14px] font-medium text-[var(--ink-soft)] hover:text-[var(--claret)]"
            >
              Sign in
            </Link>
          </div>
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="mt-24 border-t border-[var(--line)] bg-[var(--pane)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <Logo variant="full" size={28} />
              <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-[var(--muted)]">
                Digital menus behind one printed code. Change a price and every table sees
                it before the next order.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ink)]">
                Discover
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] text-[var(--muted)]">
                <li><Link href="/city/surat" className="transition-colors hover:text-[var(--claret)]">Menus in Surat</Link></li>
                <li><Link href="/cuisine/surti-street-food" className="transition-colors hover:text-[var(--claret)]">Surti street food</Link></li>
                <li><Link href="/cuisine/gujarati-thali" className="transition-colors hover:text-[var(--claret)]">Gujarati thali</Link></li>
                <li><Link href="/cuisine/cafe-bakery" className="transition-colors hover:text-[var(--claret)]">Cafés and bakeries</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ink)]">
                For venues
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] text-[var(--muted)]">
                <li><Link href="/digital-menu/restaurant" className="transition-colors hover:text-[var(--claret)]">Digital menu for restaurants</Link></li>
                <li><Link href="/digital-menu/cafe" className="transition-colors hover:text-[var(--claret)]">Digital menu for cafés</Link></li>
                <li><Link href="/qr-menu/restaurant" className="transition-colors hover:text-[var(--claret)]">QR menu generator</Link></li>
                <li><Link href="/blog" className="transition-colors hover:text-[var(--claret)]">All guides</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
            <p className="text-[12px] text-[var(--faint)]">
              © {new Date().getFullYear()} {siteName}
            </p>
            <p className="max-w-xl text-[12px] leading-relaxed text-[var(--faint)]">
              Venue names and neighbourhoods are real Surat establishments shown for
              demonstration. Ratings, hours and prices are sample figures, not sourced from
              these businesses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
