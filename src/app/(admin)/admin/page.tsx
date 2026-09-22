import type { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { DailyStat, MenuItem, Post, Restaurant, User } from '@/models';
import { lastNDays } from '@/lib/format';
import { Card, LinkButton, PageHeader, StatCard } from '@/components/ui';
import { BarChart } from '@/components/dashboard/BarChart';

export const metadata: Metadata = { title: 'Admin dashboard', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectDB();
  const window = lastNDays(30);

  const [byStatus, owners, items, posts, lifetime, series, recentPending] = await Promise.all([
    Restaurant.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
    User.countDocuments({ role: 'RESTAURANT_OWNER' }),
    MenuItem.countDocuments({}),
    Post.countDocuments({ status: 'PUBLISHED' }),
    DailyStat.aggregate([{ $group: { _id: null, views: { $sum: '$views' }, qrScans: { $sum: '$qrScans' } } }]),
    DailyStat.aggregate([
      { $match: { day: { $gte: window[0] } } },
      { $group: { _id: '$day', views: { $sum: '$views' }, qrScans: { $sum: '$qrScans' } } },
    ]),
    Restaurant.find({ status: 'PENDING' }).sort({ createdAt: -1 }).limit(5).select('name slug city createdAt').lean(),
  ]);

  const counts = Object.fromEntries(byStatus.map((s) => [s._id, s.n])) as Record<string, number>;
  const totalRestaurants = Object.values(counts).reduce((a, b) => a + b, 0);
  const byDay = new Map(series.map((s) => [s._id as string, s]));
  const chart = window.map((day) => ({
    day,
    views: byDay.get(day)?.views ?? 0,
    qrScans: byDay.get(day)?.qrScans ?? 0,
  }));

  return (
    <>
      <PageHeader title="Dashboard" description="Platform-wide state." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Restaurants" value={totalRestaurants} />
        <StatCard label="Pending approval" value={counts.PENDING ?? 0} hint={counts.PENDING ? 'Needs review' : undefined} />
        <StatCard label="Approved" value={counts.APPROVED ?? 0} />
        <StatCard label="Suspended" value={counts.SUSPENDED ?? 0} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Owners" value={owners} />
        <StatCard label="Menu items" value={items} />
        <StatCard label="Menu views (all time)" value={lifetime[0]?.views ?? 0} />
        <StatCard label="QR scans (all time)" value={lifetime[0]?.qrScans ?? 0} />
      </div>

      <Card className="mt-5">
        <h2 className="text-sm font-bold text-[var(--ink)]">Traffic, last 30 days</h2>
        <div className="mt-4">
          {chart.every((d) => d.views === 0) ? (
            <p className="py-8 text-center text-sm text-[var(--muted)]">No traffic recorded yet.</p>
          ) : (
            <BarChart data={chart} />
          )}
        </div>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--ink)]">Waiting for approval</h2>
            <LinkButton href="/admin/approvals" variant="outline" size="sm">Review all</LinkButton>
          </div>
          {recentPending.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--muted)]">Nothing pending.</p>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--line)]">
              {recentPending.map((r) => (
                <li key={r.slug} className="py-2">
                  <Link href={`/admin/restaurants/${r._id}`} className="text-sm font-medium text-[var(--ink)] hover:text-[var(--brass-lift)]">
                    {r.name}
                  </Link>
                  <p className="text-xs text-[var(--muted)]">
                    {r.city ? `${r.city} · ` : ''}
                    {new Date(r.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-[var(--ink)]">Content</h2>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            {posts} published {posts === 1 ? 'page' : 'pages'} across the blog and SEO landing routes.
          </p>
          <LinkButton href="/admin/posts" variant="outline" size="sm" className="mt-3">Manage content</LinkButton>
        </Card>
      </div>
    </>
  );
}
