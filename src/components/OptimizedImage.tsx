import { useState, useMemo, ImgHTMLAttributes } from "react";
import { cn, getImageUrl } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  aspectRatio?: string;
  fallbackSrc?: string;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  aspectRatio,
  sizes,
  fallbackSrc = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=75&w=480&auto=format&fit=crop",
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  const rawSrc = error || !src ? fallbackSrc : src;

  // Optimized base URL (default ~480px width for fast 10-25KB transfer)
  const optimizedSrc = useMemo(() => {
    return getImageUrl(rawSrc, { width: priority ? 800 : 480, quality: 75 });
  }, [rawSrc, priority]);

  // Multi-density responsive srcSet for instant sharp rendering on all screens
  const srcSet = useMemo(() => {
    if (!rawSrc || rawSrc.startsWith("data:")) return undefined;
    if (rawSrc.includes("images.unsplash.com")) {
      const widths = [320, 480, 720, 1080];
      return widths
        .map((w) => `${getImageUrl(rawSrc, { width: w, quality: 75 })} ${w}w`)
        .join(", ");
    }
    return undefined;
  }, [rawSrc]);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-stone-100/90 dark:bg-stone-850",
        containerClassName
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes || "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onError={() => setError(true)}
        className={cn(
          "h-full w-full object-cover transition-transform duration-300",
          className
        )}
        {...props}
      />
    </div>
  );
}

