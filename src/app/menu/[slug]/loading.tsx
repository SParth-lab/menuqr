export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <div className="mx-auto h-px w-8 bg-[var(--line)]" />
      <div className="shimmer mx-auto mt-5 h-8 w-56 rounded-lg" />
      <div className="shimmer mx-auto mt-3 h-3 w-40 rounded-full" />

      {Array.from({ length: 3 }).map((_, s) => (
        <section key={s} className="mt-10">
          <div className="shimmer h-3 w-28 rounded-full" />
          <div className="mt-4 space-y-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-baseline gap-3">
                <div className="shimmer h-3 w-2/5 rounded-full" />
                <div className="h-px flex-1 border-b border-dotted border-[var(--line)]" />
                <div className="shimmer h-3 w-10 rounded-full" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
