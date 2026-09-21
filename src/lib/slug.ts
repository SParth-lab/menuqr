import { Restaurant } from '@/models';

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Words that would collide with real routes if a restaurant claimed them. */
const RESERVED = new Set([
  'admin', 'dashboard', 'api', 'login', 'register', 'blog', 'city',
  'menu', 'qr-menu', 'digital-menu', 'about', 'contact', 'pricing', 'sitemap', 'robots',
]);

/** Appends -2, -3 … until the slug is free. Excludes `ignoreId` so renames are idempotent. */
export async function uniqueRestaurantSlug(name: string, ignoreId?: string): Promise<string> {
  const base = slugify(name) || 'restaurant';
  let candidate = RESERVED.has(base) ? `${base}-menu` : base;
  let n = 1;

  for (;;) {
    const clash = await Restaurant.findOne({
      slug: candidate,
      ...(ignoreId ? { _id: { $ne: ignoreId } } : {}),
    })
      .select('_id')
      .lean();
    if (!clash) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}
