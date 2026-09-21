'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';

export function ImageUpload({
  value,
  onChange,
  folder = 'uploads',
  label,
  hint,
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  folder?: string;
  label: string;
  hint?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setBusy(true);

    const body = new FormData();
    body.append('file', file);
    body.append('folder', folder);

    const res = await fetch('/api/upload', { method: 'POST', body });
    const json = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setError(json.error ?? 'Upload failed');
      return;
    }
    onChange(json.url);
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-semibold text-slate-700">{label}</span>

      <div className="flex items-center gap-3">
        {value ? (
          <Image
            src={value}
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-dashed border-slate-300 text-[10px] text-slate-400">
            None
          </div>
        )}

        <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = '';
            }}
          />
        </label>

        {value ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}>
            Remove
          </Button>
        ) : null}
      </div>

      {hint ? <p className="mt-1 text-[11px] text-slate-500">{hint}</p> : null}
      {error ? <p className="mt-1 text-[11px] text-red-600">{error}</p> : null}
    </div>
  );
}
