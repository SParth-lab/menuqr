'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button, Field, Input } from '@/components/ui';

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const password = String(payload.password ?? '');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(body.error ?? 'Could not create the account');
      setBusy(false);
      return;
    }

    // Sign the owner straight in — they land on the dashboard with a pending banner.
    await signIn('credentials', {
      email: String(payload.email ?? ''),
      password,
      redirect: false,
    });

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <Field label="Restaurant or cafe name">
        <Input name="restaurantName" required minLength={2} placeholder="Spice Route Kitchen" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name">
          <Input name="name" required minLength={2} placeholder="Priya Shah" />
        </Field>
        <Field label="City" hint="Used for your city listing page">
          <Input name="city" placeholder="Ahmedabad" />
        </Field>
      </div>

      <Field label="Email">
        <Input name="email" type="email" autoComplete="email" required placeholder="you@restaurant.com" />
      </Field>

      <Field label="Password" hint="At least 8 characters">
        <Input name="password" type="password" autoComplete="new-password" required minLength={8} />
      </Field>

      <Button type="submit" disabled={busy} className="w-full">
        {busy ? 'Creating…' : 'Create account'}
      </Button>

      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        New restaurants are reviewed before their menu goes public. You can build the whole
        menu while that happens.
      </p>
    </form>
  );
}
