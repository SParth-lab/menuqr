import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = {
  title: 'Create your account',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--pane)] p-7 shadow-sm">
      <h1 className="text-xl font-bold text-[var(--ink)]">Create your account</h1>
      <p className="mt-1 text-sm text-[var(--ink-soft)]">
        Set up your restaurant, build the menu, and get your QR code.
      </p>

      <RegisterForm />

      <p className="mt-5 text-center text-sm text-[var(--ink-soft)]">
        Already registered?{' '}
        <Link href="/login" className="font-semibold text-[var(--brass-lift)] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
