import type { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { DailyStat, Restaurant } from '@/models';
import { lastNDays } from '@/lib/format';
import { Card, PageHeader, StatCard } from '@/components/ui';
import { BarChart } from '@/components/dashboard/BarChart';

export const metadata: Metadata = { title: 'Analytics', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminAnalytics() {
  await connectDB();
  const window = lastNDays(30);

  const [series, lifetime, topRaw] = await Promise.all([
    DailyStat.aggregate([
      { $match: { day: { $gte: window[0] } } },
      { $group: { _id: '$day', views: { $sum: '$views' }, qrScans: { $sum: '$qrScans' } } },
    ]),
    DailyStat.aggregate([{ $group: { _id: null, views: { $sum: '$views' }, qrScans: { $sum: '$qrScans' } } }]),
    DailyStat.aggregate([
      { $match: { day: { $gte: window[0] } } },
      { $group: { _id: '$restaurantId', views: { $sum: '$views' }, qrScans: { $sum: '$qrScans' } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]),
  ]);

  const byDay = new Map(series.map((s) => [s._id as string, s]));
  const chart = window.map((day) => ({
    day,
    views: byDay.get(day)?.views ?? 0,
    qrScans: byDay.get(day)?.qrScans ?? 0,
  }));
  const windowTotal = chart.reduce((n, d) => n + d.views, 0);

  const names = await Restaurant.find({ _id: { $in: topRaw.map((t) => t._id) } })
    .select('name slug')
    .lean();
  const byId = new Map(names.map((n) => [n._id.toString(), n]));

  return (
    <>
      <PageHeader title="Analytics" description="Platform traffic across every published menu." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Views (30d)" value={windowTotal} />
        <StatCard label="Views (all time)" value={lifetime[0]?.views ?? 0} />
        <StatCard label="QR scans (all time)" value={lifetime[0]?.qrScans ?? 0} />
      </div>

      <Card className="mt-5">
        <h2 className="text-sm font-bold text-[var(--ink)]">Daily traffic, last 30 days</h2>
        <div className="mt-4">
          {windowTotal === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--muted)]">No traffic recorded yet.</p>
          ) : (
            <BarChart data={chart} />
          )}
        </div>
      </Card>

      <Card className="mt-5">
        <h2 className="text-sm font-bold text-[var(--ink)]">Busiest menus, last 30 days</h2>
        {topRaw.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">No data yet.</p>
        ) : (
          <ol className="mt-3 divide-y divide-[var(--line)]">
            {topRaw.map((t, i) => {
              const r = byId.get(t._id.toString());
              return (
                <li key={t._id.toString()} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="min-w-0 truncate">
                    <span className="mr-2 text-xs text-[var(--faint)]">{i + 1}</span>
                    {r ? (
                      <Link href={`/admin/restaurants/${r._id}`} className="text-[var(--ink)] hover:text-[var(--brass-lift)]">
                        {r.name}
                      </Link>
                    ) : (
                      <span className="text-[var(--faint)]">Deleted restaurant</span>
                    )}
                  </span>
                  <span className="shrink-0 text-[var(--ink-soft)]">
                    <span className="font-semibold text-[var(--ink)]">{t.views}</span> views · {t.qrScans} scans
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </Card>
    </>
  );
}
