import type { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Post } from '@/models';
import { AdSlot } from '@/components/ads/AdSlot';
import { readingMinutes } from '@/lib/markdown';

export const revalidate = 1800;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Guides for restaurant and cafe owners',
  description:
    'Practical guides on digital menus, QR codes, menu design and pricing for restaurants and cafes.',
  alternates: { canonical: `${siteUrl}/blog` },
};

export default async function BlogIndex() {
  await connectDB();
  const posts = await Post.find({ status: 'PUBLISHED', type: { $in: ['BLOG', 'GUIDE'] } })
    .sort({ publishedAt: -1 })
    .select('slug title excerpt publishedAt bodyMd type')
    .lean();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        Guides for restaurant and cafe owners
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Menu structure, pricing, QR codes and design — written for people who run venues, not
        for search engines.
      </p>

      <AdSlot slot="blog-index-top" />

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-slate-500">No guides published yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-slate-200">
          {posts.map((p) => (
            <li key={p.slug} className="py-5">
              <Link href={`/blog/${p.slug}`} className="group block">
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-orange-700">
                  {p.title}
                </h2>
                {p.excerpt ? (
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.excerpt}</p>
                ) : null}
                <p className="mt-2 text-xs text-slate-500">
                  {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null}
                  {' · '}
                  {readingMinutes(p.bodyMd)} min read
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
