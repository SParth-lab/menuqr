export default function Loading() {
  return (
    <main className="pb-10">
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <div className="shimmer h-3 w-32 rounded-full" />
        <div className="mt-6 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="shimmer h-7 w-20 rounded-full" />
          ))}
        </div>
        <div className="shimmer mt-6 h-12 w-full rounded-xl" />
        <div className="shimmer mt-3 h-12 w-2/3 rounded-xl" />
        <div className="shimmer mt-6 h-4 w-4/5 rounded-full" />
      </div>
      <div className="mx-auto mt-10 max-w-5xl px-4">
        <div className="shimmer aspect-[21/9] w-full rounded-3xl" />
      </div>
      <div className="mx-auto mt-12 max-w-2xl space-y-4 px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`shimmer h-4 rounded-full ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </main>
  );
}
