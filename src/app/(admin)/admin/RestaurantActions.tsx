'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import type { RestaurantStatus } from '@/types';

/** Which transitions make sense from each state — nothing else is offered. */
const NEXT: Record<RestaurantStatus, RestaurantStatus[]> = {
  PENDING: ['APPROVED', 'REJECTED'],
  APPROVED: ['SUSPENDED'],
  REJECTED: ['APPROVED'],
  SUSPENDED: ['APPROVED'],
};

const LABEL: Record<RestaurantStatus, string> = {
  APPROVED: 'Approve',
  REJECTED: 'Reject',
  SUSPENDED: 'Suspend',
  PENDING: 'Move to pending',
};

export function RestaurantActions({
  id,
  status,
  showDelete = false,
}: {
  id: string;
  status: RestaurantStatus;
  showDelete?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(next: RestaurantStatus) {
    let rejectionReason: string | undefined;

    if (next === 'REJECTED') {
      const reason = window.prompt('Reason for rejection (shown to the owner):');
      if (reason === null) return;
      rejectionReason = reason;
    } else if (next === 'SUSPENDED' && !window.confirm('Suspend this restaurant? Its public menu goes offline immediately.')) {
      return;
    }

    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/restaurants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next, rejectionReason }),
    });
    setBusy(false);

    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? 'Could not update');
      return;
    }
    router.refresh();
  }

  async function remove() {
    const ok = window.confirm(
      'Delete this restaurant permanently? Its menu, analytics and owner account are removed. This cannot be undone.'
    );
    if (!ok) return;

    setBusy(true);
    const res = await fetch(`/api/admin/restaurants/${id}`, { method: 'DELETE' });
    setBusy(false);

    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? 'Could not delete');
      return;
    }
    router.push('/admin/restaurants');
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {NEXT[status].map((next) => (
        <Button
          key={next}
          size="sm"
          variant={next === 'APPROVED' ? 'primary' : next === 'REJECTED' ? 'danger' : 'outline'}
          disabled={busy}
          onClick={() => setStatus(next)}
        >
          {LABEL[next]}
        </Button>
      ))}

      {showDelete ? (
        <Button size="sm" variant="ghost" className="!text-red-600" disabled={busy} onClick={remove}>
          Delete
        </Button>
      ) : null}

      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
