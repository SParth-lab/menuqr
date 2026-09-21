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
    { key: 'modern', name: 'Modern', category: 'General', description: 'Clean cards, bold price accents, works for almost any venue.' },
    {
      primary: '#2563eb', secondary: '#1e40af', background: '#ffffff', surface: '#f8fafc',
      text: '#0f172a', muted: '#64748b', fontHeading: 'poppins', fontBody: 'inter',
      radius: 'lg', cardStyle: 'elevated', buttonStyle: 'solid', layout: 'list',
      logoPosition: 'center', showImages: true, showDividers: true,
    },
    { headerVariant: 'standard', headingStyle: 'plain', showCover: true }
  ),

  minimal: createTemplate(
    { key: 'minimal', name: 'Minimal', category: 'General', description: 'Type-led, no images, maximum scan speed.' },
    {
      primary: '#111827', secondary: '#374151', background: '#ffffff', surface: '#ffffff',
      text: '#111827', muted: '#9ca3af', fontHeading: 'inter', fontBody: 'inter',
      radius: 'none', cardStyle: 'flat', buttonStyle: 'outline', layout: 'compact',
      logoPosition: 'left', showImages: false, showDividers: false,
    },
    { headerVariant: 'compact', headingStyle: 'uppercase' }
  ),

  luxury: createTemplate(
    { key: 'luxury', name: 'Luxury', category: 'Fine dining', description: 'Gold on charcoal, serif headings, generous spacing.' },
    {
      primary: '#c9a227', secondary: '#8a6d1f', background: '#12100e', surface: '#1b1815',
      text: '#f5f0e6', muted: '#a89f8c', fontHeading: 'playfair', fontBody: 'lora',
      radius: 'sm', cardStyle: 'outlined', buttonStyle: 'outline', layout: 'list',
      logoPosition: 'center', showImages: true, showDividers: true,
    },
    { headerVariant: 'hero', headingStyle: 'centered' }
  ),

  cafe: createTemplate(
    { key: 'cafe', name: 'Cafe', category: 'Cafe', description: 'Warm cream and espresso tones for coffee shops and bakeries.' },
    {
      primary: '#8b5e34', secondary: '#c08552', background: '#fdf8f3', surface: '#ffffff',
      text: '#3b2f2a', muted: '#8d7b70', fontHeading: 'lora', fontBody: 'dmsans',
      radius: 'lg', cardStyle: 'elevated', buttonStyle: 'pill', layout: 'list',
      logoPosition: 'center', showImages: true, showDividers: true,
    },
    { headerVariant: 'standard', headingStyle: 'rule', headerBand: true, showCover: true }
  ),

  'street-food': createTemplate(
    { key: 'street-food', name: 'Street Food', category: 'Casual', description: 'High-contrast and punchy, built for stalls and food trucks.' },
    {
      primary: '#ef4444', secondary: '#f59e0b', background: '#fffbeb', surface: '#ffffff',
      text: '#1c1917', muted: '#78716c', fontHeading: 'oswald', fontBody: 'dmsans',
      radius: 'md', cardStyle: 'outlined', buttonStyle: 'solid', layout: 'grid',
      logoPosition: 'center', showImages: true, showDividers: false,
    },
    { headerVariant: 'standard', headingStyle: 'badge', headerBand: true }
  ),

  indian: createTemplate(
    { key: 'indian', name: 'Indian Restaurant', category: 'Cuisine', description: 'Saffron and deep green, tuned for large veg/non-veg menus.' },
    {
      primary: '#c2410c', secondary: '#15803d', background: '#fffaf5', surface: '#ffffff',
      text: '#1f2937', muted: '#78716c', fontHeading: 'poppins', fontBody: 'inter',
      radius: 'md', cardStyle: 'outlined', buttonStyle: 'solid', layout: 'list',
      logoPosition: 'center', showImages: true, showDividers: true,
    },
    { headerVariant: 'standard', headingStyle: 'underline', headerBand: true }
  ),

  dark: createTemplate(
    { key: 'dark', name: 'Dark', category: 'General', description: 'True dark surface — easy on the eyes in dim dining rooms.' },
    {
      primary: '#22d3ee', secondary: '#0891b2', background: '#0b0f14', surface: '#151b23',
      text: '#e6edf3', muted: '#8b98a5', fontHeading: 'inter', fontBody: 'inter',
      radius: 'lg', cardStyle: 'elevated', buttonStyle: 'ghost', layout: 'list',
      logoPosition: 'left', showImages: true, showDividers: false,
    },
    { headerVariant: 'standard', headingStyle: 'plain' }
  ),

  elegant: createTemplate(
    { key: 'elegant', name: 'Elegant', category: 'Fine dining', description: 'Ivory, thin rules, centred serif — quiet and formal.' },
    {
      primary: '#1f2937', secondary: '#6b7280', background: '#fcfaf7', surface: '#fcfaf7',
      text: '#1f2937', muted: '#9ca3af', fontHeading: 'playfair', fontBody: 'lora',
      radius: 'none', cardStyle: 'flat', buttonStyle: 'outline', layout: 'compact',
      logoPosition: 'center', showImages: false, showDividers: true,
    },
    { headerVariant: 'hero', headingStyle: 'centered', showNav: false }
  ),

  colorful: createTemplate(
    { key: 'colorful', name: 'Colorful', category: 'Casual', description: 'Playful violet and lime, image-forward grid.' },
    {
      primary: '#7c3aed', secondary: '#84cc16', background: '#faf5ff', surface: '#ffffff',
      text: '#1e1b4b', muted: '#7c7799', fontHeading: 'poppins', fontBody: 'dmsans',
      radius: 'full', cardStyle: 'elevated', buttonStyle: 'pill', layout: 'grid',
      logoPosition: 'center', showImages: true, showDividers: false,
    },
    { headerVariant: 'standard', headingStyle: 'badge', headerBand: true, showCover: true }
  ),

  fastfood: createTemplate(
    { key: 'fastfood', name: 'Fast Food', category: 'Casual', description: 'Big images, red-yellow energy, two-column grid.' },
    {
      primary: '#dc2626', secondary: '#facc15', background: '#ffffff', surface: '#fff7ed',
      text: '#18181b', muted: '#71717a', fontHeading: 'oswald', fontBody: 'inter',
      radius: 'md', cardStyle: 'flat', buttonStyle: 'solid', layout: 'grid',
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
