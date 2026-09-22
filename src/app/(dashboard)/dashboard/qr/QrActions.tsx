'use client';

import { Button, Card } from '@/components/ui';

export function QrActions({
  slug,
  name,
  url,
  dataUrl,
}: {
  slug: string;
  name: string;
  url: string;
  dataUrl: string;
}) {
  function print() {
    const w = window.open('', '_blank', 'width=800,height=1000');
    if (!w) return;

    // A standalone document, so the dashboard's own styles cannot leak into the sheet.
    w.document.write(`<!doctype html><html><head><title>${name} — QR menu</title>
      <style>
        @page { margin: 16mm; }
        body { font-family: ui-sans-serif, system-ui, sans-serif; text-align: center; padding: 40px 20px; }
        h1 { font-size: 28px; margin: 0 0 6px; }
        p.sub { font-size: 14px; color: #555; margin: 0 0 28px; }
        img { width: 320px; height: 320px; }
        p.url { font-family: ui-monospace, monospace; font-size: 11px; color: #777; margin-top: 20px; word-break: break-all; }
      </style></head><body>
      <h1>${name}</h1>
      <p class="sub">Scan for our menu</p>
      <img src="${dataUrl}" alt="QR code" />
      <p class="url">${url}</p>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <Card>
      <h2 className="text-sm font-bold text-[var(--ink)]">Download</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`/api/qr/${slug}?format=png&size=1024&download=1`}
          className="inline-flex items-center rounded-lg bg-[var(--claret)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--claret-lift)]"
          download
        >
          PNG (1024px)
        </a>
        <a
          href={`/api/qr/${slug}?format=svg&download=1`}
          className="inline-flex items-center rounded-lg border border-[var(--line-hi)] bg-[var(--pane)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-soft)] hover:bg-[var(--ground-2)]"
          download
        >
          SVG (vector)
        </a>
        <Button variant="outline" onClick={print}>Print table card</Button>
      </div>
      <p className="mt-2 text-[11px] text-[var(--muted)]">
        PNG suits stickers and screens. SVG is what a print shop will ask for.
      </p>
    </Card>
  );
}
