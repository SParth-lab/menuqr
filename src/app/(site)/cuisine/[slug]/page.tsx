import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findVenues } from '@/lib/discovery';
import { VenueCard } from '@/components/site/VenueCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdSlot } from '@/components/ads/AdSlot';
import { CUISINE_BLURBS } from '@/lib/cuisines';

export const revalidate = 1800;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const MIN_VENUES_TO_INDEX = 3;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { venues, total } = await findVenues({ cuisineSlug: slug });
  if (total === 0) return { title: 'Not found', robots: { index: false, follow: false } };

  const label = venues[0]?.cuisine ?? slug;
  const title = `${label} Menus in Surat`;
  const description = `${total} ${label.toLowerCase()} venues in Surat with full menus and dish-level prices. ${CUISINE_BLURBS[slug] ?? ''}`.trim();

  return {
    title,
    description: description.slice(0, 158),
    alternates: { canonical: `${siteUrl}/cuisine/${slug}` },
    robots:
      total >= MIN_VENUES_TO_INDEX ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title, description, url: `${siteUrl}/cuisine/${slug}` },
  };
}

export default async function CuisinePage({ params }: Props) {
  const { slug } = await params;
  const { venues, total, cuisines } = await findVenues({ cuisineSlug: slug, sort: 'rating' });
  if (total === 0) notFound();

  const label = venues[0]?.cuisine ?? slug;
  const blurb = CUISINE_BLURBS[slug];
  const siblings = cuisines.filter((c) => c.value !== slug);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:pb-10 sm:pt-12">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${label} menus in Surat`,
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
        <Link href="/city/surat" className="hover:text-[var(--brass-lift)]">Surat</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--muted)]">{label}</span>
      </nav>

      <header className="mt-5 max-w-3xl">
        <p className="eyebrow rise text-[var(--brass)]">{total} venues in Surat</p>
        <h1 className="display foil rise mt-4 text-[length:var(--t-h1)] leading-[0.95]">
          {label}
        </h1>
        {blurb ? (
          <p className="rise mt-5 text-[14px] leading-relaxed text-[var(--ink-soft)]" style={{ animationDelay: '0.12s' }}>
            {blurb}
          </p>
        ) : null}
      </header>

      <ul className="mt-7 sm:mt-12 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((v, i) => (
          <li key={v.slug} className="rise" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
            <VenueCard venue={v} priority={i < 3} />
          </li>
        ))}
      </ul>

      <AdSlot slot="cuisine-bottom" />

      {siblings.length > 0 ? (
        <section className="glass mt-6 sm:mt-10 rounded sm:mt-14-3xl p-5 sm:p-8">
          <div className="relative z-[2]">
            <h2 className="display text-base">Other cuisines in Surat</h2>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {siblings.map((c) => (
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
      ) : null}
    </main>
  );
}
