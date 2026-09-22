import Link from 'next/link';
import { AdSenseScript } from '@/components/ads/AdSlot';
import { Logo } from '@/components/brand/Logo';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'QR4Menu';

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

      {/* The light the glass refracts. Fixed, so it sits behind every scroll. */}
      <div className="orbfield" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
        <span className="orb orb-d" />
      </div>

      <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="glass sheen mx-auto max-w-6xl rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3">
          <div className="relative z-[2] flex min-w-0 items-center gap-3 sm:gap-4">
            <Link href="/" aria-label={`${siteName} home`} className="min-w-0 shrink">
              <Logo variant="full" size={26} />
            </Link>

            <nav className="hidden gap-6 md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-[var(--brass)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="hidden text-[13px] font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] sm:block"
              >
                Sign in
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm sm:h-10 sm:px-5">
                List venue
              </Link>

              {/* Disclosure rather than a state toggle: it works before hydration
                  and closes itself on navigation. */}
              <details className="group relative md:hidden">
                <summary
                  className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink-soft)] [&::-webkit-details-marker]:hidden"
                  aria-label="Open menu"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M4 7h16M4 12h16M4 17h16" className="group-open:hidden" />
                    <path d="M6 6l12 12M18 6L6 18" className="hidden group-open:block" />
                  </svg>
                </summary>

                <nav className="glass-dark absolute right-0 top-11 w-56 rounded-2xl p-2">
                  {NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl px-4 py-3 text-[13px] text-[var(--ink-soft)] transition-colors hover:bg-[var(--pane)] hover:text-[var(--ink)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/login"
                    className="mt-1 block border-t border-[var(--line)] px-4 py-3 pt-4 text-[13px] text-[var(--ink-soft)] hover:text-[var(--ink)]"
                  >
                    Sign in
                  </Link>
                </nav>
              </details>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="mt-7 sm:mt-12 px-3 pb-5 sm:mt-20 sm:px-4 sm:pb-6">
        <div className="glass mx-auto max-w-6xl rounded-3xl px-5 py-8 sm:px-8 sm:py-12">
          <div className="relative z-[2] grid gap-10 sm:grid-cols-3">
            <div>
              <Logo variant="full" size={30} />
              <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-[var(--muted)]">
                Digital menus set as printed cards. One code on the table, changed from the
                pass, never reprinted.
              </p>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--faint)]">
                Discover
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--ink-soft)]">
                <li><Link href="/city/surat" className="hover:text-[var(--brass-lift)]">Menus in Surat</Link></li>
                <li><Link href="/cuisine/surti-street-food" className="hover:text-[var(--brass-lift)]">Surti street food</Link></li>
                <li><Link href="/cuisine/gujarati-thali" className="hover:text-[var(--brass-lift)]">Gujarati thali</Link></li>
                <li><Link href="/cuisine/cafe-bakery" className="hover:text-[var(--brass-lift)]">Cafés and bakeries</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--faint)]">
                For venues
              </p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--ink-soft)]">
                <li><Link href="/digital-menu/restaurant" className="hover:text-[var(--brass-lift)]">Digital menu for restaurants</Link></li>
                <li><Link href="/digital-menu/cafe" className="hover:text-[var(--brass-lift)]">Digital menu for cafés</Link></li>
                <li><Link href="/qr-menu/restaurant" className="hover:text-[var(--brass-lift)]">QR menu generator</Link></li>
                <li><Link href="/blog" className="hover:text-[var(--brass-lift)]">All guides</Link></li>
              </ul>
            </div>
          </div>

          <div className="relative z-[2] mt-6 sm:mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(255,255,255,0.09)] pt-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--faint)]">
              © {new Date().getFullYear()} {siteName}
            </p>
            <p className="max-w-lg text-[11px] leading-relaxed text-[var(--faint)]">
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
