import type { Metadata } from 'next';
import Link from 'next/link';
import { Category, DailyStat, MenuItem } from '@/models';
import { getOwnerRestaurant } from '@/lib/owner';
import { publicMenuUrl } from '@/lib/qr';
import { lastNDays } from '@/lib/format';
import { Card, LinkButton, PageHeader, StatCard } from '@/components/ui';

export const metadata: Metadata = { title: 'Overview', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function DashboardHome() {
  const restaurant = await getOwnerRestaurant();
  const window = lastNDays(30);

  const [categories, items, hidden, stats] = await Promise.all([
    Category.countDocuments({ restaurantId: restaurant._id }),
    MenuItem.countDocuments({ restaurantId: restaurant._id }),
    MenuItem.countDocuments({ restaurantId: restaurant._id, isAvailable: false }),
    DailyStat.find({ restaurantId: restaurant._id, day: { $gte: window[0] } }).lean(),
  ]);

  const views = stats.reduce((n, s) => n + s.views, 0);
  const scans = stats.reduce((n, s) => n + s.qrScans, 0);

  const steps = [
    { done: Boolean(restaurant.logoUrl && restaurant.address && restaurant.phone), label: 'Complete your restaurant profile', href: '/dashboard/profile' },
    { done: categories > 0, label: 'Create your first category', href: '/dashboard/menu' },
    { done: items >= 5, label: 'Add at least 5 menu items', href: '/dashboard/menu' },
    { done: restaurant.status === 'APPROVED', label: 'Get approved by our team', href: '/dashboard' },
  ];
  const remaining = steps.filter((s) => !s.done);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Your menu at a glance."
        action={
          restaurant.status === 'APPROVED' ? (
            <LinkButton href={`/menu/${restaurant.slug}`} variant="outline" size="sm" target="_blank">
              View public menu
            </LinkButton>
          ) : null
        }
      />

      {restaurant.status !== 'APPROVED' ? (
        <div className="mb-6 rounded-xl border border-[rgba(176,138,60,0.4)] bg-[rgba(176,138,60,0.13)] p-4">
          <p className="text-sm font-semibold text-[var(--brass-lift)]">
            {restaurant.status === 'PENDING' && 'Your restaurant is awaiting approval'}
            {restaurant.status === 'REJECTED' && 'Your restaurant was not approved'}
            {restaurant.status === 'SUSPENDED' && 'Your restaurant is suspended'}
          </p>
          <p className="mt-1 text-sm text-[var(--brass-lift)]">
            {restaurant.status === 'PENDING' &&
              'You can build the full menu now. The public page and QR code go live as soon as it is approved.'}
            {restaurant.status === 'REJECTED' &&
              (restaurant.rejectionReason || 'Contact support for details.')}
            {restaurant.status === 'SUSPENDED' &&
              'The public menu is hidden. Contact support to restore it.'}
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Categories" value={categories} />
        <StatCard label="Menu items" value={items} hint={hidden > 0 ? `${hidden} unavailable` : undefined} />
        <StatCard label="Views (30d)" value={views} />
        <StatCard label="QR scans (30d)" value={scans} />
      </div>

      {remaining.length > 0 ? (
        <Card className="mt-6">
          <h2 className="text-sm font-bold text-[var(--ink)]">Finish setting up</h2>
          <ul className="mt-3 space-y-2">
            {steps.map((s) => (
              <li key={s.label} className="flex items-center gap-2.5 text-sm">
                <span
                  className={
                    s.done
                      ? 'inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(78,154,81,0.16)]0 text-[10px] text-white'
                      : 'inline-block h-4 w-4 rounded-full border border-[var(--line-hi)]'
                  }
                >
                  {s.done ? '✓' : ''}
                </span>
                {s.done ? (
                  <span className="text-[var(--muted)] line-through">{s.label}</span>
                ) : (
                  <Link href={s.href} className="font-medium text-[var(--ink)] hover:text-[var(--brass-lift)]">
                    {s.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card className="mt-6">
        <h2 className="text-sm font-bold text-[var(--ink)]">Your public menu URL</h2>
        <p className="mt-2 break-all rounded-lg bg-[var(--ground-2)] px-3 py-2 font-mono text-xs text-[var(--ink-soft)]">
          {publicMenuUrl(restaurant.slug)}
        </p>
        <p className="mt-2 text-xs text-[var(--muted)]">
          This URL is what your QR code points to. It stays the same unless you rename the
          restaurant.
        </p>
      </Card>
    </>
  );
}
