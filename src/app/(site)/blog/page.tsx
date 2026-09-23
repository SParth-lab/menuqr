import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Post } from '@/models';
import { AdSlot } from '@/components/ads/AdSlot';
import { EmptyState } from '@/components/ui';

export const revalidate = 1800;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Guides for restaurant and cafe owners',
  description:
    'Practical guides on digital menus, QR codes, menu design, pricing and food photography — written for people who run venues.',
  alternates: { canonical: `${siteUrl}/blog` },
};

type Props = { searchParams: Promise<{ tag?: string }> };

function dateLabel(d?: Date) {
  return d
    ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
}

export default async function BlogIndex({ searchParams }: Props) {
  const { tag } = await searchParams;
  await connectDB();

  const all = await Post.find({ status: 'PUBLISHED', type: { $in: ['BLOG', 'GUIDE'] } })
    .sort({ publishedAt: -1 })
    .select('slug title excerpt publishedAt coverUrl tags author readMinutes type')
    .lean();

  const tagCounts = new Map<string, number>();
  for (const p of all) for (const t of p.tags ?? []) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);

  const posts = tag ? all.filter((p) => (p.tags ?? []).includes(tag)) : all;
  const [lead, ...rest] = posts;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12">
      <header className="max-w-3xl">
        <p className="eyebrow rise text-[var(--brass)]">{all.length} guides</p>
        <h1 className="display rise mt-4 text-[length:var(--t-h1)] leading-[0.95]">
          Written for people who <span className="foil">run venues</span>.
        </h1>
        <p className="rise mt-5 text-[14px] leading-relaxed text-[var(--ink-soft)]" style={{ animationDelay: '0.12s' }}>
          Menu structure, pricing, photography, QR placement and the Surat food calendar.
          No listicles, no filler, and nothing written for a search engine to read first.
        </p>
      </header>

      {/* Tag filter — plain links, so a filtered view is shareable and crawlable. */}
      <nav aria-label="Filter by topic" className="no-scrollbar mt-6 sm:mt-9 flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/blog"
          className={`inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-xs transition-colors ${
            !tag
              ? 'border-[var(--brass)] bg-[var(--pane-hi)] text-[var(--ink)]'
              : 'border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)]'
          }`}
        >
          All
        </Link>
        {Array.from(tagCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([t, n]) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs transition-colors ${
                tag === t
                  ? 'border-[var(--brass)] bg-[var(--pane-hi)] text-[var(--ink)]'
                  : 'border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--line-hi)] hover:text-[var(--ink)]'
              }`}
            >
              {t}
              <span className="text-[10px] text-[var(--faint)]">{n}</span>
            </Link>
          ))}
      </nav>

      {posts.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No guides under that topic yet"
            body="Nothing is filed here so far. The full list has everything published to date."
            action={
              <Link
                href="/blog"
                className="inline-flex h-11 items-center rounded-full bg-[var(--claret)] px-6 text-[13px] font-semibold text-[var(--ink)] hover:bg-[var(--claret-lift)]"
              >
                All guides
              </Link>
            }
          />
        </div>
      ) : (
        <>
          {/* Lead story, given the width it deserves. */}
          <article className="glass glass-lift group mt-6 sm:mt-10 overflow-hidden rounded-[24px]">
            <Link href={`/blog/${lead.slug}`} className="grid gap-0 md:grid-cols-2">
              <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px]">
                {lead.coverUrl ? (
                  <Image
                    src={lead.coverUrl}
                    alt={lead.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 560px"
                    priority
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(11,31,58,0.5)]" />
              </div>

              <div className="relative z-[2] flex flex-col justify-center p-5 sm:p-8 lg:p-10">
                <p className="eyebrow text-[var(--brass)]">
                  {lead.type === 'GUIDE' ? 'Guide' : 'Essay'} · Latest
                </p>
                <h2 className="display mt-4 text-[length:var(--t-h2)] leading-tight">
                  {lead.title}
                </h2>
                <p className="mt-4 text-[13px] leading-relaxed text-[var(--ink-soft)]">
                  {lead.excerpt}
                </p>
                <p className="mt-6 text-[12px] text-[var(--faint)]">
                  {dateLabel(lead.publishedAt)} · {lead.readMinutes ?? 5} min read
                </p>
              </div>
            </Link>
          </article>

          <AdSlot slot="blog-index-mid" />

          <ul className="mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <li key={p.slug} className="rise" style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}>
                <article className="glass glass-lift group h-full overflow-hidden rounded-[20px]">
                  <Link href={`/blog/${p.slug}`} className="flex h-full flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {p.coverUrl ? (
                        <Image
                          src={p.coverUrl}
                          alt={p.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 360px"
                          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,31,58,0.72)] to-transparent" />
                      <span className="glass-dark absolute left-3 top-3 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em]">
                        {p.type === 'GUIDE' ? 'Guide' : 'Essay'}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="display text-[14px] leading-snug transition-colors group-hover:text-[var(--brass-lift)]">
                        {p.title}
                      </h2>
                      <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed text-[var(--muted)]">
                        {p.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4 text-[12px] text-[var(--faint)]">
                        <span>{dateLabel(p.publishedAt)}</span>
                        <span>{p.readMinutes ?? 5} min</span>
                      </div>
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
