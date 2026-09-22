import type { Metadata } from 'next';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import { MenuItem, Restaurant, User } from '@/models';
import { Card, EmptyState, PageHeader, StatusBadge } from '@/components/ui';
import { RestaurantActions } from '../RestaurantActions';
import { RESTAURANT_STATUSES, type RestaurantStatus } from '@/types';

export const metadata: Metadata = { title: 'Restaurants', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ status?: string; q?: string }> };

export default async function AdminRestaurants({ searchParams }: Props) {
  const { status, q } = await searchParams;
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (status && RESTAURANT_STATUSES.includes(status as RestaurantStatus)) filter.status = status;
  if (q) {
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [{ name: new RegExp(safe, 'i') }, { slug: new RegExp(safe, 'i') }, { city: new RegExp(safe, 'i') }];
  }

  const rows = await Restaurant.find(filter).sort({ createdAt: -1 }).limit(100).lean();

  const [owners, counts] = await Promise.all([
    User.find({ _id: { $in: rows.map((r) => r.ownerId) } }).select('name email').lean(),
    MenuItem.aggregate([
      { $match: { restaurantId: { $in: rows.map((r) => r._id) } } },
      { $group: { _id: '$restaurantId', n: { $sum: 1 } } },
    ]),
  ]);
  const ownerById = new Map(owners.map((o) => [o._id.toString(), o]));
  const countById = new Map(counts.map((c) => [c._id.toString(), c.n as number]));

  return (
    <>
      <PageHeader title="Restaurants" description={`${rows.length} shown`} />

      <Card className="mb-5">
        <form className="flex flex-wrap gap-2" action="/admin/restaurants">
          <input
            name="q"
            defaultValue={q ?? ''}
            placeholder="Search name, slug or city"
            className="min-w-48 flex-1 rounded-lg border border-[var(--line-hi)] px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
          <select
            name="status"
            defaultValue={status ?? ''}
            className="rounded-lg border border-[var(--line-hi)] px-3 py-2 text-sm outline-none focus:border-orange-500"
          >
            <option value="">All statuses</option>
            {RESTAURANT_STATUSES.map((s) => (
              <option key={s} value={s}>{s.toLowerCase()}</option>
            ))}
          </select>
          <button className="btn btn-primary">Filter</button>
        </form>
      </Card>

      {rows.length === 0 ? (
        <EmptyState title="No restaurants match" body="Try clearing the filters or searching a different term." />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const owner = ownerById.get(r.ownerId.toString());
            return (
              <Card key={r._id.toString()} className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/restaurants/${r._id}`} className="text-sm font-bold text-[var(--ink)] hover:text-[var(--brass-lift)]">
                      {r.name}
                    </Link>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">
                    /menu/{r.slug}
                    {r.city ? ` · ${r.city}` : ''}
                    {` · ${countById.get(r._id.toString()) ?? 0} items`}
                  </p>
                  {owner ? (
                    <p className="text-xs text-[var(--muted)]">{owner.name} · {owner.email}</p>
                  ) : null}
                </div>

                <RestaurantActions id={r._id.toString()} status={r.status} />
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
