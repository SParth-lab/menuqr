import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--pane)] p-7 shadow-sm">
      <h1 className="text-xl font-bold text-[var(--ink)]">Sign in</h1>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">Manage your menu, design and QR code.</p>

      <LoginForm />

      <p className="mt-5 text-center text-sm text-[var(--ink-soft)]">
        No account?{' '}
        <Link href="/register" className="font-semibold text-[var(--brass-lift)] hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
