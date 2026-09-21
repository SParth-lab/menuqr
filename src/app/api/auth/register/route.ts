import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import mongoose from 'mongoose';
import { connectDB, supportsTransactions } from '@/lib/db';
import { Restaurant, User } from '@/models';
import { uniqueRestaurantSlug } from '@/lib/slug';
import { DEFAULT_TEMPLATE_KEY } from '@/templates/registry';
import { errorResponse } from '@/lib/rbac';
import { slugify } from '@/lib/slug';

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  restaurantName: z.string().min(2).max(80),
  city: z.string().max(60).optional(),
  phone: z.string().max(30).optional(),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }
    const { name, email, password, restaurantName, city, phone } = parsed.data;

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() }).select('_id').lean();
    if (existing) {
      return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const slug = await uniqueRestaurantSlug(restaurantName);

    const restaurantDoc = {
      name: restaurantName,
      slug,
      city,
      citySlug: city ? slugify(city) : undefined,
      phone,
      status: 'PENDING' as const,
      design: { templateKey: DEFAULT_TEMPLATE_KEY, isCustom: false, config: {} },
    };

    // Atlas is a replica set, so the pair is atomic there. On a standalone dev
    // server transactions are unavailable, so the orphan user is cleaned up by hand.
    if (await supportsTransactions()) {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const [user] = await User.create([{ name, email, passwordHash, role: 'RESTAURANT_OWNER' }], { session });
          await Restaurant.create([{ ...restaurantDoc, ownerId: user._id }], { session });
        });
      } finally {
        await session.endSession();
      }
    } else {
      const user = await User.create({ name, email, passwordHash, role: 'RESTAURANT_OWNER' });
      try {
        await Restaurant.create({ ...restaurantDoc, ownerId: user._id });
      } catch (err) {
        await User.deleteOne({ _id: user._id });
        throw err;
      }
    }

    return NextResponse.json(
      { ok: true, slug, message: 'Account created. Your restaurant is pending approval.' },
      { status: 201 }
    );
  } catch (err) {
    return errorResponse(err);
  }
}
