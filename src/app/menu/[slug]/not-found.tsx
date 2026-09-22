import Link from 'next/link';

export default function MenuNotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold">Menu not available</h1>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">
        This menu does not exist, or it has not been approved yet. If you own this
        restaurant, sign in to check its status.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-[var(--claret)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Go to homepage
      </Link>
    </main>
  );
}
