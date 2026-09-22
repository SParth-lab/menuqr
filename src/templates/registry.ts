import { createTemplate } from '@/templates/base';
import type { ThemeConfig } from '@/types';
import type { MenuRenderProps, TemplateMeta } from '@/templates/types';

export type TemplateEntry = {
  meta: TemplateMeta;
  defaultConfig: ThemeConfig;
  Component: (props: MenuRenderProps) => React.JSX.Element;
};

/**
 * THE extension point. A new template is one `createTemplate(...)` call here
 * (or its own file, imported here) — no migration, no schema change, no
 * touching the public menu route. This is what makes 50 templates cheap.
 */
export const templates: Record<string, TemplateEntry> = {
  modern: createTemplate(
    { key: 'modern', name: 'Modern', category: 'General', description: 'Bone paper, claret rules, dot leaders. The house default.' },
    {
      primary: '#7e1620', secondary: '#b08a3c', background: '#f7f4ed', surface: '#ffffff',
      text: '#0b0a09', muted: '#6e675c', fontHeading: 'bodoni', fontBody: 'archivo',
      radius: 'none', cardStyle: 'flat', buttonStyle: 'solid', layout: 'list',
      logoPosition: 'center', showImages: true, showDividers: true,

    },
    { headerVariant: 'standard', headingStyle: 'plain', showCover: true }
  ),

  minimal: createTemplate(
    { key: 'minimal', name: 'Minimal', category: 'General', description: 'Type only, no images, no ornament. Fastest to scan.' },
    {
      primary: '#0b0a09', secondary: '#6e675c', background: '#ffffff', surface: '#ffffff',
      text: '#0b0a09', muted: '#8a867e', fontHeading: 'archivo', fontBody: 'archivo',
      radius: 'none', cardStyle: 'flat', buttonStyle: 'outline', layout: 'compact',
      logoPosition: 'left', showImages: false, showDividers: false,

    },
    { headerVariant: 'compact', headingStyle: 'uppercase' }
  ),

  luxury: createTemplate(
    { key: 'luxury', name: 'Luxury', category: 'Fine dining', description: 'Brass on near-black, for a dim dining room.' },
    {
      primary: '#b08a3c', secondary: '#e8ce8a', background: '#0b0a09', surface: '#141210',
      text: '#f0ebe2', muted: '#867e70', fontHeading: 'bodoni', fontBody: 'archivo',
      radius: 'none', cardStyle: 'flat', buttonStyle: 'outline', layout: 'list',
      logoPosition: 'center', showImages: true, showDividers: true,

    },
    { headerVariant: 'hero', headingStyle: 'centered' }
  ),

  cafe: createTemplate(
    { key: 'cafe', name: 'Cafe', category: 'Cafe', description: 'Sepia stock and rust accents, built for daylight.' },
    {
      primary: '#a4622a', secondary: '#8a7a68', background: '#f4ecdf', surface: '#fbf6ee',
      text: '#3d3025', muted: '#8a7a68', fontHeading: 'bodoni', fontBody: 'archivo',
      radius: 'sm', cardStyle: 'flat', buttonStyle: 'pill', layout: 'list',
      logoPosition: 'center', showImages: true, showDividers: true,

    },
    { headerVariant: 'standard', headingStyle: 'rule', headerBand: true, showCover: true }
  ),

  'street-food': createTemplate(
    { key: 'street-food', name: 'Street Food', category: 'Casual', description: 'High contrast, picture-led grid for stalls and trucks.' },
    {
      primary: '#c0392f', secondary: '#b08a3c', background: '#fffaf2', surface: '#ffffff',
      text: '#18110d', muted: '#7a6f63', fontHeading: 'oswald', fontBody: 'archivo',
      radius: 'none', cardStyle: 'outlined', buttonStyle: 'solid', layout: 'grid',
      logoPosition: 'center', showImages: true, showDividers: false,

    },
    { headerVariant: 'standard', headingStyle: 'badge', headerBand: true }
  ),

  indian: createTemplate(
    { key: 'indian', name: 'Indian Restaurant', category: 'Cuisine', description: 'Terracotta and deep green, tuned for long veg and non-veg lists.' },
    {
      primary: '#9c3316', secondary: '#2e6b3a', background: '#fdf7ee', surface: '#ffffff',
      text: '#1c1713', muted: '#7a6f63', fontHeading: 'bodoni', fontBody: 'archivo',
      radius: 'none', cardStyle: 'flat', buttonStyle: 'solid', layout: 'list',
      logoPosition: 'center', showImages: true, showDividers: true,

    },
    { headerVariant: 'standard', headingStyle: 'underline', headerBand: true }
  ),

  dark: createTemplate(
    { key: 'dark', name: 'Dark', category: 'General', description: 'Cool near-black with an aged brass accent.' },
    {
      primary: '#a8894a', secondary: '#6e8f92', background: '#0e1013', surface: '#16191d',
      text: '#e7e2d8', muted: '#8b8a83', fontHeading: 'bodoni', fontBody: 'archivo',
      radius: 'none', cardStyle: 'flat', buttonStyle: 'ghost', layout: 'list',
      logoPosition: 'left', showImages: true, showDividers: false,

    },
    { headerVariant: 'standard', headingStyle: 'plain' }
  ),

  elegant: createTemplate(
    { key: 'elegant', name: 'Elegant', category: 'Fine dining', description: 'Ivory, centred, no photographs. Quiet and formal.' },
    {
      primary: '#0b0a09', secondary: '#9a8f7d', background: '#fcfaf5', surface: '#fcfaf5',
      text: '#1f1c18', muted: '#948c7f', fontHeading: 'bodoni', fontBody: 'archivo',
      radius: 'none', cardStyle: 'flat', buttonStyle: 'outline', layout: 'compact',
      logoPosition: 'center', showImages: false, showDividers: true,

    },
    { headerVariant: 'hero', headingStyle: 'centered', showNav: false }
  ),

  colorful: createTemplate(
    { key: 'colorful', name: 'Colorful', category: 'Casual', description: 'Plum and olive, image-forward without the noise.' },
    {
      primary: '#6b2d5c', secondary: '#8a9a5b', background: '#fdf8f3', surface: '#ffffff',
      text: '#241c26', muted: '#7d7382', fontHeading: 'bodoni', fontBody: 'archivo',
      radius: 'md', cardStyle: 'elevated', buttonStyle: 'pill', layout: 'grid',
      logoPosition: 'center', showImages: true, showDividers: false,

    },
    { headerVariant: 'standard', headingStyle: 'badge', headerBand: true, showCover: true }
  ),

  fastfood: createTemplate(
    { key: 'fastfood', name: 'Fast Food', category: 'Casual', description: 'Deep red and amber, condensed display, two-column grid.' },
    {
      primary: '#b3231f', secondary: '#e0a92b', background: '#ffffff', surface: '#fff8ee',
      text: '#141110', muted: '#726b63', fontHeading: 'oswald', fontBody: 'archivo',
      radius: 'none', cardStyle: 'flat', buttonStyle: 'solid', layout: 'grid',
      logoPosition: 'center', showImages: true, showDividers: false,

    },
    { headerVariant: 'standard', headingStyle: 'uppercase', headerBand: true }
  ),
};

export const DEFAULT_TEMPLATE_KEY = 'modern';

export function getTemplate(key: string | undefined): TemplateEntry {
  return templates[key ?? ''] ?? templates[DEFAULT_TEMPLATE_KEY];
}

export function listTemplates() {
  return Object.values(templates).map((t) => ({ ...t.meta, defaultConfig: t.defaultConfig }));
}
