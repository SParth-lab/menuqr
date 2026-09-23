'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { POST_STATUSES, POST_TYPES, type PostStatus, type PostType } from '@/types';
import { postPath } from '@/lib/post-path';

export type PostValues = {
  id?: string;
  slug: string;
  type: PostType;
  title: string;
  h1: string;
  excerpt: string;
  bodyMd: string;
  metaTitle: string;
  metaDescription: string;
  coverUrl?: string;
  status: PostStatus;
};

export function PostEditor({ initial }: { initial: PostValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof PostValues>(key: K, v: PostValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setError(null);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const payload = { ...values };
    delete payload.id;

    const res = await fetch(values.id ? `/api/admin/posts/${values.id}` : '/api/admin/posts', {
      method: values.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setError(body.error ?? 'Could not save');
      return;
    }

    router.push('/admin/posts');
    router.refresh();
  }

  async function remove() {
    if (!values.id || !window.confirm('Delete this page permanently?')) return;
    setBusy(true);
    const res = await fetch(`/api/admin/posts/${values.id}`, { method: 'DELETE' });
    setBusy(false);
    if (!res.ok) {
      setError('Could not delete');
      return;
    }
    router.push('/admin/posts');
    router.refresh();
  }

  return (
    <form onSubmit={save} className="grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-5">
        <Card className="space-y-4">
          <Field label="Title" hint="Used in listings and as the default meta title.">
            <Input value={values.title} onChange={(e) => set('title', e.target.value)} required minLength={3} maxLength={140} />
          </Field>

          <Field label="H1" hint="The visible heading. Often shorter than the title.">
            <Input value={values.h1} onChange={(e) => set('h1', e.target.value)} required minLength={3} maxLength={140} />
          </Field>

          <Field label="Excerpt" hint="One or two sentences shown in listings.">
            <Textarea value={values.excerpt} onChange={(e) => set('excerpt', e.target.value)} maxLength={300} className="min-h-16" />
          </Field>

          <Field label="Body" hint="Markdown. Headings, lists, tables and links are supported.">
            <Textarea
              value={values.bodyMd}
              onChange={(e) => set('bodyMd', e.target.value)}
              className="min-h-96 font-mono text-xs"
            />
          </Field>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-bold text-[var(--ink)]">Search appearance</h2>
          <Field label="Meta title" hint={`${values.metaTitle.length}/70`}>
            <Input value={values.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} maxLength={70} />
          </Field>
          <Field label="Meta description" hint={`${values.metaDescription.length}/170`}>
            <Textarea value={values.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} maxLength={170} className="min-h-16" />
          </Field>
        </Card>
      </div>

      <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
        <Card className="space-y-4">
          <Field label="Status">
            <Select value={values.status} onChange={(e) => set('status', e.target.value as PostStatus)}>
              {POST_STATUSES.map((s) => <option key={s} value={s}>{s.toLowerCase()}</option>)}
            </Select>
          </Field>

          <Field label="Type">
            <Select value={values.type} onChange={(e) => set('type', e.target.value as PostType)}>
              {POST_TYPES.map((t) => <option key={t} value={t}>{t.toLowerCase()}</option>)}
            </Select>
          </Field>

          <Field
            label="Slug"
            hint={`Serves ${postPath(values.type, values.slug || 'slug')}`}
          >
            <Input value={values.slug} onChange={(e) => set('slug', e.target.value)} placeholder="how-to-create-a-digital-menu" />
          </Field>

          <ImageUpload label="Featured image" folder="posts" value={values.coverUrl} onChange={(url) => set('coverUrl', url)} />

          <div className="space-y-2 pt-1">
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? 'Saving…' : values.id ? 'Save page' : 'Create page'}
            </Button>
            {values.id ? (
              <Button type="button" variant="ghost" className="w-full !text-[var(--bad)]" onClick={remove} disabled={busy}>
                Delete page
              </Button>
            ) : null}
            {error ? <p className="text-xs text-[var(--bad)]">{error}</p> : null}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-[var(--ink)]">Before publishing</h2>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[var(--ink-soft)]">
            <li>Write for someone running a venue, not for a search engine.</li>
            <li>Link to at least one other page here — internal links are how deep pages get crawled.</li>
            <li>Keep the meta description under 160 characters so it is not truncated.</li>
          </ul>
        </Card>
      </div>
    </form>
  );
}
