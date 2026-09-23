import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { getOwnerRestaurant } from '@/lib/owner';
import { publicMenuUrl } from '@/lib/qr';
import { Card, PageHeader, StatusBadge } from '@/components/ui';
import { PasswordForm } from '@/components/dashboard/PasswordForm';
import { SignOutButton } from '@/components/dashboard/SignOutButton';

export const metadata: Metadata = { title: 'Settings', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const restaurant = await getOwnerRestaurant();
  const session = await auth();

  return (
    <>
      <PageHeader title="Settings" description="Account and restaurant status." />

      <div className="max-w-2xl space-y-5">
        <Card>
          <h2 className="text-sm font-bold text-[var(--ink)]">Account</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Name</dt>
              <dd className="font-medium text-[var(--ink)]">{session?.user.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Email</dt>
              <dd className="font-medium text-[var(--ink)]">{session?.user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Role</dt>
              <dd className="font-medium text-[var(--ink)]">Restaurant owner</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-[var(--ink)]">Restaurant</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[var(--muted)]">Status</dt>
              <dd><StatusBadge status={restaurant.status} /></dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Public URL</dt>
              <dd className="break-all text-right font-mono text-xs text-[var(--ink-soft)]">
                {publicMenuUrl(restaurant.slug)}
              </dd>
            </div>
          </dl>
          {restaurant.status === 'REJECTED' && restaurant.rejectionReason ? (
            <p className="mt-3 rounded-lg bg-[var(--bad-bg)] px-3 py-2 text-xs text-[var(--bad)]">
              {restaurant.rejectionReason}
            </p>
          ) : null}
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-[var(--ink)]">Change password</h2>
          <PasswordForm />
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-[var(--ink)]">Session</h2>
          <p className="mt-1 text-xs text-[var(--ink-soft)]">Sign out of this device.</p>
          <div className="mt-3"><SignOutButton /></div>
        </Card>
      </div>
    </>
  );
}
