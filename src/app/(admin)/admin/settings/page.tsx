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
          <h2 className="text-sm font-bold text-slate-900">Account</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Name</dt><dd className="font-medium text-slate-900">{session?.user.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{session?.user.email}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Role</dt><dd className="font-medium text-slate-900">Super admin</dd></div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-slate-900">Platform configuration</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Image storage</dt>
              <dd className={remoteStorage ? 'font-medium text-emerald-700' : 'font-medium text-amber-700'}>
                {remoteStorage ? 'Cloudflare R2' : 'Local disk (dev only)'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">AdSense</dt>
              <dd className={adsense ? 'font-medium text-emerald-700' : 'font-medium text-slate-500'}>
                {adsense ? 'Configured' : 'Not configured'}
              </dd>
            </div>
          </dl>
          {!remoteStorage ? (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Uploads are written to the local filesystem, which does not survive a serverless
              deploy. Set the R2 variables before going to production.
            </p>
          ) : null}
          {!adsense ? (
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
              Ad slots render nothing until NEXT_PUBLIC_ADSENSE_CLIENT is set. Placements are
              already positioned on the home, blog, landing and city pages, and deliberately
              absent from restaurant menus.
            </p>
          ) : null}
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-slate-900">Change password</h2>
          <PasswordForm />
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-slate-900">Session</h2>
          <div className="mt-3"><SignOutButton /></div>
        </Card>
      </div>
    </>
  );
}
