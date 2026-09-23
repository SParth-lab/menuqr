import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Shell, type NavItem } from '@/components/dashboard/Shell';

const NAV: NavItem[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/approvals', label: 'Pending approvals' },
  { href: '/admin/restaurants', label: 'Restaurants' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/templates', label: 'Templates' },
  { href: '/admin/posts', label: 'Blog & SEO pages' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/settings', label: 'Settings' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'SUPER_ADMIN') redirect('/dashboard');

  return (
    <>
      <div className="orbfield" aria-hidden="true">
      </div>
      <Shell nav={NAV} title="Admin console" subtitle={session.user.email}>
      {children}
      </Shell>
    </>
  );
}
