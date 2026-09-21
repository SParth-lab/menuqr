import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Category } from '@/models';
import { errorResponse, requireOwnRestaurant } from '@/lib/rbac';
import { revalidateMenu } from '@/lib/revalidate';

export async function GET() {
  try {
    const r = await requireOwnRestaurant();
    const categories = await Category.find({ restaurantId: r._id }).sort({ sortOrder: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (err) {
    return errorResponse(err);
  }
}

const createSchema = z.object({
  name: z.string().min(1).max(60),
  description: z.string().max(240).optional(),
});

export async function POST(req: Request) {
  try {
    const r = await requireOwnRestaurant();
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }

    // Gap the order by 10 so a later insert between two rows needs no rewrite.
    const last = await Category.findOne({ restaurantId: r._id }).sort({ sortOrder: -1 }).select('sortOrder').lean();

    const category = await Category.create({
      restaurantId: r._id,
      ...parsed.data,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    });

    revalidateMenu(r.slug);
    return NextResponse.json({ ok: true, category: category.toObject() }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
