import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";

export type Slide = {
  bg: string;
  mobileBg?: string;
  to?: string;
  // Legacy optional fields kept for type compatibility
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  cta?: string;
  mobileFocus?: "center" | "left" | "right";
  rightFocus?: boolean;
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
    <section className="relative w-full h-[100dvh] overflow-hidden bg-stone-950 animate-pulse" />
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
    slides && slides.length > 0
      ? slides.filter((s) => s.bg && s.bg.trim() !== "")
      : [];
  const displaySlides =
    activeSlides.length > 0 ? activeSlides : DEFAULT_HERO_SLIDES;
  const totalSlides = displaySlides.length;

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const sectionRef = useRef<HTMLElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Preload all slide images on mount for instant crossfades
  useEffect(() => {
    if (typeof window === "undefined") return;
    displaySlides.forEach((slide) => {
      if (slide.bg) {
        const img = new window.Image();
        img.src = getImageUrl(slide.bg, { width: 1920, quality: 95 });
      }
      if (slide.mobileBg) {
        const mobileImg = new window.Image();
        mobileImg.src = getImageUrl(slide.mobileBg, { width: 900, quality: 90 });
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

  const fixedMobileSlide = displaySlides.find((s) => s.isMobileMain);
  const mobileSlides = displaySlides.filter(
    (s) => s.mobileBg && s.mobileBg.trim() !== ""
  );
  // Auto-carousel on mobile only if 2+ mobile hero images exist AND no slide is fixed as mobile main
  const shouldAutoAdvanceMobile = !fixedMobileSlide && mobileSlides.length >= 2;

  // Auto-advance every 5.5 seconds
  useEffect(() => {
    if (totalSlides <= 1) return;

    const timer = setInterval(() => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      if (isMobile) {
        if (fixedMobileSlide || !shouldAutoAdvanceMobile) {
          return; // Don't change automatically if fixed as main or only 1 mobile image
        }
      }
      setDirection(1);
      setActive((prevIdx) => (prevIdx + 1) % totalSlides);
    }, 5500);

    return () => clearInterval(timer);
  }, [totalSlides, active, shouldAutoAdvanceMobile, fixedMobileSlide]);

  // Smoothly scroll active thumbnail into view
  useEffect(() => {
    const el = thumbnailRefs.current[active];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [active]);

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

  const current = displaySlides[active] ?? displaySlides[0];
  const mobileCurrent = fixedMobileSlide || current;
  const mobileOtherSlides = fixedMobileSlide
    ? displaySlides.filter((s) => s !== fixedMobileSlide)
    : displaySlides;

  const slideVariants = {
    enter: (d: number) => ({
      opacity: 0,
      x: d > 0 ? "4%" : "-4%",
      scale: 1.03,
      filter: "brightness(0.92)",
    }),
    center: {
      opacity: 1,
      x: "0%",
      scale: 1,
      filter: "brightness(1)",
      transition: {
        opacity: { duration: 0.75, ease: [0.25, 1, 0.35, 1] },
        x: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: 0.6, ease: "easeOut" },
      },
    },
    exit: (d: number) => ({
      opacity: 0,
      x: d > 0 ? "-3%" : "3%",
      scale: 0.98,
      filter: "brightness(0.88)",
      transition: {
        opacity: { duration: 0.6, ease: [0.32, 0, 0.67, 0] },
        x: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: 0.5, ease: "easeIn" },
      },
    }),
  };

  return (
    <>
      {/* ── MOBILE DESIGN: MAIN HERO BANNER + OTHER SLIDES IN 2-COLUMN CARDS ── */}
      <div className="block md:hidden w-full bg-[#0e0d0c] pt-16">
        {/* Main Featured Mobile Hero Image */}
        <div className="relative w-full h-[62vh] min-h-[420px] max-h-[640px] overflow-hidden bg-stone-950">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={fixedMobileSlide ? "fixed-mobile-hero" : active}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 h-full w-full will-change-transform"
            >
              <a
                href={mobileCurrent.to || "/shop"}
                className="block h-full w-full cursor-pointer focus:outline-none"
                aria-label="View mobile hero banner"
              >
                <img
                  src={getImageUrl(mobileCurrent.mobileBg || mobileCurrent.bg, { width: 1080, quality: 92 })}
                  alt="Main Mobile Hero"
                  loading="eager"
                  className="h-full w-full object-cover object-center"
                />
              </a>
            </motion.div>
          </AnimatePresence>

          {/* Ambient Overlays */}
          <div className="pointer-events-none absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-10" />
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

          {/* Mobile Carousel Indicators (shown only if carousel active with 2+ mobile images and not fixed) */}
          {shouldAutoAdvanceMobile && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {displaySlides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(dotIdx, dotIdx > active ? 1 : -1);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    dotIdx === active ? "w-4 bg-[#d97736]" : "w-1.5 bg-white/40"
                  )}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Destination Link Badge */}
          {mobileCurrent.to && (
            <a
              href={mobileCurrent.to || "/shop"}
              className="absolute bottom-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white border border-white/15 shadow-lg active:scale-95 transition-transform"
            >
              <span>Explore Collection</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#d97736]" />
            </a>
          )}
        </div>

        {/* Other Slides in Cards Under Main Image (1 row 2 images grid) */}
        {mobileOtherSlides.length > 0 && (
          <div className="w-full px-4 py-3.5 bg-[#0e0d0c] border-t border-white/10">
            <div className="flex items-center justify-between pb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Featured Collections
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                {mobileOtherSlides.length} Collections
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {mobileOtherSlides.map((slide, idx) => {
                const originalIdx = displaySlides.indexOf(slide);
                const isActive = !fixedMobileSlide && originalIdx === active;
                return (
                  <a
                    key={idx}
                    href={slide.to || "/shop"}
                    className={cn(
                      "group relative w-full aspect-[16/10] rounded-xl overflow-hidden border transition-all duration-200 text-left block active:scale-98",
                      isActive
                        ? "border-[#d97736] ring-2 ring-[#d97736]/40 shadow-md opacity-100"
                        : "border-white/15 opacity-80 hover:opacity-100 hover:border-white/30"
                    )}
                    aria-label={`View ${slide.title || `Collection ${idx + 1}`}`}
                  >
                    <img
                      src={getImageUrl(slide.mobileBg || slide.bg, { width: 500, quality: 85 })}
                      alt={`Slide ${idx + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover object-center select-none group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    {isActive && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-[#d97736]" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP DESIGN: SPLIT FLEX (TOP FULL-WIDTH HERO + BOTTOM NEXT IMAGES FLEXBOX WITH START/END WHITESPACE & BORDERS) ── */}
      <section
        ref={sectionRef}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="MOCS Hero Slideshow"
        className="hidden md:flex flex-col group relative w-full h-[100dvh] min-h-[600px] overflow-hidden bg-[#0e0d0c] outline-none select-none text-white"
      >
        {/* ── TOP AREA: MAIN HERO IMAGE (FULL WIDTH - NO BLANK SPACE) ── */}
        <div className="relative flex-1 w-full min-h-0 overflow-hidden bg-[#0e0d0c]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 h-full w-full will-change-transform"
            >
              <a
                href={current.to || "/shop"}
                className="block h-full w-full cursor-pointer focus:outline-none"
                aria-label="View hero banner"
              >
                <img
                  src={getImageUrl(current.bg, { width: 1920, quality: 95 })}
                  alt="Hero Banner"
                  loading="eager"
                  className="h-full w-full object-cover object-center"
                />
              </a>
            </motion.div>
          </AnimatePresence>

          {/* ── AMBIENT GRADIENT OVERLAYS ───────────────────────────────────── */}
          <div className="pointer-events-none absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/50 via-black/20 to-transparent z-10" />
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

          {/* ── PREV / NEXT ARROW BUTTONS ──────────────────────────────────── */}
          {totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous slide"
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-xl border border-white/15"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next slide"
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-xl border border-white/15"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* ── BOTTOM AREA: NEXT IMAGES FLEXBOX (BLACK BG, START/END SPACING, ZERO GAPS BETWEEN IMAGES) ── */}
        {totalSlides > 1 && (
          <div className="relative w-full flex-none z-30 bg-black flex items-stretch justify-stretch gap-0 py-0 px-8 sm:px-14 md:px-20 lg:px-28 m-0 h-20 sm:h-24 md:h-28 lg:h-32 overflow-hidden rounded-none border-t border-white/10">
            {displaySlides.map((slide, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={idx}
                  ref={(el) => {
                    thumbnailRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goTo(idx, idx > active ? 1 : -1);
                  }}
                  aria-label={`Switch to banner ${idx + 1}`}
                  className="group/thumb relative flex-1 h-full w-full p-0 m-0 cursor-pointer outline-none rounded-none border-0 overflow-hidden"
                >
                  {/* Thumbnail Image */}
                  <img
                    src={getImageUrl(slide.bg, { width: 600, quality: 85 })}
                    alt={`Thumbnail ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center rounded-none select-none"
                  />

                  {/* Dark overlay for inactive thumbnail */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-none transition-opacity duration-200 pointer-events-none",
                      isActive ? "bg-transparent opacity-0" : "bg-black/35 group-hover/thumb:bg-black/10"
                    )}
                  />

                  {/* Hover Underline (for inactive thumbnails) */}
                  {!isActive && (
                    <div className="absolute bottom-0 inset-x-0 h-1 sm:h-1.5 bg-white/50 scale-x-0 group-hover/thumb:scale-x-100 transition-transform duration-200 origin-center z-10" />
                  )}

                  {/* Active Orange Underline */}
                  {isActive && (
                    <motion.div
                      layoutId="activeHeroThumbnailLine"
                      className="absolute bottom-0 inset-x-0 h-1 sm:h-1.5 bg-[#d97736] shadow-[0_0_10px_#d97736] z-10 rounded-none"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
