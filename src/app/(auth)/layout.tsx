import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'QR4Blueprint';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="orbfield" aria-hidden="true">
      </div>

      <header className="stick-top px-5 py-6">
        <Link href="/" className="display text-xl leading-none">
          {siteName}
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16">{children}</main>
    </div>
  );
}
