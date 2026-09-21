import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MenuQR';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Free Digital QR Menu for Restaurants & Cafes`,
    template: `%s | ${siteName}`,
  },
  description:
    'Create a digital menu for your restaurant or cafe in minutes, pick a design, and get a QR code your customers scan at the table. No app, no login for guests.',
  openGraph: { type: 'website', siteName, url: siteUrl },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
