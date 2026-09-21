import type { CSSProperties } from 'react';
import type { FontKey, ThemeConfig } from '@/types';

export const FONT_STACKS: Record<FontKey, string> = {
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
  playfair: "'Playfair Display', ui-serif, Georgia, serif",
  poppins: "'Poppins', ui-sans-serif, system-ui, sans-serif",
  lora: "'Lora', ui-serif, Georgia, serif",
  oswald: "'Oswald', ui-sans-serif, system-ui, sans-serif",
  dmsans: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
};

export const FONT_LABELS: Record<FontKey, string> = {
  inter: 'Inter — clean sans',
  playfair: 'Playfair Display — elegant serif',
  poppins: 'Poppins — geometric sans',
  lora: 'Lora — warm serif',
  oswald: 'Oswald — condensed display',
  dmsans: 'DM Sans — friendly sans',
};

const RADIUS_PX: Record<ThemeConfig['radius'], string> = {
  none: '0px',
  sm: '4px',
  md: '10px',
  lg: '18px',
  full: '999px',
};

export const BASE_THEME: ThemeConfig = {
  primary: '#111827',
  secondary: '#6b7280',
  background: '#ffffff',
  surface: '#f9fafb',
  text: '#111827',
  muted: '#6b7280',
  fontHeading: 'inter',
  fontBody: 'inter',
  radius: 'md',
  cardStyle: 'flat',
  buttonStyle: 'solid',
  layout: 'list',
  logoPosition: 'center',
  showImages: true,
  showDividers: true,
};

/** Template default < owner overrides. Missing keys always fall back, never crash. */
export function resolveTheme(
  templateDefaults: Partial<ThemeConfig> | undefined,
  overrides: Partial<ThemeConfig> | undefined
): ThemeConfig {
  return { ...BASE_THEME, ...(templateDefaults ?? {}), ...(overrides ?? {}) };
}

/**
 * The whole customisation system reduces to this: the resolved theme becomes CSS
 * custom properties on the menu root, and every template reads `var(--mq-*)`.
 * Changing a colour therefore repaints without re-rendering a single component.
 */
export function themeToCssVars(t: ThemeConfig): CSSProperties {
  return {
    '--mq-primary': t.primary,
    '--mq-secondary': t.secondary,
    '--mq-bg': t.background,
    '--mq-surface': t.surface,
    '--mq-text': t.text,
    '--mq-muted': t.muted,
    '--mq-font-heading': FONT_STACKS[t.fontHeading] ?? FONT_STACKS.inter,
    '--mq-font-body': FONT_STACKS[t.fontBody] ?? FONT_STACKS.inter,
    '--mq-radius': RADIUS_PX[t.radius] ?? RADIUS_PX.md,
  } as CSSProperties;
}

export function cardClasses(t: ThemeConfig): string {
  switch (t.cardStyle) {
    case 'elevated':
      return 'shadow-md shadow-black/5 bg-[var(--mq-surface)]';
    case 'outlined':
      return 'border border-black/10 bg-[var(--mq-surface)]';
    case 'glass':
      return 'backdrop-blur-md bg-white/10 border border-white/20';
    default:
      return 'bg-[var(--mq-surface)]';
  }
}

export function buttonClasses(t: ThemeConfig): string {
  switch (t.buttonStyle) {
    case 'outline':
      return 'border-2 border-[var(--mq-primary)] text-[var(--mq-primary)] bg-transparent';
    case 'ghost':
      return 'text-[var(--mq-primary)] bg-[var(--mq-primary)]/10';
    case 'pill':
      return 'bg-[var(--mq-primary)] text-white !rounded-full';
    default:
      return 'bg-[var(--mq-primary)] text-white';
  }
}

/** Only the fonts a template actually uses are requested, so no unused font blocks paint. */
export function googleFontsHref(t: ThemeConfig): string {
  const families: Record<FontKey, string> = {
    inter: 'Inter:wght@400;500;600;700',
    playfair: 'Playfair+Display:wght@400;500;600;700',
    poppins: 'Poppins:wght@300;400;500;600;700',
    lora: 'Lora:wght@400;500;600;700',
    oswald: 'Oswald:wght@300;400;500;600',
    dmsans: 'DM+Sans:wght@400;500;700',
  };
  const unique = Array.from(new Set([t.fontHeading, t.fontBody]));
  const q = unique.map((f) => `family=${families[f] ?? families.inter}`).join('&');
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}
