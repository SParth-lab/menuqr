import { NextResponse } from 'next/server';
import { z } from 'zod';
import { errorResponse, requireOwnRestaurant } from '@/lib/rbac';
import { slugify, uniqueRestaurantSlug } from '@/lib/slug';
import { revalidateMenu } from '@/lib/revalidate';
import { CURRENCIES } from '@/lib/format';

export async function GET() {
  try {
    const r = await requireOwnRestaurant();
    return NextResponse.json({ restaurant: r.toObject() });
  } catch (err) {
    return errorResponse(err);
  }
}

const url = z.string().url().or(z.literal(''));

const patchSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  tagline: z.string().max(140).optional(),
  description: z.string().max(2000).optional(),
  logoUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  address: z.string().max(240).optional(),
  city: z.string().max(60).optional(),
  state: z.string().max(60).optional(),
  country: z.string().max(60).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().or(z.literal('')).optional(),
  currency: z.enum(CURRENCIES as [string, ...string[]]).optional(),
  openingHours: z.string().max(240).optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
  socials: z
    .object({
      website: url.optional(),
      instagram: url.optional(),
      facebook: url.optional(),
      twitter: url.optional(),
      youtube: url.optional(),
      whatsapp: z.string().max(60).optional(),
    })
    .optional(),
});

export async function PATCH(req: Request) {
  try {
    const restaurant = await requireOwnRestaurant();
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 });
    }

    const data = parsed.data;
    const previousSlug = restaurant.slug;

    // Renaming moves the public URL, so the old cache entry must be dropped too.
    if (data.name && data.name !== restaurant.name) {
      restaurant.slug = await uniqueRestaurantSlug(data.name, restaurant._id.toString());
    }
    if (data.city !== undefined) {
      restaurant.citySlug = data.city ? slugify(data.city) : undefined;
    }

    Object.assign(restaurant, data, {
      socials: { ...(restaurant.socials ?? {}), ...(data.socials ?? {}) },
    });

    await restaurant.save();

    revalidateMenu(previousSlug);
    if (restaurant.slug !== previousSlug) revalidateMenu(restaurant.slug);

    return NextResponse.json({ ok: true, restaurant: restaurant.toObject() });
  } catch (err) {
    return errorResponse(err);
  }
}
