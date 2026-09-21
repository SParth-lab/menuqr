import type { Metadata } from 'next';
import { getOwnerRestaurant } from '@/lib/owner';
import { PageHeader } from '@/components/ui';
import { ProfileForm } from './ProfileForm';

export const metadata: Metadata = { title: 'Restaurant profile', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const r = await getOwnerRestaurant();

  return (
    <>
      <PageHeader
        title="Restaurant profile"
        description="This information appears on your public menu and in search results."
      />
      <ProfileForm
        initial={{
          name: r.name,
          tagline: r.tagline ?? '',
          description: r.description ?? '',
          logoUrl: r.logoUrl,
          coverUrl: r.coverUrl,
          address: r.address ?? '',
          city: r.city ?? '',
          state: r.state ?? '',
          country: r.country ?? '',
          phone: r.phone ?? '',
          email: r.email ?? '',
          currency: r.currency ?? 'INR',
          openingHours: r.openingHours ?? '',
          seoTitle: r.seoTitle ?? '',
          seoDescription: r.seoDescription ?? '',
          socials: {
            website: r.socials?.website ?? '',
            instagram: r.socials?.instagram ?? '',
            facebook: r.socials?.facebook ?? '',
            twitter: r.socials?.twitter ?? '',
            youtube: r.socials?.youtube ?? '',
            whatsapp: r.socials?.whatsapp ?? '',
          },
        }}
        slug={r.slug}
      />
    </>
  );
}
