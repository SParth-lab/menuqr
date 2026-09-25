/**
 * AdSense configuration.
 *
 * The publisher id switches the whole thing on. Individual placements stay dark
 * until a real ad-unit id is supplied: AdSense slot ids are numeric (e.g.
 * "1234567890"), so a placement name alone renders nothing and never emits a
 * malformed <ins> that would sit empty on the page.
 *
 * To light one up, create the unit in AdSense and set the matching env var.
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '';

export type Placement =
  | 'home-mid'
  | 'city-bottom'
  | 'cuisine-bottom'
  | 'blog-index-mid'
  | 'blog-post-bottom'
  | 'landing-mid';

const SLOTS: Record<Placement, string | undefined> = {
  'home-mid': process.env.NEXT_PUBLIC_ADSLOT_HOME_MID,
  'city-bottom': process.env.NEXT_PUBLIC_ADSLOT_CITY_BOTTOM,
  'cuisine-bottom': process.env.NEXT_PUBLIC_ADSLOT_CUISINE_BOTTOM,
  'blog-index-mid': process.env.NEXT_PUBLIC_ADSLOT_BLOG_INDEX_MID,
  'blog-post-bottom': process.env.NEXT_PUBLIC_ADSLOT_BLOG_POST_BOTTOM,
  'landing-mid': process.env.NEXT_PUBLIC_ADSLOT_LANDING_MID,
};

export function slotId(placement: Placement): string | undefined {
  const id = SLOTS[placement];
  // Guard against a placement name being pasted in where a unit id belongs.
  return id && /^\d{6,}$/.test(id) ? id : undefined;
}

export const adsEnabled = ADSENSE_CLIENT.startsWith('ca-pub-');
