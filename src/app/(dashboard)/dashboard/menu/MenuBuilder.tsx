'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Button, Card, EmptyState, Input } from '@/components/ui';
import { formatPrice } from '@/lib/format';
import { ItemEditor, type ItemDraft } from './ItemEditor';
import type { UiCategory, UiItem } from './types';

type Props = {
  currency: string;
  initialCategories: UiCategory[];
  initialItems: UiItem[];
};

async function api(path: string, method: string, body?: unknown) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error ?? 'Request failed');
  return json;
}

function move<T>(list: T[], index: number, delta: number): T[] {
  const next = [...list];
  const target = index + delta;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function MenuBuilder({ currency, initialCategories, initialItems }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [items, setItems] = useState(initialItems);
  const [newCategory, setNewCategory] = useState('');
  const [editingItem, setEditingItem] = useState<ItemDraft | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, UiItem[]>();
    for (const c of categories) map.set(c.id, []);
    for (const i of items) map.get(i.categoryId)?.push(i);
    return map;
  }, [categories, items]);

  async function run<T>(fn: () => Promise<T>) {
    setBusy(true);
    setError(null);
    try {
      return await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      // Server state is now the truth; drop optimistic edits rather than guess.
      router.refresh();
      return undefined;
    } finally {
      setBusy(false);
    }
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    const name = newCategory.trim();
    if (!name) return;

    const res = await run(() => api('/api/categories', 'POST', { name }));
    if (!res) return;

    setCategories((prev) => [...prev, { id: res.category._id, name, description: '', isVisible: true }]);
    setNewCategory('');
  }

  async function renameCategory(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c)));
    setRenaming(null);
    await run(() => api(`/api/categories/${id}`, 'PATCH', { name: trimmed }));
  }

  async function toggleCategory(id: string, isVisible: boolean) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, isVisible } : c)));
    await run(() => api(`/api/categories/${id}`, 'PATCH', { isVisible }));
  }

  async function deleteCategory(id: string) {
    const count = itemsByCategory.get(id)?.length ?? 0;
    const ok = window.confirm(
      count > 0
        ? `Delete this category and its ${count} item${count === 1 ? '' : 's'}? This cannot be undone.`
        : 'Delete this category?'
    );
    if (!ok) return;

    setCategories((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) => prev.filter((i) => i.categoryId !== id));
    await run(() => api(`/api/categories/${id}`, 'DELETE'));
  }

  async function moveCategory(index: number, delta: number) {
    const next = move(categories, index, delta);
    if (next === categories) return;
    setCategories(next);
    await run(() => api('/api/categories/reorder', 'POST', { ids: next.map((c) => c.id) }));
  }

  async function saveItem(draft: ItemDraft) {
    const payload = {
      categoryId: draft.categoryId,
      name: draft.name,
      description: draft.description,
      price: draft.price,
      imageUrl: draft.imageUrl,
      isVeg: draft.isVeg,
      isSpicy: draft.isSpicy,
      isAvailable: draft.isAvailable,
    };

    if (draft.id) {
      const res = await run(() => api(`/api/items/${draft.id}`, 'PATCH', payload));
      if (!res) return;
      setItems((prev) => prev.map((i) => (i.id === draft.id ? { ...i, ...payload } : i)));
    } else {
      const res = await run(() => api('/api/items', 'POST', payload));
      if (!res) return;
      setItems((prev) => [...prev, { ...payload, id: res.item._id, isVisible: true } as UiItem]);
    }
    setEditingItem(null);
  }

  async function toggleItem(id: string, patch: Partial<UiItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
    await run(() => api(`/api/items/${id}`, 'PATCH', patch));
  }

  async function deleteItem(id: string) {
    if (!window.confirm('Delete this item?')) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await run(() => api(`/api/items/${id}`, 'DELETE'));
  }

  async function moveItem(categoryId: string, index: number, delta: number) {
    const within = itemsByCategory.get(categoryId) ?? [];
    const next = move(within, index, delta);
    if (next === within) return;

    const order = new Map(next.map((i, n) => [i.id, n]));
    setItems((prev) =>
      [...prev].sort((a, b) => {
        if (a.categoryId !== categoryId || b.categoryId !== categoryId) return 0;
        return (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0);
      })
    );
    await run(() => api('/api/items/reorder', 'POST', { ids: next.map((i) => i.id) }));
  }

  return (
    <div className="max-w-3xl space-y-5">
      {error ? (
        <p className="rounded-lg bg-[var(--bad-bg)] px-3 py-2 text-sm text-[var(--bad)]" role="alert">{error}</p>
      ) : null}

      <Card>
        <form onSubmit={addCategory} className="flex gap-2">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category — Starters, Beverages, Desserts…"
            maxLength={60}
          />
          <Button type="submit" disabled={busy || !newCategory.trim()}>Add</Button>
        </form>
      </Card>

      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          body="Menus are organised into categories. Add your first one above — most venues use between four and eight."
        />
      ) : null}

      {categories.map((category, ci) => {
        const catItems = itemsByCategory.get(category.id) ?? [];

        return (
          <Card key={category.id} className={clsx(!category.isVisible && 'opacity-60')}>
            <div className="flex flex-wrap items-center gap-2">
              {renaming === category.id ? (
                <form
                  className="flex flex-1 gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    renameCategory(category.id, new FormData(e.currentTarget).get('name') as string);
                  }}
                >
                  <Input name="name" defaultValue={category.name} autoFocus maxLength={60} />
                  <Button type="submit" size="sm">Save</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setRenaming(null)}>Cancel</Button>
                </form>
              ) : (
                <>
                  <h2 className="flex-1 text-base font-bold text-[var(--ink)]">
                    {category.name}
                    <span className="ml-2 text-xs font-normal text-[var(--muted)]">
                      {catItems.length} {catItems.length === 1 ? 'item' : 'items'}
                    </span>
                  </h2>

                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" onClick={() => moveCategory(ci, -1)} disabled={busy || ci === 0} aria-label="Move category up">↑</Button>
                    <Button size="sm" variant="ghost" onClick={() => moveCategory(ci, 1)} disabled={busy || ci === categories.length - 1} aria-label="Move category down">↓</Button>
                    <Button size="sm" variant="ghost" onClick={() => setRenaming(category.id)}>Rename</Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleCategory(category.id, !category.isVisible)}>
                      {category.isVisible ? 'Hide' : 'Show'}
                    </Button>
                    <Button size="sm" variant="ghost" className="!text-[var(--bad)]" onClick={() => deleteCategory(category.id)}>Delete</Button>
                  </div>
                </>
              )}
            </div>

            <ul className="mt-3 divide-y divide-[var(--line)]">
              {catItems.map((item, ii) => (
                <li key={item.id} className="flex flex-wrap items-center gap-2 py-2.5">
                  <span
                    className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center border-[1.5px]"
                    style={{ borderColor: item.isVeg ? '#16a34a' : '#dc2626' }}
                    aria-label={item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: item.isVeg ? '#16a34a' : '#dc2626' }} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className={clsx('truncate text-sm font-medium text-[var(--ink)]', !item.isAvailable && 'line-through')}>
                      {item.name} {item.isSpicy ? '🌶️' : null}
                    </p>
                    {item.description ? (
                      <p className="truncate text-xs text-[var(--muted)]">{item.description}</p>
                    ) : null}
                  </div>

                  <span className="text-sm font-semibold text-[var(--ink)]">
                    {formatPrice(item.price, currency)}
                  </span>

                  <div className="flex items-center gap-0.5">
                    <Button size="sm" variant="ghost" onClick={() => moveItem(category.id, ii, -1)} disabled={busy || ii === 0} aria-label="Move item up">↑</Button>
                    <Button size="sm" variant="ghost" onClick={() => moveItem(category.id, ii, 1)} disabled={busy || ii === catItems.length - 1} aria-label="Move item down">↓</Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleItem(item.id, { isAvailable: !item.isAvailable })}>
                      {item.isAvailable ? 'Mark out' : 'Mark in'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingItem({ ...item })}>Edit</Button>
                    <Button size="sm" variant="ghost" className="!text-[var(--bad)]" onClick={() => deleteItem(item.id)}>Delete</Button>
                  </div>
                </li>
              ))}
            </ul>

            {editingItem && editingItem.categoryId === category.id ? (
              <div className="mt-3">
                <ItemEditor
                  draft={editingItem}
                  currency={currency}
                  categories={categories.map((c) => ({ id: c.id, name: c.name }))}
                  busy={busy}
                  onSave={saveItem}
                  onCancel={() => setEditingItem(null)}
                />
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() =>
                  setEditingItem({
                    categoryId: category.id,
                    name: '',
                    description: '',
                    price: 0,
                    isVeg: true,
                    isSpicy: false,
                    isAvailable: true,
                  })
                }
              >
                + Add item to {category.name}
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
