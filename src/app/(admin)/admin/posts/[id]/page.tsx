import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Post } from '@/models';
import { PageHeader } from '@/components/ui';
import { postPath } from '@/lib/post-path';
import { PostEditor } from '../PostEditor';

export const metadata: Metadata = { title: 'Edit page', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  await connectDB();

  const post = await Post.findById(id).lean().catch(() => null);
  if (!post) notFound();

  return (
    <>
      <PageHeader
        title="Edit page"
        description={post.status === 'PUBLISHED' ? undefined : 'This page is a draft and is not publicly reachable.'}
        action={
          post.status === 'PUBLISHED' ? (
            <Link href={postPath(post.type, post.slug)} target="_blank" className="text-sm font-medium text-orange-700 hover:underline">
              View live page
            </Link>
          ) : null
        }
      />
      <PostEditor
        initial={{
          id: post._id.toString(),
          slug: post.slug,
          type: post.type,
          title: post.title,
          h1: post.h1,
          excerpt: post.excerpt ?? '',
          bodyMd: post.bodyMd ?? '',
          metaTitle: post.metaTitle ?? '',
          metaDescription: post.metaDescription ?? '',
          coverUrl: post.coverUrl,
          status: post.status,
        }}
      />
    </>
  );
}
