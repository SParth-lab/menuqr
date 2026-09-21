import type { Metadata } from 'next';
import { Category, MenuItem } from '@/models';
import { getOwnerRestaurant } from '@/lib/owner';
import { PageHeader } from '@/components/ui';
import { listTemplates } from '@/templates/registry';
import { DesignStudio } from './DesignStudio';
import type { PublicCategory } from '@/templates/types';

export const metadata: Metadata = { title: 'Design', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

/** Shown in the preview before an owner has entered any items of their own. */
const SAMPLE: PublicCategory[] = [
  {
    id: 'sample-1',
    name: 'Starters',
    items: [
      { id: 's1', name: 'Paneer Tikka', description: 'Char-grilled cottage cheese, mint chutney', price: 280, isVeg: true, isSpicy: true, isAvailable: true },
      { id: 's2', name: 'Chicken 65', description: 'Crisp fried chicken, curry leaf, red chilli', price: 320, isVeg: false, isSpicy: true, isAvailable: true },
    ],
  },
  {
    id: 'sample-2',
    name: 'Main Course',
    items: [
      { id: 's3', name: 'Butter Chicken', description: 'Tandoori chicken in a tomato butter gravy', price: 420, isVeg: false, isSpicy: false, isAvailable: true },
      { id: 's4', name: 'Dal Makhani', description: 'Black lentils simmered overnight', price: 300, isVeg: true, isSpicy: false, isAvailable: false },
    ],
  },
];

export default async function DesignPage() {
  const restaurant = await getOwnerRestaurant();

  const [categories, items] = await Promise.all([
    Category.find({ restaurantId: restaurant._id, isVisible: true }).sort({ sortOrder: 1 }).limit(3).lean(),
    MenuItem.find({ restaurantId: restaurant._id, isVisible: true }).sort({ sortOrder: 1 }).limit(12).lean(),
  ]);

  const real: PublicCategory[] = categories
    .map((c) => ({
      id: c._id.toString(),
      name: c.name,
      description: c.description,
      items: items
        .filter((i) => i.categoryId.toString() === c._id.toString())
        .slice(0, 4)
        .map((i) => ({
          id: i._id.toString(),
          name: i.name,
          description: i.description,
          price: i.price,
          imageUrl: i.imageUrl,
          isVeg: i.isVeg,
          isSpicy: i.isSpicy,
          isAvailable: i.isAvailable,
        })),
    }))
    .filter((c) => c.items.length > 0);

  return (
    <>
      <PageHeader
        title="Design"
        description="Pick a template, then change anything. The preview updates as you edit; nothing is public until you save."
      />
      <DesignStudio
        templates={listTemplates()}
        initialDesign={{
          templateKey: restaurant.design?.templateKey ?? 'modern',
          isCustom: restaurant.design?.isCustom ?? false,
          config: restaurant.design?.config ?? {},
        }}
        preview={{
          restaurant: {
            id: restaurant._id.toString(),
            name: restaurant.name,
            slug: restaurant.slug,
            tagline: restaurant.tagline,
            logoUrl: restaurant.logoUrl,
            coverUrl: restaurant.coverUrl,
            address: restaurant.address,
            city: restaurant.city,
            phone: restaurant.phone,
            currency: restaurant.currency ?? 'INR',
            openingHours: restaurant.openingHours,
            socials: restaurant.socials ?? {},
          },
          categories: real.length > 0 ? real : SAMPLE,
          usingSample: real.length === 0,
        }}
      />
    </>
  );
}
