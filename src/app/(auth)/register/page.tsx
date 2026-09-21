import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = {
  title: 'Create your account',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <h1 className="text-xl font-bold text-slate-900">Create your account</h1>
      <p className="mt-1 text-sm text-slate-600">
        Set up your restaurant, build the menu, and get your QR code.
      </p>

      <RegisterForm />

      <p className="mt-5 text-center text-sm text-slate-600">
        Already registered?{' '}
        <Link href="/login" className="font-semibold text-orange-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
