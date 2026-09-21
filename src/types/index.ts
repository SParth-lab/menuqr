export const ROLES = ['SUPER_ADMIN', 'RESTAURANT_OWNER'] as const;
export type Role = (typeof ROLES)[number];

export const RESTAURANT_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'] as const;
export type RestaurantStatus = (typeof RESTAURANT_STATUSES)[number];

export const VIEW_SOURCES = ['QR', 'DIRECT', 'SEARCH', 'SOCIAL'] as const;
export type ViewSource = (typeof VIEW_SOURCES)[number];

export const POST_TYPES = ['BLOG', 'LANDING', 'CITY', 'CATEGORY', 'GUIDE'] as const;
export type PostType = (typeof POST_TYPES)[number];

export const POST_STATUSES = ['DRAFT', 'PUBLISHED'] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const FONT_KEYS = ['inter', 'playfair', 'poppins', 'lora', 'oswald', 'dmsans'] as const;
export type FontKey = (typeof FONT_KEYS)[number];

export const RADII = ['none', 'sm', 'md', 'lg', 'full'] as const;
export const CARD_STYLES = ['flat', 'elevated', 'outlined', 'glass'] as const;
export const BUTTON_STYLES = ['solid', 'outline', 'ghost', 'pill'] as const;
export const LAYOUTS = ['list', 'grid', 'compact', 'magazine'] as const;
export const LOGO_POSITIONS = ['left', 'center', 'right'] as const;

/**
 * The full theme contract. Every template reads only from here, and every value is
 * emitted as a CSS custom property, so customisation costs no extra JavaScript.
 */
export type ThemeConfig = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
  fontHeading: FontKey;
  fontBody: FontKey;
  radius: (typeof RADII)[number];
  cardStyle: (typeof CARD_STYLES)[number];
  buttonStyle: (typeof BUTTON_STYLES)[number];
  layout: (typeof LAYOUTS)[number];
  logoPosition: (typeof LOGO_POSITIONS)[number];
  showImages: boolean;
  showDividers: boolean;
};
