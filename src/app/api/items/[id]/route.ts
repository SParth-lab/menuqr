import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Category, MenuItem } from '@/models';
import { errorResponse, requireOwnRestaurant } from '@/lib/rbac';
import { revalidateMenu } from '@/lib/revalidate';

const patchSchema = z.object({
  categoryId: z.string().optional(),
  name: z.string().min(1).max(80).optional(),
  description: z.string().max(300).optional(),
  price: z.coerce.number().min(0).max(1_000_000).optional(),
  imageUrl: z.string().optional(),
  isVeg: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  isVisible: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const r = await requireOwnRestaurant();
    const { id } = await params;
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }

    // Moving an item between categories must not let it escape the restaurant.
    if (parsed.data.categoryId) {
      const category = await Category.findOne({ _id: parsed.data.categoryId, restaurantId: r._id })
        .select('_id')
        .lean();
      if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const item = await MenuItem.findOneAndUpdate(
      { _id: id, restaurantId: r._id },
      { $set: parsed.data },
      { new: true }
    );
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    revalidateMenu(r.slug);
    return NextResponse.json({ ok: true, item: item.toObject() });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const r = await requireOwnRestaurant();
    const { id } = await params;

    const item = await MenuItem.findOneAndDelete({ _id: id, restaurantId: r._id });
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    revalidateMenu(r.slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
