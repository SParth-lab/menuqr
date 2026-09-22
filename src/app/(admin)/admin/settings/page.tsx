import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { isRemoteStorageConfigured } from '@/lib/storage';
import { Card, PageHeader } from '@/components/ui';
import { PasswordForm } from '@/components/dashboard/PasswordForm';
import { SignOutButton } from '@/components/dashboard/SignOutButton';

export const metadata: Metadata = { title: 'Settings', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminSettings() {
  const session = await auth();
  const adsense = Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
  const remoteStorage = isRemoteStorageConfigured();

  return (
    <>
      <PageHeader title="Settings" description="Admin account and platform configuration." />

      <div className="max-w-2xl space-y-5">
        <Card>
          <h2 className="text-sm font-bold text-[var(--ink)]">Account</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Name</dt><dd className="font-medium text-[var(--ink)]">{session?.user.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Email</dt><dd className="font-medium text-[var(--ink)]">{session?.user.email}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">Role</dt><dd className="font-medium text-[var(--ink)]">Super admin</dd></div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-[var(--ink)]">Platform configuration</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Image storage</dt>
              <dd className={remoteStorage ? 'font-medium text-[#7fc383]' : 'font-medium text-[var(--brass-lift)]'}>
                {remoteStorage ? 'Cloudflare R2' : 'Local disk (dev only)'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">AdSense</dt>
              <dd className={adsense ? 'font-medium text-[#7fc383]' : 'font-medium text-[var(--muted)]'}>
                {adsense ? 'Configured' : 'Not configured'}
              </dd>
            </div>
          </dl>
          {!remoteStorage ? (
            <p className="mt-3 rounded-lg bg-[rgba(176,138,60,0.13)] px-3 py-2 text-xs text-[var(--brass-lift)]">
              Uploads are written to the local filesystem, which does not survive a serverless
              deploy. Set the R2 variables before going to production.
            </p>
          ) : null}
          {!adsense ? (
            <p className="mt-3 rounded-lg bg-[var(--ground-2)] px-3 py-2 text-xs text-[var(--ink-soft)]">
              Ad slots render nothing until NEXT_PUBLIC_ADSENSE_CLIENT is set. Placements are
              already positioned on the home, blog, landing and city pages, and deliberately
              absent from restaurant menus.
            </p>
          ) : null}
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-[var(--ink)]">Change password</h2>
          <PasswordForm />
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-[var(--ink)]">Session</h2>
          <div className="mt-3"><SignOutButton /></div>
        </Card>
      </div>
    </>
  );
}
