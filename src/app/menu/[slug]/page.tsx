import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMenu } from '@/lib/menu-data';
import { getTemplate } from '@/templates/registry';
import { googleFontsHref, resolveTheme, themeToCssVars } from '@/lib/theme';
import { JsonLd } from '@/components/seo/JsonLd';
import { ViewTracker } from '@/components/menu/ViewTracker';
import type { ThemeConfig } from '@/types';

export const revalidate = 3600;
export const dynamicParams = true;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/** A near-empty menu is a thin page; Google should not index it until it has content. */
const MIN_ITEMS_TO_INDEX = 5;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMenu(slug);
  if (!data) return { title: 'Menu not found', robots: { index: false, follow: false } };

  const { restaurant, itemCount } = data;
  const where = restaurant.city ? ` in ${restaurant.city}` : '';
  const title = `${restaurant.name} Menu${where} — Prices & Dishes`;
  const description =
    restaurant.description?.slice(0, 155) ||
    `Browse the full ${restaurant.name} menu${where}: ${itemCount} dishes with current prices. Scan, view, order at the table.`;

  const indexable = itemCount >= MIN_ITEMS_TO_INDEX;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/menu/${restaurant.slug}` },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/menu/${restaurant.slug}`,
      type: 'website',
      images: restaurant.coverUrl || restaurant.logoUrl ? [{ url: (restaurant.coverUrl || restaurant.logoUrl)! }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params;
  const data = await getMenu(slug);
  if (!data) notFound();

  const { restaurant, categories, design } = data;
  const template = getTemplate(design.templateKey);
  const theme = resolveTheme(template.defaultConfig, design.config as Partial<ThemeConfig>);
  const { Component } = template;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    url: `${siteUrl}/menu/${restaurant.slug}`,
    ...(restaurant.logoUrl ? { image: restaurant.logoUrl, logo: restaurant.logoUrl } : {}),
    ...(restaurant.description ? { description: restaurant.description } : {}),
    ...(restaurant.phone ? { telephone: restaurant.phone } : {}),
    ...(restaurant.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: restaurant.address,
            ...(restaurant.city ? { addressLocality: restaurant.city } : {}),
          },
        }
      : {}),
    ...(Object.values(restaurant.socials).filter(Boolean).length
      ? { sameAs: Object.values(restaurant.socials).filter(Boolean) }
      : {}),
    hasMenu: {
      '@type': 'Menu',
      name: `${restaurant.name} Menu`,
      hasMenuSection: categories.map((c) => ({
        '@type': 'MenuSection',
        name: c.name,
        ...(c.description ? { description: c.description } : {}),
        hasMenuItem: c.items.map((i) => ({
          '@type': 'MenuItem',
          name: i.name,
          ...(i.description ? { description: i.description } : {}),
          offers: {
            '@type': 'Offer',
            price: i.price,
            priceCurrency: restaurant.currency,
            availability: i.isAvailable
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          },
          ...(i.isVeg ? { suitableForDiet: 'https://schema.org/VegetarianDiet' } : {}),
        })),
      })),
    },
  };

  return (
    <>
      {/* Only the fonts this template resolves to are fetched. */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={googleFontsHref(theme)} />
      <JsonLd data={schema} />

      <div style={themeToCssVars(theme)}>
        <Component restaurant={restaurant} categories={categories} theme={theme} />
      </div>

      <ViewTracker restaurantId={restaurant.id} />
    </>
  );
}
