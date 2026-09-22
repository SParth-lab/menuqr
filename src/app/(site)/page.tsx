import type { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Restaurant } from '@/models';
import { listTemplates } from '@/templates/registry';
import { JsonLd } from '@/components/seo/JsonLd';
import { LinkButton } from '@/components/ui';
import { AdSlot } from '@/components/ads/AdSlot';

export const revalidate = 3600;

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MenuQR';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: `${siteName} — Digital QR Menus for Restaurants & Cafes`,
  description:
    'Build a digital menu set as a printed card, choose from ten designs, and print one QR code for the table. Change a price and every table sees it. No app for guests.',
  alternates: { canonical: siteUrl },
};

const STEPS = [
  ['Set the menu', 'Categories and dishes with prices, the vegetarian mark, and what is off tonight.'],
  ['Set the card', 'Pick a design, move the accent. Paper, ink and display face follow together.'],
  ['Print the code', 'One QR, downloaded as PNG or vector. It never changes when the menu does.'],
];

export default async function HomePage() {
  await connectDB();

  const [liveCount, recent] = await Promise.all([
    Restaurant.countDocuments({ status: 'APPROVED' }),
    Restaurant.find({ status: 'APPROVED' })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('name slug city tagline')
      .lean(),
  ]);

  const templates = listTemplates();

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: siteName,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url: siteUrl,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        }}
      />

      {/* ------------------------------------------------ hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center">
        <div>
          <p className="eyebrow rise text-[var(--brass)]" style={{ animationDelay: '0.05s' }}>
            Digital menus &middot; No. 01
          </p>

          <h1 className="display mt-6 text-[clamp(3rem,7vw,5.8rem)] leading-[0.93]">
            <span className="rise block" style={{ animationDelay: '0.18s' }}>
              Print it once.
            </span>
            <span className="foil rise block italic" style={{ animationDelay: '0.34s' }}>
              Change it forever.
            </span>
          </h1>

          <span
            className="rise mt-7 block h-px w-32 bg-gradient-to-r from-[var(--brass)] to-transparent"
            style={{ animationDelay: '0.5s' }}
          />

          <p
            className="rise mt-7 max-w-lg text-[17px] leading-[1.75] text-[var(--ink-soft)]"
            style={{ animationDelay: '0.58s' }}
          >
            Your menu lives at one address behind one printed code. Take the fish off at
            seven, raise the paneer on Monday, and every table sees it before the next
            order is taken.
          </p>

          <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '0.7s' }}>
            <LinkButton href="/register">Build your menu</LinkButton>
            <LinkButton href="/menu/spice-route-kitchen" variant="outline">
              See a live menu
            </LinkButton>
          </div>

          <dl className="mt-14 flex flex-wrap border-t border-[var(--rule)]">
            {[
              ['0.4s', 'First paint on 4G'],
              [String(templates.length), 'Menu designs'],
              ['0', 'Apps a guest installs'],
            ].map(([value, label], i) => (
              <div
                key={label}
                className="rise flex-1 border-[var(--rule)] py-6 pr-8 [&:not(:first-child)]:border-l [&:not(:first-child)]:pl-8"
                style={{ animationDelay: `${0.85 + i * 0.1}s` }}
              >
                <dt className="display foil text-[42px] leading-none tabular-nums">{value}</dt>
                <dd className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The artefact, on its dark stage. */}
        <div className="rake glow-wrap relative flex items-center justify-center bg-[radial-gradient(120%_80%_at_50%_10%,var(--plate-soft),var(--plate)_70%)] p-10">
          <div className="glow pointer-events-none absolute h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(176,138,60,0.24),transparent_70%)]" />

          <div className="trim drift relative w-full max-w-[290px] bg-[var(--bone)] p-6 shadow-[0_44px_88px_-46px_rgba(0,0,0,0.95)]">
            <div className="border-b border-[var(--rule)] pb-4 text-center">
              <span className="mx-auto mb-3 block h-px w-7 bg-[var(--brass)]" />
              <p className="display foil text-2xl leading-tight">Tamarind &amp; Rye</p>
              <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.26em] text-[var(--muted)]">
                Modern Indian Bakery
              </p>
            </div>

            <p className="mt-4 text-[8px] font-bold uppercase tracking-[0.26em] text-[var(--brass)]">
              Small Plates
            </p>

            <ul className="mt-3 space-y-3.5">
              {[
                ['Kejriwal Toast', '280', true],
                ['Lamb Kheema Pav', '460', false],
                ['Rose Cardamom Latte', '180', true],
              ].map(([name, price, veg], i) => (
                <li
                  key={name as string}
                  className="rise flex items-baseline gap-2"
                  style={{ animationDelay: `${1.1 + i * 0.16}s` }}
                >
                  <span
                    className="inline-flex h-2.5 w-2.5 shrink-0 items-center justify-center self-center border"
                    style={{ borderColor: veg ? '#4e9a51' : '#c0453c' }}
                    aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
                  >
                    <span
                      className="h-1 w-1 rounded-full"
                      style={{ background: veg ? '#4e9a51' : '#c0453c' }}
                    />
                  </span>
                  <span className="text-[13px] font-medium">{name}</span>
                  <span
                    aria-hidden="true"
                    className="-translate-y-1 flex-1 border-b border-dotted border-[#c2b69c]"
                  />
                  <span className="display text-[15px] tabular-nums">{price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ steps */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="display text-4xl">Three steps to a live card.</h2>
        <ol className="mt-10 grid gap-px border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="bg-[var(--paper)] p-7">
              <span className="display text-4xl leading-none text-[var(--brass)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <AdSlot slot="home-mid" className="mx-auto max-w-6xl px-5" />

      {/* ------------------------------------------------ designs */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-4xl">{templates.length} designs, all editable.</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--ink-soft)]">
              Each carries its own paper, ink and display face. Move the accent and the rest
              follows, so the card never falls out of register.
            </p>
          </div>
          <LinkButton href="/register" variant="outline" size="sm">
            Try them
          </LinkButton>
        </div>

        <ul className="mt-9 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {templates.map((t) => (
            <li
              key={t.key}
              className="group border border-[var(--rule)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c2b69c] hover:shadow-[0_20px_38px_-24px_rgba(11,10,9,0.5)]"
            >
              <div className="p-4" style={{ background: t.defaultConfig.background }}>
                <span className="block h-px w-6" style={{ background: t.defaultConfig.primary }} />
                <span
                  className="mt-3 block text-lg leading-none"
                  style={{ color: t.defaultConfig.text, fontFamily: 'var(--font-display)' }}
                >
                  Aa
                </span>
                <span
                  className="mt-3 block h-[3px] w-3/5"
                  style={{ background: t.defaultConfig.text, opacity: 0.75 }}
                />
                <span
                  className="mt-1.5 block h-[2px] w-2/5"
                  style={{ background: t.defaultConfig.muted }}
                />
              </div>
              <div className="border-t border-[var(--rule)] bg-[var(--paper)] p-3">
                <p className="text-[13px] font-semibold">{t.name}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  {t.category}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------ live menus */}
      {recent.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="display text-4xl">
            {liveCount === 1 ? 'One venue is live.' : `${liveCount} venues are live.`}
          </h2>
          <ul className="mt-8 grid gap-px border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r) => (
              <li key={r.slug} className="bg-[var(--paper)]">
                <Link
                  href={`/menu/${r.slug}`}
                  className="group block p-6 transition-colors hover:bg-[#f1ede3]"
                >
                  <p className="display text-xl transition-colors group-hover:text-[var(--claret)]">
                    {r.name}
                  </p>
                  {r.city ? (
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                      {r.city}
                    </p>
                  ) : null}
                  {r.tagline ? (
                    <p className="mt-3 line-clamp-2 text-sm text-[var(--ink-soft)]">{r.tagline}</p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ------------------------------------------------ close */}
      <section className="rake relative bg-[var(--ink)]">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h2 className="display foil text-[clamp(2.5rem,5vw,4rem)] leading-tight">
            Ready for the table?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#867e70]">
            Set the menu, choose the card, print the code. Free to start, and your guests
            never install anything.
          </p>
          <div className="mt-8 flex justify-center">
            <LinkButton href="/register">Get started</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
