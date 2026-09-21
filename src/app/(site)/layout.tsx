import Link from 'next/link';
import { AdSenseScript } from '@/components/ads/AdSlot';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MenuQR';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdSenseScript />

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-base font-extrabold tracking-tight text-slate-900">
            {siteName}
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/digital-menu/restaurant" className="hidden rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 sm:block">
              For restaurants
            </Link>
            <Link href="/digital-menu/cafe" className="hidden rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 sm:block">
              For cafes
            </Link>
            <Link href="/blog" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">
              Guides
            </Link>
            <Link href="/login" className="rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100">
              Sign in
            </Link>
            <Link href="/register" className="rounded-lg bg-orange-600 px-3.5 py-2 font-semibold text-white hover:bg-orange-700">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-3">
          <div>
            <p className="text-sm font-extrabold text-slate-900">{siteName}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Digital menus and QR codes for restaurants and cafes. Free to start, no app for guests.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Product</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li><Link href="/digital-menu/restaurant" className="hover:text-orange-700">Digital menu for restaurants</Link></li>
              <li><Link href="/digital-menu/cafe" className="hover:text-orange-700">Digital menu for cafes</Link></li>
              <li><Link href="/qr-menu/restaurant" className="hover:text-orange-700">QR menu for restaurants</Link></li>
              <li><Link href="/qr-menu/cafe" className="hover:text-orange-700">QR menu for cafes</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Learn</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li><Link href="/blog" className="hover:text-orange-700">All guides</Link></li>
              <li><Link href="/blog/how-to-create-a-digital-menu" className="hover:text-orange-700">How to create a digital menu</Link></li>
              <li><Link href="/blog/benefits-of-qr-menu-for-restaurants" className="hover:text-orange-700">Why QR menus</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {siteName}
        </div>
      </footer>
    </div>
  );
}
