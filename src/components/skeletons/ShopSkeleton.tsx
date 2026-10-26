import { SkeletonCard } from "@/components/SkeletonCard";

export function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Header bar placeholder */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-2">
          <div className="h-9 w-48 rounded-lg bg-stone-300 dark:bg-stone-700 animate-pulse" />
          <div className="h-4 w-28 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-24 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse" />
          <div className="h-10 w-36 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse" />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filter Sidebar Skeleton */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-20 rounded bg-stone-300 dark:bg-stone-700 animate-pulse" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 w-full rounded bg-stone-200 dark:bg-stone-800 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-border/40">
            <div className="h-4 w-24 rounded bg-stone-300 dark:bg-stone-700 animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-8 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse" />
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
