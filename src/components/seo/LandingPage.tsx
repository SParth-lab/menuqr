import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdSlot } from '@/components/ads/AdSlot';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'QR4Blueprint';

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

      <nav aria-label="Breadcrumb" className="text-xs text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--brass-lift)]">Home</Link>
        <span className="mx-1.5">/</span>
        <span>{crumb}</span>
      </nav>

      <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[var(--ink)]">
        {h1}
      </h1>
      {excerpt ? <p className="mt-3 text-base leading-relaxed text-[var(--ink-soft)]">{excerpt}</p> : null}

      <div className="mt-6">
        <Link
          href="/register"
          className="inline-block rounded-lg bg-[var(--claret)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--claret-lift)]"
        >
          Create your menu free
        </Link>
      </div>

      <article className="prose-mq mt-8" dangerouslySetInnerHTML={{ __html: html }} />

      <AdSlot slot="landing-mid" />

      {examples.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-[var(--ink)]">Live menus built here</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {examples.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/menu/${e.slug}`}
                  className="block rounded-lg border border-[var(--line)] px-3 py-2 text-sm hover:border-orange-300"
                >
                  <span className="font-medium text-[var(--ink)]">{e.name}</span>
                  {e.city ? <span className="text-[var(--muted)]"> — {e.city}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {sibling ? (
        <p className="mt-10 text-sm text-[var(--ink-soft)]">
          Also read:{' '}
          <Link href={sibling.href} className="font-medium text-[var(--brass-lift)] hover:underline">
            {sibling.label}
          </Link>
        </p>
      ) : null}
    </main>
  );
}
