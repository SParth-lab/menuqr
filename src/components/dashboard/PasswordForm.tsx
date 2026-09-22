'use client';

import { useState } from 'react';
import { Button, Field, Input } from '@/components/ui';

export function PasswordForm() {
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'error'; text?: string }>({ kind: 'idle' });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus({ kind: 'idle' });

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch('/api/account/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: String(data.get('currentPassword') ?? ''),
        newPassword: String(data.get('newPassword') ?? ''),
      }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setStatus({ kind: 'error', text: body.error ?? 'Could not change the password' });
      return;
    }
    form.reset();
    setStatus({ kind: 'ok', text: 'Password changed' });
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 max-w-sm space-y-3">
      <Field label="Current password">
        <Input name="currentPassword" type="password" autoComplete="current-password" required />
      </Field>
      <Field label="New password" hint="At least 8 characters">
        <Input name="newPassword" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={busy}>{busy ? 'Saving…' : 'Change password'}</Button>
        {status.kind === 'ok' ? <span className="text-xs text-[#7fc383]">{status.text}</span> : null}
        {status.kind === 'error' ? <span className="text-xs text-[#e58a8f]">{status.text}</span> : null}
      </div>
    </form>
  );
}
