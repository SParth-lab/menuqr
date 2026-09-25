import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Post, Restaurant } from '@/models';
import { findVenues } from '@/lib/discovery';
import { listTemplates } from '@/templates/registry';
import { VenueCard } from '@/components/site/VenueCard';
import { LinkButton } from '@/components/ui';
import { Logo } from '@/components/brand/Logo';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdSlot } from '@/components/ads/AdSlot';

export const revalidate = 1800;

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'QR4Blueprint';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  /* absolute: the root layout's `%s | QR4Blueprint` template would otherwise stamp
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
      <section className="relative">
        <div className="orbfield" aria-hidden="true" />

        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-10 pt-12 sm:px-6 sm:pb-16 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow rise">Surat · {total} live menus</p>

            <h1 className="display rise t-hero mt-5 max-w-2xl">
              Every menu in the city,{' '}
              <span className="foil">priced and current.</span>
            </h1>

            <p
              className="rise mt-6 max-w-xl text-[16px] leading-[1.75] text-[var(--ink-soft)]"
              style={{ animationDelay: '0.08s' }}
            >
              Browse real menus from {total} restaurants and cafés across Surat, with
              dish-level prices and what is off tonight. Or put your own menu behind a
              printed code and change it from the pass.
            </p>

            <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '0.16s' }}>
              <LinkButton href="/city/surat" size="lg">
                Browse Surat
              </LinkButton>
              <LinkButton href="/register" variant="secondary" size="lg">
                List your venue
              </LinkButton>
            </div>

            <dl className="rise mt-12 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4" style={{ animationDelay: '0.24s' }}>
              {[
                [String(total), 'Venues listed'],
                [dishes.toLocaleString('en-IN'), 'Dishes priced'],
                [String(cuisines.length), 'Cuisines'],
                [String(templateCount), 'Menu designs'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="display text-[26px] leading-none tabular-nums text-[var(--claret)]">
                    {value}
                  </dt>
                  <dd className="mt-2 text-[12px] font-medium text-[var(--muted)]">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The product, shown rather than described. */}
          <div className="rise relative hidden lg:block" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-6 rounded-[28px] bg-[linear-gradient(150deg,var(--pane-hi),transparent_60%)]" />

            <div className="glass relative mx-auto w-[300px] rounded-[26px] p-5 shadow-[var(--shadow-lg)]">
              <div className="border-b border-[var(--line)] pb-4 text-center">
                <p className="display text-[19px] text-[var(--ink)]">Tamarind &amp; Rye</p>
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Modern Indian Bakery
                </p>
              </div>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--claret)]">
                Small Plates
              </p>

              <ul className="mt-3 space-y-3.5">
                {[
                  ['Kejriwal Toast', '280', true],
                  ['Lamb Kheema Pav', '460', false],
                  ['Rose Cardamom Latte', '180', true],
                ].map(([name, price, veg]) => (
                  <li key={name as string} className="flex items-baseline gap-2">
                    <span
                      className="inline-flex h-2.5 w-2.5 shrink-0 items-center justify-center self-center rounded-[2px] border"
                      style={{ borderColor: veg ? '#067647' : '#b42318' }}
                      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
                    >
                      <span
                        className="h-1 w-1 rounded-full"
                        style={{ background: veg ? '#067647' : '#b42318' }}
                      />
                    </span>
                    <span className="text-[13px] font-medium text-[var(--ink)]">{name}</span>
                    <span aria-hidden="true" className="-translate-y-1 flex-1 border-b border-dotted border-[var(--line-hi)]" />
                    <span className="text-[13px] font-semibold tabular-nums text-[var(--ink)]">
                      ₹{price}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-3 rounded-xl bg-[var(--pane)] p-3">
                <span className="scanner flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--ground)] ring-1 ring-[var(--line)]">
                  <Logo variant="mark" size={22} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-[var(--ink)]">One printed code</p>
                  <p className="truncate text-[11px] text-[var(--muted)]">
                    qr4blueprint.app/menu/tamarind-and-rye
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ venues */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-[length:var(--t-h2)] leading-tight">
              Where Surat is eating
            </h2>
            <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-[var(--muted)]">
              Thali houses, farsan counters and the cafés that stay open past midnight.
            </p>
          </div>
          <Link
            href="/city/surat"
            className="text-[13px] font-semibold text-[var(--claret)] transition-colors hover:text-[var(--ink)]"
          >
            All {total} venues →
          </Link>
        </div>

        <ul className="mt-6 sm:mt-9 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((v, i) => (
            <li key={v.slug} className="rise" style={{ animationDelay: `${Math.min(i, 6) * 0.06}s` }}>
              <VenueCard venue={v} priority={i < 3} />
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------- cuisines */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <h2 className="display text-[length:var(--t-h2)] leading-tight">By cuisine</h2>
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
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="display text-[length:var(--t-h2)] leading-tight">
          Three steps to a live card.
        </h2>
        <ol className="mt-6 sm:mt-9 grid gap-6 sm:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="glass glass-lift rounded-2xl p-5 sm:p-7">
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
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="display text-[length:var(--t-h2)] leading-tight">From the guides</h2>
          <Link
            href="/blog"
            className="text-[13px] font-semibold text-[var(--claret)] hover:text-[var(--ink)]"
          >
            All guides →
          </Link>
        </div>

        <ul className="mt-6 sm:mt-9 grid gap-6 sm:grid-cols-3">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,31,58,0.68)] to-transparent" />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="display text-[14px] leading-snug transition-colors group-hover:text-[var(--brass-lift)]">
                      {g.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--muted)]">
                      {g.excerpt}
                    </p>
                    <p className="mt-auto pt-4 text-[12px] text-[var(--faint)]">
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
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-10 sm:px-6">
        <div className="glass sheen rounded-[28px] px-5 py-12 sm:px-8 sm:py-20 text-center">
          <div className="relative z-[2]">
            <h2 className="display foil mx-auto max-w-2xl text-[length:var(--t-h1)] leading-tight">
              Print it once. Change it forever.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[13px] leading-relaxed text-[var(--ink-soft)]">
              Set the menu, choose the card, print the code. Free to start, and your guests
              never install anything.
            </p>
            <Link
              href="/register"
              className="mt-6 sm:mt-9 inline-flex h-13 items-center rounded-full bg-[var(--claret)] px-9 py-4 text-[13px] font-semibold text-[var(--ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--claret-lift)]"
            >
              Get started
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
