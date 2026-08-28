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
    <div className="w-full px-3 sm:px-6 lg:px-8 py-2 sm:py-4 max-w-[1800px] mx-auto">
      <section className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[calc(100dvh-2rem)] lg:min-h-[640px] lg:max-h-[960px] overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-stone-950 animate-pulse" />
    </div>
  );
}

// ─── Custom Arrow Icon ────────────────────────────────────────────────────────
function HeroArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
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
  const [isHovered, setIsHovered] = useState(false);
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

  // Auto-advance every 5.5s when not hovered
  useEffect(() => {
    if (totalSlides <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setDirection(1);
      setActive((prevIdx) => (prevIdx + 1) % totalSlides);
    }, 5500);

    return () => clearInterval(timer);
  }, [totalSlides, active, isHovered]);

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

  // Smooth cinematic slide transition variants with depth & gentle blur
  const slideVariants = {
    enter: (d: number) => ({
      opacity: 0,
      x: d > 0 ? "6%" : "-6%",
      scale: 1.08,
      filter: "blur(6px) brightness(0.9)",
    }),
    center: {
      opacity: 1,
      x: "0%",
      scale: 1,
      filter: "blur(0px) brightness(1)",
      transition: {
        opacity: { duration: 0.8, ease: [0.25, 1, 0.35, 1] },
        x: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: 0.7, ease: "easeOut" },
      },
    },
    exit: (d: number) => ({
      opacity: 0,
      x: d > 0 ? "-5%" : "5%",
      scale: 0.95,
      filter: "blur(4px) brightness(0.8)",
      transition: {
        opacity: { duration: 0.55, ease: "easeInOut" },
        x: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.65, ease: "easeIn" },
        filter: { duration: 0.45 },
      },
    }),
  };

  // Swipe threshold for mobile touch swipe gestures (fluid and responsive)
  const swipeConfidenceThreshold = 6000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-2 sm:py-4 max-w-[1800px] mx-auto">
      <section
        ref={sectionRef}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="MOCS Hero Slideshow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-[calc(100dvh-2rem)] lg:min-h-[640px] lg:max-h-[960px] overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-[#0e0d0c] outline-none select-none text-white shadow-2xl touch-pan-y"
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
              className="relative block h-full w-full cursor-pointer focus:outline-none rounded-[inherit] overflow-hidden"
              aria-label="View hero banner"
            >
              {/* Ambient blurred backdrop when in contain mode */}
              {current?.objectFit === "contain" && current?.bg && (
                <div
                  className="absolute inset-0 scale-125 blur-3xl opacity-50 bg-cover bg-center pointer-events-none transition-all duration-700"
                  style={{
                    backgroundImage: `url(${getImageUrl(current.bg, { width: 400, quality: 40 })})`,
                  }}
                />
              )}

              {/* Inner slide container without hover zoom */}
              <div className="relative h-full w-full rounded-[inherit]">
                <picture className="relative block h-full w-full rounded-[inherit]">
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
                      "h-full w-full rounded-[inherit]",
                      current?.objectFit === "contain" ? "object-contain" : "object-cover",
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
        <div className="pointer-events-none absolute top-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10 rounded-t-[inherit]" />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 rounded-b-[inherit]" />

        {/* ── MODERN PREMIUM ARROW CONTROLS (DESKTOP / TABLET ONLY - HIDDEN ON MOBILE) ── */}
        {totalSlides > 1 && (
          <>
            {/* Left Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous slide"
              className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 lg:h-13 lg:w-13 rounded-full bg-black/55 hover:bg-black/85 text-white/90 hover:text-[#d97736] border border-white/20 hover:border-[#d97736]/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_24px_rgba(217,119,54,0.4)] backdrop-blur-xl items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100 ring-1 ring-black/40"
            >
              <HeroArrowIcon className="h-5 w-5 lg:h-6 lg:w-6 rotate-180 transition-transform duration-200" />
            </button>

            {/* Right Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                next();
              }}
              aria-label="Next slide"
              className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 lg:h-13 lg:w-13 rounded-full bg-black/55 hover:bg-black/85 text-white/90 hover:text-[#d97736] border border-white/20 hover:border-[#d97736]/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_0_24px_rgba(217,119,54,0.4)] backdrop-blur-xl items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100 ring-1 ring-black/40"
            >
              <HeroArrowIcon className="h-5 w-5 lg:h-6 lg:w-6 transition-transform duration-200" />
            </button>
          </>
        )}

        {/* ── BOTTOM INDICATOR DOTS / PILL ── */}
        {totalSlides > 1 && (
          <div className="absolute bottom-5 sm:bottom-8 inset-x-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/15 shadow-2xl pointer-events-auto">
              {displaySlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goTo(idx, idx > active ? 1 : -1)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    idx === active
                      ? "w-6 bg-[#d97736] shadow-[0_0_10px_#d97736]"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
