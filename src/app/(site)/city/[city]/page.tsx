import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Restaurant } from '@/models';
import { findVenues } from '@/lib/discovery';
import { VenueCard } from '@/components/site/VenueCard';
import { DiscoveryFilters } from '@/components/site/DiscoveryFilters';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdSlot } from '@/components/ads/AdSlot';
import { EmptyState } from '@/components/ui';

export const revalidate = 1800;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const MIN_VENUES_TO_INDEX = 3;

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

async function cityName(citySlug: string) {
  await connectDB();
  const one = await Restaurant.findOne({ citySlug, status: 'APPROVED' }).select('city').lean();
  return one?.city ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const name = await cityName(city);
  if (!name) return { title: 'Not found', robots: { index: false, follow: false } };

  const { total } = await findVenues({ citySlug: city });
  const title = `Restaurant & Cafe Menus in ${name}`;
  const description = `Browse digital menus with dish-level prices from ${total} restaurants and cafés in ${name}. Thali houses, Surti street food, cafés and grills.`;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/city/${city}` },
    robots:
      total >= MIN_VENUES_TO_INDEX ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title, description, url: `${siteUrl}/city/${city}` },
  };
}

export default async function CityPage({ params, searchParams }: Props) {
  const { city } = await params;
  const sp = await searchParams;

  const name = await cityName(city);
  if (!name) notFound();

  const { venues, total, cuisines, tags } = await findVenues({
    citySlug: city,
    cuisineSlug: sp.cuisine,
    tag: sp.tag,
    price: sp.price,
    sort: sp.sort,
  });

  const filtered = Boolean(sp.cuisine || sp.tag || sp.price);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:pb-10 sm:pt-12">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Restaurant and cafe menus in ${name}`,
          numberOfItems: venues.length,
          itemListElement: venues.map((v, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${siteUrl}/menu/${v.slug}`,
            name: v.name,
          })),
        }}
      />

      <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.2em] text-[var(--faint)]">
        <Link href="/" className="hover:text-[var(--brass-lift)]">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--muted)]">{name}</span>
      </nav>

      <header className="mt-5 max-w-3xl">
        <p className="eyebrow rise text-[var(--brass)]">{total} venues · live menus</p>
        <h1 className="display rise mt-4 text-[length:var(--t-h1)] leading-[0.95]">
          Every menu in <span className="foil">{name}</span>, priced.
        </h1>
        <p className="rise mt-5 text-[14px] leading-relaxed text-[var(--ink-soft)]" style={{ animationDelay: '0.12s' }}>
          Thali houses, farsan counters, cafés that stay open past midnight and the winter
          undhiyu run. Every listing opens the venue&rsquo;s real menu with dish-level prices —
          no ordering, no login, no app.
        </p>
      </header>

      <section className="glass mt-6 sm:mt-10 rounded-3xl p-4 sm:p-6" aria-label="Filters">
        <div className="relative z-[2]">
          <DiscoveryFilters cuisines={cuisines} tags={tags} />
        </div>
      </section>

      <div className="mt-8 flex items-baseline justify-between gap-4">
        <h2 className="display text-lg">
          {filtered ? `${venues.length} match` : `${venues.length} venues`}
        </h2>
        {filtered ? (
          <Link
            href={`/city/${city}`}
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brass-lift)] hover:text-[var(--ink)]"
          >
            Show all {total}
          </Link>
        ) : null}
      </div>

      {venues.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nothing matches those filters"
            body="No venue in this city fits every filter at once. Clearing the price band usually opens it up."
            action={
              <Link
                href={`/city/${city}`}
                className="inline-flex h-11 items-center rounded-full bg-[var(--claret)] px-6 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ink)] hover:bg-[var(--claret-lift)]"
              >
                Clear filters
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v, i) => (
            <li key={v.slug} className="rise" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
              <VenueCard venue={v} priority={i < 3} />
            </li>
          ))}
        </ul>
      )}

      <AdSlot slot="city-bottom" />

      <section className="glass mt-6 sm:mt-10 rounded sm:mt-14-3xl p-5 sm:p-8">
        <div className="relative z-[2]">
          <h2 className="display text-base">Browse {name} by cuisine</h2>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {cuisines.map((c) => (
              <li key={c.value}>
                <Link
                  href={`/cuisine/${c.value}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.13)] px-4 py-2.5 text-[13px] text-[var(--ink-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brass)] hover:text-[var(--ink)]"
                >
                  {c.label}
                  <span className="text-[10px] text-[var(--faint)]">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
