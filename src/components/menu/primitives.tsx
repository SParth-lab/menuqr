import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { formatPrice } from '@/lib/format';
import { cardClasses } from '@/lib/theme';
import type { ThemeConfig } from '@/types';
import type { PublicCategory, PublicItem, PublicRestaurant } from '@/templates/types';

export function VegBadge({ isVeg }: { isVeg: boolean }) {
  const color = isVeg ? '#16a34a' : '#dc2626';
  return (
    <span
      aria-label={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      title={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center border-[1.5px]"
      style={{ borderColor: color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
    </span>
  );
}

export function SpicyBadge() {
  return (
    <span aria-label="Spicy" title="Spicy" className="text-xs leading-none">
      🌶️
    </span>
  );
}

export function RestaurantHeader({
  restaurant,
  theme,
  variant = 'standard',
}: {
  restaurant: PublicRestaurant;
  theme: ThemeConfig;
  variant?: 'standard' | 'hero' | 'compact';
}) {
  const align =
    theme.logoPosition === 'left'
      ? 'items-start text-left'
      : theme.logoPosition === 'right'
        ? 'items-end text-right'
        : 'items-center text-center';

  const logoSize = variant === 'compact' ? 56 : 88;

  return (
    <header className={clsx('flex flex-col gap-3 px-5 pt-8 pb-6', align)}>
      {restaurant.logoUrl ? (
        <Image
          src={restaurant.logoUrl}
          alt={`${restaurant.name} logo`}
          width={logoSize}
          height={logoSize}
          className="object-contain"
          style={{ borderRadius: 'var(--mq-radius)' }}
          priority
        />
      ) : null}

      <h1
        className={clsx(
          'font-semibold leading-tight',
          variant === 'hero' ? 'text-4xl' : variant === 'compact' ? 'text-xl' : 'text-3xl'
        )}
        style={{ fontFamily: 'var(--mq-font-heading)', color: 'var(--mq-text)' }}
      >
        {restaurant.name}
      </h1>

      {restaurant.tagline ? (
        <p className="text-sm" style={{ color: 'var(--mq-muted)' }}>
          {restaurant.tagline}
        </p>
      ) : null}

      {restaurant.address ? (
        <address className="text-xs not-italic" style={{ color: 'var(--mq-muted)' }}>
          {restaurant.address}
        </address>
      ) : null}
    </header>
  );
}

/**
 * Scroll-spy-free category nav: plain anchors, so it works with JavaScript disabled
 * and costs the menu page no client bundle.
 */
export function CategoryNav({ categories }: { categories: PublicCategory[] }) {
  if (categories.length < 2) return null;
  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-0 z-10 -mx-0 overflow-x-auto border-b px-4 py-3 backdrop-blur"
      style={{ background: 'color-mix(in srgb, var(--mq-bg) 88%, transparent)', borderColor: 'color-mix(in srgb, var(--mq-text) 10%, transparent)' }}
    >
      <ul className="flex gap-2 whitespace-nowrap">
        {categories.map((c) => (
          <li key={c.id}>
            <a
              href={`#cat-${c.id}`}
              className="inline-block px-3 py-1.5 text-sm font-medium"
              style={{
                borderRadius: 'var(--mq-radius)',
                background: 'color-mix(in srgb, var(--mq-primary) 10%, transparent)',
                color: 'var(--mq-primary)',
              }}
            >
              {c.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ItemCard({
  item,
  theme,
  currency,
}: {
  item: PublicItem;
  theme: ThemeConfig;
  currency: string;
}) {
  const grid = theme.layout === 'grid' || theme.layout === 'magazine';
  const showImage = theme.showImages && Boolean(item.imageUrl);

  return (
    <article
      className={clsx(
        'relative overflow-hidden',
        cardClasses(theme),
        grid ? 'flex flex-col' : 'flex gap-3 p-3',
        !item.isAvailable && 'opacity-55'
      )}
      style={{ borderRadius: 'var(--mq-radius)' }}
    >
      {showImage && grid ? (
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={item.imageUrl!}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 300px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className={clsx('min-w-0 flex-1', grid && 'p-3')}>
        <div className="flex items-center gap-1.5">
          <VegBadge isVeg={item.isVeg} />
          {item.isSpicy ? <SpicyBadge /> : null}
          <h3
            className="truncate text-[15px] font-semibold"
            style={{ fontFamily: 'var(--mq-font-heading)', color: 'var(--mq-text)' }}
          >
            {item.name}
          </h3>
        </div>

        {item.description ? (
          <p className="mt-1 line-clamp-2 text-[13px] leading-snug" style={{ color: 'var(--mq-muted)' }}>
            {item.description}
          </p>
        ) : null}

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[15px] font-bold" style={{ color: 'var(--mq-primary)' }}>
            {formatPrice(item.price, currency)}
          </span>
          {!item.isAvailable ? (
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: 'color-mix(in srgb, var(--mq-text) 10%, transparent)', color: 'var(--mq-muted)' }}
            >
              Unavailable
            </span>
          ) : null}
        </div>
      </div>

      {showImage && !grid ? (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden" style={{ borderRadius: 'var(--mq-radius)' }}>
          <Image src={item.imageUrl!} alt={item.name} fill sizes="80px" className="object-cover" />
        </div>
      ) : null}
    </article>
  );
}

export function CategorySection({
  category,
  theme,
  currency,
  headingClassName,
}: {
  category: PublicCategory;
  theme: ThemeConfig;
  currency: string;
  headingClassName?: string;
}) {
  if (category.items.length === 0) return null;

  return (
    <section id={`cat-${category.id}`} className="scroll-mt-16 px-4 py-5">
      <h2
        className={clsx('mb-1 text-xl font-bold', headingClassName)}
        style={{ fontFamily: 'var(--mq-font-heading)', color: 'var(--mq-text)' }}
      >
        {category.name}
      </h2>
      {category.description ? (
        <p className="mb-3 text-[13px]" style={{ color: 'var(--mq-muted)' }}>
          {category.description}
        </p>
      ) : null}

      <div
        className={clsx(
          'mt-3',
          theme.layout === 'grid' || theme.layout === 'magazine'
            ? 'grid grid-cols-2 gap-3'
            : theme.layout === 'compact'
              ? 'flex flex-col gap-1.5'
              : 'flex flex-col gap-3'
        )}
      >
        {category.items.map((item) => (
          <ItemCard key={item.id} item={item} theme={theme} currency={currency} />
        ))}
      </div>
    </section>
  );
}

export function MenuFooter({ restaurant }: { restaurant: PublicRestaurant }) {
  const links = Object.entries(restaurant.socials).filter(([, v]) => Boolean(v)) as [string, string][];

  return (
    <footer className="mt-6 px-5 pb-16 pt-8 text-center">
      <div className="mx-auto mb-4 h-px w-16" style={{ background: 'color-mix(in srgb, var(--mq-text) 15%, transparent)' }} />

      {restaurant.phone ? (
        <p className="text-sm">
          <a href={`tel:${restaurant.phone}`} style={{ color: 'var(--mq-primary)' }}>
            {restaurant.phone}
          </a>
        </p>
      ) : null}

      {restaurant.openingHours ? (
        <p className="mt-1 text-xs" style={{ color: 'var(--mq-muted)' }}>
          {restaurant.openingHours}
        </p>
      ) : null}

      {links.length > 0 ? (
        <ul className="mt-4 flex flex-wrap justify-center gap-3">
          {links.map(([k, v]) => (
            <li key={k}>
              <a
                href={v}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-xs capitalize underline underline-offset-4"
                style={{ color: 'var(--mq-muted)' }}
              >
                {k}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-6 text-[11px]" style={{ color: 'var(--mq-muted)' }}>
        Digital menu by{' '}
        <Link href="/" className="underline underline-offset-2">
          {process.env.NEXT_PUBLIC_SITE_NAME || 'MenuQR'}
        </Link>
      </p>
    </footer>
  );
}
