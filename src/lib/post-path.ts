import type { PostType } from '@/types';

/**
 * Landing slugs carry their URL family as a prefix (`digital-menu-cafe`), so one
 * posts collection can back several route trees without slug collisions.
 */
export function postPath(type: PostType, slug: string): string {
  if (type === 'LANDING') {
    const m = slug.match(/^(digital-menu|qr-menu)-(.+)$/);
    return m ? `/${m[1]}/${m[2]}` : `/blog/${slug}`;
  }
  if (type === 'CITY') return `/city/${slug}`;
  return `/blog/${slug}`;
}
