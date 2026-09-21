import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { MenuItem, Restaurant } from '@/models';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdSlot } from '@/components/ads/AdSlot';

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/** Below this a city page is a near-empty list, which is exactly what thin content means. */
const MIN_VENUES_TO_INDEX = 3;

type Props = { params: Promise<{ city: string }> };

async function getCity(citySlug: string) {
  await connectDB();
  const restaurants = await Restaurant.find({ citySlug, status: 'APPROVED' })
    .sort({ name: 1 })
    .select('name slug city tagline description logoUrl')
    .lean();
  return restaurants;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const restaurants = await getCity(city);
  if (restaurants.length === 0) return { title: 'Not found', robots: { index: false, follow: false } };

  const cityName = restaurants[0].city ?? city;
  const title = `Restaurant & Cafe Menus in ${cityName}`;
  const description = `Browse digital menus with current prices from ${restaurants.length} ${restaurants.length === 1 ? 'venue' : 'venues'} in ${cityName}.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/city/${city}` },
    robots:
      restaurants.length >= MIN_VENUES_TO_INDEX
        ? { index: true, follow: true }
        : { index: false, follow: true },
    openGraph: { title, description, url: `${siteUrl}/city/${city}` },
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const restaurants = await getCity(city);
  if (restaurants.length === 0) notFound();

  const cityName = restaurants[0].city ?? city;
  const itemCounts = await MenuItem.aggregate([
    { $match: { restaurantId: { $in: restaurants.map((r) => r._id) }, isVisible: true } },
    { $group: { _id: '$restaurantId', n: { $sum: 1 } } },
  ]);
  const countById = new Map(itemCounts.map((c) => [c._id.toString(), c.n as number]));

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Restaurant and cafe menus in ${cityName}`,
          numberOfItems: restaurants.length,
          itemListElement: restaurants.map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${siteUrl}/menu/${r.slug}`,
            name: r.name,
          })),
        }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <Link href="/" className="hover:text-orange-700">Home</Link>
        <span className="mx-1.5">/</span>
        <span>{cityName}</span>
      </nav>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
        Restaurant and cafe menus in {cityName}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {restaurants.length} {restaurants.length === 1 ? 'venue publishes its' : 'venues publish their'}{' '}
        menu here, with current prices and dish descriptions. Tap any venue to open its full menu.
      </p>

      <AdSlot slot="city-top" />

      <ul className="mt-8 divide-y divide-slate-200">
        {restaurants.map((r) => (
          <li key={r.slug} className="py-4">
            <Link href={`/menu/${r.slug}`} className="group block">
              <h2 className="text-base font-bold text-slate-900 group-hover:text-orange-700">
                {r.name}
              </h2>
              {r.tagline || r.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                  {r.tagline || r.description}
                </p>
              ) : null}
              <p className="mt-1.5 text-xs text-slate-500">
                {countById.get(r._id.toString()) ?? 0} items on the menu
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
