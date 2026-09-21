import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdSlot } from '@/components/ads/AdSlot';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MenuQR';

export type LandingExample = { name: string; slug: string; city?: string };

/**
 * Shared body for every `/digital-menu/*` and `/qr-menu/*` page, so a new URL family
 * is a route file plus a CMS entry, and the SEO furniture stays identical across them.
 */
export function LandingPage({
  h1,
  excerpt,
  html,
  canonical,
  crumb,
  examples,
  sibling,
}: {
  h1: string;
  excerpt?: string;
  html: string;
  canonical: string;
  crumb: string;
  examples: LandingExample[];
  sibling?: { href: string; label: string };
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: h1,
          description: excerpt,
          url: canonical,
          publisher: { '@type': 'Organization', name: siteName },
        }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <Link href="/" className="hover:text-orange-700">Home</Link>
        <span className="mx-1.5">/</span>
        <span>{crumb}</span>
      </nav>

      <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
        {h1}
      </h1>
      {excerpt ? <p className="mt-3 text-base leading-relaxed text-slate-600">{excerpt}</p> : null}

      <div className="mt-6">
        <Link
          href="/register"
          className="inline-block rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Create your menu free
        </Link>
      </div>

      <article className="prose-mq mt-8" dangerouslySetInnerHTML={{ __html: html }} />

      <AdSlot slot="landing-mid" />

      {examples.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">Live menus built here</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {examples.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/menu/${e.slug}`}
                  className="block rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-orange-300"
                >
                  <span className="font-medium text-slate-900">{e.name}</span>
                  {e.city ? <span className="text-slate-500"> — {e.city}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {sibling ? (
        <p className="mt-10 text-sm text-slate-600">
          Also read:{' '}
          <Link href={sibling.href} className="font-medium text-orange-700 hover:underline">
            {sibling.label}
          </Link>
        </p>
      ) : null}
    </main>
  );
}
