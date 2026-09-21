import { revalidateTag, revalidatePath } from 'next/cache';
import { menuTag } from '@/lib/menu-data';

/**
 * Single place that invalidates a published menu. Every owner-side write calls this,
 * which is the other half of the ISR cost model in `menu-data.ts`.
 */
export function revalidateMenu(slug: string) {
  revalidateTag(menuTag(slug));
  revalidatePath(`/menu/${slug}`);
}
