import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import { Reveal } from "@/components/Reveal";

interface Review {
  name: string;
  text: string;
  rating: number;
}

interface ReviewsMarqueeProps {
  reviews: Review[];
}

export function ReviewsMarquee({ reviews }: ReviewsMarqueeProps) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobileMarquee = windowWidth < 768;
  const marqueeX = isMobileMarquee ? -1096 : -1376;
  const marqueeDuration = isMobileMarquee ? 12 : 25;

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="mx-auto py-12 sm:py-16 overflow-hidden w-full text-left bg-background">
      <Reveal className="mb-10 text-center px-4">
        <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-[#d96b27] dark:text-[#e07a38]">
          Customer Stories
        </p>
        <h2 className="mt-1.5 font-display text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-foreground leading-[1.15]">
          Loved by our <span className="text-[#d96b27] dark:text-[#e07a38]">Community</span>
        </h2>
      </Reveal>
      <div className="relative flex w-full overflow-x-hidden py-4">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background via-background/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background via-background/60 to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: [0, marqueeX] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: marqueeDuration,
          }}
          className="flex gap-6 whitespace-nowrap flex-nowrap"
        >
          {[...reviews, ...reviews, ...reviews].map((r, i) => (
            <div
              key={i}
              className="inline-flex flex-col min-w-[260px] max-w-[260px] sm:min-w-[300px] sm:max-w-[300px] lg:min-w-[340px] lg:max-w-[340px] min-h-[220px] sm:min-h-[230px] lg:min-h-[240px] whitespace-normal rounded-2xl lg:rounded-3xl border border-border bg-card p-4 lg:p-6 shadow-soft transition hover:border-primary/20"
            >
              {/* Stars — always at top */}
              <div className="flex gap-0.5 shrink-0">
                {Array.from({ length: r.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              {/* Review text — grows to fill remaining space */}
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
              {/* Author — always pinned to bottom */}
              <div className="mt-4 flex items-center gap-3 shrink-0 border-t border-border/50 pt-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                  {r.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">{r.name}</p>
                  <p className="text-xs text-success font-semibold">Verified purchase</p>
                </div>
              </div>
            </div>

          ))}
        </motion.div>
      </div>
    </section>
  );
}
