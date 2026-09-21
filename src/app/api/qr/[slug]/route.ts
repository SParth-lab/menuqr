import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Restaurant } from '@/models';
import { qrPngBuffer, qrSvgString } from '@/lib/qr';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const { slug } = await params;
  const url = new URL(req.url);
  const format = url.searchParams.get('format') === 'svg' ? 'svg' : 'png';
  const size = Math.min(Math.max(Number(url.searchParams.get('size')) || 1024, 128), 2048);
  const download = url.searchParams.get('download') === '1';

  await connectDB();
  const restaurant = await Restaurant.findOne({ slug }).select('slug name').lean();
  if (!restaurant) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const filename = `${slug}-qr.${format}`;
  // The QR encodes only a URL, so the image never changes for a given slug.
  const headers: Record<string, string> = {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${filename}"`,
  };

  if (format === 'svg') {
    const svg = await qrSvgString(slug, { size });
    return new NextResponse(svg, { headers: { ...headers, 'Content-Type': 'image/svg+xml' } });
  }

  const png = await qrPngBuffer(slug, { size });
  return new NextResponse(new Uint8Array(png), { headers: { ...headers, 'Content-Type': 'image/png' } });
}
