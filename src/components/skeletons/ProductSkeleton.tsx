export function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 h-4 w-48 rounded bg-stone-200 dark:bg-stone-800 animate-pulse" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse border border-border/40" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-20 rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Product Details Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-stone-200 dark:bg-stone-800 animate-pulse" />
            <div className="h-9 w-3/4 rounded-lg bg-stone-300 dark:bg-stone-700 animate-pulse" />
            <div className="h-6 w-32 rounded bg-stone-200 dark:bg-stone-800 animate-pulse mt-2" />
          </div>

          <div className="h-8 w-28 rounded-md bg-stone-300 dark:bg-stone-700 animate-pulse" />

          {/* Color swatches */}
          <div className="space-y-3 pt-4 border-t border-border/40">
            <div className="h-4 w-20 rounded bg-stone-200 dark:bg-stone-800 animate-pulse" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 w-10 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Size picker */}
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-stone-200 dark:bg-stone-800 animate-pulse" />
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-stone-200 dark:bg-stone-800 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-4">
            <div className="h-14 w-full rounded-full bg-stone-300 dark:bg-stone-700 animate-pulse" />
            <div className="h-14 w-full rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
