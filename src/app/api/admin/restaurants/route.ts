import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Restaurant, User } from '@/models';
import { errorResponse, requireAdmin } from '@/lib/rbac';
import { RESTAURANT_STATUSES } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await requireAdmin();
    await connectDB();

    const sp = new URL(req.url).searchParams;
    const status = sp.get('status');
    const q = sp.get('q')?.trim();
    const page = Math.max(Number(sp.get('page')) || 1, 1);
    const limit = Math.min(Math.max(Number(sp.get('limit')) || 20, 1), 100);

    const filter: Record<string, unknown> = {};
    if (status && RESTAURANT_STATUSES.includes(status as never)) filter.status = status;
    if (q) {
      // Escaped so a user-supplied '(' cannot throw an invalid-regex error.
      const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [{ name: new RegExp(safe, 'i') }, { slug: new RegExp(safe, 'i') }, { city: new RegExp(safe, 'i') }];
    }

    const [rows, total] = await Promise.all([
      Restaurant.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Restaurant.countDocuments(filter),
    ]);

    const owners = await User.find({ _id: { $in: rows.map((r) => r.ownerId) } })
      .select('name email createdAt')
      .lean();
    const ownerById = new Map(owners.map((o) => [o._id.toString(), o]));

    return NextResponse.json({
      total,
      page,
      limit,
      restaurants: rows.map((r) => ({ ...r, owner: ownerById.get(r.ownerId.toString()) ?? null })),
    });
  } catch (err) {
    return errorResponse(err);
  }
}
