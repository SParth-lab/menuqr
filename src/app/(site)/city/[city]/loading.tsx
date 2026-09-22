import { VenueCardSkeleton } from '@/components/site/VenueCard';

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-10 pt-12">
      <div className="shimmer h-3 w-32 rounded-full" />
      <div className="shimmer mt-6 h-14 w-4/5 max-w-2xl rounded-2xl" />
      <div className="shimmer mt-4 h-4 w-3/5 max-w-xl rounded-full" />
      <div className="glass mt-10 h-44 rounded-[22px]" />
      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <VenueCardSkeleton />
          </li>
        ))}
      </ul>
    </main>
  );
}
