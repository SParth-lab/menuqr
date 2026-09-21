import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { DailyStat, MenuItem, Post, Restaurant, User } from '@/models';
import { errorResponse, requireAdmin } from '@/lib/rbac';
import { lastNDays } from '@/lib/format';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const window = lastNDays(30);

    const [byStatus, totalRestaurants, totalOwners, totalItems, totalPosts, traffic, series] =
      await Promise.all([
        Restaurant.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
        Restaurant.countDocuments({}),
        User.countDocuments({ role: 'RESTAURANT_OWNER' }),
        MenuItem.countDocuments({}),
        Post.countDocuments({}),
        DailyStat.aggregate([
          { $group: { _id: null, views: { $sum: '$views' }, qrScans: { $sum: '$qrScans' } } },
        ]),
        DailyStat.aggregate([
          { $match: { day: { $gte: window[0] } } },
          { $group: { _id: '$day', views: { $sum: '$views' }, qrScans: { $sum: '$qrScans' } } },
          { $sort: { _id: 1 } },
        ]),
      ]);

    const counts = Object.fromEntries(byStatus.map((s) => [s._id, s.n])) as Record<string, number>;
    const byDay = new Map(series.map((s) => [s._id as string, s]));

    return NextResponse.json({
      restaurants: {
        total: totalRestaurants,
        pending: counts.PENDING ?? 0,
        approved: counts.APPROVED ?? 0,
        rejected: counts.REJECTED ?? 0,
        suspended: counts.SUSPENDED ?? 0,
      },
      owners: totalOwners,
      items: totalItems,
      posts: totalPosts,
      traffic: { views: traffic[0]?.views ?? 0, qrScans: traffic[0]?.qrScans ?? 0 },
      series: window.map((day) => ({
        day,
        views: byDay.get(day)?.views ?? 0,
        qrScans: byDay.get(day)?.qrScans ?? 0,
      })),
    });
  } catch (err) {
    return errorResponse(err);
  }
}
