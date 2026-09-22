import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Post } from '@/models';
import { renderMarkdown } from '@/lib/markdown';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdSlot } from '@/components/ads/AdSlot';

export const revalidate = 1800;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'QR4Menu';

type Props = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  await connectDB();
  return Post.findOne({ slug, status: 'PUBLISHED', type: { $in: ['BLOG', 'GUIDE'] } }).lean();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Not found', robots: { index: false, follow: false } };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverUrl ? [{ url: post.coverUrl }] : undefined,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  /* Prefer posts sharing a tag; fall back to recency so the rail is never empty. */
  const related = await Post.find({
    status: 'PUBLISHED',
    type: { $in: ['BLOG', 'GUIDE'] },
    slug: { $ne: post.slug },
    ...(post.tags?.length ? { tags: { $in: post.tags } } : {}),
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .select('slug title excerpt coverUrl readMinutes')
    .lean();

  const published = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <main className="pb-10">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.metaDescription || post.excerpt,
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.updatedAt?.toISOString(),
          mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
          image: post.coverUrl,
          keywords: post.tags?.join(', '),
          author: { '@type': 'Organization', name: post.author || siteName },
          publisher: { '@type': 'Organization', name: siteName },
        }}
      />

      <div className="mx-auto max-w-3xl px-4 pt-12">
        <nav aria-label="Breadcrumb" className="text-[10px] uppercase tracking-[0.2em] text-[var(--faint)]">
          <Link href="/" className="hover:text-[var(--brass-lift)]">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-[var(--brass-lift)]">Guides</Link>
        </nav>

        {post.tags?.length ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <li key={t}>
                <Link
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className="inline-flex rounded-full border border-[rgba(255,255,255,0.13)] px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition-colors hover:border-[var(--brass)] hover:text-[var(--ink)]"
                >
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <h1 className="display rise mt-6 text-[clamp(1.75rem,3.4vw,2.4rem)] leading-[1.02]">
          {post.h1}
        </h1>

        {post.excerpt ? (
          <p className="rise mt-5 text-[13.5px] leading-relaxed text-[var(--ink-soft)]" style={{ animationDelay: '0.1s' }}>
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[rgba(255,255,255,0.09)] py-4 text-[11px] uppercase tracking-[0.16em] text-[var(--faint)]">
          <span className="text-[var(--muted)]">{post.author}</span>
          {published ? <span>{published}</span> : null}
          <span>{post.readMinutes ?? 5} min read</span>
        </div>
      </div>

      {post.coverUrl ? (
        <figure className="mx-auto mt-10 max-w-5xl px-4">
          <div className="glass relative aspect-[21/9] overflow-hidden rounded-[24px]">
            <Image
              src={post.coverUrl}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1000px"
              priority
              className="object-cover"
            />
          </div>
        </figure>
      ) : null}

      <article
        className="prose-mq mx-auto mt-12 max-w-2xl px-4"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.bodyMd) }}
      />

      <div className="mx-auto max-w-2xl px-4">
        <AdSlot slot="blog-post-bottom" />

        <aside className="glass mt-12 rounded-[22px] p-8">
          <div className="relative z-[2]">
            <h2 className="display text-lg">Put your own menu behind a code</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--ink-soft)]">
              Build the menu, choose the card, print the code once. Change a price and every
              table sees it before the next order.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-flex h-12 items-center rounded-full bg-[var(--claret)] px-7 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--ink)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--claret-lift)]"
            >
              Get started free
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="mx-auto mt-16 max-w-5xl px-4">
          <h2 className="display text-base">Keep reading</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <article className="glass glass-lift group h-full overflow-hidden rounded-[18px]">
                  <Link href={`/blog/${r.slug}`} className="flex h-full flex-col">
                    {r.coverUrl ? (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={r.coverUrl}
                          alt=""
                          fill
                          sizes="300px"
                          className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="display text-[13.5px] leading-snug transition-colors group-hover:text-[var(--brass-lift)]">
                        {r.title}
                      </h3>
                      <p className="mt-auto pt-3 text-[10px] uppercase tracking-[0.14em] text-[var(--faint)]">
                        {r.readMinutes ?? 5} min read
                      </p>
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
