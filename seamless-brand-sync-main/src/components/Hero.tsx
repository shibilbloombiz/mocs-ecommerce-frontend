import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn, getImageUrl } from "@/lib/utils";

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
    bg: "/hero-comfort-banner.jpg",
    mobileBg: "/hero-comfort-banner.jpg",
    to: "/shop",
  },
  {
    bg: "/hero-lifestyle-1.jpg",
    mobileBg: "/hero-lifestyle-1.jpg",
    to: "/shop?category=Women",
  },
  {
    bg: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1920",
    to: "/shop?category=Men",
  },
  {
    bg: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1920",
    to: "/shop",
  },
];

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function HeroSkeleton() {
  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2.5 max-w-[1800px] mx-auto">
      <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-auto lg:h-[min(540px,calc(100dvh-6.5rem))] lg:min-h-[380px] lg:max-h-[540px] overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.2rem] bg-stone-950 animate-pulse" />
    </div>
  );
}

// ─── Long Thin Arrow SVG ─────────────────────────────────────────────────────
function LongArrow({ direction = "right", className }: { direction?: "left" | "right"; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {direction === "right" ? (
        <>
          <line x1="0" y1="6" x2="44" y2="6" stroke="currentColor" strokeWidth="1" />
          <polyline points="38,1 44,6 38,11" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <line x1="48" y1="6" x2="4" y2="6" stroke="currentColor" strokeWidth="1" />
          <polyline points="10,1 4,6 10,11" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

// ─── Hero Component ──────────────────────────────────────────────────────────
export function Hero({
  slides = [],
}: {
  slides?: Slide[];
  collageImages?: any[];
}) {
  const activeSlides =
    slides && Array.isArray(slides) && slides.length > 0
      ? slides.filter((s) => s && s.bg && typeof s.bg === "string" && s.bg.trim() !== "")
      : [];
  const displaySlides =
    activeSlides.length > 0 ? activeSlides : DEFAULT_HERO_SLIDES;
  const totalSlides = displaySlides.length || 1;

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const sectionRef = useRef<HTMLElement>(null);

  // Preload all slide images on mount for instant transitions
  useEffect(() => {
    if (typeof window === "undefined") return;
    displaySlides.forEach((slide) => {
      if (slide?.bg) {
        const img = new window.Image();
        img.src = getImageUrl(slide.bg, { width: 1920, quality: 95 });
      }
      if (slide?.mobileBg) {
        const mobileImg = new window.Image();
        mobileImg.src = getImageUrl(slide.mobileBg, { width: 1080, quality: 92 });
      }
    });
  }, [displaySlides]);

  const goTo = useCallback((idx: number, dir: 1 | -1 = 1) => {
    setDirection(dir);
    setActive(idx);
  }, []);

  const next = useCallback(() => {
    setDirection(1);
    setActive((a) => (a + 1) % totalSlides);
  }, [totalSlides]);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((a) => (a - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-advance every 5 seconds (continues playing even when user hovers)
  useEffect(() => {
    if (totalSlides <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setActive((prevIdx) => (prevIdx + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides, active]);


  // Keyboard navigation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const current = displaySlides[active] ?? displaySlides[0] ?? DEFAULT_HERO_SLIDES[0];

  // Ultra-smooth cinematic GPU-accelerated slide transition variants
  const slideVariants = {
    enter: (d: number) => ({
      opacity: 0,
      x: d > 0 ? "3.5%" : "-3.5%",
      scale: 1.03,
    }),
    center: {
      opacity: 1,
      x: "0%",
      scale: 1,
      transition: {
        opacity: { duration: 0.85, ease: [0.25, 1, 0.5, 1] },
        x: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
      },
    },
    exit: (d: number) => ({
      opacity: 0,
      x: d > 0 ? "-3%" : "3%",
      scale: 0.98,
      transition: {
        opacity: { duration: 0.65, ease: [0.25, 1, 0.5, 1] },
        x: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.75, ease: [0.25, 1, 0.5, 1] },
      },
    }),
  };

  // Swipe threshold for mobile touch swipe gestures (fluid and responsive)
  const swipeConfidenceThreshold = 6000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2.5 max-w-[1800px] mx-auto">
      <section
        ref={sectionRef}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="MOCS Hero Slideshow"
        className="group relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-auto lg:h-[min(540px,calc(100dvh-6.5rem))] lg:min-h-[380px] lg:max-h-[540px] overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.2rem] bg-[#0e0d0c] outline-none select-none text-white shadow-2xl touch-pan-y"
      >
        {/* ── ACTIVE HERO SLIDE (WITH ADAPTIVE PICTURE ELEMENT & KEN BURNS EFFECT) ── */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold || offset.x < -45) {
                next();
              } else if (swipe > swipeConfidenceThreshold || offset.x > 45) {
                prev();
              }
            }}
            className="absolute inset-0 h-full w-full will-change-transform rounded-[inherit] overflow-hidden"
          >
            <a
              href={current?.to || "/shop"}
              className="relative block h-full w-full min-h-full min-w-full cursor-pointer focus:outline-none rounded-[inherit] overflow-hidden"
              aria-label="View hero banner"
            >
              {/* Ambient blurred backdrop for seamless filling across all screen sizes */}
              {current?.bg && (
                <div
                  className="absolute inset-0 scale-125 blur-3xl opacity-40 bg-cover bg-center pointer-events-none transition-all duration-700"
                  style={{
                    backgroundImage: `url(${getImageUrl(current.mobileBg || current.bg, { width: 400, quality: 40 })})`,
                  }}
                />
              )}

              {/* Inner slide container */}
              <div className="relative h-full w-full min-h-full min-w-full rounded-[inherit] overflow-hidden flex items-center justify-center">
                <picture className="relative block h-full w-full min-h-full min-w-full rounded-[inherit]">
                  {current?.mobileBg && (
                    <source
                      media="(max-width: 767px)"
                      srcSet={getImageUrl(current.mobileBg, { width: 1080, quality: 92 })}
                    />
                  )}
                  <img
                    src={getImageUrl(current?.bg || DEFAULT_HERO_SLIDES[0].bg, { width: 1920, quality: 95 })}
                    alt={`Hero Banner ${active + 1}`}
                    loading={active === 0 ? "eager" : "lazy"}
                    className={cn(
                      "block h-full w-full min-h-full min-w-full rounded-[inherit] transition-all duration-500",
                      current?.objectFit === "contain"
                        ? "object-contain"
                        : "object-cover",
                      current?.objectPosition === "top"
                        ? "object-top"
                        : current?.objectPosition === "bottom"
                        ? "object-bottom"
                        : current?.objectPosition === "left"
                        ? "object-left"
                        : current?.objectPosition === "right"
                        ? "object-right"
                        : "object-center"
                    )}
                  />
                </picture>
              </div>

              {/* Subtle ambient luxury light vignette sheen */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/10 opacity-60 rounded-[inherit]" />
            </a>
          </motion.div>
        </AnimatePresence>

        {/* ── AMBIENT GRADIENT OVERLAYS ── */}
        <div className="pointer-events-none absolute top-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10 rounded-t-[inherit]" />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 rounded-b-[inherit]" />

        {/* ── LUXURY BOTTOM NAV: PREV (ARROW) ─ DOTS ─ NEXT (ARROW) ── */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 sm:bottom-5 inset-x-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-3 sm:gap-5 pointer-events-auto">

              {/* PREV button (Arrow Only) */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
                aria-label="Previous slide"
                className="group/prev flex items-center justify-center p-2 rounded-full cursor-pointer select-none transition-all duration-300 hover:bg-white/10"
              >
                <LongArrow
                  direction="left"
                  className="w-8 sm:w-10 h-3 text-white/50 transition-all duration-500 group-hover/prev:w-12 sm:group-hover/prev:w-14 group-hover/prev:text-white"
                />
              </button>

              {/* Dot indicators */}
              <div className="flex items-center gap-2 bg-black/35 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 shadow-2xl">
                {displaySlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goTo(idx, idx > active ? 1 : -1)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-500 cursor-pointer",
                      idx === active
                        ? "w-5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                        : "w-1.5 bg-white/30 hover:bg-white/60"
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* NEXT button (Arrow Only) */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
                aria-label="Next slide"
                className="group/next flex items-center justify-center p-2 rounded-full cursor-pointer select-none transition-all duration-300 hover:bg-white/10"
              >
                <LongArrow
                  direction="right"
                  className="w-8 sm:w-10 h-3 text-white/50 transition-all duration-500 group-hover/next:w-12 sm:group-hover/next:w-14 group-hover/next:text-white"
                />
              </button>

            </div>
          </div>
        )}
      </section>
    </div>

  );
}
