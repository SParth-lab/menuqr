'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import clsx from 'clsx';
import { Logo } from '@/components/brand/Logo';

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
    <div className="relative min-h-screen lg:flex">
      <aside className="stick-top relative border-b border-[var(--line)] bg-[var(--navy)] text-[#9fb3d1] lg:border-b-0 lg:border-r lg:sticky lg:top-0 lg:z-[2] lg:h-screen lg:w-60 lg:shrink-0 lg:overflow-y-auto">
        <div className="relative z-[2] flex items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.1)] px-5 py-5 lg:block">
          <div className="min-w-0">
            <Link href="/" className="display foil block truncate text-xl leading-none">
              {title}
            </Link>
            {subtitle ? (
              <p className="mt-1.5 truncate text-[11px] text-[#7e93b5]">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2 lg:mt-3">
            {badge}
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="btn btn-ghost btn-sm lg:hidden"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav className="relative z-[2] flex gap-1 overflow-x-auto px-3 py-3 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:py-4">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== nav[0].href && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'whitespace-nowrap border-l-2 px-5 py-2.5 text-[13px] font-medium transition-all duration-200',
                  active
                    ? 'border-[#5b9bff] bg-[rgba(255,255,255,0.06)] text-white'
                    : 'border-transparent text-[var(--muted)] hover:border-[#4a443f] hover:pl-6 hover:text-[#f0ebe2]'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-[2] hidden border-t border-[rgba(255,255,255,0.1)] p-3 lg:block">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full px-2 py-2 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-[#9fb3d1] transition-colors hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-7 lg:px-10">{children}</main>
    </div>
  );
}
