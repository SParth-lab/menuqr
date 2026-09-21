import type { Metadata } from 'next';
import { DailyStat, MenuItem, PageView } from '@/models';
import { getOwnerRestaurant } from '@/lib/owner';
import { lastNDays } from '@/lib/format';
import { Card, EmptyState, PageHeader, StatCard } from '@/components/ui';
import { BarChart } from '@/components/dashboard/BarChart';

export const metadata: Metadata = { title: 'Analytics', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const restaurant = await getOwnerRestaurant();
  const window = lastNDays(30);

  const [stats, popularRaw] = await Promise.all([
    DailyStat.find({ restaurantId: restaurant._id, day: { $gte: window[0] } }).lean(),
    PageView.aggregate([
      { $match: { restaurantId: restaurant._id, itemId: { $ne: null }, day: { $gte: window[0] } } },
      { $group: { _id: '$itemId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 8 },
    ]),
  ]);

  const byDay = new Map(stats.map((s) => [s.day, s]));
  const series = window.map((day) => ({
    day,
    views: byDay.get(day)?.views ?? 0,
    qrScans: byDay.get(day)?.qrScans ?? 0,
  }));

  const totals = series.reduce(
    (acc, d) => ({ views: acc.views + d.views, qrScans: acc.qrScans + d.qrScans }),
    { views: 0, qrScans: 0 }
  );
  const last7 = series.slice(-7).reduce((n, d) => n + d.views, 0);

  const itemDocs = await MenuItem.find({
    _id: { $in: popularRaw.map((p) => p._id) },
    restaurantId: restaurant._id,
  })
    .select('name')
    .lean();
  const nameById = new Map(itemDocs.map((i) => [i._id.toString(), i.name]));

  return (
    <>
      <PageHeader title="Analytics" description="Last 30 days. A QR scan is a visit that arrived from your printed code." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Menu views (30d)" value={totals.views} />
        <StatCard label="QR scans (30d)" value={totals.qrScans} hint={totals.views > 0 ? `${Math.round((totals.qrScans / totals.views) * 100)}% of visits` : undefined} />
        <StatCard label="Views (7d)" value={last7} />
      </div>

      <Card className="mt-5">
        <h2 className="text-sm font-bold text-slate-900">Daily traffic</h2>
        <div className="mt-4">
          {totals.views === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No visits recorded yet. Traffic appears here once guests start scanning.
            </p>
          ) : (
            <BarChart data={series} />
          )}
        </div>
      </Card>

      <Card className="mt-5">
        <h2 className="text-sm font-bold text-slate-900">Most viewed items</h2>
        {popularRaw.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No item data yet"
              body="Item-level views are recorded when guests interact with individual dishes. This fills in as your menu gets traffic."
            />
          </div>
        ) : (
          <ol className="mt-3 divide-y divide-slate-100">
            {popularRaw.map((p, i) => (
              <li key={p._id.toString()} className="flex items-center justify-between py-2 text-sm">
                <span className="text-slate-700">
                  <span className="mr-2 text-xs text-slate-400">{i + 1}</span>
                  {nameById.get(p._id.toString()) ?? 'Deleted item'}
                </span>
                <span className="font-semibold text-slate-900">{p.views}</span>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </>
  );
}
