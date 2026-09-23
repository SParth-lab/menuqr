import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Archivo } from 'next/font/google';
import './globals.css';

/* Self-hosted at build time: no render-blocking request to a font CDN, which is
   the single biggest LCP lever on the public menu pages. */
const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'QR4Menu';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Digital QR Menus for Restaurants & Cafes`,
    template: `%s | ${siteName}`,
  },
  description:
    'Build a digital menu for your restaurant or cafe, set it as a printed card rather than a web page, and get one QR code your guests scan at the table. No app, no guest account.',
  openGraph: { type: 'website', siteName, url: siteUrl },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
