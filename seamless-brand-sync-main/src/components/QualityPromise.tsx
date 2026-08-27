import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getImageUrl as resolveImage } from "@/lib/utils";
import { OptimizedImage } from "@/components/OptimizedImage";

const DEFAULT_COLLAGE = [
  { bg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800" },
  { bg: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800" },
  { bg: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800" },
  { bg: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800" },
  { bg: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800" },
  { bg: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800" },
];

export function QualityPromise({ collage }: { collage?: any[] }) {
  const collageList = collage && collage.length > 0 ? collage : DEFAULT_COLLAGE;

  const getImageUrl = (idx: number) => {
    if (!collageList || collageList.length === 0) return "";
    const item = collageList[idx % collageList.length];
    if (!item || !item.bg) return "";
    return resolveImage(item.bg);
  };

  return (
    <section
      className="relative overflow-hidden h-[90vh] w-full flex items-center justify-center text-white bg-[#0B0A0A]"
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      {/* Viewport-Fixed Background Grid Collage filled completely edge-to-edge with light blur */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-100 select-none flex items-center justify-center bg-[#0B0A0A]"
      >
        <div className="grid grid-cols-12 grid-rows-12 gap-2 w-full h-full bg-[#0B0A0A]">
          {/* Frame 1: Top-Left (Vertical, col 1-3, row 1-7) */}
          <div className="col-span-3 row-span-7 overflow-hidden bg-stone-900">
            {getImageUrl(0) && (
              <OptimizedImage
                src={getImageUrl(0)}
                alt=""
                sizes="25vw"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover blur-[1.5px] scale-105"
              />
            )}
          </div>

          {/* Frame 2: Top-Middle (Tall Vertical, col 4-8, row 1-7) */}
          <div className="col-span-5 row-span-7 overflow-hidden bg-stone-900">
            {getImageUrl(1) && (
              <OptimizedImage
                src={getImageUrl(1)}
                alt=""
                sizes="40vw"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover blur-[1.5px] scale-105"
              />
            )}
          </div>

          {/* Frame 3: Top-Right (Medium Vertical, col 9-12, row 1-7) */}
          <div className="col-span-4 row-span-7 overflow-hidden bg-stone-900">
            {getImageUrl(2) && (
              <OptimizedImage
                src={getImageUrl(2)}
                alt=""
                sizes="35vw"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover blur-[1.5px] scale-105"
              />
            )}
          </div>

          {/* Frame 4: Bottom-Left (Wide Horizontal, col 1-5, row 8-12) */}
          <div className="col-span-5 row-span-5 col-start-1 row-start-8 overflow-hidden bg-stone-900">
            {getImageUrl(3) && (
              <OptimizedImage
                src={getImageUrl(3)}
                alt=""
                sizes="40vw"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover blur-[1.5px] scale-105"
              />
            )}
          </div>

          {/* Frame 5: Bottom-Middle (Medium Vertical, col 6-9, row 8-12) */}
          <div className="col-span-4 row-span-5 col-start-6 row-start-8 overflow-hidden bg-stone-900">
            {getImageUrl(4) && (
              <OptimizedImage
                src={getImageUrl(4)}
                alt=""
                sizes="35vw"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover blur-[1.5px] scale-105"
              />
            )}
          </div>

          {/* Frame 6: Bottom-Right (Small, col 10-12, row 8-12) */}
          <div className="col-span-3 row-span-5 col-start-10 row-start-8 overflow-hidden bg-stone-900">
            {getImageUrl(5) && (
              <OptimizedImage
                src={getImageUrl(5)}
                alt=""
                sizes="25vw"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover blur-[1.5px] scale-105"
              />
            )}
          </div>
        </div>
        {/* Dark overlay for contrast and image blending with an orange wash */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-00/20 via-transparent to-orange-500/10 pointer-events-none z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-primary/25 blur-[100px] sm:blur-[150px] pointer-events-none z-10" />
      </div>

      {/* Center-aligned content container directly overlaying the collage background */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 z-20 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="bg-black/55 border border-orange-700/50 backdrop-blur-xl p-8 sm:p-12 rounded-3xl max-w-3xl mx-auto shadow-[0_0_55px_rgba(194,65,12,0.45)] space-y-6">
          <Reveal delay={0.1}>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-[#d96b27] dark:text-[#e07a38]">
              Engineered Excellence
            </p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight text-white max-w-2xl mx-auto tracking-[-0.015em]">
              MOCS <span className="italic font-serif text-[#d96b27] dark:text-[#e07a38]">Footwear.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-sm md:text-base leading-relaxed text-stone-200/90 font-medium max-w-2xl mx-auto">
              Every pair is crafted with premium Polyurethane (PU), utilizing advanced direct injection molding for lightweight durability. We design for comfort, certify for standards, and engineer to keep you moving — different.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:brightness-110 shadow-md hover:shadow-orange-500/20"
              >
                Explore the collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs font-bold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-white/10 hover:border-primary/50 hover:text-primary"
              >
                About
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
