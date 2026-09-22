import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

export type VenueCardData = {
  name: string;
  slug: string;
  cuisine?: string;
  area?: string;
  tagline?: string;
  coverUrl?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: number;
  tags?: string[];
  itemCount?: number;
};

export function PriceRange({ value, className }: { value?: number; className?: string }) {
  if (!value) return null;
  return (
    <span className={clsx('tracking-[0.12em]', className)} aria-label={`Price range ${value} of 4`}>
      <span className="text-[var(--ink)]">{'₹'.repeat(value)}</span>
      <span className="text-[var(--faint)]">{'₹'.repeat(4 - value)}</span>
    </span>
  );
}

export function Rating({ value, count }: { value?: number; count?: number }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="display text-[13.5px] leading-none text-[var(--brass-lift)]">
        {value.toFixed(1)}
      </span>
      <span className="text-[10px] text-[var(--muted)]">
        {count ? `${count.toLocaleString('en-IN')} reviews` : 'rated'}
      </span>
    </span>
  );
}

export function VenueCard({ venue, priority = false }: { venue: VenueCardData; priority?: boolean }) {
  return (
    <article className="glass glass-lift group overflow-hidden rounded-[20px]">
      <Link href={`/menu/${venue.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          {venue.coverUrl ? (
            <Image
              src={venue.coverUrl}
              alt={`${venue.name} — ${venue.cuisine ?? 'menu'}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
          ) : (
            /* A venue that just registered has no cover yet. A monogram plate
               reads as intentional; a grey rectangle reads as broken. */
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(120%_100%_at_50%_0%,var(--ground-2),var(--void))]">
              <span className="display foil text-[56px] leading-none">
                {venue.name.trim().charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,6,10,0.92)] via-[rgba(7,6,10,0.25)] to-transparent" />

          {venue.cuisine ? (
            <span className="glass-dark absolute left-3 top-3 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--ink)]">
              {venue.cuisine}
            </span>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <div className="min-w-0">
              <h3 className="display truncate text-[14px] leading-tight text-[var(--ink)]">
                {venue.name}
              </h3>
              {venue.area ? (
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                  {venue.area}
                </p>
              ) : null}
            </div>
            <PriceRange value={venue.priceRange} className="shrink-0 text-xs" />
          </div>
        </div>

        <div className="p-4">
          <p className="line-clamp-2 text-[13px] leading-relaxed text-[var(--ink-soft)]">
            {venue.tagline || 'Menu published — tap to see the full card and prices.'}
          </p>

          <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-[rgba(255,255,255,0.09)] pt-3.5">
            {venue.rating ? (
              <Rating value={venue.rating} count={venue.reviewCount} />
            ) : (
              <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--faint)]">
                Newly listed
              </span>
            )}
            {typeof venue.itemCount === 'number' ? (
              <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                {venue.itemCount} dishes
              </span>
            ) : null}
          </div>

          {venue.tags?.length ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {venue.tags.slice(0, 3).map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-[rgba(255,255,255,0.12)] px-2.5 py-1 text-[10px] text-[var(--muted)]"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export function VenueCardSkeleton() {
  return (
    <div className="glass overflow-hidden rounded-[20px]">
      <div className="shimmer aspect-[16/10] w-full" />
      <div className="space-y-3 p-4">
        <div className="shimmer h-3 w-4/5 rounded-full" />
        <div className="shimmer h-3 w-3/5 rounded-full" />
        <div className="shimmer mt-4 h-3 w-1/3 rounded-full" />
      </div>
    </div>
  );
}
