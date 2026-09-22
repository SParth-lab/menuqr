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

      <header className="sticky top-0 z-30 px-4 pt-4">
        <div className="glass sheen mx-auto flex max-w-6xl items-center gap-6 rounded-[18px] px-5 py-3">
          <Link href="/" className="relative z-[2]" aria-label={`${siteName} home`}>
            <Logo variant="full" size={28} />
          </Link>

          <nav className="relative z-[2] hidden gap-6 md:flex">
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

          <div className="relative z-[2] ml-auto flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center rounded-full bg-[var(--claret)] px-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--claret-lift)]"
            >
              List your venue
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="mt-20 px-4 pb-6">
        <div className="glass mx-auto max-w-6xl rounded-[24px] px-8 py-12">
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

          <div className="relative z-[2] mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(255,255,255,0.09)] pt-6">
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
