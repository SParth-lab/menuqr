import type { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Post } from '@/models';
import { Card, EmptyState, LinkButton, PageHeader, StatusBadge } from '@/components/ui';
import { postPath } from '@/lib/post-path';

export const metadata: Metadata = { title: 'Blog & SEO pages', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminPosts() {
  await connectDB();
  const posts = await Post.find({}).sort({ updatedAt: -1 }).limit(200).lean();

  return (
    <>
      <PageHeader
        title="Blog & SEO pages"
        description="Landing pages are keyed by path: a slug of digital-menu-cafe serves /digital-menu/cafe."
        action={<LinkButton href="/admin/posts/new" size="sm">New page</LinkButton>}
      />

      {posts.length === 0 ? (
        <EmptyState
          title="No content yet"
          body="Guides and landing pages are what bring organic traffic. Write the first one."
          action={<LinkButton href="/admin/posts/new" size="sm">New page</LinkButton>}
        />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Title</th>
                <th className="px-4 py-2.5 font-semibold">Type</th>
                <th className="px-4 py-2.5 font-semibold">URL</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((p) => (
                <tr key={p._id.toString()}>
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/posts/${p._id}`} className="font-medium text-slate-900 hover:text-orange-700">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{p.type.toLowerCase()}</td>
                  <td className="px-4 py-2.5">
                    <Link href={postPath(p.type, p.slug)} target="_blank" className="font-mono text-xs text-slate-500 hover:text-orange-700">
                      {postPath(p.type, p.slug)}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">
                    {new Date(p.updatedAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
