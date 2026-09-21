import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Post, Restaurant } from '@/models';
import { renderMarkdown } from '@/lib/markdown';
import { LandingPage } from '@/components/seo/LandingPage';

export const revalidate = 3600;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

type Props = { params: Promise<{ type: string }> };

/**
 * Landing posts are keyed by their full path (`digital-menu-cafe`), so the same CMS
 * table can back several URL families without their slugs colliding.
 */
function landingSlug(type: string) {
  return `digital-menu-${type}`;
}

async function getLanding(type: string) {
  await connectDB();
  return Post.findOne({ slug: landingSlug(type), type: 'LANDING', status: 'PUBLISHED' }).lean();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const post = await getLanding(type);
  if (!post) return { title: 'Not found', robots: { index: false, follow: false } };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `${siteUrl}/digital-menu/${type}` },
    openGraph: { title: post.metaTitle || post.title, description: post.metaDescription || post.excerpt },
  };
}

export default async function DigitalMenuLanding({ params }: Props) {
  const { type } = await params;
  const post = await getLanding(type);
  if (!post) notFound();

  const examples = await Restaurant.find({ status: 'APPROVED' })
    .sort({ createdAt: -1 })
    .limit(6)
    .select('name slug city')
    .lean();

  return (
    <LandingPage
      h1={post.h1}
      excerpt={post.excerpt}
      html={renderMarkdown(post.bodyMd)}
      canonical={`${siteUrl}/digital-menu/${type}`}
      crumb="Digital menu"
      examples={examples.map((r) => ({ name: r.name, slug: r.slug, city: r.city }))}
      sibling={{ href: `/qr-menu/${type}`, label: `QR menu for ${type}s` }}
    />
  );
}
