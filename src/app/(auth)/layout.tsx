import Link from 'next/link';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MenuQR';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="px-4 py-5">
        <Link href="/" className="text-base font-extrabold tracking-tight text-slate-900">
          {siteName}
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16">{children}</main>
    </div>
  );
}
