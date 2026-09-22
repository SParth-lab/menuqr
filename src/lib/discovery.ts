import { connectDB } from '@/lib/db';
import { MenuItem, Restaurant } from '@/models';
import type { VenueCardData } from '@/components/site/VenueCard';

export type DiscoveryQuery = {
  citySlug?: string;
  cuisineSlug?: string;
  tag?: string;
  price?: string;
  sort?: string;
  limit?: number;
};

const SORTS: Record<string, Record<string, 1 | -1>> = {
  featured: { isFeatured: -1, rating: -1 },
  rating: { rating: -1, reviewCount: -1 },
  name: { name: 1 },
};

export type DiscoveryResult = {
  venues: VenueCardData[];
  total: number;
  cuisines: { label: string; value: string; count: number }[];
  tags: { label: string; value: string }[];
};

/**
 * One query serves the city page, the cuisine pages and the home strip. Facet
 * counts are computed from the unfiltered city scope, so a filter never makes
 * the other filters look empty.
 */
export async function findVenues(q: DiscoveryQuery): Promise<DiscoveryResult> {
  await connectDB();

  const scope: Record<string, unknown> = { status: 'APPROVED' };
  if (q.citySlug) scope.citySlug = q.citySlug;

  const filter: Record<string, unknown> = { ...scope };
  if (q.cuisineSlug) filter.cuisineSlug = q.cuisineSlug;
  if (q.tag) filter.tags = q.tag;

  const price = Number(q.price);
  if (price >= 1 && price <= 4) filter.priceRange = price;

  const sort = SORTS[q.sort ?? 'featured'] ?? SORTS.featured;

  const [rows, total, facets] = await Promise.all([
    Restaurant.find(filter)
      .sort(sort)
      .limit(q.limit ?? 60)
      .select('name slug cuisine address tagline coverUrl rating reviewCount priceRange tags')
      .lean(),
    Restaurant.countDocuments(filter),
    Restaurant.aggregate([
      { $match: scope },
      { $group: { _id: { cuisine: '$cuisine', slug: '$cuisineSlug' }, n: { $sum: 1 } } },
      { $sort: { n: -1 } },
    ]),
  ]);

  const counts = await MenuItem.aggregate([
    { $match: { restaurantId: { $in: rows.map((r) => r._id) }, isVisible: true } },
    { $group: { _id: '$restaurantId', n: { $sum: 1 } } },
  ]);
  const itemsById = new Map(counts.map((c) => [c._id.toString(), c.n as number]));

  /* Tag facets come from the venues actually in scope, so a filter never offers
     a chip that would return nothing. */
  const tagSet = new Map<string, number>();
  const scoped = await Restaurant.find(scope).select('tags').lean();
  for (const r of scoped) {
    for (const t of r.tags ?? []) tagSet.set(t, (tagSet.get(t) ?? 0) + 1);
  }

  return {
    total,
    venues: rows.map((r) => ({
      name: r.name,
      slug: r.slug,
      cuisine: r.cuisine,
      area: r.address?.replace(/,\s*Surat$/i, ''),
      tagline: r.tagline,
      coverUrl: r.coverUrl,
      rating: r.rating,
      reviewCount: r.reviewCount,
      priceRange: r.priceRange,
      tags: r.tags,
      itemCount: itemsById.get(r._id.toString()) ?? 0,
    })),
    cuisines: facets
      .filter((f) => f._id.cuisine && f._id.slug)
      .map((f) => ({ label: f._id.cuisine as string, value: f._id.slug as string, count: f.n as number })),
    tags: Array.from(tagSet.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([t]) => ({ label: t, value: t })),
  };
}
