import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";

export type Slide = {
  bg: string;
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  cta: string;
  to: string;
  mobileFocus?: "center" | "left" | "right";
  rightFocus?: boolean;
};

type CollageImage = { src: string; name: string };

export const DEFAULT_HERO_SLIDES: Slide[] = [
  {
    eyebrow: "PREMIUM COMFORT",
    title: "Step into",
    titleAccent: "Style",
    subtitle: "Premium footwear crafted for everyday movement and lasting comfort.",
    cta: "SHOP NOW",
    to: "/shop",
    bg: "/hero-comfort.jpg",
  },
  {
    eyebrow: "SUMMER ESSENTIALS",
    title: "Effortless",
    titleAccent: "Luxury",
    subtitle: "Handcrafted silhouette with cloud-soft footbed designed for all-day lightness.",
    cta: "EXPLORE NOW",
    to: "/shop",
    bg: "/hero-comfort-2.jpg",
  },
  {
    eyebrow: "SIGNATURE SERIES",
    title: "Modern Minimal",
    titleAccent: "Craft",
    subtitle: "Precision engineering meets ultra-refined aesthetic for modern living.",
    cta: "VIEW STYLES",
    to: "/shop",
    bg: "/hero-comfort.jpg",
  },
  {
    eyebrow: "NEW ARRIVALS",
    title: "Walk In",
    titleAccent: "Elegance",
    subtitle: "Timeless tones and supple materials that complement every outfit with confidence.",
    cta: "SHOP NEW IN",
    to: "/shop",
    bg: "/hero-comfort-2.jpg",
  },
];

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function HeroSkeleton() {
  return (
    <section className="relative h-[100dvh] min-h-[600px] md:min-h-[720px] w-full overflow-hidden bg-[#141210] text-white animate-pulse">
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-end md:justify-between px-6 sm:px-10 lg:px-16 pt-24 sm:pt-28 pb-20 sm:pb-16">
        <div className="hidden md:block" />
        <div className="max-w-xl space-y-4 sm:space-y-5 md:my-auto">
          <div className="h-3 w-32 rounded bg-stone-800" />
          <div className="h-14 sm:h-16 w-4/5 rounded bg-stone-800" />
          <div className="h-4 w-3/5 rounded bg-stone-800" />
          <div className="h-6 w-36 rounded bg-stone-800 pt-2" />
        </div>
        <div className="h-3 w-44 rounded bg-stone-800 pt-6 sm:pt-4" />
      </div>
    </section>
  );
}

