import { HeroSkeleton } from "@/components/Hero";
import { SkeletonCard } from "@/components/SkeletonCard";

export function HomeSkeleton() {
  return (
    <div className="w-full space-y-12 animate-in fade-in duration-300">
      {/* Hero Skeleton */}
      <HeroSkeleton />

      {/* Trending / New Arrivals Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-2">
          <div className="h-4 w-28 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
          <div className="h-8 w-64 rounded-md bg-stone-300 dark:bg-stone-700 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>

      {/* Categories Grid Skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-2">
          <div className="h-4 w-32 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
          <div className="h-8 w-56 rounded-md bg-stone-300 dark:bg-stone-700 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-6 min-h-[420px] rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
