'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import clsx from 'clsx';

export type FilterOption = { label: string; value: string; count?: number };

/**
 * Filters live in the URL, not in component state: a filtered view stays
 * shareable, survives a reload, and the server does the filtering so the list
 * is never wrong while the client catches up.
 */
export function DiscoveryFilters({
  cuisines,
  tags,
}: {
  cuisines: FilterOption[];
  tags: FilterOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const active = {
    cuisine: params.get('cuisine') ?? '',
    tag: params.get('tag') ?? '',
    price: params.get('price') ?? '',
    sort: params.get('sort') ?? 'featured',
  };

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || next.get(key) === value) next.delete(key);
    else next.set(key, value);

    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  const anyActive = active.cuisine || active.tag || active.price || active.sort !== 'featured';

  return (
    <div className={clsx('transition-opacity duration-200', pending && 'opacity-60')}>
      <FilterRow label="Cuisine">
        {cuisines.map((c) => (
          <Chip key={c.value} on={active.cuisine === c.value} onClick={() => set('cuisine', c.value)}>
            {c.label}
            {c.count ? <Count n={c.count} /> : null}
          </Chip>
        ))}
      </FilterRow>

      <FilterRow label="Good for">
        {tags.map((t) => (
          <Chip key={t.value} on={active.tag === t.value} onClick={() => set('tag', t.value)}>
            {t.label}
          </Chip>
        ))}
      </FilterRow>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <FilterInline label="Price">
          {[1, 2, 3, 4].map((p) => (
            <Chip key={p} on={active.price === String(p)} onClick={() => set('price', String(p))}>
              {'₹'.repeat(p)}
            </Chip>
          ))}
        </FilterInline>

        <FilterInline label="Sort">
          {[
            ['featured', 'Featured'],
            ['rating', 'Top rated'],
            ['name', 'A–Z'],
          ].map(([v, l]) => (
            <Chip key={v} on={active.sort === v} onClick={() => set('sort', v)}>
              {l}
            </Chip>
          ))}
        </FilterInline>

        {anyActive ? (
          <button
            type="button"
            onClick={() => startTransition(() => router.replace(pathname, { scroll: false }))}
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brass-lift)] underline underline-offset-4 hover:text-[var(--ink)]"
          >
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--faint)]">
        {label}
      </p>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">{children}</div>
    </div>
  );
}

function FilterInline({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--faint)]">
        {label}
      </span>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={clsx(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-200',
        on
          ? 'border-[var(--brass)] bg-[rgba(176,138,60,0.18)] text-[var(--ink)]'
          : 'border-[rgba(255,255,255,0.13)] text-[var(--ink-soft)] hover:border-[rgba(255,255,255,0.3)] hover:text-[var(--ink)]'
      )}
    >
      {children}
    </button>
  );
}

function Count({ n }: { n: number }) {
  return <span className="text-[10px] text-[var(--faint)]">{n}</span>;
}
