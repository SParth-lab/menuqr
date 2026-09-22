import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Post, Restaurant } from '@/models';
import { findVenues } from '@/lib/discovery';
import { listTemplates } from '@/templates/registry';
import { VenueCard } from '@/components/site/VenueCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdSlot } from '@/components/ads/AdSlot';

export const revalidate = 1800;

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'QR4Menu';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  /* absolute: the root layout's `%s | QR4Menu` template would otherwise stamp
     the brand on a title that already carries it. */
  title: { absolute: `${siteName} — Digital QR Menus for Restaurants & Cafes` },
  description:
    'Browse real menus from restaurants and cafés in Surat, or build your own digital menu and print one QR code for the table. No app, no guest account.',
  alternates: { canonical: siteUrl },
};

const STEPS = [
  ['Set the menu', 'Categories and dishes with prices, the vegetarian mark, and what is off tonight.'],
  ['Set the card', 'Pick a design and move the accent. Paper, ink and display face follow together.'],
  ['Print the code', 'One QR, as PNG or vector. It never changes when the menu does.'],
];

export default async function HomePage() {
  await connectDB();

  const [{ venues, total, cuisines }, guides, templateCount, dishCount] = await Promise.all([
    findVenues({ citySlug: 'surat', sort: 'featured', limit: 6 }),
    Post.find({ status: 'PUBLISHED', type: { $in: ['BLOG', 'GUIDE'] } })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('slug title excerpt coverUrl readMinutes')
      .lean(),
    Promise.resolve(listTemplates().length),
    Restaurant.aggregate([
      { $match: { status: 'APPROVED' } },
      { $lookup: { from: 'menuitems', localField: '_id', foreignField: 'restaurantId', as: 'i' } },
      { $group: { _id: null, n: { $sum: { $size: '$i' } } } },
    ]),
  ]);

  const dishes = dishCount[0]?.n ?? 0;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: siteUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/city/surat?cuisine={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      {/* ---------------------------------------------------------- hero */}
      <section className="mx-auto max-w-6xl px-4 pb-6 pt-16">
        <p className="eyebrow rise text-[var(--brass)]">Surat · {total} live menus</p>

        <h1 className="display rise mt-6 max-w-4xl text-[clamp(2.25rem,4.6vw,3.5rem)] leading-[0.92]">
          Every menu in the city,
          <span className="foil block italic">priced and current.</span>
        </h1>

        <p
          className="rise mt-7 max-w-xl text-[13.5px] leading-[1.75] text-[var(--ink-soft)]"
          style={{ animationDelay: '0.14s' }}
        >
          Browse real menus from {total} restaurants and cafés across Surat, with dish-level
          prices and what is off tonight. Or put your own menu behind a printed code and
          change it from the pass.
        </p>

        <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '0.26s' }}>
          <Link
            href="/city/surat"
            className="inline-flex h-13 items-center rounded-full bg-[var(--claret)] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--claret-lift)]"
          >
            Browse Surat
          </Link>
          <Link
            href="/register"
            className="glass glass-lift inline-flex items-center rounded-full px-8 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]"
          >
            <span className="relative z-[2]">List your venue</span>
          </Link>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.08)] sm:grid-cols-4">
          {[
            [String(total), 'Venues listed'],
            [dishes.toLocaleString('en-IN'), 'Dishes priced'],
            [String(cuisines.length), 'Cuisines'],
            [String(templateCount), 'Menu designs'],
          ].map(([value, label], i) => (
            <div
              key={label}
              className="glass rise rounded-none p-6"
              style={{ animationDelay: `${0.36 + i * 0.08}s` }}
            >
              <dt className="display foil relative z-[2] text-[28px] leading-none tabular-nums">
                {value}
              </dt>
              <dd className="relative z-[2] mt-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ------------------------------------------------------ venues */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-[clamp(1.45rem,2.6vw,1.9rem)] leading-tight">
              Where Surat is eating
            </h2>
            <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-[var(--muted)]">
              Thali houses, farsan counters and the cafés that stay open past midnight.
            </p>
          </div>
          <Link
            href="/city/surat"
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brass-lift)] transition-colors hover:text-[var(--ink)]"
          >
            All {total} venues →
          </Link>
        </div>

        <ul className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v, i) => (
            <li key={v.slug} className="rise" style={{ animationDelay: `${Math.min(i, 6) * 0.06}s` }}>
              <VenueCard venue={v} priority={i < 3} />
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------- cuisines */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="display text-[clamp(1.45rem,2.6vw,1.9rem)] leading-tight">By cuisine</h2>
        <ul className="mt-7 flex flex-wrap gap-3">
          {cuisines.map((c) => (
            <li key={c.value}>
              <Link
                href={`/cuisine/${c.value}`}
                className="glass glass-lift inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-[13px] text-[var(--ink-soft)] hover:text-[var(--ink)]"
              >
                <span className="relative z-[2]">{c.label}</span>
                <span className="relative z-[2] text-[10px] text-[var(--faint)]">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot slot="home-mid" className="mx-auto max-w-6xl px-4" />

      {/* ------------------------------------------------------- steps */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="display text-[clamp(1.45rem,2.6vw,1.9rem)] leading-tight">
          Three steps to a live card.
        </h2>
        <ol className="mt-9 grid gap-6 sm:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="glass glass-lift rounded-[20px] p-7">
              <span className="display relative z-[2] block text-[32px] leading-none text-[var(--brass)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="relative z-[2] mt-6 text-[14px] font-semibold">{title}</h3>
              <p className="relative z-[2] mt-2.5 text-[13.5px] leading-relaxed text-[var(--muted)]">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------ guides */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[clamp(1.45rem,2.6vw,1.9rem)] leading-tight">From the guides</h2>
          <Link
            href="/blog"
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brass-lift)] hover:text-[var(--ink)]"
          >
            All guides →
          </Link>
        </div>

        <ul className="mt-9 grid gap-6 sm:grid-cols-3">
          {guides.map((g) => (
            <li key={g.slug}>
              <article className="glass glass-lift group h-full overflow-hidden rounded-[20px]">
                <Link href={`/blog/${g.slug}`} className="flex h-full flex-col">
                  {g.coverUrl ? (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={g.coverUrl}
                        alt=""
                        fill
                        sizes="360px"
                        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,6,10,0.7)] to-transparent" />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="display text-[14px] leading-snug transition-colors group-hover:text-[var(--brass-lift)]">
                      {g.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--muted)]">
                      {g.excerpt}
                    </p>
                    <p className="mt-auto pt-4 text-[10px] uppercase tracking-[0.14em] text-[var(--faint)]">
                      {g.readMinutes ?? 5} min read
                    </p>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------------- close */}
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-10">
        <div className="glass sheen rounded-[28px] px-8 py-20 text-center">
          <div className="relative z-[2]">
            <h2 className="display foil mx-auto max-w-2xl text-[clamp(1.8rem,3.4vw,2.5rem)] leading-tight">
              Print it once. Change it forever.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[13px] leading-relaxed text-[var(--ink-soft)]">
              Set the menu, choose the card, print the code. Free to start, and your guests
              never install anything.
            </p>
            <Link
              href="/register"
              className="mt-9 inline-flex h-13 items-center rounded-full bg-[var(--claret)] px-9 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--claret-lift)]"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
