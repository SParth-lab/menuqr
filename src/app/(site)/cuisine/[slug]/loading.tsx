import { VenueCardSkeleton } from '@/components/site/VenueCard';

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6">
      <div className="shimmer h-3 w-40 rounded-full" />
      <div className="shimmer mt-6 h-12 w-3/5 max-w-lg rounded-xl" />
      <div className="shimmer mt-4 h-4 w-4/5 max-w-2xl rounded-full" />
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}><VenueCardSkeleton /></li>
        ))}
      </ul>
    </main>
  );
}
