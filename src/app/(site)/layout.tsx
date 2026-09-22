import Link from 'next/link';
import { AdSenseScript } from '@/components/ads/AdSlot';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MenuQR';

const NAV = [
  { href: '/digital-menu/restaurant', label: 'Restaurants' },
  { href: '/digital-menu/cafe', label: 'Cafes' },
  { href: '/qr-menu/restaurant', label: 'Table codes' },
  { href: '/blog', label: 'Guides' },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdSenseScript />

      <header className="sticky top-0 z-20 border-b border-[var(--rule)] bg-[color-mix(in_srgb,var(--bone)_92%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-5 py-4">
          <Link href="/" className="display text-2xl leading-none">
            {siteName}
          </Link>

          <nav className="hidden gap-7 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-[var(--ink)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-[var(--claret)]">
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center bg-[var(--claret)] px-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--bone)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--ink)]"
            >
              Start a menu
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-[var(--rule)] bg-[var(--ink)] text-[#867e70]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
          <div>
            <p className="display foil text-2xl">{siteName}</p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed">
              Digital menus set as printed cards. One code on the table, changed from the
              pass, never reprinted.
            </p>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#5f584d]">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/digital-menu/restaurant" className="hover:text-[var(--brass-lift)]">Digital menu for restaurants</Link></li>
              <li><Link href="/digital-menu/cafe" className="hover:text-[var(--brass-lift)]">Digital menu for cafes</Link></li>
              <li><Link href="/qr-menu/restaurant" className="hover:text-[var(--brass-lift)]">QR menu for restaurants</Link></li>
              <li><Link href="/qr-menu/cafe" className="hover:text-[var(--brass-lift)]">QR menu for cafes</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#5f584d]">Learn</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-[var(--brass-lift)]">All guides</Link></li>
              <li><Link href="/blog/how-to-create-a-digital-menu" className="hover:text-[var(--brass-lift)]">How to create a digital menu</Link></li>
              <li><Link href="/blog/benefits-of-qr-menu-for-restaurants" className="hover:text-[var(--brass-lift)]">Why QR menus</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1d1a16] px-5 py-5 text-center text-[10px] uppercase tracking-[0.2em] text-[#5f584d]">
          © {new Date().getFullYear()} {siteName}
        </div>
      </footer>
    </div>
  );
}
