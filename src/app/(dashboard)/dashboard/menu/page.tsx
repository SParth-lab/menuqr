import type { Metadata } from 'next';
import { Category, MenuItem } from '@/models';
import { getOwnerRestaurant } from '@/lib/owner';
import { PageHeader } from '@/components/ui';
import { MenuBuilder } from './MenuBuilder';

export const metadata: Metadata = { title: 'Menu', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const restaurant = await getOwnerRestaurant();

  const [categories, items] = await Promise.all([
    Category.find({ restaurantId: restaurant._id }).sort({ sortOrder: 1 }).lean(),
    MenuItem.find({ restaurantId: restaurant._id }).sort({ sortOrder: 1 }).lean(),
  ]);

  return (
    <>
      <PageHeader
        title="Menu"
        description="Categories hold items. Hidden categories and items never appear on the public menu."
      />
      <MenuBuilder
        currency={restaurant.currency ?? 'INR'}
        initialCategories={categories.map((c) => ({
          id: c._id.toString(),
          name: c.name,
          description: c.description ?? '',
          isVisible: c.isVisible,
        }))}
        initialItems={items.map((i) => ({
          id: i._id.toString(),
          categoryId: i.categoryId.toString(),
          name: i.name,
          description: i.description ?? '',
          price: i.price,
          imageUrl: i.imageUrl,
          isVeg: i.isVeg,
          isSpicy: i.isSpicy,
          isAvailable: i.isAvailable,
          isVisible: i.isVisible,
        }))}
      />
    </>
  );
}
