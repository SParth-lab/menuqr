import Image from 'next/image';
import clsx from 'clsx';
import {
  CategoryNav,
  CategorySection,
  MenuFooter,
  RestaurantHeader,
} from '@/components/menu/primitives';
import type { MenuRenderProps, TemplateMeta } from '@/templates/types';
import type { ThemeConfig } from '@/types';

/**
 * Structural knobs a template can vary. Everything else (colour, font, radius,
 * card style, layout) already comes from ThemeConfig, so a new template is
 * usually just a different combination of these plus a palette.
 */
export type TemplateOptions = {
  headerVariant?: 'standard' | 'hero' | 'compact';
  showCover?: boolean;
  showNav?: boolean;
  /** Decoration applied to each category heading. */
  headingStyle?: 'plain' | 'underline' | 'centered' | 'rule' | 'badge' | 'uppercase';
  /** Optional colour band behind the header. */
  headerBand?: boolean;
  maxWidth?: string;
};

const HEADING_CLASS: Record<NonNullable<TemplateOptions['headingStyle']>, string> = {
  plain: '',
  underline: 'inline-block border-b-4 pb-1 border-[var(--mq-primary)]',
  centered: 'text-center',
  rule: 'flex items-center gap-3 after:h-px after:flex-1 after:bg-current/20',
  badge:
    'inline-block rounded-full px-4 py-1 text-base bg-[var(--mq-primary)] text-white',
  uppercase: 'uppercase tracking-[0.18em] text-base',
};

export function createTemplate(
  meta: TemplateMeta,
  defaultConfig: ThemeConfig,
  options: TemplateOptions = {}
) {
  const {
    headerVariant = 'standard',
    showCover = false,
    showNav = true,
    headingStyle = 'plain',
    headerBand = false,
    maxWidth = 'max-w-2xl',
  } = options;

  function Component({ restaurant, categories, theme }: MenuRenderProps) {
    return (
      <div
        className={clsx('mx-auto min-h-screen', maxWidth)}
        style={{ background: 'var(--mq-bg)', color: 'var(--mq-text)', fontFamily: 'var(--mq-font-body)' }}
      >
        {showCover && restaurant.coverUrl ? (
          <div className="relative aspect-[16/7] w-full">
            <Image
              src={restaurant.coverUrl}
              alt={`${restaurant.name} cover`}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        <div
          style={
            headerBand
              ? { background: 'color-mix(in srgb, var(--mq-primary) 8%, transparent)' }
              : undefined
          }
        >
          <RestaurantHeader restaurant={restaurant} theme={theme} variant={headerVariant} />
        </div>

        {showNav ? <CategoryNav categories={categories} /> : null}

        <main>
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              theme={theme}
              currency={restaurant.currency}
              headingClassName={HEADING_CLASS[headingStyle]}
            />
          ))}

          {categories.length === 0 ? (
            <p className="px-5 py-16 text-center text-sm" style={{ color: 'var(--mq-muted)' }}>
              This menu is being prepared. Please check back shortly.
            </p>
          ) : null}
        </main>

        <MenuFooter restaurant={restaurant} />
      </div>
    );
  }

  Component.displayName = `Template(${meta.key})`;
  return { meta, defaultConfig, Component };
}
