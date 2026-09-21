import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Category, MenuItem } from '@/models';
import { errorResponse, requireOwnRestaurant } from '@/lib/rbac';
import { revalidateMenu } from '@/lib/revalidate';

export async function GET(req: Request) {
  try {
    const r = await requireOwnRestaurant();
    const categoryId = new URL(req.url).searchParams.get('categoryId');
    const items = await MenuItem.find({
      restaurantId: r._id,
      ...(categoryId ? { categoryId } : {}),
    })
      .sort({ sortOrder: 1 })
      .lean();
    return NextResponse.json({ items });
  } catch (err) {
    return errorResponse(err);
  }
}

const createSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(1).max(80),
  description: z.string().max(300).optional(),
  price: z.coerce.number().min(0).max(1_000_000),
  imageUrl: z.string().optional(),
  isVeg: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const r = await requireOwnRestaurant();
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }

    // Confirm the category belongs to this restaurant before attaching to it.
    const category = await Category.findOne({
      _id: parsed.data.categoryId,
      restaurantId: r._id,
    })
      .select('_id')
      .lean();
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    const last = await MenuItem.findOne({ restaurantId: r._id, categoryId: parsed.data.categoryId })
      .sort({ sortOrder: -1 })
      .select('sortOrder')
      .lean();

    const item = await MenuItem.create({
      restaurantId: r._id,
      ...parsed.data,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    });

    revalidateMenu(r.slug);
    return NextResponse.json({ ok: true, item: item.toObject() }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
