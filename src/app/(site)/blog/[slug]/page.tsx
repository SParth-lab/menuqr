import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Post } from '@/models';
import { renderMarkdown, readingMinutes } from '@/lib/markdown';
import { JsonLd } from '@/components/seo/JsonLd';
import { AdSlot } from '@/components/ads/AdSlot';

export const revalidate = 1800;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MenuQR';

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

  const related = await Post.find({
    status: 'PUBLISHED',
    type: { $in: ['BLOG', 'GUIDE'] },
    slug: { $ne: post.slug },
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .select('slug title excerpt')
    .lean();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.metaDescription || post.excerpt,
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.updatedAt?.toISOString(),
          mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
          author: { '@type': 'Organization', name: siteName },
          publisher: { '@type': 'Organization', name: siteName },
        }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <Link href="/" className="hover:text-orange-700">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/blog" className="hover:text-orange-700">Guides</Link>
      </nav>

      <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
        {post.h1}
      </h1>
      <p className="mt-2 text-xs text-slate-500">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          : null}
        {' · '}
        {readingMinutes(post.bodyMd)} min read
      </p>

      <article
        className="prose-mq mt-8"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.bodyMd) }}
      />

      <AdSlot slot="blog-post-bottom" />

      <div className="mt-10 rounded-xl border border-orange-200 bg-orange-50 p-5">
        <h2 className="text-base font-bold text-slate-900">Put your own menu on a QR code</h2>
        <p className="mt-1 text-sm text-slate-700">
          Build the menu, pick a design, download the code. Free to start.
        </p>
        <Link
          href="/register"
          className="mt-3 inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          Get started
        </Link>
      </div>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-slate-900">Keep reading</h2>
          <ul className="mt-3 space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/blog/${r.slug}`} className="text-sm font-medium text-orange-700 hover:underline">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
