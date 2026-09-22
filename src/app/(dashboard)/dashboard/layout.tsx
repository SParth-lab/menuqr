import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Restaurant } from '@/models';
import { Shell, type NavItem } from '@/components/dashboard/Shell';
import { StatusBadge } from '@/components/ui';

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/profile', label: 'Restaurant profile' },
  { href: '/dashboard/menu', label: 'Menu' },
  { href: '/dashboard/design', label: 'Design' },
  { href: '/dashboard/qr', label: 'QR code' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role === 'SUPER_ADMIN') redirect('/admin');

  await connectDB();
  const restaurant = await Restaurant.findOne({ ownerId: session.user.id })
    .select('name status')
    .lean();
  if (!restaurant) redirect('/login');

  return (
    <>
      <div className="orbfield" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
      </div>
      <Shell
      nav={NAV}
      title={restaurant.name}
      subtitle={session.user.email}
      badge={<StatusBadge status={restaurant.status} />}
    >
      {children}
      </Shell>
    </>
  );
}
