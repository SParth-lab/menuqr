import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Category, MenuItem } from '@/models';
import { errorResponse, requireOwnRestaurant } from '@/lib/rbac';
import { revalidateMenu } from '@/lib/revalidate';

const patchSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  description: z.string().max(240).optional(),
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

    // restaurantId in the filter is the tenant boundary — a forged id matches nothing.
    const category = await Category.findOneAndUpdate(
      { _id: id, restaurantId: r._id },
      { $set: parsed.data },
      { new: true }
    );
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    revalidateMenu(r.slug);
    return NextResponse.json({ ok: true, category: category.toObject() });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const r = await requireOwnRestaurant();
    const { id } = await params;

    const category = await Category.findOneAndDelete({ _id: id, restaurantId: r._id });
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    // Items would otherwise be orphaned and invisible but still counted.
    await MenuItem.deleteMany({ categoryId: id, restaurantId: r._id });

    revalidateMenu(r.slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
