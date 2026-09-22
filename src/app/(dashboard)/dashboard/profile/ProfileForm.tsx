'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Field, Input, Select, Textarea } from '@/components/ui';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { CURRENCIES } from '@/lib/format';

type Socials = Record<'website' | 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'whatsapp', string>;

export type ProfileValues = {
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  currency: string;
  openingHours: string;
  seoTitle: string;
  seoDescription: string;
  socials: Socials;
};

export function ProfileForm({ initial, slug }: { initial: ProfileValues; slug: string }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'error'; text?: string }>({ kind: 'idle' });
  const [busy, setBusy] = useState(false);

  function set<K extends keyof ProfileValues>(key: K, v: ProfileValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setStatus({ kind: 'idle' });
  }

  function setSocial(key: keyof Socials, v: string) {
    setValues((prev) => ({ ...prev, socials: { ...prev.socials, [key]: v } }));
    setStatus({ kind: 'idle' });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    const res = await fetch('/api/restaurants/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setStatus({ kind: 'error', text: body.error ?? 'Could not save' });
      return;
    }

    setStatus({
      kind: 'ok',
      text:
        body.restaurant?.slug && body.restaurant.slug !== slug
          ? `Saved. Your menu URL is now /menu/${body.restaurant.slug}`
          : 'Saved',
    });
    router.refresh();
  }

  return (
    <form onSubmit={save} className="max-w-3xl space-y-5">
      <Card className="space-y-4">
        <h2 className="text-sm font-bold text-[var(--ink)]">Basics</h2>

        <Field label="Restaurant name" hint="Renaming changes your public menu URL and QR target.">
          <Input value={values.name} onChange={(e) => set('name', e.target.value)} required minLength={2} />
        </Field>

        <Field label="Tagline" hint="One line under your name on the menu.">
          <Input value={values.tagline} onChange={(e) => set('tagline', e.target.value)} maxLength={140} />
        </Field>

        <Field label="Description" hint="Used as the fallback search description. 1–2 sentences.">
          <Textarea value={values.description} onChange={(e) => set('description', e.target.value)} maxLength={2000} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUpload label="Logo" folder="logos" value={values.logoUrl} onChange={(url) => set('logoUrl', url)} hint="Square works best." />
          <ImageUpload label="Cover image" folder="covers" value={values.coverUrl} onChange={(url) => set('coverUrl', url)} hint="Shown by templates with a hero." />
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-bold text-[var(--ink)]">Location and contact</h2>

        <Field label="Address">
          <Input value={values.address} onChange={(e) => set('address', e.target.value)} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="City" hint="Puts you on the city listing page.">
            <Input value={values.city} onChange={(e) => set('city', e.target.value)} />
          </Field>
          <Field label="State">
            <Input value={values.state} onChange={(e) => set('state', e.target.value)} />
          </Field>
          <Field label="Country">
            <Input value={values.country} onChange={(e) => set('country', e.target.value)} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Phone">
            <Input value={values.phone} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field label="Public email">
            <Input type="email" value={values.email} onChange={(e) => set('email', e.target.value)} />
          </Field>
          <Field label="Currency">
            <Select value={values.currency} onChange={(e) => set('currency', e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Opening hours" hint="Free text, e.g. Daily 11:00 – 23:00">
          <Input value={values.openingHours} onChange={(e) => set('openingHours', e.target.value)} />
        </Field>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-bold text-[var(--ink)]">Social links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['website', 'instagram', 'facebook', 'twitter', 'youtube'] as const).map((k) => (
            <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
              <Input
                type="url"
                placeholder="https://"
                value={values.socials[k]}
                onChange={(e) => setSocial(k, e.target.value)}
              />
            </Field>
          ))}
          <Field label="WhatsApp" hint="Number or wa.me link">
            <Input value={values.socials.whatsapp} onChange={(e) => setSocial('whatsapp', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="text-sm font-bold text-[var(--ink)]">Search appearance</h2>
        <p className="-mt-2 text-xs text-[var(--muted)]">
          Leave blank and we generate these from your name, city and item count.
        </p>

        <Field label="Meta title" hint={`${values.seoTitle.length}/70 characters`}>
          <Input value={values.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} maxLength={70} />
        </Field>

        <Field label="Meta description" hint={`${values.seoDescription.length}/170 characters`}>
          <Textarea value={values.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} maxLength={170} />
        </Field>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </Button>
        {status.kind === 'ok' ? <span className="text-sm text-[#7fc383]">{status.text}</span> : null}
        {status.kind === 'error' ? <span className="text-sm text-[#e58a8f]">{status.text}</span> : null}
      </div>
    </form>
  );
}
