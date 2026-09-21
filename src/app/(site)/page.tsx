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
  title: `${siteName} — Free Digital QR Menu Maker for Restaurants & Cafes`,
  description:
    'Create a digital menu for your restaurant or cafe, choose from 10 designs, and download a QR code customers scan at the table. Guests need no app and no account.',
  alternates: { canonical: siteUrl },
};

const STEPS = [
  ['Create your menu', 'Add categories and items with prices, photos, and vegetarian or spice markers.'],
  ['Pick a design', 'Choose a template, then change colours, fonts and layout until it matches your brand.'],
  ['Print the QR code', 'Download it as PNG or SVG, put it on the table, and guests scan straight to your menu.'],
];

export default async function HomePage() {
  await connectDB();

  const [liveCount, recent] = await Promise.all([
    Restaurant.countDocuments({ status: 'APPROVED' }),
    Restaurant.find({ status: 'APPROVED' }).sort({ createdAt: -1 }).limit(6).select('name slug city tagline').lean(),
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
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        }}
      />

      <section className="mx-auto max-w-5xl px-4 pb-10 pt-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">
          Digital menu + QR code
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Your restaurant menu, on every table, in a scan
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          Build a mobile-first digital menu, style it to match your brand, and get a unique QR
          code for your venue. Change a price and every table sees it instantly. Your guests
          never install anything.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <LinkButton href="/register">Create your menu — free</LinkButton>
          <LinkButton href="/menu/spice-route-kitchen" variant="outline">
            See a live menu
          </LinkButton>
        </div>
        {liveCount > 0 ? (
          <p className="mt-4 text-xs text-slate-500">
            {liveCount} {liveCount === 1 ? 'venue is' : 'venues are'} already live
          </p>
        ) : null}
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-center text-2xl font-bold text-slate-900">Three steps to a live menu</h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="rounded-xl border border-slate-200 bg-white p-5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <AdSlot slot="home-mid" className="mx-auto max-w-5xl px-4" />

      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-2xl font-bold text-slate-900">{templates.length} menu designs</h2>
        <p className="mt-1 text-sm text-slate-600">
          Pick one and change anything — colours, fonts, corner radius, card style, layout.
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {templates.map((t) => (
            <li key={t.key} className="overflow-hidden rounded-xl border border-slate-200">
              <div
                className="flex h-24 flex-col justify-end p-3"
                style={{ background: t.defaultConfig.background }}
              >
                <span className="h-1.5 w-10 rounded-full" style={{ background: t.defaultConfig.primary }} />
                <span className="mt-1.5 h-1 w-14 rounded-full" style={{ background: t.defaultConfig.secondary }} />
              </div>
              <div className="border-t border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-[11px] text-slate-500">{t.category}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {recent.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h2 className="text-2xl font-bold text-slate-900">Recently published menus</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/menu/${r.slug}`}
                  className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-orange-300 hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                  {r.city ? <p className="text-xs text-slate-500">{r.city}</p> : null}
                  {r.tagline ? <p className="mt-1.5 line-clamp-2 text-xs text-slate-600">{r.tagline}</p> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Ready to put it on the table?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Set up your menu in a few minutes. Your QR code is generated automatically.
          </p>
          <div className="mt-6">
            <LinkButton href="/register">Get started free</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
