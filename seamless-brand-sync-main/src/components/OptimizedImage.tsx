import { useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  aspectRatio?: string;
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  aspectRatio,
  fallbackSrc = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imgSrc = error || !src ? fallbackSrc : src;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-stone-100/80 dark:bg-stone-800/50",
        containerClassName
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Shimmer skeleton placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 dark:from-stone-800 dark:via-stone-700 dark:to-stone-800" />
      )}

      {/* Optimized image tag */}
      <img
        src={imgSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300 ease-out will-change-[opacity,transform]",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
}
