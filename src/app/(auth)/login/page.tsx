import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">Sign in</h1>
      <p className="mt-1 text-sm text-slate-600">Manage your menu, design and QR code.</p>

      <LoginForm />

      <p className="mt-5 text-center text-sm text-slate-600">
        No account?{' '}
        <Link href="/register" className="font-semibold text-orange-700 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
