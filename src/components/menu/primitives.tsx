import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { formatPrice } from '@/lib/format';
import { cardClasses } from '@/lib/theme';
import type { ThemeConfig } from '@/types';
import type { PublicCategory, PublicItem, PublicRestaurant } from '@/templates/types';

/** The mark Indian diners already read. Never redrawn as an icon or an emoji. */
export function VegBadge({ isVeg }: { isVeg: boolean }) {
  const color = isVeg ? '#4e9a51' : '#c0453c';
  return (
    <span
      aria-label={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      title={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
      className="inline-flex h-2.5 w-2.5 shrink-0 items-center justify-center self-center border"
      style={{ borderColor: color }}
    >
      <span className="h-1 w-1 rounded-full" style={{ background: color }} />
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

  const logoSize = variant === 'compact' ? 52 : 76;

  return (
    <header
      className={clsx(
        'flex flex-col gap-3 px-6 pb-6 pt-8',
        align,
        theme.showDividers && 'border-b'
      )}
      style={{ borderColor: 'color-mix(in srgb, var(--mq-text) 12%, transparent)' }}
    >
      {/* A hairline above the name, the way a printed card opens. */}
      <span
        className="block h-px w-8"
        style={{
          background: 'var(--mq-primary)',
          alignSelf:
            theme.logoPosition === 'left'
              ? 'flex-start'
              : theme.logoPosition === 'right'
                ? 'flex-end'
                : 'center',
        }}
      />

      {restaurant.logoUrl ? (
        <Image
          src={restaurant.logoUrl}
          alt={`${restaurant.name} logo`}
          width={logoSize}
          height={logoSize}
          className="object-contain"
          priority
        />
      ) : null}

      <h1
        className={clsx(
          'leading-[1.05]',
          variant === 'hero' ? 'text-[38px]' : variant === 'compact' ? 'text-[22px]' : 'text-[30px]'
        )}
        style={{
          fontFamily: 'var(--mq-font-heading)',
          color: 'var(--mq-text)',
          letterSpacing: '-0.015em',
        }}
      >
        {restaurant.name}
      </h1>

      {restaurant.tagline ? (
        <p
          className="text-[9px] font-bold uppercase tracking-[0.28em]"
          style={{ color: 'var(--mq-secondary)' }}
        >
          {restaurant.tagline}
        </p>
      ) : null}

      {restaurant.address ? (
        <address
          className="text-xs not-italic leading-relaxed"
          style={{ color: 'var(--mq-muted)' }}
        >
          {restaurant.address}
        </address>
      ) : null}
    </header>
  );
}

/**
 * Plain anchors: works with JavaScript disabled and adds nothing to the menu
 * page's client bundle, which is the whole point of this route.
 */
export function CategoryNav({ categories }: { categories: PublicCategory[] }) {
  if (categories.length < 2) return null;
  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-0 z-10 overflow-x-auto border-b px-5 py-3 backdrop-blur"
      style={{
        background: 'color-mix(in srgb, var(--mq-bg) 90%, transparent)',
        borderColor: 'color-mix(in srgb, var(--mq-text) 10%, transparent)',
      }}
    >
      <ul className="flex gap-2 whitespace-nowrap">
        {categories.map((c) => (
          <li key={c.id}>
            <a
              href={`#cat-${c.id}`}
              className="inline-block border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] transition-colors"
              style={{
                borderColor: 'color-mix(in srgb, var(--mq-text) 18%, transparent)',
                color: 'var(--mq-muted)',
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

/**
 * The list layout is a printed menu line: name, dot leader, price. The grid
 * layout keeps a picture card, for venues that sell on the photograph.
 */
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

  if (grid) {
    return (
      <article
        className={clsx('relative flex flex-col overflow-hidden', cardClasses(theme), !item.isAvailable && 'opacity-50')}
      >
        {showImage ? (
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

        <div className="flex flex-1 flex-col p-3">
          <div className="flex items-center gap-1.5">
            <VegBadge isVeg={item.isVeg} />
            {item.isSpicy ? <SpiceMark /> : null}
            <h3
              className="truncate text-sm font-medium"
              style={{ fontFamily: 'var(--mq-font-body)', color: 'var(--mq-text)' }}
            >
              {item.name}
            </h3>
          </div>

          {item.description ? (
            <p className="mt-1 line-clamp-2 text-xs leading-snug" style={{ color: 'var(--mq-muted)' }}>
              {item.description}
            </p>
          ) : null}

          <div className="mt-auto pt-2">
            <Price item={item} currency={currency} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={clsx('py-3', !item.isAvailable && 'opacity-50')}>
      <div className="flex items-baseline gap-2">
        <VegBadge isVeg={item.isVeg} />
        {item.isSpicy ? <SpiceMark /> : null}

        <span className="text-[15px] font-medium" style={{ color: 'var(--mq-text)' }}>
          {item.name}
        </span>

        {/* The dot leader. What makes this read as a card and not a web list. */}
        <span
          aria-hidden="true"
          className="-translate-y-1 flex-1 border-b border-dotted"
          style={{ borderColor: 'color-mix(in srgb, var(--mq-text) 25%, transparent)' }}
        />

        {item.isAvailable ? (
          <Price item={item} currency={currency} />
        ) : (
          <span
            className="text-[9px] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'var(--mq-muted)' }}
          >
            Off today
          </span>
        )}
      </div>

      {item.description ? (
        <p className="mt-1.5 pl-[18px] text-[12.5px] leading-relaxed" style={{ color: 'var(--mq-muted)' }}>
          {item.description}
        </p>
      ) : null}

      {showImage ? (
        <div className="relative mt-2 ml-[18px] h-20 w-28 overflow-hidden">
          <Image src={item.imageUrl!} alt={item.name} fill sizes="112px" className="object-cover" />
        </div>
      ) : null}
    </article>
  );
}

function SpiceMark() {
  return (
    <span
      aria-label="Spicy"
      title="Spicy"
      className="inline-block h-1.5 w-1.5 shrink-0 rotate-45 self-center"
      style={{ background: '#c0453c' }}
    />
  );
}

function Price({ item, currency }: { item: PublicItem; currency: string }) {
  return (
    <span
      className="text-[17px] tabular-nums"
      style={{ fontFamily: 'var(--mq-font-heading)', color: 'var(--mq-primary)' }}
    >
      {formatPrice(item.price, currency)}
    </span>
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
    <section id={`cat-${category.id}`} className="scroll-mt-16 px-6 py-6">
      <div className="flex items-center gap-3">
        <h2
          className={clsx(
            'text-[10px] font-bold uppercase tracking-[0.28em]',
            headingClassName
          )}
          style={{ color: 'var(--mq-primary)' }}
        >
          {category.name}
        </h2>
        <span
          className="h-px flex-1"
          style={{ background: 'color-mix(in srgb, var(--mq-text) 15%, transparent)' }}
        />
        <span className="star h-1 w-1 rotate-45" style={{ background: 'var(--mq-secondary)' }} />
      </div>

      {category.description ? (
        <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--mq-muted)' }}>
          {category.description}
        </p>
      ) : null}

      <div
        className={clsx(
          'mt-3',
          theme.layout === 'grid' || theme.layout === 'magazine'
            ? 'grid grid-cols-2 gap-3'
            : 'flex flex-col'
        )}
      >
        {category.items.map((item, i) => (
          <div
            key={item.id}
            className={clsx(
              theme.layout === 'list' || theme.layout === 'compact'
                ? i < category.items.length - 1 && theme.showDividers
                  ? 'border-b'
                  : ''
                : ''
            )}
            style={{ borderColor: 'color-mix(in srgb, var(--mq-text) 9%, transparent)' }}
          >
            <ItemCard item={item} theme={theme} currency={currency} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function MenuFooter({ restaurant }: { restaurant: PublicRestaurant }) {
  const links = Object.entries(restaurant.socials).filter(([, v]) => Boolean(v)) as [string, string][];

  return (
    <footer className="mt-4 px-6 pb-16 pt-8 text-center">
      <div
        className="mx-auto mb-5 h-px w-12"
        style={{ background: 'color-mix(in srgb, var(--mq-text) 18%, transparent)' }}
      />

      {restaurant.phone ? (
        <p className="text-sm">
          <a href={`tel:${restaurant.phone}`} style={{ color: 'var(--mq-primary)' }}>
            {restaurant.phone}
          </a>
        </p>
      ) : null}

      {restaurant.openingHours ? (
        <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--mq-muted)' }}>
          {restaurant.openingHours}
        </p>
      ) : null}

      {links.length > 0 ? (
        <ul className="mt-5 flex flex-wrap justify-center gap-4">
          {links.map(([k, v]) => (
            <li key={k}>
              <a
                href={v}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ color: 'var(--mq-muted)' }}
              >
                {k}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-7 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--mq-muted)' }}>
        Menu by{' '}
        <Link href="/" className="underline underline-offset-4">
          {process.env.NEXT_PUBLIC_SITE_NAME || 'QR4Menu'}
        </Link>
      </p>
    </footer>
  );
}
