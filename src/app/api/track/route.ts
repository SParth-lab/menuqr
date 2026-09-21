import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { DailyStat, PageView } from '@/models';
import { todayKey } from '@/lib/format';
import { VIEW_SOURCES } from '@/types';

export const dynamic = 'force-dynamic';

const schema = z.object({
  restaurantId: z.string().regex(/^[a-f0-9]{24}$/i),
  source: z.enum(VIEW_SOURCES).default('DIRECT'),
  itemId: z.string().regex(/^[a-f0-9]{24}$/i).optional(),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    // Public endpoint: never explain a rejection, never retry, never 500 the beacon.
    if (!parsed.success) return new NextResponse(null, { status: 204 });

    const { restaurantId, source, itemId } = parsed.data;
    const day = todayKey();

    await connectDB();
    await Promise.all([
      PageView.create({ restaurantId, day, source, itemId }),
      DailyStat.updateOne(
        { restaurantId, day },
        { $inc: { views: 1, qrScans: source === 'QR' ? 1 : 0 } },
        { upsert: true }
      ),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch {
    // Analytics must never surface an error to a diner's browser.
    return new NextResponse(null, { status: 204 });
  }
}
