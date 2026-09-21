import QRCode from 'qrcode';

export function publicMenuUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/menu/${slug}`;
}

/** `?src=qr` is what separates a scan from a plain visit in analytics. */
export function qrTargetUrl(slug: string): string {
  return `${publicMenuUrl(slug)}?src=qr`;
}

type QrOpts = { size?: number; dark?: string; light?: string; margin?: number };

export function qrPngBuffer(slug: string, opts: QrOpts = {}): Promise<Buffer> {
  return QRCode.toBuffer(qrTargetUrl(slug), {
    type: 'png',
    width: opts.size ?? 1024,
    margin: opts.margin ?? 2,
    errorCorrectionLevel: 'M',
    color: { dark: opts.dark ?? '#000000', light: opts.light ?? '#FFFFFF' },
  });
}

export function qrSvgString(slug: string, opts: QrOpts = {}): Promise<string> {
  return QRCode.toString(qrTargetUrl(slug), {
    type: 'svg',
    width: opts.size ?? 1024,
    margin: opts.margin ?? 2,
    errorCorrectionLevel: 'M',
    color: { dark: opts.dark ?? '#000000', light: opts.light ?? '#FFFFFF' },
  });
}

export function qrDataUrl(slug: string, opts: QrOpts = {}): Promise<string> {
  return QRCode.toDataURL(qrTargetUrl(slug), {
    width: opts.size ?? 512,
    margin: opts.margin ?? 2,
    errorCorrectionLevel: 'M',
    color: { dark: opts.dark ?? '#000000', light: opts.light ?? '#FFFFFF' },
  });
}
