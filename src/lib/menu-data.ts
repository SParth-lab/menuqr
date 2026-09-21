import { unstable_cache } from 'next/cache';
import { connectDB } from '@/lib/db';
import { Category, MenuItem, Restaurant } from '@/models';
import type { PublicCategory, PublicRestaurant } from '@/templates/types';

export type MenuPayload = {
  restaurant: PublicRestaurant;
  categories: PublicCategory[];
  design: { templateKey: string; isCustom: boolean; config: Record<string, unknown> };
  itemCount: number;
};

export function menuTag(slug: string) {
  return `menu:${slug}`;
}

async function loadMenu(slug: string): Promise<MenuPayload | null> {
  await connectDB();

  const r = await Restaurant.findOne({ slug, status: 'APPROVED' }).lean();
  if (!r) return null;

  const [cats, items] = await Promise.all([
    Category.find({ restaurantId: r._id, isVisible: true }).sort({ sortOrder: 1 }).lean(),
    MenuItem.find({ restaurantId: r._id, isVisible: true }).sort({ sortOrder: 1 }).lean(),
  ]);

  const byCategory = new Map<string, PublicCategory>();
  for (const c of cats) {
    byCategory.set(c._id.toString(), {
      id: c._id.toString(),
      name: c.name,
      description: c.description,
      items: [],
    });
  }

  for (const i of items) {
    const bucket = byCategory.get(i.categoryId.toString());
    if (!bucket) continue; // item in a hidden category
    bucket.items.push({
      id: i._id.toString(),
      name: i.name,
      description: i.description,
      price: i.price,
      imageUrl: i.imageUrl,
      isVeg: i.isVeg,
      isSpicy: i.isSpicy,
      isAvailable: i.isAvailable,
    });
  }

  const categories = Array.from(byCategory.values()).filter((c) => c.items.length > 0);

  return {
    restaurant: {
      id: r._id.toString(),
      name: r.name,
      slug: r.slug,
      tagline: r.tagline,
      description: r.description,
      logoUrl: r.logoUrl,
      coverUrl: r.coverUrl,
      address: r.address,
      city: r.city,
      phone: r.phone,
      email: r.email,
      currency: r.currency || 'INR',
      openingHours: r.openingHours,
      socials: r.socials ?? {},
    },
    categories,
    design: {
      templateKey: r.design?.templateKey ?? 'modern',
      isCustom: r.design?.isCustom ?? false,
      config: (r.design?.config ?? {}) as Record<string, unknown>,
    },
    itemCount: categories.reduce((n, c) => n + c.items.length, 0),
  };
}

/**
 * The cost model of this product lives here. A menu scanned 10,000 times hits the
 * CDN 10,000 times and the database zero — the cache is only rebuilt when the owner
 * saves a change and the route revalidates `menu:<slug>`.
 */
export function getMenu(slug: string) {
  return unstable_cache(() => loadMenu(slug), ['menu', slug], {
    tags: [menuTag(slug)],
    revalidate: 3600,
  })();
}
