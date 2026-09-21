'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import clsx from 'clsx';

export type NavItem = { href: string; label: string };

export function Shell({
  nav,
  title,
  subtitle,
  badge,
  children,
}: {
  nav: NavItem[];
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-4 py-4 lg:block">
          <div>
            <Link href="/" className="text-sm font-extrabold tracking-tight text-slate-900">
              {title}
            </Link>
            {subtitle ? <p className="mt-0.5 truncate text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          {badge ? <div className="lg:mt-2">{badge}</div> : null}
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {nav.map((item) => {
            // Exact match for the section root, prefix match for its children.
            const active =
              pathname === item.href ||
              (item.href !== nav[0].href && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-slate-200 p-3 lg:block">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>
    </div>
  );
}
