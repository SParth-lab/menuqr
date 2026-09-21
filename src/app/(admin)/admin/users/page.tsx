import type { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Restaurant, User } from '@/models';
import { Card, EmptyState, PageHeader, StatusBadge } from '@/components/ui';

export const metadata: Metadata = { title: 'Users', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminUsers() {
  await connectDB();

  const users = await User.find({}).sort({ createdAt: -1 }).limit(200).lean();
  const restaurants = await Restaurant.find({ ownerId: { $in: users.map((u) => u._id) } })
    .select('ownerId name status _id')
    .lean();
  const byOwner = new Map(restaurants.map((r) => [r.ownerId.toString(), r]));

  return (
    <>
      <PageHeader title="Users" description={`${users.length} accounts`} />

      {users.length === 0 ? (
        <EmptyState title="No users" body="Nobody has registered yet." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Name</th>
                <th className="px-4 py-2.5 font-semibold">Email</th>
                <th className="px-4 py-2.5 font-semibold">Role</th>
                <th className="px-4 py-2.5 font-semibold">Restaurant</th>
                <th className="px-4 py-2.5 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const r = byOwner.get(u._id.toString());
                return (
                  <tr key={u._id.toString()}>
                    <td className="px-4 py-2.5 font-medium text-slate-900">{u.name}</td>
                    <td className="px-4 py-2.5 text-slate-600">{u.email}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">
                      {u.role === 'SUPER_ADMIN' ? 'Super admin' : 'Owner'}
                    </td>
                    <td className="px-4 py-2.5">
                      {r ? (
                        <span className="flex items-center gap-2">
                          <Link href={`/admin/restaurants/${r._id}`} className="text-slate-800 hover:text-orange-700">
                            {r.name}
                          </Link>
                          <StatusBadge status={r.status} />
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