// ─── Hero Component ──────────────────────────────────────────────────────────
export function Hero({
  slides = [],
  collageImages = [],
}: {
  slides?: Slide[];
  collageImages?: CollageImage[];
}) {
  const activeSlides = slides && slides.length > 1 ? slides : DEFAULT_HERO_SLIDES;
  const totalSlides = activeSlides.length;

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const sectionRef = useRef<HTMLElement>(null);

  // Preload all slide images on mount for instant, flicker-free crossfades
  useEffect(() => {
    if (typeof window === "undefined") return;
    activeSlides.forEach((slide) => {
      if (slide.bg) {
        const img = new window.Image();
        img.src = getImageUrl(slide.bg, { width: 1920, quality: 92 });
      }
    });
  }, [activeSlides]);

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

  // Guaranteed continuous auto-advance every 5 seconds
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

  // Touch swipe
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStart.current = null;
  };

  const current = activeSlides[active] ?? activeSlides[0];

  // Helper to separate title into main text & italic accent if not explicitly split
  const renderTitle = () => {
    let firstPart = "";
    let accentPart = "";

    if (current.titleAccent) {
      firstPart = current.title;
      accentPart = current.titleAccent;
    } else {
      const trimmed = (current.title || "Step Into Comfort.").trim();
      const parts = trimmed.split(/\s+/);
      if (parts.length > 1) {
        accentPart = parts.pop() || "";
        firstPart = parts.join(" ");
      } else {
        firstPart = trimmed;
      }
    }

    return (
      <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-[80px] xl:text-[88px] font-normal leading-[1.03] tracking-[-0.02em] text-white">
        <span className="block">{firstPart}</span>
        {accentPart && (
          <span className="italic font-serif text-[#d96b27] dark:text-[#e07a38] block mt-1.5">
            {accentPart}
          </span>
        )}
      </h1>
    );
  };

  // Cinematic Background Image Animation
  const imageVariants = {
    enter: (d: number) => ({
      opacity: 0,
      scale: 1.08,
      x: d > 0 ? 15 : -15,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        opacity: { duration: 0.85, ease: "easeOut" },
        scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        x: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
      },
    },
    exit: (d: number) => ({
      opacity: 0,
      scale: 0.97,
      x: d > 0 ? -15 : 15,
      transition: {
        opacity: { duration: 0.65, ease: "easeIn" },
        scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        x: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
      className="relative h-[100dvh] min-h-[600px] md:min-h-[720px] w-full overflow-hidden bg-[#141210] text-white outline-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── FULL-HEIGHT BACKGROUND SLIDE IMAGE WITH CROSSFADE ─────────────── */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={active}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 h-full w-full select-none pointer-events-none will-change-transform"
        >
          <img
            src={getImageUrl(current.bg, { width: 1920, quality: 92 })}
            alt={current.title}
            loading="eager"
            className={cn(
              "h-full w-full object-cover select-none",
              current.mobileFocus === "left"
                ? "object-left"
                : current.mobileFocus === "right"
                ? "object-right"
                : "object-[70%_center] md:object-center"
            )}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── LUXURY DARK GRADIENT OVERLAYS ─────────────────────────────────── */}
      {/* Mobile Dark Gradient Overlay to ensure maximum contrast and match mockup */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#141210] via-[#141210]/85 via-55% to-[#141210]/35 pointer-events-none z-10" />

      {/* Desktop/Tablet Left Side Rich Shadow (feathers to image on right) */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#141210] via-[#141210]/90 md:via-[#141210]/75 via-45% to-transparent pointer-events-none z-10" />

      {/* Top subtle fade for navbar contrast */}
      <div className="absolute top-0 inset-x-0 h-32 md:h-36 bg-gradient-to-b from-[#141210]/70 md:from-[#141210]/80 to-transparent pointer-events-none z-10" />

      {/* Bottom grounding vignette */}
      <div className="absolute bottom-0 inset-x-0 h-28 md:h-36 bg-gradient-to-t from-[#141210]/70 md:from-[#141210]/80 to-transparent pointer-events-none z-10" />

      {/* ── FULL-HEIGHT HERO FOREGROUND CONTENT ───────────────────────────── */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 pt-24 sm:pt-28 pb-20 sm:pb-16 flex flex-col justify-end md:justify-between h-full bg-transparent">
        {/* Top spacer for navbar breathing room on desktop */}
        <div className="hidden md:block" />

        {/* Center/Main text presentation with staggered entry */}
        <div className="md:my-auto max-w-xl lg:max-w-2xl py-4 sm:py-6 bg-transparent">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="space-y-4 sm:space-y-5 md:space-y-6 text-left bg-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
            >
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: direction > 0 ? 12 : -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs sm:text-xs font-bold uppercase tracking-[0.22em] sm:tracking-[0.28em] text-[#e08a5c] [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)]"
              >
                {current.eyebrow || "PREMIUM COMFORT"}
              </motion.p>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: direction > 0 ? 20 : -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="[text-shadow:_0_3px_20px_rgba(0,0,0,0.85)]"
              >
                {renderTitle()}
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: direction > 0 ? 14 : -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-base md:text-[17px] leading-relaxed text-stone-300 font-light max-w-[300px] sm:max-w-md [text-shadow:_0_2px_10px_rgba(0,0,0,0.85)]"
              >
                {current.subtitle ||
                  "Premium footwear crafted for everyday movement and lasting comfort."}
              </motion.p>

              {/* CTA Link */}
              <motion.div
                initial={{ opacity: 0, y: direction > 0 ? 12 : -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="pt-2 sm:pt-4"
              >
                <a
                  href={current.to || "/shop"}
                  className="group inline-flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.22em] text-white uppercase transition-colors duration-200 border-b border-white pb-1 hover:border-[#e08a5c] hover:text-[#e08a5c] [text-shadow:_0_2px_10px_rgba(0,0,0,0.8)]"
                >
                  <span>{current.cta || "SHOP NOW"}</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── BOTTOM SLIDE INDICATOR (01 ─── 04) ──────────────────────────── */}
        <div className="pt-6 sm:pt-4">
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono tracking-widest text-stone-400 select-none">
            <span className="text-stone-300 font-medium text-xs">
              {String(active + 1).padStart(2, "0")}
            </span>

            <div
              className="relative w-20 sm:w-36 h-[2px] bg-stone-700/80 rounded-full overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                const targetIdx = Math.min(
                  totalSlides - 1,
                  Math.floor(ratio * totalSlides)
                );
                goTo(targetIdx, targetIdx > active ? 1 : -1);
              }}
              role="slider"
              aria-valuemin={1}
              aria-valuemax={totalSlides}
              aria-valuenow={active + 1}
              aria-label="Slide progress bar"
              tabIndex={0}
            >
              <div
                className="absolute top-0 left-0 bottom-0 bg-[#e08a5c] transition-all duration-700 ease-out rounded-full"
                style={{
                  width: `${((active + 1) / totalSlides) * 100}%`,
                }}
              />
            </div>

            <span className="text-stone-500 text-xs">
              {String(totalSlides).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

