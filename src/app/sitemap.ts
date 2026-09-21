import type { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import { MenuItem, Post, Restaurant } from '@/models';

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/** Kept in step with the menu page's own noindex rule. */
const MIN_ITEMS_TO_INDEX = 5;
const MIN_VENUES_PER_CITY = 3;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const [approved, posts] = await Promise.all([
    Restaurant.find({ status: 'APPROVED' }).select('slug citySlug city updatedAt').lean(),
    Post.find({ status: 'PUBLISHED' }).select('slug type updatedAt').lean(),
  ]);

  // A menu with too few items is noindex on its own page; listing it here would
  // contradict that, so the same predicate decides both.
  const counts = await MenuItem.aggregate([
    { $match: { restaurantId: { $in: approved.map((r) => r._id) }, isVisible: true } },
    { $group: { _id: '$restaurantId', n: { $sum: 1 } } },
  ]);
  const countById = new Map(counts.map((c) => [c._id.toString(), c.n as number]));

  const indexable = approved.filter(
    (r) => (countById.get(r._id.toString()) ?? 0) >= MIN_ITEMS_TO_INDEX
  );

  const menuEntries: MetadataRoute.Sitemap = indexable.map((r) => ({
    url: `${siteUrl}/menu/${r.slug}`,
    lastModified: r.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const cityCounts = new Map<string, number>();
  for (const r of indexable) {
    if (!r.citySlug) continue;
    cityCounts.set(r.citySlug, (cityCounts.get(r.citySlug) ?? 0) + 1);
  }
  const cityEntries: MetadataRoute.Sitemap = Array.from(cityCounts.entries())
    .filter(([, n]) => n >= MIN_VENUES_PER_CITY)
    .map(([citySlug]) => ({
      url: `${siteUrl}/city/${citySlug}`,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => {
    const path =
      p.type === 'LANDING'
        ? `/${p.slug.replace(/^(digital-menu|qr-menu)-/, '$1/')}`
        : `/blog/${p.slug}`;
    return {
      url: `${siteUrl}${path}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    };
  });

  return [...staticEntries, ...menuEntries, ...cityEntries, ...postEntries];
}
