import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Category } from '@/models';
import { errorResponse, requireOwnRestaurant } from '@/lib/rbac';
import { revalidateMenu } from '@/lib/revalidate';

const schema = z.object({ ids: z.array(z.string()).min(1).max(200) });

export async function POST(req: Request) {
  try {
    const r = await requireOwnRestaurant();
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    // One round trip for the whole reorder, each write still tenant-scoped.
    await Category.bulkWrite(
      parsed.data.ids.map((id, index) => ({
        updateOne: {
          filter: { _id: id, restaurantId: r._id },
          update: { $set: { sortOrder: (index + 1) * 10 } },
        },
      }))
    );

    revalidateMenu(r.slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
