export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6">
      <div className="shimmer h-3 w-28 rounded-full" />
      <div className="shimmer mt-6 h-12 w-4/5 max-w-2xl rounded-xl" />
      <div className="shimmer mt-4 h-4 w-3/5 max-w-xl rounded-full" />

      <div className="mt-9 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shimmer h-9 w-24 rounded-full" />
        ))}
      </div>

      <div className="glass mt-10 grid overflow-hidden rounded-3xl md:grid-cols-2">
        <div className="shimmer aspect-[16/10] md:aspect-auto md:min-h-[300px]" />
        <div className="space-y-4 p-8">
          <div className="shimmer h-3 w-24 rounded-full" />
          <div className="shimmer h-8 w-4/5 rounded-lg" />
          <div className="shimmer h-4 w-full rounded-full" />
          <div className="shimmer h-4 w-2/3 rounded-full" />
        </div>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="glass overflow-hidden rounded-2xl">
            <div className="shimmer aspect-[16/10] w-full" />
            <div className="space-y-3 p-5">
              <div className="shimmer h-4 w-4/5 rounded-full" />
              <div className="shimmer h-3 w-full rounded-full" />
              <div className="shimmer h-3 w-2/3 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
