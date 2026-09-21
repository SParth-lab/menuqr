import { NextResponse } from 'next/server';
import { DailyStat, MenuItem, PageView } from '@/models';
import { errorResponse, requireOwnRestaurant } from '@/lib/rbac';
import { lastNDays } from '@/lib/format';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const r = await requireOwnRestaurant();
    const days = Math.min(Math.max(Number(new URL(req.url).searchParams.get('days')) || 30, 7), 90);
    const window = lastNDays(days);

    // Dashboard reads the rollup, never the raw event collection.
    const stats = await DailyStat.find({
      restaurantId: r._id,
      day: { $gte: window[0] },
    })
      .sort({ day: 1 })
      .lean();

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

    const popularRaw = await PageView.aggregate([
      { $match: { restaurantId: r._id, itemId: { $ne: null }, day: { $gte: window[0] } } },
      { $group: { _id: '$itemId', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    const itemNames = await MenuItem.find({
      _id: { $in: popularRaw.map((p) => p._id) },
      restaurantId: r._id,
    })
      .select('name')
      .lean();
    const nameById = new Map(itemNames.map((i) => [i._id.toString(), i.name]));

    return NextResponse.json({
      days,
      totals,
      series,
      popularItems: popularRaw
        .filter((p) => nameById.has(p._id.toString()))
        .map((p) => ({ id: p._id.toString(), name: nameById.get(p._id.toString()), views: p.views })),
    });
  } catch (err) {
    return errorResponse(err);
  }
}
