import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui';
import { PostEditor } from '../PostEditor';

export const metadata: Metadata = { title: 'New page', robots: { index: false, follow: false } };

export default function NewPostPage() {
  return (
    <>
      <PageHeader title="New page" description="Blog post, guide, or an SEO landing page." />
      <PostEditor
        initial={{
          slug: '',
          type: 'BLOG',
          title: '',
          h1: '',
          excerpt: '',
          bodyMd: '',
          metaTitle: '',
          metaDescription: '',
          status: 'DRAFT',
        }}
      />
    </>
  );
}
