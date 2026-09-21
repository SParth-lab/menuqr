import type { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { Category, MenuItem, Restaurant, User } from '@/models';
import { Card, EmptyState, LinkButton, PageHeader } from '@/components/ui';
import { RestaurantActions } from '../RestaurantActions';

export const metadata: Metadata = { title: 'Pending approvals', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ApprovalsPage() {
  await connectDB();

  const pending = await Restaurant.find({ status: 'PENDING' }).sort({ createdAt: 1 }).lean();
  const ids = pending.map((r) => r._id);

  const [owners, itemCounts, categoryCounts] = await Promise.all([
    User.find({ _id: { $in: pending.map((r) => r.ownerId) } }).select('name email createdAt').lean(),
    MenuItem.aggregate([{ $match: { restaurantId: { $in: ids } } }, { $group: { _id: '$restaurantId', n: { $sum: 1 } } }]),
    Category.aggregate([{ $match: { restaurantId: { $in: ids } } }, { $group: { _id: '$restaurantId', n: { $sum: 1 } } }]),
  ]);

  const ownerById = new Map(owners.map((o) => [o._id.toString(), o]));
  const itemsById = new Map(itemCounts.map((c) => [c._id.toString(), c.n as number]));
  const catsById = new Map(categoryCounts.map((c) => [c._id.toString(), c.n as number]));

  return (
    <>
      <PageHeader
        title="Pending approvals"
        description="Approving a restaurant publishes its menu and makes its QR code work."
      />

      {pending.length === 0 ? (
        <EmptyState title="Nothing pending" body="Every registered restaurant has been reviewed." />
      ) : (
        <div className="space-y-4">
          {pending.map((r) => {
            const owner = ownerById.get(r.ownerId.toString());
            const items = itemsById.get(r._id.toString()) ?? 0;
            const cats = catsById.get(r._id.toString()) ?? 0;
            const thin = items < 5;

            return (
              <Card key={r._id.toString()}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/admin/restaurants/${r._id}`} className="text-base font-bold text-slate-900 hover:text-orange-700">
                      {r.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-500">
                      /menu/{r.slug}
                      {r.city ? ` · ${r.city}` : ''}
                      {` · registered ${new Date(r.createdAt).toLocaleDateString('en-GB')}`}
                    </p>
                    {owner ? <p className="text-xs text-slate-500">{owner.name} · {owner.email}</p> : null}
                    <p className="mt-2 text-xs text-slate-600">
                      {cats} {cats === 1 ? 'category' : 'categories'}, {items} {items === 1 ? 'item' : 'items'}
                      {thin ? (
                        <span className="ml-2 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                          thin menu
                        </span>
                      ) : null}
                    </p>
                    {thin ? (
                      <p className="mt-1 text-[11px] text-slate-500">
                        Under 5 items the public page stays noindex even once approved.
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <LinkButton href={`/admin/restaurants/${r._id}`} variant="outline" size="sm">
                      Review menu
                    </LinkButton>
                    <RestaurantActions id={r._id.toString()} status={r.status} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
