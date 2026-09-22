'use client';

import { useState } from 'react';
import { Button, Field, Input, Select, Textarea } from '@/components/ui';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import type { UiItem } from './types';

export type ItemDraft = Omit<UiItem, 'id' | 'isVisible'> & { id?: string };

export function ItemEditor({
  draft,
  currency,
  categories,
  busy,
  onSave,
  onCancel,
}: {
  draft: ItemDraft;
  currency: string;
  categories: { id: string; name: string }[];
  busy: boolean;
  onSave: (values: ItemDraft) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ItemDraft>(draft);

  function set<K extends keyof ItemDraft>(key: K, v: ItemDraft[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(values);
      }}
      className="space-y-3 rounded-lg border border-[rgba(176,138,60,0.4)] bg-[rgba(176,138,60,0.13)]/50 p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Item name">
          <Input value={values.name} onChange={(e) => set('name', e.target.value)} required maxLength={80} autoFocus />
        </Field>
        <Field label={`Price (${currency})`}>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={values.price}
            onChange={(e) => set('price', Number(e.target.value))}
            required
          />
        </Field>
      </div>

      <Field label="Description" hint="Under 15 words reads best on a phone.">
        <Textarea
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          maxLength={300}
          className="min-h-16"
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Category">
          <Select value={values.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </Field>
        <ImageUpload
          label="Item photo"
          folder="items"
          value={values.imageUrl}
          onChange={(url) => set('imageUrl', url)}
        />
      </div>

      <div className="flex flex-wrap gap-4 pt-1">
        <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
          <input
            type="checkbox"
            checked={values.isVeg}
            onChange={(e) => set('isVeg', e.target.checked)}
            className="h-4 w-4 accent-[#4e9a51]"
          />
          Vegetarian
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
          <input
            type="checkbox"
            checked={values.isSpicy}
            onChange={(e) => set('isSpicy', e.target.checked)}
            className="h-4 w-4 accent-[#c4434a]"
          />
          Spicy
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
          <input
            type="checkbox"
            checked={values.isAvailable}
            onChange={(e) => set('isAvailable', e.target.checked)}
            className="h-4 w-4 accent-[#b08a3c]"
          />
          Available today
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" disabled={busy}>
          {busy ? 'Saving…' : values.id ? 'Save item' : 'Add item'}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
