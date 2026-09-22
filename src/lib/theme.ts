import type { CSSProperties } from 'react';
import type { FontKey, ThemeConfig } from '@/types';

export const FONT_STACKS: Record<FontKey, string> = {
  bodoni: 'var(--font-display), Didot, Georgia, serif',
  archivo: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
  playfair: "'Playfair Display', ui-serif, Georgia, serif",
  lora: "'Lora', ui-serif, Georgia, serif",
  poppins: "'Poppins', ui-sans-serif, system-ui, sans-serif",
  oswald: "'Oswald', ui-sans-serif, system-ui, sans-serif",
  dmsans: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
  inter: "'Inter', ui-sans-serif, system-ui, sans-serif",
};

export const FONT_LABELS: Record<FontKey, string> = {
  bodoni: 'Bodoni Moda — high-contrast didone',
  archivo: 'Archivo — grotesque, built for UI',
  playfair: 'Playfair Display — elegant serif',
  lora: 'Lora — warm serif',
  poppins: 'Poppins — geometric sans',
  oswald: 'Oswald — condensed display',
  dmsans: 'DM Sans — friendly sans',
  inter: 'Inter — neutral sans',
};

const RADIUS_PX: Record<ThemeConfig['radius'], string> = {
  none: '0px',
  sm: '4px',
  md: '10px',
  lg: '18px',
  full: '999px',
};

export const BASE_THEME: ThemeConfig = {
  primary: '#7e1620',
  secondary: '#b08a3c',
  background: '#f7f4ed',
  surface: '#ffffff',
  text: '#0b0a09',
  muted: '#6e675c',
  fontHeading: 'bodoni',
  fontBody: 'archivo',
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
    '--mq-font-heading': FONT_STACKS[t.fontHeading] ?? FONT_STACKS.bodoni,
    '--mq-font-body': FONT_STACKS[t.fontBody] ?? FONT_STACKS.archivo,
    '--mq-radius': RADIUS_PX[t.radius] ?? RADIUS_PX.md,
  } as CSSProperties;
}

export function cardClasses(t: ThemeConfig): string {
  switch (t.cardStyle) {
    case 'elevated':
      return 'bg-[var(--mq-surface)] shadow-[0_14px_30px_-22px_rgba(0,0,0,0.45)]';
    case 'outlined':
      return 'bg-[var(--mq-surface)] border border-[color-mix(in_srgb,var(--mq-text)_12%,transparent)]';
    case 'glass':
      return 'backdrop-blur-xl bg-[var(--mq-surface)] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)]';
    default:
      /* The house style: no box at all, just the rule under each line. */
      return 'bg-transparent';
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
export function googleFontsHref(t: ThemeConfig): string | null {
  /* bodoni and archivo are deliberately absent: next/font already self-hosts them. */
  const families: Partial<Record<FontKey, string>> = {
    playfair: 'Playfair+Display:wght@400;500;600;700',
    lora: 'Lora:wght@400;500;600;700',
    poppins: 'Poppins:wght@300;400;500;600;700',
    oswald: 'Oswald:wght@300;400;500;600',
    dmsans: 'DM+Sans:wght@400;500;700',
    inter: 'Inter:wght@400;500;600;700',
  };
  const unique = Array.from(new Set([t.fontHeading, t.fontBody])).filter(
    (f) => f in families
  );
  if (unique.length === 0) return null;

  const q = unique.map((f) => `family=${families[f]}`).join('&');
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}
