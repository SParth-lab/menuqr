import type { ThemeConfig } from '@/types';

export type PublicItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isVeg: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
};

export type PublicCategory = {
  id: string;
  name: string;
  description?: string;
  items: PublicItem[];
};

export type PublicRestaurant = {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  logoUrl?: string;
  coverUrl?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  currency: string;
  openingHours?: string;
  socials: Record<string, string | undefined>;
};

export type MenuRenderProps = {
  restaurant: PublicRestaurant;
  categories: PublicCategory[];
  theme: ThemeConfig;
};

export type TemplateMeta = {
  key: string;
  name: string;
  category: string;
  description: string;
};
