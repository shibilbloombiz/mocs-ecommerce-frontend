import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-stone-200/80 p-3 shadow-xs font-sans animate-pulse", className)}>
      {/* Product Image Placeholder */}
      <div className="relative aspect-square w-full rounded-xl bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 dark:from-stone-800 dark:via-stone-700 dark:to-stone-800" />

      {/* Content Placeholders */}
      <div className="mt-3.5 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="h-3 w-1/3 rounded-md bg-stone-200 dark:bg-stone-700" />
          <div className="h-4 w-4/5 rounded-md bg-stone-300 dark:bg-stone-600" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div className="h-5 w-16 rounded-md bg-stone-200 dark:bg-stone-700" />
          <div className="h-8 w-8 rounded-full bg-stone-200 dark:bg-stone-700" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
