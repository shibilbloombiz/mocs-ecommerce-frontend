import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";

// Backward-compatible Slide types
export type Slide = {
  bg: string;
  mobileBg?: string;
  isMobileMain?: boolean;
  to?: string;
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  cta?: string;
  mobileFocus?: "center" | "left" | "right";
  rightFocus?: boolean;
  objectFit?: "cover" | "contain";
  objectPosition?: "center" | "top" | "bottom" | "left" | "right";
};

export const DEFAULT_HERO_SLIDES: Slide[] = [
  {
    bg: "/images/hero-bronze-slide.jpg",
    mobileBg: "/images/hero-bronze-slide.jpg",
    to: "/shop?category=Women",
    eyebrow: "YOUR WORLD UPGRADED",
    title: "SCULPTED LUXURY FOR EVERYDAY STRIDE",
    subtitle: "Handcrafted double-bow silhouette on an anatomical PU footbed, engineered to stay plush and stylish from sunrise to sunset.",
    cta: "SHOP NOW",
  },
  {
    bg: "/images/hero-wedge-rhinestone.jpg",
    mobileBg: "/images/hero-wedge-rhinestone.jpg",
    to: "/shop?category=Women",
    eyebrow: "EFFORTLESS POSTURE & GRACE",
    title: "CLOUD CUSHIONING MEETS ELEVATED STYLE",
    subtitle: "Featherweight shock-absorbing wedge with crystal-encrusted straps, elevating your silhouette with featherlight ease.",
    cta: "EXPLORE COLLECTION",
  },
  {
    bg: "/images/hero-script-bow.jpg",
    mobileBg: "/images/hero-script-bow.jpg",
    to: "/shop?category=Women",
    eyebrow: "ARTISANAL ARCHITECTURE",
    title: "ARTISANAL CHARM FOR TIMELESS EASE",
    subtitle: "Supple typography-print bow architecture sculpted for breathable, all-day resort luxury and effortless casual elegance.",
    cta: "DISCOVER MORE",
  },
];

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[100dvh] min-h-[640px] bg-[#0c0d10] overflow-hidden flex items-center justify-center">
      <div className="w-full h-full bg-stone-900/60 animate-pulse flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-orange-500/15 blur-3xl" />
      </div>
    </div>
  );
}

/**
 * =========================================================================
 * MOCS FOOTWEAR - HERO PRODUCT & CAROUSEL CONFIGURATION
 * =========================================================================
 */
export type HeroProduct = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  category: string;
  to: string;
  image: string;
  productId?: string;
  eyebrow?: string;
  title?: string;
  watermark?: string;
  badge?: string;
  colors?: {
    upper?: string;
    toeCap?: string;
    accent?: string;
    accentSecondary?: string;
    laces?: string;
    midsole?: string;
    midsoleAccent?: string;
    outsole?: string;
  };
};

export const DEFAULT_HERO_PRODUCTS: HeroProduct[] = [
  {
    id: "bronze-double-bow-slide",
    name: "LADIES CASUAL LUXE",
    eyebrow: "YOUR WORLD UPGRADED",
    title: "SCULPTED LUXURY FOR EVERYDAY STRIDE",
    watermark: "COMFORT",
    tagline: "Handcrafted double-bow silhouette on an anatomical PU footbed, engineered to stay plush and stylish from sunrise to sunset.",
    badge: "PREMIUM FOOTWEAR EXPERIENCE",
    price: "₹399",
    category: "Women",
    to: "/shop?category=Women",
    productId: "patent-cross-slide",
    image: "/images/hero-bronze-slide.jpg",
  },
  {
    id: "comfort-wedge-slide",
    name: "COMFORT WEDGE SLIDE",
    eyebrow: "EFFORTLESS POSTURE & GRACE",
    title: "CLOUD CUSHIONING MEETS ELEVATED STYLE",
    watermark: "ELEVATE",
    tagline: "Featherweight shock-absorbing wedge with crystal-encrusted straps, elevating your silhouette with featherlight ease.",
    badge: "EXCLUSIVE SUMMER EDIT",
    price: "₹499",
    category: "Women",
    to: "/product/comfort-wedge-slide",
    productId: "comfort-wedge-slide",
    image: "/images/hero-wedge-rhinestone.jpg",
  },
  {
    id: "chic-bow-sandal",
    name: "CHIC RESORT BOW SLIDE",
    eyebrow: "ARTISANAL ARCHITECTURE",
    title: "ARTISANAL CHARM FOR TIMELESS EASE",
    watermark: "TIMELESS",
    tagline: "Supple typography-print bow architecture sculpted for breathable, all-day resort luxury and effortless casual elegance.",
    badge: "TRENDING NEW ARRIVAL",
    price: "₹349",
    category: "Women",
    to: "/shop?category=Women",
    productId: "ladies-buckle-slide",
    image: "/images/hero-script-bow.jpg",
  },
];

