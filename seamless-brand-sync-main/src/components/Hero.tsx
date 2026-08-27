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
    eyebrow: "NEW COLLECTION",
    title: "Step Into",
    titleAccent: "Comfort.",
    subtitle: "Premium footwear crafted for everyday movement, effortless style, and lasting comfort.",
    cta: "SHOP COLLECTION",
    to: "/shop",
    bg: "/hero-comfort.jpg",
  },
  {
    eyebrow: "SUMMER ESSENTIALS",
    title: "Effortless",
    titleAccent: "Luxury.",
    subtitle: "Handcrafted silhouette with cloud-soft footbed designed for all-day lightness.",
    cta: "EXPLORE NOW",
    to: "/shop",
    bg: "/hero-comfort-2.jpg",
  },
  {
    eyebrow: "SIGNATURE SERIES",
    title: "Modern Minimal",
    titleAccent: "Craft.",
    subtitle: "Precision engineering meets ultra-refined aesthetic for modern living.",
    cta: "VIEW STYLES",
    to: "/shop",
    bg: "/hero-comfort.jpg",
  },
  {
    eyebrow: "NEW ARRIVALS",
    title: "Walk In",
    titleAccent: "Elegance.",
    subtitle: "Timeless tones and supple materials that complement every outfit with confidence.",
    cta: "SHOP NEW IN",
    to: "/shop",
    bg: "/hero-comfort-2.jpg",
  },
];

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function HeroSkeleton() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-[#141210] text-white animate-pulse">
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-between px-6 sm:px-10 lg:px-16 pt-28 pb-16">
        <div className="hidden md:block" />
        <div className="max-w-xl space-y-5 my-auto">
          <div className="h-3 w-32 rounded bg-stone-800" />
          <div className="h-16 w-4/5 rounded bg-stone-800" />
          <div className="h-4 w-3/5 rounded bg-stone-800" />
          <div className="h-6 w-40 rounded bg-stone-800 pt-2" />
        </div>
        <div className="h-3 w-44 rounded bg-stone-800" />
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
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;
  const totalSlides = activeSlides.length;

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

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

  // Auto-advance
  useEffect(() => {
    if (totalSlides <= 1 || paused || prefersReduced) return;
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [totalSlides, paused, prefersReduced, next]);

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
    if (current.titleAccent) {
      return (
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[88px] font-normal leading-[1.03] tracking-[-0.02em] text-white">
          <span className="block">{current.title}</span>
          <span className="italic font-serif text-[#d96b27] dark:text-[#e07a38] block mt-1.5">
            {current.titleAccent}
          </span>
        </h1>
      );
    }

    // If title contains multiple words, italicize the last word
    const parts = (current.title || "Step Into Comfort.").trim().split(" ");
    if (parts.length > 1) {
      const lastWord = parts.pop();
      const firstPart = parts.join(" ");
      return (
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[88px] font-normal leading-[1.03] tracking-[-0.02em] text-white">
          <span className="block">{firstPart}</span>
          <span className="italic font-serif text-[#d96b27] dark:text-[#e07a38] block mt-1.5">
            {lastWord}
          </span>
        </h1>
      );
    }

    return (
      <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[88px] font-normal leading-[1.03] tracking-[-0.02em] text-white">
        {current.title}
      </h1>
    );
  };

  const textVariants = {
    enter: (d: number) => ({
      opacity: 0,
      y: d > 0 ? 24 : -24,
    }),
    center: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (d: number) => ({
      opacity: 0,
      y: d > 0 ? -24 : 24,
      transition: {
        duration: prefersReduced ? 0 : 0.35,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const imageVariants = {
    enter: () => ({
      opacity: 0,
      scale: 1.04,
    }),
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReduced ? 0 : 0.9,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: () => ({
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: prefersReduced ? 0 : 0.5,
        ease: [0.25, 1, 0.5, 1],
      },
    }),
  };

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
      className="relative h-screen min-h-[640px] md:min-h-[720px] w-full overflow-hidden bg-[#141210] text-white outline-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── FULL-HEIGHT BACKGROUND SLIDE IMAGE WITH CROSSFADE ─────────────── */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={active}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 h-full w-full select-none pointer-events-none"
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
      {/* Desktop/Tablet Left Side Rich Shadow (feathers to image on right, fully transparent on mobile) */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#141210] via-[#141210]/90 md:via-[#141210]/75 via-45% to-transparent pointer-events-none z-10" />
      {/* Top subtle fade for navbar contrast */}
      <div className="absolute top-0 inset-x-0 h-32 md:h-36 bg-gradient-to-b from-[#141210]/60 md:from-[#141210]/80 to-transparent pointer-events-none z-10" />
      {/* Bottom grounding vignette */}
      <div className="absolute bottom-0 inset-x-0 h-28 md:h-36 bg-gradient-to-t from-[#141210]/60 md:from-[#141210]/80 to-transparent pointer-events-none z-10" />

      {/* ── FULL-HEIGHT HERO FOREGROUND CONTENT ───────────────────────────── */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16 pt-24 sm:pt-28 pb-12 sm:pb-16 flex flex-col justify-between h-full bg-transparent">
        {/* Top spacer for navbar breathing room */}
        <div className="hidden md:block" />

        {/* Center/Main text presentation */}
        <div className="my-auto max-w-xl lg:max-w-2xl py-6 bg-transparent">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-5 sm:space-y-6 text-left bg-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
            >
              {/* Eyebrow */}
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-[#d96b27] dark:text-[#e07a38] [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)]">
                {current.eyebrow || "NEW COLLECTION"}
              </p>

              {/* Title */}
              <div className="[text-shadow:_0_3px_20px_rgba(0,0,0,0.85)]">
                {renderTitle()}
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-[17px] leading-relaxed text-stone-200 sm:text-stone-300 font-light max-w-md [text-shadow:_0_2px_10px_rgba(0,0,0,0.85)]">
                {current.subtitle ||
                  "Premium footwear crafted for everyday movement, effortless style, and lasting comfort."}
              </p>

              {/* CTA Link */}
              <div className="pt-3 sm:pt-4">
                <a
                  href={current.to || "/shop"}
                  className="group inline-flex items-center gap-3 text-xs sm:text-sm font-bold tracking-[0.22em] text-white uppercase transition-colors duration-200 border-b border-white/60 pb-1.5 hover:border-[#d96b27] hover:text-[#d96b27] [text-shadow:_0_2px_10px_rgba(0,0,0,0.8)]"
                >
                  <span>{current.cta || "SHOP COLLECTION"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── BOTTOM SLIDE INDICATOR (01 ─── 04) ──────────────────────────── */}
        <div className="pt-4">
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono tracking-widest text-stone-400 select-none">
            <span className="text-white font-medium text-xs">
              {String(active + 1).padStart(2, "0")}
            </span>

            <div
              className="relative w-24 sm:w-36 h-[2px] bg-stone-700/80 rounded-full overflow-hidden cursor-pointer"
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
                className="absolute top-0 left-0 bottom-0 bg-[#d96b27] transition-all duration-500 ease-out rounded-full"
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
