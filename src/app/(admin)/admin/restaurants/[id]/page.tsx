import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { Category, DailyStat, MenuItem, Restaurant, User } from '@/models';
import { formatPrice } from '@/lib/format';
import { publicMenuUrl } from '@/lib/qr';
import { Card, PageHeader, StatCard, StatusBadge } from '@/components/ui';
import { RestaurantActions } from '../../RestaurantActions';

export const metadata: Metadata = { title: 'Restaurant', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function AdminRestaurantDetail({ params }: Props) {
  const { id } = await params;
  await connectDB();

  const restaurant = await Restaurant.findById(id).lean().catch(() => null);
  if (!restaurant) notFound();

  const [owner, categories, items, stats] = await Promise.all([
    User.findById(restaurant.ownerId).select('name email createdAt isActive').lean(),
    Category.find({ restaurantId: id }).sort({ sortOrder: 1 }).lean(),
    MenuItem.find({ restaurantId: id }).sort({ sortOrder: 1 }).lean(),
    DailyStat.aggregate([
      { $match: { restaurantId: restaurant._id } },
      { $group: { _id: null, views: { $sum: '$views' }, qrScans: { $sum: '$qrScans' } } },
    ]),
  ]);

  const itemsByCategory = new Map<string, typeof items>();
  for (const c of categories) itemsByCategory.set(c._id.toString(), []);
  for (const i of items) itemsByCategory.get(i.categoryId.toString())?.push(i);

  return (
    <>
      <PageHeader
        title={restaurant.name}
        description={publicMenuUrl(restaurant.slug)}
        action={<RestaurantActions id={id} status={restaurant.status} showDelete />}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Status" value={restaurant.status.toLowerCase()} />
        <StatCard label="Categories" value={categories.length} />
        <StatCard label="Items" value={items.length} />
        <StatCard label="Views (all time)" value={stats[0]?.views ?? 0} hint={`${stats[0]?.qrScans ?? 0} QR scans`} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-sm font-bold text-slate-900">Owner</h2>
          {owner ? (
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Name</dt><dd className="font-medium text-slate-900">{owner.name}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{owner.email}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Registered</dt><dd className="text-slate-700">{new Date(owner.createdAt).toLocaleDateString('en-GB')}</dd></div>
            </dl>
          ) : (
            <p className="mt-2 text-sm text-red-600">Owner account is missing.</p>
          )}
        </Card>

        <Card>
          <h2 className="text-sm font-bold text-slate-900">Details</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Slug</dt><dd className="font-mono text-xs text-slate-700">{restaurant.slug}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">City</dt><dd className="text-slate-700">{restaurant.city || '—'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Phone</dt><dd className="text-slate-700">{restaurant.phone || '—'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Template</dt><dd className="text-slate-700">{restaurant.design?.templateKey}{restaurant.design?.isCustom ? ' (customised)' : ''}</dd></div>
            <div className="flex items-center justify-between gap-4"><dt className="text-slate-500">Public page</dt>
              <dd>
                {restaurant.status === 'APPROVED' ? (
                  <Link href={`/menu/${restaurant.slug}`} target="_blank" className="text-xs font-medium text-orange-700 hover:underline">
                    Open menu
                  </Link>
                ) : (
                  <StatusBadge status={restaurant.status} />
                )}
              </dd>
            </div>
          </dl>
          {restaurant.rejectionReason ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              Rejection reason: {restaurant.rejectionReason}
            </p>
          ) : null}
        </Card>
      </div>

      <Card className="mt-5">
        <h2 className="text-sm font-bold text-slate-900">Menu</h2>
        {categories.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No categories created yet.</p>
        ) : (
          <div className="mt-3 space-y-4">
            {categories.map((c) => {
              const catItems = itemsByCategory.get(c._id.toString()) ?? [];
              return (
                <div key={c._id.toString()}>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    {c.name}
                    {!c.isVisible ? <span className="ml-2 font-normal normal-case text-amber-600">hidden</span> : null}
                  </h3>
                  {catItems.length === 0 ? (
                    <p className="mt-1 text-xs text-slate-400">No items.</p>
                  ) : (
                    <ul className="mt-1 divide-y divide-slate-100">
                      {catItems.map((i) => (
                        <li key={i._id.toString()} className="flex items-center justify-between gap-3 py-1.5 text-sm">
                          <span className="min-w-0">
                            <span className="text-slate-800">{i.name}</span>
                            {!i.isAvailable ? <span className="ml-2 text-xs text-slate-400">unavailable</span> : null}
                            {!i.isVisible ? <span className="ml-2 text-xs text-amber-600">hidden</span> : null}
                          </span>
                          <span className="shrink-0 font-medium text-slate-900">
                            {formatPrice(i.price, restaurant.currency ?? 'INR')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}