export const HERO_PRODUCTS = DEFAULT_HERO_PRODUCTS;

/**
 * Resolves the destination route for the Hero CTA.
 */
export function resolveHeroProductDestination(
  product: HeroProduct | undefined,
  catalogProducts?: { id?: string; _id?: string; name?: string; slug?: string; artNumber?: string }[]
): string {
  if (!product) return "/shop";

  const rawTo = (product.to || "").trim();
  if (rawTo && rawTo !== "/shop") {
    if (rawTo.startsWith("/products/")) {
      return "/product/" + rawTo.slice("/products/".length);
    }
    return rawTo;
  }

  if (product.productId) {
    return `/product/${product.productId}`;
  }

  if (catalogProducts && catalogProducts.length > 0) {
    if (product.id) {
      const idMatch = catalogProducts.find(
        (p) =>
          p.id === product.id ||
          p._id === product.id ||
          p.slug === product.id ||
          p.artNumber === product.id
      );
      if (idMatch) {
        return `/product/${idMatch.slug || idMatch._id || idMatch.id}`;
      }
    }
  }

  return "/shop?category=Women";
}

export interface HeroProps {
  slides?: Slide[];
  heroProducts?: HeroProduct[];
  products?: any[];
  collageImages?: any[];
}

export function Hero({
  slides: propSlides = [],
  heroProducts,
  products = [],
}: HeroProps) {
  const items = useMemo(() => {
    if (heroProducts && Array.isArray(heroProducts) && heroProducts.length > 0) {
      return heroProducts;
    }
    return DEFAULT_HERO_PRODUCTS;
  }, [heroProducts]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [textPhase, setTextPhase] = useState<"in" | "out">("in");
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const activeItem = items[currentIndex % items.length] || items[0];

  const destinationUrl = useMemo(() => {
    return resolveHeroProductDestination(activeItem, products);
  }, [activeItem, products]);

  // Animated Slide Switcher with Staggered Text Reveal Effect
  const goToSlide = useCallback(
    (index: number) => {
      const count = items.length;
      const nextIndex = ((index % count) + count) % count;
      if (nextIndex === currentIndex) return;

      // 1. Text Out transition: swift fade, scale, and subtle down-shift
      setTextPhase("out");

      setTimeout(() => {
        setCurrentIndex(nextIndex);
        // 2. Text In transition: triggered on next frame for rich staggered reveal
        requestAnimationFrame(() => {
          setTimeout(() => {
            setTextPhase("in");
          }, 60);
        });
      }, 260);
    },
    [currentIndex, items.length]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Continuous Autoplay (7s interval, continuous on hover)
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      aria-label="Hero Carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[100dvh] min-h-[640px] max-h-[1020px] bg-black select-none flex flex-col justify-end overflow-hidden"
    >
      {/* ── Outer Hero Container (Full Bleed Edge-to-Edge) ── */}
      <div className="relative w-full h-full overflow-hidden flex flex-col justify-end">
        
        {/* ── Background Carousel Images with Smooth Crossfade & Cinematic Scale ── */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0 pointer-events-none">
          {items.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={item.id}
                className={cn(
                  "absolute inset-0 w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-108 z-0 pointer-events-none"
                )}
              >
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover object-[center_78%] sm:object-[center_75%] lg:object-[center_72%]"
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : "auto"}
                />
              </div>
            );
          })}
        </div>

        {/* ── Bottom Content Layer: Anchored to Bottom without background box ── */}
        <div className="relative z-30 w-full px-6 sm:px-10 lg:px-16 pb-8 sm:pb-10 lg:pb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8">
          
          {/* ── Left Content Block (Clean text directly at the bottom with text shadow) ── */}
          <div className="max-w-xl text-left">
            
            {/* 1. Eyebrow Tag with Decorative Rules */}
            <div
              key={`eyebrow-${activeItem.id}`}
              className={cn(
                "inline-flex items-center gap-2 sm:gap-3 text-white font-['Space_Grotesk',sans-serif] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] mb-2 sm:mb-2.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]",
                textPhase === "in"
                  ? "opacity-100 translate-y-0 blur-none"
                  : "opacity-0 translate-y-4 blur-xs"
              )}
            >
              <span className="w-6 sm:w-8 h-[1px] bg-white/70" />
              <span>{activeItem.eyebrow || "YOUR WORLD UPGRADED"}</span>
              <span className="w-6 sm:w-8 h-[1px] bg-white/70" />
            </div>

            {/* 2. Main Title */}
            <h1
              key={`title-${activeItem.id}`}
              className={cn(
                "font-['Plus_Jakarta_Sans',sans-serif] font-black text-2xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[58px] uppercase text-white leading-[1.06] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] max-w-xl transition-all duration-800 delay-[90ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu",
                textPhase === "in"
                  ? "opacity-100 translate-y-0 blur-none"
                  : "opacity-0 translate-y-6 blur-sm"
              )}
            >
              {activeItem.title || activeItem.name}
            </h1>

            {/* 3. Description Subtitle */}
            <p
              key={`tagline-${activeItem.id}`}
              className={cn(
                "mt-2.5 sm:mt-3 font-['Space_Grotesk',sans-serif] text-xs sm:text-sm lg:text-[15px] font-normal text-white/95 leading-relaxed max-w-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] transition-all duration-850 delay-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu",
                textPhase === "in"
                  ? "opacity-100 translate-y-0 blur-none"
                  : "opacity-0 translate-y-5 blur-xs"
              )}
            >
              {activeItem.tagline}
            </p>

            {/* 4. Action Button (SHOP NOW) */}
            <div
              key={`actions-${activeItem.id}`}
              className={cn(
                "mt-5 sm:mt-6 flex items-center transition-all duration-900 delay-[270ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu",
                textPhase === "in"
                  ? "opacity-100 translate-y-0 blur-none"
                  : "opacity-0 translate-y-5 blur-xs"
              )}
            >
              <Link
                to={destinationUrl as any}
                className="group/btn inline-flex items-center gap-2 bg-white hover:bg-stone-100 active:scale-95 text-stone-950 font-['Space_Grotesk',sans-serif] font-bold text-xs sm:text-sm uppercase tracking-wider px-7 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-[0_4px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_6px_36px_rgba(0,0,0,0.6)] transition-all duration-300 cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-250 group-hover/btn:translate-x-1" />
              </Link>
            </div>

          </div>

          {/* ── Right Controls Block: Indicators & Animated Circular Arrows (Anchored at Bottom) ── */}
          <div className="flex items-center justify-between lg:justify-end gap-5 sm:gap-6 self-stretch lg:self-end pt-2 lg:pt-0">
            
            {/* Slide Progress Animated Bars */}
            <div className="flex items-center gap-2.5">
              {items.map((_, idx) => {
                const isActive = currentIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={cn(
                      "relative h-1.5 sm:h-2 rounded-full cursor-pointer overflow-hidden transition-all duration-500 backdrop-blur-sm",
                      isActive
                        ? "w-10 sm:w-14 bg-white/30 shadow-[0_0_12px_rgba(255,255,255,0.45)] ring-1 ring-white/40"
                        : "w-4 sm:w-6 bg-white/40 hover:bg-white/80 hover:w-6 sm:hover:w-8"
                    )}
                  >
                    {isActive && (
                      <span
                        key={`bar-${currentIndex}`}
                        className="absolute inset-y-0 left-0 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.95)]"
                        style={{
                          animation: "heroProgress 7000ms linear forwards",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Circular Navigation Buttons with Movement & Tactile Hover */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="group/prev relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white text-white bg-black/45 hover:bg-black/75 active:scale-90 flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg cursor-pointer hover:-translate-x-1.5"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/prev:-translate-x-1 motion-safe:animate-[arrowIdleLeft_2.8s_ease-in-out_infinite]" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="group/next relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white text-white bg-black/45 hover:bg-black/75 active:scale-90 flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg cursor-pointer hover:translate-x-1.5"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/next:translate-x-1 motion-safe:animate-[arrowIdleRight_2.8s_ease-in-out_infinite]" />
              </button>
            </div>

          </div>

        </div>

        {/* ── Keyframe Animations for Progress Bar and Directional Arrow Movement ── */}
        <style>{`
          @keyframes heroProgress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          @keyframes arrowIdleLeft {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-2.5px); }
          }
          @keyframes arrowIdleRight {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(2.5px); }
          }
        `}</style>

      </div>
    </section>
  );
}
