import type { Metadata } from 'next';
import { getOwnerRestaurant } from '@/lib/owner';
import { publicMenuUrl, qrDataUrl } from '@/lib/qr';
import { Card, PageHeader } from '@/components/ui';
import { QrActions } from './QrActions';

export const metadata: Metadata = { title: 'QR code', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function QrPage() {
  const restaurant = await getOwnerRestaurant();
  const url = publicMenuUrl(restaurant.slug);
  // Rendered inline so the page needs no extra request to show the code.
  const dataUrl = await qrDataUrl(restaurant.slug, { size: 600 });

  return (
    <>
      <PageHeader
        title="QR code"
        description="This code points at your menu URL. It never changes unless you rename your restaurant, so you can reprint at will."
      />

      {restaurant.status !== 'APPROVED' ? (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Your menu is not public yet, so this code will not open for guests until your
          restaurant is approved. The code itself will not change.
        </div>
      ) : null}

      <div className="grid max-w-3xl gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- data URL, no optimisation possible */}
          <img src={dataUrl} alt={`QR code for ${restaurant.name}`} width={220} height={220} className="mx-auto" />
          <p className="mt-2 text-xs font-semibold text-slate-900">{restaurant.name}</p>
          <p className="text-[11px] text-slate-500">Scan for menu</p>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-bold text-slate-900">Menu URL</h2>
            <p className="mt-2 break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">{url}</p>
          </Card>

          <QrActions slug={restaurant.slug} name={restaurant.name} url={url} dataUrl={dataUrl} />

          <Card>
            <h2 className="text-sm font-bold text-slate-900">Printing notes</h2>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-slate-600">
              <li>Print at 3 cm across or larger so it scans from table distance.</li>
              <li>Keep a white margin around the code and never invert the colours.</li>
              <li>Use the SVG for anything a printer produces — it stays sharp at any size.</li>
              <li>Test the scan at the table, in your own lighting, before printing a batch.</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
