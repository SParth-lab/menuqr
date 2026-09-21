import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Category, DailyStat, MenuItem, PageView, Restaurant, User } from '@/models';
import { errorResponse, requireAdmin } from '@/lib/rbac';
import { revalidateMenu } from '@/lib/revalidate';
import { RESTAURANT_STATUSES } from '@/types';

type Ctx = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  status: z.enum(RESTAURANT_STATUSES),
  rejectionReason: z.string().max(300).optional(),
});

export async function GET(_req: Request, { params }: Ctx) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;

    const restaurant = await Restaurant.findById(id).lean();
    if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const [owner, categories, items] = await Promise.all([
      User.findById(restaurant.ownerId).select('name email createdAt isActive').lean(),
      Category.find({ restaurantId: id }).sort({ sortOrder: 1 }).lean(),
      MenuItem.find({ restaurantId: id }).sort({ sortOrder: 1 }).lean(),
    ]);

    return NextResponse.json({ restaurant, owner, categories, items });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;

    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      {
        $set: {
          status: parsed.data.status,
          rejectionReason: parsed.data.status === 'REJECTED' ? parsed.data.rejectionReason : undefined,
        },
      },
      { new: true }
    );
    if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Status decides public visibility, so the cached page must be rebuilt either way.
    revalidateMenu(restaurant.slug);

    return NextResponse.json({ ok: true, restaurant: restaurant.toObject() });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const slug = restaurant.slug;
    const ownerId = restaurant.ownerId;

    // No cascade in MongoDB — every child collection is cleared explicitly.
    await Promise.all([
      MenuItem.deleteMany({ restaurantId: id }),
      Category.deleteMany({ restaurantId: id }),
      PageView.deleteMany({ restaurantId: id }),
      DailyStat.deleteMany({ restaurantId: id }),
    ]);
    await Restaurant.deleteOne({ _id: id });
    await User.deleteOne({ _id: ownerId, role: 'RESTAURANT_OWNER' });

    revalidateMenu(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
