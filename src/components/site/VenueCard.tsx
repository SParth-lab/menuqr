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

export function PriceRange({
  value,
  onImage = false,
  className,
}: {
  value?: number;
  /** Over a photograph the scale has to be white, not navy. */
  onImage?: boolean;
  className?: string;
}) {
  if (!value) return null;
  return (
    <span
      className={clsx('font-semibold tracking-[0.06em]', className)}
      aria-label={`Price range ${value} of 4`}
    >
      <span className={onImage ? 'text-white' : 'text-[var(--ink)]'}>{'₹'.repeat(value)}</span>
      <span className={onImage ? 'text-white/40' : 'text-[var(--faint)]'}>
        {'₹'.repeat(4 - value)}
      </span>
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
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(140deg,var(--pane)_0%,var(--pane-hi)_100%)]">
              <span className="display foil text-[56px] leading-none">
                {venue.name.trim().charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,31,58,0.94)_0%,rgba(11,31,58,0.78)_22%,rgba(11,31,58,0.28)_50%,transparent_85%)]" />

          {venue.cuisine ? (
            <span className="glass-dark absolute left-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.04em] text-white">
              {venue.cuisine}
            </span>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <div className="min-w-0">
              {/* Over a photograph, not a surface: these stay white regardless
                  of the palette, with a scrim behind them for contrast. */}
              <h3 className="display truncate text-[19px] leading-tight text-white">
                {venue.name}
              </h3>
              {venue.area ? (
                <p className="mt-1 truncate text-[12px] font-medium text-white/75">
                  {venue.area}
                </p>
              ) : null}
            </div>
            <PriceRange value={venue.priceRange} onImage className="shrink-0 text-xs" />
          </div>
        </div>

        <div className="p-4">
          <p className="line-clamp-2 text-[13px] leading-relaxed text-[var(--ink-soft)]">
            {venue.tagline || 'Menu published — tap to see the full card and prices.'}
          </p>

          <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-3.5">
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
                  className="rounded-full bg-[var(--pane)] px-2.5 py-1 text-[11px] text-[var(--muted)]"
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
